import Trip from "../../models/trip.js";
import Plan from "../../models/plan.js";
import Day from "../../models/day.js";

//  FinalPlanId Change API
export const finalPlanChange = async (req, res) => {
  const { planId } = req.body;
  const { tripId } = req.params;

  try {
    // 檢查該 Plan 是否屬於此 Trip
    const plan = await Plan.findOne({
      where: {
        id: planId,
        tripId: tripId, // 確保 finalPlanId 屬於這個 tripId
      },
    });

    if (!plan) {
      return res.status(404).json({
        status: "error",
        message:
          "The provided finalPlanId does not belong to the specified trip.",
      });
    }

    // 更新 Trip 的 finalPlanId
    const updatedTrip = await Trip.update(
      { finalPlanId: planId },
      { where: { id: tripId } }
    );

    // 確認更新是否成功
    if (updatedTrip[0] === 0) {
      return res.status(400).json({
        status: "error",
        message: "Failed to update finalPlanId.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Final plan has been updated successfully.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

//  Plan Name Change API
export const updatePlanName = async (req, res) => {
  const { name } = req.body; // 前端提供新的名稱
  const { planId } = req.params;

  try {
    // 確認計畫是否存在，並且屬於指定的行程
    const plan = await Plan.findByPk(planId);

    if (!plan) {
      return res.status(404).json({
        status: "error",
        message: "Plan not found",
      });
    }

    // 更新計畫名稱
    plan.update({ name });

    return res.status(200).json({
      status: "success",
      message: "Plan name has been updated successfully.",
      data: {
        planId: plan.id,
        name: plan.name,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

export const getPlans = async (req, res) => {
  const { tripId } = req.params;

  try {
    // 獲取所有跟 tripId 相關的 plan
    const plans = await Plan.findAll({
      where: {
        tripId,
      },
    });

    if (!plans) {
      return res
        .status(404)
        .json({ status: "error", message: "Plans not found" });
    }

    return res.status(200).json({ status: "success", data: plans });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

export const createPlan = async (req, res) => {
  const { tripId } = req.params;

  try {
    const tripInfo = await Trip.findByPk(tripId);

    let startDate = tripInfo.departureDate;
    let endDate = tripInfo.endDate;

    // Create the new plan
    const newPlan = await Plan.create({
      tripId,
      name: null,
    });

    let prevDay = null;
    let firstDay = null;
    const currentDayList = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    // Generate the days for the plan
    while (currentDate <= end) {
      const newDay = await Day.create({ planId: newPlan.id });

      // Link the first day to the plan's startDayId
      if (!firstDay) {
        firstDay = newDay;
        newPlan.startDayId = newDay.id;
        await newPlan.save();
      }

      // Link the previous day to the current day
      if (prevDay) {
        prevDay.nextDayId = newDay.id;
        await prevDay.save();
      }

      // Collect day data for response
      currentDayList.push({
        id: newDay.id,
        planId: newDay.planId,
        startAttractionId: newDay.startAttractionId,
        nextDayId: newDay.nextDayId,
        createdAt: newDay.createdAt,
        updatedAt: newDay.updatedAt,
        attrList: [],
      });

      prevDay = newDay;

      // Increment date by one day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return res.status(201).json({
      status: "success",
      data: {
        plan: {
          id: newPlan.id,
          name: newPlan.name,
          days: currentDayList,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};
