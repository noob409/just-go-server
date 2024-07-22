import { config } from "dotenv";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

config();

// avatar資料還未定義(formData)，Token expired還未實作

// For encrypt password rounds
const saltRounds = 10;

const findOrCreateUser = async (userPara, isGoogle) => {
    try {

        const isGmailAccount = userPara.email.endsWith('@gmail.com');

        if (isGoogle) {

            /* Google登入邏輯 */
            const [userInfo, created] = await User.findOrCreate({
                where: { email: userPara.email },
                defaults: {
                    username: userPara.name,
                    email: userPara.email,
                    password: null,
                    token: null,
                    avatar: null,   //  暫時先null
                    provider: "google"
                },
            });

            // Generate & update token into DB
            const token = generateToken(userInfo);

            userInfo.token = token;
            await userInfo.save();

            if (created) {
                console.log('New user created:', userInfo);
            } else {
                console.log('User already exists');
            }

            const user = {
                uuid: userInfo.id,
                name: userInfo.username,
                email: userInfo.email,
                avatar: null    //  暫時先null
            }
            return { user, token };

        } else {

            /* Form註冊新用戶，如果帳戶已存在則判斷是否曾用google登入註冊，若是則回傳請用google登入；否則回傳帳號已存在 */

            // 檢查後綴是否為gmail帳戶，如果是則不論是否用過google登入，都得使用google第三方登入。
            if (isGmailAccount) {
                throw new Error('請使用Google登入並註冊');
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(userPara.password, saltRounds);
            // Generate token, 但我認為當使用者註冊完，應該需要重新登入。

            const [userInfo, created] = await User.findOrCreate({
                where: { email: userPara.email },
                defaults: {
                    username: userPara.name,
                    email: userPara.email,
                    password: hashedPassword,
                    token: null,
                    avatar: null,   //  暫時先null
                    provider: "form"
                },
            });

            // Generate & update token into DB
            const token = generateToken(userInfo);

            userInfo.token = token;
            await userInfo.save();

            if (created) {
                console.log('新用戶已註冊:', userInfo);

                const user = {
                    uuid: userInfo.id,
                    name: userInfo.username,
                    email: userInfo.email,
                    avatar: null    //  暫時先null
                }
                return { user, token };
            } else {
                throw new Error('帳號已存在，請重新輸入。');
            };
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

const generateToken = (user) => {
    const payload = {
        userId: user.id,
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '60d' });
    return token;
}

// Google登入邏輯
export const getGoogleUserInfo = async (code, isGoogle) => {

    const oAuth2Client = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        'postmessage',
    );

    try {
        let { tokens } = await oAuth2Client.getToken({ code: code });
        oAuth2Client.setCredentials({ access_token: tokens.access_token });

        const userInfoResponse = await oAuth2Client.request({
            url: 'https://www.googleapis.com/oauth2/v3/userinfo'
        });

        const user = await findOrCreateUser(userInfoResponse.data, isGoogle);
        return user;
    } catch (error) {
        throw new Error('Failed to get Google user info: ' + error.message);
    }
}

// Form登入邏輯
export const loginUser = async (email, password) => {
    try {

        const userInfo = await User.findOne({ where: { email: email } });

        if (!userInfo) {
            throw new Error('用戶不存在');
        } else if (userInfo.provider === "google") {
            throw new Error('帳號曾使用Google登入並註冊，請使用Google登入。')
        } else {

            // 判斷密碼是否吻合
            const isMatch = await bcrypt.compare(password, userInfo.password);

            if (!isMatch) {
                throw new Error('密碼錯誤');
            } else {
                console.log("Password isMatch:", isMatch);
            }

            // Generate & update token into DB
            const token = generateToken(userInfo);

            userInfo.token = token;
            await userInfo.save();

            const user = {
                uuid: userInfo.id,
                name: userInfo.username,
                email: userInfo.email,
                avatar: null    //  暫時先null
            }
            return { user, token };
        }
    } catch (error) {
        throw new Error('登入失敗: ' + error.message);
    }
};

export const registerUser = async (name, email, password, isGoogle) => {
    try {

        console.log("Starting user registration...");

        const userInfo = {
            name, email, password
        };

        const user = await findOrCreateUser(userInfo, isGoogle);

        return user;
    } catch (error) {
        console.error(error.message);
        throw new Error(error.message);
    }
};
