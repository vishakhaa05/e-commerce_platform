import mongoose, { Schema } from 'mongoose';
const ReviewSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
}, { timestamps: true });
// Compound index to ensure a user can review a product only once
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
export const Review = mongoose.model('Review', ReviewSchema);
