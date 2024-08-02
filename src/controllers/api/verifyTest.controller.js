// // 驗證信測試

// import express from 'express';
// import { config } from 'dotenv';
// import { OAuth2Client } from "google-auth-library";
// import nodemailer from 'nodemailer';
// import jwt from 'jsonwebtoken';

// var router = express.Router();
// config();

// const oAuth2Client = new OAuth2Client(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     process.env.REDIRECT_URI,
// );

// // Configure nodemailer
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.GMAIL_USER,
//         pass: process.env.GMAIL_PASS,
//     }
// });

// // Helper function to send verification email
// async function sendVerificationEmail(userEmail, token) {
//     const mailOptions = {
//         from: process.env.GMAIL_USER,
//         to: userEmail,
//         subject: 'Account Verification',
//         text: `Please verify your account by clicking the link: \nhttp://localhost:80/api/test/confirmation/${token}`
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         console.log('Email sent successfully');
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// }

// // router.get('/google', (req, res) => {
// //     const authUrl = oAuth2Client.generateAuthUrl({
// //         access_type: 'offline',
// //         scope: ['email', 'profile'],
// //     });
// //     res.redirect(authUrl);
// // });

// // router.get('/google/callback', async (req, res) => {
// //     const code = req.query.code;
// //     try {
// //         const { tokens } = await oAuth2Client.getToken(code)

// //         oAuth2Client.setCredentials(tokens);

// //         // Extract user information
// //         const userInfoResponse = await oAuth2Client.request({
// //             url: 'https://www.googleapis.com/oauth2/v3/userinfo'
// //         });

// //         const { email } = userInfoResponse.data;

// //         // Ensure req.session is defined before setting tokens
// //         if (!req.session) {
// //             throw new Error('Session is not initialized');
// //         }

// //         req.session.tokens = tokens;

// //         // Generate verification token
// //         const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

// //         // Send verification email
// //         await sendVerificationEmail(email, token);

// //         res.redirect('/api/test/email/user');
// //     } catch (err) {
// //         console.error('Error authenticating with Google:', err);
// //         res.status(500).send('Error authenticating with Google');
// //     }
// // });

// router.post('/google', async (req, res) => {
//     const { code } = req.body;
//     try {
//         const { tokens } = await oAuth2Client.getToken(code);

//         oAuth2Client.setCredentials(tokens);

//         // Extract user information
//         const userInfoResponse = await oAuth2Client.request({
//             url: 'https://www.googleapis.com/oauth2/v3/userinfo'
//         });

//         const { email } = userInfoResponse.data;

//         // Generate verification token
//         const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         // Send verification email
//         await sendVerificationEmail(email, token);

//         // Send response back to client
//         res.json({ token, email });
//     } catch (err) {
//         console.error('Error authenticating with Google:', err);
//         res.status(500).send('Error authenticating with Google');
//     }
// });

// router.get('/confirmation/:token', async (req, res) => {
//     const { token } = req.params;
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const { email } = decoded;

//         // Perform verification actions, e.g., activate user account

//         res.send('Email verified successfully!');
//         console.log('Email verified successfully!')
//     } catch (error) {
//         console.error('Error verifying email:', error);
//         res.status(400).send('Invalid or expired token');
//     }
// });

// router.get('/email/user', (req, res) => {
//     res.send('Email user route is working');
// });

// export default router;