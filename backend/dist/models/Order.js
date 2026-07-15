import mongoose, { Schema } from 'mongoose';
const OrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    items: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            image: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 },
        },
    ],
    paymentMethod: { type: String, enum: ['razorpay', 'cod'], required: true },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
    },
    paymentDetails: {
        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String },
        razorpaySignature: { type: String },
        paidAt: { type: Date },
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    couponCode: { type: String },
    discountAmount: { type: Number, default: 0, min: 0 },
    deliveryFee: { type: Number, default: 40, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    trackingHistory: [
        {
            status: {
                type: String,
                enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
                required: true,
            },
            timestamp: { type: Date, default: Date.now },
            message: { type: String },
        },
    ],
    invoiceNumber: { type: String, required: true, unique: true },
}, { timestamps: true });
export const Order = mongoose.model('Order', OrderSchema);
