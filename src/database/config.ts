import { Sequelize } from 'sequelize';

const env = process.env.NODE_ENV || 'development';

let config: any;

if (env === 'test') {
  config = {
    username: 'root',
    host: '127.0.0.1',
    port: 3306,
    database: 'challenge_test',
    dialect: 'sqlite',
    storage: ':memory'
  };
} else {
  config = {
    username: 'root',
    host: '127.0.0.1',
    port: 3306,
    database: 'challenge',
    dialect: 'mysql',
  };
}

const sequelize = new Sequelize(config);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database: ', error);
  }
})();

export default sequelize;
