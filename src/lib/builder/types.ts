/**
 * TypeScript type definitions for PPT Theme Builder
 */

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

export interface FontConfig {
  family: string;
  file?: File | null;
  fileData?: string; // base64 or data URL for preview
}

export interface TextStyle {
  fontFamily: 'heading' | 'body';
  fontSize: number; // in points
  fontWeight: 400 | 500 | 600 | 700;
  lineHeight: number; // multiplier (e.g., 1.2)
  letterSpacing: number; // in em (e.g., 0.01)
  color: string; // hex color
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
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
  fonts: {
    heading: FontConfig;
    body: FontConfig;
  };
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
  fonts: {
    headings: {
      family: string;
      files: string[];
    };
    body: {
      family: string;
      files: string[];
    };
  };
  hashes: Record<string, string>;
  generatedAt: string;
}
