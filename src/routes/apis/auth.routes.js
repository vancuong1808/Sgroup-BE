import express from 'express'
import AuthController from "../../controllers/auth.controller.js"
import AuthMiddleware from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', AuthController.RegisterUser );

router.post('/login', AuthController.LoginUser );

router.post('/forgot-password', AuthController.ForgotPassword );

router.put('/reset-password', AuthMiddleware.ValidateForgotPassword, AuthController.ResetPassword );

router.post('/upload', AuthMiddleware.ValidateToken, AuthController.UploadSingle );

router.post('/multi-upload', AuthMiddleware.ValidateToken, AuthController.UploadMulti );

export default router