import dotenv from 'dotenv';
import { unlink } from 'node:fs/promises';
import db, { sequelize } from '../models';
import path from 'path';
import multer from 'multer';
import sharp from 'sharp';
const xlsx = require('xlsx');
dotenv.config();
const FeedBack = db.FeedBack;
const Menu = db.Menu;

const createFeedBack = async (req, res) => {
  try {
    const { token } = req.params;
    const { user_id, menu_id, point, content } = req.body;
    // Tìm kiếm Menu trong database
    const feedBack = await FeedBack.findOne({ where: { token, menu_id } });

    // Kiểm tra xem email của FeedBack có tồn tại không
    if (feedBack) {
      return res.status(422).json({ errorMessage: 'FeedBack already exists' });
    }

    await FeedBack.create({ user_id, menu_id, point, content, token });

    return res.status(200).json({ message: 'FeedBack created successfully' });
  } catch (error) {
    console.log('28----', error);
    return res.status(500).json({ error, errorMessage: 'Server error' });
  }
};

const getFeedBack = async (req, res) => {
  try {
    const feedBacks = await FeedBack.findAll({
      order: [['id', 'ASC']],
    });

    // Lấy danh sách slug của các feedBacks
    const feedBackSlugs = feedBacks.map((feedBack) => feedBack.slug);

    // Lấy danh sách menu theo các slug của feedBacks
    const menus = await Menu.findAll({
      where: {
        feedBackSlug: feedBackSlugs,
      },
      order: [['id', 'ASC']],
    });

    const feedBacksWithMenus = feedBacks.map((feedBack) => {
      const feedBackMenus = menus.filter((menu) => menu.feedBackSlug === feedBack.slug);
      return { ...feedBack.toJSON(), menus: feedBackMenus };
    });

    const imagePath = req.protocol + '://' + req.get('host') + '/v1/api/images/';
    return res.status(200).json({ feedBacks, feedBacksWithMenus, imagePath, feedBackSlugs, menus });
  } catch (error) {
    console.log('58----', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const updateFeedBackById = async (req, res) => {
  const dataUpdate = req.body;
  try {
    const feedBack = await FeedBack.findOne({ where: { id: dataUpdate.id } });
    if (!feedBack) {
      return res.status(404).json({ errorMessage: 'FeedBack does not exist' });
    }
    const { id, ...data } = dataUpdate;
    await feedBack.set(data);
    await feedBack.save();
    return res.status(200).json({ message: 'FeedBack updated successfully' });
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const deleteFeedBackById = async (req, res) => {
  try {
    const { id } = req.body;
    const feedBack = await FeedBack.findOne({ where: { id } });
    if (!feedBack) {
      return res.status(404).json({ errorMessage: 'FeedBack does not exist' });
    }

    const imageNames = [feedBack.image_url, feedBack.thumb_url, feedBack.poster_url]; // Danh sách tên các file cần xóa được gửi trong body của request
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
    await feedBack.destroy();
    return res.status(200).json({
      message: delIamgeNoti
        ? 'images deleted, FeedBack deleted successfully'
        : 'Failed to delete image, FeedBack deleted successfully',
    });
  } catch (error) {
    console.log('107---', error);
    return res.status(500).json({ error, errorMessage: 'Server error' });
  }
};

export default { createFeedBack, getFeedBack, updateFeedBackById, deleteFeedBackById };
