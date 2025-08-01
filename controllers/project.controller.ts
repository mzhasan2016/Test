import { Request, Response } from 'express';
import { ProjectService } from '../services/project.services';
import { CreateProjectData, UpdateProjectData } from '../models/project.model';

export class ProjectController {
  constructor(private projectService: ProjectService) {}

  async getAllProjects(req: Request, res: Response): Promise<void> {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const status = req.query.status as string;
      const owner_id = req.query.owner_id ? parseInt(req.query.owner_id as string) : undefined;

      const result = await this.projectService.getAllProjects({
        skip,
        limit,
        search,
        status: status as any,
        owner_id
      });

      res.status(200).json({
        message: 'Projects retrieved successfully',
        data: result.projects,
        pagination: {
          skip,
          limit,
          total: result.total,
          hasMore: skip + limit < result.total
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          error: 'Failed to get projects',
          message: error.message
        });
      } else {
        res.status(500).json({
          error: 'Failed to get projects',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  async getProjectById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const projectId = parseInt(id);

      if (isNaN(projectId)) {
        res.status(400).json({
          error: 'Invalid project ID',
          message: 'Project ID must be a valid number'
        });
        return;
      }

      const project = await this.projectService.findProjectById(projectId);

      if (!project) {
        res.status(404).json({
          error: 'Project not found',
          message: 'The requested project does not exist'
        });
        return;
      }

      res.status(200).json({
        message: 'Project retrieved successfully',
        data: project
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          error: 'Failed to get project',
          message: error.message
        });
      } else {
        res.status(500).json({
          error: 'Failed to get project',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  async createProject(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, status, budget, start_date, end_date, owner_id } = req.body;

      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'Please log in to create a project'
        });
        return;
      }

      const createData: CreateProjectData = {
        name,
        description,
        status,
        budget: budget ? parseFloat(budget) : undefined,
        start_date: start_date ? new Date(start_date) : undefined,
        end_date: end_date ? new Date(end_date) : undefined,
        owner_id: owner_id || req.user.id
      };

      const project = await this.projectService.createProject(createData);

      res.status(201).json({
        message: 'Project created successfully',
        data: project
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('required')) {
          res.status(400).json({
            error: 'Validation error',
            message: error.message
          });
        } else if (error.message.includes('not found')) {
          res.status(404).json({
            error: 'Resource not found',
            message: error.message
          });
        } else {
          res.status(500).json({
            error: 'Failed to create project',
            message: error.message
          });
        }
      } else {
        res.status(500).json({
          error: 'Failed to create project',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  async updateProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const projectId = parseInt(id);

      if (isNaN(projectId)) {
        res.status(400).json({
          error: 'Invalid project ID',
          message: 'Project ID must be a valid number'
        });
        return;
      }

      const { name, description, status, budget, start_date, end_date, owner_id } = req.body;

      const updateData: UpdateProjectData = {
        name,
        description,
        status,
        budget: budget ? parseFloat(budget) : undefined,
        start_date: start_date ? new Date(start_date) : undefined,
        end_date: end_date ? new Date(end_date) : undefined,
        owner_id: owner_id ? parseInt(owner_id) : undefined
      };

      const project = await this.projectService.updateProject(projectId, updateData);

      res.status(200).json({
        message: 'Project updated successfully',
        data: project
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({
            error: 'Project not found',
            message: error.message
          });
        } else if (error.message.includes('required') || error.message.includes('cannot be after')) {
          res.status(400).json({
            error: 'Validation error',
            message: error.message
          });
        } else {
          res.status(500).json({
            error: 'Failed to update project',
            message: error.message
          });
        }
      } else {
        res.status(500).json({
          error: 'Failed to update project',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const projectId = parseInt(id);

      if (isNaN(projectId)) {
        res.status(400).json({
          error: 'Invalid project ID',
          message: 'Project ID must be a valid number'
        });
        return;
      }

      await this.projectService.deleteProject(projectId);

      res.status(200).json({
        message: 'Project deleted successfully'
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({
            error: 'Project not found',
            message: error.message
          });
        } else {
          res.status(500).json({
            error: 'Failed to delete project',
            message: error.message
          });
        }
      } else {
        res.status(500).json({
          error: 'Failed to delete project',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  async getMyProjects(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'Please log in to access your projects'
        });
        return;
      }

      const skip = parseInt(req.query.skip as string) || 0;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const status = req.query.status as string;

      const result = await this.projectService.getProjectsByOwner(req.user.id, {
        skip,
        limit,
        search,
        status: status as any
      });

      res.status(200).json({
        message: 'Your projects retrieved successfully',
        data: result.projects,
        pagination: {
          skip,
          limit,
          total: result.total,
          hasMore: skip + limit < result.total
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          error: 'Failed to get your projects',
          message: error.message
        });
      } else {
        res.status(500).json({
          error: 'Failed to get your projects',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  async getProjectStats(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'Please log in to access project statistics'
        });
        return;
      }

      const stats = await this.projectService.getProjectStatsByOwner(req.user.id);

      res.status(200).json({
        message: 'Project statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          error: 'Failed to get project statistics',
          message: error.message
        });
      } else {
        res.status(500).json({
          error: 'Failed to get project statistics',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  async getAllProjectStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.projectService.getProjectStats();

      res.status(200).json({
        message: 'All project statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          error: 'Failed to get project statistics',
          message: error.message
        });
      } else {
        res.status(500).json({
          error: 'Failed to get project statistics',
          message: 'An unexpected error occurred'
        });
      }
    }
  }
}