import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout.js';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { api } from '../../lib/api.js';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { IndianRupee, ShoppingBag, Users, Eye, Monitor, Compass, Globe } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

const AdminDashboard = () => {
  const [salesStats, setSalesStats] = useState<any>(null);
  const [visitorStats, setVisitorStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [dashRes, visRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/analytics/visitors'),
        ]);

        if (dashRes.data.success) {
          setSalesStats(dashRes.data);
        }
        if (visRes.data.success) {
          setVisitorStats(visRes.data);
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  const stats = salesStats?.stats || { totalSales: 0, totalOrders: 0, totalUsers: 0 };
  const monthlySales = salesStats?.monthlySales || [];
  const categorySales = salesStats?.categorySales || [];
  
  const visitorSummary = visitorStats?.summary || { totalVisitors: 0, uniqueVisitors: 0, avgSessionDuration: 0 };
  const deviceStats = visitorStats?.deviceStats || [];
  const browserStats = visitorStats?.browserStats || [];
  const mostViewedPages = visitorStats?.mostViewedPages || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">Analytics Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time summaries of store revenue, client checkouts, and visitor tracking.</p>
        </div>

        {/* Totals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Total Sales</CardTitle>
              <IndianRupee className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">₹{stats.totalSales}</div>
              <p className="text-[10px] text-muted-foreground mt-1">Accumulated completed transactions</p>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{stats.totalOrders}</div>
              <p className="text-[10px] text-muted-foreground mt-1">Total checkouts processed</p>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{stats.totalUsers}</div>
              <p className="text-[10px] text-muted-foreground mt-1">Registered shopper profiles</p>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase">Visitor Traffic</CardTitle>
              <Eye className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">{visitorSummary.totalVisitors}</div>
              <p className="text-[10px] text-muted-foreground mt-1">Page view counts logged</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 border border-border">
            <CardHeader>
              <CardTitle className="text-base font-bold">Revenue Growth & Checkouts</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySales} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => [`₹${value}`, '']} />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Revenue" />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Orders" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Sales Splits */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-base font-bold">Sales Share by Product</CardTitle>
            </CardHeader>
            <CardContent className="h-80 flex flex-col justify-center">
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categorySales} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={3} dataKey="value">
                      {categorySales.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value}`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs">
                {categorySales.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    <span className="text-muted-foreground truncate max-w-[80px]">{item.name}:</span>
                    <strong className="text-foreground">₹{item.value}</strong>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visitor Traffic splits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Device Pie Chart */}
          <Card className="border border-border">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Monitor className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-bold">Visitor Device Share</CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex flex-col justify-center">
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={deviceStats} cx="50%" cy="50%" outerRadius={55} dataKey="value" nameKey="name" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {deviceStats.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Browser List */}
          <Card className="border border-border">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Compass className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-bold">Top Browsers</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="divide-y divide-border text-sm">
                {browserStats.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between py-2.5">
                    <span className="font-semibold text-muted-foreground capitalize">{item.name}</span>
                    <span className="bg-secondary text-secondary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.count} views
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Page views */}
          <Card className="border border-border">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Globe className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-bold">Most Visited Paths</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="divide-y divide-border text-xs">
                {mostViewedPages.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between py-2.5">
                    <span className="font-mono text-muted-foreground truncate max-w-[180px]">{item.path}</span>
                    <span className="font-bold text-foreground">{item.views} hits</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
