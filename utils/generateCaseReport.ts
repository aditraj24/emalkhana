import jsPDF from "jspdf";
import "jspdf-autotable";

export function generateCaseReport(data: any) {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("e-Malkhana Case Report", 14, 15);

  let y = 25;

  for (const p of data.properties) {
    doc.text(`Property: ${p.category} (${p.nature})`, 14, y);

    // ADD QR IMAGE
    if (p.qrCode) {
      doc.addImage(p.qrCode, "PNG", 150, y - 10, 30, 30);
    }

    y += 40;
  }

  doc.save(`case-report-${data.case.crimeNumber}.pdf`);
}
