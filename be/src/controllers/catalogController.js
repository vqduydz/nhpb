import dotenv from 'dotenv';
import db, { sequelize } from '../models';

dotenv.config();
const Catalog = db.Catalog;
const Menu = db.Menu;

const getCatalog = async (req, res) => {
  try {
    const catalog = await Catalog.findAll({
      include: {
        model: Menu,
        where: sequelize.where(sequelize.col('Catalog.slug'), sequelize.col('catalogSlug')),
        order: [['id', 'ASC']],
      },
      order: [['id', 'ASC']],
    });

    return res.status(200).json({ catalog });
  } catch (error) {
    console.log('error,', error);
    return res.status(500).json({ errorMessage: 'Server error' });
  }
};
export default { getCatalog };
