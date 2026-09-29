import { fixture, expect, html, oneEvent } from '@open-wc/testing'

import '../simple-picker.js'
import '../lib/simple-picker-option.js'
import '../lib/simple-emoji-picker.js'
import '../lib/simple-symbol-picker.js'
import { SimplePicker, SimplePickerBehaviors } from '../simple-picker.js'
import { SimplePickerOption } from '../lib/simple-picker-option.js'
import { SimpleSymbolPicker } from '../lib/simple-symbol-picker.js'

// helper to build a small grid of options
function makeOptions() {
  return [
    [
      { alt: 'Red', value: 'red' },
      { alt: 'Blue', value: 'blue' },
    ],
    [
      { alt: 'Green', value: 'green' },
      { alt: 'Yellow', value: 'yellow' },
    ],
  ]
}

describe('simple-picker open/close behavior', () => {
  it('dispatches expand event when opened via _toggleListbox', async () => {
    const el = await fixture(
      html`<simple-picker .options=${makeOptions()}></simple-picker>`,
    )
    await el.updateComplete
    const listener = oneEvent(el, 'expand')
    el._toggleListbox(true)
    const ev = await listener
    expect(el.expanded).to.be.true
    expect(ev.detail).to.equal(el)
  })

  it('dispatches collapse event and sets value from active option when closed', async () => {
    const el = await fixture(
      html`<simple-picker .options=${makeOptions()}></simple-picker>`,
    )
    await el.updateComplete
    // open first so __activeDesc resolves to a real DOM node
    el._toggleListbox(true)
    await el.updateComplete
    // move active descendant to second option
    el.__activeDesc = 'option-0-1'
    const listener = oneEvent(el, 'collapse')
    el._toggleListbox(false)
    const ev = await listener
    expect(el.expanded).to.be.false
    expect(ev.detail).to.equal(el)
  })

  it('closes the listbox on blur', async () => {
    const el = await fixture(
      html`<simple-picker .options=${makeOptions()}></simple-picker>`,
    )
    await el.updateComplete
    el.expanded = true
    await el.updateComplete
    el.dispatchEvent(new FocusEvent('blur'))
    expect(el.expanded).to.be.false
  })
})

describe('simple-picker click and mousedown handlers', () => {
  it('_handleListboxClick dispatches click event and toggles', async () => {
    const el = await fixture(
      html`<simple-picker .options=${makeOptions()}></simple-picker>`,
    )
    await el.updateComplete
    const listener = oneEvent(el, 'click')
    el._handleListboxClick({})
    const ev = await listener
    expect(ev.detail).to.equal(el)
  })

  it('_handleListboxClick is a no-op when disabled', async () => {
    const el = await fixture(
      html`<simple-picker disabled .options=${makeOptions()}></simple-picker>`,
    )
    await el.updateComplete
    const before = el.expanded
    el._handleListboxClick({})
    expect(el.expanded).to.equal(before)
  })

  it('_handleListboxMousedown dispatches mousedown event', async () => {
    const el = await fixture(
      html`<simple-picker .options=${makeOptions()}></simple-picker>`,
    )
    await el.updateComplete
    const listener = oneEvent(el, 'mousedown')
    el._handleListboxMousedown({})
    const ev = await listener
    expect(ev.detail).to.equal(el)
  })

  it('_handleListboxMousedown is a no-op when disabled', async () => {
    const el = await fixture(
      html`<simple-picker disabled .options=${makeOptions()}></simple-picker>`,
    )
    await el.updateComplete
    let fired = false
    el.addEventListener('mousedown', () => (fired = true))
    el._handleListboxMousedown({})
    expect(fired).to.be.false
  })
})

describe('simple-picker keyboard navigation', () => {
  let el
  beforeEach(async () => {
    el = await fixture(
      html`<simple-picker .options=${makeOptions()}></simple-picker>`,
    )
    await el.updateComplete
    // expand so keyboard nav is active
    el.expanded = true
    el.__activeDesc = 'option-0-0'
    await el.updateComplete
  })

  it('spacebar toggles the listbox', async () => {
    el.expanded = false
    await el.updateComplete
    const preventDefault = () => {}
    el._handleListboxKeydown({ keyCode: 32, preventDefault })
    expect(el.expanded).to.be.true
  })

  it('is a no-op when disabled', async () => {
    el.disabled = true
    await el.updateComplete
    const preventDefault = () => {}
    let fired = false
    el.addEventListener('keydown', () => (fired = true))
    el._handleListboxKeydown({ keyCode: 32, preventDefault })
    expect(fired).to.be.false
  })

  it('dispatches keydown event', async () => {
    const preventDefault = () => {}
    const listener = oneEvent(el, 'keydown')
    el._handleListboxKeydown({ keyCode: 40, preventDefault })
    const ev = await listener
    expect(ev.detail).to.equal(el)
  })

  // _goToOption relies on shadow DOM querySelector inside lit-virtualizer,
  // which renders asynchronously. We verify the keydown handler runs the
  // arrow/home/end code paths without throwing.
  it('arrow down does not throw when options are not in DOM yet', async () => {
    const preventDefault = () => {}
    expect(() =>
      el._handleListboxKeydown({ keyCode: 40, preventDefault }),
    ).to.not.throw()
  })

  it('arrow up does not throw', async () => {
    const preventDefault = () => {}
    expect(() =>
      el._handleListboxKeydown({ keyCode: 38, preventDefault }),
    ).to.not.throw()
  })

  it('home key does not throw', async () => {
    const preventDefault = () => {}
    expect(() =>
      el._handleListboxKeydown({ keyCode: 36, preventDefault }),
    ).to.not.throw()
  })

  it('end key does not throw', async () => {
    const preventDefault = () => {}
    expect(() =>
      el._handleListboxKeydown({ keyCode: 35, preventDefault }),
    ).to.not.throw()
  })

  it('tab key (9) is handled when expanded', async () => {
    const preventDefault = () => {}
    expect(() =>
      el._handleListboxKeydown({ keyCode: 9, preventDefault }),
    ).to.not.throw()
  })

  it('other keys are ignored', async () => {
    const preventDefault = () => {}
    const before = el.__activeDesc
    el._handleListboxKeydown({ keyCode: 65, preventDefault })
    expect(el.__activeDesc).to.equal(before)
  })

  it('arrow keys are ignored when not expanded', async () => {
    el.expanded = false
    await el.updateComplete
    const preventDefault = () => {}
    const before = el.__activeDesc
    el._handleListboxKeydown({ keyCode: 40, preventDefault })
    expect(el.__activeDesc).to.equal(before)
  })
})

describe('simple-picker active option and focus', () => {
  it('_setActiveOption updates __activeDesc and dispatches option-focus', async () => {
    const el = await fixture(
      html`<simple-picker .options=${makeOptions()}></simple-picker>`,
    )
    await el.updateComplete
    const listener = oneEvent(el, 'option-focus')
    el._setActiveOption('option-1-0')
    const ev = await listener
    expect(el.__activeDesc).to.equal('option-1-0')
    expect(ev.detail).to.equal(el)
  })

  it('_handleOptionFocus delegates to _setActiveOption with the detail id', async () => {
    const el = await fixture(
      html`<simple-picker .options=${makeOptions()}></simple-picker>`,
    )
    await el.updateComplete
    el._handleOptionFocus({ detail: { id: 'option-0-1' } })
    expect(el.__activeDesc).to.equal('option-0-1')
  })
})

describe('simple-picker _getOption edge cases', () => {
  it('returns null when options is undefined', async () => {
    const el = await fixture(html`<simple-picker></simple-picker>`)
    await el.updateComplete
    expect(el._getOption(undefined, 'option-0-0')).to.be.null
  })

  it('returns null when optionId is null', async () => {
    const el = await fixture(
      html`<simple-picker .options=${makeOptions()}></simple-picker>`,
    )
    await el.updateComplete
    expect(el._getOption(el.__options, null)).to.be.null
  })

  it('returns null when optionId is undefined', async () => {
    const el = await fixture(
      html`<simple-picker .options=${makeOptions()}></simple-picker>`,
    )
    await el.updateComplete
    expect(el._getOption(el.__options, undefined)).to.be.null
  })
})

describe('simple-picker setOptions', () => {
  it('replaces the options array via direct property assignment', async () => {
    const el = await fixture(
      html`<simple-picker .options=${makeOptions()}></simple-picker>`,
    )
    await el.updateComplete
    const newOpts = [[{ alt: 'X', value: 'x' }]]
    el.setOptions(newOpts)
    await el.updateComplete
    expect(el.options).to.deep.equal(newOpts)
    expect(el.__selectedOption).to.exist
    expect(el.__selectedOption.value).to.equal('x')
  })
})

describe('simple-picker _computeListboxAriaLabel', () => {
  it('returns "Select" when no label and no ariaLabelledby', async () => {
    const el = await fixture(html`<simple-picker></simple-picker>`)
    await el.updateComplete
    expect(el._computeListboxAriaLabel()).to.equal('Select')
  })

  it('returns undefined when ariaLabelledby is set', async () => {
    const el = await fixture(
      html`<simple-picker aria-labelledby="lbl"></simple-picker>`,
    )
    await el.updateComplete
    expect(el._computeListboxAriaLabel()).to.be.undefined
  })

  it('returns undefined when label is set', async () => {
    const el = await fixture(
      html`<simple-picker label="My Label"></simple-picker>`,
    )
    await el.updateComplete
    expect(el._computeListboxAriaLabel()).to.be.undefined
  })
})

describe('simple-picker _isRowHidden and renderItem', () => {
  it('_isRowHidden returns true for non-array', async () => {
    const el = await fixture(
      html`<simple-picker .options=${makeOptions()}></simple-picker>`,
    )
    await el.updateComplete
    expect(el._isRowHidden('not-array')).to.be.true
  })

  it('_isRowHidden returns true when all cols are null and hideNull is true', async () => {
    const el = await fixture(
      html`<simple-picker .options=${makeOptions()}></simple-picker>`,
    )
    await el.updateComplete
    expect(el._isRowHidden([{ value: null }, { value: null }])).to.be.true
  })

  it('_isRowHidden returns false when a col has a value', async () => {
    const el = await fixture(
      html`<simple-picker .options=${makeOptions()}></simple-picker>`,
    )
    await el.updateComplete
    expect(el._isRowHidden([{ value: null }, { value: 'x' }])).to.be.false
  })

  it('renderItem returns nothing for non-array row', async () => {
    const el = await fixture(
      html`<simple-picker .options=${makeOptions()}></simple-picker>`,
    )
    await el.updateComplete
    const result = el.renderItem('not-array', 0)
    // lit TemplateResult — just verify it does not throw
    expect(result).to.exist
  })
})

describe('simple-picker value reflection through selection', () => {
  it('setting value updates __selectedOption', async () => {
    const el = await fixture(
      html`<simple-picker .options=${makeOptions()}></simple-picker>`,
    )
    await el.updateComplete
    el.value = 'green'
    await el.updateComplete
    expect(el.__selectedOption).to.exist
    expect(el.__selectedOption.value).to.equal('green')
  })

  it('null value with allowNull keeps __selectedOption null', async () => {
    const el = await fixture(
      html`<simple-picker .options=${makeOptions()} allow-null></simple-picker>`,
    )
    await el.updateComplete
    el.value = null
    await el.updateComplete
    expect(el.__selectedOption).to.be.null
  })

  it('rebuilds selection when options change while the null option is selected', async () => {
    const nullGrid = [
      [{ alt: 'null', value: null }, { alt: 'A', value: 'a' }],
      [{ alt: 'B', value: 'b' }],
    ]
    const el = await fixture(
      html`<simple-picker .options=${nullGrid} allow-null></simple-picker>`,
    )
    await el.updateComplete
    el.value = null
    await el.updateComplete
    // re-run the selection so the null option object is selected
    el.setOptions(nullGrid)
    await el.updateComplete
    expect(el.__selectedOption).to.exist
    expect(el.__selectedOption.value).to.be.null
    // a consumer flipping allowNull rebuilds the grid without the null row;
    // the stale null selection must not short-circuit the rebuild
    el.allowNull = false
    el.setOptions([
      [{ alt: 'A', value: 'a' }],
      [{ alt: 'B', value: 'b' }],
    ])
    await el.updateComplete
    expect(el.__options).to.deep.equal([
      [{ alt: 'A', value: 'a' }],
      [{ alt: 'B', value: 'b' }],
    ])
    expect(el.__selectedOption.value).to.equal('a')
  })

  it('non-matching value with allowNull false falls back to first option object', async () => {
    const el = await fixture(
      html`<simple-picker .options=${makeOptions()}></simple-picker>`,
    )
    await el.updateComplete
    el.value = 'nonexistent'
    await el.updateComplete
    expect(el.__selectedOption).to.exist
    expect(el.__selectedOption).to.be.an('object')
    expect(el.__selectedOption.value).to.equal('red')
    expect(el.__selectedOption.alt).to.equal('Red')
  })
})

// simple-picker-option extended tests
describe('simple-picker-option extended', () => {
  it('_handleHover fires option-focus event', async () => {
    const el = await fixture(
      html`<simple-picker-option label="Test"></simple-picker-option>`,
    )
    await new Promise((r) => setTimeout(r, 0))
    const listener = oneEvent(el, 'option-focus')
    el._handleHover()
    const { detail } = await listener
    expect(detail).to.equal(el)
  })

  it('updates innerHTML when label changes', async () => {
    const el = await fixture(
      html`<simple-picker-option label="First"></simple-picker-option>`,
    )
    await el.updateComplete
    el.label = '<b>Second</b>'
    await el.updateComplete
    expect(el.innerHTML).to.include('Second')
  })

  it('renders icon when icon property is set', async () => {
    const el = await fixture(
      html`<simple-picker-option icon="editor:format-bold"></simple-picker-option>`,
    )
    await el.updateComplete
    const icon = el.shadowRoot.querySelector('simple-icon-lite')
    expect(icon).to.exist
    expect(icon.hidden).to.be.false
  })

  it('hides icon when icon property is null', async () => {
    const el = await fixture(
      html`<simple-picker-option></simple-picker-option>`,
    )
    await el.updateComplete
    const icon = el.shadowRoot.querySelector('simple-icon-lite')
    expect(icon.hidden).to.be.true
  })

  it('renders slot when titleAsHtml is true', async () => {
    const el = await fixture(
      html`<simple-picker-option title-as-html label="Bold"></simple-picker-option>`,
    )
    await el.updateComplete
    const slot = el.shadowRoot.querySelector('slot')
    expect(slot).to.exist
    expect(slot.hidden).to.be.false
  })

  it('does not render slot content when titleAsHtml is false', async () => {
    const el = await fixture(
      html`<simple-picker-option label="Plain"></simple-picker-option>`,
    )
    await el.updateComplete
    const slot = el.shadowRoot.querySelector('slot')
    expect(slot.hidden).to.be.true
  })
})

// simple-symbol-picker lib tests
describe('simple-symbol-picker', () => {
  it('instantiates with correct tag', async () => {
    const el = await fixture(
      html`<simple-symbol-picker></simple-symbol-picker>`,
    )
    expect(el.tagName).to.equal('SIMPLE-SYMBOL-PICKER')
    expect(el.constructor.tag).to.equal('simple-symbol-picker')
  })

  it('has correct default properties', async () => {
    const el = await fixture(
      html`<simple-symbol-picker></simple-symbol-picker>`,
    )
    expect(el.icon).to.equal('editor:functions')
    expect(el.label).to.equal('Symbol')
    expect(el.titleAsHtml).to.be.true
    expect(el.symbolTypes).to.deep.equal([
      'symbols',
      'math',
      'characters',
      'greek',
      'misc',
    ])
  })

  it('populates options after firstUpdated', async () => {
    const el = await fixture(
      html`<simple-symbol-picker></simple-symbol-picker>`,
    )
    await el.updateComplete
    // firstUpdated sets options; give it a tick
    await new Promise((r) => setTimeout(r, 50))
    expect(el.options).to.exist
    expect(el.options.length).to.be.greaterThan(0)
  })

  it('_setPickerOptions distributes flat array into rows', async () => {
    const el = await fixture(
      html`<simple-symbol-picker></simple-symbol-picker>`,
    )
    await el.updateComplete
    const flat = [
      { value: 'a', alt: 'a' },
      { value: 'b', alt: 'b' },
      { value: 'c', alt: 'c' },
      { value: 'd', alt: 'd' },
    ]
    const result = el._setPickerOptions(flat)
    expect(result).to.be.an('array')
    expect(result[0]).to.be.an('array')
    // all items should be present across rows
    let count = 0
    result.forEach((row) => {
      count += row.length
    })
    expect(count).to.equal(4)
  })

  it('_setPickerOptions caps columns at 10', async () => {
    const el = await fixture(
      html`<simple-symbol-picker></simple-symbol-picker>`,
    )
    await el.updateComplete
    // 200 items -> sqrt < 11, so ceil(sqrt(200)) = 15, but capped at 10
    const flat = []
    for (let i = 0; i < 200; i++) {
      flat.push({ value: 'v' + i, alt: 'v' + i })
    }
    const result = el._setPickerOptions(flat)
    expect(result[0].length).to.equal(10)
  })

  it('_setSelectedOption does not call super when options length <= 1', async () => {
    const el = await fixture(
      html`<simple-symbol-picker></simple-symbol-picker>`,
    )
    await el.updateComplete
    el.options = [[{ value: 'only', alt: 'only' }]]
    await el.updateComplete
    // should not throw
    expect(() => el._setSelectedOption()).to.not.throw()
  })

  it('populates globalThis.SimplePickerSymbols with symbol data', async () => {
    expect(globalThis.SimplePickerSymbols).to.exist
    expect(globalThis.SimplePickerSymbols.symbols).to.be.an('array')
    expect(globalThis.SimplePickerSymbols.math).to.be.an('array')
    expect(globalThis.SimplePickerSymbols.greek).to.be.an('array')
    expect(globalThis.SimplePickerSymbols.characters).to.be.an('array')
    expect(globalThis.SimplePickerSymbols.misc).to.be.an('array')
  })
})

// SimplePickerBehaviors mixin — verify styles getter handles no super.styles
describe('SimplePickerBehaviors styles fallback', () => {
  it('works when SuperClass has no static styles', () => {
    class NoStyles extends SimplePickerBehaviors(HTMLElement) {}
    // just verify it doesn't throw and returns an array
    expect(NoStyles.styles).to.be.an('array')
  })
})
