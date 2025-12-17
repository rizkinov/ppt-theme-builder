/**
 * Types for Office Open XML PowerPoint generation
 */

export interface OOXMLThemeColors {
  dk1: string;  // Dark 1
  lt1: string;  // Light 1
  dk2: string;  // Dark 2
  lt2: string;  // Light 2
  accent1: string;
  accent2: string;
  accent3: string;
  accent4: string;
  accent5: string;
  accent6: string;
  hlink: string;    // Hyperlink
  folHlink: string; // Followed Hyperlink
}

export interface OOXMLFontScheme {
  majorFont: string;  // Headings
  minorFont: string;  // Body
}

export interface OOXMLSlideSize {
  cx: number;  // Width in EMUs (English Metric Units)
  cy: number;  // Height in EMUs
}

export interface OOXMLPlaceholder {
  type: 'ctrTitle' | 'subTitle' | 'title' | 'body' | 'dt' | 'ftr' | 'sldNum';
  idx: number;
  x: number;   // EMUs
  y: number;   // EMUs
  cx: number;  // EMUs
  cy: number;  // EMUs
}

export interface OOXMLSlideLayout {
  id: string;
  name: string;
  type: string;  // PowerPoint layout type
  placeholders: OOXMLPlaceholder[];
}

export interface OOXMLGuide {
  orient: 'horz' | 'vert';
  pos: number;  // Offset from center in points (12700 EMUs per point). Negative = left/top, Positive = right/bottom
}

/**
 * Master slide guide (PowerPoint 2012+ format with color support)
 * Used in slideMaster1.xml under p:extLst with p15:sldGuideLst
 */
export interface OOXMLMasterGuide {
  id: number;           // Unique guide ID
  orient?: 'horz';      // 'horz' for horizontal, omit for vertical
  pos: number;          // Position in 1/8 points from top-left corner
  color: string;        // RGB hex color (e.g., "F26B43" for CBRE orange)
  userDrawn?: boolean;  // Whether this is a user-drawn guide
}

// 1 inch = 914400 EMUs
// 1 point = 12700 EMUs
// 1 pixel at 96 DPI = 9525 EMUs
export const EMU_PER_INCH = 914400;
export const EMU_PER_POINT = 12700;
export const EMU_PER_PIXEL = 9525;

export function pixelsToEMU(px: number): number {
  return Math.round(px * EMU_PER_PIXEL);
}

export function inchesToEMU(inches: number): number {
  return Math.round(inches * EMU_PER_INCH);
}

export function pointsToEMU(points: number): number {
  return Math.round(points * EMU_PER_POINT);
}

// Standard slide sizes in EMUs
export const SLIDE_SIZES = {
  '16:9': { cx: 12192000, cy: 6858000 },      // 12.8" x 7.2" (widescreen)
  '4:3': { cx: 9144000, cy: 6858000 },        // 10" x 7.5"
  'A4-landscape': { cx: 10691813, cy: 7559675 }, // A4 297mm x 210mm
};


export interface TextStyleConfig {
  fontId: string;  // ID of the font asset
  fontSize: number;
  fontSizePc?: number; // Size in percentage (for some contexts)
  fontWeight?: number; // Explicit weight if needed (though fontId implies it)
  color: string;
  lineHeight: number;
  letterSpacing: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  colorRef?: string;
}

export interface TypographyConfig {
  heading: TextStyleConfig;
  subtitle: TextStyleConfig;
  bodyLarge: TextStyleConfig;
  bodySmall: TextStyleConfig;
  quote: TextStyleConfig;
  bullet: TextStyleConfig;
  link: TextStyleConfig;
}
