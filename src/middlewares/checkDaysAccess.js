import Plan from "../models/plan.js";
import Trip from "../models/trip.js";
import Day from "../models/day.js";

export const checkDaysAccess = async (req, res, next) => {
  const userId = req.userId;
  const { planId } = req.params;

  try {
    const plan = await Plan.findByPk(planId, {
      include: {
        model: Trip,
        attributes: ["userId", "isPublic"],
      },
    });

    if (!plan) {
      return res
        .status(404)
        .json({ status: "error", message: "Plan not found" });
    }

    const trip = plan.Trip;

    if (!trip) {
      return res
        .status(404)
        .json({ status: "error", message: "Trip not found" });
    }

    if (trip.userId !== userId || trip.isPublic) {
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
  const { dayId } = req.params;

  try {
    const day = await Day.findByPk(dayId, {
      include: {
        model: Plan,
        include: {
          model: Trip,
          attributes: ["userId", "isPublic"],
        },
      },
    });

    if (!day) {
      return res
        .status(404)
        .json({ status: "error", message: "Day not found" });
    }

    const plan = day.Plan;
    const trip = plan.Trip;

    if (!trip) {
      return res
        .status(404)
        .json({ status: "error", message: "Trip not found" });
    }

    if (trip.userId !== userId || trip.isPublic) {
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
