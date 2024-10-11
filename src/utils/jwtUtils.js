import jwt from "jsonwebtoken";

// 秘鑰應該儲存在環境變數中
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = "3d"; // Token 有效期為 3 天

// 生成 JWT Token
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

// 驗證 JWT Token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
