import TripShare from "../../models/trip_share.js";
import Trip from "../../models/trip.js";

//  共編行程權限
export const coEditTripPermission = async (req, res) => {
    const { linkPermission } = req.body;
    const userId = req.userId;
    const tripId = req.params.id;

    try {
        const isTripShareExist = await TripShare.findOne({ where: { userId: userId, tripId: tripId } });

        if (!isTripShareExist) {
            //  情況一: 第一次設定權限，新增資料            
            const tripPermission = await TripShare.create({
                tripId: tripId,
                userId: userId,
                permission: linkPermission,
            });
            const tripPermissionData = {
                id: tripPermission.id,
                tripId: tripPermission.tripId,
                userId: tripPermission.userId,
                permission: tripPermission.permission,
            };
            return res.status(201).json({ status: "success", data: tripPermissionData });
        } else {
            //  情況二: 更新已存在的權限資料
            await isTripShareExist.update({ permission: linkPermission });
            const updatedTripPermissionData = {
                id: isTripShareExist.id,
                tripId: isTripShareExist.tripId,
                userId: isTripShareExist.userId,
                permission: isTripShareExist.permission,
            };

            return res.status(200).json({ status: "success", data: updatedTripPermissionData });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  共編行程權限刪除
export const deleteCoEditTripPermission = async (req, res) => {
    const { deleteUserId } = req.body;
    const userId = req.userId;
    const tripId = req.params.id;

    try {
        // 用找不找得到Trip來判斷刪除者是否為行程owner
        // Step 1: Check if the current user is the owner of the trip
        const isTripOwner = await Trip.findOne({ where: { id: tripId, userId: userId } });

        if (!isTripOwner) {
            return res.status(403).json({ status: "error", message: "You do not have permission to delete co-editing permissions for this trip." });
        }

        // Step 2: Check if the target user (deleteUserId) has co-editing permission for the trip
        const coEditUser = await TripShare.findOne({ where: { tripId: tripId, userId: deleteUserId } });

        if (!coEditUser) {
            return res.status(404).json({ status: "error", message: "No co-editing permission found for the specified user." });
        }

        // Step 3: Delete the co-editing permission
        await coEditUser.destroy();

        return res.status(200).json({ status: "success", message: `Co-editing permission for user ${deleteUserId} has been successfully deleted.` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}