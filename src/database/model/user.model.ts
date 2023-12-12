import { DataTypes, Model } from "sequelize";
import sequelize from "../config";

class UserModel extends Model {
  declare id: string;
  declare token: String | null;
  declare email: string;
  declare displayName: string;
}

UserModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "users",
  }
);

sequelize
  .sync()
  .then(() => {
    console.log("User table created successfully!");
  })
  .catch((error: Error) => {
    console.error("Unable to create table: ", error);
  });

export default UserModel;
