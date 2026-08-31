import jwt from 'jsonwebtoken'

// Verify JWT token and attach user data to request
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Invalid token format' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // Handle expired tokens separately
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired, please log in again' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Verify user has admin role
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// Verify user is an agent
function requireAgent(req, res, next) {
  if (req.user?.userType !== 'agent') {
    return res.status(403).json({ error: 'Agent access required' });
  }
  next();
}

// Verify user is a client
function requireClient(req, res, next) {
  if (req.user?.userType !== 'client') {
    return res.status(403).json({ error: 'Client access required' });
  }
  next();
}

export { requireAuth, requireAdmin, requireAgent, requireClient };