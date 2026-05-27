import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import ThemeProvider from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'FinDash — Financial Evaluation Dashboard',
  description: 'Evaluate and monitor AMD, ServiceNow, Salesforce, DocuSign, Chevron, Costco, Cheesecake Factory, e.l.f. Beauty, and Micron.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-screen antialiased" style={{ background: 'var(--bg-app)', color: 'var(--text-1)' }}>
        <ThemeProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
