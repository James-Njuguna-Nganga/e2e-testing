import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
   static async getUserById(req: Request, res: Response): Promise<void> {
      try {
        const { id } = req.params;
        const user = await UserService.getUserById(id);
        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
        }
        res.status(200).json(user);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }

  static async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const user = await UserService.getUserByEmail(email);
      if (!user) {
         res.status(404).json({ error: 'User not found' });
         return;
      }
       res.status(200).json(user);
    } catch (error: any) {
       res.status(500).json({ error: error.message });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;
      const user = await UserService.updateUser(id, data);
       res.status(200).json(user);
    } catch (error: any) {
       res.status(500).json({ error: error.message });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await UserService.deleteUser(id);
       res.status(200).json(user);
    } catch (error: any) {
       res.status(500).json({ error: error.message });
    }
  }

  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const { skip, take } = req.query;
      const users = await UserService.getAllUsers(Number(skip) || 0, Number(take) || 10);
       res.status(200).json(users);
    } catch (error: any) {
       res.status(500).json({ error: error.message });
    }
  }

  static async getFarmers(req: Request, res: Response): Promise<void> {
    try {
      const { skip, take } = req.query;
      const users = await UserService.getFarmers(Number(skip) || 0, Number(take) || 10);
       res.status(200).json(users);
    } catch (error: any) {
       res.status(500).json({ error: error.message });
    }
  }

  static async getFarmerRequests(req: Request, res: Response): Promise<void> {
    try {
      const { skip, take } = req.query;
      const users = await UserService.getFarmerRequests(Number(skip) || 0, Number(take) || 10);
       res.status(200).json(users);
    } catch (error: any) {
       res.status(500).json({ error: error.message });
    }
  }

  static async isBuyer(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;
      const user = await UserService.isBuyer(userId);
       res.status(200).json(user);
    } catch (error: any) {
       res.status(500).json({ error: error.message });
    }
  }

  static async isFarmer(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;
      const user = await UserService.isFarmer(userId);
       res.status(200).json(user);
    } catch (error: any) {
       res.status(500).json({ error: error.message });
    }
  }

  static async isAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;
      const user = await UserService.isAdmin(userId);
       res.status(200).json(user);
    } catch (error: any) {
       res.status(500).json({ error: error.message });
    }
  }

  static async requestFarmerRole(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;
      const user = await UserService.requestFarmerRole(userId);
       res.status(200).json(user);
    } catch (error: any) {
       res.status(500).json({ error: error.message });
    }
  }

  static async approveFarmerRequest(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;
      const user = await UserService.approveFarmerRequest(userId);
       res.status(200).json(user);
    } catch (error: any) {
       res.status(500).json({ error: error.message });
    }
  }

  static async rejectFarmerRequest(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;
      const user = await UserService.rejectFarmerRequest(userId);
       res.status(200).json(user);
    } catch (error: any) {
       res.status(500).json({ error: error.message });
    }
  }

  static async changeUserRole(req: Request, res: Response): Promise<void> {
    try {
      const { userId, newRole } = req.body;
      const user = await UserService.changeUserRole(userId, newRole);
       res.status(200).json(user);
    } catch (error: any) {
       res.status(500).json({ error: error.message });
    }
  }

  static async searchUsers(req: Request, res: Response): Promise<void> {
    const query = req.query.q as string || '';
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 10;
    try {
      const users = await UserService.searchUsers(query, skip, take);
       res.json(users);
    } catch (error: any) {
       res.status(500).json({ error: error.message });
    }
  }

  static async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await UserService.getUserStats();
       res.status(200).json(stats);
    } catch (error: any) {
       res.status(500).json({ error: error.message });
    }
  }
}