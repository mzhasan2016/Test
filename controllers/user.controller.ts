import { Request, Response } from 'express';
import { UserService, LoginCredentials, RegisterData } from '../services/user.services';
import { UpdateUserData } from '../models/user.model';

export class UserController {
  constructor(private userService: UserService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, first_name, middle_name, last_name } = req.body;

      const registerData: RegisterData = {
        username,
        email,
        password,
        first_name,
        middle_name,
        last_name
      };

      const result = await this.userService.register(registerData);

      res.status(201).json({
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('already registered') || error.message.includes('already taken')) {
          res.status(409).json({
            error: 'Registration failed',
            message: error.message
          });
        } else if (error.message.includes('required') || error.message.includes('Invalid')) {
          res.status(400).json({
            error: 'Validation error',
            message: error.message
          });
        } else {
          res.status(500).json({
            error: 'Registration failed',
            message: error.message
          });
        }
      } else {
        res.status(500).json({
          error: 'Registration failed',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const credentials: LoginCredentials = {
        email,
        password
      };

      const result = await this.userService.login(credentials);

      res.status(200).json({
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Invalid email or password')) {
          res.status(401).json({
            error: 'Authentication failed',
            message: error.message
          });
        } else if (error.message.includes('required')) {
          res.status(400).json({
            error: 'Validation error',
            message: error.message
          });
        } else {
          res.status(500).json({
            error: 'Authentication failed',
            message: error.message
          });
        }
      } else {
        res.status(500).json({
          error: 'Authentication failed',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          error: 'Refresh token required',
          message: 'Please provide a refresh token'
        });
        return;
      }

      const result = await this.userService.refreshToken(refreshToken);

      res.status(200).json({
        message: 'Token refreshed successfully',
        data: result
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Invalid refresh token')) {
          res.status(401).json({
            error: 'Token refresh failed',
            message: error.message
          });
        } else {
          res.status(500).json({
            error: 'Token refresh failed',
            message: error.message
          });
        }
      } else {
        res.status(500).json({
          error: 'Token refresh failed',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'Please log in to access this resource'
        });
        return;
      }

      const user = await this.userService.getCurrentUser(req.user.id);

      res.status(200).json({
        message: 'Current user retrieved successfully',
        data: user
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          error: 'Failed to get current user',
          message: error.message
        });
      } else {
        res.status(500).json({
          error: 'Failed to get current user',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'Please log in to access this resource'
        });
        return;
      }

      const { username, email, first_name, last_name } = req.body;

      const updateData: UpdateUserData = {
        username,
        email,
        first_name,
        last_name
      };

      const user = await this.userService.updateProfile(req.user.id, updateData);

      res.status(200).json({
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('already registered') || error.message.includes('already taken')) {
          res.status(409).json({
            error: 'Update failed',
            message: error.message
          });
        } else {
          res.status(500).json({
            error: 'Failed to update profile',
            message: error.message
          });
        }
      } else {
        res.status(500).json({
          error: 'Failed to update profile',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'Please log in to access this resource'
        });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res.status(400).json({
          error: 'Validation error',
          message: 'Current password and new password are required'
        });
        return;
      }

      await this.userService.changePassword(req.user.id, currentPassword, newPassword);

      res.status(200).json({
        message: 'Password changed successfully'
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Current password is incorrect')) {
          res.status(400).json({
            error: 'Password change failed',
            message: error.message
          });
        } else if (error.message.includes('at least 6 characters')) {
          res.status(400).json({
            error: 'Validation error',
            message: error.message
          });
        } else {
          res.status(500).json({
            error: 'Failed to change password',
            message: error.message
          });
        }
      } else {
        res.status(500).json({
          error: 'Failed to change password',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const result = await this.userService.getAllUsers({ skip, limit, search });

      res.status(200).json({
        message: 'Users retrieved successfully',
        data: result.users,
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
          error: 'Failed to get users',
          message: error.message
        });
      } else {
        res.status(500).json({
          error: 'Failed to get users',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = parseInt(id);

      if (isNaN(userId)) {
        res.status(400).json({
          error: 'Invalid user ID',
          message: 'User ID must be a valid number'
        });
        return;
      }

      const user = await this.userService.getUserById(userId);

      res.status(200).json({
        message: 'User retrieved successfully',
        data: user
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({
            error: 'User not found',
            message: error.message
          });
        } else {
          res.status(500).json({
            error: 'Failed to get user',
            message: error.message
          });
        }
      } else {
        res.status(500).json({
          error: 'Failed to get user',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = parseInt(id);

      if (isNaN(userId)) {
        res.status(400).json({
          error: 'Invalid user ID',
          message: 'User ID must be a valid number'
        });
        return;
      }

      const { username, email, first_name, middle_name, last_name, is_superuser, is_active } = req.body;

      const updateData: UpdateUserData = {
        username,
        email,
        first_name,
        middle_name,
        last_name,
        is_superuser,
        is_active
      };

      const user = await this.userService.updateUser(userId, updateData);

      res.status(200).json({
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({
            error: 'User not found',
            message: error.message
          });
        } else if (error.message.includes('already registered') || error.message.includes('already taken')) {
          res.status(409).json({
            error: 'Update failed',
            message: error.message
          });
        } else {
          res.status(500).json({
            error: 'Failed to update user',
            message: error.message
          });
        }
      } else {
        res.status(500).json({
          error: 'Failed to update user',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = parseInt(id);

      if (isNaN(userId)) {
        res.status(400).json({
          error: 'Invalid user ID',
          message: 'User ID must be a valid number'
        });
        return;
      }

      await this.userService.deleteUser(userId);

      res.status(200).json({
        message: 'User deleted successfully'
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          res.status(404).json({
            error: 'User not found',
            message: error.message
          });
        } else {
          res.status(500).json({
            error: 'Failed to delete user',
            message: error.message
          });
        }
      } else {
        res.status(500).json({
          error: 'Failed to delete user',
          message: 'An unexpected error occurred'
        });
      }
    }
  }

  async createSuperuser(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, first_name, last_name } = req.body;

      const user = await this.userService.createSuperuser({
        username,
        email,
        password,
        first_name,
        last_name,
        is_superuser: true
      });

      res.status(201).json({
        message: 'Superuser created successfully',
        data: user
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('already registered') || error.message.includes('already taken')) {
          res.status(409).json({
            error: 'Creation failed',
            message: error.message
          });
        } else if (error.message.includes('required') || error.message.includes('Invalid')) {
          res.status(400).json({
            error: 'Validation error',
            message: error.message
          });
        } else {
          res.status(500).json({
            error: 'Failed to create superuser',
            message: error.message
          });
        }
      } else {
        res.status(500).json({
          error: 'Failed to create superuser',
          message: 'An unexpected error occurred'
        });
      }
    }
  }
} 