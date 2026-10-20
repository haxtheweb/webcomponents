import js from "@eslint/js";
import litPlugin from "eslint-plugin-lit";
import wcPlugin from "eslint-plugin-wc";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

/**
 * ESLint 9 flat config for the webcomponents monorepo.
 *
 * Scope: `elements/*\/**\/*.js` ESM Lit components. Prettier remains the
 * formatting authority (see .prettierrc.json); `eslint-config-prettier` is
 * applied last to disable any ESLint stylistic rules that could conflict.
 *
 * This is an initial, non-blocking rollout (see .github/workflows/build.yml)
 * across 2000+ pre-existing files, so rules here are deliberately limited to
 * correctness + a couple of team-specific conventions rather than a full
 * stylistic ruleset. Do not add stylistic/formatting rules here; those
 * belong in Prettier.
 */
export default [
  {
    // Global ignores (applies to every config entry below, including the
    // base `recommended` rules). Scope is elements/**/*.js ESM only, per the
    // plan: everything outside elements/, plus generated/vendored/CJS
    // tooling files, is out of scope for this initial rollout.
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/demo/**",
      "**/coverage/**",
      "**/*.min.js",
      "**/*.umd.js",
      "**/*.amd.js",
      "**/*.es6.js",
      "**/*.cjs",
      // Tests are not linted (they run under web-test-runner).
      "elements/**/test/**",
      "elements/**/*.test.js",
      "elements/h5p-element/lib/**",
      "elements/wave-player/lib/**",
      "elements/moment-element/lib/**",
      "elements/d-d-d/design-system/dist/**",
      // Vendored third-party libraries (not ours to lint or reformat).
      "elements/slide-deck/lib/pptx-rendered.js",
      "elements/file-system-broker/lib/xlsx/**",
      "elements/file-system-broker/lib/mammoth/**",
      "elements/la-tex/lib/latex2html5.js",
      "elements/music-player/lib/html-midi-player.js",
      "elements/sheet-music/lib/alphatab/**",
      "elements/q-r/lib/qr.js",
      "elements/code-sample/lib/highlightjs/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["elements/**/*.js"],
    plugins: {
      lit: litPlugin,
      wc: wcPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
        // Third-party libraries loaded at runtime (es-global-bridge, script
        // tags or the host page) rather than imported as modules.
        Chartist: "readonly",
        css_beautify: "readonly",
        DatArchive: "readonly",
        Drupal: "readonly",
        H5PIntegration: "readonly",
        jsPDF: "readonly",
        js_beautify: "readonly",
        lunr: "readonly",
        MediaStreamRecorder: "readonly",
        moment: "readonly",
        OpenSeadragon: "readonly",
        PouchDB: "readonly",
        createUnityInstance: "readonly",
        YT: "readonly",
      },
    },
    rules: {
      ...litPlugin.configs.recommended.rules,
      ...wcPlugin.configs.recommended.rules,
      // Team convention: the current toolchain has issues with optional
      // chaining syntax, so it's banned outright.
      "no-restricted-syntax": [
        "error",
        {
          selector: "ChainExpression",
          message:
            "Optional chaining (?.) is banned; this toolchain has issues with it. Use explicit null checks instead.",
        },
      ],
      // Team convention: prefer globalThis over bare `window` for
      // global-scope JS (e.g. `window.customElements`, `window.dispatchEvent`)
      // so code behaves consistently outside a strict browser context.
      // `globalThis` resolves to the same object as `window` in a browser,
      // so this is a drop-in replacement for the vast majority of usages.
      // NOTE: no-restricted-globals flags every reference to the `window`
      // identifier, including member access like `window.location`, so this
      // is set to "warn" (non-blocking) rather than "error". For call sites
      // that intentionally need to assert a true browser `window` (rare),
      // add a targeted `// eslint-disable-next-line no-restricted-globals`
      // with a short comment explaining why `globalThis` won't do.
      "no-restricted-globals": [
        "warn",
        {
          name: "window",
          message:
            "Prefer `globalThis` over bare `window` for global-scope JS. If this usage genuinely requires the browser window object specifically, disable this rule inline with a comment explaining why.",
        },
      ],
      // A leading underscore marks an intentionally unused parameter (for
      // example an event handler signature that has to keep its arity).
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      // New code should use ===, but existing == that works and passes tests is
      // not a problem, so this is advisory and `== null` is allowed.
      eqeqeq: ["warn", "always", { null: "ignore" }],
      "no-var": "error",
    },
  },
  {
    // A handful of scripts under elements/ (e.g. the DDD design-system build
    // scripts) are Node-context ESM tooling, not browser-delivered component
    // code, so they need Node globals (process, Buffer, __dirname via
    // import.meta, etc.) rather than browser globals.
    files: [
      "elements/d-d-d/design-system/**/*.js",
      "elements/*/scripts/**/*.js",
      "elements/haxcms-elements/automation/**/*.js",
      "elements/haxcms-elements/theme-screenshot-automation.js",
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // Per-element dev-server / bundler config files (web-dev-server.config.mjs,
    // rollup.config.mjs, etc.) execute in Node during local dev, not in the
    // browser, so they need Node globals too.
    files: ["elements/**/*.config.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  eslintConfigPrettier,
];
