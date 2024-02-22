import { fixture, expect, html } from "@open-wc/testing";

import "../relative-heading.js";

describe("relative-heading test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<relative-heading id="lorem">
          <h1>Lorem ipsum dolor</h1>
        </relative-heading>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

        <relative-heading id="praesent" parent="lorem">
          <h2>Praesent ultrices</h2>
        </relative-heading>
        <p>
          Mauris aliquam lorem justo. Praesent ultrices lorem nec est iaculis
          viverra dignissim eu neque. Nullam vitae nisl diam.
        </p>

        <relative-heading id="suspendisse" parent="praesent">
          <h3>Suspendisse</h3>
        </relative-heading>
        <p>
          Suspendisse potenti. Nulla venenatis porta felis id feugiat. Vivamus
          vehicula molestie sapien hendrerit ultricies.
        </p>

        <relative-heading id="sapien" parent="suspendisse">
          <h4>Sapien sit amet</h4>
        </relative-heading>
        <p>
          Quisque volutpat eu sapien sit amet interdum. Proin venenatis tellus
          eu nisi congue aliquet.
        </p>

        <relative-heading id="sollicitudin" parent="sapien">
          <h5>Sollicitudin</h5>
        </relative-heading>
        <p>
          Nullam at velit sollicitudin, porta mi quis, lacinia velit. Praesent
          quis mauris sem.
        </p>

        <relative-heading id="volutpat" parent="sollicitudin">
          <h6>In et volutpat</h6>
        </relative-heading>
        <p>
          In et volutpat nisi. Suspendisse vel nibh eu magna posuere
          sollicitudin. Praesent ac ex varius, facilisis urna et, cursus tellus.
        </p> `,
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("relative-heading passes accessibility test", async () => {
    const el = await fixture(html` <relative-heading></relative-heading> `);
    await expect(el).to.be.accessible();
  });
  it("relative-heading passes accessibility negation", async () => {
    const el = await fixture(
      html`<relative-heading
        aria-labelledby="relative-heading"
      ></relative-heading>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("relative-heading can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<relative-heading .foo=${'bar'}></relative-heading>`);
    expect(el.foo).to.equal('bar');
  })
})
*/

/*
// Test if element is mobile responsive
describe('Test Mobile Responsiveness', () => {
    before(async () => {z   
      await setViewport({width: 375, height: 750});
    })
    it('sizes down to 360px', async () => {
      const el = await fixture(html`<relative-heading ></relative-heading>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('360px');
    })
}) */

/*
// Test if element sizes up for desktop behavior
describe('Test Desktop Responsiveness', () => {
    before(async () => {
      await setViewport({width: 1000, height: 1000});
    })
    it('sizes up to 410px', async () => {
      const el = await fixture(html`<relative-heading></relative-heading>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<relative-heading></relative-heading>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
