import { Router } from 'express';
import { createRazorpayOrder, verifyPaymentSignature } from '../controllers/payment.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/razorpay-order', createRazorpayOrder);
router.post('/verify-signature', verifyPaymentSignature);

export default router;
