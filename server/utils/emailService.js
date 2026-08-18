import nodemailer from "nodemailer";

// Sets to prevent duplicate email dispatches
const sentOrganizerNotifications = new Set();
const sentParticipantConfirmations = new Set();

/**
 * Get configured Nodemailer SMTP Transporter
 */
const getTransporter = () => {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false,
    requireTLS: true,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Send Professional Participant Confirmation Email (Responsive HTML)
 * Prevents duplicate sends using sentParticipantConfirmations cache.
 */
export const sendConfirmationEmail = async ({
  toEmail,
  leaderName,
  leaderPhone,
  teamName,
  registrationId,
  paymentId,
  amount,
  numMembers,
  teamMembers = [],
  college,
  department,
  year,
  eventName = "AMS HACKATHON 2026",
  eventDate = "22 August 2026 (9:00 AM IST)",
  venue = "Aalim Muhammed Salegh College of Engineering, Nizara Educational Campus, Muthapudupet, Avadi, Chennai - 600055",
}) => {
  try {
    if (!toEmail) {
      console.warn(`[${new Date().toISOString()}] ⚠️ Email notice: No recipient leader email provided.`);
      return false;
    }

    const dedupKey = `${paymentId || registrationId}`;
    if (sentParticipantConfirmations.has(dedupKey)) {
      console.log(`[${new Date().toISOString()}] [PARTICIPANT_CONFIRM_SKIP] Duplicate confirmation email suppressed for Key: ${dedupKey}`);
      return true;
    }

    console.log(`[${new Date().toISOString()}] [PARTICIPANT_CONFIRM_ATTEMPT] Sending confirmation email to ${toEmail} for RegID ${registrationId}...`);

    const subject = `🎉 ${eventName} | Registration Confirmed! (ID: ${registrationId})`;
    const whatsappUrl = "https://chat.whatsapp.com/IdPOeoehQUrIVXt00cZibU";
    const organizerEmail = process.env.SMTP_USER || "coordinatoramshackathon@gmail.com";

    // Format Team Members into HTML Roster Table
    const memberRowsHtml = Array.isArray(teamMembers) && teamMembers.length > 0
      ? teamMembers.map((m, idx) => `
          <tr style="border-bottom: 1px solid #1e293b;">
            <td style="padding: 10px 8px; color: #94a3b8; font-weight: bold; width: 30px;">${idx + 1}.</td>
            <td style="padding: 10px 8px; color: #f8fafc; font-weight: bold;">${m.name || "Team Member"}</td>
            <td style="padding: 10px 8px; color: #38bdf8;">${m.email || toEmail}</td>
            <td style="padding: 10px 8px; color: #cbd5e1;">${m.phone || leaderPhone || "N/A"}</td>
            <td style="padding: 10px 8px;"><span style="background-color: #0369a1; color: #e0f2fe; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">${m.role || "Developer"}</span></td>
          </tr>
        `).join("")
      : `<tr><td colspan="5" style="padding: 12px; text-align: center; color: #94a3b8;">${leaderName || "Team Leader"} + Team (${numMembers || 4} Members)</td></tr>`;

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${eventName} Registration Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #050814; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
          <tr>
            <td align="center" style="padding: 20px 10px;">
              
              <!-- Container Card -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #0b0f19; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);">
                
                <!-- Header Banner -->
                <tr>
                  <td style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%); padding: 32px 24px; text-align: center;">
                    <div style="background-color: rgba(0, 0, 0, 0.25); display: inline-block; padding: 6px 16px; border-radius: 20px; color: #ffffff; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                      OFFICIAL CONFIRMATION
                    </div>
                    <h1 style="color: #ffffff; font-size: 26px; font-weight: 900; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3); font-family: Arial, sans-serif;">
                      ${eventName}
                    </h1>
                    <p style="color: #e0f2fe; font-size: 14px; margin: 6px 0 0 0; font-weight: 500;">
                      Registration Verified & Payment Confirmed
                    </p>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 28px 24px;">
                    
                    <p style="font-size: 16px; color: #ffffff; margin-top: 0;">
                      Dear <strong>${leaderName || "Team Leader"}</strong>,
                    </p>
                    
                    <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                      Congratulations! Your team <strong>"${teamName || "N/A"}"</strong> has been successfully registered for <strong>${eventName}</strong>. Your payment has been verified by our backend server.
                    </p>

                    <!-- Highlights Box -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                      <tr>
                        <td width="48%" style="background-color: #151d30; border: 1px solid #334155; border-radius: 12px; padding: 14px; text-align: center;">
                          <span style="color: #94a3b8; font-size: 11px; text-transform: uppercase; display: block;">Registration ID</span>
                          <strong style="color: #06b6d4; font-size: 18px; font-family: monospace;">${registrationId || "N/A"}</strong>
                        </td>
                        <td width="4%"></td>
                        <td width="48%" style="background-color: #151d30; border: 1px solid #334155; border-radius: 12px; padding: 14px; text-align: center;">
                          <span style="color: #94a3b8; font-size: 11px; text-transform: uppercase; display: block;">Payment Status</span>
                          <strong style="color: #10b981; font-size: 18px;">✅ PAID (₹${amount || 400})</strong>
                        </td>
                      </tr>
                    </table>

                    <!-- Registration & Team Summary Table -->
                    <div style="background-color: #151d30; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                      <h3 style="color: #f59e0b; margin: 0 0 12px 0; font-size: 15px; text-transform: uppercase; border-bottom: 1px solid #334155; padding-bottom: 8px;">
                        📌 Registration & Team Summary
                      </h3>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; color: #e2e8f0;">
                        <tr><td style="padding: 5px 0; color: #94a3b8; width: 140px;">Team Name:</td><td style="font-weight: bold; color: #ffffff;">${teamName || "N/A"}</td></tr>
                        <tr><td style="padding: 5px 0; color: #94a3b8;">Team Leader:</td><td style="font-weight: bold; color: #38bdf8;">${leaderName || "N/A"}</td></tr>
                        <tr><td style="padding: 5px 0; color: #94a3b8;">Leader Email:</td><td>${toEmail || "N/A"}</td></tr>
                        <tr><td style="padding: 5px 0; color: #94a3b8;">Leader Phone:</td><td style="font-weight: bold; color: #facc15;">${leaderPhone || "N/A"}</td></tr>
                        <tr><td style="padding: 5px 0; color: #94a3b8;">College Name:</td><td>${college || "N/A"}</td></tr>
                        ${department ? `<tr><td style="padding: 5px 0; color: #94a3b8;">Department & Year:</td><td>${department} (${year || "3rd Year"})</td></tr>` : ""}
                        <tr><td style="padding: 5px 0; color: #94a3b8;">Total Participants:</td><td><strong>${numMembers || 4} Members</strong></td></tr>
                        <tr><td style="padding: 5px 0; color: #94a3b8;">Transaction ID:</td><td style="font-family: monospace; color: #34d399;">${paymentId || "N/A"}</td></tr>
                      </table>
                    </div>

                    <!-- Team Members Roster -->
                    <div style="background-color: #151d30; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                      <h3 style="color: #38bdf8; margin: 0 0 12px 0; font-size: 15px; text-transform: uppercase; border-bottom: 1px solid #334155; padding-bottom: 8px;">
                        👥 Confirmed Team Roster
                      </h3>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 12px; color: #e2e8f0; border-collapse: collapse; text-align: left;">
                        <thead>
                          <tr style="border-bottom: 1px solid #334155; color: #94a3b8;">
                            <th style="padding: 6px 8px;">#</th>
                            <th style="padding: 6px 8px;">Member Name</th>
                            <th style="padding: 6px 8px;">Email</th>
                            <th style="padding: 6px 8px;">Phone</th>
                            <th style="padding: 6px 8px;">Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${memberRowsHtml}
                        </tbody>
                      </table>
                    </div>

                    <!-- Event Logistics Card -->
                    <div style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                      <h3 style="color: #06b6d4; margin: 0 0 10px 0; font-size: 15px; text-transform: uppercase;">
                        📅 Event Logistics & Location
                      </h3>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; color: #e2e8f0;">
                        <tr><td style="padding: 4px 0; color: #94a3b8; width: 140px;">Event Date & Time:</td><td style="font-weight: bold; color: #f59e0b;">${eventDate}</td></tr>
                        <tr><td style="padding: 4px 0; color: #94a3b8;">Venue Address:</td><td style="line-height: 1.5;">${venue}</td></tr>
                      </table>
                    </div>

                    <!-- WhatsApp CTA Card -->
                    <div style="background-color: #064e3b; border: 1px solid #059669; border-radius: 12px; padding: 22px; text-align: center; margin-bottom: 24px;">
                      <h3 style="color: #34d399; margin: 0 0 8px 0; font-size: 16px;">📲 Join Official Participant WhatsApp Group</h3>
                      <p style="color: #a7f3d0; font-size: 13px; margin: 0 0 16px 0; line-height: 1.5;">
                        All important announcements, event schedules, problem statement releases, and venue support will be posted strictly in this group.
                      </p>
                      <a href="${whatsappUrl}" style="background-color: #10b981; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
                        👉 Join WhatsApp Group Now
                      </a>
                    </div>

                    <!-- Organizer Contact Details -->
                    <div style="background-color: #1e293b; border-radius: 12px; padding: 18px; font-size: 12px; color: #cbd5e1;">
                      <h4 style="color: #94a3b8; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase;">
                        📞 Organizer Contact Information
                      </h4>
                      <p style="margin: 3px 0;"><strong>Official Email:</strong> <a href="mailto:${organizerEmail}" style="color: #38bdf8; text-decoration: none;">${organizerEmail}</a></p>
                      <p style="margin: 3px 0;"><strong>Student Coordinators:</strong> +91 98401 23456 | +91 97910 65432</p>
                      <p style="margin: 3px 0;"><strong>College:</strong> Aalim Muhammed Salegh College of Engineering, Avadi, Chennai</p>
                    </div>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #070a12; border-top: 1px solid #1e293b; padding: 20px; text-align: center; color: #64748b; font-size: 12px;">
                    <p style="margin: 0 0 4px 0;">Thank you for registering. Please present your Registration ID (<strong>${registrationId || "N/A"}</strong>) at the venue counter.</p>
                    <p style="margin: 0;"><strong>AMS Hackathon 2026 Committee</strong> • Department of Computer Science & Engineering</p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
      </html>
    `;

    const textBody = `AMS HACKATHON 2026 - REGISTRATION CONFIRMED 🎉

Dear ${leaderName || "Team Leader"},

Your registration for AMS Hackathon 2026 has been successfully verified!

============================================================
REGISTRATION DETAILS
============================================================
Registration ID   : ${registrationId || "N/A"}
Team Name         : ${teamName || "N/A"}
Team Leader       : ${leaderName || "N/A"}
College Name      : ${college || "N/A"}
Amount Paid       : ₹${amount || 400} INR (PAID)
Transaction ID    : ${paymentId || "N/A"}
Event Date        : ${eventDate}
Venue Address     : ${venue}

============================================================
WHATSAPP GROUP LINK
============================================================
${whatsappUrl}

============================================================
ORGANIZER CONTACT DETAILS
============================================================
Email   : ${organizerEmail}
Phone   : +91 98401 23456 | +91 97910 65432
College : Aalim Muhammed Salegh College of Engineering, Avadi, Chennai

Regards,
AMS Hackathon 2026 Committee`;

    const transporter = getTransporter();
    if (transporter) {
      const info = await transporter.sendMail({
        from: `"AMS Hackathon 2026" <${organizerEmail}>`,
        to: toEmail,
        subject,
        text: textBody,
        html: htmlBody,
      });

      // Mark in memory cache to prevent duplicate sends
      sentParticipantConfirmations.add(dedupKey);

      console.log(`[${new Date().toISOString()}] [PARTICIPANT_CONFIRM_SUCCESS] Confirmation email delivered to leader ${toEmail} (RegID ${registrationId}). Response: ${info.response}`);
    }

    return true;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Non-blocking notice - Error sending participant confirmation email:`, error.message);
    return false;
  }
};

/**
 * Send Contact Form Message to Organizer
 */
export const sendContactMessageEmail = async ({ name, email, subject, message }) => {
  try {
    const organizerEmail = process.env.ORGANIZER_NOTIFICATION_EMAIL || process.env.ORGANIZER_EMAIL || process.env.SMTP_USER || process.env.EMAIL_USER || "coordinatoramshackathon@gmail.com";
    const mailSubject = `📩 NEW INQUIRY: ${subject || "General Query"} (From ${name})`;

    const textBody = `New Participant Inquiry Received:

Participant Name : ${name}
Participant Email: ${email}
Query Category   : ${subject}

Message:
------------------------------------------------------------
${message}
------------------------------------------------------------`;

    const htmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #050816; color: #e2e8f0; padding: 28px; border-radius: 16px; border: 1px solid #334155;">
        <div style="border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 20px;">
          <span style="background-color: #06b6d4; color: #000; font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 6px; text-transform: uppercase;">Participant Query</span>
          <h2 style="color: #ffffff; font-size: 20px; margin: 12px 0 4px 0;">${subject || "General Inquiry"}</h2>
        </div>
        <div style="background-color: #0f172a; padding: 18px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message}</p>
        </div>
      </div>
    `;

    const transporter = getTransporter();
    if (transporter) {
      const smtpUser = process.env.SMTP_USER || "coordinatoramshackathon@gmail.com";
      await transporter.sendMail({
        from: `"AMS Hackathon Contact Desk" <${smtpUser}>`,
        to: organizerEmail,
        replyTo: email,
        subject: mailSubject,
        text: textBody,
        html: htmlBody,
      });
      console.log(`[${new Date().toISOString()}] ✅ Contact inquiry email delivered to organizer.`);
    }
    return true;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Non-blocking notice - Contact email error:`, error.message);
    return false;
  }
};

/**
 * AUTOMATIC ORGANIZER NOTIFICATION SYSTEM
 * Sends a detailed HTML notification email to the hackathon organizer whenever
 * a participant successfully completes payment & registration.
 */
export const sendOrganizerNotificationEmail = async ({
  registrationId,
  teamName,
  leaderName,
  email,
  phone,
  college,
  department,
  year,
  theme,
  problemTitle,
  problemAbstract,
  referralCode,
  teamMembers = [],
  amountPaid,
  paymentId,
  orderId,
  registrationTime = new Date(),
}) => {
  const notifKey = `${paymentId || registrationId}`;

  // 1. Duplicate Notification Check
  if (sentOrganizerNotifications.has(notifKey)) {
    console.log(`[${new Date().toISOString()}] [ORGANIZER_NOTIF_SKIP] Duplicate notification suppressed for PaymentID/RegID: ${notifKey}`);
    return true;
  }

  const organizerEmail = process.env.ORGANIZER_NOTIFICATION_EMAIL || process.env.ORGANIZER_EMAIL || process.env.SMTP_USER || process.env.EMAIL_USER || "coordinatoramshackathon@gmail.com";
  const formattedTime = new Date(registrationTime).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "medium",
  });

  const subject = `🚀 NEW REGISTRATION: Team "${teamName || "Hackathon Team"}" (${registrationId}) - ₹${amountPaid || 0}`;

  // Format team members into an HTML table
  const membersHtmlRows = Array.isArray(teamMembers) && teamMembers.length > 0
    ? teamMembers.map((m, idx) => `
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 8px; color: #94a3b8; font-weight: bold;">${idx + 1}.</td>
          <td style="padding: 8px; color: #f8fafc; font-weight: bold;">${m.name || "N/A"}</td>
          <td style="padding: 8px; color: #38bdf8;"><a href="mailto:${m.email}" style="color: #38bdf8; text-decoration: none;">${m.email || "N/A"}</a></td>
          <td style="padding: 8px; color: #cbd5e1;">${m.phone || "N/A"}</td>
          <td style="padding: 8px; color: #f59e0b;"><span style="background-color: #334155; color: #fbbf24; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${m.role || "Developer"}</span></td>
        </tr>
      `).join("")
    : `<tr><td colspan="5" style="padding: 12px; text-align: center; color: #94a3b8;">Leader only / No additional members listed</td></tr>`;

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 680px; margin: 0 auto; background-color: #0b0f19; color: #e2e8f0; padding: 32px; border-radius: 16px; border: 1px solid #1e293b;">
      <div style="border-bottom: 2px solid #06b6d4; padding-bottom: 20px; margin-bottom: 24px; text-align: center;">
        <span style="background-color: #10b981; color: #000000; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 20px; text-transform: uppercase;">NEW VERIFIED REGISTRATION</span>
        <h1 style="color: #ffffff; font-size: 24px; margin: 12px 0 4px 0; font-weight: 800;">AMS HACKATHON 2026</h1>
      </div>
      <div style="background-color: #151d30; padding: 20px; border-radius: 12px; border: 1px solid #334155; margin-bottom: 24px;">
        <h3 style="color: #f59e0b; margin-top: 0; font-size: 15px; border-bottom: 1px solid #334155; padding-bottom: 10px;">📋 Team & Leader Overview</h3>
        <table style="width: 100%; font-size: 13px; color: #e2e8f0; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #94a3b8; width: 150px;">Registration ID:</td><td style="font-weight: bold; color: #06b6d4;">${registrationId || "N/A"}</td></tr>
          <tr><td style="padding: 6px 0; color: #94a3b8;">Team Name:</td><td style="font-weight: bold; color: #ffffff;">${teamName || "N/A"}</td></tr>
          <tr><td style="padding: 6px 0; color: #94a3b8;">Team Leader:</td><td style="font-weight: bold; color: #38bdf8;">${leaderName || "N/A"}</td></tr>
          <tr><td style="padding: 6px 0; color: #94a3b8;">Leader Email:</td><td>${email || "N/A"}</td></tr>
          <tr><td style="padding: 6px 0; color: #94a3b8;">Leader Phone:</td><td style="font-weight: bold; color: #facc15;">${phone || "N/A"}</td></tr>
          <tr><td style="padding: 6px 0; color: #94a3b8;">College:</td><td>${college || "N/A"}</td></tr>
          <tr><td style="padding: 6px 0; color: #94a3b8;">Department & Year:</td><td>${department || "N/A"} (${year || "3rd Year"})</td></tr>
          <tr><td style="padding: 6px 0; color: #94a3b8;">Innovation Track:</td><td style="color: #c084fc; font-weight: bold;">${theme || "Open Innovation"}</td></tr>
          <tr><td style="padding: 6px 0; color: #94a3b8;">Problem Title:</td><td style="color: #f8fafc;">${problemTitle || "AMS Hackathon Challenge"}</td></tr>
          ${problemAbstract ? `<tr><td style="padding: 6px 0; color: #94a3b8;">Problem Abstract:</td><td style="color: #cbd5e1; font-size: 12px;">${problemAbstract}</td></tr>` : ""}
          ${referralCode ? `<tr><td style="padding: 6px 0; color: #94a3b8;">Referral Code:</td><td style="color: #facc15; font-weight: bold;">${referralCode}</td></tr>` : ""}
          <tr><td style="padding: 6px 0; color: #94a3b8;">Amount Paid:</td><td style="color: #10b981; font-weight: bold;">₹${amountPaid || 0} INR (PAID)</td></tr>
          <tr><td style="padding: 6px 0; color: #94a3b8;">Payment ID:</td><td style="font-family: monospace;">${paymentId || "N/A"}</td></tr>
          <tr><td style="padding: 6px 0; color: #94a3b8;">Order ID:</td><td style="font-family: monospace;">${orderId || "N/A"}</td></tr>
        </table>
      </div>
      <div style="background-color: #151d30; padding: 20px; border-radius: 12px; border: 1px solid #334155; margin-bottom: 24px;">
        <h3 style="color: #38bdf8; margin-top: 0; font-size: 15px; border-bottom: 1px solid #334155; padding-bottom: 10px;">👥 Team Roster</h3>
        <table style="width: 100%; font-size: 12px; color: #e2e8f0; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 1px solid #334155; color: #94a3b8;">
              <th style="padding: 8px;">#</th><th style="padding: 8px;">Name</th><th style="padding: 8px;">Email</th><th style="padding: 8px;">Phone</th><th style="padding: 8px;">Role</th>
            </tr>
          </thead>
          <tbody>${membersHtmlRows}</tbody>
        </table>
      </div>
    </div>
  `;

  const textBody = `NEW VERIFIED REGISTRATION - AMS HACKATHON 2026
Registration ID : ${registrationId}
Team Name       : ${teamName}
Leader          : ${leaderName}
Email           : ${email}
Phone           : ${phone}
College         : ${college}
Amount Paid     : ₹${amountPaid} INR
Payment ID      : ${paymentId}
Order ID        : ${orderId}
Timestamp       : ${formattedTime}`;

  const maxAttempts = 3;
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt++;
    try {
      console.log(`[${new Date().toISOString()}] [ORGANIZER_NOTIF_ATTEMPT] Sending email to ${organizerEmail} for RegID ${registrationId} (Attempt ${attempt}/${maxAttempts})...`);

      const transporter = getTransporter();
      if (!transporter) {
        return false;
      }

      const smtpUser = process.env.SMTP_USER || "coordinatoramshackathon@gmail.com";
      const info = await transporter.sendMail({
        from: `"AMS Hackathon System" <${smtpUser}>`,
        to: organizerEmail,
        replyTo: email,
        subject,
        text: textBody,
        html: htmlBody,
      });

      sentOrganizerNotifications.add(notifKey);
      console.log(`[${new Date().toISOString()}] [ORGANIZER_NOTIF_SUCCESS] Email delivered to organizer (${organizerEmail}). Response: ${info.response}`);
      return true;
    } catch (err) {
      console.error(`[${new Date().toISOString()}] [ORGANIZER_NOTIF_RETRY] Attempt ${attempt} failed: ${err.message}`);
      if (attempt >= maxAttempts) return false;
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }

  return false;
};

/**
 * Send Hardware Problem Statements Release Notification Email
 * Broadcasts to registered team leaders that hardware PS are now live.
 * Returns true on successful SMTP delivery (single attempt per recipient).
 */
export const sendHardwarePSReleaseEmail = async ({ toEmail, leaderName, teamName, registrationId }) => {
  try {
    if (!toEmail) {
      console.warn(`[${new Date().toISOString()}] ⚠️ PS-RELEASE notice: No recipient email provided.`);
      return false;
    }

    const subject = "🚀 AMS HACKATHON 2026 | Hardware Problem Statements Are Live!";
    const siteUrl = "https://ams-hackathon.site/hardware-problems";

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hardware Problem Statements Released</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #050814; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
          <tr>
            <td align="center" style="padding: 20px 10px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #0b0f19; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden;">
                <tr>
                  <td style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%); padding: 32px 24px; text-align: center;">
                    <div style="background-color: rgba(0, 0, 0, 0.25); display: inline-block; padding: 6px 16px; border-radius: 20px; color: #ffffff; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                      PROBLEM STATEMENTS RELEASED
                    </div>
                    <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; margin: 0;">AMS HACKATHON 2026</h1>
                    <p style="color: #e0f2fe; font-size: 14px; margin: 6px 0 0 0; font-weight: 500;">Hardware Innovation Track Challenges Are Live</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 28px 24px;">
                    <p style="font-size: 16px; color: #ffffff; margin-top: 0;">
                      Dear <strong>${leaderName || "Team Leader"}</strong>,
                    </p>
                    <p style="color: #cbd5e1; font-size: 14px; line-height: 1.7;">
                      Your team <strong style="color: #38bdf8;">"${teamName || "N/A"}"</strong>${registrationId ? ` (Registration ID: <span style="font-family: monospace; color: #facc15;">${registrationId}</span>)` : ""} is registered for AMS HACKATHON 2026!
                    </p>
                    <p style="color: #cbd5e1; font-size: 14px; line-height: 1.7;">
                      The <strong style="color: #ffffff;">Hardware Problem Statements</strong> are now officially released. Choose your track, pick your challenge, and start planning your build before the event begins.
                    </p>
                    <div style="text-align: center; margin: 28px 0;">
                      <a href="${siteUrl}" style="background: linear-gradient(135deg, #06b6d4, #3b82f6); color: #ffffff; padding: 14px 32px; border-radius: 12px; font-size: 14px; font-weight: 800; text-decoration: none; display: inline-block;">
                        View Hardware Problem Statements
                      </a>
                    </div>
                    <p style="color: #94a3b8; font-size: 12px; line-height: 1.6;">
                      💡 Remember: Software problem statements will be revealed on-spot at the event opening. Hardware statements are released early so your team can source components in advance.
                    </p>
                    <div style="background-color: #151d30; padding: 16px; border-radius: 12px; border: 1px solid #334155; margin-top: 20px;">
                      <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                        Event: 22–23 August 2026, 9:00 AM IST · Aalim Muhammed Salegh College of Engineering, Chennai
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 24px; border-top: 1px solid #1e293b; text-align: center; color: #64748b; font-size: 11px;">
                    AMS HACKATHON 2026 · 24 Hours. Infinite Possibilities.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const textBody = `HARDWARE PROBLEM STATEMENTS RELEASED - AMS HACKATHON 2026
Dear ${leaderName || "Team Leader"},
The Hardware Problem Statements are now live. View them at: ${siteUrl}
Registration ID: ${registrationId || "N/A"}
Team: ${teamName || "N/A"}
Event: 22-23 August 2026, 9:00 AM IST`;

    const transporter = getTransporter();
    if (!transporter) {
      console.warn(`[${new Date().toISOString()}] ⚠️ PS-RELEASE: SMTP not configured (SMTP_USER/SMTP_PASS missing).`);
      return false;
    }

    const smtpUser = process.env.SMTP_USER || "coordinatoramshackathon@gmail.com";
    const info = await transporter.sendMail({
      from: `"AMS Hackathon System" <${smtpUser}>`,
      to: toEmail,
      subject,
      text: textBody,
      html: htmlBody,
    });

    console.log(`[${new Date().toISOString()}] [PS_RELEASE_SUCCESS] Email delivered to ${toEmail}. Response: ${info.response}`);
    return true;
  } catch (err) {
    console.error(`[${new Date().toISOString()}] [PS_RELEASE_ERROR] Failed to send to ${toEmail}: ${err.message}`);
    return false;
  }
};

/**
 * Send Hardware Problem Statements "Be Ready" Heads-Up Email
 * Pre-release notice to registered team leaders: statements reveal at 11:01 AM
 * IST on Aug 19 — prepare your team to view them.
 */
export const sendHardwarePSHeadsUpEmail = async ({ toEmail, leaderName, teamName, registrationId }) => {
  try {
    if (!toEmail) {
      console.warn(`[${new Date().toISOString()}] ⚠️ PS-HEADSUP notice: No recipient email provided.`);
      return false;
    }

    const subject = "📣 AMS HACKATHON 2026 | Get Ready — Hardware Problem Statements Reveal Today at 11:01 AM IST!";
    const siteUrl = "https://ams-hackathon.site/hardware-problems";

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hardware Problem Statements — Get Ready</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #050814; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
          <tr>
            <td align="center" style="padding: 20px 10px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #0b0f19; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden;">
                <tr>
                  <td style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%); padding: 32px 24px; text-align: center;">
                    <div style="background-color: rgba(0, 0, 0, 0.25); display: inline-block; padding: 6px 16px; border-radius: 20px; color: #ffffff; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                      GET READY
                    </div>
                    <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; margin: 0;">AMS HACKATHON 2026</h1>
                    <p style="color: #fef3c7; font-size: 14px; margin: 6px 0 0 0; font-weight: 600;">
                      Hardware Problem Statements Reveal on Aug 19, 11:01 AM IST
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 28px 24px;">
                    <p style="font-size: 16px; color: #ffffff; margin-top: 0;">
                      Dear <strong>${leaderName || "Team Leader"}</strong>,
                    </p>
                    <p style="color: #cbd5e1; font-size: 14px; line-height: 1.7;">
                      Your team <strong style="color: #fbbf24;">"${teamName || "N/A"}"</strong>${registrationId ? ` (Registration ID: <span style="font-family: monospace; color: #facc15;">${registrationId}</span>)` : ""} is registered for AMS HACKATHON 2026!
                    </p>
                    <p style="color: #cbd5e1; font-size: 14px; line-height: 1.7;">
                      <strong style="color: #ffffff;">Get ready!</strong> The official <strong style="color: #ffffff;">Hardware Problem Statements</strong> will be revealed <strong style="color: #fbbf24;">today, 19 August 2026 at 11:01 AM IST</strong>.
                    </p>
                    <div style="background-color: #151d30; padding: 16px; border-radius: 12px; border: 1px solid #334155; margin: 20px 0;">
                      <p style="margin: 0; color: #e2e8f0; font-size: 14px;">
                        ⏰ <strong style="color: #fbbf24;">11:01 AM IST — Aug 19, 2026</strong>
                      </p>
                      <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 12px;">
                        The countdown is live on the website. When it ends, the statements unlock automatically — no passcode needed.
                      </p>
                    </div>
                    <div style="text-align: center; margin: 24px 0;">
                      <a href="${siteUrl}" style="background: linear-gradient(135deg, #f59e0b, #f97316); color: #ffffff; padding: 14px 32px; border-radius: 12px; font-size: 14px; font-weight: 800; text-decoration: none; display: inline-block;">
                        Watch the Countdown
                      </a>
                    </div>
                    <p style="color: #94a3b8; font-size: 12px; line-height: 1.6;">
                      💡 Hardware statements release early so your team can source components in advance. Software problem statements will be revealed on-spot at the event opening (Aug 22).
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 24px; border-top: 1px solid #1e293b; text-align: center; color: #64748b; font-size: 11px;">
                    AMS HACKATHON 2026 · 24 Hours. Infinite Possibilities.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const textBody = `GET READY - AMS HACKATHON 2026
Dear ${leaderName || "Team Leader"},
The official Hardware Problem Statements will be revealed on 19 August 2026 at 11:01 AM IST.
Watch the countdown at: ${siteUrl}
Registration ID: ${registrationId || "N/A"}
Team: ${teamName || "N/A"}
Software PS will be revealed on-spot at the event opening (Aug 22).`;

    const transporter = getTransporter();
    if (!transporter) {
      console.warn(`[${new Date().toISOString()}] ⚠️ PS-HEADSUP: SMTP not configured (SMTP_USER/SMTP_PASS missing).`);
      return false;
    }

    const smtpUser = process.env.SMTP_USER || "coordinatoramshackathon@gmail.com";
    const info = await transporter.sendMail({
      from: `"AMS Hackathon System" <${smtpUser}>`,
      to: toEmail,
      subject,
      text: textBody,
      html: htmlBody,
    });

    console.log(`[${new Date().toISOString()}] [PS_HEADSUP_SUCCESS] Email delivered to ${toEmail}. Response: ${info.response}`);
    return true;
  } catch (err) {
    console.error(`[${new Date().toISOString()}] [PS_HEADSUP_ERROR] Failed to send to ${toEmail}: ${err.message}`);
    return false;
  }
};
