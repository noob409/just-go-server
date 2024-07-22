import { DataTypes } from "sequelize";

import sequelize from "../config/sequelize.js";
import User from "./user.js";

const Board = sequelize.define("board", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
  },
  update: {
    type: DataTypes.DATE,
  },
  label: {
    // VARCHAR(255)[]
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  like: {
    type: DataTypes.INTEGER,
  },
  likeByMe: {
    type: DataTypes.BOOLEAN,
  },
  isShare: {
    type: DataTypes.BOOLEAN,
  },
  deletable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  }
}, {
  freezeTableName: true,
});

export const associate = () => {
  Board.belongsTo(User);
};

export default Board;
