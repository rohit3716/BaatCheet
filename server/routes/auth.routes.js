import express from "express";
import { 
  login, 
  logout, 
  signup, 
  sendSignupOTP, 
  verifyOTP, 
  sendProfileUpdateOTP,
  forgotPassword, 
  resetPassword 
} from "../controllers/auth.controller.js";
import { otpLimiter } from "../utils/rateLimiter.js";

const router = express.Router();

router.post("/send-otp", otpLimiter, sendSignupOTP);
router.post("/verify-otp", verifyOTP);
router.post("/send-profile-otp", otpLimiter, sendProfileUpdateOTP);
router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/forgotPassword", forgotPassword);

router.post("/resetPassword/:token", resetPassword)

export default router;