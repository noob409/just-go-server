// src/controllers/api/user.controller.js

import { getUserInfo, updateUserProfile } from "../../service/userProfileService.js";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 整合到multer.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 個人頁面更改邏輯
export const profileChange = async (req, res) => {
    const userId = req.params.id;
    const { name, email } = req.body;
    const avatarFile = req.file;

    try {
        let avatarPath = null;

        // 整合到multer.js
        const uploadDir = path.join(__dirname, '../../uploads'); // 確認uploads目錄的正確路徑
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        if (avatarFile) {
            avatarPath = `/uploads/${avatarFile.filename}`;
        }

        const updatedUser = await updateUserProfile(userId, name, email, avatarPath);
        res.status(200).json({ data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the user profile', error });
    }

}

export const userInfo = async (req, res) => {
    const userId = req.userId;

    try {
        const userInfo = await getUserInfo(userId);
        res.status(200).json({ data: userInfo });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching the user information', error });
    }
}