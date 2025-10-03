/** @type {import('next').NextConfig} */
export default {
  webpack: (config) => {
    // Silence optional dependency resolution from pino -> pino-pretty (used by WalletConnect logger)
    // Prevents noisy "Module not found: Can't resolve 'pino-pretty'" during dev
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'pino-pretty': false
    };
    return config;
  }
};
