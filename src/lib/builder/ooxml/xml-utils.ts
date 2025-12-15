/**
 * XML utility functions for Office Open XML generation
 */

// Escape XML special characters
export function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Convert hex color to OOXML color format (RRGGBB without #)
export function hexToOOXMLColor(hex: string): string {
  return hex.replace('#', '').toUpperCase();
}

// Generate XML declaration
export function xmlDeclaration(): string {
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
}

// Common OOXML namespaces
export const NAMESPACES = {
  // Relationships
  relationships: 'http://schemas.openxmlformats.org/package/2006/relationships',
  
  // Content Types
  contentTypes: 'http://schemas.openxmlformats.org/package/2006/content-types',
  
  // PresentationML
  p: 'http://schemas.openxmlformats.org/presentationml/2006/main',
  
  // DrawingML
  a: 'http://schemas.openxmlformats.org/drawingml/2006/main',
  
  // Relationships in document
  r: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
  
  // Office relationships types
  relOfficeDoc: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
  relPackage: 'http://schemas.openxmlformats.org/package/2006/relationships',
  
  // Specific relationship types
  relPresentation: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument',
  relTheme: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme',
  relSlideMaster: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster',
  relSlideLayout: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout',
  relSlide: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide',
  
  // Extension namespaces
  p14: 'http://schemas.microsoft.com/office/powerpoint/2010/main',
  p15: 'http://schemas.microsoft.com/office/powerpoint/2012/main',
};

// Content type values
export const CONTENT_TYPES = {
  presentation: 'application/vnd.openxmlformats-officedocument.presentationml.template.main+xml',
  slideMaster: 'application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml',
  slideLayout: 'application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml',
  slide: 'application/vnd.openxmlformats-officedocument.presentationml.slide+xml',
  theme: 'application/vnd.openxmlformats-officedocument.theme+xml',
  presProps: 'application/vnd.openxmlformats-officedocument.presentationml.presProps+xml',
  viewProps: 'application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml',
  tableStyles: 'application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml',
};

