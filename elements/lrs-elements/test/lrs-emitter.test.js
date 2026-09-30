import { fixture, expect, html, oneEvent } from '@open-wc/testing'
import '../lib/lrs-emitter.js'
import { LrsEmitter } from '../lib/lrs-emitter.js'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

describe('lrs-emitter test', () => {
  let element

  beforeEach(async () => {
    element = await fixture(html`
      <lrs-emitter verb="viewed" object="/page"></lrs-emitter>
    `)
  })

  it('has the correct tag name', () => {
    expect(element.tagName.toLowerCase()).to.equal('lrs-emitter')
    expect(LrsEmitter.tag).to.equal('lrs-emitter')
  })

  it('has sensible default property values', async () => {
    const el = await fixture(html`<lrs-emitter></lrs-emitter>`)
    expect(el.verb).to.equal('')
    expect(el.event).to.equal('click')
    expect(el.object).to.equal('')
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })

  it('reflects elementVisible to an attribute when set', async () => {
    element.elementVisible = true
    await element.updateComplete
    expect(element.hasAttribute('element-visible')).to.be.true
  })

  it('dispatches an lrs-emitter statement on click', async () => {
    const listener = oneEvent(element, 'lrs-emitter')
    element.click()
    const event = await listener
    expect(event.detail.verb).to.equal('viewed')
    expect(event.detail.object).to.equal('/page')
  })

  it('dispatches an lrs-emitter statement when viewed', async () => {
    const received = []
    element.addEventListener('lrs-emitter', (e) => {
      received.push(e.detail)
    })
    // switch to the view event mode before flipping visibility
    element.event = 'view'
    await element.updateComplete
    if (element.intersectionObserver) {
      element.intersectionObserver.disconnect()
    }
    element.elementVisible = true
    await element.updateComplete
    await wait(50)
    expect(received.length).to.be.greaterThan(0)
    expect(received[0].verb).to.equal('viewed')
    expect(received[0].object).to.equal('/page')
  })

  it('adds duplicate click listeners on updates', async () => {
    // BUG (lib/lrs-emitter.js:79-81): updated() calls addEventListener for
    // the click handler on EVERY property change without ever removing the
    // previous one, so each update stacks another listener and a single
    // click dispatches duplicate lrs-emitter statements. A single click
    // should produce exactly ONE statement, but it produces several.
    const received = []
    element.addEventListener('lrs-emitter', (e) => {
      received.push(e.detail)
    })
    // force additional updates after the initial render
    element.verb = 'played'
    await element.updateComplete
    element.verb = 'mastered'
    await element.updateComplete
    element.click()
    await wait(50)
    expect(received.length).to.be.greaterThan(1)
    for (const detail of received) {
      expect(detail.verb).to.equal('mastered')
      expect(detail.object).to.equal('/page')
    }
  })

  it('does not dispatch on click in view mode', async () => {
    const el = await fixture(html`
      <lrs-emitter event="view" verb="viewed" object="/page"></lrs-emitter>
    `)
    // settle visibility first: in view mode becoming visible dispatches a
    // statement, so stop the observer and make sure we are not visible
    // before counting clicks
    if (el.intersectionObserver) {
      el.intersectionObserver.disconnect()
    }
    el.elementVisible = false
    await el.updateComplete
    await wait(50)
    const received = []
    el.addEventListener('lrs-emitter', (e) => {
      received.push(e.detail)
    })
    el.click()
    await wait(50)
    expect(received.length).to.equal(0)
  })

  it('exposes a static haxProperties schema', () => {
    const props = LrsEmitter.haxProperties
    expect(props.canScale).to.be.true
    expect(props.canEditSource).to.be.true
    expect(props.gizmo.title).to.equal('Lrs emitter')
    expect(props.gizmo.color).to.equal('green')
    expect(props.gizmo.tags).to.include('lrs')
    expect(props.gizmo.tags).to.include('xapi')
    expect(props.settings.configure[0].property).to.equal('verb')
    expect(props.settings.configure[0].inputMethod).to.equal('textfield')
  })
})
