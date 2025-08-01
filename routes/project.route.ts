import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { ProjectService } from '../services/project.services';
import { prisma } from '../app';
import { authenticateToken, requireSuperuser } from '../middlewares/auth.middleware';

const router = Router();

// Initialize dependencies
const projectService = new ProjectService(prisma);
const projectController = new ProjectController(projectService);

// Public routes (no authentication required)
router.get('/stats', (req, res) => projectController.getAllProjectStats(req, res));

// Protected routes (authentication required)
router.get('/', authenticateToken, (req, res) => projectController.getAllProjects(req, res));
router.get('/my/projects', authenticateToken, (req, res) => projectController.getMyProjects(req, res));
router.get('/my/stats', authenticateToken, (req, res) => projectController.getProjectStats(req, res));
router.get('/:id', authenticateToken, (req, res) => projectController.getProjectById(req, res));
router.post('/', authenticateToken, (req, res) => projectController.createProject(req, res));
router.put('/:id', authenticateToken, (req, res) => projectController.updateProject(req, res));
router.delete('/:id', authenticateToken, (req, res) => projectController.deleteProject(req, res));

export default router;

