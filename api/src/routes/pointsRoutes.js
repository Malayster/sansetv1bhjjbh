import { Hono } from 'hono';
import { getPrisma } from '../prisma.js';
import { PointsController } from '../controllers/pointsController.js';
import { adapt } from '../utils/honoAdapter.js';

const router = new Hono();

router.get('/balance', async (c) => {
  const prisma = getPrisma(c.env);
  const controller = new PointsController(prisma);
  return adapt(controller.getBalance)(c);
});

router.post('/earn', async (c) => {
  const prisma = getPrisma(c.env);
  const controller = new PointsController(prisma);
  return adapt(controller.earn)(c);
});

router.post('/redeem', async (c) => {
  const prisma = getPrisma(c.env);
  const controller = new PointsController(prisma);
  return adapt(controller.redeem)(c);
});

export default router;
