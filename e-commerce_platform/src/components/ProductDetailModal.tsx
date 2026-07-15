import { Star, X, Minus, Plus } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal = ({ product, isOpen, onClose }: ProductDetailModalProps) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-5 w-5 fill-primary text-primary" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-5 w-5 fill-primary text-primary opacity-50" />);
    }
    return stars;
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setQuantity(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Image Section */}
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
                {product.category.toUpperCase()}
              </div>
              
              <h2 className="text-3xl font-bold text-card-foreground mb-3">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-muted-foreground">({product.rating})</span>
              </div>

              <div className="text-4xl font-bold text-primary mb-6">
                ₹{product.price}
              </div>

              <div className="prose prose-sm mb-6">
                <p className="text-muted-foreground">
                  High-quality {product.name.toLowerCase()} available at BigMarket. 
                  Fresh and carefully selected to ensure the best quality for our customers. 
                  Perfect for your daily needs.
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Product Details:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Category: {product.category}</li>
                  <li>• Quality: Premium</li>
                  <li>• Availability: In Stock</li>
                  <li>• Store Pickup: Available</li>
                </ul>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold"
              >
                Add to Cart - ₹{product.price * quantity}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
