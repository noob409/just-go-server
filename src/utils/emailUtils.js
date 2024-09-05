import Queue from "bull";
import nodemailer from "nodemailer";
import { google } from "googleapis";

const { OAuth2 } = google.auth;

const oauth2Client = new OAuth2(
  process.env.OAUTH_CLIENT_ID, // Google OAuth Client ID
  process.env.OAUTH_CLIENT_SECRET, // Google OAuth Client Secret
  "https://developers.google.com/oauthplayground" // OAuth2 認證 URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN, // Google OAuth Refresh Token
});

export const emailQueue = new Queue("email", {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

emailQueue.process(async (job, done) => {
  try {
    const { email, token } = job.data;
    await sendVerificationEmail(email, token);
    done();
  } catch (error) {
    console.error("Error sending verification email:", error);
    done(error); // 任務失敗
  }
});

const sendVerificationEmail = async (email, token) => {
  try {
    const accessToken = (await oauth2Client.getAccessToken()).token;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.OAUTH_EMAIL,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: process.env.OAUTH_EMAIL,
      to: email,
      subject: "Just Go 帳號驗證",
      text: `請點擊此連結以驗證您的信箱: \nhttp://localhost:5173/verify/${token}`,
    };
  
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
    throw new Error("Error sending verification email");
  }
};
