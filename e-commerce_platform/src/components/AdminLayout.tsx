import React from 'react';
import Layout from './Layout.js';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Folders, ShoppingCart, Percent, Users, ArrowLeft } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navItems = [
    { name: 'Analytics Dashboard', path: '/admin', icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: 'Products CRUD', path: '/admin/products', icon: <Package className="h-4 w-4" /> },
    { name: 'Categories CRUD', path: '/admin/categories', icon: <Folders className="h-4 w-4" /> },
    { name: 'Order Management', path: '/admin/orders', icon: <ShoppingCart className="h-4 w-4" /> },
    { name: 'Coupon Management', path: '/admin/coupons', icon: <Percent className="h-4 w-4" /> },
    { name: 'User Management', path: '/admin/users', icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Admin Sidebar Navigation */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24 border border-border bg-card rounded-xl p-4 shadow-sm space-y-4">
              <div className="pb-3 border-b border-border">
                <h3 className="font-extrabold text-primary text-lg px-2 flex items-center gap-1.5">
                  Admin Panel
                </h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest px-2 mt-1">
                  Backoffice Controls
                </p>
              </div>

              <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-2 lg:pb-0">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/admin'}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="pt-3 border-t border-border hidden lg:block">
                <NavLink
                  to="/"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" /> Back to Storefront
                </NavLink>
              </div>
            </div>
          </aside>

          {/* Admin Page Content */}
          <section className="flex-1 min-w-0 bg-card border border-border rounded-xl p-6 shadow-sm">
            {children}
          </section>

        </div>
      </div>
    </Layout>
  );
};

export default AdminLayout;
