/**
 * Default values and layout templates for PPT Theme Builder
 * Using CBRE brand colors and standards
 */

import { ThemeColors, TypographyStyles, LayoutTemplate, SlideDimensions, SlideSize, TemplateConfig, FontAsset, CustomColor } from './types';
import cbreTheme from '../../../config/cbre-theme';

// Default CBRE theme colors mapped to PowerPoint's 12-color scheme
// Matches CBRE PPT.pptx exactly
export const defaultThemeColors: ThemeColors = {
  dark1: '#435254',      // Dark Grey (dk1 in CBRE PPT.pptx)
  dark2: '#DBD99A',      // Wheat (dk2 in CBRE PPT.pptx)
  light1: '#FFFFFF',     // White (lt1 in CBRE PPT.pptx)
  light2: '#80BBAD',     // Celadon (lt2 in CBRE PPT.pptx)
  accent1: '#1F3765',    // Data Blue (accent1 in CBRE PPT.pptx)
  accent2: '#3E7CA6',    // Data Lt. Blue (accent2 in CBRE PPT.pptx)
  accent3: '#CAD1D3',    // Light Grey (accent3 in CBRE PPT.pptx)
  accent4: '#96B3B6',    // Sage Tint (accent4 in CBRE PPT.pptx)
  accent5: '#7F8481',    // Cement (accent5 in CBRE PPT.pptx)
  accent6: '#003F2D',    // Primary Green (accent6 in CBRE PPT.pptx)
  hyperlink: '#538184',  // Sage (hlink in CBRE PPT.pptx)
  followedHyperlink: '#538184', // Sage (folHlink in CBRE PPT.pptx)
};

// Default CBRE custom colors from CBRE PPT.pptx
// These appear in PowerPoint's color picker for easy access
export const defaultCustomColors: CustomColor[] = [
  // Data Visualization Colors
  { name: 'Celadon (Data Viz 1)', color: '#80BBAD' },
  { name: 'Dark Grey (Data Viz 2)', color: '#435254' },
  { name: 'Accent Green (Data Viz 3)', color: '#17E88F' },
  { name: 'Wheat (Data Viz 4)', color: '#DBD99A' },
  { name: 'Data Orange (Data Viz 5)', color: '#D2785A' },
  { name: 'Data Purple (Data Viz 6)', color: '#885073' },
  { name: 'Data Lt. Purple (Data Viz 7)', color: '#A388BF' },
  { name: 'Data Blue (Data Viz 8)', color: '#1F3765' },
  { name: 'Data Lt. Blue (Data Viz 9)', color: '#3E7CA6' },
  { name: 'Light Grey (Data Viz 10)', color: '#CAD1D3' },

  // Special Purpose Colors
  { name: 'Negative Value Red', color: '#AD2A2A' },
  { name: 'DataViz Background (20% Lt. Grey)', color: '#F6F6F6' },

  // Primary Brand Colors
  { name: 'Primary Green (Primary)', color: '#003F2D' },
  { name: 'Accent Green (Primary)', color: '#17E88F' },
  { name: 'Dark Green (Primary)', color: '#012A2D' },
  { name: 'Dark Grey (Primary)', color: '#435254' },
  { name: 'Light Grey (Primary)', color: '#CAD1D3' },

  // Secondary Brand Colors
  { name: 'Midnight (Secondary)', color: '#032842' },
  { name: 'Sage (Secondary)', color: '#538184' },
  { name: 'Celadon (Secondary)', color: '#80BBAD' },
  { name: 'Wheat (Secondary)', color: '#DBD99A' },
  { name: 'Cement (Secondary)', color: '#7F8480' },

  // Secondary Brand Tints
  { name: 'Midnight Tint (Secondary)', color: '#778F9C' },
  { name: 'Sage Tint (Secondary)', color: '#96B3B6' },
  { name: 'Celadon Tint (Secondary)', color: '#C0D4CB' },
  { name: 'Wheat Tint (Secondary)', color: '#EFECD2' },
  { name: 'Cement Tint (Secondary)', color: '#CBCDCB' },
];

// Default Font Library
export const defaultFontLibrary: FontAsset[] = [
  // Calibre Family
  { id: 'calibre-regular', name: 'Calibre Regular', family: 'Calibre', weight: 400, style: 'normal', source: 'default', url: '/fonts/Calibre/Calibre-Regular.otf' },
  { id: 'calibre-regular-italic', name: 'Calibre Regular Italic', family: 'Calibre', weight: 400, style: 'italic', source: 'default', url: '/fonts/Calibre/Calibre-RegularItalic.otf' },
  { id: 'calibre-medium', name: 'Calibre Medium', family: 'Calibre', weight: 500, style: 'normal', source: 'default', url: '/fonts/Calibre/Calibre-Medium.otf' },
  { id: 'calibre-semibold', name: 'Calibre SemiBold', family: 'Calibre', weight: 600, style: 'normal', source: 'default', url: '/fonts/Calibre/Calibre-Semibold.otf' },
  { id: 'calibre-bold', name: 'Calibre Bold', family: 'Calibre', weight: 700, style: 'normal', source: 'default', url: '/fonts/Calibre/Calibre-Bold.otf' },
  { id: 'calibre-light', name: 'Calibre Light', family: 'Calibre', weight: 300, style: 'normal', source: 'default', url: '/fonts/Calibre/Calibre-Light.otf' },
  { id: 'calibre-light-italic', name: 'Calibre Light Italic', family: 'Calibre', weight: 300, style: 'italic', source: 'default', url: '/fonts/Calibre/Calibre-LightItalic.otf' },

  // Financier Display Family
  { id: 'financier-regular', name: 'Financier Display Regular', family: 'Financier Display', weight: 400, style: 'normal', source: 'default', url: '/fonts/Financier Display/FinancierDisplay-Regular.otf' },
  { id: 'financier-regular-italic', name: 'Financier Display Regular Italic', family: 'Financier Display', weight: 400, style: 'italic', source: 'default', url: '/fonts/Financier Display/FinancierDisplay-RegularItalic.otf' },
  { id: 'financier-medium', name: 'Financier Display Medium', family: 'Financier Display', weight: 500, style: 'normal', source: 'default', url: '/fonts/Financier Display/FinancierDisplay-Medium.otf' },
  { id: 'financier-medium-italic', name: 'Financier Display Medium Italic', family: 'Financier Display', weight: 500, style: 'italic', source: 'default', url: '/fonts/Financier Display/FinancierDisplay-MediumItalic.otf' },
  { id: 'financier-semibold', name: 'Financier Display SemiBold', family: 'Financier Display', weight: 600, style: 'normal', source: 'default', url: '/fonts/Financier Display/FinancierDisplay-Semibold.otf' },
  { id: 'financier-semibold-italic', name: 'Financier Display SemiBold Italic', family: 'Financier Display', weight: 600, style: 'italic', source: 'default', url: '/fonts/Financier Display/FinancierDisplay-SemiboldItalic.otf' },

  // Space Mono Family (for dates, navigation, technical labels)
  { id: 'space-mono-bold', name: 'Space Mono Bold', family: 'Space Mono', weight: 700, style: 'normal', source: 'default', url: '/fonts/Space Mono/SpaceMono-Bold.ttf' },
  { id: 'space-mono-regular', name: 'Space Mono Regular', family: 'Space Mono', weight: 400, style: 'normal', source: 'default', url: '/fonts/Space Mono/SpaceMono-Regular.ttf' },
];

// Complete CBRE Typography System - 16 Named Styles
// Based on CBRE PPT.pptx analysis
// Line spacing: 75% (tight titles), 80% (display), 90% (headings), 100% (body)
// Colors use colorRef to automatically sync with theme colors
export const defaultTypography: TypographyStyles = {
  // ============================================================================
  // TITLES & DISPLAY
  // ============================================================================

  slideTitle: {
    fontId: 'financier-regular',
    fontSize: 28,
    lineHeight: 0.9, // 90% line spacing
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark1', // tx1 (dark text)
    textTransform: 'none',
    alignment: 'left',
  },

  titleSlide: {
    fontId: 'financier-regular',
    fontSize: 88,
    lineHeight: 0.75, // 75% line spacing (tight)
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark1', // tx1 (dark text)
    textTransform: 'none',
    alignment: 'left',
  },

  sectionOpener: {
    fontId: 'calibre-light',
    fontSize: 280,
    lineHeight: 0.8, // 80% line spacing
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark1', // tx1 (dark text)
    textTransform: 'none',
    alignment: 'right',
  },

  // ============================================================================
  // HEADINGS
  // ============================================================================

  heading1: {
    fontId: 'calibre-light',
    fontSize: 22,
    lineHeight: 0.9, // 90% line spacing
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark1', // tx1
    textTransform: 'none',
    spaceBefore: 12,
    spaceAfter: 6,
    alignment: 'left',
  },

  heading2: {
    fontId: 'calibre-semibold',
    fontSize: 16,
    lineHeight: 1.0, // 100% line spacing
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark1', // tx1
    textTransform: 'none',
    spaceAfter: 6,
    alignment: 'left',
  },

  heading3: {
    fontId: 'calibre-semibold',
    fontSize: 12,
    lineHeight: 1.0, // 100% line spacing
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark1', // tx1
    textTransform: 'none',
    spaceBefore: 6,
    spaceAfter: 0,
    alignment: 'left',
  },

  // ============================================================================
  // BODY & BULLETS
  // ============================================================================

  bodyCopy: {
    fontId: 'calibre-regular',
    fontSize: 12,
    lineHeight: 1.0, // 100% line spacing
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark1', // tx1
    textTransform: 'none',
    spaceBefore: 3,
    spaceAfter: 3,
    alignment: 'left',
  },

  bodyBullet1: {
    fontId: 'calibre-regular',
    fontSize: 12,
    lineHeight: 1.0, // 100% line spacing
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark1', // tx1
    textTransform: 'none',
    spaceBefore: 3,
    spaceAfter: 3,
    bulletChar: '–', // en dash (U+2013)
    bulletMargin: 0.19, // ~171450 EMU
    bulletIndent: -0.19, // hanging indent
    alignment: 'left',
  },

  bodyBullet2: {
    fontId: 'calibre-regular',
    fontSize: 12,
    lineHeight: 1.0, // 100% line spacing
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark1', // tx1
    textTransform: 'none',
    spaceBefore: 3,
    spaceAfter: 3,
    bulletChar: '•', // bullet point (U+2022)
    bulletMargin: 0.4, // ~365760 EMU
    bulletIndent: -0.2, // hanging indent (~182880 EMU)
    alignment: 'left',
  },

  // ============================================================================
  // CAPTIONS
  // ============================================================================

  caption: {
    fontId: 'calibre-semibold',
    fontSize: 10.5,
    lineHeight: 1.0, // 100% line spacing
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark1', // tx1
    textTransform: 'none',
    spaceBefore: 6,
    spaceAfter: 0,
    alignment: 'left',
  },

  captionCopy: {
    fontId: 'calibre-regular',
    fontSize: 10.5,
    lineHeight: 1.0, // 100% line spacing
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark1', // tx1
    textTransform: 'none',
    spaceBefore: 3,
    spaceAfter: 3,
    alignment: 'left',
  },

  captionBullet: {
    fontId: 'calibre-regular',
    fontSize: 10.5,
    lineHeight: 1.0, // 100% line spacing
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark1', // tx1
    textTransform: 'none',
    spaceBefore: 2,
    spaceAfter: 2,
    bulletChar: '–', // en dash (U+2013)
    bulletMargin: 0.19, // ~171450 EMU
    bulletIndent: -0.19, // hanging indent
    alignment: 'left',
  },

  // ============================================================================
  // SPECIAL ELEMENTS
  // ============================================================================

  presenterName: {
    fontId: 'calibre-semibold',
    fontSize: 16,
    lineHeight: 1.0, // 100% line spacing
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark1', // tx1
    textTransform: 'none',
    alignment: 'left',
  },

  presenterDetails: {
    fontId: 'calibre-regular',
    fontSize: 16,
    lineHeight: 1.0, // 100% line spacing
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark1', // tx1
    textTransform: 'none',
    alignment: 'left',
  },

  dateNavigation: {
    fontId: 'space-mono-bold',
    fontSize: 10.5,
    lineHeight: 1.0, // 100% line spacing
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark1', // tx1 (can be overridden per layout)
    textTransform: 'uppercase', // ALL CAPS
    alignment: 'center',
  },

  sectionLabel: {
    fontId: 'space-mono-bold',
    fontSize: 10.5,
    lineHeight: 1.0, // 100% line spacing
    letterSpacing: 0,
    color: '#17E88F',
    colorRef: 'accent1', // Accent Green
    textTransform: 'uppercase', // ALL CAPS
    alignment: 'center',
  },

  // ============================================================================
  // LEGACY STYLES (backwards compatibility - kept to prevent breaking changes)
  // ============================================================================

  heading: {
    fontId: 'financier-regular',
    fontSize: 56,
    lineHeight: 0.9,
    letterSpacing: 0,
    color: '#003F2D',
    colorRef: 'accent6',
    textTransform: 'none',
  },

  subtitle: {
    fontId: 'calibre-medium',
    fontSize: 34,
    lineHeight: 1.0,
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark1',
    textTransform: 'none',
  },

  bodyLarge: {
    fontId: 'calibre-light',
    fontSize: 20,
    lineHeight: 1.0,
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark1',
    textTransform: 'none',
  },

  bodySmall: {
    fontId: 'calibre-regular',
    fontSize: 14,
    lineHeight: 1.0,
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark1',
    textTransform: 'none',
  },

  quote: {
    fontId: 'financier-regular',
    fontSize: 28,
    lineHeight: 1.1,
    letterSpacing: 0,
    color: '#538184',
    colorRef: 'hyperlink',
    textTransform: 'none',
  },

  bullet: {
    fontId: 'calibre-regular',
    fontSize: 14,
    lineHeight: 1.0,
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark1',
    textTransform: 'none',
  },

  link: {
    fontId: 'calibre-regular',
    fontSize: 14,
    lineHeight: 1.0,
    letterSpacing: 0,
    color: defaultThemeColors.hyperlink,
    colorRef: 'hyperlink',
    textTransform: 'none',
  },
};

// Slide size dimensions
export const slideDimensions: Record<SlideSize, SlideDimensions> = {
  '16:9': {
    width: 1920,
    height: 1080,
    unit: 'px',
  },
  'A4-landscape': {
    width: 297,
    height: 210,
    unit: 'mm',
  },
};

// ============================================================================
// CBRE GRID-ALIGNED LAYOUT TEMPLATES
// ============================================================================
// Grid Constants extracted from CBRE PPT.pptx (p15:sldGuideLst):
//
// HORIZONTAL (X-axis):
// - Left margin: 0-64px, Left gutter: 64-80px
// - Content area: 80px to 1840px (width: 1760px)
// - 22 columns with alternating widths (64px/66px) and gutters (14px/16px)
// - Right gutter: 1840-1856px, Right margin: 1856-1920px
//
// VERTICAL (Y-axis):
// - Top margin: 0-56px, Top gutter: 56-72px
// - Content area: 72px to 1008px (height: 936px)
// - 10 rows with varying heights (66-84px) and 16px gutters
// - Bottom gutter: 1008-1024px, Bottom margin: 1024-1080px
//
// Row Y positions (extracted from guides):
// Row 1:  72-138px  (66px), gutter 16px
// Row 2:  154-236px (82px), gutter 16px
// Row 3:  252-334px (82px), gutter 16px
// Row 4:  350-434px (84px), gutter 16px
// Row 5:  450-532px (82px), gutter 16px
// Row 6:  548-630px (82px), gutter 16px
// Row 7:  646-730px (84px), gutter 16px
// Row 8:  746-828px (82px), gutter 16px
// Row 9:  844-926px (82px), gutter 16px
// Row 10: 942-1008px (66px)
// ============================================================================

// Grid calculation helper constants - EXACT values from CBRE PPT.pptx
const GRID = {
  // Margins (from extracted guides)
  MARGIN_LEFT: 64,                 // Left margin width
  MARGIN_RIGHT: 64,                // Right margin width
  MARGIN_TOP: 56,                  // Top margin height
  MARGIN_BOTTOM: 56,               // Bottom margin height
  GUTTER: 16,                      // Standard gutter size

  // Content area boundaries (from guides)
  CONTENT_X: 80,                   // Content starts after left margin + gutter
  CONTENT_END_X: 1840,             // Content ends before right gutter + margin
  CONTENT_Y: 72,                   // Content starts after top margin + gutter
  CONTENT_END_Y: 1008,             // Content ends before bottom gutter + margin

  // Calculated content dimensions
  CONTENT_WIDTH: 1760,             // 1840 - 80 = 1760px
  CONTENT_HEIGHT: 936,             // 1008 - 72 = 936px

  // Row Y positions (start of each row) - from extracted guides
  ROW_Y: [72, 154, 252, 350, 450, 548, 646, 746, 844, 942],
  // Row end positions (end of each row)
  ROW_END: [138, 236, 334, 434, 532, 630, 730, 828, 926, 1008],
  // Row heights
  ROW_H: [66, 82, 82, 84, 82, 82, 84, 82, 82, 66],

  // Half widths for 2-column layouts (11 columns each)
  // Left half: columns 1-11 (80 to 952)
  // Right half: columns 12-22 (968 to 1840)
  HALF_LEFT_END: 952,              // End of left half (col 11 end)
  HALF_RIGHT_START: 968,           // Start of right half (col 12 start)
  HALF_WIDTH: 872,                 // 952 - 80 = 872px (also 1840 - 968 = 872px)
  HALF_GAP: 16,                    // Gap between halves (952 to 968)

  // Three column widths (7-7-8 split for columns)
  // Col 1-7: 80 to 630 (550px)
  // Col 8-14: 644 to 1194 (550px) 
  // Col 15-22: 1210 to 1840 (630px) -- slightly wider for balance
  THREE_COL_NARROW: 550,
  THREE_COL_WIDE: 630,
};

// Calculate positions using GRID constants
const TITLE_Y = GRID.ROW_Y[0];                                    // 72px - Row 1 start
const TITLE_HEIGHT = GRID.ROW_END[1] - GRID.ROW_Y[0];             // 236 - 72 = 164px (Rows 1-2)
const CONTENT_Y = GRID.ROW_Y[2];                                  // 252px - Row 3 start
const CONTENT_HEIGHT = GRID.CONTENT_END_Y - CONTENT_Y;            // 1008 - 252 = 756px (Rows 3-10)


export const defaultLayoutTemplates: LayoutTemplate[] = [
  {
    id: 'title-slide',
    name: 'Title Slide',
    description: 'Main title and subtitle centered',
    placeholders: [
      {
        id: 'title',
        type: 'title',
        x: GRID.CONTENT_X,                        // 80px
        y: GRID.ROW_Y[3],                         // 350px - Row 4 (centered area)
        width: GRID.CONTENT_WIDTH,                // 1760px
        height: GRID.ROW_END[4] - GRID.ROW_Y[3],  // 532 - 350 = 182px (Rows 4-5)
      },
      {
        id: 'subtitle',
        type: 'subtitle',
        x: GRID.CONTENT_X,                        // 80px
        y: GRID.ROW_Y[5],                         // 548px - Row 6
        width: GRID.CONTENT_WIDTH,                // 1760px
        height: GRID.ROW_END[6] - GRID.ROW_Y[5],  // 730 - 548 = 182px (Rows 6-7)
      },
    ],
  },
  {
    id: 'title-content',
    name: 'Title + Content',
    description: 'Title at top, content area below',
    placeholders: [
      {
        id: 'title',
        type: 'title',
        x: GRID.CONTENT_X,                        // 80px
        y: TITLE_Y,                               // 72px - Row 1
        width: GRID.CONTENT_WIDTH,                // 1760px
        height: TITLE_HEIGHT,                     // 164px (Rows 1-2)
      },
      {
        id: 'content',
        type: 'body',
        x: GRID.CONTENT_X,                        // 80px
        y: CONTENT_Y,                             // 252px - Row 3
        width: GRID.CONTENT_WIDTH,                // 1760px
        height: CONTENT_HEIGHT,                   // 756px (Rows 3-10)
      },
    ],
  },
  {
    id: 'two-content',
    name: 'Two Content',
    description: 'Title with two side-by-side content areas',
    placeholders: [
      {
        id: 'title',
        type: 'title',
        x: GRID.CONTENT_X,                        // 80px
        y: TITLE_Y,                               // 72px
        width: GRID.CONTENT_WIDTH,                // 1760px
        height: TITLE_HEIGHT,                     // 164px
      },
      {
        id: 'content-left',
        type: 'body',
        x: GRID.CONTENT_X,                        // 80px
        y: CONTENT_Y,                             // 252px
        width: GRID.HALF_WIDTH,                   // 872px (cols 1-11)
        height: CONTENT_HEIGHT,                   // 756px
      },
      {
        id: 'content-right',
        type: 'body',
        x: GRID.HALF_RIGHT_START,                 // 968px (col 12 start)
        y: CONTENT_Y,                             // 252px
        width: GRID.HALF_WIDTH,                   // 872px (cols 12-22)
        height: CONTENT_HEIGHT,                   // 756px
      },
    ],
  },
  {
    id: 'comparison',
    name: 'Comparison',
    description: 'Title with two equal columns for comparison',
    placeholders: [
      {
        id: 'title',
        type: 'title',
        x: GRID.CONTENT_X,                        // 80px
        y: TITLE_Y,                               // 72px
        width: GRID.CONTENT_WIDTH,                // 1760px
        height: GRID.ROW_H[0],                    // 66px (just Row 1)
      },
      {
        id: 'left-heading',
        type: 'subtitle',
        x: GRID.CONTENT_X,                        // 80px
        y: GRID.ROW_Y[1],                         // 154px - Row 2
        width: GRID.HALF_WIDTH,                   // 872px
        height: GRID.ROW_H[1],                    // 82px
      },
      {
        id: 'left-content',
        type: 'body',
        x: GRID.CONTENT_X,                        // 80px
        y: CONTENT_Y,                             // 252px - Row 3
        width: GRID.HALF_WIDTH,                   // 872px
        height: CONTENT_HEIGHT,                   // 756px
      },
      {
        id: 'right-heading',
        type: 'subtitle',
        x: GRID.HALF_RIGHT_START,                 // 968px
        y: GRID.ROW_Y[1],                         // 154px
        width: GRID.HALF_WIDTH,                   // 872px
        height: GRID.ROW_H[1],                    // 82px
      },
      {
        id: 'right-content',
        type: 'body',
        x: GRID.HALF_RIGHT_START,                 // 968px
        y: CONTENT_Y,                             // 252px
        width: GRID.HALF_WIDTH,                   // 872px
        height: CONTENT_HEIGHT,                   // 756px
      },
    ],
  },
  {
    id: 'section-header',
    name: 'Section Header',
    description: 'Large centered text for section breaks',
    placeholders: [
      {
        id: 'section-title',
        type: 'title',
        x: GRID.CONTENT_X,                        // 80px
        y: GRID.ROW_Y[4],                         // 450px - Row 5 (vertically centered)
        width: GRID.CONTENT_WIDTH,                // 1760px
        height: GRID.ROW_END[6] - GRID.ROW_Y[4],  // 730 - 450 = 280px (Rows 5-7)
      },
    ],
  },
  {
    id: 'blank',
    name: 'Blank',
    description: 'Empty slide with no placeholders',
    placeholders: [],
  },
  {
    id: 'three-content',
    name: 'Three Content',
    description: 'Title with three columns (7-7-8 grid split)',
    placeholders: [
      {
        id: 'title',
        type: 'title',
        x: GRID.CONTENT_X,                        // 80px
        y: TITLE_Y,                               // 72px
        width: GRID.CONTENT_WIDTH,                // 1760px
        height: TITLE_HEIGHT,                     // 164px
      },
      {
        id: 'content-left',
        type: 'body',
        x: GRID.CONTENT_X,                        // 80px (col 1)
        y: CONTENT_Y,                             // 252px
        width: GRID.THREE_COL_NARROW,             // 550px (cols 1-7)
        height: CONTENT_HEIGHT,                   // 756px
      },
      {
        id: 'content-center',
        type: 'body',
        x: 644,                                   // Col 8 start (from guide)
        y: CONTENT_Y,                             // 252px
        width: GRID.THREE_COL_NARROW,             // 550px (cols 8-14)
        height: CONTENT_HEIGHT,                   // 756px
      },
      {
        id: 'content-right',
        type: 'body',
        x: 1210,                                  // Col 15 start (from guide)
        y: CONTENT_Y,                             // 252px
        width: GRID.THREE_COL_WIDE,               // 630px (cols 15-22)
        height: CONTENT_HEIGHT,                   // 756px
      },
    ],
  },
  {
    id: 'content-sidebar-stacked',
    name: 'Content + Sidebar',
    description: 'Half-width content with two stacked sidebar boxes',
    placeholders: [
      {
        id: 'title',
        type: 'title',
        x: GRID.CONTENT_X,                        // 80px
        y: TITLE_Y,                               // 72px
        width: GRID.CONTENT_WIDTH,                // 1760px
        height: TITLE_HEIGHT,                     // 164px
      },
      {
        id: 'content-main',
        type: 'body',
        x: GRID.CONTENT_X,                        // 80px
        y: CONTENT_Y,                             // 252px
        width: GRID.HALF_WIDTH,                   // 872px
        height: CONTENT_HEIGHT,                   // 756px
      },
      {
        id: 'sidebar-top',
        type: 'body',
        x: GRID.HALF_RIGHT_START,                 // 968px (Col 12 start)
        y: GRID.ROW_Y[2],                         // 252px (Row 3 start)
        width: GRID.HALF_WIDTH,                   // 872px
        height: GRID.ROW_END[5] - GRID.ROW_Y[2],  // 630 - 252 = 378px (Rows 3-6)
      },
      {
        id: 'sidebar-bottom',
        type: 'body',
        x: GRID.HALF_RIGHT_START,                 // 968px (Col 12 start)
        y: GRID.ROW_Y[6],                         // 646px (Row 7 start)
        width: GRID.HALF_WIDTH,                   // 872px
        height: GRID.ROW_END[9] - GRID.ROW_Y[6],  // 1008 - 646 = 362px (Rows 7-10)
      },
    ],
  },
  {
    id: 'sidebar-content',
    name: 'Sidebar + Content',
    description: 'Five-column sidebar with remaining content area',
    placeholders: [
      {
        id: 'title',
        type: 'title',
        x: GRID.CONTENT_X,                        // 80px
        y: TITLE_Y,                               // 72px
        width: GRID.CONTENT_WIDTH,                // 1760px
        height: TITLE_HEIGHT,                     // 164px
      },
      {
        id: 'sidebar',
        type: 'body',
        x: GRID.CONTENT_X,                        // 80px
        y: CONTENT_Y,                             // 252px
        width: 388,                               // 5 cols: 80 to 468 (from guides)
        height: CONTENT_HEIGHT,                   // 756px
      },
      {
        id: 'content-main',
        type: 'body',
        x: 484,                                   // Col 6 start (from guide)
        y: CONTENT_Y,                             // 252px
        width: 1356,                              // 1840 - 484 = 1356px
        height: CONTENT_HEIGHT,                   // 756px
      },
    ],
  },
];

/**
 * Generate CBRE Official Grid Guides for 16:9 (1920x1080)
 * EXACT positions extracted from official CBRE PPT.pptx template
 * 
 * These pixel values are derived from the p15:sldGuideLst in slideMaster1.xml
 * using the formula: pixels = pos / 4 (where pos is in 1/8 points)
 */
function generateCBREGridGuides16x9(): Array<{ id: string; orientation: 'horizontal' | 'vertical'; position: number }> {
  // EXACT vertical guide positions from CBRE PPT.pptx (in pixels)
  // Extracted from p15:guide elements without orient attribute
  const verticalPositions = [
    0,     // Left edge
    64,    // Content margin start
    80,    // Content margin end / Col 1 start
    144,   // Col 1 end
    160,   // Col 2 start
    226,   // Col 2 end
    242,   // Col 3 start
    306,   // Col 3 end
    322,   // Col 4 start
    388,   // Col 4 end
    402,   // Col 5 start
    468,   // Col 5 end
    484,   // Col 6 start
    548,   // Col 6 end
    564,   // Col 7 start
    630,   // Col 7 end
    644,   // Col 8 start
    710,   // Col 8 end
    726,   // Col 9 start
    790,   // Col 9 end
    806,   // Col 10 start
    872,   // Col 10 end
    888,   // Col 11 start
    952,   // Col 11 end
    968,   // Col 12 start (center)
    1032,  // Col 12 end
    1048,  // Col 13 start
    1114,  // Col 13 end
    1130,  // Col 14 start
    1194,  // Col 14 end
    1210,  // Col 15 start
    1274,  // Col 15 end
    1290,  // Col 16 start
    1356,  // Col 16 end
    1372,  // Col 17 start
    1436,  // Col 17 end
    1452,  // Col 18 start
    1516,  // Col 18 end
    1532,  // Col 19 start
    1598,  // Col 19 end
    1614,  // Col 20 start
    1678,  // Col 20 end
    1694,  // Col 21 start
    1758,  // Col 21 end
    1774,  // Col 22 start
    1840,  // Col 22 end
    1856,  // Content margin start
    1920,  // Right edge
  ];

  // EXACT horizontal guide positions from CBRE PPT.pptx (in pixels)
  // Extracted from p15:guide elements with orient="horz"
  const horizontalPositions = [
    0,     // Top edge
    56,    // Top margin start
    72,    // Top margin end
    138,   // Row 1 end
    154,   // Row 2 start
    236,   // Row 2 end
    252,   // Row 3 start
    334,   // Row 3 end
    350,   // Row 4 start
    434,   // Row 4 end
    450,   // Row 5 start
    532,   // Row 5 end
    548,   // Row 6 start
    630,   // Row 6 end
    646,   // Row 7 start
    730,   // Row 7 end
    746,   // Row 8 start
    828,   // Row 8 end
    844,   // Row 9 start
    926,   // Row 9 end
    942,   // Row 10 start
    1008,  // Row 10 end / Bottom margin
    1024,  // Bottom safe zone
    1080,  // Bottom edge
  ];

  const guides: Array<{ id: string; orientation: 'horizontal' | 'vertical'; position: number }> = [];

  // Add vertical guides
  verticalPositions.forEach((pos, index) => {
    guides.push({
      id: `v-cbre-${index}`,
      orientation: 'vertical',
      position: pos,
    });
  });

  // Add horizontal guides
  horizontalPositions.forEach((pos, index) => {
    guides.push({
      id: `h-cbre-${index}`,
      orientation: 'horizontal',
      position: pos,
    });
  });

  return guides;
}

// Default template configuration
export const defaultTemplateConfig: TemplateConfig = {
  id: '',
  name: 'My PowerPoint Template',
  theme: {
    colors: defaultThemeColors,
    customColors: defaultCustomColors,
  },
  fontLibrary: defaultFontLibrary,
  typography: defaultTypography,
  slideSize: '16:9',
  slideDimensions: slideDimensions['16:9'],
  guides: generateCBREGridGuides16x9(),
  selectedLayouts: ['title-slide', 'title-content', 'two-content', 'blank'],
};

