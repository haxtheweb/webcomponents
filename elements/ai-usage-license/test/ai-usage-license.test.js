import { html, fixture, expect } from "@open-wc/testing";
import { AiUsageLicense } from "../ai-usage-license.js";

// The constructor always fetches ./lib/v1.json; stub that fetch so no
// network is involved (images in the stub data are data URIs so the
// rendered <img> never loads anything remote either). Any other fetch
// (i18n and friends) is delegated to the original same-origin fetch.
const AIUL_DATA = {
  version: "1.0.0",
  licenses: [
    {
      id: "cd",
      code: "CD",
      title: "AIUL-CD",
      fullName: "Conceptual Development",
      version: "1.0.0",
      url: "https://dmd-program.github.io/aiul/licenses/cd/1.0.0/",
      image: "data:image/png;base64,AAAAAQ==",
    },
    {
      id: "na",
      code: "NA",
      title: "AIUL-NA",
      fullName: "Not Allowed",
      version: "1.0.0",
      url: "https://dmd-program.github.io/aiul/licenses/na/1.0.0/",
      image: "data:image/png;base64,AAAAAg==",
    },
  ],
  modifiers: [
    {
      id: "im",
      code: "IM",
      title: "Immersive",
      fullName: "Immersive Media",
      version: "1.0.0",
      url: "https://dmd-program.github.io/aiul/modifiers/im/1.0.0/",
    },
    {
      id: "au",
      code: "AU",
      title: "Audio",
      fullName: "Audio Media",
      version: "1.0.0",
      url: "https://dmd-program.github.io/aiul/modifiers/au/1.0.0/",
    },
  ],
  combinations: [
    {
      license: { code: "CD" },
      modifier: { code: "IM" },
      image: "data:image/png;base64,AAAAAw==",
    },
  ],
};

const originalFetch = globalThis.fetch;
let fetchMode = "data";
let pendingResolvers = [];

function fetchUrl(input) {
  if (typeof input === "string") {
    return input;
  }
  if (input && input.url) {
    return input.url;
  }
  return String(input);
}

globalThis.fetch = (input, init) => {
  const url = fetchUrl(input);
  if (url.includes("lib/v1.json")) {
    if (fetchMode === "fail") {
      return Promise.reject(new Error("stubbed network failure"));
    }
    if (fetchMode === "pending") {
      return new Promise((resolve) => {
        pendingResolvers.push(resolve);
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(AIUL_DATA),
    });
  }
  return originalFetch.call(globalThis, input, init);
};

function resetFetchMode(mode) {
  fetchMode = mode;
  pendingResolvers = [];
}

async function settle(element) {
  await element.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 10));
  await element.updateComplete;
}

describe("AiUsageLicense test", () => {
  let element;
  beforeEach(async () => {
    resetFetchMode("data");
    element = await fixture(html`
      <ai-usage-license
        title="title"
      ></ai-usage-license>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("AiUsageLicense registration and defaults", () => {
  it("registers the ai-usage-license tag", () => {
    expect(globalThis.customElements.get("ai-usage-license")).to.exist;
    expect(AiUsageLicense.tag).to.equal("ai-usage-license");
  });

  it("defaults every property to null", async () => {
    resetFetchMode("data");
    const el = await fixture(html`<ai-usage-license></ai-usage-license>`);
    expect(el.license).to.equal(null);
    expect(el.modifier).to.equal(null);
    expect(el.licenseName).to.equal(null);
    expect(el.licenseImage).to.equal(null);
    expect(el.licenseLink).to.equal(null);
    expect(el.licenseDescription).to.equal(null);
    expect(el.licenseTag).to.equal(null);
    expect(el.uri).to.equal(null);
  });

  it("marks itself as oer:SupportingMaterial in firstUpdated", async () => {
    resetFetchMode("data");
    const el = await fixture(html`<ai-usage-license></ai-usage-license>`);
    await settle(el);
    expect(el.getAttribute("typeof")).to.equal("oer:SupportingMaterial");
  });

  it("renders only the license body and empty oer:uri meta without data", async () => {
    resetFetchMode("data");
    const el = await fixture(html`<ai-usage-license></ai-usage-license>`);
    await settle(el);
    expect(el.shadowRoot.querySelector(".license-body")).to.exist;
    expect(el.shadowRoot.querySelector(".license-badge")).to.not.exist;
    expect(el.shadowRoot.querySelector(".license-tag")).to.not.exist;
    expect(el.shadowRoot.querySelector(".license-description")).to.not.exist;
    const meta = el.shadowRoot.querySelector('meta[property="oer:uri"]');
    expect(meta).to.exist;
    expect(meta.getAttribute("content")).to.equal("");
  });
});

describe("AiUsageLicense license resolution", () => {
  it("resolves a plain license into tag, name, link and image", async () => {
    resetFetchMode("data");
    const el = await fixture(html`<ai-usage-license></ai-usage-license>`);
    el.license = "CD";
    await settle(el);
    expect(el.licenseTag).to.equal("AIUL-CD");
    expect(el.licenseName).to.equal("Conceptual Development");
    expect(el.licenseLink).to.equal(
      "https://dmd-program.github.io/aiul/licenses/cd/1.0.0/",
    );
    expect(el.licenseImage).to.equal("data:image/png;base64,AAAAAQ==");
  });

  it("renders the badge, tag link, name and description for a license", async () => {
    resetFetchMode("data");
    const el = await fixture(html`<ai-usage-license></ai-usage-license>`);
    el.license = "CD";
    await settle(el);
    el.licenseDescription = "Use for conceptual development work.";
    await settle(el);
    const badge = el.shadowRoot.querySelector(".license-badge");
    expect(badge).to.exist;
    expect(badge.getAttribute("href")).to.equal(el.licenseLink);
    expect(badge.getAttribute("aria-label")).to.equal(
      "Conceptual Development - AI Usage License",
    );
    const img = el.shadowRoot.querySelector(".license-badge img");
    expect(img).to.exist;
    expect(img.getAttribute("alt")).to.equal(
      "AIUL-CD - Conceptual Development",
    );
    expect(img.getAttribute("src")).to.equal(el.licenseImage);
    const tagLink = el.shadowRoot.querySelector(".license-tag a");
    expect(tagLink).to.exist;
    expect(tagLink.getAttribute("href")).to.equal(el.licenseLink);
    expect(tagLink.textContent).to.equal("AIUL-CD");
    expect(el.shadowRoot.textContent).to.include("Conceptual Development");
    const desc = el.shadowRoot.querySelector(".license-description");
    expect(desc).to.exist;
    expect(desc.textContent).to.include("conceptual development");
    const meta = el.shadowRoot.querySelector('meta[property="oer:uri"]');
    expect(meta.getAttribute("content")).to.equal(el.licenseLink);
  });

  it("resolves a license with a combination modifier", async () => {
    resetFetchMode("data");
    const el = await fixture(html`<ai-usage-license></ai-usage-license>`);
    el.license = "CD";
    await settle(el);
    el.modifier = "IM";
    await settle(el);
    expect(el.licenseTag).to.equal("AIUL-CD-IM");
    expect(el.licenseName).to.equal("Conceptual Development / Immersive");
    expect(el.licenseLink).to.equal(
      "https://dmd-program.github.io/aiul/combinations/cd-im.html",
    );
    expect(el.licenseImage).to.equal("data:image/png;base64,AAAAAw==");
  });

  it("falls back to the license image when no combination image exists", async () => {
    resetFetchMode("data");
    const el = await fixture(html`<ai-usage-license></ai-usage-license>`);
    el.license = "CD";
    await settle(el);
    el.modifier = "AU";
    await settle(el);
    expect(el.licenseTag).to.equal("AIUL-CD-AU");
    expect(el.licenseName).to.equal("Conceptual Development / Audio");
    expect(el.licenseLink).to.equal(
      "https://dmd-program.github.io/aiul/combinations/cd-au.html",
    );
    expect(el.licenseImage).to.equal("data:image/png;base64,AAAAAQ==");
  });

  it("treats an unknown modifier as no modifier", async () => {
    resetFetchMode("data");
    const el = await fixture(html`<ai-usage-license></ai-usage-license>`);
    el.license = "CD";
    await settle(el);
    el.modifier = "ZZ";
    await settle(el);
    expect(el.licenseTag).to.equal("AIUL-CD");
    expect(el.licenseName).to.equal("Conceptual Development");
    expect(el.licenseLink).to.equal(
      "https://dmd-program.github.io/aiul/licenses/cd/1.0.0/",
    );
  });

  it("leaves prior values untouched for an unknown license code", async () => {
    resetFetchMode("data");
    const el = await fixture(html`<ai-usage-license></ai-usage-license>`);
    el.license = "CD";
    await settle(el);
    expect(el.licenseTag).to.equal("AIUL-CD");
    el.license = "XX";
    await settle(el);
    expect(el.licenseTag).to.equal("AIUL-CD");
    expect(el.licenseName).to.equal("Conceptual Development");
  });

  it("returns early when license is cleared to null", async () => {
    resetFetchMode("data");
    const el = await fixture(html`<ai-usage-license></ai-usage-license>`);
    el.license = "CD";
    await settle(el);
    el.license = null;
    await settle(el);
    expect(el.licenseTag).to.equal("AIUL-CD");
  });
});

describe("AiUsageLicense data loading edge cases", () => {
  it("caches resolved data and returns it directly on later calls", async () => {
    resetFetchMode("data");
    const el = await fixture(html`<ai-usage-license></ai-usage-license>`);
    el.license = "CD";
    await settle(el);
    expect(el._aiulData).to.exist;
    const again = await el._setAIULData();
    expect(again).to.equal(el._aiulData);
  });

  it("warns and keeps rendering when the data fetch fails", async () => {
    resetFetchMode("fail");
    const warnings = [];
    const originalWarn = console.warn;
    console.warn = (...args) => {
      warnings.push(args.join(" "));
    };
    try {
      const el = await fixture(html`<ai-usage-license></ai-usage-license>`);
      el.license = "CD";
      await settle(el);
      expect(warnings.length).to.be.greaterThan(0);
      expect(el.licenseTag).to.equal(null);
      expect(el.shadowRoot.querySelector(".license-body")).to.exist;
    } finally {
      console.warn = originalWarn;
    }
  });

  it("serves empty hax select options while data is still pending", async () => {
    resetFetchMode("pending");
    const el = await fixture(html`<ai-usage-license></ai-usage-license>`);
    const options = el._getHaxSelectOptions();
    expect(options.licenseOptions).to.deep.equal({});
    expect(options.modifierOptions).to.deep.equal({ "": "No modifier" });
    // release the hanging fetch so the element does not leak promises
    for (const resolve of pendingResolvers) {
      resolve({ ok: true, json: () => Promise.resolve(AIUL_DATA) });
    }
  });
});

describe("AiUsageLicense HAX integration", () => {
  it("haxHooks wires the active element form setup", async () => {
    resetFetchMode("data");
    const el = await fixture(html`<ai-usage-license></ai-usage-license>`);
    expect(el.haxHooks()).to.deep.equal({
      setupActiveElementForm: "haxsetupActiveElementForm",
    });
  });

  it("builds license and modifier select options from the data", async () => {
    resetFetchMode("data");
    const el = await fixture(html`<ai-usage-license></ai-usage-license>`);
    el.license = "CD";
    await settle(el);
    const options = el._getHaxSelectOptions();
    expect(options.licenseOptions).to.deep.equal({
      CD: "Conceptual Development",
      NA: "Not Allowed",
    });
    expect(options.modifierOptions).to.deep.equal({
      "": "No modifier",
      IM: "Immersive",
      AU: "Audio",
    });
  });

  it("injects options into the license and modifier form fields only", async () => {
    resetFetchMode("data");
    const el = await fixture(html`<ai-usage-license></ai-usage-license>`);
    el.license = "CD";
    await settle(el);
    const props = {
      settings: {
        configure: [
          { property: "license", options: {} },
          { property: "modifier", options: {} },
          { property: "uri" },
        ],
      },
    };
    await el.haxsetupActiveElementForm(props);
    expect(props.settings.configure[0].options).to.deep.equal({
      CD: "Conceptual Development",
      NA: "Not Allowed",
    });
    expect(props.settings.configure[1].options).to.deep.equal({
      "": "No modifier",
      IM: "Immersive",
      AU: "Audio",
    });
    expect(props.settings.configure[2].options).to.equal(undefined);
  });

  it("exposes a static haxProperties schema with demo schema", () => {
    const schema = AiUsageLicense.haxProperties;
    expect(schema.canScale).to.equal(false);
    expect(schema.canEditSource).to.equal(true);
    expect(schema.gizmo.title).to.equal("AI Usage License");
    expect(schema.gizmo.tags).to.include("aiul");
    expect(schema.settings.configure[0].property).to.equal("license");
    expect(schema.settings.configure[1].property).to.equal("modifier");
    expect(schema.settings.configure[2].property).to.equal("uri");
    expect(schema.demoSchema[0].tag).to.equal("ai-usage-license");
    expect(schema.demoSchema[0].properties.license).to.equal("CD");
    expect(schema.demoSchema[0].properties.modifier).to.equal("IM");
  });

  it("prefers an explicit uri over the license link in the oer:uri meta", async () => {
    resetFetchMode("data");
    const el = await fixture(html`<ai-usage-license></ai-usage-license>`);
    el.license = "CD";
    await settle(el);
    el.uri = "https://example.org/my-aiul-reference";
    await settle(el);
    const meta = el.shadowRoot.querySelector('meta[property="oer:uri"]');
    expect(meta.getAttribute("content")).to.equal(
      "https://example.org/my-aiul-reference",
    );
  });
});
