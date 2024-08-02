import Trip from "../../models/trip.js";
import User from "../../models/user.js";

export const testController = (req, res) => {
  // #swagger.tags = ['Test']
  // #swagger.summary = 'Some summary...'
  // #swagger.operationId = 'Your_operationId_here'
  // #swagger.deprecated = true

  console.log(req.body);
  User.findAll({
    include: Trip,
  }).then((users) => {
    res.json(users);
  });
};
