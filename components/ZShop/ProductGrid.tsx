import React, { useState, useEffect, useMemo } from 'react';
import ProductCard, { ProductProps } from './ProductCard';
import { SanPhamAdminService } from '../../services';

interface ProductGridProps {
  onProductClick?: (id: string | number) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ onProductClick }) => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC'>('NEWEST');

  useEffect(() => {
    const loadProducts = async () => {
        setIsLoading(true);
        try {
            const dbProducts = await SanPhamAdminService.layTatCaSanPham();
            if (dbProducts && dbProducts.length > 0) {
                // Map DB schema (id, name, price, stock, image_url) to ProductProps schema (id, name, currentPrice, image)
                const mapped: ProductProps[] = dbProducts.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    currentPrice: p.price,
                    originalPrice: p.price * 1.2, // Fake original price
                    image: p.image_url || 'https://via.placeholder.com/200',
                    soldCount: Math.floor(Math.random() * 100) // Fake sold count
                }));
                setProducts(mapped);
            }
        } catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setIsLoading(false);
        }
    };
    loadProducts();
  }, []);

  const categories = useMemo(() => {
     const cats = new Set(products.map(p => (p as any).category || 'Khác'));
     return ['ALL', ...Array.from(cats)];
  }, [products]);

  const displayedProducts = useMemo(() => {
      let filtered = [...products];
      if (activeCategory !== 'ALL') {
          filtered = filtered.filter(p => (p as any).category === activeCategory);
      }
      
      if (sortBy === 'PRICE_ASC') {
          filtered.sort((a, b) => a.currentPrice - b.currentPrice);
      } else if (sortBy === 'PRICE_DESC') {
          filtered.sort((a, b) => b.currentPrice - a.currentPrice);
      } else {
          filtered.sort((a, b) => b.id > a.id ? 1 : -1); // newest naive
      }
      return filtered;
  }, [products, activeCategory, sortBy]);

  return (
    <div className="container mx-auto px-4 mt-8 mb-8" id="all-products">
      {/* Tab Header & Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-[60px] sm:top-[74px] z-40 mb-6 shadow-sm rounded-t-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
            <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase border-l-4 border-brand-600 pl-3">
                Tất Cả Sản Phẩm
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Category Filter */}
                <select 
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2 outline-none focus:border-brand-500 font-medium text-gray-700"
                >
                    <option value="ALL">Tất cả danh mục</option>
                    {categories.filter(c => c !== 'ALL').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                {/* Sort */}
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-4 py-2 outline-none focus:border-brand-500 font-medium text-gray-700"
                >
                    <option value="NEWEST">Mới nhất</option>
                    <option value="PRICE_ASC">Giá: Thấp đến Cao</option>
                    <option value="PRICE_DESC">Giá: Cao đến Thấp</option>
                </select>
            </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {displayedProducts.map(product => (
          <div key={product.id} className="h-full">
            <ProductCard product={product} onClick={onProductClick} />
          </div>
        ))}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center mt-6">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}

      {/* See More Button */}
      {!isLoading && products.length === 0 && (
         <div className="text-center text-gray-500 mt-6">
            Chưa có sản phẩm nào. Hãy đăng nhập với vai trò Admin và đăng thêm!
         </div>
      )}
    </div>
  );
};

export default ProductGrid;
