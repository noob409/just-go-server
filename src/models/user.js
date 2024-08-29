import { DataTypes } from "sequelize";

import sequelize from "../config/sequelize.js";
import Trip from "./trip.js";
import Collection from "./collection.js";
import TripLike from "./trip_like.js";
import TripShare from "./trip_share.js";

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
  isValid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
});

export const associate = () => {
  User.hasMany(Trip, { foreignKey: "userId" });
  User.hasMany(Collection, { foreignKey: "userId" });
  User.hasMany(TripLike, { foreignKey: "userId" });
  User.hasMany(TripShare, { foreignKey: "userId" });
};

export default User;
