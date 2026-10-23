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
    endpointHitCounts,
  });
});

module.exports = { router, endpointHitCounts };
