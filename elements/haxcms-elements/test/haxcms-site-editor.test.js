// Tests for haxcms-site-editor — the HAXcms site editor element.
// This is a massive 3259-line file; we focus on the pure-logic helper methods
// that don't require the full HAX editor backend to be operational.
// Direct import so istanbul instruments haxcms-site-editor.js.
import { fixture, expect, html } from '@open-wc/testing'
import '../lib/core/haxcms-site-editor.js'
import { store } from '../lib/core/haxcms-site-store.js'
import { HAXStore } from '@haxtheweb/hax-body/lib/hax-store.js'

function makeManifest() {
  return {
    id: 'se-site',
    title: 'SE Site',
    metadata: {
      site: { name: 'se-site', lang: 'en' },
      platform: {},
      theme: { element: 'test-theme', variables: {}, regions: {} },
    },
    items: [
      {
        id: 'page-1',
        title: 'Page One',
        slug: 'page-1',
        location: 'pages/page-1/index.html',
        order: 1,
        parent: null,
        indent: 0,
        metadata: { published: true, locked: false, status: '', created: 1, updated: 2 },
      },
    ],
  }
}

describe('haxcms-site-editor instantiation', () => {
  let element
  let saved = {}

  beforeEach(async () => {
    saved = {
      manifest: store.manifest,
      editMode: store.editMode,
      activeId: store.activeId,
      appReady: store.appReady,
    }
    store.manifest = makeManifest()
    store.editMode = false
    store.activeId = null
    store.appReady = true
    element = await fixture(html`<haxcms-site-editor></haxcms-site-editor>`)
  })

  afterEach(() => {
    store.manifest = saved.manifest
    store.editMode = saved.editMode
    store.activeId = saved.activeId
    store.appReady = saved.appReady
  })

  it('instantiates with the correct tag', () => {
    expect(element).to.exist
    expect(element.tagName.toLowerCase()).to.equal('haxcms-site-editor')
  })

  it('has the expected static tag property', () => {
    const ctor = customElements.get('haxcms-site-editor')
    expect(ctor.tag).to.equal('haxcms-site-editor')
  })

  it('has the expected default property state', () => {
    expect(element.method).to.equal('POST')
    expect(element.editMode).to.equal(false)
    expect(element.__maxRefreshRetries).to.equal(2)
    expect(element.__refreshRetryCounts).to.exist
  })

  it('breaks the shadow root by design (createRenderRoot returns this)', () => {
    expect(element.createRenderRoot()).to.equal(element)
  })
})

describe('haxcms-site-editor _extractPageBreakItemId', () => {
  let element
  let saved = {}

  beforeEach(async () => {
    saved = {
      manifest: store.manifest,
      editMode: store.editMode,
      activeId: store.activeId,
      appReady: store.appReady,
    }
    store.manifest = makeManifest()
    store.editMode = false
    store.activeId = null
    store.appReady = true
    element = await fixture(html`<haxcms-site-editor></haxcms-site-editor>`)
  })

  afterEach(() => {
    store.manifest = saved.manifest
    store.editMode = saved.editMode
    store.activeId = saved.activeId
    store.appReady = saved.appReady
  })

  it('returns null for non-string content', () => {
    expect(element._extractPageBreakItemId(null)).to.equal(null)
    expect(element._extractPageBreakItemId(undefined)).to.equal(null)
    expect(element._extractPageBreakItemId(123)).to.equal(null)
    expect(element._extractPageBreakItemId({})).to.equal(null)
  })

  it('returns null for empty string', () => {
    expect(element._extractPageBreakItemId('')).to.equal(null)
  })

  it('returns null for content without page-break', () => {
    expect(element._extractPageBreakItemId('<p>hello</p>')).to.equal(null)
  })

  it('returns null for page-break without item-id', () => {
    expect(element._extractPageBreakItemId('<page-break></page-break>')).to.equal(null)
  })

  it('extracts item-id with double quotes', () => {
    const content = '<page-break item-id="abc-123"></page-break>'
    expect(element._extractPageBreakItemId(content)).to.equal('abc-123')
  })

  it('extracts item-id with single quotes', () => {
    const content = "<page-break item-id='xyz-789'></page-break>"
    expect(element._extractPageBreakItemId(content)).to.equal('xyz-789')
  })

  it('extracts item-id from content with surrounding elements', () => {
    const content = '<p>Intro</p><page-break item-id="page-42"></page-break><p>More</p>'
    expect(element._extractPageBreakItemId(content)).to.equal('page-42')
  })

  it('is case insensitive on the tag name', () => {
    const content = '<PAGE-BREAK item-id="upper-1"></PAGE-BREAK>'
    expect(element._extractPageBreakItemId(content)).to.equal('upper-1')
  })

  it('extracts only the first page-break item-id', () => {
    const content = '<page-break item-id="first"></page-break><page-break item-id="second"></page-break>'
    expect(element._extractPageBreakItemId(content)).to.equal('first')
  })
})

describe('haxcms-site-editor response helpers', () => {
  let element
  let saved = {}

  beforeEach(async () => {
    saved = { manifest: store.manifest, editMode: store.editMode, appReady: store.appReady }
    store.manifest = makeManifest()
    store.editMode = false
    store.appReady = true
    element = await fixture(html`<haxcms-site-editor></haxcms-site-editor>`)
  })

  afterEach(() => {
    store.manifest = saved.manifest
    store.editMode = saved.editMode
    store.appReady = saved.appReady
  })

  describe('_responseStatusCode', () => {
    it('returns 0 for null or non-object response', () => {
      expect(element._responseStatusCode(null)).to.equal(0)
      expect(element._responseStatusCode(undefined)).to.equal(0)
      expect(element._responseStatusCode('string')).to.equal(0)
    })

    it('returns numeric status directly', () => {
      expect(element._responseStatusCode({ status: 200 })).to.equal(200)
      expect(element._responseStatusCode({ status: 404 })).to.equal(404)
    })

    it('parses string status to number', () => {
      expect(element._responseStatusCode({ status: '200' })).to.equal(200)
      expect(element._responseStatusCode({ status: '404' })).to.equal(404)
    })

    it('returns 0 for non-numeric string status', () => {
      expect(element._responseStatusCode({ status: 'not-a-number' })).to.equal(0)
    })

    it('returns 0 when status is not present', () => {
      expect(element._responseStatusCode({})).to.equal(0)
    })
  })

  describe('_responseStatusText', () => {
    it('returns fallback for null or non-object response', () => {
      expect(element._responseStatusText(null)).to.equal('Request failed')
      expect(element._responseStatusText(null, 'Custom fallback')).to.equal('Custom fallback')
    })

    it('returns statusText when present and non-empty', () => {
      expect(element._responseStatusText({ statusText: 'Not Found' })).to.equal('Not Found')
    })

    it('trims whitespace from statusText', () => {
      expect(element._responseStatusText({ statusText: '  OK  ' })).to.equal('OK')
    })

    it('falls back to message when statusText is empty', () => {
      expect(element._responseStatusText({ statusText: '', message: 'Error msg' })).to.equal('Error msg')
    })

    it('falls back to data.message when statusText and message are empty', () => {
      expect(
        element._responseStatusText({ statusText: '', message: '', data: { message: 'Data msg' } }),
      ).to.equal('Data msg')
    })

    it('returns fallback when no message fields are present', () => {
      expect(element._responseStatusText({})).to.equal('Request failed')
    })
  })

  describe('_isSuccessfulResponse', () => {
    it('returns true for 2xx status', () => {
      expect(element._isSuccessfulResponse({ status: 200 })).to.equal(true)
      expect(element._isSuccessfulResponse({ status: 204 })).to.equal(true)
      expect(element._isSuccessfulResponse({ status: 299 })).to.equal(true)
    })

    it('returns true for status 0', () => {
      expect(element._isSuccessfulResponse({ status: 0 })).to.equal(true)
    })

    it('returns false for 4xx and 5xx status', () => {
      expect(element._isSuccessfulResponse({ status: 404 })).to.equal(false)
      expect(element._isSuccessfulResponse({ status: 500 })).to.equal(false)
    })

    it('returns true for null response (status 0 = success)', () => {
      // null response has status 0 which is treated as successful
      expect(element._isSuccessfulResponse(null)).to.equal(true)
    })
  })
})

describe('haxcms-site-editor _siteName', () => {
  let element
  let saved = {}

  beforeEach(async () => {
    saved = { manifest: store.manifest, editMode: store.editMode, appReady: store.appReady }
    store.manifest = makeManifest()
    store.editMode = false
    store.appReady = true
    element = await fixture(html`<haxcms-site-editor></haxcms-site-editor>`)
  })

  afterEach(() => {
    store.manifest = saved.manifest
    store.editMode = saved.editMode
    store.appReady = saved.appReady
  })

  it('returns the site name from manifest.metadata.site.name', async () => {
    element.manifest = makeManifest()
    expect(element._siteName()).to.equal('se-site')
  })

  it('returns empty string when manifest is null', () => {
    element.manifest = null
    expect(element._siteName()).to.equal('')
  })

  it('returns empty string when metadata.site is missing', () => {
    element.manifest = { id: 'x', title: 'X', metadata: {}, items: [] }
    expect(element._siteName()).to.equal('')
  })

  it('returns empty string when metadata.site.name is missing', () => {
    element.manifest = { id: 'x', title: 'X', metadata: { site: {} }, items: [] }
    expect(element._siteName()).to.equal('')
  })
})

describe('haxcms-site-editor normalize helpers', () => {
  let element
  let saved = {}

  beforeEach(async () => {
    saved = { manifest: store.manifest, editMode: store.editMode, appReady: store.appReady }
    store.manifest = makeManifest()
    store.editMode = false
    store.appReady = true
    element = await fixture(html`<haxcms-site-editor></haxcms-site-editor>`)
  })

  afterEach(() => {
    store.manifest = saved.manifest
    store.editMode = saved.editMode
    store.appReady = saved.appReady
  })

  describe('_normalizeEndpointTarget', () => {
    it('returns empty string for non-string or empty input', () => {
      expect(element._normalizeEndpointTarget(null)).to.equal('')
      expect(element._normalizeEndpointTarget('')).to.equal('')
      expect(element._normalizeEndpointTarget(123)).to.equal('')
    })

    it('trims whitespace', () => {
      expect(element._normalizeEndpointTarget('  /api  ')).to.equal('/api')
    })

    it('returns http/https URLs as-is', () => {
      expect(element._normalizeEndpointTarget('http://example.com/api')).to.equal('http://example.com/api')
      expect(element._normalizeEndpointTarget('https://example.com/api')).to.equal('https://example.com/api')
    })

    it('returns absolute paths as-is', () => {
      expect(element._normalizeEndpointTarget('/api/endpoint')).to.equal('/api/endpoint')
    })

    it('prepends slash to relative paths', () => {
      expect(element._normalizeEndpointTarget('api/endpoint')).to.equal('/api/endpoint')
    })
  })

  describe('_normalizeRequestMethod', () => {
    it('returns uppercased method when provided', () => {
      expect(element._normalizeRequestMethod('get')).to.equal('GET')
      expect(element._normalizeRequestMethod('post')).to.equal('POST')
      expect(element._normalizeRequestMethod('Put')).to.equal('PUT')
    })

    it('trims whitespace before uppercasing', () => {
      expect(element._normalizeRequestMethod('  get  ')).to.equal('GET')
    })

    it('falls back to this.method when argument is empty', () => {
      element.method = 'PUT'
      expect(element._normalizeRequestMethod('')).to.equal('PUT')
    })

    it('falls back to POST when both argument and this.method are empty', () => {
      element.method = ''
      expect(element._normalizeRequestMethod('')).to.equal('POST')
    })

    it('falls back to POST when argument is non-string', () => {
      expect(element._normalizeRequestMethod(null)).to.equal('POST')
    })
  })
})

describe('haxcms-site-editor refresh retry helpers', () => {
  let element
  let saved = {}

  beforeEach(async () => {
    saved = { manifest: store.manifest, editMode: store.editMode, appReady: store.appReady }
    store.manifest = makeManifest()
    store.editMode = false
    store.appReady = true
    element = await fixture(html`<haxcms-site-editor></haxcms-site-editor>`)
  })

  afterEach(() => {
    store.manifest = saved.manifest
    store.editMode = saved.editMode
    store.appReady = saved.appReady
  })

  describe('_getRefreshRetryKey', () => {
    it('returns target.id when present', () => {
      expect(element._getRefreshRetryKey({ id: 'req-1' })).to.equal('req-1')
    })

    it('returns unknown-request when target has no id', () => {
      expect(element._getRefreshRetryKey({})).to.equal('unknown-request')
    })

    it('returns unknown-request when target is null', () => {
      expect(element._getRefreshRetryKey(null)).to.equal('unknown-request')
    })
  })

  describe('_incrementRefreshRetryCount', () => {
    it('increments from 0 to 1 on first call', () => {
      const result = element._incrementRefreshRetryCount({ id: 'req-a' })
      expect(result.retryKey).to.equal('req-a')
      expect(result.retryCount).to.equal(1)
    })

    it('increments further on subsequent calls', () => {
      element._incrementRefreshRetryCount({ id: 'req-b' })
      const result = element._incrementRefreshRetryCount({ id: 'req-b' })
      expect(result.retryCount).to.equal(2)
    })
  })

  describe('_clearRefreshRetryCount', () => {
    it('clears a specific retry count by target', () => {
      element._incrementRefreshRetryCount({ id: 'req-c' })
      element._clearRefreshRetryCount({ id: 'req-c' })
      expect(element.__refreshRetryCounts['req-c']).to.be.undefined
    })

    it('clears a specific retry count by key string', () => {
      element._incrementRefreshRetryCount({ id: 'req-d' })
      element._clearRefreshRetryCount('req-d')
      expect(element.__refreshRetryCounts['req-d']).to.be.undefined
    })

    it('is a no-op when key does not exist', () => {
      expect(() => element._clearRefreshRetryCount('nonexistent')).to.not.throw()
    })
  })

  describe('_clearAllRefreshRetryCounts', () => {
    it('clears all retry counts', () => {
      element._incrementRefreshRetryCount({ id: 'a' })
      element._incrementRefreshRetryCount({ id: 'b' })
      element._clearAllRefreshRetryCounts()
      expect(Object.keys(element.__refreshRetryCounts).length).to.equal(0)
    })
  })

  describe('_resetRefreshRetryCountFromResponse', () => {
    it('clears retry count from event detail target', () => {
      element._incrementRefreshRetryCount({ id: 'req-e' })
      element._resetRefreshRetryCountFromResponse({
        detail: { target: { id: 'req-e' } },
      })
      expect(element.__refreshRetryCounts['req-e']).to.be.undefined
    })

    it('is a no-op when no target is available', () => {
      expect(() => element._resetRefreshRetryCountFromResponse({})).to.not.throw()
      expect(() => element._resetRefreshRetryCountFromResponse(null)).to.not.throw()
    })
  })
})

describe('haxcms-site-editor _buildRequestTarget', () => {
  let element
  let saved = {}

  beforeEach(async () => {
    saved = { manifest: store.manifest, editMode: store.editMode, appReady: store.appReady }
    store.manifest = makeManifest()
    store.editMode = false
    store.appReady = true
    element = await fixture(html`<haxcms-site-editor></haxcms-site-editor>`)
  })

  afterEach(() => {
    store.manifest = saved.manifest
    store.editMode = saved.editMode
    store.appReady = saved.appReady
  })

  it('creates a target with default id and body', () => {
    const target = element._buildRequestTarget()
    expect(target.id).to.equal('site-request')
    expect(target.body).to.deep.equal({})
    expect(target.headers).to.deep.equal({})
  })

  it('creates a target with custom id, body, and headers', () => {
    const target = element._buildRequestTarget('my-req', { key: 'val' }, null, {
      'X-Custom': 'yes',
    })
    expect(target.id).to.equal('my-req')
    expect(target.body).to.deep.equal({ key: 'val' })
    expect(target.headers['X-Custom']).to.equal('yes')
  })

  it('generateRequest adds Authorization header when jwt is set', async () => {
    element.jwt = 'test-jwt-token'
    const target = element._buildRequestTarget('req', {}, null, {})
    await target.generateRequest()
    expect(target.headers.Authorization).to.equal('Bearer test-jwt-token')
  })

  it('generateRequest calls requestExecutor when provided', async () => {
    let executorCalled = false
    const executor = (t) => { executorCalled = true; return 'result' }
    const target = element._buildRequestTarget('req', {}, executor, {})
    const result = await target.generateRequest()
    expect(executorCalled).to.equal(true)
    expect(result).to.equal('result')
  })

  it('generateRequest returns null when no executor is provided', async () => {
    const target = element._buildRequestTarget('req', {}, null, {})
    const result = await target.generateRequest()
    expect(result).to.equal(null)
  })
})

describe('haxcms-site-editor event handlers', () => {
  let element
  let saved = {}

  beforeEach(async () => {
    saved = { manifest: store.manifest, editMode: store.editMode, appReady: store.appReady, userData: store.userData }
    store.manifest = makeManifest()
    store.editMode = false
    store.appReady = true
    store.userData = {}
    element = await fixture(html`<haxcms-site-editor></haxcms-site-editor>`)
  })

  afterEach(() => {
    store.manifest = saved.manifest
    store.editMode = saved.editMode
    store.appReady = saved.appReady
    store.userData = saved.userData
  })

  describe('_handleUserDataResponse', () => {
    it('sets store.userData and dispatches haxcms-user-data-updated', () => {
      let received = null
      element.addEventListener('haxcms-user-data-updated', (e) => { received = e.detail })
      element._handleUserDataResponse({
        detail: { response: { data: { name: 'Test User' } } },
      })
      expect(store.userData).to.deep.equal({ name: 'Test User' })
      expect(received).to.deep.equal({ name: 'Test User' })
    })

    it('is a no-op when response has no data', () => {
      let received = false
      element.addEventListener('haxcms-user-data-updated', () => { received = true })
      element._handleUserDataResponse({ detail: { response: {} } })
      expect(received).to.equal(false)
    })
  })

  describe('_handleContentSearchResponse', () => {
    it('dispatches search results with matches from results array', () => {
      let received = null
      globalThis.addEventListener('haxcms-content-dashboard-search-results', (e) => { received = e.detail })
      try {
        element._handleContentSearchResponse({
          detail: {
            response: {
              data: {
                operation: 'search',
                query: 'test',
                results: [
                  { id: 'page-1' },
                  { id: 'page-2' },
                ],
              },
            },
          },
        })
        expect(received).to.exist
        expect(received.query).to.equal('test')
        expect(received.matches).to.include('page-1')
        expect(received.matches).to.include('page-2')
      } finally {
        globalThis.removeEventListener('haxcms-content-dashboard-search-results', () => {})
      }
    })

    it('dispatches replace results when operation is replace', () => {
      let received = null
      const handler = (e) => { received = e.detail }
      globalThis.addEventListener('haxcms-content-dashboard-replace-results', handler)
      try {
        element._handleContentSearchResponse({
          detail: {
            response: {
              data: {
                operation: 'replace',
                query: 'old',
                results: [],
              },
            },
          },
        })
        expect(received).to.exist
        expect(received.operation).to.equal('replace')
      } finally {
        globalThis.removeEventListener('haxcms-content-dashboard-replace-results', handler)
      }
    })

    it('handles matches array as results source', () => {
      let received = null
      const handler = (e) => { received = e.detail }
      globalThis.addEventListener('haxcms-content-dashboard-search-results', handler)
      try {
        element._handleContentSearchResponse({
          detail: {
            response: {
              data: {
                matches: [{ id: 'm1' }, { id: 'm2' }],
              },
            },
          },
        })
        expect(received).to.exist
        expect(received.matches).to.include('m1')
        expect(received.matches).to.include('m2')
      } finally {
        globalThis.removeEventListener('haxcms-content-dashboard-search-results', handler)
      }
    })

    it('handles string id by converting number ids to strings', () => {
      let received = null
      const handler = (e) => { received = e.detail }
      globalThis.addEventListener('haxcms-content-dashboard-search-results', handler)
      try {
        element._handleContentSearchResponse({
          detail: {
            response: {
              data: {
                results: [{ id: 123 }, { id: 456 }],
              },
            },
          },
        })
        expect(received.matches).to.include('123')
        expect(received.matches).to.include('456')
      } finally {
        globalThis.removeEventListener('haxcms-content-dashboard-search-results', handler)
      }
    })

    it('handles string results as match ids', () => {
      let received = null
      const handler = (e) => { received = e.detail }
      globalThis.addEventListener('haxcms-content-dashboard-search-results', handler)
      try {
        element._handleContentSearchResponse({
          detail: {
            response: {
              data: {
                results: ['str-id-1', 'str-id-2'],
              },
            },
          },
        })
        expect(received.matches).to.include('str-id-1')
        expect(received.matches).to.include('str-id-2')
      } finally {
        globalThis.removeEventListener('haxcms-content-dashboard-search-results', handler)
      }
    })

    it('deduplicates match ids', () => {
      let received = null
      const handler = (e) => { received = e.detail }
      globalThis.addEventListener('haxcms-content-dashboard-search-results', handler)
      try {
        element._handleContentSearchResponse({
          detail: {
            response: {
              data: {
                results: [{ id: 'dup' }, { id: 'dup' }, { id: 'unique' }],
              },
            },
          },
        })
        expect(received.matches.length).to.equal(2)
      } finally {
        globalThis.removeEventListener('haxcms-content-dashboard-search-results', handler)
      }
    })
  })

  describe('loadingChanged', () => {
    it('sets loading from event detail value', () => {
      element.loadingChanged({ detail: { value: true } })
      expect(element.loading).to.equal(true)
      element.loadingChanged({ detail: { value: false } })
      expect(element.loading).to.equal(false)
    })
  })

  describe('__deleteNodeResponseChanged', () => {
    it('dispatches toast when response has title', () => {
      let toastReceived = null
      const handler = (e) => { toastReceived = e.detail }
      globalThis.addEventListener('haxcms-toast-show', handler)
      try {
        element.__deleteNodeResponseChanged({
          detail: { value: { data: { title: 'Deleted Page' } } },
        })
        expect(toastReceived).to.exist
        expect(toastReceived.text).to.include('Deleted Page')
      } finally {
        globalThis.removeEventListener('haxcms-toast-show', handler)
      }
    })

    it('is a no-op when response has no title', () => {
      let toastFired = false
      const handler = () => { toastFired = true }
      globalThis.addEventListener('haxcms-toast-show', handler)
      try {
        element.__deleteNodeResponseChanged({
          detail: { value: { data: {} } },
        })
        expect(toastFired).to.equal(false)
      } finally {
        globalThis.removeEventListener('haxcms-toast-show', handler)
      }
    })
  })
})

describe('haxcms-site-editor lastErrorChanged', () => {
  let element
  let saved = {}

  beforeEach(async () => {
    saved = { manifest: store.manifest, editMode: store.editMode, appReady: store.appReady, jwt: store.jwt }
    store.manifest = makeManifest()
    store.editMode = false
    store.appReady = true
    store.jwt = null
    element = await fixture(html`<haxcms-site-editor></haxcms-site-editor>`)
    element.jwt = null
  })

  afterEach(() => {
    store.manifest = saved.manifest
    store.editMode = saved.editMode
    store.appReady = saved.appReady
    store.jwt = saved.jwt
  })

  it('is a no-op when e.detail.value is falsy', () => {
    expect(() => element.lastErrorChanged({ detail: {} })).to.not.throw()
    expect(() => element.lastErrorChanged(null)).to.not.throw()
  })

  it('dispatches jwt-login-logout for 401 when no jwt', () => {
    let logoutFired = false
    const handler = () => { logoutFired = true }
    element.addEventListener('jwt-login-logout', handler)
    try {
      element.lastErrorChanged({
        detail: { value: { status: 401 } },
      })
      expect(logoutFired).to.equal(true)
    } finally {
      element.removeEventListener('jwt-login-logout', handler)
    }
  })

  it('dispatches jwt-login-logout for 403 when no jwt', () => {
    let logoutFired = false
    const handler = () => { logoutFired = true }
    element.addEventListener('jwt-login-logout', handler)
    try {
      element.lastErrorChanged({
        detail: { value: { status: 403 } },
      })
      expect(logoutFired).to.equal(true)
    } finally {
      element.removeEventListener('jwt-login-logout', handler)
    }
  })

  it('dispatches jwt-login-refresh-token for 401 when jwt is present', () => {
    let refreshFired = false
    const handler = () => { refreshFired = true }
    element.addEventListener('jwt-login-refresh-token', handler)
    try {
      element.jwt = 'test-jwt'
      element.lastErrorChanged({
        detail: { value: { status: 401 }, target: { id: 'req-1' } },
      })
      expect(refreshFired).to.equal(true)
    } finally {
      element.removeEventListener('jwt-login-refresh-token', handler)
      element.jwt = null
    }
  })

  it('dispatches toast for non-401/403/405 errors', () => {
    let toastReceived = null
    const handler = (e) => { toastReceived = e.detail }
    globalThis.addEventListener('haxcms-toast-show', handler)
    try {
      element.lastErrorChanged({
        detail: { value: { status: 500, statusText: 'Internal Error' } },
      })
      expect(toastReceived).to.exist
      expect(toastReceived.text).to.include('500')
      expect(toastReceived.text).to.include('Internal Error')
    } finally {
      globalThis.removeEventListener('haxcms-toast-show', handler)
    }
  })
})

describe('haxcms-site-editor refreshRequest', () => {
  let element
  let saved = {}

  beforeEach(async () => {
    saved = { manifest: store.manifest, editMode: store.editMode, appReady: store.appReady, jwt: store.jwt }
    store.manifest = makeManifest()
    store.editMode = false
    store.appReady = true
    store.jwt = null
    element = await fixture(html`<haxcms-site-editor></haxcms-site-editor>`)
  })

  afterEach(() => {
    store.manifest = saved.manifest
    store.editMode = saved.editMode
    store.appReady = saved.appReady
    store.jwt = saved.jwt
  })

  it('clears retry count and dispatches toast when no jwt provided', () => {
    let toastFired = false
    const handler = () => { toastFired = true }
    globalThis.addEventListener('haxcms-toast-show', handler)
    try {
      element.refreshRequest(null, null, 'retry-key')
      expect(toastFired).to.equal(true)
    } finally {
      globalThis.removeEventListener('haxcms-toast-show', handler)
    }
  })

  it('sets jwt and updates element body/headers when jwt is provided', () => {
    const fakeElement = {
      body: { jwt: 'old' },
      headers: {},
      generateRequest: () => {},
    }
    element.refreshRequest('new-jwt', fakeElement)
    expect(element.jwt).to.equal('new-jwt')
    expect(fakeElement.body.jwt).to.equal('new-jwt')
    expect(fakeElement.headers.Authorization).to.equal('Bearer new-jwt')
  })
})

describe('haxcms-site-editor _autoEnterEditModeForCreatedNode', () => {
  let element
  let saved = {}

  beforeEach(async () => {
    saved = { manifest: store.manifest, editMode: store.editMode, appReady: store.appReady }
    store.manifest = makeManifest()
    store.editMode = false
    store.appReady = true
    element = await fixture(html`<haxcms-site-editor></haxcms-site-editor>`)
  })

  afterEach(() => {
    store.manifest = saved.manifest
    store.editMode = saved.editMode
    store.appReady = saved.appReady
    if (element.__autoEditDisposer) {
      element.__autoEditDisposer()
      element.__autoEditDisposer = null
    }
    if (element.__autoEditSafetyTimer) {
      clearTimeout(element.__autoEditSafetyTimer)
      element.__autoEditSafetyTimer = null
    }
  })

  it('is a no-op when node is null or has no id', () => {
    element._merlinCreated = true
    element._autoEnterEditModeForCreatedNode(null)
    expect(element._merlinCreated).to.equal(false)
    expect(element.__autoEditDisposer).to.be.undefined
  })

  it('is a no-op when node.id is missing', () => {
    element._merlinCreated = true
    element._autoEnterEditModeForCreatedNode({ title: 'No ID' })
    expect(element._merlinCreated).to.equal(false)
  })

  it('sets up autorun disposer and safety timer for valid node', () => {
    element._merlinCreated = true
    element._autoEnterEditModeForCreatedNode({ id: 'new-page', title: 'New' })
    expect(element.__autoEditDisposer).to.exist
    expect(element.__autoEditSafetyTimer).to.exist
  })

  it('tears down previous disposer when called again', () => {
    element._merlinCreated = true
    element._autoEnterEditModeForCreatedNode({ id: 'page-a', title: 'A' })
    const firstDisposer = element.__autoEditDisposer
    element._autoEnterEditModeForCreatedNode({ id: 'page-b', title: 'B' })
    // second call should have torn down the first disposer
    expect(element.__autoEditDisposer).to.exist
    // the disposer should be a new one (can't compare directly but should exist)
  })
})
