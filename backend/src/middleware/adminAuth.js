/**
 * Simple API key-based admin authentication middleware.
 * In production, replace with a proper JWT or OAuth solution.
 */
const requireAdmin = (req, res, next) => {
  const apiKey = req.headers['x-admin-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'Admin API key is required. Provide it via the x-admin-api-key header.',
    });
  }

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({
      success: false,
      message: 'Invalid admin API key.',
    });
  }

  next();
};

module.exports = { requireAdmin };
