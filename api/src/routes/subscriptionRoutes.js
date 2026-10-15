import { Hono } from 'hono';
import { getPrisma } from '../prisma.js';
import { SubscriptionController } from '../controllers/subscriptionController.js';
import { adapt } from '../utils/honoAdapter.js';

const router = new Hono();

router.post('/', async (c) => {
  const prisma = getPrisma(c.env);
  const controller = new SubscriptionController(prisma);
  return adapt(controller.createSubscription)(c);
});

router.get('/me', async (c) => {
  const prisma = getPrisma(c.env);
  const controller = new SubscriptionController(prisma);
  return adapt(controller.getMySubscriptions)(c);
});

router.post('/:id/skip', async (c) => {
  const prisma = getPrisma(c.env);
  const controller = new SubscriptionController(prisma);
  return adapt(controller.skipNext)(c);
});

router.post('/:id/cancel', async (c) => {
  const prisma = getPrisma(c.env);
  const controller = new SubscriptionController(prisma);
  return adapt(controller.cancel)(c);
});

// Senarai admin dipindahkan ke /api/v1/admin/subscriptions (dilindungi adminAuth).

export default router;
