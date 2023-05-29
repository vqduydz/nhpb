import dotenv from 'dotenv';
import db from '../models';

dotenv.config();
const Order = db.Order;
const User = db.User;

const createNewOrder = async (req, res) => {
  try {
    const {
      payment_methods,
      order_code,
      customer_id,
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
      customer_id,
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
  try {
    const { customer_id } = req.params;
    if (customer_id) {
      const orders = await Order.findAll({
        where: { customer_id },
        order: [['createdAt', 'DESC']],
      });
      return res.status(200).json({ orders });
    }
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ orders });
  } catch (error) {
    console.log('58---', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const getOrderByOrderCode = async (req, res) => {
  const { order_code } = req.params;
  try {
    const order = await Order.findOne({
      where: { order_code },
      raw: true,
    });

    let deliver = {},
      handler = {};
    if (order) {
      const { deliver_id, handler_id } = order;
      handler = await User.findOne({
        where: { id: handler_id },
        attributes: ['id', 'firstName', 'lastName', 'avatar', 'phoneNumber'],
        raw: true,
      });
      deliver = await User.findOne({
        where: { id: deliver_id },
        attributes: ['id', 'firstName', 'lastName', 'avatar', 'phoneNumber'],
        raw: true,
      });
    }

    console.log('80---', order, deliver, handler);

    return res.status(200).json({ ...order, deliver, handler });
  } catch (error) {
    console.log('78----', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const updateOrderById = async (req, res) => {
  const dataUpdate = req.body;
  try {
    const order = await Order.findOne({ where: { order_code: dataUpdate.order_code } });
    if (!order) {
      return res.status(404).json({ errorMessage: 'Order does not exist' });
    }
    const { id, order_code, ...data } = dataUpdate;
    await order.set(data);
    await order.save();
    return res.status(200).json({ message: 'Order updated successfully' });
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

export default { createNewOrder, getOrders, getOrderByOrderCode, updateOrderById };
