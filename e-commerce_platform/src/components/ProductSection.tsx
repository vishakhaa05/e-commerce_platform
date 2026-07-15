import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductSectionProps {
  id: string;
  title: string;
  products: Product[];
  onViewDetails: (product: Product) => void;
}

const ProductSection = ({ id, title, products, onViewDetails }: ProductSectionProps) => {
  return (
    <section id={id} className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-10 sm:mb-12 lg:mb-16 text-foreground">
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onViewDetails={onViewDetails} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
