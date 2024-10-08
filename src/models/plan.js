import { DataTypes } from "sequelize";

import sequelize from "../config/sequelize.js";
import Trip from "./trip.js";
import Day from "./day.js";

const Plan = sequelize.define("plan", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tripId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  startDayId: {
    type: DataTypes.UUID,
  },
  name: {
    type: DataTypes.STRING,
  },
  isFinal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

export const associate = () => {
    Plan.belongsTo(Trip, { foreignKey: "tripId" });
    Plan.hasMany(Day, { foreignKey: "planId" });
};

export default Plan;
