import { fixture, expect, html } from "@open-wc/testing";

import "../nav-card.js";

describe("nav-card test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <nav-card accent-color="green">
        <div slot="heading">Useful Links</div>
        <div slot="subheading">
          (...or just <a href="//google.com">Google it</a>)
        </div>
        <p slot="body">Check out these useful links.</p>
        <div slot="linklist">
          <nav-card-item
            icon="chevron-right"
            avatar="//placekitten.com/200/200"
          >
            <button id="heading1" aria-describedby="sub1" slot="label">
              Button text
            </button>
            <span id="sub1" slot="description"
              >A subheading that provides more description</span
            >
          </nav-card-item>
          <nav-card-item
            icon="chevron-right"
            avatar="//placekitten.com/190/200"
          >
            <a id="heading2" aria-describedby="sub2" slot="label" href="#"
              >Accessible link text</a
            >
            <span id="sub2" slot="description"
              >A subheading that provides more description</span
            >
          </nav-card-item>
          <nav-card-item
            icon="chevron-right"
            accent-color="cyan"
            avatar="account-circle"
          >
            <a id="heading3" aria-describedby="sub3" slot="label" href="#"
              >Accessible link text</a
            >
            <span id="sub3" slot="description"
              >A subheading that provides more description</span
            >
          </nav-card-item>
          <nav-card-item
            icon="chevron-right"
            accent-color="pink"
            dark
            avatar="star"
          >
            <button id="heading4" aria-describedby="sub4" slot="label">
              Button text
            </button>
            <span id="sub4" slot="description"
              >A subheading that provides more description</span
            >
          </nav-card-item>
          <nav-card-item icon="chevron-right">
            <a id="heading5" aria-describedby="sub5" slot="label" href="#"
              >Accessible link text</a
            >
            <span id="sub5" slot="description"
              >A subheading that provides more description</span
            >
          </nav-card-item>
          <nav-card-item icon="chevron-right" initials="H6">
            <a id="heading6" aria-describedby="sub6" slot="label" href="#"
              >Accessible link text</a
            >
            <span id="sub6" slot="description"
              >A subheading that provides more description</span
            >
          </nav-card-item>
        </div>
        <p slot="footer">
          &lt;nav-card&gt;© The Pennsylvania State University
        </p>
      </nav-card>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("nav-card passes accessibility test", async () => {
    const el = await fixture(html` <nav-card></nav-card> `);
    await expect(el).to.be.accessible();
  });
  it("nav-card passes accessibility negation", async () => {
    const el = await fixture(
      html`<nav-card aria-labelledby="nav-card"></nav-card>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("nav-card can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<nav-card .foo=${'bar'}></nav-card>`);
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
      const el = await fixture(html`<nav-card ></nav-card>`);
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
      const el = await fixture(html`<nav-card></nav-card>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<nav-card></nav-card>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
