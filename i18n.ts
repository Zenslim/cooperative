import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'np'] as const;
export type Locale = typeof locales[number];

const isLocale = (value: string): value is Locale => locales.includes(value as Locale);

export default getRequestConfig(async ({ locale }) => {
  if (!isLocale(locale)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
