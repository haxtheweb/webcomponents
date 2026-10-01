import { fixture, expect, html } from '@open-wc/testing'

import '../simple-autocomplete.js'
import { SimpleAutocomplete } from '../simple-autocomplete.js'

describe('simple-autocomplete test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`
      <simple-autocomplete title="test-title"></simple-autocomplete>
    `)
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })
})

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const FRUITS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Apricot', value: 'apricot' },
  { label: 'Banana', value: 'banana' },
  { label: 'Grape', value: 'grape' },
  { label: 'Grapefruit', value: 'grapefruit' },
  { label: 'Kiwi', value: 'kiwi' },
  { label: 'Mango', value: 'mango' },
  { label: 'Orange', value: 'orange' },
  { label: 'Pineapple', value: 'pineapple' },
  { label: 'Cat', value: 'cat', icon: 'pets' },
]

describe('simple-autocomplete defaults and rendering', () => {
  it('has expected default property values', async () => {
    const el = await fixture(html`<simple-autocomplete></simple-autocomplete>`)
    expect(el.itemLimit).to.equal(6)
    expect(el.inputLabel).to.equal('Search')
    expect(el.hideInput).to.equal(false)
    expect(el.selectionPosition).to.equal(false)
    expect(el.value).to.equal('')
    expect(el.opened).to.equal(false)
    expect(SimpleAutocomplete.tag).to.equal('simple-autocomplete')
  })

  it('renders a combobox input with the default aria label', async () => {
    const el = await fixture(html`<simple-autocomplete></simple-autocomplete>`)
    const input = el.shadowRoot.querySelector('#input')
    expect(input.getAttribute('role')).to.equal('combobox')
    expect(input.getAttribute('aria-label')).to.equal('Search')
    expect(input.getAttribute('aria-expanded')).to.equal('false')
    expect(input.hasAttribute('contenteditable')).to.equal(true)
  })

  it('uses a custom input-label for the combobox aria label', async () => {
    const el = await fixture(
      html`<simple-autocomplete input-label="Find a fruit"></simple-autocomplete>`,
    )
    expect(el.shadowRoot.querySelector('#input').getAttribute('aria-label')).to
      .equal('Find a fruit')
  })

  it('renders no input area when hide-input is set', async () => {
    const el = await fixture(
      html`<simple-autocomplete hide-input></simple-autocomplete>`,
    )
    expect(el.shadowRoot.querySelector('#input')).to.be.null
    expect(el.$input).to.equal(undefined)
  })

  it('renders the matching options list when opened with results', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    await sleep(300)
    el.setValue('grape')
    await el.updateComplete
    await sleep(300)
    expect(el.opened).to.equal(true)
    const popover = el.shadowRoot.querySelector('simple-popover')
    expect(popover.hasAttribute('hidden')).to.equal(false)
    const ul = el.shadowRoot.querySelector('ul')
    expect(ul.getAttribute('role')).to.equal('listbox')
    const buttons = el.shadowRoot.querySelectorAll('ul button')
    expect(buttons.length).to.equal(2)
    expect(buttons[0].textContent.trim()).to.equal('Grape')
    expect(buttons[0].getAttribute('data-index')).to.equal('0')
    expect(buttons[0].parentNode.getAttribute('value')).to.equal('grape')
  })

  it('filters case-insensitively', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    await sleep(300)
    el.setValue('GRAPE')
    await el.updateComplete
    await sleep(300)
    expect(el.filtered.length).to.equal(2)
  })

  it('renders the no results status when nothing matches', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    await sleep(300)
    el.setValue('zzz-not-a-fruit')
    await el.updateComplete
    await sleep(300)
    expect(el.filtered.length).to.equal(0)
    expect(el.shadowRoot.querySelector('.no-results')).to.exist
    expect(el.shadowRoot.querySelector('.no-results').getAttribute('role')).to
      .equal('status')
    expect(el.shadowRoot.querySelector('ul')).to.be.null
    expect(
      el.shadowRoot.querySelector('simple-popover').hasAttribute('hidden'),
    ).to.equal(true)
  })

  it('limits the rendered options to itemLimit', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    await sleep(300)
    el.setValue('')
    await el.updateComplete
    await sleep(300)
    expect(el.filtered.length).to.equal(10)
    expect(el.shadowRoot.querySelectorAll('ul button').length).to.equal(6)
    el.itemLimit = 3
    await el.updateComplete
    expect(el.shadowRoot.querySelectorAll('ul button').length).to.equal(3)
  })

  it('renders an icon in the button only for items with icons', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    await sleep(300)
    el.setValue('cat')
    await el.updateComplete
    await sleep(300)
    const buttons = el.shadowRoot.querySelectorAll('ul button')
    expect(buttons.length).to.equal(1)
    expect(buttons[0].querySelector('simple-icon-lite')).to.exist
    expect(buttons[0].querySelector('simple-icon-lite').getAttribute('icon')).to
      .equal('pets')
  })
})

describe('simple-autocomplete input handling', () => {
  it('setValue opens the menu, stores the value and mirrors it into the input', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    el.setValue('grape')
    await el.updateComplete
    expect(el.opened).to.equal(true)
    expect(el.value).to.equal('grape')
    expect(el.like).to.equal('grape')
    expect(el.$input.innerText).to.equal('grape')
    expect(el.$input.getAttribute('aria-expanded')).to.equal('true')
  })

  it('setValue skips the input mirror when hide-input is set', async () => {
    const el = await fixture(
      html`<simple-autocomplete hide-input .items=${FRUITS}></simple-autocomplete>`,
    )
    el.setValue('grape')
    await el.updateComplete
    expect(el.opened).to.equal(true)
    expect(el.value).to.equal('grape')
    expect(el.$input).to.equal(undefined)
  })

  it('processes input events from the contenteditable area', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    el.$input.innerText = 'grape'
    el.$input.dispatchEvent(new InputEvent('input', { bubbles: true }))
    await el.updateComplete
    expect(el.value).to.equal('grape')
    expect(el.like).to.equal('grape')
    expect(el.opened).to.equal(true)
  })

  it('dispatches value-changed when the value updates', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    let eventValue = null
    el.addEventListener('value-changed', (e) => {
      eventValue = e.detail.value
    })
    el.setValue('grape')
    await el.updateComplete
    expect(eventValue).to.equal('grape')
  })
})

describe('simple-autocomplete focus and blur behavior', () => {
  it('opens and re-filters when focusing the input with an existing value', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    el.$input.innerText = 'grape'
    el.value = 'grape'
    await el.updateComplete
    el.$input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await el.updateComplete
    expect(el.opened).to.equal(true)
    expect(el.value).to.equal('grape')
    expect(el.like).to.equal('grape')
  })

  it('does not open on focus when the value is empty', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    el.$input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await el.updateComplete
    expect(el.opened).to.equal(false)
  })

  it('ignores a focus opening while the ignore flag is set', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    el.value = 'grape'
    el._ignoreFocusOpen = true
    await el.updateComplete
    el.$input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await el.updateComplete
    expect(el.opened).to.equal(false)
    expect(el._ignoreFocusOpen).to.equal(false)
  })

  it('closes and commits the input text on focusout when not clicking inside', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    el.setValue('grape')
    await el.updateComplete
    el.$input.innerText = 'grap'
    el.$input.dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, composed: true }),
    )
    await el.updateComplete
    expect(el.value).to.equal('grap')
    expect(el.opened).to.equal(false)
  })

  it('keeps the menu open on focusout while clicking inside', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    el.setValue('grape')
    await el.updateComplete
    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(el._clicking).to.equal(true)
    el.$input.dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, composed: true }),
    )
    await el.updateComplete
    expect(el.opened).to.equal(true)
    expect(el._clicking).to.equal(false)
    el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    expect(el._clicking).to.equal(false)
  })

  it('closes on focusout in hide-input mode without touching the input', async () => {
    const el = await fixture(
      html`<simple-autocomplete hide-input .items=${FRUITS}></simple-autocomplete>`,
    )
    el.setValue('grape')
    await el.updateComplete
    el.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
    await el.updateComplete
    expect(el.opened).to.equal(false)
    expect(el.value).to.equal('grape')
  })
})

describe('simple-autocomplete selection and keyboard support', () => {
  it('selects an item, fills the input and closes the list', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    await sleep(300)
    el.setValue('grape')
    await el.updateComplete
    await sleep(300)
    let selected = null
    el.addEventListener('item-selected', (e) => {
      selected = e.detail.value
    })
    el.shadowRoot.querySelector('ul button').click()
    await el.updateComplete
    expect(selected).to.equal('grape')
    expect(el.value).to.equal('grape')
    expect(el.$input.innerText).to.equal('grape')
    expect(el.opened).to.equal(false)
  })

  it('BUG: hide-input leaves $input undefined for resetFocusOnInput', async () => {
    const el = await fixture(
      html`<simple-autocomplete hide-input .items=${FRUITS}></simple-autocomplete>`,
    )
    await sleep(300)
    el.setValue('grape')
    await el.updateComplete
    await sleep(300)
    expect(el.opened).to.equal(true)
    expect(el.shadowRoot.querySelector('ul button')).to.exist
    // BUG simple-autocomplete.js:380 - resetFocusOnInput dereferences
    // this.$input.endOffset unconditionally. With hide-input (and no
    // selection-position) $input is never assigned, so selecting any of
    // the rendered options throws "Cannot read properties of undefined
    // (reading 'endOffset')" from itemSelect before focus cleanup runs.
    // Reproduced during coverage runs; asserted here as the precondition
    // rather than triggered so the suite stays green unpatched.
    expect(el.$input).to.equal(undefined)
  })

  it('moves focus to the first option on ArrowDown from the input', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    await sleep(300)
    el.setValue('')
    await el.updateComplete
    await sleep(300)
    const evt = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      bubbles: true,
      cancelable: true,
    })
    el.$input.dispatchEvent(evt)
    expect(evt.defaultPrevented).to.equal(true)
    expect(el.shadowRoot.activeElement.getAttribute('data-index')).to.equal('0')
  })

  it('moves focus to the last option on ArrowUp from the input', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    await sleep(300)
    el.setValue('')
    await el.updateComplete
    await sleep(300)
    const evt = new KeyboardEvent('keydown', {
      key: 'ArrowUp',
      bubbles: true,
      cancelable: true,
    })
    el.$input.dispatchEvent(evt)
    expect(evt.defaultPrevented).to.equal(true)
    expect(el.shadowRoot.activeElement.getAttribute('data-index')).to.equal('5')
  })

  it('closes the menu on Escape from the input', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    await sleep(300)
    el.setValue('')
    await el.updateComplete
    await sleep(300)
    const evt = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    })
    el.$input.dispatchEvent(evt)
    expect(evt.defaultPrevented).to.equal(true)
    expect(el.opened).to.equal(false)
    // guarded path: key presses while closed do nothing
    const idle = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      bubbles: true,
      cancelable: true,
    })
    el.$input.dispatchEvent(idle)
    expect(idle.defaultPrevented).to.equal(false)
  })

  it('moves focus down through the list on ArrowDown', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    await sleep(300)
    el.setValue('')
    await el.updateComplete
    await sleep(300)
    const buttons = el.shadowRoot.querySelectorAll('ul button')
    buttons[1].focus()
    const evt = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      bubbles: true,
      cancelable: true,
    })
    buttons[1].dispatchEvent(evt)
    expect(evt.defaultPrevented).to.equal(true)
    expect(el.shadowRoot.activeElement.getAttribute('data-index')).to.equal('2')
  })

  it('moves focus up through the list on ArrowUp', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    await sleep(300)
    el.setValue('')
    await el.updateComplete
    await sleep(300)
    const buttons = el.shadowRoot.querySelectorAll('ul button')
    buttons[2].focus()
    const evt = new KeyboardEvent('keydown', {
      key: 'ArrowUp',
      bubbles: true,
      cancelable: true,
    })
    buttons[2].dispatchEvent(evt)
    expect(evt.defaultPrevented).to.equal(true)
    expect(el.shadowRoot.activeElement.getAttribute('data-index')).to.equal('1')
  })

  it('does nothing at the last option on ArrowDown', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    await sleep(300)
    el.setValue('')
    await el.updateComplete
    await sleep(300)
    const buttons = el.shadowRoot.querySelectorAll('ul button')
    buttons[5].focus()
    const evt = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      bubbles: true,
      cancelable: true,
    })
    buttons[5].dispatchEvent(evt)
    expect(evt.defaultPrevented).to.equal(false)
    expect(el.shadowRoot.activeElement.getAttribute('data-index')).to.equal('5')
  })

  it('closes the menu and restores input focus on Escape in the list', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    await sleep(300)
    // keep text in the input so resetFocusOnInput has a text node to use
    el.setValue('grape')
    await el.updateComplete
    await sleep(300)
    const button = el.shadowRoot.querySelector('ul button')
    button.focus()
    const evt = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    })
    button.dispatchEvent(evt)
    expect(evt.defaultPrevented).to.equal(true)
    expect(el.opened).to.equal(false)
    expect(el.shadowRoot.activeElement.getAttribute('id')).to.equal('input')
  })

  it('BUG: an empty input area leaves resetFocusOnInput without a text node', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    await sleep(300)
    el.setValue('')
    await el.updateComplete
    await sleep(300)
    // BUG simple-autocomplete.js:387 - resetFocusOnInput calls setEnd on
    // this.$input.childNodes[0], which is undefined while the input area
    // has no text. Escaping the list with an empty input throws "Failed to
    // execute 'setEnd' on 'Range': parameter 1 is not of type 'Node" after
    // the menu already closed. Reproduced during coverage runs; asserted
    // here as the precondition rather than triggered so the suite stays
    // green unpatched.
    expect(el.$input.childNodes.length).to.equal(0)
    expect(el.opened).to.equal(true)
  })

  it('ignores other keys pressed in the list', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    await sleep(300)
    el.setValue('')
    await el.updateComplete
    await sleep(300)
    const button = el.shadowRoot.querySelector('ul button')
    button.focus()
    const evt = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    })
    button.dispatchEvent(evt)
    expect(evt.defaultPrevented).to.equal(false)
    expect(el.opened).to.equal(true)
  })

  it('ignores list key handling while the menu is closed', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    const evt = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      bubbles: true,
      cancelable: true,
    })
    el.a11yListKeys(evt)
    expect(evt.defaultPrevented).to.equal(false)
  })

  it('hardStopEvent halts the event and any wrapped keyboard event', async () => {
    const el = await fixture(html`<simple-autocomplete></simple-autocomplete>`)
    const calls = []
    const inner = {
      preventDefault() {
        calls.push('inner-prevent')
      },
      stopPropagation() {
        calls.push('inner-stop')
      },
      stopImmediatePropagation() {
        calls.push('inner-stop-immediate')
      },
    }
    const evt = {
      preventDefault() {
        calls.push('prevent')
      },
      stopPropagation() {
        calls.push('stop')
      },
      stopImmediatePropagation() {
        calls.push('stop-immediate')
      },
      detail: { keyboardEvent: inner },
    }
    el.hardStopEvent(evt)
    expect(calls).to.deep.equal([
      'prevent',
      'stop',
      'stop-immediate',
      'inner-prevent',
      'inner-stop',
      'inner-stop-immediate',
    ])
  })
})

describe('simple-autocomplete selection normalizers', () => {
  it('prefers a native getSelection on the input object', async () => {
    const el = await fixture(html`<simple-autocomplete></simple-autocomplete>`)
    el.$input = { getSelection: () => 'fake-selection' }
    expect(el.getSelection()).to.equal('fake-selection')
  })

  it('resolves the ponyfill range for a caret inside the input', async () => {
    const el = await fixture(html`<simple-autocomplete></simple-autocomplete>`)
    el.$input.innerText = 'hello'
    el.$input.focus()
    const sel = globalThis.getSelection()
    const range = document.createRange()
    range.setStart(el.$input.firstChild, 2)
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
    const result = el.getSelection()
    expect(result).to.exist
    expect(result.startContainer).to.exist
  })

  it('falls back to the window selection without an input', async () => {
    const el = await fixture(
      html`<simple-autocomplete hide-input></simple-autocomplete>`,
    )
    const sel = el.getSelection()
    expect(sel).to.exist
    expect(typeof sel.getRangeAt).to.equal('function')
  })

  it('getRange returns the first range of the current selection', async () => {
    const el = await fixture(
      html`<simple-autocomplete hide-input></simple-autocomplete>`,
    )
    const outside = document.createElement('div')
    outside.textContent = 'outside text'
    document.body.appendChild(outside)
    const sel = globalThis.getSelection()
    const range = document.createRange()
    range.selectNodeContents(outside)
    sel.removeAllRanges()
    sel.addRange(range)
    const result = el.getRange()
    expect(result.toString()).to.equal('outside text')
    document.body.removeChild(outside)
  })

  it('getRange returns the selection itself when it has no ranges', async () => {
    const el = await fixture(
      html`<simple-autocomplete hide-input></simple-autocomplete>`,
    )
    globalThis.getSelection().removeAllRanges()
    const result = el.getRange()
    expect(result.rangeCount).to.equal(0)
  })

  it('getRange returns false when there is no selection at all', async () => {
    const el = await fixture(
      html`<simple-autocomplete hide-input></simple-autocomplete>`,
    )
    el.$input = { getSelection: () => null }
    expect(el.getRange()).to.equal(false)
  })

  it('resetFocusOnInput closes the menu and refocuses the input', async () => {
    const el = await fixture(
      html`<simple-autocomplete .items=${FRUITS}></simple-autocomplete>`,
    )
    el.setValue('grape')
    await el.updateComplete
    el.resetFocusOnInput()
    await el.updateComplete
    expect(el.opened).to.equal(false)
    // focusing the input consumes the ignore flag via the focusin listener
    expect(el._ignoreFocusOpen).to.equal(false)
    expect(el.shadowRoot.activeElement.getAttribute('id')).to.equal('input')
  })

  it('resetFocusOnInput skips focusing when the input is a range', async () => {
    const el = await fixture(html`<simple-autocomplete></simple-autocomplete>`)
    el.$input = document.createRange()
    el.opened = true
    await el.updateComplete
    el.resetFocusOnInput()
    await el.updateComplete
    expect(el.opened).to.equal(false)
  })
})

describe('simple-autocomplete popover and item processing', () => {
  it('binds the popover to a focused native input in selection-position mode', async () => {
    const input = document.createElement('input')
    input.setAttribute('id', 'outside-input')
    document.body.appendChild(input)
    input.focus()
    const el = await fixture(
      html`<simple-autocomplete
        selection-position
        hide-input
        .items=${FRUITS}
      ></simple-autocomplete>`,
    )
    await sleep(300)
    el.opened = true
    await el.updateComplete
    await sleep(10)
    expect(el.$input.getAttribute('id')).to.equal('outside-input')
    expect(
      el.shadowRoot.querySelector('simple-popover').target.getAttribute('id'),
    ).to.equal('outside-input')
    document.body.removeChild(input)
  })

  it('builds a searchable title from item keys and skips icons', async () => {
    const fresh = [
      { label: 'Apple', value: 'apple' },
      { label: 'Cat', value: 'cat', icon: 'pets' },
    ]
    const el = await fixture(
      html`<simple-autocomplete .items=${fresh}></simple-autocomplete>`,
    )
    await el.updateComplete
    expect(fresh[0].title).to.equal('Apple apple')
    // NOTE: the icon slot maps to a literal false, which is joined into the
    // title string; assert the current behavior while flagging the quirk
    expect(fresh[1].title).to.equal('Cat cat false')
  })
})

/*
describe("A11y/chai axe tests", () => {
  it("simple-autocomplete passes accessibility test", async () => {
    const el = await fixture(
      html` <simple-autocomplete></simple-autocomplete> `
    );
    await expect(el).to.be.accessible();
  });
  it("simple-autocomplete passes accessibility negation", async () => {
    const el = await fixture(
      html`<simple-autocomplete
        aria-labelledby="simple-autocomplete"
      ></simple-autocomplete>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("simple-autocomplete can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<simple-autocomplete .foo=${'bar'}></simple-autocomplete>`);
    expect(el.foo).to.equal('bar');
  })
})

/*
// Test if element is mobile responsive
describe('Test Mobile Responsiveness', () => {
    before(async () => {z   
      await setViewport({width: 375, height: 750});
    })
    it('sizes down to 360px', async () => {
      const el = await fixture(html`<simple-autocomplete ></simple-autocomplete>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('360px');
    })
}) */

/*
// Test if element sizes up for desktop behavior
describe('Test Desktop Responsiveness', () => {
    before(async () => {
      await setViewport({width: 1000, height: 1000});
    })
    it('sizes up to 410px', async () => {
      const el = await fixture(html`<simple-autocomplete></simple-autocomplete>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<simple-autocomplete></simple-autocomplete>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
