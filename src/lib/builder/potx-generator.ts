/**
 * PowerPoint .potx template generator using PptxGenJS
 */

import PptxGenJS from 'pptxgenjs';
import { TemplateConfig } from './types';

export function generatePotxFile(config: TemplateConfig): PptxGenJS {
  const pptx = new PptxGenJS();

  // Set presentation properties
  pptx.author = 'PPT Theme Builder';
  pptx.company = config.name;
  pptx.title = config.name;
  pptx.subject = 'PowerPoint Template';

  // Set slide dimensions
  if (config.slideSize === '16:9') {
    pptx.layout = 'LAYOUT_16x9';
  } else if (config.slideSize === 'A4-landscape') {
    // A4 landscape in inches: 11.69 x 8.27
    pptx.defineLayout({ name: 'A4-landscape', width: 11.69, height: 8.27 });
    pptx.layout = 'A4-landscape';
  }

  // Define theme colors
  // PptxGenJS uses color names, so we'll map our theme colors
  const themeColors: Record<string, string> = {
    'tx1': config.theme.colors.dark1,      // Text 1
    'tx2': config.theme.colors.dark2,      // Text 2
    'bg1': config.theme.colors.light1,     // Background 1
    'bg2': config.theme.colors.light2,     // Background 2
    'accent1': config.theme.colors.accent1,
    'accent2': config.theme.colors.accent2,
    'accent3': config.theme.colors.accent3,
    'accent4': config.theme.colors.accent4,
    'accent5': config.theme.colors.accent5,
    'accent6': config.theme.colors.accent6,
  };

  // Set theme (PptxGenJS has limited theme support, but we'll apply colors to slides)

  // Add master slides for each selected layout
  const selectedLayouts = config.selectedLayouts.map((layoutId) => {
    const layout = getLayoutById(layoutId, config);
    return layout;
  }).filter(Boolean);

  selectedLayouts.forEach((layout) => {
    if (!layout) return;

    const slide = pptx.addSlide({ masterName: layout.name });
    slide.background = { color: config.theme.colors.light1 };

    // Add placeholders to the slide
    layout.placeholders.forEach((placeholder) => {
      const x = placeholder.x / config.slideDimensions.width;
      const y = placeholder.y / config.slideDimensions.height;
      const w = placeholder.width / config.slideDimensions.width;
      const h = placeholder.height / config.slideDimensions.height;

      // Get text style based on placeholder type
      let textStyle;
      switch (placeholder.type) {
        case 'title':
          textStyle = config.typography.heading;
          break;
        case 'subtitle':
          textStyle = config.typography.subtitle;
          break;
        case 'body':
        default:
          textStyle = config.typography.bodyLarge;
          break;
      }

      // Add text box
      slide.addText(getSampleText(placeholder.type), {
        x: `${(x * 100).toFixed(2)}%`,
        y: `${(y * 100).toFixed(2)}%`,
        w: `${(w * 100).toFixed(2)}%`,
        h: `${(h * 100).toFixed(2)}%`,
        fontSize: textStyle.fontSize,
        color: textStyle.color,
        fontFace: textStyle.fontFamily === 'heading' ? config.fonts.heading.family : config.fonts.body.family,
        bold: textStyle.fontWeight >= 600,
        align: placeholder.type === 'title' || placeholder.type === 'subtitle' ? 'center' : 'left',
        valign: placeholder.type === 'title' || placeholder.type === 'subtitle' ? 'middle' : 'top',
        placeholder: placeholder.type,
      });
    });
  });

  return pptx;
}

function getLayoutById(layoutId: string, config: TemplateConfig) {
  const { defaultLayoutTemplates } = require('./defaults');
  return defaultLayoutTemplates.find((l: any) => l.id === layoutId);
}

function getSampleText(type: string): string {
  switch (type) {
    case 'title':
      return 'Click to edit title';
    case 'subtitle':
      return 'Click to edit subtitle';
    case 'body':
      return 'Click to edit content';
    default:
      return 'Click to edit';
  }
}

export async function generatePotxBlob(config: TemplateConfig): Promise<Blob> {
  const pptx = generatePotxFile(config);

  // Generate blob
  return new Promise((resolve, reject) => {
    pptx.write({
      outputType: 'blob',
    }).then((blob) => {
      resolve(blob as Blob);
    }).catch((error) => {
      reject(error);
    });
  });
}
