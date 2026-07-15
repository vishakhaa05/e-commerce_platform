import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout.js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '../../lib/api.js';
import { Eye, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog State to view full contents
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to retrieve orders list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { orderStatus: status });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchOrders();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 dark:text-yellow-400 font-semibold';
      case 'processing': return 'text-blue-600 dark:text-blue-400 font-semibold';
      case 'shipped': return 'text-purple-600 dark:text-purple-400 font-semibold';
      case 'delivered': return 'text-green-600 dark:text-green-400 font-bold';
      case 'cancelled': return 'text-red-500 dark:text-red-400 font-bold';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground">Order Management</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Track user orders, update fulfillment stages, and verify payments.</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchOrders} className="font-bold flex items-center gap-1">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <Card className="border border-border overflow-hidden">
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/15 text-xs text-muted-foreground uppercase border-b border-border">
                  <tr>
                    <th className="p-4 font-bold">Invoice</th>
                    <th className="p-4 font-bold">Customer</th>
                    <th className="p-4 font-bold">Date</th>
                    <th className="p-4 font-bold">Total</th>
                    <th className="p-4 font-bold">Payment</th>
                    <th className="p-4 font-bold">Fulfillment Status</th>
                    <th className="p-4 font-bold text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-secondary/5 transition-colors">
                      <td className="p-4 font-bold text-foreground">{order.invoiceNumber}</td>
                      <td className="p-4">
                        <div className="text-xs">
                          <p className="font-bold text-foreground">{order.user?.name || 'Guest'}</p>
                          <p className="text-muted-foreground">{order.user?.email || ''}</p>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: '2-digit',
                        })}
                      </td>
                      <td className="p-4 font-bold text-primary">₹{order.totalAmount}</td>
                      <td className="p-4">
                        <div className="text-[10px]">
                          <span className="bg-accent/15 text-accent-foreground font-bold px-1.5 py-0.5 rounded uppercase">
                            {order.paymentMethod}
                          </span>
                          <p className="text-muted-foreground mt-0.5 capitalize">{order.paymentStatus}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Select
                          value={order.orderStatus}
                          onValueChange={(val) => handleUpdateStatus(order._id, val)}
                          disabled={order.orderStatus === 'cancelled' || order.orderStatus === 'delivered'}
                        >
                          <SelectTrigger className={`w-32 h-8 text-xs font-bold ${getStatusColor(order.orderStatus)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending" className="text-xs font-semibold text-yellow-600">Pending</SelectItem>
                            <SelectItem value="processing" className="text-xs font-semibold text-blue-600">Processing</SelectItem>
                            <SelectItem value="shipped" className="text-xs font-semibold text-purple-600">Shipped</SelectItem>
                            <SelectItem value="delivered" className="text-xs font-bold text-green-600">Delivered</SelectItem>
                            <SelectItem value="cancelled" className="text-xs font-bold text-red-500" disabled>Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)} className="h-8 w-8 hover:bg-secondary">
                          <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[480px]">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order Summary #{selectedOrder.invoiceNumber}</DialogTitle>
                <DialogDescription>
                  Items and shipment coordinates details.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 text-sm">
                <div>
                  <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2">Shipping Destination</h4>
                  <p className="text-muted-foreground">
                    {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}<br />
                    {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.zipCode}
                  </p>
                </div>
                <div className="border-t border-border pt-4">
                  <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2">Cart Contents</h4>
                  <div className="divide-y divide-border/60 max-h-[200px] overflow-y-auto pr-1">
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center py-2 text-xs">
                        <span className="truncate max-w-[240px] text-muted-foreground">
                          {item.name} <strong>x{item.quantity}</strong>
                        </span>
                        <span className="font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border pt-3 space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Discount applied</span>
                    <span>-₹{selectedOrder.discountAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery fee</span>
                    <span>₹{selectedOrder.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-foreground text-sm pt-1 border-t border-border/40">
                    <span>Total Amount Charged</span>
                    <span className="text-primary font-black">₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOrders;
