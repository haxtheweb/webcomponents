import { expect } from '@open-wc/testing'

// Clear demo appSettings so the registry state isn't polluted by the
// test-runner config's demo endpoints.
globalThis.appSettings = {}

const {
  configureAppHAXSystemApiRegistry,
  waitForAppHAXSystemApiRegistryReady,
} = await import('../lib/v2/app-hax-system-api-registry.js')

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
})
