import { User as UserIcon, LogIn, UserCircle, Settings, Heart, ShoppingBag, LogOut, ShieldAlert } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleOrders = () => {
    navigate('/orders');
  };

  const handleWishlist = () => {
    navigate('/wishlist');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleAdmin = () => {
    navigate('/admin');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Get initials for avatar placeholder
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary hover:text-primary-foreground transition-all duration-200 rounded-full"
        >
          {isAuthenticated && user ? (
            <div className="h-7 w-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold shadow-sm">
              {getInitials(user.name)}
            </div>
          ) : (
            <UserIcon className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {isAuthenticated && user ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {isAdmin && (
              <>
                <DropdownMenuItem onClick={handleAdmin} className="cursor-pointer text-primary focus:text-primary focus:bg-primary/5 font-semibold">
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  <span>Admin Panel</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleOrders} className="cursor-pointer">
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>My Orders</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleWishlist} className="cursor-pointer">
              <Heart className="mr-2 h-4 w-4" />
              <span>Wishlist</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>Guest Session</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogin} className="cursor-pointer font-medium">
              <LogIn className="mr-2 h-4 w-4" />
              <span>Sign In / Sign Up</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;

