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
  tripId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  permission: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  freezeTableName: true,   // Prohibit plural
});

export const associate = () => {
  TripShare.belongsTo(User, { foreignKey: "userId" });
  TripShare.belongsTo(Trip, { foreignKey: "tripId", onDelete: "CASCADE" });
};

export default TripShare;
