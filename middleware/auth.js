// middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Tham chiếu models/User.js

// Middleware bảo vệ Route (Xác thực JWT Token)
const protect = async (req, res, next) => {
    let token;

    // Kiểm tra header Authorization có chứa Bearer token không
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // Giải mã token (Dùng biến môi trường JWT_SECRET)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Gắn user ID vào request để sử dụng trong các Route tiếp theo
            req.user = decoded.id; 
            
            next();

        } catch (error) {
            console.error('Lỗi xác thực Token:', error);
            res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Không có Token, quyền truy cập bị từ chối.' });
    }
};

// Middleware kiểm tra quyền Admin
const admin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user);

        if (user && user.isAdmin) {
            next(); // Là Admin, cho phép đi tiếp
        } else {
            res.status(403).json({ message: 'Chỉ Admin mới có quyền truy cập.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi kiểm tra quyền Admin.' });
    }
};

module.exports = { protect, admin };
