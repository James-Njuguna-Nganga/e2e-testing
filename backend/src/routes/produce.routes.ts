// produce.routes.ts
import express from 'express';
import { ProduceController } from '../controllers/produce.controller';
import { authenticateJWT, authorizeRole, isAdmin } from '../middleware/auth.middleware';
import { upload } from '../utils/cloudinary.utils';

const router = express.Router();

// Public routes
router.get('/', ProduceController.getAllProduce);
router.get('/search', ProduceController.searchProduce);
router.get('/category/:categoryId', ProduceController.getProduceByCategory);
router.get('/:id', ProduceController.getProduceById);
router.get('/farmer/products', ProduceController.getFarmerProduce);

// Protected routes
router.use(authenticateJWT, authorizeRole(['FARMER']));
router.post('/', upload.single('image'), ProduceController.createProduce);
router.put('/:id', upload.single('image'), ProduceController.updateProduce);
router.delete('/:id', ProduceController.deleteProduce);
router.patch('/:id/status', ProduceController.updateProduceStatus);

export default router;