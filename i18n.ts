import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'np'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';

function isLocale(input: string | undefined): input is Locale {
  return !!input && locales.includes(input as Locale);
}

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const activeLocale = locale ?? (await requestLocale);

  if (!isLocale(activeLocale)) notFound();

  return {
    locale: activeLocale,
    messages: (await import(`./messages/${activeLocale}.json`)).default
  };
});
