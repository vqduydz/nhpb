import dotenv from 'dotenv';
import { unlink } from 'node:fs/promises';
import path from 'path';
import db from '../models';
import multer from 'multer';
import sharp from 'sharp';
const xlsx = require('xlsx');
dotenv.config();
const Menu = db.Menu;

const createMenu = async (req, res) => {
  try {
    const { name, slug, catalog, catalogSlug, price, unit, image_url, thumb_url, poster_url, desc } = req.body;
    // Tìm kiếm Menu trong database
    const menu = await Menu.findOne({ where: { slug } });

    // Kiểm tra xem email của menu có tồn tại không
    if (menu) {
      return res.status(422).json({ errorMessage: 'Menu already exists' });
    }

    await Menu.create({
      name,
      slug,
      catalog,
      catalogSlug,
      price,
      unit,
      image_url,
      thumb_url,
      poster_url,
      desc,
    });

    return res.status(200).json({ message: 'Menu created successfully' });
  } catch (error) {
    console.log('37----,', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const getMenu = async (req, res) => {
  try {
    const { slug } = req.params;
    const imagePath = req.protocol + '://' + req.get('host') + '/v1/api/images/';
    if (slug) {
      const menu = await Menu.findOne({ where: { slug }, raw: true });
      if (!menu) {
        return res.status(404).json({ errorMessage: 'Menu does not exist' });
      }

      return res.status(200).json({ ...menu, imagePath });
    }
    const menu = await Menu.findAll();
    return res.status(200).json({ menu, imagePath });
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const updateMenuById = async (req, res) => {
  const dataUpdate = req.body;
  try {
    const menu = await Menu.findOne({ where: { id: dataUpdate.id } });
    if (!menu) {
      return res.status(404).json({ errorMessage: 'Menu does not exist' });
    }
    const { id, ...data } = dataUpdate;
    await menu.set(data);
    await menu.save();
    return res.status(200).json({ message: 'Menu updated successfully' });
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const deleteMenuById = async (req, res) => {
  try {
    const { id } = req.body;
    const menu = await Menu.findOne({ where: { id } });
    if (!menu) {
      return res.status(404).json({ errorMessage: 'Menu does not exist' });
    }

    const imageNames = [menu.image_url, menu.thumb_url, menu.poster_url]; // Danh sách tên các file cần xóa được gửi trong body của request
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

    await menu.destroy();
    return res.status(200).json({
      message: delIamgeNoti
        ? 'images deleted, Menu deleted successfully'
        : 'Failed to delete image, Menu deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ error, errorMessage: 'Server error' });
  }
};

const importMenus = async (req, res) => {
  try {
    const file = req.file;
    // Kiểm tra nếu không có file hoặc file không đúng định dạng
    if (!file) {
      return res.status(400).json({ error: 'Invalid file' });
    }

    // Đọc dữ liệu từ file Excel
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    // kiểm tra trùng dữ liệu
    const existingSlugs = await Menu.findAll({ attributes: ['slug'] });
    const existingSlugSet = new Set(existingSlugs.map((menu) => menu.slug));
    // lọc dữ liệu trùng lặp
    const newData = data.filter((row) => !existingSlugSet.has(row.slug));

    // Lưu vào database
    Menu.bulkCreate(newData)
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

export default { createMenu, getMenu, updateMenuById, deleteMenuById, importMenus };
