import Trip from "../../models/trip.js";
import Plan from "../../models/plan.js";
import Day from "../../models/day.js";

export const getDays = async (req, res) => {
  const userId = req.userId;
  const { planId } = req.params;

  try {
    // 確認使用者是否有權限瀏覽這個 plan 的 day
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

    if (trip.userId !== userId || trip.isPublic) {
      return res
        .status(403)
        .json({ status: "error", message: "Permission denied" });
    }

    // 獲取所有跟 planId 相關的 day
    const days = await Day.findAll({
      where: {
        planId,
      },
    });

    return res.status(200).json({ status: "success", data: days });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};
