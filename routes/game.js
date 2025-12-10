// routes/game.js

const express = require('express');
const router = express.Router();
const gameEngine = require('../services/gameEngine'); // Tham chiếu services/gameEngine.js
const { getHistoryString } = require('../services/gameEngine');
const { protect, admin } = require('../middleware/auth'); 

router.post('/new_round', protect, admin, async (req, res) => {
    const result = await gameEngine.runNewRound();
    if (result.success) {
        res.json({ message: 'Ván bài mới đã được tạo và lưu.', data: result.round });
    } else {
        res.status(500).json({ message: 'Không thể tạo ván mới.', error: result.error });
    }
});

router.get('/history', async (req, res) => {
    const historyString = await getHistoryString();
    res.json({ results: historyString, count: historyString.length });
});

module.exports = router;
