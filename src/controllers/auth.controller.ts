import { AuthService } from "../services/auth.service";
import { Request, Response, NextFunction } from "express";


export class AuthController{
    static async signup(req: Request, res: Response):Promise<Response>{
        try {
            const { email, password, firstName, lastName, phoneNumber } = req.body;
            const authService = new AuthService();
            const result = await authService.signup({ email, password, firstName, lastName, phoneNumber });
            return res.status(201).json({message:"User Registered succesfully",result});
          } catch (error: any) {
            return res.status(400).json({ error: error.message });
          }
    }
    static async login(req:Request, res: Response):Promise<Response>{
        try {
            const { email, password } = req.body;
            const authService = new AuthService();

            const result = await authService.login( email, password );
            return res.status(200).json({message:"Login Successfull!",result});
          } catch (error: any) {
            return res.status(400).json({ error: error.message });
          }
    }
    static async getUserById(req: Request, res: Response): Promise<Response> {
        try {
          const { id } = req.params;
          const authService = new AuthService();

          const user = await authService.getUserById(id);
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          return res.status(200).json(user);
        } catch (error: any) {
          return res.status(400).json({ error: error.message });
        }
      }
      static async changePassword(req: Request, res: Response): Promise<Response> {
        try {
          const { userId, oldPassword, newPassword } = req.body;
          const authService = new AuthService();

          const user = await authService.changePassword(userId, oldPassword, newPassword);
          return res.status(200).json({message:"Password updated succesfully",user});
        } catch (error: any) {
          return res.status(400).json({ error: error.message });
        }
      }
      static async requestPasswordReset(req: Request, res: Response): Promise<Response> {
        try {
          const { email } = req.body;
          const authService = new AuthService();

          const resetToken = await authService.requestPasswordReset(email);
          // Here you would typically send the reset token to the user's email.
          return res.status(200).json({ message:"Check your Email for reset code",resetToken });
        } catch (error: any) {
          return res.status(400).json({ error: error.message });
        }
      }
      static async resetPassword(req: Request, res: Response): Promise<Response> {
        try {
          const { resetToken, newPassword } = req.body;
          const authService = new AuthService();

          const user = await authService.resetPassword(resetToken, newPassword);
          return res.status(200).json({user,message:"Password reset succesfully"});
        } catch (error: any) {
          return res.status(400).json({ error: error.message });
        }
      }
}
