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
  hyperlink: cbreTheme.colors['accent-green'], // #17E88F
  followedHyperlink: cbreTheme.colors['sage'], // #538184
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

// Default typography styles
export const defaultTypography: TypographyStyles = {
  heading: {
    fontId: 'financier-semibold',
    fontSize: 48,
    lineHeight: 1.1,
    letterSpacing: 0,
    color: cbreTheme.colors['cbre-green'],
    textTransform: 'none',
  },
  subtitle: {
    fontId: 'financier-medium',
    fontSize: 32,
    lineHeight: 1.2,
    letterSpacing: 0,
    color: cbreTheme.colors['dark-grey'],
    textTransform: 'none',
  },
  bodyLarge: {
    fontId: 'calibre-regular',
    fontSize: 20,
    lineHeight: 1.5,
    letterSpacing: 0,
    color: cbreTheme.colors['dark-grey'],
    textTransform: 'none',
  },
  bodySmall: {
    fontId: 'calibre-regular',
    fontSize: 16,
    lineHeight: 1.5,
    letterSpacing: 0,
    color: cbreTheme.colors['dark-grey'],
    textTransform: 'none',
  },
  quote: {
    fontId: 'calibre-medium',
    fontSize: 24,
    lineHeight: 1.4,
    letterSpacing: 0,
    color: cbreTheme.colors['sage'],
    textTransform: 'none',
  },
  bullet: {
    fontId: 'calibre-regular',
    fontSize: 18,
    lineHeight: 1.6,
    letterSpacing: 0,
    color: cbreTheme.colors['dark-grey'],
    textTransform: 'none',
  },
  link: {
    fontId: 'calibre-regular',
    fontSize: 18,
    lineHeight: 1.5,
    letterSpacing: 0,
    color: cbreTheme.colors['accent-green'],
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

// Predefined layout templates
// Aligned to CBRE Standard Grid (1920x1080)
// Horizontal: Start Col 2 (81px), Mid Gutter (952-969px), End Col 23 (1840px)
// Vertical: Header (0-70px), Content Start (91px), Content End (989px)
export const defaultLayoutTemplates: LayoutTemplate[] = [
  {
    id: 'title-slide',
    name: 'Title Slide',
    description: 'Main title and subtitle centered',
    placeholders: [
      {
        id: 'title',
        type: 'title',
        x: 81,
        y: 350,
        width: 1758,
        height: 200,
      },
      {
        id: 'subtitle',
        type: 'subtitle',
        x: 81,
        y: 600,
        width: 1758,
        height: 120,
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
        x: 81,
        y: 91,
        width: 1758,
        height: 80,
      },
      {
        id: 'content',
        type: 'body',
        x: 81,
        y: 194,  // +2px gap from title
        width: 1758,
        height: 795,
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
        x: 81,
        y: 91,
        width: 1758,
        height: 80,
      },
      {
        id: 'content-left',
        type: 'body',
        x: 81,
        y: 194,  // +2px gap from title
        width: 870,
        height: 795,
      },
      {
        id: 'content-right',
        type: 'body',
        x: 969,
        y: 194,  // +2px gap from title
        width: 870,
        height: 795,
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
        x: 81,
        y: 91,
        width: 1758,
        height: 80,
      },
      {
        id: 'left-heading',
        type: 'subtitle',
        x: 81,
        y: 194,  // +2px gap from title
        width: 870,
        height: 80,
      },
      {
        id: 'left-content',
        type: 'body',
        x: 81,
        y: 296,  // 22px gap from subtitle
        width: 870,
        height: 688,
      },
      {
        id: 'right-heading',
        type: 'subtitle',
        x: 969,
        y: 194,  // +2px gap from title
        width: 870,
        height: 80,
      },
      {
        id: 'right-content',
        type: 'body',
        x: 969,
        y: 296,  // 22px gap from subtitle
        width: 870,
        height: 688,
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
        x: 81,
        y: 400,
        width: 1758,
        height: 280,
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
    description: 'Title with three equal columns',
    placeholders: [
      {
        id: 'title',
        type: 'title',
        x: 81,
        y: 91,
        width: 1758,
        height: 80,
      },
      {
        id: 'content-left',
        type: 'body',
        x: 81,
        y: 194,  // 23px gap after title
        width: 574,  // (1758 - 2*18) / 3
        height: 795,
      },
      {
        id: 'content-center',
        type: 'body',
        x: 673,  // 81 + 574 + 18
        y: 194,
        width: 574,
        height: 795,
      },
      {
        id: 'content-right',
        type: 'body',
        x: 1265,  // 81 + 574 + 18 + 574 + 18
        y: 194,
        width: 574,
        height: 795,
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
        x: 81,
        y: 91,
        width: 1758,
        height: 80,
      },
      {
        id: 'content-main',
        type: 'body',
        x: 81,
        y: 194,
        width: 870,  // Half width
        height: 795,
      },
      {
        id: 'sidebar-top',
        type: 'body',
        x: 969,  // 81 + 870 + 18
        y: 194,
        width: 870,
        height: 386,  // (795 - 22) / 2
      },
      {
        id: 'sidebar-bottom',
        type: 'body',
        x: 969,
        y: 602,  // 194 + 386 + 22
        width: 870,
        height: 387,
      },
    ],
  },
  {
    id: 'sidebar-content',
    name: 'Sidebar + Content',
    description: 'Five-column sidebar with seventeen-column content',
    placeholders: [
      {
        id: 'title',
        type: 'title',
        x: 81,
        y: 91,
        width: 1758,
        height: 80,
      },
      {
        id: 'sidebar',
        type: 'body',
        x: 81,
        y: 194,
        width: 387,
        height: 795,
      },
      {
        id: 'content-main',
        type: 'body',
        x: 486,  // 81 + 387 + 18
        y: 194,
        width: 1353,
        height: 795,
      },
    ],
  },
];

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
  guides: [
    // CBRE Structural Grid (16:9)
    // Margins: 81px | Gutter: 18px | Cols: 56px
    // Center Gutter: 951px - 969px
    { id: 'margin-left', orientation: 'vertical', position: 81 },
    { id: 'margin-right', orientation: 'vertical', position: 1839 },
    { id: 'gutter-left', orientation: 'vertical', position: 951 },
    { id: 'gutter-right', orientation: 'vertical', position: 969 },
    { id: 'center-v', orientation: 'vertical', position: 960 },

    // Horizontal Zones
    { id: 'header-bottom', orientation: 'horizontal', position: 70 },
    { id: 'content-top', orientation: 'horizontal', position: 91 },
    { id: 'content-bottom', orientation: 'horizontal', position: 989 },
    { id: 'center-h', orientation: 'horizontal', position: 540 },
  ],
  selectedLayouts: ['title-slide', 'title-content', 'two-content', 'blank'],
};

