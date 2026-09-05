import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Menu, X, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/lib/rsAuth';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Start Response', path: '/flow' },
    { label: 'My Case', path: '/my-case', auth: true },
    { label: 'Support', path: '/support' },
  ].filter((l) => !l.auth || (user && user.role === 'user'));

  const isActive = (path) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path));

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Rapid<span className="gradient-text">Shield</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive(l.path) ? 'bg-primary-muted text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <span className="flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5 text-xs font-medium">
                <UserIcon className="h-3.5 w-3.5" />
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <button onClick={() => navigate('/login')} className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Sign up
              </button>
            </div>
          )}
          <button
            type="button"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-card px-4 py-3">
          {links.map((l) => (
            <button
              key={l.path}
              onClick={() => {
                navigate(l.path);
                setOpen(false);
              }}
              className={cn(
                'block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                isActive(l.path) ? 'bg-primary-muted text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {l.label}
            </button>
          ))}
          <div className="mt-2 border-t border-border pt-2">
            {user ? (
              <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground hover:bg-muted">
                <LogOut className="h-4 w-4" /> Logout ({user.name})
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => { navigate('/login'); setOpen(false); }} className="flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium">Login</button>
                <button onClick={() => { navigate('/register'); setOpen(false); }} className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">Sign up</button>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}