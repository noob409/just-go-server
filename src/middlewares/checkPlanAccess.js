import Trip from "../models/trip.js";
import Plan from "../models/plan.js";

export const checkPlansAccess = async (req, res, next) => {
  const userId = req.userId;
  const { tripId } = req.params;

  try {
    // 確認使用者是否有權限瀏覽這個 trip 的 plan
    const trip = await Trip.findByPk(tripId);

    if (!trip) {
      return res
        .status(404)
        .json({ status: "error", message: "Trip not found" });
    }

    if (trip.userId !== userId && !trip.isPublic) {
      return res
        .status(403)
        .json({ status: "error", message: "Permission denied" });
    }

    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

export const checkPlanAccess = async (req, res, next) => {
  const userId = req.userId;
  const { tripId, planId } = req.params;

  try {
    const plan = await Plan.findByPk(planId);

    if (!plan) {
      return res
        .status(404)
        .json({ status: "error", message: "Plan not found" });
    }

    const trip = await Trip.findByPk(plan.tripId);

    if (!trip) {
      return res
        .status(404)
        .json({ status: "error", message: "Trip not found" });
    }

    if (tripId !== trip.id) {
      return res
        .status(403)
        .json({ status: "error", message: "Permission denied" });
    }

    if (trip.userId !== userId && !trip.isPublic) {
      return res
        .status(403)
        .json({ status: "error", message: "Permission denied" });
    }

    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};
