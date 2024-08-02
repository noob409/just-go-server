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
}, {
    freezeTableName: true,   // Prohibit plural
});

export const associate = () => {
    TripLike.belongsTo(User, { as: "user", foreignKey: "userId" });
    TripLike.belongsTo(Trip, { as: "trip", foreignKey: "tripId" });
};

export default TripLike;
