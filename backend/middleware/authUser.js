// auth.middleware.js
import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
  try {
    // accept Authorization Bearer, or a raw token header named 'token'
    const authHeader = req.headers.authorization || req.headers['token'] 

    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Not authorized — missing token' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized — token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("TOKEN RECEIVED:", authHeader);
console.log("DECODED:", decoded);

    // Put user id on req.user (do NOT mutate req.body)
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message || 'Authentication failed' });
  }
};

export default authUser;