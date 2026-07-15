import crypto from 'crypto';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { VisitorAnalytics } from '../models/VisitorAnalytics.js';
export const trackVisitor = async (req, res, next) => {
    const maxRetries = 3;
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            const { visitorId, path, browser, os, device, country, city, sessionDuration } = req.body;
            if (!visitorId) {
                res.status(400).json({ success: false, message: 'visitorId is required.' });
                return;
            }
            // Hash or anonymize IP for privacy
            const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
            const ipHash = crypto.createHash('md5').update(ip.toString()).digest('hex');
            let visitor = await VisitorAnalytics.findOne({ visitorId });
            if (visitor) {
                // Update existing visitor session
                if (sessionDuration) {
                    visitor.sessionDuration += sessionDuration;
                }
                if (path) {
                    const pageViewIndex = visitor.pageViews.findIndex((pv) => pv.path === path);
                    if (pageViewIndex !== -1) {
                        visitor.pageViews[pageViewIndex].viewsCount += 1;
                        visitor.pageViews[pageViewIndex].lastViewedAt = new Date();
                    }
                    else {
                        visitor.pageViews.push({ path, viewsCount: 1, lastViewedAt: new Date() });
                    }
                }
                await visitor.save();
            }
            else {
                // Create new visitor
                visitor = await VisitorAnalytics.create({
                    visitorId,
                    ipHash,
                    browser: browser || 'Unknown',
                    os: os || 'Unknown',
                    device: device || 'desktop',
                    country: country || 'India',
                    city: city || 'Unknown',
                    sessionDuration: sessionDuration || 0,
                    pageViews: path ? [{ path, viewsCount: 1, lastViewedAt: new Date() }] : [],
                    isReturning: false,
                });
            }
            res.status(200).json({ success: true, visitor });
            return;
        }
        catch (error) {
            if (error.name === 'VersionError') {
                attempt++;
                console.warn(`Concurrency VersionError during visitor tracking. Retry attempt: ${attempt}`);
                // Small delay before retry
                await new Promise((resolve) => setTimeout(resolve, 50));
            }
            else {
                next(error);
                return;
            }
        }
    }
    res.status(500).json({ success: false, message: 'Fulfillment concurrency limit reached.' });
};
export const getDashboardStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        // Sum sales
        const salesAggregate = await Order.aggregate([
            { $match: { orderStatus: { $ne: 'cancelled' }, paymentStatus: 'completed' } },
            { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } },
        ]);
        const totalSales = salesAggregate[0]?.totalSales || 0;
        // Monthly Sales Chart Data (last 6 months)
        const monthlySales = await Order.aggregate([
            {
                $match: {
                    orderStatus: { $ne: 'cancelled' },
                    paymentStatus: 'completed',
                    createdAt: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        // Format monthly data or inject mock if database is empty
        let chartData = monthlySales.map((item) => ({
            month: item._id,
            revenue: item.revenue,
            orders: item.orders,
        }));
        if (chartData.length === 0) {
            // Fallback fallback / seed for visualization
            chartData = [
                { month: '2026-02', revenue: 12000, orders: 45 },
                { month: '2026-03', revenue: 15400, orders: 60 },
                { month: '2026-04', revenue: 18200, orders: 75 },
                { month: '2026-05', revenue: 22000, orders: 90 },
                { month: '2026-06', revenue: 27500, orders: 110 },
                { month: '2026-07', revenue: totalSales || 35000, orders: totalOrders || 140 },
            ];
        }
        // Category Sales Distribution
        const categorySales = await Order.aggregate([
            { $match: { orderStatus: { $ne: 'cancelled' } } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.name', // Grouping by item name or category
                    sales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                },
            },
            { $limit: 5 },
        ]);
        let categoryData = categorySales.map((item) => ({
            name: item._id,
            value: item.sales,
        }));
        if (categoryData.length === 0) {
            categoryData = [
                { name: 'Groceries', value: 4500 },
                { name: 'Snacks', value: 3000 },
                { name: 'Stationary', value: 1500 },
            ];
        }
        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalSales,
            },
            monthlySales: chartData,
            categorySales: categoryData,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getVisitorStats = async (req, res, next) => {
    try {
        const totalVisitors = await VisitorAnalytics.countDocuments();
        const uniqueVisitors = await VisitorAnalytics.distinct('visitorId').then((arr) => arr.length);
        const returningVisitors = await VisitorAnalytics.countDocuments({ isReturning: true });
        // Average session duration
        const durationAggregate = await VisitorAnalytics.aggregate([
            { $group: { _id: null, avgDuration: { $avg: '$sessionDuration' } } },
        ]);
        const avgSessionDuration = durationAggregate[0]?.avgDuration || 0;
        // Device distribution
        const deviceAggregate = await VisitorAnalytics.aggregate([
            { $group: { _id: '$device', count: { $sum: 1 } } },
        ]);
        let deviceStats = deviceAggregate.map((item) => ({
            name: item._id,
            value: item.count,
        }));
        if (deviceStats.length === 0) {
            deviceStats = [
                { name: 'desktop', value: 65 },
                { name: 'mobile', value: 30 },
                { name: 'tablet', value: 5 },
            ];
        }
        // Browser distribution
        const browserAggregate = await VisitorAnalytics.aggregate([
            { $group: { _id: '$browser', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);
        let browserStats = browserAggregate.map((item) => ({
            name: item._id,
            count: item.count,
        }));
        if (browserStats.length === 0) {
            browserStats = [
                { name: 'Chrome', count: 120 },
                { name: 'Safari', count: 45 },
                { name: 'Firefox', count: 20 },
                { name: 'Edge', count: 15 },
            ];
        }
        // Location distribution
        const countryAggregate = await VisitorAnalytics.aggregate([
            { $group: { _id: '$country', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);
        let countryStats = countryAggregate.map((item) => ({
            country: item._id,
            visitors: item.count,
        }));
        if (countryStats.length === 0) {
            countryStats = [
                { country: 'India', visitors: 150 },
                { country: 'United States', visitors: 30 },
                { country: 'United Kingdom', visitors: 10 },
            ];
        }
        // Most Viewed Products pageviews analysis
        const pageViewsAggregate = await VisitorAnalytics.aggregate([
            { $unwind: '$pageViews' },
            {
                $group: {
                    _id: '$pageViews.path',
                    views: { $sum: '$pageViews.viewsCount' },
                },
            },
            { $sort: { views: -1 } },
            { $limit: 10 },
        ]);
        const mostViewedPages = pageViewsAggregate.map((item) => ({
            path: item._id,
            views: item.views,
        }));
        res.status(200).json({
            success: true,
            summary: {
                totalVisitors,
                uniqueVisitors,
                returningVisitors,
                avgSessionDuration: Math.round(avgSessionDuration),
            },
            deviceStats,
            browserStats,
            countryStats,
            mostViewedPages,
        });
    }
    catch (error) {
        next(error);
    }
};
