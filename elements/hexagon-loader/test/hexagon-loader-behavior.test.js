import { fixture, expect, html, elementUpdated } from '@open-wc/testing'
import { Hexagon } from '../lib/hex-a-gon.js'
import '../hexagon-loader.js'

describe('hex-a-gon', () => {
  afterEach(() => {
    if ('ShadyCSS' in globalThis) {
      delete globalThis.ShadyCSS
    }
  })
  it('registers as a custom element', async () => {
    const el = await fixture(html`<hex-a-gon></hex-a-gon>`)
    expect(el.tagName).to.equal('HEX-A-GON')
    expect(el.shadowRoot.querySelector('div')).to.exist
    expect(el.tag).to.equal('hex-a-gon')
    expect(el.constructor.tag).to.equal('hex-a-gon')
  })
  it('supports delayed render via constructor flag', () => {
    const el = new Hexagon(true)
    expect(el.shadowRoot.querySelectorAll('*').length).to.equal(0)
    el.render()
    expect(el.shadowRoot.querySelector('div')).to.exist
    expect(el._queue.length).to.equal(0)
  })
  it('copies attributes onto shadow recipients', async () => {
    const el = await fixture(html`<hex-a-gon></hex-a-gon>`)
    el.setAttribute('color', 'red')
    el._copyAttribute('color', 'div')
    expect(el.shadowRoot.querySelector('div').getAttribute('color')).to.equal('red')
    el.removeAttribute('color')
    el._copyAttribute('color', 'div')
    expect(el.shadowRoot.querySelector('div').hasAttribute('color')).to.be.false
  })
  it('queues actions and processes them on reconnect', async () => {
    const el = await fixture(html`<hex-a-gon></hex-a-gon>`)
    el._queueAction({ type: 'setProperty', data: { name: 'customProp', value: 'hello' } })
    el._queueAction({ type: 'setProperty', data: { name: 'otherProp', value: 'world' } })
    expect(el._queue.length).to.equal(2)
    el.remove()
    document.body.appendChild(el)
    expect(el.customProp).to.equal('hello')
    expect(el._queue.length).to.equal(0)
  })
  it('calls ShadyCSS hooks when present', async () => {
    let styleElementCalls = 0
    let prepareTemplateCalls = 0
    globalThis.ShadyCSS = {
      styleElement: () => {
        styleElementCalls++
      },
      prepareTemplate: () => {
        prepareTemplateCalls++
      },
    }
    const el = await fixture(html`<hex-a-gon></hex-a-gon>`)
    expect(styleElementCalls).to.be.greaterThan(0)
    el.render()
    expect(prepareTemplateCalls).to.be.greaterThan(0)
    expect(el.shadowRoot.querySelector('div')).to.exist
  })
})

describe('hexagon-loader behavior', () => {
  afterEach(() => {
    if ('ShadyCSS' in globalThis) {
      delete globalThis.ShadyCSS
    }
  })
  it('defaults to 37 items', async () => {
    const el = await fixture(html`<hexagon-loader></hexagon-loader>`)
    expect(el.itemCount).to.equal(37)
    expect(el.items.length).to.equal(37)
    expect(el.shadowRoot.querySelectorAll('hex-a-gon').length).to.equal(37)
  })
  it('reflects loading, size, and color attributes', async () => {
    const el = await fixture(html`<hexagon-loader></hexagon-loader>`)
    el.loading = true
    el.size = 'large'
    el.color = 'green'
    await elementUpdated(el)
    expect(el.hasAttribute('loading')).to.be.true
    expect(el.getAttribute('size')).to.equal('large')
    expect(el.getAttribute('color')).to.equal('green')
  })
  it('builds items in willUpdate without a redundant second update cycle', async () => {
    // FIXED (haxtheweb/issues#3102 #55): items were built inside updated(),
    // which scheduled one extra update cycle per itemCount change (including
    // first render). Now built in willUpdate (place-holder.js precedent), so
    // a single cycle renders the new hexagons.
    const el = await fixture(html`<hexagon-loader item-count="3"></hexagon-loader>`)
    let renderCount = 0
    const originalRender = el.render
    el.render = function () {
      renderCount += 1
      return originalRender.call(this)
    }
    el.itemCount = 5
    await el.updateComplete
    await el.updateComplete
    expect(renderCount).to.equal(1)
    expect(el.items.length).to.equal(5)
    expect(el.shadowRoot.querySelectorAll('hex-a-gon').length).to.equal(5)
  })
  it('exposes role=status and aria-busy on the host for assistive technology', async () => {
    // a11y follow-up (haxtheweb/issues#3102): the decorative loader had no
    // aria-busy/role=status on the host
    const el = await fixture(html`<hexagon-loader loading></hexagon-loader>`)
    expect(el.getAttribute('role')).to.equal('status')
    expect(el.getAttribute('aria-busy')).to.equal('true')
    el.loading = false
    await elementUpdated(el)
    expect(el.getAttribute('aria-busy')).to.equal('false')
  })
  it('rebuilds items and sets loader height when item-count changes', async () => {
    const el = await fixture(html`<hexagon-loader item-count="3"></hexagon-loader>`)
    expect(el.itemCount).to.equal(3)
    expect(el.items.length).to.equal(3)
    expect(el.shadowRoot.querySelectorAll('hex-a-gon').length).to.equal(3)
    const height37 = el.style.getPropertyValue('--hexagon-loader-height')
    expect(height37).to.not.equal('')
    el.itemCount = 1
    await elementUpdated(el)
    expect(el.items.length).to.equal(1)
    expect(el.getAttribute('item-count')).to.equal('1')
    expect(el.shadowRoot.querySelectorAll('hex-a-gon').length).to.equal(1)
  })
  it('applies color via ShadyCSS when available', async () => {
    let subtreeStyles = []
    globalThis.ShadyCSS = {
      styleSubtree: (element, style) => {
        subtreeStyles.push(style)
      },
      prepareTemplate: () => {},
      styleElement: () => {},
    }
    const el = await fixture(html`<hexagon-loader color="orange"></hexagon-loader>`)
    await elementUpdated(el)
    expect(subtreeStyles.length).to.be.greaterThan(0)
    expect(subtreeStyles[0]['--hexagon-color']).to.equal('orange')
  })
  it('meets a11y standards while loading', async () => {
    const el = await fixture(
      html`<hexagon-loader loading size="small" item-count="7"></hexagon-loader>`,
    )
    await expect(el).to.be.accessible()
  })
})
