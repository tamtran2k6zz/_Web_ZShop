import React, { useState, useEffect } from 'react';
import { MOCK_ORDER } from '../constants';
import { ThanhToanService, DatHangService } from '../services'; // UI Calls Business Layer
import { PaymentMethodType, CartItem, UserRole } from '../types';
import Header from './ZShop/Header';
import OrderSection from './OrderSection';
import PaymentMethodList from './PaymentMethodList';
import QRCodePanel from './QRCodePanel';
import PaymentFailedModal from './PaymentFailedModal';
import { ShieldCheck, ChevronLeft, Timer, AlertCircle } from 'lucide-react';

interface CheckoutPageProps {
  cartItems: CartItem[]; // Accept cartItems
  onBack: () => void;
  onPaymentSuccess: () => void;
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

const CheckoutPage: React.FC<CheckoutPageProps> = ({ 
  cartItems, 
  onBack, 
  onPaymentSuccess,
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
  // Logic calculation using Service
  const subtotal = DatHangService.tinhTongTienGioHang(cartItems);
  const totalAmount = subtotal + 30000;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>(PaymentMethodType.QR_CODE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [showGateway, setShowGateway] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60 - 1); // 09:59

  // Auto-switch payment method based on amount
  useEffect(() => {
    if (totalAmount > 5000000 && selectedMethod === PaymentMethodType.COD) {
        setSelectedMethod(PaymentMethodType.QR_CODE);
    }
  }, [totalAmount, selectedMethod]);

  useEffect(() => {
    const timer = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Construct dynamic order object from CartItems for display in OrderSection
  const currentOrder = {
    ...MOCK_ORDER,
    id: DatHangService.currentOrderId,
    shippingFee: 30000,
    discount: 0, // Simplify discount for now to match totals
    items: cartItems.map(c => ({
      id: c.id,
      name: c.name,
      price: c.price,
      quantity: c.quantity,
      image: c.image,
      variant: `Size ${c.size}`
    }))
  };

  const handlePayButton = async () => {
    if (selectedMethod === PaymentMethodType.QR_CODE) {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setShowGateway(true);
        }, 800);
    } else {
        setIsProcessing(true);
        try {
            await ThanhToanService.xuLyThanhToan(DatHangService.currentOrderId, totalAmount, selectedMethod);
            setIsProcessing(false);
            onPaymentSuccess();
        } catch (error) {
            setIsProcessing(false);
            setIsModalOpen(true);
        }
    }
  };

  const handleRetry = () => {
    setIsModalOpen(false);
  };

  const handleContact = () => {
    alert("Đang kết nối tới tổng đài viên...");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 animate-fade-in">
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

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Right/Top: Order Info (Visible on Desktop side, or Top on Mobile) */}
                <div className="md:col-span-5 md:order-2">
                    <OrderSection order={currentOrder} />
                </div>

                {/* Left/Main: Payment Gateway Interface UC04 */}
                <div className="md:col-span-7 md:order-1 animate-fade-in-up">
                    
                    {/* Summary Box (UC04 Specific) */}
                    <div className="bg-white rounded-xl shadow-sm border border-brand-200 p-6 mb-6 relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                         <h2 className="text-gray-900 font-bold text-lg mb-2">
                             Tóm tắt đơn hàng: <span className="font-mono">#{DatHangService.currentOrderId}</span>
                         </h2>
                         <div className="text-sm text-gray-500 mb-4">Tổng tiền thanh toán:</div>
                         <div className="text-4xl font-bold text-red-600 mb-4">
                             {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                         </div>
                         <div className="flex items-center gap-2 text-sm bg-gray-100 p-2 rounded w-fit">
                             <Timer size={16} className="text-gray-600"/>
                             <span className="text-gray-600">Hạn thanh toán: </span>
                             <span className="font-mono font-bold text-gray-900">{formatTime(timeLeft)}</span>
                             <span className="text-gray-400 text-xs">(Đếm ngược)</span>
                         </div>
                    </div>

                    {!showGateway ? (
                        /* SECTION A: PAYMENT METHOD SELECTION */
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-2">
                                Chọn phương thức thanh toán
                            </h2>
                            {totalAmount > 5000000 && (
                                <div className="mb-4 text-xs bg-orange-50 text-orange-700 p-2 rounded border border-orange-100 flex items-start gap-2">
                                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                                    <span>Đơn hàng giá trị cao ({'>'} 5 triệu) chỉ hỗ trợ thanh toán điện tử để đảm bảo an toàn.</span>
                                </div>
                            )}

                            <PaymentMethodList 
                                selectedMethod={selectedMethod} 
                                onSelect={setSelectedMethod}
                                totalAmount={totalAmount}
                            />

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <button
                                    onClick={handlePayButton}
                                    disabled={isProcessing}
                                    className={`
                                        w-full py-4 px-6 rounded-xl font-bold text-lg text-white shadow-lg transition-all
                                        flex items-center justify-center gap-2 uppercase tracking-wide
                                        ${isProcessing 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-brand-700 hover:bg-brand-800 hover:shadow-brand-200 hover:-translate-y-0.5'
                                        }
                                    `}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        `THANH TOÁN / ĐẶT MUA (${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)})`
                                    )}
                                </button>
                                <p className="text-center text-xs text-gray-500 mt-4">
                                    Bằng việc thanh toán, bạn đồng ý với <a href="#" className="underline hover:text-brand-600">Điều khoản dịch vụ</a> của SZSHOP
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* SECTION B: QR CODE DISPLAY (If QR selected) */
                        <div className="animate-fade-in-up">
                             <button 
                                onClick={() => setShowGateway(false)}
                                className="mb-4 text-sm text-gray-500 hover:text-brand-600 flex items-center gap-1"
                             >
                                 <ChevronLeft size={16} /> Chọn phương thức khác
                             </button>
                             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                 <div className="bg-brand-600 text-white p-4 text-center font-bold">
                                     Cổng thanh toán VNPAY-QR
                                 </div>
                                 <div className="p-2">
                                     <QRCodePanel 
                                        amount={totalAmount} 
                                        orderId={DatHangService.currentOrderId} 
                                        onSuccess={onPaymentSuccess} 
                                     />
                                 </div>
                                 <div className="p-4 bg-gray-50 text-center text-sm text-gray-600">
                                     Vui lòng không tắt trình duyệt trong quá trình thanh toán.
                                 </div>
                             </div>
                        </div>
                    )}
                </div>
            </div>

            <PaymentFailedModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRetry={handleRetry}
                onContactSupport={handleContact}
            />
        </main>
    </div>
  );
};

export default CheckoutPage;