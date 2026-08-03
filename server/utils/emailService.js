import nodemailer from "nodemailer";

export const sendConfirmationEmail = async ({
  toEmail,
  leaderName,
  teamName,
  registrationId,
  paymentId,
  amount,
  numMembers,
  college,
}) => {
  try {
    const subject = "AMS Hackathon 2026 Registration Confirmed";
    const textBody = `Dear ${leaderName || "Team Leader"},

Your registration for AMS Hackathon 2026 has been successfully completed.

Registration Details

Team Name: ${teamName || "N/A"}
Team Leader: ${leaderName || "N/A"}
College: ${college || "N/A"}
Number of Participants: ${numMembers || 4}
Amount Paid: ₹${amount || 400} INR
Transaction ID: ${paymentId || "N/A"}
Registration ID: ${registrationId || "N/A"}

Thank you for registering.

Please keep this email for future reference.

We look forward to seeing you at AMS Hackathon 2026.

Regards

AMS Hackathon Organizing Team`;

    console.log(`
============================================================
📧 EMAIL CONFIRMATION DISPATCHED
To: ${toEmail}
Subject: ${subject}
------------------------------------------------------------
${textBody}
============================================================
    `);

    // If SMTP credentials configured in env, attempt real email send
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"AMS Hackathon Team" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject,
        text: textBody,
      });
    }

    return true;
  } catch (error) {
    console.error("Error sending confirmation email:", error.message);
    return false;
  }
};
