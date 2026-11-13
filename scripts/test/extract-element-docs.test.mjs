// Docs data must not depend on whether an element was built first: with no
// custom-elements.json on disk the extractor generates the same manifest in
// memory, so attributes and surface hashes match a real `cem analyze`.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { extractElementDocs } from "../extract-element-docs.mjs";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const EXTRACT = path.join(ROOT, "scripts", "extract-element-docs.mjs");
const CEM_CLI = path.join(
  ROOT,
  "node_modules",
  "@custom-elements-manifest",
  "analyzer",
  "cem.js",
);

const ELEMENT = `import { LitElement, html } from "lit";
/**
 * \`docs-probe\`
 * A tiny element for the docs extractor tests.
 * @fires probe-changed - when the value changes
 */
class DocsProbe extends LitElement {
  static get tag() {
    return "docs-probe";
  }
  static get properties() {
    return {
      /**
       * What the probe shows
       */
      label: { type: String },
      /**
       * Base URL for the probe's assets
       */
      assetPath: { type: String, attribute: "asset-path" },
    };
  }
  constructor() {
    super();
    this.label = "probe";
    this.assetPath = "";
  }
  render() {
    return html\`\${this.label}\`;
  }
}
globalThis.customElements.define(DocsProbe.tag, DocsProbe);
`;

// lib/ is outside the build's --globs for the second probe
const LIB = `/** never analyzed by a {*}.js build */
export class Outside extends HTMLElement {
  static get properties() {
    return { hidden2: { type: String } };
  }
}
`;

function probe(globs = "{*,lib/**}.js") {
  const elements = fs.mkdtempSync(path.join(os.tmpdir(), "docs-probe-"));
  const dir = path.join(elements, "docs-probe");
  fs.mkdirSync(path.join(dir, "lib"), { recursive: true });
  fs.writeFileSync(path.join(dir, "docs-probe.js"), ELEMENT);
  fs.writeFileSync(path.join(dir, "lib", "outside.js"), LIB);
  fs.writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify(
      {
        name: "@haxtheweb/docs-probe",
        version: "1.0.0",
        main: "docs-probe.js",
        scripts: {
          build: `cem analyze --litelement --exclude "(public|*.stories.js)" --globs "${globs}" && node ../../scripts/extract-element-docs.mjs --write .`,
        },
      },
      null,
      2,
    ),
  );
  return { elements, dir };
}

const hasAnalyzer = fs.existsSync(CEM_CLI);

test(
  "an element without a manifest keeps its attribute docs",
  {
    skip: !hasAnalyzer && "analyzer not installed",
  },
  () => {
    const { elements, dir } = probe();
    const docs = extractElementDocs("docs-probe", elements);
    const label = docs.attributes.find((a) => a.property === "label");
    const asset = docs.attributes.find((a) => a.property === "assetPath");
    assert.equal(label.description, "What the probe shows");
    assert.equal(label.default, '"probe"');
    assert.equal(asset.name, "asset-path");
    assert.equal(asset.description, "Base URL for the probe's assets");
    assert.ok(docs.events.includes("probe-changed"));
    // nothing is written into the element folder
    assert.equal(fs.existsSync(path.join(dir, "custom-elements.json")), false);
    fs.rmSync(elements, { recursive: true, force: true });
  },
);

test(
  "docs data and surface hash match a real cem analyze build",
  {
    skip: !hasAnalyzer && "analyzer not installed",
  },
  () => {
    for (const globs of ["{*,lib/**}.js", "{*}.js"]) {
      const { elements, dir } = probe(globs);
      const before = extractElementDocs("docs-probe", elements);
      execFileSync(
        process.execPath,
        [
          CEM_CLI,
          "analyze",
          "--litelement",
          "--exclude",
          "(public|*.stories.js)",
          "--globs",
          globs,
          "--quiet",
        ],
        { cwd: dir, stdio: "ignore" },
      );
      assert.ok(fs.existsSync(path.join(dir, "custom-elements.json")));
      const after = extractElementDocs("docs-probe", elements);
      assert.deepEqual(after.attributes, before.attributes, globs);
      assert.deepEqual(after.events, before.events, globs);
      assert.equal(after.surfaceHash, before.surfaceHash, globs);
      fs.rmSync(elements, { recursive: true, force: true });
    }
  },
);

test("without the analyzer it warns instead of silently thinning the data", () => {
  const { elements } = probe();
  const r = spawnSync(process.execPath, [EXTRACT, "--status", "docs-probe"], {
    cwd: ROOT,
    env: { ...process.env, CEM_ANALYZER_DIR: path.join(elements, "nowhere") },
    encoding: "utf8",
  });
  assert.match(r.stderr, /analyzer not found/);
  fs.rmSync(elements, { recursive: true, force: true });
});

test("an apostrophe in a comment does not hide inline haxProperties", () => {
  const { elements, dir } = probe();
  const src = ELEMENT.replace(
    "  render() {",
    `  static get haxProperties() {
    return {
      designSystem: {
        // the probe's layout is fixed, so no text alignment
        textAlign: false,
      },
      /* it's a "probe" */
      gizmo: { title: "Probe" },
      settings: {
        configure: [{ property: "label", title: "Label", inputMethod: "textfield" }],
      },
    };
  }
  render() {`,
  );
  fs.writeFileSync(path.join(dir, "docs-probe.js"), src);
  const docs = extractElementDocs("docs-probe", elements);
  assert.equal(docs.hax.gizmo.title, "Probe");
  assert.equal(docs.hax.settings.configure[0].property, "label");
  fs.rmSync(elements, { recursive: true, force: true });
});

test("the class named for the tag wins over a helper class declared first", () => {
  const { elements, dir } = probe();
  // a built manifest where a helper class (no tagName) comes before the
  // element's own class in the main module, as in license-element
  const manifest = {
    schemaVersion: "1.0.0",
    modules: [
      {
        kind: "javascript-module",
        path: "docs-probe.js",
        declarations: [
          { kind: "class", name: "probeHelper", attributes: [] },
          {
            kind: "class",
            name: "DocsProbe",
            tagName: "docs-probe",
            attributes: [
              {
                name: "label",
                fieldName: "label",
                description: "What the probe shows",
              },
            ],
          },
        ],
      },
    ],
  };
  fs.writeFileSync(
    path.join(dir, "custom-elements.json"),
    JSON.stringify(manifest),
  );
  const docs = extractElementDocs("docs-probe", elements);
  const label = docs.attributes.find((a) => a.property === "label");
  assert.equal(label.description, "What the probe shows");
  fs.rmSync(elements, { recursive: true, force: true });
});
