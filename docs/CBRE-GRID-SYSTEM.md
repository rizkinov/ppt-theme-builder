# CBRE Official Grid System - Layout Development Guide

> **Purpose**: This document provides exact specifications for creating PowerPoint slide layouts that align 100% with the CBRE grid system. Use these values to ensure all placeholders align precisely with grid guides.

---

## 📐 Slide Dimensions (16:9 Format)

| Property | Value |
|----------|-------|
| **Width** | 1920 px |
| **Height** | 1080 px |
| **Aspect Ratio** | 16:9 |

---

## 📊 EXACT Grid Guide Positions

### Vertical Guides (X-axis) - 48 positions

These are the **exact pixel positions** of all vertical guides from left to right:

```
0, 64, 80, 144, 160, 226, 242, 306, 322, 388, 402, 468,
484, 548, 564, 630, 644, 710, 726, 790, 806, 872, 888, 952,
968, 1032, 1048, 1114, 1130, 1194, 1210, 1274, 1290, 1356,
1372, 1436, 1452, 1516, 1532, 1598, 1614, 1678, 1694, 1758,
1774, 1840, 1856, 1920
```

### Horizontal Guides (Y-axis) - 24 positions

These are the **exact pixel positions** of all horizontal guides from top to bottom:

```
0, 56, 72, 138, 154, 236, 252, 334, 350, 434, 450, 532,
548, 630, 646, 730, 746, 828, 844, 926, 942, 1008, 1024, 1080
```

---

## 📏 Content Area Boundaries

| Property | X Position | Width |
|----------|------------|-------|
| **Content Start (Left)** | 80 | - |
| **Content End (Right)** | 1840 | - |
| **Content Width** | - | 1760 px |

| Property | Y Position | Height |
|----------|------------|--------|
| **Content Start (Top)** | 72 | - |
| **Content End (Bottom)** | 1008 | - |
| **Content Height** | - | 936 px |

---

## 📊 Column Reference Table (22 Columns)

Each column has a **start** and **end** position. Content should align to these.

| Column | Start (px) | End (px) | Width (px) |
|--------|------------|----------|------------|
| 1 | 80 | 144 | 64 |
| 2 | 160 | 226 | 66 |
| 3 | 242 | 306 | 64 |
| 4 | 322 | 388 | 66 |
| 5 | 402 | 468 | 66 |
| 6 | 484 | 548 | 64 |
| 7 | 564 | 630 | 66 |
| 8 | 644 | 710 | 66 |
| 9 | 726 | 790 | 64 |
| 10 | 806 | 872 | 66 |
| 11 | 888 | 952 | 64 |
| 12 | 968 | 1032 | 64 |
| 13 | 1048 | 1114 | 66 |
| 14 | 1130 | 1194 | 64 |
| 15 | 1210 | 1274 | 64 |
| 16 | 1290 | 1356 | 66 |
| 17 | 1372 | 1436 | 64 |
| 18 | 1452 | 1516 | 64 |
| 19 | 1532 | 1598 | 66 |
| 20 | 1614 | 1678 | 64 |
| 21 | 1694 | 1758 | 64 |
| 22 | 1774 | 1840 | 66 |

---

## 📊 Row Reference Table (10 Content Rows)

Each row has a **start** and **end** position. Content should align to these.

| Row | Start (px) | End (px) | Height (px) |
|-----|------------|----------|-------------|
| 1 | 72 | 138 | 66 |
| 2 | 154 | 236 | 82 |
| 3 | 252 | 334 | 82 |
| 4 | 350 | 434 | 84 |
| 5 | 450 | 532 | 82 |
| 6 | 548 | 630 | 82 |
| 7 | 646 | 730 | 84 |
| 8 | 746 | 828 | 82 |
| 9 | 844 | 926 | 82 |
| 10 | 942 | 1008 | 66 |

---

## 🔧 Common Layout Configurations

### Full-Width Content (Columns 1-22)
```javascript
x: 80,      // Col 1 start
width: 1760 // 1840 - 80
```

### Half-Width Left (Columns 1-11)
```javascript
x: 80,      // Col 1 start
width: 872  // 952 - 80
```

### Half-Width Right (Columns 12-22)
```javascript
x: 968,     // Col 12 start
width: 872  // 1840 - 968
```

### Three Columns (7-7-8 Split)
```javascript
// Left column (Cols 1-7)
x: 80, width: 550        // 630 - 80

// Center column (Cols 8-14)
x: 644, width: 550       // 1194 - 644

// Right column (Cols 15-22)
x: 1210, width: 630      // 1840 - 1210
```

### Sidebar + Content (5 cols + 17 cols)
```javascript
// Sidebar (Cols 1-5)
x: 80, width: 388        // 468 - 80

// Main content (Cols 6-22)
x: 484, width: 1356      // 1840 - 484
```

---

## 🎯 Standard Layout Positions

### Title Area (Rows 1-2)
```javascript
y: 72,         // Row 1 start
height: 164    // 236 - 72 (Row 2 end - Row 1 start)
```

### Content Area (Rows 3-10)
```javascript
y: 252,        // Row 3 start
height: 756    // 1008 - 252 (Row 10 end - Row 3 start)
```

### Title Slide - Centered Title (Rows 4-5)
```javascript
y: 350,        // Row 4 start
height: 182    // 532 - 350 (Row 5 end - Row 4 start)
```

### Title Slide - Centered Subtitle (Rows 6-7)
```javascript
y: 548,        // Row 6 start
height: 182    // 730 - 548 (Row 7 end - Row 6 start)
```

### Section Header - Centered (Rows 5-7)
```javascript
y: 450,        // Row 5 start
height: 280    // 730 - 450 (Row 7 end - Row 5 start)
```

### Stacked Content Split (Rows 3-6 / Rows 7-10)
```javascript
// Top box (Rows 3-6)
y: 252,        // Row 3 start
height: 378    // 630 - 252 (Row 6 end - Row 3 start)

// Bottom box (Rows 7-10)
y: 646,        // Row 7 start
height: 362    // 1008 - 646 (Row 10 end - Row 7 start)
```

---

## 🧮 How to Calculate Layout Positions

### Rule 1: Always use exact guide positions
Never calculate intermediate positions. Always snap to the exact pixel values from the guide tables above.

### Rule 2: Position = Start of first element
```javascript
x = Column[first].start
y = Row[first].start
```

### Rule 3: Size = End of last element - Start of first element
```javascript
width = Column[last].end - Column[first].start
height = Row[last].end - Row[first].start
```

### Example: Create a placeholder spanning Columns 3-8, Rows 4-6
```javascript
// From column table: Col 3 starts at 242, Col 8 ends at 710
// From row table: Row 4 starts at 350, Row 6 ends at 630
{
  x: 242,           // Col 3 start
  y: 350,           // Row 4 start
  width: 468,       // 710 - 242 (Col 8 end - Col 3 start)
  height: 280       // 630 - 350 (Row 6 end - Row 4 start)
}
```

---

## 📝 Code Implementation Reference

### In `defaults.ts` (Web Preview)
```javascript
const GRID = {
  // Content boundaries
  CONTENT_X: 80,
  CONTENT_END_X: 1840,
  CONTENT_WIDTH: 1760,
  
  // Row positions (start of each row)
  ROW_Y: [72, 154, 252, 350, 450, 548, 646, 746, 844, 942],
  // Row end positions
  ROW_END: [138, 236, 334, 434, 532, 630, 730, 828, 926, 1008],
  // Row heights
  ROW_H: [66, 82, 82, 84, 82, 82, 84, 82, 82, 66],
  
  // Half-width layouts
  HALF_WIDTH: 872,        // 952 - 80
  HALF_RIGHT_START: 968,  // Col 12 start
};
```

### In `slide-layout-generator.ts` (OOXML Export)
```javascript
const CBRE_GRID = {
  CONTENT_X: 80,
  CONTENT_END_X: 1840,
  CONTENT_WIDTH: 1760,
  
  ROW_Y: [72, 154, 252, 350, 450, 548, 646, 746, 844, 942],
  ROW_END: [138, 236, 334, 434, 532, 630, 730, 828, 926, 1008],
  ROW_H: [66, 82, 82, 84, 82, 82, 84, 82, 82, 66],
  
  TITLE_Y: 72,
  TITLE_HEIGHT: 164,      // 236 - 72
  CONTENT_Y: 252,
  CONTENT_HEIGHT: 756,    // 1008 - 252
  
  HALF_WIDTH: 872,
  HALF_RIGHT_X: 968,
  
  // Three-column positions
  THREE_COL_LEFT_WIDTH: 550,
  THREE_COL_CENTER_X: 644,
  THREE_COL_CENTER_WIDTH: 550,
  THREE_COL_RIGHT_X: 1210,
  THREE_COL_RIGHT_WIDTH: 630,
};
```

---

## ✅ Alignment Checklist

When creating a new layout, verify:

- [ ] X position matches a column **start** value from the column table
- [ ] Y position matches a row **start** value from the row table
- [ ] Width equals (last column **end**) - (first column **start**)
- [ ] Height equals (last row **end**) - (first row **start**)
- [ ] Values are added to BOTH `defaults.ts` AND `slide-layout-generator.ts`
- [ ] Web preview and PowerPoint export match exactly

---

## 📚 Existing Layout Examples

### Title + Content Layout
```javascript
// Title: Rows 1-2, Full width
{ x: 80, y: 72, width: 1760, height: 164 }

// Content: Rows 3-10, Full width
{ x: 80, y: 252, width: 1760, height: 756 }
```

### Two Content Layout
```javascript
// Title: Rows 1-2, Full width
{ x: 80, y: 72, width: 1760, height: 164 }

// Left content: Rows 3-10, Cols 1-11
{ x: 80, y: 252, width: 872, height: 756 }

// Right content: Rows 3-10, Cols 12-22
{ x: 968, y: 252, width: 872, height: 756 }
```

### Content + Stacked Sidebar Layout
```javascript
// Title: Rows 1-2, Full width
{ x: 80, y: 72, width: 1760, height: 164 }

// Left content: Rows 3-10, Cols 1-11
{ x: 80, y: 252, width: 872, height: 756 }

// Right top: Rows 3-6, Cols 12-22
{ x: 968, y: 252, width: 872, height: 378 }

// Right bottom: Rows 7-10, Cols 12-22
{ x: 968, y: 646, width: 872, height: 362 }
```

---

*Document updated: December 2024*
*Based on official CBRE PPT.pptx template guides*
