import { fixture, expect, html, elementUpdated, oneEvent } from '@open-wc/testing'
import { HexPicker } from '../hex-picker.js'

describe('hex-picker defaults and rendering', () => {
  it('has sensible constructor defaults', async () => {
    const el = await fixture(html`<hex-picker></hex-picker>`)
    expect(el.value).to.equal('#000000FF')
    expect(el._rValue).to.equal(0)
    expect(el._gValue).to.equal(0)
    expect(el._bValue).to.equal(0)
    expect(el._oValue).to.equal(255)
    expect(el.disabled).to.be.false
    expect(el.largeDisplay).to.be.undefined
  })
  it('renders a hex input, color square, and four fieldsets', async () => {
    const el = await fixture(html`<hex-picker></hex-picker>`)
    const input = el.shadowRoot.querySelector('input.text-input')
    expect(input).to.exist
    expect(input.getAttribute('aria-label')).to.equal('HEX code')
    expect(input.getAttribute('maxlength')).to.equal('9')
    expect(input.disabled).to.be.false
    expect(el.shadowRoot.querySelector('.color-square')).to.exist
    const fieldsets = el.shadowRoot.querySelectorAll('fieldset')
    expect(fieldsets.length).to.equal(4)
    expect(el.shadowRoot.querySelector('.large-display')).to.not.exist
    expect(el.shadowRoot.querySelector('#R')).to.exist
    expect(el.shadowRoot.querySelector('#G')).to.exist
    expect(el.shadowRoot.querySelector('#B')).to.exist
    expect(el.shadowRoot.querySelector('#O')).to.exist
    expect(el.shadowRoot.querySelector('#R_out').textContent).to.equal('0')
  })
  it('renders a large display when largeDisplay is set', async () => {
    const el = await fixture(html`<hex-picker large-display></hex-picker>`)
    expect(el.shadowRoot.querySelector('.large-display')).to.exist
    expect(el.hasAttribute('large-display')).to.be.true
  })
  it('disables the text input when disabled', async () => {
    const el = await fixture(html`<hex-picker disabled></hex-picker>`)
    expect(el.shadowRoot.querySelector('input.text-input').disabled).to.be.true
    el.disabled = false
    await elementUpdated(el)
    expect(el.shadowRoot.querySelector('input.text-input').disabled).to.be.false
    expect(el.hasAttribute('disabled')).to.be.false
  })
  it('exposes haxProperties', () => {
    const props = HexPicker.haxProperties
    expect(props.canScale).to.be.false
    expect(props.canEditSource).to.be.true
    expect(props.gizmo.title).to.equal('Hex Picker')
    expect(props.gizmo.tags).to.include('developer')
    expect(props.settings.configure.length).to.equal(3)
    expect(props.settings.configure[0].property).to.equal('value')
    expect(props.settings.advanced.length).to.equal(0)
    expect(props.demoSchema[0].tag).to.equal('hex-picker')
    expect(HexPicker.tag).to.equal('hex-picker')
  })
})

describe('hex-picker hex utilities', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<hex-picker></hex-picker>`)
  })
  it('pads single hex digits', () => {
    expect(el._padHex('f')).to.equal('0f')
    expect(el._padHex('0')).to.equal('00')
    expect(el._padHex('ff')).to.equal('ff')
  })
  it('computes hex from channel values', () => {
    el._rValue = 10
    el._gValue = 11
    el._bValue = 12
    el._oValue = 255
    expect(el._computeHex()).to.equal('#0a0b0cff')
  })
  it('converts 7 and 9 char hex to rgb', () => {
    const rgb7 = el._hexToRgb('#102030')
    expect(rgb7.r).to.equal(16)
    expect(rgb7.g).to.equal(32)
    expect(rgb7.b).to.equal(48)
    expect(rgb7.o).to.equal(0)
    const rgb9 = el._hexToRgb('#10203040')
    expect(rgb9.r).to.equal(16)
    expect(rgb9.g).to.equal(32)
    expect(rgb9.b).to.equal(48)
    expect(rgb9.o).to.equal(64)
  })
  it('converts shorthand hex by repeating each digit', () => {
    // FIXED (haxtheweb/issues#3102 #14): shorthand parsing now repeats each
    // digit, so '#f00' parses to r=255, g=0, b=0 (previously appended 'F',
    // yielding g=15, b=15). NOTE: 4-length shorthand still reports alpha 0 —
    // pre-existing behavior intentionally left as-is by the fix.
    const rgb4 = el._hexToRgb('#f00')
    expect(rgb4.r).to.equal(255)
    expect(rgb4.g).to.equal(0)
    expect(rgb4.b).to.equal(0)
    expect(rgb4.o).to.equal(0)
    const rgb5 = el._hexToRgb('#f00f')
    expect(rgb5.r).to.equal(255)
    expect(rgb5.g).to.equal(0)
    expect(rgb5.b).to.equal(0)
    expect(rgb5.o).to.equal(255)
  })
  it('falls back to zeros for unexpected hex lengths', () => {
    const rgb = el._hexToRgb('#12345')
    expect(rgb.r).to.equal(0)
    expect(rgb.g).to.equal(0)
    expect(rgb.b).to.equal(0)
    expect(rgb.o).to.equal(0)
  })
})

describe('hex-picker keyboard validation', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<hex-picker></hex-picker>`)
  })
  it('blocks non-hex characters', () => {
    let prevented = false
    el._validateInput({ which: 90, preventDefault: () => (prevented = true) })
    expect(prevented).to.be.true
  })
  it('allows hex characters, backspace, and arrows', () => {
    let prevented = false
    const ev = { preventDefault: () => (prevented = true) }
    el._validateInput({ ...ev, which: 102 })
    el._validateInput({ ...ev, which: 70 })
    el._validateInput({ ...ev, which: 51 })
    el._validateInput({ ...ev, which: 8 })
    el._validateInput({ ...ev, which: 39 })
    el._validateInput({ ...ev, which: 37 })
    expect(prevented).to.be.false
  })
  it('preventDefaults real keydown events for invalid keys', async () => {
    const input = el.shadowRoot.querySelector('input.text-input')
    const bad = new KeyboardEvent('keydown', { key: 'z', keyCode: 90, cancelable: true })
    input.dispatchEvent(bad)
    expect(bad.defaultPrevented).to.be.true
    const good = new KeyboardEvent('keydown', { key: 'a', keyCode: 65, cancelable: true })
    input.dispatchEvent(good)
    expect(good.defaultPrevented).to.be.false
  })
})

describe('hex-picker input behavior', () => {
  it('syncs value, square, sliders, and fires value-changed on input', async () => {
    const el = await fixture(html`<hex-picker></hex-picker>`)
    const input = el.shadowRoot.querySelector('input.text-input')
    const listener = oneEvent(el, 'value-changed')
    input.value = '#ff0000'
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    const e = await listener
    expect(e.detail.value).to.equal('#ff0000')
    expect(el.value).to.equal('#ff0000')
    expect(el.getAttribute('value')).to.equal('#ff0000')
    expect(el.shadowRoot.querySelector('.color-square').style.backgroundColor).to.equal(
      'rgb(255, 0, 0)',
    )
    expect(el.shadowRoot.querySelector('#R').value).to.equal('255')
    expect(el.shadowRoot.querySelector('#R_out').value).to.equal('255')
    expect(el.shadowRoot.querySelector('#G').value).to.equal('0')
  })
  it('prefixes a missing hash on raw input', async () => {
    const el = await fixture(html`<hex-picker></hex-picker>`)
    const input = el.shadowRoot.querySelector('input.text-input')
    const listener = oneEvent(el, 'value-changed')
    input.value = 'ff0000'
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    const e = await listener
    expect(e.detail.value).to.equal('#ff0000')
    expect(el.value).to.equal('#ff0000')
  })
  it('updates the large display when largeDisplay is on', async () => {
    const el = await fixture(html`<hex-picker large-display></hex-picker>`)
    const input = el.shadowRoot.querySelector('input.text-input')
    input.value = '#0000ff'
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    await elementUpdated(el)
    expect(
      el.shadowRoot.querySelector('.large-display').style.backgroundColor,
    ).to.equal('rgb(0, 0, 255)')
  })
})

describe('hex-picker slider behavior', () => {
  it('updates labels, channels, and input value on slider input', async () => {
    const el = await fixture(html`<hex-picker></hex-picker>`)
    const slider = el.shadowRoot.querySelector('#R')
    const listener = oneEvent(el, 'value-changed')
    slider.value = '255'
    slider.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    const e = await listener
    expect(el._rValue).to.equal(255)
    expect(el.shadowRoot.querySelector('#R_out').value).to.equal('255')
    // FIXED (haxtheweb/issues#3102 #15): _fieldSetChange now assigns
    // this.value, so the value-changed detail and the reflected value
    // attribute stay fresh after slider changes
    expect(e.detail.value).to.equal('#ff0000ff')
    expect(el.value).to.equal('#ff0000ff')
    expect(el.getAttribute('value')).to.equal('#ff0000ff')
    // toString(16) yields lowercase so computed hex is lowercase unlike the
    // uppercase constructor default
    expect(el.shadowRoot.querySelector('input.text-input').value).to.equal('#ff0000ff')
    expect(el.shadowRoot.querySelector('.color-square').style.backgroundColor).to.equal(
      'rgb(255, 0, 0)',
    )
  })
  it('routes each slider to its own channel', async () => {
    const el = await fixture(html`<hex-picker></hex-picker>`)
    const setSlider = (id, val) => {
      const slider = el.shadowRoot.querySelector('#' + id)
      slider.value = val
      slider.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    }
    setSlider('G', 128)
    setSlider('B', 10)
    setSlider('O', 200)
    expect(el._gValue).to.equal(128)
    expect(el._bValue).to.equal(10)
    expect(el._oValue).to.equal(200)
    expect(el.shadowRoot.querySelector('input.text-input').value).to.equal('#00800ac8')
    expect(el.shadowRoot.querySelector('#G_out').value).to.equal('128')
    expect(el.shadowRoot.querySelector('#B_out').value).to.equal('10')
    expect(el.shadowRoot.querySelector('#O_out').value).to.equal('200')
  })
  it('updates the large display from sliders', async () => {
    const el = await fixture(html`<hex-picker large-display></hex-picker>`)
    const slider = el.shadowRoot.querySelector('#R')
    slider.value = '255'
    slider.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    expect(
      el.shadowRoot.querySelector('.large-display').style.backgroundColor,
    ).to.equal('rgb(255, 0, 0)')
  })
})

describe('hex-picker property updates', () => {
  it('syncs DOM when value property is set', async () => {
    const el = await fixture(html`<hex-picker></hex-picker>`)
    el.value = '#00ff00'
    await elementUpdated(el)
    expect(el.shadowRoot.querySelector('input.text-input').value).to.equal('#00ff00')
    expect(el.shadowRoot.querySelector('.color-square').style.backgroundColor).to.equal(
      'rgb(0, 255, 0)',
    )
    expect(el.shadowRoot.querySelector('#G').value).to.equal('255')
    expect(el.shadowRoot.querySelector('#G_out').value).to.equal('255')
  })
  it('syncs the large display when value property is set', async () => {
    const el = await fixture(html`<hex-picker large-display></hex-picker>`)
    el.value = '#123456'
    await elementUpdated(el)
    expect(
      el.shadowRoot.querySelector('.large-display').style.backgroundColor,
    ).to.equal('rgb(18, 52, 86)')
  })
  it('does not resync DOM when value is falsy', async () => {
    const el = await fixture(html`<hex-picker></hex-picker>`)
    el.value = '#00ff00'
    await elementUpdated(el)
    el.value = ''
    await elementUpdated(el)
    expect(el.shadowRoot.querySelector('input.text-input').value).to.equal('#00ff00')
  })
  it('meets a11y standards', async () => {
    const el = await fixture(html`<hex-picker large-display></hex-picker>`)
    await expect(el).to.be.accessible()
  })
})
