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
    el.addEventListener("super-daemon-row-selected", () => (rowSelected = true));
    el.addEventListener("my-event", (e) => (named = e.detail));
    el.addEventListener("super-daemon-close", () => (closed = true));
    el.selected();
    expect(rowSelected).to.equal(true);
    expect(named.a).to.equal(1);
    expect(closed).to.equal(true);
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
      new KeyboardEvent("keydown", { code: "Space", key: " ", cancelable: true }),
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

  it("focus() focuses the inner button", async () => {
    const el = await fixture(
      html`<super-daemon-row title="F"></super-daemon-row>`,
    );
    el.focus();
    const btn = el.shadowRoot.querySelector("button");
    // delegatesFocus makes the host the document-level active element while
    // the shadow root tracks the inner focused button
    expect(el.shadowRoot.activeElement === btn).to.equal(true);
    expect(document.activeElement === el).to.equal(true);
  });

  it("pickColor alternates accent colors", async () => {
    const el = await fixture(
      html`<super-daemon-row title="P"></super-daemon-row>`,
    );
    expect(el.pickColor(0)).to.equal("blue");
    expect(el.pickColor(1)).to.equal("orange");
  });

  it("renders icon, image, text character, and tags", async () => {
    const el = await fixture(
      html`<super-daemon-row
        title="T"
        icon="save"
        image="x.png"
        text-character="🎁"
        .tags="${['a', 'b']}"
      ></super-daemon-row>`,
    );
    expect(el.shadowRoot.querySelector(".result-icon")).to.exist;
    expect(el.shadowRoot.querySelector(".result-image")).to.exist;
    expect(
      el.shadowRoot.querySelector(".result-textCharacter").textContent,
    ).to.equal("🎁");
    expect(el.shadowRoot.querySelectorAll("simple-tag").length).to.equal(2);
  });

  it("renders the external link icon and more details toggle", async () => {
    const el = await fixture(
      html`<super-daemon-row title="E" external-link more></super-daemon-row>`,
    );
    expect(el.shadowRoot.querySelector(".external-link-icon")).to.exist;
    const moreBtn = el.shadowRoot.querySelector("simple-icon-button.more");
    expect(moreBtn).to.exist;
    expect(el.shadowRoot.querySelector("details")).to.exist;
    el.toggleDetailsClick(new Event("click", { cancelable: true }));
    expect(el.showDetails).to.equal(true);
    el.toggleDetailsKey(
      new KeyboardEvent("keydown", { key: "Enter", cancelable: true }),
    );
    expect(el.showDetails).to.equal(false);
    el.openChanged({ target: { open: true } });
    expect(el.showDetails).to.equal(true);
  });

  it("toggleDetailsKey ignores non-activating keys", async () => {
    const el = await fixture(
      html`<super-daemon-row title="K2" more></super-daemon-row>`,
    );
    el.showDetails = false;
    el.toggleDetailsKey(
      new KeyboardEvent("keydown", { key: "a", cancelable: true }),
    );
    expect(el.showDetails).to.equal(false);
  });
});
