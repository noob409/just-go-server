// /api/users/${id}/trip/ 然後我之後會把它改成三個分頁，分別是我的行程、與我共編、我的收藏
import Sequelize from "sequelize";

import TripShare from "../../models/trip_share.js";
import Trip from "../../models/trip.js";
import { checkRequiredFields } from "../../utils/checkRequirdFieldsUtils.js";


//  行程管理 - 我的行程
export const ownTrip = async (req, res) => {
    const userId = req.userId;
    let ownData = [];
    let coEditData = [];

    // 檢查是否所有必要的欄位都存在
    const requiredFields = { userId };
    const missingFields = checkRequiredFields(requiredFields);

    if (missingFields.length > 0) {
        return res.status(400).json({
            status: "error",
            message: `Missing required fields: ${missingFields.join(', ')}`
        });
    }

    try {
        // 我的行程 - 屬於自己的行程
        const tripDataAll = await Trip.findAll({
            where: {
                userId: userId,
            }
        });
        if (tripDataAll.length > 0) {
            // ownData = tripDataAll.map(trip => ({
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
            ownData = tripDataAll.map(trip => ({
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
        }

        {/* 我的行程 - 共編
            Left Outer join，取得TripShare、TripShare交集Trip的資料集，並排除交集中的trip的擁有者是某user的資料 */}
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
            // coEditData = coEditTrips.map(tripShare => ({
            //     id: tripShare.id,
            //     userId: tripShare.userId,
            //     title: tripShare.tripName,
            //     image: tripShare.image,
            //     finalPlanId: tripShare.finalPlanId,
            //     departureDate: tripShare.departureDate,
            //     endDate: tripShare.endDate,
            //     linkPermission: tripShare.linkPermission,
            //     isPublic: tripShare.isPublic,
            //     publishDay: tripShare.publicAt,
            //     like: tripShare.likeCount,
            //     labels: tripShare.label || [],
            // }));

            // Test 前端資料接收格式
            coEditData = coEditTrips.map(trip => ({
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

        }
        return res.status(200).json({ status: "success", data: { ownData, coEditData } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

//  行程管理 - 我的收藏
export const keepTrip = async (req, res) => {
    const userId = req.userId;
    let favorData = [];

    // 檢查是否所有必要的欄位都存在
    const requiredFields = { userId };
    const missingFields = checkRequiredFields(requiredFields);

    if (missingFields.length > 0) {
        return res.status(400).json({
            status: "error",
            message: `Missing required fields: ${missingFields.join(', ')}`
        });
    }

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
            // favorData = favorTrips.map(tripFavor => ({
            //     id: tripFavor.id,
            //     userId: tripFavor.userId,
            //     title: tripFavor.tripName,
            //     image: tripFavor.image,
            //     finalPlanId: tripFavor.finalPlanId,
            //     departureDate: tripFavor.departureDate,
            //     endDate: tripFavor.endDate,
            //     linkPermission: tripFavor.linkPermission,
            //     isPublic: tripFavor.isPublic,
            //     publishDay: tripFavor.publicAt,
            //     like: tripFavor.likeCount,
            //     labels: tripFavor.label || [],
            // }));

            // Test 前端資料接收格式
            favorData = favorTrips.map(trip => ({
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
        }
        return res.status(200).json({ status: "success", data: favorData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}