// models/Result.js

const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    mainResult: { 
        type: String, 
        enum: ['P', 'B', 'T'], 
        required: true 
    },
    playerPair: { type: Boolean, default: false },
    bankerPair: { type: Boolean, default: false },
    longBao: { type: String, default: 'NONE' },
    rawDetails: { type: String }
}, {
    timestamps: true 
});

const Result = mongoose.model('Result', ResultSchema);
module.exports = Result;
