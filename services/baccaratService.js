// services/baccaratService.js

// 🚨 URL API LỊCH SỬ GAME (Sử dụng tên miền mới của Server Backend)
const GAME_HISTORY_API = 'https://memaybeo-49ip.onrender.com/api/game/history'; 

// Khởi tạo trạng thái dự đoán ban đầu
let lastPrediction = { 
    prediction: 'WAIT', 
    reason: 'Tool Robot đang khởi động và chờ dữ liệu Game.',
    timestamp: 0 
};

// ==========================================================
// 1. LOGIC THUẬT TOÁN DỰ ĐOÁN ĐƠN GIẢN (CÓ THỂ MỞ RỘNG)
// ==========================================================
function simplePredictor(historyString) {
    // Loại bỏ Hòa (Ties) khỏi chuỗi lịch sử để phân tích Bệt/Ping Pong
    const filteredResults = historyString.replace(/T/g, '').slice(-5); // Lấy 5 ván cuối không tính Hòa
    const len = filteredResults.length;

    if (len < 3) {
        return { prediction: 'XEM XÉT', reason: 'Dữ liệu lịch sử quá ngắn (< 3 ván không Hòa).' };
    }
    
    const r1 = filteredResults[len - 1]; // Ván gần nhất
    const r2 = filteredResults[len - 2];
    const r3 = filteredResults[len - 3];
    
    // Thuật toán: Phát hiện Bệt 3 cây liên tiếp
    if (r1 === r2 && r2 === r3) {
        // Nếu là Bệt B (Banker), dự đoán theo Bệt B
        if (r1 === 'B') {
            return { prediction: 'CÁI', reason: `Bệt CÁI (${r1}${r1}${r1}). Theo Bệt.` };
        } 
        // Nếu là Bệt P (Player), dự đoán theo Bệt P
        if (r1 === 'P') {
            return { prediction: 'CON', reason: `Bệt CON (${r1}${r1}${r1}). Theo Bệt.` };
        }
    }
    
    // Nếu không có Bệt 3, dự đoán ngược lại ván gần nhất (Đánh Ping Pong - xen kẽ)
    if (r1 === 'B' && r2 === 'P') {
        return { prediction: 'CON', reason: 'Cầu Xanh (Ping Pong B-P). Đánh CON.' };
    }
    if (r1 === 'P' && r2 === 'B') {
        return { prediction: 'CÁI', reason: 'Cầu Đỏ (Ping Pong P-B). Đánh CÁI.' };
    }
    
    // Mặc định, dự đoán theo ván gần nhất nếu dữ liệu không rõ ràng
    return { 
        prediction: (r1 === 'B' ? 'CÁI' : 'CON'), 
        reason: `Dự đoán theo ván cuối (${r1}).` 
    };
}


// ==========================================================
// 2. CHỨC NĂNG GỌI API LỊCH SỬ VÀ CẬP NHẬT DỰ ĐOÁN
// ==========================================================
async function updatePrediction() {
    try {
        // Thêm timestamp để tránh cache trình duyệt
        const url = `${GAME_HISTORY_API}?t=${Date.now()}`; 
        
        // Sử dụng fetch (Node.js hiện đại hỗ trợ fetch mà không cần thư viện phụ)
        const response = await fetch(url);
        
        // Nếu API Game không trả về 200 OK
        if (!response.ok) {
            throw new Error(`API Game trả về lỗi: ${response.status}`);
        }
        
        const data = await response.json(); 
        
        const historyString = data.results || ''; 
        
        if (historyString.length >= 5) { 
             const newPrediction = simplePredictor(historyString);
             // Cập nhật kết quả dự đoán
             lastPrediction = { ...newPrediction, timestamp: Date.now() };
        } else {
             lastPrediction = { 
                prediction: 'NẠP DATA', 
                reason: 'Cần ít nhất 5 ván bài đã được tạo (Admin chạy /api/game/new_round).', 
                timestamp: Date.now() 
             };
        }
        
    } catch (error) {
        lastPrediction = { 
            prediction: 'LỖI', 
            reason: `Lỗi kết nối/xử lý API Game: ${error.message}`, 
            timestamp: Date.now() 
        };
    }
}

// ==========================================================
// 3. KHỞI ĐỘNG VÀ XUẤT MODULE
// ==========================================================

// Thiết lập tự động cập nhật dự đoán mỗi 5 giây
setInterval(updatePrediction, 5000); 

// Chạy lần đầu tiên ngay khi Server khởi động
updatePrediction(); 

// Hàm được routes/tool.js gọi để lấy kết quả hiện tại
function getPrediction() {
    return lastPrediction;
}

module.exports = { getPrediction };
