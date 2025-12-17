# CBRE Official Grid System

> Based on official CBRE PowerPoint template (Grid Guides Buddy)

---

## 📐 Slide Dimensions

| Size | Width | Height | Aspect Ratio |
|------|-------|--------|--------------|
| **Widescreen (16:9)** | 33.87 cm | 19.05 cm | 16:9 |
| Pixel equivalent | 1920 px | 1080 px | |

**Scale factor**: 56.68 px/cm

---

## 📊 Column Structure (24 total)

| Zone | Description | Width (cm) | Width (px) |
|------|-------------|------------|------------|
| Left Margin | Fixed margin | 1.4 cm | 79 px |
| Content Area | 22 columns + 21 gutters | 31.07 cm | 1762 px |
| Right Margin | Fixed margin | 1.4 cm | 79 px |
| **Total** | | **33.87 cm** | **1920 px** |

### Column Constants

| Element | cm | px |
|---------|-----|-----|
| **Column Width** | ~1.18 cm | 67 px |
| **Gutter Width** | ~0.24 cm | 13.714 px (288/21) |
| **Margin** | 1.4 cm | 79 px |

> **Note**: Gutter is calculated as 288/21 = 13.714px to achieve exactly 1920px total width.

---

## 📊 Row Structure (12 total)

| Row | Label | Height (cm) | Height (px) |
|-----|-------|-------------|-------------|
| 1 | Top Margin | 0.92 cm | 52 px |
| 2 | Row 1 | 1.21 cm | 69 px |
| 3 | Row 2 | 1.4 cm | 79 px |
| 4 | Row 3 | 1.5 cm | 85 px |
| 5 | Row 4 | 1.4 cm | 79 px |
| 6 | Row 5 | 1.4 cm | 79 px |
| 7 | Row 6 | 1.5 cm | 85 px |
| 8 | Row 7 | 1.4 cm | 79 px |
| 9 | Row 8 | 1.4 cm | 79 px |
| 10 | Row 9 | 1.5 cm | 85 px |
| 11 | Row 10 | 1.15 cm | 65 px |
| 12 | Bottom Margin | 1.02 cm | 58 px |

### Row Gutter

| Element | cm | px |
|---------|-----|-----|
| **Row Gutter** | 0.3 cm | 17 px |

---

## 🧮 Calculation Formulas

### For 16:9 Slides (1920×1080)

```javascript
// Margin constants
const MARGIN_LEFT_RIGHT = 79;   // 1.4 cm
const MARGIN_TOP = 52;          // 0.92 cm
const MARGIN_BOTTOM = 58;       // 1.02 cm

// Column constants (calculated for exact 1920px)
const COLUMN_WIDTH = 67;        // ~1.18 cm
const COL_GUTTER = 288 / 21;    // = 13.714px (exact)

// Row gutter
const ROW_GUTTER = 17;          // 0.3 cm

// Row heights (top to bottom, rows 1-10)
const ROW_HEIGHTS = [
  69,   // Row 1: 1.21 cm
  79,   // Row 2: 1.4 cm
  85,   // Row 3: 1.5 cm
  79,   // Row 4: 1.4 cm
  79,   // Row 5: 1.4 cm
  85,   // Row 6: 1.5 cm
  79,   // Row 7: 1.4 cm
  79,   // Row 8: 1.4 cm
  85,   // Row 9: 1.5 cm
  65,   // Row 10: 1.15 cm
];
```

---

## 📝 Gutter Rules

| Elements | Gutter Between? |
|----------|-----------------|
| Content Columns | ✅ Yes (21 gutters) |
| Left Margin ↔ First Column | ❌ No |
| Last Column ↔ Right Margin | ❌ No |
| All Rows | ✅ Yes (including margin rows) |

---

## ✅ Verification

**Total Width Check:**
```
79 + (22 × 67) + (21 × 13.714) + 79
= 79 + 1474 + 288 + 79
= 1920px ✓
```

---

*Document updated: December 2024*
*Based on official CBRE Grid Guides Buddy*
