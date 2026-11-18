import { fixture, expect, html } from "@open-wc/testing";
import "../lib/super-daemon-row.js";

// Validates the Merlin row shortcut chip (Plan B): a chip appears only when a
// shortcut label is supplied, is hidden in mini mode, and stays absent
// (pixel-identical to pre-Plan-B) when no shortcut is set.
describe("super-daemon-row shortcut chip", () => {
  it("renders a shortcut chip when shortcut is set", async () => {
    const el = await fixture(
      html`<super-daemon-row
        title="Save"
        path="CMS/action/save"
        shortcut="Ctrl⇧S"
      ></super-daemon-row>`,
    );
    const chip = el.shadowRoot.querySelector(".shortcut");
    expect(chip, "chip element present").to.exist;
    expect(chip.textContent.trim()).to.equal("Ctrl⇧S");
    expect(chip.getAttribute("aria-hidden")).to.equal("true");
  });

  it("does not render a chip when shortcut is absent", async () => {
    const el = await fixture(
      html`<super-daemon-row
        title="Join our Community"
        path="HAX/community/join"
      ></super-daemon-row>`,
    );
    expect(el.shadowRoot.querySelector(".shortcut")).to.be.null;
  });

  it("treats an empty shortcut string as absent", async () => {
    const el = await fixture(
      html`<super-daemon-row
        title="No shortcut"
        shortcut=""
      ></super-daemon-row>`,
    );
    expect(el.shadowRoot.querySelector(".shortcut")).to.be.null;
  });

  it("keeps the shortcut chip visible in mini mode", async () => {
    const el = await fixture(
      html`<super-daemon-row
        mini
        title="Save"
        path="CMS/action/save"
        shortcut="Ctrl⇧S"
      ></super-daemon-row>`,
    );
    const chip = el.shadowRoot.querySelector(".shortcut");
    expect(chip, "chip present in mini mode").to.exist;
    const display = getComputedStyle(chip).display;
    // Mini mode intentionally shows the chip (matches the user's UX call) so
    // the shortcut is discoverable in the compact inline list too.
    expect(display).to.not.equal("none");
  });
});

describe("super-daemon-row behavior", () => {
  it("selected dispatches row-selected, the named event, and closes", async () => {
    const el = await fixture(
      html`<super-daemon-row
        title="Go"
        event-name="my-event"
        .value="${{ a: 1 }}"
      ></super-daemon-row>`,
    );
    let rowSelected = false;
    let named = null;
    let closed = false;
    el.addEventListener(
      "super-daemon-row-selected",
      () => (rowSelected = true),
    );
    el.addEventListener("my-event", (e) => (named = e.detail));
    el.addEventListener("super-daemon-close", () => (closed = true));
    el.selected();
    expect(rowSelected).to.equal(true);
    expect(named.a).to.equal(1);
    expect(closed).to.equal(true);
  });

  it("a listener that cancels row-selected takes over running the command", async () => {
    const el = await fixture(
      html`<super-daemon-row
        title="Go"
        event-name="my-event"
        .value="${{ a: 1 }}"
      ></super-daemon-row>`,
    );
    let named = null;
    let closed = false;
    el.addEventListener("super-daemon-row-selected", (e) => e.preventDefault());
    el.addEventListener("my-event", (e) => (named = e.detail));
    el.addEventListener("super-daemon-close", () => (closed = true));
    el.selected();
    expect(named).to.equal(null);
    expect(closed).to.equal(false);
  });

  it("selected does not close for run-program events", async () => {
    const el = await fixture(
      html`<super-daemon-row
        title="Prog"
        event-name="super-daemon-run-program"
      ></super-daemon-row>`,
    );
    let closed = false;
    el.addEventListener("super-daemon-close", () => (closed = true));
    el.selected();
    expect(closed).to.equal(false);
  });

  it("keyEvent selects on Enter and Space", async () => {
    const el = await fixture(
      html`<super-daemon-row title="K" event-name="ke"></super-daemon-row>`,
    );
    let fired = 0;
    el.addEventListener("ke", () => fired++);
    el.keyEvent(
      new KeyboardEvent("keydown", {
        code: "Enter",
        key: "Enter",
        cancelable: true,
      }),
    );
    el.keyEvent(
      new KeyboardEvent("keydown", {
        code: "Space",
        key: " ",
        cancelable: true,
      }),
    );
    el.keyEvent(new KeyboardEvent("keydown", { key: "a", cancelable: true }));
    expect(fired).to.equal(2);
  });

  it("clickEvent selects the row", async () => {
    const el = await fixture(
      html`<super-daemon-row title="C" event-name="ce"></super-daemon-row>`,
    );
    let clicked = false;
    el.addEventListener("ce", () => (clicked = true));
    el.clickEvent();
    expect(clicked).to.equal(true);
  });

  it("tracks active state on focus and blur handlers", async () => {
    const el = await fixture(
      html`<super-daemon-row title="A"></super-daemon-row>`,
    );
    el._focusIn();
    expect(el.active).to.equal(true);
    await el.updateComplete;
    expect(el.hasAttribute("active")).to.equal(true);
    el._focusOut();
    expect(el.active).to.equal(false);
    await el.updateComplete;
    expect(el.hasAttribute("active")).to.equal(false);
  });

  it("hover is a wash only: it never marks the row active (Enter runs the active row)", async () => {
    const el = await fixture(
      html`<super-daemon-row title="H" shortcut="Ctrl⇧3"></super-daemon-row>`,
    );
    const btn = el.shadowRoot.querySelector(".row");
    const enter = el.shadowRoot.querySelector(".enter-icon");
    const chip = el.shadowRoot.querySelector(".shortcut");
    const chipLeft = chip.getBoundingClientRect().left;
    btn.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await el.updateComplete;
    expect(el.hovered).to.equal(true);
    expect(el.active).to.equal(false);
    expect(getComputedStyle(enter).visibility).to.equal("hidden");
    btn.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    await el.updateComplete;
    expect(el.hovered).to.equal(false);
    // keyboard / focus selection shows Enter in place without moving the
    // shortcut chip
    el.active = true;
    await el.updateComplete;
    expect(getComputedStyle(enter).visibility).to.equal("visible");
    expect(chip.getBoundingClientRect().left).to.equal(chipLeft);
  });

  it("draws one glyph per tile: a text character wins over an icon", async () => {
    const el = await fixture(
      html`<super-daemon-row
        title="DDR"
        icon="av:volume-up"
        text-character="🎵"
      ></super-daemon-row>`,
    );
    expect(el.shadowRoot.querySelector(".result-icon")).to.equal(null);
    expect(
      el.shadowRoot.querySelector(".result-textCharacter").textContent,
    ).to.equal("\u{1F3B5}");
  });

  it("focus() focuses the row itself, the option", async () => {
    const el = await fixture(
      html`<super-daemon-row
        title="F"
        role="option"
        tabindex="-1"
      ></super-daemon-row>`,
    );
    el.focus();
    expect(document.activeElement === el).to.equal(true);
    expect(el.active).to.equal(true);
    // nothing inside the option is focusable (an option holds no controls)
    expect(el.shadowRoot.querySelector("button")).to.equal(null);
  });

  it("runs the row on Enter pressed on the focused option", async () => {
    const el = await fixture(
      html`<super-daemon-row
        title="K"
        event-name="ke"
        role="option"
        tabindex="-1"
      ></super-daemon-row>`,
    );
    let ran = false;
    el.addEventListener("ke", () => (ran = true));
    el.focus();
    el.dispatchEvent(
      new KeyboardEvent("keydown", {
        code: "Enter",
        key: "Enter",
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(ran).to.equal(true);
  });

  it("passes axe as an option inside a listbox, details toggle included", async () => {
    const wrap = await fixture(
      html`<div role="listbox" aria-label="Results">
        <super-daemon-row
          title="Opt"
          role="option"
          tabindex="-1"
          aria-selected="false"
          more
          ><p>Some details</p></super-daemon-row
        >
      </div>`,
    );
    const el = wrap.querySelector("super-daemon-row");
    await el.updateComplete;
    // the details describe the option, since keyboard users do not reach
    // the pointer-only toggle
    expect(el.ariaDescribedByElements[0]).to.equal(el.querySelector("p"));
    await expect(wrap).to.be.accessible();
  });

  it("pickColor alternates accent colors", async () => {
    const el = await fixture(
      html`<super-daemon-row title="P"></super-daemon-row>`,
    );
    expect(el.pickColor(0)).to.equal("blue");
    expect(el.pickColor(1)).to.equal("orange");
  });

  it("renders icon, image, and text character with no dead tags DOM", async () => {
    // regression (a11y follow-up): the .tags markup was removed as dead DOM
    // (it was display: none in every mode), so simple-tag chips never
    // render; the tags property stays on the element API for consumers
    const el = await fixture(
      html`<super-daemon-row
        title="T"
        icon="save"
        image="x.png"
        text-character="🎁"
        .tags="${["a", "b"]}"
      ></super-daemon-row>`,
    );
    // one glyph per tile: the text character stands in for the icon
    expect(el.shadowRoot.querySelector(".result-icon")).to.be.null;
    expect(el.shadowRoot.querySelector(".result-image")).to.exist;
    expect(
      el.shadowRoot.querySelector(".result-textCharacter").textContent,
    ).to.equal("🎁");
    expect(el.shadowRoot.querySelectorAll("simple-tag").length).to.equal(0);
    expect(el.shadowRoot.querySelector(".tags")).to.be.null;
  });

  it("does not hardcode aria-selected inside the row", async () => {
    // the host (role=option) carries the value super-daemon-ui sets; the
    // host is the single source of truth
    const el = await fixture(
      html`<super-daemon-row title="Aria"></super-daemon-row>`,
    );
    const row = el.shadowRoot.querySelector(".row");
    expect(row.getAttribute("aria-selected")).to.equal(null);
  });

  it("renders the external link icon and more details toggle", async () => {
    const el = await fixture(
      html`<super-daemon-row title="E" external-link more></super-daemon-row>`,
    );
    expect(el.shadowRoot.querySelector(".external-link-icon")).to.exist;
    const moreBtn = el.shadowRoot.querySelector("simple-icon-button.more");
    expect(moreBtn).to.exist;
    expect(el.shadowRoot.querySelector("details")).to.exist;
    // a pointer shortcut: not a separate tab stop inside the option
    expect(moreBtn.getAttribute("aria-hidden")).to.equal("true");
    el.toggleDetailsClick(new Event("click", { cancelable: true }));
    expect(el.showDetails).to.equal(true);
    el.toggleDetailsClick(new Event("click", { cancelable: true }));
    expect(el.showDetails).to.equal(false);
    el.openChanged({ target: { open: true } });
    expect(el.showDetails).to.equal(true);
  });
});
