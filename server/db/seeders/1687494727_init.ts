import { QueryInterface, Sequelize } from 'sequelize';

const init_1687494727 = {
  // eslint-disable-next-line no-unused-vars
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

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface: QueryInterface, sequelize: Sequelize) {
    await queryInterface.bulkDelete('pixel_map', {}, {});
  }
};
export default init_1687494727;
