import Plan from "../models/plan.js";
import Trip from "../models/trip.js";
import Day from "../models/day.js";

export const checkDaysAccess = async (req, res, next) => {
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

export const checkDayAccess = async (req, res, next) => {
  const userId = req.userId;
  const { tripId, planId, dayId } = req.params;

  try {
    const day = await Day.findByPk(dayId);

    if (!day) {
      return res
        .status(404)
        .json({ status: "error", message: "Day not found" });
    }

    const plan = await Plan.findByPk(day.planId);

    if (!plan) {
      return res
        .status(404)
        .json({ status: "error", message: "Plan not found" });
    }

    if (planId !== plan.id) {
      return res
        .status(403)
        .json({ status: "error", message: "Permission denied" });
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

    if (trip.userId !== userId && trip.isPublic) {
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
