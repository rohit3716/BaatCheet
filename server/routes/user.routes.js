import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { getUsersForSidebar, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.put("/profile", protectRoute, updateProfile);


export default router;