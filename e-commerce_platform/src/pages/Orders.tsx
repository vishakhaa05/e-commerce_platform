import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.js';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '../lib/api.js';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Loader2, ArrowRight } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900/50';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900/50';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-900/50';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-extrabold text-primary mb-2">My Orders</h1>
        <p className="text-muted-foreground mb-8">View details, tracking updates, and download invoices for your purchases.</p>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order._id}
                className="border border-border hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden"
                onClick={() => navigate(`/orders/${order._id}`)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 border-b border-border bg-secondary/5">
                  <div className="grid grid-cols-2 sm:flex sm:items-center sm:gap-6 gap-2 text-sm text-muted-foreground">
                    <div>
                      <p className="text-xs font-medium">Order Placed</p>
                      <p className="font-bold text-foreground mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium">Invoice Number</p>
                      <p className="font-bold text-foreground mt-0.5">{order.invoiceNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium">Total Amount</p>
                      <p className="font-bold text-primary mt-0.5 text-base">₹{order.totalAmount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <CardContent className="p-5">
                  <div className="flex items-center gap-3 overflow-x-auto py-2">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex-shrink-0 flex items-center gap-2 border border-border/80 rounded-lg p-2 max-w-[200px]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-10 w-10 object-cover rounded bg-muted flex-shrink-0"
                        />
                        <div className="min-w-0 text-xs">
                          <p className="font-bold text-foreground truncate">{item.name}</p>
                          <p className="text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-xl py-16 px-4 flex flex-col items-center justify-center text-center max-w-lg mx-auto mt-8">
            <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center text-primary mb-4 shadow-inner">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-1">No Orders Found</h3>
            <p className="text-sm text-muted-foreground mb-6 px-4">
              It looks like you haven't placed any orders yet. Add groceries to your cart and place your first order today!
            </p>
            <Link to="/">
              <Button className="font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
                Start Shopping <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
