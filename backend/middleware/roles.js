import { query } from '../config/database.js';

/**
 * Middleware to check if user has required role(s)
 * Must be used after authenticate middleware
 * @param {string|string[]} allowedRoles - Single role name or array of role names
 */
export const requireRole = (allowedRoles) => {
  // Convert single role to array for consistent handling
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return async (req, res, next) => {
    try {
      // Ensure user is authenticated (should be set by authenticate middleware)
      if (!req.user || !req.user.user_id) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const userId = req.user.user_id;

      // Query user's role from database (stored directly in user_account table)
      const result = await query(
        `SELECT role FROM user_account WHERE user_id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const userRole = result.rows[0].role;

      // Check if user has any of the required roles
      const hasRequiredRole = roles.includes(userRole);

      if (!hasRequiredRole) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role(s): ${roles.join(', ')}`,
        });
      }

      // Attach user role to request object for use in route handlers
      req.user.role = userRole;

      // Continue to next middleware or route handler
      next();
    } catch (error) {
      console.error('Error in requireRole middleware:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking user permissions',
      });
    }
  };
};

/**
 * Middleware to check if user has any of the specified roles
 * This is an alias for requireRole for clarity
 */
export const requireAnyRole = requireRole;

/**
 * Middleware to check if user has all of the specified roles
 * @param {string[]} requiredRoles - Array of role names (all must be present)
 */
export const requireAllRoles = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.user_id) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const userId = req.user.user_id;

      // Query user's role from database (stored directly in user_account table)
      const result = await query(
        `SELECT role FROM user_account WHERE user_id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const userRole = result.rows[0].role;

      // Check if user has ALL required roles (for single role per user, this means role must match one of them)
      const hasAllRoles = requiredRoles.includes(userRole);

      if (!hasAllRoles) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${requiredRoles.join(' or ')}`,
        });
      }

      req.user.role = userRole;
      next();
    } catch (error) {
      console.error('Error in requireAllRoles middleware:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking user permissions',
      });
    }
  };
};

