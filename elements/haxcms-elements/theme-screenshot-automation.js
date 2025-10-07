#!/usr/bin/env node

/**
 * HAX Theme Screenshot Automation
 * 
 * This script automates the process of taking screenshots of all available HAX themes
 * by using the HAXCMS.setTheme() method and Puppeteer via MCP integration.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load themes configuration
const themesConfigPath = path.join(__dirname, 'lib', 'themes.json');
const themesConfig = JSON.parse(fs.readFileSync(themesConfigPath, 'utf8'));

// Screenshot configuration
const SCREENSHOT_CONFIG = {
  width: 1280,
  height: 800,
  baseUrl: 'http://localhost:8000/elements/haxcms-elements/demo/',
  outputDir: path.join(__dirname, 'lib', 'theme-screenshots'),
  delay: 3000 // Wait time after theme change for rendering
};

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_CONFIG.outputDir)) {
  fs.mkdirSync(SCREENSHOT_CONFIG.outputDir, { recursive: true });
}

/**
 * Instructions for MCP Puppeteer automation
 * 
 * This script provides the data and instructions needed to automate
 * theme screenshots using the MCP Puppeteer tools in the AI agent.
 */

class ThemeScreenshotAutomation {
  
  static getThemesList() {
    return Object.keys(themesConfig);
  }
  
  static getThemeConfig(themeKey) {
    return themesConfig[themeKey];
  }
  
  static getAllThemes() {
    return themesConfig;
  }
  
  static getScreenshotConfig() {
    return SCREENSHOT_CONFIG;
  }
  
  /**
   * Generate the JavaScript code to execute in the browser for each theme
   */
  static generateThemeSwitchCode(themeElement) {
    return `
      // Switch to theme: ${themeElement}
      console.log('Switching to theme: ${themeElement}');
      
      if (typeof HAXCMS !== 'undefined' && HAXCMS.setTheme) {
        HAXCMS.setTheme('${themeElement}');
        console.log('Theme set to: ${themeElement}');
        
        // Wait for theme to load and render
        setTimeout(() => {
          console.log('Theme ${themeElement} should be fully loaded');
        }, ${SCREENSHOT_CONFIG.delay});
        
        return 'Theme switch initiated for ${themeElement}';
      } else {
        console.error('HAXCMS.setTheme not available');
        return 'Error: HAXCMS.setTheme not available';
      }
    `;
  }
  
  /**
   * Update themes.json with new screenshot timestamp
   */
  static updateThemeScreenshot(themeKey) {
    if (themesConfig[themeKey]) {
      themesConfig[themeKey].screenshotGenerated = new Date().toISOString();
      fs.writeFileSync(themesConfigPath, JSON.stringify(themesConfig, null, 2));
      console.log(`Updated screenshot timestamp for ${themeKey}`);
    }
  }
  
  /**
   * Generate automation instructions for the AI agent
   */
  static getAutomationInstructions() {
    const themes = this.getThemesList();
    
    return {
      totalThemes: themes.length,
      themes: themes,
      config: SCREENSHOT_CONFIG,
      instructions: `
        Automation Instructions for MCP Puppeteer:
        
        1. Navigate to: ${SCREENSHOT_CONFIG.baseUrl}
        2. Wait for HAXCMS to load completely
        3. For each theme in the themes array:
           a. Execute theme switch JavaScript code
           b. Wait ${SCREENSHOT_CONFIG.delay}ms for rendering
           c. Take screenshot at ${SCREENSHOT_CONFIG.width}x${SCREENSHOT_CONFIG.height}
           d. Save as theme-screenshots/{theme-element}.png
        
        Themes to process: ${themes.length} total
        ${themes.map((theme, i) => `${i+1}. ${theme}`).join('\n        ')}
      `
    };
  }
}

// Export for use in automation
if (import.meta.url === `file://${process.argv[1]}`) {
  // Command line usage
  const instructions = ThemeScreenshotAutomation.getAutomationInstructions();
  console.log(instructions.instructions);
  console.log('\nTheme list:', instructions.themes);
  console.log('\nTotal themes to process:', instructions.totalThemes);
}

// ES module export
export default ThemeScreenshotAutomation;
