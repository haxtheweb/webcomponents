import { fixture, expect, html } from '@open-wc/testing'

import '../lib/hax-gizmo-browser.js'
import { HaxGizmoBrowser } from '../lib/hax-gizmo-browser.js'
import { HAXStore } from '../lib/hax-store.js'

describe('hax-gizmo-browser', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<hax-gizmo-browser></hax-gizmo-browser>`)
    await el.updateComplete
  })

  it('instantiates', () => {
    expect(el.tagName.toLowerCase()).to.equal('hax-gizmo-browser')
    expect(el.items).to.deep.equal([])
    expect(el.categories).to.deep.equal([])
    expect(el.recentGizmoList).to.deep.equal([])
    expect(el.popularGizmoList).to.deep.equal([])
  })

  it('has static tag', () => {
    expect(HaxGizmoBrowser.tag).to.equal('hax-gizmo-browser')
  })

  describe('ucfirst', () => {
    it('capitalizes first letter', () => {
      expect(el.ucfirst('text')).to.equal('Text')
      expect(el.ucfirst('media')).to.equal('Media')
    })

    it('handles empty string', () => {
      expect(el.ucfirst('')).to.equal('')
    })
  })

  describe('updateCategories', () => {
    it('extracts first tag from each gizmo', () => {
      const list = [
        { tags: ['Text', 'content'] },
        { tags: ['Media', 'image'] },
        { tags: ['Text', 'other'] },
      ]
      const cats = el.updateCategories(list)
      expect(cats).to.include('Text')
      expect(cats).to.include('Media')
    })

    it('puts Text first', () => {
      const list = [
        { tags: ['Media'] },
        { tags: ['Text'] },
      ]
      const cats = el.updateCategories(list)
      expect(cats[0]).to.equal('Text')
      expect(cats[1]).to.equal('Media')
    })

    it('puts Other last', () => {
      const list = [
        { tags: ['Other'] },
        { tags: ['Media'] },
      ]
      const cats = el.updateCategories(list)
      expect(cats[cats.length - 1]).to.equal('Other')
    })

    it('sorts regular categories alphabetically', () => {
      const list = [
        { tags: ['Zebra'] },
        { tags: ['Apple'] },
        { tags: ['Mango'] },
      ]
      const cats = el.updateCategories(list)
      expect(cats).to.deep.equal(['Apple', 'Mango', 'Zebra'])
    })

    it('handles empty list', () => {
      const cats = el.updateCategories([])
      expect(cats).to.deep.equal([])
    })

    it('handles gizmos without tags', () => {
      const list = [{}, { tags: ['Text'] }]
      const cats = el.updateCategories(list)
      expect(cats).to.deep.equal(['Text'])
    })

    it('deduplicates categories', () => {
      const list = [
        { tags: ['Text'] },
        { tags: ['Text'] },
        { tags: ['Text'] },
      ]
      const cats = el.updateCategories(list)
      expect(cats).to.deep.equal(['Text'])
    })

    it('orders Text, alpha, Other together', () => {
      const list = [
        { tags: ['Other'] },
        { tags: ['Zebra'] },
        { tags: ['Apple'] },
        { tags: ['Text'] },
      ]
      const cats = el.updateCategories(list)
      expect(cats).to.deep.equal(['Text', 'Apple', 'Zebra', 'Other'])
    })
  })

  describe('_gizmoSearchIndex', () => {
    it('builds index from title and tag', () => {
      const gizmo = { title: 'My Element', tag: 'my-element' }
      const index = el._gizmoSearchIndex(gizmo)
      expect(index).to.contain('My Element')
      expect(index).to.contain('my-element')
    })

    it('includes tags array joined', () => {
      const gizmo = {
        title: 'T',
        tag: 't',
        tags: ['alpha', 'beta'],
      }
      const index = el._gizmoSearchIndex(gizmo)
      expect(index).to.contain('alpha')
      expect(index).to.contain('beta')
    })

    it('includes description', () => {
      const gizmo = {
        title: 'T',
        tag: 't',
        description: 'a cool element',
      }
      const index = el._gizmoSearchIndex(gizmo)
      expect(index).to.contain('a cool element')
    })

    it('includes meta.author', () => {
      const gizmo = {
        title: 'T',
        tag: 't',
        meta: { author: 'someone' },
      }
      const index = el._gizmoSearchIndex(gizmo)
      expect(index).to.contain('someone')
    })

    it('handles missing fields gracefully', () => {
      const gizmo = {}
      const index = el._gizmoSearchIndex(gizmo)
      expect(typeof index).to.equal('string')
    })
  })

  describe('_gizmoAllowedInTray', () => {
    beforeEach(() => {
      // Ensure platformAllows returns true for our tests
      if (HAXStore.platformAllows) {
        HAXStore.platformAllows = () => true
      }
      HAXStore.requiredPrimitives = new Set()
    })

    it('returns false for null gizmo', () => {
      expect(el._gizmoAllowedInTray(null)).to.equal(false)
    })

    it('returns false for gizmo without tag', () => {
      expect(el._gizmoAllowedInTray({})).to.equal(false)
    })

    it('returns false for inlineOnly meta', () => {
      expect(
        el._gizmoAllowedInTray({
          tag: 'test',
          meta: { inlineOnly: true },
        }),
      ).to.equal(false)
    })

    it('returns false for hidden meta', () => {
      expect(
        el._gizmoAllowedInTray({
          tag: 'test',
          meta: { hidden: true },
        }),
      ).to.equal(false)
    })

    it('returns false for requiresParent meta', () => {
      expect(
        el._gizmoAllowedInTray({
          tag: 'test',
          meta: {},
          requiresParent: true,
        }),
      ).to.equal(false)
    })

    it('returns false for platformRestricted when not required primitive', () => {
      expect(
        el._gizmoAllowedInTray({
          tag: 'test',
          platformRestricted: true,
        }),
      ).to.equal(false)
    })

    it('returns true for normal gizmo', () => {
      expect(el._gizmoAllowedInTray({ tag: 'test' })).to.equal(true)
    })

    it('returns true for required primitive even if platform restricted', () => {
      HAXStore.requiredPrimitives = new Set(['test'])
      expect(
        el._gizmoAllowedInTray({
          tag: 'test',
          platformRestricted: true,
        }),
      ).to.equal(true)
    })
  })

  describe('_filterAuxList', () => {
    it('returns list unchanged when no like filter', () => {
      el.like = ''
      const list = [{ title: 'A', tag: 'a' }]
      expect(el._filterAuxList(list)).to.equal(list)
    })

    it('filters list by like query', () => {
      el.like = 'alpha'
      el.caseSensitive = false
      el.multiMatch = false
      const list = [
        { title: 'Alpha Block', tag: 'alpha-block' },
        { title: 'Beta Block', tag: 'beta-block' },
      ]
      const filtered = el._filterAuxList(list)
      expect(filtered.length).to.equal(1)
      expect(filtered[0].title).to.equal('Alpha Block')
    })
  })
})
