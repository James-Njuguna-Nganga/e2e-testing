// order.controller.ts
import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';

export class OrderController {
  static async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const order = await OrderService.createOrder({
        userId: req.user.userId,
        items: req.body.items
      });

      res.status(201).json(order);
    } catch (error: any) {
      next(error);
    }
  }

  static async getUserOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 10;
      const orders = await OrderService.getUserOrders(req.user!.userId, skip, take);
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  static async getFarmerOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 10;
      const orders = await OrderService.getFarmerOrders(req.user!.userId, skip, take);
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  static async getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 10;
      const orders = await OrderService.getAllOrders(skip, take);
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await OrderService.updateOrderStatus(id, status);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
}