import { Router } from 'express';
import { submitContactForm } from '../controllers/contact.js';

const router = Router();

router.post('/', submitContactForm);

export default router;
