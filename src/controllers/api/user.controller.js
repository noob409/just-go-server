// src/controllers/api/user.controller.js

import { updateUserProfile } from "../../service/userProfileService.js";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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
        res.json({ data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the user profile', error });
    }

}
