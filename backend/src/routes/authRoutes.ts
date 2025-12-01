import express from "express";
import { register, login, verifyOtp, lookupUser } from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.get("/lookup", lookupUser); // New: lookup user by email

export default router;
