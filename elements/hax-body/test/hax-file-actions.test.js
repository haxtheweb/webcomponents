import { fixture, expect, html, oneEvent } from '@open-wc/testing'

import '../lib/hax-file-actions.js'
import { SCALE_PRESETS, COMPRESS_PRESETS } from '../lib/hax-file-actions.js'

describe('hax-file-actions', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<hax-file-actions></hax-file-actions>`)
    await el.updateComplete
  })

  it('instantiates with default props', () => {
    expect(el.tagName.toLowerCase()).to.equal('hax-file-actions')
    expect(el.selectedCount).to.equal(0)
    expect(el.imageCount).to.equal(0)
    expect(el.canScale).to.equal(false)
    expect(el.busy).to.equal(false)
    expect(el.mode).to.equal('bulk')
  })

  it('exports SCALE_PRESETS and COMPRESS_PRESETS', () => {
    expect(SCALE_PRESETS).to.exist
    expect(SCALE_PRESETS.xs.width).to.equal(150)
    expect(SCALE_PRESETS.xl.width).to.equal(1920)
    expect(COMPRESS_PRESETS).to.exist
    expect(COMPRESS_PRESETS.light.quality).to.equal(90)
    expect(COMPRESS_PRESETS.maximum.quality).to.equal(30)
  })

  describe('_isFieldMode', () => {
    it('returns true for field mode', () => {
      el.mode = 'field'
      expect(el._isFieldMode).to.equal(true)
    })

    it('returns false for bulk mode', () => {
      el.mode = 'bulk'
      expect(el._isFieldMode).to.equal(false)
    })

    it('returns false for empty mode', () => {
      el.mode = ''
      expect(el._isFieldMode).to.equal(false)
    })

    it('is case-insensitive', () => {
      el.mode = 'FIELD'
      expect(el._isFieldMode).to.equal(true)
    })
  })

  describe('actionItems getter (bulk mode)', () => {
    beforeEach(() => {
      el.mode = 'bulk'
    })

    it('includes placeholder item', () => {
      el.selectedCount = 1
      const items = el.actionItems
      expect(items[0].value).to.equal('')
      expect(items[0].text).to.contain('Choose')
    })

    it('includes insert standalone for single image', () => {
      el.selectedCount = 1
      el.imageCount = 1
      const items = el.actionItems
      const insertItems = items.filter((i) => i.value === 'insert:standalone')
      expect(insertItems.length).to.equal(1)
    })

    it('includes insert gallery and standalone for multiple images', () => {
      el.selectedCount = 3
      el.imageCount = 3
      const items = el.actionItems
      const galleryItems = items.filter((i) => i.value === 'insert:gallery')
      expect(galleryItems.length).to.equal(1)
      const standaloneItems = items.filter(
        (i) => i.value === 'insert:standalone',
      )
      expect(standaloneItems.length).to.equal(1)
    })

    it('includes duplicate, rename, delete', () => {
      el.selectedCount = 1
      const items = el.actionItems
      expect(items.some((i) => i.value === 'duplicate:duplicate')).to.equal(true)
      expect(items.some((i) => i.value === 'rename:rename')).to.equal(true)
      expect(items.some((i) => i.value === 'delete:delete')).to.equal(true)
    })

    it('includes transform/compress/scale when canScale', () => {
      el.selectedCount = 1
      el.canScale = true
      const items = el.actionItems
      expect(items.some((i) => i.value === 'transform:convert-jpg')).to.equal(
        true,
      )
      expect(items.some((i) => i.value === 'transform:sepia')).to.equal(true)
      expect(items.some((i) => i.value === 'rotate:rotate-90')).to.equal(true)
      expect(items.some((i) => i.value === 'compress:light')).to.equal(true)
      expect(items.some((i) => i.value === 'scale:xs')).to.equal(true)
    })

    it('omits transform items when canScale is false', () => {
      el.selectedCount = 1
      el.canScale = false
      const items = el.actionItems
      expect(items.some((i) => i.value === 'transform:sepia')).to.equal(false)
      expect(items.some((i) => i.value === 'compress:light')).to.equal(false)
    })
  })

  describe('actionItems getter (field mode)', () => {
    beforeEach(() => {
      el.mode = 'field'
      el.canScale = true
    })

    it('omits Operations group', () => {
      const items = el.actionItems
      expect(items.some((i) => i.group === 'Operations')).to.equal(false)
    })

    it('includes Transform group', () => {
      const items = el.actionItems
      expect(items.some((i) => i.group === 'Transform')).to.equal(true)
    })
  })

  describe('_dispatchAction', () => {
    it('dispatches hax-file-action event', async () => {
      const listener = oneEvent(el, 'hax-file-action')
      el._dispatchAction('transform', 'sepia')
      const e = await listener
      expect(e.detail.action).to.equal('transform')
      expect(e.detail.value).to.equal('sepia')
    })
  })

  describe('_onAction', () => {
    it('parses action:value and dispatches', async () => {
      el.selectedCount = 1
      const listener = oneEvent(el, 'hax-file-action')
      el._onAction({ detail: { value: 'compress:medium' } })
      const e = await listener
      expect(e.detail.action).to.equal('compress')
      expect(e.detail.value).to.equal('medium')
    })

    it('does nothing when busy', async () => {
      el.selectedCount = 1
      el.busy = true
      let dispatched = false
      el.addEventListener('hax-file-action', () => (dispatched = true))
      el._onAction({ detail: { value: 'compress:medium' } })
      expect(dispatched).to.equal(false)
    })

    it('does nothing when selectedCount < 1', async () => {
      el.selectedCount = 0
      let dispatched = false
      el.addEventListener('hax-file-action', () => (dispatched = true))
      el._onAction({ detail: { value: 'compress:medium' } })
      expect(dispatched).to.equal(false)
    })

    it('does nothing for empty value', async () => {
      el.selectedCount = 1
      let dispatched = false
      el.addEventListener('hax-file-action', () => (dispatched = true))
      el._onAction({ detail: { value: '' } })
      expect(dispatched).to.equal(false)
    })

    it('handles action without colon separator', async () => {
      el.selectedCount = 1
      const listener = oneEvent(el, 'hax-file-action')
      el._onAction({ detail: { value: 'customaction' } })
      const e = await listener
      expect(e.detail.action).to.equal('customaction')
      expect(e.detail.value).to.equal('')
    })
  })
})
