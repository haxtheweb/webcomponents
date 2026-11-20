// node --test scripts/test/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isDirectHAXcmsTheme,
  declaresAcceptsDesignSystems,
  extractTextDocblockTag,
  buildThemeEntry,
} from "../theme-discovery.mjs";

test("a class extending HAXCMSLitElementTheme, through mixins, is a theme", () => {
  assert.equal(
    isDirectHAXcmsTheme("class A extends HAXCMSLitElementTheme {}"),
    true,
  );
  assert.equal(
    isDirectHAXcmsTheme("class A extends DDDSuper(HAXCMSLitElementTheme) {}"),
    true,
  );
  assert.equal(
    isDirectHAXcmsTheme(
      "class A extends HAXCMSOperationButtons(\n  HAXCMSThemeParts(DDDSuper(HAXCMSLitElementTheme)),\n) {}",
    ),
    true,
  );
});

test("a file that only mentions HAXCMSLitElementTheme is not a theme", () => {
  // svg-contrast's header comment mentions the base class it is used with
  const util =
    "/** Used by any HAXCMSLitElementTheme to pick a fill */\nexport function svgContrast() {}\nclass Helper extends LitElement {}";
  assert.equal(isDirectHAXcmsTheme(util), false);
});

test("acceptsDesignSystems must return true to count", () => {
  assert.equal(
    declaresAcceptsDesignSystems(
      "static get acceptsDesignSystems() {\n    return true;\n  }",
    ),
    true,
  );
  assert.equal(
    declaresAcceptsDesignSystems(
      "static get acceptsDesignSystems() { return false; }",
    ),
    false,
  );
});

test("browsing facets come from docblock tags", () => {
  const content = `/**
 * @haxcms-theme-category Website, Blog
 * @haxcms-theme-layout Single column
 * @haxcms-theme-inspired-by Hugo
 * @haxcms-theme-inspired-by-theme PaperMod
 * @haxcms-theme-description A quiet reading column for posts.
 * @element demo-theme
 */
class DemoTheme extends HAXCMSLitElementTheme {}`;
  assert.equal(
    extractTextDocblockTag(content, "haxcms-theme-layout"),
    "Single column",
  );
  const entry = buildThemeEntry(
    content,
    "./elements/demo-theme/demo-theme.js",
    "demo-theme",
  );
  assert.deepEqual(entry.category, ["Website", "Blog"]);
  assert.equal(entry.layout, "Single column");
  assert.equal(entry.designSystem, null);
  // the project is the browsing group; its theme is kept apart
  assert.equal(entry.inspiredBy, "Hugo");
  assert.equal(entry.inspiredByTheme, "PaperMod");
  assert.equal(entry.description, "A quiet reading column for posts.");
  assert.equal(entry.acceptsDesignSystems, false);
});

test("without a description tag the generated one stays", () => {
  const entry = buildThemeEntry(
    "/** @element demo-theme */ class DemoTheme extends HAXCMSLitElementTheme {}",
    "./elements/demo-theme/demo-theme.js",
    "demo-theme",
  );
  assert.match(entry.description, /blank site/i);
  assert.equal(entry.layout, null);
});
