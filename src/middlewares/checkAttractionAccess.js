import Day from "../models/day.js";
import Plan from "../models/plan.js";
import Trip from "../models/trip.js";
import Attraction from "../models/attraction.js";

export const checkAttractionAccess = async (req, res, next) => {
  const userId = req.userId;
  const { tripId, planId, dayId, attractionId } = req.params;

  try {
    const attraction = await Attraction.findByPk(attractionId);

    if (!attraction) {
      return res
        .status(404)
        .json({ status: "error", message: "Attraction not found" });
    }

    const day = await Day.findByPk(attraction.dayId);

    if (!day) {
      return res
        .status(404)
        .json({ status: "error", message: "Day not found" });
    }

    if (day.id !== dayId) {
      return res
        .status(403)
        .json({ status: "error", message: "Permission denied" });
    }

    const plan = await Plan.findByPk(day.planId);

    if (!plan) {
      return res
        .status(404)
        .json({ status: "error", message: "Plan not found" });
    }

    if (plan.id !== planId) {
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

    if (trip.id !== tripId) {
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
