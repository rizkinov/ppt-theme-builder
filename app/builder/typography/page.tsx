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
import { FontLoader } from '@/src/components/builder/FontLoader';

// CBRE Complete Typography System - 16 Named Styles organized by category
const textStyleCategories = [
  {
    category: 'Titles & Display',
    description: 'Large display text for title slides and section openers',
    styles: [
      { key: 'slideTitle' as const, label: 'Slide Title', description: '28pt Financier Display - Default slide title' },
      { key: 'titleSlide' as const, label: 'Title Slide', description: '88pt Financier Display - Large title slide text' },
      { key: 'sectionOpener' as const, label: 'Section Opener', description: '280pt Calibre Light - Dramatic section dividers' },
    ],
  },
  {
    category: 'Headings',
    description: 'Hierarchical heading levels for content structure',
    styles: [
      { key: 'heading1' as const, label: 'Heading 1', description: '22pt Calibre Light - Primary heading' },
      { key: 'heading2' as const, label: 'Heading 2', description: '16pt Calibre Semibold - Secondary heading' },
      { key: 'heading3' as const, label: 'Heading 3', description: '12pt Calibre Semibold - Tertiary heading' },
    ],
  },
  {
    category: 'Body & Bullets',
    description: 'Body text and bulleted lists',
    styles: [
      { key: 'bodyCopy' as const, label: 'Body Copy', description: '12pt Calibre - Regular body text' },
      { key: 'bodyBullet1' as const, label: 'Body Bullet 1', description: '12pt Calibre - First-level bullets (en dash)' },
      { key: 'bodyBullet2' as const, label: 'Body Bullet 2', description: '12pt Calibre - Second-level bullets (bullet)' },
    ],
  },
  {
    category: 'Captions',
    description: 'Small text for image captions and annotations',
    styles: [
      { key: 'caption' as const, label: 'Caption', description: '10.5pt Calibre Semibold - Caption heading' },
      { key: 'captionCopy' as const, label: 'Caption Copy', description: '10.5pt Calibre - Caption text' },
      { key: 'captionBullet' as const, label: 'Caption Bullet', description: '10.5pt Calibre - Caption bullets (en dash)' },
    ],
  },
  {
    category: 'Special Elements',
    description: 'Specialized text for presenters, dates, and labels',
    styles: [
      { key: 'presenterName' as const, label: 'Presenter Name', description: '16pt Calibre Semibold - Main presenter info' },
      { key: 'presenterDetails' as const, label: 'Presenter Details', description: '16pt Calibre - Secondary presenter info' },
      { key: 'dateNavigation' as const, label: 'Date/Navigation', description: '10.5pt Space Mono Bold - Dates and navigation (ALL CAPS)' },
      { key: 'sectionLabel' as const, label: 'Section Label', description: '10.5pt Space Mono Bold - Section labels (ALL CAPS, Accent Green)' },
    ],
  },
];

export default function TypographyPage() {
  const { config, updateTextStyle } = useBuilderStore();
  const [activeTab, setActiveTab] = React.useState('titles-display');

  // Extract fontLibrary and themeColors from config
  const fontLibrary = config.fontLibrary || [];
  const themeColors = config.theme.colors;

  return (
    <div className="min-h-screen bg-lighter-grey">
      <FontLoader />
      <PageHeader
        title="Typography"
        description="Complete CBRE typography system with 16 professional text styles, paragraph spacing, and bullet formatting."
        icon={<Type className="h-7 w-7 text-white" />}
      />

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
        {/* Info Card */}
        <CBRECard variant="outline">
          <CBRECardContent className="py-4">
            <div className="space-y-2">
              <p className="text-sm font-calibre text-dark-grey">
                <strong>CBRE Typography System:</strong> 16 professionally defined text styles with exact specifications from CBRE brand guidelines.
              </p>
              <p className="text-xs font-calibre text-dark-grey">
                Each style includes font family, size, line spacing, paragraph spacing, bullet formatting, and alignment controls.
              </p>
            </div>
          </CBRECardContent>
        </CBRECard>

        {/* Step 1: Font Library */}
        <CBRECard>
          <CBRECardHeader>
            <CBRECardTitle>Step 1: Font Library</CBRECardTitle>
          </CBRECardHeader>
          <CBRECardContent>
            <FontManager />
          </CBRECardContent>
        </CBRECard>

        {/* Step 2: Type Scale (Optional) */}
        <CBRECard>
          <CBRECardHeader>
            <CBRECardTitle>Step 2: Type Scale Generator (Optional)</CBRECardTitle>
          </CBRECardHeader>
          <CBRECardContent>
            <TypeScaleGenerator />
          </CBRECardContent>
        </CBRECard>

        {/* Step 3: Text Styles - Organized by Category */}
        <CBRECard>
          <CBRECardHeader>
            <CBRECardTitle>Step 3: Text Styles Configuration</CBRECardTitle>
          </CBRECardHeader>
          <CBRECardContent className="space-y-6">
            <CBRETabs value={activeTab} onValueChange={setActiveTab} defaultValue="titles-display">
              <CBRETabsList className="grid grid-cols-5 w-full">
                <CBRETabsTrigger value="titles-display">Titles & Display</CBRETabsTrigger>
                <CBRETabsTrigger value="headings">Headings</CBRETabsTrigger>
                <CBRETabsTrigger value="body-bullets">Body & Bullets</CBRETabsTrigger>
                <CBRETabsTrigger value="captions">Captions</CBRETabsTrigger>
                <CBRETabsTrigger value="special">Special</CBRETabsTrigger>
              </CBRETabsList>

              {textStyleCategories.map((category, categoryIndex) => {
                const tabValue = category.category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');

                return (
                  <CBRETabsContent key={categoryIndex} value={tabValue} className="space-y-4">
                    <div className="mb-4">
                      <p className="text-sm font-calibre-semibold text-dark-grey">{category.category}</p>
                      <p className="text-xs font-calibre text-dark-grey mt-1">{category.description}</p>
                    </div>

                    {category.styles.map((style) => (
                      <div key={style.key} className="border border-light-grey rounded p-4 bg-white">
                        <TextStyleEditor
                          label={style.label}
                          description={style.description}
                          style={config.typography[style.key]}
                          fontLibrary={fontLibrary}
                          themeColors={themeColors}
                          onChange={(updates) => updateTextStyle(style.key, updates)}
                          showPreview={true}
                        />
                      </div>
                    ))}
                  </CBRETabsContent>
                );
              })}
            </CBRETabs>
          </CBRECardContent>
        </CBRECard>

        {/* Typography Preview */}
        <CBRECard>
          <CBRECardHeader>
            <CBRECardTitle>Typography Preview</CBRECardTitle>
          </CBRECardHeader>
          <CBRECardContent className="space-y-6">
            {textStyleCategories.map((category) => (
              <div key={category.category} className="space-y-3">
                <h3 className="text-xs font-calibre-semibold text-dark-grey uppercase tracking-wide border-b border-light-grey pb-2">
                  {category.category}
                </h3>
                {category.styles.map((style) => {
                  const textStyle = config.typography[style.key];
                  const fontAsset = config.fontLibrary.find(f => f.id === textStyle.fontId);

                  return (
                    <div key={style.key} className="flex items-baseline gap-4 py-2 border-b border-lighter-grey last:border-0">
                      <div className="w-40 flex-shrink-0">
                        <span className="text-xs font-calibre text-dark-grey">{style.label}</span>
                      </div>
                      <div
                        style={{
                          fontFamily: fontAsset?.family || 'Calibre',
                          fontSize: `${Math.min(textStyle.fontSize, 48)}px`,
                          lineHeight: textStyle.lineHeight,
                          color: textStyle.color,
                          textTransform: textStyle.textTransform || 'none',
                          textAlign: textStyle.alignment || 'left',
                        }}
                        className="flex-1"
                      >
                        {style.label} - {textStyle.fontSize}pt
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </CBRECardContent>
        </CBRECard>
      </div>
    </div>
  );
}
