import Collection from "../../models/collection.js";
import Trip from "../../models/trip.js";
import TripLike from "../../models/trip_like.js";
import User from "../../models/user.js";

{/* 1. createTrip -> 要刪除new Attraction，且placeToPlan也要修改 - OK
    2. getTrip -> editPermission如果是trip擁有者call，就會undefined - OK
    3. attraList -> 不要排序，要傳回nextAttractionId - OK
    4. All function的回傳值要大改
    5. routes要修改驗證邏輯
    6. 要把跟編輯形成相關的FUNCTION拉出去 */}

//  首頁 - 熱門行程，目前以點讚數遞減傳回。
//  檢查isPublic，如果是false則不用傳回
//  2024/11/19檢查OK
export const popularTrips = async (req, res) => {
    let popularTrips = [];
    try {
        const userId = req.userId;

        const tripDataAll = await Trip.findAll({
            where: {
                isPublic: true, // 僅查詢公開行程
            },
            order: [["likeCount", "DESC"]],
            include: [
                {
                    model: User, // 假設有 User 模型關聯
                    attributes: ["username", "avatar"], // 提取用戶名與頭像
                },
                {
                    model: TripLike, // 關聯 TripLike 表
                    attributes: ["userId"], // 提取按讚的用戶 ID
                },
            ],
        });

        popularTrips = tripDataAll.map(trip => {
            // 計算天數
            const departureDate = new Date(trip.departureDate);
            const endDate = new Date(trip.endDate);
            const timeDifference = endDate - departureDate; // 時間差（毫秒）
            const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1; // 轉換為天數

            return {
                tripInfo: {
                    id: trip.id,
                    userId: trip.userId,
                    username: trip.User?.username || "Unknown", // 從關聯的 User 模型獲取
                    avatar: trip.User?.avatar || "", // 從關聯的 User 模型獲取
                    title: trip.tripName,
                    image: trip.image,
                    day: dayDifference,
                    publishDay: trip.publicAt,
                    labels: trip.label || [],
                    like: trip.likeCount,
                    isLike: trip.trip_likes.some(like => like.userId === userId), // 檢查當前用戶是否按讚
                }
            };
        });
        return res.status(200).json({ status: "success", data: popularTrips });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  對行程點讚
//  2024/11/19 OK
export const favorTrip = async (req, res) => {
    const userId = req.userId;
    const tripId = req.params.id;

    try {
        const isTripExist = await Trip.findByPk(tripId);
        if (!isTripExist) {
            return res.status(404).json({ status: "success", message: "Trip Not Found" });
        }

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
//  2024/11/19 OK
export const deleteTrip = async (req, res) => {
    const userId = req.userId;
    const tripId = req.params.id;

    try {
        // const isTripExist = await Trip.findByPk(tripId);

        // if (!isTripExist) {
        //     // 行程不存在
        //     return res.status(404).json({ status: "error", message: "Trip Not Found" });
        // }

        // // 確認行程是否屬於當前使用者
        // if (isTripExist.userId !== userId) {
        //     // 使用者無權限刪除別人的行程
        //     return res.status(403).json({ status: "error", message: "You are not allowing to delete this trip." });
        // }

        // // Set the finalPlanId to null to remove foreign key reference
        // await Trip.update(
        //     { finalPlanId: null },
        //     { where: { id: tripId } }
        // );

        // // 刪除與該行程相關的資料
        // // 刪除與該行程相關的 TripShare 和 TripLike 記錄
        // await TripShare.destroy({ where: { tripId: tripId } });
        // await TripLike.destroy({ where: { tripId: tripId } });

        // // 刪除與該行程相關的所有 Plan 及其相關的 Day 和 Attraction
        // const plans = await Plan.findAll({ where: { tripId: tripId } });

        // for (const plan of plans) {
        //     const days = await Day.findAll({ where: { planId: plan.id } });

        //     // 刪除每個 Day 對應的 Attraction
        //     for (const day of days) {
        //         await Attraction.destroy({ where: { dayId: day.id } });
        //     }

        //     // 刪除 Day
        //     await Day.destroy({ where: { planId: plan.id } });
        // }

        // // 刪除 Plan
        // await Plan.destroy({ where: { tripId: tripId } });

        // // 最後，刪除 Trip 本身
        // await isTripExist.destroy();

        // return res.status(200).json({ status: "success", message: "The trip and all related data have been deleted." });
        const isTripExist = await Trip.findByPk(tripId);

        if (!isTripExist) {
            // 行程不存在
            return res.status(404).json({ status: "error", message: "Trip Not Found" });
        }

        // 確認行程是否屬於當前使用者
        if (isTripExist.userId !== userId) {
            // 使用者無權限刪除別人的行程
            return res.status(403).json({ status: "error", message: "You are not allowed to delete this trip." });
        }

        // 刪除 Trip 本身，並自動刪除相關的 TripShare, TripLike, Plan, Day, and Attraction
        await isTripExist.destroy();

        return res.status(200).json({ status: "success", message: "The trip and all related data have been deleted." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
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
        };

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
        // 檢查是否已經存在相同的收藏
        const existingCollection = await Collection.findOne({
            where: {
                userId: userId,
                googlePlaceId: googlePlaceId,
            }
        });
        if (existingCollection) {
            await Collection.destroy({ where: { userId: userId, googlePlaceId: googlePlaceId } });
            return res.status(200).json({ status: "success", message: "The Google Place had deleted." });
        } else {
            return res.status(404).json({ status: "error", message: "Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  取得所有收藏景點
export const getCollection = async (req, res) => {
    const userId = req.userId;

    try {
        const collectionInfo = await Collection.findAll({ where: { userId: userId } });

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

// /* searchTripById會需要行程是否公開、是否有共編權限，這些邏輯來判斷是否可以讓user查詢 */
// //  根據Trip ID搜尋行程
// //  2024/11/19暫時關閉，因為不會用到，程式邏輯需修改
// export const searchTripById = async (req, res, next) => {
//     const tripId = req.params.id;
//     let tripDataById = [];

//     try {
//         const trip = await Trip.findByPk(tripId);

//         // 檢查行程是否存在
//         if (!trip) {
//             return res.status(404).json({ status: "error", message: "Trip not found" });
//         }

//         // 檢查行程是否為公開的，假設 req.userId 是當前使用者的 ID，這個部分的權限需要再確認
//         // 如果這兩個條件都成立，代表當前用戶無法查看這個私密行程，程式會停止執行，並返回一個 403，但是還得確認其他權限關係
//         if (!trip.isPublic && trip.userId !== req.userId) {
//             return res.status(403).json({ status: "error", message: "You do not have permission to view this trip." });
//         }

//         // tripInfo 返回資料
//         tripDataById.tripInfo = {
//             id: trip.id,
//             userId: trip.userId,
//             title: trip.tripName,
//             image: trip.image,
//             personalEditPermission: 0, // 默認為 0，如果有權限邏輯，根據實際情況修改
//             finalPlanId: trip.finalPlanId,
//             departureDate: trip.departureDate,
//             endDate: trip.endDate,
//             labels: trip.label || [],
//             like: trip.likeCount,
//             linkPermission: trip.linkPermission,
//             isPublic: trip.isPublic,
//             publishDay: trip.publicAt,
//         };
//         tripDataById.plans = [];

//         return res.status(200).json({ status: "success", data: tripDataById });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: "error", message: "Internal server error" });
//     }
// }

//  建立行程
//  2024/11/19 OK
//  已移動至trip.edit
// export const createTrip = async (req, res) => {
//     const { name, startTime, endTime } = req.body;
//     const userId = req.userId;
//     const tripAvatar = req.file;    //  image can be null;

//     try {
//         let tripAvatarPath = null;

//         if (tripAvatar) {
//             tripAvatarPath = `/uploads/trips/${tripAvatar.filename}`;
//         }

//         const newTrip = await Trip.create({
//             userId: userId,
//             tripName: name,
//             image: tripAvatarPath,
//             departureDate: startTime,
//             endDate: endTime,
//         });

//         // const userInfo = await User.findByPk(userId);

//         const defaultPlan = await Plan.create({
//             tripId: newTrip.id,
//         });

//         newTrip.finalPlanId = defaultPlan.id;
//         await newTrip.save();

//         // 初始化天數：根據開始日和結束日動態生成
//         let prevDay = null;
//         let firstDay = null;
//         const startDate = new Date(startTime);
//         const endDate = new Date(endTime);
//         let currentDate = new Date(startDate);
//         const dayList = [];

//         while (currentDate <= endDate) {
//             // 創建每一天的 Day
//             const newDay = await Day.create({
//                 planId: defaultPlan.id,
//             });

//             // 如果是第一天，設置 startDayId
//             if (!firstDay) {
//                 firstDay = newDay;
//                 defaultPlan.startDayId = newDay.id;
//                 await defaultPlan.save();
//             }

//             // 如果有前一天，設置前一天的 nextDayId
//             if (prevDay) {
//                 prevDay.nextDayId = newDay.id;
//                 await prevDay.save();
//             }

//             // // 為新一天創建一個空的 Attraction
//             // const defaultAttraction = await Attraction.create({
//             //     dayId: newDay.id,
//             // });

//             // // 更新 Day 的 startAttractionId 為新創建的 Attraction
//             // newDay.startAttractionId = defaultAttraction.id;
//             // await newDay.save();

//             // 新增至 dayList
//             dayList.push({
//                 day: {
//                     id: newDay.id,
//                     planId: newDay.planId,
//                     startAttractionId: newDay.startAttractionId,
//                     nextDayId: newDay.nextDayId,
//                     createdAt: newDay.createdAt,
//                     updatedAt: newDay.updatedAt,
//                 },
//                 attrList: []
//             });

//             // 更新 prevDay 為當前創建的 Day
//             prevDay = newDay;

//             // 日期遞增一天
//             currentDate.setDate(currentDate.getDate() + 1);
//         }

//         // 設置 nextDayId
//         for (let i = 0; i < dayList.length - 1; i++) {
//             dayList[i].day.nextDayId = dayList[i + 1].day.id; // 更新當前 day 的 nextDayId 為下一天的 ID
//         }

//         return res.status(201).json({
//             status: "success", data: {
//                 tripInfo: {
//                     id: newTrip.id,
//                     userId: newTrip.userId,
//                     title: newTrip.tripName,
//                     image: newTrip.image,
//                     personalEditPermission: 1, // Assuming a default value; update as needed
//                     finalPlanId: newTrip.finalPlanId,
//                     departureDate: newTrip.departureDate,
//                     endDate: newTrip.endDate,
//                     labels: newTrip.label || [],
//                     like: newTrip.likeCount || 0,
//                     linkPermission: newTrip.linkPermission || false,
//                     isPublic: newTrip.isPublic || false,
//                     publishDay: newTrip.publicAt || null,
//                 },
//                 plans: [
//                     {
//                         id: defaultPlan.id,
//                         name: defaultPlan.name || "方案一", // Adjust naming logic if needed
//                         days: dayList,
//                     },
//                 ],
//             }
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ status: "error", message: "Internal server error" });
//     }
// }

//  取得行程資料，有bug，其他plan的資料不會被call出來
// export const getTrip = async (req, res) => {
//     const tripId = req.params.id;

//     try {
//         // Fetch trip with all plans and associated days
//         const trip = await Trip.findByPk(tripId, {
//             include: [
//                 { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] },
//                 { model: Plan, as: 'plans', include: [{ model: Day, as: 'days', include: [{ model: Attraction, as: 'attractions' }] }] }
//             ]
//         });

//         if (!trip) {
//             return res.status(404).json({ status: "error", message: "Trip not found" });
//         }

//         // Flatten days from all plans
//         let allDays = trip.plans.reduce((acc, plan) => {
//             return acc.concat(plan.days);
//         }, []);

//         console.log("All Days:", allDays);

//         // Find all used nextDayIds
//         const usedNextDayIds = new Set(allDays.map(day => day.nextDayId).filter(id => id !== null));

//         // Find the first day (not used in nextDayId and nextDayId is not null)
//         let currentDay = allDays.find(day => !usedNextDayIds.has(day.id) && day.nextDayId !== null);

//         // Sort days based on nextDayId
//         let sortedDays = [];

//         while (currentDay) {
//             sortedDays.push(currentDay);
//             currentDay = allDays.find(day => day.id === currentDay.nextDayId); // Find the next day
//         }

//         // Construct dayList and sort attractions
//         const planList = await Promise.all(trip.plans.map(async (plan) => {
//             const sortedPlanDays = sortedDays.filter(day => day.planId === plan.id);
//             console.log("Sorted Plan Days for Plan ID:", plan.id, sortedPlanDays);


//             const dayList = await Promise.all(sortedPlanDays.map(async (day) => {
//                 const attrList = await Attraction.findAll({
//                     where: { dayId: day.id },
//                     order: [['startAt', 'ASC']], // Sort by startAt
//                 });

//                 return {
//                     day: {
//                         id: day.id,
//                         planId: day.planId,
//                         startAttractionId: day.startAttractionId,
//                         nextDayId: day.nextDayId,
//                         createdAt: day.createdAt,
//                         updatedAt: day.updatedAt,
//                     },
//                     attrList: attrList.map(attr => ({
//                         id: attr.id,
//                         dayId: attr.dayId,
//                         startAt: attr.startAt,
//                         endAt: attr.endAt,
//                         note: attr.note,
//                         googlePlaceId: attr.googlePlaceId,
//                         nextAttractionId: attr.nextAttractionId
//                     }))
//                 };
//             }));
//             return {
//                 planId: plan.id,
//                 dayList: dayList
//             };
//         }));

//         // Return data
//         return res.status(200).json({
//             status: "success",
//             data: {
//                 tripInfo: {
//                     id: trip.id,
//                     userId: trip.userId,
//                     title: trip.tripName,
//                     image: trip.image,
//                     finalPlanId: trip.finalPlanId,
//                     departureDate: trip.departureDate,
//                     ndDate: trip.endDate,
//                     linkPermission: trip.linkPermission,
//                     publishDay: trip.publicAt,
//                     labels: trip.label || [],
//                     like: trip.likeCount,
//                     labels: trip.label || [],
//                     isPublic: trip.isPublic,
//                 },
//                 // user: {
//                 //     id: trip.user.id,
//                 //     name: trip.user.username,
//                 //     email: trip.user.email,
//                 // },
//                 planList: planList, // Return plans with dayList
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: "error", message: "Internal server error" });
//     }
// };

//  取得行程資料，目前測試OK
//  2024/11/19 OK
//  已移動至trip.edit.controller
// export const getTrip = async (req, res) => {
//     const tripId = req.params.id;
//     const userId = req.userId;
//     let editPermission = null;

//     try {
//         // Fetch trip with all plans and associated days
//         const trip = await Trip.findByPk(tripId, {
//             include: [
//                 { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] },
//                 { model: Plan, as: 'plans', include: [{ model: Day, as: 'days', include: [{ model: Attraction, as: 'attractions' }] }] }
//             ]
//         });

//         if (trip.userid !== userId) {
//             //  call這個getTrip時，會傳回使用者的permission，然後前端判斷是否有權限編輯或是檢視
//             editPermission = await TripShare.findOne({ where: { userId: userId, tripId: tripId } });
//         }

//         if (!trip) {
//             return res.status(404).json({ status: "error", message: "Trip not found" });
//         }

//         // Flatten days from all plans
//         let allDays = trip.plans.reduce((acc, plan) => {
//             return acc.concat(plan.days);
//         }, []);

//         // console.log("All Days:", allDays);

//         // Find all used nextDayIds
//         const usedNextDayIds = new Set(allDays.map(day => day.nextDayId).filter(id => id !== null));

//         // Sort days for each plan
//         const sortedDaysByPlan = trip.plans.map(plan => {
//             let currentDay = plan.days.find(day => !usedNextDayIds.has(day.id) && day.nextDayId !== null);
//             let sortedDays = [];

//             while (currentDay) {
//                 sortedDays.push(currentDay);
//                 currentDay = plan.days.find(day => day.id === currentDay.nextDayId); // Find the next day
//             }

//             return {
//                 planId: plan.id,
//                 sortedDays: sortedDays
//             };
//         });

//         // Construct dayList and sort attractions
//         const planList = await Promise.all(trip.plans.map(async (plan) => {
//             const sortedPlanDays = sortedDaysByPlan.find(p => p.planId === plan.id).sortedDays;
//             // console.log("Sorted Plan Days for Plan ID:", plan.id, sortedPlanDays);

//             const dayList = await Promise.all(sortedPlanDays.map(async (day) => {
//                 const attrList = await Attraction.findAll({
//                     where: { dayId: day.id },
//                     // order: [['startAt', 'ASC']], // Sort by startAt
//                 });

//                 return {
//                     day: {
//                         id: day.id,
//                         planId: day.planId,
//                         startAttractionId: day.startAttractionId,
//                         nextDayId: day.nextDayId,
//                         createdAt: day.createdAt,
//                         updatedAt: day.updatedAt,
//                     },
//                     attrList: attrList.map(attr => ({
//                         id: attr.id,
//                         dayId: attr.dayId,
//                         startAt: attr.startAt,
//                         endAt: attr.endAt,
//                         note: attr.note,
//                         googlePlaceId: attr.googlePlaceId,
//                         nextAttractionId: attr.nextAttractionId
//                     }))
//                 };
//             }));
//             return {
//                 planId: plan.id,
//                 planName: plan.name,
//                 dayList: dayList
//             };
//         }));

//         // Return data
//         return res.status(200).json({
//             status: "success",
//             data: {
//                 tripInfo: {
//                     id: trip.id,
//                     userId: trip.userId,
//                     title: trip.tripName,
//                     image: trip.image,
//                     personalEditPermission: editPermission?.permission || 1,
//                     finalPlanId: trip.finalPlanId,
//                     departureDate: trip.departureDate,
//                     endDate: trip.endDate,
//                     labels: trip.label || [],
//                     like: trip.likeCount || 0,
//                     linkPermission: trip.linkPermission,
//                     isPublic: trip.isPublic,
//                     publishDay: trip.publicAt,
//                 },
//                 planList: planList, // Return plans with dayList
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: "error", message: "Internal server error" });
//     }
// };

// //  更新行程資訊，未實作
// export const updateTripInfo = async (req, res) => {

// }

//  把景點加入方案的邏輯
//  新增景點
//  要把attraction邏輯修改，跟每天的第一個景點被加入時，要判斷day的startAttrcationId is null or not
//  已移動至trip.edit.controller
// export const placeToPlan = async (req, res) => {
//     const { googlePlaceId, dayId } = req.body;
//     const tripId = req.params.id;

//     try {
//         // 查找對應的 Day
//         const day = await Day.findByPk(dayId);
//         if (!day) {
//             return res.status(404).json({ status: "error", message: "Day not found" });
//         }

//         // 如果該天的第一個景點尚未初始化（startAttractionId 為 null），直接創建完整的第一個景點
//         if (!day.startAttractionId) {
//             const newAttraction = await Attraction.create({
//                 dayId: dayId,
//                 googlePlaceId: googlePlaceId,
//                 nextAttractionId: null, // 因為是第一個景點，沒有下一個
//             });

//             // 更新 day 的 startAttractionId
//             await day.update({ startAttractionId: newAttraction.id });

//             return res.status(201).json({
//                 status: "success",
//                 data: newAttraction,
//                 message: "First attraction for the day has been added",
//             });
//         }

//         // 查找當前第一個景點
//         let currentAttraction = await Attraction.findByPk(day.startAttractionId);

//         // while迴圈，找到鏈表的最後一個景點
//         while (currentAttraction.nextAttractionId) {
//             currentAttraction = await Attraction.findByPk(currentAttraction.nextAttractionId);
//         }

//         // 創建新景點，並鏈接到當前最後一個景點
//         const newAttraction = await Attraction.create({
//             dayId: dayId,
//             googlePlaceId: googlePlaceId,
//             nextAttractionId: null, // 新景點的下一個為 null，表示它是最後一個
//         });

//         // 更新當前最後一個景點的 nextAttractionId
//         await currentAttraction.update({ nextAttractionId: newAttraction.id });

//         // if (!currentAttraction) {
//         //     return res.status(404).json({ status: "error", message: "No attraction found for this day" });
//         // }

//         // // 檢查初始化的 attraction 是否為空景點（即檢查 googlePlaceId 或 startAt 等欄位是否為空）
//         // if (!currentAttraction.googlePlaceId && !currentAttraction.startAt) {
//         //     // 覆蓋空景點
//         //     await currentAttraction.update({
//         //         googlePlaceId: googlePlaceId
//         //     });

//         //     return res.status(201).json({
//         //         status: "success",
//         //         data: currentAttraction,
//         //         message: "Empty attraction has been overwritten"
//         //     });
//         // }

//         // // 找到插入位置，開始遍歷 attraction 鏈表
//         // let previousAttraction = null;

//         // while (currentAttraction && (new Date(currentAttraction.startAt) < new Date(startAt))) {
//         //     previousAttraction = currentAttraction;
//         //     if (currentAttraction.nextAttractionId) {
//         //         currentAttraction = await Attraction.findByPk(currentAttraction.nextAttractionId);
//         //     } else {
//         //         break; // 沒有更多的景點了
//         //     }
//         // }

//         // // 創建新景點
//         // const newAttraction = await Attraction.create({
//         //     dayId: dayId,
//         //     googlePlaceId: googlePlaceId,
//         //     nextAttractionId: currentAttraction ? currentAttraction.id : null,
//         // });

//         // // After creating new attraction
//         // if (!previousAttraction) {
//         //     // If there are no previous attractions, this new attraction becomes the first
//         //     await day.update({ startAttractionId: newAttraction.id });
//         // } else {
//         //     // Link the new attraction to the previous attraction
//         //     await previousAttraction.update({ nextAttractionId: newAttraction.id });
//         // }

//         // if (currentAttraction) {
//         //     // Link the current attraction back to the new attraction
//         //     await currentAttraction.update({ previousAttractionId: newAttraction.id });
//         // }

//         // // 避免最後一個attraction的nextAttractionId設定為currentAttraction.id，因為在newAttraction會先設定，而這邊會重新確認是否為最後
//         // if ((currentAttraction.nextAttractionId === newAttraction.id) && (newAttraction.nextAttractionId === currentAttraction.id)) {
//         //     await newAttraction.update({ nextAttractionId: null })
//         // }

//         return res.status(201).json({
//             status: "success",
//             data: newAttraction,
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ status: "error", message: "Internal server error" });
//     }
// }

// //  建立方案ABC...
// //  方案比較功能已停止開發
// export const createPlan = async (req, res) => {
//     const tripId = req.params.id;
//     const { name, startAt, endAt } = req.body;

//     try {
//         // 確認行程是否存在
//         const trip = await Trip.findByPk(tripId);
//         if (!trip) {
//             return res.status(404).json({ status: "error", message: "Trip not found" });
//         }

//         // 創建新的方案
//         const newPlan = await Plan.create({
//             tripId: tripId,
//             name: name
//         });

//         // 初始化天數：根據開始日和結束日動態生成
//         let prevDay = null;
//         let firstDay = null;
//         const startDate = new Date(startAt);
//         const endDate = new Date(endAt);
//         let currentDate = new Date(startDate);
//         const dayList = [];

//         while (currentDate <= endDate) {
//             // 創建每一天的 Day
//             const newDay = await Day.create({
//                 planId: newPlan.id,
//             });

//             // 如果是第一天，設置 startDayId
//             if (!firstDay) {
//                 firstDay = newDay;
//                 newPlan.startDayId = newDay.id;
//                 await newPlan.save();
//             }

//             // 如果有前一天，設置前一天的 nextDayId
//             if (prevDay) {
//                 prevDay.nextDayId = newDay.id;
//                 await prevDay.save();
//             }

//             // 為新一天創建一個空的 Attraction
//             const defaultAttraction = await Attraction.create({
//                 dayId: newDay.id,
//             });

//             // 更新 Day 的 startAttractionId 為新創建的 Attraction
//             newDay.startAttractionId = defaultAttraction.id;
//             await newDay.save();

//             // 新增至 dayList
//             dayList.push({
//                 day: {
//                     id: newDay.id,
//                     planId: newDay.planId,
//                     startAttractionId: newDay.startAttractionId,
//                     nextDayId: newDay.nextDayId,
//                     createdAt: newDay.createdAt,
//                     updatedAt: newDay.updatedAt,
//                 },
//                 attrList: {
//                     id: defaultAttraction.id,
//                     dayId: defaultAttraction.dayId,
//                     startAt: defaultAttraction.startAt,
//                     endAt: defaultAttraction.endAt,
//                     note: defaultAttraction.note,
//                     googlePlaceId: defaultAttraction.googlePlaceId,
//                     nextAttractionId: defaultAttraction.nextAttractionId
//                 }
//             });

//             // 更新 prevDay 為當前創建的 Day
//             prevDay = newDay;

//             // 日期遞增一天
//             currentDate.setDate(currentDate.getDate() + 1);
//         }

//         // 設置 nextDayId
//         for (let i = 0; i < dayList.length - 1; i++) {
//             dayList[i].day.nextDayId = dayList[i + 1].day.id; // 更新當前 day 的 nextDayId 為下一天的 ID
//         }

//         return res.status(201).json({
//             status: "success",
//             data: {
//                 planId: newPlan.id,
//                 dayList: dayList,
//             },
//             message: "A plan has been added and initialized."
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: "error", message: "Internal server error" });
//     }
// }

//  更新方案資料，未做
// export const updatePlan = async (req, res) => {

// }

//  取得某行程的所有Plan
// export const getPlan = async (req, res) => {
//     const tripId = req.params.id;

//     try {
//         const plansInfo = await Plan.findAll({ where: { tripId: tripId } });

//         // Test 前端資料接收格式
//         let plans = plansInfo.map(plan => ({
//             id: plan.id,
//             name: plan.name,
//             is_final: plan.isFinal,
//             trip_id: plan.tripId,
//             startDayId: plan.startDayId,
//         }));
//         return res.status(200).json({ status: "success", data: plans });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: "error", message: "Internal server error" });
//     }
// }

//  新增天數or插入天數（為了加快速度，前端可以先省插入步驟）
// export const addDay = async (req, res) => {
//     const { planId, preDayId } = req.body;

//     try {
//         const planExists = await Plan.findByPk(planId);
//         if (!planExists) {
//             return res.status(404).json({ status: "error", message: "Plan not found" });
//         }

//         const prevDay = await Day.findByPk(preDayId);
//         if (!prevDay) {
//             return res.status(404).json({ status: "error", message: "Day not found" });
//         }

//         const nextDay = await Day.create({
//             planId: planId,
//             nextDayId: prevDay.nextDayId,   //  如果是插入天數就會有值；若是加入至最後則為null(視preDay.nextDayId是否有值)
//         });

//         prevDay.nextDayId = nextDay.id;
//         await prevDay.save();

//         return res.status(201).json({ status: "success", message: "An day had been added" });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: "error", message: "Internal server error" });
//     }
// }

//  將某天對調（先省略，因為我覺得意義不大）
// export const changeDayBetween = async (req, res) => {

// }

//  取得某Plan的所有DaysId，並回傳給前端，前端需要再用這些ID，當使用者點某一天時，拿這個ID去call後端拿attraction資料
//  但我覺得直接call getTrip就好了，一次刷新比較簡單，所以目前後端測試用
// export const getDay = async (req, res) => {
//     const { planId } = req.body;

//     try {
//         const selectedPlan = await Plan.findByPk(planId);
//         if (!selectedPlan) {
//             return res.status(404).json({ status: "error", message: "Plan not found" });
//         }

//         //  一個plan可能會有好幾個Day，該如何loop檢查Day.nextDayId並傳回該plan的所有Day
//         //  開始遞迴獲取所有 Day
//         const getAllDays = async (currentDayId, daysId = []) => {
//             if (!currentDayId) return daysId;

//             // 查找當前的 Day
//             const currentDay = await Day.findByPk(currentDayId);

//             if (!currentDay) return daysId; // 如果找不到，返回當前已收集的 days

//             // 將當前 DayId 加入 days 陣列
//             daysId.push(currentDay.id);

//             // 遞迴查找下一個 Day
//             return getAllDays(currentDay.nextDayId, daysId);
//         };

//         // 從 Plan 的 startDayId 開始查找
//         const allDays = await getAllDays(selectedPlan.startDayId);

//         return res.status(200).json({
//             status: "success",
//             data: allDays,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: "error", message: "Internal server error" });
//     }
// }

//  取得某Day的所有Attraction資料
//  邏輯仍須修改，例如確認tripId? or planId
// export const getAttraction = async (req, res) => {
//     const { dayId } = req.body;

//     try {
//         const daysAttraction = await Attraction.findAll({ where: { dayId: dayId }, order: [['startAt', 'ASC']] });

//         // Test 前端資料接收格式
//         let attractions = daysAttraction.map(attra => ({
//             id: attra.id,
//             day_id: attra.dayId,
//             start_at: attra.startAt,
//             end_at: attra.endAt,
//             note: attra.note,
//             google_place_id: attra.googlePlaceId,
//             next_attraction_id: attra.nextAttractionId || null,
//         }));
//         return res.status(200).json({ status: "success", data: attractions });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: "error", message: "Internal server error" });
//     }
// }
