import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { initConfig } from './config.js';
import { getPrisma } from './prisma.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { rateLimit } from './middlewares/rateLimit.js';

import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import returnRoutes from './routes/returnRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import feedRoutes from './routes/feedRoutes.js';
import seoRoutes from './routes/seoRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import metricsRoutes from './routes/metricsRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import pointsRoutes from './routes/pointsRoutes.js';
import easyParcelCallback from './routes/easyParcelCallback.js';
import enterpriseRoutes from './routes/enterpriseRoutes.js';
import { feedController } from './container.js';
import { adapt } from './utils/honoAdapter.js';
import { processDueSubscriptions } from './services/subscriptionBillingService.js';
import { readCms } from './services/cmsService.js';

const app = new Hono();

app.use('*', cors({
    origin: (origin, c) => {
        const allowed = (c.env.CORS_ORIGIN || '').split(',').map((o) => o.trim()).filter(Boolean);
        return allowed.includes(origin) ? origin : null;
    },
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
}));

app.use('*', secureHeaders({ crossOriginResourcePolicy: 'cross-origin' }));

app.use('/api/*', rateLimit('API_RATE_LIMITER', 'api'));
for (const path of ['/api/v1/orders/*', '/api/v1/payment/*', '/api/v1/returns/*', '/api/v1/subscriptions/*', '/api/v1/points/*']) {
    app.use(path, rateLimit('SENSITIVE_RATE_LIMITER', 'sensitive'));
}

app.use('*', async (c, next) => {
    initConfig(c.env);
    getPrisma(c.env);
    await next();
});

app.get('/api/v1/health', (c) => {
    return c.json({ status: 'UP', timestamp: new Date() });
});

app.route('/api/v1/products', productRoutes);
app.route('/api/v1/categories', categoryRoutes);
app.route('/api/v1/brands', brandRoutes);
app.route('/api/v1/orders', orderRoutes);
app.route('/api/v1/returns', returnRoutes);
app.route('/api/v1/payment', paymentRoutes);
app.route('/api/v1/settings', settingsRoutes);
app.route('/api/v1/feeds', feedRoutes);
app.route('/api/v1/subscriptions', subscriptionRoutes);
app.route('/api/v1/points', pointsRoutes);
app.get('/api/v1/cms', async (c) => {
    const data = await readCms(c.env.DB, { includePrivate: false }).catch(() => ({}));
    return c.json({ status: 'success', data });
});

app.route('/', seoRoutes);
app.route('/api/v1', seoRoutes);

app.route('/api/v1/admin', adminRoutes);
app.route('/api/v1/metrics', metricsRoutes);
app.route('/api/v1/easyparcel', easyParcelCallback);
app.route('/api/v1/enterprise', enterpriseRoutes);

app.get('/api/v1/catalog/google-feed', adapt(feedController.getGoogleShoppingFeed));

app.onError(errorHandler);

export default {
    fetch: app.fetch,
    async scheduled(event, env, ctx) {
        console.log('[Cron Trigger] Active: executing scheduled task for cron: %s', event.cron);

        try {
            const billing = await processDueSubscriptions(env);
            console.log('[Cron] Subscription billing:', billing);
        } catch (error) {
            console.error('[Cron] Subscription billing failed:', error);
        }

        try {
            const clientUrl = env.CLIENT_URL || 'https://dinoempire.my';
            const sitemapUrl = `${clientUrl}/sitemap.xml`;
            const apiFetchUrl = `${env.API_URL || 'https://api.dinoempire.my'}/sitemap.xml`;
            const response = await fetch(apiFetchUrl);
            if (response.ok) {
                console.log('[Cron Trigger] Sitemap cache warmed successfully: %s', sitemapUrl);
            } else {
                console.warn('[Cron Trigger] Sitemap warm up returned status: %s', response.status);
            }
        } catch (error) {
            console.error('[Cron Trigger] Failed to run sitemap cron updates:', error);
        }
    }
};
