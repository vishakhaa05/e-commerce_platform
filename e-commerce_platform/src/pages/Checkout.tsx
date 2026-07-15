import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { useCart } from '../contexts/CartContext.js';
import Layout from '../components/Layout.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingBag, CreditCard, Landmark, Truck, Check, HelpCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { toast } from 'sonner';

// Helper to dynamically load external scripts (Razorpay SDK)
const loadScript = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { user, isAuthenticated, addAddress } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Address states
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user?.addresses.find((a) => a.isDefault)?.id || user?.addresses[0]?.id || ''
  );
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('cod');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Mock Payment Dialog state
  const [isMockPaymentOpen, setIsMockPaymentOpen] = useState(false);
  const [mockRazorpayOrderId, setMockRazorpayOrderId] = useState('');
  const [pendingOrderId, setPendingOrderId] = useState('');

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center max-w-lg">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-6">You need items in your cart to proceed to checkout.</p>
          <Button onClick={() => navigate('/')} className="font-bold">Browse Shop</Button>
        </div>
      </Layout>
    );
  }

  // Delivery fee calculation
  const subtotal = cartTotal;
  const deliveryFee = subtotal - discount > 500 ? 0 : 40;
  const grandTotal = subtotal - discount + deliveryFee;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;

    setIsValidatingCoupon(true);
    try {
      const res = await api.post('/coupons/validate', {
        code: couponCode,
        subtotal: subtotal,
      });

      if (res.data.success) {
        setAppliedCoupon(res.data);
        setDiscount(res.data.discountAmount);
        toast.success(`Coupon "${res.data.couponCode.toUpperCase()}" applied! Saved ₹${res.data.discountAmount}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to apply coupon.');
      setAppliedCoupon(null);
      setDiscount(0);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !city || !state || !zipCode) {
      toast.error('Please fill in all address fields.');
      return;
    }

    setIsAddingAddress(true);
    const success = await addAddress({
      street,
      city,
      state,
      zipCode,
      country: 'India',
      isDefault: true,
    });
    setIsAddingAddress(false);

    if (success) {
      setStreet('');
      setCity('');
      setState('');
      setZipCode('');
      // Autoselect the newly created default address
      if (user?.addresses) {
        const defaultAddr = user.addresses.find((a) => a.isDefault);
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      }
    }
  };

  // Triggers order creation
  const handlePlaceOrder = async () => {
    const address = user?.addresses.find((a) => a.id === selectedAddressId);
    if (!address) {
      toast.error('Please select or add a shipping address.');
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Create initial pending order
      const orderRes = await api.post('/orders', {
        shippingAddress: {
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
        },
        items: cart.map((item) => ({
          product: item.id || (item as any)._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        paymentMethod,
        couponCode: appliedCoupon?.couponCode,
      });

      if (orderRes.data.success) {
        const order = orderRes.data.order;

        if (paymentMethod === 'cod') {
          // COD Order placed successfully
          toast.success('Order placed successfully!');
          clearCart();
          navigate(`/orders/${order._id}`);
        } else {
          // Razorpay payment path
          setPendingOrderId(order._id);
          initiateRazorpayPayment(order._id);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place order.');
      setIsPlacingOrder(false);
    }
  };

  const initiateRazorpayPayment = async (orderId: string) => {
    try {
      const payRes = await api.post('/payments/razorpay-order', { orderId });
      
      if (payRes.data.success) {
        const { isMock, razorpayOrderId, key, amount, currency } = payRes.data;

        if (isMock) {
          // If keys are not set, open our Custom mock payment dialog
          setMockRazorpayOrderId(razorpayOrderId);
          setIsMockPaymentOpen(true);
        } else {
          // Load real Razorpay SDK
          const scriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
          if (!scriptLoaded) {
            toast.error('Razorpay SDK failed to load. Are you offline?');
            setIsPlacingOrder(false);
            return;
          }

          const options = {
            key,
            amount,
            currency,
            name: 'BigMarket',
            description: 'Order Payment',
            order_id: razorpayOrderId,
            handler: async (response: any) => {
              // Verify transaction on backend
              try {
                const verifyRes = await api.post('/payments/verify-signature', {
                  orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                });

                if (verifyRes.data.success) {
                  toast.success('Payment verified successfully!');
                  clearCart();
                  navigate(`/orders/${orderId}`);
                }
              } catch (verifyErr) {
                toast.error('Payment verification failed.');
              }
            },
            prefill: {
              name: user?.name,
              email: user?.email,
            },
            theme: {
              color: '#10b981',
            },
            modal: {
              ondismiss: () => {
                toast.error('Payment cancelled.');
                setIsPlacingOrder(false);
              },
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        }
      }
    } catch (err) {
      toast.error('Payment initialization failed.');
      setIsPlacingOrder(false);
    }
  };

  // Simulates verification signature hook
  const handleSimulatePayment = async (success: boolean) => {
    setIsMockPaymentOpen(false);

    if (!success) {
      toast.error('Simulated payment failed.');
      setIsPlacingOrder(false);
      return;
    }

    try {
      const verifyRes = await api.post('/payments/verify-signature', {
        orderId: pendingOrderId,
        razorpayOrderId: mockRazorpayOrderId,
        razorpayPaymentId: `pay_mock_${Math.random().toString(36).substring(2, 11)}`,
        razorpaySignature: 'mock_signature_hash',
      });

      if (verifyRes.data.success) {
        toast.success('Simulated payment successful! Finalizing order.');
        clearCart();
        navigate(`/orders/${pendingOrderId}`);
      }
    } catch (err) {
      toast.error('Simulation verification failed.');
      setIsPlacingOrder(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-extrabold text-primary mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping and Payment info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Address Selection */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" /> Delivery Address
                </CardTitle>
                <CardDescription>Select where your groceries should be delivered.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {user?.addresses && user.addresses.length > 0 ? (
                  <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId} className="grid grid-cols-1 gap-3">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedAddressId === addr.id
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border hover:bg-secondary/5'
                        }`}
                        onClick={() => setSelectedAddressId(addr.id)}
                      >
                        <RadioGroupItem value={addr.id} id={addr.id} className="mt-1" />
                        <div className="grid gap-0.5">
                          <Label htmlFor={addr.id} className="font-bold cursor-pointer text-foreground flex items-center gap-2">
                            Shipping Address
                            {addr.isDefault && (
                              <span className="bg-primary/10 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </Label>
                          <p className="text-sm text-foreground">{addr.street}</p>
                          <p className="text-xs text-muted-foreground">
                            {addr.city}, {addr.state} - {addr.zipCode}
                          </p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="text-center py-6 border border-dashed border-border rounded-lg bg-secondary/10">
                    <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">No saved addresses</p>
                    <p className="text-xs text-muted-foreground mb-4">Please add a shipping address below to place your order.</p>
                  </div>
                )}

                {/* Add new address inline form */}
                <div className="border-t border-border pt-4 mt-4">
                  <h4 className="font-bold text-sm mb-3">Add New Address</h4>
                  <form onSubmit={handleCreateAddress} className="space-y-3">
                    <div className="grid gap-1">
                      <Label htmlFor="street-check" className="text-xs">Street Address</Label>
                      <Input
                        id="street-check"
                        placeholder="Apartment, building, street address"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        required
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="grid gap-1 col-span-1">
                        <Label htmlFor="city-check" className="text-xs">City</Label>
                        <Input
                          id="city-check"
                          placeholder="City"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                          className="h-9 text-sm"
                        />
                      </div>
                      <div className="grid gap-1 col-span-1">
                        <Label htmlFor="state-check" className="text-xs">State</Label>
                        <Input
                          id="state-check"
                          placeholder="State"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          required
                          className="h-9 text-sm"
                        />
                      </div>
                      <div className="grid gap-1 col-span-1">
                        <Label htmlFor="zipCode-check" className="text-xs">Zip Code</Label>
                        <Input
                          id="zipCode-check"
                          placeholder="Zip"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          required
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={isAddingAddress} size="sm" variant="secondary" className="font-bold">
                      {isAddingAddress ? 'Saving...' : 'Save & Select Address'}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>

            {/* 2. Payment Method */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" /> Payment Method
                </CardTitle>
                <CardDescription>Select your preferred payment gateway.</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(val: any) => setPaymentMethod(val)}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <div
                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      paymentMethod === 'cod' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border'
                    }`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <RadioGroupItem value="cod" id="payment-cod" className="mt-1" />
                    <div>
                      <Label htmlFor="payment-cod" className="font-bold cursor-pointer flex items-center gap-1.5">
                        <Landmark className="h-4 w-4 text-primary" /> Cash on Delivery (COD)
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Pay with cash or UPI scan at delivery.</p>
                    </div>
                  </div>

                  <div
                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      paymentMethod === 'razorpay' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border'
                    }`}
                    onClick={() => setPaymentMethod('razorpay')}
                  >
                    <RadioGroupItem value="razorpay" id="payment-rp" className="mt-1" />
                    <div>
                      <Label htmlFor="payment-rp" className="font-bold cursor-pointer flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4 text-primary" /> Razorpay Secured
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Pay online securely via Cards, UPI, or Wallets.</p>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Cart summary & coupons sidebar */}
          <div className="space-y-6">
            
            {/* Coupon Code Card */}
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold">Apply Coupon Code</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <Input
                    placeholder="e.g. FRESH50"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="h-9 focus-visible:ring-primary border-primary/20"
                    disabled={appliedCoupon}
                  />
                  <Button type="submit" size="sm" className="font-bold" disabled={isValidatingCoupon || appliedCoupon}>
                    {isValidatingCoupon ? '...' : 'Apply'}
                  </Button>
                </form>
                {appliedCoupon && (
                  <div className="mt-3 text-xs bg-primary/10 text-primary p-2.5 rounded-lg font-medium flex items-center justify-between animate-fade-in">
                    <span>Code applied: <strong>{appliedCoupon.couponCode}</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCoupon(null);
                        setDiscount(0);
                        setCouponCode('');
                      }}
                      className="underline font-bold text-destructive"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Price Calculations */}
            <Card className="border border-primary/10 shadow-lg">
              <CardHeader className="border-b border-border bg-secondary/10 pb-4">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-5 text-sm">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-muted-foreground">
                    <span className="truncate max-w-[180px]">
                      {item.name} <strong className="text-foreground">x{item.quantity}</strong>
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                
                <div className="border-t border-border pt-3 mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-primary font-medium">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span>{deliveryFee === 0 ? <strong className="text-primary">Free</strong> : `₹${deliveryFee}`}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mt-4 flex justify-between items-center text-base font-extrabold text-foreground">
                  <span>Grand Total</span>
                  <span className="text-xl text-primary font-black">₹{grandTotal}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder || !selectedAddressId}
                  className="w-full font-bold shadow-md text-base py-6 hover:shadow-lg transition-all"
                >
                  {isPlacingOrder ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  ) : (
                    `Pay & Place Order`
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Mock Payment Simulation Modal */}
      <Dialog open={isMockPaymentOpen} onOpenChange={setIsMockPaymentOpen}>
        <DialogContent className="sm:max-w-[400px] text-center p-6">
          <DialogHeader className="flex flex-col items-center">
            <HelpCircle className="h-12 w-12 text-primary animate-pulse mb-2" />
            <DialogTitle className="text-xl font-bold">Secure Payment Sandbox</DialogTitle>
            <DialogDescription className="text-sm">
              Razorpay API keys are not configured. We've loaded the BigMarket mock payment gateway.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-secondary/20 p-4 rounded-lg text-left text-xs space-y-2 my-4 border border-border">
            <p><strong>Razorpay Order ID:</strong> {mockRazorpayOrderId}</p>
            <p><strong>Simulated Amount:</strong> ₹{grandTotal}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center w-full">
            <Button
              variant="outline"
              onClick={() => handleSimulatePayment(false)}
              className="font-bold border-destructive hover:bg-destructive/5 text-destructive"
            >
              Simulate Failure
            </Button>
            <Button
              onClick={() => handleSimulatePayment(true)}
              className="font-bold bg-primary text-primary-foreground hover:bg-primary/95"
            >
              Simulate Success
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Checkout;
