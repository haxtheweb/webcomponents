import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import "../lib/hax-upload-field.js";

// compact / label-hidden are opt-in for admin field rows (site admin SEO);
// without them hax-upload-field must look and behave as it always has

const $ = (el, sel) => el.shadowRoot.querySelector(sel);
const css = (node) => globalThis.getComputedStyle(node);
const rect = (node) => node.getBoundingClientRect();

async function showImageInfo(el) {
  el.fileActions = true;
  await el.updateComplete;
  el.__lastUploadedFile = {
    uuid: "",
    width: 10,
    height: 10,
    size: 100,
    type: "image/png",
    dateCreated: 0,
    source: "files/a.png",
    fullUrl: "",
  };
  await el.updateComplete;
  const collapse = $(el, ".file-info-collapse");
  await collapse.updateComplete;
  return collapse;
}

describe("hax-upload-field compact and label-hidden", () => {
  it("defaults to the full layout", async () => {
    const el = await fixture(
      html`<hax-upload-field label="Image"></hax-upload-field>`,
    );
    expect(el.compact).to.equal(false);
    expect(el.labelHidden).to.equal(false);
    expect(el.hasAttribute("compact")).to.equal(false);
    expect(el.hasAttribute("label-hidden")).to.equal(false);
    expect(css($(el, "#fileupload")).display).to.equal("block");
    expect(rect($(el, "legend")).width).to.be.greaterThan(1);
    expect(rect($(el, 'span[part="drop-area-text"]')).width).to.be.greaterThan(
      1,
    );
    const urlLabel = $(el, "#url").shadowRoot.querySelector('[part="label"]');
    expect(rect(urlLabel).width).to.be.greaterThan(1);
    // URL box sits above the source buttons
    expect(rect($(el, '[part="browse-area"]')).bottom).to.be.at.most(
      rect($(el, "#upload")).top + 1,
    );
  });

  it("keeps the heavy Image info heading by default", async () => {
    const el = await fixture(
      html`<hax-upload-field label="Image"></hax-upload-field>`,
    );
    const collapse = await showImageInfo(el);
    const heading = collapse.shadowRoot.querySelector('[part="heading-id"]');
    expect(Number(css(heading).fontWeight)).to.be.at.least(600);
  });

  it("label-hidden keeps the legend as the fieldset name only", async () => {
    const el = await fixture(
      html`<hax-upload-field label="Favicon" label-hidden></hax-upload-field>`,
    );
    const legend = $(el, "legend");
    expect(el.labelHidden).to.equal(true);
    expect(legend.hasAttribute("hidden")).to.equal(false);
    expect(legend.textContent).to.contain("Favicon");
    expect(rect(legend).width).to.be.at.most(1);
    // label-hidden alone does not change the layout
    expect(css($(el, "#fileupload")).display).to.equal("block");
  });

  it("compact puts the URL box and source buttons on one row", async () => {
    const el = await fixture(
      html`<hax-upload-field
        label="Favicon"
        compact
        label-hidden
        style="--hax-upload-field-control-height: 36px; --hax-upload-field-font-size: 13px"
      ></hax-upload-field>`,
    );
    expect(el.compact).to.equal(true);
    expect(css($(el, "#fileupload")).display).to.equal("grid");
    const area = rect($(el, '[part="browse-area"]'));
    const sources = rect($(el, "#upload"));
    expect(sources.left).to.be.at.least(area.right - 1);
    expect(Math.abs(sources.top - area.top)).to.be.below(8);
    const url = $(el, "#url");
    const box = url.shadowRoot.querySelector('[part="field-main-inner"]');
    expect(rect(box).height).to.equal(36);
    const input = url.shadowRoot.querySelector("input");
    expect(css(input).fontSize).to.equal("13px");
    // visible URL label is hidden but the input keeps its name
    const urlLabel = url.shadowRoot.querySelector('[part="label"]');
    expect(rect(urlLabel).width).to.be.at.most(1);
    expect(input.getAttribute("aria-label")).to.equal("URL");
    // drop hint text is visually hidden; the buttons are square at the height
    expect(rect($(el, 'span[part="drop-area-text"]')).width).to.be.at.most(1);
    const browse = $(el, '[part="browse"]');
    expect(Math.round(rect(browse).height)).to.equal(36);
  });

  it("compact draws Image info as a small disclosure row", async () => {
    const el = await fixture(
      html`<hax-upload-field
        label="Favicon"
        compact
        style="--hax-upload-field-info-height: 30px; --hax-upload-field-font-size: 14px"
      ></hax-upload-field>`,
    );
    const collapse = await showImageInfo(el);
    const heading = collapse.shadowRoot.querySelector('[part="heading-id"]');
    expect(Number(css(heading).fontWeight)).to.equal(400);
    expect(Math.round(rect(heading).height)).to.equal(30);
    expect(
      css($(el, '.file-info-collapse span[slot="heading"]')).fontSize,
    ).to.equal("14px");
    // still a working disclosure
    const button = collapse.shadowRoot.querySelector("button");
    expect(button.getAttribute("aria-expanded")).to.equal("false");
    button.click();
    await collapse.updateComplete;
    expect(collapse.expanded).to.equal(true);
  });

  it("compact keeps value and value-changed behavior", async () => {
    const el = await fixture(
      html`<hax-upload-field
        label="Favicon"
        compact
        label-hidden
        value="files/a.png"
      ></hax-upload-field>`,
    );
    const url = $(el, "#url");
    expect(url.value).to.equal("files/a.png");
    setTimeout(() =>
      url.dispatchEvent(
        new CustomEvent("value-changed", {
          detail: { value: "files/b.png" },
        }),
      ),
    );
    const e = await oneEvent(el, "value-changed");
    expect(e.detail.value).to.equal("files/b.png");
    expect(el.value).to.equal("files/b.png");
  });
});
