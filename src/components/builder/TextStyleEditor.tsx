
"use client";

import React from 'react';
import { Label } from '@/src/components/ui/label';
import { Input } from '@/src/components/ui/input';
import { CBRESelect } from '@/src/components/cbre/CBRESelect';
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/src/components/ui/select';
import { Slider } from '@/src/components/ui/slider';
import { TextStyle, FontAsset } from '@/src/lib/builder/types';
import { cn } from '@/lib/utils';

interface TextStyleEditorProps {
  label: string;
  description?: string;
  style: TextStyle;
  fontLibrary: FontAsset[];
  onChange: (updates: Partial<TextStyle>) => void;
  className?: string;
  showPreview?: boolean;
}

export function TextStyleEditor({
  label,
  description,
  style,
  fontLibrary,
  onChange,
  className,
  showPreview = true,
}: TextStyleEditorProps) {

  const currentFont = fontLibrary.find(f => f.id === style.fontId);

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
              // Find the font to see if we need to set fallback props?
              // For now just set the ID.
              onChange({ fontId: value });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a font..." />
            </SelectTrigger>
            <SelectContent>
              {fontLibrary.map((font) => (
                <SelectItem key={font.id} value={font.id}>
                  <span style={{ fontFamily: font.name }}>{font.name}</span>
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
        <div className="flex gap-3 items-center">
          <input
            type="color"
            value={style.color}
            onChange={(e) => onChange({ color: e.target.value })}
            className="w-16 h-10 cursor-pointer border-2 border-light-grey hover:border-cbre-green transition-colors"
          />
          <Input
            type="text"
            value={style.color}
            onChange={(e) => onChange({ color: e.target.value })}
            placeholder="#000000"
            maxLength={7}
            className="font-mono uppercase flex-1"
          />
        </div>
      </div>

      {/* Preview */}
      {showPreview && currentFont && (
        <div className="p-4 bg-lighter-grey border border-light-grey">
          <p className="text-xs text-dark-grey font-calibre mb-2">Preview:</p>
          <p
            style={{
              fontFamily: currentFont.name, // Use the display name which should match the loaded font face
              fontSize: `${style.fontSize}pt`,
              lineHeight: style.lineHeight,
              letterSpacing: `${style.letterSpacing}em`,
              color: style.color,
              textTransform: style.textTransform,
              fontStyle: currentFont.style,
              fontWeight: currentFont.weight || 'normal',
            }}
          >
            The quick brown fox jumps over the lazy dog
          </p>
        </div>
      )}
    </div>
  );
}
