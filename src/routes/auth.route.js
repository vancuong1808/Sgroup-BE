import express from 'express'
import AuthController from '../controllers/auth.controller.js';
import AuthMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', AuthController.RegisterUser );

router.post('/login', AuthController.LoginUser );

router.post('/ADMIN', AuthController.LoginADMIN);

router.get('/getAllUsers', AuthMiddleware.ValidateToken, AuthController.GetAllUsers );

router.post('/forgot-password', AuthController.ForgotPassword )

router.put('/reset-password', AuthMiddleware.ValidateForgotPassword, AuthController.ResetPassword )

export default router