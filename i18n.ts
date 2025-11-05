import { getRequestConfig, requestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'np'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async () => {
  const locale = await requestLocale();

  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
