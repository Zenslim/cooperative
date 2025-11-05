'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, LayoutDashboard, Receipt, FileText, AlertCircle, User, Globe } from 'lucide-react';

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    const currentPath = pathname.split('/').slice(2).join('/');
    router.push(`/${newLocale}/${currentPath}`);
  };

  const navItems = [
    { href: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { href: '/open-spend', label: t('nav.openSpend'), icon: Receipt },
    { href: '/proposals', label: t('nav.proposals'), icon: FileText },
    { href: '/challenges', label: t('nav.challenges'), icon: AlertCircle },
  ];

  const currentLocale = pathname.split('/')[1];

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href={`/${currentLocale}/dashboard`} className="flex items-center space-x-2">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <div>
                <h1 className="font-bold text-lg text-gray-900">{t('common.appName')}</h1>
                <p className="text-xs text-gray-500">{t('common.tagline')}</p>
              </div>
            </Link>

            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.includes(item.href);
                return (
                  <Link
                    key={item.href}
                    href={`/${currentLocale}${item.href}`}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => switchLocale(currentLocale === 'en' ? 'np' : 'en')}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <Globe className="w-4 h-4" />
              <span>{currentLocale === 'en' ? 'नेपाली' : 'English'}</span>
            </button>

            <Link
              href={`/${currentLocale}/profile`}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
