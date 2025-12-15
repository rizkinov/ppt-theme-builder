"use client";

import React from 'react';
import { Palette } from 'lucide-react';
import { PageHeader } from '@/src/components/builder/PageHeader';
import { ColorPicker } from '@/src/components/builder/ColorPicker';
import { useBuilderStore } from '@/src/lib/builder/store';
import { CBRECard, CBRECardHeader, CBRECardTitle, CBRECardContent } from '@/src/components/cbre/CBRECard';
import { CBREButton } from '@/src/components/cbre/CBREButton';
import { defaultThemeColors } from '@/src/lib/builder/defaults';

const colorGroups = [
  {
    title: 'Text Colors',
    description: 'Primary colors for text and backgrounds',
    colors: [
      { key: 'dark1' as const, label: 'Dark 1', description: 'Primary dark color for text' },
      { key: 'dark2' as const, label: 'Dark 2', description: 'Secondary dark color' },
      { key: 'light1' as const, label: 'Light 1', description: 'Primary light color/background' },
      { key: 'light2' as const, label: 'Light 2', description: 'Secondary light color' },
    ],
  },
  {
    title: 'Accent Colors',
    description: 'Colors for charts, shapes, and emphasis',
    colors: [
      { key: 'accent1' as const, label: 'Accent 1', description: 'Primary accent' },
      { key: 'accent2' as const, label: 'Accent 2', description: 'Secondary accent' },
      { key: 'accent3' as const, label: 'Accent 3', description: 'Tertiary accent' },
      { key: 'accent4' as const, label: 'Accent 4', description: 'Fourth accent' },
      { key: 'accent5' as const, label: 'Accent 5', description: 'Fifth accent' },
      { key: 'accent6' as const, label: 'Accent 6', description: 'Sixth accent' },
    ],
  },
  {
    title: 'Link Colors',
    description: 'Colors for hyperlinks',
    colors: [
      { key: 'hyperlink' as const, label: 'Hyperlink', description: 'Default link color' },
      { key: 'followedHyperlink' as const, label: 'Followed Hyperlink', description: 'Visited link color' },
    ],
  },
];

export default function ThemePage() {
  const { config, updateThemeColor } = useBuilderStore();

  const handleReset = () => {
    Object.entries(defaultThemeColors).forEach(([key, value]) => {
      updateThemeColor(key as keyof typeof defaultThemeColors, value);
    });
  };

  return (
    <div className="min-h-screen bg-lighter-grey">
      <PageHeader
        title="Theme Colors"
        description="Define your PowerPoint theme's 12-color scheme. These colors will be available throughout your template."
        icon={<Palette className="h-7 w-7 text-white" />}
      />

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Info Card */}
        <CBRECard className="mb-6" variant="outline">
          <CBRECardContent className="py-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-calibre text-dark-grey">
                  <strong>PowerPoint Theme Colors:</strong> These 12 colors form the foundation of your template.
                  They&apos;ll appear in PowerPoint&apos;s color picker and can be used for text, shapes, and charts.
                </p>
                <p className="text-xs font-calibre text-dark-grey opacity-75">
                  Colors are mapped to PowerPoint&apos;s internal theme structure for consistent styling.
                </p>
              </div>
              <CBREButton
                variant="outline"
                onClick={handleReset}
                className="flex-shrink-0 ml-4"
              >
                Reset to CBRE
              </CBREButton>
            </div>
          </CBRECardContent>
        </CBRECard>

        {/* Color Groups */}
        <div className="space-y-6">
          {colorGroups.map((group) => (
            <CBRECard key={group.title}>
              <CBRECardHeader>
                <CBRECardTitle>{group.title}</CBRECardTitle>
                <p className="text-sm text-dark-grey font-calibre mt-1">
                  {group.description}
                </p>
              </CBRECardHeader>
              <CBRECardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {group.colors.map((color) => (
                    <ColorPicker
                      key={color.key}
                      label={color.label}
                      description={color.description}
                      value={config.theme.colors[color.key]}
                      onChange={(value) => updateThemeColor(color.key, value)}
                    />
                  ))}
                </div>
              </CBRECardContent>
            </CBRECard>
          ))}
        </div>

        {/* Color Preview */}
        <CBRECard className="mt-6">
          <CBRECardHeader>
            <CBRECardTitle>Color Palette Preview</CBRECardTitle>
            <p className="text-sm text-dark-grey font-calibre mt-1">
              Quick view of all theme colors
            </p>
          </CBRECardHeader>
          <CBRECardContent>
            <div className="grid grid-cols-6 gap-3">
              {Object.entries(config.theme.colors).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center gap-2">
                  <div
                    className="w-full aspect-square border-2 border-light-grey"
                    style={{ backgroundColor: value }}
                  />
                  <p className="text-xs font-calibre text-dark-grey text-center capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-[10px] font-mono text-dark-grey opacity-75">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </CBRECardContent>
        </CBRECard>
      </div>
    </div>
  );
}
