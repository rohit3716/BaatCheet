import express from 'express';
import { login, logout, signup,forgotPassword, resetPassword, sendSignupOTP, verifyOTP } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/send-otp", sendSignupOTP);
router.post("/verify-otp", verifyOTP);
router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/forgotPassword", forgotPassword);

router.post("/resetPassword/:token", resetPassword)

export default router;