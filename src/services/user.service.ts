import { PrismaClient, User } from '@prisma/client';
import path from 'path';
import sendMail from '../bg-services/email.service';
const prisma = new PrismaClient();

export class UserService {
  static async getUserById(id: string): Promise<User | null> {
    const user = prisma.user.findUnique({ where: { id } });
    if (!user){
      throw new Error('User not found');
    }
    return user;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
   const user = prisma.user.findUnique({ where: { email } });
    if(!user)
{
    throw new Error('User by that email does not exist');
}    return user;
  }

  static async updateUser(id: string, data: Partial<User>): Promise<User> {
    const userExists = await prisma.user.findUnique({where:{id}});
    if(!userExists){
        throw new Error('User does not exist')
    }
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  static async deleteUser(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }

  static async getAllUsers(skip: number = 0, take: number = 10): Promise<User[]> {
    return prisma.user.findMany({
      skip,
      take,
    });
  }

  static async getFarmers(skip: number = 0, take: number = 10): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        role: 'FARMER',
      },
      skip,
      take,
    });
  }

  static async getFarmerRequests(skip: number = 0, take: number = 10): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        farmerRequestStatus: 'PENDING',
      },
      skip,
      take,
    });
  }

  static async requestFarmerRole(userId: string): Promise<User> {
    const templatePath = path.join(__dirname, '../mails/request-farmer.ejs');
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    const body = {
      user,
    };
    await sendMail({
      email: user.email,
      subject: 'FARMER REQUEST',
      template: templatePath,
      body,
    });

    return prisma.user.update({
      where: { id: userId },
      data: { farmerRequestStatus: 'PENDING' },
    });
  }

  static async approveFarmerRequest(userId: string): Promise<User> {
    const templatePath = path.join(__dirname, '../mails/approve-request.ejs');
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('Farmer role request not found');
    }
    const body = {
      user,
    };
    await sendMail({
      email: user.email,
      subject: 'FARMER ROLE REQUEST APPROVAL',
      template: templatePath,
      body,
    });
    return prisma.user.update({
      where: { id: userId },
      data: {
        role: 'FARMER',
        farmerRequestStatus: 'APPROVED',
      },
    });
  }

  static async isBuyer(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    return user.role === 'BUYER';
  }

  static async isFarmer(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    return user.role === 'FARMER';
  }

  static async isAdmin(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    return user.role === 'ADMIN';
  }

  static async rejectFarmerRequest(userId: string): Promise<User> {
    const templatePath = path.join(__dirname, '../mails/reject-request.ejs');
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    const body = {
      user,
    };
    await sendMail({
      email: user.email,
      subject: 'FARMER REQUEST REJECTION',
      template: templatePath,
      body,
    });
    return prisma.user.update({
      where: { id: userId },
      data: {
        role: 'BUYER',
        farmerRequestStatus: 'REJECTED',
      },
    });
  }

  static async changeUserRole(userId: string, newRole: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
  }

  static async searchUsers(query: string, skip: number = 0, take: number = 10): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: query } },
          { lastName: { contains: query } },
          { email: { contains: query } },
        ],
      },
      skip,
      take,
    });
  }

  static async getUserStats(): Promise<{ total: number; byRole: Record<string, number> }> {
    const total = await prisma.user.count();
    const byRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true,
      },
    });

    const roleStats = byRole.reduce((acc, curr) => {
      acc[curr.role] = curr._count.role;
      return acc;
    }, {} as Record<string, number>);

    return { total, byRole: roleStats };
  }
}