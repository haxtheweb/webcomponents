import { fixture, expect, html } from "@open-wc/testing";

import "../simple-datetime.js";

describe("simple-datetime test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<simple-datetime unix="" timestamp="445939200"></simple-datetime>`,
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe('simple-datetime behavior', () => {
  /**
   * Lit schedules a second update because updated() sets this.date,
   * so settle across a couple of cycles before asserting rendered output
   */
  async function settle(el) {
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 0))
    await el.updateComplete
  }

  it('renders a time element bound to the computed date', async () => {
    const el = await fixture(
      html`<simple-datetime unix="" timestamp="445939200"></simple-datetime>`,
    )
    await settle(el)
    const expected = new Date(445939200 * 1000).format('M jS, Y')
    expect(el.date).to.equal(expected)
    const time = el.shadowRoot.querySelector('time')
    expect(time).to.exist
    expect(time.getAttribute('datetime')).to.equal(expected)
    expect(time.textContent.trim()).to.equal(expected)
  })

  it('treats the timestamp as milliseconds when unix is not set', async () => {
    const el = await fixture(
      html`<simple-datetime timestamp="1704067200000"></simple-datetime>`,
    )
    await settle(el)
    expect(el.unix).to.equal(false)
    expect(el.date).to.equal(new Date(1704067200000).format('M jS, Y'))
  })

  it('has the documented defaults', async () => {
    const el = await fixture(html`<simple-datetime></simple-datetime>`)
    await settle(el)
    expect(el.format).to.equal('M jS, Y')
    expect(el.unix).to.equal(false)
    // without a timestamp there is nothing to format so it stays empty
    const time = el.shadowRoot.querySelector('time')
    expect(time).to.exist
    expect(el.date).to.equal(undefined)
    expect(time.getAttribute('datetime')).to.equal('')
    expect(time.textContent.trim()).to.equal('')
  })

  it('recomputes the date when format changes', async () => {
    const el = await fixture(
      html`<simple-datetime unix="" timestamp="445939200"></simple-datetime>`,
    )
    await settle(el)
    el.format = 'Y-m-d'
    await settle(el)
    expect(el.date).to.equal(new Date(445939200 * 1000).format('Y-m-d'))
    expect(el.shadowRoot.querySelector('time').textContent.trim()).to.equal(
      el.date,
    )
  })

  it('recomputes the date when unix is toggled', async () => {
    const el = await fixture(
      html`<simple-datetime unix="" timestamp="445939200"></simple-datetime>`,
    )
    await settle(el)
    el.unix = false
    await settle(el)
    // without unix, 445939200 is read as milliseconds
    expect(el.date).to.equal(new Date(445939200).format('M jS, Y'))
  })

  it('recomputes the date when timestamp changes', async () => {
    const el = await fixture(
      html`<simple-datetime unix="" timestamp="445939200"></simple-datetime>`,
    )
    await settle(el)
    el.timestamp = 1704067200
    await settle(el)
    expect(el.date).to.equal(new Date(1704067200 * 1000).format('M jS, Y'))
  })

  it('formatDate multiplies unix timestamps by 1000', () => {
    const el = document.createElement('simple-datetime')
    // epoch renders in local time, so compare with a locally computed year
    expect(el.formatDate(0, 'Y', true)).to.equal(
      String(new Date(0).getFullYear()),
    )
    expect(el.formatDate(0, 'Y', false)).to.equal(
      String(new Date(0).getFullYear()),
    )
    // U is timezone independent: 2s as unix -> 2000ms as javascript
    expect(el.formatDate(2, 'U', true)).to.equal('2')
    expect(el.formatDate(2000, 'U', false)).to.equal('2')
  })
})

/*
describe("A11y/chai axe tests", () => {
  it("simple-datetime passes accessibility test", async () => {
    const el = await fixture(html` <simple-datetime></simple-datetime> `);
    await expect(el).to.be.accessible();
  });
  it("simple-datetime passes accessibility negation", async () => {
    const el = await fixture(
      html`<simple-datetime
        aria-labelledby="simple-datetime"
      ></simple-datetime>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("simple-datetime can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<simple-datetime .foo=${'bar'}></simple-datetime>`);
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
      const el = await fixture(html`<simple-datetime ></simple-datetime>`);
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
      const el = await fixture(html`<simple-datetime></simple-datetime>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<simple-datetime></simple-datetime>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
