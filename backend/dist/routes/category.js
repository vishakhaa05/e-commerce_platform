import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory, } from '../controllers/category.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validator.js';
import { categorySchema } from '../utils/validationSchemas.js';
const router = Router();
// Public routes
router.get('/', getCategories);
// Admin-only routes
router.post('/', requireAuth, requireAdmin, validateRequest(categorySchema), createCategory);
router.put('/:id', requireAuth, requireAdmin, validateRequest(categorySchema), updateCategory);
router.delete('/:id', requireAuth, requireAdmin, deleteCategory);
export default router;
