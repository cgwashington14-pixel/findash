'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const NAV = [
  { href: '/', label: 'Markets' },
  { href: '/growth', label: 'Growth' },
  { href: '/news', label: 'News' },
  { href: '/education', label: 'Learn' },
];

export default function Navbar() {
  const path = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-app)' }} className="sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Wordmark + byline */}
        <div className="flex items-baseline gap-3">
          <Link href="/" className="mono font-bold tracking-[0.12em] text-sm" style={{ color: 'var(--accent)' }}>
            FINDASH
          </Link>
          <span className="label hidden sm:inline" style={{ color: 'var(--text-3)' }}>
            by Corey Washington · CW Enterprise
          </span>
        </div>

        {/* Nav + toggle */}
        <div className="flex items-center gap-6">
          {NAV.map(({ href, label }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                className="label transition-colors"
                style={{ color: active ? 'var(--text-1)' : 'var(--text-2)', letterSpacing: '0.10em' }}
              >
                {label}
              </Link>
            );
          })}

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            style={{ color: 'var(--text-2)' }}
            className="transition-colors hover:text-[var(--text-1)] ml-2"
          >
            {mounted && theme === 'dark'
              ? <Sun className="w-3.5 h-3.5" />
              : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
