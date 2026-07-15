import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import Layout from '../components/Layout.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { User, MapPin, Key, Plus, Trash2, Edit3 } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { user, updateProfileName, changePassword, addAddress, updateAddress, deleteAddress } = useAuth();
  
  // Profile info state
  const [name, setName] = useState(user?.name || '');
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);

  // Sync name state when user data loads or updates
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  // Safe helper to extract initials
  const getInitials = (nameString?: string) => {
    if (!nameString) return '';
    return nameString
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Address Dialog state
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('India');
  const [isDefault, setIsDefault] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const handleOpenCreateAddress = () => {
    setEditingAddressId(null);
    setStreet('');
    setCity('');
    setState('');
    setZipCode('');
    setCountry('India');
    setIsDefault(false);
    setIsAddressOpen(true);
  };

  const handleOpenEditAddress = (address: any) => {
    setEditingAddressId(address.id);
    setStreet(address.street);
    setCity(address.city);
    setState(address.state);
    setZipCode(address.zipCode);
    setCountry(address.country);
    setIsDefault(address.isDefault);
    setIsAddressOpen(true);
  };

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsUpdatingInfo(true);
    await updateProfileName(name);
    setIsUpdatingInfo(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setIsChangingPass(true);
    const success = await changePassword(currentPassword, newPassword);
    setIsChangingPass(false);

    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !city || !state || !zipCode) {
      toast.error('Please fill in all address fields.');
      return;
    }

    setIsAddingAddress(true);
    let success = false;
    if (editingAddressId) {
      success = await updateAddress(editingAddressId, {
        street,
        city,
        state,
        zipCode,
        country,
        isDefault,
      });
    } else {
      success = await addAddress({
        street,
        city,
        state,
        zipCode,
        country,
        isDefault,
      });
    }
    setIsAddingAddress(false);

    if (success) {
      setStreet('');
      setCity('');
      setState('');
      setZipCode('');
      setIsDefault(false);
      setEditingAddressId(null);
      setIsAddressOpen(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      await deleteAddress(id);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-extrabold text-primary mb-2">My Account</h1>
        <p className="text-muted-foreground mb-8">Manage your profile details, shipping addresses, and security settings.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Summary Sidebar */}
          <Card className="md:col-span-1 border border-primary/10 shadow-sm h-fit">
            <CardHeader className="flex flex-col items-center pb-6 border-b border-border bg-secondary/10">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold shadow-md mb-4">
                {getInitials(user?.name)}
              </div>
              <h2 className="font-bold text-lg text-center leading-none mb-1">{user?.name}</h2>
              <span className="text-xs text-muted-foreground bg-accent/25 text-accent-foreground px-2 py-0.5 rounded-full capitalize">
                {user?.role}
              </span>
            </CardHeader>
            <CardContent className="pt-4 text-sm space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Email Address</p>
                <p className="font-medium truncate">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Verification Status</p>
                <p className={`font-semibold ${user?.isVerified ? 'text-primary' : 'text-destructive'}`}>
                  {user?.isVerified ? 'Verified' : 'Unverified'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Details Tabs */}
          <Tabs defaultValue="profile" className="md:col-span-3">
            <TabsList className="grid grid-cols-3 w-full bg-secondary/30 p-1 border border-border rounded-lg mb-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Info
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Addresses
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Key className="h-4 w-4" /> Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Info Tab */}
            <TabsContent value="profile" className="space-y-4">
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateInfo}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">Full Name</Label>
                      <Input
                        id="profile-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="border-primary/20 focus-visible:ring-primary"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isUpdatingInfo} className="font-bold">
                      {isUpdatingInfo ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-xl font-bold">Address Book</h3>
                  <p className="text-sm text-muted-foreground">Manage your shipping destinations</p>
                </div>
                
                {/* Add Address Dialog */}
                <Dialog open={isAddressOpen} onOpenChange={setIsAddressOpen}>
                  <Button onClick={handleOpenCreateAddress} className="font-bold flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add Address
                  </Button>
                  <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSaveAddress}>
                      <DialogHeader>
                        <DialogTitle>{editingAddressId ? 'Edit Shipping Address' : 'Add Shipping Address'}</DialogTitle>
                        <DialogDescription>
                          Provide delivery coordinates for order checkouts.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="street">Street Address</Label>
                          <Input
                            id="street"
                            placeholder="Apartment, House No, Street name"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              placeholder="e.g. Mumbai"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              placeholder="e.g. Maharashtra"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="zipCode">Zip / Postal Code</Label>
                            <Input
                              id="zipCode"
                              placeholder="e.g. 400001"
                              value={zipCode}
                              onChange={(e) => setZipCode(e.target.value)}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox
                            id="isDefault"
                            checked={isDefault}
                            onCheckedChange={(checked) => setIsDefault(checked === true)}
                          />
                          <Label htmlFor="isDefault" className="text-sm font-medium leading-none cursor-pointer">
                            Set as default shipping address
                          </Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={isAddingAddress} className="w-full sm:w-auto font-bold">
                          {isAddingAddress ? 'Saving...' : editingAddressId ? 'Save Changes' : 'Add Address'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Address List */}
              <div className="grid grid-cols-1 gap-4">
                {user?.addresses && user.addresses.length > 0 ? (
                  user.addresses.map((address) => (
                    <Card key={address.id} className={`border ${address.isDefault ? 'border-primary shadow-sm' : 'border-border'}`}>
                      <CardContent className="p-5 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 p-2 rounded-lg bg-secondary">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-foreground">Address</span>
                              {address.isDefault && (
                                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-foreground leading-snug">{address.street}</p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} - {address.zipCode}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{address.country}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEditAddress(address)}
                            className="hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors duration-200 h-8 w-8 rounded-full"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteAddress(address.id)}
                            className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors duration-200 h-8 w-8 rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border border-dashed border-border py-12 flex flex-col items-center justify-center text-center">
                    <MapPin className="h-10 w-10 text-muted-foreground/50 mb-3" />
                    <h4 className="font-bold text-lg mb-1">No Addresses Saved</h4>
                    <p className="text-sm text-muted-foreground max-w-sm mb-4">
                      Add a shipping address to speed up your order placements.
                    </p>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Change Password Tab */}
            <TabsContent value="security" className="space-y-4">
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Keep your account secure by rotating your password.</CardDescription>
                </CardHeader>
                <form onSubmit={handleChangePassword}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-pass">Current Password</Label>
                      <Input
                        id="current-pass"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="border-primary/20 focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-pass">New Password</Label>
                      <Input
                        id="new-pass"
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="border-primary/20 focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-pass">Confirm New Password</Label>
                      <Input
                        id="confirm-pass"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="border-primary/20 focus-visible:ring-primary"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isChangingPass} className="font-bold">
                      {isChangingPass ? 'Updating...' : 'Update Password'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
