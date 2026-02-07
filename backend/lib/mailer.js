import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtp(email, otp) {
  await resend.emails.send({
    from: process.env.FROM_EMAIL, 
    to: email,
    subject: "Your verification code",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This code is valid for 10 minutes.</p>
    `,
  });
}