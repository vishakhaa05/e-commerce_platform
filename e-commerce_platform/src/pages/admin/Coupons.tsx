import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout.js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { api } from '../../lib/api.js';
import { Plus, Edit2, Trash2, Loader2, Tag } from 'lucide-react';
import { toast } from 'sonner';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog & Form States
  const [isOpen, setIsOpen] = useState(false);
  const [editCoupon, setEditCoupon] = useState<any>(null);
  
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('fixed');
  const [discountValue, setDiscountValue] = useState(0);
  const [minPurchase, setMinPurchase] = useState(0);
  const [expiryDate, setExpiryDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons');
      if (res.data.success) {
        setCoupons(res.data.coupons);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to retrieve coupons list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenCreate = () => {
    setEditCoupon(null);
    setCode('');
    setDiscountType('fixed');
    setDiscountValue(50);
    setMinPurchase(200);
    setExpiryDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 30 days ahead
    setIsActive(true);
    setIsOpen(true);
  };

  const handleOpenEdit = (coupon: any) => {
    setEditCoupon(coupon);
    setCode(coupon.code);
    setDiscountType(coupon.discountType);
    setDiscountValue(coupon.discountValue);
    setMinPurchase(coupon.minPurchase);
    setExpiryDate(new Date(coupon.expiryDate).toISOString().split('T')[0]);
    setIsActive(coupon.isActive);
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || discountValue <= 0 || minPurchase < 0 || !expiryDate) return;

    setIsSaving(true);
    try {
      const payload = { code, discountType, discountValue, minPurchase, expiryDate, isActive };
      let res;
      if (editCoupon) {
        res = await api.put(`/coupons/${editCoupon._id}`, payload);
      } else {
        res = await api.post('/coupons', payload);
      }

      if (res.data.success) {
        toast.success(res.data.message);
        setIsOpen(false);
        fetchCoupons();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save coupon.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const res = await api.delete(`/coupons/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchCoupons();
      }
    } catch (err) {
      toast.error('Failed to delete coupon.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground">Coupons Manager</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Manage discounts and promotional checkout keys.</p>
          </div>
          <Button onClick={handleOpenCreate} className="font-bold flex items-center gap-1">
            <Plus className="h-4 w-4" /> Create Coupon
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
                    <th className="p-4 font-bold">Code</th>
                    <th className="p-4 font-bold">Discount</th>
                    <th className="p-4 font-bold">Min Purchase</th>
                    <th className="p-4 font-bold">Expiry Date</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {coupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-secondary/5 transition-colors">
                      <td className="p-4 font-bold text-foreground flex items-center gap-1.5 uppercase">
                        <Tag className="h-3.5 w-3.5 text-primary" /> {coupon.code}
                      </td>
                      <td className="p-4 font-semibold text-primary">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}% Off` : `₹${coupon.discountValue} Off`}
                      </td>
                      <td className="p-4 text-muted-foreground">₹{coupon.minPurchase}</td>
                      <td className="p-4 text-muted-foreground text-xs">
                        {new Date(coupon.expiryDate).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          coupon.isActive && new Date(coupon.expiryDate) > new Date()
                            ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-400'
                        }`}>
                          {coupon.isActive && new Date(coupon.expiryDate) > new Date() ? 'Active' : 'Expired/Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1.5 flex justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(coupon)} className="h-8 w-8 hover:bg-primary/10 text-primary">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon._id)} className="h-8 w-8 hover:bg-destructive/10 text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
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

      {/* Save Coupon Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{editCoupon ? 'Edit Coupon Code' : 'Create Coupon'}</DialogTitle>
              <DialogDescription>
                Define promotional rules and validity.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-1">
                <Label htmlFor="coupon-code" className="text-xs">Coupon Code</Label>
                <Input
                  id="coupon-code"
                  placeholder="e.g. DISCOUNT30"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  disabled={!!editCoupon}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <Label className="text-xs">Discount Type</Label>
                  <Select value={discountType} onValueChange={(val: any) => setDiscountType(val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed (₹)</SelectItem>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="coupon-value" className="text-xs">Value</Label>
                  <Input
                    id="coupon-value"
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(parseFloat(e.target.value))}
                    required
                    min={1}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="coupon-min" className="text-xs">Min Purchase Required (₹)</Label>
                  <Input
                    id="coupon-min"
                    type="number"
                    value={minPurchase}
                    onChange={(e) => setMinPurchase(parseFloat(e.target.value))}
                    required
                    min={0}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="coupon-expiry" className="text-xs">Expiry Date</Label>
                  <Input
                    id="coupon-expiry"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="coupon-active" className="text-xs cursor-pointer font-bold">Activate coupon code</Label>
                <Switch
                  id="coupon-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSaving} className="w-full sm:w-auto font-bold">
                {isSaving ? 'Saving...' : 'Save Coupon'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCoupons;
