const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

async function generateTicketPDF(booking) {

  const ticketsDir = path.join(__dirname, "../tickets");

  if (!fs.existsSync(ticketsDir)) {
    fs.mkdirSync(ticketsDir);
  }

  const filePath = path.join(
    ticketsDir,
    `ticket-${booking.ticketNumber}.pdf`
  );

  const doc = new PDFDocument({
    size: "A4",
    margin: 50
  });

  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // ===== HEADER =====
  doc
    .fontSize(24)
    .fillColor("#d32f2f")
    .text("HriKri Bus Ticket", { align: "center" });

  doc.moveDown(1);

  doc
    .fontSize(14)
    .fillColor("black")
    .text(`Ticket Number: ${booking.ticketNumber}`);

  doc.text(`Bus: ${booking.busName || booking.busId?.name}`);

  doc.text(`Travel Date: ${booking.travelDate}`);

  doc.text(`Seats: ${booking.seats.join(", ")}`);

  doc.text(`Amount Paid: ₹${booking.totalAmount}`);

  doc.moveDown();

  doc.text(`Passenger Email: ${booking.contact.email}`);

  doc.text(`Passenger Phone: ${booking.contact.phone}`);

  doc.moveDown(2);

  // ===== QR DATA =====
  const qrData = JSON.stringify({
    ticketNumber: booking.ticketNumber,
    bus: booking.busName || booking.busId?.name,
    seats: booking.seats,
    date: booking.travelDate
  });

  const qrImage = await QRCode.toDataURL(qrData);

  const base64Data = qrImage.replace(/^data:image\/png;base64,/, "");
  const qrBuffer = Buffer.from(base64Data, "base64");

  // ===== QR IMAGE =====
  doc.image(qrBuffer, {
    fit: [150, 150],
    align: "center"
  });

  doc.moveDown();

  doc
    .fontSize(10)
    .fillColor("gray")
    .text("Scan this QR code to verify ticket", {
      align: "center"
    });

  doc.moveDown(2);

  // ===== FOOTER =====
  doc
    .fontSize(12)
    .fillColor("black")
    .text("Thank you for choosing HriKri Bus!", {
      align: "center"
    });

  doc.end();

  return new Promise((resolve) => {
    stream.on("finish", () => resolve(filePath));
  });
}

module.exports = generateTicketPDF;