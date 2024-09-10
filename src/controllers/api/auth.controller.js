import User from "../../models/user.js";
import { hashValue, compareValue } from "../../utils/hashUtils.js";
import { generateToken, verifyToken } from "../../utils/jwtUtils.js";
import { getGoogleInfo } from "../../utils/googleUtils.js";
import { emailQueue } from "../../utils/emailUtils.js";

// Google登入邏輯
export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        const userInfo = await getGoogleInfo(token);

        if (!userInfo) {
            return res.status(401).json({ status: "error", message: "Invalid Google token" });
        }

        const [user] = await User.findOrCreate({
            where: { email: userInfo.email },
            defaults: {
                username: userInfo.name,
                email: userInfo.email,
                isValid: true,
                avatar: userInfo.picture,
            },
        });

        return res.status(200).json({
            status: "success",
            user: {
                id: user.id,
                name: user.username,
                email: user.email,
                avatar: user.avatar,
            },
            token: generateToken(user.id),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// 登入邏輯
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ status: "error", message: "Invalid email or password" });
        }

        if (!user.isValid) {
            return res.status(401).json({ status: "error", message: "User not verified" });
        }

        // 檢查密碼是否正確
        const isPasswordValid = await compareValue(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        return res.status(200).json({
            status: "success",
            data: {
                id: user.id,
                name: user.username,
                email: user.email,
                avatar: user.avatar,  
            },
            token: generateToken(user.id),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

// 註冊邏輯
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // 檢查使用者是否已存在
        const existingUser = await User.findOne({ where: { email } });
  
        // 如果存在的使用者是無效的，則允許重新註冊
        if (existingUser) {
            if (!existingUser.isValid) {
                existingUser.username = username;
                existingUser.password = await hashValue(password);
        
                const verifyToken = generateToken(existingUser.id);
                await existingUser.save();

                // 添加寄信任務到隊列
                emailQueue.add({ email: existingUser.email, token: verifyToken });
        
                return res.status(200).json({
                    status: "success", message: "User registered successfully",
                });
            }
            // 如果使用者已存在且是有效的
            return res.status(409).json({ status: "error", message: "User already exists" });
        }

        const newPassword = await hashValue(password);

        // 創建新使用者
        const newUser = await User.create({
            username,
            email,
            password: newPassword,
            isValid: false,
        });

        const verifyToken = generateToken(newUser.id);
        
        // 添加寄信任務到隊列
        emailQueue.add({ email: newUser.email, token: verifyToken });

        return res.status(201).json({
            status: "success", message: "User registered successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// 驗證信邏輯
export const verifyEmail = async (req, res) => {
    try {
        const token = req.params.token;

        const decodedToken = verifyToken(token);

        if (!decodedToken) {
            return res.status(400).json({ status: "error", message: "Invalid token" });
        }

        const user = await User.findByPk(decodedToken.id);

        if (!user) {
            return res.status(400).json({ status: "error", message: "Invalid token" });
        }

        user.isValid = true;
        await user.save();

        return res.status(200).json({ 
            status: "success", message: "Email verified successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
};
