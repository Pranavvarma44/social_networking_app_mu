import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export const sendOtp = async (email, otp) => {
  await transporter.sendMail({
    from: '"MU Social" <no-reply@musocial.com>',
    to: email,
    subject: "Email Verification OTP",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This code is valid for 10 minutes.</p>
    `,
  });

  console.log("OTP sent to Mailtrap inbox");
};