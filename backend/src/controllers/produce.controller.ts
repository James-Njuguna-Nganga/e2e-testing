import { Request, Response, NextFunction } from 'express';
import { ProduceService } from '../services/produce.service';

export class ProduceController {
  static async createProduce(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
  
      const input = {
        ...req.body,
        image: req.file,
        date: new Date(req.body.date)
      };
  
      const produce = await ProduceService.createProduce(input, req.user.userId);
      res.status(201).json(produce);
    } catch (error) {
      next(error);
    }
  }

  static async getProduceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const produce = await ProduceService.getProduceById(id);
      if (!produce) {
        res.status(404).json({ error: 'Produce not found' });
        return;
      }
      res.status(200).json(produce);
    } catch (error) {
      next(error);
    }
  }

  static async getAllProduce(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 10;
      const result = await ProduceService.getAllProduce(skip, take);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getFarmerProduce(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const farmerId = req.user?.userId;
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 10;
      const result = await ProduceService.getFarmerProduce(farmerId!, skip, take);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async updateProduce(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const input = {
        ...req.body,
        image: req.file,
        date: req.body.date ? new Date(req.body.date) : undefined
      };
      const produce = await ProduceService.updateProduce(id, input);
      res.status(200).json(produce);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduce(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await ProduceService.deleteProduce(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async searchProduce(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query.q as string;
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 10;
      const result = await ProduceService.searchProduce(query, skip, take);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getProduceByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { categoryId } = req.params;
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 10;
      const result = await ProduceService.getProduceByCategory(categoryId, skip, take);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async updateProduceStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const produce = await ProduceService.updateProduceStatus(id, status);
      res.status(200).json(produce);
    } catch (error) {
      next(error);
    }
  }
}