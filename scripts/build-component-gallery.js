#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ELEMENTS_DIR = './elements';
const OUTPUT_FILE = './component-gallery.html';
const WC_REGISTRY_FILE = './wc-registry.json';

// Function to extract HAX demo schema from component files
function extractHaxDemoSchema(elementPath, elementName) {
  const possibleFiles = [
    path.join(elementPath, `${elementName}.js`),
    path.join(elementPath, 'lib', `${elementName}.haxProperties.json`)
  ];

  for (const filePath of possibleFiles) {
    if (fs.existsSync(filePath)) {
      try {
        if (filePath.endsWith('.json')) {
          // Try to load from separate JSON file
          const haxPropsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          if (haxPropsData.demoSchema && Array.isArray(haxPropsData.demoSchema)) {
            return haxPropsData.demoSchema;
          }
        } else {
          // Try to extract from JS file
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const demoSchema = extractDemoSchemaFromJS(fileContent);
          if (demoSchema) {
            return demoSchema;
          }
        }
      } catch (err) {
        // Continue trying other files
        continue;
      }
    }
  }
  
  return null;
}

// Function to extract demoSchema from JavaScript source code
function extractDemoSchemaFromJS(jsContent) {
  try {
    // Look for a demoSchema array anywhere in the file. In practice this only
    // appears inside static haxProperties definitions.
    const demoSchemaMatch = jsContent.match(/demoSchema\s*:\s*\[([\s\S]*?)\]/m);
    if (demoSchemaMatch) {
      try {
        // Attempt to parse the demoSchema as a JSON-like structure
        const demoSchemaStr = '[' + demoSchemaMatch[1] + ']';
        // Clean up the JavaScript syntax to make it JSON-parseable
        const cleanedStr = demoSchemaStr
          .replace(/([{,])\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":') // Quote property names
          .replace(/'/g, '"') // Convert single quotes to double quotes
          .replace(/,\s*}/g, '}') // Remove trailing commas
          .replace(/,\s*]/g, ']'); // Remove trailing commas in arrays

        return JSON.parse(cleanedStr);
      } catch (parseErr) {
        // If parsing fails, return null
        return null;
      }
    }
  } catch (err) {
    // If anything fails, return null
    return null;
  }

  return null;
}

// Determine if an element is HAX-capable regardless of whether a demoSchema
// could be parsed. This looks for either a dedicated haxProperties JSON file
// or haxProperties / setHaxProperties usage in the main JS module.
function isElementHaxCapable(elementPath, elementName, haxDemoSchema) {
  // If we already have a demo schema, we know it is HAX-capable.
  if (haxDemoSchema && Array.isArray(haxDemoSchema) && haxDemoSchema.length > 0) {
    return true;
  }

  // Presence of a .haxProperties.json file implies HAX wiring exists.
  const haxJsonPath = path.join(elementPath, 'lib', `${elementName}.haxProperties.json`);
  if (fs.existsSync(haxJsonPath)) {
    return true;
  }

  // Look inside the main JS file for haxProperties / setHaxProperties.
  const jsPath = path.join(elementPath, `${elementName}.js`);
  if (fs.existsSync(jsPath)) {
    try {
      const jsContent = fs.readFileSync(jsPath, 'utf8');
      return /\bstatic\s+get\s+haxProperties\b/.test(jsContent) ||
             /\bhaxProperties\s*\(/.test(jsContent) ||
             /\bsetHaxProperties\s*\(/.test(jsContent);
    } catch (e) {
      return false;
    }
  }

  return false;
}

// Function to generate HTML for a component demo using HAX schema
function generateHaxDemoHTML(component) {
  if (!component.haxDemoSchema || !Array.isArray(component.haxDemoSchema) || component.haxDemoSchema.length === 0) {
    // Fallback to basic component if no HAX demo schema
    return `<${component.name}></${component.name}>`;
  }

  const demo = component.haxDemoSchema[0]; // Use first demo
  let html = `<${demo.tag || component.name}`;
  
  // Add properties as attributes
  if (demo.properties && typeof demo.properties === 'object') {
    for (const [key, value] of Object.entries(demo.properties)) {
      if (typeof value === 'string') {
        html += ` ${key}="${value.replace(/"/g, '&quot;')}"`;
      } else if (typeof value === 'boolean' && value) {
        html += ` ${key}`;
      } else if (typeof value === 'number') {
        html += ` ${key}="${value}"`;
      }
    }
  }
  
  html += '>';
  
  // Add content
  if (demo.content && typeof demo.content === 'string') {
    html += demo.content;
  }
  
  html += `</${demo.tag || component.name}>`;
  
  return html;
}

function getComponentInfo() {
  const components = [];
  let wcRegistry = {};
  
  // Load wc-registry.json for import paths
  try {
    if (fs.existsSync(WC_REGISTRY_FILE)) {
      wcRegistry = JSON.parse(fs.readFileSync(WC_REGISTRY_FILE, 'utf8'));
    }
  } catch (err) {
    console.warn('Warning: Could not load wc-registry.json');
  }
  
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
          const version = packageData.version || '1.0.0';
          
          // Get import path from wc-registry.json
          let importPath = wcRegistry[elementName];
          if (!importPath) {
            // Fallback to standard pattern
            importPath = `${packageData.name}/${elementName}.js`;
          }
          
          // Check for additional demo files
          const demoFiles = fs.existsSync(demoPath) 
            ? fs.readdirSync(demoPath).filter(file => file.endsWith('.html'))
            : ['index.html'];

          // Try to extract HAX demo schema from the main component file
          const haxDemoSchema = extractHaxDemoSchema(elementPath, elementName);
          const isHaxCapable = isElementHaxCapable(elementPath, elementName, haxDemoSchema);

          components.push({
            name: elementName,
            packageName: packageData.name,
            description,
            version,
            demoPath: `elements/${elementName}/demo/index.html`,
            importPath,
            haxDemoSchema,
            isHaxCapable,
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
  const componentsData = JSON.stringify(components, null, 2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HAX Web Components Gallery</title>
  <script type="module">
    // Import DDD styles and system
    import { DDDVariables, DDDGlobalStyles, DDDReset, DDDDataAttributes } from "./elements/d-d-d/lib/DDDStyles.js";
    import { css, html } from "lit";
    
    // Apply DDD styles to the document
    const dddStyles = document.createElement('style');
    dddStyles.textContent = \`
      \${DDDVariables.cssText}
      \${DDDGlobalStyles.cssText}
      \${DDDReset.cssText}
      \${DDDDataAttributes.map(attr => attr.cssText).join('')}
    \`;
    document.head.appendChild(dddStyles);
  </script>
  <script type="module" src="./elements/d-d-d/d-d-d.js"></script>
  <style>
    /* Gallery-specific styles using DDD variables */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: var(--ddd-font-primary);
      font-size: var(--ddd-font-size-3xs);
      font-weight: var(--ddd-font-weight-regular);
      line-height: var(--ddd-lh-150);
      color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white));
      background: light-dark(var(--ddd-theme-default-limestoneMaxLight), var(--ddd-theme-default-coalyGray));
      margin: 0;
      padding: 0;
      height: 100vh;
      overflow: hidden;
    }
    
    .gallery-container {
      display: flex;
      height: 100vh;
      background: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-potentialMidnight));
    }
    
    /* Sidebar Styles */
    .sidebar {
      width: 350px;
      background: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray));
      border-right: light-dark(var(--ddd-border-sm), 2px solid var(--ddd-theme-default-slateGray));
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .sidebar-header {
      padding: var(--ddd-spacing-4);
      border-bottom: light-dark(var(--ddd-border-xs), 1px solid var(--ddd-theme-default-slateGray));
      background: var(--ddd-theme-default-nittanyNavy);
      color: var(--ddd-theme-default-white);
    }
    
    .sidebar-header h1 {
      font-family: var(--ddd-font-secondary);
      font-size: var(--ddd-font-size-l);
      font-weight: var(--ddd-font-weight-bold);
      margin-bottom: var(--ddd-spacing-2);
    }
    
    .stats {
      font-size: var(--ddd-font-size-3xs);
      opacity: 0.9;
      margin-bottom: var(--ddd-spacing-4);
    }
    
    .search-box {
      width: 100%;
      padding: var(--ddd-spacing-3);
      border: light-dark(var(--ddd-border-xs), 1px solid var(--ddd-theme-default-slateGray));
      border-radius: var(--ddd-radius-xs);
      font-family: var(--ddd-font-primary);
      font-size: var(--ddd-font-size-3xs);
      background: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray));
      color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white));
    }
    
    .search-box:focus {
      outline: 2px solid var(--ddd-theme-default-keystoneYellow);
      outline-offset: 1px;
    }
    
    .search-box::placeholder {
      color: light-dark(var(--ddd-theme-default-slateGray), var(--ddd-theme-default-limestoneGray));
    }
    
    /* Filter buttons */
    .filter-buttons {
      display: flex;
      gap: var(--ddd-spacing-1);
      margin-bottom: var(--ddd-spacing-3);
      flex-wrap: wrap;
    }
    
    .filter-btn {
      padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
      border: 1px solid light-dark(var(--ddd-theme-default-slateGray), var(--ddd-theme-default-limestoneGray));
      border-radius: var(--ddd-radius-xs);
      background: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-potentialMidnight));
      color: light-dark(var(--ddd-theme-default-slateGray), var(--ddd-theme-default-limestoneGray));
      cursor: pointer;
      font-family: var(--ddd-font-primary);
      font-size: var(--ddd-font-size-4xs);
      font-weight: var(--ddd-font-weight-medium);
      transition: all 0.2s ease;
      flex: 1;
      min-width: 0;
      text-align: center;
    }
    
    .filter-btn:hover {
      background: light-dark(var(--ddd-theme-default-keystoneYellow), var(--ddd-theme-default-nittanyNavy));
      color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white));
      border-color: var(--ddd-theme-default-beaverBlue);
    }
    
    .filter-btn.active {
      background: var(--ddd-theme-default-beaverBlue);
      color: var(--ddd-theme-default-white);
      border-color: var(--ddd-theme-default-nittanyNavy);
    }
    
    /* HAX capability indicator */
    .hax-indicator {
      display: inline-block;
      margin-right: var(--ddd-spacing-1);
      font-size: var(--ddd-font-size-4xs);
      opacity: 0.8;
    }
    
    .component-list {
      flex: 1;
      overflow-y: auto;
      padding: var(--ddd-spacing-2);
      background: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-potentialMidnight));
    }
    
    .component-item {
      display: block;
      width: 100%;
      padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
      margin-bottom: var(--ddd-spacing-1);
      background: light-dark(var(--ddd-theme-default-limestoneMaxLight), var(--ddd-theme-default-coalyGray));
      border: light-dark(var(--ddd-border-xs), 1px solid var(--ddd-theme-default-slateGray));
      border-radius: var(--ddd-radius-xs);
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
      font-family: var(--ddd-font-primary);
      color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white));
    }
    
    .component-item:hover {
      background: light-dark(var(--ddd-theme-default-keystoneYellow), var(--ddd-theme-default-nittanyNavy));
      border-color: var(--ddd-theme-default-beaverBlue);
      color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white));
    }
    
    .component-item.active {
      background: var(--ddd-theme-default-beaverBlue);
      color: var(--ddd-theme-default-white);
      border-color: var(--ddd-theme-default-nittanyNavy);
    }
    
    .component-item-name {
      font-size: var(--ddd-font-size-3xs);
      font-weight: var(--ddd-font-weight-medium);
      margin-bottom: var(--ddd-spacing-1);
    }
    
    .component-item-description {
      font-size: var(--ddd-font-size-4xs);
      opacity: 0.8;
      line-height: var(--ddd-lh-140);
    }
    
    .component-item.active .component-item-description {
      opacity: 0.9;
    }
    
    /* Main content area */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .demo-header {
      padding: var(--ddd-spacing-4);
      background: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-potentialMidnight));
      border-bottom: light-dark(var(--ddd-border-xs), 1px solid var(--ddd-theme-default-slateGray));
    }
    
    .demo-title {
      font-family: var(--ddd-font-secondary);
      font-size: var(--ddd-font-size-m);
      font-weight: var(--ddd-font-weight-bold);
      color: light-dark(var(--ddd-theme-default-nittanyNavy), var(--ddd-theme-default-white));
      margin-bottom: var(--ddd-spacing-2);
    }
    
    .demo-description {
      color: light-dark(var(--ddd-theme-default-slateGray), var(--ddd-theme-default-limestoneGray));
      margin-bottom: var(--ddd-spacing-4);
    }
    
    .info-sections {
      display: flex;
      gap: var(--ddd-spacing-4);
      margin-bottom: var(--ddd-spacing-4);
    }
    
    .info-section {
      flex: 1;
    }
    
    .info-section summary {
      background: light-dark(var(--ddd-theme-default-limestoneMaxLight), var(--ddd-theme-default-coalyGray));
      padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
      border-radius: var(--ddd-radius-xs);
      cursor: pointer;
      font-weight: var(--ddd-font-weight-medium);
      border: light-dark(var(--ddd-border-xs), 1px solid var(--ddd-theme-default-slateGray));
      margin-bottom: var(--ddd-spacing-2);
      color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white));
    }
    
    .info-section[open] summary {
      background: var(--ddd-theme-default-beaverBlue);
      color: var(--ddd-theme-default-white);
      border-color: var(--ddd-theme-default-nittanyNavy);
    }
    
    .info-content {
      padding: var(--ddd-spacing-3);
      background: light-dark(var(--ddd-theme-default-limestoneMaxLight), var(--ddd-theme-default-potentialMidnight));
      border-radius: var(--ddd-radius-xs);
      border: light-dark(var(--ddd-border-xs), 1px solid var(--ddd-theme-default-slateGray));
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: var(--ddd-font-size-4xs);
      color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white));
    }
    
    .info-content pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      color: light-dark(var(--ddd-theme-default-potentialMidnight), var(--ddd-theme-default-coalyGray));
    }
    
    .demo-selector-container {
      display: flex;
      align-items: center;
      gap: var(--ddd-spacing-2);
      margin-bottom: var(--ddd-spacing-2);
    }

    .demo-selector-label {
      font-size: var(--ddd-font-size-4xs);
      color: light-dark(var(--ddd-theme-default-slateGray), var(--ddd-theme-default-limestoneGray));
      font-weight: var(--ddd-font-weight-medium);
    }

    .demo-selector {
      padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
      border-radius: var(--ddd-radius-xs);
      border: light-dark(var(--ddd-border-xs), 1px solid var(--ddd-theme-default-slateGray));
      background: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray));
      color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white));
      font-family: var(--ddd-font-primary);
      font-size: var(--ddd-font-size-4xs);
    }

    .demo-selector:focus {
      outline: 2px solid var(--ddd-theme-default-keystoneYellow);
      outline-offset: 1px;
    }

    .demo-actions {
      display: flex;
      gap: var(--ddd-spacing-2);
      margin-bottom: var(--ddd-spacing-4);
    }
    
    .btn {
      padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
      border: none;
      border-radius: var(--ddd-radius-xs);
      cursor: pointer;
      font-family: var(--ddd-font-primary);
      font-size: var(--ddd-font-size-3xs);
      font-weight: var(--ddd-font-weight-medium);
      text-decoration: none;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: var(--ddd-spacing-1);
    }
    
    .btn-primary {
      background: var(--ddd-theme-default-beaverBlue);
      color: var(--ddd-theme-default-white);
    }
    
    .btn-primary:hover {
      background: var(--ddd-theme-default-nittanyNavy);
    }
    
    .btn-secondary {
      background: var(--ddd-theme-default-slateGray);
      color: var(--ddd-theme-default-white);
    }
    
    .btn-secondary:hover {
      background: var(--ddd-theme-default-coalyGray);
    }
    
    .demo-frame-container {
      flex: 1;
      background: var(--ddd-theme-default-white);
      border-radius: var(--ddd-radius-md);
      overflow: hidden;
      margin: 0 var(--ddd-spacing-4) var(--ddd-spacing-4);
      border: var(--ddd-border-xs);
    }
    
    .demo-frame {
      width: 100%;
      height: 100%;
      border: none;
      background: var(--ddd-theme-default-white);
    }
    
    .welcome-message {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      color: var(--ddd-theme-default-slateGray);
      font-size: var(--ddd-font-size-s);
    }
    
    .hidden {
      display: none !important;
    }
    
    .no-results {
      padding: var(--ddd-spacing-6);
      text-align: center;
      color: var(--ddd-theme-default-slateGray);
    }
    
    .codepen-form {
      display: none;
    }
    
    /* Mobile responsive */
    @media (max-width: 768px) {
      .gallery-container {
        flex-direction: column;
      }
      
      .sidebar {
        width: 100%;
        max-height: 40vh;
      }
      
      .main-content {
        height: 60vh;
      }
      
      .info-sections {
        flex-direction: column;
      }
    }
  </style>
</head>
<body>
  <d-d-d></d-d-d>
  
  <div class="gallery-container">
    <!-- Sidebar with component list -->
    <div class="sidebar">
      <div class="sidebar-header">
        <h1>Web Components Gallery</h1>
        <div class="stats">${totalComponents} Components Available</div>
        
        <!-- Filter buttons -->
        <div class="filter-buttons">
          <button class="filter-btn active" data-filter="all" title="Show all components">
            🔍 All (${totalComponents})
          </button>
          <button class="filter-btn" data-filter="hax" title="Show only HAX-capable components">
            🧱 HAX (${components.filter(c => c.isHaxCapable).length})
          </button>
          <button class="filter-btn" data-filter="hax-ecosystem" title="Show HAX ecosystem components">
            ⚡ HAX-* (${components.filter(c => c.name.startsWith('hax-')).length})
          </button>
        </div>
        
        <input type="text" 
               class="search-box" 
               placeholder="Search components..." 
               id="searchBox"
               aria-label="Search components">
      </div>
      
      <div class="component-list" id="componentList">
        <!-- Components will be populated by JavaScript -->
      </div>
      
      <div class="no-results hidden" id="noResults">
        <p>No components found</p>
      </div>
    </div>
    
    <!-- Main content area -->
    <div class="main-content">
      <div class="demo-header hidden" id="demoHeader">
        <h2 class="demo-title" id="demoTitle">Component Demo</h2>
        <p class="demo-description" id="demoDescription">Select a component to view its demo and documentation</p>
        
        <div class="info-sections">
          <details class="info-section" id="installationSection">
            <summary>📦 Installation</summary>
            <div class="info-content">
              <pre id="installationCode">npm install @haxtheweb/example-element</pre>
            </div>
          </details>
          
          <details class="info-section" id="usageSection">
            <summary>💻 Usage</summary>
            <div class="info-content">
              <pre id="usageCode">import '@haxtheweb/example-element/example-element.js';</pre>
            </div>
          </details>
        </div>

        <div class="demo-selector-container hidden" id="demoSelectorContainer">
          <span class="demo-selector-label">Demo:</span>
          <select class="demo-selector" id="demoSelector" aria-label="Select demo variant"></select>
        </div>
        
        <div class="demo-actions">
          <button class="btn btn-primary" id="newTabBtn">
            🔗 Open in New Tab
          </button>
          <button class="btn btn-secondary" id="codepenBtn">
            ✏️ Try in CodePen
          </button>
          <button class="btn btn-secondary" id="fullscreenBtn">
            ⛶ Fullscreen
          </button>
        </div>
      </div>
      
      <div class="demo-frame-container">
        <div class="welcome-message" id="welcomeMessage">
          <div>
            <h3>Welcome to the HAX Web Components Gallery</h3>
            <p>Select a component from the sidebar to view its demo and documentation.</p>
          </div>
        </div>
        <iframe class="demo-frame hidden" id="demoFrame" title="Component Demo"></iframe>
      </div>
    </div>
  </div>
  
  <!-- Hidden CodePen form for posting -->
  <form class="codepen-form" id="codepenForm" action="https://codepen.io/pen/define" method="POST" target="_blank">
    <input type="hidden" name="data" id="codepenData">
  </form>

  <script>
    // Component data embedded from server
    const COMPONENTS = ${componentsData};
    let currentComponent = null;
    let filteredComponents = [...COMPONENTS];
    let currentFilter = 'all';
    
    // DOM elements
    const searchBox = document.getElementById('searchBox');
    const componentList = document.getElementById('componentList');
    const noResults = document.getElementById('noResults');
    const demoHeader = document.getElementById('demoHeader');
    const demoTitle = document.getElementById('demoTitle');
    const demoDescription = document.getElementById('demoDescription');
    const demoFrame = document.getElementById('demoFrame');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const installationCode = document.getElementById('installationCode');
    const usageCode = document.getElementById('usageCode');
    const demoSelectorContainer = document.getElementById('demoSelectorContainer');
    const demoSelector = document.getElementById('demoSelector');
    const newTabBtn = document.getElementById('newTabBtn');
    const codepenBtn = document.getElementById('codepenBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const codepenForm = document.getElementById('codepenForm');
    const codepenData = document.getElementById('codepenData');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let currentDemoPath = null;
    
    // Filter components based on current filter
    function filterComponents() {
      let components = [];
      
      switch (currentFilter) {
        case 'hax':
          components = COMPONENTS.filter(c => c.isHaxCapable);
          break;
        case 'hax-ecosystem':
          components = COMPONENTS.filter(c => c.name.startsWith('hax-'));
          break;
        case 'all':
        default:
          components = [...COMPONENTS];
          break;
      }
      
      // Apply search filter if there's a search query
      const query = searchBox.value.toLowerCase().trim();
      if (query) {
        components = components.filter(component => 
          component.name.toLowerCase().includes(query) ||
          component.description.toLowerCase().includes(query) ||
          component.packageName.toLowerCase().includes(query)
        );
      }
      
      return components;
    }
    
    // Helper to (re)build the demo selector for the current component
    function buildDemoSelector(component) {
      if (!demoSelectorContainer || !demoSelector) {
        return;
      }

      // Always include the main index demo first
      const demos = [
        {
          label: 'Main demo',
          value: component.demoPath
        }
      ];

      if (component.additionalDemos && component.additionalDemos.length > 0) {
        for (let i = 0; i < component.additionalDemos.length; i++) {
          const demo = component.additionalDemos[i];
          const label = demo && demo.name ? demo.name : 'Demo ' + (i + 2);
          demos.push({
            label: label,
            value: demo.path
          });
        }
      }

      if (demos.length <= 1) {
        demoSelectorContainer.classList.add('hidden');
        demoSelector.innerHTML = '';
        return;
      }

      demoSelectorContainer.classList.remove('hidden');
      demoSelector.innerHTML = '';

      for (let i = 0; i < demos.length; i++) {
        const option = document.createElement('option');
        option.value = demos[i].value;
        option.textContent = demos[i].label;
        if (i === 0) {
          option.selected = true;
        }
        demoSelector.appendChild(option);
      }
    }

    // Render component list
    function renderComponentList() {
      filteredComponents = filterComponents();
      componentList.innerHTML = '';
      
      if (filteredComponents.length === 0) {
        noResults.classList.remove('hidden');
        return;
      }
      
      noResults.classList.add('hidden');
      
      filteredComponents.forEach(component => {
        const item = document.createElement('button');
        item.className = 'component-item';
        item.dataset.componentName = component.name;
        
        // Add HAX indicator if component is HAX-capable
        const haxIndicator = component.isHaxCapable
          ? '<span class="hax-indicator" title="HAX-capable component">🧱</span>' 
          : '';
        
        item.innerHTML = \`
          <div class="component-item-name">\${haxIndicator}&lt;\${component.name}&gt;</div>
          <div class="component-item-description">\${component.description}</div>
        \`;
        
        item.addEventListener('click', () => selectComponent(component));
        componentList.appendChild(item);
      });
    }
    
    // Select and display a component
    function selectComponent(component) {
      currentComponent = component;
      currentDemoPath = component.demoPath;
      
      // Update active state
      document.querySelectorAll('.component-item').forEach(item => {
        item.classList.toggle('active', item.dataset.componentName === component.name);
      });
      
      // Update header and info
      demoTitle.textContent = \`<\${component.name}>\`;
      demoDescription.textContent = component.description;
      installationCode.textContent = \`npm install \${component.packageName}\`;
      usageCode.textContent = \`import '\${component.importPath}';\`;
      
      // Build / update demo selector
      buildDemoSelector(component);

      // Show demo header and hide welcome
      demoHeader.classList.remove('hidden');
      welcomeMessage.classList.add('hidden');
      demoFrame.classList.remove('hidden');
      
      // Load selected demo in iframe
      demoFrame.src = currentDemoPath;
    }
    
    // Search functionality
    function performSearch() {
      renderComponentList();
    }
    
    // Set active filter
    function setActiveFilter(filter) {
      currentFilter = filter;
      
      // Update filter button states
      filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
      });
      
      renderComponentList();
    }
    
    // Event listeners
    searchBox.addEventListener('input', performSearch);
    
    searchBox.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchBox.value = '';
        performSearch();
      }
    });
    
    if (demoSelector) {
      demoSelector.addEventListener('change', function () {
        if (!currentComponent) {
          return;
        }
        currentDemoPath = demoSelector.value || currentComponent.demoPath;
        demoFrame.src = currentDemoPath;
      });
    }
    
    // Filter button event listeners
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        setActiveFilter(btn.dataset.filter);
      });
    });
    
    newTabBtn.addEventListener('click', () => {
      if (currentDemoPath) {
        globalThis.open(currentDemoPath, '_blank');
      }
    });
    
    fullscreenBtn.addEventListener('click', () => {
      if (demoFrame.requestFullscreen) {
        demoFrame.requestFullscreen();
      }
    });
    
    codepenBtn.addEventListener('click', () => {
      if (!currentComponent) return;
      
      // Generate HTML based on HAX demo schema if available
      let componentHTML = generateHaxDemoHTML(currentComponent);
      
      // Create CodePen data
      const codepenPayload = {
        title: currentComponent.name + ' Demo',
        description: currentComponent.description + (currentComponent.haxDemoSchema ? ' (HAX Enhanced)' : ''),
        html: '<script type="module" src="https://cdn.hax.cloud/cdn/build/es6/node_modules/' + currentComponent.importPath + '?module"><\\/script>\\n' +
              '<style>\\nbody { font-family: Arial, sans-serif; padding: 20px; }\\n</style>\\n\\n' +
              componentHTML,
        css: '/* Add your custom styles here */',
        js: '/* Add your custom JavaScript here */',
        editors: '100'
      };
      
      codepenData.value = JSON.stringify(codepenPayload);
      codepenForm.submit();
    });
    
    // Function to generate HTML for HAX demo (used by CodePen)
    function generateHaxDemoHTML(component) {
      if (!component.haxDemoSchema || !Array.isArray(component.haxDemoSchema) || component.haxDemoSchema.length === 0) {
        // Fallback to basic component if no HAX demo schema
        return '<' + component.name + '></' + component.name + '>';
      }

      const demo = component.haxDemoSchema[0]; // Use first demo
      let html = '<' + (demo.tag || component.name);
      
      // Add properties as attributes
      if (demo.properties && typeof demo.properties === 'object') {
        for (const [key, value] of Object.entries(demo.properties)) {
          // Convert camelCase to kebab-case for attributes
          const attrName = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
          
          if (typeof value === 'string') {
            html += ' ' + attrName + '="' + value.replace(/"/g, '&quot;') + '"';
          } else if (typeof value === 'boolean' && value) {
            html += ' ' + attrName;
          } else if (typeof value === 'number') {
            html += ' ' + attrName + '="' + value + '"';
          }
        }
      }
      
      html += '>';
      
      // Add content
      if (demo.content && typeof demo.content === 'string') {
        html += demo.content;
      }
      
      html += '</' + (demo.tag || component.name) + '>';
      
      return html;
    }
    
    // Initialize
    renderComponentList();
  </script>
</body>
</html>`;
}

// Generate the gallery
console.log('🔍 Scanning components...');
const components = getComponentInfo();

// Count components that are HAX-capable (have haxProperties wiring)
const haxCapableCount = components.filter(c => c.isHaxCapable).length;

console.log(`✅ Found ${components.length} components with demos`);
console.log(`🎭 ${haxCapableCount} components are HAX-capable`);

if (components.length === 0) {
  console.log('❌ No components found. Make sure you have elements with demo/index.html files.');
  process.exit(1);
}

const html = generateHTML(components);
fs.writeFileSync(OUTPUT_FILE, html);

console.log(`🎉 Component gallery generated: ${OUTPUT_FILE}`);
console.log(`🚀 Run 'yarn gallery' to serve it locally`);
