import { Router } from 'express';
import { createReview, getProductReviews } from '../controllers/review.js';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validator.js';
import { reviewSchema } from '../utils/validationSchemas.js';
const router = Router();
// Public route to view reviews
router.get('/product/:productId', getProductReviews);
// Secure route to create review
router.post('/', requireAuth, validateRequest(reviewSchema), createReview);
export default router;
