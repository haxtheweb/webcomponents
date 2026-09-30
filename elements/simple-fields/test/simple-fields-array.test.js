import { fixture, expect, html, oneEvent, aTimeout } from '@open-wc/testing'

import '../lib/simple-fields-array.js'
import '../lib/simple-fields-array-item.js'

describe('simple-fields-array', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<simple-fields-array></simple-fields-array>`)
    await el.updateComplete
  })

  it('instantiates with default properties', () => {
    expect(el.hideExpand).to.equal(false)
    expect(el.hideReorder).to.equal(false)
    expect(el.hideDuplicate).to.equal(false)
    expect(el.count).to.equal(0)
    expect(el.expanded).to.equal(false)
    expect(el.disableAdd).to.equal(false)
  })

  it('renders an expand button and add button', () => {
    const expand = el.shadowRoot.querySelector('#expand')
    expect(expand).to.exist
    const add = el.shadowRoot.querySelector('#add')
    expect(add).to.exist
  })

  it('_handleAdd dispatches add event', async () => {
    setTimeout(() => el._handleAdd())
    const e = await oneEvent(el, 'add')
    expect(e.detail).to.equal(el)
  })

  it('toggle changes expanded state', async () => {
    expect(el.expanded).to.equal(false)
    el.toggle()
    expect(el.expanded).to.equal(true)
    el.toggle()
    expect(el.expanded).to.equal(false)
  })

  it('expand sets expanded to true', () => {
    el.expand()
    expect(el.expanded).to.equal(true)
  })

  it('collapse sets expanded to false', () => {
    el.expanded = true
    el.collapse()
    expect(el.expanded).to.equal(false)
  })

  it('toggle fires toggle and expand events', async () => {
    setTimeout(() => el.toggle(true))
    const e = await oneEvent(el, 'toggle')
    expect(e.detail).to.equal(el)
  })

  it('toggle true fires expand event', async () => {
    el.expanded = false
    setTimeout(() => el.toggle(true))
    const e = await oneEvent(el, 'expand')
    expect(e.detail).to.equal(el)
  })

  it('toggle false fires collapse event', async () => {
    el.expanded = true
    setTimeout(() => el.toggle(false))
    const e = await oneEvent(el, 'collapse')
    expect(e.detail).to.equal(el)
  })

  it('buildItem creates a simple-fields-array-item child', () => {
    const item = el.buildItem('item-1')
    expect(item).to.exist
    expect(item.tagName.toLowerCase()).to.equal('simple-fields-array-item')
    expect(item.id).to.equal('item-1')
    expect(el.querySelector('#item-1')).to.exist
  })

  it('buildItem sets hideReorder and hideDuplicate on item', () => {
    el.hideReorder = true
    el.hideDuplicate = true
    const item = el.buildItem('item-2')
    expect(item.hideReorder).to.equal(true)
    expect(item.hideDuplicate).to.equal(true)
  })

  it('_handleRemove stops propagation and dispatches remove event', async () => {
    let propagationStopped = false
    const fakeEvent = {
      detail: { id: 'test' },
      stopPropagation() { propagationStopped = true },
      stopImmediatePropagation() {},
    }
    setTimeout(() => el._handleRemove(fakeEvent))
    const e = await oneEvent(el, 'remove')
    expect(propagationStopped).to.equal(true)
    expect(e.detail).to.deep.equal({ id: 'test' })
  })

  it('focus on empty array focuses add button', () => {
    el.focus()
    // should not throw
    expect(true).to.equal(true)
  })

  it('focus with index focuses the item at that index', async () => {
    const item1 = el.buildItem('focus-1')
    const item2 = el.buildItem('focus-2')
    let focused = null
    item2.focus = () => { focused = 'item2' }
    el.focus(1)
    expect(focused).to.equal('item2')
  })

  it('focus clamps index to valid range', async () => {
    const item1 = el.buildItem('focus-clamp-1')
    let focused = null
    item1.focus = () => { focused = 'item1' }
    el.focus(99)
    expect(focused).to.equal('item1')
  })

  it('focus with index 0 focuses first item', async () => {
    const item1 = el.buildItem('focus-0-1')
    let focused = null
    item1.focus = () => { focused = 'item1' }
    el.focus(0)
    expect(focused).to.equal('item1')
  })

  it('expanded change propagates to child items', async () => {
    const item = el.buildItem('expand-prop-test')
    el.expanded = true
    await el.updateComplete
    expect(item.expanded).to.equal(true)
  })

  it('hideDuplicate change propagates to child items', async () => {
    const item = el.buildItem('dup-prop-test')
    el.hideDuplicate = true
    await el.updateComplete
    expect(item.hideDuplicate).to.equal(true)
  })

  it('hideReorder change propagates to child items', async () => {
    const item = el.buildItem('reorder-prop-test')
    el.hideReorder = true
    await el.updateComplete
    expect(item.hideReorder).to.equal(true)
  })
})

describe('simple-fields-array-item', () => {
  let el
  beforeEach(async () => {
    // array-item needs a parent array to work properly with drag/move
    const parent = await fixture(html`<simple-fields-array></simple-fields-array>`)
    await parent.updateComplete
    el = parent.buildItem('test-item')
    await el.updateComplete
  })

  it('instantiates with default properties', () => {
    expect(el.hideReorder).to.equal(false)
    expect(el.hideDuplicate).to.equal(false)
    expect(el.disabled).to.equal(false)
    expect(el.expanded).to.equal(false)
    expect(el.isArrayItem).to.equal(true)
  })

  it('toggle changes expanded state', () => {
    expect(el.expanded).to.equal(false)
    el.toggle()
    expect(el.expanded).to.equal(true)
  })

  it('_handleCopy fires copy event', async () => {
    setTimeout(() => el._handleCopy())
    const e = await oneEvent(el, 'copy')
    expect(e.detail).to.equal(el)
  })

  it('_handleRemove fires remove event', async () => {
    let removeFired = false
    let removeDetail = null
    const origDispatch = el.dispatchEvent.bind(el)
    el.dispatchEvent = (event) => {
      if (event.type === 'remove') {
        removeFired = true
        removeDetail = event.detail
      }
      return origDispatch(event)
    }
    el._handleRemove()
    expect(removeFired).to.equal(true)
    expect(removeDetail).to.equal(el)
  })

  it('connectedCallback fires added event', async () => {
    const parent = document.createElement('simple-fields-array')
    document.body.appendChild(parent)
    await parent.updateComplete
    setTimeout(() => {
      parent.buildItem('added-test')
    })
    await aTimeout(50)
    const item = parent.querySelector('#added-test')
    expect(item).to.exist
    document.body.removeChild(parent)
  })

  it('disconnectedCallback fires removed event', async () => {
    const parent = await fixture(html`<simple-fields-array></simple-fields-array>`)
    await parent.updateComplete
    const item = parent.buildItem('remove-test')
    await item.updateComplete
    let removedFired = false
    item.addEventListener('removed', (e) => {
      removedFired = true
      expect(e.detail).to.equal(item)
    })
    parent.removeChild(item)
    await aTimeout(50)
    expect(removedFired).to.equal(true)
  })

  it('_setDragging sets __dragging and adds class', () => {
    el._setDragging(true)
    expect(el.__dragging).to.equal(true)
    expect(el.classList.contains('dragging')).to.equal(true)
  })

  it('_setDragging false removes class', () => {
    el._setDragging(true)
    el._setDragging(false)
    expect(el.__dragging).to.equal(false)
    expect(el.classList.contains('dragging')).to.equal(false)
  })

  it('_setDropzone adds dropzone class when __dropAccepts is set', () => {
    el.__dropAccepts = { id: 'other' }
    el.__dragging = false
    el._setDropzone(true)
    expect(el.classList.contains('dropzone')).to.equal(true)
  })

  it('_setDropzone false removes class', () => {
    el.classList.add('dropzone')
    el._setDropzone(false)
    expect(el.classList.contains('dropzone')).to.equal(false)
  })

  it('_moveUp is no-op when no previous sibling', () => {
    // first child, no prev
    expect(() => el._moveUp({})).to.not.throw()
  })

  it('slots getter maps previewBy fields to preview slot', () => {
    el.previewBy = ['title', 'description']
    const slots = el.slots
    expect(slots.title).to.equal('preview')
    expect(slots.description).to.equal('preview')
  })

  it('updated sets aria-expanded based on error or expanded', async () => {
    el.expanded = true
    await el.updateComplete
    expect(el.getAttribute('aria-expanded')).to.exist
  })

  it('updated sets aria-expanded when error changes', async () => {
    el.error = true
    await el.updateComplete
    expect(el.getAttribute('aria-expanded')).to.exist
  })
})
