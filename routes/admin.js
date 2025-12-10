// routes/admin.js

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Tham chiếu models/User.js
const { protect, admin } = require('../middleware/auth'); // Tham chiếu middleware/auth.js

// @route   GET /api/admin/users
// @desc    Lấy danh sách tất cả người dùng (Admin Only)
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password'); // Không trả về mật khẩu
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng.' });
    }
});

// @route   POST /api/admin/deposit
// @desc    Cấp tiền cho người dùng (Admin Only)
router.post('/deposit', protect, admin, async (req, res) => {
    const { userId, amount } = req.body;

    if (!userId || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Dữ liệu cấp tiền không hợp lệ.' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        user.balance += amount;
        await user.save();

        res.json({ message: `Đã cấp thành công ${amount} cho ${user.username}`, newBalance: user.balance });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi cấp tiền.' });
    }
});

// @route   POST /api/admin/toggleTool
// @desc    Cấp/Thu hồi quyền Tool Robot (Admin Only)
router.post('/toggleTool', protect, admin, async (req, res) => {
    const { userId, access } = req.body;

    if (!userId || typeof access !== 'boolean') {
        return res.status(400).json({ message: 'Dữ liệu cấp quyền không hợp lệ.' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        user.toolAccess = access;
        await user.save();

        const status = access ? 'cấp' : 'thu hồi';
        res.json({ message: `Đã ${status} quyền Tool cho ${user.username}`, toolAccess: user.toolAccess });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi cấp quyền Tool.' });
    }
});

module.exports = router;
