import { fixture, expect, html } from "@open-wc/testing";

import "../lrndesign-timeline.js";

describe("lrndesign-timeline test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <lrndesign-timeline id="mytimeline" accent-color="blue" dark>
        <p>This is lrndesign-timeline</p>
        <section>
          <img
            class="media"
            alt="Profile illustration of, James Pollock, Governor of Pennsylvania 1855-1858."
            src="https://upload.wikimedia.org/wikipedia/commons/5/56/James_Pollock_Pennsylvania_Governor.jpg"
          />
          <h3>1855 - Charter</h3>
          <p>
            Charter now in effect signed by Governor Pollock, February 22; first
            Board of Trustees president, Judge Frederick Watts of Carlisle. Site
            in Centre County selected from nine offered throughout state; 200
            acres donated by James Irvin with $10,000 pledge from citizens of
            Centre and Huntingdon counties.
          </p>
        </section>
        <section>
          <img
            class="media"
            alt="Black and white photo original Old Main in an empty field."
            src="https://libraries.psu.edu/sites/default/files/migrated/1287768717666.jpg"
          />
          <h3>"1856 - Construction of Old Main</h3>
          <p>
            Construction of Old Main (the &amp;quot;College Building&amp;quot;)
            begun; supervised by William G. Waring, who was appointed
            superintendent to open the school and plan farm, orchards and
            nursery.
          </p>
        </section>
        <section>
          <h3>1874 - The Pennsylvania State College</h3>
          <p>School renamed The Pennsylvania State College.</p>
        </section>
        <section>
          <h3>1953 - The Pennsylvania State University</h3>
          <p>The Pennsylvania State University became official name.</p>
        </section>
      </lrndesign-timeline>`
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("lrndesign-timeline passes accessibility test", async () => {
    const el = await fixture(html` <lrndesign-timeline></lrndesign-timeline> `);
    await expect(el).to.be.accessible();
  });
  it("lrndesign-timeline passes accessibility negation", async () => {
    const el = await fixture(
      html`<lrndesign-timeline
        aria-labelledby="lrndesign-timeline"
      ></lrndesign-timeline>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("lrndesign-timeline can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<lrndesign-timeline .foo=${'bar'}></lrndesign-timeline>`);
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
      const el = await fixture(html`<lrndesign-timeline ></lrndesign-timeline>`);
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
      const el = await fixture(html`<lrndesign-timeline></lrndesign-timeline>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<lrndesign-timeline></lrndesign-timeline>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
