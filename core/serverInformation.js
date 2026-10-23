const express = require("express");
const router = express.Router();
const config = require("./config");

const serverStartTime = Date.now();
const endpointHitCounts = {
  mail: 0,
};

router.get("/", (req, res) => {
  const uptime = Math.floor((Date.now() - serverStartTime) / 1000);

  res.status(200).json({
    service: "MailSync API",
    version: "1.0.0",
    status: "healthy",
    uptime: `${uptime}s`,
    startTime: new Date(serverStartTime).toISOString(),
    currentTime: new Date().toISOString(),
    smtpConfigured: Boolean(config.emailUser && config.emailPassword),
    authRequired: Boolean(config.accessKey),
    emailService: config.emailService || "smtp",
    fromName: config.fromName,
    maskedUser: config.emailUser
      ? config.emailUser.replace(/(.{2})(.*)(@.*)/, "$1***$3")
      : null,
    endpointHitCounts,
  });
});

module.exports = { router, endpointHitCounts };
