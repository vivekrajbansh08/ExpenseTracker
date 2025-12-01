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
    console.log("📨 Sending from:", process.env.SENDER_EMAIL);

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

// Send expense share creation notification
export const sendExpenseShareCreatedEmail = async (
  recipientEmail: string,
  recipientName: string,
  description: string,
  totalAmount: number,
  splitAmount: number,
  paidByName: string
) => {
  try {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error("SENDGRID_API_KEY is not configured");
    }

    sgMail.setApiKey(apiKey);

    const msg = {
      to: recipientEmail,
      from: process.env.SENDER_EMAIL || "noreply@expensetracker.com",
      subject: `You've been added to an expense: "${description}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">New Expense Share</h2>
          <p>Hi ${recipientName},</p>
          <p>You've been added to a shared expense by <strong>${paidByName}</strong>.</p>
          
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">${description}</h3>
            <p style="font-size: 24px; font-weight: bold; color: #2d3748; margin: 10px 0;">
              Your share: ₹${splitAmount.toFixed(2)}
            </p>
            <p style="color: #718096;">Total amount: ₹${totalAmount.toFixed(2)}</p>
          </div>
          
          <p>Log in to your Money Track account to view details and settle this expense.</p>
          
          <a href="${process.env.FRONTEND_URL || 'http://localhost:4200'}/expense-sharing" 
             style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; margin-top: 20px;">
            View Expense
          </a>
          
          <p style="color: #a0aec0; font-size: 12px; margin-top: 30px;">
            This is an automated notification from Money Track.
          </p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log("✅ Expense share notification sent to:", recipientEmail);
  } catch (error: any) {
    console.error("❌ Failed to send expense share email:", error.message);
  }
};

// Send split settled notification
export const sendSplitSettledEmail = async (
  recipientEmail: string,
  recipientName: string,
  description: string,
  amount: number,
  settlerName: string
) => {
  try {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error("SENDGRID_API_KEY is not configured");
    }

    sgMail.setApiKey(apiKey);

    const msg = {
      to: recipientEmail,
      from: process.env.SENDER_EMAIL || "noreply@expensetracker.com",
      subject: `Payment received for "${description}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #48bb78;">✅ Payment Received!</h2>
          <p>Hi ${recipientName},</p>
          <p><strong>${settlerName}</strong> has settled their part of the expense.</p>
          
          <div style="background: #f0fff4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #48bb78;">
            <h3 style="color: #2d3748; margin-top: 0;">${description}</h3>
            <p style="font-size: 24px; font-weight: bold; color: #48bb78; margin: 10px 0;">
              ₹${amount.toFixed(2)}
            </p>
            <p style="color: #718096;">Status: Paid</p>
          </div>
          
          <p>View your expense details in Money Track.</p>
          
          <a href="${process.env.FRONTEND_URL || 'http://localhost:4200'}/expense-sharing" 
             style="display: inline-block; background: #48bb78; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; margin-top: 20px;">
            View Details
          </a>
          
          <p style="color: #a0aec0; font-size: 12px; margin-top: 30px;">
            This is an automated notification from Money Track.
          </p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log("✅ Split settled notification sent to:", recipientEmail);
  } catch (error: any) {
    console.error("❌ Failed to send split settled email:", error.message);
  }
};

// Send overdue payment reminder
export const sendOverdueReminderEmail = async (
  recipientEmail: string,
  recipientName: string,
  description: string,
  amount: number,
  daysPending: number
) => {
  try {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error("SENDGRID_API_KEY is not configured");
    }

    sgMail.setApiKey(apiKey);

    const msg = {
      to: recipientEmail,
      from: process.env.SENDER_EMAIL || "noreply@expensetracker.com",
      subject: `Reminder: Pending payment for "${description}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ed8936;">⏰ Payment Reminder</h2>
          <p>Hi ${recipientName},</p>
          <p>This is a friendly reminder that you have a pending payment.</p>
          
          <div style="background: #fffaf0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ed8936;">
            <h3 style="color: #2d3748; margin-top: 0;">${description}</h3>
            <p style="font-size: 24px; font-weight: bold; color: #ed8936; margin: 10px 0;">
              ₹${amount.toFixed(2)}
            </p>
            <p style="color: #718096;">Pending for ${daysPending} days</p>
          </div>
          
          <p>Please settle this expense at your earliest convenience.</p>
          
          <a href="${process.env.FRONTEND_URL || 'http://localhost:4200'}/expense-sharing" 
             style="display: inline-block; background: #ed8936; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; margin-top: 20px;">
            View & Settle
          </a>
          
          <p style="color: #a0aec0; font-size: 12px; margin-top: 30px;">
            This is an automated reminder from Money Track.
          </p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log("✅ Overdue reminder sent to:", recipientEmail);
  } catch (error: any) {
    console.error("❌ Failed to send overdue reminder:", error.message);
  }
};

// Send expense fully settled notification to all participants
export const sendExpenseFullySettledEmail = async (
  recipientEmail: string,
  recipientName: string,
  description: string,
  totalAmount: number
) => {
  try {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error("SENDGRID_API_KEY is not configured");
    }

    sgMail.setApiKey(apiKey);

    const msg = {
      to: recipientEmail,
      from: process.env.SENDER_EMAIL || "noreply@expensetracker.com",
      subject: `Expense settled: "${description}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #48bb78;">🎉 Expense Fully Settled!</h2>
          <p>Hi ${recipientName},</p>
          <p>Great news! The expense "<strong>${description}</strong>" has been fully settled.</p>
          
          <div style="background: #f0fff4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #48bb78;">
            <h3 style="color: #2d3748; margin-top: 0;">${description}</h3>
            <p style="font-size: 24px; font-weight: bold; color: #48bb78; margin: 10px 0;">
              ₹${totalAmount.toFixed(2)}
            </p>
            <p style="color: #718096;">Status: <strong style="color: #48bb78;">Fully Settled ✓</strong></p>
          </div>
          
          <p>All participants have settled their shares. Thank you for keeping your finances in order!</p>
          
          <a href="${process.env.FRONTEND_URL || 'http://localhost:4200'}/expense-sharing" 
             style="display: inline-block; background: #48bb78; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; margin-top: 20px;">
            View Details
          </a>
          
          <p style="color: #a0aec0; font-size: 12px; margin-top: 30px;">
            This is an automated notification from Money Track.
          </p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log("✅ Expense settled notification sent to:", recipientEmail);
  } catch (error: any) {
    console.error("❌ Failed to send expense settled email:", error.message);
  }
};
