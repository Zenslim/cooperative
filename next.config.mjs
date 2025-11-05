import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['*']
    },
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  // Add trailing slash for better routing
  trailingSlash: false,
  // Remove standalone output - it conflicts with multi-locale static generation
};

export default withNextIntl(nextConfig);