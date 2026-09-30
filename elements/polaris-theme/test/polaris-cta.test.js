import { fixture, expect, html } from '@open-wc/testing'
import { PolarisCta } from '../lib/polaris-cta.js'

// direct lib import so coverage sees lib/polaris-cta.js statements
describe('polaris-cta', () => {
  let element

  beforeEach(async () => {
    element = await fixture(html`<polaris-cta></polaris-cta>`)
    await element.updateComplete
  })

  it('registers as a custom element', () => {
    expect(customElements.get('polaris-cta')).to.exist
    expect(PolarisCta.tag).to.equal('polaris-cta')
  })

  it('has default property values', () => {
    expect(element.text).to.equal('')
    expect(element.link).to.equal('')
    expect(element.type).to.equal('tinted')
    expect(element.outlined).to.equal(false)
    expect(element.filled).to.equal(false)
    expect(element.editMode).to.equal(false)
  })

  it('renders an anchor wired to the link property with slot fallback', async () => {
    element.text = 'Apply today'
    element.link = '/apply'
    await element.updateComplete
    const a = element.shadowRoot.querySelector('a')
    expect(a === null).to.equal(false)
    expect(a.getAttribute('href')).to.equal('/apply')
    // slot fallback text renders inside the anchor
    expect(a.textContent.trim()).to.equal('Apply today')
  })

  it('prefers slotted light-dom content over the text property', async () => {
    const slotted = await fixture(
      html`<polaris-cta link="/go"><span>Custom label</span></polaris-cta>`,
    )
    await slotted.updateComplete
    // textContent of the anchor only sees the shadow-tree fallback, so
    // verify the assignment through the slot itself
    const slot = slotted.shadowRoot.querySelector('a slot')
    expect(slot === null).to.equal(false)
    const assigned = slot.assignedNodes({ flatten: true })
    expect(assigned.map((node) => node.textContent).join('').trim()).to.equal(
      'Custom label',
    )
  })

  it('reflects type, outlined and filled as host attributes', async () => {
    expect(element.getAttribute('type')).to.equal('tinted')
    expect(element.hasAttribute('outlined')).to.equal(false)
    expect(element.hasAttribute('filled')).to.equal(false)
    element.type = 'primary'
    element.outlined = true
    await element.updateComplete
    expect(element.getAttribute('type')).to.equal('primary')
    expect(element.hasAttribute('outlined')).to.equal(true)
    element.outlined = false
    element.filled = true
    await element.updateComplete
    expect(element.hasAttribute('outlined')).to.equal(false)
    expect(element.hasAttribute('filled')).to.equal(true)
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
    // a plain (non-edit) click passes straight through
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
    expect(PolarisCta.haxProperties.endsWith('polaris-cta.haxProperties.json')).to.equal(true)
  })

  it('passes the a11y audit with content', async () => {
    const populated = await fixture(
      html`<polaris-cta text="Apply today" link="/apply"></polaris-cta>`,
    )
    await populated.updateComplete
    await expect(populated).shadowDom.to.be.accessible({
      ignoredRules: ['color-contrast'],
    })
  })
})
