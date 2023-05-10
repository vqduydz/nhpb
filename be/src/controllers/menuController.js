import dotenv from 'dotenv';
import db from '../models';

dotenv.config();
const Menu = db.Menu;

const getMenu = async (req, res) => {
  try {
    const { slug } = req.params;
    if (slug) {
      const menu = await Menu.findOne({ where: { slug }, raw: true });
      if (!menu) {
        return res.status(404).json({ errorMessage: 'Menu does not exist' });
      }

      return res.status(200).json({ ...menu });
    }
    const menu = await Menu.findAll();
    return res.status(200).json({ menu });
  } catch (error) {
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};
export default { getMenu };
