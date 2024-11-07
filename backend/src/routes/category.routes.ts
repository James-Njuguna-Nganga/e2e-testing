import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller';
import {authenticateJWT,isAdmin} from '../middleware/auth.middleware';

const router = express.Router();

router.post('/create', createCategory);
router.get('/all', getAllCategories);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;