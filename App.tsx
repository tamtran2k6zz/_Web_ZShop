import React, { useState } from 'react';
import ProductDetailPage from './components/ProductDetailPage';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import TransactionResultPage from './components/TransactionResultPage';
import OrderDetailPage from './components/OrderDetailPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import SellerChannelPage from './components/SellerChannelPage';
import OrderTrackingPage from './components/OrderTrackingPage';
import AdminDashboard from './components/AdminDashboard';
import MiniCart from './components/MiniCart';
import HomePage from './components/HomePage';
import ShopeeHomePage from './components/ZShop/ShopeeHomePage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ChatBot from './components/ChatBot';
import { UserRole, CartItem } from './types';
import { MOCK_CART_ITEMS } from './constants';
import { GioHangService } from './services';

type ViewState = 'home' | 'product' | 'confirmation' | 'checkout' | 'result' | 'order-detail' | 'login' | 'tracking' | 'admin' | 'register' | 'seller-channel' | 'forgot-password';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  // Set default to CUSTOMER to enable immediate checkout flow for demo
  const [userRole, setUserRole] = useState<UserRole>(UserRole.CUSTOMER);

  // -- NEW: Cart State Management linked with Database --
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("DIOR-TSHIRT-001");

  // Global Seller State to sync request between Seller UI and Admin UI
  const [globalSellers, setGlobalSellers] = useState([
      { id: 'S-101', name: 'Nguyễn Văn Nam', shopName: 'Nam Sneaker', status: 'PENDING', date: '19/04/2026', email: 'nam.sneaker@gmail.com' },
      { id: 'S-102', name: 'Trần Thị Hà', shopName: 'Hà Cosmatic', status: 'PENDING', date: '19/04/2026', email: 'ha.beauty99@gmail.com' },
      { id: 'S-103', name: 'Lê Hoàng', shopName: 'Hoàng Tech', status: 'APPROVED', date: '15/04/2026', email: 'congnghe.hoang@vietnam.vn' },
  ]);

  // Load cart on component mount
  React.useEffect(() => {
    if (userRole === UserRole.CUSTOMER) {
      GioHangService.layGioHang(1).then(items => {
        if (items && items.length > 0) {
          // Map backend properties (cartItemId) to frontend 'id' requirement
          const mappedItems = items.map((i: any) => ({ ...i, id: i.cartItemId?.toString() || i.id?.toString() }));
          setCartItems(mappedItems);
        } else {
          setCartItems(MOCK_CART_ITEMS); // Fallback to mock if API returns 0 items during setup
        }
      });
    }
  }, [userRole]);

  // Async Cart Handlers to update SQL
  const handleAddToCart = async (item: CartItem) => {
    // 1. Optimistic UI update
    setCartItems(prev => {
      const existing = prev.find(i => i.name === item.name && i.size === item.size);
      if (existing) {
        return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
    setIsMiniCartOpen(true);

    // 2. Sync to Backend
    if (userRole === UserRole.CUSTOMER) {
      await GioHangService.themVaoGio(item, 1);
      // Re-fetch to get correct backend IDs if needed
      const refreshed = await GioHangService.layGioHang(1);
      if (refreshed && refreshed.length > 0) {
        setCartItems(refreshed.map((i: any) => ({ ...i, id: i.cartItemId?.toString() || i.id?.toString() })));
      }
    }
  };

  const handleRemoveFromCart = async (id: string) => {
    // 1. Optimistic
    setCartItems(prev => prev.filter(item => item.id !== id));

    // 2. Sync to backend
    if (userRole === UserRole.CUSTOMER && !id.startsWith("mock")) {
      await GioHangService.xoaKhoiGio(id, 1);
    }
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(id);
      return;
    }
    // Optimistic UI update
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    // For a real app, we would sync this exact quantity to the backend here via an update API.
  };

  // Navigation handlers
  const navigateToConfirmation = () => {
    setIsMiniCartOpen(false); // Close mini cart if open
    if (userRole === UserRole.GUEST) {
      if (confirm('Bạn cần đăng nhập để tiếp tục (UC03a). Chuyển đến trang đăng nhập?')) {
        setCurrentView('login');
      }
    } else {
      window.scrollTo(0, 0);
      setCurrentView('confirmation');
    }
  };

  const navigateToCheckout = () => {
    window.scrollTo(0, 0);
    setCurrentView('checkout');
  };

  const navigateToProduct = (productId?: string) => {
    if (productId) {
      setSelectedProductId(productId);
    }
    window.scrollTo(0, 0);
    setCurrentView('product');
  };

  const navigateToHome = () => {
    window.scrollTo(0, 0);
    setCurrentView('home');
  };

  const navigateToResult = () => {
    window.scrollTo(0, 0);
    setCurrentView('result');
  };

  const navigateToOrderDetail = () => {
    window.scrollTo(0, 0);
    setCurrentView('order-detail');
  };

  const navigateToSellerChannel = () => {
    if (userRole === UserRole.SELLER) {
      window.scrollTo(0, 0);
      setCurrentView('seller-channel');
    } else {
      if (confirm('Bạn cần đăng nhập với tài khoản Nhà bán hàng (Seller) để vào Kênh người bán. Chuyển đến trang Đăng nhập?')) {
        setCurrentView('login');
      }
    }
  };

  const navigateToBecomeSeller = () => {
    if (userRole === UserRole.GUEST) {
      if (confirm('Bạn cần đăng nhập hoặc đăng ký tài khoản để trở thành Người bán. Chuyển đến trang Đăng nhập?')) {
        setCurrentView('login');
      }
    } else if (userRole === UserRole.SELLER) {
      navigateToSellerChannel();
    } else {
      window.scrollTo(0, 0);
      setCurrentView('seller-channel');
    }
  };

  // Guard: never allow GUEST/ADMIN to stay on seller-channel view
  // Note: CUSTOMER is now allowed so they can apply to be a seller
  React.useEffect(() => {
    if (currentView === 'seller-channel' && (userRole === UserRole.GUEST || userRole === UserRole.ADMIN)) {
      setCurrentView('login');
    }
  }, [currentView, userRole]);

  // Auto-upgrade role to SELLER for demo if Admin approves "Cửa hàng ZS-Economy Demo"
  React.useEffect(() => {
    const demoShop = globalSellers.find(s => s.shopName === 'Cửa hàng ZS-Economy Demo');
    if (demoShop && demoShop.status === 'APPROVED' && userRole !== UserRole.SELLER) {
       setUserRole(UserRole.SELLER);
       alert('Chúc mừng! Yêu cầu trở thành Người bán của bạn đã được phê duyệt. Bạn hiện đã có quyền truy cập đầy đủ vào Kênh người bán.');
    }
  }, [globalSellers, userRole]);

  const handleLoginSuccess = (role: 'CUSTOMER' | 'ADMIN' | 'SELLER') => {
    setUserRole(role === 'ADMIN' ? UserRole.ADMIN : role === 'SELLER' ? UserRole.SELLER : UserRole.CUSTOMER);
    if (role === 'ADMIN') {
      setCurrentView('admin');
    } else if (role === 'SELLER') {
      setCurrentView('seller-channel');
    } else {
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    setUserRole(UserRole.GUEST);
    setCurrentView('home');
    setIsMiniCartOpen(false);
  };

  return (
    <>

      {/* Global Mini Cart Overlay - Available on customer views */}
      {currentView !== 'admin' && currentView !== 'login' && currentView !== 'register' && (
        <MiniCart
          isOpen={isMiniCartOpen}
          onClose={() => setIsMiniCartOpen(false)}
          cartItems={cartItems}
          onRemoveItem={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          onCheckout={navigateToConfirmation}
          onContinueShopping={() => {
            setIsMiniCartOpen(false);
            if (currentView === 'product') {
              // stay on product
            } else {
              navigateToHome();
            }
          }}
        />
      )}

      {currentView === 'home' && (
        <ShopeeHomePage
          onProductClick={navigateToProduct}
          onOpenCart={() => setIsMiniCartOpen(true)}
          cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          userRole={userRole}
          onLogin={() => setCurrentView('login')}
          onLogout={handleLogout}
          onViewOrders={() => setCurrentView('tracking')}
          onGoToAdmin={() => setCurrentView('admin')}
          onOpenRegister={() => setCurrentView('register')}
          onOpenSellerChannel={navigateToSellerChannel}
          onBecomeSeller={navigateToBecomeSeller}
        />
      )}

      {currentView === 'product' && (
        <ProductDetailPage
          productId={selectedProductId}
          onBuyNow={navigateToConfirmation}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsMiniCartOpen(true)}
          cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          userRole={userRole}
          onLogin={() => setCurrentView('login')}
          onLogout={handleLogout}
          onViewOrders={() => setCurrentView('tracking')}
          onGoToAdmin={() => setCurrentView('admin')}
          onBackToHome={navigateToHome}
          onOpenRegister={() => setCurrentView('register')}
          onOpenSellerChannel={navigateToSellerChannel}
          onBecomeSeller={navigateToBecomeSeller}
          onProductClick={navigateToProduct}
        />
      )}

      {currentView === 'login' && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onBack={navigateToHome}
          onGoToRegister={() => setCurrentView('register')}
          onGoToForgotPassword={() => setCurrentView('forgot-password')}
        />
      )}

      {currentView === 'register' && (
        <RegisterPage
          onRegisterSuccess={() => {
            alert('Đăng ký thành công! Đang chuyển đến Đăng nhập...');
            setCurrentView('login');
          }}
          onBack={navigateToHome}
          onGoToLogin={() => setCurrentView('login')}
        />
      )}

      {currentView === 'forgot-password' && (
        <ForgotPasswordPage
          onBack={() => setCurrentView('login')}
        />
      )}

      {currentView === 'seller-channel' && (
        <SellerChannelPage
          onBack={navigateToHome}
          userRole={userRole}
          shopStatus={globalSellers.find(s => s.shopName === 'Cửa hàng ZS-Economy Demo')?.status as 'PENDING' | 'APPROVED' | 'REJECTED'}
          onRequestApproval={(shopInfo) => {
             const newId = `S-${Math.floor(Math.random() * 1000) + 200}`;
             setGlobalSellers([...globalSellers, {
                 id: newId,
                 name: 'Nhà Bán Hàng Mới',
                 shopName: shopInfo.shopName || 'Cửa hàng ZS-Economy Demo',
                 status: 'PENDING',
                 date: new Date().toLocaleDateString('en-GB'),
                 email: 'seller.new@gmail.com'
             }]);
          }}
        />
      )}

      {currentView === 'tracking' && (
        <OrderTrackingPage onBack={navigateToHome} />
      )}

      {currentView === 'confirmation' && (
        <OrderConfirmationPage
          cartItems={cartItems}
          onProceedToPayment={navigateToCheckout}
          onBack={() => navigateToProduct()}
          onOpenCart={() => setIsMiniCartOpen(true)}
          cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          userRole={userRole}
          onLogin={() => setCurrentView('login')}
          onLogout={handleLogout}
          onOpenRegister={() => setCurrentView('register')}
          onOpenSellerChannel={navigateToSellerChannel}
          onBecomeSeller={navigateToBecomeSeller}
          onProductClick={navigateToProduct}
        />
      )}

      {currentView === 'checkout' && (
        <CheckoutPage
          cartItems={cartItems}
          onBack={navigateToConfirmation}
          onPaymentSuccess={navigateToResult}
          onOpenCart={() => setIsMiniCartOpen(true)}
          cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          userRole={userRole}
          onLogin={() => setCurrentView('login')}
          onLogout={handleLogout}
          onOpenRegister={() => setCurrentView('register')}
          onOpenSellerChannel={navigateToSellerChannel}
          onBecomeSeller={navigateToBecomeSeller}
          onProductClick={navigateToProduct}
        />
      )}

      {currentView === 'result' && (
        <TransactionResultPage
          cartItems={cartItems}
          onViewOrder={navigateToOrderDetail}
          onGoHome={navigateToHome}
          onOpenCart={() => setIsMiniCartOpen(true)}
          cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          userRole={userRole}
          onLogin={() => setCurrentView('login')}
          onLogout={handleLogout}
          onOpenRegister={() => setCurrentView('register')}
          onOpenSellerChannel={navigateToSellerChannel}
          onBecomeSeller={navigateToBecomeSeller}
          onProductClick={navigateToProduct}
        />
      )}

      {currentView === 'order-detail' && (
        <OrderDetailPage
          cartItems={cartItems}
          onBack={navigateToResult}
          onGoHome={navigateToHome}
          onOpenCart={() => setIsMiniCartOpen(true)}
          cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          userRole={userRole}
          onLogin={() => setCurrentView('login')}
          onLogout={handleLogout}
          onOpenRegister={() => setCurrentView('register')}
          onOpenSellerChannel={navigateToSellerChannel}
          onBecomeSeller={navigateToBecomeSeller}
          onProductClick={navigateToProduct}
        />
      )}

      {currentView === 'admin' && (
        <AdminDashboard 
          onLogout={handleLogout} 
          globalSellers={globalSellers} 
          setGlobalSellers={setGlobalSellers} 
        />
      )}

      {/* Global AI ChatBot positioned at the bottom right */}
      <ChatBot />
    </>
  );
};

export default App;