globalThis.process = globalThis.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html } from "@open-wc/testing";
import { NightDraftTheme, cssUrl } from "../night-draft-theme.js";

const ITEMS = [
  { id: "desk", title: "The Desk", slug: "the-desk", metadata: {} },
  {
    id: "a",
    title: "First Letter",
    slug: "first-letter",
    metadata: { created: 1700000000, image: "files/a.svg" },
  },
  { id: "b", title: "Second Letter", slug: "second-letter", metadata: {} },
];

describe("night-draft-theme", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<night-draft-theme></night-draft-theme>`);
    await element.updateComplete;
    // the base theme stays hidden (so unfocusable) until its first paint
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(() => r())),
    );
    await element.updateComplete;
  });

  it("is defined with its tag", () => {
    expect(NightDraftTheme.tag).to.equal("night-draft-theme");
    expect(globalThis.customElements.get("night-draft-theme")).to.equal(
      NightDraftTheme,
    );
  });

  it("keeps the HAX content contract and a skip link", () => {
    const root = element.shadowRoot;
    expect(root.querySelector("a.skip-link[href='#contentcontainer']")).to
      .exist;
    expect(root.querySelector("#contentcontainer #slot slot")).to.exist;
    expect(root.querySelector("main")).to.exist;
  });

  it("loads its fonts from HAX, not Google", () => {
    const fonts = Array.from(
      globalThis.document.head.querySelectorAll("link[data-hax-font]"),
    ).map((l) => l.getAttribute("data-hax-font"));
    expect(fonts).to.include("Special Elite");
    expect(fonts).to.include("Oswald");
  });

  it("the first page is the desk; the others are letters, in order", async () => {
    element.items = ITEMS;
    element.activeItem = ITEMS[0];
    await element.updateComplete;
    expect(element.isHome).to.be.true;
    expect(element.posts.map((p) => p.id)).to.deep.equal(["a", "b"]);
    expect(element.nextItem.id).to.equal("a");
    const titles = element.shadowRoot.querySelectorAll(".titles a");
    expect(titles.length).to.equal(2);
    expect(titles[0].getAttribute("href")).to.equal("first-letter");
  });

  it("a letter shows its banner, date and the next letter, wrapping at the end", async () => {
    element.items = ITEMS;
    element.activeItem = ITEMS[1];
    await element.updateComplete;
    const root = element.shadowRoot;
    expect(element.isHome).to.be.false;
    expect(root.querySelector(".banner h1").textContent).to.equal(
      "First Letter",
    );
    expect(root.querySelector(".banner").getAttribute("style")).to.contain(
      'url("files/a.svg")',
    );
    expect(root.querySelector(".sig time").getAttribute("datetime")).to.equal(
      "2023-11-14",
    );
    expect(root.querySelector(".next .fwd").getAttribute("href")).to.equal(
      "second-letter",
    );
    element.activeItem = ITEMS[2];
    await element.updateComplete;
    expect(element.nextItem.id).to.equal("a");
  });

  it("only safe image paths reach CSS", () => {
    expect(cssUrl("files/a.svg")).to.equal('url("files/a.svg")');
    expect(cssUrl('x.png") , url("evil')).to.equal("");
    expect(cssUrl("a b.png")).to.equal("");
    expect(cssUrl("")).to.equal("");
    expect(cssUrl(null)).to.equal("");
  });

  it("arrow keys move through the titles and wrap", async () => {
    element.items = ITEMS;
    element.activeItem = ITEMS[0];
    element.selected = 0;
    await element.updateComplete;
    const list = element.shadowRoot.querySelector(".titles");
    list.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    expect(element.selected).to.equal(1);
    list.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    expect(element.selected).to.equal(0);
    list.dispatchEvent(new KeyboardEvent("keydown", { key: "End" }));
    expect(element.selected).to.equal(1);
  });

  it("covers untyped text, and Finish typing shows it all", async () => {
    element.reducedMotion = false;
    element.typingDone = false;
    element.__lines = [{ top: 0, bottom: 20, left: 0, right: 200 }];
    element.__line = 0;
    element.__x = 40;
    element._paint();
    const cover = element.shadowRoot.querySelector(".cover");
    expect(cover.style.clipPath).to.contain("polygon");
    element.shadowRoot.querySelector(".finish").click();
    await element.updateComplete;
    expect(element.typingDone).to.be.true;
    expect(element.hasAttribute("typing-done")).to.be.true;
    expect(globalThis.getComputedStyle(cover).display).to.equal("none");
  });

  it("reduced motion: the page is already typed and nothing flashes", async () => {
    element.items = ITEMS;
    element.typingDone = false;
    element.flashing = true;
    // the operating system setting turns on while a letter is typing
    element.__onMotionChange({ matches: true });
    await element.updateComplete;
    expect(element.reducedMotion).to.be.true;
    expect(element.hasAttribute("reduced-motion")).to.be.true;
    expect(element.typingDone).to.be.true;
    expect(element.flashing).to.be.false;
    // a letter opened from the desk does not flash or type
    element.__fromDesk = true;
    element._activeChanged(ITEMS[1], "a");
    await element.updateComplete;
    expect(element.flashing).to.be.false;
    expect(element.typingDone).to.be.true;
    for (const sel of [".glow", ".nudge", ".sheet"]) {
      const el = element.shadowRoot.querySelector(sel);
      if (el) {
        expect(globalThis.getComputedStyle(el).animationName).to.equal(
          "none",
          sel,
        );
      }
    }
  });

  it("scratch-outs keep the text and announce it", async () => {
    const s = globalThis.document.createElement("s");
    s.textContent = "cut words";
    const p = globalThis.document.createElement("p");
    p.appendChild(s);
    element.appendChild(p);
    await element.updateComplete;
    const style = globalThis.getComputedStyle(s);
    expect(s.textContent).to.equal("cut words");
    expect(style.textDecorationLine).to.contain("line-through");
    expect(globalThis.getComputedStyle(s, "::before").content).to.contain(
      "scratched out:",
    );
    p.remove();
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
