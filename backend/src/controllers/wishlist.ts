import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Wishlist } from '../models/Wishlist.js';

export const getWishlist = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized.' });
      return;
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.status(200).json({
      success: true,
      wishlist: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleWishlist = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized.' });
      return;
    }

    const { productId } = req.body;

    if (!productId) {
      res.status(400).json({ success: false, message: 'Product ID is required.' });
      return;
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    const index = wishlist.products.indexOf(productId);

    let isAdded = false;

    if (index === -1) {
      wishlist.products.push(productId);
      isAdded = true;
    } else {
      wishlist.products.splice(index, 1);
    }

    await wishlist.save();
    
    // Repopulate for client return
    const populated = await Wishlist.findById(wishlist._id).populate('products');

    res.status(200).json({
      success: true,
      message: isAdded ? 'Product added to wishlist.' : 'Product removed from wishlist.',
      wishlist: populated?.products || [],
      isAdded,
    });
  } catch (error) {
    next(error);
  }
};
