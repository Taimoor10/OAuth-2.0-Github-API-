import { Sequelize, DataTypes } from 'sequelize';
import CustomUserModel from '../database/model/customUser.model';
import { signUp } from '../repositories/user';

describe('Authentication Functions', () => {
  let sequelize: any;
  let CustomUser: any;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory',
      logging: false,
    });

    CustomUser = CustomUserModel.init(
      {
        id: {
          type: DataTypes.NUMBER,
          primaryKey: true,
          autoIncrement: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        modelName: 'custom_users',
      }
    );

    await sequelize.sync();
  });

  beforeEach(async () => {
    await CustomUser.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('signUp function', () => {
    it('should return "User is already registered" if the user already exists', async () => {
      // Create a custom user
      await CustomUser.create({email: 'text@xyz.com', username: 'existingUser', password: 'password123' });

      const result: any = await signUp('text@xyz.com', 'existingUser', 'password123');

      expect(result).toBe('User is already registered');
    });

    it('should create a new user and return it if the user does not exist', async () => {
      const result: any = await signUp('text@xyz.com', 'newUser', 'password123');
       
      expect(result.dataValues).toEqual({
        id: result.dataValues.id,
        email: 'text@xyz.com',
        username: 'newUser',
        password: 'password123',
      });
    });
  });
});
