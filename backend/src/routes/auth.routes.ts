import express from "express";
import { AuthController } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", AuthController.signup);
router.post("/login", AuthController.login);
router.post("/change-password", AuthController.changePassword);
router.post("/request-password-reset", AuthController.requestPasswordReset);
router.post("/reset-password", AuthController.resetPassword);

export default router;
