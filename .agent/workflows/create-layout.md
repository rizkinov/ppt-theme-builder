---
description: How to create a new CBRE-aligned slide layout
---

# Creating New CBRE-Aligned Layouts

Follow these steps to create a new slide layout that aligns 100% with the CBRE grid system.

## Prerequisites

1. Read `/docs/CBRE-GRID-SYSTEM.md` to understand the grid system
2. Identify which rows and columns your layout elements should span

## Step 1: Define Layout Requirements

Determine for each placeholder:
- Which columns it spans (1-22)
- Which rows it spans (1-10)
- The placeholder type (title, subtitle, body)

## Step 2: Calculate Exact Positions

Using the reference tables in CBRE-GRID-SYSTEM.md:

```javascript
x = Column[first].start      // From column table
y = Row[first].start         // From row table
width = Column[last].end - Column[first].start
height = Row[last].end - Row[first].start
```

**Column Start/End Reference:**
- Col 1: 80-144, Col 2: 160-226, Col 3: 242-306, Col 4: 322-388
- Col 5: 402-468, Col 6: 484-548, Col 7: 564-630, Col 8: 644-710
- Col 9: 726-790, Col 10: 806-872, Col 11: 888-952, Col 12: 968-1032
- Col 13: 1048-1114, Col 14: 1130-1194, Col 15: 1210-1274, Col 16: 1290-1356
- Col 17: 1372-1436, Col 18: 1452-1516, Col 19: 1532-1598, Col 20: 1614-1678
- Col 21: 1694-1758, Col 22: 1774-1840

**Row Start/End Reference:**
- Row 1: 72-138, Row 2: 154-236, Row 3: 252-334, Row 4: 350-434
- Row 5: 450-532, Row 6: 548-630, Row 7: 646-730, Row 8: 746-828
- Row 9: 844-926, Row 10: 942-1008

## Step 3: Add to defaults.ts

Add the layout to `defaultLayoutTemplates` array in `/src/lib/builder/defaults.ts`:

```typescript
{
  id: 'your-layout-id',
  name: 'Your Layout Name',
  description: 'Description of the layout',
  placeholders: [
    {
      id: 'title',
      type: 'title',
      x: 80,           // Calculated X position
      y: 72,           // Calculated Y position
      width: 1760,     // Calculated width
      height: 164,     // Calculated height
    },
    // ... more placeholders
  ],
},
```

## Step 4: Add to slide-layout-generator.ts

1. Add layout type to `LayoutType` union in `/src/lib/builder/ooxml/slide-layout-generator.ts`
2. Add config to `LAYOUT_CONFIGS` array
3. Create generator function following existing patterns
4. Add case to switch statement in `generateSlideLayoutXml`

Example generator function:
```typescript
function generateYourLayout(slideSize: OOXMLSlideSize, config: LayoutConfig, typography: TypographyConfig, utils: FontUtils): string {
  const xScale = slideSize.cx / 1920;
  const yScale = slideSize.cy / 1080;

  // Calculate positions using CBRE_GRID constants
  const titleX = Math.round(CBRE_GRID.CONTENT_X * xScale);
  const titleY = Math.round(CBRE_GRID.TITLE_Y * yScale);
  // ... etc

  return `${xmlDeclaration()}<p:sldLayout>...</p:sldLayout>`;
}
```

## Step 5: Verify Alignment

1. Run the development server: `npm run dev`
2. Navigate to Preview page with guides enabled
3. Export template and open in PowerPoint
4. Verify all elements align with grid guides

## Common Calculations

| Layout Pattern | X | Width | Y | Height |
|----------------|---|-------|---|--------|
| Full width | 80 | 1760 | varies | varies |
| Left half (cols 1-11) | 80 | 872 | varies | varies |
| Right half (cols 12-22) | 968 | 872 | varies | varies |
| Title area (rows 1-2) | varies | varies | 72 | 164 |
| Content area (rows 3-10) | varies | varies | 252 | 756 |
