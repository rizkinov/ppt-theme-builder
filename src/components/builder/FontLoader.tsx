"use client";

import { useEffect, useState } from 'react';
import { useBuilderStore } from '@/src/lib/builder/store';

export function FontLoader() {
    const { config } = useBuilderStore();
    const [styles, setStyles] = useState<string>('');

    useEffect(() => {
        // Generate @font-face rules for ALL fonts (both default and uploaded)
        const cssRules = config.fontLibrary
            .filter(font => font.url || font.file)
            .map(font => {
                // Create a temporary object URL if file exists, otherwise use url
                const src = font.file ? URL.createObjectURL(font.file) : font.url;

                // Escape the font family name
                const fontFamily = font.family.replace(/['"\\]/g, '');

                return `
          @font-face {
            font-family: '${fontFamily}';
            src: url('${src}') format('opentype');
            font-weight: ${font.weight || 400};
            font-style: ${font.style || 'normal'};
            font-display: swap;
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
