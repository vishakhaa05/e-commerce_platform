import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '../../lib/api.js';
import { Plus, Edit2, Trash2, Loader2, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog States
  const [isOpen, setIsOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);

  // Form States
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCatalog = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products?category=all'),
        api.get('/categories'),
      ]);

      if (prodRes.data.success) setProducts(prodRes.data.products);
      if (catRes.data.success) setCategories(catRes.data.categories);
    } catch (err) {
      console.error(err);
      toast.error('Failed to retrieve catalog data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleOpenCreate = () => {
    setEditProduct(null);
    setName('');
    setDescription('');
    setPrice(0);
    setCategory(categories[0]?.slug || '');
    setImage('');
    setStock(10);
    setIsOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setCategory(product.category);
    setImage(product.image);
    setStock(product.stock);
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || price < 0 || !category || !image || stock < 0) {
      toast.error('Please complete all product fields correctly.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = { name, description, price, category, image, stock };
      let res;
      if (editProduct) {
        res = await api.put(`/products/${editProduct._id}`, payload);
      } else {
        res = await api.post('/products', payload);
      }

      if (res.data.success) {
        toast.success(res.data.message);
        setIsOpen(false);
        fetchCatalog();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchCatalog();
      }
    } catch (err) {
      toast.error('Failed to delete product.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground">Products Catalog</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Manage store grocery and stationary listings.</p>
          </div>
          <Button onClick={handleOpenCreate} className="font-bold flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add Product
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
                    <th className="p-4 font-bold">Image</th>
                    <th className="p-4 font-bold">Name</th>
                    <th className="p-4 font-bold">Category</th>
                    <th className="p-4 font-bold">Price</th>
                    <th className="p-4 font-bold">Stock</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-secondary/5 transition-colors">
                      <td className="p-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 object-cover rounded border border-border/60"
                        />
                      </td>
                      <td className="p-4 font-bold text-foreground max-w-[200px] truncate">{product.name}</td>
                      <td className="p-4 text-muted-foreground capitalize">{product.category}</td>
                      <td className="p-4 font-semibold text-primary">₹{product.price}</td>
                      <td className={`p-4 font-medium ${product.stock < 5 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                        {product.stock} units
                      </td>
                      <td className="p-4 text-right space-x-1.5 flex justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(product)} className="h-8 w-8 hover:bg-primary/10 text-primary">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product._id)} className="h-8 w-8 hover:bg-destructive/10 text-destructive">
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

      {/* Create / Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{editProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              <DialogDescription>
                Define catalog metadata and pricing parameters.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-1">
                <Label htmlFor="prod-name" className="text-xs">Product Name</Label>
                <Input
                  id="prod-name"
                  placeholder="e.g. Organic Tomatoes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="prod-desc" className="text-xs">Description</Label>
                <Textarea
                  id="prod-desc"
                  placeholder="Details, packaging size, health parameters..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="prod-price" className="text-xs">Price (₹)</Label>
                  <Input
                    id="prod-price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    required
                    min={0}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="prod-stock" className="text-xs">Available Stock</Label>
                  <Input
                    id="prod-stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value))}
                    required
                    min={0}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <Label className="text-xs">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="prod-img" className="text-xs">Image URL</Label>
                  <Input
                    id="prod-img"
                    placeholder="https://..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSaving} className="w-full sm:w-auto font-bold">
                {isSaving ? 'Saving...' : 'Save Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProducts;
