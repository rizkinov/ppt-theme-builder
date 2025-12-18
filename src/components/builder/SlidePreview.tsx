"use client";

import React from 'react';
import { useBuilderStore } from '@/src/lib/builder/store';
import { LayoutTemplate } from '@/src/lib/builder/types';
import { cn } from '@/lib/utils';

interface SlidePreviewProps {
  layout: LayoutTemplate;
  showGuides?: boolean;
  scale?: number;
  className?: string;
}

export function SlidePreview({
  layout,
  showGuides = false,
  scale = 0.5,
  className,
}: SlidePreviewProps) {
  const { config } = useBuilderStore();

  // Normalize dimensions to pixels for display
  // 1mm = 3.7795px at 96 DPI
  const pixelsPerUnit = config.slideDimensions.unit === 'mm' ? 3.7795 : 1;
  const slideWidthPx = config.slideDimensions.width * pixelsPerUnit;
  const slideHeightPx = config.slideDimensions.height * pixelsPerUnit;

  // Calculate layout scaling factors (mapping 1920x1080 templates to current size)
  const layoutScaleX = slideWidthPx / 1920;
  const layoutScaleY = slideHeightPx / 1080;

  const width = slideWidthPx * scale;
  const height = slideHeightPx * scale;

  const getSampleText = (type: string, styleName: keyof typeof config.typography) => {
    const style = config.typography[styleName];
    switch (type) {
      case 'title':
        return 'Presentation Title';
      case 'subtitle':
        return 'Subtitle Goes Here';
      case 'body':
        return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
      default:
        return 'Content';
    }
  };

  const getTextStyle = (type: string) => {
    let styleName: keyof typeof config.typography;
    switch (type) {
      case 'title':
        styleName = 'heading';
        break;
      case 'subtitle':
        styleName = 'subtitle';
        break;
      case 'body':
      default:
        styleName = 'bodyLarge';
        break;
    }

    const style = config.typography[styleName];
    // Scale font size based on layout scaling to maintain relative proportion
    // Using the average of X and Y scaling to keep it somewhat consistent
    const layoutFontScale = (layoutScaleX + layoutScaleY) / 2;

    const fontAsset = config.fontLibrary.find(f => f.id === style.fontId);
    // Use Preview prefix to match FontLoader's isolated namespace
    const fontFamily = fontAsset ? `Preview ${fontAsset.family}` : 'var(--font-calibre)';

    // Resolve color: use theme color if colorRef is set, otherwise use color
    const displayColor = style.colorRef
      ? config.theme.colors[style.colorRef]
      : style.color;

    return {
      fontFamily: fontFamily,
      fontSize: `${style.fontSize * scale * layoutFontScale}pt`,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
      letterSpacing: `${style.letterSpacing}em`,
      color: displayColor,
      textTransform: style.textTransform,
    };
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className="relative shadow-lg box-content border-2 border-light-grey"
        style={{
          width: `${Math.round(width)}px`,
          height: `${Math.round(height)}px`,
          backgroundColor: config.theme.colors.light1,
        }}
      >
        {/* Placeholders */}
        {layout.placeholders.map((placeholder) => (
          <div
            key={placeholder.id}
            className={cn(
              "absolute overflow-hidden p-2",
              placeholder.type === 'title' && "flex items-center",
              placeholder.type === 'subtitle' && "flex items-center",
              placeholder.type === 'body' && "overflow-auto"
            )}
            style={{
              left: `${Math.round(placeholder.x * layoutScaleX * scale)}px`,
              top: `${Math.round(placeholder.y * layoutScaleY * scale)}px`,
              width: `${Math.round(placeholder.width * layoutScaleX * scale)}px`,
              height: `${Math.round(placeholder.height * layoutScaleY * scale)}px`,
            }}
          >
            <p
              style={getTextStyle(placeholder.type)}
              className="w-full"
            >
              {getSampleText(placeholder.type, 'heading')}
            </p>
          </div>
        ))}

        {/* Guides Overlay */}
        {showGuides && (
          <>
            {config.guides
              .filter((guide) => guide.orientation === 'horizontal')
              .map((guide) => (
                <div
                  key={guide.id}
                  className="absolute left-0 right-0 border-t border-dashed border-accent-green opacity-50"
                  style={{
                    top: `${Math.round(guide.position * layoutScaleY * scale)}px`,
                  }}
                />
              ))}
            {config.guides
              .filter((guide) => guide.orientation === 'vertical')
              .map((guide) => (
                <div
                  key={guide.id}
                  className="absolute top-0 bottom-0 border-l border-dashed border-accent-green opacity-50"
                  style={{
                    left: `${Math.round(guide.position * layoutScaleX * scale)}px`,
                  }}
                />
              ))}
          </>
        )}
      </div>
    </div>
  );
}
