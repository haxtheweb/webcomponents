import { fixture, expect, html, aTimeout } from '@open-wc/testing'

import '../image-inspector.js'

const SRC =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

describe('image-inspector test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(
      html`<image-inspector
        src="https://placekitten.com/400/200"
      ></image-inspector>`,
    )
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })
})

describe('image-inspector defaults', () => {
  it('constructor sets default state', async () => {
    const el = await fixture(html`<image-inspector></image-inspector>`)
    expect(el.noLeft).to.equal(false)
    expect(el.degrees).to.equal(0)
    expect(el.src).to.equal('')
    expect(el.hoverClass).to.equal(undefined)
  })

  it('has the conventional tag name', () => {
    const el = globalThis.document.createElement('image-inspector')
    expect(el.constructor.tag).to.equal('image-inspector')
  })

  it('maps the no-left and hover-class attributes', async () => {
    const el = await fixture(
      html`<image-inspector no-left hover-class="custom-hover"></image-inspector>`,
    )
    expect(el.noLeft).to.equal(true)
    expect(el.hoverClass).to.equal('custom-hover')
  })
})

describe('image-inspector rendering', () => {
  it('renders the toolbar with labeled controls around the viewer', async () => {
    const el = await fixture(
      html`<image-inspector src="${SRC}"></image-inspector>`,
    )
    const buttons = el.shadowRoot.querySelectorAll('simple-icon-button-lite')
    expect(buttons.length).to.equal(5)
    expect(buttons[0].getAttribute('label')).to.equal('Zoom in')
    expect(buttons[0].getAttribute('icon')).to.equal('zoom-in')
    expect(buttons[1].getAttribute('label')).to.equal('Zoom out')
    expect(buttons[2].getAttribute('label')).to.equal('Rotate right')
    expect(buttons[3].getAttribute('label')).to.equal('Mirror image')
    expect(buttons[4].getAttribute('label')).to.equal('Open in new window')
    // the open-in-new-window control is wrapped by a link to the source
    const link = el.shadowRoot.querySelector('a')
    expect(link.getAttribute('href')).to.equal(SRC)
    expect(link.getAttribute('target')).to.equal('_blank')
    expect(link.getAttribute('rel')).to.equal('noopener noreferrer')
    // the link keeps its natural focusability so keyboard users reach it
    expect(link.hasAttribute('tabindex')).to.equal(false)
    // toolbar and content slots exist
    expect(el.shadowRoot.querySelector('slot[name="toolbar"]')).to.exist
    expect(el.shadowRoot.querySelector('slot')).to.exist
  })

  it('renders the zoomable viewer with the source', async () => {
    const el = await fixture(
      html`<image-inspector src="${SRC}"></image-inspector>`,
    )
    const viewer = el.shadowRoot.querySelector('#img')
    expect(viewer).to.exist
    expect(viewer.tagName.toLowerCase()).to.equal('img-pan-zoom')
    expect(viewer.src).to.equal(SRC)
    // firstUpdated caches the viewer for the control methods
    expect(el.__img).to.equal(viewer)
  })

  it('projects slotted toolbar content', async () => {
    const el = await fixture(
      html`<image-inspector src="${SRC}">
        <span slot="toolbar">extra</span>
      </image-inspector>`,
    )
    await el.updateComplete
    const slot = el.shadowRoot.querySelector('slot[name="toolbar"]')
    const assigned = slot.assignedNodes({ flatten: true })
    expect(assigned.length).to.be.greaterThan(0)
    expect(assigned[0].textContent).to.equal('extra')
  })
})

describe('image-inspector controls', () => {
  let el
  beforeEach(async () => {
    el = await fixture(
      html`<image-inspector src="${SRC}"></image-inspector>`,
    )
    await el.updateComplete
  })

  it('rotates right in 90 degree steps and reflects the degrees attribute', async () => {
    el.rotateRight()
    expect(el.degrees).to.equal(90)
    expect(el.__img.style.transform).to.equal('rotate(90deg)')
    expect(el.__img.classList.contains('top-rotated')).to.equal(true)
    // reflection happens on the update cycle
    await el.updateComplete
    expect(el.getAttribute('degrees')).to.equal('90')
    el.rotateRight()
    expect(el.degrees).to.equal(180)
    expect(el.__img.style.transform).to.equal('rotate(180deg)')
    expect(el.__img.classList.contains('top-rotated')).to.equal(false)
    await el.updateComplete
    expect(el.getAttribute('degrees')).to.equal('180')
  })

  it('toggles the mirror transform back and forth', () => {
    // the first click mirrors immediately instead of being a visual no-op
    el.mirrorImage()
    expect(el.__img.style.transform).to.equal('scaleX(-1)')
    el.mirrorImage()
    expect(el.__img.style.transform).to.equal('scaleX(1)')
    el.mirrorImage()
    expect(el.__img.style.transform).to.equal('scaleX(-1)')
  })

  it('delegates zoom in and out to the viewer through the buttons', () => {
    const calls = { zoomIn: 0, zoomOut: 0 }
    el.__img = {
      zoomIn: () => {
        calls.zoomIn++
      },
      zoomOut: () => {
        calls.zoomOut++
      },
    }
    const buttons = el.shadowRoot.querySelectorAll('simple-icon-button-lite')
    buttons[0].click()
    expect(calls.zoomIn).to.equal(1)
    buttons[1].click()
    expect(calls.zoomOut).to.equal(1)
    // methods can also be invoked directly
    el.zoomIn()
    el.zoomOut()
    expect(calls.zoomIn).to.equal(2)
    expect(calls.zoomOut).to.equal(2)
  })

  it('rotates and mirrors via the toolbar buttons', async () => {
    const buttons = el.shadowRoot.querySelectorAll('simple-icon-button-lite')
    buttons[2].click()
    expect(el.degrees).to.equal(90)
    expect(el.__img.style.transform).to.equal('rotate(90deg)')
    expect(el.__img.classList.contains('top-rotated')).to.equal(true)
    buttons[3].click()
    expect(el.__img.style.transform).to.equal('scaleX(-1)')
    await el.updateComplete
    expect(el.getAttribute('degrees')).to.equal('90')
  })
})
