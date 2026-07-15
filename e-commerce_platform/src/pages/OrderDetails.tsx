import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.js';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '../lib/api.js';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Download, Ban, Package, CheckCircle2, Truck, Clock } from 'lucide-react';
import { toast } from 'sonner';

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const navigate = useNavigate();

  const fetchOrderDetails = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order? This will restore product stock.')) {
      return;
    }

    setIsCancelling(true);
    try {
      const res = await api.put(`/orders/cancel/${id}`);
      if (res.data.success) {
        toast.success('Order cancelled successfully.');
        setOrder(res.data.order);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePrintInvoice = () => {
    if (!order) return;
    
    // Create print window with invoice layout
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups for this site.');
      return;
    }

    const itemsHtml = order.items
      .map(
        (item: any) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 12px; text-align: left;">${item.name}</td>
        <td style="padding: 12px; text-align: center;">₹${item.price}</td>
        <td style="padding: 12px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>
    `
      )
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.invoiceNumber}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; line-height: 1.5; }
            .invoice-box { max-w: 800px; margin: auto; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: bold; color: #10b981; }
            .title { font-size: 24px; font-weight: bold; color: #4b5563; }
            .details-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            .section-title { font-size: 14px; font-weight: bold; color: #9ca3af; text-transform: uppercase; margin-bottom: 8px; }
            .address-box { font-size: 14px; line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background-color: #f3f4f6; padding: 12px; font-weight: bold; color: #475569; }
            .totals-table { width: 300px; margin-left: auto; border: none; }
            .totals-table tr td { padding: 8px 12px; }
            .grand-total { font-size: 18px; font-weight: bold; color: #10b981; }
            .footer { border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 12px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div>
                <div class="logo">BigMarket</div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">Groceries, Snacks & Stationery Delivered</div>
              </div>
              <div>
                <div class="title">INVOICE</div>
                <div style="font-size: 14px; text-align: right; margin-top: 5px;">
                  No: <strong>${order.invoiceNumber}</strong><br>
                  Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>

            <div class="details-grid">
              <div>
                <div class="section-title">Billing & Shipping To:</div>
                <div class="address-box">
                  <strong>${order.shippingAddress.street}</strong><br>
                  ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
                  Zip Code: ${order.shippingAddress.zipCode}<br>
                  Country: ${order.shippingAddress.country}
                </div>
              </div>
              <div style="text-align: right;">
                <div class="section-title">Payment Info:</div>
                <div class="address-box">
                  Method: <span style="text-transform: uppercase;">${order.paymentMethod}</span><br>
                  Status: <span style="text-transform: capitalize;">${order.paymentStatus}</span><br>
                  Grand Total: <strong>₹${order.totalAmount}</strong>
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="text-align: left;">Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <table class="totals-table">
              <tr>
                <td>Subtotal:</td>
                <td style="text-align: right;">₹${(order.totalAmount + order.discountAmount - order.deliveryFee).toFixed(2)}</td>
              </tr>
              ${
                order.discountAmount > 0
                  ? `<tr>
                <td style="color: #10b981;">Discount:</td>
                <td style="text-align: right; color: #10b981;">-₹${order.discountAmount.toFixed(2)}</td>
              </tr>`
                  : ''
              }
              <tr>
                <td>Delivery Fee:</td>
                <td style="text-align: right;">${order.deliveryFee === 0 ? 'Free' : `₹${order.deliveryFee.toFixed(2)}`}</td>
              </tr>
              <tr class="grand-total" style="border-top: 1.5px solid #10b981;">
                <td>Grand Total:</td>
                <td style="text-align: right;">₹${order.totalAmount.toFixed(2)}</td>
              </tr>
            </table>

            <div class="footer">
              Thank you for shopping at BigMarket!<br>
              This is a computer-generated invoice and requires no signature. For support contact support@bigmarket.com
            </div>
          </div>
          <script>
            window.print();
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getTrackingIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'processing':
        return <Package className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'cancelled':
        return <Ban className="h-5 w-5 text-destructive" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:text-yellow-400';
      case 'processing':
        return 'text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:text-blue-400';
      case 'shipped':
        return 'text-purple-600 border-purple-200 bg-purple-50 dark:bg-purple-900/10 dark:text-purple-400';
      case 'delivered':
        return 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/10 dark:text-green-400';
      case 'cancelled':
        return 'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/10 dark:text-red-400';
      default:
        return 'text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-900/10 dark:text-gray-400';
    }
  };

  const isCancelable = order?.orderStatus === 'pending' || order?.orderStatus === 'processing';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/orders')} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Orders
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : order ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Left side: Order contents & timeline */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Order Meta Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-secondary/15 p-5 border border-border rounded-xl">
                <div>
                  <h1 className="text-xl font-bold flex items-center gap-2">
                    Order <span>#{order.invoiceNumber}</span>
                  </h1>
                  <p className="text-xs text-muted-foreground mt-1">
                    Placed on{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button variant="outline" size="sm" onClick={handlePrintInvoice} className="flex-1 sm:flex-initial items-center gap-1 font-bold">
                    <Download className="h-4 w-4" /> Invoice
                  </Button>
                  {isCancelable && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleCancelOrder}
                      disabled={isCancelling}
                      className="flex-1 sm:flex-initial items-center gap-1 font-bold"
                    >
                      <Ban className="h-4 w-4" /> Cancel Order
                    </Button>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <Card className="border border-border">
                <CardHeader className="pb-3 border-b border-border bg-secondary/5">
                  <CardTitle className="text-lg">Items Purchased</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4 p-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 object-cover rounded-lg bg-muted border border-border/60 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-foreground truncate">{item.name}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">₹{item.price} each</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">₹{item.price * item.quantity}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Timeline */}
              <Card className="border border-border">
                <CardHeader className="pb-3 border-b border-border bg-secondary/5">
                  <CardTitle className="text-lg">Order Tracking Timeline</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="relative border-l border-border pl-6 space-y-6">
                    {order.trackingHistory.map((stage: any, idx: number) => {
                      const isLast = idx === order.trackingHistory.length - 1;
                      return (
                        <div key={idx} className="relative">
                          {/* Dot indicator */}
                          <span
                            className={`absolute -left-[37px] top-0.5 rounded-full p-1 border shadow-sm ${
                              isLast ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-muted-foreground border-border'
                            }`}
                          >
                            {getTrackingIcon(stage.status)}
                          </span>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm capitalize text-foreground">{stage.status}</h4>
                              <span className="text-[10px] text-muted-foreground">
                                {new Date(stage.timestamp).toLocaleDateString('en-IN', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            {stage.message && (
                              <p className="text-xs text-muted-foreground mt-1 leading-snug">{stage.message}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right side: Payment summary & address details */}
            <div className="space-y-6">
              
              {/* Status card */}
              <Card className={`border shadow-sm text-center p-5 ${getStatusColor(order.orderStatus)}`}>
                <p className="text-xs font-semibold uppercase tracking-wider">Current Status</p>
                <h3 className="text-2xl font-black capitalize mt-1">{order.orderStatus}</h3>
              </Card>

              {/* Delivery Details */}
              <Card className="border border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Delivery Coordinates</CardTitle>
                </CardHeader>
                <CardContent className="text-sm pt-2">
                  <p className="font-bold text-foreground">Shipping Destination</p>
                  <p className="text-muted-foreground mt-1 leading-relaxed">
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}<br />
                    {order.shippingAddress.country}
                  </p>
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card className="border border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3 pt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method</span>
                    <span className="font-bold uppercase">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-bold capitalize">{order.paymentStatus}</span>
                  </div>
                  {order.paymentDetails?.razorpayPaymentId && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Payment ID</span>
                      <span className="font-mono text-muted-foreground">{order.paymentDetails.razorpayPaymentId}</span>
                    </div>
                  )}

                  <div className="border-t border-border pt-3 mt-3 space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{(order.totalAmount + order.discountAmount - order.deliveryFee).toFixed(2)}</span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="flex justify-between text-primary font-medium">
                        <span>Coupon Savings</span>
                        <span>-₹{order.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₹{order.deliveryFee.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3 flex justify-between items-center text-sm font-extrabold text-foreground">
                    <span>Total Charged</span>
                    <span className="text-base text-primary font-black">₹{order.totalAmount}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Order details could not be found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderDetails;
