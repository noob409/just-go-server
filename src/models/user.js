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
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, //  At test, we set this one true.
  },
  token: {
    type: DataTypes.STRING,
    unique: true,
  },
  // avatar: {

  // },
  provider: { //  存google或form
    type: DataTypes.STRING,
  }
}, {
  freezeTableName: true,   // Prohibit plural
});

export const associate = () => {
  User.hasMany(Board);
};

export default User;
