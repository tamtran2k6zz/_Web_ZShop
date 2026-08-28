import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, Bell, PackageOpen, ArrowRight, X } from 'lucide-react';
import { SanPhamAdminService } from '../../services';
import { ProductDetail } from '../../types';

interface HeaderProps {
  onOpenCart?: () => void;
  cartItemCount?: number;
  onLogin?: () => void;
  userRole?: string;
  onLogout?: () => void;
  onOpenRegister?: () => void;
  onOpenSellerChannel?: () => void;
  onBecomeSeller?: () => void;
  onProductClick?: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onOpenCart, 
  cartItemCount = 0, 
  onLogin, 
  userRole, 
  onLogout,
  onOpenRegister,
  onOpenSellerChannel,
  onBecomeSeller,
  onProductClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ProductDetail[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const voucherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
           setIsSearchFocused(false);
        }
        if (voucherRef.current && !voucherRef.current.contains(event.target as Node)) {
           setIsVoucherOpen(false);
        }
     };
     document.addEventListener('mousedown', handleClickOutside);
     return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const keyword = e.target.value;
      setSearchTerm(keyword);
      if (keyword.trim()) {
          try {
              const allProducts = await SanPhamAdminService.layTatCaSanPham();
              const filtered = allProducts.filter((p: any) => 
                  p.name && p.name.toLowerCase().includes(keyword.toLowerCase())
              );
              
              const mapped = filtered.map((p: any) => ({
                  id: p.id,
                  name: p.name,
                  price: p.price,
                  images: [p.image_url || 'https://via.placeholder.com/200'],
                  sizes: ['FREESIZE'], // Default mock for structure
                  description: 'Sản phẩm từ kênh người bán'
              })) as ProductDetail[];
              
              setSearchResults(mapped);
          } catch(error) {
              console.error("Lỗi tìm kiếm sản phẩm", error);
              setSearchResults([]);
          }
      } else {
          setSearchResults([]);
      }
  };

  const handleClearSearch = () => {
      setSearchTerm('');
      setSearchResults([]);
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-600 shadow-md text-white">
      {/* Top Navbar */}
      <div className="container mx-auto px-4 py-1 flex justify-between text-xs sm:text-sm">
        <div className="flex space-x-4">
          {userRole === 'SELLER' && (
            <>
              <button onClick={onOpenSellerChannel} className="hover:text-gray-200">Kênh Người Bán</button>
              <span className="hidden sm:inline">|</span>
            </>
          )}
          <button onClick={onBecomeSeller} className="inline-block px-2 hover:text-white transition-colors duration-200">Trở thành Người bán ZS-Economy</button>
          <span className="hidden sm:inline">|</span>
          <a href="#" className="hover:text-gray-200">Tải ứng dụng</a>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">Kết nối</span>
        </div>
        <div className="flex space-x-4 items-center">
          {/* Voucher / Notifications Dropdown */}
          <div className="relative" ref={voucherRef}>
            <button 
              onClick={() => setIsVoucherOpen(!isVoucherOpen)}
              className="flex items-center gap-1 hover:text-gray-200 focus:outline-none"
            >
              <Bell size={14} /> Thông báo
            </button>
            {isVoucherOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-md shadow-xl border border-gray-100 py-2 z-50 text-gray-800">
                <div className="px-4 py-2 border-b border-gray-100 text-sm font-semibold text-gray-500">
                  Thông báo mới nhận
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-brand-50 cursor-pointer border-b border-gray-50 flex gap-3">
                        <img src="https://down-vn.img.susercontent.com/file/vn-11134258-7r98o-lsth7f13m6d45e_tn" className="w-10 h-10 object-contain" alt="voucher" />
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Mã Miễn Phí Vận Chuyển</p>
                            <p className="text-xs text-gray-500 mt-1">Sử dụng ngay mã FREESHIP0D để được miễn phí vận chuyển cho đơn hàng từ 0Đ!</p>
                        </div>
                    </div>
                    <div className="px-4 py-3 hover:bg-brand-50 cursor-pointer border-b border-gray-50 flex gap-3">
                        <img src="https://down-vn.img.susercontent.com/file/vn-11134258-7r98o-lzabtz9n7rhy96_tn" className="w-10 h-10 object-contain" alt="voucher" />
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Giảm giá 50k</p>
                            <p className="text-xs text-gray-500 mt-1">Chào mừng bạn mới, tặng bạn mã ZSNEW giảm 50.000đ khi thanh toán.</p>
                        </div>
                    </div>
                </div>
                <div className="text-center py-2 border-t border-gray-100">
                    <button className="text-brand-600 hover:text-brand-800 text-sm">Xem tất cả</button>
                </div>
              </div>
            )}
          </div>

          <a href="#" className="hover:text-gray-200">Hỗ trợ</a>
          {userRole === 'GUEST' ? (
            <>
              <button onClick={onOpenRegister} className="hover:text-gray-200 font-semibold">Đăng ký</button>
              <span className="hidden sm:inline">|</span>
              <button onClick={onLogin} className="hover:text-gray-200 font-semibold">Đăng nhập</button>
            </>
          ) : (
             <button onClick={onLogout} className="hover:text-gray-200 font-semibold">Đăng xuất</button>
          )}
        </div>
      </div>

      {/* Main Header Content */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 text-3xl font-bold tracking-tighter mr-8 cursor-pointer">
          ZS-Economy
        </div>

        {/* Search Bar Interactive */}
        <div className="flex-grow max-w-3xl relative hidden sm:block" ref={searchRef}>
          <div className="flex bg-white rounded-sm p-1">
            <input 
              type="text" 
              value={searchTerm}
              onChange={handleSearch}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="ZS-Economy bao ship 0Đ - Khám phá ngay!" 
              className="w-full px-3 py-1.5 text-surface-base text-sm focus-visible:outline-text-secondary"
            />
            {searchTerm && (
                <button 
                  onClick={handleClearSearch}
                  className="px-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
            )}
            <button className="bg-brand-600 text-white px-5 py-1.5 ml-1 rounded-sm hover:bg-brand-700 transition">
              <Search size={18} />
            </button>
          </div>
          
          <div className="flex text-xs text-white/90 mt-1 space-x-3 overflow-hidden whitespace-nowrap">
            <a href="#" className="hover:underline">Áo Khoác</a>
            <a href="#" className="hover:underline">Giày Nữ</a>
            <a href="#" className="hover:underline">Áo Phông</a>
            <a href="#" className="hover:underline">Váy</a>
            <a href="#" className="hover:underline">Túi Xách Nữ</a>
          </div>

          {/* Search Results Dropdown */}
          {isSearchFocused && searchTerm && (
              <div className="absolute top-[42px] left-0 w-full mt-2 bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden z-50 text-gray-800">
                  {searchResults.length > 0 ? (
                      <div className="max-h-[400px] overflow-y-auto py-2">
                          <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Sản phẩm gợi ý
                          </div>
                          {searchResults.map(product => (
                              <div 
                                  key={product.id}
                                  onClick={() => {
                                      if (onProductClick) onProductClick(product.id);
                                      setIsSearchFocused(false);
                                  }}
                                  className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                              >
                                  <div className="w-12 h-12 rounded border border-gray-200 overflow-hidden shrink-0">
                                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <h4 className="text-sm font-bold text-gray-900 truncate">{product.name}</h4>
                                      <div className="flex items-center gap-2 mt-0.5">
                                          <span className="text-sm font-bold text-red-600">
                                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                          </span>
                                      </div>
                                  </div>
                                  <ArrowRight size={16} className="text-gray-300" />
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="p-8 text-center text-gray-500">
                          <PackageOpen size={32} className="mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Không tìm thấy sản phẩm nào</p>
                      </div>
                  )}
              </div>
          )}
        </div>

        {/* Cart */}
        <div className="flex-shrink-0 ml-8 relative cursor-pointer group" onClick={onOpenCart}>
          <ShoppingCart size={32} className="group-hover:scale-110 transition-transform" />
          {cartItemCount > 0 && (
             <span className="absolute -top-1 -right-2 bg-white text-brand-600 text-xs font-bold px-1.5 py-0.5 rounded-full border-2 border-brand-600">
               {cartItemCount}
             </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
