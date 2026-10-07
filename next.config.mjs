/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Đóng gói app + đúng những dependency thực sự dùng vào .next/standalone
  // => image Docker ~150MB thay vì ~1GB kéo theo cả node_modules.
  output: 'standalone',

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Thêm domain CDN của bạn ở đây
    ],
  },

  // Header bảo mật cơ bản — bổ sung CSP khi biết chính xác domain asset
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Email (báo cáo, mời quản trị viên, mã đăng nhập) nạp Satoshi từ đây qua
        // @font-face. Font tải từ domain khác bắt buộc có CORS, thiếu header này
        // Apple Mail/iOS lùi về Arial. Font là file công khai nên mở cho mọi nơi.
        source: '/fonts/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
