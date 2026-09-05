import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '@/lib/rsAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const u = login(email.trim(), password);
      navigate(u.role === 'admin' ? '/admin' : '/my-case');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to access your case.</p>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4 text-sm">
        <p className="flex items-center gap-2 font-medium"><Info className="h-4 w-4 text-primary" /> Demo accounts</p>
        <p className="mt-2 text-xs text-muted-foreground">Victim: <span className="font-mono">demo@rapidshield.demo</span> / <span className="font-mono">demo123</span></p>
        <p className="text-xs text-muted-foreground">Admin: <span className="font-mono">admin@rapidshield.demo</span> / <span className="font-mono">admin123</span> (via Admin login)</p>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-primary hover:underline">Create one</Link>
      </p>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        <Link to="/admin/login" className="hover:text-primary">Admin login →</Link>
      </p>
    </div>
  );
}