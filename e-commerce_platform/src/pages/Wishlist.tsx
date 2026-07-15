import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import Layout from '../components/Layout.js';
import ProductCard from '../components/ProductCard.js';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductDetailModal from '../components/ProductDetailModal.js';
import { Product } from '../types/index.js';

const Wishlist = () => {
  const { wishlist } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-primary flex items-center gap-2">
              <Heart className="h-8 w-8 fill-primary" /> My Wishlist
            </h1>
            <p className="text-muted-foreground mt-1">
              Products you bookmarked for later. Click to buy anytime.
            </p>
          </div>
          <Link to="/" className="text-sm text-primary font-bold flex items-center gap-1 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>

        {wishlist && wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-xl py-16 px-4 flex flex-col items-center justify-center text-center max-w-lg mx-auto mt-8">
            <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center text-primary mb-4 shadow-inner">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-1">Your Wishlist is Empty</h3>
            <p className="text-sm text-muted-foreground mb-6 px-4">
              Explore our fresh organic groceries, snacks, and stationery to add items here.
            </p>
            <Link to="/">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-md">
                <ShoppingBag className="h-4 w-4" /> Browse Shop
              </button>
            </Link>
          </div>
        )}

        <ProductDetailModal
          product={selectedProduct}
          isOpen={isProductDetailOpen}
          onClose={() => {
            setIsProductDetailOpen(false);
            setSelectedProduct(null);
          }}
        />
      </div>
    </Layout>
  );
};

export default Wishlist;
