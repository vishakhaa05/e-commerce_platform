import { Router } from 'express';
import { trackVisitor, getDashboardStats, getVisitorStats } from '../controllers/analytics.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
const router = Router();
// Public route to log visitor page view details
router.post('/track', trackVisitor);
// Admin-only metrics routes
router.get('/dashboard', requireAuth, requireAdmin, getDashboardStats);
router.get('/visitors', requireAuth, requireAdmin, getVisitorStats);
export default router;
