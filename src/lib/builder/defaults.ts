/**
 * Default values and layout templates for PPT Theme Builder
 * Using CBRE brand colors and standards
 */

import { ThemeColors, TypographyStyles, LayoutTemplate, SlideDimensions, SlideSize, TemplateConfig } from './types';
import cbreTheme from '../../../config/cbre-theme.ts';

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
export const defaultLayoutTemplates: LayoutTemplate[] = [
  {
    id: 'title-slide',
    name: 'Title Slide',
    description: 'Main title and subtitle centered',
    placeholders: [
      {
        id: 'title',
        type: 'title',
        x: 200,
        y: 350,
        width: 1520,
        height: 200,
      },
      {
        id: 'subtitle',
        type: 'subtitle',
        x: 200,
        y: 600,
        width: 1520,
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
        x: 120,
        y: 80,
        width: 1680,
        height: 120,
      },
      {
        id: 'content',
        type: 'body',
        x: 120,
        y: 240,
        width: 1680,
        height: 720,
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
        x: 120,
        y: 80,
        width: 1680,
        height: 100,
      },
      {
        id: 'content-left',
        type: 'body',
        x: 120,
        y: 220,
        width: 800,
        height: 740,
      },
      {
        id: 'content-right',
        type: 'body',
        x: 1000,
        y: 220,
        width: 800,
        height: 740,
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
        x: 120,
        y: 80,
        width: 1680,
        height: 100,
      },
      {
        id: 'left-heading',
        type: 'subtitle',
        x: 120,
        y: 220,
        width: 800,
        height: 80,
      },
      {
        id: 'left-content',
        type: 'body',
        x: 120,
        y: 320,
        width: 800,
        height: 640,
      },
      {
        id: 'right-heading',
        type: 'subtitle',
        x: 1000,
        y: 220,
        width: 800,
        height: 80,
      },
      {
        id: 'right-content',
        type: 'body',
        x: 1000,
        y: 320,
        width: 800,
        height: 640,
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
        x: 200,
        y: 400,
        width: 1520,
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
    // Default guides for 16:9 (center lines)
    { id: 'v-center', orientation: 'vertical', position: 960 },
    { id: 'h-center', orientation: 'horizontal', position: 540 },
  ],
  selectedLayouts: ['title-slide', 'title-content', 'two-content', 'blank'],
};
