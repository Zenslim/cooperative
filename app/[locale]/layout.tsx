import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import '../globals.css';
import ClientProviders from './ClientProviders';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Wu-Wei Cooperative OS',
  description: 'Where Life Flows - Transparency-First Cooperative Management System'
};

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProviders locale={locale} messages={messages}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
