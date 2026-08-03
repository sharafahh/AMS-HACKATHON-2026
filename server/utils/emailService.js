import nodemailer from "nodemailer";

export const sendConfirmationEmail = async ({
  toEmail,
  teamName,
  registrationId,
  paymentId,
  amount,
  track,
  college,
}) => {
  try {
    // Transporter configuration (test transport / log output)
    console.log(`
============================================================
📧 SIMULATED EMAIL CONFIRMATION DISPATCHED
To: ${toEmail}
Subject: Registration Confirmed - AMS HACKATHON 2026 (${registrationId})
Body:
Dear ${teamName} Team Leader,

Congratulations! Your team registration for AMS HACKATHON 2026 has been successfully confirmed.

Registration ID: ${registrationId}
Payment ID: ${paymentId}
Amount Paid: ₹${amount}
Innovation Track: ${track}
College: ${college}
Venue: Aalim Muhammed Salegh College of Engineering, Chennai
Event Dates: September 15–16, 2026

Welcome to AMS HACKATHON 2026!
============================================================
    `);
    return true;
  } catch (error) {
    console.error("Error sending confirmation email:", error.message);
    return false;
  }
};
