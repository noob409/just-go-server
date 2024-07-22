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
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
  },
  token: {
    type: DataTypes.STRING,
    // allowNull: false,  //  At Test, We set this null
    unique: true,
  },
  avatar: {
    type: DataTypes.STRING,
  },
  provider: { //  存google或form
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  freezeTableName: true,   // Prohibit plural
});

export const associate = () => {
  User.hasMany(Board);
};

export default User;
