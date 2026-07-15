import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, } from '../controllers/product.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validator.js';
import { productSchema } from '../utils/validationSchemas.js';
const router = Router();
// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);
// Admin-only routes
router.post('/', requireAuth, requireAdmin, validateRequest(productSchema), createProduct);
router.put('/:id', requireAuth, requireAdmin, validateRequest(productSchema), updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);
export default router;
