import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'np'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/dashboard': '/dashboard',
    '/open-spend': '/open-spend'
  }
});