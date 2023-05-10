'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cart.hasMany(models.CartItem, { foreignKey: 'cart_id', sourceKey: 'id' });
      // Cart.belongsTo(models.User, { foreignKey: 'id', sourceKey: 'user_id' });
      // define association here
    }
  }
  Cart.init(
    {
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Cart',
      timestamps: true,
    },
  );
  return Cart;
};
