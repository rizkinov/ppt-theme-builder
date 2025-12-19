/**
 * Generate slideMaster1.xml for PowerPoint template
 * The slide master defines the default styling for all slides
 */

import { xmlDeclaration, NAMESPACES } from './xml-utils';
import { OOXMLSlideSize, TypographyConfig, OOXMLFontScheme, OOXMLMasterGuide } from './types';
import { FontAsset } from '../types';

// CBRE Grid Constants (matching slide-layout-generator.ts)
const CBRE_GRID = {
  CONTENT_X: 80,
  CONTENT_WIDTH: 1760,
  TITLE_Y: 72,
  TITLE_HEIGHT: 164,
  CONTENT_Y: 252,
  CONTENT_HEIGHT: 756,
};

export interface FontUtils {
  getFontRefs: (fontId: string) => { lt: string; ea: string; cs: string };
  getWeight: (fontId: string, styleWeight?: number) => string;
  getItalic: (fontId: string) => string;
}

export function generateSlideMasterXml(
  slideSize: OOXMLSlideSize,
  typography: TypographyConfig,
  layoutCount: number,
  fontLibrary: FontAsset[],
  fonts: OOXMLFontScheme,
  masterGuides?: OOXMLMasterGuide[]
): string {
  // Helper to resolve font references
  const getFontRefs = (fontId: string) => {
    const asset = fontLibrary.find(f => f.id === fontId);
    if (!asset) return { lt: '+mn-lt', ea: '+mn-ea', cs: '+mn-cs' }; // Default to minor

    // If it's a specific weight variant that isn't standard Regular/Bold, prefer the explicit name
    // This fixes issues where "Calibre Light" or "Calibre Medium" map to generic "Calibre" (+mn-lt)
    // and thus lose their specific weight appearance in PPT.
    const isSpecialVariant = asset?.name?.match(/(Light|Medium|Thin|Black|Semibold|ExtraBold)/i);

    if (isSpecialVariant && asset?.name) {
      // Use the explicit font name (e.g. "Calibre Light")
      return { lt: asset.name, ea: asset.name, cs: asset.name };
    }

    if (asset?.family === fonts.majorFont) return { lt: '+mj-lt', ea: '+mj-ea', cs: '+mj-cs' };
    if (asset?.family === fonts.minorFont) return { lt: '+mn-lt', ea: '+mn-ea', cs: '+mn-cs' };

    // Custom font
    return asset ? { lt: asset.family, ea: asset.family, cs: asset.family } : { lt: '+mn-lt', ea: '+mn-ea', cs: '+mn-cs' };
  };

  // Helper to resolve weight
  const getWeight = (fontId: string, styleWeight?: number) => {
    const asset = fontLibrary.find(f => f.id === fontId);

    // If it's a special variant (like Medium), we do NOT want to mimic bold.
    // We want to use the font file itself which provides the weight.
    const isSpecialVariant = asset?.name?.match(/(Light|Medium|Thin|Black|Semibold|ExtraBold)/i);
    if (isSpecialVariant) return '0';

    // Otherwise, for standard fonts or generic families, use bold for >= 600
    const weight = styleWeight || asset?.weight || 400;
    return weight >= 600 ? '1' : '0';
  };

  // Helper to resolve italic
  const getItalic = (fontId: string) => {
    const asset = fontLibrary.find(f => f.id === fontId);
    return asset?.style === 'italic' ? '1' : '0';
  };

  const utils = { getFontRefs, getWeight, getItalic };

  // Generate the extension list with master guides if provided
  const extLst = masterGuides && masterGuides.length > 0
    ? generateMasterGuideExtLst(masterGuides)
    : '';

  return `${xmlDeclaration()}<p:sldMaster xmlns:a="${NAMESPACES.a}" xmlns:r="${NAMESPACES.r}" xmlns:p="${NAMESPACES.p}">
  <p:cSld>
    <p:bg>
      <p:bgRef idx="1001">
        <a:schemeClr val="bg1"/>
      </p:bgRef>
    </p:bg>
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
      ${generateTitlePlaceholder(slideSize)}
      ${generateBodyPlaceholder(slideSize)}
      ${generateFooterShape(slideSize)}
      ${generatePageNumberShape(slideSize)}
    </p:spTree>
  </p:cSld>
  <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
  ${generateSlideLayoutIdList(layoutCount)}
  ${generateTextStyles(typography, fontLibrary, utils)}${extLst}
</p:sldMaster>`;
}

function generateTitlePlaceholder(slideSize: OOXMLSlideSize): string {
  // CBRE Grid alignment: use grid constants
  const xScale = slideSize.cx / 1920;
  const yScale = slideSize.cy / 1080;

  // Title: Rows 1-2
  const x = Math.round(CBRE_GRID.CONTENT_X * xScale);
  const y = Math.round(CBRE_GRID.TITLE_Y * yScale);
  const cx = Math.round(CBRE_GRID.CONTENT_WIDTH * xScale);
  const cy = Math.round(CBRE_GRID.TITLE_HEIGHT * yScale);

  return `<p:sp>
        <p:nvSpPr>
          <p:cNvPr id="2" name="Title Placeholder 1"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="title"/>
          </p:nvPr>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${x}" y="${y}"/>
            <a:ext cx="${cx}" cy="${cy}"/>
          </a:xfrm>
          <a:prstGeom prst="rect">
            <a:avLst/>
          </a:prstGeom>
        </p:spPr>
        <p:txBody>
          <a:bodyPr vert="horz" lIns="0" tIns="0" rIns="0" bIns="0" rtlCol="0" anchor="ctr"/>
          <a:lstStyle/>
          <a:p>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit Master title style</a:t>
            </a:r>
            <a:endParaRPr lang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>`;
}

function generateBodyPlaceholder(slideSize: OOXMLSlideSize): string {
  // CBRE Grid alignment: use grid constants
  const xScale = slideSize.cx / 1920;
  const yScale = slideSize.cy / 1080;

  // Body: Rows 3-10
  const x = Math.round(CBRE_GRID.CONTENT_X * xScale);
  const y = Math.round(CBRE_GRID.CONTENT_Y * yScale);
  const cx = Math.round(CBRE_GRID.CONTENT_WIDTH * xScale);
  const cy = Math.round(CBRE_GRID.CONTENT_HEIGHT * yScale);

  return `<p:sp>
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
            <a:off x="${x}" y="${y}"/>
            <a:ext cx="${cx}" cy="${cy}"/>
          </a:xfrm>
          <a:prstGeom prst="rect">
            <a:avLst/>
          </a:prstGeom>
        </p:spPr>
        <p:txBody>
          <a:bodyPr vert="horz" lIns="0" tIns="0" rIns="0" bIns="0" rtlCol="0"/>
          <a:lstStyle/>
          <a:p>
            <a:pPr lvl="0"/>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Click to edit Master text styles</a:t>
            </a:r>
          </a:p>
          <a:p>
            <a:pPr lvl="1"/>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Second level</a:t>
            </a:r>
          </a:p>
          <a:p>
            <a:pPr lvl="2"/>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Third level</a:t>
            </a:r>
          </a:p>
          <a:p>
            <a:pPr lvl="3"/>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Fourth level</a:t>
            </a:r>
          </a:p>
          <a:p>
            <a:pPr lvl="4"/>
            <a:r>
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>Fifth level</a:t>
            </a:r>
            <a:endParaRPr lang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>`;
}


/**
 * Generate the PowerPoint 2012+ extension list with master slide guides
 * This matches the format used by CBRE PPT.pptx
 * Guides are stored in p:extLst > p:ext > p15:sldGuideLst
 */
function generateMasterGuideExtLst(guides: OOXMLMasterGuide[]): string {
  if (!guides || guides.length === 0) return '';

  const guideElements = guides.map(guide => {
    const orientAttr = guide.orient === 'horz' ? ' orient="horz"' : '';
    const posAttr = guide.pos !== 0 ? ` pos="${guide.pos}"` : '';
    const userDrawn = guide.userDrawn !== false ? ' userDrawn="1"' : '';

    return `<p15:guide id="${guide.id}"${orientAttr}${posAttr}${userDrawn}><p15:clr><a:srgbClr val="${guide.color}"/></p15:clr></p15:guide>`;
  }).join('');

  return `
  <p:extLst>
    <p:ext uri="{27BBF7A9-308A-43DC-89C8-2F10F3537804}">
      <p15:sldGuideLst xmlns:p15="http://schemas.microsoft.com/office/powerpoint/2012/main">${guideElements}</p15:sldGuideLst>
    </p:ext>
  </p:extLst>`;
}

function generateSlideLayoutIdList(layoutCount: number): string {
  let ids = '';
  // Start ID from a safe range that won't conflict with master ID
  const startId = 2147483649;

  for (let i = 0; i < layoutCount; i++) {
    // rId1 is reserved for Theme, so layouts start at rId2
    ids += `\n    <p:sldLayoutId id="${startId + i}" r:id="rId${i + 2}"/>`;
  }

  return `<p:sldLayoutIdLst>${ids}
  </p:sldLayoutIdLst>`;
}

// ... Placeholders same as before ...

function generateTextStyles(typography: TypographyConfig, fontLibrary: FontAsset[], utils: FontUtils): string {
  // OOXML CBRE Complete Typography System - 16 Named Styles
  // Font sizes in OOXML are in hundredths of a point (so 28pt = 2800, 12pt = 1200)

  // Helper to calculate line spacing (percentage) - 100000 = 100%
  const getLnSpc = (lh?: number) => Math.round((lh || 1.0) * 100000);

  // Helper to calculate letter spacing (hundredths of a point)
  const getSpc = (size: number, spacing?: number) => Math.round(size * 100 * (spacing || 0));

  // Helper to convert points to OOXML (for spacing before/after)
  // In OOXML, spacing is in hundredths of a point: 12pt = 1200
  const getPtPct = (pts?: number) => Math.round((pts || 0) * 100); // 12pt = 1200

  // Helper to convert inches to EMUs
  const inchesToEMU = (inches?: number) => Math.round((inches || 0) * 914400);

  // Helper to generate alignment attribute
  const getAlign = (align?: string) => {
    switch (align) {
      case 'center': return 'ctr';
      case 'right': return 'r';
      case 'justify': return 'just';
      default: return 'l'; // left is default
    }
  };

  const getWeight = utils.getWeight;
  const getItalic = utils.getItalic;

  // Get font references for all CBRE styles
  const slideTitle = typography.slideTitle;
  const bodyCopy = typography.bodyCopy;
  const bodyBullet1 = typography.bodyBullet1;
  const bodyBullet2 = typography.bodyBullet2;
  const heading1 = typography.heading1;
  const heading2 = typography.heading2;
  const heading3 = typography.heading3;
  const caption = typography.caption;
  const captionCopy = typography.captionCopy;

  const fonts = {
    slideTitle: utils.getFontRefs(slideTitle.fontId),
    bodyCopy: utils.getFontRefs(bodyCopy.fontId),
    bodyBullet1: utils.getFontRefs(bodyBullet1.fontId),
    bodyBullet2: utils.getFontRefs(bodyBullet2.fontId),
    heading1: utils.getFontRefs(heading1.fontId),
    heading2: utils.getFontRefs(heading2.fontId),
    heading3: utils.getFontRefs(heading3.fontId),
    caption: utils.getFontRefs(caption.fontId),
    captionCopy: utils.getFontRefs(captionCopy.fontId),
  };

  return `<p:txStyles>
    <p:titleStyle>
      <a:lvl1pPr algn="${getAlign(slideTitle.alignment)}" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:lnSpc>
          <a:spcPct val="${getLnSpc(slideTitle.lineHeight)}"/>
        </a:lnSpc>
        ${slideTitle.spaceBefore ? `<a:spcBef><a:spcPts val="${getPtPct(slideTitle.spaceBefore)}"/></a:spcBef>` : ''}
        ${slideTitle.spaceAfter ? `<a:spcAft><a:spcPts val="${getPtPct(slideTitle.spaceAfter)}"/></a:spcAft>` : ''}
        <a:buNone/>
        <a:defRPr sz="${Math.round(slideTitle.fontSize * 100)}" kern="1200" spc="${getSpc(slideTitle.fontSize, slideTitle.letterSpacing)}" b="${getWeight(slideTitle.fontId, slideTitle.fontWeight)}" i="${getItalic(slideTitle.fontId)}" ${slideTitle.textTransform === 'uppercase' ? 'cap="all"' : ''}>
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="${fonts.slideTitle.lt}"/>
          <a:ea typeface="${fonts.slideTitle.ea}"/>
          <a:cs typeface="${fonts.slideTitle.cs}"/>
        </a:defRPr>
      </a:lvl1pPr>
    </p:titleStyle>
    <p:bodyStyle>
      <!-- Level 1: Heading 1 (22pt Calibre Light) -->
      <a:lvl1pPr marL="${inchesToEMU(heading1.marginLeft)}" algn="${getAlign(heading1.alignment)}" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:lnSpc>
          <a:spcPct val="${getLnSpc(heading1.lineHeight)}"/>
        </a:lnSpc>
        ${heading1.spaceBefore ? `<a:spcBef><a:spcPts val="${getPtPct(heading1.spaceBefore)}"/></a:spcBef>` : ''}
        ${heading1.spaceAfter ? `<a:spcAft><a:spcPts val="${getPtPct(heading1.spaceAfter)}"/></a:spcAft>` : ''}
        <a:buNone/>
        <a:defRPr sz="${Math.round(heading1.fontSize * 100)}" kern="1200" spc="${getSpc(heading1.fontSize, heading1.letterSpacing)}" b="${getWeight(heading1.fontId, heading1.fontWeight)}" i="${getItalic(heading1.fontId)}" ${heading1.textTransform === 'uppercase' ? 'cap="all"' : ''}>
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="${fonts.heading1.lt}"/>
          <a:ea typeface="${fonts.heading1.ea}"/>
          <a:cs typeface="${fonts.heading1.cs}"/>
        </a:defRPr>
      </a:lvl1pPr>
      <!-- Level 2: Heading 2 (16pt Calibre Semibold) -->
      <a:lvl2pPr marL="${inchesToEMU(heading2.marginLeft)}" algn="${getAlign(heading2.alignment)}" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:lnSpc>
          <a:spcPct val="${getLnSpc(heading2.lineHeight)}"/>
        </a:lnSpc>
        ${heading2.spaceBefore ? `<a:spcBef><a:spcPts val="${getPtPct(heading2.spaceBefore)}"/></a:spcBef>` : ''}
        ${heading2.spaceAfter ? `<a:spcAft><a:spcPts val="${getPtPct(heading2.spaceAfter)}"/></a:spcAft>` : ''}
        <a:buNone/>
        <a:defRPr sz="${Math.round(heading2.fontSize * 100)}" kern="1200" spc="${getSpc(heading2.fontSize, heading2.letterSpacing)}" b="${getWeight(heading2.fontId, heading2.fontWeight)}" i="${getItalic(heading2.fontId)}" ${heading2.textTransform === 'uppercase' ? 'cap="all"' : ''}>
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="${fonts.heading2.lt}"/>
          <a:ea typeface="${fonts.heading2.ea}"/>
          <a:cs typeface="${fonts.heading2.cs}"/>
        </a:defRPr>
      </a:lvl2pPr>
      <!-- Level 3: Body Copy (12pt Calibre) -->
      <a:lvl3pPr marL="${inchesToEMU(bodyCopy.marginLeft)}" algn="${getAlign(bodyCopy.alignment)}" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:lnSpc>
          <a:spcPct val="${getLnSpc(bodyCopy.lineHeight)}"/>
        </a:lnSpc>
        ${bodyCopy.spaceBefore ? `<a:spcBef><a:spcPts val="${getPtPct(bodyCopy.spaceBefore)}"/></a:spcBef>` : ''}
        ${bodyCopy.spaceAfter ? `<a:spcAft><a:spcPts val="${getPtPct(bodyCopy.spaceAfter)}"/></a:spcAft>` : ''}
        <a:buNone/>
        <a:defRPr sz="${Math.round(bodyCopy.fontSize * 100)}" kern="1200" spc="${getSpc(bodyCopy.fontSize, bodyCopy.letterSpacing)}" b="${getWeight(bodyCopy.fontId, bodyCopy.fontWeight)}" i="${getItalic(bodyCopy.fontId)}" ${bodyCopy.textTransform === 'uppercase' ? 'cap="all"' : ''}>
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="${fonts.bodyCopy.lt}"/>
          <a:ea typeface="${fonts.bodyCopy.ea}"/>
          <a:cs typeface="${fonts.bodyCopy.cs}"/>
        </a:defRPr>
      </a:lvl3pPr>
      <!-- Level 4: Body Bullet 1 (12pt Calibre, en dash) -->
      <a:lvl4pPr marL="${inchesToEMU(bodyBullet1.bulletMargin)}" indent="${inchesToEMU(bodyBullet1.bulletIndent)}" algn="${getAlign(bodyBullet1.alignment)}" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:lnSpc>
          <a:spcPct val="${getLnSpc(bodyBullet1.lineHeight)}"/>
        </a:lnSpc>
        ${bodyBullet1.spaceBefore ? `<a:spcBef><a:spcPts val="${getPtPct(bodyBullet1.spaceBefore)}"/></a:spcBef>` : ''}
        ${bodyBullet1.spaceAfter ? `<a:spcAft><a:spcPts val="${getPtPct(bodyBullet1.spaceAfter)}"/></a:spcAft>` : ''}
        ${bodyBullet1.bulletChar ? `<a:buChar char="${bodyBullet1.bulletChar}"/>` : '<a:buNone/>'}
        <a:defRPr sz="${Math.round(bodyBullet1.fontSize * 100)}" kern="1200" spc="${getSpc(bodyBullet1.fontSize, bodyBullet1.letterSpacing)}" b="${getWeight(bodyBullet1.fontId, bodyBullet1.fontWeight)}" i="${getItalic(bodyBullet1.fontId)}" ${bodyBullet1.textTransform === 'uppercase' ? 'cap="all"' : ''}>
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="${fonts.bodyBullet1.lt}"/>
          <a:ea typeface="${fonts.bodyBullet1.ea}"/>
          <a:cs typeface="${fonts.bodyBullet1.cs}"/>
        </a:defRPr>
      </a:lvl4pPr>
      <!-- Level 5: Body Bullet 2 (12pt Calibre, bullet point) -->
      <a:lvl5pPr marL="${inchesToEMU(bodyBullet2.bulletMargin)}" indent="${inchesToEMU(bodyBullet2.bulletIndent)}" algn="${getAlign(bodyBullet2.alignment)}" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:lnSpc>
          <a:spcPct val="${getLnSpc(bodyBullet2.lineHeight)}"/>
        </a:lnSpc>
        ${bodyBullet2.spaceBefore ? `<a:spcBef><a:spcPts val="${getPtPct(bodyBullet2.spaceBefore)}"/></a:spcBef>` : ''}
        ${bodyBullet2.spaceAfter ? `<a:spcAft><a:spcPts val="${getPtPct(bodyBullet2.spaceAfter)}"/></a:spcAft>` : ''}
        ${bodyBullet2.bulletChar ? `<a:buChar char="${bodyBullet2.bulletChar}"/>` : '<a:buNone/>'}
        <a:defRPr sz="${Math.round(bodyBullet2.fontSize * 100)}" kern="1200" spc="${getSpc(bodyBullet2.fontSize, bodyBullet2.letterSpacing)}" b="${getWeight(bodyBullet2.fontId, bodyBullet2.fontWeight)}" i="${getItalic(bodyBullet2.fontId)}" ${bodyBullet2.textTransform === 'uppercase' ? 'cap="all"' : ''}>
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="${fonts.bodyBullet2.lt}"/>
          <a:ea typeface="${fonts.bodyBullet2.ea}"/>
          <a:cs typeface="${fonts.bodyBullet2.cs}"/>
        </a:defRPr>
      </a:lvl5pPr>
      <!-- Level 6: Heading 3 (12pt Calibre Semibold) -->
      <a:lvl6pPr marL="${inchesToEMU(heading3.marginLeft)}" algn="${getAlign(heading3.alignment)}" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:lnSpc>
          <a:spcPct val="${getLnSpc(heading3.lineHeight)}"/>
        </a:lnSpc>
        ${heading3.spaceBefore ? `<a:spcBef><a:spcPts val="${getPtPct(heading3.spaceBefore)}"/></a:spcBef>` : ''}
        ${heading3.spaceAfter ? `<a:spcAft><a:spcPts val="${getPtPct(heading3.spaceAfter)}"/></a:spcAft>` : ''}
        <a:buNone/>
        <a:defRPr sz="${Math.round(heading3.fontSize * 100)}" kern="1200" spc="${getSpc(heading3.fontSize, heading3.letterSpacing)}" b="${getWeight(heading3.fontId, heading3.fontWeight)}" i="${getItalic(heading3.fontId)}" ${heading3.textTransform === 'uppercase' ? 'cap="all"' : ''}>
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="${fonts.heading3.lt}"/>
          <a:ea typeface="${fonts.heading3.ea}"/>
          <a:cs typeface="${fonts.heading3.cs}"/>
        </a:defRPr>
      </a:lvl6pPr>
      <!-- Level 7: Caption (10.5pt Calibre Semibold) -->
      <a:lvl7pPr marL="${inchesToEMU(caption.marginLeft)}" algn="${getAlign(caption.alignment)}" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:lnSpc>
          <a:spcPct val="${getLnSpc(caption.lineHeight)}"/>
        </a:lnSpc>
        ${caption.spaceBefore ? `<a:spcBef><a:spcPts val="${getPtPct(caption.spaceBefore)}"/></a:spcBef>` : ''}
        ${caption.spaceAfter ? `<a:spcAft><a:spcPts val="${getPtPct(caption.spaceAfter)}"/></a:spcAft>` : ''}
        <a:buNone/>
        <a:defRPr sz="${Math.round(caption.fontSize * 100)}" kern="1200" spc="${getSpc(caption.fontSize, caption.letterSpacing)}" b="${getWeight(caption.fontId, caption.fontWeight)}" i="${getItalic(caption.fontId)}" ${caption.textTransform === 'uppercase' ? 'cap="all"' : ''}>
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="${fonts.caption.lt}"/>
          <a:ea typeface="${fonts.caption.ea}"/>
          <a:cs typeface="${fonts.caption.cs}"/>
        </a:defRPr>
      </a:lvl7pPr>
      <!-- Level 8: Caption Copy (10.5pt Calibre) -->
      <a:lvl8pPr marL="${inchesToEMU(captionCopy.marginLeft)}" algn="${getAlign(captionCopy.alignment)}" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:lnSpc>
          <a:spcPct val="${getLnSpc(captionCopy.lineHeight)}"/>
        </a:lnSpc>
        ${captionCopy.spaceBefore ? `<a:spcBef><a:spcPts val="${getPtPct(captionCopy.spaceBefore)}"/></a:spcBef>` : ''}
        ${captionCopy.spaceAfter ? `<a:spcAft><a:spcPts val="${getPtPct(captionCopy.spaceAfter)}"/></a:spcAft>` : ''}
        <a:buNone/>
        <a:defRPr sz="${Math.round(captionCopy.fontSize * 100)}" kern="1200" spc="${getSpc(captionCopy.fontSize, captionCopy.letterSpacing)}" b="${getWeight(captionCopy.fontId, captionCopy.fontWeight)}" i="${getItalic(captionCopy.fontId)}" ${captionCopy.textTransform === 'uppercase' ? 'cap="all"' : ''}>
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="${fonts.captionCopy.lt}"/>
          <a:ea typeface="${fonts.captionCopy.ea}"/>
          <a:cs typeface="${fonts.captionCopy.cs}"/>
        </a:defRPr>
      </a:lvl8pPr>
      <!-- Level 9: Caption Bullet (10.5pt Calibre, en dash) -->
      <a:lvl9pPr marL="${inchesToEMU(typography.captionBullet.bulletMargin)}" indent="${inchesToEMU(typography.captionBullet.bulletIndent)}" algn="${getAlign(typography.captionBullet.alignment)}" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:lnSpc>
          <a:spcPct val="${getLnSpc(typography.captionBullet.lineHeight)}"/>
        </a:lnSpc>
        ${typography.captionBullet.spaceBefore ? `<a:spcBef><a:spcPts val="${getPtPct(typography.captionBullet.spaceBefore)}"/></a:spcBef>` : ''}
        ${typography.captionBullet.spaceAfter ? `<a:spcAft><a:spcPts val="${getPtPct(typography.captionBullet.spaceAfter)}"/></a:spcAft>` : ''}
        ${typography.captionBullet.bulletChar ? `<a:buChar char="${typography.captionBullet.bulletChar}"/>` : '<a:buNone/>'}
        <a:defRPr sz="${Math.round(typography.captionBullet.fontSize * 100)}" kern="1200" spc="${getSpc(typography.captionBullet.fontSize, typography.captionBullet.letterSpacing)}" b="${getWeight(typography.captionBullet.fontId, typography.captionBullet.fontWeight)}" i="${getItalic(typography.captionBullet.fontId)}" ${typography.captionBullet.textTransform === 'uppercase' ? 'cap="all"' : ''}>
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="${utils.getFontRefs(typography.captionBullet.fontId).lt}"/>
          <a:ea typeface="${utils.getFontRefs(typography.captionBullet.fontId).ea}"/>
          <a:cs typeface="${utils.getFontRefs(typography.captionBullet.fontId).cs}"/>
        </a:defRPr>
      </a:lvl9pPr>
    </p:bodyStyle>
    <p:otherStyle>
      <a:defPPr>
        <a:defRPr lang="en-US"/>
      </a:defPPr>
      <a:lvl1pPr marL="0" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:defRPr sz="1800" kern="1200">
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="+mn-lt"/>
          <a:ea typeface="+mn-ea"/>
          <a:cs typeface="+mn-cs"/>
        </a:defRPr>
      </a:lvl1pPr>
    </p:otherStyle>
  </p:txStyles>`;
}

// ============================================================================
// FOOTER AND PAGE NUMBER FOR MASTER SLIDE (CBRE Style)
// ============================================================================

/**
 * Generate footer text shape for master slide
 * This appears on all slides unless overridden by layout
 * Aligned with CBRE grid system
 */
function generateFooterShape(slideSize: OOXMLSlideSize): string {
  // CBRE Grid alignment: Column 1 start = 80px, Y = 1024px (horizontal guide)
  // For 16:9 (1920x1080): 1px = 9144000/1920 = 4762.5 EMU
  const emuPerPixelX = slideSize.cx / 1920;
  const emuPerPixelY = slideSize.cy / 1080;

  // Footer: x=80px (Col 1), y=1024px (guide), width=900px, height=40px
  const x = Math.round(80 * emuPerPixelX);
  const y = Math.round(1024 * emuPerPixelY);
  const cx = Math.round(900 * emuPerPixelX);
  const cy = Math.round(40 * emuPerPixelY);

  const currentYear = new Date().getFullYear();

  return `<p:sp>
        <p:nvSpPr>
          <p:cNvPr id="100" name="Footer"/>
          <p:cNvSpPr txBox="1"/>
          <p:nvPr userDrawn="1"/>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${x}" y="${y}"/>
            <a:ext cx="${cx}" cy="${cy}"/>
          </a:xfrm>
          <a:prstGeom prst="rect">
            <a:avLst/>
          </a:prstGeom>
          <a:noFill/>
        </p:spPr>
        <p:txBody>
          <a:bodyPr wrap="square" lIns="0" tIns="0" rIns="0" bIns="0">
            <a:spAutoFit/>
          </a:bodyPr>
          <a:lstStyle/>
          <a:p>
            <a:pPr marL="0" algn="l"/>
            <a:r>
              <a:rPr lang="en-US" sz="800" dirty="0">
                <a:latin typeface="+mn-lt"/>
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
              </a:rPr>
              <a:t>Confidential &amp; Proprietary | © ${currentYear} CBRE, Inc.</a:t>
            </a:r>
            <a:endParaRPr lang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>`;
}

/**
 * Generate page number shape for master slide
 * This appears on all slides unless overridden by layout
 * Aligned with CBRE grid system
 */
function generatePageNumberShape(slideSize: OOXMLSlideSize): string {
  // CBRE Grid alignment: Right-align at Column 22 end = 1840px, Y = 1024px (horizontal guide)
  // For 16:9 (1920x1080): 1px = 9144000/1920 = 4762.5 EMU
  const emuPerPixelX = slideSize.cx / 1920;
  const emuPerPixelY = slideSize.cy / 1080;

  // Page number: x=1760px (right-aligned in 80px box ending at 1840), y=1024px, width=80px, height=40px
  const x = Math.round(1760 * emuPerPixelX);
  const y = Math.round(1024 * emuPerPixelY);
  const cx = Math.round(80 * emuPerPixelX);
  const cy = Math.round(40 * emuPerPixelY);

  return `<p:sp>
        <p:nvSpPr>
          <p:cNvPr id="101" name="Slide Number"/>
          <p:cNvSpPr txBox="1"/>
          <p:nvPr userDrawn="1"/>
        </p:nvSpPr>
        <p:spPr>
          <a:xfrm>
            <a:off x="${x}" y="${y}"/>
            <a:ext cx="${cx}" cy="${cy}"/>
          </a:xfrm>
          <a:prstGeom prst="rect">
            <a:avLst/>
          </a:prstGeom>
          <a:noFill/>
        </p:spPr>
        <p:txBody>
          <a:bodyPr wrap="square" lIns="0" tIns="0" rIns="0" bIns="0">
            <a:spAutoFit/>
          </a:bodyPr>
          <a:lstStyle/>
          <a:p>
            <a:pPr marL="0" algn="r"/>
            <a:fld id="{E4F4C915-1F4D-4F0A-8C36-2F7C6B8D9E3A}" type="slidenum">
              <a:rPr lang="en-US" sz="800" dirty="0">
                <a:latin typeface="+mn-lt"/>
                <a:solidFill>
                  <a:schemeClr val="tx1"/>
                </a:solidFill>
              </a:rPr>
              <a:t>‹#›</a:t>
            </a:fld>
            <a:endParaRPr lang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>`;
}

// Generate slide master relationships file
export function generateSlideMasterRelsXml(layoutCount: number): string {
  let rels = `${xmlDeclaration()}<Relationships xmlns="${NAMESPACES.relationships}">
  <Relationship Id="rId1" Type="${NAMESPACES.relTheme}" Target="../theme/theme1.xml"/>`;

  for (let i = 1; i <= layoutCount; i++) {
    rels += `\n  <Relationship Id="rId${i + 1}" Type="${NAMESPACES.relSlideLayout}" Target="../slideLayouts/slideLayout${i}.xml"/>`;
  }

  rels += '\n</Relationships>';
  return rels;
}

