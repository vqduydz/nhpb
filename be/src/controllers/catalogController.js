import dotenv from 'dotenv';
import { unlink } from 'node:fs/promises';
import path from 'path';
import db from '../models';
const xlsx = require('xlsx');
dotenv.config();
const Catalog = db.Catalog;
const Menu = db.Menu;

const createCatalog = async (req, res) => {
  try {
    const { name, slug, image_url, thumb_url, poster_url } = req.body;
    // Tìm kiếm Menu trong database
    const catalog = await Catalog.findOne({ where: { slug } });

    // Kiểm tra xem email của Catalog có tồn tại không
    if (catalog) {
      return res.status(422).json({ errorMessage: 'Catalog already exists' });
    }

    await Catalog.create({
      name,
      slug,
      image_url,
      thumb_url,
      poster_url,
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

    // Lấy danh sách slug của các catalogs
    const catalogSlugs = catalogs.map((catalog) => catalog.slug);

    // Lấy danh sách menu theo các slug của catalogs
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
    return res.status(200).json({ catalogsWithMenus, imagePath });
  } catch (error) {
    console.log('63---,', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const updateCatalogById = async (req, res) => {
  const dataUpdate = req.body;
  try {
    const catalog = await Catalog.findOne({ where: { id: dataUpdate.id } });
    if (!catalog) {
      return res.status(404).json({ errorMessage: 'Catalog does not exist' });
    }
    const { id, ...data } = dataUpdate;
    await catalog.set(data);
    await catalog.save();
    return res.status(200).json({ message: 'Catalog updated successfully' });
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

    // Danh sách tên các file cần xóa được gửi trong body của request
    const imageNames = [catalog.image_url, catalog.thumb_url, catalog.poster_url];
    // Duyệt qua danh sách các tên file và xóa từng file
    let delIamgeNoti = [];
    imageNames.map((imageName) => {
      const imagePath = path.join(__dirname, '../../uploads', imageName);
      unlink(imagePath)
        .then(() => {
          delIamgeNoti.push(true);
        })
        .catch(() => {
          delIamgeNoti.push(false);
        });
    });
    await catalog.destroy();
    return res.status(200).json({
      message: delIamgeNoti
        ? 'images deleted, Catalog deleted successfully'
        : 'Failed to delete image, Catalog deleted successfully',
    });
  } catch (error) {
    console.log('113---', error);
    return res.status(500).json({ error, errorMessage: 'Server error' });
  }
};

const importCatalogs = async (req, res) => {
  try {
    const file = req.file;
    // Kiểm tra nếu không có file hoặc file không đúng định dạng
    if (!file) {
      return res.status(400).json({ error: 'Invalid file' });
    }

    // Đọc dữ liệu từ file Excel
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[1]];
    const data = xlsx.utils.sheet_to_json(sheet);

    // kiểm tra trùng dữ liệu
    const existingSlugs = await Catalog.findAll({ attributes: ['slug'] });
    const existingSlugSet = new Set(existingSlugs.map((catalog) => catalog.slug));
    // lọc dữ liệu trùng lặp
    const newData = data.filter((row) => !existingSlugSet.has(row.slug));

    // Lưu vào database
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
