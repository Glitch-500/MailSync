const config = require("./config");

/**
 * Middleware to verify Access Key / API Key.
 * Checks header 'x-access-key', 'x-api-key', or 'Authorization: Bearer <token>'.
 * If ACCESS_KEY is not configured in environment, requests are permitted.
 */
function verifyApiKey(req, res, next) {
  if (!config.accessKey) {
    // If no access key configured, allow public access
    return next();
  }

  const headerKey =
    req.headers["x-access-key"] ||
    req.headers["x-api-key"] ||
    (req.headers["authorization"] && req.headers["authorization"].startsWith("Bearer ")
      ? req.headers["authorization"].slice(7).trim()
      : null);

  if (!headerKey || headerKey !== config.accessKey) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: "Invalid or missing Access Key. Pass it via 'x-access-key' header or Bearer token.",
    });
  }

  next();
}

module.exports = verifyApiKey;
