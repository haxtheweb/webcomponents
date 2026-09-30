import { fixture, expect, html } from '@open-wc/testing'

import '../lib/hax-stax-browser.js'

describe('hax-stax-browser', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<hax-stax-browser></hax-stax-browser>`)
    await el.updateComplete
  })

  it('instantiates with default props', () => {
    expect(el.tagName.toLowerCase()).to.equal('hax-stax-browser')
    expect(el.staxList).to.deep.equal([])
    expect(el.label).to.equal('Templates')
    expect(el.templateType).to.equal('area')
  })

  describe('filteredStaxList', () => {
    it('returns all when templateType is all', () => {
      el.staxList = [
        { details: { title: 'A', templateType: 'area' } },
        { details: { title: 'B', templateType: 'page' } },
      ]
      el.templateType = 'all'
      expect(el.filteredStaxList.length).to.equal(2)
    })

    it('filters by area when templateType is area', () => {
      el.staxList = [
        { details: { title: 'A', templateType: 'area' } },
        { details: { title: 'B', templateType: 'page' } },
      ]
      el.templateType = 'area'
      const filtered = el.filteredStaxList
      expect(filtered.length).to.equal(1)
      expect(filtered[0].details.title).to.equal('A')
    })

    it('filters by page when templateType is page', () => {
      el.staxList = [
        { details: { title: 'A', templateType: 'area' } },
        { details: { title: 'B', templateType: 'page' } },
      ]
      el.templateType = 'page'
      const filtered = el.filteredStaxList
      expect(filtered.length).to.equal(1)
      expect(filtered[0].details.title).to.equal('B')
    })

    it('defaults to area when stax has no templateType', () => {
      el.staxList = [
        { details: { title: 'NoType' } },
        { details: { title: 'Page', templateType: 'page' } },
      ]
      el.templateType = 'area'
      const filtered = el.filteredStaxList
      expect(filtered.length).to.equal(1)
      expect(filtered[0].details.title).to.equal('NoType')
    })

    it('returns empty list when staxList is empty', () => {
      el.staxList = []
      el.templateType = 'all'
      expect(el.filteredStaxList).to.deep.equal([])
    })
  })
})
