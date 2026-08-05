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
  eventDate = "22 August 2026 (9:00 AM)",
  venue = "Aalim Muhammed Salegh College of Engineering, Avadi, Chennai",
}) => {
  try {
    if (!toEmail) {
      console.warn("⚠️ Email notice: No leader recipient email address provided.");
      return false;
    }

    const subject = "AMS Hackathon 2026 | Registration Confirmed 🎉";
    const whatsappUrl = "https://chat.whatsapp.com/IdPOeoehQUrIVXt00cZibU";

    const textBody = `Dear ${leaderName || "Team Leader"},

Congratulations! Your registration for AMS Hackathon 2026 has been successfully confirmed.

============================================================
REGISTRATION DETAILS
============================================================
Team Leader Name       : ${leaderName || "N/A"}
Registration ID        : ${registrationId || "N/A"}
Team Name              : ${teamName || "N/A"}
College Name           : ${college || "N/A"}
Number of Participants : ${numMembers || 4}
Amount Paid            : ₹${amount || 400} INR
Transaction ID         : ${paymentId || "N/A"}
Event Date             : ${eventDate}
Venue                  : ${venue}

============================================================
JOIN OUR OFFICIAL WHATSAPP COMMUNITY
============================================================
${whatsappUrl}

All important announcements, schedules, rules, venue updates, and support will be shared through this community.

Thank you for registering. Please keep this email for future reference. We look forward to seeing you at AMS Hackathon 2026!

Regards,
AMS Hackathon 2026 Organizing Team
Aalim Muhammed Salegh College of Engineering`;

    const htmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #e2e8f0; padding: 30px; border-radius: 16px; border: 1px solid #1e293b;">
        <div style="text-align: center; padding-bottom: 20px; border-b: 1px solid #1e293b;">
          <h1 style="color: #06b6d4; font-size: 24px; margin: 0;">AMS HACKATHON 2026</h1>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Official Registration Confirmation</p>
        </div>

        <div style="margin-top: 24px;">
          <p style="font-size: 16px;">Dear <strong>${leaderName || "Team Leader"}</strong>,</p>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            Your registration for <strong>AMS Hackathon 2026</strong> has been successfully verified and completed.
          </p>

          <div style="background-color: #151d30; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #334155;">
            <h3 style="color: #f59e0b; margin-top: 0; font-size: 16px; border-bottom: 1px solid #334155; padding-bottom: 8px;">Registration Details</h3>
            <table style="width: 100%; font-size: 14px; color: #e2e8f0; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #94a3b8;">Team Leader Name:</td><td style="font-weight: bold;">${leaderName || "N/A"}</td></tr>
              <tr><td style="padding: 6px 0; color: #94a3b8;">Registration ID:</td><td style="font-weight: bold; color: #06b6d4;">${registrationId || "N/A"}</td></tr>
              <tr><td style="padding: 6px 0; color: #94a3b8;">Team Name:</td><td style="font-weight: bold;">${teamName || "N/A"}</td></tr>
              <tr><td style="padding: 6px 0; color: #94a3b8;">College Name:</td><td>${college || "N/A"}</td></tr>
              <tr><td style="padding: 6px 0; color: #94a3b8;">Participants:</td><td>${numMembers || 4} Members</td></tr>
              <tr><td style="padding: 6px 0; color: #94a3b8;">Amount Paid:</td><td style="color: #10b981; font-weight: bold;">₹${amount || 400} INR</td></tr>
              <tr><td style="padding: 6px 0; color: #94a3b8;">Transaction ID:</td><td style="font-family: monospace;">${paymentId || "N/A"}</td></tr>
              <tr><td style="padding: 6px 0; color: #94a3b8;">Event Date:</td><td>${eventDate}</td></tr>
              <tr><td style="padding: 6px 0; color: #94a3b8;">Venue:</td><td>${venue}</td></tr>
            </table>
          </div>

          <div style="background-color: #064e3b; border: 1px solid #059669; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0;">
            <h3 style="color: #34d399; margin-top: 0; font-size: 16px;">Join our Official WhatsApp Community</h3>
            <p style="color: #a7f3d0; font-size: 13px; margin-bottom: 16px;">
              All important announcements, schedules, rules, venue updates, and support will be shared through this community.
            </p>
            <a href="${whatsappUrl}" style="background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px;">
              👉 Join WhatsApp Community
            </a>
            <p style="color: #6ee7b7; font-size: 11px; margin-top: 12px; word-break: break-all;">${whatsappUrl}</p>
          </div>

          <p style="color: #94a3b8; font-size: 13px;">
            Please keep this email for future reference. We look forward to seeing you at AMS Hackathon 2026!
          </p>
        </div>

        <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #1e293b; text-align: center; color: #64748b; font-size: 12px;">
          <p style="margin: 0;">Regards,<br><strong>AMS Hackathon 2026 Organizing Team</strong><br>Aalim Muhammed Salegh College of Engineering</p>
        </div>
      </div>
    `;

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER || "amshackathon2026@gmail.com";
    const smtpPass = process.env.SMTP_PASS || "mqtq plaz bnoy oyzh";

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"AMS Hackathon 2026" <${smtpUser}>`,
        to: toEmail,
        subject,
        text: textBody,
        html: htmlBody,
      });
      console.log(`✅ SMTP Confirmation email sent successfully to ${toEmail}`);
    }

    return true;
  } catch (error) {
    console.error("Non-blocking notice - Error sending confirmation email:", error.message);
    return false;
  }
};

export const sendContactMessageEmail = async ({ name, email, subject, message }) => {
  try {
    const organizerEmail = process.env.ORGANIZER_EMAIL || process.env.SMTP_USER || "amshackathon2026@gmail.com";
    const mailSubject = `📩 NEW INQUIRY: ${subject || "General Query"} (From ${name})`;

    const textBody = `New Participant Inquiry Received:

Participant Name : ${name}
Participant Email: ${email}
Query Category   : ${subject}

Message:
------------------------------------------------------------
${message}
------------------------------------------------------------

Click 'Reply' in your email client to reply directly to ${email}.`;

    const htmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #050816; color: #e2e8f0; padding: 28px; border-radius: 16px; border: 1px solid #334155;">
        <div style="border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 20px;">
          <span style="background-color: #06b6d4; color: #000; font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 6px; text-transform: uppercase;">Participant Query</span>
          <h2 style="color: #ffffff; font-size: 20px; margin: 12px 0 4px 0;">${subject || "General Inquiry"}</h2>
          <p style="color: #94a3b8; font-size: 13px; margin: 0;">Received via AMS Hackathon 2026 Contact Desk</p>
        </div>

        <div style="background-color: #0f172a; padding: 18px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px; font-size: 14px;">
          <table style="width: 100%; color: #e2e8f0; border-collapse: collapse;">
            <tr><td style="padding: 4px 0; color: #94a3b8; width: 140px;">Participant Name:</td><td style="font-weight: bold; color: #38bdf8;">${name}</td></tr>
            <tr><td style="padding: 4px 0; color: #94a3b8;">Email Address:</td><td><a href="mailto:${email}" style="color: #a7f3d0; text-decoration: underline;">${email}</a></td></tr>
            <tr><td style="padding: 4px 0; color: #94a3b8;">Query Subject:</td><td>${subject}</td></tr>
          </table>
        </div>

        <div style="background-color: #1e293b; padding: 20px; border-radius: 12px; border-left: 4px solid #06b6d4; margin-bottom: 24px;">
          <h4 style="color: #94a3b8; font-size: 12px; text-transform: uppercase; margin: 0 0 8px 0;">Message Content</h4>
          <p style="color: #f8fafc; font-size: 14px; line-height: 1.6; white-space: pre-wrap; margin: 0;">${message}</p>
        </div>

        <div style="text-align: center; margin-bottom: 20px;">
          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="background-color: #0284c7; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px;">
            ✉️ Reply to ${name}
          </a>
        </div>

        <div style="border-top: 1px solid #1e293b; padding-top: 14px; text-align: center; color: #64748b; font-size: 12px;">
          AMS Hackathon 2026 Organizing Committee • Aalim Muhammed Salegh College of Engineering
        </div>
      </div>
    `;

    console.log(`
============================================================
📩 CONTACT FORM INQUIRY RECEIVED
From: ${name} <${email}>
To: ${organizerEmail}
Subject: ${mailSubject}
------------------------------------------------------------
${message}
============================================================
    `);

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER || "amshackathon2026@gmail.com";
    const smtpPass = process.env.SMTP_PASS || "mqtq plaz bnoy oyzh";

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"AMS Hackathon Contact Desk" <${smtpUser}>`,
        to: organizerEmail,
        replyTo: email,
        subject: mailSubject,
        text: textBody,
        html: htmlBody,
      });
      console.log(`✅ Contact inquiry email delivered to organizer: ${organizerEmail}`);
    }
    return true;
  } catch (error) {
    console.error("Non-blocking notice - Contact email error:", error.message);
    return false;
  }
};
