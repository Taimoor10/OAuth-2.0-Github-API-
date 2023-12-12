import { Sequelize, DataTypes } from "sequelize";
import FavoritesModel from "../database/model/favorites.model";
import UserModel from "../database/model/user.model";
import { addFavoriteRepository, removeFavoriteRepository } from "../repositories/github";

describe('GitHub Repository Functions', () => {
  let User: any; 
  let Favorites: any; 
  let sequelize: any; 

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false, 
    });

    User = UserModel.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
          unique: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false 
        }
      },
      {
        sequelize,
        timestamps: false,
        modelName: "users",
      }
    );

    Favorites = FavoritesModel.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
          unique: true,
        },
        repositoryName: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        owner: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        sequelize,
        timestamps: false,
        modelName: 'favorites',
      }
    );

    await sequelize.sync(); 
  });

  afterAll(async () => {
    await sequelize.close(); 
  });

  beforeEach(async () => {
    await User.destroy({ where: {} }); 
    await Favorites.destroy({ where: {} }); 

    await User.create({
      id: 'githubId',
      email: 'test@xyz.com'
    });

    await Favorites.create({
      id: 'githubId',
      repositoryName: ['repository1', 'repository2'],
      owner: 'owner1',
      email: 'test@xyz.com'
    });
  });

  describe('addFavoriteRepository', () => {
    it('should add a repository to favorites for an existing user', async () => {
      const userId = 'githubId';
      const repositoryName = 'repository3';
      const owner = 'owner1';
      const email = 'test@xyz.com';

      await addFavoriteRepository(userId, repositoryName, owner, email);

      const favorite = await Favorites.findOne({ where: { email: email } });

      console.log('Favorite after adding:', favorite.toJSON());

      expect(favorite.repositoryName).toHaveLength(3);
      expect(favorite.repositoryName[2]).toBe(repositoryName);
    });

    it('should return message for an existing favorite repository', async () => {
      const result = await addFavoriteRepository('githubId', 'repository2', 'owner1','test@xyz.com');

      expect(result).toBe("Repository already favorite");
    });
  });

  describe('removeFavoriteRepository', () => {
    it('should remove a repository from favorites', async () => {
      const email = 'test@xyz.com';
      const repositoryName = 'repository1';

      await removeFavoriteRepository(email, repositoryName);

      const favorite = await Favorites.findOne({ where: { email: email } });

      console.log('Favorite after removal:', favorite.toJSON());

      expect(favorite.repositoryName).toEqual(['repository2']);
    });

    it('should throw an error if the user is not registered', async () => {
      const githubId = 'nonExistentId';
      const repositoryName = 'repository1';

      try {
        await removeFavoriteRepository(githubId, repositoryName);
      } catch (error: any) {
        console.log('Error when removing:', error.message);
        expect(error.message).toBe('User not registered');
      }
    });

    it('should throw an error if the repository is not in favorites', async () => {
      const email = 'test@xyz.com';
      const repositoryName = 'nonExistentRepository';

      try {
        await removeFavoriteRepository(email, repositoryName);
      } catch (error: any) {
        console.log('Error when removing:', error.message);
        expect(error.message).toBe('Repository not in favorites');
      }
    });
  });
});
