import { expect } from "@open-wc/testing";
import { emulateMedia } from "@web/test-runner-commands";
import {
  cleanLang,
  lostTokens,
  stillEnglish,
  localeFileOf,
  translateIssue,
  gogglesFromLink,
  translateLink,
  TRANSLATE_FORMAT,
  TRANSLATE_LANG_KEY,
  TRANSLATE_LIST_KEY,
} from "../lib/core/ui/haxcms-goggles-translate.js";
import {
  GogglesState,
  GOGGLES_LENS_KEY,
} from "../lib/core/ui/haxcms-goggles.js";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const overlay = () => globalThis.document.querySelector("haxcms-goggles");

describe("haxcms-goggles Translate lens: helpers", () => {
  it("takes only language tags from links and pickers", () => {
    expect(cleanLang("fr")).to.equal("fr");
    expect(cleanLang("pt-BR")).to.equal("pt-BR");
    expect(cleanLang("es-419")).to.equal("es-419");
    expect(cleanLang('fr"><script>')).to.equal("");
    expect(cleanLang("../en")).to.equal("");
    expect(cleanLang(null)).to.equal("");
  });

  it("finds the placeholders a suggestion lost", () => {
    expect(lostTokens("{done} of {total}", "{done} de {total}")).to.deep.equal(
      [],
    );
    expect(lostTokens("{done} of {total}", "{done} faits")).to.deep.equal([
      "{total}",
    ]);
  });

  it("calls a string untranslated only when it has words in it", () => {
    expect(stillEnglish({ en: "Copy", now: "Copy" }, "fr")).to.equal(true);
    expect(stillEnglish({ en: "Copy", now: "Copier" }, "fr")).to.equal(false);
    expect(
      stillEnglish({ en: "{percent}%", now: "{percent}%" }, "fr"),
    ).to.equal(false);
    expect(stillEnglish({ en: "Copy", now: "Copy" }, "en-GB")).to.equal(false);
  });

  it("builds the locale file from the registration, inside elements/ only", () => {
    expect(
      localeFileOf(
        {
          namespace: "code-sample",
          localesPath:
            "https://cdn.example/build/node_modules/@haxtheweb/code-sample/locales",
        },
        "fr",
      ),
    ).to.equal("elements/code-sample/locales/code-sample.fr.json");
    expect(
      localeFileOf(
        {
          namespace: "my-learning-button",
          localesPath:
            "http://localhost/elements/haxcms-elements/lib/core/ui/../../../locales/",
        },
        "fr",
      ),
    ).to.equal("elements/haxcms-elements/locales/my-learning-button.fr.json");
    // nothing typed can steer the path
    expect(
      localeFileOf(
        {
          namespace: "../../x",
          localesPath: "/node_modules/@haxtheweb/a/locales",
        },
        "fr",
      ),
    ).to.equal("");
    expect(
      localeFileOf(
        { namespace: "a", localesPath: "/node_modules/@haxtheweb/a/locales" },
        "../fr",
      ),
    ).to.equal("");
    expect(
      localeFileOf({ namespace: "a", localesPath: "/somewhere/else/" }, "fr"),
    ).to.equal("");
  });

  it("writes one issue: prose for people, the hax-i18n block for the ingest", () => {
    const issue = translateIssue({
      lang: "fr",
      note: "Some `code` here",
      theme: "clean-one",
      list: [
        {
          lang: "fr",
          namespace: "code-sample",
          file: "elements/code-sample/locales/code-sample.fr.json",
          key: "copy",
          en: "Copy",
          now: "Copier",
          suggested: "Copier le code",
          why: "unnatural",
          note: "",
          page: "/welcome",
        },
      ],
    });
    expect(issue.title).to.equal("[translate] fr: 1 suggestion (code-sample)");
    const fence = issue.body.indexOf("```json hax-i18n\n");
    expect(fence).to.be.above(-1);
    // what the translator typed cannot close a code fence early
    expect(issue.body.slice(0, fence)).to.not.contain("`code`");
    const json = issue.body.slice(fence + 17, issue.body.lastIndexOf("\n```"));
    const block = JSON.parse(json);
    expect(block.format).to.equal(TRANSLATE_FORMAT);
    expect(block.lang).to.equal("fr");
    expect(block.changes[0]).to.include({
      file: "elements/code-sample/locales/code-sample.fr.json",
      key: "copy",
      en: "Copy",
      now: "Copier",
      suggested: "Copier le code",
    });
  });

  it("reads the goggles a link asks for and ignores anything else", () => {
    expect(gogglesFromLink("?goggles=translate&lang=fr")).to.deep.equal({
      lens: "translate",
      lang: "fr",
    });
    expect(gogglesFromLink("?goggles=code")).to.deep.equal({
      lens: "code",
      lang: "",
    });
    expect(gogglesFromLink("?goggles=person")).to.equal(null);
    expect(gogglesFromLink("?lang=fr")).to.equal(null);
    expect(gogglesFromLink('?goggles=translate&lang=fr"')).to.deep.equal({
      lens: "translate",
      lang: "",
    });
  });

  it("makes a link to this page with the lens and a language", () => {
    const link = new URL(
      translateLink("fr", "https://site.example/a/page?theme=x#top"),
    );
    expect(link.pathname).to.equal("/a/page");
    expect(link.searchParams.get("theme")).to.equal("x");
    expect(link.searchParams.get("goggles")).to.equal("translate");
    expect(link.searchParams.get("lang")).to.equal("fr");
    expect(link.hash).to.equal("");
  });
});

describe("haxcms-goggles Translate lens: the page's language", () => {
  before(async () => {
    await emulateMedia({ reducedMotion: "reduce" });
  });
  after(async () => {
    await emulateMedia({ reducedMotion: "no-preference" });
    globalThis.localStorage.removeItem(GOGGLES_LENS_KEY);
    globalThis.localStorage.removeItem(TRANSLATE_LANG_KEY);
    globalThis.localStorage.removeItem(TRANSLATE_LIST_KEY);
  });

  it("asks which language first, holds it while on, and gives the page back", async () => {
    const root = globalThis.document.documentElement;
    root.setAttribute("lang", "en");
    globalThis.localStorage.removeItem(TRANSLATE_LANG_KEY);
    GogglesState.set({ on: true, lensOn: true, lens: "translate" });
    const g = overlay();
    g.phase = "";
    await g.updateComplete;
    // a translator still in English is asked first
    expect(g._tx && g._tx.mode).to.equal("lang");
    expect(g.looking).to.equal(false);
    g._txSetLang("fr");
    await g.updateComplete;
    expect(root.getAttribute("lang")).to.equal("fr");
    // the site setting its own language back while the lens is on does not stick
    root.setAttribute("lang", "en");
    await wait(20);
    expect(root.getAttribute("lang")).to.equal("fr");
    GogglesState.set({ on: false, lensOn: true, lens: "code" });
    await wait(50);
    expect(root.getAttribute("lang")).to.equal("en");
  });
});
