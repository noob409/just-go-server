import { getUserTrips, getKeepTrips, getPopularTrips, getTripById, getDeleteTrip, favorTripById } from "../../service/tripService.js";

// 行程管理 - 我的行程
export const ownTrip = async (req, res) => {
    const userId = req.userId;

    try {
        const tripData = await getUserTrips(userId);
        return res.status(200).json({ data: tripData });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//  行程管理 - 我的收藏
export const keepTrip = async (req, res) => {
    const userId = req.userId;

    try {
        const favorTripData = await getKeepTrips(userId);
        return res.status(200).json({ data: favorTripData });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//  首頁 - 熱門行程，目前以點讚數遞減傳回。
export const popularTrips = async (req, res) => {
    try {
        const popularTripData = await getPopularTrips();
        return res.status(200).json({ data: popularTripData });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//  根據ID搜尋行程
export const searchTripById = async (req, res) => {
    const tripId = req.tripId;
    try {
        const tripData = await getTripById(tripId);
        return res.status(200).json({ data: tripData });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//  對行程點讚
export const favorTrip = async (req, res) => {
    const userId = req.userId;
    const tripId = req.tripId;
    try {
        const isFavor = await favorTripById(userId, tripId);
        return res.status(200).json(isFavor);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//  刪除行程
export const deleteTrip = async (req, res) => {
    const userId = req.userId;
    const tripId = req.tripId;
    try {
        const deleteMessage = await getDeleteTrip(userId, tripId);
        return res.status(200).json(deleteMessage);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}