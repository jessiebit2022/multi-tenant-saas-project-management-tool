const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const tenantMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify tenant exists and user belongs to it
    const tenantQuery = `
      SELECT t.id, t.name, t.subdomain, tu.role
      FROM tenants t
      JOIN tenant_users tu ON t.id = tu.tenant_id
      WHERE t.id = $1 AND tu.user_id = $2 AND t.active = true
    `;
    
    const result = await pool.query(tenantQuery, [decoded.tenantId, decoded.userId]);
    
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied. Invalid tenant or user.' });
    }

    // Set tenant context for the request
    req.tenant = result.rows[0];
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: result.rows[0].role
    };

    // Set row-level security context in PostgreSQL
    await pool.query('SET app.current_tenant_id = $1', [decoded.tenantId]);
    
    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { tenantMiddleware, requireRole };