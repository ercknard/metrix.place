/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, {isServer}) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        net: false,
        tls: false,
        bufferutil: false,
        'utf-8-validate': false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
