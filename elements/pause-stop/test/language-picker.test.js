import { html, fixture, expect } from "@open-wc/testing";
import "../language-picker.js";

const STORAGE_KEY = "hax-site-lang";

describe("LanguagePicker", () => {
  let element;
  const originalLang = document.documentElement.getAttribute("lang");
  const originalDir = document.documentElement.getAttribute("dir");

  const restoreDocument = () => {
    if (originalLang === null) {
      document.documentElement.removeAttribute("lang");
    } else {
      document.documentElement.setAttribute("lang", originalLang);
    }
    if (originalDir === null) {
      document.documentElement.removeAttribute("dir");
    } else {
      document.documentElement.setAttribute("dir", originalDir);
    }
  };

  beforeEach(async () => {
    window.localStorage.removeItem(STORAGE_KEY);
    document.documentElement.setAttribute("lang", "id");
    document.documentElement.setAttribute("dir", "ltr");
    element = await fixture(html`
      <language-picker label="Bahasa"></language-picker>
    `);
  });

  afterEach(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    restoreDocument();
  });

  it("starts on the document language", () => {
    expect(element.value).to.equal("id");
    const select = element.shadowRoot.querySelector("select");
    expect(select.value).to.equal("id");
  });

  it("reduces a regional tag to its base language", async () => {
    document.documentElement.setAttribute("lang", "en-US");
    const regional = await fixture(html`
      <language-picker label="Language"></language-picker>
    `);
    expect(regional.value).to.equal("en");
    expect(regional.shadowRoot.querySelector("select").value).to.equal("en");
  });

  it("switches the document language, direction and remembers the choice", async () => {
    const select = element.shadowRoot.querySelector("select");
    select.value = "ar";
    select.dispatchEvent(new Event("change"));
    await element.updateComplete;

    expect(element.value).to.equal("ar");
    expect(document.documentElement.getAttribute("lang")).to.equal("ar");
    expect(document.documentElement.getAttribute("dir")).to.equal("rtl");
    expect(window.localStorage.getItem(STORAGE_KEY)).to.equal("ar");
  });

  it("switches back to ltr for a left-to-right language", async () => {
    const select = element.shadowRoot.querySelector("select");
    select.value = "ar";
    select.dispatchEvent(new Event("change"));
    await element.updateComplete;

    select.value = "ja";
    select.dispatchEvent(new Event("change"));
    await element.updateComplete;

    expect(document.documentElement.getAttribute("dir")).to.equal("ltr");
    expect(window.localStorage.getItem(STORAGE_KEY)).to.equal("ja");
  });

  it("can opt out of persistence", async () => {
    const transient = await fixture(html`
      <language-picker .persist=${false} label="Language"></language-picker>
    `);
    const select = transient.shadowRoot.querySelector("select");
    select.value = "es";
    select.dispatchEvent(new Event("change"));
    await transient.updateComplete;

    expect(transient.value).to.equal("es");
    expect(window.localStorage.getItem(STORAGE_KEY)).to.equal(null);
  });

  it("follows a language change announced by another picker", async () => {
    globalThis.dispatchEvent(new CustomEvent("languagechange", { detail: "zh" }));
    await element.updateComplete;
    expect(element.value).to.equal("zh");
    expect(element.shadowRoot.querySelector("select").value).to.equal("zh");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
