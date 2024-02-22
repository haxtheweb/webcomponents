import { fixture, expect, html } from "@open-wc/testing";

import "../check-it-out.js";

describe("check-it-out test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<check-it-out
        modal
        type="code"
        modal-title="React ew"
        ctl
        view="both"
        source="https://stackblitz.com/edit/react-brwwcr?embed=1&file=src/App.js"
      >
        Click me
      </check-it-out>`,
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
