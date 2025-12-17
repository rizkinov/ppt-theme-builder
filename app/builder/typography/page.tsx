
"use client";

import React from 'react';
import { Type } from 'lucide-react';
import { PageHeader } from '@/src/components/builder/PageHeader';
import { FontManager } from '@/src/components/builder/FontUploader';
import { TextStyleEditor } from '@/src/components/builder/TextStyleEditor';
import { useBuilderStore } from '@/src/lib/builder/store';
import { CBRECard, CBRECardHeader, CBRECardTitle, CBRECardContent } from '@/src/components/cbre/CBRECard';
import { CBRETabs, CBRETabsList, CBRETabsTrigger, CBRETabsContent } from '@/src/components/cbre/CBRETabs';
import { TypeScaleGenerator } from '@/src/components/builder/TypeScaleGenerator';
import { LineSpacingControl } from '@/src/components/builder/LineSpacingControl';
import { FontLoader } from '@/src/components/builder/FontLoader';

const textStyles = [
  { key: 'heading' as const, label: 'Heading', description: 'Main titles and headings (H1)' },
  { key: 'subtitle' as const, label: 'Subtitle', description: 'Secondary headings (H2)' },
  { key: 'bodyLarge' as const, label: 'Body Large', description: 'Large body text for emphasis' },
  { key: 'bodySmall' as const, label: 'Body Small', description: 'Standard body text' },
  { key: 'quote' as const, label: 'Quote', description: 'Block quotes and callouts' },
  { key: 'bullet' as const, label: 'Bullet List', description: 'Bulleted and numbered lists' },
  { key: 'link' as const, label: 'Link', description: 'Hyperlinks and CTAs' },
];

export default function TypographyPage() {
  const { config, updateTextStyle } = useBuilderStore();

  return (
    <div className="min-h-screen bg-lighter-grey">
      <FontLoader />
      <PageHeader
        title="Typography"
        description="Upload custom fonts and define text styles for your PowerPoint template."
        icon={<Type className="h-7 w-7 text-white" />}
      />

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
        {/* Info Card */}
        <CBRECard variant="outline">
          <CBRECardContent className="py-4">
            <p className="text-sm font-calibre text-dark-grey">
              <strong>Workflow:</strong> Upload your fonts first, then set a type scale for harmonious sizes, and finally fine-tune individual styles as needed.
            </p>
          </CBRECardContent>
        </CBRECard>

        {/* Step 1: Font Library */}
        <CBRECard>
          <CBRECardHeader>
            <div className="flex items-center gap-2">
              <span style={{ backgroundColor: '#003F2D' }} className="flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold">1</span>
              <CBRECardTitle>Font Library</CBRECardTitle>
            </div>
            <p className="text-sm text-dark-grey font-calibre mt-1">
              Upload and manage your brand font files (TTF/OTF).
            </p>
          </CBRECardHeader>
          <CBRECardContent>
            <FontManager />
          </CBRECardContent>
        </CBRECard>

        {/* Step 2a: Global Type Scale */}
        <TypeScaleGenerator />

        {/* Step 2b: Line Spacing */}
        <LineSpacingControl />

        {/* Step 4: Text Styles (Fine-tuning) */}
        <CBRECard>
          <CBRECardHeader>
            <div className="flex items-center gap-2">
              <span style={{ backgroundColor: '#003F2D' }} className="flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold">4</span>
              <CBRECardTitle>Text Styles</CBRECardTitle>
            </div>
            <p className="text-sm text-dark-grey font-calibre mt-1">
              Fine-tune each of the 7 text styles used in your template.
            </p>
          </CBRECardHeader>
          <CBRECardContent>
            <CBRETabs defaultValue="heading" variant="underline">
              <CBRETabsList>
                {textStyles.map((style) => (
                  <CBRETabsTrigger key={style.key} value={style.key}>
                    {style.label}
                  </CBRETabsTrigger>
                ))}
              </CBRETabsList>

              {textStyles.map((style) => (
                <CBRETabsContent key={style.key} value={style.key}>
                  <TextStyleEditor
                    label={style.label}
                    description={style.description}
                    style={config.typography[style.key]}
                    fontLibrary={config.fontLibrary || []}
                    themeColors={config.theme.colors}
                    onChange={(updates) => updateTextStyle(style.key, updates)}
                    showPreview={false}
                  />
                </CBRETabsContent>
              ))}
            </CBRETabs>
          </CBRECardContent>
        </CBRECard>

        {/* Final: Complete Typography Preview */}
        <CBRECard>
          <CBRECardHeader>
            <CBRECardTitle>Live Preview</CBRECardTitle>
            <p className="text-sm text-dark-grey font-calibre mt-1">
              See all your text styles rendered together.
            </p>
          </CBRECardHeader>
          <CBRECardContent>
            <div className="space-y-6 p-6 bg-white border border-light-grey rounded-md">
              {textStyles.map((styleConfig) => {
                const style = config.typography[styleConfig.key];
                const fontAsset = (config.fontLibrary || []).find(f => f.id === style.fontId);
                // Resolve color: use theme color if colorRef is set, otherwise use color
                const displayColor = style.colorRef
                  ? config.theme.colors[style.colorRef]
                  : style.color;
                return (
                  <div key={styleConfig.key} className="space-y-1">
                    <p className="text-[10px] text-dark-grey font-calibre opacity-60 uppercase tracking-wider">
                      {styleConfig.label} — {style.fontSize}pt
                    </p>
                    <p
                      style={{
                        fontFamily: fontAsset ? `Preview ${fontAsset.family}` : 'sans-serif',
                        fontSize: `${style.fontSize}pt`,
                        fontWeight: fontAsset?.weight || 'normal',
                        fontStyle: fontAsset?.style || 'normal',
                        lineHeight: style.lineHeight,
                        letterSpacing: `${style.letterSpacing}em`,
                        color: displayColor,
                        textTransform: style.textTransform,
                      }}
                    >
                      The quick brown fox jumps over the lazy dog
                    </p>
                  </div>
                );
              })}
            </div>
          </CBRECardContent>
        </CBRECard>
      </div>
    </div>
  );
}
