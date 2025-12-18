"use client";

import React, { useState } from 'react';
import { Grid3x3, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/src/components/builder/PageHeader';
import { useBuilderStore } from '@/src/lib/builder/store';
import { CBRECard, CBRECardHeader, CBRECardTitle, CBRECardContent } from '@/src/components/cbre/CBRECard';
import { CBREButton } from '@/src/components/cbre/CBREButton';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { cn } from '@/lib/utils';

export default function GuidesPage() {
  const { config, addGuide, updateGuide, removeGuide, clearGuides } = useBuilderStore();
  const [newGuidePosition, setNewGuidePosition] = useState('');

  // Calculate scale to fit within a max width of ~500px while maintaining aspect ratio
  const maxPreviewWidth = 500;
  const aspectRatio = config.slideDimensions.width / config.slideDimensions.height;

  // For pixel-based dimensions (16:9), use pixel values
  // For mm-based dimensions (A4), convert to a reasonable pixel equivalent
  const slideWidthPx = config.slideDimensions.unit === 'mm'
    ? config.slideDimensions.width * 3.78 // ~96 DPI conversion
    : config.slideDimensions.width;
  const slideHeightPx = config.slideDimensions.unit === 'mm'
    ? config.slideDimensions.height * 3.78
    : config.slideDimensions.height;

  const scale = maxPreviewWidth / slideWidthPx;
  const canvasWidth = slideWidthPx * scale;
  const canvasHeight = slideHeightPx * scale;

  const handleAddGuide = (orientation: 'horizontal' | 'vertical') => {
    const position = parseInt(newGuidePosition);
    if (!isNaN(position) && position >= 0) {
      const maxPosition = orientation === 'vertical' ? slideWidthPx : slideHeightPx;
      if (position <= maxPosition) {
        addGuide(orientation, position);
        setNewGuidePosition('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-lighter-grey">
      <PageHeader
        title="Guides & Grid"
        description="Add visual guides to help with layout alignment in PowerPoint."
        icon={<Grid3x3 className="h-7 w-7 text-white" />}
      />

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
        {/* Info Card */}
        <CBRECard variant="outline">
          <CBRECardContent className="py-4">
            <p className="text-sm font-calibre text-dark-grey">
              <strong>Layout Guides:</strong> These guides will appear in PowerPoint&apos;s master slide view
              to help users align content consistently. Guides are measured in pixels from the top-left corner.
            </p>
          </CBRECardContent>
        </CBRECard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visual Canvas */}
          <CBRECard>
            <CBRECardHeader>
              <CBRECardTitle>Visual Preview</CBRECardTitle>
              <p className="text-sm text-dark-grey font-calibre mt-1">
                Slide dimensions: {Math.round(slideWidthPx)} × {Math.round(slideHeightPx)} px
              </p>
            </CBRECardHeader>
            <CBRECardContent>
              <div className="flex justify-center p-4">
                <div
                  className="relative bg-white border-2 border-light-grey shadow-lg box-content"
                  style={{
                    width: `${canvasWidth}px`,
                    height: `${canvasHeight}px`,
                  }}
                >
                  {/* Horizontal Guides */}
                  {config.guides
                    .filter((guide) => guide.orientation === 'horizontal')
                    .map((guide) => (
                      <div
                        key={guide.id}
                        className="absolute left-0 right-0 border-t border-dashed border-accent-green cursor-pointer hover:border-cbre-green transition-colors group"
                        style={{
                          top: `${guide.position * scale}px`,
                        }}
                        title={`Horizontal guide at ${guide.position}px`}
                      >
                        <div className="absolute -top-4 left-2 bg-accent-green px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] text-white font-calibre font-medium">
                            {guide.position}px
                          </span>
                        </div>
                      </div>
                    ))}

                  {/* Vertical Guides */}
                  {config.guides
                    .filter((guide) => guide.orientation === 'vertical')
                    .map((guide) => (
                      <div
                        key={guide.id}
                        className="absolute top-0 bottom-0 border-l border-dashed border-accent-green cursor-pointer hover:border-cbre-green transition-colors group"
                        style={{
                          left: `${guide.position * scale}px`,
                        }}
                        title={`Vertical guide at ${guide.position}px`}
                      >
                        <div className="absolute -left-8 top-2 bg-accent-green px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] text-white font-calibre font-medium">
                            {guide.position}px
                          </span>
                        </div>
                      </div>
                    ))}

                  {/* Center indicator */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-4 h-4 border-2 border-light-grey opacity-30" />
                  </div>
                </div>
              </div>
            </CBRECardContent>
          </CBRECard>

          {/* Guide Controls */}
          <CBRECard>
            <CBRECardHeader>
              <CBRECardTitle>Add Guides</CBRECardTitle>
              <p className="text-sm text-dark-grey font-calibre mt-1">
                Create horizontal and vertical guides
              </p>
            </CBRECardHeader>
            <CBRECardContent className="space-y-4">
              {/* Add Guide Input */}
              <div className="space-y-3">
                <Label className="text-dark-grey font-calibre">Position (pixels)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={newGuidePosition}
                    onChange={(e) => setNewGuidePosition(e.target.value)}
                    placeholder="e.g., 960"
                    className="flex-1"
                    min={0}
                    max={Math.max(slideWidthPx, slideHeightPx)}
                  />
                </div>
                <div className="flex gap-2">
                  <CBREButton
                    variant="outline"
                    onClick={() => handleAddGuide('vertical')}
                    className="flex-1"
                    disabled={!newGuidePosition}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vertical
                  </CBREButton>
                  <CBREButton
                    variant="outline"
                    onClick={() => handleAddGuide('horizontal')}
                    className="flex-1"
                    disabled={!newGuidePosition}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Horizontal
                  </CBREButton>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="space-y-2">
                <Label className="text-dark-grey font-calibre">Quick Add</Label>
                <div className="grid grid-cols-2 gap-2">
                  <CBREButton
                    variant="outline"
                    onClick={() => {
                      const center = Math.floor(slideWidthPx / 2);
                      addGuide('vertical', center);
                    }}
                    size="sm"
                  >
                    V Center
                  </CBREButton>
                  <CBREButton
                    variant="outline"
                    onClick={() => {
                      const center = Math.floor(slideHeightPx / 2);
                      addGuide('horizontal', center);
                    }}
                    size="sm"
                  >
                    H Center
                  </CBREButton>
                  <CBREButton
                    variant="outline"
                    onClick={() => {
                      const third = Math.floor(slideWidthPx / 3);
                      addGuide('vertical', third);
                      addGuide('vertical', third * 2);
                    }}
                    size="sm"
                  >
                    V Thirds
                  </CBREButton>
                  <CBREButton
                    variant="outline"
                    onClick={() => {
                      const third = Math.floor(slideHeightPx / 3);
                      addGuide('horizontal', third);
                      addGuide('horizontal', third * 2);
                    }}
                    size="sm"
                  >
                    H Thirds
                  </CBREButton>
                </div>
              </div>

              {/* Clear All Guides */}
              {config.guides.length > 0 && (
                <div className="pt-3 border-t border-light-grey">
                  <CBREButton
                    variant="outline"
                    onClick={clearGuides}
                    size="sm"
                    className="w-full text-destructive border-destructive hover:bg-destructive hover:text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Guides ({config.guides.length})
                  </CBREButton>
                </div>
              )}

              {/* CBRE Standard Grid */}
              <div className="space-y-2 pt-3 border-t border-light-grey">
                <Label className="text-dark-grey font-calibre">CBRE Official Grid</Label>
                <p className="text-xs text-dark-grey font-calibre opacity-75">
                  22 columns (6 margin + 16 content), 10 rows (2+6+2)
                </p>
                <CBREButton
                  variant="primary"
                  onClick={() => {
                    // Clear existing guides first
                    clearGuides();

                    /**
                     * CBRE Official Grid for 16:9 slides (1920x1080)
                     * EXACT positions extracted from official CBRE PPT.pptx template
                     * These pixel values are derived from the p15:sldGuideLst in slideMaster1.xml
                     */

                    // EXACT vertical guide positions from CBRE PPT.pptx (in pixels)
                    const verticalPositions = [
                      0, 64, 80, 144, 160, 226, 242, 306, 322, 388, 402, 468,
                      484, 548, 564, 630, 644, 710, 726, 790, 806, 872, 888, 952,
                      968, 1032, 1048, 1114, 1130, 1194, 1210, 1274, 1290, 1356,
                      1372, 1436, 1452, 1516, 1532, 1598, 1614, 1678, 1694, 1758,
                      1774, 1840, 1856, 1920,
                    ];

                    // EXACT horizontal guide positions from CBRE PPT.pptx (in pixels)
                    const horizontalPositions = [
                      0, 56, 72, 138, 154, 236, 252, 334, 350, 434, 450, 532,
                      548, 630, 646, 730, 746, 828, 844, 926, 942, 1008, 1024, 1080,
                    ];

                    // Add vertical guides
                    verticalPositions.forEach((pos) => {
                      addGuide('vertical', pos);
                    });

                    // Add horizontal guides
                    horizontalPositions.forEach((pos) => {
                      addGuide('horizontal', pos);
                    });
                  }}
                  size="sm"
                  className="w-full"
                >
                  CBRE Standard Grid
                </CBREButton>
              </div>

              {/* Safe Area Presets */}
              <div className="space-y-2 pt-3 border-t border-light-grey">
                <Label className="text-dark-grey font-calibre">Quick Margins</Label>
                <p className="text-xs text-dark-grey font-calibre opacity-75">
                  Add margin guides only
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <CBREButton
                    variant="outline"
                    onClick={() => {
                      const marginX = Math.round(slideWidthPx * 0.05); // 5% margin
                      const marginY = Math.round(slideHeightPx * 0.05);
                      addGuide('vertical', marginX);
                      addGuide('vertical', slideWidthPx - marginX);
                      addGuide('horizontal', marginY);
                      addGuide('horizontal', slideHeightPx - marginY);
                    }}
                    size="sm"
                  >
                    5% Margins
                  </CBREButton>
                  <CBREButton
                    variant="outline"
                    onClick={() => {
                      const marginX = Math.round(slideWidthPx * 0.08); // 8% side margins
                      const marginY = Math.round(slideHeightPx * 0.1); // 10% top/bottom
                      addGuide('vertical', marginX);
                      addGuide('vertical', slideWidthPx - marginX);
                      addGuide('horizontal', marginY);
                      addGuide('horizontal', slideHeightPx - marginY);
                    }}
                    size="sm"
                  >
                    Presentation Margins
                  </CBREButton>
                </div>
              </div>
            </CBRECardContent>
          </CBRECard>
        </div>

        {/* Guide List */}
        <CBRECard>
          <CBRECardHeader>
            <CBRECardTitle>Active Guides ({config.guides.length})</CBRECardTitle>
            <p className="text-sm text-dark-grey font-calibre mt-1">
              Manage and edit your guides
            </p>
          </CBRECardHeader>
          <CBRECardContent>
            {config.guides.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-light-grey">
                <Grid3x3 className="h-12 w-12 text-dark-grey opacity-30 mx-auto mb-3" />
                <p className="text-dark-grey font-calibre">
                  No guides added yet. Add guides using the controls above.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {config.guides.map((guide) => (
                  <div
                    key={guide.id}
                    className="flex items-center justify-between p-3 border border-light-grey hover:border-cbre-green transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={cn(
                        "px-3 py-1 text-xs font-calibre font-medium",
                        guide.orientation === 'vertical' ? "bg-[#17E88F] text-cbre-green" : "bg-[#003F2D] text-white"
                      )}>
                        {guide.orientation === 'vertical' ? 'Vertical' : 'Horizontal'}
                      </div>
                      <Input
                        type="number"
                        value={guide.position}
                        onChange={(e) => updateGuide(guide.id, parseInt(e.target.value) || 0)}
                        className="w-32"
                        min={0}
                        max={guide.orientation === 'vertical' ? slideWidthPx : slideHeightPx}
                      />
                      <span className="text-sm text-dark-grey font-calibre">pixels</span>
                    </div>
                    <CBREButton
                      variant="outline"
                      onClick={() => removeGuide(guide.id)}
                      className="flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </CBREButton>
                  </div>
                ))}
              </div>
            )}
          </CBRECardContent>
        </CBRECard>
      </div>
    </div>
  );
}
