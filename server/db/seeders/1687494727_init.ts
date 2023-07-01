import { QueryInterface, Sequelize } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface, sequelize: Sequelize) {
    const mapping = [];
    for (let x = 0; x < 1024; x++) {
      for (let y = 0; y < 1024; y++) {
        mapping.push({
          cell_x: x,
          cell_y: y,
          hexValue: '00000000'
        });
      }
    }
    await queryInterface.bulkInsert('pixel_map', mapping);
  },

  async down(queryInterface: QueryInterface, sequelize: Sequelize) {
    await queryInterface.bulkDelete('pixel_map', {}, {});
  }
};
