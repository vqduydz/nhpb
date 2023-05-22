'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  Order.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      user_id: DataTypes.INTEGER,
      status: DataTypes.STRING,
      ship_fee: DataTypes.INTEGER,
      total_amount: DataTypes.INTEGER,
      total_payment: DataTypes.INTEGER,
      items: DataTypes.TEXT,
      history: DataTypes.TEXT,
      receiver: DataTypes.TEXT,
      orderer: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Order',
      timestamps: true,
    },
  );
  return Order;
};
