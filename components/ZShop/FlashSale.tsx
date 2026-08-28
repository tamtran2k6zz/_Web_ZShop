import React, { useState, useEffect } from 'react';
import ProductCard, { ProductProps } from './ProductCard';
import { SanPhamAdminService } from '../../services';

interface FlashSaleProps {
  onProductClick?: (id: string | number) => void;
}

const FlashSale: React.FC<FlashSaleProps> = ({ onProductClick }) => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [timeLeft, setTimeLeft] = useState<{ hours: number, minutes: number, seconds: number }>({
    hours: 2, minutes: 45, seconds: 30
  });

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
         const dbProducts = await SanPhamAdminService.layTatCaSanPham();
         if (dbProducts && dbProducts.length > 0) {
             const mapped: ProductProps[] = dbProducts.slice(0, 8).map((p: any) => ({
                 id: p.id,
                 name: p.name,
                 currentPrice: p.price,
                 originalPrice: p.price * 1.5,
                 image: p.image_url || 'https://via.placeholder.com/200',
                 soldCount: Math.floor(Math.random() * 500),
                 discountBadge: `-33%`
             }));
             setProducts(mapped);
         }
      } catch (e) {
         console.error(e);
      }
    };
    fetchFlashSale();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <div className="container mx-auto px-4 mt-6">
      <div className="bg-white rounded-sm shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-primary font-bold text-xl italic uppercase tracking-wider flex items-center gap-1">
              F<span className="text-xl">⚡</span>ash Sale
            </h2>
            <div className="flex space-x-1">
              <div className="bg-black text-white text-sm font-bold px-1.5 py-0.5 rounded-sm">
                {formatTime(timeLeft.hours)}
              </div>
              <div className="text-black font-bold">:</div>
              <div className="bg-black text-white text-sm font-bold px-1.5 py-0.5 rounded-sm">
                {formatTime(timeLeft.minutes)}
              </div>
              <div className="text-black font-bold">:</div>
              <div className="bg-black text-white text-sm font-bold px-1.5 py-0.5 rounded-sm">
                {formatTime(timeLeft.seconds)}
              </div>
            </div>
          </div>
          <a href="#" className="text-sm font-medium text-primary hover:text-orange-600 transition">
            Xem Tất Cả &gt;
          </a>
        </div>

        {/* Products (Horizontal Scroll) */}
        <div className="p-4 overflow-x-auto custom-scrollbar">
          <div className="flex gap-4">
            {products.length === 0 ? (
                <div className="text-gray-400 p-4 text-sm">Chưa có sản phẩm flash sale từ CSDL...</div>
            ) : (
                products.map(product => (
                  <div key={product.id} className="w-36 sm:w-48 flex-shrink-0 animate-fade-in">
                    <ProductCard product={product} onClick={onProductClick} />
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSale;
