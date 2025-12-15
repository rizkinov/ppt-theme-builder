import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, icon, className }: PageHeaderProps) {
  return (
    <div className={cn("border-b border-light-grey bg-white", className)}>
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="bg-cbre-green p-3 flex-shrink-0">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-financier font-bold text-cbre-green">
              {title}
            </h1>
            <p className="text-dark-grey font-calibre mt-2">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
