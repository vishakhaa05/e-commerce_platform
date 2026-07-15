import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getInvoice,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/order.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validator.js';
import { checkoutSchema } from '../utils/validationSchemas.js';

const router = Router();

// Secure user routes
router.post('/', requireAuth, validateRequest(checkoutSchema), createOrder);
router.get('/my-orders', requireAuth, getMyOrders);
router.get('/invoice/:id', requireAuth, getInvoice);
router.put('/cancel/:id', requireAuth, cancelOrder);
router.get('/:id', requireAuth, getOrderById);

// Admin-only routes
router.get('/', requireAuth, requireAdmin, getAllOrders);
router.patch('/:id/status', requireAuth, requireAdmin, updateOrderStatus);

export default router;
