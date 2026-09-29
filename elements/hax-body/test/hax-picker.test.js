import { fixture, expect, html, oneEvent } from '@open-wc/testing'

import '../lib/hax-picker.js'
import { HAXStore } from '../lib/hax-store.js'

describe('hax-picker', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<hax-picker></hax-picker>`)
    await el.updateComplete
  })

  it('instantiates with default props', () => {
    expect(el.tagName.toLowerCase()).to.equal('hax-picker')
    expect(el._elements).to.deep.equal([])
    expect(el.selectionList).to.deep.equal([])
    expect(el.pickerType).to.equal('gizmo')
    expect(el.activePreview).to.be.null
  })

  describe('buildOptions gizmo type', () => {
    it('builds selectionList from gizmo elements', () => {
      const elements = [
        {
          gizmo: {
            icon: 'icons:add',
            title: 'Add',
            color: 'blue',
            tag: 'my-element',
            keywords: ['text', 'content'],
          },
        },
        {
          gizmo: {
            icon: 'icons:edit',
            title: 'Edit',
            color: 'red',
            tag: 'edit-element',
            keywords: ['image'],
          },
        },
      ]
      el.buildOptions(elements, 'element', 'Pick one', 'gizmo')
      expect(el.pickerType).to.equal('gizmo')
      expect(el.selectionList.length).to.equal(2)
      expect(el.selectionList[0].title).to.equal('Add')
      expect(el.selectionList[0].tag).to.equal('my-element')
      expect(el.selectionList[0].keywords).to.deep.equal(['text', 'content'])
    })

    it('populates keywords from gizmo keywords', () => {
      const elements = [
        {
          gizmo: {
            icon: 'i',
            title: 'T',
            color: 'c',
            tag: 'tag',
            keywords: ['Alpha', 'Beta'],
          },
        },
      ]
      el.buildOptions(elements, 'element', 'Pick', 'gizmo')
      expect(el.keywords).to.have.property('alpha')
      expect(el.keywords).to.have.property('beta')
    })
  })

  describe('buildOptions app type', () => {
    it('builds selectionList from app elements', () => {
      const elements = [
        {
          details: {
            icon: 'app:icon',
            title: 'App1',
            color: 'green',
            tags: ['media', 'video'],
          },
        },
      ]
      el.buildOptions(elements, 'app', 'Pick app', 'app')
      expect(el.pickerType).to.equal('app')
      expect(el.selectionList.length).to.equal(1)
      expect(el.selectionList[0].title).to.equal('App1')
    })
  })

  describe('buildOptions default type', () => {
    it('passes elements through unchanged for unknown type', () => {
      const elements = [{ title: 'raw' }]
      el.buildOptions(elements, 'element', 'Pick', 'unknown')
      expect(el.selectionList).to.deep.equal(elements)
    })
  })

  describe('_isFiltered', () => {
    it('returns true when filter is off', () => {
      el.filterOn = false
      el.filters = []
      expect(el._isFiltered(['a', 'b'])).to.equal(true)
    })

    it('returns true when filters is empty', () => {
      el.filterOn = true
      el.filters = []
      expect(el._isFiltered(['a', 'b'])).to.equal(true)
    })

    it('returns true when keywords match a filter', () => {
      el.filterOn = true
      el.filters = ['text']
      expect(el._isFiltered(['text', 'image'])).to.equal(true)
    })

    it('returns false when keywords do not match any filter', () => {
      el.filterOn = true
      el.filters = ['video']
      expect(el._isFiltered(['text', 'image'])).to.equal(false)
    })
  })

  describe('_selected', () => {
    it('dispatches hax-insert-content for gizmo type', async () => {
      el.pickerType = 'gizmo'
      el._elements = [{ tag: 'test-tag' }]
      const listener = oneEvent(el, 'hax-insert-content')
      const fakeEvent = {
        target: { getAttribute: () => '0' },
        preventDefault: () => {},
        stopPropagation: () => {},
      }
      el._selected(fakeEvent)
      const e = await listener
      expect(e.detail.tag).to.equal('test-tag')
      expect(e.detail.replace).to.equal(true)
    })

    it('dispatches hax-app-picker-selection for app type', async () => {
      el.pickerType = 'app'
      el._elements = [{ details: { tag: 'app1' } }]
      const listener = oneEvent(el, 'hax-app-picker-selection')
      const fakeEvent = {
        target: { getAttribute: () => '0' },
        preventDefault: () => {},
        stopPropagation: () => {},
      }
      el._selected(fakeEvent)
      const e = await listener
      expect(e.detail).to.deep.equal({ details: { tag: 'app1' } })
    })
  })

  describe('close', () => {
    it('dispatches simple-modal-hide and resets activePreview', async () => {
      el.activePreview = 3
      const listener = oneEvent(globalThis, 'simple-modal-hide')
      el.close()
      const e = await listener
      expect(e.type).to.equal('simple-modal-hide')
      expect(el.activePreview).to.be.null
    })
  })
})
