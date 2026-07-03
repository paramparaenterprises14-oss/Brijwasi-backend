const jwt = require('jsonwebtoken');

// Check karo user logged in hai (valid token hai)
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, data: null, message: 'No token provided, access denied' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { userId, role } request ke saath attach kar diya

    next(); // sab theek hai, aage badho
  } catch (error) {
    return res.status(401).json({ success: false, data: null, message: 'Invalid or expired token' });
  }
};

// Check karo user admin hai
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, data: null, message: 'Access denied, admin only' });
  }
};

module.exports = { protect, adminOnly };