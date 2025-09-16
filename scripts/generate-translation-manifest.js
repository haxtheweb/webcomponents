#!/usr/bin/env node

/**
 * Generate translation manifest by scanning all elements for translation files
 * This creates a registry of which components support which languages to prevent 404s
 */

const fs = require('fs');
const path = require('path');

function generateTranslationManifest() {
  const manifest = {};
  const elementsDir = path.join(__dirname, '..', 'elements');
  
  console.log('🔍 Scanning for translation files...');
  
  if (!fs.existsSync(elementsDir)) {
    console.error('❌ Elements directory not found:', elementsDir);
    return;
  }
  
  const elements = fs.readdirSync(elementsDir);
  let totalFiles = 0;
  let elementsWithTranslations = 0;
  const languageSet = new Set();
  
  elements.forEach(elementDir => {
    const elementPath = path.join(elementsDir, elementDir);
    
    // Skip if not a directory
    if (!fs.statSync(elementPath).isDirectory()) {
      return;
    }
    
    const localesPath = path.join(elementPath, 'locales');
    
    if (fs.existsSync(localesPath)) {
      const files = fs.readdirSync(localesPath);
      const translationFiles = files.filter(f => f.endsWith('.json'));
      
      if (translationFiles.length > 0) {
        elementsWithTranslations++;
        console.log(`  📁 ${elementDir}:`);
        
        // Group files by namespace
        const namespaces = {};
        
        translationFiles.forEach(file => {
          totalFiles++;
          // Parse filename: namespace.language.json
          const parts = file.split('.');
          if (parts.length >= 3) {
            const language = parts[parts.length - 2]; // second to last part
            const namespace = parts.slice(0, -2).join('.'); // everything before language and .json
            
            if (!namespaces[namespace]) {
              namespaces[namespace] = [];
            }
            namespaces[namespace].push(language);
            languageSet.add(language);
            console.log(`    📄 ${file} → ${namespace}:${language}`);
          }
        });
        
        // Add to manifest
        Object.keys(namespaces).forEach(namespace => {
          manifest[namespace] = [...new Set(namespaces[namespace])].sort();
        });
      }
    }
  });
  
  // Generate the manifest files
  const manifestDir = path.join(__dirname, '..', 'elements', 'i18n-manager', 'lib');
  const manifestPath = path.join(manifestDir, 'translation-manifest.json');
  
  // Ensure directory exists
  if (!fs.existsSync(manifestDir)) {
    fs.mkdirSync(manifestDir, { recursive: true });
  }
  
  const sortedLanguages = Array.from(languageSet).sort();
  
  // Create the JSON manifest
  const jsonManifest = {
    _meta: {
      generated: new Date().toISOString(),
      elementsScanned: elements.length,
      elementsWithTranslations: elementsWithTranslations,
      translationFilesFound: totalFiles,
      languagesSupported: sortedLanguages
    },
    manifest: manifest
  };
  
  // Write the JSON file
  fs.writeFileSync(manifestPath, JSON.stringify(jsonManifest, null, 2));
  
  console.log('\n✅ Translation manifest JSON generated successfully!');
  console.log(`   📍 Location: ${manifestPath}`);
  console.log(`   📊 Found ${Object.keys(manifest).length} namespaces with translations`);
  console.log(`   🌍 Languages found: ${sortedLanguages.join(', ')}`);
  
  // Show coverage stats
  console.log('\n📈 Translation Coverage:');
  Object.keys(manifest).forEach(namespace => {
    console.log(`   ${namespace}: ${manifest[namespace].length} languages [${manifest[namespace].join(', ')}]`);
  });
  
  // Show language popularity
  const languageCounts = {};
  Object.values(manifest).forEach(languages => {
    languages.forEach(lang => {
      languageCounts[lang] = (languageCounts[lang] || 0) + 1;
    });
  });
  
  const popularLanguages = Object.entries(languageCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
  
  console.log('\n🏆 Most supported languages:');
  popularLanguages.forEach(([lang, count]) => {
    const percentage = ((count / Object.keys(manifest).length) * 100).toFixed(1);
    console.log(`   ${lang}: ${count} components (${percentage}%)`);
  });
}

// Run the generator
if (require.main === module) {
  generateTranslationManifest();
}

module.exports = { generateTranslationManifest };