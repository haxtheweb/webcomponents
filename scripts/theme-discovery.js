#!/usr/bin/env node

/**
 * HAXcms Theme Discovery Script
 * 
 * This script discovers all HAXcms themes in the webcomponents repository
 * by looking for classes that extend HAXCMSLitElementTheme and generates
 * a theme registry JSON file compatible with the HAXcms-php themes.json format.
 * 
 * The script will output to elements/haxcms-elements/lib/themes.json
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import globCallback from 'glob';
const glob = promisify(globCallback);

// Available thumbnail placeholders - randomly selected for each theme
const THUMBNAIL_OPTIONS = [
  'build/es6/node_modules/@haxtheweb/app-hax/lib/assets/images/BlueStyle.svg',
  'build/es6/node_modules/@haxtheweb/app-hax/lib/assets/images/PartyStyle.svg',
  'build/es6/node_modules/@haxtheweb/app-hax/lib/assets/images/GreyStyle.svg'
];

/**
 * Extract the theme name from a filename or class name
 */
function extractThemeName(content, filename) {
  // Look for static get tag() methods FIRST (most reliable)
  const tagMatch = content.match(/static\s+get\s+tag\(\)\s*{\s*return\s+['"`]([a-z-]+)['"`]/);
  if (tagMatch) {
    return tagMatch[1];
  }
  
  // Look for customElements.define calls
  const defineMatch = content.match(/customElements\.define\(['"`]([a-z-]+)['"`]/);
  if (defineMatch) {
    return defineMatch[1];
  }
  
  // Look for explicit theme name in comments or JSDoc (less reliable)
  const nameMatch = content.match(/@element\s+([a-z-]+)/);
  if (nameMatch) {
    return nameMatch[1];
  }
  
  // Fallback to filename
  const baseName = path.basename(filename, '.js');
  return baseName;
}

/**
 * Extract display name from content or generate from element name
 */
function extractDisplayName(content, elementName) {
  // Look for JSDoc description or title
  const titleMatch = content.match(/@title\s+([^\n]+)/i);
  if (titleMatch) {
    return titleMatch[1].trim();
  }
  
  // Look for short description in comments (limit to reasonable length)
  const descMatch = content.match(/`([^`]{1,100}theme[^`]{0,20})`/i);
  if (descMatch) {
    return descMatch[1];
  }
  
  // Look for class name comments (with length limits)
  const classMatch = content.match(/\/\*\*\s*\n\s*\*\s*([^\n]{1,100})\s*\n/);
  if (classMatch && classMatch[1].toLowerCase().includes('theme')) {
    return classMatch[1];
  }
  
  // Generate Title Case from element name (dash-case to Title Case)
  // Example: "clean-portfolio-theme" -> "Clean Portfolio Theme"
  return elementName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get a random thumbnail from the available options
 */
function getRandomThumbnail() {
  const randomIndex = Math.floor(Math.random() * THUMBNAIL_OPTIONS.length);
  return THUMBNAIL_OPTIONS[randomIndex];
}

/**
 * Generate the NPM path for the theme
 */
function generateNpmPath(filePath, elementName) {
  // Convert file path to NPM path format
  const relativePath = filePath.replace('./elements/', '');
  const packageName = relativePath.split('/')[0];
  
  // Check if it's in a lib subdirectory
  if (relativePath.includes('/lib/')) {
    return `@haxtheweb/${packageName}/lib/${elementName}.js`;
  } else {
    return `@haxtheweb/${packageName}/${elementName}.js`;
  }
}

/**
 * Check if file contains HAXCMSLitElementTheme extension
 */
function isHAXcmsTheme(content) {
  return content.includes('HAXCMSLitElementTheme') || 
         content.includes('extends DDDSuper(HAXCMSLitElementTheme)') ||
         content.includes('extends HAXCMSLitElementTheme');
}

/**
 * Check if a theme should be skipped based on exclusion rules
 */
function shouldSkipTheme(elementName, filePath) {
  // Exclude specific theme names (not real themes or base classes)
  const excludedNames = [
    'AppHaxStore', 
    'custom.es6', 
    'custom-journey-theme',
    'HAXCMSLitElementTheme', // Base class, not a theme
    'haxcms-basic-theme', // Internal basic theme
    'haxcms-slide-theme', // Internal slide theme
    'haxcms-dev-theme', // Development theme
    'simple-colors-shared-styles' // Shared styles, not a theme
  ];
  if (excludedNames.includes(elementName)) {
    return true;
  }
  
  // Exclude themes with 'example' in the file path
  if (filePath.includes('example')) {
    return true;
  }
  
  return false;
}

/**
 * Main theme discovery function
 */
async function discoverThemes() {
  console.log('🔍 Discovering HAXcms themes...');
  
  const themes = {};
  
  try {
    // Find all JavaScript files in elements directory
    const files = await glob('./elements/**/*.js', { 
      ignore: [
        '**/demo/**',
        '**/test/**', 
        '**/node_modules/**',
        '**/lib/**/*.haxProperties.json'
      ]
    });
    
    console.log(`📁 Scanning ${files.length} JavaScript files...`);
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check if this file contains a HAXcms theme
        if (isHAXcmsTheme(content)) {
          const elementName = extractThemeName(content, file);
          
          // Skip excluded themes
          if (shouldSkipTheme(elementName, file)) {
            console.log(`⏭️  Skipping excluded theme: ${elementName}`);
            continue;
          }
          
          const displayName = extractDisplayName(content, elementName);
          const thumbnail = getRandomThumbnail();
          const npmPath = generateNpmPath(file, elementName);
          
          themes[elementName] = {
            element: elementName,
            path: npmPath,
            name: displayName,
            thumbnail: thumbnail
          };
          
          console.log(`✅ Found theme: ${elementName} (${displayName})`);
        }
      } catch (error) {
        console.warn(`⚠️  Error processing file ${file}: ${error.message}`);
      }
    }
    
    console.log(`🎨 Discovered ${Object.keys(themes).length} themes`);
    
    // Sort themes alphabetically by element name (case-insensitive)
    const sortedThemes = Object.keys(themes)
      .sort((a, b) => a.localeCompare(b))
      .reduce((sorted, key) => {
        sorted[key] = themes[key];
        return sorted;
      }, {});
    
    // Ensure output directory exists
    const outputDir = './elements/haxcms-elements/lib';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write themes.json file
    const outputPath = path.join(outputDir, 'themes.json');
    fs.writeFileSync(outputPath, JSON.stringify(sortedThemes, null, 2));
    
    console.log(`📄 Theme registry written to: ${outputPath}`);
    console.log('🎉 Theme discovery completed successfully!');
    
    return themes;
    
  } catch (error) {
    console.error('❌ Error during theme discovery:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  discoverThemes().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export default discoverThemes;
