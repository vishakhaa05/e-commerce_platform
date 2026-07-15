import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized.' });
      return;
    }

    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    // Check if user already reviewed
    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) {
      res.status(400).json({ success: false, message: 'You have already reviewed this product.' });
      return;
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      username: req.user.name,
      rating,
      comment,
    });

    // Update product rating and reviews count
    const reviews = await Review.find({ product: productId });
    const count = reviews.length;
    const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / count;

    product.reviewsCount = count;
    product.rating = parseFloat(avgRating.toFixed(1));
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully.',
      review,
      avgRating: product.rating,
      reviewsCount: product.reviewsCount,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};
