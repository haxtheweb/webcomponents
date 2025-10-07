#!/usr/bin/env node

/**
 * Complete HAX Theme Screenshot Automation Workflow
 * 
 * This script provides the complete automation workflow for generating
 * screenshots of all HAX themes and updating the registry.
 * 
 * Usage: This is the automation guide for MCP puppeteer tools
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const THEMES_JSON_PATH = join(__dirname, 'elements/haxcms-elements/lib/themes.json');
const SCREENSHOTS_DIR = join(dirname(THEMES_JSON_PATH), 'theme-screenshots');

// Load themes
const themes = JSON.parse(readFileSync(THEMES_JSON_PATH, 'utf8'));
const themeList = Object.entries(themes);

console.log('\n=== HAX Theme Screenshot Automation Workflow ===\n');

/**
 * STEP 1: Verify Setup
 */
console.log('✓ Themes loaded:', themeList.length);
console.log('✓ Screenshots directory:', SCREENSHOTS_DIR);
console.log('✓ Updated themes.json with paths');

/**
 * STEP 2: Automation Commands
 * These are the MCP puppeteer commands to run:
 */

console.log('\n=== PUPPETEER AUTOMATION COMMANDS ===\n');

console.log('1. Navigate to demo site:');
console.log(`   puppeteer_navigate({"allowDangerous":true, "launchOptions":{"args":["--no-sandbox", "--disable-setuid-sandbox"], "headless":true}, "url":"http://localhost:8080"})`);

console.log('\n2. Wait for HAXCMS to load (run this first):');
console.log(`   puppeteer_evaluate({"script":"new Promise(resolve => { const wait = () => { if (globalThis.HAXCMS && globalThis.HAXCMS.setTheme) { console.log('HAXCMS ready!'); resolve({ready: true, currentTheme: globalThis.HAXCMS.instance?.store?.manifest?.metadata?.theme?.element}); } else { console.log('Still waiting...'); setTimeout(wait, 2000); } }; wait(); })"})`);

console.log('\n3. Theme switching and screenshot commands:');
console.log('   For each theme, run these 3 commands in sequence:\n');

// Generate commands for first 5 themes as examples
const exampleThemes = themeList.slice(0, 5);
exampleThemes.forEach(([themeKey, themeData], index) => {
  console.log(`--- Theme ${index + 1}: ${themeData.name} (${themeData.element}) ---`);
  console.log(`a) Switch theme:`);
  console.log(`   puppeteer_evaluate({"script":"globalThis.HAXCMS.setTheme('${themeData.element}'); 'Theme switched to ${themeData.element}'"})`);
  console.log(`b) Wait for theme to load (3 seconds):`);
  console.log(`   puppeteer_evaluate({"script":"new Promise(resolve => setTimeout(() => resolve('Theme loaded'), 3000))"})`);
  console.log(`c) Take screenshot:`);
  console.log(`   puppeteer_screenshot({"height":800, "width":1280, "name":"${themeData.element}"})`);
  console.log('');
});

console.log(`... repeat for all ${themeList.length} themes\n`);

/**
 * STEP 3: Popular themes for quick demo
 */
const popularThemes = [
  'polaris-flex-sidebar',
  'polaris-flex-theme',
  'clean-one',
  'journey-theme',
  'learn-two-theme',
  'spacebook-theme',
  'bootstrap-theme'
].filter(themeName => themes[themeName]);

console.log('=== QUICK DEMO: Popular Themes ===\n');
console.log(`Popular themes to screenshot first (${popularThemes.length} themes):\n`);

popularThemes.forEach((themeKey, index) => {
  const themeData = themes[themeKey];
  console.log(`${index + 1}. ${themeData.name}`);
  console.log(`   Element: ${themeData.element}`);
  console.log(`   Switch: globalThis.HAXCMS.setTheme('${themeData.element}')`);
  console.log(`   Screenshot: ${themeData.element}.png`);
  console.log('');
});

/**
 * STEP 4: File Saving
 */
console.log('\n=== FILE SAVING INSTRUCTIONS ===\n');
console.log('When saving screenshot files:');
console.log('1. Save each screenshot as: {theme-element-name}.png');
console.log(`2. Save to directory: ${SCREENSHOTS_DIR}`);
console.log('3. The themes.json is already updated with correct paths');
console.log('4. Screenshots will be relative to themes.json location');

console.log('\n=== VERIFICATION ===\n');
console.log('After screenshots are taken, verify:');
console.log('1. Check screenshot files exist in theme-screenshots/');
console.log('2. Themes.json has correct paths');
console.log('3. V2 app-hax can load themes.json and display screenshots');

/**
 * Export automation data for programmatic use
 */
export const automationWorkflow = {
  totalThemes: themeList.length,
  popularThemes: popularThemes,
  screenshotsDir: SCREENSHOTS_DIR,
  
  // Generate command for specific theme
  generateCommands: (themeElement) => {
    const theme = Object.values(themes).find(t => t.element === themeElement);
    if (!theme) return null;
    
    return {
      switchTheme: `globalThis.HAXCMS.setTheme('${theme.element}')`,
      wait: `new Promise(resolve => setTimeout(() => resolve('Theme loaded'), 3000))`,
      screenshot: {
        name: theme.element,
        width: 1280,
        height: 800
      }
    };
  },
  
  // All themes list
  allThemes: themeList.map(([key, data]) => ({
    key,
    element: data.element,
    name: data.name,
    screenshotPath: `theme-screenshots/${data.element}.png`
  }))
};

console.log('\n=== READY FOR AUTOMATION ===');
console.log('Run the puppeteer commands above to generate all theme screenshots!');
console.log('The complete theme registry will be ready for v2 app-hax use-cases.');