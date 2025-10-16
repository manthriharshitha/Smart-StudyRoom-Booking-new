// Simple notification stub; replace with real email service (e.g., nodemailer)
async function sendNotification({ to, subject, message }) {
  // eslint-disable-next-line no-console
  console.log(`[Notify] To: ${to} | ${subject} -> ${message}`);
}

module.exports = { sendNotification };


