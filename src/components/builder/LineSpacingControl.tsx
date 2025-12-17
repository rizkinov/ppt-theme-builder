"use client";

import React, { useState } from 'react';
import { CBRECard, CBRECardHeader, CBRECardTitle, CBRECardContent } from '@/src/components/cbre/CBRECard';
import { CBRESelect } from '@/src/components/cbre/CBRESelect';
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/src/components/ui/select';
import { Label } from '@/src/components/ui/label';
import { CBREButton } from '@/src/components/cbre/CBREButton';
import { useBuilderStore } from '@/src/lib/builder/store';
import { Check } from 'lucide-react';

// Line spacing presets with industry-standard descriptions
const LINE_SPACING_PRESETS: Record<string, { label: string; heading: number; subtitle: number; body: number; quote: number }> = {
    'cbre': {
        label: 'CBRE Standard',
        heading: 0.9,
        subtitle: 1,
        body: 1,
        quote: 1.1,
    },
    'tight': {
        label: 'Tight (Headlines)',
        heading: 0.9,
        subtitle: 1.0,
        body: 1.4,
        quote: 1.2,
    },
    'standard': {
        label: 'Standard (Balanced)',
        heading: 1.0,
        subtitle: 1.1,
        body: 1.5,
        quote: 1.3,
    },
    'comfortable': {
        label: 'Comfortable (Readable)',
        heading: 1.1,
        subtitle: 1.2,
        body: 1.6,
        quote: 1.4,
    },
    'golden': {
        label: 'Golden Ratio (1.618)',
        heading: 1.0,
        subtitle: 1.2,
        body: 1.618,
        quote: 1.4,
    },
    'accessible': {
        label: 'Accessible (WCAG)',
        heading: 1.2,
        subtitle: 1.3,
        body: 1.75,
        quote: 1.5,
    },
};

export function LineSpacingControl() {
    const { config, updateTextStyle } = useBuilderStore();
    const [preset, setPreset] = useState<string>('cbre');
    const [applied, setApplied] = useState(false);

    const selectedPreset = LINE_SPACING_PRESETS[preset];

    const handleApply = () => {
        // Headings
        updateTextStyle('heading', { lineHeight: selectedPreset.heading });
        updateTextStyle('subtitle', { lineHeight: selectedPreset.subtitle });
        // Body text
        updateTextStyle('bodyLarge', { lineHeight: selectedPreset.body });
        updateTextStyle('bodySmall', { lineHeight: selectedPreset.body });
        updateTextStyle('bullet', { lineHeight: selectedPreset.body });
        updateTextStyle('link', { lineHeight: selectedPreset.body });
        // Quote
        updateTextStyle('quote', { lineHeight: selectedPreset.quote });

        setApplied(true);
        setTimeout(() => setApplied(false), 2000);
    };

    return (
        <CBRECard>
            <CBRECardHeader>
                <div className="flex items-center gap-2">
                    <span style={{ backgroundColor: '#003F2D' }} className="flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold">3</span>
                    <CBRECardTitle>Line Spacing</CBRECardTitle>
                </div>
                <p className="text-sm text-dark-grey font-calibre mt-1">
                    Apply consistent line heights across your typography.
                </p>
            </CBRECardHeader>
            <CBRECardContent className="space-y-6">
                {/* Controls Row */}
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="space-y-2 flex-1">
                        <CBRESelect
                            label="Spacing Preset"
                            value={preset}
                            onValueChange={setPreset}
                        >
                            <SelectTrigger className="h-10">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(LINE_SPACING_PRESETS).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>
                                        {value.label}
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
                        {applied ? <><Check className="w-4 h-4 mr-1" /> Applied!</> : 'Apply Spacing'}
                    </CBREButton>
                </div>

                {/* Preview */}
                <div className="grid grid-cols-4 gap-4 p-4 bg-lighter-grey rounded-md text-center">
                    <div>
                        <p className="text-[10px] text-dark-grey font-calibre opacity-60 mb-1">Heading</p>
                        <p className="text-lg font-financier text-cbre-green">{selectedPreset.heading}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-dark-grey font-calibre opacity-60 mb-1">Subtitle</p>
                        <p className="text-lg font-financier text-dark-grey">{selectedPreset.subtitle}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-dark-grey font-calibre opacity-60 mb-1">Body</p>
                        <p className="text-lg font-calibre text-dark-grey">{selectedPreset.body}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-dark-grey font-calibre opacity-60 mb-1">Quote</p>
                        <p className="text-lg font-calibre text-dark-grey">{selectedPreset.quote}</p>
                    </div>
                </div>

                {/* Description */}
                <p className="text-xs text-dark-grey font-calibre opacity-75">
                    {preset === 'cbre' && 'CBRE brand standard: tight headings (0.9) with single-spaced body text.'}
                    {preset === 'tight' && 'Best for headlines and display text where visual impact matters more than readability.'}
                    {preset === 'standard' && 'Balanced spacing suitable for most presentation contexts.'}
                    {preset === 'comfortable' && 'Extra breathing room for improved readability in text-heavy slides.'}
                    {preset === 'golden' && 'Uses the golden ratio (1.618) for body text — aesthetically pleasing and readable.'}
                    {preset === 'accessible' && 'Meets WCAG accessibility guidelines with generous line spacing (≥1.5 for body).'}
                </p>
            </CBRECardContent>
        </CBRECard>
    );
}
