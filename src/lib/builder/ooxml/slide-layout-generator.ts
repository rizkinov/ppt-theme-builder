/**
 * Generate slideLayoutN.xml files for PowerPoint template
 * Each layout defines a specific slide arrangement users can choose from
 */

import { xmlDeclaration, NAMESPACES, escapeXml } from './xml-utils';
import { OOXMLSlideSize, TypographyConfig } from './types';
import { FontAsset } from '../types';

// ============================================================================
// CBRE GRID CONSTANTS (for 1920x1080 base, scaled for other sizes)
// EXACT values from CBRE PPT.pptx guides - must match defaults.ts GRID
// ============================================================================
const CBRE_GRID = {
  // Content area boundaries (from guides)
  CONTENT_X: 80,                       // Col 1 start (after margin + gutter)
  CONTENT_END_X: 1840,                 // Col 22 end
  CONTENT_WIDTH: 1760,                 // 1840 - 80 = 1760px

  // Row Y positions (start of each row) - from extracted guides
  ROW_Y: [72, 154, 252, 350, 450, 548, 646, 746, 844, 942],
  // Row heights
  ROW_H: [66, 82, 82, 84, 82, 82, 84, 82, 82, 66],
  // Row end positions
  ROW_END: [138, 236, 334, 434, 532, 630, 730, 828, 926, 1008],

  // Standard layout positions
  TITLE_Y: 72,                         // Row 1 start
  TITLE_HEIGHT: 164,                   // Rows 1-2 (236 - 72 = 164px)
  CONTENT_Y: 252,                      // Row 3 start
  CONTENT_HEIGHT: 756,                 // Rows 3-10 (1008 - 252 = 756px)

  // Half widths for two-column layouts (11 columns each)
  HALF_WIDTH: 872,                     // 952 - 80 = 872px (cols 1-11)
  HALF_GAP: 16,                        // Gap between halves (952 to 968)
  HALF_RIGHT_X: 968,                   // Col 12 start

  // Title slide (centered)
  TITLE_SLIDE_TITLE_Y: 350,            // Row 4 start
  TITLE_SLIDE_TITLE_H: 182,            // Rows 4-5 (532 - 350 = 182px)
  TITLE_SLIDE_SUBTITLE_Y: 548,         // Row 6 start
  TITLE_SLIDE_SUBTITLE_H: 182,         // Rows 6-7 (730 - 548 = 182px)

  // Section header (vertically centered)
  SECTION_Y: 450,                      // Row 5 start
  SECTION_HEIGHT: 280,                 // Rows 5-7 (730 - 450 = 280px)

  // Three column widths (7-7-8 split) - from guides
  // Col 1-7: 80 to 630 = 550px
  // Col 8-14: 644 to 1194 = 550px
  // Col 15-22: 1210 to 1840 = 630px
  THREE_COL_LEFT_WIDTH: 550,
  THREE_COL_CENTER_X: 644,
  THREE_COL_CENTER_WIDTH: 550,
  THREE_COL_RIGHT_X: 1210,
  THREE_COL_RIGHT_WIDTH: 630,
};

export type LayoutType =
  | 'title-slide'
  | 'title-content'
  | 'section-header'
  | 'two-content'
  | 'comparison'
  | 'blank'
  | 'quote'
  | 'title-only'
  | 'three-content'
  | 'content-sidebar-stacked'
  | 'sidebar-content';

interface LayoutConfig {
  type: LayoutType;
  name: string;
  pptxType: string;
}

const LAYOUT_CONFIGS: LayoutConfig[] = [
  { type: 'title-slide', name: 'Title Slide', pptxType: 'title' },
  { type: 'title-content', name: 'Title and Content', pptxType: 'obj' },
  { type: 'section-header', name: 'Section Header', pptxType: 'secHead' },
  { type: 'two-content', name: 'Two Content', pptxType: 'twoObj' },
  { type: 'comparison', name: 'Comparison', pptxType: 'twoTxTwoObj' },
  { type: 'blank', name: 'Blank', pptxType: 'blank' },
  { type: 'quote', name: 'Quote', pptxType: 'obj' },
  { type: 'title-only', name: 'Title Only', pptxType: 'titleOnly' },
  { type: 'three-content', name: 'Three Content', pptxType: 'cust' },
  { type: 'content-sidebar-stacked', name: 'Content + Sidebar', pptxType: 'cust' },
  { type: 'sidebar-content', name: 'Sidebar + Content', pptxType: 'cust' },
];

export function getLayoutConfigs(): LayoutConfig[] {
  return LAYOUT_CONFIGS;
}

export function generateSlideLayoutXml(
  layoutIndex: number,
  slideSize: OOXMLSlideSize,
  typography: TypographyConfig,
  fontLibrary: FontAsset[]
): string {
  const config = LAYOUT_CONFIGS[layoutIndex];
  if (!config) {
    throw new Error(`Invalid layout index: ${layoutIndex}`);
  }

  // Pre-calculate theme fonts
  const headingFontAsset = fontLibrary.find(f => f.id === typography.heading.fontId);
  const bodyFontAsset = fontLibrary.find(f => f.id === typography.bodyLarge.fontId);
  const majorFamily = headingFontAsset ? headingFontAsset.family : 'Calibri';
  const minorFamily = bodyFontAsset ? bodyFontAsset.family : 'Calibri';

  // Helper to resolve font references
  const getFontRefs = (fontId: string) => {
    const asset = fontLibrary.find(f => f.id === fontId);
    if (!asset) return { lt: '+mn-lt', ea: '+mn-ea', cs: '+mn-cs' }; // Default to minor

    // If it's a specific weight variant that isn't standard Regular/Bold, prefer the explicit name
    const isSpecialVariant = asset.name.match(/(Light|Medium|Thin|Black|Semibold|ExtraBold)/i);

    if (isSpecialVariant) {
      return { lt: asset.name, ea: asset.name, cs: asset.name };
    }

    if (asset.family === majorFamily) return { lt: '+mj-lt', ea: '+mj-ea', cs: '+mj-cs' };
    if (asset.family === minorFamily) return { lt: '+mn-lt', ea: '+mn-ea', cs: '+mn-cs' };

    // Custom font
    return { lt: asset.family, ea: asset.family, cs: asset.family };
  };

  // Helper to resolve weight
  const getWeight = (fontId: string, styleWeight?: number) => {
    const asset = fontLibrary.find(f => f.id === fontId);

    // If it's a special variant (like Medium), we do NOT want to mimic bold.
    const isSpecialVariant = asset?.name.match(/(Light|Medium|Thin|Black|Semibold|ExtraBold)/i);
    if (isSpecialVariant) return '0';

    const weight = styleWeight || asset?.weight || 400;
    return weight >= 600 ? '1' : '0';
  };

  // Helper to resolve italic
  const getItalic = (fontId: string) => {
    const asset = fontLibrary.find(f => f.id === fontId);
    return asset?.style === 'italic' ? '1' : '0';
  };

  const utils = { getFontRefs, getWeight, getItalic };

  switch (config.type) {
    case 'title-slide':
      return generateTitleSlideLayout(slideSize, config, typography, utils);
    case 'title-content':
      return generateTitleContentLayout(slideSize, config, typography, utils);
    case 'section-header':
      return generateSectionHeaderLayout(slideSize, config, typography, utils);
    case 'two-content':
      return generateTwoContentLayout(slideSize, config, typography, utils);
    case 'comparison':
      return generateComparisonLayout(slideSize, config, typography, utils);
    case 'blank':
      return generateBlankLayout(slideSize, config, typography);
    case 'quote':
      return generateQuoteLayout(slideSize, config, typography, utils);
    case 'title-only':
      return generateTitleOnlyLayout(slideSize, config, typography, utils);
    case 'three-content':
      return generateThreeContentLayout(slideSize, config, typography, utils);
    case 'content-sidebar-stacked':
      return generateContentSidebarStackedLayout(slideSize, config, typography, utils);
    case 'sidebar-content':
      return generateSidebarContentLayout(slideSize, config, typography, utils);
    default:
      return generateBlankLayout(slideSize, config, typography);
  }
}

interface FontUtils {
  getFontRefs: (fontId: string) => { lt: string; ea: string; cs: string };
  getWeight: (fontId: string, w?: number) => string;
  getItalic: (fontId: string) => string;
}

function getColorSchemeRef(ref?: string): string {
  switch (ref) {
    case 'dark1': return 'tx1';
    case 'dark2': return 'tx2';
    case 'light1': return 'bg1'; // mapped to lt1
    case 'light2': return 'bg2'; // mapped to lt2
    case 'accent1': return 'accent1';
    case 'accent2': return 'accent2';
    case 'accent3': return 'accent3';
    case 'accent4': return 'accent4';
    case 'accent5': return 'accent5';
    case 'accent6': return 'accent6';
    case 'hyperlink': return 'hlink';
    case 'followedHyperlink': return 'folHlink';
    default: return 'tx1';
  }
}

function generateTitleSlideLayout(slideSize: OOXMLSlideSize, config: LayoutConfig, typography: TypographyConfig, utils: FontUtils): string {
  const xScale = slideSize.cx / 1920;
  const yScale = slideSize.cy / 1080;

  // Title: Rows 4-5
  const titleX = Math.round(CBRE_GRID.CONTENT_X * xScale);
  const titleY = Math.round(CBRE_GRID.TITLE_SLIDE_TITLE_Y * yScale);
  const titleCx = Math.round(CBRE_GRID.CONTENT_WIDTH * xScale);
  const titleCy = Math.round(CBRE_GRID.TITLE_SLIDE_TITLE_H * yScale);

  // Subtitle: Rows 6-7
  const subtitleX = Math.round(CBRE_GRID.CONTENT_X * xScale);
  const subtitleY = Math.round(CBRE_GRID.TITLE_SLIDE_SUBTITLE_Y * yScale);
  const subtitleCx = Math.round(CBRE_GRID.CONTENT_WIDTH * xScale);
  const subtitleCy = Math.round(CBRE_GRID.TITLE_SLIDE_SUBTITLE_H * yScale);

  return `${xmlDeclaration()}<p:sldLayout xmlns:a="${NAMESPACES.a}" xmlns:r="${NAMESPACES.r}" xmlns:p="${NAMESPACES.p}" type="${config.pptxType}" preserve="1">
  <p:cSld name="${escapeXml(config.name)}">
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="2" name="Title 1"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="ctrTitle"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${titleX}" y="${titleY}"/>
            <a:ext cx="${titleCx}" cy="${titleCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0" anchor="b"/>
          <a:lstStyle>
            <a:lvl1pPr algn="ctr">
              <a:lnSpc><a:spcPct val="${Math.round((typography.heading.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.heading.fontSize * 100)}" spc="${Math.round(typography.heading.fontSize * 100 * (typography.heading.letterSpacing || 0))}" b="${utils.getWeight(typography.heading.fontId, typography.heading.fontWeight)}" i="${utils.getItalic(typography.heading.fontId)}" ${typography.heading.textTransform === 'uppercase' ? 'cap="all"' : ''}>
                <a:solidFill>
                  <a:schemeClr val="${getColorSchemeRef(typography.heading.colorRef)}"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.heading.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.heading.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.heading.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit title</a:t>
            </a:r>
            <a:endParaRPr lang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="3" name="Subtitle 2"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="subTitle" idx="1"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${subtitleX}" y="${subtitleY}"/>
            <a:ext cx="${subtitleCx}" cy="${subtitleCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr marL="0" indent="0" algn="ctr">
              <a:lnSpc><a:spcPct val="${Math.round((typography.subtitle.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:buNone/>
              <a:defRPr sz="${Math.round(typography.subtitle.fontSize * 100)}" spc="${Math.round(typography.subtitle.fontSize * 100 * (typography.subtitle.letterSpacing || 0))}" b="${utils.getWeight(typography.subtitle.fontId, typography.subtitle.fontWeight)}" i="${utils.getItalic(typography.subtitle.fontId)}" ${typography.subtitle.textTransform === 'uppercase' ? 'cap="all"' : ''}>
                 <a:solidFill>
                  <a:schemeClr val="${getColorSchemeRef(typography.subtitle.colorRef)}"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.subtitle.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.subtitle.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.subtitle.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit subtitle</a:t>
            </a:r>
            <a:endParaRPr lang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sldLayout>`;
}

function generateTitleContentLayout(slideSize: OOXMLSlideSize, config: LayoutConfig, typography: TypographyConfig, utils: FontUtils): string {
  const xScale = slideSize.cx / 1920;
  const yScale = slideSize.cy / 1080;

  // Title: Rows 1-2
  const titleX = Math.round(CBRE_GRID.CONTENT_X * xScale);
  const titleY = Math.round(CBRE_GRID.TITLE_Y * yScale);
  const titleCx = Math.round(CBRE_GRID.CONTENT_WIDTH * xScale);
  const titleCy = Math.round(CBRE_GRID.TITLE_HEIGHT * yScale);

  // Content: Rows 3-10
  const contentX = Math.round(CBRE_GRID.CONTENT_X * xScale);
  const contentY = Math.round(CBRE_GRID.CONTENT_Y * yScale);
  const contentCx = Math.round(CBRE_GRID.CONTENT_WIDTH * xScale);
  const contentCy = Math.round(CBRE_GRID.CONTENT_HEIGHT * yScale);

  return `${xmlDeclaration()}<p:sldLayout xmlns:a="${NAMESPACES.a}" xmlns:r="${NAMESPACES.r}" xmlns:p="${NAMESPACES.p}" type="${config.pptxType}" preserve="1">
  <p:cSld name="${escapeXml(config.name)}">
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="2" name="Title 1"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="title"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${titleX}" y="${titleY}"/>
            <a:ext cx="${titleCx}" cy="${titleCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:lnSpc><a:spcPct val="${Math.round((typography.bodyLarge.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.heading.fontSize * 100)}" spc="${Math.round(typography.heading.fontSize * 100 * (typography.heading.letterSpacing || 0))}" b="${utils.getWeight(typography.heading.fontId, typography.heading.fontWeight)}" i="${utils.getItalic(typography.heading.fontId)}" ${typography.heading.textTransform === 'uppercase' ? 'cap="all"' : ''}>
                <a:solidFill>
                  <a:schemeClr val="${getColorSchemeRef(typography.heading.colorRef)}"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.heading.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.heading.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.heading.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit title</a:t>
            </a:r>
            <a:endParaRPr lang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="3" name="Content Placeholder 2"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph idx="1"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${contentX}" y="${contentY}"/>
            <a:ext cx="${contentCx}" cy="${contentCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:lnSpc><a:spcPct val="${Math.round((typography.bodyLarge.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.bodyLarge.fontSize * 100)}" spc="${Math.round(typography.bodyLarge.fontSize * 100 * (typography.bodyLarge.letterSpacing || 0))}" b="${utils.getWeight(typography.bodyLarge.fontId, typography.bodyLarge.fontWeight)}" i="${utils.getItalic(typography.bodyLarge.fontId)}" ${typography.bodyLarge.textTransform === 'uppercase' ? 'cap="all"' : ''}>
                <a:solidFill>
                  <a:schemeClr val="${getColorSchemeRef(typography.bodyLarge.colorRef)}"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.bodyLarge.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.bodyLarge.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.bodyLarge.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:pPr lvl="0"/>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit text</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sldLayout>`;
}

function generateSectionHeaderLayout(slideSize: OOXMLSlideSize, config: LayoutConfig, typography: TypographyConfig, utils: FontUtils): string {
  const xScale = slideSize.cx / 1920;
  const yScale = slideSize.cy / 1080;

  // Section title: Rows 5-7 (centered vertically)
  const titleX = Math.round(CBRE_GRID.CONTENT_X * xScale);
  const titleY = Math.round(CBRE_GRID.SECTION_Y * yScale);
  const titleCx = Math.round(CBRE_GRID.CONTENT_WIDTH * xScale);
  const titleCy = Math.round(CBRE_GRID.SECTION_HEIGHT * yScale);

  return `${xmlDeclaration()}<p:sldLayout xmlns:a="${NAMESPACES.a}" xmlns:r="${NAMESPACES.r}" xmlns:p="${NAMESPACES.p}" type="${config.pptxType}" preserve="1">
  <p:cSld name="${escapeXml(config.name)}">
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="2" name="Title 1"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="title"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${titleX}" y="${titleY}"/>
            <a:ext cx="${titleCx}" cy="${titleCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0" anchor="ctr"/>
          <a:lstStyle>
            <a:lvl1pPr algn="ctr">
              <a:lnSpc><a:spcPct val="${Math.round((typography.heading.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.heading.fontSize * 100)}" spc="${Math.round(typography.heading.fontSize * 100 * (typography.heading.letterSpacing || 0))}" b="${utils.getWeight(typography.heading.fontId, typography.heading.fontWeight)}" i="${utils.getItalic(typography.heading.fontId)}" ${typography.heading.textTransform === 'uppercase' ? 'cap="all"' : ''}>
                <a:solidFill>
                  <a:schemeClr val="${getColorSchemeRef(typography.heading.colorRef)}"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.heading.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.heading.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.heading.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit section title</a:t>
            </a:r>
            <a:endParaRPr lang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sldLayout>`;
}

function generateTwoContentLayout(slideSize: OOXMLSlideSize, config: LayoutConfig, typography: TypographyConfig, utils: FontUtils): string {
  const xScale = slideSize.cx / 1920;
  const yScale = slideSize.cy / 1080;

  // Title: Rows 1-2
  const titleX = Math.round(CBRE_GRID.CONTENT_X * xScale);
  const titleY = Math.round(CBRE_GRID.TITLE_Y * yScale);
  const titleCx = Math.round(CBRE_GRID.CONTENT_WIDTH * xScale);
  const titleCy = Math.round(CBRE_GRID.TITLE_HEIGHT * yScale);

  // Content: Rows 3-10, split into two halves
  const leftX = Math.round(CBRE_GRID.CONTENT_X * xScale);
  const contentY = Math.round(CBRE_GRID.CONTENT_Y * yScale);
  const contentCx = Math.round(CBRE_GRID.HALF_WIDTH * xScale);
  const contentCy = Math.round(CBRE_GRID.CONTENT_HEIGHT * yScale);

  const rightX = Math.round(CBRE_GRID.HALF_RIGHT_X * xScale);

  return `${xmlDeclaration()}<p:sldLayout xmlns:a="${NAMESPACES.a}" xmlns:r="${NAMESPACES.r}" xmlns:p="${NAMESPACES.p}" type="${config.pptxType}" preserve="1">
  <p:cSld name="${escapeXml(config.name)}">
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="2" name="Title 1"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="title"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${titleX}" y="${titleY}"/>
            <a:ext cx="${titleCx}" cy="${titleCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:lnSpc><a:spcPct val="${Math.round((typography.bodyLarge.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.heading.fontSize * 100)}" spc="${Math.round(typography.heading.fontSize * 100 * (typography.heading.letterSpacing || 0))}" b="${utils.getWeight(typography.heading.fontId, typography.heading.fontWeight)}" i="${utils.getItalic(typography.heading.fontId)}" ${typography.heading.textTransform === 'uppercase' ? 'cap="all"' : ''}>
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.heading.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.heading.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.heading.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit title</a:t>
            </a:r>
            <a:endParaRPr lang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="3" name="Content Placeholder 2"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph sz="half" idx="1"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${leftX}" y="${contentY}"/>
            <a:ext cx="${contentCx}" cy="${contentCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:lnSpc><a:spcPct val="${Math.round((typography.bodyLarge.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.bodyLarge.fontSize * 100)}" spc="${Math.round(typography.bodyLarge.fontSize * 100 * (typography.bodyLarge.letterSpacing || 0))}" b="${utils.getWeight(typography.bodyLarge.fontId, typography.bodyLarge.fontWeight)}" i="${utils.getItalic(typography.bodyLarge.fontId)}" ${typography.bodyLarge.textTransform === 'uppercase' ? 'cap="all"' : ''}>
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.bodyLarge.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.bodyLarge.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.bodyLarge.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:pPr lvl="0"/>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit text</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="4" name="Content Placeholder 3"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph sz="half" idx="2"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${rightX}" y="${contentY}"/>
            <a:ext cx="${contentCx}" cy="${contentCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:lnSpc><a:spcPct val="${Math.round((typography.bodyLarge.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.bodyLarge.fontSize * 100)}" spc="${Math.round(typography.bodyLarge.fontSize * 100 * (typography.bodyLarge.letterSpacing || 0))}" b="${utils.getWeight(typography.bodyLarge.fontId, typography.bodyLarge.fontWeight)}" i="${utils.getItalic(typography.bodyLarge.fontId)}" ${typography.bodyLarge.textTransform === 'uppercase' ? 'cap="all"' : ''}>
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.bodyLarge.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.bodyLarge.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.bodyLarge.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:pPr lvl="0"/>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit text</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sldLayout>`;
}

function generateComparisonLayout(slideSize: OOXMLSlideSize, config: LayoutConfig, typography: TypographyConfig, utils: FontUtils): string {
  const xScale = slideSize.cx / 1920;
  const yScale = slideSize.cy / 1080;

  // Title: Row 1 only
  const titleX = Math.round(CBRE_GRID.CONTENT_X * xScale);
  const titleY = Math.round(CBRE_GRID.TITLE_Y * yScale);
  const titleCx = Math.round(CBRE_GRID.CONTENT_WIDTH * xScale);
  const titleCy = Math.round(CBRE_GRID.ROW_H[0] * yScale);

  // Headers/Subtitles: Row 2
  const leftX = Math.round(CBRE_GRID.CONTENT_X * xScale);
  const rightX = Math.round(CBRE_GRID.HALF_RIGHT_X * xScale);
  const headerY = Math.round(CBRE_GRID.ROW_Y[1] * yScale);
  const headerCx = Math.round(CBRE_GRID.HALF_WIDTH * xScale);
  const headerCy = Math.round(CBRE_GRID.ROW_H[1] * yScale);

  // Content: Rows 3-10
  const contentY = Math.round(CBRE_GRID.CONTENT_Y * yScale);
  const contentCy = Math.round(CBRE_GRID.CONTENT_HEIGHT * yScale);

  return `${xmlDeclaration()}<p:sldLayout xmlns:a="${NAMESPACES.a}" xmlns:r="${NAMESPACES.r}" xmlns:p="${NAMESPACES.p}" type="${config.pptxType}" preserve="1">
  <p:cSld name="${escapeXml(config.name)}">
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="2" name="Title 1"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="title"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${titleX}" y="${titleY}"/>
            <a:ext cx="${titleCx}" cy="${titleCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:lnSpc><a:spcPct val="${Math.round((typography.bodyLarge.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.heading.fontSize * 100)}" spc="${Math.round(typography.heading.fontSize * 100 * (typography.heading.letterSpacing || 0))}" b="${utils.getWeight(typography.heading.fontId, typography.heading.fontWeight)}" i="${utils.getItalic(typography.heading.fontId)}" ${typography.heading.textTransform === 'uppercase' ? 'cap="all"' : ''}>
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.heading.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.heading.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.heading.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit title</a:t>
            </a:r>
            <a:endParaRPr lang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="3" name="Text Placeholder 2"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="body" idx="1"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${leftX}" y="${headerY}"/>
            <a:ext cx="${headerCx}" cy="${headerCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0" anchor="b"/>
          <a:lstStyle>
            <a:lvl1pPr marL="0" indent="0">
              <a:lnSpc><a:spcPct val="${Math.round((typography.subtitle.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:buNone/>
              <a:defRPr sz="${Math.round(typography.subtitle.fontSize * 100)}" spc="${Math.round(typography.subtitle.fontSize * 100 * (typography.subtitle.letterSpacing || 0))}" b="${utils.getWeight(typography.subtitle.fontId, typography.subtitle.fontWeight)}" i="${utils.getItalic(typography.subtitle.fontId)}" ${typography.subtitle.textTransform === 'uppercase' ? 'cap="all"' : ''}>
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.subtitle.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.subtitle.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.subtitle.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit heading</a:t>
            </a:r>
            <a:endParaRPr lang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="4" name="Content Placeholder 3"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph sz="half" idx="2"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${leftX}" y="${contentY}"/>
            <a:ext cx="${headerCx}" cy="${contentCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:lnSpc><a:spcPct val="${Math.round((typography.bodyLarge.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.bodyLarge.fontSize * 100)}" spc="${Math.round(typography.bodyLarge.fontSize * 100 * (typography.bodyLarge.letterSpacing || 0))}" b="${utils.getWeight(typography.bodyLarge.fontId, typography.bodyLarge.fontWeight)}" i="${utils.getItalic(typography.bodyLarge.fontId)}" ${typography.bodyLarge.textTransform === 'uppercase' ? 'cap="all"' : ''}>
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.bodyLarge.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.bodyLarge.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.bodyLarge.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:pPr lvl="0"/>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit text</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="5" name="Text Placeholder 4"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="body" sz="quarter" idx="3"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${rightX}" y="${headerY}"/>
            <a:ext cx="${headerCx}" cy="${headerCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0" anchor="b"/>
          <a:lstStyle>
            <a:lvl1pPr marL="0" indent="0">
              <a:lnSpc><a:spcPct val="${Math.round((typography.subtitle.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:buNone/>
              <a:defRPr sz="${Math.round(typography.subtitle.fontSize * 100)}" spc="${Math.round(typography.subtitle.fontSize * 100 * (typography.subtitle.letterSpacing || 0))}" b="${utils.getWeight(typography.subtitle.fontId, typography.subtitle.fontWeight)}" i="${utils.getItalic(typography.subtitle.fontId)}" ${typography.subtitle.textTransform === 'uppercase' ? 'cap="all"' : ''}>
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.subtitle.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.subtitle.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.subtitle.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit heading</a:t>
            </a:r>
            <a:endParaRPr lang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="6" name="Content Placeholder 5"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph sz="quarter" idx="4"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${rightX}" y="${contentY}"/>
            <a:ext cx="${headerCx}" cy="${contentCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:lnSpc><a:spcPct val="${Math.round((typography.bodyLarge.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.bodyLarge.fontSize * 100)}" spc="${Math.round(typography.bodyLarge.fontSize * 100 * (typography.bodyLarge.letterSpacing || 0))}" b="${utils.getWeight(typography.bodyLarge.fontId, typography.bodyLarge.fontWeight)}" i="${utils.getItalic(typography.bodyLarge.fontId)}" ${typography.bodyLarge.textTransform === 'uppercase' ? 'cap="all"' : ''}>
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.bodyLarge.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.bodyLarge.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.bodyLarge.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:pPr lvl="0"/>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit text</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sldLayout>`;
}

function generateBlankLayout(slideSize: OOXMLSlideSize, config: LayoutConfig, _typography: TypographyConfig): string {
  return `${xmlDeclaration()}<p:sldLayout xmlns:a="${NAMESPACES.a}" xmlns:r="${NAMESPACES.r}" xmlns:p="${NAMESPACES.p}" type="${config.pptxType}" preserve="1">
  <p:cSld name="${escapeXml(config.name)}">
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sldLayout>`;
}

function generateQuoteLayout(slideSize: OOXMLSlideSize, config: LayoutConfig, typography: TypographyConfig, utils: FontUtils): string {
  const x = slideSize.cx / 1920;
  const y = slideSize.cy / 1080;

  const quoteX = Math.round(210 * x);
  const quoteY = Math.round(300 * y);
  const quoteCx = Math.round(1500 * x);
  const quoteCy = Math.round(480 * y);

  return `${xmlDeclaration()}<p:sldLayout xmlns:a="${NAMESPACES.a}" xmlns:r="${NAMESPACES.r}" xmlns:p="${NAMESPACES.p}" type="${config.pptxType}" preserve="1">
  <p:cSld name="${escapeXml(config.name)}">
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="2" name="Quote Placeholder 1"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
             <p:ph type="body" idx="1"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${quoteX}" y="${quoteY}"/>
            <a:ext cx="${quoteCx}" cy="${quoteCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0" anchor="ctr"/>
          <a:lstStyle>
            <a:lvl1pPr algn="ctr" marL="0" indent="0">
              <a:buNone/>
              <a:defRPr sz="${Math.round(typography.quote.fontSize * 100)}" b="${utils.getWeight(typography.quote.fontId, typography.quote.fontWeight)}" i="${utils.getItalic(typography.quote.fontId)}" ${typography.quote.textTransform === 'uppercase' ? 'cap="all"' : ''}>
                <a:solidFill>
                  <a:schemeClr val="${getColorSchemeRef(typography.quote.colorRef)}"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.quote.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.quote.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.quote.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
             <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to add quote</a:t>
            </a:r>
            <a:endParaRPr lang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sldLayout>`;
}

function generateTitleOnlyLayout(slideSize: OOXMLSlideSize, config: LayoutConfig, typography: TypographyConfig, utils: FontUtils): string {
  const xScale = slideSize.cx / 1920;
  const yScale = slideSize.cy / 1080;

  // Title: Rows 1-2
  const titleX = Math.round(CBRE_GRID.CONTENT_X * xScale);
  const titleY = Math.round(CBRE_GRID.TITLE_Y * yScale);
  const titleCx = Math.round(CBRE_GRID.CONTENT_WIDTH * xScale);
  const titleCy = Math.round(CBRE_GRID.TITLE_HEIGHT * yScale);

  return `${xmlDeclaration()}<p:sldLayout xmlns:a="${NAMESPACES.a}" xmlns:r="${NAMESPACES.r}" xmlns:p="${NAMESPACES.p}" type="${config.pptxType}" preserve="1">
  <p:cSld name="${escapeXml(config.name)}">
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="2" name="Title 1"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="title"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${titleX}" y="${titleY}"/>
            <a:ext cx="${titleCx}" cy="${titleCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:lnSpc><a:spcPct val="${Math.round((typography.bodyLarge.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.heading.fontSize * 100)}" spc="${Math.round(typography.heading.fontSize * 100 * (typography.heading.letterSpacing || 0))}" b="${utils.getWeight(typography.heading.fontId, typography.heading.fontWeight)}" i="${utils.getItalic(typography.heading.fontId)}" ${typography.heading.textTransform === 'uppercase' ? 'cap="all"' : ''}>
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.heading.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.heading.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.heading.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit title</a:t>
            </a:r>
            <a:endParaRPr lang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sldLayout>`;
}

// Layout: Three Content (7-8-7 column split)
// CBRE Grid: 7 cols = 551px, 8 cols = 632px, 7 cols = 551px
function generateThreeContentLayout(slideSize: OOXMLSlideSize, config: LayoutConfig, typography: TypographyConfig, utils: FontUtils): string {
  const xScale = slideSize.cx / 1920;
  const yScale = slideSize.cy / 1080;

  // Title: Rows 1-2
  const titleX = Math.round(CBRE_GRID.CONTENT_X * xScale);
  const titleY = Math.round(CBRE_GRID.TITLE_Y * yScale);
  const titleCx = Math.round(CBRE_GRID.CONTENT_WIDTH * xScale);
  const titleCy = Math.round(CBRE_GRID.TITLE_HEIGHT * yScale);

  // Content: Rows 3-10
  const contentY = Math.round(CBRE_GRID.CONTENT_Y * yScale);
  const contentCy = Math.round(CBRE_GRID.CONTENT_HEIGHT * yScale);

  // Three columns: 7-7-8 split (exact from guides)
  const col1X = Math.round(CBRE_GRID.CONTENT_X * xScale);        // 80
  const col1Width = Math.round(CBRE_GRID.THREE_COL_LEFT_WIDTH * xScale);   // 550px
  const col2X = Math.round(CBRE_GRID.THREE_COL_CENTER_X * xScale);         // 644
  const col2Width = Math.round(CBRE_GRID.THREE_COL_CENTER_WIDTH * xScale); // 550px
  const col3X = Math.round(CBRE_GRID.THREE_COL_RIGHT_X * xScale);          // 1210
  const col3Width = Math.round(CBRE_GRID.THREE_COL_RIGHT_WIDTH * xScale);  // 630px

  return `${xmlDeclaration()}<p:sldLayout xmlns:a="${NAMESPACES.a}" xmlns:r="${NAMESPACES.r}" xmlns:p="${NAMESPACES.p}" type="${config.pptxType}" preserve="1">
  <p:cSld name="${escapeXml(config.name)}">
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="2" name="Title 1"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="title"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${titleX}" y="${titleY}"/>
            <a:ext cx="${titleCx}" cy="${titleCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:lnSpc><a:spcPct val="${Math.round((typography.bodyLarge.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.heading.fontSize * 100)}" spc="${Math.round(typography.heading.fontSize * 100 * (typography.heading.letterSpacing || 0))}" b="${utils.getWeight(typography.heading.fontId, typography.heading.fontWeight)}" i="${utils.getItalic(typography.heading.fontId)}" ${typography.heading.textTransform === 'uppercase' ? 'cap="all"' : ''}>
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.heading.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.heading.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.heading.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit title</a:t>
            </a:r>
            <a:endParaRPr lang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="3" name="Content Placeholder 2"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph sz="quarter" idx="1"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${col1X}" y="${contentY}"/>
            <a:ext cx="${col1Width}" cy="${contentCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:lnSpc><a:spcPct val="${Math.round((typography.bodyLarge.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.bodyLarge.fontSize * 100)}" spc="${Math.round(typography.bodyLarge.fontSize * 100 * (typography.bodyLarge.letterSpacing || 0))}" b="${utils.getWeight(typography.bodyLarge.fontId, typography.bodyLarge.fontWeight)}" i="${utils.getItalic(typography.bodyLarge.fontId)}">
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.bodyLarge.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.bodyLarge.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.bodyLarge.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:pPr lvl="0"/>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit text</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="4" name="Content Placeholder 3"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph sz="quarter" idx="2"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${col2X}" y="${contentY}"/>
            <a:ext cx="${col2Width}" cy="${contentCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:lnSpc><a:spcPct val="${Math.round((typography.bodyLarge.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.bodyLarge.fontSize * 100)}" spc="${Math.round(typography.bodyLarge.fontSize * 100 * (typography.bodyLarge.letterSpacing || 0))}" b="${utils.getWeight(typography.bodyLarge.fontId, typography.bodyLarge.fontWeight)}" i="${utils.getItalic(typography.bodyLarge.fontId)}">
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.bodyLarge.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.bodyLarge.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.bodyLarge.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:pPr lvl="0"/>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit text</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="5" name="Content Placeholder 4"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph sz="quarter" idx="3"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${col3X}" y="${contentY}"/>
            <a:ext cx="${col3Width}" cy="${contentCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:lnSpc><a:spcPct val="${Math.round((typography.bodyLarge.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.bodyLarge.fontSize * 100)}" spc="${Math.round(typography.bodyLarge.fontSize * 100 * (typography.bodyLarge.letterSpacing || 0))}" b="${utils.getWeight(typography.bodyLarge.fontId, typography.bodyLarge.fontWeight)}" i="${utils.getItalic(typography.bodyLarge.fontId)}">
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.bodyLarge.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.bodyLarge.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.bodyLarge.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:pPr lvl="0"/>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit text</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sldLayout>`;
}

// Layout: Content + Sidebar Stacked (half + two stacked)
// CBRE Grid: Left half 874px, Right half 874px with 2 stacked boxes
function generateContentSidebarStackedLayout(slideSize: OOXMLSlideSize, config: LayoutConfig, typography: TypographyConfig, utils: FontUtils): string {
  const xScale = slideSize.cx / 1920;
  const yScale = slideSize.cy / 1080;

  // Title: Rows 1-2
  const titleX = Math.round(CBRE_GRID.CONTENT_X * xScale);
  const titleY = Math.round(CBRE_GRID.TITLE_Y * yScale);
  const titleCx = Math.round(CBRE_GRID.CONTENT_WIDTH * xScale);
  const titleCy = Math.round(CBRE_GRID.TITLE_HEIGHT * yScale);

  // Content: Rows 3-10
  const contentY = Math.round(CBRE_GRID.CONTENT_Y * yScale);

  // Two columns: half width each
  const columnWidth = Math.round(CBRE_GRID.HALF_WIDTH * xScale);
  const leftX = Math.round(CBRE_GRID.CONTENT_X * xScale);
  const rightX = Math.round(CBRE_GRID.HALF_RIGHT_X * xScale);

  // Left content (full height: rows 3-10)
  const leftContentCy = Math.round(CBRE_GRID.CONTENT_HEIGHT * yScale);

  // Right stacked: Split at gutter between Row 6 and Row 7
  // Top box: Row 3-6, y=252 to y=630 (height = 378px)
  // Bottom box: Row 7-10, y=646 to y=1008 (height = 362px)
  const rightTopY = Math.round(CBRE_GRID.ROW_Y[2] * yScale);   // Row 3 start = 252
  const rightTopCy = Math.round((CBRE_GRID.ROW_END[5] - CBRE_GRID.ROW_Y[2]) * yScale);  // 630 - 252 = 378px
  const rightBottomY = Math.round(CBRE_GRID.ROW_Y[6] * yScale);  // Row 7 start = 646
  const rightBottomCy = Math.round((CBRE_GRID.ROW_END[9] - CBRE_GRID.ROW_Y[6]) * yScale);  // 1008 - 646 = 362px

  return `${xmlDeclaration()}<p:sldLayout xmlns:a="${NAMESPACES.a}" xmlns:r="${NAMESPACES.r}" xmlns:p="${NAMESPACES.p}" type="${config.pptxType}" preserve="1">
  <p:cSld name="${escapeXml(config.name)}">
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="2" name="Title 1"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="title"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${titleX}" y="${titleY}"/>
            <a:ext cx="${titleCx}" cy="${titleCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:lnSpc><a:spcPct val="${Math.round((typography.bodyLarge.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.heading.fontSize * 100)}" spc="${Math.round(typography.heading.fontSize * 100 * (typography.heading.letterSpacing || 0))}" b="${utils.getWeight(typography.heading.fontId, typography.heading.fontWeight)}" i="${utils.getItalic(typography.heading.fontId)}" ${typography.heading.textTransform === 'uppercase' ? 'cap="all"' : ''}>
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.heading.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.heading.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.heading.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit title</a:t>
            </a:r>
            <a:endParaRPr lang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="3" name="Content Placeholder 2"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph sz="half" idx="1"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${leftX}" y="${contentY}"/>
            <a:ext cx="${columnWidth}" cy="${leftContentCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:lnSpc><a:spcPct val="${Math.round((typography.bodyLarge.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.bodyLarge.fontSize * 100)}" spc="${Math.round(typography.bodyLarge.fontSize * 100 * (typography.bodyLarge.letterSpacing || 0))}" b="${utils.getWeight(typography.bodyLarge.fontId, typography.bodyLarge.fontWeight)}" i="${utils.getItalic(typography.bodyLarge.fontId)}">
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.bodyLarge.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.bodyLarge.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.bodyLarge.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:pPr lvl="0"/>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit main content</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="4" name="Content Placeholder 3"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph sz="quarter" idx="2"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${rightX}" y="${rightTopY}"/>
            <a:ext cx="${columnWidth}" cy="${rightTopCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:lnSpc><a:spcPct val="${Math.round((typography.bodyLarge.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.bodyLarge.fontSize * 100)}" spc="${Math.round(typography.bodyLarge.fontSize * 100 * (typography.bodyLarge.letterSpacing || 0))}" b="${utils.getWeight(typography.bodyLarge.fontId, typography.bodyLarge.fontWeight)}" i="${utils.getItalic(typography.bodyLarge.fontId)}">
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.bodyLarge.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.bodyLarge.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.bodyLarge.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:pPr lvl="0"/>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit top sidebar</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="5" name="Content Placeholder 4"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph sz="quarter" idx="3"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${rightX}" y="${rightBottomY}"/>
            <a:ext cx="${columnWidth}" cy="${rightBottomCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:lnSpc><a:spcPct val="${Math.round((typography.bodyLarge.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.bodyLarge.fontSize * 100)}" spc="${Math.round(typography.bodyLarge.fontSize * 100 * (typography.bodyLarge.letterSpacing || 0))}" b="${utils.getWeight(typography.bodyLarge.fontId, typography.bodyLarge.fontWeight)}" i="${utils.getItalic(typography.bodyLarge.fontId)}">
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.bodyLarge.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.bodyLarge.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.bodyLarge.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:pPr lvl="0"/>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit bottom sidebar</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sldLayout>`;
}

// Layout: Sidebar + Content (5 columns + remaining)
// CBRE Grid: Left sidebar ≈390px, Right content ≈1358px
function generateSidebarContentLayout(slideSize: OOXMLSlideSize, config: LayoutConfig, typography: TypographyConfig, utils: FontUtils): string {
  const xScale = slideSize.cx / 1920;
  const yScale = slideSize.cy / 1080;

  // Title: Rows 1-2
  const titleX = Math.round(CBRE_GRID.CONTENT_X * xScale);
  const titleY = Math.round(CBRE_GRID.TITLE_Y * yScale);
  const titleCx = Math.round(CBRE_GRID.CONTENT_WIDTH * xScale);
  const titleCy = Math.round(CBRE_GRID.TITLE_HEIGHT * yScale);

  // Content: Rows 3-10
  const contentY = Math.round(CBRE_GRID.CONTENT_Y * yScale);
  const contentCy = Math.round(CBRE_GRID.CONTENT_HEIGHT * yScale);

  // Sidebar: 5 columns (80 to 468 = 388px from guides)
  const sidebarWidth5Col = 388;  // Col 5 end - Col 1 start = 468 - 80
  const sidebarWidth = Math.round(sidebarWidth5Col * xScale);
  // Main content: Col 6 start to Col 22 end (484 to 1840 = 1356px from guides)
  const mainContentWidth = Math.round(1356 * xScale);

  const sidebarX = Math.round(CBRE_GRID.CONTENT_X * xScale);  // 80
  const mainContentX = Math.round(484 * xScale);               // Col 6 start from guides

  return `${xmlDeclaration()}<p:sldLayout xmlns:a="${NAMESPACES.a}" xmlns:r="${NAMESPACES.r}" xmlns:p="${NAMESPACES.p}" type="${config.pptxType}" preserve="1">
  <p:cSld name="${escapeXml(config.name)}">
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="2" name="Title 1"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="title"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${titleX}" y="${titleY}"/>
            <a:ext cx="${titleCx}" cy="${titleCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:lnSpc><a:spcPct val="${Math.round((typography.bodyLarge.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.heading.fontSize * 100)}" spc="${Math.round(typography.heading.fontSize * 100 * (typography.heading.letterSpacing || 0))}" b="${utils.getWeight(typography.heading.fontId, typography.heading.fontWeight)}" i="${utils.getItalic(typography.heading.fontId)}" ${typography.heading.textTransform === 'uppercase' ? 'cap="all"' : ''}>
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.heading.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.heading.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.heading.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit title</a:t>
            </a:r>
            <a:endParaRPr lang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="3" name="Sidebar Placeholder 2"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph sz="quarter" idx="1"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${sidebarX}" y="${contentY}"/>
            <a:ext cx="${sidebarWidth}" cy="${contentCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:lnSpc><a:spcPct val="${Math.round((typography.bodyLarge.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.bodyLarge.fontSize * 100)}" spc="${Math.round(typography.bodyLarge.fontSize * 100 * (typography.bodyLarge.letterSpacing || 0))}" b="${utils.getWeight(typography.bodyLarge.fontId, typography.bodyLarge.fontWeight)}" i="${utils.getItalic(typography.bodyLarge.fontId)}">
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.bodyLarge.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.bodyLarge.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.bodyLarge.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:pPr lvl="0"/>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit sidebar</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="4" name="Content Placeholder 3"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph idx="2"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${mainContentX}" y="${contentY}"/>
            <a:ext cx="${mainContentWidth}" cy="${contentCy}"/>
          </a:xfrm>
        </p:spPr>
        <p:txBody>
          <a:bodyPr lIns="0" tIns="0" rIns="0" bIns="0"/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:lnSpc><a:spcPct val="${Math.round((typography.bodyLarge.lineHeight || 1) * 100000)}"/></a:lnSpc>
              <a:defRPr sz="${Math.round(typography.bodyLarge.fontSize * 100)}" spc="${Math.round(typography.bodyLarge.fontSize * 100 * (typography.bodyLarge.letterSpacing || 0))}" b="${utils.getWeight(typography.bodyLarge.fontId, typography.bodyLarge.fontWeight)}" i="${utils.getItalic(typography.bodyLarge.fontId)}">
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
                <a:latin typeface="${utils.getFontRefs(typography.bodyLarge.fontId).lt}"/>
                <a:ea typeface="${utils.getFontRefs(typography.bodyLarge.fontId).ea}"/>
                <a:cs typeface="${utils.getFontRefs(typography.bodyLarge.fontId).cs}"/>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:pPr lvl="0"/>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit main content</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sldLayout>`;
}

// Generate slide layout relationships file
export function generateSlideLayoutRelsXml(): string {
  return `${xmlDeclaration()}<Relationships xmlns="${NAMESPACES.relationships}">
  <Relationship Id="rId1" Type="${NAMESPACES.relSlideMaster}" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>`;
}

