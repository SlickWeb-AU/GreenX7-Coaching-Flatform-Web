import { Leaf } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container flex flex-col items-center justify-between gap-3 py-8 text-sm text-muted-foreground sm:flex-row">
        <span className="flex items-center gap-2 font-medium text-foreground">
          <Leaf className="h-4 w-4 text-primary" aria-hidden />
          GreenX7
        </span>
        <p>© {new Date().getFullYear()} GreenX7. Thực phẩm sạch cho mọi nhà.</p>
      </div>
    </footer>
  );
}
