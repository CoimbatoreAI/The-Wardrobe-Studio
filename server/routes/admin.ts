import { Router } from 'express';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import Razorpay from 'razorpay';
import { User, Product, Category, Order, Settings, ORDER_STATUSES, getSettings } from '../models';
import { ah, requireAdmin } from '../auth';
import { mails, verifySmtp } from '../mailer';

const router = Router();
router.use(requireAdmin);

export const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) =>
      cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, /^image\//.test(file.mimetype)),
});

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60) || 'product';

// ---------- Dashboard ----------

router.get(
  '/stats',
  ah(async (_req, res) => {
    const [users, products, orders, revenueAgg, byStatus, recentOrders] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $nin: ['Cancelled', 'Returned'] }, $or: [{ paymentStatus: 'Paid' }, { paymentMethod: { $ne: 'razorpay' } }] } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Order.find().sort({ createdAt: -1 }).limit(8),
    ]);
    const since = new Date(Date.now() - 13 * 864e5);
    since.setHours(0, 0, 0, 0);
    const daily = await Order.aggregate([
      { $match: { createdAt: { $gte: since }, status: { $nin: ['Cancelled'] } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Kolkata' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json({
      users,
      products,
      orders,
      revenue: revenueAgg[0]?.total || 0,
      byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
      recentOrders,
      daily,
    });
  })
);

// ---------- Uploads ----------

router.post('/upload', upload.array('images', 10), (req, res) => {
  const files = (req.files as Express.Multer.File[]) || [];
  res.json({ urls: files.map((f) => `/uploads/${f.filename}`) });
});

// ---------- Products ----------

function productInput(body: any) {
  const data: any = { ...body };
  delete data._id;
  delete data.createdAt;
  delete data.updatedAt;
  if ('isNew' in data) {
    data.isNewArrival = !!data.isNew;
    delete data.isNew;
  }
  for (const k of ['price', 'originalPrice', 'rating', 'reviewsCount']) {
    if (data[k] === '' || data[k] === null) delete data[k];
    else if (data[k] !== undefined) data[k] = Number(data[k]);
  }
  return data;
}

router.get(
  '/products',
  ah(async (req, res) => {
    const q = String(req.query.q || '');
    const filter: any = {};
    if (q) filter.$or = [{ name: new RegExp(escapeRegex(q), 'i') }, { id: new RegExp(escapeRegex(q), 'i') }];
    if (req.query.category) filter.category = req.query.category;
    res.json(await Product.find(filter).sort({ createdAt: -1 }));
  })
);

router.post(
  '/products',
  ah(async (req, res) => {
    const data = productInput(req.body);
    if (!data.name || !data.category || !data.price) return res.status(400).json({ error: 'Name, category and price are required' });
    let id = data.id ? slugify(data.id) : slugify(data.name);
    while (await Product.exists({ id })) id = `${slugify(data.name)}-${crypto.randomBytes(2).toString('hex')}`;
    res.status(201).json(await Product.create({ ...data, id }));
  })
);

router.put(
  '/products/:id',
  ah(async (req, res) => {
    const data = productInput(req.body);
    delete data.id; // public id is stable so existing links and carts keep working
    const p = await Product.findOneAndUpdate({ id: req.params.id }, data, { new: true, runValidators: true });
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json(p);
  })
);

router.delete(
  '/products/:id',
  ah(async (req, res) => {
    await Product.deleteOne({ id: req.params.id });
    res.json({ ok: true });
  })
);

// ---------- Categories ----------

router.get('/categories', ah(async (_req, res) => res.json(await Category.find().sort({ sortOrder: 1, name: 1 }))));

router.post(
  '/categories',
  ah(async (req, res) => {
    if (!req.body?.name) return res.status(400).json({ error: 'Name is required' });
    if (await Category.exists({ name: req.body.name })) return res.status(409).json({ error: 'Category already exists' });
    res.status(201).json(await Category.create(req.body));
  })
);

router.put(
  '/categories/:id',
  ah(async (req, res) => {
    const old = await Category.findById(req.params.id);
    if (!old) return res.status(404).json({ error: 'Category not found' });
    const { _id, id, ...data } = req.body || {};
    // Renaming a category moves its products along with it
    if (data.name && data.name !== old.name) await Product.updateMany({ category: old.name }, { category: data.name });
    Object.assign(old, data);
    await old.save();
    res.json(old);
  })
);

router.delete(
  '/categories/:id',
  ah(async (req, res) => {
    const c = await Category.findById(req.params.id);
    if (!c) return res.json({ ok: true });
    const inUse = await Product.countDocuments({ category: c.name });
    if (inUse) return res.status(400).json({ error: `${inUse} product(s) still use this category. Move them first.` });
    await c.deleteOne();
    res.json({ ok: true });
  })
);

// ---------- Orders ----------

router.get(
  '/orders',
  ah(async (req, res) => {
    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
    const q = String(req.query.q || '');
    if (q) {
      const r = new RegExp(escapeRegex(q), 'i');
      filter.$or = [{ orderNumber: r }, { 'customer.fullName': r }, { 'customer.email': r }, { 'customer.phoneNumber': r }];
    }
    res.json(await Order.find(filter).sort({ createdAt: -1 }).limit(500).populate('user', 'name email'));
  })
);

router.get(
  '/orders/:id',
  ah(async (req, res) => {
    const o = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!o) return res.status(404).json({ error: 'Order not found' });
    res.json(o);
  })
);

router.put(
  '/orders/:id',
  ah(async (req, res) => {
    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).json({ error: 'Order not found' });
    const { status, paymentStatus, trackingNumber, courier, adminNote, note, notify = true, customer } = req.body || {};
    const statusChanged = status && status !== o.status;
    if (status && !ORDER_STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    if (statusChanged) {
      o.status = status;
      o.statusHistory.push({ status, note: note || '' } as any);
    }
    if (paymentStatus) o.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) o.trackingNumber = trackingNumber;
    if (courier !== undefined) o.courier = courier;
    if (adminNote !== undefined) o.adminNote = adminNote;
    if (customer) o.customer = { ...(o.customer as any)?.toObject?.(), ...customer };
    await o.save();
    let emailed = false;
    if (statusChanged && notify) emailed = await mails.orderStatus(o, note);
    res.json({ order: o, emailed });
  })
);

router.post(
  '/orders/:id/resend-email',
  ah(async (req, res) => {
    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).json({ error: 'Order not found' });
    res.json({ emailed: await mails.orderStatus(o, req.body?.note) });
  })
);

router.delete(
  '/orders/:id',
  ah(async (req, res) => {
    await Order.deleteOne({ _id: req.params.id });
    res.json({ ok: true });
  })
);

// ---------- Users ----------

router.get(
  '/users',
  ah(async (req, res) => {
    const q = String(req.query.q || '');
    const filter: any = {};
    if (q) filter.$or = [{ name: new RegExp(escapeRegex(q), 'i') }, { email: new RegExp(escapeRegex(q), 'i') }, { phone: new RegExp(escapeRegex(q), 'i') }];
    if (req.query.role) filter.role = req.query.role;
    const users = await User.find(filter).sort({ createdAt: -1 }).lean({ virtuals: false });
    const counts = await Order.aggregate([{ $group: { _id: '$user', orders: { $sum: 1 }, spent: { $sum: '$total' } } }]);
    const map = new Map(counts.map((c) => [String(c._id), c]));
    res.json(
      users.map(({ passwordHash, verifyToken, resetToken, resetTokenExpires, ...u }: any) => ({
        ...u,
        id: String(u._id),
        orders: map.get(String(u._id))?.orders || 0,
        spent: map.get(String(u._id))?.spent || 0,
      }))
    );
  })
);

router.get(
  '/users/:id',
  ah(async (req, res) => {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ error: 'User not found' });
    res.json({ user: u, orders: await Order.find({ user: u._id }).sort({ createdAt: -1 }) });
  })
);

router.post(
  '/users',
  ah(async (req, res) => {
    const { name, email, phone, password, role = 'user', isVerified = true } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
    if (await User.exists({ email: String(email).toLowerCase() })) return res.status(409).json({ error: 'Email already registered' });
    const u = await User.create({ name, email, phone, role, isVerified, passwordHash: await bcrypt.hash(password, 10) });
    res.status(201).json(u);
  })
);

router.put(
  '/users/:id',
  ah(async (req, res) => {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ error: 'User not found' });
    const { name, email, phone, role, isVerified, isBlocked, password, address } = req.body || {};
    const self = String(u._id) === String(req.user._id);
    if (self && (role === 'user' || isBlocked)) return res.status(400).json({ error: "You can't demote or block your own account" });
    if (name !== undefined) u.name = name;
    if (email !== undefined) u.email = email;
    if (phone !== undefined) u.phone = phone;
    if (role) u.role = role;
    if (isVerified !== undefined) u.isVerified = isVerified;
    if (isBlocked !== undefined) u.isBlocked = isBlocked;
    if (address) u.address = address;
    if (password) u.passwordHash = await bcrypt.hash(password, 10);
    await u.save();
    res.json(u);
  })
);

router.delete(
  '/users/:id',
  ah(async (req, res) => {
    if (req.params.id === String(req.user._id)) return res.status(400).json({ error: "You can't delete your own account" });
    await User.deleteOne({ _id: req.params.id });
    res.json({ ok: true });
  })
);

// ---------- Settings ----------

const mask = (s: string) => (s ? '••••••••' + s.slice(-4) : '');

router.get(
  '/settings',
  ah(async (_req, res) => {
    const s = (await getSettings()).toObject() as any;
    s.razorpayKeySecret = mask(s.razorpayKeySecret);
    s.smtpPass = mask(s.smtpPass);
    s.hasRazorpaySecret = !!s.razorpayKeySecret;
    res.json(s);
  })
);

router.put(
  '/settings',
  ah(async (req, res) => {
    const s = await getSettings();
    const { _id, key, createdAt, updatedAt, __v, ...data } = req.body || {};
    // Masked secrets coming back unchanged mean "keep the existing value"
    for (const k of ['razorpayKeySecret', 'smtpPass']) {
      if (data[k] === undefined || String(data[k]).startsWith('••')) delete data[k];
    }
    if (data.razorpayKeyId) data.razorpayKeyId = String(data.razorpayKeyId).trim();
    if (data.razorpayKeySecret) data.razorpayKeySecret = String(data.razorpayKeySecret).trim();
    await Settings.updateOne({ _id: s._id }, { $set: data }, { runValidators: true });
    const out = (await getSettings()).toObject() as any;
    out.razorpayKeySecret = mask(out.razorpayKeySecret);
    out.smtpPass = mask(out.smtpPass);
    res.json(out);
  })
);

router.post(
  '/settings/test-razorpay',
  ah(async (_req, res) => {
    const s = await getSettings();
    if (!s.razorpayKeyId || !s.razorpayKeySecret) return res.status(400).json({ error: 'Save the Key ID and Key Secret first' });
    try {
      const rz = new Razorpay({ key_id: s.razorpayKeyId, key_secret: s.razorpayKeySecret });
      await rz.orders.all({ count: 1 });
      res.json({ ok: true, mode: s.razorpayKeyId.startsWith('rzp_live') ? 'live' : 'test' });
    } catch (err: any) {
      res.status(400).json({ error: err?.error?.description || 'Razorpay rejected these keys' });
    }
  })
);

router.post(
  '/settings/test-email',
  ah(async (req, res) => {
    try {
      await verifySmtp();
    } catch (err: any) {
      return res.status(400).json({ error: 'SMTP connection failed: ' + err.message });
    }
    const ok = await mails.test(req.body?.to || req.user.email);
    if (!ok) return res.status(400).json({ error: 'Connected, but sending failed. Check the From address.' });
    res.json({ ok: true });
  })
);

export default router;
