"use client";

import React, { useRef, useState } from 'react';
import { CBREButton } from '@/src/components/cbre/CBREButton';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Upload, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FontUploaderProps {
  label: string;
  description?: string;
  fontFamily: string;
  onFontFamilyChange: (family: string) => void;
  fontFile: File | null | undefined;
  onFontFileChange: (file: File | null) => void;
  fontPreviewData?: string;
  className?: string;
}

export function FontUploader({
  label,
  description,
  fontFamily,
  onFontFamilyChange,
  fontFile,
  onFontFileChange,
  fontPreviewData,
  className,
}: FontUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && (file.name.endsWith('.ttf') || file.name.endsWith('.otf') || file.name.endsWith('.TTF') || file.name.endsWith('.OTF'))) {
      onFontFileChange(file);

      // Read file for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          // Create a style element to load the font for preview
          const fontFace = new FontFace(fontFamily, `url(${dataUrl})`);
          fontFace.load().then((loadedFace) => {
            document.fonts.add(loadedFace);
          }).catch((error) => {
            console.error('Error loading font:', error);
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    onFontFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <Label className="text-dark-grey font-calibre font-medium">{label}</Label>
        {description && (
          <p className="text-sm text-dark-grey font-calibre opacity-75 mt-1">
            {description}
          </p>
        )}
      </div>

      {/* Font Family Name */}
      <div className="space-y-2">
        <Label className="text-sm text-dark-grey font-calibre">Font Family Name</Label>
        <Input
          type="text"
          value={fontFamily}
          onChange={(e) => onFontFamilyChange(e.target.value)}
          placeholder="e.g., Financier Display"
          className="font-calibre"
        />
      </div>

      {/* File Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed border-light-grey p-6 transition-colors",
          dragActive && "border-cbre-green bg-lighter-grey",
          "hover:border-cbre-green"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!fontFile ? (
          <div className="flex flex-col items-center gap-3">
            <Upload className="h-8 w-8 text-dark-grey" />
            <div className="text-center">
              <p className="text-sm font-calibre text-dark-grey mb-2">
                Drag and drop your font file here, or
              </p>
              <CBREButton
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </CBREButton>
            </div>
            <p className="text-xs text-dark-grey font-calibre opacity-75">
              Supports TTF and OTF files
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-cbre-green" />
              <div>
                <p className="text-sm font-calibre text-dark-grey font-medium">
                  {fontFile.name}
                </p>
                <p className="text-xs text-dark-grey font-calibre opacity-75">
                  {(fontFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <CBREButton
              variant="outline"
              onClick={handleRemoveFile}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </CBREButton>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".ttf,.otf,.TTF,.OTF"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Font Preview */}
      {fontFile && (
        <div className="p-4 bg-lighter-grey border border-light-grey">
          <p className="text-xs text-dark-grey font-calibre mb-2">Preview:</p>
          <p
            className="text-2xl"
            style={{ fontFamily: fontFamily }}
          >
            The quick brown fox jumps over the lazy dog
          </p>
          <p
            className="text-lg mt-2"
            style={{ fontFamily: fontFamily }}
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
          </p>
          <p
            className="text-lg"
            style={{ fontFamily: fontFamily }}
          >
            abcdefghijklmnopqrstuvwxyz 0123456789
          </p>
        </div>
      )}
    </div>
  );
}
