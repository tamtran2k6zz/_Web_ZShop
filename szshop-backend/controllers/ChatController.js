const ProductUserService = require('../services/ProductUserService');

class ChatController {
    async handleChat(req, res) {
        console.log('Chat request received:', req.body);
        try {
            const { messages } = req.body;
            if (!messages || !messages[0] || !messages[0].text) {
                return res.json({ text: "Xin chào! Tôi có thể giúp gì cho bạn?" });
            }

            const userMessage = messages[0].text.toLowerCase();
            
            // 1. Logic tìm kiếm sản phẩm (tương tự như đã làm ở frontend nhưng chạy ở server)
            const searchKeywords = ['tìm', 'mua', 'có', 'giá', 'bao nhiêu', 'sản phẩm', 'áo', 'quần', 'giày', 'mũ', 'túi', 'đồng hồ', 'hoodie', 'jean'];
            const isSearching = searchKeywords.some(kw => userMessage.includes(kw));

            if (isSearching) {
                const tuKhoa = userMessage
                    .replace(/tìm|mua|có|cái|chiếc|ở đây|không|giá|bao nhiêu|bán/g, '')
                    .trim();
                
                const allProducts = await ProductUserService.getAllProducts();
                const filteredProducts = allProducts.filter(p => 
                    p.name.toLowerCase().includes(tuKhoa || userMessage)
                );

                if (filteredProducts.length > 0) {
                    const productListHtml = filteredProducts.slice(0, 3).map(p => `
                        <div style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                            <div style="font-weight: bold; color: #1e40af;">${p.name}</div>
                            <div style="color: #dc2626; font-weight: 600;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</div>
                            <div style="font-size: 0.8rem; color: #6b7280;">Danh mục: ${p.category_name || 'Thời trang'}</div>
                        </div>
                    `).join('');

                    return res.json({
                        html: `
                            <div style="font-family: inherit;">
                                <p>Dưới đây là một số sản phẩm phù hợp với yêu cầu của bạn:</p>
                                ${productListHtml}
                                <p style="font-size: 0.85rem; margin-top: 5px;">Bạn muốn xem thêm chi tiết về sản phẩm nào không?</p>
                            </div>
                        `
                    });
                } else {
                    return res.json({ text: "Rất tiếc, tôi chưa tìm thấy sản phẩm nào khớp với yêu cầu của bạn. Bạn có muốn thử tìm kiếm với từ khóa khác không?" });
                }
            }

            // 2. Phản hồi chung
            if (userMessage.includes('chào') || userMessage.includes('hello') || userMessage.includes('hi')) {
                return res.json({ text: "Chào bạn! Tôi là trợ lý ảo của ZS-Economy. Tôi có thể giúp bạn tìm kiếm sản phẩm hoặc giải đáp thắc mắc về đơn hàng. Bạn cần tôi giúp gì ạ?" });
            } else if (userMessage.includes('thanh toán')) {
                return res.json({ text: "Tại ZS-Economy, bạn có thể thanh toán qua VNPAY-QR, Thẻ ATM, Thẻ quốc tế hoặc Thanh toán khi nhận hàng (COD) đấy ạ!" });
            } else if (userMessage.includes('giao hàng') || userMessage.includes('ship')) {
                return res.json({ text: "Chúng tôi hỗ trợ giao hàng toàn quốc với thời gian từ 2-5 ngày làm việc tùy khu vực bạn nhé." });
            } else {
                return res.json({ text: "Tôi hiểu rồi. Bạn có thể cho tôi biết rõ hơn về nhu cầu của mình hoặc tên sản phẩm bạn đang quan tâm không để tôi hỗ trợ tốt nhất?" });
            }

        } catch (error) {
            console.error('Lỗi ChatController:', error);
            res.status(500).json({ text: "Xin lỗi, tôi đang gặp một chút trục trặc kỹ thuật. Vui lòng thử lại sau nhé!" });
        }
    }
}

module.exports = new ChatController();
