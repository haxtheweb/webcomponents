#!/usr/bin/env node

/**
 * HAX Elements Discovery Script
 * 
 * This script discovers ALL HAX-capable elements by looking for:
 * 1. Files that contain haxProperties methods
 * 2. setHaxProperties calls with element tag names
 * 3. Extracting titles from gizmo definitions where available
 * 
 * The output format is: { "element-tag": "Human Readable Title" }
 * 
 * The script will output to hax-elements-registry.json
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import globCallback from 'glob';
const glob = promisify(globCallback);

/**
 * Extract element name from file content using various methods
 */
function extractElementName(content, filename) {
  // Look for static get tag() methods FIRST (most reliable)
  const tagMatch = content.match(/static\s+get\s+tag\(\)\s*{\s*return\s+['"`]([a-z-]+)['"`]/);
  if (tagMatch) {
    return tagMatch[1];
  }
  
  // Look for customElements.define calls with string literals
  const defineMatch = content.match(/customElements\.define\(['"`]([a-z-]+)['"`]/);
  if (defineMatch) {
    return defineMatch[1];
  }
  
  // Look for customElements.define with .tag reference
  const defineTagMatch = content.match(/customElements\.define\([^,]+\.tag/);
  if (defineTagMatch) {
    const tagStatements = /static\s+get\s+tag\(\)\s*{\s*return\s+['"`]([a-z-]+)['"`]/.exec(content);
    if (tagStatements) {
      return tagStatements[1];
    }
  }

  // Look for customElements.define with .is reference (Polymer legacy)
  const defineIsMatch = content.match(/customElements\.define\([^,]+\.is/);
  if (defineIsMatch) {
    const isStatements = /static\s+get\s+is\(\)\s*{\s*return\s+['"`]([a-z-]+)['"`]/.exec(content);
    if (isStatements) {
      return isStatements[1];
    }
  }

  // Polymer legacy format
  const polymerLegacy = /is\s*:\s*['"`]([a-z-]+)['"`]/.exec(content);
  if (polymerLegacy) {
    return polymerLegacy[1];
  }
  
  // Fallback to filename
  const baseName = path.basename(filename, '.js');
  return baseName;
}

/**
 * Extract title from gizmo object in haxProperties or setHaxProperties calls
 */
function extractTitleFromGizmo(content, fallbackName) {
  // Try to find gizmo title in various formats
  const gizmoTitleMatches = [
    /gizmo\s*:\s*{[^}]*title\s*:\s*['"`]([^'"`]+)['"`]/s,
    /title\s*:\s*['"`]([^'"`]+)['"`][^}]*gizmo/s,
    /['"`]title['"`]\s*:\s*['"`]([^'"`]+)['"`]/s
  ];
  
  for (const regex of gizmoTitleMatches) {
    const match = content.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // Generate title from element name as fallback
  return generateTitle(fallbackName);
}

/**
 * Extract all setHaxProperties calls and their element names
 */
function extractSetHaxPropertiesElements(content) {
  const elements = [];
  
  // Match setHaxProperties calls: setHaxProperties(schema, "element-name"...)
  const setHaxMatches = content.matchAll(/(?:this\.)?(?:HAXWiring\.)?setHaxProperties\s*\([^,]+,\s*['"`]([a-z-]+)['"`]/g);
  
  for (const match of setHaxMatches) {
    if (match[1]) {
      elements.push(match[1]);
    }
  }
  
  return elements;
}

/**
 * Extract human-readable title from element name
 */
function generateTitle(elementName) {
  return elementName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Check if file contains haxProperties or setHaxProperties
 */
function hasHaxSchema(content) {
  return content.includes('haxProperties') || content.includes('setHaxProperties');
}

/**
 * Check if element should be skipped
 */
function shouldSkipElement(elementName, filePath) {
  // Skip if no element name or doesn't look like a custom element
  if (!elementName || !elementName.includes('-')) {
    return true;
  }
  
  // Exclude specific element names (base classes, utilities, etc.)
  const excludedNames = [
    'hax-body-behaviors', // Behavior mixin
    'simple-colors-shared-styles', // Shared styles
    'custom.es6'
  ];
  
  if (excludedNames.includes(elementName)) {
    return true;
  }
  
  // Exclude test files
  if (filePath.includes('.test') || elementName.includes('.test')) {
    return true;
  }
  
  // Exclude demo files
  if (filePath.includes('/demo/')) {
    return true;
  }
  
  return false;
}

/**
 * Extract HTML primitives from hax-store.js _buildPrimitiveDefinitions method
 */
function extractHtmlPrimitivesFromHaxStore() {
  const primitives = {};
  
  try {
    // Read the hax-store.js file to extract primitive definitions
    const haxStoreContent = fs.readFileSync('./elements/hax-body/lib/hax-store.js', 'utf8');
    
    // Extract setHaxProperties calls for HTML primitives
    const primitiveMatches = [
      // Direct setHaxProperties calls with gizmo titles
      ...haxStoreContent.matchAll(/this\.setHaxProperties\([^,]*gizmo\s*:\s*{[^}]*title\s*:\s*['"](.*?)['"][^}]*}[^,]*,\s*['"](\w+)['"]\)/gs),
    ];
    
    for (const match of primitiveMatches) {
      const title = match[1];
      const tag = match[2];
      if (tag && title && ['img', 'figure', 'figcaption', 'mark', 'abbr', 'a', 'p', 'table', 'iframe', 'hr'].includes(tag)) {
        primitives[tag] = title;
      }
    }
    
    // Extract from __primsBuilder object for other HTML tags
    const primsBuilderMatch = haxStoreContent.match(/this\.__primsBuilder\s*=\s*{([\s\S]*?)};/s);
    if (primsBuilderMatch) {
      const primsContent = primsBuilderMatch[1];
      // Extract individual primitive definitions
      const primMatches = primsContent.matchAll(/(\w+)\s*:\s*{[^}]*title\s*:\s*['"](.*?)['"][^}]*}/gs);
      
      for (const match of primMatches) {
        const tag = match[1];
        const title = match[2];
        if (tag && title) {
          primitives[tag] = title;
        }
      }
    }
    
    console.log(`📝 Extracted ${Object.keys(primitives).length} HTML primitives from hax-store.js`);
    return primitives;
    
  } catch (error) {
    console.warn('⚠️ Could not extract primitives from hax-store.js, using fallback list');
    // Fallback list of common HTML primitives
    return {
      'p': 'Paragraph',
      'h1': 'Heading 1', 
      'h2': 'Heading 2',
      'h3': 'Heading 3', 
      'h4': 'Heading 4',
      'h5': 'Heading 5',
      'h6': 'Heading 6',
      'img': 'Image',
      'figure': 'Figure',
      'figcaption': 'Figure Caption',
      'table': 'Table',
      'blockquote': 'Block Quote',
      'ol': 'Numbered List',
      'ul': 'Bulleted List', 
      'li': 'List Item',
      'a': 'Link',
      'mark': 'Highlight',
      'abbr': 'Abbreviation',
      'hr': 'Horizontal Line',
      'iframe': 'Embedded Frame',
      'div': 'Division',
      'span': 'Span',
      'strong': 'Bold',
      'em': 'Emphasis',
      'b': 'Bold',
      'i': 'Italic',
      'u': 'Underline',
      'strike': 'Cross Out',
      'sub': 'Subscript',
      'sup': 'Superscript',
      'section': 'Section',
      'dl': 'Data List',
      'dt': 'Data Term',
      'dd': 'Data Definition',
      'code': 'Code',
      'pre': 'Preformatted Text',
      'kbd': 'Keyboard Input',
      'cite': 'Citation',
      'time': 'Time'
    };
  }
}

/**
 * Main HAX elements discovery function
 */
async function discoverHaxElements() {
  console.log('🔍 Discovering ALL HAX-capable elements...');
  
  const haxElements = {};
  
  // First, add HTML primitives from hax-store.js
  console.log('📝 Adding HTML primitives from HAX core...');
  const htmlPrimitives = extractHtmlPrimitivesFromHaxStore();
  Object.assign(haxElements, htmlPrimitives);
  console.log(`✅ Added ${Object.keys(htmlPrimitives).length} HTML primitives`);
  
  
  try {
    // Find all JavaScript files in elements directory
    const files = await glob('./elements/**/*.js', { 
      ignore: [
        './elements/**/demo/**',
        './elements/**/test/**', 
        './elements/**/node_modules/**',
        './elements/**/*.test.js',
        './elements/**/*.min.js'
      ]
    });
    
    console.log(`📁 Scanning ${files.length} JavaScript files for HAX schema definitions...`);
    
    let elementsFound = 0;
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check if this file contains HAX schema definitions
        if (hasHaxSchema(content)) {
          const elementsInFile = new Set();
          
          // Method 1: Look for elements with haxProperties methods
          if (content.includes('haxProperties')) {
            const elementName = extractElementName(content, file);
            if (elementName && !shouldSkipElement(elementName, file)) {
              const title = extractTitleFromGizmo(content, elementName);
              elementsInFile.add({ name: elementName, title: title });
            }
          }
          
          // Method 2: Look for setHaxProperties calls
          if (content.includes('setHaxProperties')) {
            const setHaxElements = extractSetHaxPropertiesElements(content);
            for (const elementName of setHaxElements) {
              if (elementName && !shouldSkipElement(elementName, file)) {
                const title = extractTitleFromGizmo(content, elementName);
                elementsInFile.add({ name: elementName, title: title });
              }
            }
          }
          
          // Add all found elements to our registry
          for (const element of elementsInFile) {
            if (!haxElements[element.name]) {
              haxElements[element.name] = element.title;
              elementsFound++;
              console.log(`✅ Found HAX element: ${element.name} -> "${element.title}" (${file})`);
            }
          }
        }
      } catch (error) {
        console.warn(`⚠️  Error processing file ${file}: ${error.message}`);
      }
    }
    
    console.log(`🎨 Discovered ${elementsFound} elements with HAX schema definitions`);
    console.log(`📊 Total HAX-capable elements: ${Object.keys(haxElements).length}`);
    
    // Sort elements alphabetically by element name
    const sortedElements = Object.keys(haxElements)
      .sort((a, b) => a.localeCompare(b))
      .reduce((sorted, key) => {
        sorted[key] = haxElements[key];
        return sorted;
      }, {});
    
    // Write hax-elements-registry.json file
    const outputPath = './hax-elements-registry.json';
    fs.writeFileSync(outputPath, JSON.stringify(sortedElements, null, 2));
    
    console.log(`📄 HAX elements registry written to: ${outputPath}`);
    
    // Also write to dist for local development
    const distPath = './dist/hax-elements-registry.json';
    try {
      fs.writeFileSync(distPath, JSON.stringify(sortedElements, null, 2));
      console.log(`📄 Registry also written to: ${distPath}`);
    } catch (error) {
      console.warn(`⚠️  Could not write to dist: ${error.message}`);
    }
    
    // Write to haxcms-elements for theme support
    const haxcmsPath = './elements/haxcms-elements/lib/hax-elements-registry.json';
    try {
      fs.writeFileSync(haxcmsPath, JSON.stringify(sortedElements, null, 2));
      console.log(`📄 Registry also written to: ${haxcmsPath}`);
    } catch (error) {
      console.warn(`⚠️  Could not write to haxcms-elements: ${error.message}`);
    }
    
    console.log('🎉 HAX elements discovery completed successfully!');
    
    return sortedElements;
    
  } catch (error) {
    console.error('❌ Error during HAX elements discovery:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  discoverHaxElements().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export default discoverHaxElements;