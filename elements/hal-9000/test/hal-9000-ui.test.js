import { fixture, expect, html } from '@open-wc/testing'
import { Hal9000UI } from '../lib/hal-9000-ui/hal-9000-ui.js'

describe('hal-9000-ui', () => {
  it('registers with its own tag and instantiates', async () => {
    expect(globalThis.customElements.get('hal-9000-ui')).to.equal(Hal9000UI)
    const el = await fixture(html`<hal-9000-ui></hal-9000-ui>`)
    expect(el).to.be.instanceOf(Hal9000UI)
  })

  it('renders the animated container with three circles', async () => {
    const el = await fixture(html`<hal-9000-ui></hal-9000-ui>`)
    const container = el.shadowRoot.querySelector('#container')
    expect(container).to.exist
    const circles = container.querySelectorAll('.circle')
    expect(circles.length).to.equal(3)
    // staggered animation delays
    const delays = Array.from(circles).map((c) =>
      c.getAttribute('style'),
    )
    expect(delays).to.deep.equal([
      'animation-delay: 0s',
      'animation-delay: 1s',
      'animation-delay: 2s',
    ])
  })

  it('passes a shadowDom a11y audit', async () => {
    const el = await fixture(html`<hal-9000-ui></hal-9000-ui>`)
    await expect(el).shadowDom.to.be.accessible()
  })

  it('mini defaults to off and reflects to an attribute', async () => {
    const el = await fixture(html`<hal-9000-ui></hal-9000-ui>`)
    expect(el.mini).to.be.false
    el.mini = true
    await el.updateComplete
    expect(el.hasAttribute('mini')).to.be.true
  })

  it('parses the mini attribute on upgrade', async () => {
    const el = await fixture(html`<hal-9000-ui mini></hal-9000-ui>`)
    expect(el.mini).to.be.true
    expect(el.hasAttribute('mini')).to.be.true
  })

  it('inherits simple-colors defaults and the full palette', async () => {
    const el = await fixture(html`<hal-9000-ui></hal-9000-ui>`)
    expect(el.accentColor).to.equal('grey')
    expect(el.dark).to.be.false
    expect(Object.keys(el.colors).length).to.equal(19)
    expect(el.colors).to.have.property('grey')
    expect(el.colors).to.have.property('blue-grey')
  })

  it('reflects inherited simple-colors properties', async () => {
    const el = await fixture(html`<hal-9000-ui></hal-9000-ui>`)
    el.accentColor = 'red'
    el.dark = true
    await el.updateComplete
    expect(el.getAttribute('accent-color')).to.equal('red')
    expect(el.hasAttribute('dark')).to.be.true
  })
})

describe('hal-9000-ui inherited simple-colors helpers', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<hal-9000-ui></hal-9000-ui>`)
  })

  it('builds a CSS variable name from the caller arguments', () => {
    expect(el.makeVariable('red', 3, 'fixed')).to.equal(
      '--simple-colors-fixed-theme-red-3',
    )
    expect(el.makeVariable()).to.equal('--simple-colors-default-theme-grey-1')
  })

  it('lists AA-compliant contrasting shades', () => {
    expect(el.getContrastingShades(false, 'grey', '1', 'grey')).to.deep.equal([
      7, 8, 9, 10, 11, 12,
    ])
    // greyColor.aaLarge shade 8 (index 7) = { min: 1, max: 5 }
    expect(el.getContrastingShades(true, 'red', '8', 'grey')).to.deep.equal([
      1, 2, 3, 4, 5,
    ])
    expect(el.getContrastingShades(false, 'red', '3', 'blue')).to.deep.equal([
      9, 10, 11, 12,
    ])
  })

  it('lists AA-compliant shades for every color', () => {
    const result = el.getContrastingColors('red', '8', false)
    expect(Object.keys(result)).to.deep.equal(Object.keys(el.colors))
    expect(result.grey).to.deep.equal([1, 2, 3, 4, 5, 6, 7])
  })

  it('parses CSS variable names', () => {
    expect(el.getColorInfo('--simple-colors-fixed-theme-red-3')).to.deep.equal({
      theme: 'fixed',
      color: 'red',
      shade: '3',
    })
    // inputs without the -theme- marker fall back to default info
    expect(el.getColorInfo('anything')).to.deep.equal({
      theme: 'default',
      color: 'grey',
      shade: '1',
    })
  })

  it('handles the darkest shade 12 (contrast table indexes by shade)', () => {
    expect(el.getContrastingShades(false, 'grey', '12', 'grey')).to.deep.equal([
      1, 2, 3, 4, 5, 6,
    ])
  })

  it('invertShade inverts a shade across the scale', () => {
    expect(el.invertShade(3)).to.equal(10)
    expect(el.invertShade(1)).to.equal(12)
  })

  it('isContrastCompliant answers with a boolean', () => {
    expect(el.isContrastCompliant(false, 'grey', '1', 'grey', 12)).to.equal(true)
    expect(el.isContrastCompliant(false, 'grey', '1', 'grey', 1)).to.equal(false)
  })
})
