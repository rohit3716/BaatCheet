import rateLimit from "express-rate-limit";

export const otpLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 1, // Limit each IP to 1 request per window
    message: { error: "Too many OTP requests, please try again after 2 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});
