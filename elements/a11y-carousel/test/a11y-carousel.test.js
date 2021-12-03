import { fixture, expect, html } from "@open-wc/testing";
import "../a11y-carousel.js";
describe("a11y-carousel test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <a11y-carousel id="demo1" no-prev-next>
        <figure id="figure-1">
          <img src="//placekitten.com/400/200" alt="Random Kitten, 400 X 200" />
          <figcaption>Item 1</figcaption>
        </figure>
        <figure id="figure-2">
          <img src="//placekitten.com/300/100" alt="Random Kitten, 300 X 100" />
          <figcaption>Item 2</figcaption>
        </figure>
        <figure id="figure-3">
          <img src="//placekitten.com/400/300" alt="Random Kitten, 400 X 300" />
          <figcaption>Item 3</figcaption>
        </figure>
      </a11y-carousel>
    `);
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.noPrevNext).to.equal(true);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
