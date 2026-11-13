import React, { useEffect, useState } from 'react';
import { CreditCard, Mail, Truck, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Card, PageHeader, Btn, Field, Toggle, Spinner, inputCls } from './ui';

interface AdminSettings {
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  codEnabled: boolean;
  whatsappOrderEnabled: boolean;
  shippingFee: number;
  freeShippingAbove: number;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  mailFrom: string;
  adminNotifyEmail: string;
  requireEmailVerification: boolean;
}

type Result = { ok: boolean; text: string } | null;

const ResultLine: React.FC<{ r: Result }> = ({ r }) =>
  r ? (
    <p className={`flex items-center gap-1.5 text-xs ${r.ok ? 'text-emerald-700' : 'text-red-600'}`}>
      {r.ok ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {r.text}
    </p>
  ) : null;

const Section: React.FC<{ icon: React.ElementType; title: string; desc: string; children: React.ReactNode }> = ({ icon: Icon, title, desc, children }) => (
  <Card className="p-5 sm:p-6">
    <div className="flex items-start gap-3 mb-5">
      <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-stone-700" />
      </div>
      <div>
        <h2 className="font-semibold text-stone-900">{title}</h2>
        <p className="text-xs text-stone-500">{desc}</p>
      </div>
    </div>
    <div className="space-y-4">{children}</div>
  </Card>
);

export const Settings: React.FC = () => {
  const { refresh } = useStore();
  const { user } = useAuth();
  const [s, setS] = useState<AdminSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<Result>(null);
  const [rzResult, setRzResult] = useState<Result>(null);
  const [mailResult, setMailResult] = useState<Result>(null);
  const [testTo, setTestTo] = useState('');

  useEffect(() => {
    api<AdminSettings>('/admin/settings').then(setS);
    setTestTo(user?.email || '');
  }, []);

  if (!s) return <Spinner />;
  const set = <K extends keyof AdminSettings>(k: K, v: AdminSettings[K]) => setS({ ...s, [k]: v });

  const save = async () => {
    setSaving(true);
    setSaved(null);
    try {
      setS(await api<AdminSettings>('/admin/settings', { method: 'PUT', body: s }));
      setSaved({ ok: true, text: 'Settings saved' });
      refresh();
      return true;
    } catch (err) {
      setSaved({ ok: false, text: (err as Error).message });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const testRazorpay = async () => {
    setRzResult(null);
    if (!(await save())) return;
    try {
      const d = await api('/admin/settings/test-razorpay', { body: {} });
      setRzResult({ ok: true, text: `Keys are valid (${d.mode} mode)` });
    } catch (err) {
      setRzResult({ ok: false, text: (err as Error).message });
    }
  };

  const testMail = async () => {
    setMailResult(null);
    if (!(await save())) return;
    try {
      await api('/admin/settings/test-email', { body: { to: testTo } });
      setMailResult({ ok: true, text: `Test email sent to ${testTo}` });
    } catch (err) {
      setMailResult({ ok: false, text: (err as Error).message });
    }
  };

  const liveMode = s.razorpayKeyId.startsWith('rzp_live');

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Payments, email and shipping"
        actions={
          <Btn onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save settings'}
          </Btn>
        }
      />
      <div className="mb-4">
        <ResultLine r={saved} />
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <Section icon={CreditCard} title="Razorpay payments" desc="Paste your keys from Razorpay Dashboard → Account & Settings → API Keys">
          <Toggle
            checked={s.razorpayEnabled}
            onChange={(v) => set('razorpayEnabled', v)}
            label="Accept online payments"
            hint="Shows “Pay Online” (UPI / cards / netbanking) at checkout"
          />
          <Field label="Key ID" hint="Starts with rzp_test_ (testing) or rzp_live_ (real payments)">
            <input className={`${inputCls} font-mono`} placeholder="rzp_live_xxxxxxxxxxxx" value={s.razorpayKeyId} onChange={(e) => set('razorpayKeyId', e.target.value)} />
          </Field>
          <Field label="Key Secret" hint="Stored on the server only; never sent to the browser">
            <input
              className={`${inputCls} font-mono`}
              type="password"
              autoComplete="new-password"
              placeholder="Enter key secret"
              value={s.razorpayKeySecret}
              onFocus={(e) => s.razorpayKeySecret.startsWith('••') && e.target.select()}
              onChange={(e) => set('razorpayKeySecret', e.target.value)}
            />
          </Field>
          {s.razorpayKeyId && (
            <p className={`text-xs font-medium ${liveMode ? 'text-emerald-700' : 'text-amber-700'}`}>
              {liveMode ? 'Live mode: customers will be charged real money.' : 'Test mode: no real money is charged.'}
            </p>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <Btn variant="secondary" onClick={testRazorpay}>
              Save & verify keys
            </Btn>
            <ResultLine r={rzResult} />
          </div>
        </Section>

        <Section icon={Mail} title="Email (SMTP)" desc="Used for verification, thank-you, order confirmation and status update emails">
          <div className="grid grid-cols-3 gap-3">
            <Field label="SMTP host" className="col-span-2">
              <input className={inputCls} placeholder="smtp.gmail.com" value={s.smtpHost} onChange={(e) => set('smtpHost', e.target.value)} />
            </Field>
            <Field label="Port">
              <input
                type="number"
                className={inputCls}
                value={s.smtpPort}
                onChange={(e) => {
                  const port = Number(e.target.value);
                  setS({ ...s, smtpPort: port, smtpSecure: port === 465 });
                }}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Username">
              <input className={inputCls} placeholder="you@gmail.com" value={s.smtpUser} onChange={(e) => set('smtpUser', e.target.value)} />
            </Field>
            <Field label="Password / App password">
              <input
                className={inputCls}
                type="password"
                autoComplete="new-password"
                value={s.smtpPass}
                onFocus={(e) => s.smtpPass.startsWith('••') && e.target.select()}
                onChange={(e) => set('smtpPass', e.target.value)}
              />
            </Field>
          </div>
          <Field label="From address" hint='e.g. The Wardrobe Studio <orders@yourdomain.com>. Defaults to the username.'>
            <input className={inputCls} value={s.mailFrom} onChange={(e) => set('mailFrom', e.target.value)} />
          </Field>
          <Field label="Send new-order alerts to" hint="Leave empty to skip admin alerts">
            <input type="email" className={inputCls} value={s.adminNotifyEmail} onChange={(e) => set('adminNotifyEmail', e.target.value)} />
          </Field>
          <Toggle checked={s.smtpSecure} onChange={(v) => set('smtpSecure', v)} label="Use SSL (port 465)" hint="Leave off for port 587 (STARTTLS)" />
          <p className="text-[11px] text-stone-500 bg-stone-50 rounded p-2">
            Gmail: turn on 2-Step Verification, then create an App Password at myaccount.google.com/apppasswords and use it here with host
            smtp.gmail.com, port 587.
          </p>
          <div className="flex gap-2 items-end flex-wrap">
            <Field label="Send test email to" className="flex-1 min-w-[180px]">
              <input type="email" className={inputCls} value={testTo} onChange={(e) => setTestTo(e.target.value)} />
            </Field>
            <Btn variant="secondary" onClick={testMail}>
              Save & send test
            </Btn>
          </div>
          <ResultLine r={mailResult} />
        </Section>

        <Section icon={Truck} title="Checkout & shipping" desc="Payment options and delivery charges">
          <Toggle checked={s.codEnabled} onChange={(v) => set('codEnabled', v)} label="Cash on Delivery" />
          <Toggle checked={s.whatsappOrderEnabled} onChange={(v) => set('whatsappOrderEnabled', v)} label="Order via WhatsApp" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Shipping fee (₹)">
              <input type="number" min={0} className={inputCls} value={s.shippingFee} onChange={(e) => set('shippingFee', Number(e.target.value))} />
            </Field>
            <Field label="Free shipping above (₹)" hint="0 = never free">
              <input type="number" min={0} className={inputCls} value={s.freeShippingAbove} onChange={(e) => set('freeShippingAbove', Number(e.target.value))} />
            </Field>
          </div>
        </Section>

        <Section icon={ShieldCheck} title="Accounts" desc="Customer sign-up rules">
          <Toggle
            checked={s.requireEmailVerification}
            onChange={(v) => set('requireEmailVerification', v)}
            label="Require email verification"
            hint="New customers must click the link in their email before logging in. Only applies once SMTP is configured."
          />
        </Section>
      </div>
    </>
  );
};
