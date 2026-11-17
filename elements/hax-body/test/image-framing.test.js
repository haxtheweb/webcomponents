import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "@haxtheweb/d-d-d/lib/ddd-hero.js";
import { ImageFramingDialog } from "../lib/image-framing-dialog.js";
import "../lib/simple-fields-image-framing.js";

const PHOTO = new URL(
  "../../haxcms-elements/lib/theme-screenshots/theme-polaris-flex-theme.jpg",
  import.meta.url,
).href;
const settle = () => aTimeout(150);

describe("image-framing-dialog", () => {
  let page;
  let hero;
  afterEach(() => {
    const dialog = document.querySelector("image-framing-dialog");
    if (dialog) dialog.remove();
  });
  beforeEach(async () => {
    page = await fixture(
      html`<div>
        <p>Before</p>
        <ddd-hero
          source="${PHOTO}"
          heading="Open house"
          focal-x="30"
          focal-y="50"
        ></ddd-hero>
        <p>After</p>
      </div>`,
    );
    hero = page.querySelector("ddd-hero");
    await hero.updateComplete;
  });

  const openOn = (size) =>
    ImageFramingDialog.open({
      element: hero,
      source: PHOTO,
      framing: hero.framing,
      focalX: hero.focalX,
      focalY: hero.focalY,
      frames: hero.framingFrames(),
      title: "Hero",
      size,
    });

  it("lists the screen sizes and shows the element at the size picked", async () => {
    const done = openOn("sm");
    await settle();
    const dialog = document.querySelector("image-framing-dialog");
    const items = dialog.shadowRoot.querySelectorAll(".rail-item");
    expect(
      [...items].map((b) => b.querySelector(".label").textContent),
    ).to.deep.equal(["Phone", "Tablet", "Desktop", "Wide"]);
    expect(items[0].getAttribute("aria-current")).to.equal("page");
    const preview = dialog.querySelector("ddd-hero[preview-size='sm']");
    expect(preview).to.exist;
    // the blocks around it come along, for context
    expect(dialog.textContent).to.contain("Before");
    expect(dialog.shadowRoot.querySelector(".st").textContent.trim()).to.equal(
      "All sizes automatic",
    );
    dialog._discard();
    expect(await done).to.equal(null);
  });

  it("makes a size custom when the photo is moved, and returns it on Done", async () => {
    const done = openOn("lg");
    await settle();
    const dialog = document.querySelector("image-framing-dialog");
    const handle = dialog.querySelector("[role='application']");
    handle.dispatchEvent(
      new KeyboardEvent("keydown", { key: "+", bubbles: true }),
    );
    handle.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    await settle();
    expect(dialog.framings.lg).to.exist;
    const badge = dialog.shadowRoot.querySelectorAll(".rail-badge")[2];
    expect(badge.textContent.trim()).to.equal("Custom");
    dialog.shadowRoot.querySelector(".hax-ui-btn.primary").click();
    const result = await done;
    const framing = JSON.parse(result.framing);
    expect(Object.keys(framing)).to.deep.equal(["lg"]);
    expect(framing.lg.w).to.be.lessThan(1);
    expect(result.focalX).to.equal(30);
  });

  it("goes back to automatic", async () => {
    hero.framing = '{"md":{"x":0,"y":0,"w":0.5,"h":0.4}}';
    const done = openOn("md");
    await settle();
    const dialog = document.querySelector("image-framing-dialog");
    expect(dialog.framings.md).to.exist;
    dialog._backToAuto();
    dialog._done();
    const result = await done;
    expect(result.framing).to.equal("");
  });

  it("moves the focal point", async () => {
    const done = openOn("lg");
    await settle();
    const dialog = document.querySelector("image-framing-dialog");
    dialog.focalMode = true;
    const handle = dialog.querySelector("[role='application']");
    const r = handle.getBoundingClientRect();
    handle.dispatchEvent(
      new PointerEvent("pointerdown", {
        clientX: r.left + r.width * 0.9,
        clientY: r.top + r.height * 0.5,
        bubbles: true,
      }),
    );
    dialog._done();
    const result = await done;
    expect(result.focalX).to.be.greaterThan(50);
    expect(result.framing).to.equal("");
  });
});

describe("simple-fields-image-framing", () => {
  it("shows a thumbnail per size and marks custom ones", async () => {
    const el = await fixture(
      html`<simple-fields-image-framing
        label="Framing"
        description="How the photo sits at each screen size"
        .src="${PHOTO}"
        .value="${'{"sm":{"x":0.1,"y":0,"w":0.7,"h":1}}'}"
      ></simple-fields-image-framing>`,
    );
    await settle();
    const labels = [...el.shadowRoot.querySelectorAll(".thumb > span")].map(
      (s) => s.textContent.trim(),
    );
    expect(labels).to.deep.equal(["Phone *", "Tablet", "Desktop", "Wide"]);
    expect(el.shadowRoot.querySelector(".desc").textContent).to.contain(
      "* Custom",
    );
    expect(
      el.shadowRoot.querySelector(".hax-ui-btn").textContent.trim(),
    ).to.equal("Frame photo");
    await expect(el).shadowDom.to.be.accessible();
  });
});
