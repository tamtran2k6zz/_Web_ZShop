import React from 'react';

export interface ProductProps {
  id: number | string;
  image: string;
  name: string;
  originalPrice: number;
  currentPrice: number;
  soldCount: number;
  discountBadge?: string;
}

interface CardProps {
  product: ProductProps;
  onClick?: (id: string) => void;
}

const ProductCard: React.FC<CardProps> = ({ product, onClick }) => {
  return (
    <div 
      onClick={() => onClick && onClick(product.id.toString())}
      className="bg-white hover:border-primary border border-transparent shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col h-full group"
    >
      {/* Product Image */}
      <div className="relative w-full pt-[100%] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Discount Badge */}
        {product.discountBadge && (
          <div className="absolute top-0 right-0 bg-yellow-400 text-primary font-bold text-xs px-1 py-0.5 rounded-sm flex flex-col items-center">
            <span>{product.discountBadge}</span>
            <span className="text-[10px] text-white uppercase mt-0.5 bg-primary px-1 rounded-sm w-full text-center">Giảm</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-2 flex flex-col flex-grow">
        <h3 className="text-xs sm:text-sm text-gray-800 line-clamp-2 leading-tight min-h-[40px] mb-2 font-medium">
          {product.name}
        </h3>
        
        <div className="mt-auto flex justify-between items-center">
          <div className="flex flex-col">
            {product.originalPrice > product.currentPrice && (
              <span className="text-xs text-gray-400 line-through">
                ₫{product.originalPrice.toLocaleString('vi-VN')}
              </span>
            )}
            <span className="text-sm font-semibold text-primary">
              ₫{product.currentPrice.toLocaleString('vi-VN')}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            Đã bán {product.soldCount > 1000 ? `${(product.soldCount/1000).toFixed(1)}k` : product.soldCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
