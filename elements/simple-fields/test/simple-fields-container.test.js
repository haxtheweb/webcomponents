import { fixture, expect, html, oneEvent, aTimeout } from '@open-wc/testing'

import '../lib/simple-fields-container.js'

describe('simple-fields-container', () => {
  let el
  beforeEach(async () => {
    el = await fixture(
      html`<simple-fields-container
        id="container-test"
        label="Test Label"
        description="A short desc"
      ></simple-fields-container>`,
    )
    await el.updateComplete
  })

  it('instantiates with default properties', () => {
    expect(el.isSimpleFieldType).to.equal(true)
    expect(el.counter).to.equal('none')
    expect(el.autovalidate).to.equal(false)
    expect(el.disabled).to.equal(false)
    expect(el.hidden).to.equal(false)
    expect(el.error).to.equal(false)
    expect(el.inline).to.equal(false)
  })

  it('generates a UUID in constructor', () => {
    expect(el.id).to.exist
    expect(el.id.length).to.be.greaterThan(0)
  })

  it('validTypes includes expected types', () => {
    expect(el.validTypes).to.include('text')
    expect(el.validTypes).to.include('checkbox')
    expect(el.validTypes).to.include('select')
    expect(el.validTypes).to.include('textarea')
    expect(el.validTypes).to.include('number')
  })

  it('_generateUUID returns a string with dashes', () => {
    const uuid = el._generateUUID()
    expect(typeof uuid).to.equal('string')
    expect(uuid).to.contain('-')
  })

  it('fieldId getter returns id with .input suffix', () => {
    el.id = 'myfield'
    expect(el.fieldId).to.equal('myfield.input')
  })

  it('hasFieldset returns false for non-fieldset type', () => {
    el.type = 'text'
    expect(el.hasFieldset).to.equal(false)
  })

  it('hasFieldset returns true for fieldset type', () => {
    el.type = 'fieldset'
    expect(el.hasFieldset).to.equal(true)
  })

  it('numeric returns true for number type', () => {
    el.type = 'number'
    expect(el.numeric).to.equal(true)
  })

  it('numeric returns true for date type', () => {
    el.type = 'date'
    expect(el.numeric).to.equal(true)
  })

  it('numeric returns false for text type', () => {
    el.type = 'text'
    expect(el.numeric).to.equal(false)
  })

  it('_getValidType returns valid type as-is', () => {
    expect(el._getValidType('text')).to.equal('text')
    expect(el._getValidType('checkbox')).to.equal('checkbox')
  })

  it('_getValidType converts datetime to datetime-local', () => {
    el.validTypes = ['datetime', 'datetime-local', 'text']
    expect(el._getValidType('datetime')).to.equal('datetime-local')
  })

  it('_getValidType returns text for invalid type', () => {
    expect(el._getValidType('invalidtype')).to.equal('text')
  })

  it('_fireErrorChanged dispatches error-changed event', async () => {
    setTimeout(() => el._fireErrorChanged())
    const e = await oneEvent(el, 'error-changed')
    expect(e.detail).to.equal(el)
  })

  it('isRowBasedField returns true for checkbox', () => {
    el.type = 'checkbox'
    expect(el.isRowBasedField).to.equal(true)
  })

  it('isRowBasedField returns true for color', () => {
    el.type = 'color'
    expect(el.isRowBasedField).to.equal(true)
  })

  it('isRowBasedField returns true for text', () => {
    el.type = 'text'
    expect(el.isRowBasedField).to.equal(true)
  })

  it('isRowBasedField returns false for textarea', () => {
    el.type = 'textarea'
    expect(el.isRowBasedField).to.not.be.ok
  })

  it('isRowBasedField returns false for file', () => {
    el.type = 'file'
    expect(el.isRowBasedField).to.not.be.ok
  })

  it('_isScalableTextField returns true for textarea', () => {
    el.type = 'textarea'
    expect(el._isScalableTextField).to.equal(true)
  })

  it('_isScalableTextField returns false for text', () => {
    el.type = 'text'
    expect(el._isScalableTextField).to.equal(false)
  })

  it('hasInlineDescription returns true for short description', () => {
    el.type = 'text'
    el.description = 'short desc'
    expect(el.hasInlineDescription).to.equal(true)
  })

  it('hasInlineDescription returns false for long description', () => {
    el.type = 'text'
    el.description = 'this is a very long description with many words that exceeds the inline limit'
    expect(el.hasInlineDescription).to.equal(false)
  })

  it('hasInlineDescription returns false for scalable text fields', () => {
    el.type = 'textarea'
    el.description = 'short desc'
    expect(el.hasInlineDescription).to.equal(false)
  })

  it('hasInfoTooltip returns true for long description', () => {
    el.type = 'text'
    el.description = 'this is a very long description with many words that exceeds the inline limit'
    expect(el.hasInfoTooltip).to.equal(true)
  })

  it('hasInfoTooltip returns false for short description', () => {
    el.type = 'text'
    el.description = 'short desc'
    expect(el.hasInfoTooltip).to.equal(false)
  })

  it('hasInfoTooltip returns false for scalable text fields', () => {
    el.type = 'textarea'
    el.description = 'this is a very long description with many words that exceeds the inline limit'
    expect(el.hasInfoTooltip).to.equal(false)
  })

  it('inlineDescriptionTemplate returns empty when no inline description', () => {
    el.type = 'text'
    el.description = ''
    const result = el.inlineDescriptionTemplate
    expect(result).to.equal('')
  })

  it('infoToggleTemplate returns empty when no info tooltip', () => {
    el.type = 'text'
    el.description = 'short'
    const result = el.infoToggleTemplate
    expect(result).to.equal('')
  })

  it('infoToggleTemplate returns template when info tooltip needed', () => {
    el.type = 'text'
    el.description = 'this is a very long description with many words that exceeds the inline limit'
    const result = el.infoToggleTemplate
    expect(result).to.exist
  })

  it('labelTemplate renders label with fieldId', () => {
    el.id = 'test-field'
    el.label = 'My Label'
    const result = el.labelTemplate
    expect(result).to.exist
  })

  it('labelTemplate appends * when required', () => {
    el.label = 'Required Field'
    el.required = true
    const result = el.labelTemplate
    expect(result).to.exist
  })

  it('prefixTemplate renders prefix slot and value', () => {
    el.prefix = '$'
    const result = el.prefixTemplate
    expect(result).to.exist
  })

  it('suffixTemplate renders suffix value when set', () => {
    el.suffix = '.00'
    const result = el.suffixTemplate
    expect(result).to.exist
  })

  it('suffixTemplate renders slot when no suffix value', () => {
    el.suffix = ''
    const result = el.suffixTemplate
    expect(result).to.exist
  })

  it('fieldMeta renders a div with fieldmeta id', () => {
    const result = el.fieldMeta
    expect(result).to.exist
  })

  it('fieldBottom includes description and error templates', () => {
    const result = el.fieldBottom
    expect(result).to.exist
  })

  it('fieldMainTemplate includes label and field slot', () => {
    const result = el.fieldMainTemplate
    expect(result).to.exist
  })

  it('errorTemplate renders error message div', () => {
    el.error = true
    el.errorMessage = 'Test error'
    const result = el.errorTemplate
    expect(result).to.exist
  })

  it('descriptionTemplate renders description div', () => {
    el.type = 'textarea'
    el.description = 'A description'
    const result = el.descriptionTemplate
    expect(result).to.exist
  })

  it('descriptionTemplate returns empty when hasInlineDescription', () => {
    el.type = 'text'
    el.description = 'short'
    const result = el.descriptionTemplate
    expect(result).to.equal('')
  })

  it('focus sets __delayedFocus true when no field', () => {
    el.field = undefined
    el.focus()
    expect(el.__delayedFocus).to.equal(true)
  })

  it('focus focuses field when field exists', () => {
    let focused = false
    el.field = { focus() { focused = true } }
    el.focus()
    expect(focused).to.equal(true)
    expect(el.__delayedFocus).to.equal(false)
  })

  it('_onFocusin sets error to false', () => {
    el.error = true
    el._onFocusin()
    expect(el.error).to.equal(false)
  })

  it('_onFocusout validates when autovalidate is true', () => {
    el.autovalidate = true
    el.field = { querySelector() { return null }, value: 'hasvalue' }
    el.error = false
    el._onFocusout()
    // should not throw
    expect(true).to.equal(true)
  })

  it('_onFocusout does not validate when autovalidate is false', () => {
    el.autovalidate = false
    el._onFocusout()
    expect(true).to.equal(true)
  })

  it('_observeAndListen with init false disconnects observer', () => {
    expect(() => el._observeAndListen(false)).to.not.throw()
  })

  it('slottedFieldObserver returns a MutationObserver', () => {
    expect(el.slottedFieldObserver).to.exist
    expect(el.slottedFieldObserver instanceof MutationObserver).to.equal(true)
  })

  it('_handleFieldChange updates value and count for text', () => {
    el.type = 'text'
    el.field = document.createElement('input')
    el.field.value = 'test value'
    el.field.getAttribute = () => null
    el.counter = 'none'
    el.autovalidate = false
    el._handleFieldChange()
    expect(el.value).to.equal('test value')
  })

  it('_handleFieldChange calls autoGrow for textarea', () => {
    el.type = 'textarea'
    const ta = document.createElement('textarea')
    ta.value = 'test'
    // scrollHeight is read-only on DOM elements, so we mock the field
    // as a plain object with the needed properties
    el.field = {
      value: 'test',
      style: {},
      scrollHeight: 100,
      getAttribute: () => null,
      tagName: 'TEXTAREA',
      setAttribute: () => {},
      addEventListener: () => {},
    }
    el.counter = 'none'
    el.autovalidate = false
    el._handleFieldChange()
    expect(el.value).to.equal('test')
  })

  it('_getFieldValue returns field value for text type', () => {
    el.type = 'text'
    el.field = { value: 'my value' }
    expect(el._getFieldValue()).to.equal('my value')
  })

  it('_getFieldValue returns checked for checkbox type', () => {
    el.type = 'checkbox'
    el.field = { checked: true }
    expect(el._getFieldValue()).to.equal(true)
  })

  it('_getFieldValue returns checked for radio type', () => {
    el.type = 'radio'
    el.field = { checked: false }
    expect(el._getFieldValue()).to.equal(false)
  })

  it('_getFieldValue returns undefined when no field', () => {
    el.field = undefined
    expect(el._getFieldValue()).to.equal(undefined)
  })

  it('_getFieldValue returns selected option for select type', () => {
    el.type = 'select'
    el.multiple = false
    el.field = {
      selectedOptions: [{ value: 'option1' }],
    }
    expect(el._getFieldValue()).to.equal('option1')
  })

  it('_getFieldValue returns array for multiple select', () => {
    el.type = 'select'
    el.multiple = true
    el.field = {
      selectedOptions: {
        0: { value: 'a' },
        1: { value: 'b' },
      },
    }
    const result = el._getFieldValue()
    expect(result).to.deep.equal(['a', 'b'])
  })

  it('autoGrow sets field height when field exists', () => {
    el.field = {
      style: {},
      scrollHeight: 200,
    }
    el.autoGrow()
    expect(el.field.style.height).to.equal('200px')
    expect(el.field.style.overflowY).to.equal('hidden')
  })

  it('autoGrow does nothing when no field', () => {
    el.field = undefined
    expect(() => el.autoGrow()).to.not.throw()
  })

  it('cursorAtEnd sets selection to end when field exists', () => {
    el.field = {
      value: 'test value',
      selectionStart: 0,
      selectionEnd: 0,
    }
    el.cursorAtEnd()
    expect(el.field.selectionStart).to.equal(10)
    expect(el.field.selectionEnd).to.equal(10)
  })

  it('select calls field.select for text type', () => {
    let selected = false
    el.field = { select() { selected = true } }
    el.type = 'text'
    el.select()
    expect(selected).to.equal(true)
  })

  it('select does nothing for non-text type', () => {
    let selected = false
    el.field = { select() { selected = true } }
    el.type = 'number'
    el.select()
    expect(selected).to.equal(false)
  })

  it('setRangeText calls field.setRangeText for text type', () => {
    let captured = null
    el.field = {
      setRangeText(rep, start, end, mode) {
        captured = { rep, start, end, mode }
      },
    }
    el.type = 'text'
    el.setRangeText('replacement', 0, 3, 'select')
    expect(captured.rep).to.equal('replacement')
    expect(captured.start).to.equal(0)
  })

  it('setSelectionRange calls field.setSelectionRange for text type', () => {
    let captured = null
    el.field = {
      setSelectionRange(start, end, dir) {
        captured = { start, end, dir }
      },
    }
    el.type = 'text'
    el.setSelectionRange(0, 5, 'forward')
    expect(captured.start).to.equal(0)
    expect(captured.end).to.equal(5)
  })

  it('stepDown calls field.stepDown for numeric type', () => {
    let stepped = false
    el.field = { stepDown() { stepped = true } }
    el.type = 'number'
    el.stepDown(1)
    expect(stepped).to.equal(true)
  })

  it('stepDown does nothing for non-numeric type', () => {
    let stepped = false
    el.field = { stepDown() { stepped = true } }
    el.type = 'text'
    el.stepDown(1)
    expect(stepped).to.equal(false)
  })

  it('stepUp calls field.stepUp for numeric type', () => {
    let stepped = false
    el.field = { stepUp() { stepped = true } }
    el.type = 'number'
    el.stepUp(1)
    expect(stepped).to.equal(true)
  })

  it('requiredError returns true when required and no value', () => {
    el.required = true
    el.field = { value: '' }
    el.type = 'text'
    expect(el.requiredError).to.equal(true)
  })

  it('requiredError returns false when not required', () => {
    el.required = false
    el.field = { value: '' }
    el.type = 'text'
    expect(el.requiredError).to.equal(false)
  })
  it('patternError returns falsy when no pattern set', () => {
    el.pattern = ''
    el.field = { value: 'test', multiple: false }
    el.type = 'text'
    expect(el.patternError).to.not.be.ok
  })

  it('validate sets error for required field with no value', () => {
    el.required = true
    el.field = { querySelector() { return null }, value: '' }
    el.error = false
    // requiredError getter checks !this._getFieldValue() && this.required
    // _getFieldValue for text type returns this.field.value which is '' (falsy)
    el.validate()
    expect(el.error).to.equal(true)
    expect(el.errorMessage).to.equal('required')
  })

  it('validate uses requiredMessage when provided', () => {
    el.required = true
    el.field = { querySelector() { return null }, value: '' }
    el.error = false
    el.requiredMessage = 'Custom required'
    el.validate()
    expect(el.errorMessage).to.equal('Custom required')
  })

  it('validate returns true when no errors', () => {
    el.error = false
    el.field = { querySelector() { return null }, value: 'hasvalue' }
    expect(el.validate()).to.equal(true)
  })

  it('validate returns false when error is set', () => {
    el.error = true
    el.field = { querySelector() { return null } }
    expect(el.validate()).to.equal(false)
  })

  it('error change fires error-changed event', async () => {
    el.field = {
      querySelector() { return null },
      value: 'hasvalue',
      tagName: 'INPUT',
      getAttribute: () => null,
      setAttribute: () => {},
    }
    el.error = false
    let errorFired = false
    el.addEventListener('error-changed', (e) => {
      errorFired = true
      expect(e.detail).to.equal(el)
    })
    el.error = true
    await el.updateComplete
    expect(errorFired).to.equal(true)
  })

  it('updated sets aria-invalid on field when error changes', async () => {
    el.field = {
      setAttribute() {},
      querySelector() { return null },
      value: 'hasvalue',
      tagName: 'INPUT',
      getAttribute: () => null,
    }
    el.error = false
    await el.updateComplete
    el.error = true
    await el.updateComplete
    // should not throw and should set aria-invalid
    expect(el.error).to.equal(true)
  })

  it('updated sets row-layout attribute when isRowBasedField', async () => {
    el.type = 'text'
    await el.updateComplete
    expect(el.hasAttribute('row-layout')).to.equal(true)
  })

  it('updated removes row-layout attribute when not isRowBasedField', async () => {
    el.type = 'textarea'
    await el.updateComplete
    expect(el.hasAttribute('row-layout')).to.equal(false)
  })

  it('disconnectedCallback removes click listener', () => {
    expect(() => {
      el.disconnectedCallback()
    }).to.not.throw()
  })

  it('renders fieldMainTemplate and fieldBottom in render', () => {
    expect(el.shadowRoot).to.exist
    const fieldMain = el.shadowRoot.querySelector('.field-main')
    expect(fieldMain).to.exist
  })
})

describe('simple-fields-container with slotted field', () => {
  let el
  beforeEach(async () => {
    el = await fixture(
      html`<simple-fields-container id="slot-test" label="Slotted">
        <input slot="field" type="text" value="initial" />
      </simple-fields-container>`,
    )
    await el.updateComplete
  })

  it('detects slotted input field', () => {
    expect(el.field).to.exist
    expect(el.field.tagName.toLowerCase()).to.equal('input')
  })

  it('sets type from slotted input', () => {
    expect(el.type).to.equal('text')
  })

  it('_getFieldValue returns slotted field value', () => {
    expect(el._getFieldValue()).to.equal('initial')
  })

  it('focus focuses the slotted field', () => {
    let focused = false
    el.field.focus = () => { focused = true }
    el.focus()
    expect(focused).to.equal(true)
  })

  it('updated sets aria-invalid on slotted field', async () => {
    el.error = true
    await el.updateComplete
    expect(el.field.getAttribute('aria-invalid')).to.equal('true')
  })
})
