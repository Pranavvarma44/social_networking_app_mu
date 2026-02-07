import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOtp(email, otp) {
  await transporter.sendMail({
    from: `"College App" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your verification code",
    html: `
      <h2>Email Verification</h2>
      <h1>${otp}</h1>
      <p>This code is valid for 10 minutes.</p>
    `,
  });
}