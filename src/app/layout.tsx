import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';

import { AppProviders } from '@/components/providers/app-providers';
import { serverGet } from '@/lib/server-api';
import type { AuthUser } from '@/types/auth';

import './globals.css';

const Satoshi = localFont({
  src: [
    {
      path: '../../public/fonts/Satoshi-Variable.woff2',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Satoshi-VariableItalic.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'GreenX7',
    template: '%s | GreenX7',
  },
  description: 'GreenX7 Coaching Platform',
  icons: {
    icon: '/images/favicon.png',
    shortcut: '/images/favicon.png',
    apple: '/images/favicon.png',
  },
  // Use APP_URL (not NEXT_PUBLIC_) because metadata only runs on the server.
  // NEXT_PUBLIC_ values are baked into the bundle at build time, so the Docker
  // image would stick to one domain and could not be reused for staging/production.
  metadataBase: new URL(process.env.APP_URL ?? 'http://localhost:3000'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1b7a4d',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  /**
   * Fetch the user ON THE SERVER and pass it down to the provider.
   * The first HTML already matches the user role — no guest-menu flash
   * before JS swaps in the admin menu.
   *
   * An expired access token was already renewed by middleware before this request.
   */
  const user = await serverGet<AuthUser>('/auth/me');

  return (
    <html lang="en" className={Satoshi.variable} suppressHydrationWarning>
      <body className="font-satoshi">
        <AppProviders initialUser={user}>{children}</AppProviders>
      </body>
    </html>
  );
}
