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

// Theme color keys for referencing dynamic colors
export type ThemeColorKey = keyof ThemeColors;

// Custom color definition (appears in PowerPoint's color picker)
export interface CustomColor {
  name: string;
  color: string; // hex color value
}

export interface TextStyle {
  fontId: string; // ID of the FontAsset
  fontSize: number; // in points
  lineHeight: number; // multiplier (e.g., 1.2 = 120%, 0.9 = 90%)
  letterSpacing: number; // in em (e.g., 0.01)
  color: string; // hex color (fallback or custom)
  colorRef?: ThemeColorKey; // Optional reference to theme color (takes precedence over color)
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

  // Paragraph spacing (CBRE enhancement)
  spaceBefore?: number; // Space before paragraph in points (e.g., 12)
  spaceAfter?: number; // Space after paragraph in points (e.g., 6)

  // Bullet/List formatting (CBRE enhancement)
  bulletChar?: string; // Bullet character: '–' (en dash), '•' (bullet), '' (none)
  bulletMargin?: number; // Left margin for bullets in inches (e.g., 0.19)
  bulletIndent?: number; // Hanging indent for bullets in inches (e.g., -0.19)

  // Alignment (CBRE enhancement)
  alignment?: 'left' | 'center' | 'right' | 'justify';

  // Indentation (CBRE enhancement)
  marginLeft?: number; // Left margin in inches (e.g., 0.375)

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
  // CBRE Complete Typography System (16 styles)

  // Titles & Display
  slideTitle: TextStyle;          // Default slide title (28pt Financier Display)
  titleSlide: TextStyle;          // Title slide large text (88pt Financier Display)
  sectionOpener: TextStyle;       // Section opener display (280pt Calibre Light)

  // Headings
  heading1: TextStyle;            // Primary heading (22pt Calibre Light)
  heading2: TextStyle;            // Secondary heading (16pt Calibre Semibold)
  heading3: TextStyle;            // Tertiary heading (12pt Calibre Semibold)

  // Body & Bullets
  bodyCopy: TextStyle;            // Regular body text (12pt Calibre)
  bodyBullet1: TextStyle;         // First-level bullets (12pt Calibre, en dash)
  bodyBullet2: TextStyle;         // Second-level bullets (12pt Calibre, bullet point)

  // Captions
  caption: TextStyle;             // Caption heading (10.5pt Calibre Semibold)
  captionCopy: TextStyle;         // Caption text (10.5pt Calibre)
  captionBullet: TextStyle;       // Caption bullets (10.5pt Calibre, en dash)

  // Special Elements
  presenterName: TextStyle;       // Presenter name (16pt Calibre Semibold)
  presenterDetails: TextStyle;    // Presenter details (16pt Calibre)
  dateNavigation: TextStyle;      // Date/navigation (10.5pt Space Mono Bold, all caps)
  sectionLabel: TextStyle;        // Section label (10.5pt Space Mono Bold, accent green)

  // Legacy (kept for backwards compatibility - will be deprecated)
  heading?: TextStyle;            // @deprecated Use slideTitle instead
  subtitle?: TextStyle;           // @deprecated Use heading2 instead
  bodyLarge?: TextStyle;          // @deprecated Use bodyCopy instead
  bodySmall?: TextStyle;          // @deprecated Use captionCopy instead
  quote?: TextStyle;              // @deprecated Use sectionLabel instead
  bullet?: TextStyle;             // @deprecated Use bodyBullet1 instead
  link?: TextStyle;               // @deprecated Use bodyCopy with hyperlink color instead
}

export interface TemplateConfig {
  id: string;
  name: string;
  theme: {
    colors: ThemeColors;
    customColors?: CustomColor[]; // Optional custom colors for PowerPoint color picker
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

