/**
 * Generate slideLayoutN.xml files for PowerPoint template
 * Each layout defines a specific slide arrangement users can choose from
 */

import { xmlDeclaration, NAMESPACES, escapeXml } from './xml-utils';
import { OOXMLSlideSize } from './types';

export type LayoutType = 
  | 'title-slide'
  | 'title-content'
  | 'section-header'
  | 'two-content'
  | 'comparison'
  | 'blank';

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
];

export function getLayoutConfigs(): LayoutConfig[] {
  return LAYOUT_CONFIGS;
}

export function generateSlideLayoutXml(
  layoutIndex: number,
  slideSize: OOXMLSlideSize
): string {
  const config = LAYOUT_CONFIGS[layoutIndex];
  if (!config) {
    throw new Error(`Invalid layout index: ${layoutIndex}`);
  }

  switch (config.type) {
    case 'title-slide':
      return generateTitleSlideLayout(slideSize, config);
    case 'title-content':
      return generateTitleContentLayout(slideSize, config);
    case 'section-header':
      return generateSectionHeaderLayout(slideSize, config);
    case 'two-content':
      return generateTwoContentLayout(slideSize, config);
    case 'comparison':
      return generateComparisonLayout(slideSize, config);
    case 'blank':
      return generateBlankLayout(slideSize, config);
    default:
      return generateBlankLayout(slideSize, config);
  }
}

function generateTitleSlideLayout(slideSize: OOXMLSlideSize, config: LayoutConfig): string {
  const titleX = Math.round(slideSize.cx * 0.1);
  const titleY = Math.round(slideSize.cy * 0.32);
  const titleCx = Math.round(slideSize.cx * 0.8);
  const titleCy = Math.round(slideSize.cy * 0.19);

  const subtitleX = Math.round(slideSize.cx * 0.1);
  const subtitleY = Math.round(slideSize.cy * 0.55);
  const subtitleCx = Math.round(slideSize.cx * 0.8);
  const subtitleCy = Math.round(slideSize.cy * 0.13);

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
          <a:bodyPr anchor="b"/>
          <a:lstStyle>
            <a:lvl1pPr algn="ctr">
              <a:defRPr sz="6000"/>
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
          <a:bodyPr/>
          <a:lstStyle>
            <a:lvl1pPr marL="0" indent="0" algn="ctr">
              <a:buNone/>
              <a:defRPr sz="2400"/>
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

function generateTitleContentLayout(slideSize: OOXMLSlideSize, config: LayoutConfig): string {
  const titleX = Math.round(slideSize.cx * 0.0625);
  const titleY = Math.round(slideSize.cy * 0.074);
  const titleCx = Math.round(slideSize.cx * 0.875);
  const titleCy = Math.round(slideSize.cy * 0.13);

  const contentX = Math.round(slideSize.cx * 0.0625);
  const contentY = Math.round(slideSize.cy * 0.222);
  const contentCx = Math.round(slideSize.cx * 0.875);
  const contentCy = Math.round(slideSize.cy * 0.667);

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
          <a:bodyPr/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:defRPr sz="4400"/>
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
          <a:bodyPr/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:defRPr sz="2000"/>
            </a:lvl1pPr>
            <a:lvl2pPr>
              <a:defRPr sz="1800"/>
            </a:lvl2pPr>
            <a:lvl3pPr>
              <a:defRPr sz="1600"/>
            </a:lvl3pPr>
            <a:lvl4pPr>
              <a:defRPr sz="1400"/>
            </a:lvl4pPr>
            <a:lvl5pPr>
              <a:defRPr sz="1400"/>
            </a:lvl5pPr>
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

function generateSectionHeaderLayout(slideSize: OOXMLSlideSize, config: LayoutConfig): string {
  const titleX = Math.round(slideSize.cx * 0.1);
  const titleY = Math.round(slideSize.cy * 0.37);
  const titleCx = Math.round(slideSize.cx * 0.8);
  const titleCy = Math.round(slideSize.cy * 0.26);

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
          <a:bodyPr anchor="ctr"/>
          <a:lstStyle>
            <a:lvl1pPr algn="ctr">
              <a:defRPr sz="6000"/>
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

function generateTwoContentLayout(slideSize: OOXMLSlideSize, config: LayoutConfig): string {
  const titleX = Math.round(slideSize.cx * 0.0625);
  const titleY = Math.round(slideSize.cy * 0.074);
  const titleCx = Math.round(slideSize.cx * 0.875);
  const titleCy = Math.round(slideSize.cy * 0.13);

  const leftX = Math.round(slideSize.cx * 0.0625);
  const contentY = Math.round(slideSize.cy * 0.222);
  const contentCx = Math.round(slideSize.cx * 0.422);
  const contentCy = Math.round(slideSize.cy * 0.667);

  const rightX = Math.round(slideSize.cx * 0.516);

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
          <a:bodyPr/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:defRPr sz="4400"/>
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
          <a:bodyPr/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:defRPr sz="1800"/>
            </a:lvl1pPr>
            <a:lvl2pPr>
              <a:defRPr sz="1600"/>
            </a:lvl2pPr>
            <a:lvl3pPr>
              <a:defRPr sz="1400"/>
            </a:lvl3pPr>
            <a:lvl4pPr>
              <a:defRPr sz="1200"/>
            </a:lvl4pPr>
            <a:lvl5pPr>
              <a:defRPr sz="1200"/>
            </a:lvl5pPr>
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
          <a:bodyPr/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:defRPr sz="1800"/>
            </a:lvl1pPr>
            <a:lvl2pPr>
              <a:defRPr sz="1600"/>
            </a:lvl2pPr>
            <a:lvl3pPr>
              <a:defRPr sz="1400"/>
            </a:lvl3pPr>
            <a:lvl4pPr>
              <a:defRPr sz="1200"/>
            </a:lvl4pPr>
            <a:lvl5pPr>
              <a:defRPr sz="1200"/>
            </a:lvl5pPr>
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

function generateComparisonLayout(slideSize: OOXMLSlideSize, config: LayoutConfig): string {
  const titleX = Math.round(slideSize.cx * 0.0625);
  const titleY = Math.round(slideSize.cy * 0.074);
  const titleCx = Math.round(slideSize.cx * 0.875);
  const titleCy = Math.round(slideSize.cy * 0.13);

  const leftX = Math.round(slideSize.cx * 0.0625);
  const rightX = Math.round(slideSize.cx * 0.516);
  const headerY = Math.round(slideSize.cy * 0.222);
  const headerCx = Math.round(slideSize.cx * 0.422);
  const headerCy = Math.round(slideSize.cy * 0.093);

  const contentY = Math.round(slideSize.cy * 0.333);
  const contentCy = Math.round(slideSize.cy * 0.556);

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
          <a:bodyPr/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:defRPr sz="4400"/>
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
          <a:bodyPr anchor="b"/>
          <a:lstStyle>
            <a:lvl1pPr marL="0" indent="0">
              <a:buNone/>
              <a:defRPr sz="2400" b="1"/>
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
          <a:bodyPr/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:defRPr sz="1600"/>
            </a:lvl1pPr>
            <a:lvl2pPr>
              <a:defRPr sz="1400"/>
            </a:lvl2pPr>
            <a:lvl3pPr>
              <a:defRPr sz="1200"/>
            </a:lvl3pPr>
            <a:lvl4pPr>
              <a:defRPr sz="1100"/>
            </a:lvl4pPr>
            <a:lvl5pPr>
              <a:defRPr sz="1100"/>
            </a:lvl5pPr>
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
          <a:bodyPr anchor="b"/>
          <a:lstStyle>
            <a:lvl1pPr marL="0" indent="0">
              <a:buNone/>
              <a:defRPr sz="2400" b="1"/>
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
          <a:bodyPr/>
          <a:lstStyle>
            <a:lvl1pPr>
              <a:defRPr sz="1600"/>
            </a:lvl1pPr>
            <a:lvl2pPr>
              <a:defRPr sz="1400"/>
            </a:lvl2pPr>
            <a:lvl3pPr>
              <a:defRPr sz="1200"/>
            </a:lvl3pPr>
            <a:lvl4pPr>
              <a:defRPr sz="1100"/>
            </a:lvl4pPr>
            <a:lvl5pPr>
              <a:defRPr sz="1100"/>
            </a:lvl5pPr>
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

function generateBlankLayout(slideSize: OOXMLSlideSize, config: LayoutConfig): string {
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

// Generate slide layout relationships file
export function generateSlideLayoutRelsXml(): string {
  return `${xmlDeclaration()}<Relationships xmlns="${NAMESPACES.relationships}">
  <Relationship Id="rId1" Type="${NAMESPACES.relSlideMaster}" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>`;
}

