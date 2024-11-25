import Trip from "../../models/trip.js";
import Plan from "../../models/plan.js";

{/*Plan model的isFinal欄位可以移除 */ }

//  FinalPlanId Change API
//  Route還沒寫
export const finalPlanChange = async (req, res) => {
    const { finalPlanId } = req.body;
    const { tripId } = req.params;
    //  翊豪在此有寫tripId確認的middleware，故省略tripId check

    try {
        // 檢查該 Plan 是否屬於此 Trip
        const plan = await Plan.findOne({
            where: {
                id: finalPlanId,
                tripId: tripId, // 確保 finalPlanId 屬於這個 tripId
            },
        });

        if (!plan) {
            return res.status(404).json({
                status: "error",
                message: "The provided finalPlanId does not belong to the specified trip.",
            });
        }

        // 更新 Trip 的 finalPlanId
        const updatedTrip = await Trip.update(
            { finalPlanId: finalPlanId },
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
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  Plan Name Change API
//  Route還沒寫
export const planNameChange = async (req, res) => {
    const { planId, newName } = req.body; // 前端提供新的名稱
    const { tripId } = req.params; // 由路徑參數提供 tripId

    try {
        // 確認計畫是否存在，並且屬於指定的行程
        const plan = await Plan.findOne({
            where: {
                id: planId,
                tripId, // 確保該計畫屬於此行程
            },
        });

        if (!plan) {
            return res.status(404).json({
                status: "error",
                message: "Plan not found or does not belong to the specified trip.",
            });
        }

        // 更新計畫名稱
        plan.name = newName;
        await plan.save();

        return res.status(200).json({
            status: "success",
            message: "Plan name has been updated successfully.",
            data: {
                planId: plan.id,
                newName: plan.name,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}