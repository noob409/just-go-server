import Trip from "../../models/trip.js";
import TripLike from "../../models/trip_like.js";
import TripShare from "../../models/trip_share.js";

import Sequelize from "sequelize";

// 行程管理 - 我的行程
export const ownTrip = async (req, res) => {
    const userId = req.userId;
    let ownData = [];
    let coEditData = [];
    try {
        // 我的行程 - 屬於自己的行程
        const tripDataAll = await Trip.findAll({
            where: {
                userId: userId,
            }
        });
        if (tripDataAll.length > 0) {
            ownData = tripDataAll.map(trip => ({
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
        };

        // 我的行程 - 共編
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
                    // 如果需要有共編擁有者的資訊，則下面的include需保留。
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
            coEditData = coEditTrips.map(tripShare => ({
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
        };
        return res.status(200).json({ status: "success", data: { ownData, coEditData } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  行程管理 - 我的收藏
export const keepTrip = async (req, res) => {
    const userId = req.userId;
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
            const favorData = favorTrips.map(tripFavor => ({
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
            return res.status(200).json({ status: "success", data: favorData })
        } else {
            return res.status(200).json({ status: "success", data: null });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  首頁 - 熱門行程，目前以點讚數遞減傳回。
export const popularTrips = async (req, res) => {
    let popularTrips = [];
    try {
        const tripDataAll = await Trip.findAll({
            order: [["likeCount", "DESC"]],
        });

        if (tripDataAll.length > 0) {
            popularTrips = tripDataAll.map(trip => ({
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
            return res.status(200).json({ status: "success", data: popularTrips });
        } else {
            popularTrips = [];
            return res.status(200).json({ status: "success", data: popularTrips });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  根據ID搜尋行程
export const searchTripById = async (req, res) => {
    const tripId = req.tripId;
    try {
        const trip = await Trip.findByPk(tripId);

        if (trip) {
            return res.status(200).json(
                {
                    status: "success",
                    data: {
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
                    }
                });
        } else {
            return res.status(404).json({ status: "error", message: "404 Not Found" })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  對行程點讚
export const favorTrip = async (req, res) => {
    const userId = req.userId;
    const tripId = req.tripId;
    try {
        const alreadyFavor = await TripLike.findOne({ where: { userId: userId, tripId: tripId } });
        if (alreadyFavor) {
            //  user對trip取消按讚
            await alreadyFavor.destroy();
            return res.status(200).json({ status: "success", message: false });
        } else {
            // user對trip按讚
            await TripLike.create({
                userId: userId,
                tripId: tripId
            });
            return res.status(200).json({ status: "success", message: true });;
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  刪除行程
export const deleteTrip = async (req, res) => {
    const userId = req.userId;
    const tripId = req.tripId;
    try {
        const isTripExist = await Trip.findOne({ where: { userId: userId, tripId: tripId } });
        if (isTripExist) {
            await isTripExist.destroy();
            return res.status(200).json({ status: "success", message: "The trip has deleted." });
        } else {
            return res.status(404).json({ status: "error", message: "The trip does not exist." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}