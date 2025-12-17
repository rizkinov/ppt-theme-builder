/**
 * Main POTX Generator - Assembles all OOXML parts into a proper .potx file
 * A .potx file is a ZIP archive containing Office Open XML files
 */


import JSZip from 'jszip';
import { OOXMLThemeColors, OOXMLFontScheme, OOXMLSlideSize, OOXMLGuide, TypographyConfig, SLIDE_SIZES, TextStyleConfig } from './types';
import { generateThemeXml } from './theme-generator';
import { generateSlideMasterXml, generateSlideMasterRelsXml } from './slide-master-generator';
import { generateSlideLayoutXml, generateSlideLayoutRelsXml, getLayoutConfigs } from './slide-layout-generator';
import { FontAsset, TemplateConfig } from '../types';
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
  fontLibrary: FontAsset[];
  slideSize: '16:9' | '4:3' | 'A4-landscape';
  guides: Array<{ orientation: 'horizontal' | 'vertical'; position: number }>;  // position in pixels
  typography: TypographyConfig;
  selectedLayouts?: string[];  // Layout IDs to include (if not provided, include all)
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
      return { orient: 'vert' as const, pos: Math.round(positionInEMU / 1587.5) };
    } else {
      const positionInEMU = g.position * emuPerPixelY;
      return { orient: 'horz' as const, pos: Math.round(positionInEMU / 1587.5) };
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

  // Get all available layouts and filter based on selection
  const allLayouts = getLayoutConfigs();

  // Determine which layouts to include
  // Map selected layout IDs to their indices, or use all if none specified
  let selectedIndices: number[];
  if (config.selectedLayouts && config.selectedLayouts.length > 0) {
    // Map the selected layout IDs to their indices in the full layout array
    selectedIndices = config.selectedLayouts
      .map(id => allLayouts.findIndex(layout => layout.type === id))
      .filter(index => index !== -1);  // Filter out any not found
  } else {
    // No selection specified, use all layouts
    selectedIndices = allLayouts.map((_, index) => index);
  }

  const layoutCount = selectedIndices.length;

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
    // Main presentation file (guides are NOT in presentation.xml - they're on the slide master)
    pptFolder.file('presentation.xml', generatePresentationXml(slideSize));
    pptFolder.file('presProps.xml', generatePresPropsXml());
    pptFolder.file('viewProps.xml', generateViewPropsXml(guides));  // Guides placed here
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
      // Slide master (guides are in viewProps.xml)
      slideMastersFolder.file('slideMaster1.xml', generateSlideMasterXml(
        slideSize,
        config.typography,
        layoutCount,
        config.fontLibrary,
        config.fonts
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

      // Generate only the selected layouts
      for (let i = 0; i < selectedIndices.length; i++) {
        const layoutIndex = selectedIndices[i];  // Map to actual layout index
        slideLayoutsFolder.file(`slideLayout${i + 1}.xml`, generateSlideLayoutXml(layoutIndex, slideSize, config.typography, config.fontLibrary));
        if (slideLayoutRelsFolder) {
          slideLayoutRelsFolder.file(`slideLayout${i + 1}.xml.rels`, generateSlideLayoutRelsXml());
        }
      }
    }
  }

  // === Embed Custom Fonts ===
  const fontsFolder = pptFolder?.folder('fonts');
  if (fontsFolder && config.fontLibrary) {
    // We need to handle async fetching for persisted fonts (where file object is lost but url exists)
    const embeddingPromises = config.fontLibrary.map(async (font) => {
      if (font.source === 'upload') {
        let fontBlob: Blob | null = null;
        let fileName = font.file?.name;

        if (font.file) {
          fontBlob = font.file;
        } else if (font.url) {
          try {
            const response = await fetch(font.url);
            if (response.ok) {
              fontBlob = await response.blob();
              // Extract filename from URL or use ID
              const urlPath = font.url.split('/').pop();
              fileName = urlPath ? decodeURIComponent(urlPath) : `${font.id}.ttf`;
            }
          } catch (error) {
            console.error(`Failed to fetch font ${font.name} from ${font.url}`, error);
          }
        }

        if (fontBlob && fileName) {
          // Embed the font file directly into ppt/fonts/
          fontsFolder.file(fileName, fontBlob);
        }
      }
    });

    await Promise.all(embeddingPromises);
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
 * Convert app config to POTXConfig format
 */
export function convertToPOTXConfig(appConfig: TemplateConfig): POTXConfig {
  // Resolve Major (Heading) and Minor (Body) fonts for the theme
  const headingFontId = appConfig.typography.heading.fontId;
  const bodyFontId = appConfig.typography.bodyLarge.fontId;

  const headingFontAsset = appConfig.fontLibrary.find(f => f.id === headingFontId);
  const bodyFontAsset = appConfig.fontLibrary.find(f => f.id === bodyFontId);

  // Fallback to Calibri if not found
  const majorFont = headingFontAsset ? headingFontAsset.family : 'Calibri';
  const minorFont = bodyFontAsset ? bodyFontAsset.family : 'Calibri';

  // Helper to map TextStyle to TextStyleConfig
  const mapStyle = (style: any): TextStyleConfig => ({
    fontId: style.fontId,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    color: style.color,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
    textTransform: style.textTransform,
  });

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
      majorFont,
      minorFont,
    },
    fontLibrary: appConfig.fontLibrary,
    slideSize: appConfig.slideSize === 'A4-landscape' ? 'A4-landscape' : '16:9',
    guides: appConfig.guides.map((g) => ({
      orientation: g.orientation,
      position: g.position,
    })),
    selectedLayouts: appConfig.selectedLayouts,
    typography: {
      heading: mapStyle(appConfig.typography.heading),
      subtitle: mapStyle(appConfig.typography.subtitle),
      bodyLarge: mapStyle(appConfig.typography.bodyLarge),
      bodySmall: mapStyle(appConfig.typography.bodySmall),
      quote: mapStyle(appConfig.typography.quote),
      bullet: mapStyle(appConfig.typography.bullet),
      link: mapStyle(appConfig.typography.link),
    },
  };
}


