import mongoose from 'mongoose';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { Notification } from '../models/Notification.js';
export const createOrder = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authorized.' });
            return;
        }
        const { shippingAddress, items, paymentMethod, couponCode } = req.body;
        if (!items || items.length === 0) {
            res.status(400).json({ success: false, message: 'Cart items are required.' });
            return;
        }
        // Secure price calculation from Database
        let subtotal = 0;
        const orderItems = [];
        for (const item of items) {
            if (!mongoose.isValidObjectId(item.product)) {
                res.status(400).json({
                    success: false,
                    message: `Invalid product ID "${item.product}". Your cart may contain outdated items from a previous session. Please clear your cart and add products again.`,
                });
                return;
            }
            const dbProduct = await Product.findById(item.product);
            if (!dbProduct) {
                res.status(404).json({ success: false, message: `Product ${item.name} not found.` });
                return;
            }
            if (dbProduct.stock < item.quantity) {
                res.status(400).json({ success: false, message: `Insufficient stock for product ${dbProduct.name}.` });
                return;
            }
            subtotal += dbProduct.price * item.quantity;
            orderItems.push({
                product: dbProduct._id,
                name: dbProduct.name,
                price: dbProduct.price,
                image: dbProduct.image,
                quantity: item.quantity,
            });
        }
        // Process coupon
        let discountAmount = 0;
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
            if (coupon && coupon.expiryDate > new Date() && subtotal >= coupon.minPurchase) {
                if (coupon.discountType === 'percentage') {
                    discountAmount = parseFloat(((subtotal * coupon.discountValue) / 100).toFixed(2));
                }
                else {
                    discountAmount = coupon.discountValue;
                }
                // Limit discount to subtotal
                if (discountAmount > subtotal) {
                    discountAmount = subtotal;
                }
            }
        }
        // Delivery fee: Free for subtotal > 500, otherwise 40
        const deliveryFee = subtotal - discountAmount > 500 ? 0 : 40;
        const totalAmount = parseFloat((subtotal - discountAmount + deliveryFee).toFixed(2));
        // Generate Invoice Number
        const invoiceNumber = `FM-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        const order = await Order.create({
            user: req.user._id,
            shippingAddress,
            items: orderItems,
            paymentMethod,
            paymentStatus: 'pending',
            orderStatus: 'pending',
            couponCode,
            discountAmount,
            deliveryFee,
            totalAmount,
            invoiceNumber,
            trackingHistory: [
                {
                    status: 'pending',
                    timestamp: new Date(),
                    message: 'Order successfully placed and awaiting confirmation.',
                },
            ],
        });
        // Deduct stock
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            });
        }
        // Notify Admins and User
        await Notification.create({
            user: req.user._id,
            title: 'Order Placed Successfully',
            message: `Your order ${invoiceNumber} has been received. Total: ₹${totalAmount}.`,
            type: 'order',
        });
        // Return response
        res.status(201).json({
            success: true,
            message: 'Order created successfully.',
            order,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getMyOrders = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authorized.' });
            return;
        }
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getOrderById = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authorized.' });
            return;
        }
        const order = await Order.findById(req.params.id);
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found.' });
            return;
        }
        // Verify ownership
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403).json({ success: false, message: 'Not authorized to view this order.' });
            return;
        }
        res.status(200).json({
            success: true,
            order,
        });
    }
    catch (error) {
        next(error);
    }
};
export const cancelOrder = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authorized.' });
            return;
        }
        const order = await Order.findById(req.params.id);
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found.' });
            return;
        }
        // Verify ownership
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403).json({ success: false, message: 'Not authorized to cancel this order.' });
            return;
        }
        // Cancellable statuses: pending, processing
        if (order.orderStatus !== 'pending' && order.orderStatus !== 'processing') {
            res.status(400).json({ success: false, message: 'Cannot cancel order in shipped or delivered status.' });
            return;
        }
        order.orderStatus = 'cancelled';
        order.trackingHistory.push({
            status: 'cancelled',
            timestamp: new Date(),
            message: 'Order cancelled by user.',
        });
        // Restore stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity },
            });
        }
        await order.save();
        await Notification.create({
            user: order.user,
            title: 'Order Cancelled',
            message: `Your order ${order.invoiceNumber} has been cancelled successfully.`,
            type: 'order',
        });
        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully.',
            order,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getInvoice = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authorized.' });
            return;
        }
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found.' });
            return;
        }
        const orderUserId = order.user._id ? order.user._id.toString() : order.user.toString();
        if (orderUserId !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403).json({ success: false, message: 'Not authorized.' });
            return;
        }
        // Simple HTML Invoice output format which can be rendered directly or printed by browser
        res.status(200).json({
            success: true,
            invoice: {
                invoiceNumber: order.invoiceNumber,
                date: order.createdAt,
                billingTo: {
                    name: order.user.name,
                    email: order.user.email,
                    address: order.shippingAddress,
                },
                items: order.items,
                discountAmount: order.discountAmount,
                deliveryFee: order.deliveryFee,
                totalAmount: order.totalAmount,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// Admin Controllers
export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderStatus } = req.body;
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found.' });
            return;
        }
        order.orderStatus = orderStatus;
        // Add tracking stage
        let message = `Order updated to ${orderStatus}.`;
        if (orderStatus === 'processing') {
            message = 'Your order is being processed and packaged.';
        }
        else if (orderStatus === 'shipped') {
            message = 'Your order has been shipped and is on the way.';
        }
        else if (orderStatus === 'delivered') {
            message = 'Your order has been successfully delivered!';
            order.paymentStatus = 'completed'; // COD completed on delivery
        }
        order.trackingHistory.push({
            status: orderStatus,
            timestamp: new Date(),
            message,
        });
        await order.save();
        // Notify user
        await Notification.create({
            user: order.user,
            title: `Order Status: ${orderStatus.toUpperCase()}`,
            message: `Your order ${order.invoiceNumber} status is now ${orderStatus}.`,
            type: 'order',
        });
        res.status(200).json({
            success: true,
            message: 'Order status updated successfully.',
            order,
        });
    }
    catch (error) {
        next(error);
    }
};
