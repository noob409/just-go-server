import { getUserTrips, getKeepTrips } from "../../service/tripService.js";

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

// 首頁 - 熱門行程，目前尚未判斷哪些行程是熱門，僅將資料庫的行程全數傳回。
export const popularTrips = async (req, res) => {
}