import mongoose from 'mongoose';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { Order } from '../models/Order.js';
import { Notification } from '../models/Notification.js';
const isRazorpayConfigured = () => {
    return !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
};
export const createRazorpayOrder = async (req, res, next) => {
    try {
        const { orderId } = req.body;
        if (!orderId || !mongoose.isValidObjectId(orderId)) {
            res.status(400).json({ success: false, message: `Invalid or missing orderId: "${orderId}"` });
            return;
        }
        const order = await Order.findById(orderId);
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found.' });
            return;
        }
        if (isRazorpayConfigured()) {
            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID || '',
                key_secret: process.env.RAZORPAY_KEY_SECRET || '',
            });
            const options = {
                amount: Math.round(order.totalAmount * 100), // in paise
                currency: 'INR',
                receipt: order.invoiceNumber,
            };
            const rpOrder = await razorpay.orders.create(options);
            order.paymentDetails = {
                ...order.paymentDetails,
                razorpayOrderId: rpOrder.id,
            };
            await order.save();
            res.status(200).json({
                success: true,
                isMock: false,
                key: process.env.RAZORPAY_KEY_ID,
                amount: rpOrder.amount,
                currency: rpOrder.currency,
                razorpayOrderId: rpOrder.id,
                order,
            });
        }
        else {
            // Mock flow
            const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 11)}`;
            order.paymentDetails = {
                ...order.paymentDetails,
                razorpayOrderId: mockOrderId,
            };
            await order.save();
            res.status(200).json({
                success: true,
                isMock: true,
                key: 'mock_key_id',
                amount: Math.round(order.totalAmount * 100),
                currency: 'INR',
                razorpayOrderId: mockOrderId,
                order,
            });
        }
    }
    catch (error) {
        next(error);
    }
};
export const verifyPaymentSignature = async (req, res, next) => {
    try {
        const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
        if (!orderId || !mongoose.isValidObjectId(orderId)) {
            res.status(400).json({ success: false, message: `Invalid or missing orderId: "${orderId}"` });
            return;
        }
        const order = await Order.findById(orderId);
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found.' });
            return;
        }
        if (isRazorpayConfigured()) {
            const sign = razorpayOrderId + '|' + razorpayPaymentId;
            const expectedSign = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
                .update(sign.toString())
                .digest('hex');
            if (expectedSign !== razorpaySignature) {
                order.paymentStatus = 'failed';
                await order.save();
                res.status(400).json({ success: false, message: 'Invalid payment signature.' });
                return;
            }
        }
        // Update order status on success
        order.paymentStatus = 'completed';
        order.orderStatus = 'processing';
        order.paymentDetails = {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            paidAt: new Date(),
        };
        order.trackingHistory.push({
            status: 'processing',
            timestamp: new Date(),
            message: 'Payment verified successfully. Preparing your items.',
        });
        await order.save();
        await Notification.create({
            user: order.user,
            title: 'Payment Successful',
            message: `Your payment of ₹${order.totalAmount} for order ${order.invoiceNumber} has been verified.`,
            type: 'order',
        });
        res.status(200).json({
            success: true,
            message: 'Payment verified and order is now being processed.',
            order,
        });
    }
    catch (error) {
        next(error);
    }
};
