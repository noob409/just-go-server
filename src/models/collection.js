import { DataTypes } from "sequelize";

import sequelize from "../config/sequelize.js";
import User from "./user.js";

const Collection = sequelize.define("collection", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  googlePlaceId: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  freezeTableName: true,   // Prohibit plural
});

export const associate = () => {
  Collection.belongsTo(User, { as: "user", foreignKey: "userId" });
};

export default Collection;
