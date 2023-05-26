'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      payment_methods: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      order_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      payment: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ship_fee: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_payment: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      items: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      history: {
        type: Sequelize.TEXT,
      },
      receiver: {
        type: Sequelize.TEXT,
      },
      orderer: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  },
};
