#!/usr/bin/env node

/**
 * Report drift between the language registry and the translation manifest.
 *
 * elements/i18n-manager/lib/languages.json is the canonical list of languages.
 * This compares it with what the translation files actually ship
 * (elements/i18n-manager/lib/translation-manifest.json, produced by
 * scripts/generate-translation-manifest.js) so a missing or stale language
 * gets noticed.
 *
 * Report only by default: it always exits 0, so other tools and agents can
 * surface the findings without blocking anyone. Pass --strict to exit 1 when
 * there is drift (for a future CI gate), and --json for machine output.
 *
 *   node scripts/validate-language-registry.js
 *   node scripts/validate-language-registry.js --json
 *   node scripts/validate-language-registry.js --strict
 */

const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const libDir = path.join(__dirname, "..", "elements", "i18n-manager", "lib");
const registryPath = path.join(libDir, "languages.json");
const manifestPath = path.join(libDir, "translation-manifest.json");

async function validate() {
  const issues = [];
  const add = (type, code, message) => issues.push({ type, code, message });

  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const shipped = manifest._meta.languagesSupported || [];

  // single implementation of normalization, shared with the browser
  const helpers = await import(
    pathToFileURL(path.join(libDir, "LanguageRegistry.js")).href
  );
  helpers.setLanguageRegistry(registry);

  const languages = registry.languages;
  const codes = Object.keys(languages);

  // 1. every language that ships translation files resolves to an entry
  shipped.forEach((code) => {
    if (!helpers.normalizeLanguageCode(code)) {
      add(
        "shipped-not-in-registry",
        code,
        `translation files exist for "${code}" but the registry has no entry or alias for it`,
      );
    }
  });

  // 2. every language entry has translations behind its locale
  const shippedLocales = new Set(shipped);
  codes.forEach((code) => {
    const entry = languages[code];
    if (!entry.parent && !shippedLocales.has(entry.locale)) {
      add(
        "no-translations",
        code,
        `"${code}" points at locale "${entry.locale}" but no <namespace>.${entry.locale}.json files exist`,
      );
    }
  });

  // 3. structural checks
  const seenAliases = {};
  codes.forEach((code) => {
    const entry = languages[code];
    ["name", "nativeName", "locale"].forEach((field) => {
      if (!entry[field] || typeof entry[field] !== "string") {
        add("invalid-entry", code, `"${code}" is missing "${field}"`);
      }
    });
    if (entry.dir !== "ltr" && entry.dir !== "rtl") {
      add("invalid-entry", code, `"${code}" dir must be "ltr" or "rtl"`);
    }
    if (entry.parent && !languages[entry.parent]) {
      add(
        "invalid-entry",
        code,
        `"${code}" has parent "${entry.parent}" which is not in the registry`,
      );
    }
    if (
      entry.parent &&
      languages[entry.parent] &&
      languages[entry.parent].parent
    ) {
      add(
        "invalid-entry",
        code,
        `"${code}" has parent "${entry.parent}" which is itself a regional variant`,
      );
    }
    (entry.aliases || []).forEach((alias) => {
      const key = alias.toLowerCase();
      if (languages[alias] || codes.some((c) => c.toLowerCase() === key)) {
        add(
          "alias-collision",
          code,
          `alias "${alias}" on "${code}" is also a registry code`,
        );
      } else if (seenAliases[key] && seenAliases[key] !== code) {
        add(
          "alias-collision",
          code,
          `alias "${alias}" is used by both "${seenAliases[key]}" and "${code}"`,
        );
      }
      seenAliases[key] = code;
    });
  });

  return {
    registryEntries: codes.length,
    languages: codes.filter((c) => !languages[c].parent).length,
    regionalVariants: codes.filter((c) => languages[c].parent).length,
    shippedCodes: shipped.length,
    issues,
  };
}

validate()
  .then((report) => {
    const strict = process.argv.includes("--strict");
    if (process.argv.includes("--json")) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log("Language registry report");
      console.log(
        `  registry: ${report.languages} languages + ${report.regionalVariants} regional variants`,
      );
      console.log(
        `  translation files ship ${report.shippedCodes} language codes`,
      );
      if (report.issues.length === 0) {
        console.log("  no drift found");
      } else {
        console.log(`  ${report.issues.length} issue(s):`);
        report.issues.forEach((issue) => {
          console.log(`   - [${issue.type}] ${issue.message}`);
        });
        console.log(
          strict
            ? "  (--strict: exiting 1)"
            : "  (report only: exiting 0, pass --strict to fail)",
        );
      }
    }
    process.exit(strict && report.issues.length > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error("language registry report could not run:", error.message);
    // report only: a broken report should not block anything either
    process.exit(process.argv.includes("--strict") ? 1 : 0);
  });
