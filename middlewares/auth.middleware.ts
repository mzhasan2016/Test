import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        email: string;
        first_name: string;
        middle_name?: string;
        last_name: string;
        is_superuser: boolean;
        is_active: boolean;
      };
    }
  }
}

export interface JWTPayload {
  userId: number;
  username: string;
  email: string;
  is_superuser: boolean;
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ 
        error: 'Access token required',
        message: 'Please provide a valid authentication token'
      });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET not configured');
      res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Authentication service not properly configured'
      });
      return;
    }

    const decoded = jwt.verify(token, secret) as JWTPayload;
    
    // Fetch user from database to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        middle_name: true,
        last_name: true,
        is_superuser: true,
        is_active: true
      }
    });

    if (!user) {
      res.status(401).json({ 
        error: 'Invalid token',
        message: 'User not found'
      });
      return;
    }

    if (!user.is_active) {
      res.status(401).json({ 
        error: 'Account deactivated',
        message: 'Your account has been deactivated'
      });
      return;
    }

    // Attach user to request object
    req.user = {
      ...user,
      middle_name: user.middle_name || undefined
    };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        error: 'Invalid token',
        message: 'The provided token is invalid or expired'
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        error: 'Token expired',
        message: 'Your authentication token has expired. Please log in again'
      });
    } else {
      console.error('Authentication error:', error);
      res.status(500).json({ 
        error: 'Authentication error',
        message: 'An error occurred during authentication'
      });
    }
  }
};

export const requireSuperuser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ 
      error: 'Authentication required',
      message: 'Please log in to access this resource'
    });
    return;
  }

  if (!req.user.is_superuser) {
    res.status(403).json({ 
      error: 'Permission denied',
      message: 'Superuser privileges required to access this resource'
    });
    return;
  }

  next();
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      // No token provided, continue without authentication
      next();
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      next();
      return;
    }

    const decoded = jwt.verify(token, secret) as JWTPayload;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        is_superuser: true,
        is_active: true
      }
    });

    if (user && user.is_active) {
      req.user = user;
    }

    next();
  } catch (error) {
    // Token is invalid, but we continue without authentication
    next();
  }
};


