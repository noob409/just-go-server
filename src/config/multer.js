// src/config/multer.js
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 定義上傳目錄

const uploadBaseDir = path.join(__dirname, '../uploads');
const avatarDir = path.join(uploadBaseDir, 'avatars');  // 使用者大頭照目錄
const tripDir = path.join(uploadBaseDir, 'trips');      // 行程照片目錄

// 檢查並創建uploads目錄（如果不存在）
const createDirIfNotExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

createDirIfNotExists(avatarDir);
createDirIfNotExists(tripDir);

// 設置 storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 根據不同的fieldname（假設使用者大頭照的field是 'avatar'，行程照片的field是 'tripImage'）
        if (file.fieldname === 'avatar') {
            cb(null, avatarDir);
        } else if (file.fieldname === 'image') {
            cb(null, tripDir);
        } else {
            cb(new Error('Unknown fieldname'), false);  // 處理未知的檔案類型
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

export { upload };