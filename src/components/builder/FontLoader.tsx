"use client";

import { useEffect, useState } from 'react';
import { useBuilderStore } from '@/src/lib/builder/store';

export function FontLoader() {
    const { config } = useBuilderStore();
    const [styles, setStyles] = useState<string>('');

    useEffect(() => {
        // Generate @font-face rules for ALL fonts (both default and uploaded)
        // Note: We use the exact font family name since the preview components
        // reference fonts by their library entry's family property
        const cssRules = config.fontLibrary
            .filter(font => font.url || font.file)
            .map(font => {
                // Create a temporary object URL if file exists, otherwise use url
                const src = font.file ? URL.createObjectURL(font.file) : font.url;

                // Escape the font family name and add Preview prefix to avoid collisions with UI fonts
                const fontFamily = font.family.replace(/['"\\]/g, '');
                const previewFamily = `Preview ${fontFamily}`;

                return `
          @font-face {
            font-family: '${previewFamily}';
            src: url('${src}') format('opentype');
            font-weight: ${font.weight || 400};
            font-style: ${font.style || 'normal'};
            font-display: block;
            size-adjust: 100%;
            ascent-override: normal;
            descent-override: normal;
            line-gap-override: normal;
          }
        `;
            })
            .join('\n');

        setStyles(cssRules);

        return () => {
            // Cleanup would go here for object URLs
        };
    }, [config.fontLibrary]);

    if (!styles) return null;

    return <style dangerouslySetInnerHTML={{ __html: styles }} />;
}
