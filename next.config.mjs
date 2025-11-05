import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['*']
    },
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  // Add trailing slash for better routing
  trailingSlash: true,
  // Output standalone for better compatibility
  output: 'standalone'
};

export default withNextIntl(nextConfig);
