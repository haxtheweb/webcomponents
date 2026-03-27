import { fixture, expect, html } from "@open-wc/testing";

import { setAiulDataCache } from "../ai-usage-license.js";

// Minimal mock that mirrors the real AIUL v1 API response shape.
// This avoids real network requests while exercising exactly the same
// code paths the component uses at runtime.
const mockApiData = {
  licenses: [
    {
      code: "NA",
      title: "AIUL-NA",
      fullName: "Not Allowed",
      url: "https://dmd-program.github.io/aiul/licenses/na/1.0.0/",
      image:
        "https://cdn.jsdelivr.net/gh/dmd-program/aiul@main/assets/images/licenses/aiul-na.png",
    },
    {
      code: "CD",
      title: "AIUL-CD",
      fullName: "Conceptual Development",
      url: "https://dmd-program.github.io/aiul/licenses/cd/1.0.0/",
      image:
        "https://cdn.jsdelivr.net/gh/dmd-program/aiul@main/assets/images/licenses/aiul-cd.png",
    },
  ],
  modifiers: [
    {
      code: "IM",
      title: "Image",
      fullName: "Image",
      url: "https://dmd-program.github.io/aiul/modifiers/image/1.0.0/",
    },
  ],
  combinations: [
    {
      code: "CD-IM",
      license: { code: "CD", title: "AIUL-CD" },
      modifier: { code: "IM", title: "Image" },
      url: "https://dmd-program.github.io/aiul/combinations/cd-im.html",
      image:
        "https://cdn.jsdelivr.net/gh/dmd-program/aiul@main/assets/images/licenses/aiul-cd-im.png",
    },
  ],
};

// Seed the module-level cache before any test runs.
// This ensures _licenseUpdated resolves synchronously (Promise.resolve) so
// we can reliably await the reactive property updates.
before(() => {
  setAiulDataCache(mockApiData);
});

describe("ai-usage-license test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <ai-usage-license license="CD"></ai-usage-license>
    `);
    // fetchAiulData() resolves as Promise.resolve(mockApiData), so the
    // .then() in _licenseUpdated runs as a microtask. Awaiting here lets
    // those microtasks drain and allows LitElement to process the update.
    await Promise.resolve();
    await element.updateComplete;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("sets license tag to AIUL-CD", async () => {
    expect(element.licenseTag).to.equal("AIUL-CD");
  });

  it("sets license name to Conceptual Development", async () => {
    expect(element.licenseName).to.equal("Conceptual Development");
  });

  it("sets license image for CD", async () => {
    expect(element.licenseImage).to.include("aiul-cd.png");
  });
});

describe("ai-usage-license with modifier test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <ai-usage-license license="CD" modifier="IM"></ai-usage-license>
    `);
    await Promise.resolve();
    await element.updateComplete;
  });

  it("sets license tag to AIUL-CD-IM", async () => {
    expect(element.licenseTag).to.equal("AIUL-CD-IM");
  });

  it("sets combined license name", async () => {
    expect(element.licenseName).to.equal("Conceptual Development / Image");
  });

  it("sets combination image URL from API combinations list", async () => {
    expect(element.licenseImage).to.include("aiul-cd-im.png");
  });
});
