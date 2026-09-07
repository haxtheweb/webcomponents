import { fixture, expect, html } from "@open-wc/testing";

import "../lib/hax-view-source.js";

const LOCALES = "/elements/hax-body/locales";

async function loadLocale(lang) {
  const res = await fetch(`${LOCALES}/hax.${lang}.json`);
  expect(res.ok, `hax.${lang}.json should be fetchable`).to.be.true;
  return res.json();
}

describe("shared 'hax' i18n namespace", () => {
  let en;

  before(async () => {
    en = await loadLocale("en");
  });

  it("hax.en.json carries copiedToClipboard", async () => {
    // hax-view-source toasts this.t.copiedToClipboard when copying HTML.
    // It previously lived only in the translated locale files, so English
    // users got `undefined` in the toast.
    expect(en).to.have.property("copiedToClipboard");
    expect(en.copiedToClipboard).to.be.a("string").that.is.not.empty;
  });

  it("hax.en.json carries pages alongside templates", async () => {
    // hax-tray renders sibling <hax-stax-browser> labels for pages and
    // templates. `templates` was declared and translatable; `pages` was read
    // with an inline "Pages" fallback and never reached the locale files, so
    // it could not be translated in any language.
    expect(en).to.have.property("templates");
    expect(en).to.have.property("pages");
    expect(en.pages).to.be.a("string").that.is.not.empty;
  });

  it("hax-view-source declares every key it reads", async () => {
    const el = await fixture(html`<hax-view-source></hax-view-source>`);
    expect(el.t.copiedToClipboard).to.be.a("string").that.is.not.empty;
    for (const key of ["updateHTML", "copyHTML", "revisionHistory"]) {
      expect(el.t[key], `${key} should be declared`).to.be.a("string").that.is
        .not.empty;
    }
  });

  it("translated locales carry exactly the same key set as en.json", async () => {
    const expected = Object.keys(en).sort();
    // spot-check a spread of languages rather than all 102
    for (const lang of ["es", "fr", "de", "ja", "ar", "zh"]) {
      const data = await loadLocale(lang);
      expect(Object.keys(data).sort(), `hax.${lang}.json key set`).to.eql(
        expected,
      );
    }
  });

  it("translated locales contain no key absent from en.json", async () => {
    for (const lang of ["es", "fr", "de"]) {
      const data = await loadLocale(lang);
      const orphans = Object.keys(data).filter((k) => !(k in en));
      expect(orphans, `hax.${lang}.json orphan keys`).to.eql([]);
    }
  });
});
