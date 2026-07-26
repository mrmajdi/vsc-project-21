import { Router } from 'express';
import { subscriptionController } from '../controllers/subscription.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/plans', subscriptionController.getPlans);
router.post('/activate', protect, subscriptionController.activateSubscription);
router.get('/current', protect, subscriptionController.getCurrentSubscription);

export default router;