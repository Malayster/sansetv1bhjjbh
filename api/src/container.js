/**
 * Dependency Injection Container.
 */

import prisma from './prisma.js';
import { config } from './config.js';

import { ProductRepository } from './repositories/productRepository.js';
import { CategoryRepository } from './repositories/categoryRepository.js';
import { OrderRepository } from './repositories/orderRepository.js';
import { BrandRepository } from './repositories/brandRepository.js';
import { SettingsRepository } from './repositories/settingsRepository.js';
import { ReturnRepository } from './repositories/returnRepository.js';

import { ProductService } from './services/productService.js';
import { CategoryService } from './services/categoryService.js';
import { OrderService } from './services/orderService.js';
import { ParamService } from './services/paramService.js';
import { IyzicoService } from './services/iyzicoService.js';
import { PaytrService } from './services/paytrService.js';
import { ToyyibPayService } from './services/toyyibpayService.js';
import { PaymentService } from './services/paymentService.js';
import { EmailService } from './services/emailService.js';
import { BrandService } from './services/brandService.js';
import { SettingsService } from './services/settingsService.js';
import { ReturnService } from './services/returnService.js';

import { ProductController } from './controllers/productController.js';
import { CategoryController } from './controllers/categoryController.js';
import { OrderController } from './controllers/orderController.js';
import { PaymentController } from './controllers/paymentController.js';
import { BrandController } from './controllers/brandController.js';
import { SettingsController } from './controllers/settingsController.js';
import { ReturnController } from './controllers/returnController.js';
import { SeoController } from './controllers/seoController.js';
import { FeedController } from './controllers/feedController.js';
import { UploadController } from './controllers/uploadController.js';
import { AnalyticsController } from './controllers/analyticsController.js';
import { NotificationController } from './controllers/notificationController.js';

const productRepository = new ProductRepository(prisma);
const categoryRepository = new CategoryRepository(prisma);
const orderRepository = new OrderRepository(prisma);
const brandRepository = new BrandRepository(prisma);
const settingsRepository = new SettingsRepository(prisma);
const returnRepository = new ReturnRepository(prisma);

const paramService = new ParamService(config.param);
const iyzicoService = new IyzicoService(config.iyzico);
const paytrService = new PaytrService(config.paytr);
const toyyibpayService = new ToyyibPayService(config);
const paymentService = new PaymentService(paramService, iyzicoService, paytrService, toyyibpayService, config);
const emailService = new EmailService(config.email);

const productService = new ProductService(productRepository, categoryRepository);
const categoryService = new CategoryService(categoryRepository);
const settingsService = new SettingsService(settingsRepository);
const returnService = new ReturnService(returnRepository, orderRepository);
const orderService = new OrderService(orderRepository, productService, paymentService, emailService);
const brandService = new BrandService(brandRepository);

const productController = new ProductController(productService);
const categoryController = new CategoryController(categoryService);
const orderController = new OrderController(orderService);
const paymentController = new PaymentController(orderService);
const brandController = new BrandController(brandService);
const settingsController = new SettingsController(settingsService);
const returnController = new ReturnController(returnService);
const seoController = new SeoController(productRepository);
const feedController = new FeedController(productRepository, settingsRepository);
const uploadController = new UploadController();
const analyticsController = new AnalyticsController(prisma);
const notificationController = new NotificationController(prisma);

export {
    productController,
    categoryController,
    orderController,
    paymentController,
    brandController,
    settingsController,
    returnController,
    seoController,
    feedController,
    uploadController,
    analyticsController,
    notificationController
};
