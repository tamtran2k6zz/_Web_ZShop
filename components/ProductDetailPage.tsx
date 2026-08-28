import React, { useState, useRef, useEffect } from 'react';
import { SanPhamService, SanPhamAdminService } from '../services'; // Sử dụng Service
import { Star, ShoppingCart, Minus, Plus, Play, User, Search, Truck, ChevronRight, CheckCircle, LogOut, FileText, LayoutDashboard, Settings, Loader2 } from 'lucide-react';
import { CartItem, UserRole, ProductDetail } from '../types';
import Header from './ZShop/Header';

interface ProductDetailPageProps {
  productId: string;
  onBuyNow: () => void;
  onAddToCart: (item: CartItem) => void;
  onOpenCart: () => void;
  cartItemCount: number;
  userRole: UserRole;
  onLogin: () => void;
  onLogout: () => void;
  onViewOrders: () => void;
  onGoToAdmin: () => void;
  onBackToHome: () => void;
  onOpenRegister?: () => void;
  onOpenSellerChannel?: () => void;
  onBecomeSeller?: () => void;
  onProductClick?: (id: string) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ 
    productId,
    onBuyNow, 
    onAddToCart, 
    onOpenCart, 
    cartItemCount,
    userRole,
    onLogin,
    onLogout,
    onViewOrders,
    onGoToAdmin,
    onBackToHome,
    onOpenRegister,
    onOpenSellerChannel,
    onBecomeSeller,
    onProductClick
}) => {
  // Data Layer
  const [product, setProduct] = useState<ProductDetail | null>(null);
  
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');
  
  // Animation & Menu state
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false); // New state for Buy Now animation
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch real data when productId changes
  useEffect(() => {
      const loadProduct = async () => {
          try {
              const allProducts = await SanPhamAdminService.layTatCaSanPham();
              // API trả về mảng, tìm theo id
              const dbProduct = allProducts.find((p: any) => p.id.toString() === productId.toString());
              
              if (dbProduct) {
                  const mappedProduct: ProductDetail = {
                      id: dbProduct.id.toString(),
                      name: dbProduct.name,
                      price: dbProduct.price,
                      originalPrice: dbProduct.price * 1.25, // giả lập giá gốc gạch ngang
                      images: [dbProduct.image_url || 'https://via.placeholder.com/500'],
                      description: 'Sản phẩm chính hãng chất lượng cao. Khuyến mãi có hạn!',
                      rating: 4.9,
                      reviewCount: 0,
                      soldCount: 0,
                      colors: ['Mặc định'],
                      sizes: ['FREESIZE'],
                      stock: dbProduct.stock || 100,
                      category: 'Sản phẩm người bán',
                      shippingFee: 15000,
                      shippingEstimate: '2-3 ngày',
                      discountRate: 20,
                      videoDuration: undefined
                  };
                  setProduct(mappedProduct);
                  setSelectedColor(mappedProduct.colors[0]);
                  setSelectedSize(mappedProduct.sizes[0]);
                  setActiveImage(mappedProduct.images[0]);
              } else {
                  // Fallback to MOCK
                  const fallback = SanPhamService.layChiTietSanPham(productId);
                  setProduct(fallback);
                  if (fallback) {
                      setSelectedColor(fallback.colors[0]);
                      setSelectedSize(fallback.sizes[0]);
                      setActiveImage(fallback.images[0]);
                  }
              }
          } catch (e) {
              console.error(e);
              const fallback = SanPhamService.layChiTietSanPham(productId);
              setProduct(fallback);
              if (fallback) {
                  setSelectedColor(fallback.colors[0]);
                  setSelectedSize(fallback.sizes[0]);
                  setActiveImage(fallback.images[0]);
              }
          }
          window.scrollTo(0, 0);
          setQuantity(1);
      };
      
      loadProduct();
  }, [productId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuantityChange = (delta: number) => {
    if (product) {
       setQuantity(prev => Math.max(1, Math.min(product.stock, prev + delta)));
    }
  };

  const handleAddToCart = () => {
    if (isAdding || isAdded) return;

    setIsAdding(true);

    setTimeout(() => {
        if (product) {
            const newItem: CartItem = {
                id: Math.random().toString(36).substr(2, 9),
                name: product.name,
                price: product.price,
                image: activeImage,
                quantity: quantity,
                size: selectedSize
            };
            onAddToCart(newItem);
        }
        setIsAdding(false);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    }, 400);
  };

  const handleBuyNowClick = () => {
      if (isBuying || isAdding) return;
      setIsBuying(true);
      
      // Add to cart before navigating
      handleAddToCart();

      // Visual confirmation delay
      setTimeout(() => {
          onBuyNow();
          // Reset not strictly necessary as view changes, but good for cleanup
          setIsBuying(false); 
      }, 700);
  };

  if (!product) {
      return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="animate-spin mr-2" /> Đang tải dữ liệu sản phẩm...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 animate-fade-in relative">
      
      {/* Success Popup Toast */}
      <div className={`fixed top-24 right-4 z-[60] transform transition-all duration-500 ease-out ${isAdded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-white border-l-4 border-green-500 shadow-2xl rounded-lg p-4 flex items-start gap-3 max-w-sm">
            <div className="text-green-500 shrink-0 mt-0.5">
                <CheckCircle size={20} />
            </div>
            <div>
                <h4 className="font-bold text-gray-900 text-sm">Đã thêm vào giỏ!</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.name} ({selectedSize})</p>
                <button 
                    onClick={onOpenCart}
                    className="text-xs font-bold text-brand-600 mt-2 hover:underline uppercase"
                >
                    Xem giỏ hàng
                </button>
            </div>
        </div>
      </div>

      {/* Header */}
      <Header 
          onOpenCart={onOpenCart}
          cartItemCount={cartItemCount}
          onLogin={onLogin}
          userRole={userRole}
          onLogout={onLogout}
          onOpenRegister={onOpenRegister}
          onOpenSellerChannel={onOpenSellerChannel}
          onBecomeSeller={onBecomeSeller}
          onProductClick={onProductClick}
      />

      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-2 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-xs text-gray-500 flex items-center gap-2">
            <span onClick={onBackToHome} className="cursor-pointer hover:text-brand-600 hover:underline">Trang chủ</span>
            <ChevronRight size={12} />
            <span>Thời trang nam</span>
            <ChevronRight size={12} />
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Images & Video (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Main Image */}
            <div className="aspect-[4/5] w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{product.discountRate}%
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded border-2 cursor-pointer overflow-hidden transition-all ${activeImage === img ? 'border-brand-600 ring-1 ring-brand-600' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Video Section */}
            {product.videoDuration && (
                <div className="border border-gray-300 rounded-lg p-1">
                    <div className="bg-black text-white text-xs font-bold text-center py-1 rounded-t-sm uppercase tracking-wider">
                        ^ Video thực tế ^
                    </div>
                    <div className="relative bg-gray-900 aspect-video rounded-sm overflow-hidden flex items-center justify-center group cursor-pointer mt-1">
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                        <button className="relative z-10 flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/50 text-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all group-hover:scale-105">
                            <Play size={16} fill="currentColor" />
                            <span className="text-xs font-bold">XEM VIDEO</span>
                        </button>
                        <div className="absolute bottom-2 right-2 text-[10px] text-white bg-black/60 px-1.5 rounded">
                            {product.videoDuration}
                        </div>
                    </div>
                </div>
            )}
          </div>

          {/* Right Column: Info (7 cols) */}
          <div className="lg:col-span-7">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2 uppercase">{product.name}</h1>
            
            <div className="flex items-center gap-4 text-sm mb-6">
              <div className="flex items-center text-brand-600 border-b border-brand-600 pb-0.5">
                <span className="font-bold underline mr-1">{product.rating}</span>
                <Star size={14} fill="currentColor" />
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="text-gray-600">
                <span className="font-bold underline text-gray-900 mr-1">{product.reviewCount}</span>
                đánh giá
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="text-gray-600">
                Đã bán <span className="font-bold text-gray-900">{product.soldCount >= 1000 ? `${(product.soldCount/1000).toFixed(1)}k` : product.soldCount}</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gray-50 p-4 rounded-lg mb-8 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-red-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
              </span>
              <span className="text-lg text-gray-400 line-through">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice)}
              </span>
              <span className="text-sm font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                -{product.discountRate}%
              </span>
            </div>

            {/* Shipping */}
            <div className="space-y-6 mb-8">
               <div className="flex gap-4">
                  <label className="w-24 text-sm text-gray-500 pt-0.5">Vận chuyển</label>
                  <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-gray-800 mb-1">
                          <Truck size={16} />
                          <span>Vận chuyển tới: <span className="font-medium underline decoration-dotted">Hà Nội</span></span>
                      </div>
                      <div className="text-sm text-gray-600 pl-6">
                          Phí vận chuyển: <strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.shippingFee)}</strong>
                          <span className="mx-2 text-gray-300">|</span>
                          Dự kiến: {product.shippingEstimate}
                      </div>
                  </div>
               </div>

               {/* Colors */}
               <div className="flex gap-4 items-center">
                  <label className="w-24 text-sm text-gray-500">Màu sắc</label>
                  <div className="flex flex-wrap gap-3">
                      {product.colors.map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 text-sm border rounded hover:border-brand-600 transition-all ${selectedColor === color ? 'border-brand-600 text-brand-600 font-bold ring-1 ring-brand-600 bg-brand-50' : 'border-gray-200 text-gray-700 bg-white'}`}
                          >
                              {color}
                          </button>
                      ))}
                  </div>
               </div>

               {/* Sizes */}
               <div className="flex gap-4 items-center">
                  <label className="w-24 text-sm text-gray-500">Kích thước</label>
                  <div className="flex flex-wrap gap-3">
                      {product.sizes.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`min-w-[3rem] px-3 py-2 text-sm border rounded hover:border-brand-600 transition-all uppercase ${selectedSize === size ? 'border-brand-600 text-brand-600 font-bold ring-1 ring-brand-600 bg-brand-50' : 'border-gray-200 text-gray-700 bg-white'}`}
                          >
                              {size}
                          </button>
                      ))}
                  </div>
               </div>

               {/* Quantity */}
               <div className="flex gap-4 items-center">
                  <label className="w-24 text-sm text-gray-500">Số lượng</label>
                  <div className="flex items-center border border-gray-300 rounded">
                      <button 
                        onClick={() => handleQuantityChange(-1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 border-r border-gray-300"
                      >
                          <Minus size={14} />
                      </button>
                      <input 
                        type="text" 
                        value={quantity} 
                        readOnly
                        className="w-12 h-8 text-center text-sm font-medium focus:outline-none text-gray-900"
                      />
                      <button 
                        onClick={() => handleQuantityChange(1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 border-l border-gray-300"
                      >
                          <Plus size={14} />
                      </button>
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    Còn <span className="text-green-600 font-medium">{product.stock}</span> sản phẩm
                  </span>
               </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mb-8">
                <button 
                    onClick={handleAddToCart}
                    disabled={isAdding || isAdded || isBuying}
                    className={`flex-1 max-w-[200px] h-12 border rounded font-bold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95
                        ${isAdded 
                            ? 'border-green-500 text-green-600 bg-green-50' 
                            : 'border-brand-600 text-brand-600 bg-brand-50 hover:bg-brand-100'
                        }
                        ${isAdding ? 'opacity-70 cursor-wait' : ''}
                    `}
                >
                    {isAdding ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Đang thêm...</span>
                        </>
                    ) : isAdded ? (
                        <>
                            <CheckCircle size={20} className="animate-bounce" />
                            <span>Đã thêm!</span>
                        </>
                    ) : (
                        <>
                            <ShoppingCart size={20} />
                            <span>Thêm vào giỏ hàng</span>
                        </>
                    )}
                </button>
                <button 
                    onClick={handleBuyNowClick}
                    disabled={isAdding || isAdded || isBuying}
                    className={`flex-1 max-w-[200px] h-12 rounded font-bold flex items-center justify-center gap-2 transition-all duration-500 ease-out shadow-lg
                        ${isBuying 
                            ? 'bg-green-600 text-white scale-105 shadow-green-300 ring-2 ring-green-400 ring-offset-2' 
                            : 'bg-brand-700 text-white hover:bg-brand-800 hover:shadow-xl active:scale-95'
                        }
                    `}
                >
                    {isBuying ? (
                        <>
                            <CheckCircle size={20} className="animate-bounce" />
                            <span>Đang chuyển...</span>
                        </>
                    ) : (
                        "Đặt hàng ngay"
                    )}
                </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-gray-900 mb-2">Mô tả sản phẩm</h3>
                <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                    {product.description}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-gray-200 pt-8 mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase">Đánh Giá Sản Phẩm</h3>
                
                {/* Rating Overview */}
                <div className="bg-brand-50 p-6 rounded-lg border border-brand-100 flex flex-col md:flex-row items-center gap-8 mb-8">
                    <div className="flex flex-col items-center">
                        <div className="text-4xl font-bold text-brand-600 mb-1">{product.rating || 4.8}<span className="text-xl text-gray-500 font-normal">/5</span></div>
                        <div className="flex text-brand-600 mb-2">
                            <Star fill="currentColor" size={20} />
                            <Star fill="currentColor" size={20} />
                            <Star fill="currentColor" size={20} />
                            <Star fill="currentColor" size={20} />
                            <Star fill="currentColor" size={20} className="opacity-50" />
                        </div>
                        <div className="text-sm text-gray-500">{product.reviewCount || 120} đánh giá</div>
                    </div>
                    {/* Filter tags (mock) */}
                    <div className="flex flex-wrap gap-2 text-sm justify-center md:justify-start">
                        <button className="px-4 py-1.5 border border-brand-600 text-brand-600 bg-white rounded hover:bg-brand-50">Tất cả</button>
                        <button className="px-4 py-1.5 border border-gray-300 text-gray-700 bg-white rounded hover:bg-gray-50">5 Sao (120)</button>
                        <button className="px-4 py-1.5 border border-gray-300 text-gray-700 bg-white rounded hover:bg-gray-50">4 Sao (15)</button>
                        <button className="px-4 py-1.5 border border-gray-300 text-gray-700 bg-white rounded hover:bg-gray-50">Có hình ảnh / Video (45)</button>
                    </div>
                </div>

                {/* Review List */}
                <div className="space-y-6">
                    {/* Mock Review 1 */}
                    <div className="border-b border-gray-100 pb-6">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 mt-1">
                                <img src="https://i.pravatar.cc/150?img=33" alt="user" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900">nguyen_van_a123</p>
                                <div className="flex text-brand-600 mt-1 mb-2">
                                    <Star fill="currentColor" size={12} /><Star fill="currentColor" size={12} /><Star fill="currentColor" size={12} /><Star fill="currentColor" size={12} /><Star fill="currentColor" size={12} />
                                </div>
                                <div className="text-xs text-gray-500 mb-3">Phân loại hàng: {selectedSize}, {selectedColor}</div>
                                <p className="text-sm text-gray-700 mb-3">Sản phẩm đẹp, chất lượng tuyệt vời. Shop đóng gói cẩn thận, giao hàng nhanh chóng. Sẽ còn tiếp tục ủng hộ!</p>
                                <div className="flex gap-2">
                                    <img src={activeImage} className="w-16 h-16 rounded object-cover cursor-pointer border border-gray-200" alt="review" />
                                </div>
                                <div className="text-xs text-gray-400 mt-3">2026-03-25 10:30</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Mock Review 2 */}
                     <div className="border-b border-gray-100 pb-6">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 mt-1">
                                <img src="https://i.pravatar.cc/150?img=47" alt="user" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900">tran_thi_b_99</p>
                                <div className="flex text-brand-600 mt-1 mb-2">
                                    <Star fill="currentColor" size={12} /><Star fill="currentColor" size={12} /><Star fill="currentColor" size={12} /><Star fill="currentColor" size={12} /><Star size={12} className="text-gray-300" />
                                </div>
                                <div className="text-xs text-gray-500 mb-3">Phân loại hàng: {selectedSize}, {selectedColor}</div>
                                <p className="text-sm text-gray-700">Chất vải mát mẻ, form dáng ổn. Giao hàng hơi lâu một chút do vận chuyển nhưng nhìn chung là hài lòng.</p>
                                <div className="text-xs text-gray-400 mt-3">2026-03-22 14:15</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;