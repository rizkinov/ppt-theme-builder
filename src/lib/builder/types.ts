/**
 * TypeScript type definitions for PPT Theme Builder
 */


export interface FontAsset {
  id: string;
  name: string; // Display name e.g. "Calibre SemiBold"
  family: string; // CSS family name e.g. "Calibre"
  weight?: number; // 400, 600, etc.
  style?: 'normal' | 'italic';
  source: 'upload' | 'default';
  url?: string; // for default/uploaded fonts
  file?: File; // for uploaded fonts
}

export interface ThemeColors {
  dark1: string;
  dark2: string;
  light1: string;
  light2: string;
  accent1: string;
  accent2: string;
  accent3: string;
  accent4: string;
  accent5: string;
  accent6: string;
  hyperlink: string;
  followedHyperlink: string;
}

export interface TextStyle {
  fontId: string; // ID of the FontAsset
  fontSize: number; // in points
  lineHeight: number; // multiplier (e.g., 1.2)
  letterSpacing: number; // in em (e.g., 0.01)
  color: string; // hex color
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  // Deprecated properties kept for migration/fallback
  fontWeight?: 300 | 400 | 500 | 600 | 700;
  fontFamily?: string;
}

export type SlideSize = '16:9' | 'A4-landscape';

export interface SlideDimensions {
  width: number; // in pixels
  height: number;
  unit: 'px' | 'mm';
}

export interface Guide {
  id: string;
  orientation: 'horizontal' | 'vertical';
  position: number; // in pixels from top/left
}

export interface LayoutPlaceholder {
  id: string;
  type: 'title' | 'subtitle' | 'body' | 'image' | 'chart' | 'table';
  x: number; // position from left in pixels
  y: number; // position from top in pixels
  width: number; // in pixels
  height: number; // in pixels
}

export interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  placeholders: LayoutPlaceholder[];
  thumbnail?: string; // optional preview image
}

export interface TypographyStyles {
  heading: TextStyle;
  subtitle: TextStyle;
  bodyLarge: TextStyle;
  bodySmall: TextStyle;
  quote: TextStyle;
  bullet: TextStyle;
  link: TextStyle;
}

export interface TemplateConfig {
  id: string;
  name: string;
  theme: {
    colors: ThemeColors;
  };
  fontLibrary: FontAsset[];
  typography: TypographyStyles;
  slideSize: SlideSize;
  slideDimensions: SlideDimensions;
  guides: Guide[];
  selectedLayouts: string[]; // IDs of selected layout templates
}

// Export metadata for the final ZIP package
export interface ExportManifest {
  template: string;
  slideSize: string;
  themeColors: string[];
  fonts: FontAsset[];
  hashes: Record<string, string>;
  generatedAt: string;
}

