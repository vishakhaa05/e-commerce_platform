import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import About from '@/components/About';
import ProductSection from '@/components/ProductSection';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import ProductDetailModal from '@/components/ProductDetailModal';
import Layout from '@/components/Layout';
import { products as localProducts } from '@/data/products';
import { Product } from '@/types';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        if (res.data.success && res.data.products.length > 0) {
          // Map backend mongoose _id to id for frontend compatibility
          const mapped = res.data.products.map((p: any) => ({
            ...p,
            id: p.id || p._id,
          }));
          setProducts(mapped);
        } else {
          setProducts(localProducts);
        }
      } catch (err) {
        console.warn('API connection failed, using static product fallback:', err);
        setProducts(localProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
  };

  const groceryProducts = products.filter((p) => p.category === 'grocery');
  const stationaryProducts = products.filter((p) => p.category === 'stationary');
  const snacksProducts = products.filter((p) => p.category === 'snacks');

  return (
    <Layout>
      {loading ? (
        <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <main className="animate-fade-in">
          <Hero />
          <About />
          <ProductSection
            id="GROCERY"
            title="GROCERIES"
            products={groceryProducts}
            onViewDetails={handleViewDetails}
          />
          <ProductSection
            id="STATIONARY"
            title="STATIONARY"
            products={stationaryProducts}
            onViewDetails={handleViewDetails}
          />
          <ProductSection
            id="SNACKS"
            title="SNACKS"
            products={snacksProducts}
            onViewDetails={handleViewDetails}
          />
          <Services />
          <Contact />
        </main>
      )}

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isProductDetailOpen}
        onClose={() => {
          setIsProductDetailOpen(false);
          setSelectedProduct(null);
        }}
      />
    </Layout>
  );
};

export default Index;

