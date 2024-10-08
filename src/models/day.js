import { DataTypes } from "sequelize";

import sequelize from "../config/sequelize.js";
import Plan from "./plan.js";
import Attraction from "./attraction.js";

const Day = sequelize.define("day", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  planId: {
    type: DataTypes.UUID,
    allowNull: false,
    onDelete: "CASCADE"
  },
  startAttractionId: {
    type: DataTypes.UUID,
  },
  nextDayId: {
    type: DataTypes.UUID,
  },
});

export const associate = () => {
    Day.belongsTo(Plan, { foreignKey: "planId", onDelete: "CASCADE" });
    Day.hasMany(Attraction, { foreignKey: "dayId", onDelete: "CASCADE" });
};

export default Day;