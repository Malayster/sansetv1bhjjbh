import { Hono } from 'hono';
import { adminAuth } from '../middlewares/adminAuth.js';
import { adapt } from '../utils/honoAdapter.js';
import {
    productController,
    categoryController,
    brandController,
    orderController,
    returnController,
    settingsController,
    uploadController,
    analyticsController
} from '../container.js';

const router = new Hono();

router.use('*', adminAuth);

router.post('/upload', adapt(uploadController.uploadImage));

router.get('/products', adapt(productController.adminGetProducts));
router.post('/products', adapt(productController.adminCreateProduct));
router.put('/products/:id', adapt(productController.adminUpdateProduct));
router.delete('/products/:id', adapt(productController.adminDeleteProduct));

router.get('/categories', adapt(categoryController.adminGetCategories));
router.post('/categories', adapt(categoryController.adminCreateCategory));
router.put('/categories/:id', adapt(categoryController.adminUpdateCategory));
router.delete('/categories/:id', adapt(categoryController.adminDeleteCategory));

router.get('/brands', adapt(brandController.adminGetBrands));
router.post('/brands', adapt(brandController.adminCreateBrand));
router.put('/brands/:id', adapt(brandController.adminUpdateBrand));
router.delete('/brands/:id', adapt(brandController.adminDeleteBrand));

router.get('/orders', adapt(orderController.adminGetOrders));
router.get('/orders/:id', adapt(orderController.adminGetOrder));
router.put('/orders/:id', adapt(orderController.adminUpdateOrder));

router.get('/returns', adapt(returnController.adminGetAllReturns));
router.put('/returns/:id', adapt(returnController.adminUpdateReturnRequest));

router.get('/settings', adapt(settingsController.getSettings));
router.put('/settings', adapt(settingsController.updateSettings));

router.get('/analytics', adapt(analyticsController.getDashboard));

export default router;
