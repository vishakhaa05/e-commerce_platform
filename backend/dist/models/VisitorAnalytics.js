import mongoose, { Schema } from 'mongoose';
const PageViewSchema = new Schema({
    path: { type: String, required: true },
    viewsCount: { type: Number, default: 1 },
    lastViewedAt: { type: Date, default: Date.now }
});
const VisitorAnalyticsSchema = new Schema({
    visitorId: { type: String, required: true, unique: true },
    ipHash: { type: String, required: true },
    browser: { type: String, default: 'Unknown' },
    os: { type: String, default: 'Unknown' },
    device: { type: String, default: 'desktop' },
    country: { type: String, default: 'Unknown' },
    city: { type: String, default: 'Unknown' },
    sessionDuration: { type: Number, default: 0 }, // seconds
    pageViews: [PageViewSchema],
    isReturning: { type: Boolean, default: false }
}, { timestamps: true });
export const VisitorAnalytics = mongoose.model('VisitorAnalytics', VisitorAnalyticsSchema);
