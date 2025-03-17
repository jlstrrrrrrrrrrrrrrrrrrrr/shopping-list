import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  centered?: boolean;
}

export const PageContainer = ({
  children,
  className,
  centered = false
}: PageContainerProps) => {
  return (
    <div
      className={cn(
        'flex-1 bg-gradient-to-br from-background to-primary/10 p-4 md:p-8',
        centered && 'flex flex-1 flex-col items-center justify-center',
        className
      )}
    >
      {children}
    </div>
  );
};
