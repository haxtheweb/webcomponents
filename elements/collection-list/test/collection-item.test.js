import { fixture, expect, html } from "@open-wc/testing";
import { CollectionItem } from "../lib/collection-item.js";

// direct lib import so istanbul sees lib/collection-item.js statements
describe("collection-item", () => {
  it("seeds defaults", async () => {
    const el = await fixture(html`<collection-item></collection-item>`);
    expect(el._haxstate).to.equal(false);
    expect(el.tags).to.equal(null);
    expect(el.saturate).to.equal(false);
    expect(el.url).to.equal(null);
    expect(el.image).to.equal(null);
    expect(el.alt).to.equal(null);
    expect(el.icon).to.equal(null);
    expect(el.line1).to.equal(null);
    expect(el.line2).to.equal(null);
    expect(el.line3).to.equal(null);
    expect(el.accentColor).to.equal(null);
  });

  it("renders a link card with image, icon, tags and text lines", async () => {
    const el = await fixture(
      html`<collection-item
        url="/item"
        image="hero.jpg"
        alt="Item alt"
        icon="icons:code"
        line1="Line One"
        line2="Line Two"
        line3="Line Three"
        tags="tag1, tag2"
        accent-color="blue"
      ></collection-item>`,
    );
    await el.updateComplete;
    const link = el.shadowRoot.querySelector("a.link");
    expect(link === null).to.equal(false);
    expect(link.getAttribute("href")).to.equal("/item");
    // image renders as a background-image style on the image div
    const image = el.shadowRoot.querySelector(".image");
    expect(image.getAttribute("style").includes("hero.jpg")).to.equal(true);
    // icon renders inside the circle
    expect(
      el.shadowRoot
        .querySelector(".icon simple-icon-lite")
        .getAttribute("icon"),
    ).to.equal("icons:code");
    // tags render as DDD pills
    const tags = el.shadowRoot.querySelectorAll(".tags li");
    expect(tags.length).to.equal(2);
    expect(tags[0].textContent).to.equal("tag1");
    expect(tags[1].textContent).to.equal("tag2");
    // the three text lines render in order
    expect(el.shadowRoot.querySelector(".line-1").textContent).to.equal(
      "Line One",
    );
    expect(el.shadowRoot.querySelector(".line-2").textContent).to.equal(
      "Line Two",
    );
    expect(el.shadowRoot.querySelector(".line-3").textContent).to.equal(
      "Line Three",
    );
    // slotted content lands between the icon and the lines
    expect(el.shadowRoot.querySelector(".wrap slot") === null).to.equal(false);
  });

  it("renders placeholders without tags, icon or image", async () => {
    const el = await fixture(
      html`<collection-item url="/plain"></collection-item>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".no-tags") === null).to.equal(false);
    expect(el.shadowRoot.querySelector(".no-icon") === null).to.equal(false);
    expect(el.shadowRoot.querySelector(".tags")).to.equal(null);
    expect(el.shadowRoot.querySelector(".icon")).to.equal(null);
    // no image: a tinted placeholder panel with a generic icon
    const placeholder = el.shadowRoot.querySelector(".image.placeholder");
    expect(placeholder === null).to.equal(false);
    expect(placeholder.getAttribute("aria-hidden")).to.equal("true");
    expect(
      placeholder.querySelector("simple-icon-lite").getAttribute("icon"),
    ).to.equal("icons:book");
  });

  it("uses the item icon in the placeholder when there is no image", async () => {
    const el = await fixture(
      html`<collection-item url="/p" icon="icons:search"></collection-item>`,
    );
    await el.updateComplete;
    const placeholder = el.shadowRoot.querySelector(".image.placeholder");
    expect(
      placeholder.querySelector("simple-icon-lite").getAttribute("icon"),
    ).to.equal("icons:search");
    // the overlapping circle only appears on top of a real image
    expect(el.shadowRoot.querySelector(".icon")).to.equal(null);
  });

  it("gives the background image a text alternative from alt", async () => {
    const el = await fixture(
      html`<collection-item
        url="/i"
        image="hero.jpg"
        alt="Mountains at sunrise"
      ></collection-item>`,
    );
    await el.updateComplete;
    const image = el.shadowRoot.querySelector(".image");
    expect(image.getAttribute("role")).to.equal("img");
    expect(image.getAttribute("aria-label")).to.equal("Mountains at sunrise");
    expect(image.classList.contains("placeholder")).to.equal(false);
    // alt is no longer only a tooltip on the link
    expect(
      el.shadowRoot.querySelector("a.link").hasAttribute("title"),
    ).to.equal(false);
  });

  it("treats an image without alt as decorative", async () => {
    const el = await fixture(
      html`<collection-item url="/i" image="hero.jpg"></collection-item>`,
    );
    await el.updateComplete;
    const image = el.shadowRoot.querySelector(".image");
    expect(image.getAttribute("role")).to.equal("presentation");
    expect(image.hasAttribute("aria-label")).to.equal(false);
  });

  it("still accepts accent-color and maps it to the DDD accent", async () => {
    const el = await fixture(
      html`<collection-item url="/a" accent-color="green"></collection-item>`,
    );
    await el.updateComplete;
    expect(el.getAttribute("accent-color")).to.equal("green");
    expect(el.accentColor).to.equal("green");
    const accent = getComputedStyle(el)
      .getPropertyValue("--ddd-accent-color")
      .trim();
    expect(accent).to.not.equal("");
    // the card top rule paints with the DDD colour (#008755)
    const link = el.shadowRoot.querySelector("a.link");
    expect(getComputedStyle(link).borderTopColor).to.equal("rgb(0, 135, 85)");
  });

  it("follows the page colour scheme and the dark attribute", async () => {
    const wrap = await fixture(
      html`<div style="color-scheme: light">
        <collection-item url="/l" line1="Light"></collection-item>
        <collection-item url="/d" line1="Dark" dark></collection-item>
      </div>`,
    );
    const [light, dark] = wrap.querySelectorAll("collection-item");
    await light.updateComplete;
    await dark.updateComplete;
    const bg = (el) =>
      getComputedStyle(el.shadowRoot.querySelector("a.link")).backgroundColor;
    expect(bg(light)).to.equal("rgb(255, 255, 255)");
    // potentialMidnight
    expect(bg(dark)).to.equal("rgb(0, 3, 33)");
    wrap.style.colorScheme = "dark";
    expect(bg(light)).to.equal("rgb(0, 3, 33)");
  });

  it("shows a visible focus ring on the card link", async () => {
    const el = await fixture(
      html`<collection-item url="#f" line1="Focus"></collection-item>`,
    );
    await el.updateComplete;
    const link = el.shadowRoot.querySelector("a.link");
    link.focus();
    // keyboard-style focus matches :focus-visible in chromium for .focus()
    const style = getComputedStyle(link);
    expect(style.outlineStyle).to.equal("solid");
    expect(parseFloat(style.outlineWidth) > 0).to.equal(true);
  });

  it("reflects the saturate attribute", async () => {
    const el = await fixture(
      html`<collection-item url="/s" saturate></collection-item>`,
    );
    expect(el.hasAttribute("saturate")).to.equal(true);
    expect(el.saturate).to.equal(true);
  });

  it("blocks clicks while in hax edit state", async () => {
    const el = await fixture(html`<collection-item></collection-item>`);
    const counts = { prevent: 0, stop: 0, immediate: 0 };
    const fakeEvent = {
      preventDefault() {
        counts.prevent += 1;
      },
      stopPropagation() {
        counts.stop += 1;
      },
      stopImmediatePropagation() {
        counts.immediate += 1;
      },
    };
    el._handleClick(fakeEvent);
    expect(counts.prevent).to.equal(0);
    el._haxstate = true;
    el._handleClick(fakeEvent);
    expect(counts.prevent).to.equal(1);
    expect(counts.stop).to.equal(1);
    expect(counts.immediate).to.equal(1);
  });

  it("blocks clicks when the parent locks items", async () => {
    const el = await fixture(
      html`<div lock-items><collection-item></collection-item></div>`,
    );
    const item = el.querySelector("collection-item");
    let prevented = 0;
    const fakeEvent = {
      preventDefault() {
        prevented += 1;
      },
      stopPropagation() {},
      stopImmediatePropagation() {},
    };
    item._handleClick(fakeEvent);
    expect(prevented).to.equal(1);
  });

  it("exposes hax hooks and edit mode observers", async () => {
    const el = await fixture(html`<collection-item></collection-item>`);
    const hooks = el.haxHooks();
    expect(hooks.editModeChanged).to.equal("haxeditModeChanged");
    expect(hooks.activeElementChanged).to.equal("haxactiveElementChanged");
    // active element only flips hax state on, never off
    el.haxactiveElementChanged(el, true);
    expect(el._haxstate).to.equal(true);
    el.haxactiveElementChanged(el, false);
    expect(el._haxstate).to.equal(true);
    el.haxeditModeChanged(false);
    expect(el._haxstate).to.equal(false);
    el.haxeditModeChanged(true);
    expect(el._haxstate).to.equal(true);
  });

  it("references its hax properties file", () => {
    expect(
      CollectionItem.haxProperties.includes(
        "collection-item.haxProperties.json",
      ),
    ).to.equal(true);
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<collection-item
        url="/a11y"
        alt="Accessible item"
        line1="Title"
        line2="Description"
      ></collection-item>`,
    );
    await el.updateComplete;
    await expect(el).shadowDom.to.be.accessible();
  });
});
