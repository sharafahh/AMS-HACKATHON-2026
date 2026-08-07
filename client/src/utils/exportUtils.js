import { REGISTRATION_FEE_PER_PERSON } from "../constants/fee";

/**
 * Format registration dataset for export with complete Registration, Payment, and Team Member details.
 * @param {Array} teamsList
 * @returns {Array} Formatted flat objects
 */
export const formatRegistrationsForExport = (teamsList = []) => {
  return teamsList.map((t) => {
    const numMembers = t.teamSize || (Array.isArray(t.members) ? t.members.length : 4);
    const amountPaid = numMembers * REGISTRATION_FEE_PER_PERSON;
    const formattedDate = new Date(t.createdAt || t.registrationDate || Date.now()).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    // Format Team Members into readable string
    const membersListStr = Array.isArray(t.members) && t.members.length > 0
      ? t.members.map((m, i) => `${i + 1}. ${m.name || "N/A"} (${m.role || "Member"}) - ${m.email || "N/A"} | ${m.phone || "N/A"}`).join(" ; ")
      : `${t.leader?.name || "Leader"} (${t.leader?.email || "N/A"})`;

    return {
      "Registration ID": t.registrationId || "N/A",
      "Team Name": t.teamName || "N/A",
      "Team Size": numMembers,
      "Team Leader Name": t.leader?.name || "N/A",
      "Team Leader Email": t.leader?.email || "N/A",
      "Team Leader Phone": t.leader?.phone || "N/A",
      "College Name": t.leader?.college || "N/A",
      "Department": t.leader?.department || "N/A",
      "Academic Year": t.leader?.year || "3rd Year",
      "Innovation Track / Theme": t.track || "Open Innovation",
      "Problem Statement Title": t.problemTitle || "N/A",
      "Problem Abstract": t.problemAbstract || "N/A",
      "Referral Code": t.referralCode || "N/A",
      "Payment Status": t.paymentStatus || "PAID",
      "Amount Paid (INR)": `₹${amountPaid}`,
      "Razorpay Order ID": t.razorpayOrderId || "N/A",
      "Razorpay Payment ID": t.razorpayPaymentId || "N/A",
      "Registration Timestamp": formattedDate,
      "Team Members Roster": membersListStr,
    };
  });
};

/**
 * Trigger browser file download
 */
const downloadFile = (content, fileName, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * EXPORT TO CSV (.csv)
 */
export const exportToCSV = (teamsList, fileName = `AMS_Hackathon_Registrations_${Date.now()}.csv`) => {
  const formattedData = formatRegistrationsForExport(teamsList);
  if (formattedData.length === 0) return alert("No registrations selected for export.");

  const headers = Object.keys(formattedData[0]);

  const escapeCSVVal = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows = [
    headers.map(escapeCSVVal).join(","),
    ...formattedData.map((row) => headers.map((field) => escapeCSVVal(row[field])).join(",")),
  ];

  const csvString = "\uFEFF" + csvRows.join("\n"); // UTF-8 BOM for Excel compatibility
  downloadFile(csvString, fileName, "text/csv;charset=utf-8;");
};

/**
 * EXPORT TO JSON (.json)
 */
export const exportToJSON = (teamsList, fileName = `AMS_Hackathon_Registrations_${Date.now()}.json`) => {
  const formattedData = formatRegistrationsForExport(teamsList);
  if (formattedData.length === 0) return alert("No registrations selected for export.");

  const jsonString = JSON.stringify(formattedData, null, 2);
  downloadFile(jsonString, fileName, "application/json;charset=utf-8;");
};

/**
 * EXPORT TO EXCEL (.xlsx)
 */
export const exportToExcel = async (teamsList, fileName = `AMS_Hackathon_Registrations_${Date.now()}.xlsx`) => {
  const formattedData = formatRegistrationsForExport(teamsList);
  if (formattedData.length === 0) return alert("No registrations selected for export.");

  try {
    const XLSX = await import("xlsx");
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Auto-fit column widths
    const colWidths = Object.keys(formattedData[0]).map((key) => ({
      wch: Math.max(key.length, 18),
    }));
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, fileName);
  } catch (err) {
    console.warn("XLSX module fallback to CSV:", err.message);
    exportToCSV(teamsList, fileName.replace(".xlsx", ".csv"));
  }
};

/**
 * EXPORT TO PDF (.pdf)
 */
export const exportToPDF = async (teamsList, fileName = `AMS_Hackathon_Registrations_${Date.now()}.pdf`) => {
  const formattedData = formatRegistrationsForExport(teamsList);
  if (formattedData.length === 0) return alert("No registrations selected for export.");

  try {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

    // Document Header
    doc.setFillColor(11, 15, 25); // Dark blue header background
    doc.rect(0, 0, doc.internal.pageSize.width, 60, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(6, 182, 212); // Cyan accent
    doc.text("AMS HACKATHON 2026 - Participant Registrations Report", 40, 36);

    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated on: ${new Date().toLocaleString("en-IN")} | Total Records: ${teamsList.length}`, 40, 52);

    // Table Data
    const headers = [["Reg ID", "Team Name", "Leader Name", "Leader Email", "Phone", "College", "Theme", "Fee", "Status"]];
    const tableRows = teamsList.map((t) => [
      t.registrationId || "N/A",
      t.teamName || "N/A",
      t.leader?.name || "N/A",
      t.leader?.email || "N/A",
      t.leader?.phone || "N/A",
      t.leader?.college || "N/A",
      t.track || "N/A",
      `₹${(t.teamSize || 4) * REGISTRATION_FEE_PER_PERSON}`,
      t.paymentStatus || "PAID",
    ]);

    autoTable(doc, {
      head: headers,
      body: tableRows,
      startY: 75,
      theme: "grid",
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [56, 189, 248],
        fontSize: 9,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [226, 232, 240],
      },
      alternateRowStyles: {
        fillColor: [21, 29, 48],
      },
      margin: { top: 75, left: 20, right: 20, bottom: 30 },
    });

    doc.save(fileName);
  } catch (pdfErr) {
    console.warn("jsPDF fallback to print window:", pdfErr.message);

    // Print Window Fallback
    const printWin = window.open("", "_blank");
    if (!printWin) return alert("Popup blocker enabled. Please allow popups to export PDF.");

    const rowsHtml = formattedData.map((d) => `
      <tr>
        <td style="border: 1px solid #334155; padding: 6px; font-weight: bold; color: #06b6d4;">${d["Registration ID"]}</td>
        <td style="border: 1px solid #334155; padding: 6px;">${d["Team Name"]}</td>
        <td style="border: 1px solid #334155; padding: 6px;">${d["Team Leader Name"]}</td>
        <td style="border: 1px solid #334155; padding: 6px;">${d["Team Leader Email"]}</td>
        <td style="border: 1px solid #334155; padding: 6px;">${d["College Name"]}</td>
        <td style="border: 1px solid #334155; padding: 6px;">${d["Innovation Track / Theme"]}</td>
        <td style="border: 1px solid #334155; padding: 6px; font-weight: bold; color: #10b981;">${d["Amount Paid (INR)"]}</td>
        <td style="border: 1px solid #334155; padding: 6px;">${d["Payment Status"]}</td>
      </tr>
    `).join("");

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${fileName}</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; padding: 20px; }
          h1 { color: #06b6d4; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 20px; }
          th { background-color: #1e293b; color: #38bdf8; border: 1px solid #334155; padding: 8px; text-align: left; }
        </style>
      </head>
      <body>
        <h1>AMS HACKATHON 2026 - Registrations Report</h1>
        <p>Total Records: ${teamsList.length} | Exported: ${new Date().toLocaleString("en-IN")}</p>
        <table>
          <thead>
            <tr><th>Reg ID</th><th>Team Name</th><th>Leader</th><th>Email</th><th>College</th><th>Theme</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
        <script>window.print();</script>
      </body>
      </html>
    `);
    printWin.document.close();
  }
};
