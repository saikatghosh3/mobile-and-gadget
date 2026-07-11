import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password, hashed) {
  return bcrypt.compare(password, hashed);
}

export function signToken(userId, role) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  const adminCookie = request.cookies.get('admin_token');
  if (adminCookie?.value) return adminCookie.value;
  const cookie = request.cookies.get('token');
  return cookie?.value || null;
}

export async function getAuthenticatedUser(request) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded) return null;

  if (decoded.userId === 'admin-hardcoded' && decoded.role === 'admin') {
    return {
      _id: 'admin-hardcoded',
      fullName: 'Administrator',
      email: 'admin@gmail.com',
      role: 'admin',
      status: 'active',
    };
  }

  const User = (await import('../models/User')).default;
  const UserModel = await User();
  const user = await UserModel.findById(decoded.userId).select('-password');
  return user;
}

export function requireAuth(handler) {
  return async (request, ...args) => {
    const token = getTokenFromRequest(request);
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid or expired token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (decoded.userId === 'admin-hardcoded' && decoded.role === 'admin') {
      request.user = {
        _id: 'admin-hardcoded',
        fullName: 'Administrator',
        email: 'admin@gmail.com',
        role: 'admin',
        status: 'active',
      };
      return handler(request, ...args);
    }

    const User = (await import('../models/User')).default;
    const UserModel = await User();
    const user = await UserModel.findById(decoded.userId).select('-password');
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'User not found' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (user.status !== 'active') {
      return new Response(JSON.stringify({ success: false, error: `Account is ${user.status}` }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    request.user = user;
    return handler(request, ...args);
  };
}

export function requireAdmin(handler) {
  return async (request, ...args) => {
    const response = await requireAuth(async (req) => {
      if (req.user.role !== 'admin') {
        return new Response(JSON.stringify({ success: false, error: 'Admin access required' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return handler(req, ...args);
    })(request, ...args);
    return response;
  };
}

export function getJwtSecret() {
  return JWT_SECRET;
}
