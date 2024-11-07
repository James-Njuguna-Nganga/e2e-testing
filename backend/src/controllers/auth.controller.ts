import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    private static authService = new AuthService();

    static async signup(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, firstName, lastName, phoneNumber } = req.body;
            const result = await AuthController.authService.signup({ 
                email, 
                password, 
                firstName, 
                lastName, 
                phoneNumber 
            });
            res.status(201).json({ message: "User Registered successfully", result });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const result = await AuthController.authService.login(email, password);
            res.status(200).json({ message: "Login Successful!", result });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const user = await AuthController.authService.getUserById(id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(200).json(user);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async changePassword(req: Request, res: Response): Promise<void> {
        try {
            const { userId, oldPassword, newPassword } = req.body;
            const user = await AuthController.authService.changePassword(
                userId,
                oldPassword,
                newPassword
            );
            res.status(200).json({ message: "Password updated successfully", user });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async requestPasswordReset(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            const resetToken = await AuthController.authService.requestPasswordReset(email);
            res.status(200).json({ 
                message: "Check your Email for reset code", 
                resetToken 
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { resetToken, newPassword } = req.body;
            const user = await AuthController.authService.resetPassword(
                resetToken,
                newPassword
            );
            res.status(200).json({ 
                user, 
                message: "Password reset successfully" 
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}