# langkah-bertahap

Web component built with Lit and the DDD design system.

## Commands

- `npm start` - development server
- `npm run build` - build and analyze
- `npm run test` - run tests
- `npm run release` - build, version bump, and publish

## Working with the component

- Edit `./warp-glitch.js` for the component source
- Edit `./index.html` for the demo page
- Add dependencies via `npm install --save @whatever/repo`
- Place additional `.js` files under `/lib/`
- Update `/lib/langkah-bertahap.haxProperties.json` for HAX wiring
- See `/locales/` for i18n translation files

## Localization

UI strings live in `this.t` (Indonesian is the source language) and are
translated by `@haxtheweb/i18n-manager` (`I18NMixin`). No build step and no
`lit-localize` extraction: the manager fetches
`locales/<namespace>.<lang>.json` at runtime and merges the keys into `this.t`.

Supported today: `ar` `bn` `en` `es` `fr` `hi` `id` `ja` `pt` `ru` `zh`.

### Add or update a language

1. Copy `locales/langkah-bertahap.id.json` to `locales/langkah-bertahap.<lang>.json`
   (e.g. `...de.json`) and translate the values. Keep the keys exactly as they are.
2. Add the code to the `locales` array in `registerLocalization()` inside
   `warp-glitch.js` (the array is also what makes `en` load at all).
3. Nothing else: the HAXcms sync script copies every matching file into
   `custom/build/locales/`.

### Choosing the language

`i18n-manager` reads `<body lang>` / `<html lang>` (then `navigator.language`)
and updates every registered element. On HAXcms the shell (`index.html`) is a
generated file that hardcodes `lang="en-US"`, so the site copies
`settings.lang` from `site.json` onto `<html>` at runtime
(`custom/src/site-language.js`) before the component boots. Changing the site
language in HAXcms is therefore enough - no per-component setting.

### Language picker (`language-picker`)

`language-picker.js` is the visitor-facing switch. It does not translate
anything itself: it sets `<html lang>` + `dir`, and `i18n-manager`'s
MutationObserver reloads `locales/langkah-bertahap.<lang>.json` for every
registered element (so `العربية` also flips the layout to RTL).

```html
<script type="module" src="./language-picker.js"></script>
<language-picker label="Bahasa"></language-picker>
```

- The choice is written to `localStorage["hax-site-lang"]`; a HAXcms site reads
  it at boot (`custom/src/site-language.js`, which also accepts `?lang=ar`).
- `reload` (off by default) reloads after switching, for hosts whose menu or
  footer is rendered server-side from `settings.lang`; it never reloads inside
  the HAX editor, so unsaved pages are safe.
- `persist="false"` (property `.persist=${false}`) leaves storage untouched.
- `languages='[{"code":"id","name":"Bahasa Indonesia"}]'` overrides the list;
  bare codes and a comma separated string also work.
- HAX editor: the schema is inline (`LanguagePicker.haxProperties`), so the
  block appears in the tray as "Pemilih Bahasa". The site registers it through
  `custom/src/language-picker-hax.js`.

`@lit/localize` is intentionally not used: it compiles `msg()` strings into
per-locale bundles at build time, which a CDN-served HAX component does not
have. The i18n-manager JSON files are the runtime equivalent.

### Editor schema (`haxProperties`)

The HAX editor form text comes from `lib/langkah-bertahap.haxProperties.json`
(Indonesian source). Translations are overlays named
`locales/langkah-bertahap.haxProperties.<lang>.json`: they only repeat the human
strings (`gizmo`, setting `title`/`description`, demo `properties`) and are
merged onto the base schema by HAX itself. Available today: `id` `en` `es` `ar`;
any other language falls back to the Indonesian schema.

The mechanism is HAX's `HaxStore.attemptGizmoTranslation()`: it asks
i18n-manager for the `<tag>.haxProperties` namespace, so the site registration
glue has to register that namespace with `localesPath` + `locales` before it
fires the schema event. That is why the file name has `.haxProperties` before
the language code.

### Right to left

The element mirrors the page language by setting `dir="rtl"` on itself for
Arabic, Hebrew, Farsi, Urdu, etc. (see `_isRtlLanguage()`), which flips the
split button, the dropdown and the step tools. An explicit `dir` attribute on
the element always wins. For the author-supplied content inside the slots to
mirror too, also set `dir="rtl"` on `<html>` or `<body>`.

# Credits

A brighter future dreamed and developed by the Penn State [HAXTheWeb](https://hax.psu.edu/) initiative.
