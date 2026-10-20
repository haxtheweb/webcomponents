import { expect } from "@open-wc/testing";
import { loadLanguageRegistry } from "@haxtheweb/i18n-manager/lib/LanguageRegistry.js";
import "../lib/v2/admin/haxcms-system-settings.js";

describe("haxcms-system-settings default language", () => {
  let el;

  before(async () => {
    await loadLanguageRegistry();
  });

  beforeEach(() => {
    el = document.createElement("haxcms-system-settings");
  });

  it("offers the shared searchable language picker, not an inline select", () => {
    const panel = el._getPanelByKey("configuration");
    const field = panel.sections[0].fields.find(
      (f) => f.property === "defaultLanguage",
    );
    expect(field.inputMethod).to.equal("haxcms-language-picker");
    expect(field.options).to.equal(undefined);
    expect(field.default).to.equal("en-US");
  });

  it("no longer carries the 33 per-language translation keys", () => {
    expect(
      Object.keys(el.t).filter((k) => /^lang[A-Z][a-z][A-Z]/.test(k)),
    ).to.deep.equal([]);
  });

  it("keeps a language that is in the registry but was never in the old 33", () => {
    // the old select coerced these to en-US, losing the installer's choice
    expect(el._normalizeLanguageTagValue("sw")).to.equal("sw");
    expect(el._normalizeLanguageTagValue("haw")).to.equal("haw");
  });

  it("canonicalizes known forms and aliases", () => {
    expect(el._normalizeLanguageTagValue("zh_CN")).to.equal("zh-CN");
    expect(el._normalizeLanguageTagValue("iw")).to.equal("he");
    expect(el._normalizeLanguageTagValue("pt-BR")).to.equal("pt-BR");
    expect(el._normalizeLanguageTagValue("en-US")).to.equal("en-US");
  });

  it("keeps a well-formed custom tag and rejects junk", () => {
    expect(el._normalizeLanguageTagValue("fr-CA")).to.equal("fr-CA");
    expect(el._normalizeLanguageTagValue("not a language!", "de")).to.equal(
      "de",
    );
    expect(el._normalizeLanguageTagValue("", "")).to.equal("en-US");
    expect(el._normalizeLanguageTagValue(null, "zz9 9")).to.equal("en-US");
  });

  it("saves the canonical code", () => {
    expect(
      el._buildLocalizationSavePayload({ defaultLanguage: "zh_CN" }),
    ).to.deep.equal({ defaultLanguage: "zh-CN" });
  });
});
