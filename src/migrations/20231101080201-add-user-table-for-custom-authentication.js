'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('favorites', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true
      },
      repositoryName: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      owner: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });

    await queryInterface.createTable('custom_users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // await queryInterface.removeConstraint('favorites', {
    //   fields: ['id'],
    //   type: 'foreign key',
    //   name: 'favorites_user_id_fk',
    //   references: {
    //     table: 'users',
    //     field: 'id',
    //   },
    //   onDelete: 'CASCADE'
    // });

    await queryInterface.dropTable('favorite');
    await queryInterface.dropTable('custom_users');
  }
};
