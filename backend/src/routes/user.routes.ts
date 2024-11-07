import express from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateJWT, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/:id', UserController.getUserById);
router.get('/email/:email', UserController.getUserByEmail);
router.put('/update/:id',authenticateJWT, UserController.updateUser);
router.delete('/:id', authenticateJWT, UserController.deleteUser);
router.get('/all/users', authenticateJWT, isAdmin, UserController.getAllUsers);
router.post('/request-farmer', authenticateJWT, UserController.requestFarmerRole);
router.post('/approve-farmer', authenticateJWT, isAdmin, UserController.approveFarmerRequest);
router.post('/reject-farmer', authenticateJWT, isAdmin, UserController.rejectFarmerRequest);
router.post('/change-role', authenticateJWT, isAdmin, UserController.changeUserRole);
router.get('/s/search-users', authenticateJWT, isAdmin, UserController.searchUsers);
router.get('/u/stats', authenticateJWT, isAdmin, UserController.getUserStats);
router.get('/farmer/all', authenticateJWT, isAdmin, UserController.getFarmers);
router.get('/farmer/requests', authenticateJWT, isAdmin, UserController.getFarmerRequests);
router.get('/auth/isAdmin', authenticateJWT, isAdmin, UserController.isAdmin);
router.get('/auth/isFarmer', authenticateJWT, isAdmin, UserController.isFarmer);
router.get('/auth/isBuyer', authenticateJWT, isAdmin, UserController.isBuyer);

export default router;