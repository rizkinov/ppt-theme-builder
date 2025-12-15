# **PRD: PowerPoint Template Builder Web App**

## **1. Overview**

A web application that allows users to **create and customize PowerPoint templates (.POTX)** with full control over:

* Theme colors
* Font schemes
* Master slide layouts
* Slide dimensions
* Grid/guides
* Typography and spacing styles

The system should generate a **fully functional .POTX file** packaged with optional **uploaded fonts** and installation instructions inside a `.zip`.

This tool bridges the gap between online visual theme builders (like Pitch.com or Gamma) and the PowerPoint master slide architecture (Office Open XML).

---

## **2. Goals**

* Enable non-technical users to visually design PowerPoint themes directly in the browser.
* Produce **brand-ready .POTX templates** that apply styles consistently in PowerPoint.
* Avoid font-embedding complexity by offering a **font bundle download** instead.
* Provide a scalable architecture for future features (shared libraries, versioning, team collaboration).

---

## **3. Core Features**

### **3.1. Theme Customization**

Users can define theme colors and fonts equivalent to PowerPoint’s internal theme scheme.

#### **Theme Colors**

* 12-color scheme:

  * Dark 1, Dark 2, Light 1, Light 2
  * Accent 1–6
  * Hyperlink, Followed Hyperlink
* Hex input, visual color picker, and accessibility (WCAG AA) contrast checker.
* Real-time preview.

#### **Font Scheme**

* Define **Heading** and **Body** fonts (Latin/EastAsian/Complex scripts).
* Supports **TTF/OTF uploads**.
* Font licensing validation via `fsType` in the OpenType name table.
* Automatic fallback suggestions (e.g., Noto Sans for missing CJK coverage).

#### **Typography Settings**

For each text level (Title, Headline, Subheadline, Paragraph, Small Text):

* Font size, weight, spacing, and case options.
* Letter spacing, line spacing, paragraph spacing, and uppercase toggle.
* Bullet style and color.

---

### **3.2. Master Slide & Layout Editor**

A simplified editor to visually arrange placeholders and define layouts.

#### **Supported Layout Types**

* Title Slide
* Title + Content
* Two-Content
* Comparison
* Section Header
* Blank
* Custom Layout (add/remove placeholders)

#### **Placeholder Properties**

* Type (Title, Body, Image, Chart, Table, etc.)
* Position (`x`, `y`)
* Dimensions (`cx`, `cy`)
* Layer order
* Editable name

#### **Guides / Grid System**

* Add horizontal/vertical guides.
* Adjustable in pixels or EMUs.
* Guides stored as `<p:sldGuideLst>` in the master.

#### **Slide Size**

* Presets: 16:9 (1920×1080), 4:3, A4
* Custom dimensions in inches or pixels.

---

### **3.3. Preview System**

#### **Mode 1 – Fast HTML Preview**

* CSS-rendered mockup (approximate PowerPoint style).
* Instant update for colors, fonts, and spacing.
* Used for UI responsiveness.

#### **Mode 2 – Server Render Preview (optional)**

* Server generates `.pptx` snapshot → rasterized to image via headless LibreOffice.
* Used for thumbnails or final previews.
* Not required for MVP.

---

### **3.4. Export System**

#### **Export Output**

* **`YourBrand.potx`** — fully functional PowerPoint template.
* **`fonts/`** — all user-uploaded fonts (.TTF/.OTF).
* **`manifest.json`** — metadata (colors, fonts, hashes).
* **`README.txt`** — OS-specific install guide.

#### **ZIP Package Structure**

```
/YourBrand.zip
  ├── YourBrand.potx
  ├── fonts/
  │   ├── Heading-Regular.otf
  │   ├── Body-Regular.otf
  ├── manifest.json
  └── README.txt
```

#### **manifest.json Example**

```json
{
  "template": "YourBrand.potx",
  "slideSize": "1920x1080",
  "themeColors": ["#000000", "#FFFFFF", "#..."],
  "fonts": {
    "headings": {
      "family": "Financier Display",
      "files": ["fonts/FinancierDisplay-Regular.otf"]
    },
    "body": {
      "family": "Calibre",
      "files": ["fonts/Calibre-Regular.otf", "fonts/Calibre-Bold.otf"]
    }
  },
  "hashes": {
    "FinancierDisplay-Regular.otf": "sha256-xxxx",
    "YourBrand.potx": "sha256-yyyy"
  }
}
```

#### **README.txt Example**

```
Install fonts FIRST, then open the template.

Windows:
1. Open the /fonts folder.
2. Right-click → Install for all users.
3. Restart PowerPoint.

macOS:
1. Double-click each font → Install in Font Book.
2. Restart PowerPoint.

Template:
Open YourBrand.potx and start a new presentation.
```

---

## **4. Technical Architecture**

### **Frontend**

* Framework: **Next.js 14 + React**
* Styling: **TailwindCSS + Shadcn/UI**
* State management: Zustand or Redux Toolkit
* Color preview: Live CSS rendering
* File upload: Dropzone with MIME validation
* Font metadata extraction: Browser-side via WASM (e.g., `fontkit` or `opentype.js`)

### **Backend**

* Language: **.NET 8**
* SDK: **Open XML SDK**
* Functions:

  * Parse and modify `.potx` parts:

    * `/ppt/theme/theme1.xml`
    * `/ppt/presentation.xml`
    * `/ppt/slideMasters/slideMasterN.xml`
    * `/ppt/slideLayouts/*.xml`
  * Apply user theme data to XML nodes:

    * `<a:clrScheme>`
    * `<a:fontScheme>`
    * `<p:txStyles>`
    * `<p:sldSz>`
    * `<p:sldGuideLst>`
  * Generate the `.potx` file.
  * Package with fonts + manifest + README into a `.zip`.

### **Storage**

* Temporary file storage (e.g., AWS S3 / Supabase storage)
* Auto-deletion policy: 48h
* Virus scanning for uploaded fonts

### **Security**

* Font license verification (via `fsType` in OpenType)
* Attestation checkbox: “I own or have rights to use these fonts.”
* MIME whitelist: `.ttf`, `.otf` only.
* SHA-256 hashing for integrity verification.

---

## **5. Data Model**

### **TemplateConfig Object**

```json
{
  "id": "uuid",
  "name": "YourBrand",
  "theme": {
    "colors": {
      "dark1": "#111111",
      "light1": "#FFFFFF",
      "accent1": "#4B7BEC"
    },
    "fonts": {
      "heading": "Financier Display",
      "body": "Calibre"
    }
  },
  "typography": {
    "title": { "size": 48, "weight": "Bold", "lineSpacing": 0.9 },
    "body": { "size": 18, "lineSpacing": 1.2 }
  },
  "slideSize": { "width": 1920, "height": 1080 },
  "guides": [
    { "orientation": "vertical", "position": 960 },
    { "orientation": "horizontal", "position": 540 }
  ],
  "layouts": [
    {
      "name": "Title Slide",
      "placeholders": [
        { "type": "title", "x": 200, "y": 200, "cx": 1500, "cy": 200 },
        { "type": "subtitle", "x": 200, "y": 400, "cx": 1500, "cy": 150 }
      ]
    }
  ]
}
```

---

## **6. MVP Scope**

| Feature                               | Included    |
| ------------------------------------- | ----------- |
| Theme colors (12 slots)               | ✅           |
| Font scheme (Heading/Body)            | ✅           |
| Typography (size, spacing)            | ✅           |
| Slide size presets                    | ✅           |
| Guides                                | ✅           |
| Basic layouts (Title, Content, Blank) | ✅           |
| Upload fonts (TTF/OTF)                | ✅           |
| Export .POTX + ZIP bundle             | ✅           |
| Live HTML preview                     | ✅           |
| Server rasterized preview             | ❌ (Phase 2) |
| Upload & edit existing .POTX          | ❌ (Phase 2) |

---

## **7. Future Enhancements**

* True **font embedding** inside `.potx` (license-permitting)
* Collaborative editing & version control
* Template library and public gallery
* Integration with Figma or Canva to import design tokens
* AI-based layout generation from content (text → layout)

---

## **8. Testing & Validation**

* Validate exported templates in **PowerPoint 365 (Windows & macOS)**.
* Check that:

  * Themes apply when creating new slides.
  * Color scheme and font scheme propagate.
  * No font substitution errors if fonts installed.
  * Guides visible in Master View.
  * Layout placeholders function as expected.

---

## **9. Success Metrics**

* Time-to-export under 5 seconds.
* 0 XML validation errors on Open XML schema check.
* 100% fidelity for color/font propagation.
* 0 font substitution warnings post-install.
* ≥90% user satisfaction for exported templates.
