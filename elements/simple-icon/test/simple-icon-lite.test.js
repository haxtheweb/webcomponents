import { fixture, expect, html } from '@open-wc/testing'
import { LitElement } from 'lit'

// Explicit import so istanbul instruments the lib file
import '../lib/simple-icon-lite.js'
import { SimpleIconLite, SimpleIconBehaviors } from '../lib/simple-icon-lite.js'
import { SimpleIconsetStore } from '../lib/simple-iconset.js'

// Test subclass that forces the SVG render path (no Safari polyfill).
// SimpleIconBehaviors uses useSafariPolyfill to switch between an <svg>
// and a <div id="svg-polyfill"> mask. Chromium's UA contains "Safari"
// so the default getter returns true in tests; this subclass forces false.
class TestSVGIcon extends SimpleIconBehaviors(LitElement) {
  static get tag() {
    return 'test-svg-icon-lite'
  }
  get useSafariPolyfill() {
    return false
  }
}
customElements.define(TestSVGIcon.tag, TestSVGIcon)

// Test subclass that forces the polyfill render path.
class TestPolyfillIcon extends SimpleIconBehaviors(LitElement) {
  static get tag() {
    return 'test-polyfill-icon-lite'
  }
  get useSafariPolyfill() {
    return true
  }
}
customElements.define(TestPolyfillIcon.tag, TestPolyfillIcon)

// Wait for LitElement update + deferred microtasks (setSrcByIcon is
// deferred via Promise.resolve().then() in updated()).
async function settle(el) {
  await new Promise((r) => setTimeout(r, 0))
  await el.updateComplete
}

describe('simple-icon-lite', () => {
  let origIconsets
  let origManifest
  let origIconlist
  let origNeedsHydrated
  let origBodyDir
  let origBodyXmlDir
  let origDocDir
  let origDocXmlDir

  beforeEach(() => {
    origIconsets = SimpleIconsetStore.iconsets
    origManifest = SimpleIconsetStore.manifest
    origIconlist = SimpleIconsetStore.iconlist
    origNeedsHydrated = SimpleIconsetStore.needsHydrated
    SimpleIconsetStore.iconsets = {}
    SimpleIconsetStore.manifest = {}
    SimpleIconsetStore.iconlist = []
    SimpleIconsetStore.needsHydrated = []
    SimpleIconsetStore.registerIconset('icons', {
      home: '/icons/home.svg',
      search: '/icons/search.svg',
    })
    SimpleIconsetStore.registerIconset('custom', '/base/path/')

    origBodyDir = globalThis.document.body.getAttribute('dir')
    origBodyXmlDir = globalThis.document.body.getAttribute('xml:dir')
    origDocDir = globalThis.document.documentElement.getAttribute('dir')
    origDocXmlDir =
      globalThis.document.documentElement.getAttribute('xml:dir')
    globalThis.document.body.removeAttribute('dir')
    globalThis.document.body.removeAttribute('xml:dir')
    globalThis.document.documentElement.removeAttribute('dir')
    globalThis.document.documentElement.removeAttribute('xml:dir')
  })

  afterEach(() => {
    SimpleIconsetStore.iconsets = origIconsets
    SimpleIconsetStore.manifest = origManifest
    SimpleIconsetStore.iconlist = origIconlist
    SimpleIconsetStore.needsHydrated = origNeedsHydrated
    if (origBodyDir) {
      globalThis.document.body.setAttribute('dir', origBodyDir)
    } else {
      globalThis.document.body.removeAttribute('dir')
    }
    if (origBodyXmlDir) {
      globalThis.document.body.setAttribute('xml:dir', origBodyXmlDir)
    } else {
      globalThis.document.body.removeAttribute('xml:dir')
    }
    if (origDocDir) {
      globalThis.document.documentElement.setAttribute('dir', origDocDir)
    } else {
      globalThis.document.documentElement.removeAttribute('dir')
    }
    if (origDocXmlDir) {
      globalThis.document.documentElement.setAttribute('xml:dir', origDocXmlDir)
    } else {
      globalThis.document.documentElement.removeAttribute('xml:dir')
    }
  })

  describe('SimpleIconLite basic', () => {
    it('instantiates as a SimpleIconLite', async () => {
      const el = await fixture(html`<simple-icon-lite></simple-icon-lite>`)
      expect(el).to.be.instanceof(SimpleIconLite)
    })

    it('has the correct tag name', () => {
      expect(SimpleIconLite.tag).to.equal('simple-icon-lite')
    })

    it('passes a11y audit (shadow DOM)', async () => {
      const el = await fixture(
        html`<simple-icon-lite title="test"></simple-icon-lite>`,
      )
      await expect(el).shadowDom.to.be.accessible()
    })

    it('defaults noColorize to false', async () => {
      const el = await fixture(html`<simple-icon-lite></simple-icon-lite>`)
      expect(el.noColorize).to.be.false
    })

    it('defaults dir to ltr when no dir attributes set', async () => {
      const el = await fixture(html`<simple-icon-lite></simple-icon-lite>`)
      expect(el.dir).to.equal('ltr')
    })

    it('reflects icon attribute to property', async () => {
      const el = await fixture(
        html`<simple-icon-lite icon="icons:home"></simple-icon-lite>`,
      )
      expect(el.getAttribute('icon')).to.equal('icons:home')
      expect(el.icon).to.equal('icons:home')
    })

    it('reflects dir attribute to property', async () => {
      const el = await fixture(
        html`<simple-icon-lite dir="rtl"></simple-icon-lite>`,
      )
      expect(el.getAttribute('dir')).to.equal('rtl')
      expect(el.dir).to.equal('rtl')
    })

    it('sets noColorize from no-colorize attribute', async () => {
      const el = await fixture(
        html`<simple-icon-lite no-colorize></simple-icon-lite>`,
      )
      expect(el.noColorize).to.be.true
    })
  })

  describe('static properties', () => {
    it('declares dir, src, noColorize, and icon', () => {
      const props = SimpleIconLite.properties
      expect(props).to.have.property('dir')
      expect(props).to.have.property('src')
      expect(props).to.have.property('noColorize')
      expect(props).to.have.property('icon')
    })

    it('icon property has reflect: true', () => {
      expect(SimpleIconLite.properties.icon.reflect).to.equal(true)
    })

    it('dir property has reflect: true', () => {
      expect(SimpleIconLite.properties.dir.reflect).to.equal(true)
    })

    it('noColorize maps to no-colorize attribute', () => {
      expect(SimpleIconLite.properties.noColorize.attribute).to.equal(
        'no-colorize',
      )
    })
  })

  describe('static styles', () => {
    it('returns an array', () => {
      expect(SimpleIconLite.styles).to.be.an('array')
    })

    it('is not empty', () => {
      expect(SimpleIconLite.styles.length).to.be.greaterThan(0)
    })
  })

  describe('feFlood getter', () => {
    it('returns svg template when noColorize is false', async () => {
      const el = await fixture(html`<test-svg-icon-lite></test-svg-icon-lite>`)
      el.noColorize = false
      const result = el.feFlood
      expect(result).to.exist
      expect(result.strings).to.exist
    })

    it('returns empty string when noColorize is true', async () => {
      const el = await fixture(html`<test-svg-icon-lite></test-svg-icon-lite>`)
      el.noColorize = true
      expect(el.feFlood).to.equal('')
    })
  })

  describe('documentDir getter', () => {
    it('returns ltr when no dir attributes are set', async () => {
      const el = await fixture(
        html`<simple-icon-lite></simple-icon-lite>`,
      )
      expect(el.documentDir).to.equal('ltr')
    })

    it('reads dir from document body', async () => {
      globalThis.document.body.setAttribute('dir', 'rtl')
      const el = await fixture(
        html`<simple-icon-lite></simple-icon-lite>`,
      )
      expect(el.documentDir).to.equal('rtl')
    })

    it('reads xml:dir from document body', async () => {
      globalThis.document.body.setAttribute('xml:dir', 'rtl')
      const el = await fixture(
        html`<simple-icon-lite></simple-icon-lite>`,
      )
      expect(el.documentDir).to.equal('rtl')
    })

    it('reads dir from documentElement when body has none', async () => {
      globalThis.document.documentElement.setAttribute('dir', 'rtl')
      const el = await fixture(
        html`<simple-icon-lite></simple-icon-lite>`,
      )
      expect(el.documentDir).to.equal('rtl')
    })

    it('reads xml:dir from documentElement when body has none', async () => {
      globalThis.document.documentElement.setAttribute('xml:dir', 'rtl')
      const el = await fixture(
        html`<simple-icon-lite></simple-icon-lite>`,
      )
      expect(el.documentDir).to.equal('rtl')
    })

    it('body dir takes priority over documentElement dir', async () => {
      globalThis.document.body.setAttribute('dir', 'ltr')
      globalThis.document.documentElement.setAttribute('dir', 'rtl')
      const el = await fixture(
        html`<simple-icon-lite></simple-icon-lite>`,
      )
      expect(el.documentDir).to.equal('ltr')
    })

    it('body xml:dir takes priority over body dir', async () => {
      globalThis.document.body.setAttribute('xml:dir', 'rtl')
      globalThis.document.body.setAttribute('dir', 'ltr')
      const el = await fixture(
        html`<simple-icon-lite></simple-icon-lite>`,
      )
      expect(el.documentDir).to.equal('rtl')
    })
  })

  describe('useSafariPolyfill getter', () => {
    it('returns a boolean for SimpleIconLite', async () => {
      const el = await fixture(
        html`<simple-icon-lite></simple-icon-lite>`,
      )
      expect(el.useSafariPolyfill).to.be.a('boolean')
    })

    it('returns true when UA contains Safari', async () => {
      const el = await fixture(
        html`<test-polyfill-icon-lite></test-polyfill-icon-lite>`,
      )
      expect(el.useSafariPolyfill).to.equal(true)
    })

    it('returns false in TestSVGIcon subclass', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite></test-svg-icon-lite>`,
      )
      expect(el.useSafariPolyfill).to.equal(false)
    })
  })

  describe('safariMask getter', () => {
    it('returns empty string when src is not set', async () => {
      const el = await fixture(
        html`<test-polyfill-icon-lite></test-polyfill-icon-lite>`,
      )
      expect(el.safariMask).to.equal('')
    })

    it('returns mask url when src is set', async () => {
      const el = await fixture(
        html`<test-polyfill-icon-lite></test-polyfill-icon-lite>`,
      )
      el.src = '/icons/home.svg'
      expect(el.safariMask).to.equal(
        'url(/icons/home.svg) no-repeat center / contain',
      )
    })

    it('returns empty string when useSafariPolyfill is false even with src', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite></test-svg-icon-lite>`,
      )
      el.src = '/icons/home.svg'
      expect(el.safariMask).to.equal('')
    })
  })

  describe('SVG render path (useSafariPolyfill false)', () => {
    it('renders an svg element', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite></test-svg-icon-lite>`,
      )
      expect(el.shadowRoot.querySelector('svg')).to.exist
    })

    it('renders a filter element inside svg', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite></test-svg-icon-lite>`,
      )
      expect(el.shadowRoot.querySelector('filter')).to.exist
    })

    it('renders an image element inside svg', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite></test-svg-icon-lite>`,
      )
      expect(el.shadowRoot.querySelector('image')).to.exist
    })

    it('renders feFlood when noColorize is false', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite></test-svg-icon-lite>`,
      )
      expect(el.shadowRoot.querySelector('feFlood')).to.exist
    })

    it('does not render feFlood when no-colorize is set', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite no-colorize></test-svg-icon-lite>`,
      )
      expect(el.shadowRoot.querySelector('feFlood')).to.be.null
    })

    it('does not render the polyfill div', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite></test-svg-icon-lite>`,
      )
      expect(el.shadowRoot.querySelector('#svg-polyfill')).to.be.null
    })

    it('sets a unique filter id in firstUpdated', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite></test-svg-icon-lite>`,
      )
      const filter = el.shadowRoot.querySelector('filter')
      const id = filter.getAttribute('id')
      expect(id).to.exist
      expect(id).to.match(/^f-\d+$/)
    })

    it('sets image style.filter to url(#id) matching the filter id', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite></test-svg-icon-lite>`,
      )
      const filter = el.shadowRoot.querySelector('filter')
      const image = el.shadowRoot.querySelector('image')
      const id = filter.getAttribute('id')
      // Browser normalizes url(#id) to url("#id") with quotes
      expect(image.style.filter).to.include(id)
    })

    it('updates image xlink:href when src property changes', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite></test-svg-icon-lite>`,
      )
      el.src = '/icons/home.svg'
      await settle(el)
      const image = el.shadowRoot.querySelector('image')
      expect(image.getAttribute('xlink:href')).to.equal('/icons/home.svg')
    })

    it('updates xlink:href when src changes via icon property', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite></test-svg-icon-lite>`,
      )
      el.icon = 'icons:home'
      await settle(el)
      await settle(el)
      const image = el.shadowRoot.querySelector('image')
      expect(image.getAttribute('xlink:href')).to.equal('/icons/home.svg')
    })

    it('passes a11y audit in SVG mode', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite title="svg-icon"></test-svg-icon-lite>`,
      )
      await expect(el).shadowDom.to.be.accessible()
    })
  })

  describe('polyfill render path (useSafariPolyfill true)', () => {
    it('renders the polyfill div', async () => {
      const el = await fixture(
        html`<test-polyfill-icon-lite></test-polyfill-icon-lite>`,
      )
      expect(el.shadowRoot.querySelector('#svg-polyfill')).to.exist
    })

    it('does not render an svg element', async () => {
      const el = await fixture(
        html`<test-polyfill-icon-lite></test-polyfill-icon-lite>`,
      )
      expect(el.shadowRoot.querySelector('svg')).to.be.null
    })

    it('sets mask style from safariMask when src is set', async () => {
      const el = await fixture(
        html`<test-polyfill-icon-lite></test-polyfill-icon-lite>`,
      )
      el.src = '/icons/home.svg'
      await settle(el)
      const div = el.shadowRoot.querySelector('#svg-polyfill')
      // Browser normalizes url() values with quotes and reorders shorthand
      expect(div.style.webkitMask).to.include('/icons/home.svg')
    })

    it('passes a11y audit in polyfill mode', async () => {
      const el = await fixture(
        html`<test-polyfill-icon-lite title="poly"></test-polyfill-icon-lite>`,
      )
      await expect(el).shadowDom.to.be.accessible()
    })
  })

  describe('setSrcByIcon', () => {
    it('sets src from icon lookup and returns the path', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite></test-svg-icon-lite>`,
      )
      el.icon = 'icons:home'
      const result = el.setSrcByIcon(el)
      expect(result).to.equal('/icons/home.svg')
      expect(el.src).to.equal('/icons/home.svg')
    })

    it('returns null for unknown icon', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite></test-svg-icon-lite>`,
      )
      el.icon = 'unknown:foo'
      const result = el.setSrcByIcon(el)
      expect(result).to.be.null
      expect(el.src).to.be.null
    })

    it('uses string iconset path construction', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite></test-svg-icon-lite>`,
      )
      el.icon = 'custom:thing'
      const result = el.setSrcByIcon(el)
      expect(result).to.equal('/base/path/thing.svg')
    })

    it('pushes element to needsHydrated when icon not found', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite></test-svg-icon-lite>`,
      )
      el.icon = 'unknown:foo'
      const before = SimpleIconsetStore.needsHydrated.length
      el.setSrcByIcon(el)
      expect(SimpleIconsetStore.needsHydrated.length).to.be.greaterThan(before)
    })
  })

  describe('updated lifecycle - icon property', () => {
    it('defers src lookup when icon is set to a valid name', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite></test-svg-icon-lite>`,
      )
      el.icon = 'icons:home'
      await settle(el)
      await settle(el)
      expect(el.src).to.equal('/icons/home.svg')
    })

    it('sets src to null when icon is cleared', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite icon="icons:home"></test-svg-icon-lite>`,
      )
      await settle(el)
      await settle(el)
      expect(el.src).to.equal('/icons/home.svg')
      el.icon = ''
      await settle(el)
      await settle(el)
      expect(el.src).to.be.null
    })

    it('sets src to null when icon is set to null', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite icon="icons:home"></test-svg-icon-lite>`,
      )
      await settle(el)
      await settle(el)
      el.icon = null
      await settle(el)
      await settle(el)
      expect(el.src).to.be.null
    })

    it('defers src lookup for string iconset icons', async () => {
      const el = await fixture(
        html`<test-svg-icon-lite></test-svg-icon-lite>`,
      )
      el.icon = 'custom:thing'
      await settle(el)
      await settle(el)
      expect(el.src).to.equal('/base/path/thing.svg')
    })
  })

  describe('updated lifecycle - src property in polyfill mode', () => {
    it('does not set xlink:href in polyfill mode (no image element)', async () => {
      const el = await fixture(
        html`<test-polyfill-icon-lite></test-polyfill-icon-lite>`,
      )
      el.src = '/icons/home.svg'
      await settle(el)
      // No image element exists in polyfill mode; nothing to check
      // except that no error is thrown
      expect(el.shadowRoot.querySelector('image')).to.be.null
    })
  })

  describe('SimpleIconBehaviors mixin composition', () => {
    it('can be applied to a LitElement subclass', () => {
      class Mixed extends SimpleIconBehaviors(LitElement) {
        static get tag() {
          return 'test-mixed-icon'
        }
      }
      customElements.define(Mixed.tag, Mixed)
      const el = new Mixed()
      expect(el).to.be.instanceof(LitElement)
      expect(el.noColorize).to.be.false
    })

    it('preserves super.properties in the mixin chain', () => {
      class WithBase extends LitElement {
        static get properties() {
          return { baseProp: { type: String } }
        }
      }
      class Mixed extends SimpleIconBehaviors(WithBase) {
        static get tag() {
          return 'test-mixed-with-base'
        }
      }
      customElements.define(Mixed.tag, Mixed)
      expect(Mixed.properties).to.have.property('baseProp')
      expect(Mixed.properties).to.have.property('icon')
    })
  })
})
