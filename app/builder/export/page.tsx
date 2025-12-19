"use client";

import React, { useState, useRef } from 'react';
import { Download, FileText, CheckCircle, AlertCircle, Loader2, Upload, Save } from 'lucide-react';
import { PageHeader } from '@/src/components/builder/PageHeader';
import { useBuilderStore } from '@/src/lib/builder/store';
import { CBRECard, CBRECardHeader, CBRECardTitle, CBRECardContent } from '@/src/components/cbre/CBRECard';
import { CBREButton } from '@/src/components/cbre/CBREButton';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { toast } from 'sonner';

export default function ExportPage() {
  const { config, updateTemplateName, loadConfig } = useBuilderStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState('');
  const configFileInputRef = useRef<HTMLInputElement>(null);

  const validateConfig = () => {
    const errors: string[] = [];

    if (!config.name || config.name.trim() === '') {
      errors.push('Template name is required');
    }

    if (config.selectedLayouts.length === 0) {
      errors.push('At least one layout must be selected');
    }

    if (!config.fontLibrary || config.fontLibrary.length === 0) {
      errors.push('Font library is empty');
    }

    return errors;
  };

  const handleExport = async () => {
    const errors = validateConfig();
    if (errors.length > 0) {
      errors.forEach((error) => {
        toast.error(error);
      });
      return;
    }

    try {
      setIsExporting(true);
      setExportProgress('Preparing template data...');

      // Create FormData for API request
      const formData = new FormData();
      formData.append('config', JSON.stringify(config));

      // Add font files if they exist
      // NOTE: Font files are now handled via URLs in config.fontLibrary or uploaded to Storage.
      // We don't need to append 'headingFont' or 'bodyFont' blobs here manually anymore,
      // as the backend/export API should fetch them from the URLs provided in config.fontLibrary.

      setExportProgress('Generating PowerPoint template...');

      // Call API to create ZIP
      const response = await fetch('/api/export', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Export failed');
      }

      setExportProgress('Downloading...');

      // Download the ZIP file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.name.replace(/[^a-zA-Z0-9]/g, '_')}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Template exported successfully!');
      setExportProgress('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to export template');
      setExportProgress('');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveConfig = () => {
    // Create a clean config without File objects
    const cleanConfig = {
      ...config,
      fontLibrary: config.fontLibrary.map(f => ({
        ...f,
        file: null // Remove File object for serialization
      })),
    };

    const blob = new Blob([JSON.stringify(cleanConfig, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name.replace(/[^a-zA-Z0-9]/g, '_')}_config.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success('Configuration saved!');
  };

  const handleLoadConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loadedConfig = JSON.parse(event.target?.result as string);
        // Ensure fonts.file is null (File objects can't be serialized)
        // Ensure file objects are null
        loadedConfig.fontLibrary = loadedConfig.fontLibrary.map((f: any) => ({ ...f, file: null }));
        loadConfig(loadedConfig);
        toast.success('Configuration loaded successfully!');
      } catch {
        toast.error('Invalid configuration file');
      }
    };
    reader.readAsText(file);

    // Reset input
    if (configFileInputRef.current) {
      configFileInputRef.current.value = '';
    }
  };

  const errors = validateConfig();
  const isValid = errors.length === 0;

  return (
    <div className="min-h-screen bg-lighter-grey">
      <PageHeader
        title="Export Template"
        description="Download your PowerPoint presentation with fonts and installation instructions."
        icon={<Download className="h-7 w-7 text-white" />}
      />

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
        {/* Configuration Save/Load */}
        <CBRECard variant="outline">
          <CBRECardContent className="py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-calibre text-dark-grey">
                  <strong>Configuration:</strong> Save your current settings to reuse later, or load a previously saved configuration.
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <CBREButton
                  variant="outline"
                  onClick={handleSaveConfig}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Config
                </CBREButton>
                <CBREButton
                  variant="outline"
                  onClick={() => configFileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Load Config
                </CBREButton>
                <input
                  ref={configFileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleLoadConfig}
                  className="hidden"
                />
              </div>
            </div>
          </CBRECardContent>
        </CBRECard>

        {/* Template Name */}
        <CBRECard>
          <CBRECardHeader>
            <CBRECardTitle>Template Information</CBRECardTitle>
            <p className="text-sm text-dark-grey font-calibre mt-1">
              Set the name for your PowerPoint template
            </p>
          </CBRECardHeader>
          <CBRECardContent>
            <div className="space-y-2">
              <Label className="text-dark-grey font-calibre">Template Name</Label>
              <Input
                type="text"
                value={config.name}
                onChange={(e) => updateTemplateName(e.target.value)}
                placeholder="e.g., My Company Template"
                className="font-calibre"
              />
              <p className="text-xs text-dark-grey font-calibre opacity-75">
                This name will be used for the .potx file and ZIP package
              </p>
            </div>
          </CBRECardContent>
        </CBRECard>

        {/* Configuration Summary */}
        <CBRECard>
          <CBRECardHeader>
            <CBRECardTitle>Configuration Summary</CBRECardTitle>
            <p className="text-sm text-dark-grey font-calibre mt-1">
              Review your template settings before exporting
            </p>
          </CBRECardHeader>
          <CBRECardContent>
            <div className="space-y-4">
              {/* Theme Colors */}
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-cbre-green flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-calibre font-medium text-dark-grey">Theme Colors</p>
                  <p className="text-sm text-dark-grey font-calibre opacity-75">
                    12 colors defined
                  </p>
                </div>
              </div>

              {/* Fonts */}
              <div className="flex items-start gap-3">
                {(config.fontLibrary && config.fontLibrary.length > 0) ? (
                  <CheckCircle className="h-5 w-5 text-cbre-green flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-calibre font-medium text-dark-grey">Fonts</p>
                  <p className="text-sm text-dark-grey font-calibre opacity-75">
                    {config.fontLibrary?.length || 0} fonts available
                  </p>
                </div>
              </div>

              {/* Typography */}
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-cbre-green flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-calibre font-medium text-dark-grey">Typography</p>
                  <p className="text-sm text-dark-grey font-calibre opacity-75">
                    7 text styles configured
                  </p>
                </div>
              </div>

              {/* Slide Size */}
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-cbre-green flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-calibre font-medium text-dark-grey">Slide Size</p>
                  <p className="text-sm text-dark-grey font-calibre opacity-75">
                    {config.slideSize === '16:9' ? '16:9 Widescreen' : 'A4 Landscape'} ({config.slideDimensions.width} × {config.slideDimensions.height} {config.slideDimensions.unit})
                  </p>
                </div>
              </div>

              {/* Layouts */}
              <div className="flex items-start gap-3">
                {config.selectedLayouts.length > 0 ? (
                  <CheckCircle className="h-5 w-5 text-cbre-green flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-calibre font-medium text-dark-grey">Slide Layouts</p>
                  <p className="text-sm text-dark-grey font-calibre opacity-75">
                    {config.selectedLayouts.length} layout{config.selectedLayouts.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
              </div>

              {/* Guides */}
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-cbre-green flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-calibre font-medium text-dark-grey">Guides & Grid</p>
                  <p className="text-sm text-dark-grey font-calibre opacity-75">
                    {config.guides.length} guide{config.guides.length !== 1 ? 's' : ''} defined
                  </p>
                </div>
              </div>
            </div>
          </CBRECardContent>
        </CBRECard>

        {/* Validation Errors */}
        {!isValid && (
          <CBRECard variant="outline" className="border-destructive">
            <CBRECardHeader>
              <CBRECardTitle className="text-destructive">Configuration Issues</CBRECardTitle>
              <p className="text-sm text-dark-grey font-calibre mt-1">
                Please fix the following issues before exporting:
              </p>
            </CBRECardHeader>
            <CBRECardContent>
              <ul className="space-y-2">
                {errors.map((error, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-dark-grey font-calibre">{error}</span>
                  </li>
                ))}
              </ul>
            </CBRECardContent>
          </CBRECard>
        )}

        {/* Export Button */}
        <CBRECard>
          <CBRECardHeader>
            <CBRECardTitle>Export Package</CBRECardTitle>
            <p className="text-sm text-dark-grey font-calibre mt-1">
              Download a ZIP file containing your .potx template with master slides, fonts, and instructions
            </p>
          </CBRECardHeader>
          <CBRECardContent>
            <div className="space-y-4">
              <div className="p-4 bg-lighter-grey border border-light-grey space-y-3">
                <div className="flex items-start gap-3">
                  <FileText className="h-6 w-6 text-cbre-green flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-calibre font-medium text-dark-grey">Package Contents:</p>
                    <ul className="text-sm text-dark-grey font-calibre opacity-75 mt-2 space-y-1 list-disc list-inside">
                      <li>{config.name}.potx - PowerPoint Template with proper master slides</li>
                      <li>fonts/ - Custom font files (if uploaded)</li>
                      <li>manifest.json - Template metadata and theme colors</li>
                      <li>README.txt - Installation and usage instructions</li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-light-grey pt-3">
                  <p className="text-xs text-dark-grey font-calibre">
                    <strong>✓ True Template:</strong> This exports a proper .potx file with master slides, theme colors,
                    and font schemes that appear in PowerPoint's Design tab. No manual conversion needed!
                  </p>
                </div>
              </div>

              <CBREButton
                variant="primary"
                onClick={handleExport}
                disabled={!isValid || isExporting}
                className="w-full py-6 text-lg"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {exportProgress || 'Exporting...'}
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Export Template
                  </>
                )}
              </CBREButton>

              <p className="text-xs text-dark-grey font-calibre opacity-75 text-center">
                After downloading, extract the ZIP file and follow the README.txt instructions to install fonts and use the template.
              </p>
            </div>
          </CBRECardContent>
        </CBRECard>
      </div>
    </div>
  );
}
