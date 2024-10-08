import TripShare from "../../models/trip_share";

//  共編行程權限
export const coEditTripPermission = async (req, res) => {
    const { userId, tripId, linkPermission } = req.body;

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