import mongoose, { Schema, Document } from 'mongoose';

export interface IPageView {
  path: string;
  viewsCount: number;
  lastViewedAt: Date;
}

export interface IVisitorAnalytics extends Document {
  visitorId: string; // unique ID stored in localstorage or cookie
  ipHash: string; // anonymized IP
  browser: string;
  os: string;
  device: string; // mobile, tablet, desktop
  country: string;
  city: string;
  sessionDuration: number; // in seconds
  pageViews: IPageView[];
  isReturning: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PageViewSchema = new Schema<IPageView>({
  path: { type: String, required: true },
  viewsCount: { type: Number, default: 1 },
  lastViewedAt: { type: Date, default: Date.now }
});

const VisitorAnalyticsSchema = new Schema<IVisitorAnalytics>(
  {
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
  },
  { timestamps: true }
);

export const VisitorAnalytics = mongoose.model<IVisitorAnalytics>('VisitorAnalytics', VisitorAnalyticsSchema);
