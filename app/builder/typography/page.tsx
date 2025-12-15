"use client";

import React from 'react';
import { Type } from 'lucide-react';
import { PageHeader } from '@/src/components/builder/PageHeader';
import { FontUploader } from '@/src/components/builder/FontUploader';
import { TextStyleEditor } from '@/src/components/builder/TextStyleEditor';
import { useBuilderStore } from '@/src/lib/builder/store';
import { CBRECard, CBRECardHeader, CBRECardTitle, CBRECardContent } from '@/src/components/cbre/CBRECard';
import { CBRETabs, CBRETabsList, CBRETabsTrigger, CBRETabsContent } from '@/src/components/cbre/CBRETabs';

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
  const { config, updateFont, updateTextStyle } = useBuilderStore();

  return (
    <div className="min-h-screen bg-lighter-grey">
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
              <strong>Font System:</strong> Upload your brand fonts (TTF/OTF) and they&apos;ll be bundled with your template.
              Users must install these fonts before using the template to ensure proper rendering in PowerPoint.
            </p>
          </CBRECardContent>
        </CBRECard>

        {/* Font Upload Section */}
        <CBRECard>
          <CBRECardHeader>
            <CBRECardTitle>Font Upload</CBRECardTitle>
            <p className="text-sm text-dark-grey font-calibre mt-1">
              Upload your heading and body fonts for the template
            </p>
          </CBRECardHeader>
          <CBRECardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Heading Font */}
              <FontUploader
                label="Heading Font"
                description="Used for titles and headings"
                fontFamily={config.fonts.heading.family}
                onFontFamilyChange={(family) => updateFont('heading', { family })}
                fontFile={config.fonts.heading.file}
                onFontFileChange={(file) => updateFont('heading', { file })}
              />

              {/* Body Font */}
              <FontUploader
                label="Body Font"
                description="Used for body text and paragraphs"
                fontFamily={config.fonts.body.family}
                onFontFamilyChange={(family) => updateFont('body', { family })}
                fontFile={config.fonts.body.file}
                onFontFileChange={(file) => updateFont('body', { file })}
              />
            </div>
          </CBRECardContent>
        </CBRECard>

        {/* Text Styles Section */}
        <CBRECard>
          <CBRECardHeader>
            <CBRECardTitle>Text Styles</CBRECardTitle>
            <p className="text-sm text-dark-grey font-calibre mt-1">
              Define 7 text styles that will be used throughout your template
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
                    onChange={(updates) => updateTextStyle(style.key, updates)}
                  />
                </CBRETabsContent>
              ))}
            </CBRETabs>
          </CBRECardContent>
        </CBRECard>

        {/* All Styles Preview */}
        <CBRECard>
          <CBRECardHeader>
            <CBRECardTitle>Complete Typography Preview</CBRECardTitle>
            <p className="text-sm text-dark-grey font-calibre mt-1">
              Preview all text styles together
            </p>
          </CBRECardHeader>
          <CBRECardContent>
            <div className="space-y-4 p-6 bg-white border border-light-grey">
              {textStyles.map((styleConfig) => {
                const style = config.typography[styleConfig.key];
                return (
                  <div key={styleConfig.key} className="space-y-1">
                    <p className="text-xs text-dark-grey font-calibre opacity-75">
                      {styleConfig.label}:
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
                );
              })}
            </div>
          </CBRECardContent>
        </CBRECard>
      </div>
    </div>
  );
}
