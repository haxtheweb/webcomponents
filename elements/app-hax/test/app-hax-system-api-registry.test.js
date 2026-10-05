import { expect } from '@open-wc/testing'

// Clear demo appSettings so the registry state isn't polluted by the
// test-runner config's demo endpoints.
globalThis.appSettings = {}

const {
  configureAppHAXSystemApiRegistry,
  waitForAppHAXSystemApiRegistryReady,
} = await import('../lib/v2/app-hax-system-api-registry.js')
const { MicroFrontendRegistry } = await import(
  '@haxtheweb/micro-frontend-registry/micro-frontend-registry.js'
)

// The module stores state on globalThis.__AppHaxSystemApiRegistryState.
// We reset it between tests to avoid cross-test interference.
function resetState() {
  if (globalThis.__AppHaxSystemApiRegistryState) {
    globalThis.__AppHaxSystemApiRegistryState.appSettings = {}
    globalThis.__AppHaxSystemApiRegistryState.auth = {
      jwt: '',
      siteToken: '',
      userToken: '',
    }
    globalThis.__AppHaxSystemApiRegistryState.securitySchemes = {}
    globalThis.__AppHaxSystemApiRegistryState.systemApiBasePath = ''
    globalThis.__AppHaxSystemApiRegistryState.systemOpenApiPath = ''
    globalThis.__AppHaxSystemApiRegistryState.readyPromise = null
    globalThis.__AppHaxSystemApiRegistryState.bootstrapping = false
    globalThis.__AppHaxSystemApiRegistryState.bootstrapped = false
    globalThis.__AppHaxSystemApiRegistryState.previousAuthProvider = null
    globalThis.__AppHaxSystemApiRegistryState.providerApplied = false
  }
}

describe('app-hax-system-api-registry', () => {
  beforeEach(() => {
    resetState()
  })

  describe('configureAppHAXSystemApiRegistry', () => {
    it('returns a resolved promise when no systemApiBasePath derivable', async () => {
      const result = configureAppHAXSystemApiRegistry({})
      expect(result).to.exist
      const ok = await result
      expect(ok).to.be.false
    })
    it('returns false when appSettings has no relevant paths', async () => {
      const result = configureAppHAXSystemApiRegistry({ login: 'not-a-session-url' })
      const ok = await result
      expect(ok).to.be.false
    })
    it('derives systemApiBasePath from siteApiBasePath containing /x/api', async () => {
      // siteApiBasePath with /x/api prefix → basePath is everything before /x/api
      // But without a systemApiBasePath or openApiPath, it still returns false
      // because deriveSystemApiBasePath returns "" when only siteApiBasePath is set
      const result = configureAppHAXSystemApiRegistry({
        siteApiBasePath: '/tenant/x/api/v1',
      })
      const ok = await result
      expect(ok).to.be.false
    })
    it('derives base path from connectionSettings ending in /session/connection-settings', async () => {
      const result = configureAppHAXSystemApiRegistry({
        connectionSettings: '/api/session/connection-settings',
      })
      // This will try to fetch openapi.json from /api/openapi.json which will fail
      const ok = await result
      expect(ok).to.be.false
    })
    it('derives base path from login ending in /session/login', async () => {
      const result = configureAppHAXSystemApiRegistry({
        login: '/api/session/login',
      })
      const ok = await result
      expect(ok).to.be.false
    })
    it('uses explicit systemApiBasePath when provided', async () => {
      const result = configureAppHAXSystemApiRegistry({
        systemApiBasePath: '/myapi',
      })
      const ok = await result
      // Will try to fetch /myapi/openapi.json and fail
      expect(ok).to.be.false
    })
    it('uses explicit systemOpenApiPath when provided', async () => {
      const result = configureAppHAXSystemApiRegistry({
        systemApiBasePath: '/myapi',
        systemOpenApiPath: '/custom/openapi.json',
      })
      const ok = await result
      expect(ok).to.be.false
    })
    it('prepends tenant base path for relative systemApiBasePath', async () => {
      const result = configureAppHAXSystemApiRegistry({
        siteApiBasePath: '/tenant/x/api/v1',
        systemApiBasePath: 'system/api/v1',
      })
      const ok = await result
      expect(ok).to.be.false
    })
    it('does not prepend tenant base path for absolute systemApiBasePath', async () => {
      const result = configureAppHAXSystemApiRegistry({
        siteApiBasePath: '/tenant/x/api/v1',
        systemApiBasePath: '/system/api/v1',
      })
      const ok = await result
      expect(ok).to.be.false
    })
    it('accepts non-object appSettings gracefully', async () => {
      const result = configureAppHAXSystemApiRegistry(null)
      const ok = await result
      expect(ok).to.be.false
    })
    it('updates auth jwt from appSettings when no override', async () => {
      configureAppHAXSystemApiRegistry({ jwt: 'test-jwt-123' })
      const state = globalThis.__AppHaxSystemApiRegistryState
      expect(state.auth.jwt).to.equal('test-jwt-123')
    })
    it('overrides auth jwt when second argument provided', async () => {
      configureAppHAXSystemApiRegistry({ jwt: 'from-settings' }, 'override-jwt')
      const state = globalThis.__AppHaxSystemApiRegistryState
      expect(state.auth.jwt).to.equal('override-jwt')
    })
    it('updates siteToken from appSettings', async () => {
      configureAppHAXSystemApiRegistry({ siteToken: 'site-tok' })
      const state = globalThis.__AppHaxSystemApiRegistryState
      expect(state.auth.siteToken).to.equal('site-tok')
    })
    it('updates userToken from appSettings', async () => {
      configureAppHAXSystemApiRegistry({ userToken: 'user-tok' })
      const state = globalThis.__AppHaxSystemApiRegistryState
      expect(state.auth.userToken).to.equal('user-tok')
    })
    it('sets readyPromise to resolved false when no paths', async () => {
      configureAppHAXSystemApiRegistry({})
      const state = globalThis.__AppHaxSystemApiRegistryState
      expect(state.readyPromise).to.exist
      expect(state.bootstrapping).to.be.false
      expect(state.bootstrapped).to.be.false
    })
  })

  describe('waitForAppHAXSystemApiRegistryReady', () => {
    it('returns existing readyPromise when available', async () => {
      const firstPromise = configureAppHAXSystemApiRegistry({})
      const result = waitForAppHAXSystemApiRegistryReady()
      expect(result).to.equal(firstPromise)
    })
    it('configures and returns promise when no readyPromise', async () => {
      resetState()
      // Delete readyPromise to simulate fresh state
      if (globalThis.__AppHaxSystemApiRegistryState) {
        globalThis.__AppHaxSystemApiRegistryState.readyPromise = null
        globalThis.__AppHaxSystemApiRegistryState.appSettings = {}
      }
      const result = waitForAppHAXSystemApiRegistryReady()
      expect(result).to.exist
      const ok = await result
      expect(ok).to.be.false
    })
  })

  describe('deriveSystemApiBasePath edge cases', () => {
    it('returns false for connectionSettings not matching suffix', async () => {
      const result = configureAppHAXSystemApiRegistry({
        connectionSettings: 'dist/dev/connectionSettings.json',
      })
      const ok = await result
      // Should not derive a base path from a non-matching connectionSettings
      expect(ok).to.be.false
    })
    it('returns false for systemOpenApiPath with openapi suffix stripped', async () => {
      // When systemOpenApiPath is set, it's used directly as the openApiPath
      // and systemApiBasePath is derived from it by stripping /openapi.json
      const result = configureAppHAXSystemApiRegistry({
        systemOpenApiPath: '/api/openapi.json',
      })
      const ok = await result
      expect(ok).to.be.false
    })
    it('returns false for systemOpenApiPath with .yaml suffix', async () => {
      const result = configureAppHAXSystemApiRegistry({
        systemOpenApiPath: '/api/openapi.yaml',
      })
      const ok = await result
      expect(ok).to.be.false
    })
  })

  describe('bootstrap with a mocked OpenAPI spec', () => {
    const openApiSpec = {
      openapi: '3.0.0',
      components: {
        securitySchemes: {
          bearerJwt: { type: 'http', scheme: 'bearer' },
          siteApiKey: { type: 'apiKey', in: 'header', name: 'site_token' },
          userApiKey: { type: 'apiKey', in: 'query', name: 'user_token' },
          siteQueryKey: { type: 'apiKey', in: 'query', name: 'site_token' },
          bearerAuth: { type: 'http', scheme: 'bearer' },
        },
      },
      paths: {
        '/system/api/v1': {
          parameters: [
            { name: 'verbose', in: 'query', description: 'Verbose output' },
            { name: '', in: 'query' },
            'not-a-parameter',
          ],
          get: {
            operationId: 'systemStatusGet',
            summary: 'System status',
            description: 'Status of the system',
            parameters: [{ name: 'extra' }],
          },
        },
        '/system/api/v1/sites': {
          post: {
            operationId: 'createSite',
            security: [{ siteApiKey: [] }],
            parameters: [{ name: 'siteName', in: 'path' }],
          },
        },
        '/system/api/v1/admin': {
          security: [{ bearerJwt: [] }],
          get: {
            operationId: 'adminGet',
            security: { notAnArray: true },
          },
          put: { operationId: 'putSite' },
        },
        '/system/api/v1extra': {
          get: { operationId: 'weirdPrefixGet' },
        },
        '/system/api/v1/broken': {
          get: null,
          post: {},
          delete: { operationId: 'deleteSite' },
        },
        '/other/api': {
          get: { operationId: 'skippedGet' },
        },
      },
    }

    let originalFetch
    beforeEach(() => {
      originalFetch = globalThis.fetch
    })
    afterEach(() => {
      globalThis.fetch = originalFetch
    })

    function mockFetchWithSpec(spec) {
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => spec,
      })
    }

    it('bootstraps and registers @system operations from the spec', async () => {
      mockFetchWithSpec(openApiSpec)
      const result = configureAppHAXSystemApiRegistry({
        // trailing slash exercises path normalization
        systemApiBasePath: '/sys/',
        jwt: 'jwt-token',
        siteToken: 'site-token',
        userToken: 'user-token',
      })
      expect(await result).to.be.true
      const state = globalThis.__AppHaxSystemApiRegistryState
      expect(state.bootstrapped).to.be.true
      expect(state.bootstrapping).to.be.false
      expect(state.securitySchemes.bearerJwt).to.exist
      expect(MicroFrontendRegistry.has('@system/systemStatusGet')).to.be.true
      expect(MicroFrontendRegistry.has('@system/createSite')).to.be.true
      expect(MicroFrontendRegistry.has('@system/putSite')).to.be.true
      expect(MicroFrontendRegistry.has('@system/deleteSite')).to.be.true
      // path prefix mismatch, null operation, and missing operationId are skipped
      expect(MicroFrontendRegistry.has('@system/skippedGet')).to.be.false
      // base path == spec base maps to the bare system base
      const status = MicroFrontendRegistry.get('@system/systemStatusGet')
      expect(status.endpoint).to.equal('/sys')
      // prefixed spec paths keep only the remainder
      const create = MicroFrontendRegistry.get('@system/createSite')
      expect(create.endpoint).to.equal('/sys/sites')
      // non /v1/ prefixed paths append whole
      const weird = MicroFrontendRegistry.get('@system/weirdPrefixGet')
      expect(weird.endpoint).to.equal('/sys/system/api/v1extra')
    })

    it('returns the same pending promise while bootstrapping', async () => {
      mockFetchWithSpec(openApiSpec)
      const first = configureAppHAXSystemApiRegistry({
        systemApiBasePath: '/sys',
      })
      const second = configureAppHAXSystemApiRegistry({
        systemApiBasePath: '/sys',
      })
      expect(second).to.equal(first)
      expect(await first).to.be.true
    })

    it('returns the settled readyPromise when reconfigured to the same target', async () => {
      mockFetchWithSpec(openApiSpec)
      const first = configureAppHAXSystemApiRegistry({
        systemApiBasePath: '/sys',
      })
      await first
      const second = configureAppHAXSystemApiRegistry({
        systemApiBasePath: '/sys',
      })
      expect(second).to.equal(first)
    })

    it('re-bootstraps and re-registers over existing entries when the target changes', async () => {
      mockFetchWithSpec(openApiSpec)
      await configureAppHAXSystemApiRegistry({ systemApiBasePath: '/sys' })
      const second = configureAppHAXSystemApiRegistry({
        systemApiBasePath: '/sys2',
      })
      expect(await second).to.be.true
      expect(MicroFrontendRegistry.has('@system/systemStatusGet')).to.be.true
      const status = MicroFrontendRegistry.get('@system/systemStatusGet')
      expect(status.endpoint).to.equal('/sys2')
    })

    it('fails gracefully when the OpenAPI response is not ok', async () => {
      globalThis.fetch = async () => ({ ok: false, status: 404 })
      const result = configureAppHAXSystemApiRegistry({
        systemApiBasePath: '/sys',
      })
      expect(await result).to.be.false
      const state = globalThis.__AppHaxSystemApiRegistryState
      expect(state.bootstrapped).to.be.false
      expect(state.bootstrapping).to.be.false
    })

    it('fails when the spec has no paths at all', async () => {
      mockFetchWithSpec({ openapi: '3.0.0' })
      const result = configureAppHAXSystemApiRegistry({
        systemApiBasePath: '/sys',
      })
      expect(await result).to.be.false
    })

    it('fails when no spec path matches the system base path', async () => {
      mockFetchWithSpec({
        paths: { '/other/api': { get: { operationId: 'skipped' } } },
      })
      const result = configureAppHAXSystemApiRegistry({
        systemApiBasePath: '/sys',
      })
      expect(await result).to.be.false
    })

    it('prefixes the tenant base path for a relative systemOpenApiPath', async () => {
      mockFetchWithSpec(openApiSpec)
      const result = configureAppHAXSystemApiRegistry({
        siteApiBasePath: '/tenant/x/api/v1',
        systemOpenApiPath: 'custom/openapi.json',
      })
      expect(await result).to.be.true
      const status = MicroFrontendRegistry.get('@system/systemStatusGet')
      expect(status.endpoint).to.equal('/custom')
    })

    it('treats a non-string systemApiBasePath as empty', async () => {
      const result = configureAppHAXSystemApiRegistry({
        systemApiBasePath: 123,
      })
      expect(await result).to.be.false
    })
  })

  describe('auth provider', () => {
    const openApiSpec = {
      openapi: '3.0.0',
      components: {
        securitySchemes: {
          bearerJwt: { type: 'http', scheme: 'bearer' },
          siteApiKey: { type: 'apiKey', in: 'header', name: 'site_token' },
          userApiKey: { type: 'apiKey', in: 'query', name: 'user_token' },
          siteQueryKey: { type: 'apiKey', in: 'query', name: 'site_token' },
          bearerAuth: { type: 'http', scheme: 'bearer' },
        },
      },
      paths: {
        '/system/api/v1': {
          get: { operationId: 'systemStatusGet' },
        },
      },
    }

    let originalFetch
    beforeEach(() => {
      originalFetch = globalThis.fetch
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => openApiSpec,
      })
      // drop any provider installed by earlier tests so this test installs a
      // clean, unchained provider; chained providers read the shared
      // state.previousAuthProvider field at call time, so invoking a chained
      // provider would recurse infinitely
      MicroFrontendRegistry.setAuthProvider(null)
    })
    afterEach(() => {
      globalThis.fetch = originalFetch
    })

    async function bootstrappedProvider() {
      await configureAppHAXSystemApiRegistry({
        systemApiBasePath: '/sys',
        jwt: 'jwt-token',
        siteToken: 'site-token',
        userToken: 'user-token',
      })
      return MicroFrontendRegistry.authProvider
    }

    it('passes non-system operations through untouched', async () => {
      const provider = await bootstrappedProvider()
      const headers = await provider([{ bearerJwt: [] }], {
        name: 'some-other-operation',
      })
      expect(headers).to.deep.equal({})
    })

    it('resolves an http bearer scheme to an Authorization header', async () => {
      const provider = await bootstrappedProvider()
      const headers = await provider([{ bearerJwt: [] }], {
        name: '@system/systemStatusGet',
      })
      expect(headers.Authorization).to.equal('Bearer jwt-token')
    })

    it('resolves an apiKey header scheme to its named header', async () => {
      const provider = await bootstrappedProvider()
      const headers = await provider([{ siteApiKey: [] }], {
        name: '@system/systemStatusGet',
      })
      expect(headers.site_token).to.equal('site-token')
    })

    it('resolves an apiKey query scheme to the X-HAXCMS token headers', async () => {
      const provider = await bootstrappedProvider()
      const userHeaders = await provider([{ userApiKey: [] }], {
        name: '@system/systemStatusGet',
      })
      expect(userHeaders['X-HAXCMS-User-Token']).to.equal('user-token')
      const siteHeaders = await provider([{ siteQueryKey: [] }], {
        name: '@system/systemStatusGet',
      })
      expect(siteHeaders['X-HAXCMS-Site-Token']).to.equal('site-token')
    })

    it('resolves a scheme named bearerAuth to an Authorization header', async () => {
      const provider = await bootstrappedProvider()
      const headers = await provider([{ bearerAuth: [] }], {
        name: '@system/systemStatusGet',
      })
      expect(headers.Authorization).to.equal('Bearer jwt-token')
    })

    it('returns an empty object when requirements are empty', async () => {
      const provider = await bootstrappedProvider()
      const headers = await provider([], { name: '@system/systemStatusGet' })
      expect(headers).to.deep.equal({})
    })

    it('returns an empty object when no requirement can be satisfied', async () => {
      const provider = await bootstrappedProvider()
      // unknown scheme cannot resolve a token
      const unknown = await provider([{ unknownScheme: [] }], {
        name: '@system/systemStatusGet',
      })
      expect(unknown).to.deep.equal({})
      // null requirement entries are skipped
      const withNull = await provider([null, { bearerJwt: [] }], {
        name: '@system/systemStatusGet',
      })
      expect(withNull.Authorization).to.equal('Bearer jwt-token')
    })

    it('returns an empty object when the matching token is empty', async () => {
      const provider = await bootstrappedProvider()
      const state = globalThis.__AppHaxSystemApiRegistryState
      const savedJwt = state.auth.jwt
      state.auth.jwt = ''
      try {
        const headers = await provider([{ bearerJwt: [] }], {
          name: '@system/systemStatusGet',
        })
        expect(headers).to.deep.equal({})
      } finally {
        state.auth.jwt = savedJwt
      }
    })
  })
})
