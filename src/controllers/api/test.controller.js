import Board from "../../models/board.js";
import User from "../../models/user.js";

export const testController = (req, res) => {
  console.log(req.body);
  User.findAll({
    include: Board,
  }).then((users) => {
    res.json(users);
  });
};
