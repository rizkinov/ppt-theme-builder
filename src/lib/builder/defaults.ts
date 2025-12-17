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
        x: GRID.HALF_RIGHT_START,                 // 968px
        y: CONTENT_Y,                             // 252px
        width: GRID.HALF_WIDTH,                   // 872px
        height: Math.round((CONTENT_HEIGHT - GRID.GUTTER) / 2), // (756 - 16) / 2 = 370px
      },
      {
        id: 'sidebar-bottom',
        type: 'body',
        x: GRID.HALF_RIGHT_START,                 // 968px
        y: CONTENT_Y + Math.round((CONTENT_HEIGHT - GRID.GUTTER) / 2) + GRID.GUTTER, // 252 + 370 + 16 = 638px
        width: GRID.HALF_WIDTH,                   // 872px
        height: Math.round((CONTENT_HEIGHT - GRID.GUTTER) / 2), // 370px
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
  },
  fontLibrary: defaultFontLibrary,
  typography: defaultTypography,
  slideSize: '16:9',
  slideDimensions: slideDimensions['16:9'],
  guides: generateCBREGridGuides16x9(),
  selectedLayouts: ['title-slide', 'title-content', 'two-content', 'blank'],
};

