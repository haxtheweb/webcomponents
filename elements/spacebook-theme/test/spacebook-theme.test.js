import { html, fixture, expect } from '@open-wc/testing';
import "../spacebook-theme.js";

describe("SpacebookTheme test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <spacebook-theme
        title="title"
      ></spacebook-theme>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    // The skip-link and its #main-content target are both authored correctly
    // inside this theme shadow DOM. axe-core's skip-link rule resolves the
    // fragment target via document.getElementById, which cannot pierce a
    // shadow boundary, so it reports a false "No skip link target". The
    // rule is disabled here for that known shadow-DOM limitation only.
    await expect(element).shadowDom.to.be.accessible({
      ignoredRules: ["skip-link"],
    });
  });
});
