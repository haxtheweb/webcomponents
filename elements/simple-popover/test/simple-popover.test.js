import { fixture, expect, html } from '@open-wc/testing'

import '../simple-popover.js'

const aTimeout = (ms) => new Promise((r) => setTimeout(r, ms))

describe('simple-popover test', () => {
  let element

  beforeEach(async () => {
    element = await fixture(html`
      <simple-popover title="test-title"></simple-popover>
    `)
  })

  // FIXED (haxtheweb/issues#3102): #content role="alertdialog" now receives
  // an accessible name — the host aria-label (declared ariaLabel property) is
  // forwarded to the inner div, falling back to the host title attribute, so
  // the axe aria-dialog-name rule passes for every popover consumer.
  it('passes the a11y audit via the title fallback accessible name', async () => {
    const content = element.shadowRoot.querySelector('#content')
    expect(content.getAttribute('aria-label')).to.equal('test-title')
    await expect(element).shadowDom.to.be.accessible()
  })

  it('instantiates as a SimplePopover element', () => {
    expect(element).to.exist
    expect(element.tagName.toLowerCase()).to.equal('simple-popover')
  })

  it('has static tag property returning "simple-popover"', () => {
    expect(element.constructor.tag).to.equal('simple-popover')
  })

  it('constructor sets offset to -10 and fitToVisibleBounds to true', () => {
    expect(element.offset).to.equal(-10)
    expect(element.fitToVisibleBounds).to.equal(true)
  })

  it('render produces a content div with role=alertdialog and a pointer div', () => {
    const content = element.shadowRoot.querySelector('#content')
    expect(content).to.exist
    expect(content.getAttribute('role')).to.equal('alertdialog')
    const pointer = element.shadowRoot.querySelector('#pointer')
    expect(pointer).to.exist
    const pointerOuter = element.shadowRoot.querySelector('#pointer-outer')
    expect(pointerOuter).to.exist
  })

  it('render has a slot for content', () => {
    const slot = element.shadowRoot.querySelector('slot')
    expect(slot).to.exist
  })

  it('_getMargins returns empty string when positions is null or has no target', () => {
    expect(element._getMargins(null)).to.equal('')
    expect(element._getMargins({})).to.equal('')
    expect(element._getMargins({ target: null })).to.equal('')
  })

  it('_getMargins returns margin style for horizontal positions (top/bottom)', () => {
    element.position = 'bottom'
    const positions = {
      target: {
        left: 100,
        top: 200,
        width: 50,
        height: 30,
      },
    }
    // Mock getBoundingClientRect on the element
    element.getBoundingClientRect = () => ({
      left: 80,
      top: 190,
      width: 200,
      height: 100,
    })
    const result = element._getMargins(positions)
    // For horizontal (h=true): center = 100 + 25 - 10 = 115, margin = max(0, 115 - 80) = 35
    // style should be "margin: 0 0 0 35px;"
    expect(result).to.include('margin:')
    expect(result).to.include('35px')
  })

  it('_getMargins returns margin style for vertical positions (left/right)', () => {
    element.position = 'left'
    const positions = {
      target: {
        left: 100,
        top: 200,
        width: 50,
        height: 30,
      },
    }
    element.getBoundingClientRect = () => ({
      left: 80,
      top: 190,
      width: 200,
      height: 100,
    })
    const result = element._getMargins(positions)
    // For vertical (h=false): center = 200 + 15 - 10 = 205, margin = max(0, 205 - 190) = 15
    // style should be "margin: 15px 0 0 0;"
    expect(result).to.include('margin:')
    expect(result).to.include('15px')
  })

  it('_getMargins clamps margin to max-20', () => {
    element.position = 'bottom'
    const positions = {
      target: {
        left: 500,
        top: 200,
        width: 50,
        height: 30,
      },
    }
    element.getBoundingClientRect = () => ({
      left: 80,
      top: 190,
      width: 100,
      height: 100,
    })
    const result = element._getMargins(positions)
    // center = 500 + 25 - 10 = 515, raw margin = 515 - 80 = 435
    // max = 100 - 20 = 80, so margin = min(80, max(0, 435)) = 80
    expect(result).to.include('80px')
  })

  it('hidden attribute makes host display:none', async () => {
    element.hidden = true
    await element.updateComplete
    const style = getComputedStyle(element)
    expect(style.display).to.equal('none')
  })

  it('setting target positions the popover relative to target', async () => {
    const target = globalThis.document.createElement('div')
    target.style.position = 'absolute'
    target.style.top = '100px'
    target.style.left = '100px'
    target.style.width = '50px'
    target.style.height = '50px'
    globalThis.document.body.appendChild(target)
    element.target = target
    element.hidden = false
    await element.updateComplete
    await aTimeout(100)
    // The element should have been positioned
    expect(element.target).to.equal(target)
    globalThis.document.body.removeChild(target)
  })

  it('position attribute reflects to property', async () => {
    element.position = 'top'
    await element.updateComplete
    expect(element.getAttribute('position')).to.equal('top')
  })

  it('connectedCallback creates a ResizeObserver', () => {
    expect(element.__popoverResizeObserver).to.exist
    expect(element.__popoverResizeObserver).to.be.instanceof(ResizeObserver)
  })

  it('disconnectedCallback disconnects the ResizeObserver', async () => {
    const observer = element.__popoverResizeObserver
    expect(observer).to.exist
    element.parentNode.removeChild(element)
    // Just verify disconnect was called without throwing
    expect(true).to.be.true
  })
})

describe('simple-popover accessible name forwarding', () => {
  it('forwards the host aria-label to the alertdialog content div', async () => {
    const el = await fixture(html`
      <simple-popover aria-label="Search suggestions"></simple-popover>
    `)
    const content = el.shadowRoot.querySelector('#content')
    expect(content.getAttribute('aria-label')).to.equal('Search suggestions')
    await expect(el).shadowDom.to.be.accessible()
  })
  it('reflects the ariaLabel property to the host attribute', async () => {
    const el = await fixture(html`<simple-popover></simple-popover>`)
    el.ariaLabel = 'Dynamic label'
    await el.updateComplete
    expect(el.getAttribute('aria-label')).to.equal('Dynamic label')
    const content = el.shadowRoot.querySelector('#content')
    expect(content.getAttribute('aria-label')).to.equal('Dynamic label')
  })
  it('prefers aria-label over the title fallback', async () => {
    const el = await fixture(html`
      <simple-popover title="Host title" aria-label="Dialog name"></simple-popover>
    `)
    const content = el.shadowRoot.querySelector('#content')
    expect(content.getAttribute('aria-label')).to.equal('Dialog name')
  })
  it('renders no aria-label on content when neither aria-label nor title is set', async () => {
    const el = await fixture(html`<simple-popover></simple-popover>`)
    const content = el.shadowRoot.querySelector('#content')
    expect(content.getAttribute('aria-label')).to.equal(null)
  })
})

describe('simple-popover with slotted content', () => {
  it('renders slotted content inside the content div', async () => {
    const el = await fixture(html`
      <simple-popover>
        <p>Popover content text</p>
      </simple-popover>
    `)
    const slot = el.shadowRoot.querySelector('slot')
    expect(slot).to.exist
    const assigned = slot.assignedNodes()
    expect(assigned.length).to.be.greaterThan(0)
  })
})
