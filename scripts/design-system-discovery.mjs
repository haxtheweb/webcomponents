#!/usr/bin/env node

/**
 * Design system discovery
 *
 * Lists the design systems a site can pick separately from its theme
 * (metadata.theme.designSystem in site.json). Each one is a DDD bridge:
 * elements/<package>/design-system/bridge.json plus the
 * lib/<Prefix>DesignSystem.js module that registers and activates it.
 *
 * Writes elements/haxcms-elements/lib/designSystems.json, which the site
 * builder and the appearance settings read. Only modules listed there can
 * be imported for a site; the value saved in site.json is a key into it.
 *
 * usage: node scripts/design-system-discovery.mjs [--check]
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const ELEMENTS = path.join(ROOT, "elements");
const OUT = path.join(ELEMENTS, "haxcms-elements", "lib", "designSystems.json");

// A system a theme defines only for itself stays with that theme.
const PRIVATE = {
  keepcase: "vhs-blog-theme's own system, dark by design",
  glossy: "glossy-portfolio-theme's own system, dark by design",
};

function discover() {
  const systems = {};
  const packages = fs.readdirSync(ELEMENTS).sort();
  for (const pkg of packages) {
    const bridgeFile = path.join(ELEMENTS, pkg, "design-system", "bridge.json");
    if (!fs.existsSync(bridgeFile)) {
      continue;
    }
    const bridge = JSON.parse(fs.readFileSync(bridgeFile, "utf8"));
    const name = bridge.system;
    if (!name || PRIVATE[name]) {
      continue;
    }
    const prefix = bridge.prefix;
    const moduleFile = path.join(
      ELEMENTS,
      pkg,
      "lib",
      `${prefix}DesignSystem.js`,
    );
    if (!fs.existsSync(moduleFile)) {
      throw new Error(`${pkg}: bridge has no lib/${prefix}DesignSystem.js`);
    }
    const source = fs.readFileSync(moduleFile, "utf8");
    const activate = `activate${prefix}DesignSystem`;
    if (!new RegExp(`export function ${activate}\\b`).test(source)) {
      throw new Error(`${pkg}: lib/${prefix}DesignSystem.js has no ${activate}`);
    }
    systems[name] = {
      name,
      title: bridge.title || name,
      homepage: bridge.homepage || "",
      theme: pkg,
      path: `@haxtheweb/${pkg}/lib/${prefix}DesignSystem.js`,
      activate,
    };
  }
  return systems;
}

const systems = discover();
const json = JSON.stringify(systems, null, 2) + "\n";
if (process.argv.includes("--check")) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (current !== json) {
    console.error(
      "designSystems.json is out of date: run node scripts/design-system-discovery.mjs",
    );
    process.exit(1);
  }
  console.log(`designSystems.json is current (${Object.keys(systems).length})`);
} else {
  fs.writeFileSync(OUT, json);
  console.log(
    `Wrote ${path.relative(ROOT, OUT)}: ${Object.keys(systems).join(", ")}`,
  );
}
