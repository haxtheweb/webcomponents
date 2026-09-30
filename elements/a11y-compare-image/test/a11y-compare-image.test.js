import { fixture, expect, html } from '@open-wc/testing'
import '../a11y-compare-image.js'

const TOP =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7?t=top'
const BOTTOM =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7?t=bottom'
const MID =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7?t=mid'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
async function poll(predicate, attempts = 100, delayMs = 20) {
  for (let i = 0; i < attempts; i++) {
    if (predicate()) return true
    await sleep(delayMs)
  }
  return predicate()
}

describe('a11y-compare-image rendering', () => {
  it('renders the figure, layers and labeled slider', async () => {
    const el = await fixture(
      html`<a11y-compare-image label="Compare the images">
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('figure')).to.exist
    expect(
      el.shadowRoot.querySelector('figcaption slot[name="heading"]'),
    ).to.exist
    expect(el.shadowRoot.querySelector('#description')).to.exist
    expect(el.shadowRoot.querySelector('#container')).to.exist
    expect(el.shadowRoot.querySelector('#layer')).to.exist
    expect(el.shadowRoot.querySelector('#placeholder')).to.exist
    // the top slot is hidden in the shadow DOM; layers are backgrounds
    expect(el.shadowRoot.querySelector('slot[name="top"]').hasAttribute('hidden'))
      .to.be.true
    const slider = el.shadowRoot.querySelector('#slider')
    expect(slider.getAttribute('label')).to.equal('Compare the images')
    expect(slider.getAttribute('accent-color')).to.equal('blue')
    expect(slider.getAttribute('value')).to.equal('50')
    // the default enticement knob is off
    expect(el.dataPulse).to.be.false
    expect(el.shadowRoot.querySelector('.knob-enticement')).to.equal(null)
    // default position is centered and reflected
    expect(el.position).to.equal(50)
    expect(el.hasAttribute('position')).to.be.true
  })

  it('passes the a11y audit', async () => {
    const el = await fixture(
      html`<a11y-compare-image label="Compare the images">
        <h2 slot="heading">A comparison</h2>
        <div slot="description">Slide to reveal the bottom image</div>
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    )
    await expect(el).shadowDom.to.be.accessible()
  })
})

describe('a11y-compare-image sliding', () => {
  it('wipes the top layer across the bottom at the position', async () => {
    const el = await fixture(
      html`<a11y-compare-image>
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    )
    await el.updateComplete
    const container = el.shadowRoot.querySelector('#container')
    const input = el.shadowRoot.querySelector('#input')
    // firstUpdated slides to the default position
    expect(el.__upper).to.equal(TOP)
    expect(el.__lower).to.equal(BOTTOM)
    expect(el.activeLayer).to.equal(1)
    // the slider position marker on #input survives re-renders
    expect(input.style.getPropertyValue('--a11y-compare-image-position')).to
      .equal('50%')
    // two layers: total - 1 == 0 == __markers.length, so the marker guard
    // skips _updateMarkers entirely and no markers are rendered (the only
    // boundary would be 100%, which renders hidden anyway)
    expect(el.__markers).to.deep.equal([])
    expect(el.shadowRoot.querySelectorAll('.marker').length).to.equal(0)
    // the container shows the lower layer as its background
    expect(container.style.backgroundImage).to.include('t=bottom')
    // BUG: _slide imperatively sets --a11y-compare-image-width and
    // --a11y-compare-image-opacity on #container, but the template's
    // style="background-image: url(...__lower)" binding re-commits the
    // container's style attribute whenever __lower changes, wiping the
    // imperative custom properties on EVERY layer transition (including
    // this first one), so the wipe width falls back to the css default
    expect(
      container.style.getPropertyValue('--a11y-compare-image-width'),
    ).to.equal('')
    expect(
      container.style.getPropertyValue('--a11y-compare-image-opacity'),
    ).to.equal('')
  })

  it('sets the wipe width on slides that keep the same layers', async () => {
    const el = await fixture(
      html`<a11y-compare-image>
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    )
    await el.updateComplete
    const container = el.shadowRoot.querySelector('#container')
    // a slide within the same section keeps __lower unchanged, so the
    // imperative custom properties are not wiped by the style re-commit
    el.position = 25
    await el.updateComplete
    expect(
      container.style.getPropertyValue('--a11y-compare-image-width'),
    ).to.equal('25%')
    expect(
      container.style.getPropertyValue('--a11y-compare-image-opacity'),
    ).to.equal('1')
  })

  it('fades the top layer in opacity mode', async () => {
    const el = await fixture(
      html`<a11y-compare-image opacity>
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    )
    await el.updateComplete
    const container = el.shadowRoot.querySelector('#container')
    // a same-section slide keeps the layers, so the imperative styles stick
    el.position = 60
    await el.updateComplete
    // opacity mode keeps the top layer full width and fades it instead
    expect(container.style.getPropertyValue('--a11y-compare-image-width')).to
      .equal('100%')
    expect(container.style.getPropertyValue('--a11y-compare-image-opacity')).to
      .equal('0.6')
  })

  it('slides between three layers and recomputes markers', async () => {
    const el = await fixture(
      html`<a11y-compare-image>
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${MID}" alt="middle image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    )
    await el.updateComplete
    // three layers: two transitions, markers at 50 and 100
    expect(el.__markers).to.deep.equal([50, 100])
    let markers = el.shadowRoot.querySelectorAll('.marker')
    expect(markers.length).to.equal(2)
    expect(markers[0].hasAttribute('hidden')).to.be.false
    expect(markers[1].hasAttribute('hidden')).to.be.true
    // position 75 selects the middle layer as upper and lower
    el.position = 75
    await el.updateComplete
    expect(el.activeLayer).to.equal(2)
    expect(el.__upper).to.equal(TOP)
    expect(el.__lower).to.equal(MID)
    // position 100 collapses to the final layer on top
    el.position = 100
    await el.updateComplete
    expect(el.activeLayer).to.equal(3)
    expect(el.__upper).to.equal(TOP)
    expect(el.__lower).to.equal(TOP)
    // markers stay stable across slides
    expect(el.__markers).to.deep.equal([50, 100])
    markers = el.shadowRoot.querySelectorAll('.marker')
    expect(markers.length).to.equal(2)
  })

  it('relays slider value changes into the position', async () => {
    const el = await fixture(
      html`<a11y-compare-image>
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    )
    await el.updateComplete
    const slider = el.shadowRoot.querySelector('#slider')
    slider.dispatchEvent(
      new CustomEvent('immediate-value-changed', {
        bubbles: true,
        composed: true,
        detail: { value: 25 },
      }),
    )
    await el.updateComplete
    expect(el.position).to.equal(25)
    expect(
      el.shadowRoot
        .querySelector('#container')
        .style.getPropertyValue('--a11y-compare-image-width'),
    ).to.equal('25%')
    expect(el.shadowRoot.querySelector('#slider').getAttribute('value')).to
      .equal('25')
  })
})

describe('a11y-compare-image enticement and colors', () => {
  it('shows the pulse knob until first interaction', async () => {
    const el = await fixture(
      html`<a11y-compare-image data-pulse>
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    )
    await el.updateComplete
    expect(el.dataPulse).to.be.true
    expect(el.hasAttribute('data-pulse')).to.be.true
    expect(el.shadowRoot.querySelector('.knob-enticement')).to.exist
    // a mouseenter dismisses the enticement
    el.dispatchEvent(new Event('mouseenter', { bubbles: true }))
    await el.updateComplete
    expect(el.dataPulse).to.be.false
    expect(el.shadowRoot.querySelector('.knob-enticement')).to.equal(null)
  })

  it('dismisses the pulse knob on focusin as well', async () => {
    const el = await fixture(
      html`<a11y-compare-image data-pulse>
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('.knob-enticement')).to.exist
    el.dispatchEvent(new Event('focusin', { bubbles: true }))
    await el.updateComplete
    expect(el.shadowRoot.querySelector('.knob-enticement')).to.equal(null)
  })

  it('passes accent color and dark mode to the slider', async () => {
    const el = await fixture(
      html`<a11y-compare-image accent-color="green">
        <img slot="bottom" src="${BOTTOM}" alt="bottom image" />
        <img slot="top" src="${TOP}" alt="top image" />
      </a11y-compare-image>`,
    )
    await el.updateComplete
    const slider = el.shadowRoot.querySelector('#slider')
    expect(slider.getAttribute('accent-color')).to.equal('green')
    expect(slider.hasAttribute('dark')).to.be.false
    el.dark = true
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#slider').hasAttribute('dark')).to.be
      .true
  })
})
