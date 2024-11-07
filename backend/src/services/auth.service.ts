import { v4 as uuidv4 } from 'uuid';
import bcryptjs from 'bcryptjs';
import { PrismaClient, User } from '@prisma/client';
import { generateToken, verifyToken } from '../utils/jwt.utils';
import sendMail from '../bg-services/email.service';
import path from 'path';


const prisma = new PrismaClient();

interface IUserData{
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string, 
  phoneNumber: string
}

export class AuthService{
    async signup(data: IUserData) {
        const {email, password, firstName, lastName, phoneNumber} = data;

        //Check if user exists
        const userExists = await prisma.user.findUnique({
            where: { email }
        });

        if(userExists){
            throw new Error('User already exists');
        
        }

        const passwordHash = await bcryptjs.hash(password,10);

        //Create new user
        const user = await prisma.user.create({
            data:{
                id: uuidv4(),
                email,
                password: passwordHash,
                firstName,
                lastName,
                phoneNumber,
            }
        });

    return user;
       
    }

    async login(email:string, password:string): Promise<{user:User, token: string}>{

        //Find user by email
        const user = await prisma.user.findUnique({where:{email}});
        if(!user){
            throw new Error('Invalid credentials')
        }

        //Check password
        const ispasswordValid = await bcryptjs.compare(password, user.password);
        if(!ispasswordValid){
            throw new Error('Invalid credentials');
        }

        // Generate JWT token
    const token = generateToken({
        userId: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
  
      return { user, token };

    }
    async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<User> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
          throw new Error('User not found');
        }
    
        // Verify old password
        const isPasswordValid = await bcryptjs.compare(oldPassword, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid old password');
        }
    
        // Hash new password
        const newPasswordHash = await bcryptjs.hash(newPassword, 10);
    
        // Update user with new password
        return prisma.user.update({
          where: { id: userId },
          data: { password: newPasswordHash },
        });
      }
      static async getUserById(id: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
      }
      async getUserById(id: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
      }
      async requestPasswordReset(email: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          throw new Error('User not found');
        }
    
        const generateResetCode: () => string = () => {
          return Math.floor(1000 + Math.random() * 9000).toString();
        };
    
        // Generate reset token
        const resetToken = generateResetCode();
        const resetTokenExpiry = new Date(Date.now() + 900000); // 15 minutes
    
        // Save reset token to user
        await prisma.user.update({
          where: { id: user.id },
          data: {
            resetToken,
            resetTokenExpiry,
          },
        });
    
        const templatePath = path.join(__dirname, '../mails/reset-password.ejs');
        const body = {
          user,
          resetToken,
        };

        await sendMail({
            email: user.email,
            subject: 'Reset your password - Agro-Connect KE',
            template: templatePath,
            body,
          });
      
          return resetToken;
    }

    async resetPassword(resetToken: string, newPassword: string): Promise<User> {
        const user = await prisma.user.findFirst({
          where: {
            resetToken,
            resetTokenExpiry: { gt: new Date() },
          },
        });
    
        if (!user) {
          throw new Error('Invalid or expired reset token');
        }
    
        // Hash new password
        const newPasswordHash = await bcryptjs.hash(newPassword, 10);
    
        // Update user with new password and clear reset token
        return prisma.user.update({
          where: { id: user.id },
          data: {
            password: newPasswordHash,
            resetToken: null,
            resetTokenExpiry: null,
          },
        });
      }
}