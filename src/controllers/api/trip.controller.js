import Collection from "../../models/collection.js";
import Trip from "../../models/trip.js";
import TripLike from "../../models/trip_like.js";
import TripShare from "../../models/trip_share.js";
import Plan from "../../models/plan.js";
import Day from "../../models/day.js";
import Attraction from "../../models/attraction.js";
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
    const tripId = req.params.id;
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

//  刪除行程，意味著，所有與之相關的方案都要被刪除（待修改）
export const deleteTrip = async (req, res) => {
    const userId = req.userId;
    const tripId = req.params.id;

    try {
        const isTripExist = await Trip.findByPk(tripId);

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
    const { title, startTime, endTime } = req.body;
    const userId = req.userId;
    const tripAvatar = req.file;    //  image can be null;

    try {
        let tripAvatarPath = null;

        if (tripAvatar) {
            tripAvatarPath = `/uploads/trips/${avatarFile.filename}`;
        }

        const newTrip = await Trip.create({
            userId: userId,
            tripName: title,
            image: tripAvatarPath,
            departureDate: startTime,
            endDate: endTime,
        });

        const defaultPlan = await Plan.create({
            tripId: newTrip.id,
        });

        // 初始化天數：根據開始日和結束日動態生成
        let prevDay = null;
        let firstDay = null;
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
        let currentDate = new Date(startDate);
        const dayList = [];

        while (currentDate <= endDate) {
            // 創建每一天的 Day
            const newDay = await Day.create({
                planId: defaultPlan.id,
            });

            // 如果是第一天，設置 startDayId
            if (!firstDay) {
                firstDay = newDay;
                defaultPlan.startDayId = newDay.id;
                await defaultPlan.save();
            }

            // 如果有前一天，設置前一天的 nextDayId
            if (prevDay) {
                prevDay.nextDayId = newDay.id;
                await prevDay.save();
            }

            // 為新一天創建一個空的 Attraction
            const defaultAttraction = await Attraction.create({
                dayId: newDay.id,
            });

            // 更新 Day 的 startAttractionId 為新創建的 Attraction
            newDay.startAttractionId = defaultAttraction.id;
            await newDay.save();

            // 新增至 dayList
            dayList.push({
                day: {
                    id: newDay.id,
                    planId: newDay.planId,
                    startAttractionId: newDay.startAttractionId,
                    nextDayId: newDay.nextDayId,
                    createdAt: newDay.createdAt,
                    updatedAt: newDay.updatedAt,
                },
                attrList: {
                    id: defaultAttraction.id,
                    dayId: defaultAttraction.dayId,
                    startAt: defaultAttraction.startAt,
                    endAt: defaultAttraction.endAt,
                    note: defaultAttraction.note,
                    googlePlaceId: defaultAttraction.googlePlaceId,
                    nextAttractionId: defaultAttraction.nextAttractionId
                }
            });

            // 更新 prevDay 為當前創建的 Day
            prevDay = newDay;

            // 日期遞增一天
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // 設置 nextDayId
        for (let i = 0; i < dayList.length - 1; i++) {
            dayList[i].day.nextDayId = dayList[i + 1].day.id; // 更新當前 day 的 nextDayId 為下一天的 ID
        }

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

        return res.status(201).json({
            status: "success", data: {
                tripInfo: {
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
                },
                dayList: dayList,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  取得行程資料
export const getTrip = async (req, res) => {

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

//  取得所有收藏景點
export const getCollection = async (req, res) => {
    try {
        const collectionInfo = await Collection.findAll();

        // Test 前端資料接收格式
        let collections = collectionInfo.map(collect => ({
            id: collect.id,
            userId: collect.userId,
            googlePlaceId: collect.googlePlaceId
        }));
        return res.status(200).json({ status: "success", data: collections });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  把景點加入方案的邏輯
//  如果該天的景點是空的、插在最後面或最前面、插在中間，那如何得知前一筆是否存在
//  這邊需要新增一個 如果tripId !== plan.tripId則報錯
//  插入順序沒有重排、nextAttraction也沒有加上
export const placeToPlan = async (req, res) => {
    const { collectionId, planId, dayId, startAt, endAt, note } = req.body;

    try {
        const collectionToBeAdded = await Collection.findByPk(collectionId);
        if (!collectionToBeAdded) {
            return res.status(404).json({ status: "error", message: "Place not found" });
        }

        // 查找對應的 Day
        const day = await Day.findByPk(dayId);
        if (!day) {
            return res.status(404).json({ status: "error", message: "Day not found" });
        }

        // 確認該 Day 是否屬於該 Plan
        if (day.planId !== planId) {
            return res.status(400).json({ status: "error", message: "Day does not belong to the specified plan" });
        }

        // 先找到插入位置
        let previousAttraction = null;
        let currentAttraction = await Attraction.findByPk(day.startAttractionId);
        
        // Loop through attractions to find the correct insert position
        while (currentAttraction && new Date(currentAttraction.startAt) < new Date(startAt)) {
            previousAttraction = currentAttraction;
            if (currentAttraction.nextAttractionId) {
                currentAttraction = await Attraction.findByPk(currentAttraction.nextAttractionId);
            } else {
                break; // No more attractions to compare
            }
        }

        // Create the new attraction
        const newAttraction = await Attraction.create({
            dayId: dayId,
            startAt: startAt,
            endAt: endAt,
            note: note || null,
            googlePlaceId: collectionToBeAdded.googlePlaceId,
            nextAttractionId: currentAttraction ? currentAttraction.id : null,
        });

        if (previousAttraction) {
            // Update the previous attraction to point to the new one
            await previousAttraction.update({ nextAttractionId: newAttraction.id });
        } else {
            // If no previous attraction, this is the first one, update day
            await day.update({ startAttractionId: newAttraction.id });
        }

        // If there's a current attraction, update its reference to maintain the order
        if (currentAttraction) {
            await currentAttraction.update({ previousAttractionId: newAttraction.id });
        }

        return res.status(201).json({
            status: "success",
            data: newAttraction,
        });
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
        });

        const newDay = await Day.create({
            planId: newPlan.id
        });

        const newAttraction = await Attraction.create({
            dayId: newDay.id
        });

        // 更新 Plan 的 startDayId 為新創建的 Day
        newPlan.startDayId = newDay.id;
        await newPlan.save();

        // 更新 Day 的 startAttractionId 為新創建的 Attraction
        newDay.startAttractionId = newAttraction.id;
        await newDay.save();

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

//  更新方案資料，未做
export const updatePlan = async (req, res) => {

}

//  取得某行程的所有Plan
export const getPlan = async (req, res) => {
    const tripId = req.params.id;

    try {
        const plansInfo = await Plan.findAll({ where: { tripId: tripId } });

        // Test 前端資料接收格式
        let plans = plansInfo.map(plan => ({
            id: plan.id,
            userId: plan.tripId,
            googlePlaceId: plan.startDayId
        }));
        return res.status(200).json({ status: "success", data: plans });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  新增天數or插入天數（為了加快速度，前端可以先省插入步驟）
export const addDay = async (req, res) => {
    const { planId, preDayId } = req.body;

    try {
        const prevDay = await Day.findByPk(preDayId);
        if (!prevDay) {
            return res.status(404).json({ status: "error", message: "Day not found" });
        }

        const nextDay = await Day.create({
            planId: planId,
            nextDayId: prevDay.nextDayId,   //  如果是插入天數就有值；若是加入至最後則為null
        });

        prevDay.nextDayId = nextDay.id;
        await prevDay.save();

        return res.status(201).json({ status: "success", message: "An day had been added" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  將某天對調（先省略，因為我覺得意義不大）
export const changeDayBetween = async (req, res) => {

}

//  取得某Plan的所有DaysId，並回傳給前端，前端需要再用這些ID，當使用者點某一天時，拿這個ID去call後端拿attraction資料
export const getDay = async (req, res) => {
    const { planId } = req.body;

    try {
        const selectedPlan = await Plan.findByPk(planId);
        if (!selectedPlan) {
            return res.status(404).json({ status: "error", message: "Plan not found" });
        }

        //  一個plan可能會有好幾個Day，該如何loop檢查Day.nextDayId並傳回該plan的所有Day
        //  開始遞迴獲取所有 Day
        const getAllDays = async (currentDayId, daysId = []) => {
            if (!currentDayId) return daysId;

            // 查找當前的 Day
            const currentDay = await Day.findByPk(currentDayId);

            if (!currentDay) return daysId; // 如果找不到，返回當前已收集的 days

            // 將當前 DayId 加入 days 陣列
            daysId.push(currentDay.id);

            // 遞迴查找下一個 Day
            return getAllDays(currentDay.nextDayId, daysId);
        };

        // 從 Plan 的 startDayId 開始查找
        const allDays = await getAllDays(selectedPlan.startDayId);

        return res.status(200).json({
            status: "success",
            data: allDays,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  取得某Day的所有Attraction資料
//  邏輯仍須修改，例如確認tripId? or planId
export const getAttraction = async (req, res) => {
    const { dayId } = req.body;

    try {
        const daysAttraction = await Attraction.findAll({ where: { dayId: dayId } });

        // Test 前端資料接收格式
        let attractions = daysAttraction.map(attra => ({
            id: attra.id,
            dayId: attra.dayId,
            startAt: attra.startAt,
            endAt: attra.endAt,
            note: attra.note,
            googlePlaceId: attra.googlePlaceId,
            nextAttractionId: attra.newAttractionId || null,
        }));
        return res.status(200).json({ status: "success", data: attractions });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}
