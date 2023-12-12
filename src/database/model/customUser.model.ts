import { DataTypes, Model } from 'sequelize';
import sequelize from '../config';

class CustomUserModel extends Model {
  declare email: string;
  declare username: string;
  declare password: string;
}

CustomUserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'custom_users',
  }
);

sequelize.sync().then(() => {
  console.log('Custom User table created successfully!');
}).catch((error: Error) => {
  console.error('Unable to create table: ', error);
});

export default CustomUserModel;
