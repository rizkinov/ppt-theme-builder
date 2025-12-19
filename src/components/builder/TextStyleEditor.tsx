
"use client";

import React from 'react';
import { Label } from '@/src/components/ui/label';
import { Input } from '@/src/components/ui/input';
import { CBRESelect } from '@/src/components/cbre/CBRESelect';
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/src/components/ui/select';
import { Slider } from '@/src/components/ui/slider';
import { TextStyle, FontAsset, ThemeColors, ThemeColorKey } from '@/src/lib/builder/types';
import { cn } from '@/lib/utils';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

// Theme color options for the dropdown
const THEME_COLOR_OPTIONS: { key: ThemeColorKey; label: string }[] = [
  { key: 'dark1', label: 'Dark 1 (Primary)' },
  { key: 'dark2', label: 'Dark 2 (Secondary)' },
  { key: 'light1', label: 'Light 1' },
  { key: 'light2', label: 'Light 2' },
  { key: 'accent1', label: 'Accent 1' },
  { key: 'accent2', label: 'Accent 2' },
  { key: 'accent3', label: 'Accent 3' },
  { key: 'accent4', label: 'Accent 4' },
  { key: 'accent5', label: 'Accent 5' },
  { key: 'accent6', label: 'Accent 6' },
  { key: 'hyperlink', label: 'Hyperlink' },
  { key: 'followedHyperlink', label: 'Followed Hyperlink' },
];

interface TextStyleEditorProps {
  label: string;
  description?: string;
  style: TextStyle;
  fontLibrary: FontAsset[];
  themeColors: ThemeColors;
  onChange: (updates: Partial<TextStyle>) => void;
  className?: string;
  showPreview?: boolean;
}

export function TextStyleEditor({
  label,
  description,
  style,
  fontLibrary,
  themeColors,
  onChange,
  className,
  showPreview = true,
}: TextStyleEditorProps) {

  const currentFont = fontLibrary.find(f => f.id === style.fontId);

  // Resolve the display color: use theme color if colorRef is set, otherwise use color
  const displayColor = style.colorRef ? themeColors[style.colorRef] : style.color;

  // Handle color source change (theme vs custom)
  const handleColorRefChange = (value: string) => {
    if (value === 'custom') {
      // Switch to custom color, keep current display color
      onChange({ colorRef: undefined, color: displayColor });
    } else {
      // Switch to theme color
      const colorRef = value as ThemeColorKey;
      onChange({ colorRef, color: themeColors[colorRef] });
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h3 className="text-lg font-financier font-bold text-cbre-green">{label}</h3>
        {description && (
          <p className="text-sm text-dark-grey font-calibre mt-1">{description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Font Selection (replaces Family + Weight) */}
        <div className="col-span-2">
          <CBRESelect
            label="Font"
            value={style.fontId || ''}
            onValueChange={(value) => {
              onChange({ fontId: value });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a font..." />
            </SelectTrigger>
            <SelectContent>
              {fontLibrary.map((font) => (
                <SelectItem key={font.id} value={font.id}>
                  <span style={{
                    fontFamily: `Preview ${font.family}`,
                    fontWeight: font.weight || 400,
                    fontStyle: font.style || 'normal'
                  }}>
                    {font.name}
                  </span>
                </SelectItem>
              ))}
              {!fontLibrary.length && <div className="p-2 text-sm text-muted-foreground">No fonts available</div>}
            </SelectContent>
          </CBRESelect>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <Label className="text-dark-grey font-calibre">Font Size (pt)</Label>
          <Input
            type="number"
            value={style.fontSize}
            onChange={(e) => onChange({ fontSize: parseInt(e.target.value) || 12 })}
            min={8}
            max={144}
            className="font-calibre"
          />
        </div>

        {/* Text Transform */}
        <div className="space-y-2">
          <CBRESelect
            label="Text Transform"
            value={style.textTransform || 'none'}
            onValueChange={(value) => onChange({ textTransform: value as TextStyle['textTransform'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="uppercase">UPPERCASE</SelectItem>
              <SelectItem value="lowercase">lowercase</SelectItem>
              <SelectItem value="capitalize">Capitalize</SelectItem>
            </SelectContent>
          </CBRESelect>
        </div>
      </div>

      {/* Line Height */}
      <div className="space-y-2">
        <Label className="text-dark-grey font-calibre">
          Line Height: {style.lineHeight.toFixed(2)}
        </Label>
        <Slider
          value={[style.lineHeight]}
          onValueChange={([value]) => onChange({ lineHeight: value })}
          min={0.8}
          max={3}
          step={0.1}
          className="py-2"
        />
      </div>

      {/* Letter Spacing */}
      <div className="space-y-2">
        <Label className="text-dark-grey font-calibre">
          Letter Spacing: {style.letterSpacing.toFixed(3)}em
        </Label>
        <Slider
          value={[style.letterSpacing]}
          onValueChange={([value]) => onChange({ letterSpacing: value })}
          min={-0.1}
          max={0.2}
          step={0.001}
          className="py-2"
        />
      </div>

      {/* Color */}
      <div className="space-y-2">
        <Label className="text-dark-grey font-calibre">Text Color</Label>
        <div className="flex gap-3 items-end">
          {/* Color swatch preview */}
          <div
            className="w-10 h-10 border-2 border-light-grey flex-shrink-0"
            style={{ backgroundColor: displayColor }}
          />

          {/* Theme color or Custom selector */}
          <div className="flex-1">
            <CBRESelect
              value={style.colorRef || 'custom'}
              onValueChange={handleColorRefChange}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {THEME_COLOR_OPTIONS.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 border border-light-grey"
                        style={{ backgroundColor: themeColors[option.key] }}
                      />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
                <SelectItem value="custom">
                  <span className="text-dark-grey">Custom Color...</span>
                </SelectItem>
              </SelectContent>
            </CBRESelect>
          </div>

          {/* Custom color input - only show when custom is selected */}
          {!style.colorRef && (
            <Input
              type="text"
              value={style.color}
              onChange={(e) => onChange({ color: e.target.value })}
              placeholder="#000000"
              maxLength={7}
              className="font-mono uppercase w-28"
            />
          )}
        </div>
      </div>

      {/* Paragraph Spacing */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-dark-grey font-calibre">Space Before (pt)</Label>
          <Input
            type="number"
            value={style.spaceBefore || 0}
            onChange={(e) => onChange({ spaceBefore: parseFloat(e.target.value) || 0 })}
            min={0}
            max={72}
            step={0.5}
            className="font-calibre"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-dark-grey font-calibre">Space After (pt)</Label>
          <Input
            type="number"
            value={style.spaceAfter || 0}
            onChange={(e) => onChange({ spaceAfter: parseFloat(e.target.value) || 0 })}
            min={0}
            max={72}
            step={0.5}
            className="font-calibre"
          />
        </div>
      </div>

      {/* Alignment */}
      <div className="space-y-2">
        <Label className="text-dark-grey font-calibre">Text Alignment</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange({ alignment: 'left' })}
            className={cn(
              "flex-1 h-10 flex items-center justify-center border transition-colors",
              style.alignment === 'left' || !style.alignment
                ? "border-cbre-green bg-cbre-green/10 text-cbre-green"
                : "border-light-grey text-dark-grey hover:border-dark-grey"
            )}
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChange({ alignment: 'center' })}
            className={cn(
              "flex-1 h-10 flex items-center justify-center border transition-colors",
              style.alignment === 'center'
                ? "border-cbre-green bg-cbre-green/10 text-cbre-green"
                : "border-light-grey text-dark-grey hover:border-dark-grey"
            )}
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChange({ alignment: 'right' })}
            className={cn(
              "flex-1 h-10 flex items-center justify-center border transition-colors",
              style.alignment === 'right'
                ? "border-cbre-green bg-cbre-green/10 text-cbre-green"
                : "border-light-grey text-dark-grey hover:border-dark-grey"
            )}
          >
            <AlignRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChange({ alignment: 'justify' })}
            className={cn(
              "flex-1 h-10 flex items-center justify-center border transition-colors",
              style.alignment === 'justify'
                ? "border-cbre-green bg-cbre-green/10 text-cbre-green"
                : "border-light-grey text-dark-grey hover:border-dark-grey"
            )}
          >
            <AlignJustify className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bullet/List Formatting */}
      <div className="space-y-4 pt-4 border-t border-light-grey">
        <Label className="text-dark-grey font-calibre-semibold">Bullet Formatting</Label>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <CBRESelect
              label="Bullet Character"
              value={style.bulletChar || 'none'}
              onValueChange={(value) => onChange({ bulletChar: value === 'none' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="–">– (En Dash)</SelectItem>
                <SelectItem value="•">• (Bullet)</SelectItem>
                <SelectItem value="◦">◦ (Hollow Bullet)</SelectItem>
                <SelectItem value="▪">▪ (Square)</SelectItem>
              </SelectContent>
            </CBRESelect>
          </div>

          <div className="space-y-2">
            <Label className="text-dark-grey font-calibre">Margin (in)</Label>
            <Input
              type="number"
              value={style.bulletMargin || 0}
              onChange={(e) => onChange({ bulletMargin: parseFloat(e.target.value) || 0 })}
              min={0}
              max={2}
              step={0.01}
              className="font-calibre"
              disabled={!style.bulletChar}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-dark-grey font-calibre">Indent (in)</Label>
            <Input
              type="number"
              value={style.bulletIndent || 0}
              onChange={(e) => onChange({ bulletIndent: parseFloat(e.target.value) || 0 })}
              min={-2}
              max={2}
              step={0.01}
              className="font-calibre"
              disabled={!style.bulletChar}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-dark-grey font-calibre">Left Margin (in)</Label>
          <Input
            type="number"
            value={style.marginLeft || 0}
            onChange={(e) => onChange({ marginLeft: parseFloat(e.target.value) || 0 })}
            min={0}
            max={5}
            step={0.01}
            className="font-calibre"
          />
        </div>
      </div>

      {/* Preview */}
      {showPreview && currentFont && (
        <div className="p-4 bg-lighter-grey border border-light-grey">
          <p className="text-xs text-dark-grey font-calibre mb-2">Preview:</p>
          <p
            style={{
              fontFamily: `Preview ${currentFont.family}`,
              fontSize: `${style.fontSize}pt`,
              lineHeight: style.lineHeight,
              letterSpacing: `${style.letterSpacing}em`,
              color: displayColor,
              textTransform: style.textTransform,
              fontStyle: currentFont.style,
              fontWeight: currentFont.weight || 'normal',
              textAlign: style.alignment || 'left',
              marginLeft: `${(style.marginLeft || 0) * 96}px`, // Convert inches to px for preview
            }}
          >
            {style.bulletChar && <span>{style.bulletChar} </span>}
            The quick brown fox jumps over the lazy dog
          </p>
        </div>
      )}
    </div>
  );
}

