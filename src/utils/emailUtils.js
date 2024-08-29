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

export const sendVerificationEmail = async (email, token) => {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.OAUTH_EMAIL,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: accessToken.toString(),
      },
    });

    const mailOptions = {
      from: process.env.OAUTH_EMAIL,
      to: email,
      subject: "Just Go 帳號驗證",
      text: `請點擊此連結以驗證您的信箱: \nhttp://localhost:80/api/auth/verify?token=${token}`,
    };
  
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
    throw new Error("Error sending verification email");
  }
};
