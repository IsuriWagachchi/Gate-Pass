import express from "express";
import { signup, login, getSenderDetails } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();
// Signup route
router.post("/signup", signup);
// Login route
router.post("/login", login);

// Get current logged-in sender details
router.get("/user", verifyToken, getSenderDetails);

export default router;