// kittens cry but really really really crude HTML DOM polyfill for nodejs
import "@haxtheweb/utils/lib/nodejs-fake-dom-polyfill.cjs";
// load our wiring class
import * as tmp from 'gulp';
const gulp = tmp.default;
import * as tmp3 from "fs";
const fs = tmp3.default;
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

// fake class

class HAXWiring {
  /**
 * Return a haxProperties prototype / example structure
 */
  prototypeHaxProperties = () => {
    // example properties valid for HAX context menu.
    let props = {
      api: "1",
      type: "element",
      editingElement: "core",
      hideDefaultSettings: false,
      canScale: true,

      canEditSource: true,
      contentEditable: false,
      gizmo: {
        title: "Tag name",
        description: "",
        icon: "icons:android",
        color: "purple",
        tags: ["Other"],
        handles: [
          {
            type: "data",
            type_exclusive: false,
            url: "src",
          },
        ],
        meta: {
          author: "auto",
        },
        requiresChildren: false,
        requiresParent: false,
      },
      settings: {
        configure: [
          {
            slot: "",
            title: "Inner content",
            description: "The slotted content that lives inside the tag",
            inputMethod: "textfield",
            icon: "android",
            required: true,
            validationType: "text",
          },
          {
            slot: "button",
            title: "Button content",
            description: "The content that can override the button",
            inputMethod: "textfield",
            icon: "android",
            required: true,
            validationType: "text",
          },
          {
            property: "title",
            title: "Title",
            description: "",
            inputMethod: "textfield",
            icon: "android",
            required: true,
            validationType: "text",
          },
          {
            property: "primaryColor",
            title: "Title",
            description: "",
            inputMethod: "textfield",
            icon: "android",
            required: false,
            validation: ".*",
            validationType: "text",
          },
        ],
        advanced: [
          {
            property: "secondaryColor",
            title: "Secondary color",
            description:
              "An optional secondary color used in certain edge cases.",
            inputMethod: "colorpicker",
            icon: "color",
          },
          {
            property: "endPoint",
            title: "API endpoint",
            description:
              "An optional endpoint to hit and load in more data dymaically.",
            inputMethod: "textfield",
            icon: "android",
            validation: "[a-z0-9]",
            validationType: "url",
          },
        ],
        developer: [],
      },
      saveOptions: {
        wipeSlot: false,
        unsetAttributes: ["end-point", "secondary-color"],
      },
      documentation: {
        howTo: "https://haxtheweb.org/welcome",
        purpose: "https://haxtheweb.org/welcome",
      },
      demoSchema: [
        {
          tag: "my-tag",
          content: "<p>inner html</p>",
          properties: {
            endPoint: "https://cdn2.thecatapi.com/images/9j5.jpg",
            primaryColor: "yellow",
            title: "A cat",
          },
        },
      ],
    };
    return props;
  };
}

// merge the web component factory libraries the user has installed 
// (plain stream collection; gulp-concat-util pulled in the unpatched
// lodash.template, Dependabot alert 207)
gulp.task("default", () => {
  const parts = [];
  return new Promise((resolve, reject) => {
    gulp
      .src("../../templates/libraries/**/package.json")
      .on("data", (file) => {
        if (file.contents) {
          parts.push(file.contents.toString() + ",");
        }
      })
      .on("error", reject)
      .on("end", () => {
        fs.writeFileSync(".wcflibcache.json", "[" + parts.join("\n") + "{}]");
        resolve();
      });
  });
});

// merge the web component factory libraries the user has installed 
gulp.task("haxschema", async () => {
  const hax = new HAXWiring();
  const args = yargs(hideBin(process.argv))
  .command('curl <url>', 'fetch the contents of the URL', () => {}, (argv) => {
    console.info(argv)
  })
  .demandCommand(1)
  .parse();
  const tagName = args.element;
  const ceFileData = fs.readFileSync(`./elements/${tagName}/custom-elements.json`,'utf8', (error, data) => {
    if(error){
       console.warn(error);
       return;
    }
    return data;
  });
  if (ceFileData) {
    let ce = JSON.parse(ceFileData);
    await ce.tags.forEach(async (tag) => {
      if (tag.name === tagName) {
        let props = hax.prototypeHaxProperties();
        props.gizmo.title = tagName.replace('-', ' ');
        props.gizmo.tags = ["Other"];
        props.gizmo.handles = [];
        props.gizmo.meta.author = "HAXTheWeb core team";
        delete props.gizmo.shortcutKey;
        delete props.gizmo.requiresChildren;
        delete props.gizmo.requiresParent;
        props.settings.configure = [];
        props.settings.advanced = [];
        props.documentation = {
          howTo: null,
          purpose: null
        };
        props.saveOptions = {
          unsetAttributes: []
        };
        props.demoSchema = [
          {
            tag: tagName,
            content: "",
            properties: {
            }
          }
        ];
        let propData = [];
        if (tag.properties) {
          propData = tag.properties;
        }
        else if (tag.attributes) {
          propData = tag.attributes;
        }
        // didn't have one, so guess
        if (!tag.path) {
          tag.path = `./elements/${tagName}/${tagName}.js`;
        }
        // loop through and if props are things we can map then do it
        await propData.forEach(async (prop) => {
          if (["t","colors",'_haxState',"elementVisible", "element-visible"].includes(prop.name)) {
            props.saveOptions.unsetAttributes.push(prop.name);
          }
          else {
            let type = "textfield";
            if (prop.type) {
              type = getInputMethodFromType(prop.type);
            }
            else if (prop.description && prop.description.includes("boolean")) {
              type = "boolean";
            }
            else if (prop.description && prop.description.includes("number")) {
              type = "number";
            }
            if (type) {
              let propSchema = {
                property: prop.name,
                title: prop.name,
                description: prop.description || "",
                inputMethod: type,
              };
              if (prop.default !== undefined) {
                props.demoSchema[0].properties[prop.name] = prop.default;
              }
              props.settings.configure.push(propSchema);
            }
          }
        });
        if (!args.write) {
        console.log(`\n\n--------------------------\n${tagName} HAX schema\n--------------------------\n`);
        console.log(JSON.stringify(props, null, 2));
        }
        else if (args.write) {
          fs.writeFileSync(`./elements/${tagName}/lib/${tagName}.haxProperties.json`, JSON.stringify(props, null, 2));
          console.log(`schema written to: ./elements/${tagName}/lib/${tagName}.haxProperties.json`)
        }
        console.log(`\n--------------------------\n Psuedo code to add: ${tag.path}\n--------------------------`);
        console.log(`
  /**
   * Convention we use
   */
  static get tag() {
    return "${tagName}";
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(\`./lib/\${this.tag}.haxProperties.json\`, import.meta.url).href;
  }
  
`);
      }
    });
  } 
  return true;
});

function getInputMethodFromType(type) {
  switch (type) {
    case "string":
      return "textfield";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
  }
  return false;
}

// HAX BUILD ROUTINE FOR CLEANING UP ASSETS AFTER BUILD

import * as tmp5 from "glob";
const glob = tmp5.default;
import * as tmp6 from "path";
const path = tmp6.default;

import packageVm from "./node_modules/@haxtheweb/haxcms-elements/package.json" with { type: "json" };
// mirror version numbers
gulp.task(
  "version-match", async () => {
    fs.writeFileSync('./.version', packageVm.version , {encoding:'utf8',flag:'w'});
    console.log(`${packageVm.version} written to .version`);
    // warn when a sibling package (haxcms-nodejs, create, ...) is already
    // ahead of this release version; ubiquity-push.sh refuses to release then
    execSync('node scripts/check-ecosystem-version.mjs', { stdio: 'inherit' });
  }
);
// JS minification of the build is scripts/terser-build.mjs (`yarn run terser`):
// the same terser options the gulp task here used, on every core, with results
// remembered between builds. It skips monaco-editor, h5p-standalone
// and the vendored mermaid bundle, which the vendor-copy tasks below copy in
// as they are.
// monaco-editor/min is Monaco's own minified build: workers and editor chunks
// that code-editor loads by path at runtime. Parsing and re-minifying 18MB of
// already minified code was the slowest part of a build and made the largest
// file bigger, so it is copied as Monaco ships it. The TypeScript language
// service is left out, as before.
gulp.task("vendor-copy-monaco", () => {
  return gulp.src([
    './node_modules/monaco-editor/min/**',
    '!./node_modules/monaco-editor/min/vs/language/typescript/*'
  ], { base: '.', encoding: false }).pipe(gulp.dest('./build/es6/'));
});
// h5p-element loads the h5p-standalone player at runtime from
// node_modules/h5p-standalone/dist (scripts, styles, fonts and images). No
// module imports it, so the polymer build never saw it; copy the dist as shipped.
gulp.task("vendor-copy-h5p", () => {
  return gulp.src([
    './node_modules/h5p-standalone/dist/**',
    '!./node_modules/h5p-standalone/dist/**/*.d.ts'
  ], { base: '.', encoding: false }).pipe(gulp.dest('./build/es6/'));
});
// @haxtheweb/la-tex/lib/latex2html5.js is a pre-transpiled browserify UMD
// bundle loaded as a classic script via es-global-bridge (no ESM
// imports/import.meta), so polymer-build's Babel pass has nothing useful to
// do to it. Worse, jsTransform's replaceTemplateObjectNames() mints a fresh
// UUID v1 onto every `_templateObject` identifier on each run, so the
// committed bytes change every ubiquity build even though nothing meaningful
// changed. Copy it verbatim from node_modules and let the terser step
// minify it (terser is deterministic), which keeps the file byte-stable
// build-to-build while staying ~529KB instead of the 1.59MB raw source.
gulp.task("vendor-copy-latex2html5", () => {
  return gulp.src([
    './node_modules/@haxtheweb/la-tex/lib/latex2html5.js',
  ], { base: '.' }).pipe(gulp.dest('./build/es6/'));
});
// MathJax 4 (Apache-2.0) is a runtime dependency of @haxtheweb/lrn-math and
// is shared with la-tex through lrn-math/lib/mathjax-loader.js, which loads
// it by path (no module imports it, so the polymer build never sees it).
// Copy what it loads at runtime, as the MathJax team ships it: the TeX to
// SVG component, the TeX extensions, accessibility (speech) and menu code
// it loads on demand, and the SVG data of its font and the font
// extensions some TeX packages need (scripts/mathjax-runtime-files.json,
// which PR previews read too). Upgrading MathJax is a version bump
// in lrn-math/package.json. The @mathjax packages carry their license
// (Apache-2.0) in package.json, which is copied with them.
gulp.task("vendor-copy-mathjax", () => {
  const { paths } = JSON.parse(
    fs.readFileSync("./scripts/mathjax-runtime-files.json", "utf8"),
  );
  return gulp.src(
    paths.map((p) =>
      fs.statSync(`./node_modules/${p}`).isDirectory()
        ? `./node_modules/${p}/**`
        : `./node_modules/${p}`,
    ),
    { base: '.', encoding: false },
  ).pipe(gulp.dest('./build/es6/'));
});
// @haxtheweb/mermaid-diagram/lib/mermaid/mermaid.min.js is the unmodified,
// already-minified mermaid dist bundle (see its README for version and
// sha256). It uses class static blocks, which polymer-build's babylon parser
// rejects ("js-transform: Unable to optimize"), and it is loaded as a classic
// script through es-global-bridge, so there is nothing for Babel or terser to
// do. Copy it verbatim so the shipped file matches the recorded hash.
gulp.task("vendor-copy-mermaid", () => {
  return gulp.src([
    './node_modules/@haxtheweb/mermaid-diagram/lib/mermaid/mermaid.min.js',
  ], { base: '.' }).pipe(gulp.dest('./build/es6/'));
});
// https://html.spec.whatwg.org/multipage/scripting.html#valid-custom-element-name
const reservedNames = new Set([
	'annotation-xml',
	'color-profile',
	'font-face',
	'font-face-src',
	'font-face-uri',
	'font-face-format',
	'font-face-name',
	'missing-glyph'
]);

function hasError(name) {
	if (!name) {
		return 'Missing element name.';
	}

	if (/[A-Z]/.test(name)) {
		return 'Custom element names must not contain uppercase ASCII characters.';
	}

	if (!name.includes('-')) {
		return 'Custom element names must contain a hyphen. Example: unicorn-cake';
	}

	if (/^\d/i.test(name)) {
		return 'Custom element names must not start with a digit.';
	}

	if (/^-/i.test(name)) {
		return 'Custom element names must not start with a hyphen.';
	}

	if (reservedNames.has(name)) {
		return 'The supplied element name is reserved and can\'t be used.\nSee: https://html.spec.whatwg.org/multipage/scripting.html#valid-custom-element-name';
	}
}

function validateElementName(name) {
	const errorMessage = hasError(name);
	return !errorMessage;
}
// build output paths (relative to build/es6/node_modules) that hold AMD /
// non-ESM vendor bundles and must not contribute tags to wc-registry.json
const NON_ESM_VENDOR_PREFIXES = ["monaco-editor/min/", "mathjax/", "@mathjax/"];
gulp.task("wc-autoloader", async () => {
  glob(path.join("./build/es6/node_modules/**/*.js"), (er, files) => {
    let elements = {};
    // tags a file defines after its first one; used only for tags that no
    // file defines first
    let secondaryElements = {};
    // adjacency map: fLocation -> array of raw static import specifiers
    // (relative paths as written in the built file). Used below to compute
    // per-tag transitive static-import closures for wc-registry-graph.json.
    // This is a server-side build artifact consumed by the HAXcms PHP/NodeJS
    // backends to emit accurate, capped modulepreload hints; it is NOT
    // fetched by the browser, so zero added runtime cost.
    let importsByFile = {};
    // regex for static ESM import/export...from "x.js" and side-effect import "x.js"
    // (dynamic import("x") uses parens and does not match; import.meta has no quote)
    const staticImportRegex = /(?:from|import)\s*["']([^"']+\.js)["']/g;
    // async loop over files
    files.forEach((file) => {
      // grab the name of the file
      if (fs.existsSync(file)) {
        let fLocation = file.replace("build/es6/node_modules/", "");
        const contents = fs.readFileSync(file, "utf8");
        // collect static imports for the graph adjacency (same pass, no re-read)
        let importMatches = [];
        let im;
        staticImportRegex.lastIndex = 0;
        while ((im = staticImportRegex.exec(contents)) !== null) {
          importMatches.push(im[1]);
        }
        importsByFile[fLocation] = importMatches;
        // Vendored AMD bundles are not ES modules, so nothing can import them
        // through the registry; any customElements.define in them is the
        // library's own internal element (Monaco's minified build defines
        // "connection-observer"). Keep them out of wc-registry.json.
        if (NON_ESM_VENDOR_PREFIXES.some((prefix) => fLocation.startsWith(prefix))) {
          return;
        }
        // This Regex is looking for tags that are defined by string values
        // this will work for customElements.define("local-time",s))
        // This will NOT work for customElements.define(LocalTime.tagName,s))
        // Every tag a file defines is recorded, not only the first: a file
        // such as @google/model-viewer defines several ("extra-model", then
        // "model-viewer") and each must resolve to a file that defines it.
        // The first define keeps the mapping it always had; later ones only
        // fill tags no file defines first (merged after the loop).
        const definedTags = Array.from(
          contents.matchAll(/customElements\.define\(["'`](.*?)["'`]/gm),
          (match) => match[1],
        ).filter((tag) => validateElementName(tag));
        // basic
        if (definedTags.length > 0) {
          elements[definedTags[0]] = fLocation;
          definedTags.slice(1).forEach((tag) => {
            if (!secondaryElements[tag]) {
              secondaryElements[tag] = fLocation;
            }
          });
        }
        // .tag calls
        else {
          const hasDefine = /customElements\.define\((.*?),(.*?)\)/gm.exec(
            contents
          );
          // check for a define still
          if (hasDefine && hasDefine[1] && hasDefine[1].includes('.tag')) {
            const tagStatements = /static get tag\(\){return"(.*?)"}/gm.exec(
              contents
            );
            if (tagStatements && validateElementName(tagStatements[1])) {
              elements[tagStatements[1]] = fLocation;
            }
          }
          else if (hasDefine && hasDefine[1] && hasDefine[1].includes('.is')) {
            const tagStatements = /static get is\(\){return"(.*?)"}/gm.exec(
              contents
            );
            if (tagStatements && validateElementName(tagStatements[1])) {
              elements[tagStatements[1]] = fLocation;
            }
          }
          else {
            if (!hasDefine) {
              // support for polymer legacy class housing
              const PolymerLegacy = /is\:\"(.*?)\"/gm.exec(
                contents
              );
              if (PolymerLegacy && PolymerLegacy[1] && validateElementName(PolymerLegacy[1])) {
                elements[PolymerLegacy[1]] = fLocation;
              }
              else {
                // if we got here, it wasn't a file w/ a custom element definition
                // so it's not an entry point
              }
            }
          }
        }
      }
    });
    Object.keys(secondaryElements).forEach((tag) => {
      if (!elements[tag]) {
        elements[tag] = secondaryElements[tag];
      }
    });

    // -- build wc-registry-graph.json (Phase 1 of the magic-script perf plan) --
    // For each registered tag, BFS the static-import graph from its entry
    // point to collect the transitive module closure. Intern all paths into
    // a single `paths` array and map each tag to { e: entryIdx, d: directIdxs,
    // c: closureIdxs }. Backends use `d` (depth-1) to emit capped (<=12,
    // depth<=2) modulepreload hints and `c` for idle editor warmup.
    const NODE_MODULES_BASE = path.resolve("build/es6/node_modules");
    // resolve a raw relative import (as written in fromFile) to a
    // registry-relative location key; null for non-relative/out-of-tree/missing
    function resolveImportLocation(fromFile, importPath) {
      if (!importPath) return null;
      // only relative specifiers are present in the built tree; skip bare/URL
      if (importPath.charAt(0) !== "." && importPath.charAt(0) !== "/") {
        return null;
      }
      const resolved = path.resolve(path.dirname(fromFile), importPath);
      if (resolved.indexOf(NODE_MODULES_BASE) !== 0) return null;
      let rel = path.relative(NODE_MODULES_BASE, resolved);
      if (!rel) return null;
      rel = rel.split(path.sep).join("/");
      if (!rel.endsWith(".js")) return null;
      return rel;
    }
    // set of all registry-relative locations that actually exist on disk
    const fileSet = new Set();
    for (const k in importsByFile) fileSet.add(k);
    // intern all paths into a single `paths` array and build the full
    // adjacency map `adj` (path index -> array of import path indices).
    // Storing adjacency (not just per-tag closures) lets the backend helper
    // compute depth-<=2 preloads for ANY entry -- shell lib modules
    // (haxcms-site-builder, site-store, etc. which are NOT custom-element
    // tags), the active theme entry, and content tags alike.
    const graphPaths = [];
    const graphPathIndex = {};
    function internPath(p) {
      if (!(p in graphPathIndex)) {
        graphPathIndex[p] = graphPaths.length;
        graphPaths.push(p);
      }
      return graphPathIndex[p];
    }
    // adjacency as a plain object: { "pathIdx": [importIdx, ...], ... }
    // (JSON object keys are strings; the helper casts back to numbers).
    // Only entries with at least one in-tree import are stored to save bytes.
    const graphAdj = {};
    for (const fLoc in importsByFile) {
      const fromIdx = internPath(fLoc);
      const imports = importsByFile[fLoc] || [];
      const outIdxs = [];
      for (let j = 0; j < imports.length; j++) {
        const resolved = resolveImportLocation(
          "build/es6/node_modules/" + fLoc,
          imports[j]
        );
        if (resolved) outIdxs.push(internPath(resolved));
      }
      if (outIdxs.length) graphAdj[fromIdx] = outIdxs;
    }
    // tags: tag name -> entry path index. The helper resolves the entry and
    // walks `adj` for direct imports (content-tag preload) or full closure
    // (editor warmup).
    const graphTags = {};
    for (const tag in elements) {
      if (fileSet.has(elements[tag])) {
        graphTags[tag] = internPath(elements[tag]);
      }
    }
    const graphJson = JSON.stringify({
      paths: graphPaths,
      adj: graphAdj,
      tags: graphTags,
    });
    // write graph to the same locations as wc-registry.json so backends
    // can read it co-located with the flat registry
    fs.writeFileSync("./wc-registry-graph.json", graphJson, {encoding:'utf8',flag:'w'});
    fs.writeFileSync("./dist/wc-registry-graph.json", graphJson, {encoding:'utf8',flag:'w'});
    fs.writeFileSync("./elements/haxcms-elements/demo/wc-registry-graph.json", graphJson, {encoding:'utf8',flag:'w'});
    fs.writeFileSync("./elements/replace-tag/demo/wc-registry-graph.json", graphJson, {encoding:'utf8',flag:'w'});
    // write entries to file
    fs.writeFileSync(
      "./wc-registry.json",
      JSON.stringify(elements),
      {encoding:'utf8',flag:'w'}
    );
    // write entries to demo for local work
    fs.writeFileSync(
      "./dist/wc-registry.json",
      JSON.stringify(elements),
      {encoding:'utf8',flag:'w'}
    );
    // write entries to demo for local work
    fs.writeFileSync(
      "./elements/haxcms-elements/demo/wc-registry.json",
      JSON.stringify(elements),
      {encoding:'utf8',flag:'w'}
    );
    // write entries to demo for local work
    fs.writeFileSync(
      "./elements/replace-tag/demo/wc-registry.json",
      JSON.stringify(elements),
      {encoding:'utf8',flag:'w'}
    );
  });
});

import { execSync } from 'child_process';

gulp.task("theme-discovery", async () => {
  try {
    // the release build also syncs themes.json into ../haxcms-nodejs and ../haxcms-php
    execSync('node scripts/theme-discovery.mjs --sync-platforms', { stdio: 'inherit' });
    // design systems a site can pick separately from its theme
    execSync('node scripts/design-system-discovery.mjs', { stdio: 'inherit' });
    console.log('✅ Theme discovery completed successfully');
    console.log('');
    console.log('📷 Theme Screenshots:');
    console.log('   To generate/update theme screenshots run:');
    console.log('   🔄 yarn run theme-screenshots');
    console.log('   ⚠️  Note: This takes 3-4 minutes to complete and is not needed often.');
    console.log('   ℹ️  Screenshots are only needed when themes are added/modified.');
    console.log('');
  } catch (error) {
    console.error('❌ Theme discovery failed:', error.message);
  }
});

gulp.task("hax-elements-discovery", async () => {
  try {
    execSync('node scripts/hax-elements-discovery.mjs', { stdio: 'inherit' });
    console.log('✅ HAX elements discovery completed successfully');
  } catch (error) {
    console.error('❌ HAX elements discovery failed:', error.message);
  }
});

gulp.task("hax-elements-demo-page", async () => {
  try {
    execSync('node scripts/hax-elements-demo-page.mjs', { stdio: 'inherit' });
    console.log('✅ HAX elements demo page generated successfully');
  } catch (error) {
    console.error('❌ HAX elements demo page generation failed:', error.message);
  }
});

gulp.task("theme-screenshots", async () => {
  try {
    execSync('node elements/haxcms-elements/automation/puppeteer-theme-automation.js', { stdio: 'inherit' });
    console.log('✅ Theme screenshots generated successfully');
  } catch (error) {
    console.error('❌ Theme screenshot generation failed:', error.message);
  }
});
