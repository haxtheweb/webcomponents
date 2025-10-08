#!/usr/bin/env node

/**
 * HAX Theme Screenshot Generator & Registry Updater
 * 
 * This script automatically:
 * 1. Generates screenshots for all available HAX themes
 * 2. Updates themes.json with correct screenshot paths
 * 3. Creates a complete theme registry for the v2 use-cases system
 * 
 * Screenshots are stored relative to themes.json for registry consistency
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration - all paths relative to themes.json location
const THEMES_JSON_PATH = join(__dirname, 'elements/haxcms-elements/lib/themes.json');
const THEMES_JSON_DIR = dirname(THEMES_JSON_PATH);
const SCREENSHOTS_DIR = join(THEMES_JSON_DIR, 'theme-screenshots'); // Store screenshots next to themes.json
const DEMO_URL = 'http://localhost:8080'; // Assumes local server running
const WAIT_TIME_MS = 3000; // Time to wait for theme to load
const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 800;

// Create screenshots directory if it doesn't exist
if (!existsSync(SCREENSHOTS_DIR)) {
  mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Load existing themes.json
const themes = JSON.parse(readFileSync(THEMES_JSON_PATH, 'utf8'));
const themeNames = Object.keys(themes);

console.log(`Found ${themeNames.length} themes to process...`);

/**
 * Generate updated themes.json with screenshot paths
 */
function updateThemesWithScreenshots() {
  const updatedThemes = { ...themes };
  
  for (const [themeKey, themeData] of Object.entries(updatedThemes)) {
    // Create screenshot filename based on theme element name
    const screenshotFileName = `${themeData.element}.jpg`;
    const screenshotPath = join(SCREENSHOTS_DIR, screenshotFileName);
    
    // Update thumbnail path to point to screenshot (relative to themes.json)
    const relativePath = relative(THEMES_JSON_DIR, screenshotPath);
    updatedThemes[themeKey] = {
      ...themeData,
      thumbnail: relativePath,
      screenshot: relativePath, // Also add dedicated screenshot field
      screenshotGenerated: new Date().toISOString() // Track when generated
    };
  }
  
  return updatedThemes;
}

/**
 * Save updated themes.json
 */
function saveUpdatedThemes(updatedThemes) {
  writeFileSync(THEMES_JSON_PATH, JSON.stringify(updatedThemes, null, 2));
  console.log('Updated themes.json with screenshot paths');
}

/**
 * Theme screenshot configuration for MCP puppeteer automation
 */
export const themeScreenshotConfig = {
  themes: themes,
  themeNames: themeNames,
  demoUrl: DEMO_URL,
  screenshotsDir: SCREENSHOTS_DIR,
  waitTime: WAIT_TIME_MS,
  viewport: {
    width: VIEWPORT_WIDTH,
    height: VIEWPORT_HEIGHT
  },
  
  // Instructions for automation
  instructions: {
    setup: [
      "1. Start local server: cd elements/haxcms-elements/demo && python -m http.server 8080",
      "2. Use MCP puppeteer tools to automate screenshot generation"
    ],
    
    workflow: [
      "1. puppeteer_navigate to http://localhost:8080",
      "2. Wait for site to load",
      "3. For each theme:",
      "   a. puppeteer_evaluate: globalThis.HAXCMS.setTheme('theme-element-name')",
      "   b. Wait 3 seconds for theme to load", 
      "   c. puppeteer_screenshot with name 'theme-element-name.jpg'",
      "4. Run updateThemesWithScreenshots() to update themes.json"
    ]
  }
};

/**
 * Generate the automation commands for all themes
 */
function generateAutomationCommands() {
  const commands = [];
  
  for (const [themeKey, themeData] of Object.entries(themes)) {
    const screenshotName = `${themeData.element}.jpg`;
    const screenshotPath = join(SCREENSHOTS_DIR, screenshotName);
    
    commands.push({
      theme: themeKey,
      element: themeData.element,
      name: themeData.name,
      setThemeCommand: `globalThis.HAXCMS.setTheme('${themeData.element}')`,
      screenshotName: screenshotName,
      screenshotPath: screenshotPath,
      waitTime: WAIT_TIME_MS
    });
  }
  
  return commands;
}

// Export automation data
export const automationCommands = generateAutomationCommands();

// Generate and save updated themes.json immediately
const updatedThemes = updateThemesWithScreenshots();
saveUpdatedThemes(updatedThemes);

console.log('\n=== HAX Theme Screenshot Generator ===');
console.log(`Themes JSON: ${THEMES_JSON_PATH}`);
console.log(`Screenshots directory: ${SCREENSHOTS_DIR}`);
console.log(`Demo URL: ${DEMO_URL}`);
console.log(`\nTotal themes to process: ${themeNames.length}`);
console.log('\nNext steps:');
console.log('1. Start local server: cd elements/haxcms-elements/demo && python -m http.server 8080');
console.log('2. Use MCP puppeteer tools to generate screenshots');
console.log('\nAutomation commands generated and themes.json updated with paths.');

// Log sample themes for reference
console.log('\nSample themes:');
themeNames.slice(0, 5).forEach(name => {
  console.log(`  - ${name}: ${themes[name].name}`);
});
if (themeNames.length > 5) {
  console.log(`  ... and ${themeNames.length - 5} more`);
}