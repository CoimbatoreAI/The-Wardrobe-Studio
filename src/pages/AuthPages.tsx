import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api, ApiError } from '../lib/api';

const inputCls =
  'w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-cherry focus:bg-white text-stone-900';

const Shell: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="min-h-[70vh] flex items-center justify-center px-4 py-14">
    <div className="w-full max-w-md bg-white rounded-2xl border border-sky-100 shadow-sm p-7 sm:p-9 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-cherry text-[11px] font-bold uppercase tracking-[0.25em] block">The Wardrobe Studio</span>
        <h1 className="font-serif text-3xl text-stone-900">{title}</h1>
        {subtitle && <p className="text-stone-500 text-sm font-light">{subtitle}</p>}
      </div>
      {children}
    </div>
  </div>
);

const Field: React.FC<{ icon: React.ElementType } & React.InputHTMLAttributes<HTMLInputElement>> = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
    <input {...props} className={inputCls} />
  </div>
);

const Notice: React.FC<{ kind: 'error' | 'success'; children: React.ReactNode }> = ({ kind, children }) => (
  <div
    className={`flex items-start gap-2 text-xs p-3 rounded-lg ${
      kind === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
    }`}
  >
    {kind === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
    <span>{children}</span>
  </div>
);

const SubmitBtn: React.FC<{ busy: boolean; children: React.ReactNode }> = ({ busy, children }) => (
  <button
    type="submit"
    disabled={busy}
    className="w-full bg-cherry hover:bg-cherry-hover disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold text-xs uppercase tracking-[0.18em] transition-all shadow"
  >
    {busy ? 'Please wait…' : children}
  </button>
);

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || (location.state as any)?.from || '/account';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setBusy(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' && redirect === '/account' ? '/admin' : redirect, { replace: true });
    } catch (err) {
      setError((err as Error).message);
      setNeedsVerification(!!(err as ApiError).data?.needsVerification);
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    const d = await api('/auth/resend-verification', { body: { email } });
    setInfo(d.message);
    setError('');
  };

  return (
    <Shell title="Welcome back" subtitle="Log in to track orders and check out faster">
      <form onSubmit={submit} className="space-y-4">
        {error && <Notice kind="error">{error}</Notice>}
        {info && <Notice kind="success">{info}</Notice>}
        {needsVerification && (
          <button type="button" onClick={resend} className="text-xs text-cherry font-semibold underline">
            Resend verification email
          </button>
        )}
        <Field icon={Mail} type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field icon={Lock} type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="text-right">
          <Link to="/forgot-password" className="text-xs text-stone-500 hover:text-cherry">
            Forgot password?
          </Link>
        </div>
        <SubmitBtn busy={busy}>Log in</SubmitBtn>
      </form>
      <p className="text-center text-xs text-stone-500">
        New here?{' '}
        <Link to={`/register${params.get('redirect') ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="text-cherry font-semibold">
          Create an account
        </Link>
      </p>
    </Shell>
  );
};

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setError('');
    setBusy(true);
    try {
      const d = await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      if (d.needsVerification) setDone(d.message || 'Check your email to verify your account.');
      else navigate(params.get('redirect') || '/account', { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <Shell title="Check your inbox">
        <Notice kind="success">{done}</Notice>
        <p className="text-xs text-stone-500 text-center">
          We sent a verification link to <strong>{form.email}</strong>. Click it to activate your account.
        </p>
        <Link to="/login" className="block text-center text-xs text-cherry font-semibold">
          Back to login
        </Link>
      </Shell>
    );
  }

  return (
    <Shell title="Create account" subtitle="Join The Wardrobe Studio family">
      <form onSubmit={submit} className="space-y-4">
        {error && <Notice kind="error">{error}</Notice>}
        <Field icon={UserIcon} required placeholder="Full name" value={form.name} onChange={set('name')} />
        <Field icon={Mail} type="email" required placeholder="Email address" value={form.email} onChange={set('email')} />
        <Field icon={Phone} type="tel" placeholder="Phone (optional)" value={form.phone} onChange={set('phone')} />
        <Field icon={Lock} type="password" required minLength={6} placeholder="Password (min 6 characters)" value={form.password} onChange={set('password')} />
        <Field icon={Lock} type="password" required placeholder="Confirm password" value={form.confirm} onChange={set('confirm')} />
        <SubmitBtn busy={busy}>Create account</SubmitBtn>
      </form>
      <p className="text-center text-xs text-stone-500">
        Already have an account?{' '}
        <Link to="/login" className="text-cherry font-semibold">
          Log in
        </Link>
      </p>
    </Shell>
  );
};

export const VerifyEmail: React.FC = () => {
  const [params] = useSearchParams();
  const { acceptSession } = useAuth();
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [error, setError] = useState('');
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // tokens are single-use; StrictMode would call this twice
    ran.current = true;
    api('/auth/verify-email', { body: { token: params.get('token') } })
      .then((d) => {
        acceptSession(d.token, d.user);
        setState('ok');
      })
      .catch((err) => {
        setError(err.message);
        setState('error');
      });
  }, []);

  return (
    <Shell title={state === 'ok' ? 'Email verified!' : state === 'error' ? 'Verification failed' : 'Verifying…'}>
      {state === 'loading' && <div className="w-10 h-10 border-2 border-cherry border-t-transparent rounded-full animate-spin mx-auto" />}
      {state === 'ok' && (
        <>
          <Notice kind="success">Thank you! Your account is now active and you're logged in.</Notice>
          <Link to="/collections" className="block text-center bg-cherry text-white py-3 rounded-xl text-xs font-semibold uppercase tracking-wider">
            Start shopping
          </Link>
        </>
      )}
      {state === 'error' && (
        <>
          <Notice kind="error">{error}</Notice>
          <Link to="/login" className="block text-center text-xs text-cherry font-semibold">
            Go to login
          </Link>
        </>
      )}
    </Shell>
  );
};

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const d = await api('/auth/forgot-password', { body: { email } });
      setMsg(d.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Shell title="Forgot password" subtitle="We'll email you a link to reset it">
      <form onSubmit={submit} className="space-y-4">
        {msg && <Notice kind="success">{msg}</Notice>}
        <Field icon={Mail} type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
        <SubmitBtn busy={busy}>Send reset link</SubmitBtn>
      </form>
      <Link to="/login" className="block text-center text-xs text-cherry font-semibold">
        Back to login
      </Link>
    </Shell>
  );
};

export const ResetPassword: React.FC = () => {
  const [params] = useSearchParams();
  const { acceptSession } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return setError('Passwords do not match');
    setBusy(true);
    try {
      const d = await api('/auth/reset-password', { body: { token: params.get('token'), password } });
      acceptSession(d.token, d.user);
      navigate('/account', { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Shell title="Set a new password">
      <form onSubmit={submit} className="space-y-4">
        {error && <Notice kind="error">{error}</Notice>}
        <Field icon={Lock} type="password" required minLength={6} placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Field icon={Lock} type="password" required placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        <SubmitBtn busy={busy}>Update password</SubmitBtn>
      </form>
    </Shell>
  );
};
