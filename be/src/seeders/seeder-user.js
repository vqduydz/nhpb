module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        email: 'admin@gmail.com',
        password: '$2a$10$UxQFediHOpWwI/3MPCBxKeNKZnqctdamrWCfOIIWXShnJ1gM1Azym',
        firstName: 'Admin',
        // lastName: 'Vũ',
        phoneNumber: '0908260591',
        gender: 'Nam',
        role: 'Root',
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
