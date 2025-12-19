/**
 * Generate theme1.xml for PowerPoint template
 * This defines the color scheme and font scheme that appear in PowerPoint's Design tab
 */

import { OOXMLThemeColors, OOXMLFontScheme } from './types';
import { xmlDeclaration, hexToOOXMLColor, escapeXml, NAMESPACES } from './xml-utils';
import { CustomColor } from '../types';

export function generateThemeXml(
  themeName: string,
  colors: OOXMLThemeColors,
  fonts: OOXMLFontScheme,
  customColors?: CustomColor[]
): string {
  const xml = `${xmlDeclaration()}<a:theme xmlns:a="${NAMESPACES.a}" name="${escapeXml(themeName)}">
  <a:themeElements>
    ${generateColorScheme(themeName, colors)}
    ${generateFontScheme(themeName, fonts)}
    ${generateFormatScheme()}
  </a:themeElements>
  <a:objectDefaults/>
  <a:extraClrSchemeLst/>
  ${customColors && customColors.length > 0 ? generateCustomColorList(customColors) : ''}
</a:theme>`;

  return xml;
}

function generateColorScheme(name: string, colors: OOXMLThemeColors): string {
  return `<a:clrScheme name="${escapeXml(name)}">
      <a:dk1>
        <a:srgbClr val="${hexToOOXMLColor(colors.dk1)}"/>
      </a:dk1>
      <a:lt1>
        <a:srgbClr val="${hexToOOXMLColor(colors.lt1)}"/>
      </a:lt1>
      <a:dk2>
        <a:srgbClr val="${hexToOOXMLColor(colors.dk2)}"/>
      </a:dk2>
      <a:lt2>
        <a:srgbClr val="${hexToOOXMLColor(colors.lt2)}"/>
      </a:lt2>
      <a:accent1>
        <a:srgbClr val="${hexToOOXMLColor(colors.accent1)}"/>
      </a:accent1>
      <a:accent2>
        <a:srgbClr val="${hexToOOXMLColor(colors.accent2)}"/>
      </a:accent2>
      <a:accent3>
        <a:srgbClr val="${hexToOOXMLColor(colors.accent3)}"/>
      </a:accent3>
      <a:accent4>
        <a:srgbClr val="${hexToOOXMLColor(colors.accent4)}"/>
      </a:accent4>
      <a:accent5>
        <a:srgbClr val="${hexToOOXMLColor(colors.accent5)}"/>
      </a:accent5>
      <a:accent6>
        <a:srgbClr val="${hexToOOXMLColor(colors.accent6)}"/>
      </a:accent6>
      <a:hlink>
        <a:srgbClr val="${hexToOOXMLColor(colors.hlink)}"/>
      </a:hlink>
      <a:folHlink>
        <a:srgbClr val="${hexToOOXMLColor(colors.folHlink)}"/>
      </a:folHlink>
    </a:clrScheme>`;
}

function generateFontScheme(name: string, fonts: OOXMLFontScheme): string {
  return `<a:fontScheme name="${escapeXml(name)}">
      <a:majorFont>
        <a:latin typeface="${escapeXml(fonts.majorFont)}"/>
        <a:ea typeface=""/>
        <a:cs typeface=""/>
      </a:majorFont>
      <a:minorFont>
        <a:latin typeface="${escapeXml(fonts.minorFont)}"/>
        <a:ea typeface=""/>
        <a:cs typeface=""/>
      </a:minorFont>
    </a:fontScheme>`;
}

function generateCustomColorList(customColors: CustomColor[]): string {
  const colorEntries = customColors
    .map(
      (color) =>
        `    <a:custClr name="${escapeXml(color.name)}">
      <a:srgbClr val="${hexToOOXMLColor(color.color)}"/>
    </a:custClr>`
    )
    .join('\n');

  return `  <a:custClrLst>
${colorEntries}
  </a:custClrLst>`;
}

function generateFormatScheme(): string {
  // Standard format scheme with fill, line, and effect styles
  return `<a:fmtScheme name="Office">
      <a:fillStyleLst>
        <a:solidFill>
          <a:schemeClr val="phClr"/>
        </a:solidFill>
        <a:gradFill rotWithShape="1">
          <a:gsLst>
            <a:gs pos="0">
              <a:schemeClr val="phClr">
                <a:tint val="50000"/>
                <a:satMod val="300000"/>
              </a:schemeClr>
            </a:gs>
            <a:gs pos="35000">
              <a:schemeClr val="phClr">
                <a:tint val="37000"/>
                <a:satMod val="300000"/>
              </a:schemeClr>
            </a:gs>
            <a:gs pos="100000">
              <a:schemeClr val="phClr">
                <a:tint val="15000"/>
                <a:satMod val="350000"/>
              </a:schemeClr>
            </a:gs>
          </a:gsLst>
          <a:lin ang="16200000" scaled="1"/>
        </a:gradFill>
        <a:gradFill rotWithShape="1">
          <a:gsLst>
            <a:gs pos="0">
              <a:schemeClr val="phClr">
                <a:shade val="51000"/>
                <a:satMod val="130000"/>
              </a:schemeClr>
            </a:gs>
            <a:gs pos="80000">
              <a:schemeClr val="phClr">
                <a:shade val="93000"/>
                <a:satMod val="130000"/>
              </a:schemeClr>
            </a:gs>
            <a:gs pos="100000">
              <a:schemeClr val="phClr">
                <a:shade val="94000"/>
                <a:satMod val="135000"/>
              </a:schemeClr>
            </a:gs>
          </a:gsLst>
          <a:lin ang="16200000" scaled="0"/>
        </a:gradFill>
      </a:fillStyleLst>
      <a:lnStyleLst>
        <a:ln w="9525" cap="flat" cmpd="sng" algn="ctr">
          <a:solidFill>
            <a:schemeClr val="phClr">
              <a:shade val="95000"/>
              <a:satMod val="105000"/>
            </a:schemeClr>
          </a:solidFill>
          <a:prstDash val="solid"/>
        </a:ln>
        <a:ln w="25400" cap="flat" cmpd="sng" algn="ctr">
          <a:solidFill>
            <a:schemeClr val="phClr"/>
          </a:solidFill>
          <a:prstDash val="solid"/>
        </a:ln>
        <a:ln w="38100" cap="flat" cmpd="sng" algn="ctr">
          <a:solidFill>
            <a:schemeClr val="phClr"/>
          </a:solidFill>
          <a:prstDash val="solid"/>
        </a:ln>
      </a:lnStyleLst>
      <a:effectStyleLst>
        <a:effectStyle>
          <a:effectLst/>
        </a:effectStyle>
        <a:effectStyle>
          <a:effectLst/>
        </a:effectStyle>
        <a:effectStyle>
          <a:effectLst>
            <a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0">
              <a:srgbClr val="000000">
                <a:alpha val="35000"/>
              </a:srgbClr>
            </a:outerShdw>
          </a:effectLst>
        </a:effectStyle>
      </a:effectStyleLst>
      <a:bgFillStyleLst>
        <a:solidFill>
          <a:schemeClr val="phClr"/>
        </a:solidFill>
        <a:gradFill rotWithShape="1">
          <a:gsLst>
            <a:gs pos="0">
              <a:schemeClr val="phClr">
                <a:tint val="40000"/>
                <a:satMod val="350000"/>
              </a:schemeClr>
            </a:gs>
            <a:gs pos="40000">
              <a:schemeClr val="phClr">
                <a:tint val="45000"/>
                <a:shade val="99000"/>
                <a:satMod val="350000"/>
              </a:schemeClr>
            </a:gs>
            <a:gs pos="100000">
              <a:schemeClr val="phClr">
                <a:shade val="20000"/>
                <a:satMod val="255000"/>
              </a:schemeClr>
            </a:gs>
          </a:gsLst>
          <a:path path="circle">
            <a:fillToRect l="50000" t="-80000" r="50000" b="180000"/>
          </a:path>
        </a:gradFill>
        <a:gradFill rotWithShape="1">
          <a:gsLst>
            <a:gs pos="0">
              <a:schemeClr val="phClr">
                <a:tint val="80000"/>
                <a:satMod val="300000"/>
              </a:schemeClr>
            </a:gs>
            <a:gs pos="100000">
              <a:schemeClr val="phClr">
                <a:shade val="30000"/>
                <a:satMod val="200000"/>
              </a:schemeClr>
            </a:gs>
          </a:gsLst>
          <a:path path="circle">
            <a:fillToRect l="50000" t="50000" r="50000" b="50000"/>
          </a:path>
        </a:gradFill>
      </a:bgFillStyleLst>
    </a:fmtScheme>`;
}

