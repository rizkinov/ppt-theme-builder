"use client";

import React from 'react';
import { Label } from '@/src/components/ui/label';
import { Input } from '@/src/components/ui/input';
import { CBRESelect } from '@/src/components/cbre/CBRESelect';
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/src/components/ui/select';
import { Slider } from '@/src/components/ui/slider';
import { TextStyle } from '@/src/lib/builder/types';
import { cn } from '@/lib/utils';

interface TextStyleEditorProps {
  label: string;
  description?: string;
  style: TextStyle;
  onChange: (updates: Partial<TextStyle>) => void;
  className?: string;
  showPreview?: boolean;
}

export function TextStyleEditor({
  label,
  description,
  style,
  onChange,
  className,
  showPreview = true,
}: TextStyleEditorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h3 className="text-lg font-financier font-bold text-cbre-green">{label}</h3>
        {description && (
          <p className="text-sm text-dark-grey font-calibre mt-1">{description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Font Family */}
        <CBRESelect
          label="Font Family"
          value={style.fontFamily}
          onValueChange={(value: 'heading' | 'body') => onChange({ fontFamily: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="heading">Heading Font</SelectItem>
            <SelectItem value="body">Body Font</SelectItem>
          </SelectContent>
        </CBRESelect>

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

        {/* Font Weight */}
        <CBRESelect
          label="Font Weight"
          value={style.fontWeight.toString()}
          onValueChange={(value) => onChange({ fontWeight: parseInt(value) as 400 | 500 | 600 | 700 })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="400">Regular (400)</SelectItem>
            <SelectItem value="500">Medium (500)</SelectItem>
            <SelectItem value="600">Semi-bold (600)</SelectItem>
            <SelectItem value="700">Bold (700)</SelectItem>
          </SelectContent>
        </CBRESelect>

        {/* Text Transform */}
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
      {showPreview && (
        <div className="p-4 bg-lighter-grey border border-light-grey">
          <p className="text-xs text-dark-grey font-calibre mb-2">Preview:</p>
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
      )}
    </div>
  );
}
