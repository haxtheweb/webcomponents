import { expect } from "@open-wc/testing";
import {
  loadLanguageRegistry,
  setLanguageRegistry,
  normalizeLanguageCode,
  isSupportedLanguageCode,
  getLanguageByCode,
  getLanguageLocale,
  getLanguageDirection,
  getLanguageOptions,
  getPopularLanguageOptions,
  searchLanguageOptions,
} from "../lib/LanguageRegistry.js";

describe("LanguageRegistry", () => {
  let registry;
  let manifest;

  before(async () => {
    registry = await loadLanguageRegistry();
    const response = await fetch(
      new URL("../lib/translation-manifest.json", import.meta.url).href,
    );
    manifest = await response.json();
  });

  it("loads languages.json and can be set directly", () => {
    expect(registry.languages).to.be.an("object");
    expect(Object.keys(registry.languages).length).to.be.greaterThan(100);
    expect(setLanguageRegistry(registry)).to.equal(registry);
  });

  it("knows every language the translation files ship", () => {
    manifest._meta.languagesSupported.forEach((code) => {
      expect(normalizeLanguageCode(code), code).to.be.a("string");
    });
  });

  it("every regional variant has a parent that is a language", () => {
    Object.keys(registry.languages).forEach((code) => {
      const entry = registry.languages[code];
      if (entry.parent) {
        expect(registry.languages[entry.parent], code).to.exist;
        expect(registry.languages[entry.parent].parent, code).to.not.exist;
      }
    });
  });

  describe("normalizeLanguageCode", () => {
    const cases = {
      en: "en",
      "en-US": "en-US",
      EN_us: "en-US",
      "pt_BR.UTF-8": "pt-BR",
      zh_CN: "zh-CN",
      zh: "zh-CN",
      "zh-Hans-CN": "zh-CN",
      "zh-TW": "zh-TW",
      "zh-HK": "zh-TW",
      "fr-CA": "fr",
      iw: "he",
      no: "nb",
      nn: "nb",
      fil: "tl",
      sw: "sw",
      haw: "haw",
      "sr-Latn-RS": "sr",
    };
    Object.keys(cases).forEach((input) => {
      it(`${input} -> ${cases[input]}`, () => {
        expect(normalizeLanguageCode(input)).to.equal(cases[input]);
      });
    });

    it("returns null for things that are not languages", () => {
      ["", "C", "posix", "xx", "english", null, undefined, 5].forEach(
        (input) => {
          expect(normalizeLanguageCode(input), String(input)).to.equal(null);
        },
      );
      expect(isSupportedLanguageCode("xx")).to.equal(false);
      expect(isSupportedLanguageCode("sw")).to.equal(true);
    });
  });

  describe("entries", () => {
    it("stores zh-CN but loads zh translation files", () => {
      expect(getLanguageByCode("zh_CN").code).to.equal("zh-CN");
      expect(getLanguageLocale("zh_CN")).to.equal("zh");
      expect(getLanguageLocale("zh-TW")).to.equal("zh");
      expect(getLanguageLocale("pt-BR")).to.equal("pt");
    });

    it("reports text direction", () => {
      ["ar", "he", "fa", "ur"].forEach((code) => {
        expect(getLanguageDirection(code), code).to.equal("rtl");
      });
      expect(getLanguageDirection("en")).to.equal("ltr");
      expect(getLanguageDirection("not-a-language")).to.equal("ltr");
    });
  });

  describe("options", () => {
    it("lists all languages plus featured regions by default", () => {
      const options = getLanguageOptions();
      const codes = options.map((o) => o.code);
      expect(codes).to.include("sw");
      expect(codes).to.include("en-GB");
      expect(codes).to.not.include("de-DE");
      expect(getLanguageOptions({ includeRegions: false }).length).to.equal(
        Object.keys(registry.languages).filter(
          (c) => !registry.languages[c].parent,
        ).length,
      );
      expect(getLanguageOptions({ includeRegions: true }).length).to.equal(
        Object.keys(registry.languages).length,
      );
    });

    it("labels options as 'Name - code' and sorts by name", () => {
      const options = getLanguageOptions();
      expect(options.find((o) => o.code === "sw").label).to.equal(
        "Swahili - sw",
      );
      const names = options.map((o) => o.name);
      const sorted = names.slice().sort((a, b) => a.localeCompare(b, "en"));
      expect(names).to.deep.equal(sorted);
    });

    it("puts the most common languages first when asked", () => {
      expect(getPopularLanguageOptions().map((o) => o.code)).to.deep.equal([
        "en",
        "zh-CN",
        "hi",
        "es",
        "fr",
        "ar",
        "pt",
        "bn",
        "ru",
        "ja",
      ]);
      expect(getPopularLanguageOptions(3).length).to.equal(3);
      const first = getLanguageOptions({ popularFirst: true })
        .slice(0, 10)
        .map((o) => o.code);
      expect(first).to.deep.equal(
        getPopularLanguageOptions().map((o) => o.code),
      );
    });
  });

  describe("searchLanguageOptions", () => {
    const top = (query) => searchLanguageOptions(query)[0];

    it("finds a language by name, native name, code or alias", () => {
      expect(top("Swahili").code).to.equal("sw");
      expect(top("swa").code).to.equal("sw");
      expect(top("Kiswahili").code).to.equal("sw");
      expect(top("sw").code).to.equal("sw");
      expect(top("fil").code).to.equal("tl");
      expect(top("日本語").code).to.equal("ja");
    });

    it("ignores case and accents", () => {
      expect(top("espanol").code).to.equal("es");
      expect(top("ESPAÑOL").code).to.equal("es");
    });

    it("ranks an exact code first", () => {
      expect(top("en").code).to.equal("en");
    });

    it("returns everything for an empty query and nothing for no match", () => {
      expect(searchLanguageOptions("").length).to.equal(
        getLanguageOptions().length,
      );
      expect(searchLanguageOptions("zzzzzz").length).to.equal(0);
    });
  });
});
