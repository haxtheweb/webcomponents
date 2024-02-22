import { fixture, expect, html } from "@open-wc/testing";
import "../page-flag.js";

describe("page-flag test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <style>
          page-flag:not(:defined) {
            display: none;
          }
          .wrapper {
            max-width: 1200px;
            margin: 0 auto;
            position: relative;
          }
        </style>
        <div class="wrapper">
          <grid-plate layout="1-1">
            <div slot="col-1">
              <h3>Basic page-flag demo</h3>
              <page-flag accent-color="yellow">
                <page-flag-comment seed="Bryan" accent-color="grey"
                  >This is a comment</page-flag-comment
                >
                <page-flag-comment seed="Other person" accent-color="orange"
                  >This is a comment</page-flag-comment
                >
                <page-flag-comment seed="Bryan" accent-color="green"
                  >This is a comment</page-flag-comment
                >
              </page-flag>
              <p>Here's a bunch of content</p>
              <p>Here's a bunch of content</p>
              <p>Here's a bunch of content</p>
              <p>Here's a bunch of content</p>
              <p>Here's a bunch of content</p>
              <p>Here's a bunch of content</p>
              <p>Here's a bunch of content</p>
              <page-flag accent-color="orange">
                <page-flag-comment
                  seed="Bryan"
                  date="2 days ago"
                  accent-color="grey"
                  >This is a comment</page-flag-comment
                >
                <page-flag-comment
                  seed="Other person"
                  date="2 days ago"
                  accent-color="orange"
                  >This is a comment</page-flag-comment
                >
                <page-flag-comment
                  seed="Bryan"
                  date="3 days ago"
                  accent-color="green"
                  >This is a comment</page-flag-comment
                >
              </page-flag>
              <p>Here's a bunch of content</p>
            </div>
            <div slot="col-2">
              <h3>Basic page-flag demo</h3>
              <page-flag accent-color="yellow">
                <page-flag-comment
                  seed="Bryan"
                  date="2 days ago"
                  accent-color="grey"
                  >This is a comment</page-flag-comment
                >
                <page-flag-comment
                  seed="Other person"
                  date="2 days ago"
                  accent-color="orange"
                  >This is a comment</page-flag-comment
                >
                <page-flag-comment
                  seed="Bryan"
                  date="3 days ago"
                  accent-color="green"
                  >This is a comment</page-flag-comment
                >
              </page-flag>
              <p>Here's a bunch of content</p>
              <p>Here's a bunch of content</p>
              <p>Here's a bunch of content</p>
              <page-flag>
                <page-flag-comment
                  seed="Bryan"
                  date="2 days ago"
                  accent-color="grey"
                  >This is a comment</page-flag-comment
                >
                <page-flag-comment
                  seed="Other person"
                  date="2 days ago"
                  accent-color="orange"
                  >This is a comment</page-flag-comment
                >
                <page-flag-comment
                  seed="Bryan"
                  date="3 days ago"
                  accent-color="green"
                  >This is a comment</page-flag-comment
                >
              </page-flag>
              <p>Here's a bunch of content</p>
              <p>Here's a bunch of content</p>
              <p>Here's a bunch of content</p>
              <p>Here's a bunch of content</p>
              <page-flag accent-color="orange">
                <page-flag-comment
                  seed="Bryan"
                  date="2 days ago"
                  accent-color="grey"
                  >This is a comment</page-flag-comment
                >
                <page-flag-comment
                  seed="Other person"
                  date="2 days ago"
                  accent-color="orange"
                  >This is a comment</page-flag-comment
                >
                <page-flag-comment
                  seed="Bryan"
                  date="3 days ago"
                  accent-color="green"
                  >This is a comment</page-flag-comment
                >
              </page-flag>
              <p>Here's a bunch of content</p>
            </div>
          </grid-plate>
        </div>`,
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("page-flag passes accessibility test", async () => {
    const el = await fixture(html` <page-flag></page-flag> `);
    await expect(el).to.be.accessible();
  });
  it("page-flag passes accessibility negation", async () => {
    const el = await fixture(
      html`<page-flag aria-labelledby="page-flag"></page-flag>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("page-flag can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<page-flag .foo=${'bar'}></page-flag>`);
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
      const el = await fixture(html`<page-flag ></page-flag>`);
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
      const el = await fixture(html`<page-flag></page-flag>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<page-flag></page-flag>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
