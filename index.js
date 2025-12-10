// index.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// 1. Cấu hình biến môi trường
dotenv.config();

const app = express();

// 2. Middleware cơ bản
app.use(express.json()); 
app.use(cors()); 

// 3. Thiết lập kết nối MongoDB
const DB_URI = process.env.DATABASE_URL;

mongoose.connect(DB_URI)
    .then(() => console.log('✅ Đã kết nối MongoDB thành công!'))
    .catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err.message));

// ==========================================================
// 4. Import và sử dụng Routes API
// ==========================================================

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin'); 
const gameRoutes = require('./routes/game'); 
const toolRoutes = require('./routes/tool'); 

app.use('/api/auth', authRoutes); 
app.use('/api/admin', adminRoutes); 
app.use('/api/game', gameRoutes); 
app.use('/api/tool', toolRoutes); 


// 5. Route kiểm tra cơ bản
app.get('/', (req, res) => {
    res.send('Baccarat Admin API Server đang hoạt động!');
});


// 6. Khởi động Server
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});
