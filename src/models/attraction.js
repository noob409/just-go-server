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
    type: DataTypes.DATE,
  },
  endAt: {
    type: DataTypes.DATE,
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
  Attraction.belongsTo(Day, { foreignKey: "dayId" });
};

export default Attraction;
