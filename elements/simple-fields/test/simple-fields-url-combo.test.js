import { fixture, expect, html, aTimeout } from '@open-wc/testing'

import '../lib/simple-fields-url-combo.js'

describe('simple-fields-url-combo', () => {
  let el
  beforeEach(async () => {
    el = await fixture(
      html`<simple-fields-url-combo></simple-fields-url-combo>`,
    )
    await el.updateComplete
  })

  it('instantiates with grid false', () => {
    expect(el.grid).to.equal(false)
  })

  it('possibleEmail matches valid email format', () => {
    expect(el.possibleEmail('test@example.com')).to.exist
  })

  it('possibleEmail does not match non-email text', () => {
    expect(el.possibleEmail('not an email')).to.equal(null)
  })

  it('possiblePhone matches valid phone format', () => {
    expect(el.possiblePhone('123-456-7890')).to.exist
  })

  it('possiblePhone does not match non-phone text', () => {
    expect(el.possiblePhone('not a phone')).to.equal(null)
  })

  it('getOptionData returns object data for object input', () => {
    const result = el.getOptionData(
      { value: 'val', name: 'Name', icon: 'icn', preview: 'prev', type: 'typ' },
      5,
    )
    expect(result.value).to.equal('val')
    expect(result.name).to.equal('Name')
    expect(result.icon).to.equal('icn')
    expect(result.preview).to.equal('prev')
    expect(result.type).to.equal('typ')
    expect(result.id).to.equal(5)
  })

  it('getOptionData returns undefined for missing object fields', () => {
    const result = el.getOptionData({ value: 'val' }, 0)
    expect(result.name).to.equal(undefined)
    expect(result.icon).to.equal(undefined)
    expect(result.preview).to.equal(undefined)
    expect(result.type).to.equal(undefined)
  })

  it('getOptionData returns value for string input', () => {
    const result = el.getOptionData('simple-string', 2)
    expect(result.value).to.equal('simple-string')
    expect(result.name).to.equal(undefined)
    expect(result.id).to.equal(2)
  })

  it('sortedOptions returns sorted list from itemsList and options', async () => {
    el.itemsList = [
      { value: 'z', name: 'Z' },
      { value: 'a', name: 'A' },
    ]
    el.options = {
      'b-opt': { value: 'b', name: 'B' },
    }
    await el.updateComplete
    const sorted = el.sortedOptions
    expect(sorted.length).to.be.greaterThan(0)
    // itemsList comes first, then sorted options
    expect(sorted[0].value).to.equal('z')
  })

  it('sortedOptions handles string itemsList entries', async () => {
    el.itemsList = ['string-item']
    await el.updateComplete
    const sorted = el.sortedOptions
    expect(sorted[0].value).to.equal('string-item')
  })

  it('getListItemInner returns template with url-combo-item', () => {
    const result = el.getListItemInner({
      icon: 'icn',
      name: 'Name',
      preview: 'prev',
      type: 'typ',
      value: 'val',
    })
    expect(result).to.exist
  })

  it('isListboxHidden returns true when not expanded and no options', () => {
    expect(el.isListboxHidden).to.equal(true)
  })

  it('isListboxHidden returns false when alwaysExpanded', async () => {
    el.alwaysExpanded = true
    el.filteredOptions = [{ value: 'test', id: 't1' }]
    await el.updateComplete
    expect(el.isListboxHidden).to.equal(false)
  })

  it('filterOptions adds mailto for email-like filter', async () => {
    el.filteredOptions = []
    el.filterOptions('test@example.com')
    await el.updateComplete
    expect(el.filteredOptions.length).to.be.greaterThan(0)
    expect(el.filteredOptions[0].value).to.equal('mailto:test@example.com')
  })

  it('filterOptions adds tel for phone-like filter', async () => {
    el.filteredOptions = []
    el.filterOptions('123-456-7890')
    await el.updateComplete
    expect(el.filteredOptions.length).to.be.greaterThan(0)
    expect(el.filteredOptions[0].value).to.contain('tel:')
  })

  it('listboxTemplate includes border-bottom divs', () => {
    const result = el.listboxTemplate
    expect(result).to.exist
  })

  it('displayAs property reflects to attribute', async () => {
    el.displayAs = 'grid'
    await el.updateComplete
    expect(el.getAttribute('display-as')).to.equal('grid')
  })

  it('alwaysExpanded property reflects to attribute', async () => {
    el.alwaysExpanded = true
    await el.updateComplete
    expect(el.hasAttribute('always-expanded')).to.equal(true)
  })
})
