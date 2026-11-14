// The site design system registry (haxtheweb/issues#3350) stays in step with
// the DDD bridges: every bridge a site can pick has an entry whose module
// exists and exports the activate function the site builder calls, and no
// entry points at a bridge that is gone.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  HAXCMS_DESIGN_SYSTEMS,
  getDesignSystemEntry,
  siteDesignSystemName,
} from "../../elements/haxcms-elements/lib/core/utils/haxcms-design-systems.js";

const ELEMENTS = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "elements",
);
// bridges a site never picks for another theme
const THEME_ONLY = new Set(["keepcase"]);

function bridges() {
  return fs
    .readdirSync(ELEMENTS)
    .filter((dir) =>
      fs.existsSync(path.join(ELEMENTS, dir, "design-system", "bridge.json")),
    )
    .map((dir) => ({
      dir,
      bridge: JSON.parse(
        fs.readFileSync(
          path.join(ELEMENTS, dir, "design-system", "bridge.json"),
          "utf8",
        ),
      ),
    }));
}

test("every pickable bridge has a registry entry that matches it", () => {
  const found = bridges().filter(({ bridge }) => !THEME_ONLY.has(bridge.system));
  assert.ok(found.length > 0, "bridges found");
  for (const { dir, bridge } of found) {
    const entry = getDesignSystemEntry(bridge.system);
    assert.ok(entry, `${bridge.system} (${dir}) is in the registry`);
    assert.equal(entry.theme, dir, `${bridge.system} theme`);
    assert.equal(entry.title, bridge.title, `${bridge.system} title`);
  }
  assert.equal(HAXCMS_DESIGN_SYSTEMS.length, found.length, "no extra entries");
});

test("every entry's module exists and exports its activate function", () => {
  for (const entry of HAXCMS_DESIGN_SYSTEMS) {
    const file = path.join(ELEMENTS, entry.module);
    assert.ok(fs.existsSync(file), `${entry.module} exists`);
    const source = fs.readFileSync(file, "utf8");
    assert.match(
      source,
      new RegExp(`export function ${entry.activate}\\(`),
      `${entry.module} exports ${entry.activate}`,
    );
  }
});

test("site data resolves to a registry name or plain DDD", () => {
  assert.equal(siteDesignSystemName(null), "ddd");
  assert.equal(siteDesignSystemName({}), "ddd");
  assert.equal(siteDesignSystemName({ designSystem: "" }), "ddd");
  assert.equal(siteDesignSystemName({ designSystem: "ddd" }), "ddd");
  assert.equal(siteDesignSystemName({ designSystem: " Carbon " }), "carbon");
  // a name this build does not ship falls back to DDD
  assert.equal(siteDesignSystemName({ designSystem: "keepcase" }), "ddd");
  assert.equal(siteDesignSystemName({ designSystem: "nope" }), "ddd");
});
