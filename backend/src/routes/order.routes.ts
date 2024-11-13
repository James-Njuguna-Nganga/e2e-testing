// order.routes.ts
import express from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware';

const router = express.Router();

// Protected routes
router.use(authenticateJWT);

// Buyer routes
router.post('/', OrderController.createOrder);
router.get('/my-orders', OrderController.getUserOrders);

// Farmer routes
router.get('/farmer-orders', authorizeRole(['FARMER', 'ADMIN']), OrderController.getFarmerOrders);

// Admin routes
router.get('/all', authorizeRole(['ADMIN']), OrderController.getAllOrders);
router.patch('/:id/status', authorizeRole(['ADMIN']), OrderController.updateOrderStatus);

export default router;