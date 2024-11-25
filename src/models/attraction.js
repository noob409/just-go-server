import { DataTypes } from "sequelize";

import sequelize from "../config/sequelize.js";
import Day from "./day.js";

const Attraction = sequelize.define("attraction", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  dayId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  startAt: {
    type: DataTypes.STRING,
    defaultValue: "00:00",
  },
  endAt: {
    type: DataTypes.STRING,
    defaultValue: "00:00",
  },
  note: {
    type: DataTypes.STRING,
  },
  googlePlaceId: {
    type: DataTypes.STRING,
  },
  nextAttractionId: {
    type: DataTypes.UUID,
  },
});

export const associate = () => {
  Attraction.belongsTo(Day, { foreignKey: "dayId", onDelete: "CASCADE" });
};

export default Attraction;
