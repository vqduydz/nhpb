import dotenv from 'dotenv';
import db from '../models';

dotenv.config();
const Order = db.Order;

const createNewOrder = async (req, res) => {
  try {
    const {
      payment_methods,
      order_code,
      user_id,
      status,
      ship_fee,
      total_amount,
      total_payment,
      items,
      history,
      receiver,
      orderer,
      payment,
    } = req.body;
    const order = await Order.findOne({
      where: { order_code },
    });

    console.log({ order_code, order });
    if (order) {
      return res.status(442).json({ errorMessage: 'Order already exists' });
    }

    await Order.create({
      payment_methods,
      order_code,
      user_id,
      status,
      payment,
      ship_fee,
      total_amount,
      total_payment,
      items,
      history,
      receiver,
      orderer,
    });
    return res.status(200).json({ message: 'Order added successfully' });
  } catch (error) {
    console.log('112---', error);
    return res.status(500).json({ errorMessage: 'Server error', error });
  }
};

const getOrders = async (req, res) => {
  const { user_id } = req.params;
  try {
    const orders = await Order.findAll({
      where: { user_id },
      order: [['createdAt', 'DESC']],
    });

    const imagePath = req.protocol + '://' + req.get('host') + '/v1/api/images/';
    return res.status(200).json({ orders });
  } catch (error) {
    console.log('62----', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const getOrderByOrderCode = async (req, res) => {
  const { order_code } = req.params;
  try {
    const order = await Order.findOne({
      where: { order_code },
    });

    const imagePath = req.protocol + '://' + req.get('host') + '/v1/api/images/';
    return res.status(200).json({ order });
  } catch (error) {
    console.log('78----', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

export default { createNewOrder, getOrders, getOrderByOrderCode };
