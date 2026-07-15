import mongoose, { Schema } from 'mongoose';
const CouponSchema = new Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minPurchase: { type: Number, default: 0, min: 0 },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
export const Coupon = mongoose.model('Coupon', CouponSchema);
