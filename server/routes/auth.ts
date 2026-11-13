import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User, getSettings } from '../models';
import { ah, requireAuth, signToken } from '../auth';
import { mails, isMailConfigured } from '../mailer';

const router = Router();
const newToken = () => crypto.randomBytes(32).toString('hex');
// Verification only applies once SMTP is set up, otherwise nobody could ever log in
const mustVerify = async () => (await getSettings()).requireEmailVerification && (await isMailConfigured());
const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

router.post(
  '/register',
  ah(async (req, res) => {
    const { name, email, phone, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
    if (!emailOk(email)) return res.status(400).json({ error: 'Enter a valid email address' });
    if (String(password).length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    if (await User.findOne({ email: String(email).toLowerCase() }))
      return res.status(409).json({ error: 'An account with this email already exists' });

    const verify = await mustVerify();
    const verifyToken = newToken();
    const user = await User.create({
      name,
      email,
      phone: phone || '',
      passwordHash: await bcrypt.hash(password, 10),
      isVerified: !verify,
      verifyToken: verify ? verifyToken : undefined,
    });

    if (verify) {
      await mails.verify(user, verifyToken);
      return res.status(201).json({ needsVerification: true, message: 'Account created. Check your email to verify your account.' });
    }
    await mails.welcome(user);
    res.status(201).json({ token: signToken(String(user._id)), user });
  })
);

router.post(
  '/verify-email',
  ah(async (req, res) => {
    const { token } = req.body || {};
    const user = token && (await User.findOne({ verifyToken: token }));
    if (!user) return res.status(400).json({ error: 'This verification link is invalid or already used' });
    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();
    await mails.welcome(user);
    res.json({ token: signToken(String(user._id)), user });
  })
);

router.post(
  '/resend-verification',
  ah(async (req, res) => {
    const user = await User.findOne({ email: String(req.body?.email || '').toLowerCase() });
    if (user && !user.isVerified) {
      user.verifyToken = newToken();
      await user.save();
      await mails.verify(user, user.verifyToken);
    }
    res.json({ message: 'If that account needs verification, a new email has been sent.' });
  })
);

router.post(
  '/login',
  ah(async (req, res) => {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email: String(email || '').toLowerCase() });
    if (!user || !(await bcrypt.compare(String(password || ''), user.passwordHash)))
      return res.status(401).json({ error: 'Incorrect email or password' });
    if (user.isBlocked) return res.status(403).json({ error: 'This account has been blocked. Please contact support.' });
    if (!user.isVerified && user.role !== 'admin' && (await mustVerify())) {
      return res.status(403).json({ error: 'Please verify your email before logging in.', needsVerification: true });
    }
    user.lastLoginAt = new Date();
    await user.save();
    res.json({ token: signToken(String(user._id)), user });
  })
);

router.post(
  '/forgot-password',
  ah(async (req, res) => {
    const user = await User.findOne({ email: String(req.body?.email || '').toLowerCase() });
    if (user) {
      user.resetToken = newToken();
      user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();
      await mails.resetPassword(user, user.resetToken);
    }
    res.json({ message: 'If an account exists for that email, a reset link has been sent.' });
  })
);

router.post(
  '/reset-password',
  ah(async (req, res) => {
    const { token, password } = req.body || {};
    if (!password || String(password).length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    const user = token && (await User.findOne({ resetToken: token, resetTokenExpires: { $gt: new Date() } }));
    if (!user) return res.status(400).json({ error: 'This reset link is invalid or has expired' });
    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    user.isVerified = true; // they proved inbox ownership
    await user.save();
    res.json({ token: signToken(String(user._id)), user });
  })
);

router.get('/me', requireAuth, (req: any, res) => res.json({ user: req.user }));

router.put(
  '/me',
  requireAuth,
  ah(async (req, res) => {
    const { name, phone, address, currentPassword, newPassword } = req.body || {};
    const user = req.user;
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address) user.address = address;
    if (newPassword) {
      if (!(await bcrypt.compare(String(currentPassword || ''), user.passwordHash)))
        return res.status(400).json({ error: 'Current password is incorrect' });
      if (String(newPassword).length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });
      user.passwordHash = await bcrypt.hash(newPassword, 10);
    }
    await user.save();
    res.json({ user });
  })
);

export default router;
