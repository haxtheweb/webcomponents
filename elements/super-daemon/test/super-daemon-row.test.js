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
