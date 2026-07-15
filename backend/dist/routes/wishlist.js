import { Router } from 'express';
import { getWishlist, toggleWishlist } from '../controllers/wishlist.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
router.use(requireAuth);
router.get('/', getWishlist);
router.post('/toggle', toggleWishlist);
export default router;
