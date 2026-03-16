import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import EmailOtp from "../models/EmailOtp.js";
import { sendOtp } from "../utils/mailer.js";

const router = express.Router();

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* ---------------- DOMAIN CHECK ---------------- */

const isAllowedDomain = (email) => {
  const allowedDomains = process.env.ALLOWED_DOMAINS
    ? process.env.ALLOWED_DOMAINS.split(",")
    : [];

  const domain = email.split("@")[1]?.toLowerCase();

  return allowedDomains.includes(domain);
};

/* ---------------- ROLE DETECTION ---------------- */

const detectRole = (email) => {
  const username = email.split("@")[0];

  // Student pattern example: se23ucse154
  const studentRegex = /^[a-z]{2}\d{2}[a-z]{4}\d{3}$/i;

  if (studentRegex.test(username)) {
    return "student";
  }

  // Faculty usually name.name
  if (username.includes(".")) {
    return "faculty";
  }

  return "student";
};

/* ---------------- REGISTER ---------------- */

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const normalizedEmail = email.toLowerCase();

    // 🔒 Domain restriction
    if (!isAllowedDomain(normalizedEmail)) {
      return res.status(400).json({
        error: "Only official university email addresses are allowed",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    /* -------- Detect role from email -------- */

    const detectedRole = detectRole(normalizedEmail);

    /* -------- Prevent role spoofing -------- */

    if (role && role !== detectedRole) {
      return res.status(400).json({
        error: `Email belongs to a ${detectedRole}. Please register as ${detectedRole}.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      emailVerified: false,
      role: detectedRole,
    });

    /* -------- OTP creation -------- */

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
      role: detectedRole,
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ---------------- VERIFY OTP ---------------- */

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

    res.json({
      message: "Email verified successfully",
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ---------------- LOGIN ---------------- */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase();

    // 🔒 Domain restriction
    if (!isAllowedDomain(normalizedEmail)) {
      return res.status(403).json({
        error: "Access restricted to university members only",
      });
    }

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
      role: user.role,
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;