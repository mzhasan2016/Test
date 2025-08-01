import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.services';
import { prisma } from '../app';
import { authenticateToken, requireSuperuser } from '../middlewares/auth.middleware';

const router = Router();

// Initialize dependencies
const userService = new UserService(prisma);
const userController = new UserController(userService);

// Public routes (no authentication required)
router.post('/register', (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));
router.post('/refresh-token', (req, res) => userController.refreshToken(req, res));

// Protected routes (authentication required)
router.get('/me', authenticateToken, (req, res) => userController.getCurrentUser(req, res));
router.put('/profile', authenticateToken, (req, res) => userController.updateProfile(req, res));
router.put('/change-password', authenticateToken, (req, res) => userController.changePassword(req, res));

// Admin routes (superuser required)
router.get('/', authenticateToken, requireSuperuser, (req, res) => userController.getAllUsers(req, res));
router.get('/:id', authenticateToken, requireSuperuser, (req, res) => userController.getUserById(req, res));
router.put('/:id', authenticateToken, requireSuperuser, (req, res) => userController.updateUser(req, res));
router.delete('/:id', authenticateToken, requireSuperuser, (req, res) => userController.deleteUser(req, res));
router.post('/superuser', authenticateToken, requireSuperuser, (req, res) => userController.createSuperuser(req, res));

export default router; 