const jwt = require('jsonwebtoken');

function auth(requiredRoles = []) {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.substring(7) : null;
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
      req.user = payload;
      if (requiredRoles.length && !requiredRoles.includes(payload.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

module.exports = { auth };


