import { fixture, expect, html } from "@open-wc/testing";
import { LitElement } from "lit";
import * as DDDModule from "../d-d-d.js";
import {
  DDDAccentMap,
  DDDAccentStyles,
  dddAccentName,
} from "../lib/DDDAccent.js";

class DDDAccentTester extends LitElement {
  static get styles() {
    return [DDDAccentStyles];
  }
  static get properties() {
    return {
      accentColor: { type: String, reflect: true, attribute: "accent-color" },
    };
  }
  render() {
    return html`<span>x</span>`;
  }
}
globalThis.customElements.define("ddd-accent-tester", DDDAccentTester);

describe("DDDAccent", () => {
  it("is a standalone module that adds nothing to the d-d-d exports", () => {
    expect(DDDModule.DDDAccentStyles).to.equal(undefined);
    expect(DDDModule.DDDAccentMap).to.equal(undefined);
  });

  it("maps every SimpleColors name to a DDD colour", () => {
    const names = [
      "red",
      "pink",
      "purple",
      "deep-purple",
      "indigo",
      "blue",
      "light-blue",
      "cyan",
      "teal",
      "green",
      "light-green",
      "lime",
      "yellow",
      "amber",
      "orange",
      "deep-orange",
      "brown",
      "grey",
      "blue-grey",
    ];
    names.forEach((n) => {
      expect(DDDAccentMap[n], n).to.be.an("array").with.length(3);
    });
    expect(dddAccentName("blue")).to.equal("beaverBlue");
    expect(dddAccentName("red")).to.equal("original87Pink");
    expect(dddAccentName("not-a-colour")).to.equal("");
  });

  it("sets the accent custom properties from the attribute", async () => {
    const el = await fixture(
      html`<ddd-accent-tester
        accent-color="blue"
        style="--ddd-theme-default-beaverBlue: #1e407c; --ddd-theme-default-pughBlue: #96bee6; --ddd-theme-default-white: #fff; --ddd-theme-default-potentialMidnight: #000321; color-scheme: light"
      ></ddd-accent-tester>`,
    );
    const cs = getComputedStyle(el);
    const accent = cs.getPropertyValue("--ddd-accent-color").trim();
    expect(accent).to.not.equal("");
    expect(cs.getPropertyValue("--ddd-block-accent").trim()).to.equal(accent);
    expect(cs.getPropertyValue("--ddd-accent-color-tint").trim()).to.not.equal(
      "",
    );
    expect(cs.getPropertyValue("--ddd-accent-color-ink").trim()).to.not.equal(
      "",
    );
  });

  it("sets nothing without an accent-color", async () => {
    const el = await fixture(html`<ddd-accent-tester></ddd-accent-tester>`);
    expect(
      getComputedStyle(el).getPropertyValue("--ddd-accent-color").trim(),
    ).to.equal("");
  });
});
