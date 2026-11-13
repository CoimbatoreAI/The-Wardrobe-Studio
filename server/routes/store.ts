import { Router } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { Product, Category, Order, getSettings } from '../models';
import { ah, requireAuth } from '../auth';
import { mails } from '../mailer';

const router = Router();

// ---------- Catalogue ----------

router.get(
  '/products',
  ah(async (_req, res) => {
    res.json(await Product.find({ isActive: true }).sort({ createdAt: 1 }));
  })
);

router.get(
  '/products/:id',
  ah(async (req, res) => {
    const p = await Product.findOne({ id: req.params.id, isActive: true });
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json(p);
  })
);

router.get(
  '/categories',
  ah(async (_req, res) => {
    res.json(await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }));
  })
);

router.get(
  '/settings/public',
  ah(async (_req, res) => {
    const s = await getSettings();
    res.json({
      razorpayEnabled: s.razorpayEnabled && !!s.razorpayKeyId && !!s.razorpayKeySecret,
      razorpayKeyId: s.razorpayEnabled ? s.razorpayKeyId : '',
      codEnabled: s.codEnabled,
      whatsappOrderEnabled: s.whatsappOrderEnabled,
      shippingFee: s.shippingFee,
      freeShippingAbove: s.freeShippingAbove,
    });
  })
);

// ---------- Orders ----------

const genOrderNumber = () => 'TWS-' + Date.now().toString().slice(-6) + Math.floor(10 + Math.random() * 90);

router.post(
  '/orders',
  requireAuth,
  ah(async (req, res) => {
    const { items, customer, paymentMethod } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Your bag is empty' });
    if (!customer?.fullName || !customer?.phoneNumber || !customer?.address || !customer?.pincode)
      return res.status(400).json({ error: 'Please fill in your name, phone, address and pincode' });
    if (!['razorpay', 'cod', 'whatsapp'].includes(paymentMethod)) return res.status(400).json({ error: 'Choose a payment method' });

    const settings = await getSettings();
    if (paymentMethod === 'razorpay' && !(settings.razorpayEnabled && settings.razorpayKeyId && settings.razorpayKeySecret))
      return res.status(400).json({ error: 'Online payment is not available right now' });
    if (paymentMethod === 'cod' && !settings.codEnabled) return res.status(400).json({ error: 'Cash on Delivery is not available' });
    if (paymentMethod === 'whatsapp' && !settings.whatsappOrderEnabled)
      return res.status(400).json({ error: 'WhatsApp ordering is not available' });

    // Prices always come from the database, never from the client
    const products = await Product.find({ id: { $in: items.map((i: any) => i.productId) }, isActive: true });
    const lines = [];
    for (const i of items) {
      const p = products.find((x) => x.id === i.productId);
      if (!p) return res.status(400).json({ error: 'A product in your bag is no longer available' });
      if (!p.inStock) return res.status(400).json({ error: `${p.name} is out of stock` });
      const quantity = Math.max(1, Math.min(20, parseInt(i.quantity, 10) || 1));
      lines.push({ productId: p.id, name: p.name, image: p.images[0] || '', size: i.size, color: i.color, price: p.price, quantity });
    }
    const subtotal = lines.reduce((a, l) => a + l.price * l.quantity, 0);
    const shipping = settings.freeShippingAbove && subtotal >= settings.freeShippingAbove ? 0 : settings.shippingFee || 0;
    const total = subtotal + shipping;

    const order = await Order.create({
      orderNumber: genOrderNumber(),
      user: req.user._id,
      customer: { ...customer, email: customer.email || req.user.email },
      items: lines,
      subtotal,
      shipping,
      total,
      paymentMethod,
      statusHistory: [{ status: 'Pending', note: 'Order placed' }],
    });

    // Remember the address for next time
    if (!req.user.address?.address) {
      req.user.address = {
        fullName: customer.fullName,
        phoneNumber: customer.phoneNumber,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
      };
      await req.user.save();
    }

    if (paymentMethod === 'razorpay') {
      try {
        const rz = new Razorpay({ key_id: settings.razorpayKeyId, key_secret: settings.razorpayKeySecret });
        const rzOrder = await rz.orders.create({ amount: Math.round(total * 100), currency: 'INR', receipt: order.orderNumber });
        order.razorpayOrderId = rzOrder.id;
        await order.save();
        return res.status(201).json({
          order,
          razorpay: { keyId: settings.razorpayKeyId, orderId: rzOrder.id, amount: rzOrder.amount, currency: 'INR' },
        });
      } catch (err: any) {
        await order.deleteOne();
        console.error('[razorpay] order create failed', err?.error || err);
        return res.status(502).json({ error: 'Could not start online payment. Please try again or choose another method.' });
      }
    }

    mails.orderPlaced(order);
    res.status(201).json({ order });
  })
);

router.post(
  '/orders/:id/verify-payment',
  requireAuth,
  ah(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order || order.razorpayOrderId !== razorpay_order_id) return res.status(404).json({ error: 'Order not found' });

    const settings = await getSettings();
    const expected = crypto
      .createHmac('sha256', settings.razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    if (expected !== razorpay_signature) {
      order.paymentStatus = 'Failed';
      await order.save();
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    if (order.paymentStatus !== 'Paid') {
      order.paymentStatus = 'Paid';
      order.razorpayPaymentId = razorpay_payment_id;
      order.status = 'Confirmed';
      order.statusHistory.push({ status: 'Confirmed', note: 'Payment received online' } as any);
      await order.save();
      mails.orderPlaced(order);
    }
    res.json({ order });
  })
);

router.post(
  '/orders/:id/payment-failed',
  requireAuth,
  ah(async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (order && order.paymentStatus === 'Pending') {
      order.paymentStatus = 'Failed';
      await order.save();
    }
    res.json({ ok: true });
  })
);

router.get(
  '/orders/mine',
  requireAuth,
  ah(async (req, res) => {
    res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
  })
);

router.get(
  '/orders/mine/:id',
  requireAuth,
  ah(async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  })
);

router.post(
  '/orders/:id/cancel',
  requireAuth,
  ah(async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (!['Pending', 'Confirmed'].includes(order.status))
      return res.status(400).json({ error: 'This order can no longer be cancelled. Please contact us.' });
    order.status = 'Cancelled';
    order.statusHistory.push({ status: 'Cancelled', note: 'Cancelled by customer' } as any);
    await order.save();
    mails.orderStatus(order, 'Your order has been cancelled as requested. If you paid online, the refund will be processed in 5–7 working days.');
    res.json(order);
  })
);

export default router;
