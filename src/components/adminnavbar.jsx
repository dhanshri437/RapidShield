import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Menu, X, LogOut, Lock } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/lib/rsAuth';
import { cn } from '@/lib/utils';

export default function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Overview', path: '/admin' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Rapid<span className="gradient-text">Shield</span>
            <span className="ml-2 rounded bg-primary-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
              Admin
            </span>
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
          <Link to="/" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
            View site
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span className="hidden items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5 text-xs font-medium md:flex">
            <Lock className="h-3.5 w-3.5" />
            {user?.name || 'Admin'}
          </span>
          <button onClick={handleLogout} className="hidden items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted md:inline-flex">
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
          <button
            type="button"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-card px-4 py-3">
          <button onClick={() => { navigate('/admin'); setOpen(false); }} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-muted">Overview</button>
          <button onClick={() => { navigate('/'); setOpen(false); }} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-muted">View site</button>
          <button onClick={handleLogout} className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground hover:bg-muted">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </nav>
      )}
    </header>
  );
}