/**
 * Generate presentation.xml and related core files
 */

import { xmlDeclaration, escapeXml, NAMESPACES } from './xml-utils';
import { OOXMLSlideSize, OOXMLGuide } from './types';

export function generatePresentationXml(
  slideSize: OOXMLSlideSize,
  guides: OOXMLGuide[]
): string {
  return `${xmlDeclaration()}<p:presentation xmlns:a="${NAMESPACES.a}" xmlns:r="${NAMESPACES.r}" xmlns:p="${NAMESPACES.p}" saveSubsetFonts="1">
  <p:sldMasterIdLst>
    <p:sldMasterId id="2147483648" r:id="rId1"/>
  </p:sldMasterIdLst>
  <p:sldSz cx="${slideSize.cx}" cy="${slideSize.cy}"/>
  <p:notesSz cx="${slideSize.cy}" cy="${slideSize.cx}"/>
  <p:defaultTextStyle>
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
  </p:defaultTextStyle>
</p:presentation>`;
}

export function generatePresentationRelsXml(): string {
  return `${xmlDeclaration()}<Relationships xmlns="${NAMESPACES.relationships}">
  <Relationship Id="rId1" Type="${NAMESPACES.relSlideMaster}" Target="slideMasters/slideMaster1.xml"/>
  <Relationship Id="rId2" Type="${NAMESPACES.relTheme}" Target="theme/theme1.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/presProps" Target="presProps.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/viewProps" Target="viewProps.xml"/>
  <Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/tableStyles" Target="tableStyles.xml"/>
</Relationships>`;
}

export function generatePresPropsXml(): string {
  return `${xmlDeclaration()}<p:presentationPr xmlns:a="${NAMESPACES.a}" xmlns:r="${NAMESPACES.r}" xmlns:p="${NAMESPACES.p}">
  <p:showPr showNarration="1">
    <p:present/>
  </p:showPr>
</p:presentationPr>`;
}

export function generateViewPropsXml(guides: OOXMLGuide[]): string {
  const guideList = guides.length > 0 
    ? `<p:cSldViewPr>
      <p:cViewPr>
        <p:scale>
          <a:sx n="100" d="100"/>
          <a:sy n="100" d="100"/>
        </p:scale>
        <p:origin x="0" y="0"/>
      </p:cViewPr>
      <p:guideLst>
        ${guides.map(g => `<p:guide orient="${g.orient}" pos="${g.pos}"/>`).join('\n        ')}
      </p:guideLst>
    </p:cSldViewPr>`
    : `<p:cSldViewPr>
      <p:cViewPr>
        <p:scale>
          <a:sx n="100" d="100"/>
          <a:sy n="100" d="100"/>
        </p:scale>
        <p:origin x="0" y="0"/>
      </p:cViewPr>
    </p:cSldViewPr>`;

  return `${xmlDeclaration()}<p:viewPr xmlns:a="${NAMESPACES.a}" xmlns:r="${NAMESPACES.r}" xmlns:p="${NAMESPACES.p}" lastView="sldThumbnailView">
  <p:normalViewPr>
    <p:restoredLeft sz="15620"/>
    <p:restoredTop sz="94660"/>
  </p:normalViewPr>
  <p:slideViewPr>
    ${guideList}
  </p:slideViewPr>
  <p:notesTextViewPr>
    <p:cViewPr>
      <p:scale>
        <a:sx n="100" d="100"/>
        <a:sy n="100" d="100"/>
      </p:scale>
      <p:origin x="0" y="0"/>
    </p:cViewPr>
  </p:notesTextViewPr>
</p:viewPr>`;
}

export function generateTableStylesXml(): string {
  return `${xmlDeclaration()}<a:tblStyleLst xmlns:a="${NAMESPACES.a}" def="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"/>`;
}

export function generateContentTypesXml(layoutCount: number): string {
  let overrides = `
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.template.main+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>`;

  for (let i = 1; i <= layoutCount; i++) {
    overrides += `\n  <Override PartName="/ppt/slideLayouts/slideLayout${i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>`;
  }

  overrides += `
  <Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
  <Override PartName="/ppt/presProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presProps+xml"/>
  <Override PartName="/ppt/viewProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml"/>
  <Override PartName="/ppt/tableStyles.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>`;

  return `${xmlDeclaration()}<Types xmlns="${NAMESPACES.contentTypes}">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>${overrides}
</Types>`;
}

export function generateRootRelsXml(): string {
  return `${xmlDeclaration()}<Relationships xmlns="${NAMESPACES.relationships}">
  <Relationship Id="rId1" Type="${NAMESPACES.relPresentation}" Target="ppt/presentation.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;
}

export function generateCorePropsXml(title: string, creator: string): string {
  const now = new Date().toISOString();
  return `${xmlDeclaration()}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>${escapeXml(title)}</dc:title>
  <dc:creator>${escapeXml(creator)}</dc:creator>
  <cp:lastModifiedBy>${escapeXml(creator)}</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
</cp:coreProperties>`;
}

export function generateAppPropsXml(templateName: string): string {
  return `${xmlDeclaration()}<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Template>${escapeXml(templateName)}</Template>
  <TotalTime>0</TotalTime>
  <Words>0</Words>
  <Application>PPT Theme Builder</Application>
  <PresentationFormat>Custom</PresentationFormat>
  <Paragraphs>0</Paragraphs>
  <Slides>0</Slides>
  <Notes>0</Notes>
  <HiddenSlides>0</HiddenSlides>
  <MMClips>0</MMClips>
  <ScaleCrop>false</ScaleCrop>
  <Company>PPT Theme Builder</Company>
  <LinksUpToDate>false</LinksUpToDate>
  <SharedDoc>false</SharedDoc>
  <HyperlinksChanged>false</HyperlinksChanged>
  <AppVersion>16.0000</AppVersion>
</Properties>`;
}

