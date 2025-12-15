"use client";

import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ColorPicker({
  label,
  description,
  value,
  onChange,
  className,
}: ColorPickerProps) {
  const [hexValue, setHexValue] = useState(value);
  const [copied, setCopied] = useState(false);

  // Sync hexValue when value prop changes
  useEffect(() => {
    setHexValue(value);
  }, [value]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setHexValue(newValue);

    // Validate hex color
    if (/^#[0-9A-F]{6}$/i.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setHexValue(newValue);
    onChange(newValue);
  };

  const handleCopyHex = async () => {
    try {
      await navigator.clipboard.writeText(value.toUpperCase());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-dark-grey font-calibre font-medium">
        {label}
      </Label>
      {description && (
        <p className="text-sm text-dark-grey font-calibre opacity-75">
          {description}
        </p>
      )}

      <div className="flex gap-3 items-center">
        {/* Color preview with native color picker */}
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={handleColorInputChange}
            className="w-16 h-16 cursor-pointer border-2 border-light-grey hover:border-cbre-green transition-colors"
            style={{ padding: 0 }}
          />
        </div>

        {/* Hex input with copy button */}
        <div className="flex-1">
          <div className="relative">
            <Input
              type="text"
              value={hexValue}
              onChange={handleHexChange}
              placeholder="#000000"
              maxLength={7}
              className={cn(
                "font-mono uppercase pr-10",
                !/^#[0-9A-F]{6}$/i.test(hexValue) && "border-destructive"
              )}
            />
            <button
              type="button"
              onClick={handleCopyHex}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-lighter-grey rounded transition-colors"
              title="Copy hex color"
            >
              {copied ? (
                <Check className="h-4 w-4 text-cbre-green" />
              ) : (
                <Copy className="h-4 w-4 text-dark-grey" />
              )}
            </button>
          </div>
          {!/^#[0-9A-F]{6}$/i.test(hexValue) && (
            <p className="text-xs text-destructive mt-1 font-calibre">
              Invalid hex color format
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
