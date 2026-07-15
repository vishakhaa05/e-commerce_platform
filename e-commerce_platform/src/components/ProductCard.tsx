import { Heart, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

interface ProductCardProps {
  product: Product & { _id?: string }; // supports backend Mongo document format
  onViewDetails: (product: any) => void;
}

const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useAuth();

  // Check if product is in wishlist
  const isLiked = wishlist.some(
    (item) =>
      item._id === product._id ||
      item.id === product.id ||
      item === product._id ||
      (typeof item === 'object' && item._id === product._id)
  );

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const id = product._id || product.id?.toString();
    if (id) {
      await toggleWishlist(id);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-primary text-primary" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-primary text-primary opacity-50" />);
    }
    return stars;
  };

  return (
    <div className="group relative bg-card rounded-lg overflow-hidden card-shadow hover:card-hover-shadow transition-all duration-300 hover:-translate-y-1 border border-border/50">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <button
          onClick={handleLikeClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 shadow-md ${
            isLiked
              ? 'bg-accent text-accent-foreground'
              : 'bg-background/80 text-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
        <button 
          onClick={() => onViewDetails(product)}
          className="absolute top-3 left-3 p-2 rounded-full bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 shadow-md"
        >
          <Eye className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-2 line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          {renderStars(product.rating)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl sm:text-2xl font-bold text-primary">₹{product.price}</span>
          <Button
            onClick={() => addToCart(product)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200 font-bold"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

