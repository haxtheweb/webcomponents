#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ELEMENTS_DIR = "./elements";
const OUTPUT_FILE = "./index.html";
const WC_REGISTRY_FILE = "./wc-registry.json";
const DOCS_DIR = "./gallery-data";

// Per-element documentation data (attributes, slots, events, HAX schema and
// walkthrough status) is generated from source so the gallery never carries
// hand written docs. Failure here must not stop the gallery build.
function buildDocsData() {
  try {
    require("child_process").execFileSync(
      process.execPath,
      ["scripts/extract-element-docs.mjs", DOCS_DIR],
      { stdio: "inherit" },
    );
  } catch (err) {
    console.warn("Warning: could not generate element docs data");
  }
}

// Function to extract HAX demo schema from component files
function extractHaxDemoSchema(elementPath, elementName) {
  const possibleFiles = [
    path.join(elementPath, `${elementName}.js`),
    path.join(elementPath, "lib", `${elementName}.haxProperties.json`),
  ];

  for (const filePath of possibleFiles) {
    if (fs.existsSync(filePath)) {
      try {
        if (filePath.endsWith(".json")) {
          // Try to load from separate JSON file
          const haxPropsData = JSON.parse(fs.readFileSync(filePath, "utf8"));
          if (
            haxPropsData.demoSchema &&
            Array.isArray(haxPropsData.demoSchema)
          ) {
            return haxPropsData.demoSchema;
          }
        } else {
          // Try to extract from JS file
          const fileContent = fs.readFileSync(filePath, "utf8");
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
        const demoSchemaStr = "[" + demoSchemaMatch[1] + "]";
        // Clean up the JavaScript syntax to make it JSON-parseable
        const cleanedStr = demoSchemaStr
          .replace(/([{,])\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":') // Quote property names
          .replace(/'/g, '"') // Convert single quotes to double quotes
          .replace(/,\s*}/g, "}") // Remove trailing commas
          .replace(/,\s*]/g, "]"); // Remove trailing commas in arrays

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
  if (
    haxDemoSchema &&
    Array.isArray(haxDemoSchema) &&
    haxDemoSchema.length > 0
  ) {
    return true;
  }

  // Presence of a .haxProperties.json file implies HAX wiring exists.
  const haxJsonPath = path.join(
    elementPath,
    "lib",
    `${elementName}.haxProperties.json`,
  );
  if (fs.existsSync(haxJsonPath)) {
    return true;
  }

  // Look inside the main JS file for haxProperties / setHaxProperties.
  const jsPath = path.join(elementPath, `${elementName}.js`);
  if (fs.existsSync(jsPath)) {
    try {
      const jsContent = fs.readFileSync(jsPath, "utf8");
      return (
        /\bstatic\s+get\s+haxProperties\b/.test(jsContent) ||
        /\bhaxProperties\s*\(/.test(jsContent) ||
        /\bsetHaxProperties\s*\(/.test(jsContent)
      );
    } catch (e) {
      return false;
    }
  }

  return false;
}

// Function to generate HTML for a component demo using HAX schema
function generateHaxDemoHTML(component) {
  if (
    !component.haxDemoSchema ||
    !Array.isArray(component.haxDemoSchema) ||
    component.haxDemoSchema.length === 0
  ) {
    // Fallback to basic component if no HAX demo schema
    return `<${component.name}></${component.name}>`;
  }

  const demo = component.haxDemoSchema[0]; // Use first demo
  let html = `<${demo.tag || component.name}`;

  // Add properties as attributes
  if (demo.properties && typeof demo.properties === "object") {
    for (const [key, value] of Object.entries(demo.properties)) {
      if (typeof value === "string") {
        html += ` ${key}="${value.replace(/"/g, "&quot;")}"`;
      } else if (typeof value === "boolean" && value) {
        html += ` ${key}`;
      } else if (typeof value === "number") {
        html += ` ${key}="${value}"`;
      }
    }
  }

  html += ">";

  // Add content
  if (demo.content && typeof demo.content === "string") {
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
      wcRegistry = JSON.parse(fs.readFileSync(WC_REGISTRY_FILE, "utf8"));
    }
  } catch (err) {
    console.warn("Warning: Could not load wc-registry.json");
  }

  try {
    const elementDirs = fs
      .readdirSync(ELEMENTS_DIR, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const elementName of elementDirs) {
      const elementPath = path.join(ELEMENTS_DIR, elementName);
      const packageJsonPath = path.join(elementPath, "package.json");
      const demoPath = path.join(elementPath, "demo");
      const demoIndexPath = path.join(demoPath, "index.html");

      if (fs.existsSync(packageJsonPath) && fs.existsSync(demoIndexPath)) {
        try {
          const packageData = JSON.parse(
            fs.readFileSync(packageJsonPath, "utf8"),
          );
          const description =
            packageData.description || `${elementName} web component`;
          const version = packageData.version || "1.0.0";

          // Get import path from wc-registry.json
          let importPath = wcRegistry[elementName];
          if (!importPath) {
            // Fallback to standard pattern
            importPath = `${packageData.name}/${elementName}.js`;
          }

          // Check for additional demo files
          const demoFiles = fs.existsSync(demoPath)
            ? fs.readdirSync(demoPath).filter((file) => file.endsWith(".html"))
            : ["index.html"];

          // Try to extract HAX demo schema from the main component file
          const haxDemoSchema = extractHaxDemoSchema(elementPath, elementName);
          const isHaxCapable = isElementHaxCapable(
            elementPath,
            elementName,
            haxDemoSchema,
          );

          // Documentation data and walkthrough storyboard, when present
          let docs = null;
          const docsFile = path.join(DOCS_DIR, elementName + ".docs.json");
          try {
            if (fs.existsSync(docsFile)) {
              docs = JSON.parse(fs.readFileSync(docsFile, "utf8"));
            }
          } catch (err) {
            docs = null;
          }
          // storyboards and captions ship next to the element's docs data and
          // the player looks for them next to the docs file it loaded, so copy
          // them beside the gallery's copy of the docs data
          const companions = [];
          if (docs) {
            (docs.walkthroughs || []).forEach((w) => companions.push(w.src));
            (docs.videos || []).forEach((v) => {
              if (v.captions) companions.push(v.captions);
            });
          }
          companions.forEach((file) => {
            const from = path.join(elementPath, "lib", file);
            if (file && fs.existsSync(from)) {
              fs.copyFileSync(from, path.join(DOCS_DIR, file));
            }
          });
          const motionStatus =
            docs && docs.motion ? docs.motion.status : "none";

          components.push({
            name: elementName,
            docsSrc: docs ? "gallery-data/" + elementName + ".docs.json" : "",
            motionStatus,
            packageName: packageData.name,
            description,
            version,
            demoPath: `elements/${elementName}/demo/index.html`,
            importPath,
            haxDemoSchema,
            isHaxCapable,
            additionalDemos: demoFiles
              .filter((f) => f !== "index.html")
              .map((f) => ({
                name: f.replace(".html", ""),
                path: `elements/${elementName}/demo/${f}`,
              })),
          });
        } catch (err) {
          console.warn(`Warning: Could not parse ${packageJsonPath}`);
        }
      }
    }

    return components.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error("Error reading elements directory:", err);
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
    import { DDDVariables, DDDGlobalStyles, DDDReset, DDDDataAttributes } from "@haxtheweb/d-d-d/lib/DDDStyles.js";
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
  <script type="module" src="./elements/documentation-player/documentation-player.js"></script>
  <style>
    /* Gallery styles. DDD tokens only: flat surfaces, hairline rules,
       small tracked labels and no decorative icons. */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --gal-ground: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-potentialMidnight));
      --gal-text: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white));
      --gal-muted: light-dark(var(--ddd-theme-default-slateGray), var(--ddd-theme-default-limestoneGray));
      --gal-line: light-dark(var(--ddd-theme-default-limestoneGray), var(--ddd-theme-default-slateGray));
      --gal-panel: light-dark(var(--ddd-theme-default-limestoneMaxLight), var(--ddd-theme-default-coalyGray));
      --gal-accent: light-dark(var(--ddd-theme-default-beaverBlue), var(--ddd-theme-default-skyBlue));
    }

    body {
      font-family: var(--ddd-font-primary);
      font-size: var(--ddd-font-size-3xs);
      font-weight: var(--ddd-font-weight-regular);
      line-height: var(--ddd-lh-150);
      color: var(--gal-text);
      background: var(--gal-ground);
      height: 100vh;
      overflow: hidden;
    }

    button {
      font-family: inherit;
      font-size: inherit;
      color: inherit;
    }

    :focus-visible {
      outline: 2px solid var(--gal-accent);
      outline-offset: 2px;
    }

    .gallery-container {
      display: flex;
      height: 100vh;
    }

    /* Sidebar */
    .sidebar {
      width: 22rem;
      flex: none;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border-right: 1px solid var(--gal-line);
    }

    .sidebar-header {
      padding: var(--ddd-spacing-5) var(--ddd-spacing-4) var(--ddd-spacing-3);
      border-bottom: 1px solid var(--gal-line);
    }

    .eyebrow {
      font-size: var(--ddd-font-size-4xs);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--gal-muted);
    }

    .sidebar-header h1 {
      font-family: var(--ddd-font-primary);
      font-size: var(--ddd-font-size-xs);
      font-weight: var(--ddd-font-weight-bold);
      margin: var(--ddd-spacing-1) 0;
    }

    .stats {
      font-size: var(--ddd-font-size-4xs);
      color: var(--gal-muted);
      margin-bottom: var(--ddd-spacing-4);
    }

    .search-box {
      width: 100%;
      padding: var(--ddd-spacing-2) 0;
      border: 0;
      border-bottom: 1px solid var(--gal-line);
      border-radius: 0;
      background: transparent;
      color: var(--gal-text);
      font-family: var(--ddd-font-primary);
      font-size: var(--ddd-font-size-3xs);
    }

    .search-box:focus {
      outline: none;
      border-bottom-color: var(--gal-accent);
    }

    .search-box::placeholder {
      color: var(--gal-muted);
    }

    .filter-buttons {
      display: flex;
      gap: var(--ddd-spacing-3);
      margin-top: var(--ddd-spacing-3);
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: var(--ddd-spacing-1) 0;
      border: 0;
      border-bottom: 2px solid transparent;
      background: none;
      color: var(--gal-muted);
      cursor: pointer;
      font-size: var(--ddd-font-size-4xs);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .filter-btn:hover {
      color: var(--gal-text);
    }

    .filter-btn.active {
      color: var(--gal-text);
      border-bottom-color: var(--gal-text);
      font-weight: var(--ddd-font-weight-bold);
    }

    .component-list {
      flex: 1;
      overflow-y: auto;
    }

    .component-item {
      display: block;
      width: 100%;
      padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
      background: transparent;
      border: 0;
      border-bottom: 1px solid var(--gal-line);
      border-radius: 0;
      cursor: pointer;
      text-align: left;
    }

    .component-item:hover {
      background: var(--gal-panel);
    }

    .component-item.active {
      background: var(--gal-panel);
    }

    .component-item.active .component-item-name {
      color: var(--gal-accent);
    }

    .component-item-name {
      font-size: var(--ddd-font-size-3xs);
      font-weight: var(--ddd-font-weight-bold);
      overflow-wrap: anywhere;
    }

    .component-item-description {
      font-size: var(--ddd-font-size-4xs);
      color: var(--gal-muted);
      line-height: var(--ddd-lh-140);
      margin-top: var(--ddd-spacing-1);
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ddd-spacing-1);
      margin-top: var(--ddd-spacing-2);
    }

    .tag {
      font-size: var(--ddd-font-size-4xs);
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--gal-muted);
      border: 1px solid var(--gal-line);
      padding: 0 var(--ddd-spacing-2);
    }

    .tag.walk {
      color: var(--gal-text);
      border-color: var(--gal-text);
    }

    .tag.stale {
      color: var(--gal-accent);
      border-color: var(--gal-accent);
    }

    /* Main area */
    .main-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .demo-header {
      padding: var(--ddd-spacing-4) var(--ddd-spacing-5) 0;
      border-bottom: 1px solid var(--gal-line);
    }

    .demo-title {
      font-family: var(--ddd-font-primary);
      font-size: var(--ddd-font-size-s);
      font-weight: var(--ddd-font-weight-bold);
      overflow-wrap: anywhere;
    }

    .demo-description {
      color: var(--gal-muted);
      margin: var(--ddd-spacing-1) 0 var(--ddd-spacing-4);
      max-width: 60rem;
    }

    .snippets {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: var(--ddd-spacing-2) var(--ddd-spacing-3);
      align-items: center;
      margin-bottom: var(--ddd-spacing-4);
      max-width: 60rem;
    }

    .snippet-label {
      font-size: var(--ddd-font-size-4xs);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--gal-muted);
    }

    .snippet-code {
      font-family: ui-monospace, Menlo, Consolas, monospace;
      font-size: var(--ddd-font-size-4xs);
      padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
      background: var(--gal-panel);
      border: 1px solid var(--gal-line);
      overflow-x: auto;
      white-space: nowrap;
    }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      justify-content: space-between;
      gap: var(--ddd-spacing-2) var(--ddd-spacing-4);
    }

    .view-tabs {
      display: flex;
      gap: var(--ddd-spacing-1);
    }

    .view-tab {
      padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
      border: 0;
      border-bottom: 2px solid transparent;
      background: none;
      color: var(--gal-muted);
      cursor: pointer;
    }

    .view-tab[aria-selected="true"] {
      color: var(--gal-text);
      border-bottom-color: var(--gal-text);
      font-weight: var(--ddd-font-weight-bold);
    }

    .demo-selector-container {
      display: flex;
      align-items: center;
      gap: var(--ddd-spacing-2);
    }

    .demo-selector-label {
      font-size: var(--ddd-font-size-4xs);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--gal-muted);
    }

    .demo-selector {
      padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
      border: 1px solid var(--gal-line);
      border-radius: 0;
      background: var(--gal-ground);
      color: var(--gal-text);
      font-family: inherit;
      font-size: var(--ddd-font-size-4xs);
    }

    .demo-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ddd-spacing-2);
      padding-bottom: var(--ddd-spacing-1);
    }

    .btn {
      padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
      border: 1px solid var(--gal-line);
      border-radius: 0;
      background: var(--gal-ground);
      color: var(--gal-text);
      cursor: pointer;
      font-size: var(--ddd-font-size-4xs);
      text-decoration: none;
    }

    .btn:hover {
      border-color: var(--gal-text);
    }

    .stage {
      flex: 1;
      min-height: 0;
      position: relative;
      background: var(--gal-ground);
    }

    .demo-frame {
      width: 100%;
      height: 100%;
      border: 0;
      background: var(--gal-ground);
    }

    .docs-pane {
      height: 100%;
      overflow-y: auto;
      padding: var(--ddd-spacing-5);
    }

    .docs-pane documentation-player {
      max-width: 72rem;
    }

    .welcome-message {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      padding: var(--ddd-spacing-5);
      color: var(--gal-muted);
    }

    .welcome-message h2 {
      font-size: var(--ddd-font-size-xs);
      color: var(--gal-text);
      margin-bottom: var(--ddd-spacing-2);
    }

    .hidden {
      display: none !important;
    }

    .no-results {
      padding: var(--ddd-spacing-5);
      color: var(--gal-muted);
    }

    .codepen-form {
      display: none;
    }

    .mobile-bar {
      display: none;
    }

    /* Phones: the component list becomes a drawer under a sticky bar, the
       page scrolls as one document and the demo gets most of the screen. */
    @media (max-width: 768px) {
      body {
        height: auto;
        overflow: auto;
      }

      .mobile-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ddd-spacing-3);
        position: sticky;
        top: 0;
        z-index: 20;
        padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
        padding-top: max(var(--ddd-spacing-2), env(safe-area-inset-top, 0px));
        background: var(--gal-ground);
        border-bottom: 1px solid var(--gal-line);
      }

      .mobile-title {
        font-weight: var(--ddd-font-weight-bold);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
      }

      .mobile-bar .btn {
        flex: none;
        padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
      }

      .gallery-container {
        display: block;
        height: auto;
      }

      .sidebar {
        display: none;
        position: fixed;
        top: var(--gal-bar, 3rem);
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 15;
        width: auto;
        border-right: 0;
        background: var(--gal-ground);
      }

      .sidebar.open {
        display: flex;
      }

      .sidebar-header .eyebrow,
      .sidebar-header h1 {
        display: none;
      }

      .sidebar-header {
        padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
      }

      .component-list {
        padding-bottom: env(safe-area-inset-bottom, 0px);
      }

      .component-item {
        padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
      }

      .main-content {
        display: block;
        height: auto;
        overflow: visible;
      }

      .demo-header {
        padding: var(--ddd-spacing-4) var(--ddd-spacing-4) 0;
      }

      .demo-title {
        font-size: var(--ddd-font-size-xs);
      }

      .snippets {
        grid-template-columns: minmax(0, 1fr) auto;
        gap: var(--ddd-spacing-1) var(--ddd-spacing-2);
      }

      .snippet-label {
        grid-column: 1 / -1;
        margin-top: var(--ddd-spacing-1);
      }

      .toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .demo-actions {
        order: -1;
      }

      #fullscreenBtn {
        display: none;
      }

      .view-tabs {
        border-top: 1px solid var(--gal-line);
      }

      .view-tab {
        flex: 1;
      }

      .stage {
        min-height: 0;
      }

      .demo-frame {
        height: 80vh;
      }

      .docs-pane {
        height: auto;
        overflow: visible;
        padding: var(--ddd-spacing-3) var(--ddd-spacing-2);
      }

      /* the player repeats title, description and copy buttons, so the
         gallery header steps back in the Documentation view */
      .view-docs .demo-title,
      .view-docs .demo-description,
      .view-docs .snippets,
      .view-docs .demo-actions,
      .view-docs .demo-selector-container {
        display: none;
      }

      .welcome-message {
        height: auto;
        padding: var(--ddd-spacing-10) var(--ddd-spacing-4);
      }
    }
  </style>
</head>
<body>
  <d-d-d></d-d-d>

  <header class="mobile-bar" id="mobileBar">
    <span class="mobile-title" id="mobileTitle">Component gallery</span>
    <button class="btn" id="listToggle" aria-expanded="false" aria-controls="sidebar">Components</button>
  </header>

  <div class="gallery-container">
    <!-- Sidebar with component list -->
    <aside class="sidebar" id="sidebar">
      <header class="sidebar-header">
        <p class="eyebrow">HAX web components</p>
        <h1>Component gallery</h1>
        <p class="stats">${totalComponents} components, ${components.filter((c) => c.motionStatus && c.motionStatus !== "none").length} with walkthroughs</p>

        <input type="search"
               class="search-box"
               placeholder="Search components"
               id="searchBox"
               aria-label="Search components">

        <div class="filter-buttons" role="group" aria-label="Filter components">
          <button class="filter-btn active" data-filter="all" title="Show all components">
            All (${totalComponents})
          </button>
          <button class="filter-btn" data-filter="hax" title="Show only HAX-capable components">
            HAX (${components.filter((c) => c.isHaxCapable).length})
          </button>
          <button class="filter-btn" data-filter="walkthrough" title="Show components with an animated walkthrough">
            Walkthrough (${components.filter((c) => c.motionStatus && c.motionStatus !== "none").length})
          </button>
          <button class="filter-btn" data-filter="hax-ecosystem" title="Show HAX ecosystem components">
            hax-* (${components.filter((c) => c.name.startsWith("hax-")).length})
          </button>
        </div>
      </header>

      <nav class="component-list" id="componentList" aria-label="Components">
        <!-- Components will be populated by JavaScript -->
      </nav>

      <p class="no-results hidden" id="noResults">No components found</p>
    </aside>

    <!-- Main content area -->
    <main class="main-content">
      <header class="demo-header hidden" id="demoHeader">
        <h2 class="demo-title" id="demoTitle">Component</h2>
        <p class="demo-description" id="demoDescription">Select a component to view its demo and documentation</p>

        <div class="snippets">
          <span class="snippet-label">Install</span>
          <code class="snippet-code" id="installationCode">npm install @haxtheweb/example-element</code>
          <button class="btn" data-copy="installationCode">Copy</button>
          <span class="snippet-label">Import</span>
          <code class="snippet-code" id="usageCode">import '@haxtheweb/example-element/example-element.js';</code>
          <button class="btn" data-copy="usageCode">Copy</button>
        </div>

        <div class="toolbar">
          <div class="view-tabs" role="tablist" aria-label="View">
            <button class="view-tab" role="tab" id="tabDemo" data-view="demo" aria-selected="true">Live demo</button>
            <button class="view-tab" role="tab" id="tabDocs" data-view="docs" aria-selected="false">Documentation</button>
          </div>
          <div class="demo-selector-container hidden" id="demoSelectorContainer">
            <label class="demo-selector-label" for="demoSelector">Demo</label>
            <select class="demo-selector" id="demoSelector"></select>
          </div>
          <div class="demo-actions">
            <button class="btn" id="newTabBtn">Open in new tab</button>
            <button class="btn" id="codepenBtn">Try in CodePen</button>
            <button class="btn" id="fullscreenBtn">Fullscreen</button>
          </div>
        </div>
      </header>

      <div class="stage">
        <div class="welcome-message" id="welcomeMessage">
          <div>
            <h2>Welcome to the HAX web components gallery</h2>
            <p>Choose a component to see its demo, documentation and walkthrough.</p>
          </div>
        </div>
        <iframe class="demo-frame hidden" id="demoFrame" title="Component demo"></iframe>
        <div class="docs-pane hidden" id="docsPane"></div>
      </div>
    </main>
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
    const docsPane = document.getElementById('docsPane');
    const viewTabs = document.querySelectorAll('.view-tab');
    let currentView = 'demo';
    let currentTopic = getQueryParam('topic') || '';

    // Demo and documentation views share one stage
    function setView(view) {
      currentView = view;
      document.body.classList.toggle('view-docs', view === 'docs');
      viewTabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.view === view)));
      const docs = view === 'docs' && currentComponent;
      demoFrame.classList.toggle('hidden', Boolean(docs));
      docsPane.classList.toggle('hidden', !docs);
      demoSelectorContainer.style.visibility = docs ? 'hidden' : '';
      docsPane.textContent = '';
      if (docs) {
        const player = document.createElement('documentation-player');
        if (currentComponent.docsSrc) player.setAttribute('docs-src', currentComponent.docsSrc);
        player.setAttribute('demo-href', currentComponent.demoPath);
        // ?topic= opens one walkthrough of an element that has several
        if (getQueryParam('topic')) {
          player.setAttribute('topic', getQueryParam('topic'));
        }
        player.addEventListener('documentation-player-topic', (e) => {
          currentTopic = e.detail;
          updateUrlForCurrentDemo();
        });
        docsPane.appendChild(player);
      }
      updateUrlForCurrentDemo();
    }

    viewTabs.forEach(t => t.addEventListener('click', () => setView(t.dataset.view)));

    // Copy buttons for the install and import rows
    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = document.getElementById(btn.dataset.copy).textContent;
        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = 'Copied';
        } catch (e) {
          btn.textContent = 'Press Ctrl+C';
        }
        setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
      });
    });
    let currentDemoPath = null;
    
    // Filter components based on current filter
    function filterComponents() {
      let components = [];
      
      switch (currentFilter) {
        case 'hax':
          components = COMPONENTS.filter(c => c.isHaxCapable);
          break;
        case 'walkthrough':
          components = COMPONENTS.filter(c => c.motionStatus && c.motionStatus !== 'none');
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
        
        const tags = [];
        if (component.isHaxCapable) tags.push('<span class="tag">HAX</span>');
        if (component.motionStatus && component.motionStatus !== 'none') {
          tags.push('<span class="tag walk">Walkthrough</span>');
          if (component.motionStatus === 'stale') tags.push('<span class="tag stale">Needs update</span>');
        }

        item.innerHTML = \`
          <div class="component-item-name">&lt;\${component.name}&gt;</div>
          <div class="component-item-description">\${component.description}</div>
          \${tags.length ? '<div class="tags">' + tags.join('') + '</div>' : ''}
        \`;
        
        item.addEventListener('click', () => selectComponent(component));
        componentList.appendChild(item);
      });
    }
    
    // Select and display a component
    function selectComponent(component) {
      if (currentComponent && currentComponent !== component) {
        currentTopic = '';
      }
      currentComponent = component;
      currentDemoPath = component.demoPath;
      mobileTitle.textContent = '<' + component.name + '>';
      setDrawer(false);
      
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
      setView(getQueryParam('view') === 'docs' ? 'docs' : 'demo');

      // Reflect the current selection in the URL for shareable deep links.
      updateUrlForCurrentDemo();
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
        updateUrlForCurrentDemo();
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
    
    // Deep-link routing helpers (?element=<slug>&demo=<name>)
    function getQueryParam(name) {
      return new URLSearchParams(globalThis.location.search).get(name);
    }

    function updateUrlForCurrentDemo() {
      if (!currentComponent) {
        return;
      }
      const params = new URLSearchParams();
      params.set('element', currentComponent.name);
      if (currentDemoPath && currentDemoPath !== currentComponent.demoPath) {
        let demoName = null;
        if (currentComponent.additionalDemos && currentComponent.additionalDemos.length > 0) {
          for (let i = 0; i < currentComponent.additionalDemos.length; i++) {
            if (currentComponent.additionalDemos[i].path === currentDemoPath) {
              demoName = currentComponent.additionalDemos[i].name;
              break;
            }
          }
        }
        if (demoName) {
          params.set('demo', demoName);
        }
      }
      if (currentView === 'docs') {
        params.set('view', 'docs');
        if (currentTopic) {
          params.set('topic', currentTopic);
        }
      }
      const search = params.toString();
      globalThis.history.replaceState({}, '', globalThis.location.pathname + (search ? '?' + search : ''));
    }

    function applyRouteFromUrl() {
      const slug = getQueryParam('element');
      if (!slug) {
        return;
      }
      let component = null;
      for (let i = 0; i < COMPONENTS.length; i++) {
        if (COMPONENTS[i].name === slug) {
          component = COMPONENTS[i];
          break;
        }
      }
      if (!component) {
        return;
      }
      selectComponent(component);
      const demoName = getQueryParam('demo');
      if (demoName && demoName !== 'index') {
        let match = null;
        if (component.additionalDemos && component.additionalDemos.length > 0) {
          for (let j = 0; j < component.additionalDemos.length; j++) {
            if (component.additionalDemos[j].name === demoName) {
              match = component.additionalDemos[j];
              break;
            }
          }
        }
        if (match) {
          currentDemoPath = match.path;
          if (demoSelector && demoSelector.options.length > 0) {
            demoSelector.value = match.path;
          }
          demoFrame.src = currentDemoPath;
          updateUrlForCurrentDemo();
        }
      }
    }

    // Phone layout: the component list is a drawer under the sticky bar
    const sidebar = document.getElementById('sidebar');
    const listToggle = document.getElementById('listToggle');
    const mobileBar = document.getElementById('mobileBar');
    const mobileTitle = document.getElementById('mobileTitle');
    const phone = globalThis.matchMedia('(max-width: 768px)');
    function setDrawer(open) {
      sidebar.classList.toggle('open', open);
      listToggle.setAttribute('aria-expanded', String(open));
      listToggle.textContent = open ? 'Close' : 'Components';
      // nothing to close back to until a component is chosen
      listToggle.hidden = open && !currentComponent;
      document.documentElement.style.setProperty('--gal-bar', mobileBar.offsetHeight + 'px');
      if (!open && phone.matches) {
        globalThis.scrollTo(0, 0);
      }
    }
    listToggle.addEventListener('click', () => {
      setDrawer(!sidebar.classList.contains('open'));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('open') && currentComponent) {
        setDrawer(false);
        listToggle.focus();
      }
    });

    // Initialize
    renderComponentList();
    applyRouteFromUrl();
    if (!currentComponent) {
      setDrawer(phone.matches);
    }
  </script>
</body>
</html>`;
}

// Generate the gallery
console.log("Scanning components...");
buildDocsData();
const components = getComponentInfo();

// Count components that are HAX-capable (have haxProperties wiring)
const haxCapableCount = components.filter((c) => c.isHaxCapable).length;

console.log(`Found ${components.length} components with demos`);
console.log(`${haxCapableCount} components are HAX-capable`);

if (components.length === 0) {
  console.log(
    "No components found. Make sure you have elements with demo/index.html files.",
  );
  process.exit(1);
}

const html = generateHTML(components);
fs.writeFileSync(OUTPUT_FILE, html);

console.log(`Component gallery generated: ${OUTPUT_FILE}`);
console.log(`Run 'yarn gallery' to serve it locally`);
