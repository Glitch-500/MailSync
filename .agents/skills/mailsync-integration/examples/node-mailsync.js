/**
 * MailSync Client Helper for Node.js / Express
 *
 * Requirements:
 * Add to your .env:
 *   MAILSYNC_API_URL=https://mailsync-sigma.vercel.app
 *   MAILSYNC_ACCESS_KEY=your-secret-access-key (optional)
 */

require("dotenv").config();

async function sendMail({ to, subject, message, html, name, fromName }) {
  const baseUrl = process.env.MAILSYNC_API_URL;
  if (!baseUrl) {
    throw new Error("Missing MAILSYNC_API_URL in environment");
  }

  const endpoint = `${baseUrl.replace(/\/+$/, "")}/mail`;
  const accessKey = process.env.MAILSYNC_ACCESS_KEY;

  const headers = {
    "Content-Type": "application/json",
  };
  if (accessKey) {
    headers["x-access-key"] = accessKey;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email: to,
      subject,
      message,
      html,
      name,
      fromName,
    }),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || result.details || `MailSync returned HTTP ${response.status}`);
  }

  return result;
}

module.exports = { sendMail };
