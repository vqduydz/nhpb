'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FeedBack extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FeedBack.belongsTo(models.Catalog, { foreignKey: 'slug', sourceKey: 'catalogSlug' });
    }
  }
  FeedBack.init(
    {
      user_id: DataTypes.INTEGER,
      menu_id: DataTypes.INTEGER,
      point: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'FeedBack',
      timestamps: true,
    },
  );
  return FeedBack;
};
