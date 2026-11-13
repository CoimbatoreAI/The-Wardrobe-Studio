import nodemailer from 'nodemailer';
import { getSettings } from './models';

const BRAND = 'The Wardrobe Studio';
const appUrl = () => process.env.APP_URL || 'http://localhost:3000';
const inr = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN');

async function getTransport() {
  const s = await getSettings();
  if (!s.smtpHost || !s.smtpUser) return null;
  return {
    from: s.mailFrom || `${BRAND} <${s.smtpUser}>`,
    adminEmail: s.adminNotifyEmail,
    transporter: nodemailer.createTransport({
      host: s.smtpHost,
      port: s.smtpPort || 587,
      secure: !!s.smtpSecure,
      auth: { user: s.smtpUser, pass: s.smtpPass },
    }),
  };
}

function layout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#FAF8F5;font-family:Arial,Helvetica,sans-serif;color:#292524">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E2EEF8">
    <tr><td style="background:#1C3347;padding:24px;text-align:center">
      <img src="${appUrl()}/logo.png" alt="${BRAND}" height="48" style="height:48px"><br>
      <span style="color:#e0f2fe;font-size:12px;letter-spacing:3px;text-transform:uppercase">${BRAND}</span>
    </td></tr>
    <tr><td style="padding:32px 28px">
      <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:24px;margin:0 0 16px">${title}</h1>
      ${body}
    </td></tr>
    <tr><td style="background:#F5F5F4;padding:16px;text-align:center;font-size:11px;color:#78716c">
      ${BRAND} · RS Puram, Coimbatore · <a href="${appUrl()}" style="color:#D92B38">${appUrl().replace(/^https?:\/\//, '')}</a>
    </td></tr>
  </table></td></tr></table></body></html>`;
}

const button = (href: string, label: string) =>
  `<p style="margin:24px 0"><a href="${href}" style="background:#D92B38;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-size:13px;font-weight:bold;letter-spacing:1px">${label}</a></p>`;

function itemsTable(order: any) {
  const rows = order.items
    .map(
      (i: any) => `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px">${i.name}<br><span style="color:#78716c;font-size:11px">Size ${i.size || '-'} · Qty ${i.quantity}</span></td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px;text-align:right">${inr(i.price * i.quantity)}</td></tr>`
    )
    .join('');
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0">${rows}
    <tr><td style="padding:6px 0;font-size:13px;color:#78716c">Shipping</td><td style="text-align:right;font-size:13px">${order.shipping ? inr(order.shipping) : 'Free'}</td></tr>
    <tr><td style="padding:6px 0;font-size:15px;font-weight:bold">Total</td><td style="text-align:right;font-size:15px;font-weight:bold;color:#D92B38">${inr(order.total)}</td></tr>
  </table>`;
}

export async function sendMail(to: string, subject: string, html: string) {
  const t = await getTransport();
  if (!t) {
    console.warn(`[mail] SMTP not configured – skipped "${subject}" to ${to}`);
    return false;
  }
  try {
    await t.transporter.sendMail({ from: t.from, to, subject, html });
    return true;
  } catch (err: any) {
    console.error(`[mail] failed "${subject}" to ${to}:`, err.message);
    return false;
  }
}

export async function isMailConfigured() {
  const s = await getSettings();
  return !!(s.smtpHost && s.smtpUser);
}

export async function verifySmtp() {
  const t = await getTransport();
  if (!t) throw new Error('SMTP host and user are required');
  await t.transporter.verify();
}

export const mails = {
  verify: (user: any, token: string) =>
    sendMail(
      user.email,
      `Verify your email – ${BRAND}`,
      layout(
        `Welcome, ${user.name}!`,
        `<p style="font-size:14px;line-height:1.6">Thank you for creating an account with ${BRAND}. Please confirm your email address to activate your account.</p>
        ${button(`${appUrl()}/verify-email?token=${token}`, 'VERIFY EMAIL')}
        <p style="font-size:12px;color:#78716c">If you didn't sign up, you can ignore this email.</p>`
      )
    ),

  welcome: (user: any) =>
    sendMail(
      user.email,
      `Thank you for joining ${BRAND}`,
      layout(
        `Thank you, ${user.name}!`,
        `<p style="font-size:14px;line-height:1.6">Your email is verified and your account is ready. Explore our handcrafted kurtas, suit sets and jewellery.</p>
        ${button(`${appUrl()}/collections`, 'SHOP THE COLLECTION')}`
      )
    ),

  resetPassword: (user: any, token: string) =>
    sendMail(
      user.email,
      `Reset your password – ${BRAND}`,
      layout(
        'Reset your password',
        `<p style="font-size:14px;line-height:1.6">Hi ${user.name}, we received a request to reset your password. This link is valid for 1 hour.</p>
        ${button(`${appUrl()}/reset-password?token=${token}`, 'RESET PASSWORD')}
        <p style="font-size:12px;color:#78716c">If you didn't request this, you can ignore this email.</p>`
      )
    ),

  orderPlaced: async (order: any) => {
    const t = await getTransport();
    const html = layout(
      `Thank you for your order, ${order.customer.fullName}!`,
      `<p style="font-size:14px;line-height:1.6">We've received your order <strong>${order.orderNumber}</strong>. Our studio team will get it ready with love and keep you updated by email.</p>
      <p style="font-size:13px">Payment: <strong>${order.paymentMethod === 'razorpay' ? 'Paid online' : order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Via WhatsApp'}</strong> (${order.paymentStatus})</p>
      ${itemsTable(order)}
      <p style="font-size:13px;color:#57534e"><strong>Delivering to:</strong><br>${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}<br>Phone: ${order.customer.phoneNumber}</p>
      ${button(`${appUrl()}/account`, 'VIEW MY ORDERS')}`
    );
    if (order.customer.email) await sendMail(order.customer.email, `Order ${order.orderNumber} received – ${BRAND}`, html);
    if (t?.adminEmail)
      await sendMail(
        t.adminEmail,
        `New order ${order.orderNumber} – ${inr(order.total)}`,
        layout(`New order ${order.orderNumber}`, `<p>${order.customer.fullName} · ${order.customer.phoneNumber}</p>${itemsTable(order)}`)
      );
  },

  orderStatus: (order: any, note?: string) => {
    if (!order.customer.email) return Promise.resolve(false);
    const tracking = order.trackingNumber
      ? `<p style="font-size:13px">Courier: <strong>${order.courier || '-'}</strong><br>Tracking number: <strong>${order.trackingNumber}</strong></p>`
      : '';
    return sendMail(
      order.customer.email,
      `Order ${order.orderNumber} is now ${order.status} – ${BRAND}`,
      layout(
        `Your order is ${order.status}`,
        `<p style="font-size:14px;line-height:1.6">Hi ${order.customer.fullName}, here's an update on your order <strong>${order.orderNumber}</strong>.</p>
        <p style="display:inline-block;background:#E0F2FE;color:#1C3347;padding:8px 16px;border-radius:999px;font-size:13px;font-weight:bold">${order.status}</p>
        ${note ? `<p style="font-size:13px;line-height:1.6">${note}</p>` : ''}
        ${tracking}
        ${itemsTable(order)}
        ${button(`${appUrl()}/account`, 'TRACK MY ORDER')}`
      )
    );
  },

  test: (to: string) =>
    sendMail(to, `Test email – ${BRAND}`, layout('SMTP is working', '<p>Your email settings are configured correctly.</p>')),
};
