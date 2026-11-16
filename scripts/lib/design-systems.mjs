/**
 * Bridged design systems for the demo gates (contrast, a11y modes).
 *
 * Every HAX block reads DDD tokens, so a DDD bridge (Carbon, PatternFly, ...)
 * recolors and reshapes every block at once. The gates measure each block's
 * demo again with a bridge active, the same way a site that picked that
 * design system shows it (haxtheweb/issues#3339).
 *
 * A bridge is elements/<package>/design-system/bridge.json plus the
 * lib/<Prefix>DesignSystem.js module whose activate<Prefix>DesignSystem()
 * the theme calls; that call is what the gates make in the page.
 */
import fs from "node:fs";
import path from "node:path";

/**
 * every bridged design system in the repo, by name:
 * [{ name, title, element, src, activate }]
 */
export function listDesignSystems(root) {
  const elements = path.join(root, "elements");
  const out = [];
  for (const pkg of fs.readdirSync(elements).sort()) {
    const file = path.join(elements, pkg, "design-system", "bridge.json");
    if (!fs.existsSync(file)) {
      continue;
    }
    let bridge;
    try {
      bridge = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      continue;
    }
    const prefix = bridge.prefix;
    if (
      !bridge.system ||
      !prefix ||
      !fs.existsSync(
        path.join(elements, pkg, "lib", `${prefix}DesignSystem.js`),
      )
    ) {
      continue;
    }
    out.push({
      name: bridge.system,
      title: bridge.title || bridge.system,
      element: pkg,
      src: `/elements/${pkg}/lib/${prefix}DesignSystem.js`,
      activate: `activate${prefix}DesignSystem`,
    });
  }
  return out;
}

/**
 * the systems a --design-system option names: one name, a comma list, or
 * "all"; throws on a name that isn't a bridge
 */
export function pickDesignSystems(root, value) {
  const all = listDesignSystems(root);
  if (!value || value === "all") {
    return all;
  }
  const want = value.split(",").map((v) => v.trim());
  const unknown = want.filter((name) => !all.some((s) => s.name === name));
  if (unknown.length) {
    throw new Error(
      `unknown design system: ${unknown.join(", ")} (bridges: ${all.map((s) => s.name).join(", ")})`,
    );
  }
  return all.filter((s) => want.includes(s.name));
}

/** an element folder ships a HAX block (it has haxProperties) */
export function isHaxBlock(root, element) {
  const dir = path.join(root, "elements", element);
  for (const sub of ["", "lib"]) {
    let names = [];
    try {
      names = fs.readdirSync(path.join(dir, sub));
    } catch {
      continue;
    }
    for (const name of names) {
      if (/\.haxProperties\.json$/.test(name)) {
        return true;
      }
      if (/\.js$/.test(name) && sub === "") {
        try {
          if (
            /static\s+get\s+haxProperties\s*\(/.test(
              fs.readFileSync(path.join(dir, sub, name), "utf8"),
            )
          ) {
            return true;
          }
        } catch {
          // unreadable: not a block source
        }
      }
    }
  }
  return false;
}

/**
 * files whose change re-checks every block under the bridges: DDD itself
 * and any bridge's tokens or map
 */
export const DESIGN_SYSTEM_SOURCES = [
  /^elements\/d-d-d\/lib\//,
  /^elements\/[^/]+\/design-system\//,
  /^elements\/[^/]+\/lib\/[A-Z][A-Za-z]*(Tokens|DDDMap|DesignSystem)\.js$/,
  /^scripts\/lib\/design-systems\.mjs$/,
];

/**
 * Runs in the page: import a bridge's module and activate it, the call its
 * theme makes, then wait two frames for the new stylesheet to apply.
 * Returns the active system's name, or null when it did not take.
 */
export async function activateDesignSystemInPage({ src, activate, name }) {
  const module = await import(src);
  if (typeof module[activate] !== "function") {
    return null;
  }
  const manager = module[activate]();
  await new Promise((r) =>
    requestAnimationFrame(() => requestAnimationFrame(r)),
  );
  return manager && manager.active === name ? name : null;
}
