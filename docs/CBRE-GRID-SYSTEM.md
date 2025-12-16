# CBRE PowerPoint Grid System & Layout Specifications

This document defines the CBRE standard grid system for PowerPoint slides. It covers both **16:9 aspect ratio (1920×1080 pixels)** and **A4 Landscape (297×210mm / ~1122×794 pixels)**.

Use these specifications when creating slide layouts to ensure consistent alignment with CBRE brand guidelines.

---

# 📐 16:9 WIDESCREEN (1920×1080px)

## Grid Overview

### Slide Dimensions
- **Width**: 1920px
- **Height**: 1080px
- **Aspect Ratio**: 16:9

### Margin System
| Edge | Position (px) | Description |
|------|--------------|-------------|
| Left margin | 81px | Content starts here |
| Right margin | 1839px | Content ends here (81 + 1758) |
| Top margin | 91px | Content-top guide |
| Bottom margin | 989px | Content-bottom guide |

### Content Area
- **Content width**: 1758px (1839 - 81)
- **Content height**: 898px (989 - 91)

## Column System (Two-Column Layouts)

| Column | X Position | Width | End Position |
|--------|-----------|-------|--------------|
| Left column | 81px | 870px | 951px |
| Gutter | 951px | 18px | 969px |
| Right column | 969px | 870px | 1839px |

### Gutter (Center Gap)
- **Gutter start**: 951px
- **Gutter end**: 969px
- **Gutter width**: 18px

## Vertical Spacing & Gaps

### Element Heights
| Element | Height |
|---------|--------|
| Title placeholder | 80px |
| Subtitle/Header placeholder | 80px |
| Body text variable | Fills remaining space |

### Gap Specifications

| Gap Type | From → To | Gap Size | Calculation |
|----------|-----------|----------|-------------|
| Title → Content | Title bottom → Content top | **23px** | Content y = Title y + Title height + 23 |
| Title → Subtitle | Title bottom → Subtitle top | **23px** | Subtitle y = Title y + Title height + 23 |
| Subtitle → Content | Subtitle bottom → Content top | **22px** | Content y = Subtitle y + Subtitle height + 22 |

## Standard Layout Positions (16:9)

### Title + Content Layout
| Element | X | Y | Width | Height |
|---------|---|---|-------|--------|
| Title | 81 | 91 | 1758 | 80 |
| Content | 81 | 194 | 1758 | 795 |

### Two Content Layout
| Element | X | Y | Width | Height |
|---------|---|---|-------|--------|
| Title | 81 | 91 | 1758 | 80 |
| Left Content | 81 | 194 | 870 | 795 |
| Right Content | 969 | 194 | 870 | 795 |

### Comparison Layout
| Element | X | Y | Width | Height |
|---------|---|---|-------|--------|
| Title | 81 | 91 | 1758 | 80 |
| Left Subtitle | 81 | 194 | 870 | 80 |
| Right Subtitle | 969 | 194 | 870 | 80 |
| Left Content | 81 | 296 | 870 | 688 |
| Right Content | 969 | 296 | 870 | 688 |

### Three Content Layout (Equal Thirds)
```
┌─────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ TITLE (y=91, height=80)                                          │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│         ↓ 23px gap                                                       │
│  ┌──────────────┐ 18px ┌──────────────┐ 18px ┌──────────────┐           │
│  │ LEFT         │ gap  │ CENTER       │ gap  │ RIGHT        │           │
│  │ (x=81)       │      │ (x=673)      │      │ (x=1265)     │           │
│  │ w=574        │      │ w=574        │      │ w=574        │           │
│  │ h=795        │      │ h=795        │      │ h=795        │           │
│  └──────────────┘      └──────────────┘      └──────────────┘           │
└─────────────────────────────────────────────────────────────────────────┘
```

| Element | X | Y | Width | Height | Calculation |
|---------|---|---|-------|--------|-------------|
| Title | 81 | 91 | 1758 | 80 | Full width |
| Left Content | 81 | 194 | 574 | 795 | (1758 - 2×18) ÷ 3 |
| Center Content | 673 | 194 | 574 | 795 | 81 + 574 + 18 |
| Right Content | 1265 | 194 | 574 | 795 | 81 + 574 + 18 + 574 + 18 |

### Content + Sidebar Layout (Half + Two Stacked)
```
┌─────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ TITLE (y=91, height=80)                                          │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│         ↓ 23px gap                                                       │
│  ┌──────────────────────────┐ 18px ┌──────────────────────────┐         │
│  │                          │ gap  │ TOP SIDEBAR              │         │
│  │ MAIN CONTENT             │      │ (y=194, h=386)           │         │
│  │ (x=81, w=870)            │      └──────────────────────────┘         │
│  │                          │            ↓ 22px gap                      │
│  │ h=795                    │      ┌──────────────────────────┐         │
│  │                          │      │ BOTTOM SIDEBAR           │         │
│  │                          │      │ (y=602, h=387)           │         │
│  └──────────────────────────┘      └──────────────────────────┘         │
└─────────────────────────────────────────────────────────────────────────┘
```

| Element | X | Y | Width | Height | Calculation |
|---------|---|---|-------|--------|-------------|
| Title | 81 | 91 | 1758 | 80 | Full width |
| Main Content | 81 | 194 | 870 | 795 | Half width (870px) |
| Top Sidebar | 969 | 194 | 870 | 386 | (795 - 22) ÷ 2 |
| Bottom Sidebar | 969 | 602 | 870 | 387 | 194 + 386 + 22 |

### Sidebar + Content Layout (Adjusted Split)
```
┌─────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ TITLE (y=91, height=80)                                          │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│         ↓ 23px gap                                                       │
│  ┌──────────┐ 18px  ┌───────────────────────────────────────────────┐   │
│  │ SIDEBAR  │ gap   │ MAIN CONTENT                                  │   │
│  │ (x=81)   │       │ (x=486)                                       │   │
│  │ w=387    │       │ w=1353                                        │   │
│  │ h=795    │       │ h=795                                         │   │
│  │          │       │                                               │   │
│  └──────────┘       └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

| Element | X | Y | Width | Height | Calculation |
|---------|---|---|-------|--------|-------------|
| Title | 81 | 91 | 1758 | 80 | Full width |
| Sidebar | 81 | 194 | 387 | 795 | Adjusted visual split |
| Main Content | 486 | 194 | 1353 | 795 | Adjusted visual split |

## Quick Reference (16:9)

```
Slide: 1920 × 1080px
Left margin: 81px
Right margin end: 1839px
Content width (full): 1758px
Column width (half): 870px
Column width (third): 574px
Column width (quarter): 435px
Column width (three-quarter): 1305px
Gutter width: 18px
Title Y: 91px
Element height: 80px
Gap Title→Content: 23px
Gap Subtitle→Content: 22px
Stacked element gap: 22px
```

---

# 📄 A4 LANDSCAPE (297×210mm / ~1122×794px)

## Grid Overview

### Slide Dimensions
- **Width**: 297mm (~1122px at 96 DPI)
- **Height**: 210mm (~794px at 96 DPI)
- **Aspect Ratio**: 1.414:1 (A4)
- **Conversion**: 1mm ≈ 3.78px

### Margin System (Proportional to 16:9)
| Edge | Position (px) | Position (mm) | Description |
|------|--------------|---------------|-------------|
| Left margin | 47px | 12.5mm | Content starts here |
| Right margin | 1075px | 284.5mm | Content ends here |
| Top margin | 67px | 17.7mm | Content-top guide |
| Bottom margin | 727px | 192.3mm | Content-bottom guide |

### Content Area
- **Content width**: 1028px / 272mm
- **Content height**: 660px / 174.6mm

## Column System (Two-Column Layouts)

| Column | X Position (px) | X Position (mm) | Width (px) | Width (mm) |
|--------|----------------|-----------------|------------|------------|
| Left column | 47px | 12.5mm | 509px | 134.7mm |
| Gutter | 556px | 147.2mm | 10px | 2.6mm |
| Right column | 566px | 149.8mm | 509px | 134.7mm |

### Gutter (Center Gap)
- **Gutter start**: 556px / 147.2mm
- **Gutter end**: 566px / 149.8mm
- **Gutter width**: 10px / 2.6mm

## Vertical Spacing & Gaps

### Element Heights
| Element | Height (px) | Height (mm) |
|---------|------------|-------------|
| Title placeholder | 59px | 15.6mm |
| Subtitle/Header placeholder | 59px | 15.6mm |
| Body text variable | Fills remaining space | - |

### Gap Specifications

| Gap Type | Gap Size (px) | Gap Size (mm) |
|----------|--------------|---------------|
| Title → Content/Subtitle | **17px** | 4.5mm |
| Subtitle → Content | **16px** | 4.2mm |

## Standard Layout Positions (A4 Landscape)

### Title + Content Layout
| Element | X (px) | Y (px) | Width (px) | Height (px) |
|---------|--------|--------|------------|-------------|
| Title | 47 | 67 | 1028 | 59 |
| Content | 47 | 143 | 1028 | 584 |

### Two Content Layout
| Element | X (px) | Y (px) | Width (px) | Height (px) |
|---------|--------|--------|------------|-------------|
| Title | 47 | 67 | 1028 | 59 |
| Left Content | 47 | 143 | 509 | 584 |
| Right Content | 566 | 143 | 509 | 584 |

### Comparison Layout
| Element | X (px) | Y (px) | Width (px) | Height (px) |
|---------|--------|--------|------------|-------------|
| Title | 47 | 67 | 1028 | 59 |
| Left Subtitle | 47 | 143 | 509 | 59 |
| Right Subtitle | 566 | 143 | 509 | 59 |
| Left Content | 47 | 218 | 509 | 509 |
| Right Content | 566 | 218 | 509 | 509 |

## Quick Reference (A4 Landscape)

```
Slide: 297 × 210mm (~1122 × 794px)
Left margin: 47px / 12.5mm
Right margin end: 1075px / 284.5mm
Content width (full): 1028px / 272mm
Column width: 509px / 134.7mm
Gutter width: 10px / 2.6mm
Title Y: 67px / 17.7mm
Element height: 59px / 15.6mm
Gap Title→Content: 17px / 4.5mm
Gap Subtitle→Content: 16px / 4.2mm
```

---

# 🔧 Conversion & Scaling Guide

## Converting Between 16:9 and A4

The A4 values are proportionally scaled from 16:9 using these scale factors:

```
Width scale:  1122 / 1920 = 0.584
Height scale: 794 / 1080 = 0.735
Average scale: 0.66 (use for elements like gaps and heights)
```

### Conversion Formulas

```
A4 X position = 16:9 X position × 0.584
A4 Y position = 16:9 Y position × 0.735
A4 Width = 16:9 Width × 0.584
A4 Height = 16:9 Height × 0.735
A4 Gap = 16:9 Gap × 0.735
```

---

# 📊 CBRE 24-Column Grid System

Both slide sizes use CBRE's 24-column proportional grid:

## Grid Ratios

| Element | Ratio Value | Description |
|---------|------------|-------------|
| Column width | 3.8 units | Content column |
| Gutter width | 1 unit | Space between columns |
| Header height | 0.98 units | Top zone |
| Row height | 1.14 units | Content row |
| Row gutter | 0.3 units | Vertical spacing |

## Grid Calculation

**Vertical (24 columns + 23 gutters):**
```
Total ratio units = 24 × 3.8 + 23 × 1 = 91.2 + 23 = 114.2 units
Gutter size = slide_width / 114.2
Column size = gutter × 3.8
```

**Horizontal (header + 9 rows + footer):**
```
Total ratio units = 0.98 + 0.3 + (9 × 1.14) + (8 × 0.3) + 0.3 + 0.98 = 15.22 units
Row unit = slide_height / 15.22
Header = 0.98 × row_unit
Row = 1.14 × row_unit
Row gutter = 0.3 × row_unit
```

---

# 📝 Creating New Layouts

## Universal Rules (Both Sizes)

1. **Title starts at content-top margin** (91px for 16:9, 67px for A4)
2. **Element heights are consistent** (80px for 16:9, 59px for A4)
3. **Gap after title to content/subtitle** (23px for 16:9, 17px for A4)
4. **Gap after subtitle to content** (22px for 16:9, 16px for A4)
5. **Left edge aligns to left margin** (81px for 16:9, 47px for A4)
6. **Two-column layouts use center gutter**
7. **Text boxes should have zero insets** (`lIns="0" tIns="0" rIns="0" bIns="0"`)

## Size-Specific Values

| Property | 16:9 (1920×1080) | A4 (1122×794) |
|----------|-----------------|---------------|
| Left margin | 81px | 47px |
| Right edge | 1839px | 1075px |
| Full width | 1758px | 1028px |
| Column width | 870px | 509px |
| Gutter width | 18px | 10px |
| Title Y | 91px | 67px |
| Element height | 80px | 59px |
| Gap Title→Next | 23px | 17px |
| Gap Subtitle→Content | 22px | 16px |

---

# 🎨 Guide Positions Summary

## 16:9 Guides
| Guide | Position | Type |
|-------|----------|------|
| Left margin | 81px | Vertical |
| Left gutter | 951px | Vertical |
| Center | 960px | Vertical |
| Right gutter | 969px | Vertical |
| Right margin | 1839px | Vertical |
| Header bottom | 70px | Horizontal |
| Content top | 91px | Horizontal |
| Center | 540px | Horizontal |
| Content bottom | 989px | Horizontal |

## A4 Landscape Guides
| Guide | Position (px) | Position (mm) | Type |
|-------|--------------|---------------|------|
| Left margin | 47px | 12.5mm | Vertical |
| Left gutter | 556px | 147.2mm | Vertical |
| Center | 561px | 148.5mm | Vertical |
| Right gutter | 566px | 149.8mm | Vertical |
| Right margin | 1075px | 284.5mm | Vertical |
| Header bottom | 51px | 13.5mm | Horizontal |
| Content top | 67px | 17.7mm | Horizontal |
| Center | 397px | 105mm | Horizontal |
| Content bottom | 727px | 192.3mm | Horizontal |

---

*Document generated for CBRE PowerPoint Theme Builder*
*Last updated: December 2024*
