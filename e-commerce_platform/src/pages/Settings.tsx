import React, { useState } from 'react';
import Layout from '../components/Layout.js';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Bell, Shield, Eye, Palette } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const [emailPromo, setEmailPromo] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleToggleTheme = (checked: boolean) => {
    setDarkMode(checked);
    // Toggle class on document element
    if (checked) {
      document.documentElement.classList.add('dark');
      toast.success('Dark mode enabled!');
    } else {
      document.documentElement.classList.remove('dark');
      toast.success('Light mode enabled!');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-extrabold text-primary mb-2 flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" /> Settings
        </h1>
        <p className="text-muted-foreground mb-8">
          Personalize your account settings, notifications, and visual preferences.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6 md:col-span-2">
            {/* Notifications */}
            <Card className="border border-border">
              <CardHeader className="flex flex-row items-center gap-2 pb-3">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">Notifications</CardTitle>
                  <CardDescription>Configure how you receive updates and promotions.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="order-updates" className="text-sm font-bold">Order Tracking updates</Label>
                    <p className="text-xs text-muted-foreground">Receive push logs when order status transitions.</p>
                  </div>
                  <Switch
                    id="order-updates"
                    checked={orderUpdates}
                    onCheckedChange={(checked) => {
                      setOrderUpdates(checked);
                      toast.success(checked ? 'Order notifications enabled.' : 'Order notifications disabled.');
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-promo" className="text-sm font-bold">Promotions & Coupons</Label>
                    <p className="text-xs text-muted-foreground">Get notified about discounts and newly seeded stock coupons.</p>
                  </div>
                  <Switch
                    id="email-promo"
                    checked={emailPromo}
                    onCheckedChange={(checked) => {
                      setEmailPromo(checked);
                      toast.success(checked ? 'Promo notifications enabled.' : 'Promo notifications disabled.');
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="border border-border">
              <CardHeader className="flex flex-row items-center gap-2 pb-3">
                <Palette className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">Appearance</CardTitle>
                  <CardDescription>Customize the application theme and layout.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode" className="text-sm font-bold">Dark Theme</Label>
                    <p className="text-xs text-muted-foreground">Switch between high-contrast light and dark modes.</p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={handleToggleTheme}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="border border-border">
              <CardHeader className="flex flex-row items-center gap-2 pb-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">Advanced Security</CardTitle>
                  <CardDescription>Activate additional user account safeguards.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor" className="text-sm font-bold">Two-Factor Authentication</Label>
                    <p className="text-xs text-muted-foreground">Require confirmation code on logins (Mock).</p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={twoFactor}
                    onCheckedChange={(checked) => {
                      setTwoFactor(checked);
                      toast.info('Two-Factor authentication setup flow triggered.');
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Help Card */}
          <Card className="border border-primary/10 shadow-sm h-fit bg-secondary/15">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-1">
                <Eye className="h-4 w-4 text-primary" /> Need Help?
              </CardTitle>
              <CardDescription className="text-xs">
                Quick answers to configuration issues.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs space-y-4 pt-2">
              <div>
                <h5 className="font-bold mb-1 text-foreground">How does verification work?</h5>
                <p className="text-muted-foreground">We send an email link to verify ownership. Non-verified users still have access to the shopping experience.</p>
              </div>
              <div>
                <h5 className="font-bold mb-1 text-foreground">Why can't I access Admin?</h5>
                <p className="text-muted-foreground">Only accounts with role parameter set to 'admin' can load the admin routes. Seeding creates a default administrator account.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
