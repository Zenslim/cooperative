import { createLocalizedPathnamesNavigation, Pathnames } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'np'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/dashboard': {
      en: '/dashboard',
      np: '/dashboard'
    },
    '/open-spend': {
      en: '/open-spend',
      np: '/open-spend'
    }
  } as Pathnames
});

export const { Link, redirect, usePathname, useRouter } = createLocalizedPathnamesNavigation(routing);