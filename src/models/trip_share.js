import { DataTypes } from "sequelize";

import sequelize from "../config/sequelize.js";
import User from "./user.js";
import Trip from "./trip.js";

const TripShare = sequelize.define("trip_share", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  permission: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  freezeTableName: true,   // Prohibit plural
});

export const associate = () => {
    TripShare.belongsTo(User, { as: "user", foreignKey: "userId" });
    TripShare.belongsTo(Trip, { as: "trip", foreignKey: "tripId" });
};

export default TripShare;
