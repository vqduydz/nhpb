module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('carts', [
      {
        user_id: 1,
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('carts', null, {});
  },
};
