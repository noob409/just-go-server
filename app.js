// app.js

const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const GoogleMap_API_KEY = process.env.GoogleMap_API_KEY;

const authRoute = require('./server/auth/authRoute');

app.use(express.static(path.join(__dirname, 'dist')));

app.use(cors());

// 前往註冊及登入驗證
app.use('/api/auth', authRoute);


// 首頁index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist','index.html'));
});

app.get('/api/google-maps-key', (req, res) => {
    res.json({apiKey: GoogleMap_API_KEY});
});

export default { app }