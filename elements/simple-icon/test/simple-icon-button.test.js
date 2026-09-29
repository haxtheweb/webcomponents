import { fixture, expect, html } from '@open-wc/testing'

// Explicit imports so istanbul instruments each lib file
import '../lib/simple-icon-button.js'
import '../lib/simple-icon-button-lite.js'
import { SimpleIconButton } from '../lib/simple-icon-button.js'
import { SimpleIconButtonLite } from '../lib/simple-icon-button-lite.js'

describe('simple-icon-button-lite', () => {
  it('has the correct tag name', () => {
    expect(SimpleIconButtonLite.tag).to.equal('simple-icon-button-lite')
  })

  it('instantiates as a SimpleIconButtonLite', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite></simple-icon-button-lite>`,
    )
    expect(el instanceof SimpleIconButtonLite).to.be.true
  })

  it('defaults type to button', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite></simple-icon-button-lite>`,
    )
    expect(el.type).to.equal('button')
  })

  it('renders a button with part button in shadow DOM', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite></simple-icon-button-lite>`,
    )
    const btn = el.shadowRoot.querySelector('button')
    expect(!!btn).to.be.true
    expect(btn.getAttribute('part')).to.equal('button')
  })

  it('passes the a11y audit with a label', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite label="Search"></simple-icon-button-lite>`,
    )
    await expect(el).shadowDom.to.be.accessible()
  })

  it('maps label to aria-label and label attribute on the button', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite label="Search"></simple-icon-button-lite>`,
    )
    const btn = el.shadowRoot.querySelector('button')
    expect(btn.getAttribute('aria-label')).to.equal('Search')
    expect(btn.getAttribute('label')).to.equal('Search')
  })

  it('maps controls to aria-controls on the button', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite controls="target-id"></simple-icon-button-lite>`,
    )
    const btn = el.shadowRoot.querySelector('button')
    expect(btn.getAttribute('aria-controls')).to.equal('target-id')
  })

  // BUG/a11y: lit renders `${this.controls || undefined}` as an EMPTY
  // string attribute (lit 3.3.3 maps undefined to ''), so the button gets
  // aria-controls="" even when controls is not supplied. An empty idref is
  // invalid ARIA; flip this when the render removes the attribute instead.
  it('BUG: renders an empty aria-controls when not supplied', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite></simple-icon-button-lite>`,
    )
    const btn = el.shadowRoot.querySelector('button')
    expect(btn.getAttribute('aria-controls')).to.equal('')
  })

  it('maps aria-labelledby to the button', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite aria-labelledby="label-id"></simple-icon-button-lite>`,
    )
    const btn = el.shadowRoot.querySelector('button')
    expect(btn.getAttribute('aria-labelledby')).to.equal('label-id')
  })

  it('maps field-name to the name attribute on the button', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite field-name="my-field"></simple-icon-button-lite>`,
    )
    const btn = el.shadowRoot.querySelector('button')
    expect(btn.getAttribute('name')).to.equal('my-field')
  })

  it('maps form to the form attribute on the button', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite form="my-form"></simple-icon-button-lite>`,
    )
    const btn = el.shadowRoot.querySelector('button')
    expect(btn.getAttribute('form')).to.equal('my-form')
  })

  it('sets the value attribute on the button and reflects to host', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite value="yes"></simple-icon-button-lite>`,
    )
    const btn = el.shadowRoot.querySelector('button')
    expect(btn.getAttribute('value')).to.equal('yes')
    expect(el.getAttribute('value')).to.equal('yes')
  })

  it('sets autofocus on the button', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite autofocus></simple-icon-button-lite>`,
    )
    const btn = el.shadowRoot.querySelector('button')
    expect(btn.hasAttribute('autofocus')).to.be.true
  })

  it('disables the button when disabled', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite disabled></simple-icon-button-lite>`,
    )
    const btn = el.shadowRoot.querySelector('button')
    expect(el.disabled).to.be.true
    expect(btn.hasAttribute('disabled')).to.be.true
  })

  it('sets aria-pressed true when toggles and toggled', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite toggles toggled></simple-icon-button-lite>`,
    )
    const btn = el.shadowRoot.querySelector('button')
    expect(btn.getAttribute('aria-pressed')).to.equal('true')
  })

  it('sets aria-pressed false when toggles and not toggled', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite toggles></simple-icon-button-lite>`,
    )
    const btn = el.shadowRoot.querySelector('button')
    expect(btn.getAttribute('aria-pressed')).to.equal('false')
  })

  // BUG/a11y: when toggles is false the render binds undefined, which lit
  // 3.3.3 commits as aria-pressed="" — an invalid value (allowed: false /
  // mixed / true). Flip when the attribute is removed for non-toggles.
  it('BUG: renders an empty aria-pressed when not a toggle button', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite toggled></simple-icon-button-lite>`,
    )
    const btn = el.shadowRoot.querySelector('button')
    expect(btn.getAttribute('aria-pressed')).to.equal('')
  })

  it('reflects toggles and toggled to host attributes', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite toggles toggled></simple-icon-button-lite>`,
    )
    expect(el.hasAttribute('toggles')).to.be.true
    expect(el.hasAttribute('toggled')).to.be.true
  })

  it('passes icon to the nested simple-icon-lite', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite icon="icons:home"></simple-icon-button-lite>`,
    )
    const icon = el.shadowRoot.querySelector('simple-icon-lite')
    expect(!!icon).to.be.true
    expect(icon.getAttribute('icon')).to.equal('icons:home')
    expect(icon.getAttribute('part')).to.equal('icon')
  })

  // BUG: the render binds `?no-colorize="${this.noColorize}"` but
  // SimpleIconButtonBehaviors never declares a noColorize property, so the
  // no-colorize attribute on the host is silently ignored and never reaches
  // the nested icon. Flip when noColorize is declared on the behaviors class.
  it('BUG: no-colorize on the host is ignored', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite icon="icons:home" no-colorize></simple-icon-button-lite>`,
    )
    const icon = el.shadowRoot.querySelector('simple-icon-lite')
    expect(icon.hasAttribute('no-colorize')).to.be.false
  })

  it('reflects icon to the host attribute', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite icon="icons:home"></simple-icon-button-lite>`,
    )
    expect(el.getAttribute('icon')).to.equal('icons:home')
  })

  it('slots light DOM content inside the button', async () => {
    const el = await fixture(
      html`<simple-icon-button-lite label="Go"><span id="slotted">hi</span></simple-icon-button-lite>`,
    )
    const slotted = el.querySelector('#slotted')
    expect(!!slotted).to.be.true
    expect(slotted.textContent).to.equal('hi')
    const slot = el.shadowRoot.querySelector('button slot')
    expect(!!slot).to.be.true
  })

  it('declares all button properties with attribute mappings', () => {
    const props = SimpleIconButtonLite.properties
    expect(props).to.have.property('autofocus')
    expect(props.ariaLabelledby.attribute).to.equal('aria-labelledby')
    expect(props).to.have.property('controls')
    expect(props).to.have.property('disabled')
    expect(props.fieldName.attribute).to.equal('field-name')
    expect(props).to.have.property('form')
    expect(props).to.have.property('icon')
    expect(props.icon.reflect).to.equal(true)
    expect(props).to.have.property('label')
    expect(props).to.have.property('type')
    expect(props.value.reflect).to.equal(true)
    expect(props.toggles.reflect).to.equal(true)
    expect(props.toggled.reflect).to.equal(true)
  })

  it('returns an array of styles', () => {
    expect(Array.isArray(SimpleIconButtonLite.styles)).to.be.true
    expect(SimpleIconButtonLite.styles.length).to.be.greaterThan(0)
  })
})

describe('simple-icon-button', () => {
  it('has the correct tag name', () => {
    expect(SimpleIconButton.tag).to.equal('simple-icon-button')
  })

  it('instantiates as a SimpleIconButton', async () => {
    const el = await fixture(
      html`<simple-icon-button></simple-icon-button>`,
    )
    expect(el instanceof SimpleIconButton).to.be.true
  })

  it('defaults accentColor to grey, contrast to 4, and dark to false', async () => {
    const el = await fixture(
      html`<simple-icon-button></simple-icon-button>`,
    )
    expect(el.accentColor).to.equal('grey')
    expect(el.contrast).to.equal(4)
    expect(el.dark).to.be.false
  })

  it('passes the a11y audit with a label', async () => {
    const el = await fixture(
      html`<simple-icon-button icon="icons:home" label="Home"></simple-icon-button>`,
    )
    await expect(el).shadowDom.to.be.accessible()
  })

  it('renders a nested simple-icon with the default theme', async () => {
    const el = await fixture(
      html`<simple-icon-button icon="icons:home" label="Home"></simple-icon-button>`,
    )
    const icon = el.shadowRoot.querySelector('button simple-icon')
    expect(!!icon).to.be.true
    expect(icon.getAttribute('accent-color')).to.equal('grey')
    expect(icon.getAttribute('contrast')).to.equal('4')
    expect(icon.getAttribute('icon')).to.equal('icons:home')
    expect(icon.hasAttribute('dark')).to.be.false
  })

  it('passes accent-color, contrast, and dark to the icon', async () => {
    const el = await fixture(
      html`<simple-icon-button icon="icons:home" label="Home" accent-color="blue" contrast="3" dark></simple-icon-button>`,
    )
    const icon = el.shadowRoot.querySelector('button simple-icon')
    expect(icon.getAttribute('accent-color')).to.equal('blue')
    expect(icon.getAttribute('contrast')).to.equal('3')
    expect(icon.hasAttribute('dark')).to.be.true
  })

  // BUG: same missing noColorize declaration as the lite variant; the
  // `?no-colorize` binding on the nested simple-icon is always false.
  it('BUG: no-colorize on the host is ignored', async () => {
    const el = await fixture(
      html`<simple-icon-button icon="icons:home" label="Home" no-colorize></simple-icon-button>`,
    )
    const icon = el.shadowRoot.querySelector('button simple-icon')
    expect(icon.hasAttribute('no-colorize')).to.be.false
  })

  it('reflects contrast to the host attribute', async () => {
    const el = await fixture(
      html`<simple-icon-button contrast="2"></simple-icon-button>`,
    )
    expect(el.contrast).to.equal(2)
    expect(el.getAttribute('contrast')).to.equal('2')
  })

  it('sets aria-pressed on the button when toggles and toggled', async () => {
    const el = await fixture(
      html`<simple-icon-button icon="icons:home" label="Home" toggles toggled></simple-icon-button>`,
    )
    const btn = el.shadowRoot.querySelector('button')
    expect(btn.getAttribute('aria-pressed')).to.equal('true')
  })

  it('disables the button when disabled', async () => {
    const el = await fixture(
      html`<simple-icon-button icon="icons:home" label="Home" disabled></simple-icon-button>`,
    )
    const btn = el.shadowRoot.querySelector('button')
    expect(btn.hasAttribute('disabled')).to.be.true
  })

  it('updates the nested icon when properties change', async () => {
    const el = await fixture(
      html`<simple-icon-button icon="icons:home" label="Home"></simple-icon-button>`,
    )
    el.accentColor = 'red'
    el.contrast = 1
    el.dark = true
    await el.updateComplete
    const icon = el.shadowRoot.querySelector('button simple-icon')
    expect(icon.getAttribute('accent-color')).to.equal('red')
    expect(icon.getAttribute('contrast')).to.equal('1')
    expect(icon.hasAttribute('dark')).to.be.true
  })
})
