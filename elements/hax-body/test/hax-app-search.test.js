import { fixture, expect, html } from '@open-wc/testing'

import '../lib/hax-app-search.js'

describe('hax-app-search', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<hax-app-search></hax-app-search>`)
    await el.updateComplete
  })

  it('instantiates with default props', () => {
    expect(el.tagName.toLowerCase()).to.equal('hax-app-search')
    expect(el.auto).to.equal(false)
    expect(el.method).to.equal('GET')
    expect(el.loading).to.equal(false)
    expect(el.media).to.deep.equal([])
    expect(el.resultMap).to.deep.equal({})
    expect(el.requestParams).to.deep.equal({})
  })

  describe('requestUrl', () => {
    it('appends query string with ?', () => {
      const url = el.requestUrl('https://example.com/api', { q: 'test' })
      expect(url).to.equal('https://example.com/api?q=test')
    })

    it('appends query string with & when url already has ?', () => {
      const url = el.requestUrl('https://example.com/api?x=1', { q: 'test' })
      expect(url).to.equal('https://example.com/api?x=1&q=test')
    })

    it('strips site_token from params', () => {
      const url = el.requestUrl('https://example.com/api', {
        site_token: 'abc',
        q: 'test',
      })
      expect(url).to.not.contain('site_token')
      expect(url).to.contain('q=test')
    })

    it('strips siteToken (camelCase) from params', () => {
      const url = el.requestUrl('https://example.com/api', {
        siteToken: 'abc',
        q: 'test',
      })
      expect(url).to.not.contain('siteToken')
      expect(url).to.contain('q=test')
    })

    it('returns url unchanged when no params', () => {
      const url = el.requestUrl('https://example.com/api', {})
      expect(url).to.equal('https://example.com/api')
    })
  })

  describe('queryStringData', () => {
    it('encodes simple key=value pairs', () => {
      const qs = el.queryStringData({ a: '1', b: '2' })
      expect(qs).to.equal('a=1&b=2')
    })

    it('encodes array values as repeated keys', () => {
      const qs = el.queryStringData({ tags: ['x', 'y'] })
      expect(qs).to.equal('tags=x&tags=y')
    })

    it('omits internal keys', () => {
      const qs = el.queryStringData({
        __HAXAPPENDUPLOADENDPOINT__: 'x',
        site_token: 'y',
        siteToken: 'z',
        q: 'test',
      })
      expect(qs).to.equal('q=test')
    })

    it('handles null values by emitting key only', () => {
      const qs = el.queryStringData({ flag: null })
      expect(qs).to.equal('flag')
    })

    it('encodes special characters', () => {
      const qs = el.queryStringData({ q: 'hello world & friends' })
      expect(qs).to.contain('q=hello%20world%20%26%20friends')
    })
  })

  describe('isV1ApiRequest', () => {
    it('returns false for empty string', () => {
      expect(el.isV1ApiRequest('')).to.equal(false)
      expect(el.isV1ApiRequest('   ')).to.equal(false)
    })

    it('returns true for /x/api/v1 path', () => {
      expect(el.isV1ApiRequest('https://example.com/x/api/v1/search')).to.equal(
        true,
      )
    })

    it('returns true for /x/api/v1/ path with trailing slash', () => {
      expect(el.isV1ApiRequest('/x/api/v1/')).to.equal(true)
    })

    it('returns false for non-v1 path', () => {
      expect(el.isV1ApiRequest('https://example.com/api/v2/search')).to.equal(
        false,
      )
    })

    it('returns false for unrelated path', () => {
      expect(el.isV1ApiRequest('https://example.com/search')).to.equal(false)
    })

    it('returns true for relative /x/api/v1/path', () => {
      expect(el.isV1ApiRequest('/x/api/v1/tags')).to.equal(true)
    })

    it('handles path with query string', () => {
      expect(
        el.isV1ApiRequest('https://example.com/x/api/v1/search?q=test'),
      ).to.equal(true)
    })
  })

  describe('buildRequestHeaders', () => {
    it('returns empty object when no headers or params', () => {
      const headers = el.buildRequestHeaders({}, '')
      expect(headers).to.deep.equal({})
    })

    it('preserves existing headers', () => {
      el.headers = { 'X-Custom': 'val' }
      const headers = el.buildRequestHeaders({}, '')
      expect(headers['X-Custom']).to.equal('val')
    })

    it('adds X-HAXCMS-Site-Token from site_token param', () => {
      const headers = el.buildRequestHeaders({ site_token: 'tok123' }, '')
      expect(headers['X-HAXCMS-Site-Token']).to.equal('tok123')
    })

    it('adds X-HAXCMS-Site-Token from siteToken param', () => {
      const headers = el.buildRequestHeaders({ siteToken: 'tok456' }, '')
      expect(headers['X-HAXCMS-Site-Token']).to.equal('tok456')
    })

    it('does not overwrite existing X-HAXCMS-Site-Token', () => {
      el.headers = { 'X-HAXCMS-Site-Token': 'existing' }
      const headers = el.buildRequestHeaders({ site_token: 'new' }, '')
      expect(headers['X-HAXCMS-Site-Token']).to.equal('existing')
    })

    it('does not overwrite existing lowercase x-haxcms-site-token', () => {
      el.headers = { 'x-haxcms-site-token': 'existing' }
      const headers = el.buildRequestHeaders({ site_token: 'new' }, '')
      expect(headers['x-haxcms-site-token']).to.equal('existing')
    })

    it('trims whitespace from site_token', () => {
      const headers = el.buildRequestHeaders({ site_token: '  tok  ' }, '')
      expect(headers['X-HAXCMS-Site-Token']).to.equal('tok')
    })

    it('ignores empty site_token', () => {
      const headers = el.buildRequestHeaders({ site_token: '   ' }, '')
      expect(headers['X-HAXCMS-Site-Token']).to.be.undefined
    })
  })

  describe('_resolveObjectPath', () => {
    it('resolves simple path', () => {
      const obj = { a: { b: { c: 42 } } }
      expect(el._resolveObjectPath('a.b.c', obj)).to.equal(42)
    })

    it('resolves top-level key', () => {
      const obj = { a: 1 }
      expect(el._resolveObjectPath('a', obj)).to.equal(1)
    })

    it('returns null for missing path', () => {
      const obj = { a: 1 }
      expect(el._resolveObjectPath('a.b.c', obj)).to.be.null
    })

    it('handles null obj gracefully', () => {
      const result = el._resolveObjectPath('nonexistent.deep.path', null)
      expect(result).to.satisfy((v) => v === null || v === undefined)
    })
  })

  describe('updateSearchValues', () => {
    it('adds non-empty values to requestParams', () => {
      el.requestParams = { existing: 'val' }
      el.updateSearchValues({ q: 'test' })
      expect(el.requestParams.q).to.equal('test')
      expect(el.requestParams.existing).to.equal('val')
    })

    it('removes empty values from requestParams', () => {
      el.requestParams = { q: 'old', other: 'keep' }
      el.updateSearchValues({ q: '' })
      expect(el.requestParams.q).to.be.undefined
      expect(el.requestParams.other).to.equal('keep')
    })

    it('creates new requestParams object reference', () => {
      el.requestParams = { q: 'old' }
      const original = el.requestParams
      el.updateSearchValues({ q: 'new' })
      expect(el.requestParams).to.not.equal(original)
    })
  })

  describe('_requestDataChanged', () => {
    it('returns media array and sets loading false', () => {
      el.resultMap = {
        items: null,
        preview: { title: 'title', details: 'details', id: 'id' },
        defaultGizmoType: '*',
        gizmo: { id: 'id' },
      }
      el.loading = true
      const result = el._requestDataChanged([
        { title: 'A', details: 'desc', id: '1' },
      ])
      expect(el.loading).to.equal(false)
      expect(Array.isArray(result)).to.equal(true)
    })

    it('handles null data gracefully', () => {
      el.resultMap = {
        preview: { title: 'title', details: 'details', id: 'id' },
        defaultGizmoType: '*',
        gizmo: { id: 'id' },
      }
      el.loading = true
      const result = el._requestDataChanged(null)
      expect(el.loading).to.equal(false)
    })
  })
})
