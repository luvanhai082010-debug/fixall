// routes/auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Tham chiếu models/User.js
const jwt = require('jsonwebtoken');

// Hàm tạo JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/register
// @desc    Đăng ký tài khoản mới
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username });

    if (userExists) {
        return res.status(400).json({ message: 'Tên người dùng đã tồn tại.' });
    }

    const user = await User.create({ username, password });

    if (user) {
        // Cấp quyền Admin cho tài khoản đầu tiên (tùy chọn)
        if (await User.countDocuments({}) === 1) {
             user.isAdmin = true;
             await user.save();
        }

        res.status(201).json({
            _id: user._id,
            username: user.username,
            isAdmin: user.isAdmin,
            balance: user.balance,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ.' });
    }
});

// @route   POST /api/auth/login
// @desc    Đăng nhập và lấy Token
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            isAdmin: user.isAdmin,
            balance: user.balance,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Tên người dùng hoặc mật khẩu không đúng.' });
    }
});

module.exports = router;
