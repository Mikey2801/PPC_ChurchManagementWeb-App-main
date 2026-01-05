import { verifyToken, extractTokenFromHeader } from '../utils/jwt.js';

/**
 * Middleware to verify JWT token and attach user info to request object
 * Requires: Authorization header with "Bearer <token>" format
 */
export const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization header required.',
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Attach user info to request object for use in route handlers
    req.user = decoded;
    
    // Continue to next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Invalid or expired token',
    });
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token provided
 * Useful for routes that work both for authenticated and unauthenticated users
 */
export const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      try {
        const decoded = verifyToken(token);
        req.user = decoded;
      } catch (error) {
        // Token invalid but continue anyway (optional auth)
        req.user = null;
      }
    }
    
    next();
  } catch (error) {
    // Continue even if there's an error
    req.user = null;
    next();
  }
};

