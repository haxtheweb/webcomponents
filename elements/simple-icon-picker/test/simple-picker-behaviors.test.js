import { fixture, expect, html } from '@open-wc/testing'
import { LitElement, css } from 'lit'
import { SimplePickerBehaviors } from '@haxtheweb/simple-picker/simple-picker.js'
import { SimpleIconsetStore } from '@haxtheweb/simple-icon/lib/simple-iconset.js'

// simple-icon-picker builds on simple-picker, and the package's coverage
// aggregate includes the base class, so its behaviors are exercised here
import '../simple-icon-picker.js'

/** a base with its own styles so the super.styles merge path is covered */
class TestPickerBase extends LitElement {
  static get styles() {
    return [css`:host { display: block; }`]
  }
}

class TestPicker extends SimplePickerBehaviors(TestPickerBase) {}

// constructed through the registry; the browser rejects direct
// construction of this subclass chain with new
globalThis.customElements.define('test-picker-element', TestPicker)

/** rebuilds and renders are debounced through setTimeout calls */
async function settle(el, ms = 25) {
  await el.updateComplete
  await new Promise((resolve) => setTimeout(resolve, ms))
  await el.updateComplete
}

/** a fresh test picker appended to the body */
async function makeTestPicker() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const el = document.createElement('test-picker-element')
  host.appendChild(el)
  await settle(el)
  return el
}

describe('simple-picker behaviors (simple-icon-picker dependency)', () => {
  let host

  afterEach(() => {
    if (host) host.remove()
    host = null
  })

  it('merges subclass styles and falls back to a generic aria label', async () => {
    // accessing the getter runs the super.styles merge in the base class
    expect(Array.isArray(TestPicker.styles)).to.equal(true)
    host = document.createElement('div')
    document.body.appendChild(host)
    const el = document.createElement('test-picker-element')
    host.appendChild(el)
    await settle(el)
    const listbox = el.shadowRoot.querySelector('#listbox')
    expect(listbox).to.exist
    expect(listbox.getAttribute('aria-label')).to.equal('Select')
    // with a label the fallback is suppressed in favor of aria-labelledby
    el.label = 'Choose'
    await settle(el)
    // lit renders the suppressed fallback as an empty attribute value
    expect(listbox.getAttribute('aria-label')).to.satisfy(
      (value) => value === '' || value === null,
    )
    expect(listbox.getAttribute('aria-labelledby')).to.equal('listLabel')
    expect(el.shadowRoot.querySelector('label').textContent.trim()).to.equal(
      'Choose',
    )
  })

  it('setOptions replaces the option grid and _getOption reads it back', async () => {
    const el = await makeTestPicker()
    el.setOptions([
      [{ alt: 'A', value: 'a' }],
      [
        { alt: 'B', value: 'b' },
        { alt: 'C', value: 'c' },
      ],
    ])
    await settle(el)
    expect(el.options[1][0].value).to.equal('b')
    expect(el._getOption(el.options, 'option-1-0')).to.equal(el.options[1][0])
    expect(el._getOption(undefined, 'option-1-0')).to.equal(null)
    expect(el._getOption(el.options, null)).to.equal(null)
  })

  it('_handleOptionFocus tracks the active descendant', async () => {
    const el = await makeTestPicker()
    el.setOptions([[{ alt: 'A', value: 'a' }], [{ alt: 'B', value: 'b' }]])
    await settle(el)
    const events = []
    const onFocus = (e) => events.push(e.detail)
    el.addEventListener('option-focus', onFocus)
    try {
      el._handleOptionFocus({ detail: { id: 'option-1-0' } })
      expect(el.__activeDesc).to.equal('option-1-0')
      expect(events.length).to.equal(1)
      expect(events[0]).to.equal(el)
    } finally {
      el.removeEventListener('option-focus', onFocus)
    }
  })

  it('fires changed after every update', async () => {
    const el = await makeTestPicker()
    const events = []
    const onChanged = (e) => events.push(e.detail)
    el.addEventListener('changed', onChanged)
    try {
      el.label = 'Pick'
      await settle(el)
      expect(events.length).to.be.at.least(1)
      expect(events[0]).to.equal(el)
    } finally {
      el.removeEventListener('changed', onChanged)
    }
  })

  it('disconnects without error', async () => {
    const el = await makeTestPicker()
    el.remove()
    expect(el.isConnected).to.equal(false)
  })
})

describe('simple-picker interactive listbox (via simple-icon-picker)', () => {
  let el
  let listbox

  async function settle(ms = 25) {
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, ms))
    await el.updateComplete
  }

  function keydown(keyCode) {
    el._handleListboxKeydown({ keyCode, preventDefault() {} })
  }

  beforeEach(async () => {
    el = await fixture(html`<simple-icon-picker></simple-icon-picker>`)
    el.optionsPerRow = 2
    el.icons = SimpleIconsetStore.iconlist.slice(0, 8)
    await settle(50)
    listbox = el.shadowRoot.querySelector('#listbox')
  })

  it('expands on listbox click and renders the option rows', async () => {
    const clicks = []
    const expands = []
    el.addEventListener('click', (e) => clicks.push(e))
    el.addEventListener('expand', (e) => expands.push(e.detail))
    listbox.dispatchEvent(new Event('click'))
    await settle(200)
    expect(el.expanded).to.equal(true)
    expect(clicks.length).to.be.at.least(1)
    expect(expands.length).to.be.at.least(1)
    const virtualizer = el.shadowRoot.querySelector('lit-virtualizer')
    expect(virtualizer).to.exist
    expect(virtualizer.querySelectorAll('.row').length).to.be.at.least(1)
    expect(
      virtualizer.querySelectorAll('simple-picker-option').length,
    ).to.be.at.least(4)
  })

  it('re-dispatches mousedown from the listbox', async () => {
    const mousedowns = []
    el.addEventListener('mousedown', (e) => mousedowns.push(e.detail))
    listbox.dispatchEvent(new Event('mousedown'))
    expect(mousedowns.length).to.equal(1)
    expect(mousedowns[0]).to.equal(el)
  })

  it('ignores interaction while disabled', async () => {
    const clicks = []
    el.addEventListener('click', (e) => clicks.push(e))
    el.disabled = true
    await settle()
    el._handleListboxClick({})
    el._handleListboxMousedown({})
    keydown(32)
    await settle()
    expect(clicks.length).to.equal(0)
    expect(el.expanded).to.equal(false)
  })

  it('navigates the grid with the keyboard and commits with spacebar', async () => {
    const collapses = []
    el.addEventListener('collapse', (e) => collapses.push(e.detail))
    listbox.dispatchEvent(new Event('click'))
    await settle(200)
    expect(el.expanded).to.equal(true)
    expect(el.__activeDesc).to.equal('option-0-0')

    // down moves within the first row (past the null option)
    keydown(40)
    await settle()
    expect(el.__activeDesc).to.equal('option-0-1')

    // down at the end of the row moves to the start of the next row
    keydown(40)
    await settle()
    expect(el.__activeDesc).to.equal('option-1-0')

    // up from the start of a row moves to the end of the previous row
    keydown(38)
    await settle()
    expect(el.__activeDesc).to.equal('option-0-1')

    // up within the row
    keydown(38)
    await settle()
    expect(el.__activeDesc).to.equal('option-0-0')

    // end jumps to the last option of the last row
    keydown(35)
    await settle()
    expect(el.__activeDesc).to.equal(`option-${el.options.length - 1}-0`)

    // home jumps back to the first option
    keydown(36)
    await settle()
    expect(el.__activeDesc).to.equal('option-0-0')

    // hovering an option also tracks the active descendant
    const option = el.shadowRoot.querySelector('#option-1-0')
    expect(option).to.exist
    option.dispatchEvent(new Event('mouseover'))
    await settle()
    expect(el.__activeDesc).to.equal('option-1-0')

    // spacebar collapses the listbox and commits the active value
    keydown(32)
    await settle()
    expect(el.expanded).to.equal(false)
    expect(collapses.length).to.be.at.least(1)
    expect(el.value).to.equal(SimpleIconsetStore.iconlist[1])

    // a bare tab key does not toggle anything
    keydown(9)
    await settle()
    expect(el.expanded).to.equal(false)
  })

  it('rebuilds selection when allowNull flips and the value is null', async () => {
    // fixed in simple-picker.js _optionsChanged: the stale selection is
    // dropped before rebuilding, so the early return in _setSelectedOption
    // can never keep the selection pointing at the removed null entry after
    // allowNull flips while the value is null
    el.allowNull = false
    await settle(50)
    // the public options no longer contain a null option
    expect(el.options.flat().some((o) => o.value === null)).to.equal(false)
    // and the selection state was rebuilt against the new grid
    expect(el.__selectedOption).to.not.deep.equal({ alt: 'null', value: null })
    expect(el.__selectedOption).to.deep.equal(el.options[0][0])
    expect(el.__options).to.deep.equal(el.options)
  })
})
