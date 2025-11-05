import createNextIntlPlugin from 'next-intl/plugin';
import {routing} from './i18n/request.ts';

const withNextIntl = createNextIntlPlugin(routing);

const nextConfig = {
  experimental: {
    trailingSlash: false
  }
};

export default withNextIntl(nextConfig);