'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { TrendingUp, Newspaper, BookOpen, BarChart2, Zap, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

const NAV = [
  { href: '/', label: 'Dashboard', icon: BarChart2 },
  { href: '/growth', label: 'Growth Picks', icon: Zap },
  { href: '/news', label: 'News Feed', icon: Newspaper },
  { href: '/education', label: 'Education', icon: BookOpen },
];

export default function Navbar() {
  const path = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur border-b"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight" style={{ color: 'var(--text-1)' }}>
            <TrendingUp className="w-6 h-6 text-emerald-500" />
            <span>Fin<span className="text-emerald-500">Dash</span></span>
          </Link>

          <div className="flex items-center gap-1">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = path === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                  style={{
                    background: active ? 'var(--bg-hover)' : 'transparent',
                    color: active ? 'var(--text-1)' : 'var(--text-2)',
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-2 p-2 rounded-lg transition-colors"
              style={{ background: 'var(--bg-subtle)', color: 'var(--text-2)' }}
              aria-label="Toggle theme"
            >
              {mounted && theme === 'dark'
                ? <Sun className="w-4 h-4" />
                : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
