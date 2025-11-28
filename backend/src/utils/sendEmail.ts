import sgMail from "@sendgrid/mail";

export const sendVerificationEmail = async (email: string, otp: number) => {
  try {
    // Load API key at runtime (after dotenv.config() in server.ts)
    const apiKey = process.env.SENDGRID_API_KEY;
    
    if (!apiKey) {
      throw new Error("SENDGRID_API_KEY is not configured in environment variables");
    }

    sgMail.setApiKey(apiKey);

    console.log("📧 Sending OTP email to:", email);
    console.log("🔑 API Key configured: true");
    console.log("📤 From:", process.env.SENDER_EMAIL);

    const msg = {
      to: email,
      from: process.env.SENDER_EMAIL || "noreply@expensetracker.com",
      subject: "Verify Your Email - Expense Tracker",
      html: `
        <h2>Your OTP: <b>${otp}</b></h2>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    const response = await sgMail.send(msg);
    console.log("✅ Email sent successfully! Response status:", response[0].statusCode);
  } catch (error: any) {
    console.error("❌ SendGrid error:", {
      message: error.message,
      code: error.code,
      errors: error.response?.body?.errors,
    });
    throw new Error(`Email send failed: ${error.message}`);
  }
};
