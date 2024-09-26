import Collection from "../../models/collection.js";
import Trip from "../../models/trip.js";
import TripLike from "../../models/trip_like.js";
import TripShare from "../../models/trip_share.js";
import Plan from "../../models/plan.js";
import { checkRequiredFields } from "../../utils/checkRequirdFieldsUtils.js";

import Sequelize from "sequelize";

//  行程管理 - 我的行程
// export const ownTrip = async (req, res) => {
//     const userId = req.userId;
//     let ownData = [];
//     let coEditData = [];

//     // 檢查是否所有必要的欄位都存在
//     const requiredFields = { userId };
//     const missingFields = checkRequiredFields(requiredFields);

//     if (missingFields.length > 0) {
//         return res.status(400).json({
//             status: "error",
//             message: `Missing required fields: ${missingFields.join(', ')}`
//         });
//     }

//     try {
//         // 我的行程 - 屬於自己的行程
//         const tripDataAll = await Trip.findAll({
//             where: {
//                 userId: userId,
//             }
//         });
//         if (tripDataAll.length > 0) {
//             // ownData = tripDataAll.map(trip => ({
//             //     id: trip.id,
//             //     userId: trip.userId,
//             //     title: trip.tripName,
//             //     image: trip.image,
//             //     finalPlanId: trip.finalPlanId,
//             //     departureDate: trip.departureDate,
//             //     endDate: trip.endDate,
//             //     linkPermission: trip.linkPermission,
//             //     isPublic: trip.isPublic,
//             //     publishDay: trip.publicAt,
//             //     like: trip.likeCount,
//             //     labels: trip.label || [],
//             // }));

//             // Test 前端資料接收格式
//             ownData = tripDataAll.map(trip => ({
//                 id: trip.id,
//                 user: null,
//                 userId: trip.userId,
//                 title: trip.tripName,
//                 image: trip.image,
//                 day: 0,
//                 publishDay: trip.publicAt,
//                 labels: trip.label || [],
//                 like: trip.likeCount,
//                 isLike: false,
//                 isPublic: trip.isPublic,
//             }));
//         }

//         {/* 我的行程 - 共編
//             Left Outer join，取得TripShare、TripShare交集Trip的資料集，並排除交集中的trip的擁有者是某user的資料 */}
//         const coEditTrips = await TripShare.findAll({
//             where: { userId: userId, },
//             include: [
//                 {
//                     model: Trip,
//                     as: 'trip',
//                     where: {
//                         userId: {
//                             [Sequelize.Op.not]: userId // 排除屬於 userId 的行程
//                         }
//                     },
//                     // 如果需要有共編擁有者的資訊，則下面的include需保留。
//                     // include: [
//                     //     {
//                     //         model: User,
//                     //         as: 'user',
//                     //     }
//                     // ]
//                 }
//             ]
//         });

//         if (coEditTrips) {
//             // coEditData = coEditTrips.map(tripShare => ({
//             //     id: tripShare.id,
//             //     userId: tripShare.userId,
//             //     title: tripShare.tripName,
//             //     image: tripShare.image,
//             //     finalPlanId: tripShare.finalPlanId,
//             //     departureDate: tripShare.departureDate,
//             //     endDate: tripShare.endDate,
//             //     linkPermission: tripShare.linkPermission,
//             //     isPublic: tripShare.isPublic,
//             //     publishDay: tripShare.publicAt,
//             //     like: tripShare.likeCount,
//             //     labels: tripShare.label || [],
//             // }));

//             // Test 前端資料接收格式
//             coEditData = coEditTrips.map(trip => ({
//                 id: trip.id,
//                 user: null,
//                 userId: trip.userId,
//                 title: trip.tripName,
//                 image: trip.image,
//                 day: 0,
//                 publishDay: trip.publicAt,
//                 labels: trip.label || [],
//                 like: trip.likeCount,
//                 isLike: false,
//                 isPublic: trip.isPublic,
//             }));

//         }
//         return res.status(200).json({ status: "success", data: { ownData, coEditData } });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: "error", message: "Internal server error" });
//     }
// }

// //  行程管理 - 我的收藏
// export const keepTrip = async (req, res) => {
//     const userId = req.userId;
//     let favorData = [];

//     // 檢查是否所有必要的欄位都存在
//     const requiredFields = { userId };
//     const missingFields = checkRequiredFields(requiredFields);

//     if (missingFields.length > 0) {
//         return res.status(400).json({
//             status: "error",
//             message: `Missing required fields: ${missingFields.join(', ')}`
//         });
//     }

//     try {
//         const favorTrips = await TripLike.findAll({
//             where: { userId: userId },
//             include: [
//                 {
//                     model: Trip,
//                     as: 'trip',
//                 }
//             ]
//         });

//         if (favorTrips) {
//             // favorData = favorTrips.map(tripFavor => ({
//             //     id: tripFavor.id,
//             //     userId: tripFavor.userId,
//             //     title: tripFavor.tripName,
//             //     image: tripFavor.image,
//             //     finalPlanId: tripFavor.finalPlanId,
//             //     departureDate: tripFavor.departureDate,
//             //     endDate: tripFavor.endDate,
//             //     linkPermission: tripFavor.linkPermission,
//             //     isPublic: tripFavor.isPublic,
//             //     publishDay: tripFavor.publicAt,
//             //     like: tripFavor.likeCount,
//             //     labels: tripFavor.label || [],
//             // }));

//             // Test 前端資料接收格式
//             favorData = favorTrips.map(trip => ({
//                 id: trip.id,
//                 user: null,
//                 userId: trip.userId,
//                 title: trip.tripName,
//                 image: trip.image,
//                 day: 0,
//                 publishDay: trip.publicAt,
//                 labels: trip.label || [],
//                 like: trip.likeCount,
//                 isLike: false,
//                 isPublic: trip.isPublic,
//             }));
//         }
//         return res.status(200).json({ status: "success", data: favorData });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: "error", message: "Internal server error" });
//     }
// }

//  首頁 - 熱門行程，目前以點讚數遞減傳回。
export const popularTrips = async (req, res) => {
    let popularTrips = [];
    try {
        const tripDataAll = await Trip.findAll({
            order: [["likeCount", "DESC"]],
        });

        // popularTrips = tripDataAll.map(trip => ({
        //     id: trip.id,
        //     userId: trip.userId,
        //     title: trip.tripName,
        //     image: trip.image,
        //     finalPlanId: trip.finalPlanId,
        //     departureDate: trip.departureDate,
        //     endDate: trip.endDate,
        //     linkPermission: trip.linkPermission,
        //     isPublic: trip.isPublic,
        //     publishDay: trip.publicAt,
        //     like: trip.likeCount,
        //     labels: trip.label || [],
        // }));

        // Test 前端資料接收格式
        popularTrips = tripDataAll.map(trip => ({
            id: trip.id,
            user: null,
            userId: trip.userId,
            title: trip.tripName,
            image: trip.image,
            day: 0,
            publishDay: trip.publicAt,
            labels: trip.label || [],
            like: trip.likeCount,
            isLike: false,
            isPublic: trip.isPublic,
        }));
        return res.status(200).json({ status: "success", data: popularTrips });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

/* searchTripById會需要行程是否公開、是否有共編權限，這些邏輯來判斷是否可以讓user查詢 */
//  根據Trip ID搜尋行程
export const searchTripById = async (req, res, next) => {

    const tripId = req.param.id;
    let tripDataById = [];

    try {
        const trip = await Trip.findByPk(tripId);

        // // 檢查行程是否為公開的，假設 req.userId 是當前使用者的 ID，這個部分的權限需要再確認
        // if (!trip.isPublic && trip.userId !== req.userId) {
        //     return res.status(403).json({ status: "error", message: "You do not have permission to view this trip." });
        // }

        // tripDataById = {
        //     id: trip.id,
        //     userId: trip.userId,
        //     title: trip.tripName,
        //     image: trip.image,
        //     finalPlanId: trip.finalPlanId,
        //     departureDate: trip.departureDate,
        //     endDate: trip.endDate,
        //     linkPermission: trip.linkPermission,
        //     isPublic: trip.isPublic,
        //     publishDay: trip.publicAt,
        //     like: trip.likeCount,
        //     labels: trip.label || [],
        // }

        // Test 前端資料接收格式
        tripDataById = {
            id: trip.id,
            user: null,
            userId: trip.userId,
            title: trip.tripName,
            image: trip.image,
            day: 0,
            publishDay: trip.publicAt,
            labels: trip.label || [],
            like: trip.likeCount,
            isLike: false,
            isPublic: trip.isPublic,
        };

        return res.status(200).json({ status: "success", data: tripDataById });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  對行程點讚
export const favorTrip = async (req, res) => {
    const userId = req.userId;
    const tripId = req.params.id;

    try {
        const alreadyFavor = await TripLike.findOne({ where: { userId: userId, tripId: tripId } });
        if (alreadyFavor) {
            //  user對trip取消按讚
            //  Decrement the like count for the trip
            const trip = await Trip.findByPk(tripId);
            trip.likeCount -= 1;
            await trip.save();

            await alreadyFavor.destroy();
            return res.status(200).json({ status: "success", isLike: false });
        } else {
            //  user對trip按讚
            //  Increment the like count for the trip
            const trip = await Trip.findByPk(tripId);
            trip.likeCount += 1;
            await trip.save();

            await TripLike.create({
                userId: userId,
                tripId: tripId
            });
            return res.status(201).json({ status: "success", isLike: true });;  //  201 created code: successful response and resource created.
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  刪除行程
export const deleteTrip = async (req, res) => {
    const userId = req.userId;
    const tripId = req.params.id;

    try {
        const isTripExist = await Trip.findOne({ where: { tripId: tripId } });

        if (!isTripExist) {
            return res.status(404).json({ status: "error", message: "The trip does not exist." });  // 行程不存在
        }
        // 確認行程是否屬於當前使用者
        if (isTripExist.userId !== userId) {
            return res.status(403).json({ status: "error", message: "You are not authorized to delete this trip." });  // 使用者無權限刪除別人的行程
        }

        await isTripExist.destroy();
        return res.status(200).json({ status: "success", message: "The trip has deleted." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  建立行程
export const createTrip = async (req, res) => {
    const { title, startTime, endTime, userId } = req.body;
    const tripAvatar = req.file;    //  image can be null;

    try {
        let tripAvatarPath = null;

        if (tripAvatar) {
            tripAvatarPath = `/uploads/trips/${avatarFile.filename}`;
        }

        const newTrip = await Trip.create({
            userId: userId,
            name: title,
            image: tripAvatarPath,
            departureDate: startTime,
            endDate: endTime,
        });
        // const returnTrip = {
        //     id: newTrip.id,
        //     userId: newTrip.userId,
        //     image: newTrip.image,
        //     finalPlanId: newTrip.finalPlanId,
        //     departureDate: newTrip.startTime,
        //     endDate: newTrip.endTime,
        //     linkPermission: newTrip.linkPermission,
        //     isPublic: newTrip.isPublic,
        //     publicAt: newTrip.publicAt,
        //     likeCount: newTrip.likeCount,
        //     label: newTrip.label,
        // };

        // Test 前端資料接收格式
        const returnTrip = {
            id: newTrip.id,
            user: null,
            userId: newTrip.userId,
            title: newTrip.tripName,
            image: newTrip.image,
            day: 0,
            publishDay: newTrip.publicAt,
            labels: newTrip.label || [],
            like: newTrip.likeCount,
            isLike: false,
            isPublic: newTrip.isPublic,
        };

        return res.status(201).json({ status: "success", data: { returnTrip } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  更新行程資訊
export const updateTripInfo = async (req, res) => {

}

//  景點收藏
export const addPlaceCollection = async (req, res) => {
    const userId = req.userId;
    const { googlePlaceId } = req.body;

    try {
        // 檢查是否已經存在相同的收藏
        const existingCollection = await Collection.findOne({
            where: {
                userId: userId,
                googlePlaceId: googlePlaceId,
            }
        });

        if (existingCollection) {
            // 如果已存在，返回一個提示訊息或已存在的資料
            return res.status(409).json({
                status: "error",
                message: "This place is already in your collection.",
                data: {
                    id: existingCollection.id,
                    userId: existingCollection.userId,
                    googlePlaceId: existingCollection.googlePlaceId,
                }
            });
        }

        // 如果不存在，則新增收藏
        const addCollection = await Collection.create({
            userId: userId,
            googlePlaceId: googlePlaceId,
        });
        const collectionInfo = {
            id: addCollection.id,
            userId: addCollection.userId,
            googlePlaceId: addCollection.googlePlaceId,
        };
        return res.status(201).json({ status: "success", data: collectionInfo });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  景點刪除
export const deletePlaceCollection = async (req, res) => {
    const userId = req.userId;
    const { googlePlaceId } = req.body;

    try {
        await Collection.destroy({ where: { userId: userId, googlePlaceId: googlePlaceId } });
        return res.status(200).json({ status: "success", message: "The Google Place had deleted." })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  建立方案ABC...
export const createPlan = async (req, res) => {
    const { tripId } = req.body;

    // 檢查必填欄位
    if (!tripId) {
        return res.status(400).json({
            status: "error",
            message: "Missing required field: tripId"
        });
    }

    try {
        // 確認行程是否存在
        const trip = await Trip.findByPk(tripId);
        if (!trip) {
            return res.status(404).json({ status: "error", message: "Trip not found" });
        }

        // 創建新的方案
        const newPlan = await Plan.create({
            tripId: tripId,
            startDayId: null // 可以設置為 null，稍後添加天數
        });

        return res.status(201).json({
            status: "success",
            data: {
                id: newPlan.id,
                tripId: newPlan.tripId,
                startDayId: newPlan.startDayId,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  把景點加入方案的邏輯
export const placeToPlan = async (req, res) => {

}
