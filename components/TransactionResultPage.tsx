import React, { useEffect, useState } from 'react';
import { Home, FileText, Check, ArrowRight, Download, Copy } from 'lucide-react';
import { DatHangService } from '../services';
import { CartItem, UserRole } from '../types';
import Header from './ZShop/Header';

interface TransactionResultPageProps {
  cartItems: CartItem[]; // Accept cartItems
  onViewOrder: () => void;
  onGoHome: () => void;
  onOpenCart?: () => void;
  cartItemCount?: number;
  userRole?: UserRole;
  onLogin?: () => void;
  onLogout?: () => void;
  onOpenRegister?: () => void;
  onOpenSellerChannel?: () => void;
  onBecomeSeller?: () => void;
  onProductClick?: (id: string) => void;
}

const TransactionResultPage: React.FC<TransactionResultPageProps> = ({ 
  cartItems, 
  onViewOrder, 
  onGoHome,
  onOpenCart,
  cartItemCount,
  userRole,
  onLogin,
  onLogout,
  onOpenRegister,
  onOpenSellerChannel,
  onBecomeSeller,
  onProductClick
}) => {
  // Calculate real total
  const subtotal = DatHangService.tinhTongTienGioHang(cartItems);
  const totalAmount = subtotal + 30000; // + Shipping Fee

  const transactionCode = "TRX-99887766";
  const transactionTime = new Date().toLocaleString('vi-VN');
  const email = "khachhang@email.com";
  
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header 
        onOpenCart={onOpenCart || (() => {})}
        cartItemCount={cartItemCount || 0}
        onLogin={onLogin || (() => {})}
        userRole={userRole || UserRole.GUEST}
        onLogout={onLogout || (() => {})}
        onOpenRegister={onOpenRegister}
        onOpenSellerChannel={onOpenSellerChannel}
        onBecomeSeller={onBecomeSeller}
        onProductClick={onProductClick}
      />
      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decor Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-200/30 rounded-full blur-[100px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[100px]" />
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
                <div 
                    key={i}
                    className="absolute animate-fade-in-up"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 0.5}s`,
                        opacity: 0.6
                    }}
                >
                    <div 
                        className={`w-2 h-2 rounded-full ${['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400'][Math.floor(Math.random()*4)]}`} 
                        style={{ transform: `scale(${Math.random() * 1.5})` }}
                    />
                </div>
            ))}
        </div>
      )}

      {/* Main Receipt Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl relative z-10 animate-scale-in overflow-hidden border border-gray-100">
         
         <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg animate-[scale-in_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                    <Check className="text-green-600 w-10 h-10 stroke-[4px]" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight mb-1">Thanh toán thành công!</h1>
                <p className="text-green-100 text-sm">Cảm ơn bạn đã mua hàng tại SZSHOP</p>
            </div>
         </div>

         <div className="relative h-6 bg-white -mt-3">
             <div className="absolute top-0 left-0 w-4 h-8 bg-slate-50 rounded-r-full -mt-4"></div>
             <div className="absolute top-0 right-0 w-4 h-8 bg-slate-50 rounded-l-full -mt-4"></div>
             <div className="border-b-2 border-dashed border-gray-200 mx-8 mt-[-1px]"></div>
         </div>

         <div className="px-8 pb-8 pt-2">
            
            <div className="text-center mb-8">
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Tổng thanh toán</p>
                <div className="text-4xl font-black text-slate-800 tracking-tight">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-3 mb-6 border border-slate-100">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Mã giao dịch</span>
                    <div className="flex items-center gap-1.5 font-mono font-medium text-slate-700">
                        {transactionCode}
                        <Copy size={12} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                    </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Thời gian</span>
                    <span className="font-medium text-slate-700">{transactionTime}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Phương thức</span>
                    <span className="font-medium text-slate-700 flex items-center gap-1">
                        VNPAY-QR
                    </span>
                </div>
            </div>

            <div className="flex items-start gap-3 mb-8 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="bg-blue-100 p-1.5 rounded-full mt-0.5">
                    <FileText size={16} className="text-blue-600" />
                </div>
                <div className="text-sm">
                    <p className="text-blue-900 font-medium">Hóa đơn đã được gửi tới:</p>
                    <p className="text-blue-700 font-bold">{email}</p>
                </div>
            </div>

            <div className="space-y-3">
                <button 
                    onClick={onViewOrder}
                    className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                >
                    <span>Xem chi tiết đơn hàng</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={onGoHome}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Home size={18} />
                        Trang chủ
                    </button>
                    <button 
                        className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => alert('Chức năng tải hóa đơn đang phát triển')}
                    >
                        <Download size={18} />
                        Lưu ảnh
                    </button>
                </div>
            </div>
         </div>
         
         <div className="h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>
      </div>
      
      <p className="absolute bottom-6 text-gray-400 text-xs text-center w-full">
         Giao dịch được bảo mật bởi SZSHOP Payment Gateway © 2024
      </p>
      </div>
    </div>
  );
};

export default TransactionResultPage;