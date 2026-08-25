import { CustomerHeader } from '@/components/layout/customer-header';
import { SiteFooter } from '@/components/layout/site-footer';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <CustomerHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
