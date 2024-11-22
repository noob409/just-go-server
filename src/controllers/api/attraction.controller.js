import Day from "../../models/day.js";
import Plan from "../../models/plan.js";
import Trip from "../../models/trip.js";
import Attraction from "../../models/attraction.js";

export const getAttractions = async (req, res) => {
  const userId = req.userId;
  const { dayId } = req.params;

  console.log("userId", userId);
  console.log("dayId", dayId);

  try {
    // 確認使用者是否有權限瀏覽這個 day 的 attraction
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

    const trip = await Trip.findByPk(plan.tripId);

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

    // 獲取所有跟 dayId 相關的 attraction
    const attractions = await Attraction.findAll({
      where: {
        dayId,
      },
    });

    return res.status(200).json({ status: "success", data: attractions });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

export const createAttraction = async (req, res) => {};

export const deleteAttraction = async (req, res) => {};

export const updateAttractionTime = async (req, res) => {};

export const updateAttractionNote = async (req, res) => {};
