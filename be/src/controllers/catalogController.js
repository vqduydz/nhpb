import dotenv from 'dotenv';
import { unlink } from 'node:fs/promises';
import path from 'path';
import db from '../models';
import { renameImg } from '../feature/renameImg';
const xlsx = require('xlsx');
dotenv.config();
const Catalog = db.Catalog;
const Menu = db.Menu;

const createCatalog = async (req, res) => {
  try {
    const { name, slug, image_url } = req.body;
    const catalog = await Catalog.findOne({ where: { slug } });
    if (catalog) {
      return res.status(422).json({ errorMessage: 'Catalog already exists' });
    }
    await Catalog.create({
      name,
      slug,
      image_url,
    });
    return res.status(200).json({ message: 'Catalog created successfully' });
  } catch (error) {
    console.log('33___', error);
    return res.status(500).json({ error, errorMessage: 'Server error' });
  }
};

const getCatalog = async (req, res) => {
  try {
    const catalogs = await Catalog.findAll({
      order: [['id', 'ASC']],
    });
    const catalogSlugs = catalogs.map((catalog) => catalog.slug);
    const menus = await Menu.findAll({
      where: {
        catalogSlug: catalogSlugs,
      },
      order: [['id', 'ASC']],
    });
    const catalogsWithMenus = catalogs.map((catalog) => {
      const catalogMenus = menus.filter((menu) => menu.catalogSlug === catalog.slug);
      return { ...catalog.toJSON(), menus: catalogMenus };
    });
    const imagePath = req.protocol + '://' + req.get('host') + '/v1/api/images/';
    return res.status(200).json({ catalogsWithMenus, catalogs, imagePath });
  } catch (error) {
    console.log('63---,', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const updateCatalogById = async (req, res) => {
  try {
    const dataUpdate = req.body;
    const catalog = await Catalog.findOne({ where: { id: dataUpdate.id } });
    if (!catalog) {
      return res.status(404).json({ errorMessage: 'Catalog does not exist' });
    }
    const { id, ...data } = dataUpdate;
    if (dataUpdate.name !== catalog.name) {
      const menus = await Menu.findAll({ where: { catalog: catalog.name } });
      menus.forEach(async (m) => {
        const { id, data } = m;
        const menu = await Menu.findOne({ where: { id } });
        const newMenuData = { ...data, catalog: dataUpdate.name, catalogSlug: dataUpdate.slug };
        await menu.set(newMenuData);
        await menu.save();
      });

      renameImg(catalog.image_url, dataUpdate.image_url).then(async (result) => {
        if (!result) {
          return res.status(500).json({ message: 'Error renaming' });
        }
        await catalog.set(data);
        await catalog.save();
        return res.status(200).json({ message: 'Catalog updated successfully' });
      });
    } else {
      await catalog.set(data);
      await catalog.save();
      return res.status(200).json({ message: 'Catalog updated successfully' });
    }
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const deleteCatalogById = async (req, res) => {
  try {
    const { id } = req.body;
    const catalog = await Catalog.findOne({ where: { id } });
    if (!catalog) {
      return res.status(404).json({ errorMessage: 'Catalog does not exist' });
    }
    const imagePath = path.join(__dirname, '../../uploads', catalog.image_url);
    await unlink(imagePath);
    await catalog.destroy();
    return res.status(200).json({
      message: 'images deleted, Menu deleted successfully',
    });
  } catch (error) {
    console.log('113---', error);
    return res.status(500).json({ error, errorMessage: 'Server error' });
  }
};

const importCatalogs = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Invalid file' });
    }
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[1]];
    const data = xlsx.utils.sheet_to_json(sheet);
    const existingSlugs = await Catalog.findAll({ attributes: ['slug'] });
    const existingSlugSet = new Set(existingSlugs.map((catalog) => catalog.slug));
    const newData = data.filter((row) => !existingSlugSet.has(row.slug));
    Catalog.bulkCreate(newData)
      .then(() => {
        res.status(200).json({ message: 'Import successful' });
      })
      .catch((error) => {
        console.error('Import failed:', error);
        res.status(500).json({ error: 'Import failed' });
      });
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ error: 'Failed to import data.' });
  }
};

export default { createCatalog, getCatalog, updateCatalogById, deleteCatalogById, importCatalogs };
