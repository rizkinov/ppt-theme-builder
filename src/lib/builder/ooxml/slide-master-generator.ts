/**
 * Generate slideMaster1.xml for PowerPoint template
 * The slide master defines the default styling for all slides
 */

import { xmlDeclaration, NAMESPACES } from './xml-utils';
import { OOXMLSlideSize, TypographyConfig, TextStyleConfig, OOXMLFontScheme } from './types';
import { FontAsset } from '../types';

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
  fonts: OOXMLFontScheme
): string {
  // Helper to resolve font references
  const getFontRefs = (fontId: string) => {
    const asset = fontLibrary.find(f => f.id === fontId);
    if (!asset) return { lt: '+mn-lt', ea: '+mn-ea', cs: '+mn-cs' }; // Default to minor

    // If it's a specific weight variant that isn't standard Regular/Bold, prefer the explicit name
    // This fixes issues where "Calibre Light" or "Calibre Medium" map to generic "Calibre" (+mn-lt)
    // and thus lose their specific weight appearance in PPT.
    const isSpecialVariant = asset.name.match(/(Light|Medium|Thin|Black|Semibold|ExtraBold)/i);

    if (isSpecialVariant) {
      // Use the explicit font name (e.g. "Calibre Light")
      // NOTE: This assumes the font is installed/embedded with this name as the typeface.
      // For standard Windows/Office use, usually the Family Name is used, but for specific
      // weights that are separate font files acting as faces, we use the specific name.
      return { lt: asset.name, ea: asset.name, cs: asset.name };
    }

    if (asset.family === fonts.majorFont) return { lt: '+mj-lt', ea: '+mj-ea', cs: '+mj-cs' };
    if (asset.family === fonts.minorFont) return { lt: '+mn-lt', ea: '+mn-ea', cs: '+mn-cs' };

    // Custom font
    return { lt: asset.family, ea: asset.family, cs: asset.family };
  };

  // Helper to resolve weight
  const getWeight = (fontId: string, styleWeight?: number) => {
    const asset = fontLibrary.find(f => f.id === fontId);

    // If it's a special variant (like Medium), we do NOT want to mimic bold.
    // We want to use the font file itself which provides the weight.
    const isSpecialVariant = asset?.name.match(/(Light|Medium|Thin|Black|Semibold|ExtraBold)/i);
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
      ${generateTitlePlaceholder(slideSize, typography.heading)}
      ${generateBodyPlaceholder(slideSize, typography.bodyLarge)}
      ${generateDatePlaceholder(slideSize)}
      ${generateFooterPlaceholder(slideSize)}
      ${generateSlideNumberPlaceholder(slideSize)}
    </p:spTree>
  </p:cSld>
  <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
  ${generateSlideLayoutIdList(layoutCount)}
  ${generateTextStyles(typography, fontLibrary, utils)}
</p:sldMaster>`;
}

function generateTitlePlaceholder(slideSize: OOXMLSlideSize, _style: TextStyleConfig): string {
  // CBRE Grid alignment: exact pixel values converted to EMUs
  // For 16:9: 1920x1080px at 6350 EMUs per pixel
  const emuPerPixelX = slideSize.cx / 1920;
  const emuPerPixelY = slideSize.cy / 1080;

  // CBRE Grid: left margin 81px, content width 1758px, title height 72px
  const x = Math.round(81 * emuPerPixelX);
  const y = Math.round(91 * emuPerPixelY);  // Aligned to content-top guide
  const cx = Math.round(1758 * emuPerPixelX);
  const cy = Math.round(80 * emuPerPixelY);  // Title height

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

function generateBodyPlaceholder(slideSize: OOXMLSlideSize, _style: TextStyleConfig): string {
  // CBRE Grid alignment: exact pixel values converted to EMUs
  const emuPerPixelX = slideSize.cx / 1920;
  const emuPerPixelY = slideSize.cy / 1080;

  // CBRE Grid: left margin 81px, body starts at 194px (+2px gap from title)
  const x = Math.round(81 * emuPerPixelX);
  const y = Math.round(194 * emuPerPixelY);  // +2px gap from title
  const cx = Math.round(1758 * emuPerPixelX);
  const cy = Math.round(795 * emuPerPixelY);  // Content height

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

function generateDatePlaceholder(slideSize: OOXMLSlideSize): string {
  const x = Math.round(slideSize.cx * 0.0625);
  const y = Math.round(slideSize.cy * 0.926);
  const cx = Math.round(slideSize.cx * 0.208);
  const cy = Math.round(slideSize.cy * 0.056);

  return `<p:sp>
        <p:nvSpPr>
          <p:cNvPr id="4" name="Date Placeholder 3"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="dt" sz="half" idx="2"/>
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
          <a:lstStyle>
            <a:lvl1pPr algn="l">
              <a:defRPr sz="1200">
                <a:solidFill>
                  <a:schemeClr val="tx1">
                    <a:tint val="75000"/>
                  </a:schemeClr>
                </a:solidFill>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:fld id="{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}" type="datetimeFigureOut">
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>1/1/2024</a:t>
            </a:fld>
            <a:endParaRPr lang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>`;
}

function generateFooterPlaceholder(slideSize: OOXMLSlideSize): string {
  const x = Math.round(slideSize.cx * 0.333);
  const y = Math.round(slideSize.cy * 0.926);
  const cx = Math.round(slideSize.cx * 0.333);
  const cy = Math.round(slideSize.cy * 0.056);

  return `<p:sp>
        <p:nvSpPr>
          <p:cNvPr id="5" name="Footer Placeholder 4"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="ftr" sz="quarter" idx="3"/>
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
          <a:lstStyle>
            <a:lvl1pPr algn="ctr">
              <a:defRPr sz="1200">
                <a:solidFill>
                  <a:schemeClr val="tx1">
                    <a:tint val="75000"/>
                  </a:schemeClr>
                </a:solidFill>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:endParaRPr lang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>`;
}

function generateSlideNumberPlaceholder(slideSize: OOXMLSlideSize): string {
  const x = Math.round(slideSize.cx * 0.729);
  const y = Math.round(slideSize.cy * 0.926);
  const cx = Math.round(slideSize.cx * 0.208);
  const cy = Math.round(slideSize.cy * 0.056);

  return `<p:sp>
        <p:nvSpPr>
          <p:cNvPr id="6" name="Slide Number Placeholder 5"/>
          <p:cNvSpPr>
            <a:spLocks noGrp="1"/>
          </p:cNvSpPr>
          <p:nvPr>
            <p:ph type="sldNum" sz="quarter" idx="4"/>
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
          <a:lstStyle>
            <a:lvl1pPr algn="r">
              <a:defRPr sz="1200">
                <a:solidFill>
                  <a:schemeClr val="tx1">
                    <a:tint val="75000"/>
                  </a:schemeClr>
                </a:solidFill>
              </a:defRPr>
            </a:lvl1pPr>
          </a:lstStyle>
          <a:p>
            <a:fld id="{B2C3D4E5-F6A7-8901-BCDE-F23456789012}" type="slidenum">
              <a:rPr lang="en-US" smtClean="0"/>
              <a:t>‹#›</a:t>
            </a:fld>
            <a:endParaRPr lang="en-US"/>
          </a:p>
        </p:txBody>
      </p:sp>`;
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
  // Font sizes in OOXML are in hundredths of a point (so 48pt = 4800, 20pt = 2000)
  const titleSize = typography.heading.fontSize * 100;
  const bodySize = typography.bodyLarge.fontSize * 100;

  // Helper to calculate line spacing (percentage)
  const getLnSpc = (lh?: number) => Math.round((lh || 1.0) * 100000);

  // Helper to calculate letter spacing (hundredths of a point)
  // em * fontSize * 100
  const getSpc = (size: number, spacing?: number) => Math.round(size * 100 * (spacing || 0));

  const fonts = {
    heading: utils.getFontRefs(typography.heading.fontId),
    bodyLarge: utils.getFontRefs(typography.bodyLarge.fontId),
  };

  const getWeight = utils.getWeight;
  const getItalic = utils.getItalic;

  return `<p:txStyles>
    <p:titleStyle>
      <a:lvl1pPr algn="ctr" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:lnSpc>
          <a:spcPct val="${getLnSpc(typography.heading.lineHeight)}"/>
        </a:lnSpc>
        <a:spcBef>
          <a:spcPct val="0"/>
        </a:spcBef>
        <a:buNone/>
        <a:defRPr sz="${Math.round(titleSize)}" kern="1200" spc="${getSpc(typography.heading.fontSize, typography.heading.letterSpacing)}" b="${getWeight(typography.heading.fontId, typography.heading.fontWeight)}" i="${getItalic(typography.heading.fontId)}" ${typography.heading.textTransform === 'uppercase' ? 'cap="all"' : ''}>
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="${fonts.heading.lt}"/>
          <a:ea typeface="${fonts.heading.ea}"/>
          <a:cs typeface="${fonts.heading.cs}"/>
        </a:defRPr>
      </a:lvl1pPr>
    </p:titleStyle>
    <p:bodyStyle>
      <a:lvl1pPr marL="342900" indent="-342900" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:lnSpc>
          <a:spcPct val="${getLnSpc(typography.bodyLarge.lineHeight)}"/>
        </a:lnSpc>
        <a:spcBef>
          <a:spcPct val="20000"/>
        </a:spcBef>
        <a:buFont typeface="Arial" pitchFamily="34" charset="0"/>
        <a:buChar char="•"/>
        <a:defRPr sz="${Math.round(bodySize)}" kern="1200" spc="${getSpc(typography.bodyLarge.fontSize, typography.bodyLarge.letterSpacing)}" b="${getWeight(typography.bodyLarge.fontId, typography.bodyLarge.fontWeight)}" i="${getItalic(typography.bodyLarge.fontId)}" ${typography.bodyLarge.textTransform === 'uppercase' ? 'cap="all"' : ''}>
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="${fonts.bodyLarge.lt}"/>
          <a:ea typeface="${fonts.bodyLarge.ea}"/>
          <a:cs typeface="${fonts.bodyLarge.cs}"/>
        </a:defRPr>
      </a:lvl1pPr>
      <a:lvl2pPr marL="742950" indent="-285750" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:lnSpc>
          <a:spcPct val="${getLnSpc(typography.bodyLarge.lineHeight)}"/>
        </a:lnSpc>
        <a:spcBef>
          <a:spcPct val="20000"/>
        </a:spcBef>
        <a:buFont typeface="Arial" pitchFamily="34" charset="0"/>
        <a:buChar char="–"/>
        <a:defRPr sz="${Math.round(bodySize * 0.9)}" kern="1200" spc="${getSpc(typography.bodyLarge.fontSize * 0.9, typography.bodyLarge.letterSpacing)}">
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="${fonts.bodyLarge.lt}"/>
          <a:ea typeface="${fonts.bodyLarge.ea}"/>
          <a:cs typeface="${fonts.bodyLarge.cs}"/>
        </a:defRPr>
      </a:lvl2pPr>
      <a:lvl3pPr marL="1143000" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:lnSpc>
          <a:spcPct val="${getLnSpc(typography.bodyLarge.lineHeight)}"/>
        </a:lnSpc>
        <a:spcBef>
          <a:spcPct val="20000"/>
        </a:spcBef>
        <a:buFont typeface="Arial" pitchFamily="34" charset="0"/>
        <a:buChar char="•"/>
        <a:defRPr sz="${Math.round(bodySize * 0.8)}" kern="1200" spc="${getSpc(typography.bodyLarge.fontSize * 0.8, typography.bodyLarge.letterSpacing)}">
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="${fonts.bodyLarge.lt}"/>
          <a:ea typeface="${fonts.bodyLarge.ea}"/>
          <a:cs typeface="${fonts.bodyLarge.cs}"/>
        </a:defRPr>
      </a:lvl3pPr>
      <a:lvl4pPr marL="1600200" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:lnSpc>
          <a:spcPct val="${getLnSpc(typography.bodyLarge.lineHeight)}"/>
        </a:lnSpc>
        <a:spcBef>
          <a:spcPct val="20000"/>
        </a:spcBef>
        <a:buFont typeface="Arial" pitchFamily="34" charset="0"/>
        <a:buChar char="–"/>
        <a:defRPr sz="${Math.round(bodySize * 0.7)}" kern="1200" spc="${getSpc(typography.bodyLarge.fontSize * 0.7, typography.bodyLarge.letterSpacing)}">
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="${fonts.bodyLarge.lt}"/>
          <a:ea typeface="${fonts.bodyLarge.ea}"/>
          <a:cs typeface="${fonts.bodyLarge.cs}"/>
        </a:defRPr>
      </a:lvl4pPr>
      <a:lvl5pPr marL="2057400" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:lnSpc>
          <a:spcPct val="${getLnSpc(typography.bodyLarge.lineHeight)}"/>
        </a:lnSpc>
        <a:spcBef>
          <a:spcPct val="20000"/>
        </a:spcBef>
        <a:buFont typeface="Arial" pitchFamily="34" charset="0"/>
        <a:buChar char="»"/>
        <a:defRPr sz="${Math.round(bodySize * 0.7)}" kern="1200" spc="${getSpc(typography.bodyLarge.fontSize * 0.7, typography.bodyLarge.letterSpacing)}">
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="${fonts.bodyLarge.lt}"/>
          <a:ea typeface="${fonts.bodyLarge.ea}"/>
          <a:cs typeface="${fonts.bodyLarge.cs}"/>
        </a:defRPr>
      </a:lvl5pPr>
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

