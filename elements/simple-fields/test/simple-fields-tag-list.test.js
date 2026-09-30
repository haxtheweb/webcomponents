import { fixture, expect, html, oneEvent, aTimeout } from '@open-wc/testing'

import '../lib/simple-fields-tag-list.js'

describe('simple-fields-tag-list', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<simple-fields-tag-list></simple-fields-tag-list>`)
    await el.updateComplete
  })

  it('passes a11y audit', async () => {
    await expect(el).shadowDom.to.be.accessible()
  })

  it('instantiates with default properties', () => {
    expect(el.label).to.equal('Tags')
    expect(el.singleValueOnly).to.equal(false)
    expect(el.value).to.equal('')
    expect(Array.isArray(el.tagList)).to.equal(true)
    expect(el.tagList.length).to.equal(0)
  })

  it('generates a UUID in constructor', () => {
    expect(el.id).to.exist
    expect(el.id.length).to.be.greaterThan(0)
  })

  it('renders an input element', () => {
    const input = el.shadowRoot.querySelector('input')
    expect(input).to.exist
  })

  it('_updateTaglist adds a tag from input value', async () => {
    const input = el.shadowRoot.querySelector('input')
    input.value = 'newtag'
    el._updateTaglist()
    expect(el.tagList.length).to.equal(1)
    expect(el.tagList[0].term).to.equal('newtag')
    expect(input.value).to.equal('')
  })

  it('_updateTaglist trims trailing comma', async () => {
    const input = el.shadowRoot.querySelector('input')
    input.value = 'tagwithcomma,'
    el._updateTaglist()
    expect(el.tagList.length).to.equal(1)
    expect(el.tagList[0].term).to.equal('tagwithcomma')
  })

  it('_updateTaglist does not add empty tags', async () => {
    const input = el.shadowRoot.querySelector('input')
    input.value = '   '
    el._updateTaglist()
    expect(el.tagList.length).to.equal(0)
  })

  it('_updateTaglist removes existing duplicate before re-adding', async () => {
    el.tagList = [{ term: 'existing', color: 'grey' }]
    const input = el.shadowRoot.querySelector('input')
    input.value = 'existing'
    el._updateTaglist()
    // The duplicate is filtered out, then the tag is re-added from input
    expect(el.tagList.length).to.equal(1)
    expect(el.tagList[0].term).to.equal('existing')
  })

  it('singleValueOnly replaces all tags with new one', async () => {
    el.tagList = [
      { term: 'first', color: 'grey' },
      { term: 'second', color: 'grey' },
    ]
    el.singleValueOnly = true
    const input = el.shadowRoot.querySelector('input')
    input.value = 'replacement'
    el._updateTaglist()
    expect(el.tagList.length).to.equal(1)
    expect(el.tagList[0].term).to.equal('replacement')
  })

  it('removeTag removes a tag by value', async () => {
    el.tagList = [
      { term: 'alpha', color: 'grey' },
      { term: 'beta', color: 'grey' },
    ]
    el.removeTag({ detail: { value: 'alpha' } })
    expect(el.tagList.length).to.equal(1)
    expect(el.tagList[0].term).to.equal('beta')
  })

  it('_handleKeydown calls _updateTaglist on Enter', async () => {
    const input = el.shadowRoot.querySelector('input')
    input.value = 'entertag'
    el._handleKeydown({ key: 'Enter' })
    expect(el.tagList.length).to.equal(1)
  })

  it('_handleKeydown does nothing on non-Enter key', async () => {
    const input = el.shadowRoot.querySelector('input')
    input.value = 'notsubmitted'
    el._handleKeydown({ key: 'Tab' })
    expect(el.tagList.length).to.equal(0)
  })

  it('_handleKeyup calls _updateTaglist on comma', async () => {
    const input = el.shadowRoot.querySelector('input')
    input.value = 'commatag,'
    el._handleKeyup({ key: ',' })
    expect(el.tagList.length).to.equal(1)
  })

  it('_handleKeyup does nothing on non-comma key', async () => {
    const input = el.shadowRoot.querySelector('input')
    input.value = 'notsubmitted'
    el._handleKeyup({ key: 'a' })
    expect(el.tagList.length).to.equal(0)
  })

  it('_handleDragEnter adds drag-focus class', () => {
    const e = new Event('dragover', { bubbles: true })
    e.preventDefault = () => {}
    el._handleDragEnter(e)
    expect(el.classList.contains('drag-focus')).to.equal(true)
    expect(el.classList.contains('drop-possible')).to.equal(false)
  })

  it('_handleDragLeave removes drag-focus and adds drop-possible', () => {
    el.classList.add('drag-focus')
    el._handleDragLeave({})
    expect(el.classList.contains('drag-focus')).to.equal(false)
    expect(el.classList.contains('drop-possible')).to.equal(true)
  })

  it('_handleDragDrop adds tag from dataTransfer', async () => {
    const e = {
      preventDefault() {},
      dataTransfer: {
        getData() { return JSON.stringify({ term: 'dropped', color: 'blue' }) },
      },
    }
    el._handleDragDrop(e)
    expect(el.tagList.length).to.equal(1)
    expect(el.tagList[0].term).to.equal('dropped')
  })

  it('_handleDragDrop removes duplicate before adding', async () => {
    el.tagList = [{ term: 'dropped', color: 'grey' }]
    const e = {
      preventDefault() {},
      dataTransfer: {
        getData() { return JSON.stringify({ term: 'dropped', color: 'blue' }) },
      },
    }
    el._handleDragDrop(e)
    expect(el.tagList.length).to.equal(1)
  })

  it('_handleDragDrop clears classes after drop', async () => {
    el.classList.add('drag-focus', 'drop-possible')
    const e = {
      preventDefault() {},
      dataTransfer: {
        getData() { return JSON.stringify({ term: 'test', color: 'grey' }) },
      },
    }
    el._handleDragDrop(e)
    expect(el.classList.contains('drag-focus')).to.equal(false)
    expect(el.classList.contains('drop-possible')).to.equal(false)
  })

  it('_handleGlobalTagDrag adds drop-possible class', () => {
    el._handleGlobalTagDrag({})
    expect(el.classList.contains('drop-possible')).to.equal(true)
  })

  it('_handleGlobalTagDrop removes drop-possible class', () => {
    el.classList.add('drop-possible')
    el._handleGlobalTagDrop({})
    expect(el.classList.contains('drop-possible')).to.equal(false)
  })

  it('validate sets error when required and no value', () => {
    el.required = true
    el.value = ''
    el.error = false
    el.validate()
    expect(el.error).to.equal(true)
  })

  it('validate returns true when not required', () => {
    el.required = false
    el.error = false
    expect(el.validate()).to.equal(true)
  })

  it('_fireTagListChanged dispatches event', async () => {
    setTimeout(() => el._fireTagListChanged())
    const e = await oneEvent(el, 'simple-fields-tag-list-changed')
    expect(e.detail).to.equal(el)
  })

  it('slottedFieldObserver is undefined (overridden)', () => {
    expect(el.slottedFieldObserver).to.equal(undefined)
  })

  it('_fireValueChanged dispatches value-changed event', async () => {
    setTimeout(() => el._fireValueChanged())
    const e = await oneEvent(el, 'value-changed')
    expect(e.detail).to.equal(el)
  })

  it('tagList change fires simple-fields-tag-list-changed event', async () => {
    setTimeout(() => { el.tagList = [{ term: 'new', color: 'grey' }] })
    const e = await oneEvent(el, 'simple-fields-tag-list-changed')
    expect(e.detail).to.equal(el)
  })

  it('renders simple-tag elements in prefixTemplate slot', async () => {
    el.tagList = [
      { term: 'tag1', color: 'grey' },
      { term: 'tag2', color: 'blue' },
    ]
    await el.updateComplete
    const tags = el.shadowRoot.querySelectorAll('simple-tag')
    expect(tags.length).to.equal(2)
  })
})
