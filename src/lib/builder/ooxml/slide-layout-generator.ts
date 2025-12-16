/**
 * Generate slideLayoutN.xml files for PowerPoint template
 * Each layout defines a specific slide arrangement users can choose from
 */

import { xmlDeclaration, NAMESPACES, escapeXml } from './xml-utils';
import { OOXMLSlideSize, TypographyConfig } from './types';
import { FontAsset } from '../types';

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

function generateTitleSlideLayout(slideSize: OOXMLSlideSize, config: LayoutConfig, typography: TypographyConfig, utils: FontUtils): string {
  const x = slideSize.cx / 1920;
  const y = slideSize.cy / 1080;

  const titleX = Math.round(81 * x);
  const titleY = Math.round(350 * y);
  const titleCx = Math.round(1758 * x);
  const titleCy = Math.round(200 * y);

  const subtitleX = Math.round(81 * x);
  const subtitleY = Math.round(600 * y);
  const subtitleCx = Math.round(1758 * x);
  const subtitleCy = Math.round(120 * y);

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
  const x = slideSize.cx / 1920;
  const y = slideSize.cy / 1080;

  // Title: 72px height aligned to content-top guide (91px)
  const titleX = Math.round(81 * x);
  const titleY = Math.round(91 * y);  // Aligned to content-top guide
  const titleCx = Math.round(1758 * x);
  const titleCy = Math.round(80 * y);  // Title height

  // Content: starts at 194px (+2px gap = 23px after title ends at 171px)
  const contentX = Math.round(81 * x);
  const contentY = Math.round(194 * y);  // +2px gap
  const contentCx = Math.round(1758 * x);
  const contentCy = Math.round(795 * y);  // Content height

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

function generateSectionHeaderLayout(slideSize: OOXMLSlideSize, config: LayoutConfig, typography: TypographyConfig, utils: FontUtils): string {
  const x = slideSize.cx / 1920;
  const y = slideSize.cy / 1080;

  const titleX = Math.round(81 * x);
  const titleY = Math.round(400 * y);
  const titleCx = Math.round(1758 * x);
  const titleCy = Math.round(280 * y);

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
  const x = slideSize.cx / 1920;
  const y = slideSize.cy / 1080;

  // Title: 72px height aligned to content-top guide (91px)
  const titleX = Math.round(81 * x);
  const titleY = Math.round(91 * y);  // Aligned to content-top guide
  const titleCx = Math.round(1758 * x);
  const titleCy = Math.round(80 * y);  // Title height

  // Content: starts at 194px (+2px gap = 23px after title ends at 171px)
  const leftX = Math.round(81 * x);
  const contentY = Math.round(194 * y);  // +2px gap
  const contentCx = Math.round(870 * x);
  const contentCy = Math.round(795 * y);  // Content height

  const rightX = Math.round(969 * x);

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
  const x = slideSize.cx / 1920;
  const y = slideSize.cy / 1080;

  // Title: 84px height aligned to content-top guide (91px)
  const titleX = Math.round(81 * x);
  const titleY = Math.round(91 * y);  // Aligned to content-top guide
  const titleCx = Math.round(1758 * x);
  const titleCy = Math.round(80 * y);  // Title height

  // Headers/Subtitles: start at 194px (+2px gap from title ending at 171px)
  const leftX = Math.round(81 * x);
  const rightX = Math.round(969 * x);
  const headerY = Math.round(194 * y);  // +2px gap from title
  const headerCx = Math.round(870 * x);
  const headerCy = Math.round(80 * y);  // Header height (ends at 274px)

  // Content: start at 296px (22px gap after headers end at 274px)
  const contentY = Math.round(296 * y);  // 22px gap from subtitle
  const contentCy = Math.round(688 * y);  // Content height

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
                  <a:schemeClr val="accent1"/>
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
  const x = slideSize.cx / 1920;
  const y = slideSize.cy / 1080;

  const titleX = Math.round(81 * x);
  const titleY = Math.round(91 * y);  // Aligned to content-top guide
  const titleCx = Math.round(1758 * x);
  const titleCy = Math.round(80 * y);  // Title height

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

// Layout: Three Content (3 equal columns)
// CBRE Grid: Width per column = (1758 - 2*18) / 3 = 574px
function generateThreeContentLayout(slideSize: OOXMLSlideSize, config: LayoutConfig, typography: TypographyConfig, utils: FontUtils): string {
  const x = slideSize.cx / 1920;
  const y = slideSize.cy / 1080;

  // Title: 80px height at y=91px
  const titleX = Math.round(81 * x);
  const titleY = Math.round(91 * y);
  const titleCx = Math.round(1758 * x);
  const titleCy = Math.round(80 * y);

  // Content: starts at 194px (23px gap after title)
  const contentY = Math.round(194 * y);
  const contentCy = Math.round(795 * y);

  // Three equal columns: (1758 - 2*18) / 3 = 574px each
  const columnWidth = Math.round(574 * x);
  const gutter = Math.round(18 * x);

  const col1X = Math.round(81 * x);                            // 81px
  const col2X = Math.round((81 + 574 + 18) * x);               // 673px
  const col3X = Math.round((81 + 574 + 18 + 574 + 18) * x);    // 1265px

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
            <p:ph sz="third" idx="1"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${col1X}" y="${contentY}"/>
            <a:ext cx="${columnWidth}" cy="${contentCy}"/>
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
            <p:ph sz="third" idx="2"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${col2X}" y="${contentY}"/>
            <a:ext cx="${columnWidth}" cy="${contentCy}"/>
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
            <p:ph sz="third" idx="3"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${col3X}" y="${contentY}"/>
            <a:ext cx="${columnWidth}" cy="${contentCy}"/>
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
// CBRE Grid: Left half 870px, Right half 870px with 2 stacked boxes
function generateContentSidebarStackedLayout(slideSize: OOXMLSlideSize, config: LayoutConfig, typography: TypographyConfig, utils: FontUtils): string {
  const x = slideSize.cx / 1920;
  const y = slideSize.cy / 1080;

  // Title: 80px height at y=91px
  const titleX = Math.round(81 * x);
  const titleY = Math.round(91 * y);
  const titleCx = Math.round(1758 * x);
  const titleCy = Math.round(80 * y);

  // Content: starts at 194px (23px gap after title)
  const contentY = Math.round(194 * y);
  const totalContentHeight = 795;

  // Two columns: 870px each with 18px gutter
  const columnWidth = Math.round(870 * x);
  const leftX = Math.round(81 * x);
  const rightX = Math.round(969 * x);

  // Left content (full height)
  const leftContentCy = Math.round(totalContentHeight * y);

  // Right stacked: (795 - 22) / 2 = 386.5px each (22px gap between)
  const stackedHeight = Math.round(386 * y);
  const stackGap = Math.round(22 * y);  // Same as subtitle→content gap
  const rightTopY = Math.round(194 * y);
  const rightBottomY = Math.round((194 + 386 + 22) * y);  // 602px
  const rightBottomCy = Math.round(387 * y);  // Slightly larger to fill

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
            <a:ext cx="${columnWidth}" cy="${stackedHeight}"/>
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

// Layout: Sidebar + Content (1/4 + 3/4 split)
// CBRE Grid: Left sidebar 435px, Right content 1305px
function generateSidebarContentLayout(slideSize: OOXMLSlideSize, config: LayoutConfig, typography: TypographyConfig, utils: FontUtils): string {
  const x = slideSize.cx / 1920;
  const y = slideSize.cy / 1080;

  // Title: 80px height at y=91px
  const titleX = Math.round(81 * x);
  const titleY = Math.round(91 * y);
  const titleCx = Math.round(1758 * x);
  const titleCy = Math.round(80 * y);

  // Content: starts at 194px (23px gap after title)
  const contentY = Math.round(194 * y);
  const contentCy = Math.round(795 * y);

  // Adjusted Split based on visual feedback (approx 5.3 cols vs 18.7 cols)
  // Sidebar reduced by 8px from previous iteration of 395px
  // Sidebar: 387px
  // Content: 1353px (Total 1758px - 18px gutter - 387px)
  const sidebarWidth = Math.round(387 * x);
  const mainContentWidth = Math.round(1353 * x);

  const sidebarX = Math.round(81 * x);                    // 81px
  const mainContentX = Math.round(486 * x);               // 81 + 387 + 18 = 486px

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

