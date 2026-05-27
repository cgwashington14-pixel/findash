import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import TickerTape from '@/components/TickerTape';
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
          <TickerTape />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
