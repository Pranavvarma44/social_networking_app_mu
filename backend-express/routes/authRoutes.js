import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import EmailOtp from "../models/EmailOtp.js";
import { sendOtp } from "../utils/mailer.js";

const router = express.Router();

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

router.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields required" });
      }
  
      const normalizedEmail = email.toLowerCase();
  
      const existingUser = await User.findOne({ email: normalizedEmail });
  
      if (existingUser) {
        return res.status(409).json({ error: "Email already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        emailVerified: false,
        role: "student",
      });
  
      const otp = generateOtp();
      const otpHash = await bcrypt.hash(otp, 10);
  
      await EmailOtp.deleteMany({ email: normalizedEmail });
  
      await EmailOtp.create({
        email: normalizedEmail,
        otp: otpHash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });
  
      await sendOtp(normalizedEmail, otp);
  
      res.status(201).json({
        message: "User registered. OTP sent.",
      });
  
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.post("/verify-otp", async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      const normalizedEmail = email.toLowerCase();
  
      const otpRecord = await EmailOtp.findOne({ email: normalizedEmail });
  
      if (!otpRecord) {
        return res.status(400).json({ error: "OTP expired or invalid" });
      }
  
      const isValid = await bcrypt.compare(otp, otpRecord.otp);
  
      if (!isValid) {
        return res.status(400).json({ error: "Invalid OTP" });
      }
  
      await User.updateOne(
        { email: normalizedEmail },
        { $set: { emailVerified: true } }
      );
  
      await EmailOtp.deleteOne({ _id: otpRecord._id });
  
      res.json({ message: "Email verified successfully" });
  
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const normalizedEmail = email.toLowerCase();
  
      const user = await User.findOne({ email: normalizedEmail });
  
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      if (!user.emailVerified) {
        return res.status(403).json({
          error: "Email not verified",
          action: "verify_email",
        });
      }
  
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
  
      res.json({
        message: "Login successful",
        token,
      });
  
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  export default router;