import React, { useState } from 'react';
import Header from './Header.js';
import SearchModal from './SearchModal.js';
import CartSidebar from './CartSidebar.js';
import ProductDetailModal from './ProductDetailModal.js';
import { Product } from '../types/index.js';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearchClick={() => setIsSearchOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <main className="pt-16 sm:pt-20">
        {children}
      </main>

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)}
        onViewDetails={handleViewDetails}
      />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isProductDetailOpen}
        onClose={() => {
          setIsProductDetailOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
};

export default Layout;
