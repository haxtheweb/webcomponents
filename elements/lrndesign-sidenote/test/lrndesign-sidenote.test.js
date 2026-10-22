import { html, fixture, expect } from "@open-wc/testing";
import "../lrndesign-sidenote.js";

describe("lrndesign-sidenote", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <lrndesign-sidenote label="Instructor note" icon="icons:bookmark">
        <p>Content</p>
      </lrndesign-sidenote>
    `);
  });

  it("is defined and has the original defaults", async () => {
    expect(element).to.exist;
    const bare = await fixture(html`<lrndesign-sidenote></lrndesign-sidenote>`);
    expect(bare.label).to.equal("");
    expect(bare.icon).to.equal("");
  });

  it("shows the label, the icon and the slotted content", async () => {
    const label = element.shadowRoot.querySelector("#label");
    expect(label.textContent.trim()).to.equal("Instructor note");
    const icon = element.shadowRoot.querySelector("simple-icon");
    expect(icon.getAttribute("icon")).to.equal("icons:bookmark");
    const slot = element.shadowRoot.querySelector("slot");
    expect(slot.assignedNodes({ flatten: true }).length).to.be.greaterThan(0);
  });

  it("looks up an icon given without an iconset in the icons iconset", async () => {
    const el = await fixture(
      html`<lrndesign-sidenote
        label="Old"
        icon="bookmark"
      ></lrndesign-sidenote>`,
    );
    expect(el.iconName).to.equal("icons:bookmark");
    expect(
      el.shadowRoot.querySelector("simple-icon").getAttribute("icon"),
    ).to.equal("icons:bookmark");
    const other = await fixture(
      html`<lrndesign-sidenote
        icon="stopnoteicons:stop-icon"
      ></lrndesign-sidenote>`,
    );
    expect(other.iconName).to.equal("stopnoteicons:stop-icon");
    const none = await fixture(html`<lrndesign-sidenote></lrndesign-sidenote>`);
    expect(none.iconName).to.equal("");
  });

  it("omits the header, the icon and the note role when there is nothing to show", async () => {
    const el = await fixture(
      html`<lrndesign-sidenote><p>Only content</p></lrndesign-sidenote>`,
    );
    expect(el.shadowRoot.querySelector("#header")).to.equal(null);
    expect(el.shadowRoot.querySelector("simple-icon")).to.equal(null);
    const container = el.shadowRoot.querySelector("#container");
    expect(container.hasAttribute("role")).to.equal(false);
    expect(container.hasAttribute("aria-labelledby")).to.equal(false);
  });

  it("shows the icon without a label and the label without an icon", async () => {
    const iconOnly = await fixture(
      html`<lrndesign-sidenote icon="icons:warning"></lrndesign-sidenote>`,
    );
    expect(iconOnly.shadowRoot.querySelector("simple-icon")).to.exist;
    expect(iconOnly.shadowRoot.querySelector("#label")).to.equal(null);
    const labelOnly = await fixture(
      html`<lrndesign-sidenote label="Only a label"></lrndesign-sidenote>`,
    );
    expect(labelOnly.shadowRoot.querySelector("simple-icon")).to.equal(null);
    expect(labelOnly.shadowRoot.querySelector("#label")).to.exist;
  });

  it("is a note named by its label, with a decorative icon", async () => {
    const container = element.shadowRoot.querySelector("#container");
    expect(container.getAttribute("role")).to.equal("note");
    expect(container.getAttribute("aria-labelledby")).to.equal("label");
    expect(element.shadowRoot.querySelector("#label")).to.exist;
    expect(
      element.shadowRoot
        .querySelector("simple-icon")
        .getAttribute("aria-hidden"),
    ).to.equal("true");
  });

  it("updates when the label or icon change", async () => {
    element.label = "Changed";
    element.icon = "icons:book";
    await element.updateComplete;
    expect(
      element.shadowRoot.querySelector("#label").textContent.trim(),
    ).to.equal("Changed");
    expect(
      element.shadowRoot.querySelector("simple-icon").getAttribute("icon"),
    ).to.equal("icons:book");
  });

  it("keeps the accent color and dark attributes of the original element", async () => {
    const el = await fixture(
      html`<lrndesign-sidenote
        label="Colors"
        accent-color="orange"
        dark
      ></lrndesign-sidenote>`,
    );
    expect(el.accentColor).to.equal("orange");
    expect(el.dark).to.equal(true);
    expect(el.getAttribute("accent-color")).to.equal("orange");
    expect(el.hasAttribute("dark")).to.equal(true);
  });

  it("honors the original custom properties", async () => {
    const el = await fixture(html`
      <lrndesign-sidenote
        label="Spacing"
        style="--lrndesign-sidenote-container-padding: 33px; --lrndesign-sidenote-container-margin-left: 21px; --simple-colors-default-theme-accent-1: rgb(194, 229, 242);"
      ></lrndesign-sidenote>
    `);
    const style = getComputedStyle(el.shadowRoot.querySelector("#container"));
    expect(style.paddingTop).to.equal("33px");
    expect(style.marginLeft).to.equal("21px");
    expect(style.backgroundColor).to.equal("rgb(194, 229, 242)");
  });

  it("registers its HAX schema", async () => {
    expect(element.constructor.haxProperties).to.contain(
      "lrndesign-sidenote.haxProperties.json",
    );
    const response = await fetch(element.constructor.haxProperties);
    const schema = await response.json();
    const props = schema.settings.configure
      .concat(schema.settings.advanced)
      .map((item) => item.property)
      .filter((property) => property);
    expect(props).to.include.members(["label", "icon", "accentColor", "dark"]);
    expect(schema.demoSchema[0].tag).to.equal("lrndesign-sidenote");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit without a label or icon", async () => {
    const el = await fixture(
      html`<lrndesign-sidenote><p>Content</p></lrndesign-sidenote>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  describe("dark mode", () => {
    const root = document.documentElement;
    const body = document.body;
    let previous;
    beforeEach(() => {
      previous = {
        scheme: root.style.colorScheme,
        background: body.style.backgroundColor,
        color: body.style.color,
      };
      // light-dark() resolves against the used color-scheme. The explicit
      // Canvas background is needed because axe assumes a white page when
      // none is set, which would hide dark mode contrast failures.
      root.style.colorScheme = "dark";
      body.style.backgroundColor = "Canvas";
      body.style.color = "CanvasText";
    });
    afterEach(() => {
      root.style.colorScheme = previous.scheme;
      body.style.backgroundColor = previous.background;
      body.style.color = previous.color;
    });

    it("passes the a11y audit in dark mode", async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it("passes the a11y audit with the dark attribute", async () => {
      const el = await fixture(
        html`<lrndesign-sidenote label="Dark" icon="icons:book" dark>
          <p>Content</p>
        </lrndesign-sidenote>`,
      );
      await expect(el).shadowDom.to.be.accessible();
    });
  });
});
