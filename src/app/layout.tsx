import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';

import { AppProviders } from '@/components/providers/app-providers';
import { serverGet } from '@/lib/server-api';
import type { AuthUser } from '@/types/auth';

import './globals.css';

// Be Vietnam Pro hỗ trợ đầy đủ dấu tiếng Việt — thay bằng font trong Figma nếu khác
const fontSans = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'GreenX7',
    template: '%s | GreenX7',
  },
  description: 'Nền tảng thực phẩm sạch GreenX7',
  // Dùng APP_URL (không phải NEXT_PUBLIC_) vì metadata chỉ chạy phía server.
  // Biến NEXT_PUBLIC_ bị "nướng" vào bundle lúc build => image Docker sẽ dính cứng
  // một domain, không tái dùng được cho staging/production.
  metadataBase: new URL(process.env.APP_URL ?? 'http://localhost:3000'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1b7a4d',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  /**
   * Lấy user NGAY TRÊN SERVER và truyền xuống provider.
   * Nhờ đó HTML trả về lần đầu đã đúng vai trò người dùng — không có cảnh
   * hiện menu khách rồi mới nhảy sang menu admin sau khi JS chạy xong.
   *
   * Access token hết hạn đã được middleware gia hạn trước khi request tới đây.
   */
  const user = await serverGet<AuthUser>('/auth/me');

  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${fontSans.variable} font-sans`}>
        <AppProviders initialUser={user}>{children}</AppProviders>
      </body>
    </html>
  );
}
