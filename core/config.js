require("dotenv").config();

const emailUser = process.env.EMAIL_USER || "";
const fromName = process.env.FROM_NAME || "MailSync";
const emailFrom =
  process.env.EMAIL_FROM ||
  (emailUser ? `"${fromName}" <${emailUser}>` : `"${fromName}" <noreply@mailsync.com>`);

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  emailService: process.env.EMAIL_SERVICE || "gmail",
  emailUser,
  emailPassword: process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS || "",
  fromName,
  emailFrom,
  accessKey: process.env.ACCESS_KEY || process.env.API_KEY || "",
};
