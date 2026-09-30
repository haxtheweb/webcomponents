import { fixture, expect, html, oneEvent } from '@open-wc/testing'

import '../lib/hax-context-item.js'
import { HAXStore } from '../lib/hax-store.js'

describe('hax-context-item', () => {
  let el
  let originalSelection
  let originalTmpSelection

  beforeEach(async () => {
    originalSelection = HAXStore.getSelection
    originalTmpSelection = HAXStore._tmpSelection
    HAXStore.getSelection = () => ({ rangeCount: 0 })
    HAXStore._tmpSelection = null
    el = await fixture(
      html`<hax-context-item event-name="bold"></hax-context-item>`,
    )
    await el.updateComplete
  })

  afterEach(() => {
    HAXStore.getSelection = originalSelection
    HAXStore._tmpSelection = originalTmpSelection
  })

  it('instantiates with default props', () => {
    expect(el.tagName.toLowerCase()).to.equal('hax-context-item')
    expect(el.eventName).to.equal('bold')
    expect(el.action).to.equal(false)
    expect(el.more).to.equal(false)
    expect(el.value).to.equal('')
    expect(el.haxUIElement).to.equal(true)
  })

  describe('_handleMousedown', () => {
    it('sets _tmpSelection from HAXStore.getSelection when not disabled', () => {
      el.disabled = false
      HAXStore._tmpSelection = null
      el._handleMousedown({})
      expect(HAXStore._tmpSelection).to.exist
    })

    it('does not set _tmpSelection when disabled', () => {
      el.disabled = true
      HAXStore._tmpSelection = null
      el._handleMousedown({})
      expect(HAXStore._tmpSelection).to.be.null
    })
  })

  describe('_handleClick', () => {
    it('dispatches hax-context-item-selected when not disabled', async () => {
      el.disabled = false
      el.eventName = 'bold'
      el.value = 'v'
      const listener = oneEvent(el, 'hax-context-item-selected')
      el._handleClick({})
      const e = await listener
      expect(e.detail.eventName).to.equal('bold')
      expect(e.detail.value).to.equal('v')
      expect(e.detail.target).to.equal(el)
    })

    it('does not dispatch when disabled', () => {
      el.disabled = true
      let dispatched = false
      el.addEventListener('hax-context-item-selected', () => (dispatched = true))
      el._handleClick({})
      expect(dispatched).to.equal(false)
    })
  })

  it('reflects label attribute', async () => {
    el.label = 'My Label'
    await el.updateComplete
    expect(el.getAttribute('label')).to.equal('My Label')
  })

  it('reflects description attribute', async () => {
    el.description = 'A description'
    await el.updateComplete
    expect(el.getAttribute('description')).to.equal('A description')
  })
})
