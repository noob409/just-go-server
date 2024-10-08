import { DataTypes } from "sequelize";

import sequelize from "../config/sequelize.js";
import User from "./user.js";
import Trip from "./trip.js";

const TripLike = sequelize.define("trip_like", {
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
}, {
    freezeTableName: true,   // Prohibit plural
});

export const associate = () => {
    TripLike.belongsTo(User, { foreignKey: "userId" });
    TripLike.belongsTo(Trip, { foreignKey: "tripId", onDelete: "CASCADE" });
};

export default TripLike;
