/**
 * Generate slideMaster1.xml for PowerPoint template
 * The slide master defines the default styling for all slides
 */

import { xmlDeclaration, NAMESPACES } from './xml-utils';
import { OOXMLSlideSize } from './types';

interface TextStyleConfig {
  fontSize: number;  // points
  fontWeight: number;
  color: string;     // hex
}

interface TypographyConfig {
  heading: TextStyleConfig;
  subtitle: TextStyleConfig;
  bodyLarge: TextStyleConfig;
}

export function generateSlideMasterXml(
  slideSize: OOXMLSlideSize,
  typography: TypographyConfig,
  backgroundColor: string
): string {
  const xml = `${xmlDeclaration()}<p:sldMaster xmlns:a="${NAMESPACES.a}" xmlns:r="${NAMESPACES.r}" xmlns:p="${NAMESPACES.p}">
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
  ${generateSlideLayoutIdList()}
  ${generateTextStyles(typography)}
</p:sldMaster>`;

  return xml;
}

function generateTitlePlaceholder(slideSize: OOXMLSlideSize, style: TextStyleConfig): string {
  const x = Math.round(slideSize.cx * 0.0625);  // 6.25% from left
  const y = Math.round(slideSize.cy * 0.074);   // 7.4% from top
  const cx = Math.round(slideSize.cx * 0.875);  // 87.5% width
  const cy = Math.round(slideSize.cy * 0.185);  // 18.5% height

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
          <a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0" anchor="ctr"/>
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

function generateBodyPlaceholder(slideSize: OOXMLSlideSize, style: TextStyleConfig): string {
  const x = Math.round(slideSize.cx * 0.0625);  // 6.25% from left
  const y = Math.round(slideSize.cy * 0.296);   // 29.6% from top  
  const cx = Math.round(slideSize.cx * 0.875);  // 87.5% width
  const cy = Math.round(slideSize.cy * 0.593);  // 59.3% height

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
          <a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0"/>
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
          <a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0" anchor="ctr"/>
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
          <a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0" anchor="ctr"/>
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
          <a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0" anchor="ctr"/>
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

function generateSlideLayoutIdList(): string {
  // We'll create 6 standard layouts
  return `<p:sldLayoutIdLst>
    <p:sldLayoutId id="2147483649" r:id="rId1"/>
    <p:sldLayoutId id="2147483650" r:id="rId2"/>
    <p:sldLayoutId id="2147483651" r:id="rId3"/>
    <p:sldLayoutId id="2147483652" r:id="rId4"/>
    <p:sldLayoutId id="2147483653" r:id="rId5"/>
    <p:sldLayoutId id="2147483654" r:id="rId6"/>
  </p:sldLayoutIdLst>`;
}

function generateTextStyles(typography: TypographyConfig): string {
  // Font sizes in OOXML are in hundredths of a point (so 48pt = 4800, 20pt = 2000)
  const titleSize = typography.heading.fontSize * 100;
  const bodySize = typography.bodyLarge.fontSize * 100;

  return `<p:txStyles>
    <p:titleStyle>
      <a:lvl1pPr algn="ctr" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:spcBef>
          <a:spcPct val="0"/>
        </a:spcBef>
        <a:buNone/>
        <a:defRPr sz="${Math.round(titleSize)}" kern="1200" ${typography.heading.fontWeight >= 600 ? 'b="1"' : ''}>
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="+mj-lt"/>
          <a:ea typeface="+mj-ea"/>
          <a:cs typeface="+mj-cs"/>
        </a:defRPr>
      </a:lvl1pPr>
    </p:titleStyle>
    <p:bodyStyle>
      <a:lvl1pPr marL="342900" indent="-342900" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:spcBef>
          <a:spcPct val="20000"/>
        </a:spcBef>
        <a:buFont typeface="Arial" pitchFamily="34" charset="0"/>
        <a:buChar char="•"/>
        <a:defRPr sz="${Math.round(bodySize)}" kern="1200">
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="+mn-lt"/>
          <a:ea typeface="+mn-ea"/>
          <a:cs typeface="+mn-cs"/>
        </a:defRPr>
      </a:lvl1pPr>
      <a:lvl2pPr marL="742950" indent="-285750" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:spcBef>
          <a:spcPct val="20000"/>
        </a:spcBef>
        <a:buFont typeface="Arial" pitchFamily="34" charset="0"/>
        <a:buChar char="–"/>
        <a:defRPr sz="${Math.round(bodySize * 0.9)}" kern="1200">
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="+mn-lt"/>
          <a:ea typeface="+mn-ea"/>
          <a:cs typeface="+mn-cs"/>
        </a:defRPr>
      </a:lvl2pPr>
      <a:lvl3pPr marL="1143000" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:spcBef>
          <a:spcPct val="20000"/>
        </a:spcBef>
        <a:buFont typeface="Arial" pitchFamily="34" charset="0"/>
        <a:buChar char="•"/>
        <a:defRPr sz="${Math.round(bodySize * 0.8)}" kern="1200">
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="+mn-lt"/>
          <a:ea typeface="+mn-ea"/>
          <a:cs typeface="+mn-cs"/>
        </a:defRPr>
      </a:lvl3pPr>
      <a:lvl4pPr marL="1600200" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:spcBef>
          <a:spcPct val="20000"/>
        </a:spcBef>
        <a:buFont typeface="Arial" pitchFamily="34" charset="0"/>
        <a:buChar char="–"/>
        <a:defRPr sz="${Math.round(bodySize * 0.7)}" kern="1200">
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="+mn-lt"/>
          <a:ea typeface="+mn-ea"/>
          <a:cs typeface="+mn-cs"/>
        </a:defRPr>
      </a:lvl4pPr>
      <a:lvl5pPr marL="2057400" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1">
        <a:spcBef>
          <a:spcPct val="20000"/>
        </a:spcBef>
        <a:buFont typeface="Arial" pitchFamily="34" charset="0"/>
        <a:buChar char="»"/>
        <a:defRPr sz="${Math.round(bodySize * 0.7)}" kern="1200">
          <a:solidFill>
            <a:schemeClr val="tx1"/>
          </a:solidFill>
          <a:latin typeface="+mn-lt"/>
          <a:ea typeface="+mn-ea"/>
          <a:cs typeface="+mn-cs"/>
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
  <Relationship Id="rId${layoutCount + 1}" Type="${NAMESPACES.relTheme}" Target="../theme/theme1.xml"/>`;

  for (let i = 1; i <= layoutCount; i++) {
    rels += `\n  <Relationship Id="rId${i}" Type="${NAMESPACES.relSlideLayout}" Target="../slideLayouts/slideLayout${i}.xml"/>`;
  }

  rels += '\n</Relationships>';
  return rels;
}

