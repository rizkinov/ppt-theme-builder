import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { generatePOTX, convertToPOTXConfig } from '@/src/lib/builder/ooxml';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const configJson = formData.get('config') as string;
    const headingFontFile = formData.get('headingFont') as File | null;
    const bodyFontFile = formData.get('bodyFont') as File | null;

    console.log('📦 Export API called');
    console.log('Heading font:', headingFontFile ? `${headingFontFile.name} (${headingFontFile.size} bytes)` : 'None');
    console.log('Body font:', bodyFontFile ? `${bodyFontFile.name} (${bodyFontFile.size} bytes)` : 'None');

    if (!configJson) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      );
    }

    const config = JSON.parse(configJson);

    // Convert app config to POTX config format
    const potxConfig = convertToPOTXConfig(config);
    console.log('📝 Generating POTX with theme:', potxConfig.name);

    // Generate proper .potx file using Office Open XML
    const potxBlob = await generatePOTX(potxConfig);
    const potxBuffer = await potxBlob.arrayBuffer();

    // Create the final ZIP package
    const zip = new JSZip();
    const templateName = config.name.replace(/[^a-zA-Z0-9]/g, '_');

    // Add .potx file (the proper PowerPoint template)
    zip.file(`${templateName}.potx`, potxBuffer);

    // Add fonts folder
    const fontsFolder = zip.folder('fonts');
    if (fontsFolder) {
      if (headingFontFile) {
        const headingFontBuffer = await headingFontFile.arrayBuffer();
        fontsFolder.file(headingFontFile.name, headingFontBuffer);
      }
      if (bodyFontFile) {
        const bodyFontBuffer = await bodyFontFile.arrayBuffer();
        fontsFolder.file(bodyFontFile.name, bodyFontBuffer);
      }
    }

    // Add manifest.json
    const manifest = {
      template: `${templateName}.potx`,
      format: 'Office Open XML PowerPoint Template',
      slideSize: config.slideSize === '16:9' ? '1920x1080 (16:9 Widescreen)' : 'A4 Landscape',
      themeColors: {
        dark1: config.theme.colors.dark1,
        dark2: config.theme.colors.dark2,
        light1: config.theme.colors.light1,
        light2: config.theme.colors.light2,
        accent1: config.theme.colors.accent1,
        accent2: config.theme.colors.accent2,
        accent3: config.theme.colors.accent3,
        accent4: config.theme.colors.accent4,
        accent5: config.theme.colors.accent5,
        accent6: config.theme.colors.accent6,
        hyperlink: config.theme.colors.hyperlink,
        followedHyperlink: config.theme.colors.followedHyperlink,
      },
      fonts: {
        headings: {
          family: config.fonts.heading.family,
          files: headingFontFile ? [`fonts/${headingFontFile.name}`] : [],
        },
        body: {
          family: config.fonts.body.family,
          files: bodyFontFile ? [`fonts/${bodyFontFile.name}`] : [],
        },
      },
      layouts: [
        'Title Slide',
        'Title and Content',
        'Section Header',
        'Two Content',
        'Comparison',
        'Blank'
      ],
      guides: config.guides.length,
      generatedAt: new Date().toISOString(),
      generatedBy: 'PPT Theme Builder (Office Open XML)',
    };
    zip.file('manifest.json', JSON.stringify(manifest, null, 2));

    // Add README.txt
    const readme = `PowerPoint Template Installation Instructions
=============================================

TEMPLATE: ${config.name}
FILE TYPE: .potx (PowerPoint Template)
GENERATED: ${new Date().toLocaleDateString()}

This is a TRUE PowerPoint Template (.potx) with proper master slides
and theme colors that will appear in PowerPoint's Design tab.


STEP 1: INSTALL FONTS (if included)
-----------------------------------
${headingFontFile || bodyFontFile ? `
You MUST install the custom fonts BEFORE opening the template.

Included Fonts:
${headingFontFile ? `  • ${config.fonts.heading.family} (Heading font): fonts/${headingFontFile.name}` : ''}
${bodyFontFile ? `  • ${config.fonts.body.family} (Body font): fonts/${bodyFontFile.name}` : ''}

Windows Installation:
1. Open the fonts/ folder
2. Right-click on each font file (.ttf or .otf)
3. Select "Install for all users" (recommended)
4. Wait for installation to complete
5. Restart PowerPoint if it's already open

macOS Installation:
1. Open the fonts/ folder
2. Double-click each font file
3. Click "Install Font" in Font Book
4. Restart PowerPoint if it's already open
` : 'No custom fonts included with this template.'}


STEP 2: USE THE TEMPLATE
------------------------
Option A - Start New Presentation from Template:
1. Double-click ${templateName}.potx
2. PowerPoint will create a new presentation based on the template
3. Your theme colors and fonts will be automatically applied
4. Choose from 6 slide layouts: Insert > New Slide

Option B - Apply Template to Existing Presentation:
1. Open your existing presentation in PowerPoint
2. Go to Design tab
3. Click the small arrow in the Themes section
4. Choose "Browse for Themes..."
5. Select ${templateName}.potx
6. The theme will be applied to all slides


WHAT'S INCLUDED IN THIS TEMPLATE
--------------------------------
✓ Theme Colors (12 colors):
  - Dark 1, Dark 2, Light 1, Light 2
  - Accent 1-6
  - Hyperlink, Followed Hyperlink
  
✓ Font Scheme:
  - Heading Font: ${config.fonts.heading.family}
  - Body Font: ${config.fonts.body.family}
  
✓ Master Slides with 6 Layouts:
  1. Title Slide - Centered title with subtitle
  2. Title and Content - Title with body content area
  3. Section Header - Large centered section title
  4. Two Content - Title with two side-by-side areas
  5. Comparison - Title with labeled comparison columns
  6. Blank - Empty slide with theme styling

✓ Typography Styles:
  - Configured text styles for titles, body, and bullets
  - Font sizes and weights properly set

${config.guides.length > 0 ? `✓ Guides: ${config.guides.length} guide(s) configured\n` : ''}

THEME COLORS IN POWERPOINT
--------------------------
After opening the template:
1. Select any shape or text
2. Go to Format > Shape Fill (or Font Color)
3. Click "Theme Colors" - you'll see YOUR custom color palette!

The 12 theme colors will be available in every color picker throughout
PowerPoint. This is the proper way to maintain brand consistency.


EDITING MASTER SLIDES
---------------------
To customize the layouts further:
1. Go to View > Slide Master
2. Edit the master slide (top) for global changes
3. Edit individual layouts for specific changes
4. Changes propagate to all slides using that layout
5. Close Master View when done


TROUBLESHOOTING
---------------
If fonts don't appear correctly:
• Make sure fonts are installed BEFORE opening the template
• Close and reopen PowerPoint after installing fonts
• On Windows, use "Install for all users" not just "Install"
• Check that the exact font name matches (case-sensitive)

If theme colors aren't showing:
• Make sure you opened the .potx file (not .pptx)
• Check Design > Themes - your template should appear
• Try applying the theme manually via Design > Browse for Themes


TECHNICAL DETAILS
-----------------
Format: Office Open XML (OOXML) .potx
Slide Size: ${config.slideSize === '16:9' ? '16:9 Widescreen (12.8" × 7.2")' : 'A4 Landscape (11.69" × 8.27")'}
Compatibility: PowerPoint 2007 and later (Windows, macOS, Web)


Generated by PPT Theme Builder
For questions or issues, refer to the application documentation.

Happy presenting! 🎉
`;
    zip.file('README.txt', readme);

    // Generate ZIP blob
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    console.log('✅ Export complete:', `${templateName}.zip`);

    // Return ZIP file
    return new NextResponse(zipBlob, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${templateName}.zip"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to generate template', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
