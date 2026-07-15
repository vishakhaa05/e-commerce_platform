import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout.js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '../../lib/api.js';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog & Form States
  const [isOpen, setIsOpen] = useState(false);
  const [editCat, setEditCat] = useState<any>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to retrieve categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditCat(null);
    setName('');
    setDescription('');
    setIsOpen(true);
  };

  const handleOpenEdit = (category: any) => {
    setEditCat(category);
    setName(category.name);
    setDescription(category.description || '');
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsSaving(true);
    try {
      let res;
      if (editCat) {
        res = await api.put(`/categories/${editCat._id}`, { name, description });
      } else {
        res = await api.post('/categories', { name, description });
      }

      if (res.data.success) {
        toast.success(res.data.message);
        setIsOpen(false);
        fetchCategories();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save category.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This might affect product listings.')) return;

    try {
      const res = await api.delete(`/categories/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchCategories();
      }
    } catch (err) {
      toast.error('Failed to delete category.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground">Categories Catalog</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Manage store categories mapping.</p>
          </div>
          <Button onClick={handleOpenCreate} className="font-bold flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add Category
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
                    <th className="p-4 font-bold">Name</th>
                    <th className="p-4 font-bold">Slug / Category ID</th>
                    <th className="p-4 font-bold">Description</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-secondary/5 transition-colors">
                      <td className="p-4 font-bold text-foreground">{cat.name}</td>
                      <td className="p-4 font-mono text-xs text-muted-foreground">{cat.slug}</td>
                      <td className="p-4 text-muted-foreground truncate max-w-xs">{cat.description || 'No description provided.'}</td>
                      <td className="p-4 text-right space-x-1.5 flex justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(cat)} className="h-8 w-8 hover:bg-primary/10 text-primary">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(cat._id)} className="h-8 w-8 hover:bg-destructive/10 text-destructive">
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

      {/* Save Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{editCat ? 'Edit Category' : 'Add Category'}</DialogTitle>
              <DialogDescription>
                Define categories details. The slug is generated automatically.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-1">
                <Label htmlFor="cat-name" className="text-xs">Category Name</Label>
                <Input
                  id="cat-name"
                  placeholder="e.g. Fresh Dairy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="cat-desc" className="text-xs">Description</Label>
                <Input
                  id="cat-desc"
                  placeholder="Short explanation of products within this category"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSaving} className="w-full sm:w-auto font-bold">
                {isSaving ? 'Saving...' : 'Save Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCategories;
