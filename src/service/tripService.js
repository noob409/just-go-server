// import Trip from "../models/trip.js";
// import User from "../models/user.js";
// import TripShare from "../models/trip_share.js";
// import TripLike from "../models/trip_like.js";

// import Sequelize from "sequelize";

{/* 此service已被全部移動至controller */}

// 行程管理 -> 我的行程資料獲取
// export const getUserTrips = async (userId) => {
//     try {
//         const ownTrips = await getOwnTrips(userId) || [];

//         const coEditTrips = await getCoEditTrips(userId) || [];

//         return {
//             own: ownTrips,
//             coEdit: coEditTrips
//         };
//     } catch (error) {
//         throw new Error('An error occurred while fetching user trips');
//     }
// };

// 行程管理 -> 我的收藏資料獲取
// export const getKeepTrips = async (userId) => {
//     try {
//         const favorTrips = await getFavorTrips(userId) || [];
//         return favorTrips;
//     } catch (error) {
//         throw new Error('An error occurred while fetching user favor trips');
//     }
// }

// 首頁 熱門行程
// export const getPopularTrips = async () => {
//     try {
//         const tripDataAll = await Trip.findAll({
//             order: [["likeCount", "DESC"]],
//         });

//         if (tripDataAll.length > 0) {
//             const popularTrips = tripDataAll.map(trip => ({
//                 id: trip.id,
//                 user: trip.username,
//                 userId: trip.userId,
//                 title: trip.title,
//                 image: trip.image,
//                 day: trip.day,
//                 publishDay: trip.publishDay,
//                 labels: trip.label || [],
//                 like: trip.likeCount,
//                 islike: trip.isLike,
//                 isPublic: trip.isPublic
//             }));
//             return popularTrips;
//         } else {
//             const popularTrips = [];
//             return popularTrips;
//         }
//     } catch (error) {
//         console.error('An error occurred while fetching popular trips:', error);
//         throw new Error('An error occurred while fetching popular trips');
//     }
// }

// 根據ID搜尋行程
// export const getTripById = async (tripId) => {
//     try {
//         const trip = await Trip.findByPk(tripId);

//         if (trip) {
//             return tripData = {
//                 id: trip.id,
//                 user: trip.username,
//                 userId: trip.userId,
//                 title: trip.title,
//                 image: trip.image,
//                 day: trip.day,
//                 publishDay: trip.publishDay,
//                 labels: trip.label || [],
//                 like: trip.likeCount,
//                 islike: trip.isLike,
//                 isPublic: trip.isPublic
//             };
//         } else {
//             throw new Error('Not Found')
//         }
//     } catch (error) {
//         throw new Error('An error occurred while fetching tripById');
//     }
// }

// 按讚行程，需要做取消或按讚的邏輯
{/* 前端需要改成Post跟傳送tripId and userId */ }
// export const favorTripById = async (userId, tripId) => {
//     try {
//         const alreadyFavor = await TripLike.findOne({ where: { userId: userId, tripId: tripId } });
//         if (alreadyFavor) {
//             await alreadyFavor.destroy();
//             return false;
//         } else {
//             await TripLike.create({
//                 userId: userId,
//                 tripId: tripId
//             });
//             return true;
//         }
//     } catch (error) {
//         throw new Error('An error occurred while doing favorTrip');
//     }
// }

// 刪除行程
{/* 前端需要傳送tripId and userId，以便驗證刪除的trip是屬於該刪除者的 */ }
// export const getDeleteTrip = async (userId, tripId) => {
//     try {
//         const isTripExist = await Trip.findOne({ where: { userId: userId, tripId: tripId } });
//         if (isTripExist) {
//             await isTripExist.destroy();
//             return "The Trip has deleted.";
//         } else {
//             throw new Error('The Trip does not exist.');
//         }
//     } catch (error) {
//         throw new Error('An error occurred while doing deleteTrip');
//     }
// }

{/* Called by getUserTrips */}
const getOwnTrips = async (userId) => {
    try {
        const tripDataAll = await Trip.findAll({
            where: {
                userId: userId,
            }
        });
        if (tripDataAll.length > 0) {
            return ownTrips = tripDataAll.map(trip => ({
                id: trip.id,
                user: trip.username,
                userId: trip.userId,
                title: trip.title,
                image: trip.image,
                day: trip.day,
                publishDay: trip.publishDay,
                labels: trip.label || [],
                like: trip.likeCount,
                islike: trip.isLike,
                isPublic: trip.isPublic
            }));
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('An error occurred while fetching own trips');
    }
}

// Called by getUserTrips，目前尚未傳回permission
const getCoEditTrips = async (userId) => {
    try {
        // Left Outer join，取得TripShare、TripShare交集Trip的資料集，並排除交集中的trip的擁有者是某user的資料。
        const coEditTrips = await TripShare.findAll({
            where: { userId: userId, },
            include: [
                {
                    model: Trip,
                    as: 'trip',
                    where: {
                        userId: {
                            [Sequelize.Op.not]: userId // 排除屬於 userId 的行程
                        }
                    },
                    // // 如果需要有共編擁有者的資訊，則下面的include需保留。
                    // include: [
                    //     {
                    //         model: User,
                    //         as: 'user',
                    //     }
                    // ]
                }
            ]
        });

        if (coEditTrips) {
            return coEditTrips.map(tripShare => ({
                id: tripShare.trip.id,
                user: tripShare.trip.username,
                userId: tripShare.trip.userId,
                title: tripShare.trip.title,
                image: tripShare.trip.image,
                day: tripShare.trip.day,
                publishDay: tripShare.trip.publishDay,
                labels: tripShare.trip.label || [],
                like: tripShare.trip.likeCount,
                islike: tripShare.trip.isLike,
                isPublic: tripShare.trip.isPublic
            }));
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('An error occurred while fetching co-edit trips');
    }
}

// Called by getKeepTrips
const getFavorTrips = async (userId) => {
    try {
        const favorTrips = await TripLike.findAll({
            where: { userId: userId },
            include: [
                {
                    model: Trip,
                    as: 'trip',
                }
            ]
        });

        if (favorTrips) {
            return favorTrips.map(tripFavor => ({
                id: tripFavor.trip.id,
                user: tripFavor.trip.username,
                userId: tripFavor.trip.userId,
                title: tripFavor.trip.title,
                image: tripFavor.trip.image,
                day: tripFavor.trip.day,
                publishDay: tripFavor.trip.publishDay,
                labels: tripFavor.trip.label || [],
                like: tripFavor.trip.likeCount,
                islike: tripFavor.trip.isLike,
                isPublic: tripFavor.trip.isPublic
            }));
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('An error occurred while fetching favor trips');
    }
}