import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/auth';
import storeRoutes from './routes/store';
import adminRoutes, { UPLOAD_DIR } from './routes/admin';
import { User, Product, Category, getSettings } from './models';
import { PRODUCTS, CATEGORIES_DATA } from '../src/data/products';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '30d' }));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', storeRoutes);
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

// In production the same server serves the built React app
const dist = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^(?!\/api|\/uploads).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  if (err?.code === 11000) return res.status(409).json({ error: 'That value already exists' });
  if (err?.name === 'ValidationError' || err?.name === 'CastError') return res.status(400).json({ error: err.message });
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

async function seed() {
  await getSettings();

  if (!(await User.exists({ role: 'admin' }))) {
    const email = (process.env.ADMIN_EMAIL || 'admin@thewardrobestudio.com').toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const existing = await User.findOne({ email });
    if (existing) {
      existing.role = 'admin';
      existing.isVerified = true;
      await existing.save();
    } else {
      await User.create({ name: 'Admin', email, role: 'admin', isVerified: true, passwordHash: await bcrypt.hash(password, 10) });
    }
    console.log(`[seed] admin account ready: ${email}`);
  }

  if ((await Category.countDocuments()) === 0) {
    await Category.insertMany(CATEGORIES_DATA.map((c, i) => ({ ...c, sortOrder: i })));
    console.log(`[seed] ${CATEGORIES_DATA.length} categories imported`);
  }

  if ((await Product.countDocuments()) === 0) {
    await Product.insertMany(PRODUCTS.map(({ isNew, ...p }) => ({ ...p, isNewArrival: !!isNew })));
    console.log(`[seed] ${PRODUCTS.length} products imported`);
  }
}

const PORT = Number(process.env.API_PORT || process.env.PORT) || 7864;

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(async () => {
    console.log('[db] connected to MongoDB');
    await seed();
    app.listen(PORT, () => console.log(`[api] running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('[db] connection failed:', err.message);
    process.exit(1);
  });
