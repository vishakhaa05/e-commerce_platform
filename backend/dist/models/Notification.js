import mongoose, { Schema } from 'mongoose';
const NotificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: { type: String, enum: ['order', 'coupon', 'info', 'alert'], default: 'info' }
}, { timestamps: true });
export const Notification = mongoose.model('Notification', NotificationSchema);
