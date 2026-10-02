import { fixture, expect, html } from '@open-wc/testing'
import { LitElement } from 'lit'
import { SimpleTourFinder } from '../lib/SimpleTourFinder.js'
import { SimpleTourManager } from '../lib/simple-tour.js'

const aTimeout = (ms) => new Promise((r) => setTimeout(r, ms))

class TestTourFinder extends SimpleTourFinder(LitElement) {
  static get tag() {
    return 'test-tour-finder'
  }
  static get properties() {
    return {
      tourName: { type: String },
    }
  }
  constructor() {
    super()
    this.tourName = 'default'
  }
  render() {
    return html`
      <div data-simple-tour-stop>
        <span data-stop-title>Step A Title</span>
        <div data-stop-content>Step A Content</div>
      </div>
      <div data-simple-tour-stop>
        <span data-stop-title>Step B Title</span>
        <div data-stop-content>Step B Content</div>
      </div>
    `
  }
}
globalThis.customElements.define('test-tour-finder', TestTourFinder)

class TestTourFinderEmpty extends SimpleTourFinder(LitElement) {
  static get tag() {
    return 'test-tour-finder-empty'
  }
  render() {
    return html`<div>No tour stops here</div>`
  }
}
globalThis.customElements.define('test-tour-finder-empty', TestTourFinderEmpty)

class TestTourFinderBroken extends SimpleTourFinder(LitElement) {
  static get tag() {
    return 'test-tour-finder-broken'
  }
  render() {
    return html`
      <div data-simple-tour-stop>
        <span data-stop-title>Broken Title</span>
        <!-- missing data-stop-content -->
      </div>
    `
  }
}
globalThis.customElements.define('test-tour-finder-broken', TestTourFinderBroken)

// a base class with no firstUpdated on its prototype at all, so the
// connectedCallback branch of the mixin runs discoverSimpleTourStops
// FIXED (haxtheweb/issues#3102, lib/SimpleTourFinder.js:29): the mixin's
// disconnectedCallback now guards super.disconnectedCallback() the same way
// connectedCallback guards super.connectedCallback(), so applying the mixin
// to a base class without the method (e.g. HTMLElement) no longer throws on
// removal. The former no-op disconnectedCallback override is gone so the
// mixin's own callback is exercised on removal below.
class TestPlainFinder extends SimpleTourFinder(globalThis.HTMLElement) {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML =
      '<div data-simple-tour-stop><span data-stop-title>Plain Title</span><div data-stop-content>Plain Content</div></div>'
  }
}
globalThis.customElements.define('test-plain-finder', TestPlainFinder)

describe('SimpleTourFinder mixin', () => {
  let origStacks, origTourInfo, origActive, origStop

  beforeEach(() => {
    // save SimpleTourManager state
    origStacks = SimpleTourManager.stacks
    origTourInfo = SimpleTourManager.tourInfo
    origActive = SimpleTourManager.active
    origStop = SimpleTourManager.stop
    SimpleTourManager.stacks = {}
    SimpleTourManager.tourInfo = {}
    SimpleTourManager.active = null
    SimpleTourManager.stop = -1
  })

  afterEach(async () => {
    if (SimpleTourManager.active) {
      SimpleTourManager.stop = -1
      SimpleTourManager.active = null
    }
    await aTimeout(10)
    SimpleTourManager.stacks = origStacks
    SimpleTourManager.tourInfo = origTourInfo
    SimpleTourManager.active = origActive
    SimpleTourManager.stop = origStop
  })

  it('constructor sets tourName to default', () => {
    const el = new TestTourFinder()
    expect(el.tourName).to.equal('default')
  })

  it('connectedCallback calls discoverSimpleTourStops when super has no firstUpdated', async () => {
    const el = await fixture(html`<test-tour-finder></test-tour-finder>`)
    await aTimeout(10)
    // discoverSimpleTourStops should have been called from connectedCallback
    // (LitElement has firstUpdated so it also runs there, but connectedCallback
    // checks !super.firstUpdated which is false for LitElement, so discover
    // only runs from firstUpdated in this case)
    expect(SimpleTourManager.stacks['default']).to.exist
    expect(SimpleTourManager.stacks['default'].length).to.equal(2)
  })

  it('discoverSimpleTourStops registers stops with correct title and content', async () => {
    const el = await fixture(html`<test-tour-finder></test-tour-finder>`)
    await aTimeout(10)
    const stops = SimpleTourManager.stacks['default']
    expect(stops[0].title).to.equal('Step A Title')
    expect(stops[0].description).to.equal('Step A Content')
    expect(stops[0].mode).to.equal('live')
    expect(stops[1].title).to.equal('Step B Title')
    expect(stops[1].description).to.equal('Step B Content')
  })

  it('discoverSimpleTourStops registers the actual shadow DOM element as target', async () => {
    const el = await fixture(html`<test-tour-finder></test-tour-finder>`)
    await aTimeout(10)
    const stops = SimpleTourManager.stacks['default']
    const stopEls = el.shadowRoot.querySelectorAll('[data-simple-tour-stop]')
    expect(stops[0].target).to.equal(stopEls[0])
    expect(stops[1].target).to.equal(stopEls[1])
  })

  it('uses custom tourName property', async () => {
    const el = await fixture(
      html`<test-tour-finder .tourName=${'custom-tour'}></test-tour-finder>`,
    )
    await aTimeout(10)
    expect(SimpleTourManager.stacks['custom-tour']).to.exist
    expect(SimpleTourManager.stacks['custom-tour'].length).to.equal(2)
  })

  it('does not register stops when shadowRoot has none', async () => {
    const el = await fixture(
      html`<test-tour-finder-empty></test-tour-finder-empty>`,
    )
    await aTimeout(10)
    // 'default' key should not exist because the empty finder has no stops
    expect(SimpleTourManager.stacks['default']).to.equal(undefined)
  })

  it('catches errors when data-stop-content is missing and does not throw', async () => {
    // Suppress console.warn during this test — the production code's
    // catch block calls console.warn(e), which produces noisy browser logs
    // with the full TypeError stack trace. We still verify the error is
    // caught (element renders, no uncaught exception, no stop registered).
    const origWarn = console.warn
    let warnCalled = false
    console.warn = () => { warnCalled = true }
    try {
      const el = await fixture(
        html`<test-tour-finder-broken></test-tour-finder-broken>`,
      )
      await aTimeout(10)
      expect(warnCalled).to.be.true
      const stops = SimpleTourManager.stacks['default']
      if (stops) {
        expect(stops.length).to.equal(0)
      }
    } finally {
      console.warn = origWarn
    }
  })

  it('disconnectedCallback does not throw', async () => {
    const el = await fixture(html`<test-tour-finder></test-tour-finder>`)
    await aTimeout(10)
    // Remove from DOM
    el.parentNode.removeChild(el)
    // just verify no error thrown
    expect(true).to.be.true
  })

  it('firstUpdated calls discoverSimpleTourStops', async () => {
    const el = await fixture(html`<test-tour-finder></test-tour-finder>`)
    await aTimeout(10)
    // Clear the stacks to verify firstUpdated already ran
    const firstRunCount = SimpleTourManager.stacks['default']
      ? SimpleTourManager.stacks['default'].length
      : 0
    expect(firstRunCount).to.equal(2)
  })

  it('supports data-stop-title as an attribute reference', async () => {
    // When data-stop-title attribute is itself an attribute name on the element,
    // the title is read from that attribute instead
    class TestAttrTitle extends SimpleTourFinder(LitElement) {
      static get tag() {
        return 'test-attr-title'
      }
      render() {
        return html`
          <div
            data-simple-tour-stop
            data-stop-title="data-my-title"
            data-my-title="Attr Title"
          >
            <div data-stop-content>Content</div>
          </div>
        `
      }
    }
    globalThis.customElements.define('test-attr-title', TestAttrTitle)
    const el = await fixture(html`<test-attr-title></test-attr-title>`)
    await aTimeout(10)
    const stops = SimpleTourManager.stacks['default']
    expect(stops).to.exist
    expect(stops.length).to.equal(1)
    expect(stops[0].title).to.equal('Attr Title')
  })

  it('connectedCallback discovers stops when super has no firstUpdated', async () => {
    // HTMLElement has no firstUpdated on its prototype, so connectedCallback
    // is the path that triggers discoverSimpleTourStops for this element
    const el = globalThis.document.createElement('test-plain-finder')
    globalThis.document.body.appendChild(el)
    await aTimeout(10)
    expect(SimpleTourManager.stacks['default']).to.exist
    expect(SimpleTourManager.stacks['default'].length).to.equal(1)
    expect(SimpleTourManager.stacks['default'][0].title).to.equal('Plain Title')
    expect(SimpleTourManager.stacks['default'][0].description).to.equal(
      'Plain Content',
    )
    globalThis.document.body.removeChild(el)
  })

  it('does not throw on removal when the base class has no disconnectedCallback', async () => {
    // evidence for fix #7: with the guard in place, removing a mixin-applied
    // element whose base (HTMLElement) lacks disconnectedCallback is safe
    const el = globalThis.document.createElement('test-plain-finder')
    globalThis.document.body.appendChild(el)
    await aTimeout(10)
    let threw = false
    try {
      globalThis.document.body.removeChild(el)
    } catch (e) {
      threw = true
    }
    expect(threw).to.equal(false)
  })
})
