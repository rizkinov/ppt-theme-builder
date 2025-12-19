# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PPT Theme Builder is a Next.js web application that generates PowerPoint template files (.potx) with custom themes, typography, colors, and layouts. It specifically targets CBRE brand standards but can be adapted for other corporate themes.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run test         # Run Jest tests
npm run generateComp # Generate new component scaffolding
```

## Architecture

### State Management
- **Zustand store** at [src/lib/builder/store.ts](src/lib/builder/store.ts) - Central state for template configuration
- State is persisted to localStorage with migration support
- Config includes: theme colors, fonts, typography styles, guides, and selected layouts

### OOXML Generation Pipeline
The app generates valid PowerPoint template files by creating Office Open XML components:

```
src/lib/builder/ooxml/
├── potx-generator.ts         # Main entry - assembles ZIP archive
├── theme-generator.ts        # theme1.xml (colors, fonts)
├── slide-master-generator.ts # slideMaster1.xml (master styles, guides)
├── slide-layout-generator.ts # slideLayout*.xml (layout definitions)
├── presentation-generator.ts # Core presentation files
├── xml-utils.ts              # XML helper functions
└── types.ts                  # OOXML-specific types
```

### Key Concepts

**CBRE Grid System**: The app implements a precise 22-column x 10-row grid (1920x1080px for 16:9). Grid constants and calculations are in [src/lib/builder/defaults.ts](src/lib/builder/defaults.ts). See [docs/CBRE-GRID-SYSTEM.md](docs/CBRE-GRID-SYSTEM.md) for exact pixel positions.

**Font System**: Fonts are stored as `FontAsset` objects with references by ID. Typography styles (`TextStyle`) reference fonts by `fontId`. Default fonts are Financier Display (headings) and Calibre (body).

**Theme Colors**: Uses PowerPoint's 12-color scheme (dark1, dark2, light1, light2, accent1-6, hyperlink, followedHyperlink). Typography can reference theme colors via `colorRef` for automatic syncing.

**OOXML Units**:
- Font sizes in hundredths of a point (20pt = 2000)
- Positions in EMUs (English Metric Units), 1 inch = 914400 EMU
- Guides in 1/8 points from origin

### App Routes (Next.js App Router)

```
app/
├── page.tsx              # Landing page
├── builder/
│   ├── page.tsx          # Main builder entry
│   ├── theme/page.tsx    # Color configuration
│   ├── typography/page.tsx
│   ├── layouts/page.tsx  # Layout template selection
│   ├── guides/page.tsx   # Grid guide management
│   ├── preview/page.tsx  # Slide preview
│   └── export/page.tsx   # Export to .potx
└── api/export/route.ts   # Server-side export endpoint
```

### Component Structure

- `src/components/ui/` - Base UI components (shadcn/ui)
- `src/components/cbre/` - CBRE-branded component variants
- `src/components/builder/` - Builder-specific components (ColorPicker, FontUploader, SlidePreview, etc.)

## Important Files

- [src/lib/builder/types.ts](src/lib/builder/types.ts) - Core TypeScript interfaces
- [src/lib/builder/defaults.ts](src/lib/builder/defaults.ts) - Default config, grid constants, layout templates
- [config/cbre-theme.ts](config/cbre-theme.ts) - CBRE brand colors and design tokens
- [docs/CBRE-TYPOGRAPHY-STANDARDS.md](docs/CBRE-TYPOGRAPHY-STANDARDS.md) - Typography specifications

## Working with Layouts

Layout positions must align to the CBRE grid. When creating/modifying layouts:
1. Use exact pixel values from the column/row tables in [docs/CBRE-GRID-SYSTEM.md](docs/CBRE-GRID-SYSTEM.md)
2. Position = start of first element, Size = end of last - start of first
3. Update both [defaults.ts](src/lib/builder/defaults.ts) (web preview) and [slide-layout-generator.ts](src/lib/builder/ooxml/slide-layout-generator.ts) (OOXML export)
