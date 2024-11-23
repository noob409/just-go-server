import Trip from "../../models/trip.js";
import TripShare from "../../models/trip_share.js";
import User from "../../models/user.js";
import Plan from "../../models/plan.js";
import Day from "../../models/day.js";
import Attraction from "../../models/attraction.js";

//  建立行程
//  2024/11/19 OK
export const createTrip = async (req, res) => {
  const { name, startTime, endTime } = req.body;
  const userId = req.userId;
  const tripAvatar = req.file; //  image can be null;

  try {
    let tripAvatarPath = null;

    if (tripAvatar) {
      tripAvatarPath = `/uploads/trips/${tripAvatar.filename}`;
    }

    const newTrip = await Trip.create({
      userId: userId,
      tripName: name,
      image: tripAvatarPath,
      departureDate: startTime,
      endDate: endTime,
    });

    const defaultPlan = await Plan.create({
      tripId: newTrip.id,
    });

    newTrip.finalPlanId = defaultPlan.id;
    await newTrip.save();

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

      // 新增至 dayList
      dayList.push({
        id: newDay.id,
        planId: newDay.planId,
        startAttractionId: newDay.startAttractionId,
        nextDayId: newDay.nextDayId,
        createdAt: newDay.createdAt,
        updatedAt: newDay.updatedAt,
        attrList: [],
      });

      // 更新 prevDay 為當前創建的 Day
      prevDay = newDay;

      // 日期遞增一天
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 設置 nextDayId
    for (let i = 0; i < dayList.length - 1; i++) {
      dayList[i].nextDayId = dayList[i + 1].id; // 更新當前 day 的 nextDayId 為下一天的 ID
    }

    return res.status(201).json({
      status: "success",
      data: {
        tripInfo: {
          id: newTrip.id,
          userId: newTrip.userId,
          title: newTrip.tripName,
          image: newTrip.image,
          personalEditPermission: 1, // Assuming a default value; update as needed
          finalPlanId: newTrip.finalPlanId,
          departureDate: newTrip.departureDate,
          endDate: newTrip.endDate,
          labels: newTrip.label || [],
          like: newTrip.likeCount || 0,
          linkPermission: newTrip.linkPermission || false,
          isPublic: newTrip.isPublic || false,
          publishDay: newTrip.publicAt || null,
        },
        plans: [
          {
            id: defaultPlan.id,
            name: defaultPlan.name,
            days: dayList,
          },
        ],
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

// //  取得行程資料(詳細版本)，目前測試OK
// export const getTrip = async (req, res) => {
//   const tripId = req.params.id;
//   const userId = req.userId;
//   let editPermission = null;

//   try {
//     // Fetch trip with all plans and associated days
//     const trip = await Trip.findByPk(tripId, {
//       include: [
//         { model: User, as: "user", attributes: ["id", "username", "avatar"] },
//         {
//           model: Plan,
//           as: "plans",
//           include: [
//             {
//               model: Day,
//               as: "days",
//               include: [{ model: Attraction, as: "attractions" }],
//             },
//           ],
//         },
//       ],
//     });

//     if (!trip) {
//       return res
//         .status(404)
//         .json({ status: "error", message: "Trip not found" });
//     }

//     // 只有當不是trip擁有者呼叫時，才會進到這邊看權限
//     if (trip.userId !== userId) {
//       //  call這個getTrip時，會傳回使用者的permission，然後前端判斷是否有權限編輯或是檢視
//       editPermission = await TripShare.findOne({
//         where: { userId: userId, tripId: tripId },
//       });
//     }

//     // Flatten days from all plans
//     let allDays = trip.plans.reduce((acc, plan) => {
//       return acc.concat(plan.days);
//     }, []);

//     // console.log("All Days:", allDays);

//     // Find all used nextDayIds
//     const usedNextDayIds = new Set(
//       allDays.map((day) => day.nextDayId).filter((id) => id !== null)
//     );

//     // Sort days for each plan
//     const sortedDaysByPlan = trip.plans.map((plan) => {
//       let currentDay = plan.days.find(
//         (day) => !usedNextDayIds.has(day.id) && day.nextDayId !== null
//       );
//       let sortedDays = [];

//       while (currentDay) {
//         sortedDays.push(currentDay);
//         currentDay = plan.days.find((day) => day.id === currentDay.nextDayId); // Find the next day
//       }

//       return {
//         id: plan.id,
//         sortedDays: sortedDays,
//       };
//     });

//     // Construct dayList and sort attractions
//     const planList = await Promise.all(
//       trip.plans.map(async (plan) => {
//         const sortedPlanDays = sortedDaysByPlan.find(
//           (p) => p.id === plan.id
//         ).sortedDays;
//         // console.log("Sorted Plan Days for Plan ID:", plan.id, sortedPlanDays);

//         const dayList = await Promise.all(
//           sortedPlanDays.map(async (day) => {
//             const attrList = await Attraction.findAll({
//               where: { dayId: day.id },
//               // order: [['startAt', 'ASC']], // Sort by startAt
//             });

//             return {
//               id: day.id,
//               planId: day.planId,
//               startAttractionId: day.startAttractionId,
//               nextDayId: day.nextDayId,
//               createdAt: day.createdAt,
//               updatedAt: day.updatedAt,
//               attrList: attrList.map((attr) => ({
//                 id: attr.id,
//                 dayId: attr.dayId,
//                 startAt: attr.startAt,
//                 endAt: attr.endAt,
//                 note: attr.note,
//                 googlePlaceId: attr.googlePlaceId,
//                 nextAttractionId: attr.nextAttractionId,
//               })),
//             };
//           })
//         );
//         return {
//           id: plan.id,
//           name: plan.name,
//           days: dayList,
//         };
//       })
//     );

//     // Return data
//     return res.status(200).json({
//       status: "success",
//       data: {
//         tripInfo: {
//           id: trip.id,
//           userId: trip.userId,
//           title: trip.tripName,
//           image: trip.image,
//           personalEditPermission: editPermission?.permission || 1,
//           finalPlanId: trip.finalPlanId,
//           departureDate: trip.departureDate,
//           endDate: trip.endDate,
//           labels: trip.label || [],
//           like: trip.likeCount || 0,
//           linkPermission: trip.linkPermission,
//           isPublic: trip.isPublic,
//           publishDay: trip.publicAt,
//         },
//         planList: planList, // Return plans with dayList
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ status: "error", message: "Internal server error" });
//   }
// };

//  取得行程資訊(only TripInfo)
export const getTrip = async (req, res) => {
  const tripId = req.params.id;
  const userId = req.userId;
  let editPermission = null;

  try {
    // Fetch only trip basic info and owner details
    const trip = await Trip.findByPk(tripId, {
      include: [
        { model: User, as: "user", attributes: ["id", "username", "avatar"] },
      ],
    });

    if (!trip) {
      return res
        .status(404)
        .json({ status: "error", message: "Trip not found" });
    }

    // Check edit permission if not the owner
    if (trip.userId !== userId) {
      editPermission = await TripShare.findOne({
        where: { userId: userId, tripId: tripId },
      });
    }

    // Return only tripInfo
    return res.status(200).json({
      status: "success",
      data: {
        tripInfo: {
          id: trip.id,
          userId: trip.userId,
          title: trip.tripName,
          image: trip.image,
          personalEditPermission: editPermission?.permission || 1,
          finalPlanId: trip.finalPlanId,
          departureDate: trip.departureDate,
          endDate: trip.endDate,
          labels: trip.label || [],
          like: trip.likeCount || 0,
          linkPermission: trip.linkPermission,
          isPublic: trip.isPublic,
          publishDay: trip.publicAt,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
}

//  更新行程資訊 by figma
export const updateTripInfo = async (req, res) => {
  const { tripIntro, hashtags } = req.body;
  const tripId = req.params.id;
  const userId = req.userId;
  const tripAvatar = req.file;

  try {
    const trip = await Trip.findByPk(tripId);
    if (!trip) {
      return res.status(404).json({ status: "error", message: "Trip Not Foun" });
    }

    if (trip.userId !== userId) {
      return res.status(403).json({ status: "error", message: "Forbidden" });
    }

    // 處理標籤 (hashtags)，確保是陣列形式
    let updatedHashtags = [];
    if (Array.isArray(hashtags)) {
      updatedHashtags = hashtags;
    } else if (typeof hashtags === "string") {
      updatedHashtags = hashtags.split(",").map((tag) => tag.trim());
    }

    // 處理封面圖片更新
    let tripAvatarPath = trip.image; // 預設使用現有的圖片
    if (tripAvatar) {
      tripAvatarPath = `/uploads/trips/${tripAvatar.filename}`;
    }

    // 更新行程資料
    await trip.update({
      introduction: tripIntro || trip.introduction, // 如果提供了行程介紹，則更新；否則保留原有值
      label: updatedHashtags.length > 0 ? updatedHashtags : trip.label, // 如果有標籤，則更新；否則保留原有值
      image: tripAvatarPath, // 更新封面圖片路徑 (若無新圖片，則保留原有值)
    });

    // 回傳更新後的行程資訊
    return res.status(200).json({
      status: "success",
      data: {
        tripInfo: {
          id: trip.id,
          userId: trip.userId,
          title: trip.tripName,
          image: trip.image,
          personalEditPermission: 1, // 假設預設值
          finalPlanId: trip.finalPlanId,
          departureDate: trip.departureDate,
          endDate: trip.endDate,
          labels: trip.label || [],
          like: trip.likeCount || 0,
          linkPermission: trip.linkPermission,
          isPublic: trip.isPublic,
          publishDay: trip.publicAt,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
}

//  把景點加入方案的邏輯，新增景點
//  2024/11/19 OK
export const placeToPlan = async (req, res) => {
  const { googlePlaceId, dayId, previousAttractionId } = req.body;
  const tripId = req.params.id;

  try {
    // 查找對應的 Day
    const day = await Day.findByPk(dayId);
    if (!day) {
      return res
        .status(404)
        .json({ status: "error", message: "Day not found" });
    }

    // 如果該天的第一個景點尚未初始化（startAttractionId 為 null），直接創建完整的第一個景點
    if (!day.startAttractionId) {
      const newAttraction = await Attraction.create({
        dayId: dayId,
        googlePlaceId: googlePlaceId,
        nextAttractionId: null, // 因為是第一個景點，沒有下一個
      });

      // 更新 day 的 startAttractionId
      await day.update({ startAttractionId: newAttraction.id });

      return res.status(201).json({
        status: "success",
        data: newAttraction,
        message: "First attraction for the day has been added",
      });
    }

    // 如果前端提供了最後一個景點的 ID
    if (previousAttractionId) {
      // 查找最後一個景點
      const previousAttraction = await Attraction.findByPk(
        previousAttractionId
      );
      if (!previousAttraction) {
        return res
          .status(404)
          .json({ status: "error", message: "Final attraction not found" });
      }

      // 創建新景點並鏈接到最後一個景點
      const newAttraction = await Attraction.create({
        dayId: dayId,
        googlePlaceId: googlePlaceId,
        nextAttractionId: previousAttraction.nextAttractionId, // 新景點的下一個為 null，表示它是最後一個
      });

      // 更新 previousAttraction 的 nextAttractionId 指向新景點
      await previousAttraction.update({ nextAttractionId: newAttraction.id });

      return res.status(201).json({
        status: "success",
        data: newAttraction,
        message: "Attraction has been added to the end of the day",
      });
    } else {
      // 如果沒有提供 finalAttractionId，回傳錯誤
      return res.status(400).json({
        status: "error",
        message: "Previous attraction ID is required to add a new attraction",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};
