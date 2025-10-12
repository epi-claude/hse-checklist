import { Router } from 'express';
import { FormController } from '../controllers/formController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// All form routes require authentication
router.use(authenticate);

router.post('/', FormController.create);
router.get('/', FormController.list);
router.get('/:id', FormController.getById);
router.patch('/:id', FormController.update);
router.post('/:id/submit', FormController.submit);
router.post('/:id/reopen', FormController.reopen);
router.get('/:id/readonly', FormController.getReadOnly);
router.get('/:id/generate-pdf', FormController.generatePDF);

export default router;
