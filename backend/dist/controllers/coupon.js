import { Coupon } from '../models/Coupon.js';
export const validateCoupon = async (req, res, next) => {
    try {
        const { code, subtotal } = req.body;
        if (!code || subtotal === undefined) {
            res.status(400).json({ success: false, message: 'Coupon code and subtotal are required.' });
            return;
        }
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
        if (!coupon) {
            res.status(404).json({ success: false, message: 'Invalid coupon code.' });
            return;
        }
        if (new Date(coupon.expiryDate) < new Date()) {
            res.status(400).json({ success: false, message: 'Coupon code has expired.' });
            return;
        }
        if (subtotal < coupon.minPurchase) {
            res.status(400).json({
                success: false,
                message: `Minimum purchase of ₹${coupon.minPurchase} required for this coupon.`,
            });
            return;
        }
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = parseFloat(((subtotal * coupon.discountValue) / 100).toFixed(2));
        }
        else {
            discountAmount = coupon.discountValue;
        }
        if (discountAmount > subtotal) {
            discountAmount = subtotal;
        }
        res.status(200).json({
            success: true,
            message: 'Coupon applied successfully.',
            discountAmount,
            couponCode: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
        });
    }
    catch (error) {
        next(error);
    }
};
// Admin CRUD controllers
export const getCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            coupons,
        });
    }
    catch (error) {
        next(error);
    }
};
export const createCoupon = async (req, res, next) => {
    try {
        const { code, discountType, discountValue, minPurchase, expiryDate, isActive } = req.body;
        const existing = await Coupon.findOne({ code: code.toUpperCase() });
        if (existing) {
            res.status(400).json({ success: false, message: 'Coupon code already exists.' });
            return;
        }
        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            discountType,
            discountValue,
            minPurchase,
            expiryDate: new Date(expiryDate),
            isActive: isActive !== undefined ? isActive : true,
        });
        res.status(201).json({
            success: true,
            message: 'Coupon created successfully.',
            coupon,
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateCoupon = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { code, discountType, discountValue, minPurchase, expiryDate, isActive } = req.body;
        const coupon = await Coupon.findById(id);
        if (!coupon) {
            res.status(404).json({ success: false, message: 'Coupon not found.' });
            return;
        }
        if (code !== undefined)
            coupon.code = code.toUpperCase();
        if (discountType !== undefined)
            coupon.discountType = discountType;
        if (discountValue !== undefined)
            coupon.discountValue = discountValue;
        if (minPurchase !== undefined)
            coupon.minPurchase = minPurchase;
        if (expiryDate !== undefined)
            coupon.expiryDate = new Date(expiryDate);
        if (isActive !== undefined)
            coupon.isActive = isActive;
        await coupon.save();
        res.status(200).json({
            success: true,
            message: 'Coupon updated successfully.',
            coupon,
        });
    }
    catch (error) {
        next(error);
    }
};
export const deleteCoupon = async (req, res, next) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findByIdAndDelete(id);
        if (!coupon) {
            res.status(404).json({ success: false, message: 'Coupon not found.' });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Coupon deleted successfully.',
        });
    }
    catch (error) {
        next(error);
    }
};
