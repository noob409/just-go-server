import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

// 用於驗證每次請求的token是否存在、過期...
export const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        console.log(token);
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ error: 'Token expired' });
        } else {
            res.status(401).json({ error: 'Invalid token' });
        }
    }
};