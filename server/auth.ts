import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from './models';

const secret = () => process.env.JWT_SECRET || 'dev-secret';

export const signToken = (userId: string) => jwt.sign({ sub: userId }, secret(), { expiresIn: '30d' });

export interface AuthedRequest extends Request {
  user?: any;
}

async function loadUser(req: AuthedRequest) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return null;
  try {
    const payload = jwt.verify(token, secret()) as { sub: string };
    const user = await User.findById(payload.sub);
    if (!user || user.isBlocked) return null;
    return user;
  } catch {
    return null;
  }
}

export async function optionalAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  req.user = await loadUser(req);
  next();
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  req.user = await loadUser(req);
  if (!req.user) return res.status(401).json({ error: 'Please log in to continue' });
  next();
}

export async function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  req.user = await loadUser(req);
  if (!req.user) return res.status(401).json({ error: 'Please log in to continue' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access only' });
  next();
}

// Wraps async route handlers so thrown errors reach the error middleware
export const ah =
  (fn: (req: AuthedRequest, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req as AuthedRequest, res, next).catch(next);
