import { DataTypes } from "sequelize";

import sequelize from "../config/sequelize.js";
import User from "./user.js";

const Collection = sequelize.define("collection", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  googlePlaceId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export const associate = () => {
  Collection.belongsTo(User, { foreignKey: "userId" });
};

export default Collection;
