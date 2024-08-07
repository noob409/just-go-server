import User from "../models/user.js";

// Email Can't be changed.
export const updateUserProfile = async (id, name, email, avatar) => {

    try {
        const userToBeChanged = await User.findByPk(id);

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

export const getUserInfo = async (userId) => {
    try {
        const userInfoBuffer = await User.findByPk(userId);

        if (userInfoBuffer) {
            const userData = {
                id: userInfoBuffer.id,
                name: userInfoBuffer.username,
                email: userInfoBuffer.email,
                avatar: userInfoBuffer.avatar
            }

            return userData;
        } else {
            throw new Error("User not found");
        }
    } catch (error) {
        console.error('Error in getUserInfo:', error);
        throw new Error(error.message)
    }
}