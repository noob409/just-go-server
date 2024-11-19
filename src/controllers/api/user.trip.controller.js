import Sequelize from "sequelize";

import TripShare from "../../models/trip_share.js";
import Trip from "../../models/trip.js";
import TripLike from "../../models/trip_like.js";
import User from "../../models/user.js";

//  行程管理 - 我的行程
//  2024/11/19 OK
export const ownTrip = async (req, res) => {
    const userId = req.userId;

    try {
        // 查詢屬於自己的行程並包含用戶資訊
        const tripDataAll = await Trip.findAll({
            where: {
                userId: userId,
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["username", "avatar"], // 提取用戶名稱與頭像
                },
                {
                    model: TripLike,
                    attributes: ["userId"], // 提取按讚資料
                },
            ],
        });

        // 格式化回傳資料
        const ownData = tripDataAll.map(trip => {
            // 計算行程天數
            const departureDate = new Date(trip.departureDate);
            const endDate = new Date(trip.endDate);
            const timeDifference = endDate - departureDate;
            const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1;

            // 判斷是否按讚
            const isLike = trip.trip_likes.some(like => like.userId === req.userId);

            return {
                id: trip.id,
                userId: trip.userId,
                username: trip.user?.username || "Unknown",
                avatar: trip.user?.avatar || "",
                title: trip.tripName,
                image: trip.image,
                day: dayDifference,
                publishDay: trip.publicAt,
                labels: trip.label || [],
                like: trip.likeCount,
                isLike: isLike,
            };
        });
        return res.status(200).json({ status: "success", data: ownData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  行程管理 - 與我共編
//  2024/11/19 OK
export const coTrip = async (req, res) => {
    const userId = req.userId;

    try {
        {/* 我的行程 - 共編
            Left Outer join，取得TripShare、TripShare交集Trip的資料集，並排除交集中的trip的擁有者是某user的資料 */}
        // 查詢共編行程，排除屬於當前使用者的行程
        const coEditTrips = await TripShare.findAll({
            where: { userId: userId },
            include: [
                {
                    model: Trip,
                    as: 'trip',
                    where: {
                        userId: {
                            [Sequelize.Op.not]: userId, // 排除擁有者是當前用戶的行程
                        },
                    },
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['username', 'avatar'],
                        },
                        {
                            model: TripLike,
                            attributes: ['userId', 'tripId'],
                        }
                    ],
                },
            ],
        });

        // 格式化結果以符合前端要求
        const coEditData = coEditTrips.map(tripShare => {
            const { trip } = tripShare; // 提取 Trip 資料
            const { user, tripLike } = trip || {}; // 提取 Trip 的 User 資料

            return {
                id: trip.id,
                userId: trip?.userId || '',
                username: user?.username || '',
                avatar: user?.avatar || '',
                title: trip?.tripName || '',
                image: trip?.image || '',
                day: trip ? Math.ceil((new Date(trip.endDate) - new Date(trip.departureDate)) / (1000 * 60 * 60 * 24)) + 1 : 0, // 計算天數
                publishDay: trip?.publicAt || '',
                labels: trip?.label || [],
                like: trip?.likeCount || 0,
                isLike: tripLike?.some(like => like.userId === userId && like.tripId === trip.id) || false,
            };
        });
        return res.status(200).json({ status: "success", data: coEditData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  行程管理 - 我的收藏
//  2024/11/19 OK
export const keepTrip = async (req, res) => {
    const userId = req.userId;

    try {
        const favorTrips = await TripLike.findAll({
            where: { userId: userId },
            include: [
                {
                    model: Trip,
                    as: 'trip',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['username', 'avatar'],
                        }
                    ],
                }
            ],
        });

        // 將查詢的結果格式化為所需格式
        const favorData = favorTrips.map(tripFavor => {
            const { trip } = tripFavor; // 提取 Trip 資料
            const { user } = trip || {}; // 提取 Trip 的 User 資料

            return {
                id: trip.id,
                userId: tripFavor.userId,
                username: user?.username || "",
                avatar: user?.avatar || null,
                title: trip?.tripName || null,
                image: trip?.image || null,
                day: trip ? Math.ceil((new Date(trip.endDate) - new Date(trip.departureDate)) / (1000 * 60 * 60 * 24)) + 1 : 0, // 計算天數
                publishDay: trip?.publicAt || null,
                labels: trip?.label || [],
                like: trip?.likeCount || 0,
                isLike: true, // 因為是收藏的行程，設置為 true
            };
        });
        return res.status(200).json({ status: "success", data: favorData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}