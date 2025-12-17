"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { useBuilderStore } from '@/src/lib/builder/store';
import {
  Palette,
  Type,
  Layout,
  Grid3x3,
  Eye,
  Download,
  FileText,
  RotateCcw
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navItems: NavItem[] = [
  {
    title: 'Theme Colors',
    href: '/builder/theme',
    icon: Palette,
    description: '12-color scheme',
  },
  {
    title: 'Typography',
    href: '/builder/typography',
    icon: Type,
    description: 'Fonts & text styles',
  },
  {
    title: 'Layouts',
    href: '/builder/layouts',
    icon: Layout,
    description: 'Slide templates',
  },
  {
    title: 'Guides',
    href: '/builder/guides',
    icon: Grid3x3,
    description: 'Alignment guides',
  },
  {
    title: 'Preview',
    href: '/builder/preview',
    icon: Eye,
    description: 'Live preview',
  },
  {
    title: 'Export',
    href: '/builder/export',
    icon: Download,
    description: 'Download .potx',
  },
];

export function BuilderSidebar() {
  const pathname = usePathname();
  const { resetConfig } = useBuilderStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetConfig();
    setShowResetConfirm(false);
  };

  return (
    <aside className="w-64 bg-white border-r border-light-grey h-screen fixed top-0 left-0 flex flex-col z-40">
      {/* Header */}
      <div className="p-6 border-b border-light-grey">
        <Link href="/builder/theme" className="flex items-center gap-3 group">
          <div className="bg-cbre-green p-2">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-financier font-bold text-cbre-green group-hover:text-accent-green transition-colors">
              PPT Builder
            </h1>
            <p className="text-xs text-dark-grey font-calibre">Theme Editor</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 transition-colors group border-l-4",
                    "hover:bg-lighter-grey",
                    isActive
                      ? "bg-lighter-grey border-cbre-green"
                      : "border-transparent"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 mt-0.5 flex-shrink-0 transition-colors",
                      isActive ? "text-cbre-green" : "text-dark-grey group-hover:text-cbre-green"
                    )}
                  />
                  <div>
                    <div
                      className={cn(
                        "font-calibre font-medium text-sm transition-colors",
                        isActive ? "text-cbre-green" : "text-dark-grey group-hover:text-cbre-green"
                      )}
                    >
                      {item.title}
                    </div>
                    <div className="text-xs text-dark-grey mt-0.5 font-calibre">
                      {item.description}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-light-grey space-y-3">
        {showResetConfirm ? (
          <div className="p-3 bg-lighter-grey border border-light-grey space-y-2">
            <p className="text-xs text-dark-grey font-calibre">Reset all settings to defaults?</p>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 px-2 py-1 text-xs bg-destructive text-white font-calibre hover:opacity-90 transition-opacity"
              >
                Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-2 py-1 text-xs border border-light-grey text-dark-grey font-calibre hover:bg-lighter-grey transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-dark-grey font-calibre border border-light-grey hover:border-cbre-green hover:text-cbre-green transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset to Defaults
          </button>
        )}
        <div className="text-xs text-dark-grey font-calibre space-y-1">
          <p>PPT Theme Builder</p>
          <p className="text-[10px]">v1.0.0 - MVP</p>
        </div>
      </div>
    </aside>
  );
}
