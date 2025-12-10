// services/gameEngine.js

const Result = require('../models/Result'); 

function generateNewRoundResult() {
    const outcomes = ['P', 'B', 'T'];
    const weights = [0.45, 0.45, 0.10]; 
    let rand = Math.random();
    let mainResult;
    // ... (Logic random kết quả) ...
    if (rand < weights[0]) {
        mainResult = 'P';
    } else if (rand < weights[0] + weights[1]) {
        mainResult = 'B';
    } else {
        mainResult = 'T';
    }
    const playerPair = Math.random() < 0.15; 
    const bankerPair = Math.random() < 0.15;
    const longBao = Math.random() < 0.10 ? `${mainResult}_WIN_8` : 'NONE'; 

    return { mainResult, playerPair, bankerPair, longBao, rawDetails: `GameID_${Date.now()}` };
}

async function runNewRound() {
    try {
        const resultData = generateNewRoundResult();
        const newRound = await Result.create(resultData);
        return { success: true, round: newRound };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getHistoryString() {
    try {
        const results = await Result.find({}).sort({ createdAt: 1 }).limit(100); 
        const historyString = results.map(r => r.mainResult).join('');
        return historyString;

    } catch (error) {
        return '';
    }
}

module.exports = { runNewRound, getHistoryString };
