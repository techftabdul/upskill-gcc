import { adminAuth } from '../firebase/admin.js';

/**
 * Express middleware: verifies Firebase ID token from the Authorization header.
 * Attaches the decoded token (including uid) to req.user.
 *
 * Usage:
 *   router.post('/my-route', verifyToken, (req, res) => { ... });
 */
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized — no token provided',
      code: 'AUTH_MISSING',
    });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    req.user = decodedToken; // { uid, email, ... }
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({
      error: 'Unauthorized — invalid or expired token',
      code: 'AUTH_INVALID',
    });
  }
};
