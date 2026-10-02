import { fixture, expect, html } from '@open-wc/testing'

import '../lib/simple-autocomplete-text-trigger.js'
import { SimpleAutocompleteTextTrigger } from '../lib/simple-autocomplete-text-trigger.js'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const FRUITS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Grape', value: 'grape' },
]

describe('simple-autocomplete-text-trigger basics', () => {
  it('defines the tag and renders the internal autocomplete and a slot', async () => {
    expect(SimpleAutocompleteTextTrigger.tag).to.equal(
      'simple-autocomplete-text-trigger',
    )
    const el = await fixture(
      html`<simple-autocomplete-text-trigger></simple-autocomplete-text-trigger>`,
    )
    expect(el.haxUIElement).to.equal(true)
    expect(el.target).to.equal(null)
    expect(el.triggers).to.deep.equal({})
    expect(el.value).to.equal('')
    expect(el.windowControllers).to.exist
    const inner = el.shadowRoot.querySelector('simple-autocomplete')
    expect(inner).to.exist
    expect(inner.hasAttribute('selection-position')).to.equal(true)
    expect(inner.hasAttribute('hide-input')).to.equal(true)
    expect(el.shadowRoot.querySelector('slot')).to.exist
    expect(el.$autocomplete).to.exist
  })

  it('adopts a single slotted child as the target', async () => {
    const el = await fixture(
      html`<simple-autocomplete-text-trigger>
        <textarea></textarea>
      </simple-autocomplete-text-trigger>`,
    )
    expect(el.target).to.exist
    expect(el.target.tagName).to.equal('TEXTAREA')
  })

  it('keeps an explicitly assigned target over slot children', async () => {
    const outside = document.createElement('input')
    document.body.appendChild(outside)
    const el = await fixture(
      html`<simple-autocomplete-text-trigger
        .target=${outside}
      ></simple-autocomplete-text-trigger>`,
    )
    expect(el.target.getAttribute('tagName') || el.target.tagName).to.equal(
      'INPUT',
    )
    document.body.removeChild(outside)
  })

  it('mirrors the internal item-selected event into its value', async () => {
    const el = await fixture(
      html`<simple-autocomplete-text-trigger></simple-autocomplete-text-trigger>`,
    )
    el.valueChanged({ detail: { value: 'grape' } })
    expect(el.value).to.equal('grape')
  })

  it('passes the a11y audit', async () => {
    const el = await fixture(
      html`<simple-autocomplete-text-trigger>
        <label>tags<textarea></textarea></label>
      </simple-autocomplete-text-trigger>`,
    )
    await expect(el).shadowDom.to.be.accessible()
  })
})

describe('simple-autocomplete-text-trigger target value helpers', () => {
  it('reads and writes the value of a native input target', async () => {
    const el = await fixture(
      html`<simple-autocomplete-text-trigger></simple-autocomplete-text-trigger>`,
    )
    const input = document.createElement('input')
    input.value = 'start'
    el.target = input
    expect(el.getTargetValue()).to.equal('start')
    el.setTargetValue('updated')
    expect(input.value).to.equal('updated')
  })

  it('reads and writes the text of a contenteditable target', async () => {
    const el = await fixture(
      html`<simple-autocomplete-text-trigger></simple-autocomplete-text-trigger>`,
    )
    const editable = document.createElement('div')
    editable.setAttribute('contenteditable', 'true')
    editable.innerText = 'start'
    el.target = editable
    expect(el.getTargetValue()).to.equal('start')
    el.setTargetValue('updated')
    expect(editable.innerText).to.equal('updated')
  })

  it('returns false and no-ops without a target', async () => {
    const el = await fixture(
      html`<simple-autocomplete-text-trigger></simple-autocomplete-text-trigger>`,
    )
    expect(el.getTargetValue()).to.equal(false)
    el.setTargetValue('ignored')
    expect(el.target).to.equal(null)
  })

  it('no-ops for a target that is neither input nor contenteditable', async () => {
    const el = await fixture(
      html`<simple-autocomplete-text-trigger></simple-autocomplete-text-trigger>`,
    )
    const plain = document.createElement('div')
    plain.innerText = 'plain'
    el.target = plain
    expect(el.getTargetValue()).to.equal(false)
    el.setTargetValue('ignored')
    expect(plain.innerText).to.equal('plain')
  })
})

describe('simple-autocomplete-text-trigger selection normalizers', () => {
  it('prefers a native getSelection on the target', async () => {
    const el = await fixture(
      html`<simple-autocomplete-text-trigger></simple-autocomplete-text-trigger>`,
    )
    el.target = { getSelection: () => 'fake-selection' }
    expect(el.getSelection()).to.equal('fake-selection')
  })

  it('falls back to the window selection without a target', async () => {
    const el = await fixture(
      html`<simple-autocomplete-text-trigger></simple-autocomplete-text-trigger>`,
    )
    const sel = el.getSelection()
    expect(sel).to.exist
    expect(typeof sel.getRangeAt).to.equal('function')
  })

  it('getRange returns false when there is no selection at all', async () => {
    const el = await fixture(
      html`<simple-autocomplete-text-trigger></simple-autocomplete-text-trigger>`,
    )
    el.target = { getSelection: () => null }
    expect(el.getRange()).to.equal(false)
  })

  it('getRange returns the selection itself when it has no ranges', async () => {
    const el = await fixture(
      html`<simple-autocomplete-text-trigger></simple-autocomplete-text-trigger>`,
    )
    globalThis.getSelection().removeAllRanges()
    const result = el.getRange()
    expect(result.rangeCount).to.equal(0)
  })

  it('getRange returns the first range of the current selection', async () => {
    const el = await fixture(
      html`<simple-autocomplete-text-trigger></simple-autocomplete-text-trigger>`,
    )
    const outside = document.createElement('div')
    outside.textContent = 'outside text'
    document.body.appendChild(outside)
    const sel = globalThis.getSelection()
    const range = document.createRange()
    range.selectNodeContents(outside)
    sel.removeAllRanges()
    sel.addRange(range)
    expect(el.getRange().toString()).to.equal('outside text')
    document.body.removeChild(outside)
  })
})

describe('simple-autocomplete-text-trigger key monitoring', () => {
  it('starts a trigger on the trigger key and feeds items to the autocomplete', async () => {
    const target = document.createElement('input')
    target.value = '@'
    document.body.appendChild(target)
    target.focus()
    target.setSelectionRange(1, 1)
    const el = await fixture(
      html`<simple-autocomplete-text-trigger
        .triggers=${{ '@': FRUITS }}
        .target=${target}
      ></simple-autocomplete-text-trigger>`,
    )
    globalThis.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    )
    globalThis.dispatchEvent(
      new KeyboardEvent('keyup', { key: '@', bubbles: true }),
    )
    await sleep(10)
    expect(el._triggerStart).to.equal(1)
    expect(el.$autocomplete.items.length).to.equal(3)
    expect(el.$autocomplete.items[0].value).to.equal('apple')
    document.body.removeChild(target)
  })

  it('supports function based triggers', async () => {
    const target = document.createElement('input')
    target.value = '#'
    document.body.appendChild(target)
    target.focus()
    target.setSelectionRange(1, 1)
    const el = await fixture(
      html`<simple-autocomplete-text-trigger
        .triggers=${{ '#': () => [{ label: 'Tag', value: 'tag' }] }}
        .target=${target}
      ></simple-autocomplete-text-trigger>`,
    )
    globalThis.dispatchEvent(
      new KeyboardEvent('keyup', { key: '#', bubbles: true }),
    )
    await sleep(10)
    expect(el.$autocomplete.items.length).to.equal(1)
    expect(el.$autocomplete.items[0].value).to.equal('tag')
    document.body.removeChild(target)
  })

  it('opens the autocomplete while typing after the trigger character', async () => {
    const target = document.createElement('input')
    target.value = '@b'
    document.body.appendChild(target)
    target.focus()
    target.setSelectionRange(1, 1)
    const el = await fixture(
      html`<simple-autocomplete-text-trigger
        .triggers=${{ '@': FRUITS }}
        .target=${target}
      ></simple-autocomplete-text-trigger>`,
    )
    globalThis.dispatchEvent(
      new KeyboardEvent('keyup', { key: '@', bubbles: true }),
    )
    await sleep(10)
    expect(el.$autocomplete.opened).to.equal(false)
    // user types another character after the trigger
    target.setSelectionRange(2, 2)
    globalThis.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'b', bubbles: true }),
    )
    await sleep(10)
    expect(el.$autocomplete.opened).to.equal(true)
    expect(el.$autocomplete.value).to.equal('b')
    expect(el.$autocomplete.like).to.equal('b')
    document.body.removeChild(target)
  })

  it('closes the autocomplete and clears the trigger on Space', async () => {
    const target = document.createElement('input')
    target.value = '@b'
    document.body.appendChild(target)
    target.focus()
    target.setSelectionRange(1, 1)
    const el = await fixture(
      html`<simple-autocomplete-text-trigger
        .triggers=${{ '@': FRUITS }}
        .target=${target}
      ></simple-autocomplete-text-trigger>`,
    )
    globalThis.dispatchEvent(
      new KeyboardEvent('keyup', { key: '@', bubbles: true }),
    )
    await sleep(10)
    target.setSelectionRange(2, 2)
    globalThis.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'b', bubbles: true }),
    )
    await sleep(10)
    expect(el.$autocomplete.opened).to.equal(true)
    globalThis.dispatchEvent(
      new KeyboardEvent('keyup', { key: ' ', code: 'Space', bubbles: true }),
    )
    await sleep(10)
    expect(el._triggerStart).to.equal(null)
    expect(el._triggerEnd).to.equal(null)
    // FIXED (haxtheweb/issues#3102 #34): the Space branch now cancels the
    // pending setValue timeout scheduled by the _triggerStart != _triggerEnd
    // branch (and the callback itself guards the trigger offsets), so the
    // menu stays closed and the value is not reset to '' right after Space
    // closed it
    expect(el.$autocomplete.opened).to.equal(false)
    expect(el.$autocomplete.value).to.equal('b')
    document.body.removeChild(target)
  })

  it('skips the deferred setValue when the trigger offsets are cleared', async () => {
    const target = document.createElement('input')
    target.value = '@b'
    document.body.appendChild(target)
    target.focus()
    target.setSelectionRange(1, 1)
    const el = await fixture(
      html`<simple-autocomplete-text-trigger
        .triggers=${{ '@': FRUITS }}
        .target=${target}
      ></simple-autocomplete-text-trigger>`,
    )
    globalThis.dispatchEvent(
      new KeyboardEvent('keyup', { key: '@', bubbles: true }),
    )
    await sleep(10)
    target.setSelectionRange(2, 2)
    globalThis.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'b', bubbles: true }),
    )
    // clear the trigger state before the deferred setValue fires; the
    // guarded callback must skip setValue('') which would otherwise
    // re-open the menu with an empty filter matching every item
    el._triggerStart = null
    el._triggerEnd = null
    el.$autocomplete.opened = false
    await sleep(10)
    expect(el.$autocomplete.opened).to.equal(false)
    expect(el.$autocomplete.value).to.equal('')
    document.body.removeChild(target)
  })

  it('monitors contenteditable targets through the selection range', async () => {
    const target = document.createElement('div')
    target.setAttribute('contenteditable', 'true')
    target.innerText = '@b'
    document.body.appendChild(target)
    target.focus()
    const sel = globalThis.getSelection()
    const caret = document.createRange()
    caret.setStart(target.firstChild, 1)
    caret.collapse(true)
    sel.removeAllRanges()
    sel.addRange(caret)
    const el = await fixture(
      html`<simple-autocomplete-text-trigger
        .triggers=${{ '@': FRUITS }}
        .target=${target}
      ></simple-autocomplete-text-trigger>`,
    )
    globalThis.dispatchEvent(
      new KeyboardEvent('keyup', { key: '@', bubbles: true }),
    )
    await sleep(10)
    expect(el._triggerStart).to.equal(1)
    const caret2 = document.createRange()
    caret2.setStart(target.firstChild, 2)
    caret2.collapse(true)
    sel.removeAllRanges()
    sel.addRange(caret2)
    globalThis.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'b', bubbles: true }),
    )
    await sleep(10)
    expect(el.$autocomplete.opened).to.equal(true)
    expect(el.$autocomplete.value).to.equal('b')
    document.body.removeChild(target)
  })
})

describe('simple-autocomplete-text-trigger value mirroring', () => {
  it('splices the selected value into a native input target', async () => {
    const target = document.createElement('input')
    target.value = '@bob and more'
    document.body.appendChild(target)
    const el = await fixture(
      html`<simple-autocomplete-text-trigger
        .target=${target}
      ></simple-autocomplete-text-trigger>`,
    )
    // trigger fired right after the @ character, user typed up to offset 4
    el._triggerStart = 1
    el._triggerEnd = 4
    el.value = 'grape'
    await el.updateComplete
    expect(target.value).to.equal('grape and more')
    expect(target.selectionStart).to.equal(5)
    expect(el._triggerStart).to.equal(null)
    expect(el._triggerEnd).to.equal(null)
    document.body.removeChild(target)
  })

  it('splices the selected value into a contenteditable target', async () => {
    const target = document.createElement('div')
    target.setAttribute('contenteditable', 'true')
    target.innerText = '@bob and more'
    document.body.appendChild(target)
    const sel = globalThis.getSelection()
    const range = document.createRange()
    range.selectNodeContents(target)
    sel.removeAllRanges()
    sel.addRange(range)
    const el = await fixture(
      html`<simple-autocomplete-text-trigger
        .target=${target}
      ></simple-autocomplete-text-trigger>`,
    )
    el._triggerStart = 1
    el._triggerEnd = 4
    el.value = 'grape'
    await el.updateComplete
    expect(target.innerText).to.equal('grape and more')
    expect(el._triggerStart).to.equal(null)
    expect(el._triggerEnd).to.equal(null)
    document.body.removeChild(target)
  })

  it('does not mirror an empty value', async () => {
    const target = document.createElement('input')
    target.value = 'untouched'
    document.body.appendChild(target)
    const el = await fixture(
      html`<simple-autocomplete-text-trigger
        .target=${target}
      ></simple-autocomplete-text-trigger>`,
    )
    el._triggerStart = 4
    el.value = ''
    await el.updateComplete
    expect(target.value).to.equal('untouched')
    document.body.removeChild(target)
  })
})

describe('simple-autocomplete-text-trigger event wiring', () => {
  it('disconnects and reconnects the global key listeners', async () => {
    const el = await fixture(
      html`<simple-autocomplete-text-trigger></simple-autocomplete-text-trigger>`,
    )
    const aborted = el.windowControllers.signal.aborted
    el.connectTargetEvents(false)
    expect(el.windowControllers.signal.aborted).to.equal(true)
    expect(aborted).to.equal(false)
    el.connectTargetEvents(true)
    expect(el.windowControllers.signal.aborted).to.equal(false)
  })
})
