/**
 * Default values and layout templates for PPT Theme Builder
 * Using CBRE brand colors and standards
 */

import { ThemeColors, TypographyStyles, LayoutTemplate, SlideDimensions, SlideSize, TemplateConfig, FontAsset } from './types';
import cbreTheme from '../../../config/cbre-theme';

// Default CBRE theme colors mapped to PowerPoint's 12-color scheme
export const defaultThemeColors: ThemeColors = {
  dark1: cbreTheme.colors['cbre-green'],      // #003F2D
  dark2: cbreTheme.colors['dark-grey'],       // #435254
  light1: '#FFFFFF',
  light2: cbreTheme.colors['lighter-grey'],   // #E6E8E9
  accent1: cbreTheme.colors['accent-green'],  // #17E88F
  accent2: cbreTheme.colors['sage'],          // #538184
  accent3: cbreTheme.colors['celadon'],       // #80BBAD
  accent4: cbreTheme.colors['wheat'],         // #DBD99A
  accent5: cbreTheme.colors['midnight'],      // #032842
  accent6: cbreTheme.colors['cement'],        // #7F8480
  hyperlink: cbreTheme.colors['celadon'],       // #80BBAD
  followedHyperlink: cbreTheme.colors['sage'],  // #538184
};

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
];

// Default typography styles - CBRE Standard
// CBRE Standard Text Scale: 56/34/28/20/14
// Line spacing: CBRE Standard (heading 0.9, subtitle/body 1.0, quote 1.1)
// Colors use colorRef to automatically sync with theme colors
export const defaultTypography: TypographyStyles = {
  heading: {
    fontId: 'financier-regular',
    fontSize: 56,
    lineHeight: 0.9,
    letterSpacing: 0,
    color: '#003F2D',
    colorRef: 'dark1', // CBRE Green - uses theme dark1
    textTransform: 'none',
  },
  subtitle: {
    fontId: 'calibre-medium',
    fontSize: 34,
    lineHeight: 1.0,
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark2', // Dark Grey - uses theme dark2
    textTransform: 'none',
  },
  bodyLarge: {
    fontId: 'calibre-light',
    fontSize: 20,
    lineHeight: 1.0,
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark2', // Dark Grey - uses theme dark2
    textTransform: 'none',
  },
  bodySmall: {
    fontId: 'calibre-regular',
    fontSize: 14,
    lineHeight: 1.0,
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark2', // Dark Grey - uses theme dark2
    textTransform: 'none',
  },
  quote: {
    fontId: 'financier-regular',
    fontSize: 28,
    lineHeight: 1.1,
    letterSpacing: 0,
    color: '#538184',
    colorRef: 'accent2', // Sage - uses theme accent2
    textTransform: 'none',
  },
  bullet: {
    fontId: 'calibre-regular',
    fontSize: 14,
    lineHeight: 1.0,
    letterSpacing: 0,
    color: '#435254',
    colorRef: 'dark2', // Dark Grey - uses theme dark2
    textTransform: 'none',
  },
  link: {
    fontId: 'calibre-regular',
    fontSize: 14,
    lineHeight: 1.0,
    letterSpacing: 0,
    color: defaultThemeColors.hyperlink,
    colorRef: 'hyperlink', // Uses theme hyperlink color
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
// Grid Constants:
// - MARGIN_LEFT_RIGHT = 79px, MARGIN_TOP = 52px, MARGIN_BOTTOM = 58px
// - COLUMN_WIDTH = 67px, COL_GUTTER = 288/21 ≈ 13.71px
// - ROW_GUTTER = 17px
// - ROW_HEIGHTS = [69, 79, 85, 79, 79, 85, 79, 79, 85, 65]
//
// Row Y positions (start of each row after gutter):
// Row 1: 69px (ends 138px)
// Row 2: 155px (ends 234px)
// Row 3: 251px (ends 336px)
// Row 4: 353px (ends 432px)
// Row 5: 449px (ends 528px)
// Row 6: 545px (ends 630px)
// Row 7: 647px (ends 726px)
// Row 8: 743px (ends 822px)
// Row 9: 839px (ends 924px)
// Row 10: 941px (ends 1006px)
// Bottom margin: 1022px (to 1080px)
//
// Content area: X = 79px to 1841px (width = 1762px)
// Half width (11 cols): 79px to ~959px, ~960px to 1841px
// ============================================================================

// Grid calculation helper constants
const GRID = {
  // Margins
  MARGIN_X: 79,                    // Left/right margin
  MARGIN_TOP: 52,                  // Top margin
  MARGIN_BOTTOM: 58,               // Bottom margin

  // Column/Row gaps
  COL_GUTTER: 288 / 21,            // ≈13.71px
  ROW_GUTTER: 17,
  COLUMN_WIDTH: 67,

  // Row Y positions (start of each row)
  ROW_Y: [69, 155, 251, 353, 449, 545, 647, 743, 839, 941],
  ROW_H: [69, 79, 85, 79, 79, 85, 79, 79, 85, 65],

  // Content area
  CONTENT_X: 79,
  CONTENT_WIDTH: 1762,             // 1920 - 79 - 79
  CONTENT_Y: 69,                   // Row 1 start
  CONTENT_BOTTOM: 1006,            // Row 10 end

  // Half widths (11 columns each = 11*67 + 10*13.71 = 737 + 137.1 = 874px)
  HALF_WIDTH: Math.round(11 * 67 + 10 * (288 / 21)), // ≈874px
  HALF_GAP: Math.round(288 / 21),    // ≈14px gap between halves

  // Three column widths (7-8-7 split)
  // 7 cols: 7*67 + 6*13.71 = 469 + 82 = 551px
  // 8 cols: 8*67 + 7*13.71 = 536 + 96 = 632px
  THREE_COL_7: Math.round(7 * 67 + 6 * (288 / 21)),  // ≈551px
  THREE_COL_8: Math.round(8 * 67 + 7 * (288 / 21)),  // ≈632px
};

// Calculate positions
const TITLE_Y = GRID.ROW_Y[0];                    // 69px - Row 1
const TITLE_HEIGHT = GRID.ROW_H[0] + GRID.ROW_GUTTER + GRID.ROW_H[1]; // Rows 1-2 = 69+17+79 = 165px
const CONTENT_Y = GRID.ROW_Y[2];                  // 251px - Row 3 start
const CONTENT_HEIGHT = GRID.CONTENT_BOTTOM - CONTENT_Y; // 1006 - 251 = 755px

export const defaultLayoutTemplates: LayoutTemplate[] = [
  {
    id: 'title-slide',
    name: 'Title Slide',
    description: 'Main title and subtitle centered',
    placeholders: [
      {
        id: 'title',
        type: 'title',
        x: GRID.CONTENT_X,                        // 79
        y: GRID.ROW_Y[3],                         // 353 - Row 4 (centered area)
        width: GRID.CONTENT_WIDTH,                // 1762
        height: GRID.ROW_H[3] + GRID.ROW_GUTTER + GRID.ROW_H[4], // 79+17+79 = 175
      },
      {
        id: 'subtitle',
        type: 'subtitle',
        x: GRID.CONTENT_X,                        // 79
        y: GRID.ROW_Y[5],                         // 545 - Row 6
        width: GRID.CONTENT_WIDTH,                // 1762
        height: GRID.ROW_H[5] + GRID.ROW_GUTTER + GRID.ROW_H[6], // 85+17+79 = 181
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
        x: GRID.CONTENT_X,                        // 79
        y: TITLE_Y,                               // 69 - Row 1
        width: GRID.CONTENT_WIDTH,                // 1762
        height: TITLE_HEIGHT,                     // 165 (Rows 1-2)
      },
      {
        id: 'content',
        type: 'body',
        x: GRID.CONTENT_X,                        // 79
        y: CONTENT_Y,                             // 251 - Row 3
        width: GRID.CONTENT_WIDTH,                // 1762
        height: CONTENT_HEIGHT,                   // 755
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
        x: GRID.CONTENT_X,                        // 79
        y: TITLE_Y,                               // 69
        width: GRID.CONTENT_WIDTH,                // 1762
        height: TITLE_HEIGHT,                     // 165
      },
      {
        id: 'content-left',
        type: 'body',
        x: GRID.CONTENT_X,                        // 79
        y: CONTENT_Y,                             // 251
        width: GRID.HALF_WIDTH,                   // 874
        height: CONTENT_HEIGHT,                   // 755
      },
      {
        id: 'content-right',
        type: 'body',
        x: GRID.CONTENT_X + GRID.HALF_WIDTH + GRID.HALF_GAP, // 79 + 874 + 14 = 967
        y: CONTENT_Y,                             // 251
        width: GRID.HALF_WIDTH,                   // 874
        height: CONTENT_HEIGHT,                   // 755
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
        x: GRID.CONTENT_X,                        // 79
        y: TITLE_Y,                               // 69
        width: GRID.CONTENT_WIDTH,                // 1762
        height: GRID.ROW_H[0],                    // 69 (just Row 1)
      },
      {
        id: 'left-heading',
        type: 'subtitle',
        x: GRID.CONTENT_X,                        // 79
        y: GRID.ROW_Y[1],                         // 155 - Row 2
        width: GRID.HALF_WIDTH,                   // 874
        height: GRID.ROW_H[1],                    // 79
      },
      {
        id: 'left-content',
        type: 'body',
        x: GRID.CONTENT_X,                        // 79
        y: CONTENT_Y,                             // 251 - Row 3
        width: GRID.HALF_WIDTH,                   // 874
        height: CONTENT_HEIGHT,                   // 755
      },
      {
        id: 'right-heading',
        type: 'subtitle',
        x: GRID.CONTENT_X + GRID.HALF_WIDTH + GRID.HALF_GAP, // 967
        y: GRID.ROW_Y[1],                         // 155
        width: GRID.HALF_WIDTH,                   // 874
        height: GRID.ROW_H[1],                    // 79
      },
      {
        id: 'right-content',
        type: 'body',
        x: GRID.CONTENT_X + GRID.HALF_WIDTH + GRID.HALF_GAP, // 967
        y: CONTENT_Y,                             // 251
        width: GRID.HALF_WIDTH,                   // 874
        height: CONTENT_HEIGHT,                   // 755
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
        x: GRID.CONTENT_X,                        // 79
        y: GRID.ROW_Y[4],                         // 449 - Row 5 (vertically centered)
        width: GRID.CONTENT_WIDTH,                // 1762
        height: GRID.ROW_H[4] + GRID.ROW_GUTTER + GRID.ROW_H[5] + GRID.ROW_GUTTER + GRID.ROW_H[6], // 79+17+85+17+79 = 277
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
    description: 'Title with three columns (7-8-7 grid split)',
    placeholders: [
      {
        id: 'title',
        type: 'title',
        x: GRID.CONTENT_X,                        // 79
        y: TITLE_Y,                               // 69
        width: GRID.CONTENT_WIDTH,                // 1762
        height: TITLE_HEIGHT,                     // 165
      },
      {
        id: 'content-left',
        type: 'body',
        x: GRID.CONTENT_X,                        // 79
        y: CONTENT_Y,                             // 251
        width: GRID.THREE_COL_7,                  // 551 (7 columns)
        height: CONTENT_HEIGHT,                   // 755
      },
      {
        id: 'content-center',
        type: 'body',
        x: GRID.CONTENT_X + GRID.THREE_COL_7 + GRID.HALF_GAP, // 79 + 551 + 14 = 644
        y: CONTENT_Y,                             // 251
        width: GRID.THREE_COL_8,                  // 632 (8 columns)
        height: CONTENT_HEIGHT,                   // 755
      },
      {
        id: 'content-right',
        type: 'body',
        x: GRID.CONTENT_X + GRID.THREE_COL_7 + GRID.HALF_GAP + GRID.THREE_COL_8 + GRID.HALF_GAP, // 79 + 551 + 14 + 632 + 14 = 1290
        y: CONTENT_Y,                             // 251
        width: GRID.THREE_COL_7,                  // 551 (7 columns)
        height: CONTENT_HEIGHT,                   // 755
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
        x: GRID.CONTENT_X,                        // 79
        y: TITLE_Y,                               // 69
        width: GRID.CONTENT_WIDTH,                // 1762
        height: TITLE_HEIGHT,                     // 165
      },
      {
        id: 'content-main',
        type: 'body',
        x: GRID.CONTENT_X,                        // 79
        y: CONTENT_Y,                             // 251
        width: GRID.HALF_WIDTH,                   // 874
        height: CONTENT_HEIGHT,                   // 755
      },
      {
        id: 'sidebar-top',
        type: 'body',
        x: GRID.CONTENT_X + GRID.HALF_WIDTH + GRID.HALF_GAP, // 967
        y: CONTENT_Y,                             // 251
        width: GRID.HALF_WIDTH,                   // 874
        height: Math.round((CONTENT_HEIGHT - GRID.ROW_GUTTER) / 2), // (755 - 17) / 2 = 369
      },
      {
        id: 'sidebar-bottom',
        type: 'body',
        x: GRID.CONTENT_X + GRID.HALF_WIDTH + GRID.HALF_GAP, // 967
        y: CONTENT_Y + Math.round((CONTENT_HEIGHT - GRID.ROW_GUTTER) / 2) + GRID.ROW_GUTTER, // 251 + 369 + 17 = 637
        width: GRID.HALF_WIDTH,                   // 874
        height: Math.round((CONTENT_HEIGHT - GRID.ROW_GUTTER) / 2), // 369
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
        x: GRID.CONTENT_X,                        // 79
        y: TITLE_Y,                               // 69
        width: GRID.CONTENT_WIDTH,                // 1762
        height: TITLE_HEIGHT,                     // 165
      },
      {
        id: 'sidebar',
        type: 'body',
        x: GRID.CONTENT_X,                        // 79
        y: CONTENT_Y,                             // 251
        width: Math.round(5 * GRID.COLUMN_WIDTH + 4 * GRID.COL_GUTTER), // 5*67 + 4*13.71 ≈ 390
        height: CONTENT_HEIGHT,                   // 755
      },
      {
        id: 'content-main',
        type: 'body',
        x: GRID.CONTENT_X + Math.round(5 * GRID.COLUMN_WIDTH + 4 * GRID.COL_GUTTER) + Math.round(GRID.COL_GUTTER), // 79 + 390 + 14 = 483
        y: CONTENT_Y,                             // 251
        width: GRID.CONTENT_WIDTH - Math.round(5 * GRID.COLUMN_WIDTH + 4 * GRID.COL_GUTTER) - Math.round(GRID.COL_GUTTER), // 1762 - 390 - 14 = 1358
        height: CONTENT_HEIGHT,                   // 755
      },
    ],
  },
];

/**
 * Generate CBRE Official Grid Guides for 16:9 (1920x1080)
 * Based on official CBRE PowerPoint template (33.87 × 19.05 cm)
 * 
 * Structure:
 * - 24 columns: 1 left margin + 22 grid + 1 right margin
 * - 12 rows: 1 top margin + 10 grid + 1 bottom margin
 * 
 * Margins (from official template):
 * - Left/Right margin: 1.4 cm = 79px
 * - Top/Bottom margin: 0.93 cm = 53px
 * 
 * Gutter rules:
 * - Columns: NO gutter between margin and content
 * - Rows: YES gutter between margin and content
 */
function generateCBREGridGuides16x9(): Array<{ id: string; orientation: 'horizontal' | 'vertical'; position: number }> {
  const guides: Array<{ id: string; orientation: 'horizontal' | 'vertical'; position: number }> = [];

  // === MARGIN CONSTANTS (from official template) ===
  const MARGIN_LEFT_RIGHT = 79;  // 1.4 cm × 56.68 px/cm
  const MARGIN_TOP = 52;         // 0.92 cm × 56.68 px/cm
  const MARGIN_BOTTOM = 58;      // 1.02 cm × 56.68 px/cm

  // === COLUMN CONSTANTS (calculated for exact 1920px total) ===
  // 2×79 + 22×COLUMN + 21×GUTTER = 1920
  // With COLUMN = 67, GUTTER = (1762 - 1474) / 21 = 13.714
  const COLUMN_WIDTH = 67;
  const COL_GUTTER = 288 / 21;  // = 13.714... (exact for 1920px total)

  // === ROW CONSTANTS (exact measurements from official template) ===
  const ROW_GUTTER = 17;  // 0.3 cm × 56.68 px/cm

  // Individual row heights in order (top to bottom)
  const ROW_HEIGHTS = [
    69,   // Row 1: 1.21 cm
    79,   // Row 2: 1.4 cm
    85,   // Row 3: 1.5 cm
    79,   // Row 4: 1.4 cm
    79,   // Row 5: 1.4 cm
    85,   // Row 6: 1.5 cm
    79,   // Row 7: 1.4 cm
    79,   // Row 8: 1.4 cm
    85,   // Row 9: 1.5 cm
    65,   // Row 10: 1.15 cm
  ];

  // === VERTICAL GUIDES ===
  let x = 0;

  // Left margin
  guides.push({ id: 'v-margin-left-start', orientation: 'vertical', position: 0 });
  x = MARGIN_LEFT_RIGHT;
  guides.push({ id: 'v-margin-left-end', orientation: 'vertical', position: x });

  // 22 content columns + 21 gutters (no gutter before right margin)
  for (let col = 0; col < 22; col++) {
    guides.push({ id: `v-col-${col}-start`, orientation: 'vertical', position: Math.round(x) });
    x += COLUMN_WIDTH;
    guides.push({ id: `v-col-${col}-end`, orientation: 'vertical', position: Math.round(x) });
    if (col < 21) {
      x += COL_GUTTER;  // Only add gutter between columns, not after last
    }
  }

  // Right margin (starts immediately after last column, no gutter)
  guides.push({ id: 'v-margin-right-start', orientation: 'vertical', position: Math.round(x) });
  x += MARGIN_LEFT_RIGHT;
  guides.push({ id: 'v-margin-right-end', orientation: 'vertical', position: Math.round(x) });

  // === HORIZONTAL GUIDES (10 rows with gutters) ===
  let y = 0;

  // Top margin
  guides.push({ id: 'h-margin-top-start', orientation: 'horizontal', position: 0 });
  y = MARGIN_TOP;
  guides.push({ id: 'h-margin-top-end', orientation: 'horizontal', position: y });
  y += ROW_GUTTER;

  // 10 content rows with gutters between
  for (let row = 0; row < 10; row++) {
    guides.push({ id: `h-row-${row + 1}-start`, orientation: 'horizontal', position: y });
    y += ROW_HEIGHTS[row];
    guides.push({ id: `h-row-${row + 1}-end`, orientation: 'horizontal', position: y });
    if (row < 9) {
      y += ROW_GUTTER;
    }
  }
  y += ROW_GUTTER;

  // Bottom margin
  guides.push({ id: 'h-margin-bottom-start', orientation: 'horizontal', position: 1080 - MARGIN_BOTTOM });
  guides.push({ id: 'h-margin-bottom-end', orientation: 'horizontal', position: 1080 });

  return guides;
}

// Default template configuration
export const defaultTemplateConfig: TemplateConfig = {
  id: '',
  name: 'My PowerPoint Template',
  theme: {
    colors: defaultThemeColors,
  },
  fontLibrary: defaultFontLibrary,
  typography: defaultTypography,
  slideSize: '16:9',
  slideDimensions: slideDimensions['16:9'],
  guides: generateCBREGridGuides16x9(),
  selectedLayouts: ['title-slide', 'title-content', 'two-content', 'blank'],
};

