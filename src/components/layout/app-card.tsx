import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Scroller } from '@/components/ui/scroller';

interface AppCardProps {
  title?: ReactNode;
  action?: ReactNode;
  /**
   * `false` → body render thẳng, không bọc `Scroller`.
   *
   * Mặc định `true` giữ nguyên hành vi cũ: card trong màn admin có trần chiều
   * cao nên bảng dài không đẩy cả trang. Nhưng nội dung tự nó đã cao tuỳ biến —
   * ví dụ một khung demo — thì vùng cuộn lồng trong trang cuộn là hai thanh
   * cuộn tranh nhau cùng một cử chỉ.
   */
  scroll?: boolean;
  bodyClassName?: string;
  className?: string;
  children: ReactNode;
}

/** Thẻ nội dung dùng chung. Dùng viền thay vì đổ bóng theo quy ước admin. */
export function AppCard({
  title,
  action,
  scroll = true,
  bodyClassName,
  className,
  children,
}: AppCardProps) {
  const body = scroll ? (
    <Scroller className={cn('px-3 py-2 max-h-80', bodyClassName)}>{children}</Scroller>
  ) : (
    <div className={cn('px-3 py-2', bodyClassName)}>{children}</div>
  );

  return (
    <section className={cn('rounded-lg shadow-sm ring-1 ring-foreground/10 overflow-hidden bg-card text-card-foreground', className)}>
      {(title || action) && (
        <header className="flex items-center justify-between flex-wrap bg-primary/5 gap-3 gap-y-1 border-b px-3 py-2">
          {typeof title === 'string' ? (
            <h3 className="font-semibold tracking-tight">{title}</h3>
          ) : (
            title
          )}
          {action && <div className='flex items-center gap-2'>{action}</div>}
        </header>
      )}
      {body}
    </section>
  );
}
