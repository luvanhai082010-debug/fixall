// middleware/toolAccess.js

const User = require('../models/User');

const checkToolAccess = async (req, res, next) => {
    if (!req.user) {
         return res.status(401).json({ message: 'Lỗi xác thực: Không tìm thấy User ID.' });
    }

    try {
        const user = await User.findById(req.user);

        if (user && user.toolAccess) {
            next(); 
        } else {
            res.status(403).json({ message: 'Không có quyền truy cập Tool Robot.' });
        }
    } catch (error) {
         res.status(500).json({ message: 'Lỗi Server khi kiểm tra quyền Tool.' });
    }
};

module.exports = { checkToolAccess };
