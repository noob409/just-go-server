import { DataTypes } from "sequelize";

import sequelize from "../config/sequelize.js";
import User from "./user.js";
import TripLike from "./trip_like.js";
import TripShare from "./trip_share.js";

const Trip = sequelize.define("trip", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING
  },
  title: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  day: {
    type: DataTypes.INTEGER,
  },
  publishDay: {
    type: DataTypes.STRING,
  },
  label: {
    // VARCHAR(255)[]
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  likeCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isLike: {
    type: DataTypes.BOOLEAN,
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  linkPermission: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  finalPlanId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  }
}, {
  freezeTableName: true,
});

export const associate = () => {
  Trip.belongsTo(User, { as: "user", foreignKey: "userId" });
  Trip.hasMany(TripLike, { foreignKey: "tripId" });
  Trip.hasMany(TripShare, { foreignKey: "tripId" });
};

export default Trip;
