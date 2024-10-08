import jwt from "jsonwebtoken";

// 秘鑰應該儲存在環境變數中
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = "7d"; // Token 有效期為 3 天

// 生成 JWT Token
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

// 驗證 JWT Token
export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET); // 檢查是否正確使用 JWT_SECRET
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token expired' });
    } else {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
};
