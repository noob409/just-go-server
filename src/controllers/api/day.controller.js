import Day from "../../models/day.js";

export const getDays = async (req, res) => {
  const { planId } = req.params;

  try {
    // 獲取所有跟 planId 相關的 day
    const days = await Day.findAll({
      where: {
        planId,
      },
    });

    if (!days) {
      return res
        .status(404)
        .json({ status: "error", message: "Days not found" });
    }

    return res.status(200).json({ status: "success", data: days });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};
