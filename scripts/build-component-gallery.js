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
  } catch {
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
      } catch {
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
      } catch {
        // If parsing fails, return null
        return null;
      }
    }
  } catch {
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
    } catch {
      return false;
    }
  }

  return false;
}

// HAXcms theme registry; a package whose own tag is a registered theme is a
// theme even when its name does not end in -theme (clean-one, simple-blog)
let THEME_TAGS = null;
function themeTags() {
  if (THEME_TAGS) {
    return THEME_TAGS;
  }
  THEME_TAGS = new Set();
  const themesFile = path.join(
    ELEMENTS_DIR,
    "haxcms-elements",
    "lib",
    "themes.json",
  );
  try {
    const themes = JSON.parse(fs.readFileSync(themesFile, "utf8"));
    Object.values(themes).forEach((theme) => {
      if (theme && theme.element) {
        THEME_TAGS.add(theme.element);
      }
    });
  } catch {
    console.warn("Warning: could not read haxcms-elements/lib/themes.json");
  }
  return THEME_TAGS;
}

function isElementTheme(elementName) {
  return /-themes?$/.test(elementName) || themeTags().has(elementName);
}

// DDD itself, its docs, and every DDD bridge package (one that ships
// design-system/bridge.json, the same signal design-system-discovery uses)
function isElementDesignSystem(elementPath, elementName) {
  return (
    elementName === "d-d-d" ||
    elementName === "d-d-docs" ||
    fs.existsSync(path.join(elementPath, "design-system", "bridge.json"))
  );
}

// Gizmo tags of the package's own element, from lib/<tag>.haxProperties.json
// or an inline static haxProperties in <tag>.js
function extractGizmoTags(elementPath, elementName) {
  const jsonPath = path.join(
    elementPath,
    "lib",
    `${elementName}.haxProperties.json`,
  );
  try {
    if (fs.existsSync(jsonPath)) {
      const hax = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
      return hax.gizmo && Array.isArray(hax.gizmo.tags) ? hax.gizmo.tags : [];
    }
    const jsPath = path.join(elementPath, `${elementName}.js`);
    if (fs.existsSync(jsPath)) {
      const src = fs.readFileSync(jsPath, "utf8");
      const m = src.match(/gizmo\s*:\s*\{[\s\S]*?\btags\s*:\s*\[([^\]]*)\]/);
      if (m) {
        return [...m[1].matchAll(/['"`]([^'"`]+)['"`]/g)].map((t) => t[1]);
      }
    }
  } catch {
    // unreadable schema: no tags
  }
  return [];
}

// Instructional blocks are the ones HAX files under the Instructional gizmo tag
function isElementInstructional(elementPath, elementName) {
  return extractGizmoTags(elementPath, elementName).some((t) =>
    /^instructional$/i.test(String(t).trim()),
  );
}

// Function to generate HTML for a component demo using HAX schema
// kept for building a HAX demo page by hand
// eslint-disable-next-line no-unused-vars
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
  } catch {
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
          const isTheme = isElementTheme(elementName);
          const isInstructional = isElementInstructional(
            elementPath,
            elementName,
          );
          const isDesignSystem = isElementDesignSystem(
            elementPath,
            elementName,
          );

          // Documentation data and walkthrough storyboard, when present
          let docs = null;
          const docsFile = path.join(DOCS_DIR, elementName + ".docs.json");
          try {
            if (fs.existsSync(docsFile)) {
              docs = JSON.parse(fs.readFileSync(docsFile, "utf8"));
            }
          } catch {
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
            isTheme,
            isInstructional,
            isDesignSystem,
            additionalDemos: demoFiles
              .filter((f) => f !== "index.html")
              .map((f) => ({
                name: f.replace(".html", ""),
                path: `elements/${elementName}/demo/${f}`,
              })),
          });
        } catch {
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

// The gallery boots with the same loading screen as a HAXcms site (a page
// that builds itself), so reviewing feels like the rest of HAX. Its styles
// and markup are read from the haxcms-elements demo, which mirrors the
// haxcms-nodejs site boilerplate, so there is one copy in this repo to keep
// current. If they cannot be found the gallery simply has no loading screen.
const LOADER_SOURCE = path.join(
  ELEMENTS_DIR,
  "haxcms-elements",
  "demo",
  "index.html",
);
// Shown until the page is styled: the DDD + HAX UI module has run and the
// fonts are in (FONT_WAIT_MS at most), or SAFETY_MS whatever happens.
const GALLERY_LOADER_SCRIPT = `  <script id="loadingscript">
    (function () {
      var LOOP_MS = 3600; // one loop of the figure (the ld* keyframes)
      var BUILT_MS = 2850; // when, in a loop, the page is fully built
      var FINISH_MS = 400; // ready: the build wraps up in at most this long
      var MAX_RATE = 8; // by playing faster, but never more than this
      var HOLD_MS = 100; // then rests on the built page this long
      var FAST_MS = 1200; // ready this soon: skip the show, fade quickly
      var FONT_WAIT_MS = 1500;
      var SAFETY_MS = 8000;
      var done = false;
      function finishFigure(figure, next) {
        var anims = figure.getAnimations({ subtree: true });
        if (!anims.length) {
          next();
          return;
        }
        var now = Number(anims[0].currentTime) || 0;
        var phase = now % LOOP_MS;
        var left = phase >= BUILT_MS ? 0 : BUILT_MS - phase;
        var rate = Math.min(Math.max(left / FINISH_MS, 1), MAX_RATE);
        if (rate > 1) {
          anims.forEach(function (a) {
            if (a.updatePlaybackRate) {
              a.updatePlaybackRate(rate);
            } else {
              a.playbackRate = rate;
            }
          });
        }
        setTimeout(function () {
          anims.forEach(function (a) {
            a.currentTime = now - phase + BUILT_MS;
            a.pause();
          });
          setTimeout(next, HOLD_MS);
        }, left / rate);
      }
      function dissolve(el, quick) {
        el.classList.add('loaded', 'ld-out');
        if (quick) {
          el.classList.add('ld-quick');
        }
        el.setAttribute('aria-busy', 'false');
        setTimeout(function () {
          el.remove();
        }, quick ? 200 : 350);
      }
      function reveal() {
        if (done) {
          return;
        }
        done = true;
        var el = document.getElementById('loading');
        if (!el) {
          return;
        }
        globalThis.requestAnimationFrame(function () {
          globalThis.requestAnimationFrame(function () {
            var figure = el.querySelector('.ld-fig');
            var quick =
              !figure ||
              !figure.getAnimations ||
              document.visibilityState === 'hidden' ||
              globalThis.performance.now() < FAST_MS ||
              globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (quick) {
              dissolve(el, true);
            } else {
              finishFigure(figure, function () {
                dissolve(el, false);
              });
            }
          });
        });
      }
      function whenStyled() {
        var fonts = document.fonts && document.fonts.ready;
        if (!fonts) {
          reveal();
          return;
        }
        Promise.race([
          fonts,
          new Promise(function (resolve) {
            setTimeout(resolve, FONT_WAIT_MS);
          }),
        ]).then(reveal, reveal);
      }
      if (globalThis.__galleryStyled) {
        whenStyled();
      } else {
        globalThis.addEventListener('gallery-styled', whenStyled, { once: true });
      }
      setTimeout(reveal, SAFETY_MS);
    })();
  </script>`;

function galleryLoader() {
  try {
    const page = fs.readFileSync(LOADER_SOURCE, "utf8");
    const styles = page.match(
      / {2}<style id="loadingstyles">[\s\S]*?<\/style>/,
    );
    const markup = page.match(
      / {2}<section role="alert" id="loading"[\s\S]*?<\/section>/,
    );
    if (styles && markup) {
      return {
        styles: styles[0] + "\n" + GALLERY_LOADER_SCRIPT,
        markup: markup[0],
      };
    }
  } catch {
    // fall through: no loading screen
  }
  console.warn("Warning: could not read the HAXcms loading screen");
  return { styles: "", markup: "" };
}

// Third-party notices for the CDN build the gallery loads its third-party
// code from (scripts/copy-dep-licenses.js writes it during ubiquity). The
// plain-text name is what builds published before the Markdown notices have.
const LICENSES_MD_URL =
  "https://cdn.hax.cloud/cdn/build/THIRD_PARTY_LICENSES.md";
const LICENSES_TEXT_URL =
  "https://cdn.hax.cloud/cdn/build/THIRD_PARTY_LICENSES";

// The design systems a site can pick (scripts/design-system-discovery.mjs
// writes the registry): the gallery offers the same list, by name and title
function galleryDesignSystems() {
  const file = path.join(
    ELEMENTS_DIR,
    "haxcms-elements",
    "lib",
    "designSystems.json",
  );
  try {
    const registry = JSON.parse(fs.readFileSync(file, "utf8"));
    return Object.values(registry)
      .filter((d) => d && /^[a-z0-9-]+$/.test(d.name))
      .map((d) => ({ name: d.name, title: String(d.title || d.name) }));
  } catch {
    console.warn("Warning: could not read designSystems.json");
    return [];
  }
}

// DDD palettes, by data-palette value and label, from the registry the
// palette picker reads (d-d-d/lib/DDDPaletteRegistry.js)
function galleryPalettes() {
  const file = path.join(ELEMENTS_DIR, "d-d-d", "lib", "DDDPaletteRegistry.js");
  try {
    const src = fs.readFileSync(file, "utf8");
    const out = [];
    const re = /label:\s*"([^"]+)",\s*dataPalette:\s*"([a-z0-9-]+)"/g;
    let m;
    while ((m = re.exec(src)) !== null) {
      out.push({ label: m[1], value: m[2] });
    }
    return out;
  } catch {
    console.warn("Warning: could not read DDDPaletteRegistry.js");
    return [];
  }
}

// gallery-data/appearance.js: applies the picked design system and palette
// in the gallery page and in each demo frame
function copyAppearanceModule() {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
  fs.copyFileSync(
    path.join(__dirname, "gallery", "appearance.js"),
    path.join(DOCS_DIR, "appearance.js"),
  );
}

function generateHTML(components) {
  const totalComponents = components.length;
  // shortcut to the full system demo, used to review everything working together
  const haxcmsDemo = components.find((c) => c.name === "haxcms-elements");
  // and to the AppHax dashboard, which boots the same way
  const appHaxDemo = components.find((c) => c.name === "app-hax");
  const walkthroughCount = components.filter(
    (c) => c.motionStatus && c.motionStatus !== "none",
  ).length;
  const loader = galleryLoader();
  const componentsData = JSON.stringify(components, null, 2);
  const designSystemsData = JSON.stringify(galleryDesignSystems());
  const palettesData = JSON.stringify(galleryPalettes());

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HAX Web Components Gallery</title>
  <style>
    /* First paint, before any module loads: follow the system light/dark
       setting with the HAX UI surface colors so the page never flashes white */
    :root {
      color-scheme: light dark;
      background-color: light-dark(#ffffff, #262626);
      color: light-dark(#262626, #ffffff);
    }
  </style>
${loader.styles}
  <script type="module">
    // DDD plus the HAX UI admin layer (tokens, primitives, controls). The
    // HAX UI pieces are written for an element's :host, so they are applied
    // to the page root here; .hax-ui-dark-chrome re-declares the tokens so
    // the title bar gets the dark chrome every HAX admin top bar wears.
    import { DDDVariables, DDDGlobalStyles, DDDReset, DDDDataAttributes } from "@haxtheweb/d-d-d/lib/DDDStyles.js";
    import { HaxUiAdminTokens, HaxUiAdminPrimitives, HaxUiDarkChromeDeclarations } from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
    import { HaxUiAdminControls, HaxUiAdminSimpleFields } from "@haxtheweb/d-d-d/lib/HaxUiAdminControls.js";

    const toPage = (sheets) => sheets.map((s) => s.cssText.split(':host').join(':root, .hax-ui-dark-chrome')).join('\\n');
    const dddStyles = document.createElement('style');
    dddStyles.id = 'gallery-ddd';
    dddStyles.textContent = [
      DDDVariables.cssText,
      DDDGlobalStyles.cssText,
      DDDReset.cssText,
      DDDDataAttributes.map((attr) => attr.cssText).join(""),
      toPage(HaxUiAdminTokens),
      '.hax-ui-dark-chrome {' + HaxUiDarkChromeDeclarations.cssText + '}',
      toPage(HaxUiAdminPrimitives),
      toPage(HaxUiAdminControls),
      toPage(HaxUiAdminSimpleFields),
    ].join('\\n');
    // before the gallery's own styles, so its rules win ties
    document.head.insertBefore(dddStyles, document.getElementById('gallery-styles'));
    globalThis.__galleryStyled = true;
    globalThis.dispatchEvent(new CustomEvent('gallery-styled'));
  </script>
  <script type="module" src="./elements/documentation-player/documentation-player.js"></script>
  <!-- renders the third-party license notices (?view=licenses) -->
  <script type="module" src="./elements/md-block/md-block.js"></script>
  <!-- the strip that links every hax.cloud site (hax.cloud, this gallery, the live demo, RPG me) -->
  <script type="module" src="./elements/hax-network-bar/hax-network-bar.js"></script>
  <!-- dogfood: the gallery's form controls are the same elements the HAX
       admin screens use, so their light/dark handling is the shared one -->
  <script type="module" src="./elements/simple-fields/lib/simple-fields-field.js"></script>
  <!-- the palette picker HAXcms appearance settings use -->
  <script type="module" src="./elements/d-d-d/lib/hax-palette-picker.js"></script>
  <!-- applies ?system= and ?palette= here and in each demo frame -->
  <script type="module" src="./gallery-data/appearance.js"></script>
  <style id="gallery-styles">
    /* Gallery styles: the HAX UI admin layer (the --hax-ui-* tokens and
       .hax-ui-* controls from d-d-d), so the gallery reads like the rest of
       HAX's admin screens. No decorative icons. */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--hax-ui-admin-font-family, sans-serif);
      font-size: var(--hax-ui-admin-font-size, 14px);
      font-weight: var(--ddd-font-weight-regular, 400);
      line-height: 1.5;
      color: var(--hax-ui-text);
      background-color: var(--hax-ui-surface);
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    button,
    select {
      font-family: inherit;
      font-size: inherit;
      color: inherit;
    }

    :focus-visible {
      outline: var(--hax-ui-focus-width, 2px) solid var(--hax-ui-focus);
      outline-offset: 2px;
    }

    /* The gallery is admin chrome: undo DDD's content typography (heading
       and paragraph margins, bold accent links) that DDD's global styles
       give every page */
    .titlebar h1,
    .sidebar p,
    .demo-header h2,
    .demo-header p,
    .welcome-message p {
      margin: 0;
      padding: 0;
    }

    body a.hax-ui-btn,
    body a.hax-ui-btn:any-link {
      font-weight: var(--ddd-font-weight-medium, 500);
      text-decoration: none;
      color: var(--hax-ui-text);
      background-color: var(--hax-ui-surface);
    }

    body a.hax-ui-btn:hover {
      text-decoration: none;
      background-color: var(--hax-ui-hover);
    }

    /* Title bar: the dark chrome HAX admin top bars share */
    .titlebar {
      flex: none;
      display: flex;
      align-items: center;
      gap: var(--hax-ui-gap-lg);
      min-height: var(--hax-ui-titlebar-height, 48px);
      padding: 0 var(--ddd-spacing-4, 16px);
      color: var(--hax-ui-on-titlebar);
      background-color: var(--hax-ui-titlebar);
      z-index: 20;
    }

    .brand {
      display: flex;
      align-items: baseline;
      gap: var(--hax-ui-gap-md);
      min-width: 0;
      flex: 1;
    }

    .brand-mark {
      font-weight: var(--ddd-font-weight-black, 900);
      letter-spacing: 0.04em;
    }

    .brand h1 {
      font-family: inherit;
      font-size: var(--hax-ui-admin-font-size, 14px);
      font-weight: var(--ddd-font-weight-medium, 500);
      white-space: nowrap;
    }

    .brand-stats {
      font-size: var(--hax-ui-admin-font-size-xs, 12px);
      color: var(--hax-ui-text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mobile-title {
      display: none;
    }

    .shortcuts {
      display: flex;
      flex-wrap: wrap;
      gap: var(--hax-ui-gap-md);
    }

    hax-network-bar {
      flex: none;
      --hax-network-bar-max-width: none;
      --hax-network-bar-gutter: var(--ddd-spacing-4, 16px);
    }

    /* the live demo is the gallery's main call to action, in the same
       Keystone yellow as hax.cloud's "Try the live demo" */
    body a.hax-ui-btn#haxcmsDemoBtn,
    body a.hax-ui-btn#haxcmsDemoBtn:any-link {
      font-weight: var(--ddd-font-weight-bold, 700);
      color: var(--ddd-theme-default-nittanyNavy);
      background-color: var(--ddd-theme-default-keystoneYellow);
      border-color: var(--ddd-theme-default-keystoneYellow);
    }

    body a.hax-ui-btn#haxcmsDemoBtn:hover {
      background-color: var(--ddd-theme-default-white);
    }

    .titlebar .hax-ui-btn {
      text-decoration: none;
    }

    #listToggle {
      display: none;
    }

    .gallery-container {
      flex: 1;
      min-height: 0;
      display: flex;
    }

    /* Sidebar: the admin rail, sunken beside the stage */
    .sidebar {
      width: 22rem;
      flex: none;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      /* --hax-ui-sunken is see-through in dark mode, so it is laid over
         the opaque surface: the phone drawer never shows the page under it */
      background-color: var(--hax-ui-surface);
      background-image: linear-gradient(var(--hax-ui-sunken), var(--hax-ui-sunken));
      border-right: 1px solid var(--hax-ui-line);
    }

    .sidebar-header {
      display: flex;
      flex-direction: column;
      gap: var(--hax-ui-gap-md);
      padding: var(--hax-ui-gap-lg);
      border-bottom: 1px solid var(--hax-ui-line);
    }

    /* search: a simple-fields-field in the shared HAX UI field style,
       named by its own label (kept for assistive tech, placeholder shown) */
    .search-box {
      display: block;
      width: 100%;
      --simple-fields-input-max-width: 100%;
    }
    .search-box::part(field-main-inner) {
      flex: 1 1 auto;
    }
    .search-box::part(label) {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }

    .filter-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: var(--hax-ui-gap);
    }

    .sidebar .rail-label {
      padding: var(--hax-ui-gap-lg) var(--hax-ui-gap-lg) var(--hax-ui-gap);
      font-size: 11px;
      font-weight: var(--ddd-font-weight-bold, 700);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--hax-ui-text-muted);
    }

    .component-list {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 0 var(--hax-ui-gap-md) var(--hax-ui-gap-md);
    }

    .component-item {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      display: block;
      width: 100%;
      padding: var(--hax-ui-gap-md);
      border-radius: var(--hax-ui-radius);
      color: var(--hax-ui-text);
    }

    .component-item:hover {
      background-color: var(--hax-ui-hover);
    }

    .component-item:focus-visible {
      outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
      outline-offset: calc(-1 * var(--hax-ui-focus-width));
    }

    .component-item[aria-current="page"] {
      background-color: var(--hax-ui-selected);
      box-shadow: inset 3px 0 0 var(--hax-ui-accent-strong);
    }

    .component-item-name {
      font-family: var(--ddd-font-mono, monospace);
      font-size: 13px;
      font-weight: var(--ddd-font-weight-bold, 700);
      overflow-wrap: anywhere;
    }

    .component-item-description {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-top: 2px;
      font-size: var(--hax-ui-admin-font-size-xs);
      line-height: 1.4;
      color: var(--hax-ui-text-muted);
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--hax-ui-gap);
      margin-top: var(--hax-ui-gap);
    }

    /* Appearance: the design system and palette the gallery and its
       demos are drawn in, picked the way a HAXcms site picks them */
    .appearance-toggle {
      justify-content: space-between;
      width: 100%;
    }

    .appearance-summary {
      font-weight: var(--ddd-font-weight-regular, 400);
      color: var(--hax-ui-text-muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .appearance-panel {
      display: flex;
      flex-direction: column;
      gap: var(--hax-ui-gap-lg);
      max-height: 45vh;
      overflow-y: auto;
      padding: var(--hax-ui-gap-md);
      border: 1px solid var(--hax-ui-line);
      border-radius: var(--hax-ui-radius);
      background-color: var(--hax-ui-surface);
    }

    .appearance-panel[hidden] {
      display: none;
    }

    .appearance-panel simple-fields-field {
      display: block;
      width: 100%;
      --simple-fields-input-max-width: 100%;
    }

    .appearance-note {
      font-size: var(--hax-ui-admin-font-size-xs, 12px);
      color: var(--hax-ui-text-muted);
    }

    .gallery-footer {
      flex: none;
      display: flex;
      flex-wrap: wrap;
      gap: var(--hax-ui-gap) var(--hax-ui-gap-lg);
      padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
      border-top: 1px solid var(--hax-ui-line);
      font-size: var(--hax-ui-admin-font-size-xs, 12px);
      color: var(--hax-ui-text-muted);
    }

    .gallery-footer a,
    .gallery-footer a:any-link {
      display: inline-flex;
      align-items: center;
      min-height: 24px;
      font-weight: var(--ddd-font-weight-regular, 400);
      color: var(--hax-ui-text);
      text-decoration: underline;
    }

    /* Main area: page header, toolbar, then the stage */
    .main-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .demo-header {
      display: flex;
      flex-direction: column;
      gap: var(--hax-ui-gap-lg);
      padding: var(--ddd-spacing-4, 16px) var(--ddd-spacing-5, 20px) var(--hax-ui-gap-lg);
      border-bottom: 1px solid var(--hax-ui-line);
    }

    .demo-title {
      font-family: var(--ddd-font-mono, monospace);
      font-size: 18px;
      font-weight: var(--ddd-font-weight-bold, 700);
      line-height: 1.3;
      overflow-wrap: anywhere;
    }

    .demo-header .demo-description {
      margin-top: var(--hax-ui-gap);
      max-width: 60rem;
      color: var(--hax-ui-text-muted);
    }

    .snippets {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: var(--hax-ui-gap) var(--hax-ui-gap-md);
      align-items: center;
      max-width: 60rem;
    }

    .snippet-label {
      font-size: 11px;
      font-weight: var(--ddd-font-weight-bold, 700);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--hax-ui-text-muted);
    }

    .snippet-code:focus-visible {
      outline: var(--hax-ui-focus-width, 2px) solid var(--hax-ui-focus);
      outline-offset: 2px;
    }

    .snippet-code {
      display: flex;
      align-items: center;
      height: var(--hax-ui-row-height);
      padding: 0 var(--hax-ui-gap-md);
      font-family: var(--ddd-font-mono, monospace);
      font-size: var(--hax-ui-admin-font-size-xs);
      border: 1px solid var(--hax-ui-line);
      border-radius: var(--hax-ui-radius);
      background-color: var(--hax-ui-sunken);
      overflow-x: auto;
      white-space: nowrap;
    }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
    }

    .toolbar-start {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--hax-ui-gap-md);
    }

    /* the view switch is a segmented control; tabs carry aria-selected */
    .view-tabs button[aria-selected="true"] {
      font-weight: var(--ddd-font-weight-bold, 700);
      background-color: var(--hax-ui-accent-soft);
      box-shadow: inset 0 -3px 0 var(--hax-ui-accent-strong);
    }

    /* demo picker: a simple-fields-field select in the shared HAX UI
       field style (hax-ui-simple-field compact), as in outline-designer.
       The field names its select itself (a label for= cannot reach into
       its shadow root); the visible word stays beside it. */
    .demo-selector-container {
      display: inline-flex;
      align-items: center;
      gap: var(--hax-ui-gap-md);
      font-size: var(--hax-ui-admin-font-size-xs);
      color: var(--hax-ui-text-muted);
    }
    .demo-selector-container.hidden {
      display: none;
    }
    .demo-selector {
      width: 10rem;
    }
    .demo-selector::part(label) {
      display: none;
    }

    .demo-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--hax-ui-gap-md);
    }

    .demo-actions .hax-ui-btn {
      text-decoration: none;
    }

    .stage {
      flex: 1;
      min-height: 0;
      position: relative;
      background-color: var(--hax-ui-surface);
    }

    .demo-frame {
      width: 100%;
      height: 100%;
      border: 0;
      background-color: transparent;
      transition: opacity var(--hax-ui-duration, 150ms) var(--hax-ui-easing, ease);
    }

    /* while a demo loads it stays hidden under an indeterminate bar, so a
       half-painted (or white) frame never shows */
    .stage-progress {
      position: absolute;
      inset: 0 0 auto;
      height: 3px;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--hax-ui-duration, 150ms) var(--hax-ui-easing, ease);
    }

    .stage-progress::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      width: 30%;
      background-color: var(--hax-ui-accent-strong);
      animation: stage-progress 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    .stage.is-loading .stage-progress {
      opacity: 1;
    }

    .stage.is-loading .demo-frame {
      opacity: 0;
    }

    @keyframes stage-progress {
      0% { left: -30%; }
      100% { left: 100%; }
    }

    @media (prefers-reduced-motion: reduce) {
      .stage-progress::before {
        animation: none;
        left: 0;
        width: 100%;
        opacity: 0.6;
      }
      .demo-frame {
        transition: none;
      }
    }

    .docs-pane {
      height: 100%;
      overflow-y: auto;
      padding: var(--ddd-spacing-5, 20px);
    }

    .docs-pane documentation-player {
      max-width: 72rem;
    }

    .licenses-pane {
      height: 100%;
      overflow-y: auto;
      padding: var(--ddd-spacing-5, 20px);
      color: var(--hax-ui-text);
      background-color: var(--hax-ui-surface);
    }

    .licenses-pane:focus {
      outline: none;
    }

    /* reference text: DDD's smaller steps, not page-content sizes */
    #licensesBlock {
      --ddd-theme-h1-font-size: var(--ddd-font-size-m);
      --ddd-theme-h2-font-size: var(--ddd-font-size-s);
      --ddd-theme-h3-font-size: var(--ddd-font-size-xs);
      --ddd-theme-body-font-size: var(--ddd-font-size-4xs);
    }

    .licenses-pane > p {
      max-width: 48rem;
      margin: 0 0 var(--hax-ui-gap-lg);
      color: var(--hax-ui-text-muted);
    }

    .licenses-pane a,
    .licenses-pane a:any-link {
      color: var(--hax-ui-text);
      text-decoration: underline;
    }

    /* the package index is a wide table: it scrolls on its own, the page
       never scrolls sideways */
    .licenses-scroll {
      max-width: 72rem;
      overflow-x: auto;
    }

    .welcome-message {
      display: grid;
      place-items: center;
      height: 100%;
      padding: var(--ddd-spacing-5, 20px);
    }

    .welcome-message .hax-ui-empty {
      max-width: 32rem;
    }

    .hidden {
      display: none !important;
    }

    .sidebar .no-results {
      margin: var(--hax-ui-gap-lg);
    }

    .codepen-form {
      display: none;
    }

    /* Phones: the component list becomes a drawer under the title bar, the
       page scrolls as one document and the demo gets most of the screen. */
    @media (max-width: 768px) {
      body {
        display: block;
        height: auto;
        overflow: auto;
      }

      .titlebar {
        position: sticky;
        top: 0;
        flex-wrap: wrap;
        padding: var(--hax-ui-gap-md) var(--ddd-spacing-4, 16px);
        padding-top: max(var(--hax-ui-gap-md), env(safe-area-inset-top, 0px));
      }

      .brand-stats,
      .brand h1 {
        display: none;
      }

      .brand {
        flex: 1;
      }

      .mobile-title {
        display: block;
        font-weight: var(--ddd-font-weight-bold, 700);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
      }

      #listToggle {
        display: inline-flex;
        flex: none;
      }

      #listToggle[hidden] {
        display: none;
      }

      .shortcuts {
        order: 3;
        width: 100%;
      }

      .shortcuts .hax-ui-btn {
        flex: 1;
      }

      .gallery-container {
        display: block;
      }

      .sidebar {
        display: none;
        position: fixed;
        /* where the title bar ends on screen (the network bar above it
           scrolls away), kept current by the gallery script */
        top: var(--gal-bar, 6rem);
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 15;
        width: auto;
        border-right: 0;
      }

      .sidebar.open {
        display: flex;
      }

      .component-list {
        padding-bottom: env(safe-area-inset-bottom, 0px);
      }

      .main-content {
        display: block;
        overflow: visible;
      }

      .demo-header {
        padding: var(--ddd-spacing-4, 16px) var(--ddd-spacing-4, 16px) var(--hax-ui-gap-lg);
      }

      .snippets {
        grid-template-columns: minmax(0, 1fr) auto;
      }

      .snippet-label {
        grid-column: 1 / -1;
        margin-top: var(--hax-ui-gap);
      }

      .toolbar,
      .toolbar-start {
        flex-direction: column;
        align-items: stretch;
      }

      .demo-actions {
        order: -1;
      }

      #fullscreenBtn {
        display: none;
      }

      .view-tabs button {
        flex: 1;
        justify-content: center;
      }

      .demo-frame {
        height: 80vh;
      }

      .docs-pane,
      .licenses-pane {
        height: auto;
        overflow: visible;
        padding: var(--hax-ui-gap-lg) var(--hax-ui-gap-md);
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
        padding: var(--ddd-spacing-10, 40px) var(--ddd-spacing-4, 16px);
      }
    }
  </style>
</head>
<body>
${loader.markup}
  <d-d-d></d-d-d>
  <hax-network-bar current="elements"></hax-network-bar>

  <header class="titlebar hax-ui-dark-chrome" id="mobileBar">
    <div class="brand">
      <span class="brand-mark" aria-hidden="true">HAX</span>
      <h1>Component gallery</h1>
      <span class="brand-stats">${totalComponents} components, ${walkthroughCount} with walkthroughs</span>
      <span class="mobile-title" id="mobileTitle">Component gallery</span>
    </div>
    <button class="hax-ui-btn" id="listToggle" aria-expanded="false" aria-controls="sidebar">Components</button>
${
  haxcmsDemo || appHaxDemo
    ? `    <nav class="shortcuts" aria-label="System demos">
${
  haxcmsDemo
    ? `      <a class="hax-ui-btn" id="haxcmsDemoBtn" href="${haxcmsDemo.demoPath}" target="haxcms-demo" rel="noopener" title="Open the full HAXcms system demo (haxcms-elements) in its own window">Try HAXcms</a>
`
    : ""
}${
        appHaxDemo
          ? `      <a class="hax-ui-btn" id="appHaxDemoBtn" href="${appHaxDemo.demoPath}" target="_blank" rel="noopener" title="Open the AppHax dashboard demo (app-hax) in a new tab">Open AppHax demo</a>
`
          : ""
      }    </nav>
`
    : ""
}  </header>

  <div class="gallery-container">
    <!-- Sidebar with component list -->
    <aside class="sidebar" id="sidebar" aria-label="Components">
      <div class="sidebar-header">
        <simple-fields-field class="hax-ui-simple-field compact search-box"
               type="search"
               id="searchBox"
               label="Search components"
               placeholder="Search components"></simple-fields-field>

        <div class="filter-buttons" role="group" aria-label="Filter components">
          <button class="hax-ui-chip filter-btn" aria-pressed="true" data-filter="all" title="Show all components">
            All <span class="n">${totalComponents}</span>
          </button>
          <button class="hax-ui-chip filter-btn" aria-pressed="false" data-filter="hax" title="Show only HAX-capable components">
            HAX <span class="n">${components.filter((c) => c.isHaxCapable).length}</span>
          </button>
          <button class="hax-ui-chip filter-btn" aria-pressed="false" data-filter="theme" title="Show HAXcms themes">
            Themes <span class="n">${components.filter((c) => c.isTheme).length}</span>
          </button>
          <button class="hax-ui-chip filter-btn" aria-pressed="false" data-filter="instructional" title="Show instructional blocks">
            Instructional <span class="n">${components.filter((c) => c.isInstructional).length}</span>
          </button>
          <button class="hax-ui-chip filter-btn" aria-pressed="false" data-filter="design-system" title="Show DDD and design system bridges">
            Design system <span class="n">${components.filter((c) => c.isDesignSystem).length}</span>
          </button>
          <button class="hax-ui-chip filter-btn" aria-pressed="false" data-filter="walkthrough" title="Show components with an animated walkthrough">
            Walkthrough <span class="n">${walkthroughCount}</span>
          </button>
          <button class="hax-ui-chip filter-btn" aria-pressed="false" data-filter="hax-ecosystem" title="Show HAX ecosystem components">
            hax-* <span class="n">${components.filter((c) => c.name.startsWith("hax-")).length}</span>
          </button>
        </div>

        <button class="hax-ui-btn appearance-toggle" id="appearanceToggle" aria-expanded="false" aria-controls="appearancePanel">
          Appearance <span class="appearance-summary" id="appearanceSummary">DDD</span>
        </button>
        <div class="appearance-panel" id="appearancePanel" role="group" aria-label="Appearance" hidden>
          <simple-fields-field class="hax-ui-simple-field compact" id="systemSelect" type="select" label="Design system"></simple-fields-field>
          <hax-palette-picker id="palettePicker" label="Palette"></hax-palette-picker>
          <p class="appearance-note">Applies to the gallery and the demo, the way a HAXcms site applies a design system and palette. The link keeps your choice.</p>
          <button class="hax-ui-btn" id="appearanceReset">Reset to DDD</button>
        </div>
      </div>

      <p class="rail-label" id="listLabel" aria-live="polite">${totalComponents} shown</p>
      <nav class="component-list" id="componentList" aria-labelledby="listLabel">
        <!-- Components will be populated by JavaScript -->
      </nav>

      <p class="hax-ui-message no-results hidden" id="noResults">No components found</p>

      <footer class="gallery-footer">
        <a href="https://github.com/haxtheweb/webcomponents/blob/master/LICENSE.md" target="_blank" rel="noopener">Apache-2.0 license</a>
        <a href="?view=licenses" id="licensesLink">Third-party licenses</a>
        <a href="https://github.com/haxtheweb/webcomponents" target="_blank" rel="noopener">Source</a>
      </footer>
    </aside>

    <!-- Main content area -->
    <main class="main-content">
      <header class="demo-header hidden" id="demoHeader">
        <div>
          <h2 class="demo-title" id="demoTitle">Component</h2>
          <p class="demo-description" id="demoDescription">Select a component to view its demo and documentation</p>
        </div>

        <div class="snippets">
          <span class="snippet-label">Install</span>
          <code class="snippet-code" id="installationCode" tabindex="0">npm install @haxtheweb/example-element</code>
          <button class="hax-ui-btn ghost" data-copy="installationCode">Copy</button>
          <span class="snippet-label">Import</span>
          <code class="snippet-code" id="usageCode" tabindex="0">import '@haxtheweb/example-element/example-element.js';</code>
          <button class="hax-ui-btn ghost" data-copy="usageCode">Copy</button>
        </div>

        <div class="toolbar">
          <div class="toolbar-start">
            <div class="hax-ui-seg view-tabs" role="tablist" aria-label="View">
              <button class="view-tab" role="tab" id="tabDemo" data-view="demo" aria-selected="true">Live demo</button>
              <button class="view-tab" role="tab" id="tabDocs" data-view="docs" aria-selected="false">Documentation</button>
            </div>
            <div class="demo-selector-container hidden" id="demoSelectorContainer">
              <span aria-hidden="true">Demo</span>
              <simple-fields-field class="hax-ui-simple-field compact demo-selector" id="demoSelector" type="select" label="Demo"></simple-fields-field>
            </div>
          </div>
          <div class="demo-actions">
            <a class="hax-ui-btn" id="newTabBtn" href="#" target="_blank" rel="noopener">Open in new tab</a>
            <button class="hax-ui-btn" id="codepenBtn">Try in CodePen</button>
            <button class="hax-ui-btn" id="fullscreenBtn">Fullscreen</button>
          </div>
        </div>
      </header>

      <div class="stage" id="stage">
        <div class="welcome-message" id="welcomeMessage">
          <div class="hax-ui-empty">
            <strong>Welcome to the HAX web components gallery</strong>
            <p>Choose a component to see its demo, documentation and walkthrough.</p>
          </div>
        </div>
        <div class="stage-progress" aria-hidden="true"></div>
        <iframe class="demo-frame hidden" id="demoFrame" title="Component demo"></iframe>
        <div class="docs-pane hidden" id="docsPane"></div>
        <section class="licenses-pane hidden" id="licensesPane" aria-label="Third-party licenses" tabindex="-1">
          <p>Notices for the CDN build the gallery and HAX sites load their code from. <a id="licensesSourceLink" href="${LICENSES_MD_URL}" target="_blank" rel="noopener">Open the file</a></p>
          <div class="licenses-scroll">
            <md-block id="licensesBlock"></md-block>
          </div>
        </section>
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
    const listLabel = document.getElementById('listLabel');
    const stage = document.getElementById('stage');

    // A demo stays hidden under the stage's progress bar until its page has
    // loaded, so switching components never flashes a blank (white) frame.
    let stageTimer = null;
    function loadDemo(src) {
      stage.classList.add('is-loading');
      clearTimeout(stageTimer);
      stageTimer = setTimeout(() => stage.classList.remove('is-loading'), 8000);
      demoFrame.src = src;
      newTabBtn.href = src;
    }
    demoFrame.addEventListener('load', () => {
      clearTimeout(stageTimer);
      stage.classList.remove('is-loading');
    });
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
        case 'theme':
          components = COMPONENTS.filter(c => c.isTheme);
          break;
        case 'instructional':
          components = COMPONENTS.filter(c => c.isInstructional);
          break;
        case 'design-system':
          components = COMPONENTS.filter(c => c.isDesignSystem);
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
      const query = (searchBox.value || '').toLowerCase().trim();
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
        demoSelector.itemsList = [];
        return;
      }

      demoSelectorContainer.classList.remove('hidden');
      // simple-fields-field draws the options; the main demo is first
      demoSelector.itemsList = demos.map(d => ({ text: d.label, value: d.value }));
      demoSelector.value = demos[0].value;
    }

    // Render component list
    function renderComponentList() {
      filteredComponents = filterComponents();
      componentList.replaceChildren();
      
      listLabel.textContent = filteredComponents.length + ' shown';
      if (filteredComponents.length === 0) {
        noResults.classList.remove('hidden');
        return;
      }
      
      noResults.classList.add('hidden');
      
      filteredComponents.forEach(component => {
        const item = document.createElement('button');
        item.className = 'component-item';
        item.dataset.componentName = component.name;
        
        if (currentComponent && currentComponent.name === component.name) {
          item.setAttribute('aria-current', 'page');
        }

        // [label, tone] pairs; built as text nodes, never HTML strings
        const tags = [];
        if (component.isHaxCapable) tags.push(['HAX', 'accent']);
        if (component.isTheme) tags.push(['Theme', '']);
        if (component.isInstructional) tags.push(['Instructional', 'success']);
        if (component.isDesignSystem) tags.push(['Design system', 'muted']);
        if (component.motionStatus && component.motionStatus !== 'none') {
          tags.push(['Walkthrough', 'info']);
          if (component.motionStatus === 'stale') tags.push(['Needs update', 'warning']);
        }

        const name = document.createElement('div');
        name.className = 'component-item-name';
        name.textContent = '<' + component.name + '>';
        const description = document.createElement('div');
        description.className = 'component-item-description';
        description.textContent = component.description;
        item.append(name, description);
        if (tags.length) {
          const row = document.createElement('div');
          row.className = 'tags';
          tags.forEach(([label, tone]) => {
            const pill = document.createElement('span');
            pill.className = 'hax-ui-pill';
            if (tone) pill.dataset.tone = tone;
            pill.textContent = label;
            row.appendChild(pill);
          });
          item.appendChild(row);
        }
        
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
        if (item.dataset.componentName === component.name) {
          item.setAttribute('aria-current', 'page');
        } else {
          item.removeAttribute('aria-current');
        }
      });
      
      // Update header and info
      demoTitle.textContent = \`<\${component.name}>\`;
      demoDescription.textContent = component.description;
      installationCode.textContent = \`npm install \${component.packageName}\`;
      usageCode.textContent = \`import '\${component.importPath}';\`;
      
      // Build / update demo selector
      buildDemoSelector(component);

      // Show demo header and hide welcome
      licensesPane.classList.add('hidden');
      demoHeader.classList.remove('hidden');
      welcomeMessage.classList.add('hidden');
      demoFrame.classList.remove('hidden');
      
      // Load selected demo in iframe
      loadDemo(currentDemoPath);
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
        btn.setAttribute('aria-pressed', String(btn.dataset.filter === filter));
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
      // value-changed also fires when the gallery sets the value itself, so
      // only a pick that differs from the loaded demo loads a new one
      demoSelector.addEventListener('value-changed', function () {
        if (!currentComponent) {
          return;
        }
        const picked = demoSelector.value || currentComponent.demoPath;
        // only one of this component's own demo pages is ever loaded
        const known = [currentComponent.demoPath].concat(
          (currentComponent.additionalDemos || []).map(d => d.path)
        );
        if (picked === currentDemoPath || known.indexOf(picked) === -1) {
          return;
        }
        currentDemoPath = picked;
        loadDemo(currentDemoPath);
        updateUrlForCurrentDemo();
      });
    }
    
    // Filter button event listeners
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        setActiveFilter(btn.dataset.filter);
      });
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
      const params = new URLSearchParams();
      if (currentComponent) {
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
      }
      if (!currentComponent && !licensesPane.classList.contains('hidden')) {
        params.set('view', 'licenses');
      }
      if (appearance.system) params.set('system', appearance.system);
      if (appearance.palette) params.set('palette', appearance.palette);
      const search = params.toString();
      globalThis.history.replaceState({}, '', globalThis.location.pathname + (search ? '?' + search : ''));
    }

    function applyRouteFromUrl() {
      const slug = getQueryParam('element');
      if (!slug) {
        if (getQueryParam('view') === 'licenses') {
          showLicenses();
        }
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
      // read ?demo= first: selecting the component rewrites the URL
      const demoName = getQueryParam('demo');
      selectComponent(component);
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
          if (demoSelector) {
            demoSelector.value = match.path;
          }
          loadDemo(currentDemoPath);
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
    const mainContent = document.querySelector('.main-content');
    // a phone turned to a wide window: the drawer is a sidebar again
    phone.addEventListener('change', () => {
      mainContent.inert = phone.matches && sidebar.classList.contains('open');
    });
    function setDrawer(open) {
      sidebar.classList.toggle('open', open);
      listToggle.setAttribute('aria-expanded', String(open));
      listToggle.textContent = open ? 'Close' : 'Components';
      // nothing to close back to until a component is chosen
      listToggle.hidden = open && !currentComponent;
      // on phones the drawer covers the page: keep focus out from under it
      mainContent.inert = open && phone.matches;
      placeDrawer();
      if (!open && phone.matches) {
        globalThis.scrollTo(0, 0);
      }
    }
    // the network bar above the title bar scrolls away and the title bar
    // sticks, so the drawer follows the bar's bottom edge on screen
    function placeDrawer() {
      const bottom = Math.max(0, Math.round(mobileBar.getBoundingClientRect().bottom));
      document.documentElement.style.setProperty('--gal-bar', bottom + 'px');
    }
    globalThis.addEventListener('scroll', () => {
      if (sidebar.classList.contains('open')) placeDrawer();
    }, { passive: true });
    globalThis.addEventListener('resize', placeDrawer);
    // the network bar renders after this script runs and pushes the title
    // bar down, so watch both bars' sizes, and settle again once loaded
    if (globalThis.ResizeObserver) {
      const bars = new globalThis.ResizeObserver(placeDrawer);
      bars.observe(mobileBar);
      const network = document.querySelector('hax-network-bar');
      if (network) bars.observe(network);
    }
    globalThis.addEventListener('load', placeDrawer);
    listToggle.addEventListener('click', () => {
      setDrawer(!sidebar.classList.contains('open'));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('open') && currentComponent) {
        setDrawer(false);
        listToggle.focus();
      }
    });

    // Third-party licenses: the CDN build's notices as a page, loaded when
    // the view first opens. Builds published before the Markdown notices
    // only have the plain-text file, shown as preformatted text.
    const licensesPane = document.getElementById('licensesPane');
    const licensesBlock = document.getElementById('licensesBlock');
    const licensesSourceLink = document.getElementById('licensesSourceLink');
    let licensesLoaded = false;
    async function loadLicenses() {
      licensesLoaded = true;
      licensesBlock.markdown = 'Loading the license notices…';
      try {
        const md = await fetch('${LICENSES_MD_URL}');
        if (md.ok) {
          licensesBlock.markdown = await md.text();
          return;
        }
        const text = await fetch('${LICENSES_TEXT_URL}');
        if (!text.ok) {
          throw new Error('not found');
        }
        const body = await text.text();
        // a fence longer than any run of backticks in the text
        const runs = body.match(/\`+/g) || [];
        const longest = runs.reduce((n, r) => Math.max(n, r.length), 0);
        const fence = '\`'.repeat(Math.max(3, longest + 1));
        licensesBlock.markdown = fence + 'text\\n' + body + '\\n' + fence;
        licensesSourceLink.href = '${LICENSES_TEXT_URL}';
      } catch (e) {
        licensesLoaded = false;
        licensesBlock.markdown = 'The license notices could not be loaded. Open the file with the link above.';
      }
    }
    function showLicenses() {
      currentComponent = null;
      currentDemoPath = null;
      document.querySelectorAll('.component-item[aria-current]').forEach(item => item.removeAttribute('aria-current'));
      mobileTitle.textContent = 'Third-party licenses';
      demoHeader.classList.add('hidden');
      welcomeMessage.classList.add('hidden');
      demoFrame.classList.add('hidden');
      docsPane.classList.add('hidden');
      licensesPane.classList.remove('hidden');
      setDrawer(false);
      if (!licensesLoaded) {
        loadLicenses();
      }
      updateUrlForCurrentDemo();
      licensesPane.focus();
    }
    document.getElementById('licensesLink').addEventListener('click', (e) => {
      e.preventDefault();
      showLicenses();
    });

    // Appearance: design system and palette, as a HAXcms site picks them.
    // ?system= is only ever a key of the registry below and ?palette= a
    // DDD palette name, so a link can't load anything else.
    const DESIGN_SYSTEMS = ${designSystemsData};
    const PALETTES = ${palettesData};
    const appearance = { system: '', palette: '' };
    const appearanceToggle = document.getElementById('appearanceToggle');
    const appearancePanel = document.getElementById('appearancePanel');
    const appearanceSummary = document.getElementById('appearanceSummary');
    const systemSelect = document.getElementById('systemSelect');
    const palettePicker = document.getElementById('palettePicker');
    const APPEARANCE_MODULE = new URL('gallery-data/appearance.js', document.baseURI).href;
    {
      const system = getQueryParam('system');
      if (system && DESIGN_SYSTEMS.some(d => d.name === system)) appearance.system = system;
      const palette = getQueryParam('palette');
      if (palette && PALETTES.some(p => p.value === palette)) appearance.palette = palette;
    }
    function appearanceIsDefault() {
      return !appearance.system && !appearance.palette;
    }
    function summarize() {
      const system = DESIGN_SYSTEMS.find(d => d.name === appearance.system);
      const palette = PALETTES.find(p => p.value === appearance.palette);
      appearanceSummary.textContent = (system ? system.title : 'DDD') + (palette ? ' · ' + palette.label : '');
    }
    // mark a document's root and ask the appearance module there to apply it
    function applyTo(doc, win) {
      doc.documentElement.dataset.gallerySystem = appearance.system;
      if (appearance.palette) {
        doc.documentElement.setAttribute('data-palette', appearance.palette);
      } else {
        doc.documentElement.removeAttribute('data-palette');
      }
      win.dispatchEvent(new CustomEvent('gallery-appearance'));
    }
    function applyToFrame() {
      let doc = null;
      try {
        doc = demoFrame.contentDocument;
      } catch (e) {
        return;
      }
      if (!doc || !doc.head) return;
      const loaded = doc.querySelector('script[data-gallery-appearance]');
      // demos are left exactly as they are until a reviewer picks something
      if (!loaded && appearanceIsDefault()) return;
      applyTo(doc, demoFrame.contentWindow);
      if (!loaded) {
        const script = doc.createElement('script');
        script.type = 'module';
        script.src = APPEARANCE_MODULE;
        script.dataset.galleryAppearance = '';
        doc.head.appendChild(script);
      }
    }
    function setAppearance(system, palette) {
      appearance.system = system;
      appearance.palette = palette;
      summarize();
      applyTo(document, globalThis);
      applyToFrame();
      updateUrlForCurrentDemo();
    }
    demoFrame.addEventListener('load', applyToFrame);
    systemSelect.itemsList = [{ text: 'DDD (default)', value: '' }].concat(
      DESIGN_SYSTEMS.map(d => ({ text: d.title, value: d.name }))
    );
    systemSelect.value = appearance.system;
    palettePicker.value = appearance.palette;
    systemSelect.addEventListener('value-changed', () => {
      const value = systemSelect.value || '';
      if (value !== appearance.system && (value === '' || DESIGN_SYSTEMS.some(d => d.name === value))) {
        setAppearance(value, appearance.palette);
      }
    });
    palettePicker.addEventListener('value-changed', (e) => {
      const value = String((e.detail && e.detail.value) || palettePicker.value || '');
      if (value !== appearance.palette && (value === '' || PALETTES.some(p => p.value === value))) {
        setAppearance(appearance.system, value);
      }
    });
    document.getElementById('appearanceReset').addEventListener('click', () => {
      systemSelect.value = '';
      palettePicker.value = '';
      setAppearance('', '');
    });
    appearanceToggle.addEventListener('click', () => {
      const open = appearancePanel.hidden;
      appearancePanel.hidden = !open;
      appearanceToggle.setAttribute('aria-expanded', String(open));
    });
    summarize();
    applyTo(document, globalThis);

    // Initialize
    renderComponentList();
    applyRouteFromUrl();
    if (!currentComponent && licensesPane.classList.contains('hidden')) {
      setDrawer(phone.matches);
    }
  </script>
</body>
</html>`;
}

// Generate the gallery
console.log("Scanning components...");
buildDocsData();
copyAppearanceModule();
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
