import { Router } from 'express';
import {
  validateCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/coupon.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validator.js';
import { couponSchema } from '../utils/validationSchemas.js';

const router = Router();

// Secure checkout routes (publicly validate coupon, but requires auth for checkout)
router.post('/validate', requireAuth, validateCoupon);

// Admin-only routes
router.get('/', requireAuth, requireAdmin, getCoupons);
router.post('/', requireAuth, requireAdmin, validateRequest(couponSchema), createCoupon);
router.put('/:id', requireAuth, requireAdmin, validateRequest(couponSchema), updateCoupon);
router.delete('/:id', requireAuth, requireAdmin, deleteCoupon);

export default router;
