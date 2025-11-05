import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { routing } from '../../i18n/request';
import ErrorBoundary from '../../components/ErrorBoundary';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Simple messages object - no external files needed
  const messages = {
    welcome: 'Welcome',
    dashboard: 'Dashboard', 
    openSpend: 'Open Spend',
    title: 'Wu-Wei Cooperative OS'
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
