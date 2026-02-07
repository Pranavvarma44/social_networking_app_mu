import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import connectDB from "../../lib/db.js";
import EmailOtp from "../../models/EmailOtp.js";
import { sendOtp } from "../../lib/mailer.js";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Name, email and password are required",
    });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    await connectDB();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: normalizedEmail,
      password: passwordHash,
      emailVerified: false,
    });

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    await EmailOtp.deleteMany({
      email: normalizedEmail,
    });

    await EmailOtp.create({
      email: normalizedEmail,
      otp: otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), 
    });

    await sendOtp(normalizedEmail, otp);

    return res.status(201).json({
      message: "User registered. OTP sent to email.",
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}