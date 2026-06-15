/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      const externals = config.externals ?? [];
      config.externals = [...(Array.isArray(externals) ? externals : [externals]), 'qrcode'];
    }
    return config;
  },
};

export default nextConfig;
