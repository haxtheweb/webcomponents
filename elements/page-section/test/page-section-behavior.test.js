import { fixture, expect, html } from '@open-wc/testing'
import '../page-section.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

describe('page-section defaults and helpers', () => {
  it('seeds defaults', async () => {
    const el = await fixture(html`<page-section></page-section>`)
    expect(el.tagName).to.equal('PAGE-SECTION')
    expect(el.filter).to.equal(false)
    expect(el.fold).to.equal(false)
    expect(el.full).to.equal(false)
    expect(el.scroller).to.equal(false)
    expect(el.bg).to.equal(null)
    expect(el.image).to.equal(null)
    expect(el.accentColor).to.equal('blue')
    expect(el.scrollerLabel).to.equal('Scroll to reveal content')
    expect(el.preset).to.equal(null)
    expect(el.anchor).to.equal(null)
  })

  it('cleans anchors into id safe values', async () => {
    const el = await fixture(html`<page-section></page-section>`)
    expect(el.cleanAnchor('My Anchor-Name!!')).to.equal('myanchorname')
    expect(el.cleanAnchor('Section 42')).to.equal('section')
    expect(el.cleanAnchor(null)).to.equal('')
  })

  it('exposes hax properties from the lib schema file', async () => {
    const url = await fixture(
      html`<page-section></page-section>`,
    )
    expect(
      url.constructor.haxProperties.endsWith(
        'page-section.haxProperties.json',
      ),
    ).to.equal(true)
  })
})

describe('page-section presets', () => {
  it('applies the antihero preset background and image', async () => {
    const el = await fixture(
      html`<page-section preset="antihero"></page-section>`,
    )
    await el.updateComplete
    expect(el.bg).to.equal('var(--ddd-theme-default-limestoneLight)')
    expect(el.image.endsWith('/lib/assets/geo-bkg.png')).to.equal(true)
  })

  it('applies the lines preset background and texture', async () => {
    const el = await fixture(html`<page-section preset="lines"></page-section>`)
    await el.updateComplete
    expect(el.bg).to.equal('var(--ddd-theme-default-white)')
    expect(el.image.endsWith('/lib/assets/texture-lines.svg')).to.equal(true)
  })

  it('applies the antihero light preset without an image', async () => {
    const el = await fixture(
      html`<page-section preset="antihero-light"></page-section>`,
    )
    await el.updateComplete
    expect(el.bg).to.equal('var(--ddd-theme-default-slateMaxLight)')
    expect(el.image).to.equal(null)
  })

  it('wires video play and pause listeners through the video preset', async () => {
    const el = await fixture(
      html`<page-section preset="video"></page-section>`,
    )
    await el.updateComplete
    expect(el.bg).to.equal('var(--ddd-theme-default-limestoneLight)')
    expect(el.image).to.equal(null)
    el.dispatchEvent(new Event('play'))
    expect(el.bg).to.equal('var(--ddd-theme-default-coalyGray)')
    el.dispatchEvent(new Event('pause'))
    expect(el.bg).to.equal('var(--ddd-theme-default-limestoneLight)')
    // re-entering the video preset rebinds fresh listeners
    el.preset = 'antihero'
    await el.updateComplete
    el.preset = 'video'
    await el.updateComplete
    el.dispatchEvent(new Event('pause'))
    expect(el.bg).to.equal('var(--ddd-theme-default-limestoneLight)')
  })

  it('ignores unknown presets', async () => {
    const el = await fixture(
      html`<page-section preset="unknown"></page-section>`,
    )
    await el.updateComplete
    expect(el.bg).to.equal(null)
    expect(el.image).to.equal(null)
  })
})

describe('page-section anchors and backgrounds', () => {
  it('derives the host id from the anchor when missing', async () => {
    const root = await fixture(html`
      <div><page-section anchor="Hero Section & 2"></page-section></div>
    `)
    const el = root.querySelector('page-section')
    await el.updateComplete
    expect(el.getAttribute('id')).to.equal('herosection')
    // an existing id always wins
    const el2 = await fixture(
      html`<page-section id="fixed" anchor="Other Name"></page-section>`,
    )
    await el2.updateComplete
    expect(el2.getAttribute('id')).to.equal('fixed')
  })

  it('styles the section background with and without the filter', async () => {
    const el = await fixture(
      html`<page-section preset="antihero"></page-section>`,
    )
    await el.updateComplete
    const style = () => el.shadowRoot.querySelector('section.section')
    expect(
      style()
        .getAttribute('style')
        .includes('background-image: url'),
    ).to.equal(true)
    expect(
      style().getAttribute('style').includes('gradient-antihero'),
    ).to.equal(false)
    el.filter = true
    await el.updateComplete
    expect(
      style().getAttribute('style').includes('gradient-antihero'),
    ).to.equal(true)
    expect(
      style().getAttribute('style').includes('url'),
    ).to.equal(true)
  })
})

describe('page-section scroller and fold', () => {
  it('renders the scroller with its tooltip only when requested', async () => {
    const el = await fixture(html`<page-section></page-section>`)
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#scroller')).to.equal(null)
    expect(el.shadowRoot.querySelector('.fold')).to.equal(null)
    const el2 = await fixture(
      html`<page-section
        scroller
        fold
        scroller-label="Keep going"
      ></page-section>`,
    )
    await el2.updateComplete
    const scroller = el2.shadowRoot.querySelector('simple-icon-button-lite#scroller')
    expect(scroller === null).to.equal(false)
    expect(scroller.getAttribute('icon')).to.equal('icons:arrow-downward')
    expect(scroller.getAttribute('label')).to.equal('Keep going')
    expect(el2.shadowRoot.querySelector('.fold') === null).to.equal(false)
    const tooltip = el2.shadowRoot.querySelector('simple-tooltip')
    expect(tooltip === null).to.equal(false)
    expect(tooltip.getAttribute('for')).to.equal('scroller')
    expect(tooltip.getAttribute('position')).to.equal('top')
    expect(tooltip.textContent).to.equal('Keep going')
  })

  it('scrolls to the next sibling from the scroller', async () => {
    const root = await fixture(html`
      <div>
        <page-section scroller></page-section>
        <page-section id="next"></page-section>
      </div>
    `)
    const first = root.querySelectorAll('page-section')[0]
    const next = root.querySelector('#next')
    const calls = []
    next.scrollIntoView = (...args) => {
      calls.push(args)
    }
    first.shadowRoot.querySelector('#scroller').click()
    expect(calls.length).to.equal(1)
    expect(calls[0][0].behavior).to.equal('smooth')
    expect(calls[0][0].block).to.equal('start')
  })

  it('does nothing when no next sibling exists', async () => {
    const el = await fixture(html`<page-section scroller></page-section>`)
    el.shadowRoot.querySelector('#scroller').click()
    expect(el.isConnected).to.equal(true)
  })

  it('passes a11y audit with scroller and fold', async () => {
    const el = await fixture(
      html`<page-section scroller fold
        ><h2>Heading</h2>
        <p>Content</p></page-section
      >`,
    )
    await el.updateComplete
    await expect(el).shadowDom.to.be.accessible()
  })
})
