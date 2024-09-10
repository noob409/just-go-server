// src/controllers/api/user.controller.js

import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import User from "../../models/user.js";

// 整合到multer.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 個人頁面更改邏輯
{/* 有Bug 假設A使用Google首次登入，個人相片會顯示google提供的沒問題，但當我在個人頁面修改按下儲存會導致avatar變成沒有東西avatorPath(邏輯需要修改) 
    目前 前端傳到後端的時候，從network來看payload的avatar是空值*/}
export const profileChange = async (req, res) => {
    const userId = req.params.id;
    const { name, email } = req.body;
    const avatarFile = req.file;
    console.log(avatarFile);

    try {
        // 待avatar邏輯清晰再打開。
        // let avatarPath = null;

        // 整合到multer.js
        const uploadDir = path.join(__dirname, '../../uploads'); // 確認uploads目錄的正確路徑
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        if (avatarFile) {
            // avatarPath = `/uploads/${avatarFile.filename}`;
        }

        const userToBeChanged = await User.findByPk(userId);

        if (userToBeChanged) {
            userToBeChanged.username = name;
            // userToBeChanged.avatar = avatarPath;
            await userToBeChanged.save();

            const userInfo = {
                id: userToBeChanged.id,
                name: userToBeChanged.username,
                email: userToBeChanged.email,
                avatar: userToBeChanged.avatar
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
            return res.status(404).json({ status: "error", message: "User Not Found"})
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}