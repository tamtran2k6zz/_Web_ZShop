import React from 'react';
import Header from './Header';
import HeroBanner from './HeroBanner';
import Categories from './Categories';
import FlashSale from './FlashSale';
import ProductGrid from './ProductGrid';
import Footer from './Footer';

interface ShopeeHomePageProps {
  onProductClick?: (id: string) => void;
  onOpenCart?: () => void;
  cartItemCount?: number;
  userRole?: string;
  onLogin?: () => void;
  onLogout?: () => void;
  onViewOrders?: () => void;
  onGoToAdmin?: () => void;
  onOpenRegister?: () => void;
  onOpenSellerChannel?: () => void;
  onBecomeSeller?: () => void;
  onOpenLanding3D?: () => void;
}

const ShopeeHomePage: React.FC<ShopeeHomePageProps> = (props) => {
  return (
    <div className="bg-surface-raised min-h-screen font-primary text-surface-base">
      <Header 
        onOpenCart={props.onOpenCart} 
        cartItemCount={props.cartItemCount}
        onLogin={props.onLogin}
        userRole={props.userRole}
        onLogout={props.onLogout}
        onOpenRegister={props.onOpenRegister}
        onOpenSellerChannel={props.onOpenSellerChannel}
        onBecomeSeller={props.onBecomeSeller}
        onProductClick={props.onProductClick}
        onOpenLanding3D={props.onOpenLanding3D}
      />
      
      <main className="pb-8">
        <HeroBanner />
        <Categories />
        {/* Hướng dẫn click thay vì FlashSale tạm thời pass callback thủ công vào component bên dưới */}
        <FlashSale onProductClick={props.onProductClick} />
        <ProductGrid onProductClick={props.onProductClick} />
      </main>

      <Footer />
    </div>
  );
};

export default ShopeeHomePage;
