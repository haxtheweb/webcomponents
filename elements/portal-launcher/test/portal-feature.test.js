import { fixture, expect, html } from '@open-wc/testing'
import '../portal-launcher.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

describe('portal-launcher portal feature detection', () => {
  // Chromium does not ship the WICG Portals API so HTMLPortalElement is
  // absent in the test browser; the click handler must degrade to plain
  // link navigation (no preventDefault, no <portal> element created)
  it('degrades to normal navigation when HTMLPortalElement is unsupported', async () => {
    const prevented = []
    const stopped = []
    const el = await fixture(html`
      <portal-launcher>
        <a href="https://example.com/page">Test Link</a>
      </portal-launcher>
    `)
    const link = el.querySelector('a')
    const event = {
      target: link,
      composed: false,
      preventDefault: () => prevented.push('default'),
      stopPropagation: () => stopped.push('propagation'),
      stopImmediatePropagation: () => stopped.push('immediate'),
    }
    el.click(event)
    expect(prevented.length).to.equal(0)
    expect(stopped.length).to.equal(0)
    expect(globalThis.document.querySelector('portal')).to.equal(null)
    expect(globalThis.document.body.querySelector('style')).to.equal(null)
  })

  it('applies the portal enhance path when HTMLPortalElement exists', async () => {
    const hadPortal = 'HTMLPortalElement' in globalThis
    const savedPortal = globalThis.HTMLPortalElement
    const originalCreate = globalThis.document.createElement.bind(
      globalThis.document,
    )
    const created = []
    const fakePortals = []
    const fakeStyle = originalCreate('style')
    // stub the Portals API so the progressive enhancement branch runs
    globalThis.HTMLPortalElement = class FakeHTMLPortalElement {}
    globalThis.document.createElement = (tag, opts) => {
      created.push(tag)
      if (tag === 'style') {
        return fakeStyle
      }
      if (tag === 'portal') {
        const portal = originalCreate('div')
        portal.src = ''
        portal.classList.add('portal-transition')
        portal.activate = () => {
          portal.activated = true
        }
        fakePortals.push(portal)
        return portal
      }
      return originalCreate(tag, opts)
    }
    const el = await fixture(html`
      <portal-launcher>
        <a href="https://example.com/portal-target">Portal Link</a>
      </portal-launcher>
    `)
    const prevented = []
    const stopped = []
    const event = {
      target: el.querySelector('a'),
      composed: false,
      preventDefault: () => prevented.push('default'),
      stopPropagation: () => stopped.push('propagation'),
      stopImmediatePropagation: () => stopped.push('immediate'),
    }
    el.click(event)
    expect(prevented.length).to.equal(1)
    expect(stopped.length).to.equal(2)
    expect(fakeStyle.innerHTML.includes('portal {')).to.equal(true)
    expect(fakeStyle.innerHTML.includes('prefers-reduced-motion')).to.equal(
      true,
    )
    expect(fakePortals.length).to.equal(1)
    expect(fakePortals[0].getAttribute('class')).to.equal('portal-transition')
    expect(fakePortals[0].src).to.equal('https://example.com/portal-target')
    // transitionend on the bottom property activates the portal;
    // propertyName must be set on the event object itself because the
    // Event constructor does not accept arbitrary init properties
    const transitionEnd = (name) => {
      const evt = new Event('transitionend')
      evt.propertyName = name
      fakePortals[0].dispatchEvent(evt)
    }
    transitionEnd('bottom')
    expect(fakePortals[0].activated).to.equal(true)
    // transitionend for other properties does not activate it
    transitionEnd('opacity')
    expect(fakePortals[0].activated).to.equal(true)
    // staged classes get added on the reveal timers
    await wait(320)
    expect(fakePortals[0].className.includes('fade-in')).to.equal(true)
    await wait(320)
    expect(fakePortals[0].className.includes('portal-reveal')).to.equal(true)
    expect(created.includes('style')).to.equal(true)
    expect(created.includes('portal')).to.equal(true)
    // restore the stubbed environment; delete the property when it was
    // originally absent so 'HTMLPortalElement' in globalThis stays false
    globalThis.document.createElement = originalCreate
    if (hadPortal) {
      globalThis.HTMLPortalElement = savedPortal
    } else {
      delete globalThis.HTMLPortalElement
    }
    fakePortals.forEach((p) => p.remove())
  })

  it('portal branch requires an href on the resolved target', async () => {
    // target is not an anchor and no anchor is in the path: no portal work
    const hadPortal = 'HTMLPortalElement' in globalThis
    const savedPortal = globalThis.HTMLPortalElement
    globalThis.HTMLPortalElement = class FakeHTMLPortalElement {}
    const el = await fixture(html`<portal-launcher></portal-launcher>`)
    const prevented = []
    const event = {
      target: { tagName: 'SPAN', getAttribute: () => null },
      composed: true,
      composedPath: () => [{ tagName: 'SPAN', getAttribute: () => null }],
      preventDefault: () => prevented.push('default'),
      stopPropagation: () => {},
      stopImmediatePropagation: () => {},
    }
    el.click(event)
    expect(prevented.length).to.equal(0)
    if (hadPortal) {
      globalThis.HTMLPortalElement = savedPortal
    } else {
      delete globalThis.HTMLPortalElement
    }
  })

  it('binds links added in the constructor click path', async () => {
    // the constructor binds every slotted link; hash hrefs keep the real
    // click() calls on-page so no external navigation attempt is made
    const el = await fixture(html`
      <portal-launcher>
        <a href="#one">One</a>
        <div><a href="#two">Two</a></div>
      </portal-launcher>
    `)
    for (const link of el.querySelectorAll('a')) {
      link.click()
    }
    expect(el.querySelectorAll('a').length).to.equal(2)
  })

  it('click handler resolves an anchor ancestor from a composed path', async () => {
    const el = await fixture(html`
      <portal-launcher>
        <a href="https://example.com/ancestor">
          <span>inner text</span>
        </a>
      </portal-launcher>
    `)
    const anchor = el.querySelector('a')
    const span = anchor.querySelector('span')
    const prevented = []
    const event = {
      target: span,
      composed: true,
      composedPath: () => [span, anchor, el],
      preventDefault: () => prevented.push('default'),
      stopPropagation: () => {},
      stopImmediatePropagation: () => {},
    }
    el.click(event)
    // no HTMLPortalElement in the test browser so navigation is untouched
    expect(prevented.length).to.equal(0)
  })

  it('normalizeEventPath prefers composedPath then path then originalTarget then target', () => {
    const el = document.createElement('portal-launcher')
    expect(
      el.normalizeEventPath({
        composed: true,
        composedPath: () => ['a', 'b'],
      }),
    ).to.deep.equal(['a', 'b'])
    expect(el.normalizeEventPath({ path: ['p'] })).to.deep.equal(['p'])
    expect(el.normalizeEventPath({ originalTarget: 'o' })).to.deep.equal(['o'])
    expect(el.normalizeEventPath({ target: 't' })).to.deep.equal(['t'])
  })

  it('supports constructor delayRender argument without shadow DOM', async () => {
    const el = await fixture(
      html`<portal-launcher title="delayed"></portal-launcher>`,
    )
    expect(el.tag).to.equal('portal-launcher')
    expect(el.shadowRoot).to.equal(null)
  })
})
