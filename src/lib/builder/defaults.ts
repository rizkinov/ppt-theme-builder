/**
 * Default values and layout templates for PPT Theme Builder
 * Using CBRE brand colors and standards
 */

import { ThemeColors, TypographyStyles, LayoutTemplate, SlideDimensions, SlideSize, TemplateConfig } from './types';
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

// Default typography styles
export const defaultTypography: TypographyStyles = {
  heading: {
    fontFamily: 'heading',
    fontSize: 48,
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: 0,
    color: cbreTheme.colors['cbre-green'],
    textTransform: 'none',
  },
  subtitle: {
    fontFamily: 'heading',
    fontSize: 32,
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: 0,
    color: cbreTheme.colors['dark-grey'],
    textTransform: 'none',
  },
  bodyLarge: {
    fontFamily: 'body',
    fontSize: 20,
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: 0,
    color: cbreTheme.colors['dark-grey'],
    textTransform: 'none',
  },
  bodySmall: {
    fontFamily: 'body',
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: 0,
    color: cbreTheme.colors['dark-grey'],
    textTransform: 'none',
  },
  quote: {
    fontFamily: 'body',
    fontSize: 24,
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: 0,
    color: cbreTheme.colors['sage'],
    textTransform: 'none',
  },
  bullet: {
    fontFamily: 'body',
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: 0,
    color: cbreTheme.colors['dark-grey'],
    textTransform: 'none',
  },
  link: {
    fontFamily: 'body',
    fontSize: 18,
    fontWeight: 400,
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
        y: 96,
        width: 1758,
        height: 72,
      },
      {
        id: 'content',
        type: 'body',
        x: 81,
        y: 192,
        width: 1758,
        height: 792,
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
        y: 96,
        width: 1758,
        height: 72,
      },
      {
        id: 'content-left',
        type: 'body',
        x: 81,
        y: 192,
        width: 870,
        height: 792,
      },
      {
        id: 'content-right',
        type: 'body',
        x: 969,
        y: 192,
        width: 870,
        height: 792,
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
        y: 96,
        width: 1758,
        height: 72,
      },
      {
        id: 'left-heading',
        type: 'subtitle',
        x: 81,
        y: 192,
        width: 870,
        height: 72, // Matches 1 Row height (24px grid)
      },
      {
        id: 'left-content',
        type: 'body',
        x: 81,
        y: 288,
        width: 870,
        height: 696,
      },
      {
        id: 'right-heading',
        type: 'subtitle',
        x: 969,
        y: 192,
        width: 870,
        height: 72,
      },
      {
        id: 'right-content',
        type: 'body',
        x: 969,
        y: 288,
        width: 870,
        height: 696,
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
];

// Default template configuration
export const defaultTemplateConfig: TemplateConfig = {
  id: '',
  name: 'My PowerPoint Template',
  theme: {
    colors: defaultThemeColors,
  },
  fonts: {
    heading: {
      family: 'Financier Display',
      file: null,
    },
    body: {
      family: 'Calibre',
      file: null,
    },
  },
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
