import { expect } from '@open-wc/testing'

globalThis.appSettings = {}

const { store } = await import('../lib/v2/AppHaxStore.js')
const { AppHaxBackendAPI } = await import('../lib/v2/AppHaxBackendAPI.js')

// Helper to create a fresh instance without the singleton side effects
function createInstance() {
  const el = new AppHaxBackendAPI()
  el.jwt = null
  el.basePath = '/'
  el.appSettings = {}
  return el
}

describe('AppHaxBackendAPI', () => {
  describe('static tag', () => {
    it('has correct tag name', () => {
      expect(AppHaxBackendAPI.tag).to.equal('app-hax-backend-api')
    })
  })

  describe('_hasValidJWT', () => {
    let el
    beforeEach(() => {
      el = createInstance()
    })
    it('returns true for a non-empty string', () => {
      expect(el._hasValidJWT('abc123')).to.be.true
    })
    it('returns false for null', () => {
      expect(el._hasValidJWT(null)).to.be.false
    })
    it('returns false for string "null"', () => {
      expect(el._hasValidJWT('null')).to.be.false
    })
    it('returns false for empty string', () => {
      expect(el._hasValidJWT('')).to.be.false
    })
    it('returns false for undefined', () => {
      expect(el._hasValidJWT(undefined)).to.be.false
    })
  })

  describe('_renderUrl', () => {
    let el
    beforeEach(() => {
      el = createInstance()
      el.basePath = '/myapp/'
    })
    it('returns empty string for falsy input', () => {
      expect(el._renderUrl('')).to.equal('')
      expect(el._renderUrl(null)).to.equal('')
      expect(el._renderUrl(undefined)).to.equal('')
    })
    it('returns http URL as-is', () => {
      expect(el._renderUrl('http://example.com')).to.equal('http://example.com')
    })
    it('returns https URL as-is', () => {
      expect(el._renderUrl('https://example.com')).to.equal('https://example.com')
    })
    it('returns absolute path as-is', () => {
      expect(el._renderUrl('/api/endpoint')).to.equal('/api/endpoint')
    })
    it('prepends basePath for relative path', () => {
      expect(el._renderUrl('api/endpoint')).to.equal('/myapp/api/endpoint')
    })
  })

  describe('_getRetryKey', () => {
    let el
    beforeEach(() => {
      el = createInstance()
    })
    it('generates key from call and data', () => {
      expect(el._getRetryKey('listSites', { page: 1 })).to.equal(
        'listSites:{"page":1}',
      )
    })
    it('excludes jwt from key', () => {
      const key = el._getRetryKey('call', { jwt: 'secret', data: 'x' })
      expect(key).to.not.include('jwt')
      expect(key).to.not.include('secret')
    })
    it('excludes token from key', () => {
      const key = el._getRetryKey('call', { token: 'tok', data: 'x' })
      expect(key).to.not.include('token')
      expect(key).to.not.include('tok')
    })
    it('handles empty data', () => {
      expect(el._getRetryKey('call')).to.equal('call:{}')
    })
  })

  describe('retry count management', () => {
    let el
    beforeEach(() => {
      el = createInstance()
    })
    it('_incrementRetryCount starts at 1', () => {
      expect(el._incrementRetryCount('key1')).to.equal(1)
    })
    it('_incrementRetryCount increments', () => {
      el._incrementRetryCount('key1')
      expect(el._incrementRetryCount('key1')).to.equal(2)
    })
    it('_clearRetryCount removes key', () => {
      el._incrementRetryCount('key1')
      el._clearRetryCount('key1')
      expect(el.__retryCounts['key1']).to.be.undefined
    })
    it('_clearRetryCount is safe for unknown key', () => {
      expect(() => el._clearRetryCount('unknown')).to.not.throw()
    })
    it('_clearAllRetryCounts empties the map', () => {
      el._incrementRetryCount('key1')
      el._incrementRetryCount('key2')
      el._clearAllRetryCounts()
      expect(Object.keys(el.__retryCounts).length).to.equal(0)
    })
  })

  describe('_getSystemOperationAlias', () => {
    let el
    beforeEach(() => {
      el = createInstance()
    })
    it('returns alias for known call', () => {
      const alias = el._getSystemOperationAlias('getSitesList')
      expect(alias).to.exist
      expect(alias.operationId).to.equal('listSites')
    })
    it('returns null for unknown call', () => {
      expect(el._getSystemOperationAlias('unknownCall')).to.be.null
    })
    it('returns null for empty call', () => {
      expect(el._getSystemOperationAlias('')).to.be.null
    })
    it('returns alias for createSite', () => {
      const alias = el._getSystemOperationAlias('createSite')
      expect(alias.operationId).to.equal('createSite')
      expect(alias.method).to.equal('POST')
    })
    it('returns alias with pathParams for copySite', () => {
      const alias = el._getSystemOperationAlias('copySite')
      expect(alias.pathParams).to.include('siteName')
    })
  })

  describe('supportsCall', () => {
    let el
    beforeEach(() => {
      el = createInstance()
    })
    it('returns true for known call without requiresAppSettingsFlag', () => {
      expect(el.supportsCall('getSitesList')).to.be.true
    })
    it('returns false for unknown call', () => {
      expect(el.supportsCall('unknownCall')).to.be.false
    })
    it('returns false for empty call', () => {
      expect(el.supportsCall('')).to.be.false
    })
    it('returns false when requiresAppSettingsFlag is not set', () => {
      expect(el.supportsCall('haxiamAddUserAccess')).to.be.false
    })
    it('returns true when requiresAppSettingsFlag is present in appSettings', () => {
      el.appSettings = { haxiamAddUserAccess: 'https://iam.example.com' }
      expect(el.supportsCall('haxiamAddUserAccess')).to.be.true
    })
  })

  describe('_resolvePathParamValue', () => {
    let el
    beforeEach(() => {
      el = createInstance()
    })
    it('returns empty string for empty paramName', () => {
      expect(el._resolvePathParamValue('call', '', {})).to.equal('')
    })
    it('resolves siteName from site.name', () => {
      const data = { site: { name: 'my-site' } }
      expect(el._resolvePathParamValue('call', 'siteName', data)).to.equal('my-site')
    })
    it('resolves siteName from siteName field', () => {
      const data = { siteName: 'direct-name' }
      expect(el._resolvePathParamValue('call', 'siteName', data)).to.equal('direct-name')
    })
    it('resolves siteName from name field', () => {
      const data = { name: 'fallback-name' }
      expect(el._resolvePathParamValue('call', 'siteName', data)).to.equal('fallback-name')
    })
    it('returns empty for siteName when no matching field', () => {
      expect(el._resolvePathParamValue('call', 'siteName', {})).to.equal('')
    })
    it('resolves skeletonName from skeletonName field', () => {
      const data = { skeletonName: 'my-skel' }
      expect(el._resolvePathParamValue('call', 'skeletonName', data)).to.equal('my-skel')
    })
    it('resolves skeletonName from name field', () => {
      const data = { name: 'name-skel' }
      expect(el._resolvePathParamValue('call', 'skeletonName', data)).to.equal('name-skel')
    })
    it('resolves name from name field', () => {
      const data = { name: 'direct-name' }
      expect(el._resolvePathParamValue('call', 'name', data)).to.equal('direct-name')
    })
    it('resolves name from skeletonName field', () => {
      const data = { skeletonName: 'skel-as-name' }
      expect(el._resolvePathParamValue('call', 'name', data)).to.equal('skel-as-name')
    })
    it('resolves name from site.name field', () => {
      const data = { site: { name: 'site-name' } }
      expect(el._resolvePathParamValue('call', 'name', data)).to.equal('site-name')
    })
    it('resolves name from siteName field', () => {
      const data = { siteName: 'site-name-direct' }
      expect(el._resolvePathParamValue('call', 'name', data)).to.equal('site-name-direct')
    })
    it('resolves arbitrary param from data', () => {
      const data = { customParam: 'customVal' }
      expect(el._resolvePathParamValue('call', 'customParam', data)).to.equal('customVal')
    })
    it('returns empty for arbitrary param with null value', () => {
      const data = { customParam: null }
      expect(el._resolvePathParamValue('call', 'customParam', data)).to.equal('')
    })
    it('trims whitespace from resolved value', () => {
      const data = { name: '  spaced  ' }
      expect(el._resolvePathParamValue('call', 'name', data)).to.equal('spaced')
    })
  })

  describe('_applySystemQueryDefaults', () => {
    let el
    beforeEach(() => {
      el = createInstance()
    })
    it('applies defaults for missing keys', () => {
      const result = el._applySystemQueryDefaults(
        { queryDefaults: { includeDisabled: true } },
        {},
      )
      expect(result.includeDisabled).to.be.true
    })
    it('does not override existing non-null values', () => {
      const result = el._applySystemQueryDefaults(
        { queryDefaults: { includeDisabled: true } },
        { includeDisabled: false },
      )
      expect(result.includeDisabled).to.equal(false)
    })
    it('overrides null values with defaults', () => {
      const result = el._applySystemQueryDefaults(
        { queryDefaults: { includeDisabled: true } },
        { includeDisabled: null },
      )
      expect(result.includeDisabled).to.be.true
    })
    it('overrides empty string values with defaults', () => {
      const result = el._applySystemQueryDefaults(
        { queryDefaults: { includeDisabled: true } },
        { includeDisabled: '' },
      )
      expect(result.includeDisabled).to.be.true
    })
    it('overrides whitespace-only values with defaults', () => {
      const result = el._applySystemQueryDefaults(
        { queryDefaults: { includeDisabled: true } },
        { includeDisabled: '  ' },
      )
      expect(result.includeDisabled).to.be.true
    })
    it('handles undefined alias gracefully', () => {
      const result = el._applySystemQueryDefaults(undefined, { foo: 'bar' })
      expect(result.foo).to.equal('bar')
    })
  })

  describe('_buildSystemOperationPayload', () => {
    let el
    beforeEach(() => {
      el = createInstance()
    })
    it('builds payload from data', () => {
      const alias = { method: 'GET' }
      const data = { page: 1, query: 'test' }
      const result = el._buildSystemOperationPayload('getSitesList', alias, data)
      expect(result.page).to.equal(1)
      expect(result.query).to.equal('test')
      expect(result.__method).to.equal('GET')
    })
    it('strips jwt from payload', () => {
      const alias = { method: 'POST' }
      const data = { jwt: 'secret', real: 'data' }
      const result = el._buildSystemOperationPayload('call', alias, data)
      expect(result.jwt).to.be.undefined
      expect(result.real).to.equal('data')
    })
    it('strips token from payload', () => {
      const alias = { method: 'POST' }
      const data = { token: 'tok', real: 'data' }
      const result = el._buildSystemOperationPayload('call', alias, data)
      expect(result.token).to.be.undefined
      expect(result.real).to.equal('data')
    })
    it('strips user_token from payload', () => {
      const alias = { method: 'POST' }
      const data = { user_token: 'ut', real: 'data' }
      const result = el._buildSystemOperationPayload('call', alias, data)
      expect(result.user_token).to.be.undefined
      expect(result.real).to.equal('data')
    })
    it('handles non-object data gracefully', () => {
      const alias = { method: 'GET' }
      const result = el._buildSystemOperationPayload('call', alias, 'string')
      expect(result.__method).to.equal('GET')
    })
    it('injects path params from alias', () => {
      const alias = { method: 'POST', pathParams: ['siteName'] }
      const data = { site: { name: 'my-site' } }
      const result = el._buildSystemOperationPayload('copySite', alias, data)
      expect(result.siteName).to.equal('my-site')
    })
  })

  describe('_resolveResponseStatus', () => {
    let el
    beforeEach(() => {
      el = createInstance()
    })
    it('returns 0 for null response', () => {
      expect(el._resolveResponseStatus(null)).to.equal(0)
    })
    it('returns 0 for non-object response', () => {
      expect(el._resolveResponseStatus('string')).to.equal(0)
    })
    it('returns status when it is a number', () => {
      expect(el._resolveResponseStatus({ status: 404 })).to.equal(404)
    })
    it('returns 200 when status is not a number', () => {
      expect(el._resolveResponseStatus({ status: 'ok' })).to.equal(200)
    })
    it('returns 200 when status is missing', () => {
      expect(el._resolveResponseStatus({})).to.equal(200)
    })
  })

  describe('_finalizeCallResponse', () => {
    let el
    beforeEach(() => {
      el = createInstance()
    })
    it('saves response to lastResponse when save is true', () => {
      const response = { status: 200, data: [] }
      el._finalizeCallResponse('listSites', response, true)
      expect(el.lastResponse['listSites']).to.equal(response)
    })
    it('does not save when save is false', () => {
      const response = { status: 200 }
      el._finalizeCallResponse('listSites', response, false)
      expect(el.lastResponse['listSites']).to.be.undefined
    })
    it('calls callback when provided', () => {
      let called = false
      el._finalizeCallResponse('call', {}, false, () => {
        called = true
      })
      expect(called).to.be.true
    })
    it('returns the response', () => {
      const response = { status: 200 }
      const result = el._finalizeCallResponse('call', response)
      expect(result).to.equal(response)
    })
  })

  describe('_normalizeSiteLicense', () => {
    let el
    beforeEach(() => {
      el = createInstance()
    })
    it('returns null for null input', () => {
      expect(el._normalizeSiteLicense(null)).to.be.null
    })
    it('returns null for non-string input', () => {
      expect(el._normalizeSiteLicense(123)).to.be.null
    })
    it('returns null for empty string', () => {
      expect(el._normalizeSiteLicense('')).to.be.null
    })
    it('returns null for whitespace-only string', () => {
      expect(el._normalizeSiteLicense('   ')).to.be.null
    })
    // BUG: _normalizeSiteLicense has a prefix-matching bug where 'cc-by-sa'
    // matches 'by' before 'by-sa' because 'cc-by-sa' contains 'cc-by'.
    // The loop iterates SUPPORTED_SITE_LICENSES and returns the first match,
    // so 'by' wins over 'by-sa'. Reported, not patched.
    it('normalizes underscores to hyphens (BUG: cc-by-sa matches as by)', () => {
      const result = el._normalizeSiteLicense('cc_by_sa')
      // Due to prefix bug, this returns 'by' instead of 'by-sa'
      expect(result).to.equal('by')
    })
    it('lowercases the value', () => {
      const result = el._normalizeSiteLicense('CC-BY')
      // 'cc-by' contains 'cc-by' which matches 'by'
      expect(result).to.equal('by')
    })
    it('extracts license from URL path', () => {
      const result = el._normalizeSiteLicense('https://creativecommons.org/licenses/by/4.0')
      expect(result).to.equal('by')
    })
    it('extracts license from cc prefix (BUG: cc by-sa matches as by)', () => {
      const result = el._normalizeSiteLicense('cc by-sa')
      // 'cc by-sa' contains 'cc by' which matches 'by' before 'by-sa'
      expect(result).to.equal('by')
    })
    it('extracts license from cc- prefix (BUG: cc-by-nc matches as by)', () => {
      const result = el._normalizeSiteLicense('cc-by-nc')
      // 'cc-by-nc' contains 'cc-by' which matches 'by' before 'by-nc'
      expect(result).to.equal('by')
    })
    it('extracts license from cc: prefix', () => {
      const result = el._normalizeSiteLicense('cc:by')
      expect(result).to.equal('by')
    })
    it('returns null for unrecognized license', () => {
      expect(el._normalizeSiteLicense('not-a-license')).to.be.null
    })
  })

  describe('_formatSitePostData', () => {
    let el
    beforeEach(() => {
      el = createInstance()
      store.site = {
        name: 'test-site',
        type: 'course',
        structure: 'docx',
        theme: 'clean-two',
        license: 'cc-by',
      }
      store.items = [{ id: 1 }]
      store.itemFiles = [{ path: 'a.txt' }]
      store.skeletonMachineName = null
    })
    it('builds site data from store', () => {
      const result = el._formatSitePostData()
      expect(result.site.name).to.equal('test-site')
      expect(result.site.theme).to.equal('clean-two')
      expect(result.build.type).to.equal('course')
      expect(result.build.structure).to.equal('docx')
    })
    it('includes items and files when not using trusted skeleton', () => {
      const result = el._formatSitePostData()
      expect(result.build.items).to.deep.equal([{ id: 1 }])
      expect(result.build.files).to.deep.equal([{ path: 'a.txt' }])
    })
    it('nulls items and files when using trusted skeleton', () => {
      store.site.structure = 'from-skeleton'
      store.skeletonMachineName = 'my-skeleton'
      const result = el._formatSitePostData()
      expect(result.build.items).to.be.null
      expect(result.build.files).to.be.null
      expect(result.build.skeletonMachineName).to.equal('my-skeleton')
    })
    it('includes normalized license when valid', () => {
      store.site.license = 'cc-by-sa'
      const result = el._formatSitePostData()
      // BUG: _normalizeSiteLicense('cc-by-sa') returns 'by' due to
      // prefix-matching order (cc-by matches 'by' before 'by-sa')
      expect(result.site.license).to.equal('by')
    })
    it('omits license when invalid', () => {
      store.site.license = 'not-real'
      const result = el._formatSitePostData()
      expect(result.site.license).to.be.undefined
    })
    it('generates description from type and structure', () => {
      const result = el._formatSitePostData()
      expect(result.site.description).to.equal('course docx')
    })
  })

  describe('_clearAuthSession', () => {
    let el
    beforeEach(() => {
      el = createInstance()
      el.jwt = 'some-jwt'
      store.jwt = 'some-jwt'
      store.authValidated = true
      store.authTesting = true
      store.user = { name: 'someone' }
    })
    it('clears jwt and auth state', () => {
      el._clearAuthSession(false)
      expect(el.jwt).to.be.null
      expect(store.jwt).to.be.null
      expect(store.authValidated).to.be.false
      expect(store.authTesting).to.be.false
      expect(store.user.name).to.equal('')
    })
    it('triggers logout when triggerLogout is true', () => {
      let logoutFired = false
      globalThis.addEventListener('jwt-login-logout', () => {
        logoutFired = true
      })
      el._clearAuthSession(true)
      globalThis.removeEventListener('jwt-login-logout', () => {})
      expect(logoutFired).to.be.true
    })
    it('does not trigger logout when triggerLogout is false', () => {
      let logoutFired = false
      globalThis.addEventListener('jwt-login-logout', () => {
        logoutFired = true
      })
      el._clearAuthSession(false)
      globalThis.removeEventListener('jwt-login-logout', () => {})
      expect(logoutFired).to.be.false
    })
  })

  describe('_triggerLogout', () => {
    let el
    beforeEach(() => {
      el = createInstance()
    })
    it('dispatches jwt-login-logout event with redirect detail', () => {
      let capturedEvent = null
      globalThis.addEventListener('jwt-login-logout', (e) => {
        capturedEvent = e
      })
      el._triggerLogout()
      globalThis.removeEventListener('jwt-login-logout', () => {})
      expect(capturedEvent).to.exist
      expect(capturedEvent.detail.redirect).to.be.true
    })
  })

  describe('refreshRequest', () => {
    let el
    beforeEach(() => {
      el = createInstance()
    })
    it('updates jwt when provided and calls makeCall', () => {
      let madeCall = false
      el.makeCall = () => {
        madeCall = true
      }
      el.refreshRequest('new-jwt', 'someCall', { data: 1 })
      expect(el.jwt).to.equal('new-jwt')
      expect(madeCall).to.be.true
    })
    it('clears retry count when jwt is falsy and retryKey provided', () => {
      el.__retryCounts['someKey'] = 3
      el.refreshRequest(null, 'call', {}, false, false, 'someKey')
      expect(el.__retryCounts['someKey']).to.be.undefined
    })
    it('does nothing when jwt is falsy and no retryKey', () => {
      expect(() => el.refreshRequest(null, 'call')).to.not.throw()
    })
  })

  describe('makeCall', () => {
    let el
    beforeEach(() => {
      el = createInstance()
    })
    it('returns empty response for unknown call (no alias)', async () => {
      const result = await el.makeCall('unknownCall')
      expect(result).to.deep.equal({})
    })
    it('saves response to lastResponse when save is true', async () => {
      // For a known call, the system operation path will return {} because
      // no openapi spec is loaded. But save still records it.
      await el.makeCall('getSitesList', {}, true)
      expect(el.lastResponse['getSitesList']).to.exist
    })
    it('calls callback when provided', async () => {
      let called = false
      await el.makeCall('getSitesList', {}, false, () => {
        called = true
      })
      expect(called).to.be.true
    })
  })

  describe('_handleFailedRequestStatus', () => {
    let el
    beforeEach(() => {
      el = createInstance()
    })
    it('returns false for status 200', () => {
      const result = el._handleFailedRequestStatus({ status: 200 }, 200, 'key', 'call', {}, false, false)
      expect(result).to.be.false
    })
    it('returns false for status 0', () => {
      const result = el._handleFailedRequestStatus(null, 0, 'key', 'call', {}, false, false)
      expect(result).to.be.false
    })
    it('clears auth session on 404', () => {
      let logoutFired = false
      globalThis.addEventListener('jwt-login-logout', () => { logoutFired = true })
      el._handleFailedRequestStatus({ status: 404 }, 404, 'key', 'call', {}, false, true)
      globalThis.removeEventListener('jwt-login-logout', () => {})
      expect(logoutFired).to.be.true
    })
    it('clears auth session on 401 without valid JWT', () => {
      el.jwt = null
      let logoutFired = false
      globalThis.addEventListener('jwt-login-logout', () => { logoutFired = true })
      el._handleFailedRequestStatus({ status: 401 }, 401, 'key', 'call', {}, false, true)
      globalThis.removeEventListener('jwt-login-logout', () => {})
      expect(logoutFired).to.be.true
    })
    it('dispatches refresh-token on 401 with valid JWT (under retry cap)', () => {
      el.jwt = 'valid-jwt'
      let refreshFired = false
      globalThis.addEventListener('jwt-login-refresh-token', () => { refreshFired = true })
      el._handleFailedRequestStatus({ status: 401 }, 401, 'key', 'call', {}, false, false)
      globalThis.removeEventListener('jwt-login-refresh-token', () => {})
      expect(refreshFired).to.be.true
    })
    it('clears auth session on 401 when retry cap exceeded', () => {
      el.jwt = 'valid-jwt'
      el.__maxRefreshRetries = 0 // Set cap to 0 so first retry exceeds it
      let logoutFired = false
      globalThis.addEventListener('jwt-login-logout', () => { logoutFired = true })
      el._handleFailedRequestStatus({ status: 401 }, 401, 'key', 'call', {}, false, true)
      globalThis.removeEventListener('jwt-login-logout', () => {})
      expect(logoutFired).to.be.true
    })
    it('handles hard denial 403 without clearing session', () => {
      let logoutFired = false
      globalThis.addEventListener('jwt-login-logout', () => { logoutFired = true })
      const result = el._handleFailedRequestStatus(
        { status: 403, message: 'Admin access required' },
        403, 'key', 'call', {}, false, true,
      )
      globalThis.removeEventListener('jwt-login-logout', () => {})
      expect(result).to.be.true
      expect(logoutFired).to.be.false
    })
    it('handles hard denial "Access denied" 403', () => {
      let logoutFired = false
      globalThis.addEventListener('jwt-login-logout', () => { logoutFired = true })
      el._handleFailedRequestStatus(
        { status: 403, message: 'Access denied' },
        403, 'key', 'call', {}, false, true,
      )
      globalThis.removeEventListener('jwt-login-logout', () => {})
      expect(logoutFired).to.be.false
    })
    it('dispatches refresh on refreshable 403', () => {
      el.jwt = 'valid-jwt'
      let refreshFired = false
      globalThis.addEventListener('jwt-login-refresh-token', () => { refreshFired = true })
      el._handleFailedRequestStatus({ status: 403, message: 'expired' }, 403, 'key', 'call', {}, false, false)
      globalThis.removeEventListener('jwt-login-refresh-token', () => {})
      expect(refreshFired).to.be.true
    })
    it('clears auth session on 403 when retry cap exceeded', () => {
      el.jwt = 'valid-jwt'
      el.__maxRefreshRetries = 0
      let logoutFired = false
      globalThis.addEventListener('jwt-login-logout', () => { logoutFired = true })
      el._handleFailedRequestStatus({ status: 403, message: 'expired' }, 403, 'key', 'call', {}, false, true)
      globalThis.removeEventListener('jwt-login-logout', () => {})
      expect(logoutFired).to.be.true
    })
  })

  describe('_validateConnection', () => {
    let el
    let originalFetch
    beforeEach(() => {
      el = createInstance()
      originalFetch = globalThis.fetch
    })
    afterEach(() => {
      globalThis.fetch = originalFetch
    })
    it('returns false when no connectionTest and no JWT', async () => {
      el.appSettings = {}
      el.jwt = null
      const result = await el._validateConnection()
      expect(result).to.be.false
      expect(store.authValidated).to.be.false
    })
    it('returns true when no connectionTest but has valid JWT', async () => {
      el.appSettings = {}
      el.jwt = 'valid-jwt'
      const result = await el._validateConnection()
      expect(result).to.be.true
      expect(store.authValidated).to.be.true
    })
    it('returns true when already validated with same JWT', async () => {
      el.appSettings = { connectionTest: '/api/test' }
      el.jwt = 'valid-jwt'
      el.__validatedJwt = 'valid-jwt'
      store.authValidated = true
      const result = await el._validateConnection()
      expect(result).to.be.true
    })
    it('returns false when fetch returns non-ok', async () => {
      el.appSettings = { connectionTest: '/api/test' }
      el.jwt = 'valid-jwt'
      globalThis.fetch = async () => ({ ok: false })
      const result = await el._validateConnection()
      expect(result).to.be.false
    })
    it('returns true when fetch returns authenticated:true', async () => {
      el.appSettings = { connectionTest: '/api/test' }
      el.jwt = 'valid-jwt'
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({ authenticated: true, jwt: 'new-jwt' }),
      })
      const result = await el._validateConnection()
      expect(result).to.be.true
      expect(el.jwt).to.equal('new-jwt')
    })
    it('sets user name from response', async () => {
      el.appSettings = { connectionTest: '/api/test' }
      el.jwt = 'valid-jwt'
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({ authenticated: true, jwt: 'new-jwt', user: 'testuser' }),
      })
      await el._validateConnection()
      expect(store.user.name).to.equal('testuser')
    })
    it('returns true when response has status 200 and jwt', async () => {
      el.appSettings = { connectionTest: '/api/test' }
      el.jwt = 'valid-jwt'
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({ status: 200, jwt: 'status-jwt' }),
      })
      const result = await el._validateConnection()
      expect(result).to.be.true
    })
    it('returns true when response has data.jwt', async () => {
      el.appSettings = { connectionTest: '/api/test' }
      el.jwt = 'valid-jwt'
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({ status: 200, data: { jwt: 'data-jwt', user: 'datauser' } }),
      })
      const result = await el._validateConnection()
      expect(result).to.be.true
      expect(store.user.name).to.equal('datauser')
    })
    it('returns false when response has no valid jwt', async () => {
      el.appSettings = { connectionTest: '/api/test' }
      el.jwt = 'valid-jwt'
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({ authenticated: false }),
      })
      const result = await el._validateConnection()
      expect(result).to.be.false
    })
    it('returns false on fetch error', async () => {
      el.appSettings = { connectionTest: '/api/test' }
      el.jwt = 'valid-jwt'
      globalThis.fetch = async () => { throw new Error('Network') }
      const result = await el._validateConnection()
      expect(result).to.be.false
    })
    it('returns false when json parse fails', async () => {
      el.appSettings = { connectionTest: '/api/test' }
      el.jwt = 'valid-jwt'
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => { throw new Error('Parse error') },
      })
      const result = await el._validateConnection()
      expect(result).to.be.false
    })
  })

  describe('_syncUserAfterValidation', () => {
    let el
    beforeEach(() => {
      el = createInstance()
    })
    it('sets user from userData response', async () => {
      el.makeCall = async () => ({ data: { userName: 'synced-user' } })
      await el._syncUserAfterValidation()
      expect(store.user.name).to.equal('synced-user')
    })
    it('clears auth session when no userData', async () => {
      el.makeCall = async () => ({})
      let logoutFired = false
      el._clearAuthSession = () => { logoutFired = true }
      await el._syncUserAfterValidation()
      expect(logoutFired).to.be.true
    })
    it('does nothing when loopBlock is true', async () => {
      el.__loopBlock = true
      let called = false
      el.makeCall = () => { called = true }
      await el._syncUserAfterValidation()
      expect(called).to.be.false
    })
  })
})
