/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tắt SWC và sử dụng Babel thay thế
  swcMinify: false,
  
  // Cấu hình domain cho images
  images: {
    domains: ["res.cloudinary.com"],
  },
  
  // Transpile các package sử dụng cú pháp ECMAScript hiện đại
  transpilePackages: ['undici', 'firebase', '@firebase/app', '@firebase/util'],
  
  webpack: (config, { isServer }) => {
    // Chỉ áp dụng các cấu hình cho client-side
    if (!isServer) {
      // Cấu hình fallback cụ thể
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    
    return config;
  },
  
  // Bỏ qua lỗi ESLint trong quá trình build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 