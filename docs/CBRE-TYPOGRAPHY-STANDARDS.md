# CBRE Typography Standards for PowerPoint Templates

## Overview
This document outlines the typography standards implemented in the PPT Theme Builder to ensure 100% alignment with CBRE brand guidelines.

## Font Families

### Heading Font: Financier Display
- **Usage**: Titles, headers, section headers
- **Font Family Reference**: `+mj-lt` (Major Latin font in OOXML)
- **Properties**: Professional serif font for impactful headlines

### Body Font: Calibre
- **Usage**: Body text, subtitles, bullets, body content
- **Font Family Reference**: `+mn-lt` (Minor Latin font in OOXML)
- **Properties**: Clean sans-serif font for readability

## Typography Styles

### 1. Heading (Title)
- **Font Family**: Financier Display
- **Font Size**: 48pt (4800 in OOXML)
- **Font Weight**: 700 (Bold)
- **Line Height**: 1.1
- **Letter Spacing**: 0
- **Color**: CBRE Green (#003F2D)
- **Text Transform**: None
- **Applied To**: Main slide titles, title slide main heading

### 2. Subtitle (Secondary Heading)
- **Font Family**: Financier Display
- **Font Size**: 32pt (3200 in OOXML)
- **Font Weight**: 600 (Semi-bold)
- **Line Height**: 1.2
- **Letter Spacing**: 0
- **Color**: Dark Grey (#435254)
- **Text Transform**: None
- **Applied To**: Subtitles, comparison headings

### 3. Body Large
- **Font Family**: Calibre
- **Font Size**: 20pt (2000 in OOXML)
- **Font Weight**: 400 (Regular)
- **Line Height**: 1.5
- **Letter Spacing**: 0
- **Color**: Dark Grey (#435254)
- **Text Transform**: None
- **Applied To**: Main body text, content areas

### 4. Body Small
- **Font Family**: Calibre
- **Font Size**: 16pt (1600 in OOXML)
- **Font Weight**: 400 (Regular)
- **Line Height**: 1.5
- **Letter Spacing**: 0
- **Color**: Dark Grey (#435254)
- **Text Transform**: None
- **Applied To**: Secondary body text, captions

### 5. Quote
- **Font Family**: Calibre
- **Font Size**: 24pt (2400 in OOXML)
- **Font Weight**: 500 (Medium)
- **Line Height**: 1.4
- **Letter Spacing**: 0
- **Color**: Sage (#538184)
- **Text Transform**: None
- **Italic**: Yes
- **Applied To**: Quote slides

### 6. Bullet
- **Font Family**: Calibre
- **Font Size**: 18pt (1800 in OOXML)
- **Font Weight**: 400 (Regular)
- **Line Height**: 1.6
- **Letter Spacing**: 0
- **Color**: Dark Grey (#435254)
- **Text Transform**: None
- **Applied To**: Bullet lists

### 7. Link
- **Font Family**: Calibre
- **Font Size**: 18pt (1800 in OOXML)
- **Font Weight**: 400 (Regular)
- **Line Height**: 1.5
- **Letter Spacing**: 0
- **Color**: Accent Green (#17E88F)
- **Text Transform**: None
- **Applied To**: Hyperlinks

## Layout-Specific Typography Application

### Title Slide Layout
- **Title Placeholder**: Uses `heading` style (Financier Display, 48pt)
- **Subtitle Placeholder**: Uses `subtitle` style (Financier Display, 32pt)

### Title + Content Layout
- **Title Placeholder**: Uses `heading` style (Financier Display, 48pt)
- **Content Placeholder**: Uses `bodyLarge` style (Calibre, 20pt)

### Two Content Layout
- **Title Placeholder**: Uses `heading` style (Financier Display, 48pt)
- **Left Content Placeholder**: Uses `bodyLarge` style (Calibre, 20pt)
- **Right Content Placeholder**: Uses `bodyLarge` style (Calibre, 20pt)

### Comparison Layout
- **Title Placeholder**: Uses `heading` style (Financier Display, 48pt)
- **Left Heading Placeholder**: Uses `subtitle` style (Financier Display, 32pt)
- **Left Content Placeholder**: Uses `bodyLarge` style (Calibre, 20pt)
- **Right Heading Placeholder**: Uses `subtitle` style (Financier Display, 32pt)
- **Right Content Placeholder**: Uses `bodyLarge` style (Calibre, 20pt)

### Section Header Layout
- **Section Title Placeholder**: Uses `heading` style (Financier Display, 48pt)

### Quote Layout
- **Quote Placeholder**: Uses `quote` style (Calibre, 24pt, italic)

### Title Only Layout
- **Title Placeholder**: Uses `heading` style (Financier Display, 48pt)

## OOXML Implementation Details

### Font Size Conversion
- PowerPoint font sizes in OOXML are in hundredths of a point
- Example: 48pt = 4800, 20pt = 2000

### Font Family Mapping
- **Heading (Financier Display)**: References `+mj-lt` (Major Latin)
- **Body (Calibre)**: References `+mn-lt` (Minor Latin)

### Typography Attributes Applied
For each text placeholder, the following XML attributes are set:
- `sz`: Font size (in hundredths of a point)
- `b`: Bold (1 if fontWeight >= 600, else 0)
- `cap`: Text transform (all caps if uppercase, else none)
- `typeface`: Font family reference
- `solidFill > schemeClr`: Color reference from theme

### Master Slide Text Styles
The slide master defines three text style hierarchies:
1. **Title Style**: Applied to title placeholders
2. **Body Style**: Applied to body placeholders (with 5 levels for indentation)
3. **Other Style**: Applied to other text elements

## Verification Checklist

✅ All title placeholders use Financier Display at 48pt
✅ All subtitle placeholders use Financier Display at 32pt
✅ All body content placeholders use Calibre at 20pt
✅ Quote placeholders use Calibre at 24pt with italic
✅ Font weight and bold attributes are correctly applied
✅ Colors reference the CBRE theme color scheme
✅ Font family references use proper OOXML schema mapping
✅ Text transform (caps) attributes are applied where configured
✅ All 6 standard layouts have typography properly applied
✅ Slide master text styles match the typography configuration

## Files Implementing Typography

1. **`/src/lib/builder/defaults.ts`**: Default typography configuration
2. **`/src/lib/builder/ooxml/types.ts`**: TypeScript types for typography
3. **`/src/lib/builder/ooxml/slide-layout-generator.ts`**: Slide layouts with typography
4. **`/src/lib/builder/ooxml/slide-master-generator.ts`**: Master slide text styles
5. **`/src/lib/builder/ooxml/potx-generator.ts`**: Main POTX generator

## Notes

- The typography system is fully configurable through the application UI
- Default values align with CBRE brand standards
- All text boxes created in PowerPoint from these templates will inherit the correct typography
- Users can override typography on individual text boxes after creation, but the defaults ensure brand consistency
