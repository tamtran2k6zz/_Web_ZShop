import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { CartItem } from '../types';

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity?: (id: string, newQuantity: number) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

const MiniCart: React.FC<MiniCartProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemoveItem, 
  onUpdateQuantity,
  onCheckout, 
  onContinueShopping 
}) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className={`fixed inset-0 z-[60] transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
      {/* Backdrop - Click to close */}
      <div 
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className={`absolute top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Giỏ Hàng <span className="text-primary font-bold">({cartItems.length})</span></h2>
            <button 
                onClick={onClose} 
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Đóng giỏ hàng"
            >
                <X size={20} />
            </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-4 py-6 bg-slate-50 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <ShoppingBag size={40} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">Giỏ hàng của bạn đang trống</p>
              <button 
                onClick={onContinueShopping} 
                className="px-6 py-2.5 bg-primary/10 text-primary font-bold rounded-full hover:bg-primary/20 transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 group animate-fade-in relative">
                {/* Delete Button (Absolute for cleaner look) */}
                <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 shadow-sm z-10"
                    title="Xóa sản phẩm"
                >
                    <Trash2 size={14} />
                </button>

                {/* Image */}
                <div className="w-20 h-24 border border-gray-50 rounded-xl overflow-hidden shrink-0 bg-gray-50">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                
                {/* Content Info */}
                <div className="flex-1 flex flex-col min-w-0">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 pr-4">{item.name}</h3>
                    <div className="text-sm text-gray-500 font-medium mt-0.5">{item.size}</div>

                    {/* Bottom row: Qty Controls + Price */}
                    <div className="mt-auto flex justify-between items-end gap-2">
                        {/* Stepper */}
                        {onUpdateQuantity ? (
                            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
                                <button 
                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                    className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-black rounded transition-colors bg-white border border-gray-100 shadow-sm"
                                >
                                    <Minus size={12} />
                                </button>
                                <span className="font-semibold text-sm w-4 text-center">{item.quantity}</span>
                                <button 
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-black rounded transition-colors bg-white border border-gray-100 shadow-sm"
                                >
                                    <Plus size={12} />
                                </button>
                            </div>
                        ) : (
                           <div className="text-sm font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                               SL: <span className="text-black">{item.quantity}</span>
                           </div>
                        )}

                        <div className="font-black text-brand-600 text-[15px]">
                             {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                        </div>
                    </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] shrink-0">
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-gray-500 font-medium">Tạm tính:</span>
              <span className="text-2xl font-black text-gray-900 tracking-tight">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}
              </span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30 active:scale-[0.98]"
            >
              Thanh toán ngay <ArrowRight size={18} />
            </button>
            <button 
              onClick={onContinueShopping}
              className="w-full mt-3 py-3 text-gray-500 font-bold hover:text-gray-900 transition-colors bg-transparent border-none"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniCart;