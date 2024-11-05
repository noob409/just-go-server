// src/controllers/api/user.controller.js
import User from "../../models/user.js";
import { checkRequiredFields } from "../../utils/checkRequirdFieldsUtils.js";

// 個人頁面更改邏輯
export const profileChange = async (req, res) => {
    const checkedUserId = req.params.id;
    const userId = req.userId;
    const { name } = req.body;
    const avatarFile = req.file;    //  can be null

    try {
        if (userId !== checkedUserId) {
            return res.status(403).json({status: "error", message: "forbidden to change other userInfo"});
        }
        
        let avatarPath = null;
        const userToBeChanged = await User.findByPk(userId);

        if (userToBeChanged) {
            if (avatarFile) {
                // 如果上傳了新圖片，更新avatarPath
                avatarPath = `/uploads/avatars/${avatarFile.filename}`;
            } else {
                // 保留現有的 avatar，除非上傳了新的圖片
                avatarPath = userToBeChanged.avatar;
            }

            userToBeChanged.username = name;
            userToBeChanged.avatar = avatarPath;  // 如果沒有上傳新圖片，avatar保留原值
            await userToBeChanged.save();

            const avatarUrl = avatarPath.includes('http')
                ? avatarPath // 如果是 Google 相片的完整 URL
                : avatarPath; // 如果是儲存在伺服器的相片，確保路徑不重複

            const userInfo = {
                id: userToBeChanged.id,
                name: userToBeChanged.username,
                email: userToBeChanged.email,
                avatar: avatarUrl
            }

            return res.status(200).json({ status: "success", data: userInfo });
        } else {
            return res.status(404).json({ status: "error", message: "User Not Found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }

}

export const userInfo = async (req, res) => {
    const userId = req.userId;

    try {
        const userInfoBuffer = await User.findByPk(userId);

        if (userInfoBuffer) {
            const userData = {
                id: userInfoBuffer.id,
                name: userInfoBuffer.username,
                email: userInfoBuffer.email,
                avatar: userInfoBuffer.avatar
            }
            return res.status(200).json({ status: "success", data: userData });
        } else {
            return res.status(404).json({ status: "error", message: "User Not Found" })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}