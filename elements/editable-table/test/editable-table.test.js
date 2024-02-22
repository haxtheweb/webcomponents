import { fixture, expect, html } from "@open-wc/testing";

import "../editable-table.js";

describe("editable-table test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<editable-table
        id="food-table"
        bordered
        condensed
        filter
        printable
        responsive
        sort
        striped
      >
        <table>
          <caption>
            Is it a
            <em>sandwich</em
            >? Food classification chart.
          </caption>
          <thead>
            <tr>
              <th scope="row">Food</th>
              <th scope="col">Enclosure</th>
              <th scope="col">Contents</th>
              <th scope="col">Orientation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Hamburger</th>
              <td>one bun, split into two</td>
              <td>meat, vegetables, cheese, <i>and/or</i> condiments</td>
              <td>horizontal</td>
            </tr>
            <tr>
              <th scope="row">Hoagie</th>
              <td>one bun</td>
              <td>meat, vegetables, cheese, <i>and/or</i> condiments</td>
              <td>vertical</td>
            </tr>
            <tr>
              <th scope="row">Hot Dog</th>
              <td>one bun</td>
              <td>meat, vegetables, cheese, <i>and/or</i> condiments</td>
              <td>vertical</td>
            </tr>
            <tr>
              <th scope="row">Hot Pocket</th>
              <td>two crusts sealed together</td>
              <td>meat, vegetables, cheese, <i>and/or</i> condiments</td>
              <td>horizontal</td>
            </tr>
            <tr>
              <th scope="row">Pie</th>
              <td>two crusts sealed together</td>
              <td>fruit or meat, vegetables, <i>and/or</i> cheese</td>
              <td>horizontal</td>
            </tr>
            <tr>
              <th scope="row">Taco</th>
              <td>one shell</td>
              <td>meat, vegetables, cheese, <i>and/or</i> condiments</td>
              <td>vertical</td>
            </tr>
          </tbody>
        </table>
      </editable-table> `,
    );
  });

  it("passes the a11y audit", () => {
    expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("editable-table passes accessibility test", async () => {
    const el = await fixture(html` <editable-table></editable-table> `);
    await expect(el).to.be.accessible();
  });
  it("editable-table passes accessibility negation", async () => {
    const el = await fixture(
      html`<editable-table aria-labelledby="editable-table"></editable-table>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("editable-table can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<editable-table .foo=${'bar'}></editable-table>`);
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
      const el = await fixture(html`<editable-table ></editable-table>`);
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
      const el = await fixture(html`<editable-table></editable-table>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<editable-table></editable-table>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
