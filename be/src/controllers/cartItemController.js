import dotenv from 'dotenv';
import db from '../models';

dotenv.config();
const CartItem = db.CartItem;
const Menu = db.Menu;

const getCartItemByCartId = async (req, res) => {
  const { user_id } = req.params;
  try {
    const cartItem = await CartItem.findAll({
      where: { user_id },

      include: {
        model: Menu,
        // where: sequelize.where(sequelize.col('CartItem.menu_id'), sequelize.col('id')),
        attributes: ['name', 'price', 'image', 'slug'], // lấy các thuộc tính name và price của food
      },
      attributes: ['id', 'user_id', 'menu_id', 'quantity'],
      order: [['createdAt', 'ASC']],
    });
    console.log(!cartItem);
    if (!cartItem) {
      return res.status(404).json({ errorMessage: 'CartItem does not exist' });
    }

    return res.status(200).json({ cartItem });
  } catch (error) {
    console.log('19--error:', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const updateCartItemById = async (req, res) => {
  const dataUpdate = req.body;
  try {
    const cartItem = await CartItem.findOne({
      where: { id: dataUpdate.id },
    });
    if (!cartItem) {
      return res.status(404).json({ errorMessage: 'CartItem does not exist' });
    }
    const { id, ...data } = dataUpdate;
    await cartItem.set(data);
    await cartItem.save();

    return res.status(200).json({ cartItem, message: 'CartItem updated successfully' });
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const deleteCartItemById = async (req, res) => {
  const { id } = req.body;
  try {
    const cartItem = await CartItem.findOne({
      where: { id },
    });
    if (!cartItem) {
      return res.status(404).json({ errorMessage: 'CartItem does not exist' });
    }
    await cartItem.destroy();
    return res.status(200).json({ cartItem, message: 'CartItem deleted successfully' });
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

const addCartItem = async (req, res) => {
  const { user_id, menu_id, quantity } = req.body;
  console.log(req.body);
  try {
    const cartItem = await CartItem.findOne({
      where: { menu_id, user_id },
    });
    if (cartItem) {
      return res.status(442).json({ errorMessage: 'CartItem already exists' });
    }
    await CartItem.create({
      user_id,
      menu_id,
      quantity,
    });
    return res.status(200).json({ cartItem, message: 'CartItem added successfully' });
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};

export default { updateCartItemById, getCartItemByCartId, deleteCartItemById, addCartItem };
