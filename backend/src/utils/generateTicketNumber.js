const crypto = require("crypto");

module.exports = function generateTicketNumber() {
  const datePart = new Date()
    .toISOString()
    .slice(2, 10)        // YY-MM-DD
    .replace(/-/g, "");

  const randomPart = crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase();     // 6 chars

  return `HB-${datePart}-${randomPart}`;
};