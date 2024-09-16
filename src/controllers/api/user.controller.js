// src/controllers/api/user.controller.js
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { checkRequiredFields } from "../../utils/checkRequiredFieldsUtils.js";
import User from "../../models/user.js";

// 整合到multer.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 個人頁面更改邏輯
export const profileChange = async (req, res) => {
    const userId = req.params.id;
    const { name } = req.body;
    const avatarFile = req.file;
    console.log(avatarFile);

    // 檢查是否所有必要的欄位都存在
    const requiredFields = { userId, name };
    const missingFields = checkRequiredFields(requiredFields);

    if (missingFields.length > 0) {
        return res.status(400).json({
            status: "error",
            message: `Missing required fields: ${missingFields.join(', ')}`
        });
    }

    try {
        let avatarPath = null;
        const userToBeChanged = await User.findByPk(userId);
        
        if (userToBeChanged) {
            if (avatarFile) {
                // 如果上傳了新圖片，更新avatarPath
                avatarPath = `/uploads/${avatarFile.filename}`;
            } else {
                // 保留現有的 avatar，除非上傳了新的圖片
                avatarPath = userToBeChanged.avatar;
            }

            userToBeChanged.username = name;
            userToBeChanged.avatar = avatarPath;  // 如果沒有上傳新圖片，avatar保留原值
            await userToBeChanged.save();

            const avatarUrl = avatarPath.includes('http')
                ? avatarPath  // 如果是Google相片的完整URL
                : `/uploads/${avatarFile ? avatarFile.filename : userToBeChanged.avatar}`; // 如果是儲存在伺服器的相片

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
        const userInfoBuffer = await User.findByPk(userId);

        if (userInfoBuffer) {
            // 假設 avatar 存儲了完整的 URL 或是相對路徑
            const avatarUrl = userInfoBuffer.avatar.includes('http')
                ? userInfoBuffer.avatar  // 完整的 URL（例如 Google 相片）
                : `/uploads/${userInfoBuffer.avatar}`; // 相對路徑（儲存在伺服器上的相片）

            const userData = {
                id: userInfoBuffer.id,
                name: userInfoBuffer.username,
                email: userInfoBuffer.email,
                avatar: avatarUrl
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