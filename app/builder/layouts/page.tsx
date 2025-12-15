"use client";

import React from 'react';
import { Layout as LayoutIcon, Check } from 'lucide-react';
import { PageHeader } from '@/src/components/builder/PageHeader';
import { useBuilderStore } from '@/src/lib/builder/store';
import { CBRECard, CBRECardHeader, CBRECardTitle, CBRECardContent } from '@/src/components/cbre/CBRECard';
import { CBRESelect } from '@/src/components/cbre/CBRESelect';
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/src/components/ui/select';
import { defaultLayoutTemplates } from '@/src/lib/builder/defaults';
import { cn } from '@/lib/utils';

export default function LayoutsPage() {
  const { config, updateSlideSize, toggleLayout } = useBuilderStore();

  const renderLayoutPreview = (layoutId: string) => {
    const layout = defaultLayoutTemplates.find((l) => l.id === layoutId);
    if (!layout) return null;

    const scale = 0.15;

    // Normalize to pixels (1mm ≈ 3.7795px at 96 DPI)
    const pixelsPerUnit = config.slideDimensions.unit === 'mm' ? 3.7795 : 1;
    const slideWidthPx = config.slideDimensions.width * pixelsPerUnit;
    const slideHeightPx = config.slideDimensions.height * pixelsPerUnit;

    const width = slideWidthPx * scale;
    const height = slideHeightPx * scale;

    // Scale layout from 1920x1080 reference to current dimensions
    const layoutScaleX = slideWidthPx / 1920;
    const layoutScaleY = slideHeightPx / 1080;

    return (
      <div
        className="bg-white border border-light-grey relative"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {layout.placeholders.map((placeholder) => (
          <div
            key={placeholder.id}
            className={cn(
              "absolute border-2 border-dashed",
              placeholder.type === 'title' && "border-cbre-green bg-cbre-green/5",
              placeholder.type === 'subtitle' && "border-sage bg-sage/5",
              placeholder.type === 'body' && "border-dark-grey bg-dark-grey/5"
            )}
            style={{
              left: `${placeholder.x * layoutScaleX * scale}px`,
              top: `${placeholder.y * layoutScaleY * scale}px`,
              width: `${placeholder.width * layoutScaleX * scale}px`,
              height: `${placeholder.height * layoutScaleY * scale}px`,
            }}
          >
            <div className="flex items-center justify-center h-full">
              <span className="text-[8px] font-calibre text-dark-grey opacity-50">
                {placeholder.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-lighter-grey">
      <PageHeader
        title="Slide Layouts"
        description="Choose slide size and select layout templates for your PowerPoint theme."
        icon={<LayoutIcon className="h-7 w-7 text-white" />}
      />

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
        {/* Info Card */}
        <CBRECard variant="outline">
          <CBRECardContent className="py-4">
            <p className="text-sm font-calibre text-dark-grey">
              <strong>Layout Templates:</strong> Select which slide layouts to include in your template.
              Each layout defines placeholder positions for titles, content, and other elements.
            </p>
          </CBRECardContent>
        </CBRECard>

        {/* Slide Size Section */}
        <CBRECard>
          <CBRECardHeader>
            <CBRECardTitle>Slide Size</CBRECardTitle>
            <p className="text-sm text-dark-grey font-calibre mt-1">
              Choose the dimensions for your presentation
            </p>
          </CBRECardHeader>
          <CBRECardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CBRESelect
                label="Slide Format"
                value={config.slideSize}
                onValueChange={(value) => updateSlideSize(value as typeof config.slideSize)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16:9">16:9 Widescreen</SelectItem>
                  <SelectItem value="A4-landscape">A4 Landscape</SelectItem>
                </SelectContent>
              </CBRESelect>

              <div className="p-4 bg-lighter-grey border border-light-grey">
                <p className="text-xs text-dark-grey font-calibre mb-2">Dimensions:</p>
                <p className="text-lg font-financier text-cbre-green">
                  {config.slideDimensions.width} × {config.slideDimensions.height} {config.slideDimensions.unit}
                </p>
                {config.slideSize === '16:9' && (
                  <p className="text-xs text-dark-grey font-calibre mt-1">
                    Standard widescreen format (1920×1080 pixels)
                  </p>
                )}
                {config.slideSize === 'A4-landscape' && (
                  <p className="text-xs text-dark-grey font-calibre mt-1">
                    A4 paper in landscape orientation
                  </p>
                )}
              </div>
            </div>
          </CBRECardContent>
        </CBRECard>

        {/* Layout Templates Section */}
        <CBRECard>
          <CBRECardHeader>
            <CBRECardTitle>Layout Templates</CBRECardTitle>
            <p className="text-sm text-dark-grey font-calibre mt-1">
              Select which layouts to include in your template
            </p>
          </CBRECardHeader>
          <CBRECardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {defaultLayoutTemplates.map((layout) => {
                const isSelected = config.selectedLayouts.includes(layout.id);

                return (
                  <button
                    key={layout.id}
                    onClick={() => toggleLayout(layout.id)}
                    className={cn(
                      "p-4 border-2 transition-all text-left hover:border-cbre-green group",
                      isSelected ? "border-cbre-green bg-lighter-grey" : "border-light-grey bg-white"
                    )}
                  >
                    {/* Preview */}
                    <div className="mb-3 flex justify-center">
                      {renderLayoutPreview(layout.id)}
                    </div>

                    {/* Info */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={cn(
                          "font-financier font-bold text-base transition-colors",
                          isSelected ? "text-cbre-green" : "text-dark-grey group-hover:text-cbre-green"
                        )}>
                          {layout.name}
                        </h3>
                        <p className="text-xs text-dark-grey font-calibre mt-1">
                          {layout.description}
                        </p>
                        <p className="text-[10px] text-dark-grey font-calibre mt-1 opacity-75">
                          {layout.placeholders.length} placeholder{layout.placeholders.length !== 1 ? 's' : ''}
                        </p>
                      </div>

                      {/* Checkmark */}
                      {isSelected && (
                        <div className="flex-shrink-0 bg-cbre-green p-1 ml-2">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {config.selectedLayouts.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-light-grey mt-4">
                <p className="text-dark-grey font-calibre">
                  No layouts selected. Click on layouts above to add them to your template.
                </p>
              </div>
            )}
          </CBRECardContent>
        </CBRECard>

        {/* Selected Summary */}
        <CBRECard variant="outline">
          <CBRECardContent className="py-4">
            <p className="text-sm font-calibre text-dark-grey">
              <strong>{config.selectedLayouts.length}</strong> layout{config.selectedLayouts.length !== 1 ? 's' : ''} selected
              {config.selectedLayouts.length > 0 && (
                <span className="ml-2">
                  ({config.selectedLayouts.map((id) => {
                    const layout = defaultLayoutTemplates.find((l) => l.id === id);
                    return layout?.name;
                  }).join(', ')})
                </span>
              )}
            </p>
          </CBRECardContent>
        </CBRECard>
      </div>
    </div>
  );
}
