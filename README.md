# PPT Theme Builder

A web application for creating and customizing PowerPoint templates (.POTX) with full control over theme colors, fonts, layouts, and more.

## 🎯 Features

### ✅ Complete Implementation

1. **Theme Colors** - 12-color scheme editor matching PowerPoint's internal structure
   - Dark 1, Dark 2, Light 1, Light 2
   - Accent 1-6
   - Hyperlink & Followed Hyperlink colors
   - Live color picker with hex input
   - Color palette preview

2. **Typography System** - Complete font management and text styles
   - Font uploader supporting TTF/OTF files
   - Font preview in web app
   - 7 text style editors:
     - Heading (H1)
     - Subtitle (H2)
     - Body Large
     - Body Small
     - Quote
     - Bullet List
     - Link
   - Configurable: font family, size, weight, line height, letter spacing, color, text transform

3. **Slide Layouts** - Predefined layout templates
   - 16:9 Widescreen (1920×1080) support
   - A4 Landscape (297×210mm) support
   - 6 predefined layouts:
     - Title Slide
     - Title + Content
     - Two Content
     - Comparison
     - Section Header
     - Blank
   - Visual preview of each layout
   - Select multiple layouts for template

4. **Guides & Grid System** - Visual layout guides
   - Add horizontal and vertical guides
   - Drag to position or enter precise pixel values
   - Quick presets (center, thirds)
   - Visual canvas preview
   - Guides visible in PowerPoint view

5. **Live Preview** - Real-time template preview
   - HTML/CSS mockup of slides
   - Preview all selected layouts
   - Show/hide guides toggle
   - Theme colors display
   - Typography styles showcase
   - Template summary

6. **Export System** - Full .potx generation
   - **True Office Open XML generation** - Proper .potx template files
   - Creates real master slides and slide layouts
   - Theme colors appear in PowerPoint's Design tab color picker
   - Font schemes properly configured
   - ZIP package with:
     - Template.potx file (true PowerPoint template)
     - fonts/ folder with uploaded fonts
     - manifest.json with metadata
     - README.txt with installation instructions
   - One-click download
   - Validation before export

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 14 with React
- **Styling**: TailwindCSS with CBRE theme
- **UI Components**: Existing CBRE component library
- **State Management**: Zustand with persistence
- **File Handling**: Font upload with preview using opentype.js

### Backend
- **API Routes**: Next.js API routes
- **PowerPoint Generation**: Custom Office Open XML (OOXML) generator
  - Direct XML generation for proper .potx files
  - True master slides and slide layouts
  - Proper theme color and font scheme integration
- **ZIP Packaging**: JSZip library
- **Font Handling**: File upload with validation

### State Management
- Zustand store with localStorage persistence
- Complete template configuration stored
- Undo/redo ready (not implemented yet)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at `http://localhost:3000` (or 3001 if 3000 is in use).

### Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
app/
├── builder/              # Main builder application
│   ├── layout.tsx       # Dashboard layout with sidebar
│   ├── theme/           # Theme colors page
│   ├── typography/      # Typography & fonts page
│   ├── layouts/         # Slide layouts page
│   ├── guides/          # Guides & grid page
│   ├── preview/         # Live preview page
│   └── export/          # Export & download page
├── api/
│   └── export/          # Export API endpoint
│       └── route.ts
src/
├── components/
│   ├── builder/         # Builder-specific components
│   │   ├── BuilderSidebar.tsx
│   │   ├── PageHeader.tsx
│   │   ├── ColorPicker.tsx
│   │   ├── FontUploader.tsx
│   │   ├── TextStyleEditor.tsx
│   │   └── SlidePreview.tsx
│   └── cbre/            # CBRE UI components (existing)
├── lib/
│   └── builder/
│       ├── types.ts            # TypeScript types
│       ├── defaults.ts         # Default values & layouts
│       ├── store.ts            # Zustand state management
│       └── potx-generator.ts   # PowerPoint generation logic
```

## 🎨 Design System

All components use the CBRE design system:
- **Colors**: CBRE Green, Accent Green, Dark Grey, Light Grey, etc.
- **Typography**: Financier Display (headings), Calibre (body)
- **Components**: CBREButton, CBRECard, CBRESelect, etc.
- **Styling**: Sharp corners (no border radius), CBRE color palette

## 🔧 Usage

### 1. Theme Colors
- Navigate to "Theme Colors" in the sidebar
- Edit the 12 PowerPoint theme colors using color pickers
- Preview the complete palette at the bottom

### 2. Typography
- Go to "Typography" page
- Upload heading and body fonts (TTF/OTF)
- Configure 7 text styles using the tabs
- Adjust font size, weight, spacing, color, etc.

### 3. Layouts
- Select "Layouts" from sidebar
- Choose slide size (16:9 or A4)
- Select which layouts to include in template
- See visual preview of each layout

### 4. Guides & Grid
- Open "Guides & Grid" page
- Add horizontal/vertical guides
- Use quick presets or enter precise positions
- See guides overlaid on slide canvas

### 5. Preview
- Go to "Preview" to see everything together
- Toggle guide visibility
- Review theme colors, typography, and layouts
- Check template summary

### 6. Export
- Navigate to "Export" page
- Set template name
- Review configuration summary
- Click "Export Template" to download ZIP

### 7. Install & Use
- Extract the downloaded ZIP file
- Install fonts from fonts/ folder first
- Follow README.txt instructions
- Open the .potx file in PowerPoint
- Start creating presentations!

## 🎯 Key Features & Highlights

### ✨ What Makes This Special
1. **Web-based template builder** - No PowerPoint needed to create templates
2. **Live preview** - See changes in real-time
3. **Font bundling** - Fonts included in ZIP for easy installation
4. **Master slides** - Proper PowerPoint master slide architecture
5. **CBRE styling** - Professional, branded interface
6. **Persistent state** - Configuration saved in browser
7. **Validation** - Prevents export with incomplete config

### 🎨 CBRE Brand Integration
- Uses only CBRE colors from theme
- All components styled with CBRE design system
- Default theme colors set to CBRE palette
- Professional, corporate aesthetic

## 📦 Dependencies

### Production
- `next` - React framework
- `react` & `react-dom` - UI library
- `zustand` - State management
- `pptxgenjs` - PowerPoint generation
- `jszip` - ZIP packaging
- `opentype.js` - Font parsing
- `lucide-react` - Icons
- `tailwindcss` - Styling
- `sonner` - Toast notifications

### CBRE Components (existing)
- All shadcn/ui components
- Custom CBRE-styled components
- Radix UI primitives

## 🚧 Future Enhancements

### Phase 2 Features (Not Yet Implemented)
- [ ] Server-side .potx rendering preview
- [ ] Import existing .potx files for editing
- [ ] Custom layout editor (drag-and-drop placeholders)
- [ ] Font embedding in .potx (license permitting)
- [ ] Template versioning
- [ ] Collaboration features
- [ ] Template gallery/library
- [ ] AI-powered layout suggestions
- [ ] Figma/Canva integration
- [ ] Advanced placeholder types (charts, tables, etc.)

### Known Limitations
1. **Font Embedding**: Fonts are not embedded in .potx - users must install them separately
2. **Layout Editor**: Only predefined layouts available (no custom drag-and-drop)
3. **Chart/Table Placeholders**: Only text placeholders currently supported

## 🧪 Testing

### To Test the Application
1. Run `npm run dev`
2. Navigate to `http://localhost:3001`
3. Go through each section:
   - Edit theme colors
   - Upload fonts and configure typography
   - Select layouts and slide size
   - Add guides
   - Preview the template
   - Export and download
4. Extract ZIP and test in PowerPoint

### Testing the Export
1. Install fonts from fonts/ folder
2. Open the .potx file in PowerPoint
3. Create new presentation from template
4. Verify theme colors appear in color picker
5. Verify layouts are available
6. Verify fonts render correctly (if installed)
7. Check guides in Master Slide view

## 📄 License

MIT

## 👥 Credits

Built with:
- Next.js
- React
- TailwindCSS
- CBRE Design System
- PptxGenJS
- Shadcn/ui components

---

**Note**: This is an MVP implementation focused on core functionality. See "Future Enhancements" for planned features.
