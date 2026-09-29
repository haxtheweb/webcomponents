import { fixture, expect, html, oneEvent } from '@open-wc/testing'

import '../lib/hax-map.js'
import { HaxMap } from '../lib/hax-map.js'
import { HAXStore } from '../lib/hax-store.js'

describe('hax-map', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<hax-map></hax-map>`)
    await el.updateComplete
  })

  it('instantiates', () => {
    expect(el.tagName.toLowerCase()).to.equal('hax-map')
    expect(el.elementList).to.deep.equal([])
    expect(el.dark).to.equal(false)
  })

  it('has static tag', () => {
    expect(HaxMap.tag).to.equal('hax-map')
  })

  describe('indentedElements', () => {
    it('sets parent for null-parent elements to prev heading', () => {
      const list = [
        { tag: 'h2', parent: null },
        { tag: 'p', parent: null },
      ]
      const result = el.indentedElements(list)
      expect(result[0].parent).to.equal('h2')
      expect(result[1].parent).to.equal('h2')
    })

    it('updates prev when encountering heading', () => {
      const list = [
        { tag: 'h2', parent: null },
        { tag: 'p', parent: null },
        { tag: 'h3', parent: null },
        { tag: 'p', parent: null },
      ]
      const result = el.indentedElements(list)
      expect(result[0].parent).to.equal('h2')
      expect(result[1].parent).to.equal('h2')
      expect(result[2].parent).to.equal('h3')
      expect(result[3].parent).to.equal('h3')
    })

    it('sets heading parent to its own tag', () => {
      const list = [{ tag: 'h2', parent: null }]
      const result = el.indentedElements(list)
      expect(result[0].parent).to.equal('h2')
    })

    it('preserves existing non-null parent for non-heading elements', () => {
      const list = [{ tag: 'p', parent: 'div' }]
      const result = el.indentedElements(list)
      expect(result[0].parent).to.equal('div')
    })

    it('defaults prev to h1', () => {
      const list = [{ tag: 'p', parent: null }]
      const result = el.indentedElements(list)
      expect(result[0].parent).to.equal('h1')
    })
  })

  describe('isLocked', () => {
    it('returns true when node has data-hax-lock attribute', () => {
      const node = globalThis.document.createElement('p')
      node.setAttribute('data-hax-lock', 'data-hax-lock')
      el.elementList = [{ node, tag: 'p' }]
      expect(el.isLocked(0)).to.equal(true)
    })

    it('returns false when node does not have data-hax-lock', () => {
      const node = globalThis.document.createElement('p')
      el.elementList = [{ node, tag: 'p' }]
      expect(el.isLocked(0)).to.equal(false)
    })

    it('returns true when parent node has data-hax-lock', () => {
      const parent = globalThis.document.createElement('div')
      parent.setAttribute('data-hax-lock', 'data-hax-lock')
      const node = globalThis.document.createElement('p')
      parent.appendChild(node)
      el.elementList = [{ node, tag: 'p' }]
      expect(el.isLocked(0)).to.equal(true)
    })

    it('returns undefined for invalid index', () => {
      expect(el.isLocked(false)).to.be.undefined
    })
  })

  describe('editItem', () => {
    it('dispatches hax-context-item-selected for valid index', async () => {
      const node = globalThis.document.createElement('p')
      el.elementList = [{ node, tag: 'p' }]
      const listener = oneEvent(el, 'hax-context-item-selected')
      el.editItem(0)
      const e = await listener
      expect(e.detail.target).to.equal(node)
      expect(e.detail.eventName).to.equal('content-edit')
      expect(e.detail.value).to.equal(true)
    })

    it('does not dispatch for invalid index', () => {
      let dispatched = false
      el.addEventListener('hax-context-item-selected', () => (dispatched = true))
      el.editItem(false)
      expect(dispatched).to.equal(false)
    })
  })

  describe('goToItem', () => {
    it('sets HAXStore.activeNode for valid index', () => {
      const node = globalThis.document.createElement('p')
      globalThis.document.body.appendChild(node)
      el.elementList = [{ node, tag: 'p' }]
      el.goToItem(0)
      expect(HAXStore.activeNode).to.equal(node)
      expect(node.classList.contains('blinkfocus')).to.equal(true)
      node.remove()
    })

    it('does nothing for invalid index', () => {
      const originalActive = HAXStore.activeNode
      el.goToItem(false)
      expect(HAXStore.activeNode).to.equal(originalActive)
    })
  })

  describe('itemOp lock', () => {
    it('locks an unlocked node', async () => {
      const node = globalThis.document.createElement('p')
      globalThis.document.body.appendChild(node)
      el.elementList = [{ node, tag: 'p' }]
      const listener = oneEvent(el, 'hax-toggle-active-node-lock')
      el.itemOp(0, 'lock')
      const e = await listener
      expect(e.detail.lock).to.equal(true)
      expect(node.hasAttribute('data-hax-lock')).to.equal(true)
      node.remove()
    })

    it('unlocks a locked node', async () => {
      const node = globalThis.document.createElement('p')
      node.setAttribute('data-hax-lock', 'data-hax-lock')
      globalThis.document.body.appendChild(node)
      el.elementList = [{ node, tag: 'p' }]
      const listener = oneEvent(el, 'hax-toggle-active-node-lock')
      el.itemOp(0, 'lock')
      const e = await listener
      expect(e.detail.lock).to.equal(false)
      expect(node.hasAttribute('data-hax-lock')).to.equal(false)
      node.remove()
    })
  })

  describe('itemOp delete', () => {
    it('calls haxDeleteNode on activeHaxBody', () => {
      let deleteCalled = false
      let deletedNode = null
      const node = globalThis.document.createElement('p')
      globalThis.document.body.appendChild(node)
      const originalBody = HAXStore.activeHaxBody
      HAXStore.activeHaxBody = {
        haxDeleteNode: (n) => {
          deleteCalled = true
          deletedNode = n
        },
      }
      el.elementList = [{ node, tag: 'p' }]
      el.itemOp(0, 'delete')
      expect(deleteCalled).to.equal(true)
      expect(deletedNode).to.equal(node)
      HAXStore.activeHaxBody = originalBody
      node.remove()
    })
  })

  describe('_scheduleMapRefresh', () => {
    it('does nothing when hidden', () => {
      el.hidden = true
      expect(() => el._scheduleMapRefresh(0)).to.not.throw()
    })
  })
})
