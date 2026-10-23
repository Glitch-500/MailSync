require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  emailService: process.env.EMAIL_SERVICE || "gmail",
  emailUser: process.env.EMAIL_USER || "",
  emailPassword: process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS || "",
  emailFrom: process.env.EMAIL_FROM || (process.env.EMAIL_USER ? `"MailSync" <${process.env.EMAIL_USER}>` : '"MailSync" <noreply@mailsync.com>'),
  accessKey: process.env.ACCESS_KEY || process.env.API_KEY || "",
};
