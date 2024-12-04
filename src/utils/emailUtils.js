import Queue from "bull";
import { google } from "googleapis";
import nodemailer from "nodemailer";

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

    const redirectUrl = `https://just-go.voidcloud.net/verify/${token}`;

    const mailOptions = {
      from: process.env.OAUTH_EMAIL,
      to: email,
      subject: "Just Go 帳號驗證",
      html: `<div style="height: 100%; width: 100%; background: #f9f9f9; color: #383838">
      <div style="margin: 0 auto; max-width: 640px; height: 200px"></div>
      <div
        style="
          display: flex;
          margin: 0 auto;
          max-width: 640px;
          background: white;
          border-radius: 4px;
          flex-direction: column;
          gap: 16px;
          padding: 40px 50px;
        "
      >
        <table style="width: 100%">
          <tr>
            <img
              src="https://just-go.voidcloud.net/logo.png"
              alt="logo"
              width="100%"
            />
          </tr>
          <tr>
            <h1>會員註冊認證說明</h1>
          </tr>
          <tr>
            <p>感謝您註冊 Just Go 會員，請點擊下方按鈕進行認證。</p>
            <a
              href="${redirectUrl}"
              style="
                padding: 10px 15px;
                background: #00283d;
                color: white;
                font-weight: bold;
                border-radius: 4px;
                width: auto;
                text-decoration: none;
              "
            >
              前往認證
            </a>
            <p>
              若您無法點擊上方按鈕，請複製以下連結至瀏覽器開啟：
              <a href="${redirectUrl}">${redirectUrl}</a>
              <br />
              此信件由系統自動發送，請勿回覆。如有任何問題，請聯絡客服。
            </p>
          </tr>
          <tr>
            <p>Just Go 團隊 敬上</p>
          </tr>
        </table>
      </div>
      <div style="margin: 0 auto; max-width: 640px; height: 200px"></div>
    </div>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
    throw new Error("Error sending verification email");
  }
};
