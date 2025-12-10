// routes/tool.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); 
const { checkToolAccess } = require('../middleware/toolAccess'); // Tham chiếu middleware/toolAccess.js
const baccaratService = require('../services/baccaratService'); // Tham chiếu services/baccaratService.js

router.get('/predict', protect, checkToolAccess, (req, res) => {
    try {
        const prediction = baccaratService.getPrediction();
        
        res.json({
            status: 'SUCCESS',
            result: prediction.prediction, 
            reason: prediction.reason,     
            timestamp: prediction.timestamp
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'ERROR',
            message: 'Lỗi server khi lấy dự đoán Tool.',
            error: error.message
        });
    }
});

module.exports = router;
