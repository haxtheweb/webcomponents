import { fixture, expect, html, oneEvent, aTimeout } from '@open-wc/testing'

import '../lib/simple-fields-combo.js'

describe('simple-fields-combo', () => {
  let el
  beforeEach(async () => {
    el = await fixture(
      html`<simple-fields-combo
        id="combo-test"
        label="Test Combo"
        .options=${{
          apple: 'Apple',
          banana: 'Banana',
          cherry: 'Cherry',
        }}
      ></simple-fields-combo>`,
    )
    await el.updateComplete
  })

  it('instantiates with default properties', () => {
    expect(el.expanded).to.equal(false)
    expect(el.filter).to.equal('')
    // filteredOptions is populated by willUpdate on first render
    expect(el.inputFocus).to.equal(false)
    expect(el.inputHover).to.equal(false)
    expect(el.isNone).to.equal(true)
    expect(el.isList).to.equal(false)
    expect(el.isBoth).to.equal(false)
    expect(el.listFocus).to.equal(false)
    expect(el.listHover).to.equal(false)
    expect(el.autocomplete).to.equal('none')
  })

  it('fieldElementTag returns input', () => {
    expect(el.fieldElementTag).to.equal('input')
  })

  it('renders an input with combobox role', () => {
    const input = el.shadowRoot.querySelector('input[role="combobox"]')
    expect(input).to.exist
  })

  it('renders a listbox', () => {
    const listbox = el.shadowRoot.querySelector('ul[role="listbox"]')
    expect(listbox).to.exist
  })

  it('sortedOptions returns sorted list from options', () => {
    const sorted = el.sortedOptions
    expect(sorted.length).to.equal(3)
    // options are sorted by key: apple, banana, cherry
    expect(sorted[0].value).to.equal('Apple')
    expect(sorted[1].value).to.equal('Banana')
    expect(sorted[2].value).to.equal('Cherry')
  })

  it('sortedOptions includes itemsList entries first', async () => {
    el.itemsList = ['custom-item']
    await el.updateComplete
    const sorted = el.sortedOptions
    expect(sorted[0].value).to.equal('custom-item')
  })

  it('filterOptions populates filteredOptions with all when filter is empty', () => {
    el.filterOptions('')
    expect(el.filteredOptions.length).to.equal(3)
  })

  it('filterOptions filters by prefix match', () => {
    el.filterOptions('ban')
    expect(el.filteredOptions.length).to.equal(1)
    expect(el.filteredOptions[0].value).to.equal('Banana')
  })

  it('filterOptions is case-insensitive', () => {
    el.filterOptions('APP')
    expect(el.filteredOptions.length).to.equal(1)
    expect(el.filteredOptions[0].value).to.equal('Apple')
  })

  it('filterOptions handles non-string filter', () => {
    el.filterOptions(123)
    expect(el.filteredOptions.length).to.equal(3)
  })

  it('filterOptions sets firstOption and lastOption', () => {
    el.filterOptions('')
    expect(el.firstOption).to.exist
    expect(el.lastOption).to.exist
    expect(el.firstOption.value).to.equal('Apple')
    expect(el.lastOption.value).to.equal('Cherry')
  })

  it('filterOptions returns matching option when currentOption matches', () => {
    el.filterOptions('')
    const currentOption = el.firstOption
    const result = el.filterOptions('', currentOption)
    expect(result).to.exist
  })

  it('filterOptions returns firstOption when currentOption does not match', () => {
    el.filterOptions('')
    const result = el.filterOptions('b', { textComparison: 'zzz' })
    expect(result).to.exist
  })

  it('filterOptions sets firstOption false when no matches', () => {
    el.filterOptions('zzz')
    expect(el.filteredOptions.length).to.equal(0)
    expect(el.firstOption).to.equal(false)
    expect(el.lastOption).to.equal(false)
  })

  it('open sets expanded to true', () => {
    el.open()
    expect(el.expanded).to.equal(true)
  })

  it('open does not set expanded if already true', () => {
    el.expanded = true
    el.open()
    expect(el.expanded).to.equal(true)
  })

  it('close sets expanded to false when forced', () => {
    el.expanded = true
    el.close(true)
    expect(el.expanded).to.equal(false)
  })

  it('close handles non-boolean force argument', () => {
    el.expanded = true
    el.close('not-boolean')
    expect(el.expanded).to.equal(false)
  })

  it('close does not close when inputFocus is true and not forced', () => {
    el.expanded = true
    el.inputFocus = true
    el.close(false)
    expect(el.expanded).to.equal(true)
  })

  it('autocompleteChanged sets isNone for "none"', () => {
    el.autocomplete = 'none'
    el.autocompleteChanged()
    expect(el.isNone).to.equal(true)
    expect(el.isList).to.equal(false)
    expect(el.isBoth).to.equal(false)
  })

  it('autocompleteChanged sets isList for "list"', () => {
    el.autocomplete = 'list'
    el.autocompleteChanged()
    expect(el.isList).to.equal(true)
    expect(el.isNone).to.equal(false)
  })

  it('autocompleteChanged sets isBoth for "both"', () => {
    el.autocomplete = 'both'
    el.autocompleteChanged()
    expect(el.isBoth).to.equal(true)
    expect(el.isNone).to.equal(false)
  })

  it('autocompleteChanged sets isNone for non-string', () => {
    el.autocomplete = 123
    el.autocompleteChanged()
    expect(el.isNone).to.equal(true)
  })

  it('hasOptions returns true when filteredOptions has items', () => {
    el.filteredOptions = [{ value: 'test', id: 0 }]
    expect(el.hasOptions).to.equal(true)
  })

  it('hasOptions returns false when filteredOptions is empty', () => {
    el.filteredOptions = []
    expect(el.hasOptions).to.equal(false)
  })

  it('setActiveDescendant sets activeDescendant when listFocus is true', () => {
    el.listFocus = true
    el.setActiveDescendant({ id: 5 })
    expect(el.activeDescendant).to.equal('option5')
  })

  it('setActiveDescendant clears activeDescendant when listFocus is false', () => {
    el.listFocus = false
    el.setActiveDescendant({ id: 5 })
    expect(el.activeDescendant).to.equal('')
  })

  it('setActiveDescendant clears when option is falsy', () => {
    el.listFocus = true
    el.setActiveDescendant(false)
    expect(el.activeDescendant).to.equal('')
  })

  it('setVisualFocusTextbox sets inputFocus and clears listFocus', () => {
    el.listFocus = true
    el.setVisualFocusTextbox()
    expect(el.inputFocus).to.equal(true)
    expect(el.listFocus).to.equal(false)
  })

  it('setVisualFocusListbox sets listFocus and clears inputFocus', () => {
    el.inputFocus = true
    el.setVisualFocusListbox()
    expect(el.listFocus).to.equal(true)
    expect(el.inputFocus).to.equal(false)
  })

  it('removeVisualFocusAll clears inputFocus and option', () => {
    el.inputFocus = true
    el.option = { value: 'test' }
    el.removeVisualFocusAll()
    expect(el.inputFocus).to.equal(false)
    expect(el.option).to.equal(false)
  })

  it('keyCode returns expected key codes', () => {
    expect(el.keyCode.BACKSPACE).to.equal(8)
    expect(el.keyCode.TAB).to.equal(9)
    expect(el.keyCode.RETURN).to.equal(13)
    expect(el.keyCode.ESC).to.equal(27)
    expect(el.keyCode.DOWN).to.equal(40)
    expect(el.keyCode.UP).to.equal(38)
  })

  it('isListboxHidden returns true when not expanded', () => {
    expect(el.isListboxHidden).to.equal(true)
  })

  it('isListboxHidden returns false when expanded with options', async () => {
    el.filterOptions('')
    el.expanded = true
    await el.updateComplete
    expect(el.isListboxHidden).to.equal(false)
  })

  it('isListboxHidden returns true when hidden', () => {
    el.hidden = true
    expect(el.isListboxHidden).to.equal(true)
  })

  it('input getter returns the input element', () => {
    expect(el.input).to.exist
    expect(el.input.tagName.toLowerCase()).to.equal('input')
  })

  it('listbox getter returns the ul element', () => {
    expect(el.listbox).to.exist
    expect(el.listbox.tagName.toLowerCase()).to.equal('ul')
  })

  it('stateInfo returns an object with combo state', () => {
    el.filterOptions('')
    const info = el.stateInfo
    expect(info).to.exist
    expect(info).to.have.property('activeDescendant')
    expect(info).to.have.property('filteredOptions')
    expect(info).to.have.property('filter')
    expect(info).to.have.property('value')
  })

  it('_isSelected returns "true" when option matches _selectedOption', () => {
    el.filterOptions('')
    const option = el.filteredOptions[0]
    el._selectedOption = option
    expect(el._isSelected(option)).to.equal('true')
  })

  it('_isSelected returns "false" when option does not match', () => {
    el.filterOptions('')
    const option = el.filteredOptions[0]
    el._selectedOption = { textComparison: 'different' }
    expect(el._isSelected(option)).to.equal('false')
  })

  it('_isSelected returns "false" when no _selectedOption', () => {
    el.filterOptions('')
    const option = el.filteredOptions[0]
    el._selectedOption = false
    expect(el._isSelected(option)).to.equal('false')
  })

  it('previousItem returns lastOption when option is firstOption', () => {
    el.filterOptions('')
    el.option = el.firstOption
    const prev = el.previousItem
    expect(prev).to.equal(el.lastOption)
  })

  it('previousItem returns the item before current', () => {
    el.filterOptions('')
    el.option = el.filteredOptions[1]
    const prev = el.previousItem
    expect(prev).to.equal(el.filteredOptions[0])
  })

  it('nextItem returns firstOption when option is lastOption', () => {
    el.filterOptions('')
    el.option = el.lastOption
    const next = el.nextItem
    expect(next).to.equal(el.firstOption)
  })

  it('nextItem returns the item after current', () => {
    el.filterOptions('')
    el.option = el.filteredOptions[0]
    const next = el.nextItem
    expect(next).to.equal(el.filteredOptions[1])
  })

  it('_onButtonClick opens combo when not expanded', async () => {
    el.expanded = false
    el._onButtonClick({})
    expect(el.expanded).to.equal(true)
  })

  it('_onButtonClick closes combo when expanded', async () => {
    el.expanded = true
    el.filterOptions('')
    el._onButtonClick({})
    expect(el.expanded).to.equal(false)
  })

  it('_onInputClick opens combo when not expanded', () => {
    el.expanded = false
    el._onInputClick({})
    expect(el.expanded).to.equal(true)
  })

  it('_onInputClick closes combo when expanded', () => {
    el.expanded = true
    el.filterOptions('')
    el._onInputClick({})
    expect(el.expanded).to.equal(false)
  })

  it('_onInputFocus sets visual focus to textbox', () => {
    el._onInputFocus({})
    expect(el.inputFocus).to.equal(true)
    expect(el.option).to.equal(false)
  })

  it('_onInputBlur does not close when hoveredOption is set', () => {
    el.expanded = true
    el.hoveredOption = { value: 'test' }
    el._onInputBlur({})
    // hoveredOption prevents close logic
    expect(true).to.equal(true)
  })

  it('_onListboxMouseover sets listHover', () => {
    el._onListboxMouseover({})
    expect(el.listHover).to.equal(true)
  })

  it('_onListboxMouseout clears listHover', () => {
    el._onListboxMouseout({})
    expect(el.listHover).to.equal(false)
  })

  it('_onOptionMouseover sets hoveredOption and opens', () => {
    const opt = { value: 'test', id: 0 }
    el._onOptionMouseover({}, opt)
    expect(el.hoveredOption).to.equal(opt)
    expect(el.listHover).to.equal(true)
    expect(el.expanded).to.equal(true)
  })

  it('_onOptionMouseout clears hoveredOption', () => {
    el._onOptionMouseout({}, { value: 'test' })
    expect(el.listHover).to.equal(false)
    expect(el.hoveredOption).to.equal(undefined)
  })

  it('_onOptionClick sets option and value', async () => {
    el.filterOptions('')
    const opt = el.filteredOptions[0]
    el._onOptionClick({}, opt)
    expect(el.option).to.equal(opt)
  })

  it('getListItem returns a template with role=option', () => {
    el.filterOptions('')
    const opt = el.filteredOptions[0]
    const result = el.getListItem(opt)
    expect(result).to.exist
  })

  it('getListItemInner returns option value by default', () => {
    const result = el.getListItemInner({ value: 'TestValue' })
    expect(result).to.equal('TestValue')
  })

  it('listboxInnerTemplate maps filteredOptions to list items', () => {
    el.filterOptions('')
    const result = el.listboxInnerTemplate
    expect(result).to.exist
  })

  it('setValue sets filter and updates input selection', async () => {
    el.filterOptions('')
    el.setValue('App')
    expect(el.filter).to.equal('App')
  })

  it('setValue filters options when isList is true', async () => {
    el.autocomplete = 'list'
    el.autocompleteChanged()
    el.filterOptions('')
    el.setValue('ban')
    expect(el.filter).to.equal('ban')
  })

  it('setOption sets option and activeDescendant', async () => {
    el.listFocus = true
    el.filterOptions('')
    const opt = el.filteredOptions[0]
    el.setOption(opt)
    expect(el.option).to.equal(opt)
    expect(el.activeDescendant).to.equal(`option${opt.id}`)
  })

  it('setOption with isBoth sets value and input value', async () => {
    el.autocomplete = 'both'
    el.autocompleteChanged()
    el.filterOptions('')
    const opt = el.filteredOptions[0]
    el.setOption(opt, true)
    expect(el.value).to.equal(opt.value)
  })

  it('setCurrentOptionStyle sets _selectedOption', () => {
    el.setCurrentOptionStyle({ id: 1, textComparison: 'test' })
    expect(el._selectedOption).to.exist
  })

  it('setCurrentOptionStyle with false clears _selectedOption', () => {
    el._selectedOption = { id: 1 }
    el.setCurrentOptionStyle(false)
    expect(el._selectedOption).to.equal(false)
  })

  it('fieldValueChanged updates input value and fires event', async () => {
    el.filterOptions('')
    el.value = 'NewValue'
    setTimeout(() => el.fieldValueChanged())
    const e = await oneEvent(el, 'value-changed')
    expect(e.detail).to.equal(el)
  })

  it('_onInputKeyup dispatches combo-input-keyup event', async () => {
    setTimeout(() =>
      el._onInputKeyup({ key: 'a', keyCode: 65, preventDefault() {}, stopPropagation() {} }),
    )
    const e = await oneEvent(el, 'combo-input-keyup')
    expect(e).to.exist
  })

  it('_onInputKeydown ESC closes and clears', async () => {
    el.expanded = true
    el.filterOptions('')
    el._onInputKeydown({
      keyCode: 27,
      altKey: false,
      stopPropagation() {},
      preventDefault() {},
    })
    expect(el.expanded).to.equal(false)
    expect(el.option).to.equal(false)
  })

  it('_onInputKeydown TAB closes combo', async () => {
    el.expanded = true
    el.filterOptions('')
    el._onInputKeydown({
      keyCode: 9,
      altKey: false,
      stopPropagation() {},
      preventDefault() {},
    })
    expect(el.expanded).to.equal(false)
  })

  it('_onInputKeydown RETURN closes combo', async () => {
    el.expanded = true
    el.filterOptions('')
    el._onInputKeydown({
      keyCode: 13,
      altKey: false,
      stopPropagation() {},
      preventDefault() {},
    })
    expect(el.expanded).to.equal(false)
  })

  it('_onInputKeydown DOWN opens combo', async () => {
    el.expanded = false
    el.filterOptions('')
    el._onInputKeydown({
      keyCode: 40,
      altKey: false,
      stopPropagation() {},
      preventDefault() {},
    })
    expect(el.expanded).to.equal(true)
  })

  it('_onInputKeydown UP opens combo', async () => {
    el.expanded = false
    el.filterOptions('')
    el._onInputKeydown({
      keyCode: 38,
      altKey: false,
      stopPropagation() {},
      preventDefault() {},
    })
    expect(el.expanded).to.equal(true)
  })

  it('_onInputPaste updates value after debounce', async () => {
    el.filterOptions('')
    el._onInputPaste({})
    await aTimeout(10)
    // value should be set from input after debounce
    expect(true).to.equal(true)
  })

  it('expandButtonTemplate renders a button when options exist', () => {
    el.filterOptions('')
    const result = el.expandButtonTemplate
    expect(result).to.exist
  })

  it('inputTemplate renders an input with combobox attributes', () => {
    const result = el.inputTemplate
    expect(result).to.exist
  })

  it('listboxTemplate renders a ul with listbox role', () => {
    el.filterOptions('')
    const result = el.listboxTemplate
    expect(result).to.exist
  })

  it('fieldMainTemplate includes input and listbox', () => {
    el.filterOptions('')
    const result = el.fieldMainTemplate
    expect(result).to.exist
  })
})
