import { fixture, expect, html } from '@open-wc/testing'
import { PolarisTile } from '../lib/polaris-tile.js'

// direct lib import so coverage sees lib/polaris-tile.js statements
describe('polaris-tile', () => {
  let element

  beforeEach(async () => {
    element = await fixture(html`<polaris-tile></polaris-tile>`)
    await element.updateComplete
  })

  it('registers as a custom element', () => {
    expect(customElements.get('polaris-tile')).to.exist
    expect(PolarisTile.tag).to.equal('polaris-tile')
  })

  it('has default property values', () => {
    expect(element.type).to.equal(null)
    expect(element.line1).to.equal(null)
    expect(element.line2).to.equal(null)
    expect(element.image).to.equal(null)
    expect(element.link).to.equal(null)
    expect(element.editMode).to.equal(false)
  })

  it('renders the tile shell with the line1 slot fallback', async () => {
    element.line1 = 'Facts and figures'
    await element.updateComplete
    const tile = element.shadowRoot.querySelector('.tile')
    expect(tile === null).to.equal(false)
    expect(element.shadowRoot.querySelector('.name').textContent.trim()).to.equal(
      'Facts and figures',
    )
    // no line2 means no split line / additional text
    expect(element.shadowRoot.querySelector('.split-line') === null).to.equal(true)
    expect(element.shadowRoot.querySelector('.additionalText') === null).to.equal(
      true,
    )
    // no link means no detail-button anchor
    expect(element.shadowRoot.querySelector('a.button') === null).to.equal(true)
    // no image means the style binding renders as an empty value
    // (Lit keeps an empty style attribute rather than removing it)
    expect(!tile.getAttribute('style')).to.equal(true)
    expect(
      (tile.getAttribute('style') || '').includes('background-image'),
    ).to.equal(false)
  })

  it('renders the split line and additional text when line2 is set', async () => {
    element.line1 = 'Stat'
    element.line2 = 'A supporting stat line'
    await element.updateComplete
    expect(
      element.shadowRoot.querySelector('.split-line') === null,
    ).to.equal(false)
    expect(
      element.shadowRoot.querySelector('.additionalText').textContent.trim(),
    ).to.equal('A supporting stat line')
  })

  it('applies the image as an inline background-image', async () => {
    element.image = '/files/hero.jpg'
    await element.updateComplete
    const style = element.shadowRoot.querySelector('.tile').getAttribute('style')
    expect(style.includes('background-image: url(/files/hero.jpg)')).to.equal(
      true,
    )
  })

  it('renders a details anchor wired to the link with aria-label fallbacks', async () => {
    element.link = '/about'
    await element.updateComplete
    const a = element.shadowRoot.querySelector('a.button')
    expect(a === null).to.equal(false)
    expect(a.getAttribute('href')).to.equal('/about')
    // no line1 means the generic label is used
    expect(a.getAttribute('aria-label')).to.equal(
      'Additional details about this fact',
    )
    expect(a.getAttribute('title')).to.equal('Additional details about this fact')
    // the anchor svg icon is decorative
    expect(a.querySelector('svg').getAttribute('aria-hidden')).to.equal('true')
    // with line1 set the label derives from it
    element.line1 = 'Read more facts'
    await element.updateComplete
    expect(
      element.shadowRoot.querySelector('a.button').getAttribute('aria-label'),
    ).to.equal('Read more facts')
  })

  it('reflects the type as a host attribute', async () => {
    element.type = '3'
    await element.updateComplete
    expect(element.getAttribute('type')).to.equal('3')
  })

  it('blocks link navigation while in edit mode', () => {
    const evt = new Event('click', {
      cancelable: true,
      bubbles: true,
      composed: true,
    })
    element.editMode = true
    element._clickLink(evt)
    expect(evt.defaultPrevented).to.equal(true)
    const evt2 = new Event('click', {
      cancelable: true,
      bubbles: true,
      composed: true,
    })
    element.editMode = false
    element._clickLink(evt2)
    expect(evt2.defaultPrevented).to.equal(false)
  })

  it('exposes the hax hooks contract', () => {
    expect(element.haxHooks()).to.deep.equal({
      editModeChanged: 'haxeditModeChanged',
      activeElementChanged: 'haxactiveElementChanged',
    })
  })

  it('haxeditModeChanged toggles edit mode', () => {
    element.haxeditModeChanged(true)
    expect(element.editMode).to.equal(true)
    element.haxeditModeChanged(false)
    expect(element.editMode).to.equal(false)
  })

  it('haxactiveElementChanged syncs edit mode and returns false', () => {
    expect(element.haxactiveElementChanged(element, true)).to.equal(false)
    expect(element.editMode).to.equal(true)
    element.haxactiveElementChanged(element, false)
    expect(element.editMode).to.equal(false)
  })

  it('references its haxProperties schema by file URL', () => {
    expect(PolarisTile.haxProperties.endsWith('polaris-tile.haxProperties.json')).to.equal(true)
  })

  it('passes the a11y audit with content', async () => {
    const populated = await fixture(
      html`<polaris-tile
        type="1"
        line1="Fast facts"
        line2="Our impact in numbers"
        link="/facts"
      ></polaris-tile>`,
    )
    await populated.updateComplete
    await expect(populated).shadowDom.to.be.accessible({
      ignoredRules: ['color-contrast'],
    })
  })
})
