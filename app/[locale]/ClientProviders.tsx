'use client';

import type { AbstractIntlMessages } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

interface ClientProvidersProps {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}

export default function ClientProviders({ children, locale, messages }: ClientProvidersProps) {
  return (
    <ErrorBoundary>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </ErrorBoundary>
  );
}
