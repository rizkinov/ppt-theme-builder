
"use client";

import React, { useRef, useState } from 'react';
import { CBREButton } from '@/src/components/cbre/CBREButton';
import { Label } from '@/src/components/ui/label';
import { Upload, X, FileText, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FontAsset } from '@/src/lib/builder/types';
import { useBuilderStore } from '@/src/lib/builder/store';
import { supabase } from '@/src/lib/supabase';
import { toast } from 'sonner';

interface FontManagerProps {
  className?: string;
}

export function FontManager({ className }: FontManagerProps) {
  const { config, addFont, removeFont } = useBuilderStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    for (const file of Array.from(files)) {
      if (
        file.name.endsWith('.ttf') ||
        file.name.endsWith('.otf') ||
        file.name.endsWith('.TTF') ||
        file.name.endsWith('.OTF')
      ) {
        try {
          // Simple heuristic to metadata from filename
          const fileNameNoExt = file.name.replace(/\.(ttf|otf)$/i, '');
          let family = fileNameNoExt.split('-')[0] || fileNameNoExt;
          family = family.replace(/([A-Z])/g, ' $1').trim();
          const name = fileNameNoExt.replace(/[-_]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');

          let weight = 400;
          if (name.toLowerCase().includes('bold')) weight = 700;
          else if (name.toLowerCase().includes('semibold')) weight = 600;
          else if (name.toLowerCase().includes('medium')) weight = 500;
          else if (name.toLowerCase().includes('light')) weight = 300;

          const style = name.toLowerCase().includes('italic') ? 'italic' : 'normal';
          const fileId = crypto.randomUUID();
          const filePath = `${fileId}-${file.name}`;

          // Upload to Supabase Storage
          const { data, error } = await supabase.storage
            .from('fonts')
            .upload(filePath, file);

          if (error) {
            console.error('Supabase upload error:', error);
            throw error;
          }

          // Get Public URL
          const { data: { publicUrl } } = supabase.storage
            .from('fonts')
            .getPublicUrl(filePath);

          const newFont: FontAsset = {
            id: fileId,
            name: name,
            family: family,
            weight: weight,
            style: style as 'normal' | 'italic',
            source: 'upload',
            file: file, // Keep file for immediate use, but url will persist
            url: publicUrl,
          };

          // Load font for preview
          const fontFace = new FontFace(name, `url(${newFont.url})`);
          await fontFace.load();
          document.fonts.add(fontFace);

          addFont(newFont);
          toast.success(`Uploaded ${file.name}`);
        } catch (err) {
          console.error('Failed to upload/load font', err);
          toast.error(`Failed to upload ${file.name}`);
        }
      }
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-1">
        <h3 className="text-lg font-financier font-bold text-cbre-green">Font Library</h3>
        <p className="text-sm text-dark-grey font-calibre">
          Manage the fonts available for your template.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed border-light-grey p-8 transition-colors rounded-lg",
          dragActive && "border-cbre-green bg-lighter-grey",
          "hover:border-cbre-green"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <Upload className="h-10 w-10 text-dark-grey opacity-50" />
          <div className="text-center space-y-2">
            <p className="text-base font-calibre text-dark-grey font-medium">
              Drag and drop font files here
            </p>
            <p className="text-xs text-dark-grey opacity-75">
              Supports TTF and OTF files. You can upload multiple files at once.
            </p>
          </div>
          <CBREButton
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2"
          >
            Browse Files
          </CBREButton>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".ttf,.otf,.TTF,.OTF"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Font List */}
      <div className="space-y-3">
        <Label className="text-dark-grey font-calibre font-medium">Available Fonts ({(config.fontLibrary || []).length})</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(config.fontLibrary || []).map((font) => (
            <div
              key={font.id}
              className="group flex items-center justify-between p-3 bg-white border border-light-grey rounded hover:border-cbre-green transition-all"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-lighter-grey p-2 rounded">
                  <FileText className="h-5 w-5 text-cbre-green" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-dark-grey truncate" title={font.name}>
                    {font.name}
                  </p>
                  <p className="text-xs text-dark-grey opacity-75 truncate">
                    {font.family} • {font.weight} • {font.style}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Preview Text */}
                <span
                  className="text-lg opacity-50 hidden group-hover:block"
                  style={{ fontFamily: font.name, fontStyle: font.style }}
                >
                  Aa
                </span>

                {font.source === 'upload' && (
                  <button
                    onClick={() => removeFont(font.id)}
                    className="p-2 text-dark-grey hover:text-destructive hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
