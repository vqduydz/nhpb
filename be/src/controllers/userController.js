import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import db from '../models';
import { io } from '../server';

var salt = bcrypt.genSaltSync(10);
dotenv.config();
const User = db.User;

const getToken = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Tìm kiếm user trong database
    const user = await User.findOne({ where: { email: email } });
    // Kiểm tra xem email của user có tồn tại không
    if (!user) {
      return res.status(401).json({ errorMessage: 'Invalid email' });
    }
    // Kiểm tra xem password của user có đúng không
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ errorMessage: 'Invalid password' });
    }
    // Tạo JSON Web Token cho user

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );
    // Trả về token cho user
    return res.json({ token });
  } catch (error) {
    console.log('39---', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const handleLogin = async (req, res) => {
  const { id } = req.user;
  const user = await User.findOne({ where: { id }, attributes: { exclude: ['password'] } });
  const currentUser = jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      place: user.place,
      avatar: user.avatar,
      birthday: user.birthday,
      position: user.position,
    },
    process.env.JWT_SECRET,
  );
  return res.status(200).json({ currentUser, message: 'login successfully' });
};

const createUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, phoneNumber, gender, place, avatar } = req.body;

    // Tìm kiếm user trong database
    const user = await User.findOne({ where: { email } });

    // Kiểm tra xem email của user có tồn tại không
    if (user) {
      return res.status(422).json({ errorMessage: 'Email already exists' });
    }

    // hash password
    let hashPass = await bcrypt.hashSync(password, salt);

    await User.create({
      email,
      password: hashPass,
      firstName,
      lastName,
      role,
      phoneNumber,
      gender,
      place,
      avatar,
    });

    return res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    console.log('104----,', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ errorMessage: 'Invalid email' });
    }

    // generate token and save it to user's resetToken field
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.token = token;
    user.tokenExpires = Date.now() + 3600000;
    await user.save();

    // send email with reset password link
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const resetPasswordLink = `${req.headers.referer}reset-password/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: user.email,
      subject: 'Password reset - Đặt lại mật khẩu',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\nPlease click on the following link, or paste this into your browser to complete the process:\n${resetPasswordLink} \nIf you did not request this, please ignore this email and your password will remain unchanged.\n_______________________________________\n\nBạn nhận được thông báo này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn.\nVui lòng nhấp vào liên kết sau hoặc dán nó vào trình duyệt của bạn để hoàn tất quy trình:\n${resetPasswordLink} \nNếu bạn đã không yêu cầu điều này, vui lòng bỏ qua email này và mật khẩu của bạn sẽ không thay đổi.\n`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.status(500).json({ errorMessage: 'Failed to send email' });
      } else {
        return res.status(200).json({ message: `An email has been sent to ${user.email} with further instructions.` });
      }
    });
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ errorMessage: 'Invalid email' });
    }

    if (user.token !== token || !user.tokenExpires || user.tokenExpires <= new Date()) {
      return res.status(400).json({ errorMessage: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(password, salt);
    const dataUpdate = { password: hashedPassword, token: null, tokenExpires: null };
    await user.set(dataUpdate);
    await user.save();
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    return res.status(400).json({ errorMessage: 'Invalid or expired token' });
  }
};

const getUser = async (req, res) => {
  try {
    const { id, page } = req.body;
    if (id) {
      const user = await User.findOne({ where: { id }, attributes: { exclude: ['password'] } });
      if (!user) {
        return res.status(404).json({ errorMessage: 'User does not exist' });
      }
      return res.status(200).json({ user });
    }

    const limit = 20;
    let currentPage = 1;
    let offset;
    if (page) {
      currentPage = page;
      offset = (currentPage - 1) * limit; // Tính toán vị trí bắt đầu
    } else {
      offset = 0;
    }

    const users = await User.findAndCountAll({
      limit,
      offset,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });
    const totalCount = users.count; // Tổng số lượng người dùng
    const totalPages = Math.ceil(totalCount / limit); // Tổng số trang

    console.log('200---', page, limit, currentPage, offset);
    return res.status(200).json({ users: users.rows, totalCount, totalPages, currentPage });
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const updateUserById = async (req, res) => {
  const dataUpdate = req.body;
  try {
    const user = await User.findOne({ where: { id: dataUpdate.id } });
    if (!user) {
      return res.status(404).json({ errorMessage: 'User does not exist' });
    }
    const { id, ...data } = dataUpdate;
    await user.set(data);
    await user.save();
    return res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ errorMessage: 'User does not exist' });
    }
    await user.destroy();
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};
export default {
  getToken,
  handleLogin,
  createUser,
  forgotPassword,
  resetPassword,
  getUser,
  updateUserById,
  deleteUserById,
};
