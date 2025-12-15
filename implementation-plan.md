📋 Implementation Plan Analysis
Based on your answers, here's what I understand:
✅ Your Requirements:
Primary Goal: Web preview must match exported .potx as closely as possible with master slides intact
Font System: Full upload with preview in webapp + fonts bundled in ZIP export (user installs fonts then opens .potx)
Layout Editor: Predefined templates (Title Slide, Title+Content, etc.) - Option C for MVP
Preview: Live HTML/CSS preview showing colors/fonts/layouts
Export: Functional button that generates .potx + fonts in a .zip file
UI Structure: Dashboard with sidebar navigation
Must-Have Features:
✅ Theme colors (12-color scheme)
✅ Font scheme with 7 text styles (Heading, Subtitle, Body Text Large, Body Text Small, Quote, Bullet List, Link)
✅ Typography settings (size, weight, spacing, line height for each style)
✅ Slide size: 16:9 (1920×1080) and A4 Landscape presets
✅ Guide/Grid system with visual editor
✅ Layout editor with predefined templates
🎯 Technical Approach:
Since you need actual .potx export, I recommend:
Frontend: Next.js with existing CBRE components
Backend: I'll build a Node.js/TypeScript backend using PptxGenJS library (can generate .potx files) + JSZip for bundling
This keeps everything in TypeScript ecosystem
Can run as Next.js API routes or separate Express server
Alternative: Use officegen or similar if PptxGenJS doesn't support .potx template format
📐 Architecture Plan:
┌─────────────────────────────────────────────────────────┐
│                    PPT Theme Builder                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────────────────────┐   │
│  │   Sidebar    │  │      Main Content Area       │   │
│  │  Navigation  │  │                              │   │
│  │              │  │  ┌─────────────────────────┐ │   │
│  │ • Theme      │  │  │  Section Content        │ │   │
│  │ • Typography │  │  │                         │ │   │
│  │ • Layouts    │  │  │  [Forms/Editors]        │ │   │
│  │ • Guides     │  │  │                         │ │   │
│  │ • Preview    │  │  └─────────────────────────┘ │   │
│  │ • Export     │  │                              │   │
│  └──────────────┘  └──────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
🗂️ File Structure:
app/
├── builder/
│   ├── layout.tsx          # Dashboard layout with sidebar
│   ├── page.tsx            # Redirect to /builder/theme
│   ├── theme/
│   │   └── page.tsx        # Theme colors (12-color picker)
│   ├── typography/
│   │   └── page.tsx        # 7 text styles editor
│   ├── layouts/
│   │   └── page.tsx        # Predefined layout templates
│   ├── guides/
│   │   └── page.tsx        # Grid/guide system
│   ├── preview/
│   │   └── page.tsx        # Live preview of slides
│   └── export/
│       └── page.tsx        # Export configuration & download
├── api/
│   ├── export/
│   │   └── route.ts        # POST endpoint to generate .potx + zip
│   └── fonts/
│       └── route.ts        # POST endpoint to upload/validate fonts
src/
├── components/
│   ├── builder/
│   │   ├── ColorPicker.tsx         # 12-color theme picker
│   │   ├── FontUploader.tsx        # Upload TTF/OTF with preview
│   │   ├── TypographyEditor.tsx    # Edit text styles
│   │   ├── LayoutTemplates.tsx     # Predefined layout selector
│   │   ├── GuideEditor.tsx         # Visual guide/grid editor
│   │   ├── SlidePreview.tsx        # HTML/CSS preview component
│   │   └── BuilderSidebar.tsx      # Navigation sidebar
│   └── cbre/                       # Existing CBRE components (reuse!)
├── lib/
│   ├── builder/
│   │   ├── state.ts                # Zustand store for template config
│   │   ├── types.ts                # TypeScript types for template
│   │   ├── defaults.ts             # Default CBRE theme values
│   │   └── export.ts               # Client-side export logic
│   └── fonts/
│       └── parser.ts               # Font metadata extraction (opentype.js)
server/                             # Backend (optional separate folder)
├── services/
│   ├── potx-generator.ts           # Generate .potx file
│   ├── zip-packager.ts             # Bundle .potx + fonts + README
│   └── font-validator.ts           # Validate TTF/OTF files
🎨 Implementation Steps:
Phase 1: Foundation & State Management (2-3 hours)
Create Zustand store for template configuration
Define TypeScript types matching PRD data model
Set up builder dashboard layout with sidebar navigation using CBRESidebar
Create empty pages for each section
Phase 2: Theme Colors (2 hours)
Build ColorPicker component using CBRE Input + color input type
Create 12-color scheme editor (Dark1, Dark2, Light1, Light2, Accent1-6, Hyperlink, Followed Hyperlink)
Add hex validation and color preview swatches
Live update in state
Phase 3: Typography System (3-4 hours)
Build FontUploader component:
File upload using CBREButton + input[type="file"]
Parse font metadata with opentype.js
Show font preview in custom web font
Store font file in state (base64 or File object)
Build TypographyEditor component:
7 text styles: Heading, Subtitle, Body Large, Body Small, Quote, Bullet, Link
For each style: font family dropdown, size (px), weight, line height, letter spacing, color picker
Use CBRESelect, CBRESlider, Input components
Add font preview using uploaded fonts (@font-face CSS)
Phase 4: Slide Size & Layouts (2 hours)
Slide size selector:
Radio buttons or CBRESelect for 16:9 vs A4 Landscape
Show dimensions (1920×1080 vs 297×210mm)
Layout Templates:
Build predefined layouts: Title Slide, Title+Content, Two-Content, Comparison, Section Header, Blank
Visual grid preview of each layout
Store selected layouts in state
Phase 5: Guides & Grid System (2-3 hours)
Build GuideEditor component:
Canvas showing slide dimensions (scaled)
Add/remove horizontal/vertical guides
Drag guides to position
Input fields for precise pixel values
Store guide positions in state
Phase 6: Live Preview (3 hours)
Build SlidePreview component:
Render HTML/CSS mockup of slides
Apply theme colors as CSS variables
Apply typography styles using uploaded fonts
Show layout placeholders with guides overlay
Render sample content in each text style
Make preview reactive to state changes
Phase 7: Backend - POTX Generator (4-5 hours)
Research and choose library:
Option A: PptxGenJS (most popular, but generates .pptx)
Option B: officegen (older but proven)
Option C: Direct XML manipulation using jszip + Open XML structure
Implement API route /api/export:
Accept template config JSON
Accept uploaded fonts as multipart
Generate .potx file with:
Theme colors in /ppt/theme/theme1.xml
Font scheme in theme
Master slides with layouts
Slide size configuration
Guide/grid definitions
Package with JSZip:
YourTemplate.potx
fonts/ folder
manifest.json
README.txt with installation instructions
Phase 8: Export UI (2 hours)
Build export page:
Template name input
Summary of configuration
CBREButton "Export Template"
Progress indicator during generation
Automatic ZIP download
Handle download in browser
Phase 9: Polish & Testing (2-3 hours)
Test exported .potx in PowerPoint (Windows/Mac)
Verify theme colors apply correctly
Verify font references (after user installs fonts)
Verify layouts and master slides
Add error handling and validation
Add loading states and toast notifications
Ensure CBRE styling consistency
Component Inventory - Reusing Existing CBRE Components:
✅ CBREButton - For all action buttons
✅ CBRECard - For section containers
✅ CBRESelect - For dropdowns (font family, slide size)
✅ CBRESlider - For numeric inputs (font size, spacing)
✅ CBRETabs - For switching between layouts or text styles
✅ CBRESidebar - For navigation
✅ CBREToast - For notifications
✅ Input (from ui) - For text inputs and color pickers
✅ CBRECheckbox - For toggles
✅ CBRESeparator - For visual separation
All components will use CBRE color palette only from cbre-theme.js.
Data Model (Zustand Store):
interface TemplateConfig {
  name: string;
  theme: {
    colors: {
      dark1: string;
      dark2: string;
      light1: string;
      light2: string;
      accent1: string;
      accent2: string;
      accent3: string;
      accent4: string;
      accent5: string;
      accent6: string;
      hyperlink: string;
      followedHyperlink: string;
    };
  };
  fonts: {
    heading: FontConfig;
    body: FontConfig;
  };
  typography: {
    heading: TextStyle;
    subtitle: TextStyle;
    bodyLarge: TextStyle;
    bodySmall: TextStyle;
    quote: TextStyle;
    bullet: TextStyle;
    link: TextStyle;
  };
  slideSize: '16:9' | 'A4-landscape';
  guides: Guide[];
  layouts: LayoutTemplate[];
}
Questions Resolved:
✅ Backend: Node.js/TypeScript (Next.js API routes or separate server)
✅ Font Upload: Option A - Full implementation with opentype.js, preview, and validation
✅ Layout Editor: Option C - Predefined templates (can add drag-drop in Phase 2)
✅ Preview: Option A - Live HTML/CSS preview
✅ Export: Functional .potx + fonts in ZIP
✅ UI: Option C - Dashboard with sidebar
✅ Features: All 7 text styles, 2 slide sizes, guides, layouts
Estimated Timeline:
Total: 22-28 hours of development
MVP Delivery: 3-4 working days
Risk: The .potx generation with proper master slides and theme XML is the most complex part. If existing libraries don't support .potx format properly, we may need to manually construct the Open XML structure. Does this plan align with your vision? Any adjustments needed?