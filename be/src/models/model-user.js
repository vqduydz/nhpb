'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // User.hasOne(models.Cart, { foreignKey: 'user_id', sourceKey: 'id' });
      // define association here
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      gender: DataTypes.STRING,
      place: DataTypes.TEXT,
      position: DataTypes.STRING,
      avatar: DataTypes.STRING,
      role: DataTypes.STRING,
      birthday: DataTypes.DATE,
      token: DataTypes.STRING,
      tokenExpires: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true,
    },
  );
  return User;
};
