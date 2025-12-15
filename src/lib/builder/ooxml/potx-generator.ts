/**
 * Main POTX Generator - Assembles all OOXML parts into a proper .potx file
 * A .potx file is a ZIP archive containing Office Open XML files
 */

import JSZip from 'jszip';
import { OOXMLThemeColors, OOXMLFontScheme, OOXMLSlideSize, OOXMLGuide, SLIDE_SIZES, pixelsToEMU } from './types';
import { generateThemeXml } from './theme-generator';
import { generateSlideMasterXml, generateSlideMasterRelsXml } from './slide-master-generator';
import { generateSlideLayoutXml, generateSlideLayoutRelsXml, getLayoutConfigs } from './slide-layout-generator';
import {
  generatePresentationXml,
  generatePresentationRelsXml,
  generatePresPropsXml,
  generateViewPropsXml,
  generateTableStylesXml,
  generateContentTypesXml,
  generateRootRelsXml,
  generateCorePropsXml,
  generateAppPropsXml,
} from './presentation-generator';

export interface POTXConfig {
  name: string;
  themeColors: OOXMLThemeColors;
  fonts: OOXMLFontScheme;
  slideSize: '16:9' | '4:3' | 'A4-landscape';
  guides: Array<{ orientation: 'horizontal' | 'vertical'; position: number }>;  // position in pixels
  typography: {
    heading: { fontSize: number; fontWeight: number; color: string };
    subtitle: { fontSize: number; fontWeight: number; color: string };
    bodyLarge: { fontSize: number; fontWeight: number; color: string };
  };
}

/**
 * Generate a complete .potx file as a Blob
 */
export async function generatePOTX(config: POTXConfig): Promise<Blob> {
  const zip = new JSZip();
  
  // Get slide size in EMUs
  const slideSize: OOXMLSlideSize = SLIDE_SIZES[config.slideSize] || SLIDE_SIZES['16:9'];
  
  // Get the pixel dimensions for the slide size
  // 16:9 = 1920x1080px, A4-landscape uses mm but we'll map to reasonable pixels
  const pixelWidth = config.slideSize === 'A4-landscape' ? 1122 : 1920;  // 297mm * ~3.78 px/mm
  const pixelHeight = config.slideSize === 'A4-landscape' ? 794 : 1080;   // 210mm * ~3.78 px/mm
  
  // Convert guides to OOXML format
  // Guide pos is measured from center of slide
  // After testing: values need to be ~10x larger than points to span the slide
  // Range should be roughly -4800 to +4800 for 16:9 slides
  
  const rawGuides: OOXMLGuide[] = config.guides.map(g => {
    // Calculate EMUs per pixel for this slide size
    const emuPerPixelX = slideSize.cx / pixelWidth;
    const emuPerPixelY = slideSize.cy / pixelHeight;
    
    // Guide positions in OOXML are relative to top-left corner
    // Unit is 1/8 point (1587.5 EMUs)
    
    if (g.orientation === 'vertical') {
      const positionInEMU = g.position * emuPerPixelX;
      return { orient: 'vert', pos: Math.round(positionInEMU / 1587.5) };
    } else {
      const positionInEMU = g.position * emuPerPixelY;
      return { orient: 'horz', pos: Math.round(positionInEMU / 1587.5) };
    }
  });
  
  // Deduplicate guides to avoid PowerPoint repair issues
  const seenGuides = new Set<string>();
  const guides: OOXMLGuide[] = rawGuides.filter(g => {
    const key = `${g.orient}-${g.pos}`;
    if (seenGuides.has(key)) {
      return false;
    }
    seenGuides.add(key);
    return true;
  });

  const layoutCount = getLayoutConfigs().length;  // 6 standard layouts

  // === Root level ===
  zip.file('[Content_Types].xml', generateContentTypesXml(layoutCount));
  
  // === _rels folder ===
  const relsFolder = zip.folder('_rels');
  if (relsFolder) {
    relsFolder.file('.rels', generateRootRelsXml());
  }

  // === docProps folder ===
  const docPropsFolder = zip.folder('docProps');
  if (docPropsFolder) {
    docPropsFolder.file('core.xml', generateCorePropsXml(config.name, 'PPT Theme Builder'));
    docPropsFolder.file('app.xml', generateAppPropsXml(config.name));
  }

  // === ppt folder ===
  const pptFolder = zip.folder('ppt');
  if (pptFolder) {
    // Main presentation file
    pptFolder.file('presentation.xml', generatePresentationXml(slideSize, guides));
    pptFolder.file('presProps.xml', generatePresPropsXml());
    pptFolder.file('viewProps.xml', generateViewPropsXml(guides));
    pptFolder.file('tableStyles.xml', generateTableStylesXml());

    // ppt/_rels
    const pptRelsFolder = pptFolder.folder('_rels');
    if (pptRelsFolder) {
      pptRelsFolder.file('presentation.xml.rels', generatePresentationRelsXml());
    }

    // ppt/theme
    const themeFolder = pptFolder.folder('theme');
    if (themeFolder) {
      themeFolder.file('theme1.xml', generateThemeXml(
        config.name,
        config.themeColors,
        config.fonts
      ));
    }

    // ppt/slideMasters
    const slideMastersFolder = pptFolder.folder('slideMasters');
    if (slideMastersFolder) {
      slideMastersFolder.file('slideMaster1.xml', generateSlideMasterXml(
        slideSize,
        config.typography,
        config.themeColors.lt1
      ));

      // slideMasters/_rels
      const slideMasterRelsFolder = slideMastersFolder.folder('_rels');
      if (slideMasterRelsFolder) {
        slideMasterRelsFolder.file('slideMaster1.xml.rels', generateSlideMasterRelsXml(layoutCount));
      }
    }

    // ppt/slideLayouts
    const slideLayoutsFolder = pptFolder.folder('slideLayouts');
    if (slideLayoutsFolder) {
      // slideLayouts/_rels
      const slideLayoutRelsFolder = slideLayoutsFolder.folder('_rels');

      for (let i = 0; i < layoutCount; i++) {
        slideLayoutsFolder.file(`slideLayout${i + 1}.xml`, generateSlideLayoutXml(i, slideSize));
        if (slideLayoutRelsFolder) {
          slideLayoutRelsFolder.file(`slideLayout${i + 1}.xml.rels`, generateSlideLayoutRelsXml());
        }
      }
    }
  }

  // Generate the ZIP blob
  return await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.template',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });
}

/**
 * Convert app config to POTX config format
 */
export function convertToPOTXConfig(appConfig: any): POTXConfig {
  return {
    name: appConfig.name || 'Untitled Template',
    themeColors: {
      dk1: appConfig.theme.colors.dark1,
      lt1: appConfig.theme.colors.light1,
      dk2: appConfig.theme.colors.dark2,
      lt2: appConfig.theme.colors.light2,
      accent1: appConfig.theme.colors.accent1,
      accent2: appConfig.theme.colors.accent2,
      accent3: appConfig.theme.colors.accent3,
      accent4: appConfig.theme.colors.accent4,
      accent5: appConfig.theme.colors.accent5,
      accent6: appConfig.theme.colors.accent6,
      hlink: appConfig.theme.colors.hyperlink,
      folHlink: appConfig.theme.colors.followedHyperlink,
    },
    fonts: {
      majorFont: appConfig.fonts.heading.family,
      minorFont: appConfig.fonts.body.family,
    },
    slideSize: appConfig.slideSize === 'A4-landscape' ? 'A4-landscape' : '16:9',
    guides: appConfig.guides.map((g: any) => ({
      orientation: g.orientation,
      position: g.position,
    })),
    typography: {
      heading: {
        fontSize: appConfig.typography.heading.fontSize,
        fontWeight: appConfig.typography.heading.fontWeight,
        color: appConfig.typography.heading.color,
      },
      subtitle: {
        fontSize: appConfig.typography.subtitle.fontSize,
        fontWeight: appConfig.typography.subtitle.fontWeight,
        color: appConfig.typography.subtitle.color,
      },
      bodyLarge: {
        fontSize: appConfig.typography.bodyLarge.fontSize,
        fontWeight: appConfig.typography.bodyLarge.fontWeight,
        color: appConfig.typography.bodyLarge.color,
      },
    },
  };
}

