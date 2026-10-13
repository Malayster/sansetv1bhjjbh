import { Hono } from 'hono';
import { adminAuth } from '../middlewares/adminAuth.js';
import { requirePermission, getUserRole } from '../middlewares/rolePermission.js';
import { adapt } from '../utils/honoAdapter.js';
import {
    productController,
    categoryController,
    brandController,
    orderController,
    returnController,
    settingsController,
    uploadController,
    analyticsController,
    notificationController
} from '../container.js';

const router = new Hono();

router.use('*', adminAuth);

router.get('/me', (c) => {
  const user = c.get('adminUser');
  const role = getUserRole(user?.email, c.env);
  return c.json({ status: 'success', data: { email: user?.email, role } });
});

router.post('/upload', requirePermission('upload'), adapt(uploadController.uploadImage));

router.get('/products', requirePermission('products'), adapt(productController.adminGetProducts));
router.post('/products', requirePermission('products'), adapt(productController.adminCreateProduct));
router.put('/products/:id', requirePermission('products'), adapt(productController.adminUpdateProduct));
router.delete('/products/:id', requirePermission('products'), adapt(productController.adminDeleteProduct));

router.get('/categories', requirePermission('categories'), adapt(categoryController.adminGetCategories));
router.post('/categories', requirePermission('categories'), adapt(categoryController.adminCreateCategory));
router.put('/categories/:id', requirePermission('categories'), adapt(categoryController.adminUpdateCategory));
router.delete('/categories/:id', requirePermission('categories'), adapt(categoryController.adminDeleteCategory));

router.get('/brands', requirePermission('brands'), adapt(brandController.adminGetBrands));
router.post('/brands', requirePermission('brands'), adapt(brandController.adminCreateBrand));
router.put('/brands/:id', requirePermission('brands'), adapt(brandController.adminUpdateBrand));
router.delete('/brands/:id', requirePermission('brands'), adapt(brandController.adminDeleteBrand));

router.get('/orders', requirePermission('orders'), adapt(orderController.adminGetOrders));
router.get('/orders/:id', requirePermission('orders'), adapt(orderController.adminGetOrder));
router.put('/orders/:id', requirePermission('orders'), adapt(orderController.adminUpdateOrder));

router.get('/returns', requirePermission('returns'), adapt(returnController.adminGetAllReturns));
router.put('/returns/:id', requirePermission('returns'), adapt(returnController.adminUpdateReturnRequest));

router.get('/settings', requirePermission('settings'), adapt(settingsController.getSettings));
router.put('/settings', requirePermission('settings'), adapt(settingsController.updateSettings));

router.get('/analytics', requirePermission('analytics'), adapt(analyticsController.getDashboard));

// Notifications
router.get('/notifications', adapt(notificationController.list));
router.post('/notifications/:id/read', adapt(notificationController.markRead));
router.post('/notifications/read-all', adapt(notificationController.markAllRead));

export default router;
