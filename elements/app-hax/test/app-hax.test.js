import { fixture, expect, html } from "@open-wc/testing";
import "../app-hax.js";

describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <base href="/elements/app-hax/demo/" />
        <app-hax base-path="/elements/app-hax/demo/">
          <a href="https://www.psu.edu" slot="app-header-pre"
            ><img
              src="https://iam.hax.psu.edu/assets/psu.png"
              style="height:48px;display:inline-flex;vertical-align:top;"
              alt="Pennsylvania State University"
          /></a>
        </app-hax>`,
    );
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
