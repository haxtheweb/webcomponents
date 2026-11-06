import { fixture, expect, html } from "@open-wc/testing";
import {
  attributeStringFromProperties,
  renderRecordElementPreview,
  safeRecordAttributeName,
} from "../lib/core/utils/haxcms-views-render-utility.js";

// security: site-view records can come from a remote JSON feed, so attribute
// names and URL values from a record must never become script.
describe("haxcms-views-render-utility attribute safety", () => {
  it("keeps plain attribute names, including custom ones like one-line", () => {
    expect(safeRecordAttributeName("src")).to.equal("src");
    expect(safeRecordAttributeName("Alt")).to.equal("alt");
    expect(safeRecordAttributeName("one-line")).to.equal("one-line");
    expect(safeRecordAttributeName("data-id")).to.equal("data-id");
  });

  it("drops event handlers, srcdoc and names that could break out of the tag", () => {
    expect(safeRecordAttributeName("onerror")).to.equal("");
    expect(safeRecordAttributeName("ONLOAD")).to.equal("");
    expect(safeRecordAttributeName("srcdoc")).to.equal("");
    expect(safeRecordAttributeName('x"><svg onload=alert(1)>')).to.equal("");
    expect(safeRecordAttributeName("a b")).to.equal("");
    expect(safeRecordAttributeName("")).to.equal("");
  });

  it("builds a safe attribute string", () => {
    const out = attributeStringFromProperties({
      src: "https://example.com/a.png",
      alt: 'say "hi"',
      onerror: "alert(1)",
      "x><img src=x onerror=alert(1)>": "1",
      href: "javascript:alert(1)",
      hidden: true,
    });
    expect(out).to.contain('src="https://example.com/a.png"');
    expect(out).to.contain('alt="say &quot;hi&quot;"');
    expect(out).to.contain(" hidden");
    expect(out).to.not.contain("onerror");
    expect(out).to.not.contain("javascript");
    expect(out).to.not.contain("<");
  });

  it("renders a record preview without handlers or script URLs", async () => {
    const record = {
      haxElementSchema: {
        tag: "img",
        properties: {
          src: "x",
          alt: "pic",
          onerror: "globalThis.__siteViewPwned=1",
        },
      },
    };
    const iframeRecord = {
      haxElementSchema: {
        tag: "iframe",
        properties: { src: "javascript:globalThis.__siteViewPwned=2" },
      },
    };
    const el = await fixture(
      html`<div>
        ${renderRecordElementPreview(record)}
        ${renderRecordElementPreview(iframeRecord)}
      </div>`,
    );
    const img = el.querySelector("img");
    expect(img).to.exist;
    expect(img.getAttribute("alt")).to.equal("pic");
    expect(img.hasAttribute("onerror")).to.equal(false);
    const iframe = el.querySelector("iframe");
    expect(iframe).to.exist;
    expect(iframe.hasAttribute("src")).to.equal(false);
    expect(globalThis.__siteViewPwned).to.equal(undefined);
  });

  it("still renders custom element records with their attributes", async () => {
    const el = await fixture(
      html`<div>
        ${renderRecordElementPreview({
          haxElementSchema: {
            tag: "simple-icon-lite",
            properties: { icon: "star", "accent-color": "blue" },
            content: "<b>ok</b><img src=x onerror=alert(1)>",
          },
        })}
      </div>`,
    );
    const icon = el.querySelector("simple-icon-lite");
    expect(icon).to.exist;
    expect(icon.getAttribute("icon")).to.equal("star");
    expect(icon.getAttribute("accent-color")).to.equal("blue");
    expect(icon.querySelector("b")).to.exist;
    expect(icon.querySelector("img").hasAttribute("onerror")).to.equal(false);
  });
});
