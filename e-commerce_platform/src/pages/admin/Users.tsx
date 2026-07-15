import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout.js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '../../lib/api.js';
import { Shield, ShieldAlert, Trash2, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to retrieve users list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Are you sure you want to change this user's role to ${nextRole}?`)) return;

    try {
      const res = await api.patch(`/users/${userId}/role`, { role: nextRole });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchUsers();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to permanently delete this user account?')) return;

    try {
      const res = await api.delete(`/users/${userId}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchUsers();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete user account.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">User Profiles Management</h2>
          <p className="text-sm text-muted-foreground mt-0.5">View registered users and manage security roles.</p>
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
                    <th className="p-4 font-bold">Shopper Name</th>
                    <th className="p-4 font-bold">Email Address</th>
                    <th className="p-4 font-bold">Role</th>
                    <th className="p-4 font-bold">Email Status</th>
                    <th className="p-4 font-bold">Registered Date</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((item) => (
                    <tr key={item._id} className="hover:bg-secondary/5 transition-colors">
                      <td className="p-4 font-bold text-foreground flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-xs">
                          {item.name[0].toUpperCase()}
                        </div>
                        {item.name}
                      </td>
                      <td className="p-4 text-muted-foreground">{item.email}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 w-fit capitalize ${
                          item.role === 'admin'
                            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/10 dark:text-red-400'
                            : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/10 dark:text-green-400'
                        }`}>
                          {item.role === 'admin' ? <ShieldAlert className="h-3 w-3" /> : <User className="h-3 w-3" />}
                          {item.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border w-fit ${
                          item.isVerified
                            ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400'
                        }`}>
                          {item.isVerified ? 'Verified' : 'Pending Verification'}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground text-xs">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="p-4 text-right space-x-1 flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleRole(item._id, item.role)}
                          className="h-8 w-8 hover:bg-primary/10 text-primary"
                          title="Toggle Admin Privilege"
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(item._id)}
                          className="h-8 w-8 hover:bg-destructive/10 text-destructive"
                          title="Delete Account"
                        >
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
    </AdminLayout>
  );
};

export default AdminUsers;
