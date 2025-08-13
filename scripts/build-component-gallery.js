#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ELEMENTS_DIR = './elements';
const OUTPUT_FILE = './component-gallery.html';

function getComponentInfo() {
  const components = [];
  
  try {
    const elementDirs = fs.readdirSync(ELEMENTS_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const elementName of elementDirs) {
      const elementPath = path.join(ELEMENTS_DIR, elementName);
      const packageJsonPath = path.join(elementPath, 'package.json');
      const demoPath = path.join(elementPath, 'demo');
      const demoIndexPath = path.join(demoPath, 'index.html');

      if (fs.existsSync(packageJsonPath) && fs.existsSync(demoIndexPath)) {
        try {
          const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          const description = packageData.description || `${elementName} web component`;
          
          // Check for additional demo files
          const demoFiles = fs.existsSync(demoPath) 
            ? fs.readdirSync(demoPath).filter(file => file.endsWith('.html'))
            : ['index.html'];

          components.push({
            name: elementName,
            packageName: packageData.name,
            description,
            demoPath: `elements/${elementName}/demo/index.html`,
            additionalDemos: demoFiles.filter(f => f !== 'index.html').map(f => ({
              name: f.replace('.html', ''),
              path: `elements/${elementName}/demo/${f}`
            }))
          });
        } catch (err) {
          console.warn(`Warning: Could not parse ${packageJsonPath}`);
        }
      }
    }

    return components.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error('Error reading elements directory:', err);
    return [];
  }
}

function generateHTML(components) {
  const totalComponents = components.length;
  const categories = {};
  
  // Group by prefix for better organization
  components.forEach(comp => {
    const prefix = comp.name.split('-')[0];
    if (!categories[prefix]) categories[prefix] = [];
    categories[prefix].push(comp);
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HAX Web Components Gallery</title>
  <script type="module" src="./elements/d-d-d/d-d-d.js"></script>
  <style>
    /* Reset and base styles using DDD system */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      /* DDD Design System Variables */
      --ddd-font-primary: "Roboto", "Franklin Gothic Medium", Tahoma, sans-serif;
      --ddd-font-secondary: "Roboto Slab", serif;
      --ddd-font-navigation: "Roboto Condensed", sans-serif;
      
      --ddd-font-weight-regular: 400;
      --ddd-font-weight-medium: 500;
      --ddd-font-weight-bold: 700;
      
      --ddd-font-size-4xs: 16px;
      --ddd-font-size-3xs: 18px;
      --ddd-font-size-xxs: 20px;
      --ddd-font-size-xs: 22px;
      --ddd-font-size-s: 24px;
      --ddd-font-size-m: 32px;
      --ddd-font-size-l: 40px;
      --ddd-font-size-xl: 48px;
      
      --ddd-lh-140: 140%;
      --ddd-lh-150: 150%;
      
      --ddd-spacing-1: 4px;
      --ddd-spacing-2: 8px;
      --ddd-spacing-3: 12px;
      --ddd-spacing-4: 16px;
      --ddd-spacing-6: 24px;
      --ddd-spacing-8: 32px;
      --ddd-spacing-10: 40px;
      --ddd-spacing-12: 48px;
      
      --ddd-radius-xs: 4px;
      --ddd-radius-md: 8px;
      
      --ddd-border-xs: 1px solid #e8e8e8;
      --ddd-border-sm: 2px solid #e8e8e8;
      
      --ddd-boxShadow-sm: rgba(0, 3, 33, 0.063) 0px 4px 8px 0px;
      --ddd-boxShadow-md: rgba(0, 3, 33, 0.063) 0px 8px 16px 0px;
      
      /* DDD Color System */
      --ddd-theme-default-white: #ffffff;
      --ddd-theme-default-limestoneMaxLight: #f9f9f9;
      --ddd-theme-default-coalyGray: #3c3c3c;
      --ddd-theme-default-slateGray: #6c757d;
      --ddd-theme-default-nittanyNavy: #001e44;
      --ddd-theme-default-beaverBlue: #1e407c;
      --ddd-theme-default-keystoneYellow: #ffd100;
    }
    
    body {
      font-family: var(--ddd-font-primary);
      font-size: var(--ddd-font-size-3xs);
      font-weight: var(--ddd-font-weight-regular);
      line-height: var(--ddd-lh-150);
      color: var(--ddd-theme-default-coalyGray);
      background: var(--ddd-theme-default-limestoneMaxLight);
      margin: 0;
      padding: 0;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--ddd-spacing-8);
    }
    
    header {
      text-align: center;
      margin-bottom: var(--ddd-spacing-12);
      background: var(--ddd-theme-default-white);
      padding: var(--ddd-spacing-8);
      border-radius: var(--ddd-radius-md);
      box-shadow: var(--ddd-boxShadow-sm);
    }
    
    h1 {
      font-family: var(--ddd-font-secondary);
      font-size: var(--ddd-font-size-xl);
      font-weight: var(--ddd-font-weight-bold);
      color: var(--ddd-theme-default-nittanyNavy);
      margin-bottom: var(--ddd-spacing-2);
    }
    
    .stats {
      font-size: var(--ddd-font-size-xxs);
      color: var(--ddd-theme-default-slateGray);
      margin-bottom: var(--ddd-spacing-4);
    }
    
    .search-box {
      margin: var(--ddd-spacing-4) 0;
      padding: var(--ddd-spacing-3);
      width: 100%;
      max-width: 400px;
      border: var(--ddd-border-sm);
      border-radius: var(--ddd-radius-xs);
      font-family: var(--ddd-font-primary);
      font-size: var(--ddd-font-size-4xs);
      transition: border-color 0.2s ease;
    }
    
    .search-box:focus {
      outline: 2px solid var(--ddd-theme-default-keystoneYellow);
      outline-offset: 2px;
      border-color: var(--ddd-theme-default-beaverBlue);
    }
    
    .category {
      margin-bottom: var(--ddd-spacing-10);
    }
    
    .category-title {
      background: var(--ddd-theme-default-nittanyNavy);
      color: var(--ddd-theme-default-white);
      padding: var(--ddd-spacing-4);
      margin-bottom: var(--ddd-spacing-6);
      border-radius: var(--ddd-radius-xs);
      font-family: var(--ddd-font-navigation);
      font-size: var(--ddd-font-size-s);
      font-weight: var(--ddd-font-weight-bold);
      text-transform: uppercase;
    }
    
    .components-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: var(--ddd-spacing-6);
    }
    
    .component-card {
      background: var(--ddd-theme-default-white);
      border-radius: var(--ddd-radius-md);
      box-shadow: var(--ddd-boxShadow-sm);
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      border: var(--ddd-border-xs);
    }
    
    .component-card:hover {
      transform: translateY(calc(-1 * var(--ddd-spacing-1)));
      box-shadow: var(--ddd-boxShadow-md);
      border-color: var(--ddd-theme-default-beaverBlue);
    }
    
    .component-header {
      padding: var(--ddd-spacing-6);
      border-bottom: var(--ddd-border-xs);
    }
    
    .component-name {
      font-family: var(--ddd-font-secondary);
      font-size: var(--ddd-font-size-xs);
      font-weight: var(--ddd-font-weight-bold);
      color: var(--ddd-theme-default-nittanyNavy);
      margin-bottom: var(--ddd-spacing-2);
    }
    
    .component-description {
      color: var(--ddd-theme-default-slateGray);
      font-size: var(--ddd-font-size-4xs);
      line-height: var(--ddd-lh-140);
    }
    
    .component-actions {
      padding: var(--ddd-spacing-4);
      display: flex;
      gap: var(--ddd-spacing-2);
      flex-wrap: wrap;
    }
    
    .demo-link {
      display: inline-block;
      padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
      background: var(--ddd-theme-default-beaverBlue);
      color: var(--ddd-theme-default-white);
      text-decoration: none;
      border-radius: var(--ddd-radius-xs);
      font-family: var(--ddd-font-primary);
      font-size: var(--ddd-font-size-4xs);
      font-weight: var(--ddd-font-weight-medium);
      transition: background-color 0.2s ease;
      border: none;
      cursor: pointer;
    }
    
    .demo-link:hover {
      background: var(--ddd-theme-default-nittanyNavy);
    }
    
    .demo-link:focus {
      outline: 2px solid var(--ddd-theme-default-keystoneYellow);
      outline-offset: 2px;
    }
    
    .demo-link.secondary {
      background: var(--ddd-theme-default-slateGray);
    }
    
    .demo-link.secondary:hover {
      background: var(--ddd-theme-default-coalyGray);
    }
    
    .hidden {
      display: none;
    }
    
    .no-results {
      text-align: center;
      padding: var(--ddd-spacing-10);
      color: var(--ddd-theme-default-slateGray);
    }
    
    .no-results h3 {
      font-family: var(--ddd-font-secondary);
      font-size: var(--ddd-font-size-m);
      margin-bottom: var(--ddd-spacing-2);
      color: var(--ddd-theme-default-nittanyNavy);
    }
    
    /* Mobile responsive using DDD spacing */
    @media (max-width: 768px) {
      .container {
        padding: var(--ddd-spacing-4);
      }
      
      .components-grid {
        grid-template-columns: 1fr;
      }
      
      h1 {
        font-size: var(--ddd-font-size-l);
      }
      
      .category-title {
        font-size: var(--ddd-font-size-xs);
        padding: var(--ddd-spacing-3);
      }
    }
  </style>
</head>
<body>
  <d-d-d></d-d-d>
  
  <div class="container">
    <header>
      <h1>HAX Web Components Gallery</h1>
      <div class="stats">${totalComponents} Components Available</div>
      <input type="text" 
             class="search-box" 
             placeholder="Search components..." 
             id="searchBox"
             aria-label="Search components">
    </header>
    
    <main id="componentsContainer">
      ${Object.entries(categories).map(([category, comps]) => `
        <section class="category" data-category="${category}">
          <h2 class="category-title">${category} Components (${comps.length})</h2>
          <div class="components-grid">
            ${comps.map(component => `
              <div class="component-card" data-name="${component.name.toLowerCase()}" data-description="${component.description.toLowerCase()}">
                <div class="component-header">
                  <div class="component-name">&lt;${component.name}&gt;</div>
                  <div class="component-description">${component.description}</div>
                </div>
                <div class="component-actions">
                  <a href="${component.demoPath}" 
                     target="_blank" 
                     class="demo-link"
                     rel="noopener noreferrer">
                    View Demo
                  </a>
                  ${component.additionalDemos.map(demo => `
                    <a href="${demo.path}" 
                       target="_blank" 
                       class="demo-link secondary"
                       rel="noopener noreferrer">
                      ${demo.name}
                    </a>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `).join('')}
    </main>
    
    <div class="no-results hidden" id="noResults">
      <h3>No components found</h3>
      <p>Try a different search term</p>
    </div>
  </div>

  <script>
    // Simple search functionality
    const searchBox = document.getElementById('searchBox');
    const container = document.getElementById('componentsContainer');
    const noResults = document.getElementById('noResults');
    
    function performSearch(query) {
      const cards = document.querySelectorAll('.component-card');
      const categories = document.querySelectorAll('.category');
      let hasVisibleResults = false;
      
      cards.forEach(card => {
        const name = card.dataset.name;
        const description = card.dataset.description;
        const matches = name.includes(query) || description.includes(query);
        
        card.classList.toggle('hidden', !matches);
        if (matches) hasVisibleResults = true;
      });
      
      // Show/hide categories based on visible cards
      categories.forEach(category => {
        const visibleCards = category.querySelectorAll('.component-card:not(.hidden)');
        category.classList.toggle('hidden', visibleCards.length === 0);
      });
      
      container.classList.toggle('hidden', !hasVisibleResults);
      noResults.classList.toggle('hidden', hasVisibleResults);
    }
    
    searchBox.addEventListener('input', (e) => {
      performSearch(e.target.value.toLowerCase());
    });

    // Add keyboard navigation
    searchBox.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchBox.value = '';
        performSearch('');
      }
    });
    
    // Add focus management for better accessibility
    searchBox.addEventListener('focus', () => {
      searchBox.select();
    });
  </script>
</body>
</html>`;
}

// Generate the gallery
console.log('🔍 Scanning components...');
const components = getComponentInfo();
console.log(`✅ Found ${components.length} components with demos`);

if (components.length === 0) {
  console.log('❌ No components found. Make sure you have elements with demo/index.html files.');
  process.exit(1);
}

const html = generateHTML(components);
fs.writeFileSync(OUTPUT_FILE, html);

console.log(`🎉 Component gallery generated: ${OUTPUT_FILE}`);
console.log(`🚀 Run 'yarn gallery' to serve it locally`);
