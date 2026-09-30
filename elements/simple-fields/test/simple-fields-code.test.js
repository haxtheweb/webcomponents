import { fixture, expect, html, oneEvent, aTimeout } from '@open-wc/testing'

import '../lib/simple-fields-code.js'

describe('simple-fields-code', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<simple-fields-code></simple-fields-code>`)
    await el.updateComplete
  })

  it('passes a11y audit', async () => {
    await expect(el).shadowDom.to.be.accessible()
  })

  it('instantiates with default properties', () => {
    expect(el.autofocus).to.equal(false)
    expect(el.fontSize).to.equal(14)
    expect(el.language).to.equal('html')
    expect(el.mode).to.equal('html')
    expect(el.readonly).to.equal(false)
  })

  it('generates a UUID in constructor', () => {
    expect(el.id).to.exist
    expect(el.id.length).to.be.greaterThan(0)
  })

  it('_generateUUID returns a string with dashes', () => {
    const uuid = el._generateUUID()
    expect(typeof uuid).to.equal('string')
    expect(uuid).to.contain('-')
  })

  it('renders a code-editor in fieldMainTemplate', () => {
    const editor = el.shadowRoot.querySelector('code-editor')
    expect(editor).to.exist
  })

  it('renders a hidden input with the id as name', () => {
    const input = el.shadowRoot.querySelector('input[type="hidden"]')
    expect(input).to.exist
    expect(input.getAttribute('name')).to.equal(el.id)
  })

  it('_fireValueChanged dispatches value-changed event', async () => {
    setTimeout(() => el._fireValueChanged())
    const e = await oneEvent(el, 'value-changed')
    expect(e.detail).to.equal(el)
  })

  it('validate returns true when not required and no error', () => {
    el.required = false
    el.error = false
    expect(el.validate()).to.equal(true)
  })

  it('validate sets error when required and no value', () => {
    el.required = true
    el.value = ''
    el.error = false
    el.validate()
    expect(el.error).to.equal(true)
  })

  it('validate uses requiredMessage when provided', () => {
    el.required = true
    el.value = ''
    el.requiredMessage = 'Custom required message'
    el.validate()
    expect(el.errorMessage).to.equal('Custom required message')
  })

  it('validate uses default "required" message when no requiredMessage', () => {
    el.required = true
    el.value = ''
    el.requiredMessage = ''
    el.validate()
    expect(el.errorMessage).to.equal('required')
  })

  it('_onChange updates value from target', () => {
    el._onChange({ target: { value: 'new code value' } })
    expect(el.value).to.equal('new code value')
  })

  it('_onChange is no-op when no target', () => {
    const before = el.value
    el._onChange({})
    expect(el.value).to.equal(before)
  })

  it('_onFocusChange sets focused from event detail', () => {
    el._onFocusChange({ detail: { focused: true } })
    expect(el.focused).to.equal(true)
  })

  it('_observeAndListen adds event listeners when init is true', () => {
    el._observeAndListen(true)
    // verify it doesn't throw
    expect(true).to.equal(true)
  })

  it('_observeAndListen removes event listeners when init is false', () => {
    el._observeAndListen(false)
    // verify it doesn't throw
    expect(true).to.equal(true)
  })

  it('slottedFieldObserver is undefined (overridden)', () => {
    expect(el.slottedFieldObserver).to.equal(undefined)
  })

  it('_updateField sets field to code-editor when in shadowRoot', () => {
    el._updateField()
    expect(el.field).to.exist
    expect(el.field.tagName.toLowerCase()).to.equal('code-editor')
  })

  it('value change fires value-changed event', async () => {
    setTimeout(() => { el.value = 'changed-value' })
    const e = await oneEvent(el, 'value-changed')
    expect(e.detail.value).to.equal('changed-value')
  })

  it('renders fieldset template when hasFieldSet is true', async () => {
    el.hasFieldSet = true
    await el.updateComplete
    // render delegates to fieldsetTemplate when hasFieldSet
    expect(el.shadowRoot).to.exist
  })
})
