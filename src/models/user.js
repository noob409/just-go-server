import { DataTypes } from "sequelize";

import sequelize from "../config/sequelize.js";
import Trip from "./trip.js";
import Collection from "./collection.js";
import tripLike from "./trip_like.js";
import tripShare from "./trip_share.js";

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
    unique: true,
  },
  avatar: {
    type: DataTypes.STRING,
  },
  //  存google或form
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isValid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  }
}, {
  freezeTableName: true,   // Prohibit plural
});

export const associate = () => {
  User.hasMany(Trip, { foreignKey: "userId" });
  User.hasMany(Collection, { foreignKey: "userId" });
  User.hasMany(tripLike, { foreignKey: "userId" });
  User.hasMany(tripShare, { foreignKey: "userId" });
};

export default User;
