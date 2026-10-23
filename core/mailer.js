const nodemailer = require("nodemailer");
const config = require("./config");
const logger = require("./logger");

/**
 * Creates and returns the nodemailer transporter using configured credentials
 */
function getTransporter() {
  if (!config.emailUser || !config.emailPassword) {
    logger.warn("EMAIL_USER or EMAIL_PASSWORD is not set in environment variables.");
  }

  return nodemailer.createTransport({
    service: config.emailService,
    auth: {
      user: config.emailUser,
      pass: config.emailPassword,
    },
  });
}

/**
 * Standard MailSync Open-Source Project Watermark Badge HTML
 */
const WATERMARK_HTML = `
  <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
    <a href="https://github.com/Harshit-Maurya838/MailSync" target="_blank" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; font-size: 11.5px; font-weight: 600; color: #475569; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 1px 2px rgba(0,0,0,0.04);">
      Powered by <span style="color: #6366f1; font-weight: 700; text-decoration: underline;">MailSync</span> &bull; ⭐ Support by starring on GitHub
    </a>
  </div>
`;

/**
 * Appends the MailSync open-source watermark to custom HTML content
 */
function injectWatermark(html) {
  if (!html) return "";
  if (html.includes("MailSync</span> &bull; ⭐ Support by starring on GitHub") || html.includes("MailSync</span> &bull; Open Source Project")) {
    return html; // Already contains watermark
  }

  if (html.includes("</body>")) {
    return html.replace("</body>", `${WATERMARK_HTML}</body>`);
  }
  return `${html}${WATERMARK_HTML}`;
}

/**
 * Generates a clean, modern HTML wrapper for email messages with MailSync watermark
 */
function buildHtmlMessage({ name, message, subject }) {
  const greeting = name
    ? `<p style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 16px 0;">Hello ${escapeHtml(name)},</p>`
    : "";
  const formattedText = escapeHtml(message)
    .split("\n\n")
    .map((p) => `<p style="font-size: 15px; line-height: 1.6; color: #374151; margin: 0 0 16px 0;">${p.replace(/\n/g, "<br>")}</p>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 24px 30px; text-align: left;">
              <h1 style="margin: 0; font-size: 18px; color: #ffffff; font-weight: 600; letter-spacing: -0.01em;">${escapeHtml(subject)}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 32px 30px;">
              ${greeting}
              ${formattedText}
            </td>
          </tr>
          <!-- Footer with Watermark -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; border-top: 1px solid #f3f4f6; text-align: center;">
              <a href="https://github.com/Harshit-Maurya838/MailSync" target="_blank" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; font-size: 11.5px; font-weight: 600; color: #475569; text-decoration: none; box-shadow: 0 1px 2px rgba(0,0,0,0.04);">
                Powered by <span style="color: #6366f1; font-weight: 700; text-decoration: underline;">MailSync</span> &bull; ⭐ Support by starring on GitHub
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Resolves the "from" header based on custom from, fromName, or environment default
 */
function resolveFromAddress({ from, fromName }) {
  if (from) {
    return from;
  }
  if (fromName) {
    const userEmail = config.emailUser || "noreply@mailsync.com";
    return `"${fromName.trim()}" <${userEmail}>`;
  }
  return config.emailFrom;
}

/**
 * Sends an email using Nodemailer
 * @param {Object} options
 * @param {string} options.email - Target recipient email
 * @param {string} [options.to] - Target recipient email (alias for email)
 * @param {string} [options.name] - Recipient name
 * @param {string} [options.fromName] - Custom sender name (e.g. "Acme Support")
 * @param {string} [options.from] - Optional full sender header string
 * @param {string} [options.subject] - Email subject line
 * @param {string} options.message - Email message content
 * @param {string} [options.html] - Optional custom HTML string
 */
async function sendMail({ email, to, name, fromName, from, subject, message, html }) {
  const recipient = email || to;
  if (!recipient) {
    throw new Error("Recipient email is required ('email' or 'to')");
  }

  const finalSubject = subject || "New Notification from MailSync";
  const finalFrom = resolveFromAddress({ from, fromName });

  // Prepare HTML with watermark
  let finalHtml = "";
  if (html) {
    finalHtml = injectWatermark(html);
  } else {
    finalHtml = buildHtmlMessage({ name, message: message || "", subject: finalSubject });
  }

  // Plaintext version with watermark signature
  const textWatermark = "\n\n---\n Powered by MailSync • Open Source Email Project";
  const finalText = (message || "") + textWatermark;

  const mailOptions = {
    from: finalFrom,
    to: recipient,
    subject: finalSubject,
    text: finalText,
    html: finalHtml,
  };

  const transporter = getTransporter();
  const info = await transporter.sendMail(mailOptions);
  return info;
}

/**
 * Verifies Nodemailer transporter connection
 */
async function verifyTransporter() {
  const transporter = getTransporter();
  return await transporter.verify();
}

module.exports = {
  sendMail,
  verifyTransporter,
  getTransporter,
  resolveFromAddress,
  injectWatermark,
};
