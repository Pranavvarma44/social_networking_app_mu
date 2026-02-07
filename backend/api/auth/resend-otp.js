import bcrypt from "bcryptjs";
import connectDB from "../../lib/db.js";
import User from "../../models/User.js";
import EmailOtp from "../../models/EmailOtp.js";
import { sendOtp } from "../../lib/mailer.js";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    await connectDB();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    
    if (user.emailVerified) {
      return res.status(400).json({
        error: "Email already verified",
      });
    }

    await EmailOtp.deleteMany({ email: normalizedEmail });


    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    await EmailOtp.create({
      email: normalizedEmail,
      otp: otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), 
    });

    await sendOtp(normalizedEmail, otp);

    return res.status(200).json({
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}