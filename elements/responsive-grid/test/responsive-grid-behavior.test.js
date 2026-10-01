import { fixture, expect, html, oneEvent, elementUpdated } from '@open-wc/testing'
import '../lib/responsive-grid-clear.js'
import '../lib/responsive-grid-col.js'
import '../lib/responsive-grid-row.js'

describe('responsive-grid-clear', () => {
  it('defaults all breakpoint flags to false', async () => {
    const el = await fixture(html`<responsive-grid-clear></responsive-grid-clear>`)
    expect(el.xl).to.be.false
    expect(el.lg).to.be.false
    expect(el.md).to.be.false
    expect(el.sm).to.be.false
    expect(el.xs).to.be.false
    expect(el.tagName).to.equal('RESPONSIVE-GRID-CLEAR')
  })
  it('renders an empty shadow root', async () => {
    const el = await fixture(html`<responsive-grid-clear xs></responsive-grid-clear>`)
    expect(el.shadowRoot).to.exist
    expect(el.shadowRoot.children.length).to.equal(0)
    expect(el.shadowRoot.querySelectorAll('*').length).to.equal(0)
    expect(el.hasAttribute('xs')).to.be.true
  })
  it('meets a11y standards', async () => {
    const el = await fixture(html`<responsive-grid-clear xs sm md lg xl></responsive-grid-clear>`)
    await expect(el).to.be.accessible()
  })
})

describe('responsive-grid-col', () => {
  it('defaults all breakpoint widths to 1', async () => {
    const el = await fixture(html`<responsive-grid-col></responsive-grid-col>`)
    expect(el.xl).to.equal(1)
    expect(el.lg).to.equal(1)
    expect(el.md).to.equal(1)
    expect(el.sm).to.equal(1)
    expect(el.xs).to.equal(1)
  })
  it('parses breakpoint attributes as numbers', async () => {
    const el = await fixture(
      html`<responsive-grid-col xs="1" md="2" lg="3" xl="4" sm="6"></responsive-grid-col>`,
    )
    expect(el.xs).to.equal(1)
    expect(el.sm).to.equal(6)
    expect(el.md).to.equal(2)
    expect(el.lg).to.equal(3)
    expect(el.xl).to.equal(4)
  })
  it('renders col-inner wrapper with a slot', async () => {
    const el = await fixture(
      html`<responsive-grid-col xs="12">col content</responsive-grid-col>`,
    )
    const inner = el.shadowRoot.querySelector('#col-inner')
    expect(inner).to.exist
    expect(inner.querySelector('slot')).to.exist
    expect(el.textContent).to.equal('col content')
  })
  it('supports print-only and screen-only modes without error', async () => {
    const el = await fixture(
      html`<responsive-grid-col print-only screen-only>content</responsive-grid-col>`,
    )
    await elementUpdated(el)
    expect(el.hasAttribute('print-only')).to.be.true
    expect(el.shadowRoot.querySelector('#col-inner')).to.exist
  })
  it('meets a11y standards', async () => {
    const el = await fixture(html`<responsive-grid-col>content</responsive-grid-col>`)
    await expect(el).to.be.accessible()
  })
})

describe('responsive-grid-row', () => {
  it('has sensible constructor defaults', async () => {
    const el = await fixture(html`<responsive-grid-row></responsive-grid-row>`)
    expect(el.xl).to.be.null
    expect(el.lg).to.be.null
    expect(el.md).to.be.null
    expect(el.sm).to.be.null
    expect(el.xs).to.be.null
    expect(el.gutter).to.equal(0)
    expect(el.responsiveToParent).to.be.false
    expect(el.screen).to.equal('xs')
  })
  it('renders a responsive-utility and row-inner container', async () => {
    const el = await fixture(html`<responsive-grid-row></responsive-grid-row>`)
    const utility = el.shadowRoot.querySelector('responsive-utility')
    const inner = el.shadowRoot.querySelector('#row-inner')
    expect(utility).to.exist
    expect(inner).to.exist
    expect(inner.querySelector('slot')).to.exist
    expect(inner.getAttribute('screen')).to.equal('xs')
    expect(inner.getAttribute('gutter')).to.equal('0')
  })
  it('passes custom breakpoints down to responsive-utility', async () => {
    const el = await fixture(
      html`<responsive-grid-row xs="100" sm="600" md="900" lg="1200" xl="1800"></responsive-grid-row>`,
    )
    const utility = el.shadowRoot.querySelector('responsive-utility')
    expect(utility.getAttribute('xs')).to.equal('100')
    expect(utility.getAttribute('sm')).to.equal('600')
    expect(utility.getAttribute('md')).to.equal('900')
    expect(utility.getAttribute('lg')).to.equal('1200')
    expect(utility.getAttribute('xl')).to.equal('1800')
  })
  it('reflects responsive-to-parent and screen attributes', async () => {
    const el = await fixture(html`<responsive-grid-row></responsive-grid-row>`)
    el.responsiveToParent = true
    el.screen = 'md'
    await elementUpdated(el)
    expect(el.hasAttribute('responsive-to-parent')).to.be.true
    expect(el.getAttribute('screen')).to.equal('md')
    const utility = el.shadowRoot.querySelector('responsive-utility')
    expect(utility.getAttribute('responsive-to-parent')).to.equal('true')
  })
  it('fires responsive-element on first update with screen detail', async () => {
    const fired = new Promise((resolve) =>
      document.addEventListener('responsive-element', resolve, { once: true }),
    )
    const el = await fixture(html`<responsive-grid-row></responsive-grid-row>`)
    const e = await fired
    expect(e.detail.attribute).to.equal('screen')
    expect(e.detail.relativeToParent).to.be.false
    expect(e.bubbles).to.be.true
    expect(e.composed).to.be.true
  })
  it('fires screen-changed when screen updates', async () => {
    const el = await fixture(html`<responsive-grid-row></responsive-grid-row>`)
    const listener = oneEvent(el, 'screen-changed')
    el.screen = 'lg'
    const e = await listener
    expect(e.detail.value).to.equal('lg')
    expect(el.getAttribute('screen')).to.equal('lg')
  })
  it('slotted cols and clears render inside the row', async () => {
    const el = await fixture(
      html`<responsive-grid-row gutter="2">
        <responsive-grid-col xs="12">one</responsive-grid-col>
        <responsive-grid-clear sm></responsive-grid-clear>
        <responsive-grid-col xs="6">two</responsive-grid-col>
      </responsive-grid-row>`,
    )
    await elementUpdated(el)
    const inner = el.shadowRoot.querySelector('#row-inner')
    expect(inner.getAttribute('gutter')).to.equal('2')
    expect(el.querySelectorAll('responsive-grid-col').length).to.equal(2)
    expect(el.querySelectorAll('responsive-grid-clear').length).to.equal(1)
  })
  it('meets a11y standards with content', async () => {
    const el = await fixture(
      html`<responsive-grid-row>
        <responsive-grid-col xs="6">left</responsive-grid-col>
        <responsive-grid-col xs="6">right</responsive-grid-col>
      </responsive-grid-row>`,
    )
    await expect(el).to.be.accessible()
  })
})
