import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { AuthService } from '../services/auth.service';

interface UserPayload {
  userId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const user = verifyToken(token) as UserPayload;
      req.user = user;
      next();
    } catch (error) {
      res.status(403).json({ error: 'Invalid token' });
    }
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
};

export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
    } else if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ error: 'Insufficient permissions' });
  }
}

export const isCurrentUser = (req: Request, res: Response, next: NextFunction): void => {
  const requestedUserId = req.params.userId;
  
  if (req.user && req.user.userId === requestedUserId) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied' });
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ error: 'Refresh token is required' });
    return;
  }

  try {
    const decoded = verifyToken(refreshToken) as UserPayload;
    const user = await AuthService.getUserById(decoded.userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const newAccessToken = verifyToken(user.id);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};