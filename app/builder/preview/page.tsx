"use client";

import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { PageHeader } from '@/src/components/builder/PageHeader';
import { SlidePreview } from '@/src/components/builder/SlidePreview';
import { useBuilderStore } from '@/src/lib/builder/store';
import { CBRECard, CBRECardHeader, CBRECardTitle, CBRECardContent } from '@/src/components/cbre/CBRECard';
import { Checkbox } from '@/src/components/cbre/CBRECheckbox';
import { Label } from '@/src/components/ui/label';
import { defaultLayoutTemplates } from '@/src/lib/builder/defaults';

export default function PreviewPage() {
  const { config } = useBuilderStore();
  const [showGuides, setShowGuides] = useState(true);

  const selectedLayouts = defaultLayoutTemplates.filter((layout) =>
    config.selectedLayouts.includes(layout.id)
  );

  return (
    <div className="min-h-screen bg-lighter-grey">
      <PageHeader
        title="Preview"
        description="See how your PowerPoint template will look with the current settings."
        icon={<Eye className="h-7 w-7 text-white" />}
      />

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
        {/* Info Card */}
        <CBRECard variant="outline">
          <CBRECardContent className="py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-calibre text-dark-grey">
                <strong>Live Preview:</strong> This is an approximation of how your slides will look in PowerPoint.
                Actual rendering may vary slightly based on PowerPoint version and platform.
              </p>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="show-guides"
                  checked={showGuides}
                  onCheckedChange={(checked) => setShowGuides(checked as boolean)}
                />
                <Label
                  htmlFor="show-guides"
                  className="text-sm font-calibre text-dark-grey cursor-pointer"
                >
                  Show Guides
                </Label>
              </div>
            </div>
          </CBRECardContent>
        </CBRECard>

        {/* Theme Colors Preview */}
        <CBRECard>
          <CBRECardHeader>
            <CBRECardTitle>Theme Colors</CBRECardTitle>
            <p className="text-sm text-dark-grey font-calibre mt-1">
              Your 12-color theme palette
            </p>
          </CBRECardHeader>
          <CBRECardContent>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-3">
              {Object.entries(config.theme.colors).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center gap-2">
                  <div
                    className="w-full aspect-square border-2 border-light-grey"
                    style={{ backgroundColor: value }}
                  />
                  <p className="text-[10px] font-calibre text-dark-grey text-center">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                </div>
              ))}
            </div>
          </CBRECardContent>
        </CBRECard>

        {/* Typography Styles Preview */}
        <CBRECard>
          <CBRECardHeader>
            <CBRECardTitle>Typography Styles</CBRECardTitle>
            <p className="text-sm text-dark-grey font-calibre mt-1">
              All 7 text styles in your theme
            </p>
          </CBRECardHeader>
          <CBRECardContent>
            <div className="space-y-4 p-6 bg-white border border-light-grey">
              {Object.entries(config.typography).map(([key, style]) => (
                <div key={key} className="space-y-1">
                  <p className="text-xs text-dark-grey font-calibre opacity-75 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </p>
                  <p
                    style={{
                      fontFamily: style.fontFamily === 'heading' ? 'var(--font-financier-display)' : 'var(--font-calibre)',
                      fontSize: `${style.fontSize}pt`,
                      fontWeight: style.fontWeight,
                      lineHeight: style.lineHeight,
                      letterSpacing: `${style.letterSpacing}em`,
                      color: style.color,
                      textTransform: style.textTransform,
                    }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              ))}
            </div>
          </CBRECardContent>
        </CBRECard>

        {/* Layout Previews */}
        <CBRECard>
          <CBRECardHeader>
            <CBRECardTitle>Slide Layouts ({selectedLayouts.length})</CBRECardTitle>
            <p className="text-sm text-dark-grey font-calibre mt-1">
              Preview of your selected layouts
            </p>
          </CBRECardHeader>
          <CBRECardContent>
            {selectedLayouts.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-light-grey">
                <p className="text-dark-grey font-calibre">
                  No layouts selected. Go to the Layouts page to add slide templates.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {selectedLayouts.map((layout) => (
                  <div key={layout.id} className="space-y-3">
                    <div>
                      <h3 className="text-lg font-financier font-bold text-cbre-green">
                        {layout.name}
                      </h3>
                      <p className="text-sm text-dark-grey font-calibre mt-1">
                        {layout.description}
                      </p>
                    </div>
                    <div className="flex justify-center p-6 bg-dark-grey/5 border border-light-grey">
                      <SlidePreview
                        layout={layout}
                        showGuides={showGuides}
                        scale={0.5}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CBRECardContent>
        </CBRECard>

        {/* Summary */}
        <CBRECard>
          <CBRECardHeader>
            <CBRECardTitle>Template Summary</CBRECardTitle>
          </CBRECardHeader>
          <CBRECardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-dark-grey font-calibre opacity-75">Template Name</p>
                <p className="text-lg font-financier text-cbre-green mt-1">{config.name}</p>
              </div>
              <div>
                <p className="text-sm text-dark-grey font-calibre opacity-75">Slide Size</p>
                <p className="text-lg font-financier text-cbre-green mt-1">
                  {config.slideSize === '16:9' ? '16:9 Widescreen' : 'A4 Landscape'}
                </p>
                <p className="text-xs text-dark-grey font-calibre mt-1">
                  {config.slideDimensions.width} × {config.slideDimensions.height} {config.slideDimensions.unit}
                </p>
              </div>
              <div>
                <p className="text-sm text-dark-grey font-calibre opacity-75">Fonts</p>
                <p className="text-sm font-financier text-cbre-green mt-1">
                  Heading: {config.fonts.heading.family}
                </p>
                <p className="text-sm font-calibre text-cbre-green">
                  Body: {config.fonts.body.family}
                </p>
              </div>
            </div>
          </CBRECardContent>
        </CBRECard>
      </div>
    </div>
  );
}
