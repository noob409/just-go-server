import Board from "../../models/board.js";
import User from "../../models/user.js";

export const ownTrip = async (req, res) => {
    const token = req.header('Authorization');

    try {
        if (token) {
            
            const userInfo = await User.findOne({ where: { token: token } });

            const userId = userInfo.id;

            // 目前是用deletable為true 來表示屬於該位使用者的行程。
            const tripDataAll = await Board.findAll({
                where: {
                    userId: userId,
                    deletable: true
                }
            });

            if (tripDataAll.length > 0) {

                const ownTrips = tripDataAll.map(trip => ({
                    id: trip.id,
                    title: trip.title,
                    image: trip.image,
                    update: null,
                    labels: trip.label,
                    like: trip.like,
                    likeByMe: trip.likeByMe,
                    isShare: trip.isShare,
                    deletable: trip.deletable
                }));
                console.log(ownTrips);

                return res.status(200).json(ownTrips);
            } else {
                return res.status(404).json({ error: 'No trips found for this user or no deletable trips' });
            }
        } else {
            return res.status(401).json({ error: 'Authorization token is required' });
        }
    } catch (error) {

    }
}