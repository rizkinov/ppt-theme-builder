"use client";

import React, { useState } from 'react';
import { CBRECard, CBRECardHeader, CBRECardTitle, CBRECardContent } from '@/src/components/cbre/CBRECard';
import { CBRESelect } from '@/src/components/cbre/CBRESelect';
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/src/components/ui/select';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { CBREButton } from '@/src/components/cbre/CBREButton';
import { useBuilderStore } from '@/src/lib/builder/store';
import { Check, ArrowRight } from 'lucide-react';

// Fixed presets with specific sizes
const FIXED_PRESETS: Record<string, { label: string; heading: number; subtitle: number; quote: number; bodyLarge: number; bodySmall: number }> = {
    'cbre-standard': {
        label: 'CBRE Standard',
        heading: 56,
        subtitle: 34,
        quote: 28,
        bodyLarge: 20,
        bodySmall: 14,
    },
};

// Modern modular scale ratios
const SCALE_RATIOS: Record<string, string> = {
    'cbre-standard': 'CBRE Standard (56/34/28/20/14)',
    '1.067': 'Minor Second (1.067)',
    '1.125': 'Major Second (1.125)',
    '1.200': 'Minor Third (1.200)',
    '1.250': 'Major Third (1.250)',
    '1.333': 'Perfect Fourth (1.333)',
    '1.414': 'Augmented Fourth (1.414)',
    '1.500': 'Perfect Fifth (1.500)',
    '1.618': 'Golden Ratio (1.618)',
};

export function TypeScaleGenerator() {
    const { config, updateTextStyle } = useBuilderStore();
    const [baseSize, setBaseSize] = useState(14);
    const [scaleRatio, setScaleRatio] = useState<string>('cbre-standard');
    const [applied, setApplied] = useState(false);

    // Check if using CBRE Standard preset
    const isCBREStandard = scaleRatio === 'cbre-standard';

    // Calculate sizes based on hierarchy or use preset
    const calculateSizes = (base: number, ratio: number) => {
        return {
            heading: Math.round(base * Math.pow(ratio, 4)),
            subtitle: Math.round(base * Math.pow(ratio, 3)),
            quote: Math.round(base * Math.pow(ratio, 2)),
            bodyLarge: Math.round(base * ratio),
            bodySmall: Math.round(base),
        };
    };

    const newSizes = isCBREStandard
        ? FIXED_PRESETS['cbre-standard']
        : calculateSizes(baseSize, parseFloat(scaleRatio) || 1.25);

    const handleApply = () => {
        // Body Small, Bullet, and Link all use base/bodySmall size
        updateTextStyle('bodySmall', { fontSize: newSizes.bodySmall });
        updateTextStyle('bullet', { fontSize: newSizes.bodySmall });
        updateTextStyle('link', { fontSize: newSizes.bodySmall });
        // Other styles use the scale
        updateTextStyle('bodyLarge', { fontSize: newSizes.bodyLarge });
        updateTextStyle('quote', { fontSize: newSizes.quote });
        updateTextStyle('subtitle', { fontSize: newSizes.subtitle });
        updateTextStyle('heading', { fontSize: newSizes.heading });
        setApplied(true);
        setTimeout(() => setApplied(false), 2000);
    };

    return (
        <CBRECard>
            <CBRECardHeader>
                <div className="flex items-center gap-2">
                    <span style={{ backgroundColor: '#003F2D' }} className="flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold">2</span>
                    <CBRECardTitle>Type Scale</CBRECardTitle>
                </div>
                <p className="text-sm text-dark-grey font-calibre mt-1">
                    Generate harmonious font sizes using a modular scale ratio.
                </p>
            </CBRECardHeader>
            <CBRECardContent className="space-y-6">
                {/* Controls Row */}
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    {/* Base Size - only show for modular scales, not CBRE Standard */}
                    {!isCBREStandard && (
                        <div className="space-y-2 w-full sm:w-32">
                            <Label className="text-dark-grey font-calibre text-xs">Base Size</Label>
                            <Input
                                type="number"
                                value={baseSize}
                                onChange={(e) => setBaseSize(parseInt(e.target.value) || 16)}
                                min={8}
                                max={32}
                                className="font-calibre h-10"
                            />
                        </div>
                    )}
                    <div className="space-y-2 flex-1">
                        <CBRESelect
                            label="Preset / Scale"
                            value={scaleRatio}
                            onValueChange={setScaleRatio}
                        >
                            <SelectTrigger className="h-10">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(SCALE_RATIOS).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </CBRESelect>
                    </div>
                    <CBREButton
                        variant="primary"
                        onClick={handleApply}
                        className="h-10 whitespace-nowrap px-6"
                    >
                        {applied ? <><Check className="w-4 h-4 mr-1" /> Applied!</> : 'Apply Scale'}
                    </CBREButton>
                </div>

                {/* Compact Visual Scale Preview */}
                <div className="flex items-end gap-1 p-4 bg-lighter-grey rounded-md overflow-x-auto">
                    <div className="flex flex-col items-center gap-1 min-w-fit">
                        <span className="text-[10px] text-dark-grey font-calibre opacity-60">Heading</span>
                        <span style={{ fontSize: `${Math.min(newSizes.heading, 48)}px`, lineHeight: 1 }} className="font-financier text-cbre-green">
                            {newSizes.heading}pt
                        </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-light-grey mx-1 flex-shrink-0" />
                    <div className="flex flex-col items-center gap-1 min-w-fit">
                        <span className="text-[10px] text-dark-grey font-calibre opacity-60">Subtitle</span>
                        <span style={{ fontSize: `${Math.min(newSizes.subtitle, 36)}px`, lineHeight: 1 }} className="font-financier text-dark-grey">
                            {newSizes.subtitle}pt
                        </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-light-grey mx-1 flex-shrink-0" />
                    <div className="flex flex-col items-center gap-1 min-w-fit">
                        <span className="text-[10px] text-dark-grey font-calibre opacity-60">Quote</span>
                        <span style={{ fontSize: `${Math.min(newSizes.quote, 28)}px`, lineHeight: 1 }} className="font-calibre text-dark-grey">
                            {newSizes.quote}pt
                        </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-light-grey mx-1 flex-shrink-0" />
                    <div className="flex flex-col items-center gap-1 min-w-fit">
                        <span className="text-[10px] text-dark-grey font-calibre opacity-60">Body Large</span>
                        <span style={{ fontSize: `${Math.min(newSizes.bodyLarge, 24)}px`, lineHeight: 1 }} className="font-calibre text-dark-grey">
                            {newSizes.bodyLarge}pt
                        </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-light-grey mx-1 flex-shrink-0" />
                    <div className="flex flex-col items-center gap-1 min-w-fit">
                        <span className="text-[10px] text-dark-grey font-calibre opacity-60">Body Small</span>
                        <span style={{ fontSize: `${Math.min(newSizes.bodySmall, 20)}px`, lineHeight: 1 }} className="font-calibre text-dark-grey">
                            {newSizes.bodySmall}pt
                        </span>
                    </div>
                </div>
            </CBRECardContent>
        </CBRECard>
    );
}
