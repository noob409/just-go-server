import User from "../models/user.js";

// Email Can't be changed.
export const updateUserProfile = async (id, name, email, avatar) => {

    try {
        const userToBeChanged = await User.findOne({ where: { id: id } });

        if (userToBeChanged) {
            userToBeChanged.username = name;
            userToBeChanged.avatar = avatar;
            await userToBeChanged.save();
            
            const returnData = {
                id: userToBeChanged.id,
                name: userToBeChanged.username,
                email: userToBeChanged.email,
                avatar: userToBeChanged.avatar
            }

            return returnData;
        } else {
            throw new Error("User not found");
        }
    } catch (error) {
        console.error('Error in updateUserProfile:', error);
        throw new Error(error.message);
    }
};