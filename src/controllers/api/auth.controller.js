import User from "../../models/user.js";
import { hashValue } from "../../utils/hashUtils.js";
import { getGoogleUserInfo, loginUser } from "../../service/authService.js";
import { sendVerificationEmail } from "../../utils/emailUtils.js";
import { generateToken, verifyToken } from "../../utils/jwtUtils.js";

// // 使用Google登入的邏輯
// export const customLogin = async (req, res) => {
//     const { code, isGoogle } = req.body;

//     try {
//         const userInfo = await getGoogleUserInfo(code, isGoogle);

//         // Check if userInfo is not null before accessing its properties
//         // and add username and email and password(opt) into users table
//         if (userInfo) {
//             console.log(userInfo);
//             res.status(200).json(userInfo);
//         } else {
//             res.status(500).json({ error: 'Failed to fetch user information' });
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'An error occurred while processing the request' });
//     }
// }

// 登入邏輯
export const login = async (req, res) => {
    if (req.body.isGoogle) {
        // 此區塊為googleLogin
        const { code, isGoogle } = req.body;

        try {
            const userInfo = await getGoogleUserInfo(code, isGoogle);

            // Check if userInfo is not null before accessing its properties
            // and add username and email and password(opt) into users table
            if (userInfo) {
                console.log(userInfo)
                res.status(200).json(userInfo);
            } else {
                res.status(500).json({ error: 'Failed to fetch user information' });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'An error occurred while processing the request' });
        }
    } else {
        // 此區塊為formLogin
        const { email, password } = req.body;

        try {
            const userInfo = await loginUser(email, password);
            console.log(userInfo)
            res.status(200).json(userInfo);
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: error.message });
        }
    };
}

// 註冊邏輯
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // 檢查使用者是否已存在
        let existingUser = await User.findOne({ where: { email } });
  
        // 如果存在的使用者是無效的，則允許重新註冊
        if (existingUser) {
            if (!existingUser.isValid) {
                existingUser.username = username;
                existingUser.password = await hashValue(password);
        
                const verifyToken = generateToken(existingUser.id);
                await existingUser.save();
                await sendVerificationEmail(existingUser.email, verifyToken);
        
                return res.status(200).json({
                    message: "User registered successfully",
                    user: {
                        id: existingUser.id,
                        username: existingUser.username,
                        email: existingUser.email,
                    },
                });
            }
            // 如果使用者已存在且是有效的
            return res.status(409).json({ message: "User already exists" });
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
        await sendVerificationEmail(newUser.email, verifyToken);

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        const decodedToken = verifyToken(token);

        if (!decodedToken) {
            return res.status(400).json({ message: "Invalid token" });
        }

        const user = await User.findByPk(decodedToken.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isValid = true;
        user.token = token;
        await user.save();

        return res.status(200).json({ 
            message: "Email verified successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            token: token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
