import { fixture, expect, html } from "@open-wc/testing";

import "../simple-icon-picker.js";
import { SimpleIconsetStore } from '@haxtheweb/simple-icon/lib/simple-iconset.js';

describe("simple-icon-picker test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <simple-icon-picker title="test-title"></simple-icon-picker>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe('simple-icon-picker behavior', () => {
  /** rebuilds are debounced through a setTimeout in updated() */
  async function settle(el, ms = 25) {
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, ms))
    await el.updateComplete
  }

  /** real icon names straight from the shared iconset store */
  function sampleIcons(count) {
    expect(SimpleIconsetStore.iconlist.length).to.be.at.least(count)
    return SimpleIconsetStore.iconlist.slice(0, count)
  }

  function flatValues(el) {
    return el.options
      .flat()
      .filter((o) => o.value)
      .map((o) => o.value)
  }

  it('has the documented defaults', async () => {
    const el = await fixture(html`<simple-icon-picker></simple-icon-picker>`)
    expect(el.allowNull).to.equal(true)
    expect(el.hideOptionLabels).to.equal(true)
    expect(el.icons).to.deep.equal([])
    expect(el.value).to.equal(null)
    expect(el.optionsPerRow).to.equal(6)
    // options start empty until the debounced build runs
    const fresh = document.createElement('simple-icon-picker')
    expect(fresh.options).to.deep.equal([])
  })

  it('falls back to a descriptive listbox aria label', async () => {
    const el = await fixture(html`<simple-icon-picker></simple-icon-picker>`)
    await settle(el)
    expect(el._computeListboxAriaLabel()).to.equal('Select an icon')
    el.ariaLabelledby = 'external-label'
    expect(el._computeListboxAriaLabel()).to.equal(undefined)
    el.ariaLabelledby = null
    el.label = 'Pick your icon'
    expect(el._computeListboxAriaLabel()).to.equal(undefined)
    el.label = ''
    expect(el._computeListboxAriaLabel()).to.equal('Select an icon')
  })

  it('builds rows of options with a leading null choice when allowNull', async () => {
    const el = await fixture(html`<simple-icon-picker></simple-icon-picker>`)
    el.icons = sampleIcons(4)
    await settle(el)
    // ceil(sqrt(4 + 1)) === 3 columns
    expect(el.options.length).to.equal(2)
    expect(el.options[0][0]).to.deep.equal({ alt: 'null', value: null })
    expect(el.options[0]).to.have.lengthOf(3)
    expect(el.options[1]).to.have.lengthOf(2)
    expect(flatValues(el)).to.deep.equal(sampleIcons(4))
    expect(el.options[1][0]).to.deep.equal({
      alt: sampleIcons(4)[2],
      icon: sampleIcons(4)[2],
      value: sampleIcons(4)[2],
    })
  })

  it('parses icons given as a JSON string', async () => {
    const el = await fixture(html`<simple-icon-picker></simple-icon-picker>`)
    const sample = sampleIcons(2)
    el.icons = JSON.stringify(sample)
    await settle(el)
    expect(flatValues(el)).to.deep.equal(sample)
  })

  it('omits the null choice when allowNull is false', async () => {
    const el = await fixture(html`<simple-icon-picker></simple-icon-picker>`)
    const sample = sampleIcons(3)
    el.allowNull = false
    el.icons = sample
    await settle(el)
    expect(el.options[0][0].value).to.equal(sample[0])
    expect(
      el.options.flat().some((o) => o.value === null),
    ).to.equal(false)
    expect(flatValues(el)).to.deep.equal(sample)
  })

  it('caps the column count at optionsPerRow and wraps rows', async () => {
    const el = await fixture(html`<simple-icon-picker></simple-icon-picker>`)
    const sample = sampleIcons(8)
    el.optionsPerRow = 2
    el.icons = sample
    await settle(el)
    for (const row of el.options) {
      expect(row.length).to.be.at.most(2)
    }
    expect(flatValues(el)).to.deep.equal(sample)
  })

  it('fires value-changed when the value is set', async () => {
    const el = await fixture(html`<simple-icon-picker></simple-icon-picker>`)
    const sample = sampleIcons(4)
    el.icons = sample
    await settle(el)
    const events = []
    const onChange = (e) => events.push(e.detail)
    el.addEventListener('value-changed', onChange)
    try {
      el.value = sample[1]
      await settle(el)
      const carried = events.filter((d) => d && d.value === sample[1])
      expect(carried.length).to.be.at.least(1)
    } finally {
      el.removeEventListener('value-changed', onChange)
    }
  })

  it('rebuilds options from the shared iconset store when __iconList changes', async () => {
    const el = await fixture(html`<simple-icon-picker></simple-icon-picker>`)
    el.__iconList = sampleIcons(2)
    await settle(el)
    expect(flatValues(el).length).to.equal(SimpleIconsetStore.iconlist.length)
  })

  it('gates selection until more than one row of options exists', async () => {
    const el = await fixture(html`<simple-icon-picker></simple-icon-picker>`)
    // let the constructor-triggered rebuild from the shared store settle
    await settle(el)
    const changes = []
    const onChange = (e) => changes.push(e.detail)
    el.addEventListener('change', onChange)
    try {
      // a single row skips the base class entirely: no change event and
      // the render-ready options are not replaced
      el.options = [[{ alt: 'only', icon: 'only', value: 'only' }]]
      await settle(el, 0)
      expect(changes.length).to.equal(0)
      expect(el.__options).to.not.deep.equal(el.options)
      // give the value something that cannot match the stale null-option
      // selection, otherwise the base class early-returns before running
      el.value = 'unmatched-value'
      await settle(el, 0)
      // multiple rows let the base class run: change event fires and the
      // render-ready options are recorded
      const twoRows = [
        [{ alt: 'null', value: null }],
        [{ alt: 'a', icon: 'a', value: 'a' }],
      ]
      el.setOptions(twoRows)
      await settle(el, 0)
      expect(changes.length).to.be.at.least(1)
      expect(el.__options).to.deep.equal(twoRows)
    } finally {
      el.removeEventListener('change', onChange)
    }
  })

  describe('_getStoredIcons filtering', () => {
    let originalIconlist

    beforeEach(() => {
      originalIconlist = SimpleIconsetStore.iconlist
    })

    afterEach(() => {
      SimpleIconsetStore.iconlist = originalIconlist
    })

    it('filters by include-sets, exclude-sets and exclude', async () => {
      SimpleIconsetStore.iconlist = [
        'icons:keep-a',
        'icons:keep-b',
        'media:other',
        'av:mixed',
      ]
      const el = await fixture(
        html`<simple-icon-picker></simple-icon-picker>`,
      )
      el.includeSets = ['icons']
      expect(el._getStoredIcons()).to.deep.equal([
        'icons:keep-a',
        'icons:keep-b',
      ])
      // attribute forms arrive as JSON strings and are parsed on the fly
      el.includeSets = '["icons"]'
      expect(el._getStoredIcons()).to.deep.equal([
        'icons:keep-a',
        'icons:keep-b',
      ])
      el.includeSets = null
      el.excludeSets = ['av']
      expect(el._getStoredIcons()).to.deep.equal([
        'icons:keep-a',
        'icons:keep-b',
        'media:other',
      ])
      el.excludeSets = '["av"]'
      expect(el._getStoredIcons()).to.deep.equal([
        'icons:keep-a',
        'icons:keep-b',
        'media:other',
      ])
      el.excludeSets = null
      el.exclude = ['icons:keep-a']
      expect(el._getStoredIcons()).to.deep.equal([
        'icons:keep-b',
        'media:other',
        'av:mixed',
      ])
      el.exclude = '["icons:keep-a"]'
      expect(el._getStoredIcons()).to.deep.equal([
        'icons:keep-b',
        'media:other',
        'av:mixed',
      ])
      // the icons: prefix is stripped before the prefixed exclusion check,
      // so excluding icons:keep-a also removes a prefix-less keep-a entry
      SimpleIconsetStore.iconlist = [
        'icons:keep-a',
        'icons:keep-b',
        'media:other',
        'av:mixed',
        'keep-a',
      ]
      expect(el._getStoredIcons()).to.deep.equal([
        'icons:keep-b',
        'media:other',
        'av:mixed',
      ])
      // restore the four-entry list for the closing assertions
      SimpleIconsetStore.iconlist = [
        'icons:keep-a',
        'icons:keep-b',
        'media:other',
        'av:mixed',
      ]
      el.exclude = null
      expect(el._getStoredIcons()).to.deep.equal([
        'icons:keep-a',
        'icons:keep-b',
        'media:other',
        'av:mixed',
      ])
    })
  })
})

/*
describe("A11y/chai axe tests", () => {
  it("simple-icon-picker passes accessibility test", async () => {
    const el = await fixture(html` <simple-icon-picker></simple-icon-picker> `);
    await expect(el).to.be.accessible();
  });
  it("simple-icon-picker passes accessibility negation", async () => {
    const el = await fixture(
      html`<simple-icon-picker
        aria-labelledby="simple-icon-picker"
      ></simple-icon-picker>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("simple-icon-picker can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<simple-icon-picker .foo=${'bar'}></simple-icon-picker>`);
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
      const el = await fixture(html`<simple-icon-picker ></simple-icon-picker>`);
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
      const el = await fixture(html`<simple-icon-picker></simple-icon-picker>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<simple-icon-picker></simple-icon-picker>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
