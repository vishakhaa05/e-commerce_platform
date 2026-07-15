import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import UserMenu from './UserMenu';
import { useLocation, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onSearchClick: () => void;
  onCartClick: () => void;
}

const Header = ({ onSearchClick, onCartClick }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      setIsMobileMenuOpen(false);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-secondary/95 backdrop-blur-sm shadow-md' : 'bg-secondary'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (location.pathname === '/') {
                scrollToSection('HOME');
              } else {
                navigate('/');
              }
            }}
            className="flex flex-col leading-tight"
          >
            <span className="text-2xl sm:text-3xl font-bold text-primary">BigMarket</span>
            <span className="text-sm sm:text-base font-medium text-foreground italic">GROCERIES</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {['HOME', 'ABOUT', 'GROCERY', 'STATIONARY', 'SNACKS', 'SERVICES', 'CONTACT'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200 rounded-md hover:bg-background/50"
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSearchClick}
              className="hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartClick}
              className="hover:bg-primary hover:text-primary-foreground transition-all duration-200 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            <UserMenu />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-2">
              {['HOME', 'ABOUT', 'GROCERY', 'STATIONARY', 'SNACKS', 'SERVICES', 'CONTACT'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="px-4 py-3 text-left text-sm font-medium text-foreground hover:text-primary hover:bg-background/50 transition-colors duration-200 rounded-md"
                >
                  {item}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

