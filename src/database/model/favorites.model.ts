import { DataTypes, Model } from 'sequelize';
import sequelize from '../config';

class FavoritesModel extends Model {
  declare id: string;
  declare repositoryName: string;
  declare owner: string;
}

FavoritesModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
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


sequelize.sync().then(() => {
  console.log('Favorites table created successfully!');
}).catch((error: Error) => {
  console.error('Unable to create table: ', error);
});

export default FavoritesModel;
