const jwt = require('jsonwebtoken');
const SECRET = 'secret-test';

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function authorize(allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
