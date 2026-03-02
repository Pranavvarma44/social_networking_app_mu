import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendOtp = async (email, otp) => {
  await emailApi.sendTransacEmail({
    sender: {
      email: "your_verified_email@gmail.com",
      name: "MU Social"
    },
    to: [{ email }],
    subject: "Email Verification OTP",
    htmlContent: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This code is valid for 10 minutes.</p>
    `
  });

  console.log("Real OTP email sent");
};