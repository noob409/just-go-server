import { getUserTrips, getKeepTrips, getPopularTrips } from "../../service/tripService.js";

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

// 首頁 - 熱門行程，目前已點讚數遞減傳回。
export const popularTrips = async (req, res) => {
    try {
        const popularTripData = await getPopularTrips();
        return res.status(200).json({ data: popularTripData });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}