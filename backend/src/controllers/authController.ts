import { Request, Response } from "express";
import User from "../models/User";
import TempUser from "../models/TempUser";
import { sendVerificationEmail } from "../utils/sendEmail";
import { generateToken } from "../utils/jwt";

//Register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists in main User table
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Remove any older temp user entry
    await TempUser.deleteOne({ email });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store temp user with OTP and expiry of 10 mins
    await TempUser.create({
      name,
      email,
      password,
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
    } as any);

    // Send OTP email
    await sendVerificationEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email address.",
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//verify Otp

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    const tempUser = await TempUser.findOne({ email });

    if (!tempUser) {
      res
        .status(400)
        .json({ message: "No registration found for this email." });
      return;
    }

    if ((tempUser as any).otp !== Number(otp)) {
      res.status(400).json({ message: "Invalid OTP." });
      return;
    }

    if ((tempUser as any).otpExpires < new Date()) {
      res
        .status(400)
        .json({ message: "OTP has expired. Please register again." });
      return;
    }

    // Create real user
    const user = await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
    });

    // Remove temp user entry
    await TempUser.deleteOne({ email });

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: "Email verified and account created successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//Login

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check actual user table
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const isPasswordValid = await (user as any).comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
