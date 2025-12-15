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

  const width = config.slideDimensions.width * scale;
  const height = config.slideDimensions.height * scale;

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
    return {
      fontFamily: style.fontFamily === 'heading' ? 'var(--font-financier-display)' : 'var(--font-calibre)',
      fontSize: `${style.fontSize * scale}pt`,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight,
      letterSpacing: `${style.letterSpacing}em`,
      color: style.color,
      textTransform: style.textTransform,
    };
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className="relative shadow-lg"
        style={{
          width: `${width}px`,
          height: `${height}px`,
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
              left: `${placeholder.x * scale}px`,
              top: `${placeholder.y * scale}px`,
              width: `${placeholder.width * scale}px`,
              height: `${placeholder.height * scale}px`,
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
                    top: `${guide.position * scale}px`,
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
                    left: `${guide.position * scale}px`,
                  }}
                />
              ))}
          </>
        )}

        {/* Border */}
        <div className="absolute inset-0 border-2 border-light-grey pointer-events-none" />
      </div>
    </div>
  );
}
