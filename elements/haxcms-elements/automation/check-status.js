#!/usr/bin/env node

/**
 * Quick Status Check for HAX Theme Screenshots
 * 
 * This script provides a quick overview of the screenshot generation status
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const screenshotDir = path.join(__dirname, '..', 'lib', 'theme-screenshots');
const themesConfigPath = path.join(__dirname, '..', 'lib', 'themes.json');

console.log('📊 HAX Theme Screenshot Status Check\n');

try {
  // Load themes configuration
  const themesConfig = JSON.parse(fs.readFileSync(themesConfigPath, 'utf8'));
  const themes = Object.keys(themesConfig);
  
  console.log(`Total themes: ${themes.length}\n`);
  
  let hasLarge = 0;
  let hasThumb = 0;
  let hasBoth = 0;
  let totalLargeSize = 0;
  let totalThumbSize = 0;
  
  themes.forEach(theme => {
    const largePath = path.join(screenshotDir, `${theme}.png`);
    const thumbPath = path.join(screenshotDir, `${theme}-thumb.png`);
    
    const largeExists = fs.existsSync(largePath);
    const thumbExists = fs.existsSync(thumbPath);
    
    if (largeExists) {
      hasLarge++;
      totalLargeSize += fs.statSync(largePath).size;
    }
    
    if (thumbExists) {
      hasThumb++;
      totalThumbSize += fs.statSync(thumbPath).size;
    }
    
    if (largeExists && thumbExists) {
      hasBoth++;
    }
  });
  
  console.log('Screenshot Coverage:');
  console.log(`✅ Themes with large screenshots: ${hasLarge}/${themes.length} (${Math.round((hasLarge/themes.length)*100)}%)`);
  console.log(`🔍 Themes with thumbnails: ${hasThumb}/${themes.length} (${Math.round((hasThumb/themes.length)*100)}%)`);
  console.log(`🎯 Themes with both sizes: ${hasBoth}/${themes.length} (${Math.round((hasBoth/themes.length)*100)}%)\n`);
  
  console.log('Storage Usage:');
  console.log(`📄 Large screenshots: ${(totalLargeSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📄 Thumbnails: ${(totalThumbSize / 1024).toFixed(2)} KB`);
  console.log(`📦 Total: ${((totalLargeSize + totalThumbSize) / 1024 / 1024).toFixed(2)} MB\n`);
  
  // Check for recent updates
  const recentThemes = themes.filter(theme => {
    const config = themesConfig[theme];
    if (config.screenshotGenerated) {
      const generated = new Date(config.screenshotGenerated);
      const now = new Date();
      const diffHours = (now - generated) / (1000 * 60 * 60);
      return diffHours < 24; // Updated in last 24 hours
    }
    return false;
  });
  
  if (recentThemes.length > 0) {
    console.log(`🆕 Recently updated (last 24h): ${recentThemes.length} themes`);
    recentThemes.slice(0, 5).forEach(theme => {
      const timestamp = new Date(themesConfig[theme].screenshotGenerated).toLocaleString();
      console.log(`   • ${theme} (${timestamp})`);
    });
    if (recentThemes.length > 5) {
      console.log(`   ... and ${recentThemes.length - 5} more`);
    }
  } else {
    console.log('⏰ No themes updated in the last 24 hours');
  }
  
  console.log('\n🚀 To regenerate all screenshots:');
  console.log('   npm run start');
  console.log('\n🐛 To test with first 3 themes:');
  console.log('   npm run debug');
  
} catch (error) {
  console.error('❌ Error checking status:', error.message);
  process.exit(1);
}