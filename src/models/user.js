import { DataTypes } from "sequelize";

import sequelize from "../config/sequelize.js";
import Board from "./board.js";

const User = sequelize.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
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
});

export const associate = () => {
  User.hasMany(Board);
};

export default User;
