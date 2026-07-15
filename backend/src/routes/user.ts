import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/user.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validator.js';
import { updateProfileSchema, addressSchema } from '../utils/validationSchemas.js';

const router = Router();

// Secure all endpoints with auth middleware
router.use(requireAuth);

router.get('/profile', getProfile);
router.put('/profile', validateRequest(updateProfileSchema), updateProfile);
router.put('/change-password', changePassword);

router.post('/address', validateRequest(addressSchema), addAddress);
router.put('/address/:addressId', validateRequest(addressSchema), updateAddress);
router.delete('/address/:addressId', deleteAddress);

// Admin-only routes
router.get('/', requireAdmin, getAllUsers);
router.patch('/:id/role', requireAdmin, updateUserRole);
router.delete('/:id', requireAdmin, deleteUser);

export default router;

