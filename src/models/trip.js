import { DataTypes } from "sequelize";

import sequelize from "../config/sequelize.js";
import User from "./user.js";
import TripLike from "./trip_like.js";
import TripShare from "./trip_share.js";
import Plan from "./plan.js";

const Trip = sequelize.define("trip", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
  },
  finalPlanId: {
    type: DataTypes.UUID,
  },
  linkPermission: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  publicAt: {
    type: DataTypes.DATE,
  },
  likeCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  label: {
    // VARCHAR(255)[]
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
}, {
  freezeTableName: true,
});

export const associate = () => {
  Trip.belongsTo(User, { foreignKey: "userId" });
  Trip.belongsTo(Plan, { foreignKey: "finalPlanId" });
  Trip.hasMany(Plan, { foreignKey: "tripId" });
  Trip.hasMany(TripLike, { foreignKey: "tripId" });
  Trip.hasMany(TripShare, { foreignKey: "tripId" });
};

export default Trip;
