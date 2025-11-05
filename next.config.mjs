import createNextIntlPlugin from 'next-intl/plugin';
import {routing} from './i18n/request';

const withNextIntl = createNextIntlPlugin(routing);

const nextConfig = {
  trailingSlash: false
};

export default withNextIntl(nextConfig);