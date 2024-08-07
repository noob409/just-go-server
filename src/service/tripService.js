import Trip from "../models/trip.js";
import User from "../models/user.js";
import TripShare from "../models/trip_share.js";
import TripLike from "../models/trip_like.js";

import Sequelize from "sequelize";

// 行程管理 -> 我的行程資料獲取
export const getUserTrips = async (userId) => {
    try {
        const ownTrips = await getOwnTrips(userId) || [];

        const coEditTrips = await getCoEditTrips(userId) || [];

        return {
            own: ownTrips,
            coEdit: coEditTrips
        };
    } catch (error) {
        throw new Error('An error occurred while fetching user trips');
    }
};

// 行程管理 -> 我的收藏資料獲取
export const getKeepTrips = async (userId) => {
    try {
        const favorTrips = await getFavorTrips(userId) || [];
        return favorTrips;
    } catch (error) {
        throw new Error('An error occurred while fetching user favor trips');
    }
}

export const getPopularTrips = async () => {
    try {
        const tripDataAll = await Trip.findAll({
            order: [["likeCount", "DESC"]],
        });

        if (tripDataAll.length > 0) {
            const popularTrips = tripDataAll.map(trip => ({
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
            return popularTrips;
        } else {
            const popularTrips = [];
            return popularTrips;
        }
    } catch (error) {
        console.error('An error occurred while fetching popular trips:', error);
        throw new Error('An error occurred while fetching popular trips');
    }
}

// Called by getUserTrips
const getOwnTrips = async (userId) => {
    try {
        // const tripDataAll = await Trip.findAll({
        //     where: {
        //         userId: userId,
        //     }
        // });
        // if (tripDataAll.length > 0) {
        //     return ownTrips = tripDataAll.map(trip => ({
        //         id: trip.id,
        //         user: trip.username,
        //         userId: trip.userId,
        //         title: trip.title,
        //         image: trip.image,
        //         day: trip.day,
        //         publishDay: trip.publishDay,
        //         labels: trip.label || [],
        //         like: trip.likeCount,
        //         islike: trip.isLike,
        //         isPublic: trip.isPublic
        //     }));
        // } else {
        //     return null;
        // }

        // 假資料
        const tripDataAll = [
            {
                id: "377d2397-d6ce-43f7-8ae8-bbfaea972691",
                username: "testUser1",
                userId: userId,
                title: "Trip to the Mountains",
                image: "image1.jpg",
                day: "2024-08-01",
                publishDay: "2024-08-01",
                label: ["mountain", "adventure"],
                like: 10,
                isLike: true,
                isPublic: true
            },
            {
                id: "485b39a5-8d4e-4dce-9d5f-8bc2a0b7b569",
                username: "testUser1",
                userId: userId,
                title: "Beach Vacation",
                image: "image2.jpg",
                day: "2024-09-15",
                publishDay: "2024-09-01",
                label: ["beach", "relax"],
                like: 25,
                isLike: false,
                isPublic: true
            },
            {
                id: "f67e2b3d-0234-4c2c-9b67-b8b6e9a01a58",
                username: "testUser1",
                userId: userId,
                title: "City Tour",
                image: "image3.jpg",
                day: "2024-10-10",
                publishDay: "2024-10-05",
                label: ["city", "sightseeing"],
                like: 15,
                isLike: true,
                isPublic: false
            }
        ];

        // 返回模擬資料
        return tripDataAll.map(trip => ({
            id: trip.id,
            user: trip.username,
            userId: trip.userId,
            title: trip.title,
            image: trip.image,
            day: trip.day,
            publishDay: trip.publishDay,
            labels: trip.label || [],
            like: trip.like,
            islike: trip.isLike,
            isPublic: trip.isPublic
        }));
    } catch (error) {
        throw new Error('An error occurred while fetching own trips');
    }
}

// Called by getUserTrips，目前尚未傳回permission
const getCoEditTrips = async (userId) => {
    try {
        // // Left Outer join，取得TripShare、TripShare交集Trip的資料集，並排除交集中的trip的擁有者是某user的資料。
        // const coEditTrips = await TripShare.findAll({
        //     where: { userId: userId, },
        //     include: [
        //         {
        //             model: Trip,
        //             as: 'trip',
        //             where: {
        //                 userId: {
        //                     [Sequelize.Op.not]: userId // 排除屬於 userId 的行程
        //                 }
        //             },
        //             // // 如果需要有共編擁有者的資訊，則下面的include需保留。
        //             // include: [
        //             //     {
        //             //         model: User,
        //             //         as: 'user',
        //             //     }
        //             // ]
        //         }
        //     ]
        // });

        // if (coEditTrips) {
        //     return coEditTrips.map(tripShare => ({
        //         id: tripShare.trip.id,
        //         user: tripShare.trip.username,
        //         userId: tripShare.trip.userId,
        //         title: tripShare.trip.title,
        //         image: tripShare.trip.image,
        //         day: tripShare.trip.day,
        //         publishDay: tripShare.trip.publishDay,
        //         labels: tripShare.trip.label || [],
        //         like: tripShare.trip.likeCount,
        //         islike: tripShare.trip.isLike,
        //         isPublic: tripShare.trip.isPublic
        //     }));
        // } else {
        //     return null;
        // }

        // 假資料
        const tripDataAll = [
            {
                id: "377d2397-d6ce-43f7-8ae8-bbfaea972691",
                username: "testUser1",
                userId: userId,
                title: "Trip to the Mountains",
                image: "image1.jpg",
                day: "2024-08-01",
                publishDay: "2024-08-01",
                label: ["mountain", "adventure"],
                like: 10,
                isLike: true,
                isPublic: true
            },
            {
                id: "485b39a5-8d4e-4dce-9d5f-8bc2a0b7b569",
                username: "testUser1",
                userId: userId,
                title: "Beach Vacation",
                image: "image2.jpg",
                day: "2024-09-15",
                publishDay: "2024-09-01",
                label: ["beach", "relax"],
                like: 25,
                isLike: false,
                isPublic: true
            },
            {
                id: "f67e2b3d-0234-4c2c-9b67-b8b6e9a01a58",
                username: "testUser1",
                userId: userId,
                title: "City Tour",
                image: "image3.jpg",
                day: "2024-10-10",
                publishDay: "2024-10-05",
                label: ["city", "sightseeing"],
                like: 15,
                isLike: true,
                isPublic: false
            }
        ];

        // 返回模擬資料
        return tripDataAll.map(trip => ({
            id: trip.id,
            user: trip.username,
            userId: trip.userId,
            title: trip.title,
            image: trip.image,
            day: trip.day,
            publishDay: trip.publishDay,
            labels: trip.label || [],
            like: trip.like,
            islike: trip.isLike,
            isPublic: trip.isPublic
        }));

    } catch (error) {
        throw new Error('An error occurred while fetching co-edit trips');
    }
};

// Called by getKeepTrips
const getFavorTrips = async (userId) => {
    try {
        // const favorTrips = await TripLike.findAll({
        //     where: { userId: userId },
        //     include: [
        //         {
        //             model: Trip,
        //             as: 'trip',
        //         }
        //     ]
        // });

        // if (favorTrips) {
        //     return favorTrips.map(tripFavor => ({
        //         id: tripFavor.trip.id,
        //         user: tripFavor.trip.username,
        //         userId: tripFavor.trip.userId,
        //         title: tripFavor.trip.title,
        //         image: tripFavor.trip.image,
        //         day: tripFavor.trip.day,
        //         publishDay: tripFavor.trip.publishDay,
        //         labels: tripFavor.trip.label || [],
        //         like: tripFavor.trip.likeCount,
        //         islike: tripFavor.trip.isLike,
        //         isPublic: tripFavor.trip.isPublic
        //     }));
        // } else {
        //     return null;
        // }

        // 假資料
        const tripDataAll = [
            {
                id: "377d2397-d6ce-43f7-8ae8-bbfaea972691",
                username: "testUser1",
                userId: userId,
                title: "Trip to the Mountains",
                image: "image1.jpg",
                day: "2024-08-01",
                publishDay: "2024-08-01",
                label: ["mountain", "adventure"],
                like: 10,
                isLike: true,
                isPublic: true
            },
            {
                id: "485b39a5-8d4e-4dce-9d5f-8bc2a0b7b569",
                username: "testUser1",
                userId: userId,
                title: "Beach Vacation",
                image: "image2.jpg",
                day: "2024-09-15",
                publishDay: "2024-09-01",
                label: ["beach", "relax"],
                like: 25,
                isLike: false,
                isPublic: true
            },
            {
                id: "f67e2b3d-0234-4c2c-9b67-b8b6e9a01a58",
                username: "testUser1",
                userId: userId,
                title: "City Tour",
                image: "image3.jpg",
                day: "2024-10-10",
                publishDay: "2024-10-05",
                label: ["city", "sightseeing"],
                like: 15,
                isLike: true,
                isPublic: false
            }
        ];

        // 返回模擬資料
        return tripDataAll.map(trip => ({
            id: trip.id,
            user: trip.username,
            userId: trip.userId,
            title: trip.title,
            image: trip.image,
            day: trip.day,
            publishDay: trip.publishDay,
            labels: trip.label || [],
            like: trip.like,
            islike: trip.isLike,
            isPublic: trip.isPublic
        }));
    } catch (error) {
        throw new Error('An error occurred while fetching favor trips');
    }
}