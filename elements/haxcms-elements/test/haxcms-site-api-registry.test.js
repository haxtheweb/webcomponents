import { expect } from '@open-wc/testing'
import { MicroFrontendRegistry } from '@haxtheweb/micro-frontend-registry/micro-frontend-registry.js'
import {
  configureHAXCMSSiteApiRegistry,
  waitForHAXCMSSiteApiRegistryReady,
} from '../lib/core/utils/haxcms-site-api-registry.js'

// The module stores state on globalThis.__HAXCMSSiteApiRegistryState.
// Reset it in place between tests so nothing leaks across cases, and
// snapshot/remove any @site/* operations we register so the shared
// registry singleton is left as we found it.
const SITE_OPS = ['@site/getSiteManifest', '@site/createItem', '@site/deleteItem']

function getState() {
  return globalThis.__HAXCMSSiteApiRegistryState
}

function resetState() {
  const state = getState()
  if (state) {
    state.appSettings = {}
    state.auth = { jwt: '', siteToken: '', userToken: '' }
    state.securitySchemes = {}
    state.siteApiBasePath = ''
    state.siteOpenApiPath = ''
    state.readyPromise = null
    state.bootstrapping = false
    state.bootstrapped = false
    state.previousAuthProvider = null
    state.providerApplied = false
  }
}

describe('haxcms-site-api-registry', () => {
  let savedList
  let savedConfig

  beforeEach(() => {
    savedList = MicroFrontendRegistry.list.slice()
    savedConfig = globalThis.MicroFrontendRegistryConfig
    globalThis.MicroFrontendRegistryConfig = {}
    MicroFrontendRegistry.setAuthProvider(null)
    resetState()
  })

  afterEach(() => {
    MicroFrontendRegistry.list.length = 0
    MicroFrontendRegistry.list.push(...savedList)
    globalThis.MicroFrontendRegistryConfig = savedConfig
    MicroFrontendRegistry.setAuthProvider(null)
    resetState()
  })

  describe('configureHAXCMSSiteApiRegistry early exits', () => {
    it('resolves false when appSettings has no site API paths', async () => {
      const ok = await configureHAXCMSSiteApiRegistry({})
      expect(ok).to.equal(false)
      const state = getState()
      expect(state.bootstrapping).to.equal(false)
      expect(state.bootstrapped).to.equal(false)
    })

    it('handles non-object appSettings gracefully', async () => {
      const ok = await configureHAXCMSSiteApiRegistry(null)
      expect(ok).to.equal(false)
      expect(getState().appSettings).to.deep.equal({})
    })

    it('fails when siteApiBasePath is set but openapi.json fetch fails', async () => {
      const ok = await configureHAXCMSSiteApiRegistry({
        siteApiBasePath: '/x/api',
      })
      expect(ok).to.equal(false)
      expect(getState().bootstrapped).to.equal(false)
    })

    it('derives the base path from siteOpenApiPath (.json)', async () => {
      // no fetch mock: fetch of /tenant/x/api/v2/openapi.json fails,
      // but the base path must have been derived before the fetch
      const ok = await configureHAXCMSSiteApiRegistry({
        siteOpenApiPath: '/tenant/x/api/v2/openapi.json',
      })
      expect(ok).to.equal(false)
      expect(getState().siteApiBasePath).to.equal('/tenant/x/api/v2')
      expect(getState().siteOpenApiPath).to.equal('/tenant/x/api/v2/openapi.json')
    })

    it('derives the base path from siteOpenApiPath (.yaml)', async () => {
      const ok = await configureHAXCMSSiteApiRegistry({
        siteOpenApiPath: '/x/api/openapi.yaml',
      })
      expect(ok).to.equal(false)
      expect(getState().siteApiBasePath).to.equal('/x/api')
    })

    it('keeps an explicit siteOpenApiPath verbatim alongside siteApiBasePath', async () => {
      const ok = await configureHAXCMSSiteApiRegistry({
        siteApiBasePath: '/x/api',
        siteOpenApiPath: '/custom/openapi.json',
      })
      expect(ok).to.equal(false)
      expect(getState().siteOpenApiPath).to.equal('/custom/openapi.json')
    })

    it('normalizes trailing slashes and missing leading slash on base path', async () => {
      const ok = await configureHAXCMSSiteApiRegistry({
        siteApiBasePath: 'x/api/',
      })
      expect(ok).to.equal(false)
      expect(getState().siteApiBasePath).to.equal('/x/api')
      expect(getState().siteOpenApiPath).to.equal('/x/api/openapi.json')
    })

    it('sets readyPromise to resolved false when no paths derivable', async () => {
      configureHAXCMSSiteApiRegistry({})
      const state = getState()
      expect(state.readyPromise).to.exist
      expect(await state.readyPromise).to.equal(false)
    })
  })

  describe('auth state updates', () => {
    it('picks up jwt from appSettings', async () => {
      await configureHAXCMSSiteApiRegistry({ jwt: 'settings-jwt' })
      expect(getState().auth.jwt).to.equal('settings-jwt')
    })

    it('overrides jwt when the second argument is provided', async () => {
      await configureHAXCMSSiteApiRegistry({ jwt: 'settings-jwt' }, 'override-jwt')
      expect(getState().auth.jwt).to.equal('override-jwt')
    })

    it('picks up siteToken and userToken from appSettings', async () => {
      await configureHAXCMSSiteApiRegistry({
        siteToken: 'site-tok',
        userToken: 'user-tok',
      })
      expect(getState().auth.siteToken).to.equal('site-tok')
      expect(getState().auth.userToken).to.equal('user-tok')
    })

    it('does not clobber an existing jwt when appSettings lacks one', async () => {
      await configureHAXCMSSiteApiRegistry({ jwt: 'keep-me' })
      await configureHAXCMSSiteApiRegistry({})
      expect(getState().auth.jwt).to.equal('keep-me')
    })

    it('clears siteToken when appSettings explicitly sets it empty', async () => {
      await configureHAXCMSSiteApiRegistry({ siteToken: 'site-tok' })
      await configureHAXCMSSiteApiRegistry({ siteToken: '' })
      expect(getState().auth.siteToken).to.equal('')
    })
  })

  describe('waitForHAXCMSSiteApiRegistryReady', () => {
    it('returns resolved false when no readyPromise exists', async () => {
      const ok = await waitForHAXCMSSiteApiRegistryReady()
      expect(ok).to.equal(false)
    })

    it('returns the existing readyPromise after configure', async () => {
      const first = configureHAXCMSSiteApiRegistry({})
      const second = waitForHAXCMSSiteApiRegistryReady()
      expect(second).to.equal(first)
      expect(await second).to.equal(false)
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
        },
      },
      paths: {
        '/x/api/v1/manifest': {
          parameters: [
            { name: 'verbose', in: 'query' },
            { name: '' },
            'not-a-parameter',
          ],
          get: {
            operationId: 'getSiteManifest',
            summary: 'Get the site manifest',
            description: 'Returns the site manifest',
            parameters: [{ name: 'extra' }],
          },
          // null operation on a real method key must be skipped
          post: null,
        },
        '/x/api/v1/items': {
          post: {
            operationId: 'createItem',
            security: [{ siteApiKey: [] }],
            parameters: [{ name: 'itemName', in: 'path' }],
          },
        },
        '/x/api/v1/delete': {
          // path-level security applies when the operation omits it
          security: [{ bearerJwt: [] }],
          delete: { operationId: 'deleteItem' },
          // an operation with a non-array security normalizes to []
          put: { operationId: 'noIdOk', security: { notAnArray: true } },
          // an operation with no operationId is skipped
          patch: { description: 'no id here' },
        },
        // path configs that are not /x/api prefixed or not objects are skipped
        '/other/api': {
          get: { operationId: 'skippedGet' },
        },
        '/x/api/v1/broken': null,
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

    it('bootstraps and registers @site operations from the spec', async () => {
      mockFetchWithSpec(openApiSpec)
      const ok = await configureHAXCMSSiteApiRegistry({
        siteApiBasePath: '/x/api',
        jwt: 'jwt-token',
        siteToken: 'site-token',
        userToken: 'user-token',
      })
      expect(ok).to.equal(true)
      const state = getState()
      expect(state.bootstrapped).to.equal(true)
      expect(state.bootstrapping).to.equal(false)
      expect(state.securitySchemes.bearerJwt).to.exist

      expect(MicroFrontendRegistry.has('@site/getSiteManifest')).to.equal(true)
      expect(MicroFrontendRegistry.has('@site/createItem')).to.equal(true)
      expect(MicroFrontendRegistry.has('@site/deleteItem')).to.equal(true)
      expect(MicroFrontendRegistry.has('@site/noIdOk')).to.equal(true)
      // skipped: no operationId, non-/x/api path, null operation
      expect(MicroFrontendRegistry.has('@site/skippedGet')).to.equal(false)

      // endpoint strips the /x/api prefix; bare prefix maps to /
      const manifest = MicroFrontendRegistry.get('@site/getSiteManifest')
      expect(manifest.endpoint).to.equal('/x/api/v1/manifest')
      expect(manifest.method).to.equal('GET')
      expect(manifest.title).to.equal('Get the site manifest')
      expect(manifest.description).to.equal('Returns the site manifest')
      // params from path + operation level merged, blank names skipped
      expect(manifest.params.verbose).to.equal('query parameter')
      expect(manifest.params.extra).to.equal('query parameter')

      const create = MicroFrontendRegistry.get('@site/createItem')
      expect(create.endpoint).to.equal('/x/api/v1/items')
      expect(create.method).to.equal('POST')
      expect(create.security).to.deep.equal([{ siteApiKey: [] }])
      expect(create.params.itemName).to.equal('path parameter')

      // operation-level non-array security normalizes to []
      const noIdOk = MicroFrontendRegistry.get('@site/noIdOk')
      expect(noIdOk.security).to.deep.equal([])

      // path-level security applies when operation omits it
      const del = MicroFrontendRegistry.get('@site/deleteItem')
      expect(del.security).to.deep.equal([{ bearerJwt: [] }])
      expect(del.method).to.equal('DELETE')
    })

    it('returns the same pending promise while bootstrapping', async () => {
      mockFetchWithSpec(openApiSpec)
      const first = configureHAXCMSSiteApiRegistry({ siteApiBasePath: '/x/api' })
      const second = configureHAXCMSSiteApiRegistry({ siteApiBasePath: '/x/api' })
      expect(second).to.equal(first)
      expect(await first).to.equal(true)
    })

    it('returns the settled readyPromise when reconfigured to the same target', async () => {
      mockFetchWithSpec(openApiSpec)
      const first = configureHAXCMSSiteApiRegistry({ siteApiBasePath: '/x/api' })
      await first
      const second = configureHAXCMSSiteApiRegistry({ siteApiBasePath: '/x/api' })
      expect(second).to.equal(first)
    })

    it('re-bootstraps and re-registers over existing entries when the target changes', async () => {
      mockFetchWithSpec(openApiSpec)
      await configureHAXCMSSiteApiRegistry({ siteApiBasePath: '/x/api' })
      const second = configureHAXCMSSiteApiRegistry({
        siteApiBasePath: '/tenant/x/api',
      })
      expect(await second).to.equal(true)
      const manifest = MicroFrontendRegistry.get('@site/getSiteManifest')
      expect(manifest.endpoint).to.equal('/tenant/x/api/v1/manifest')
    })

    it('fails gracefully when the OpenAPI response is not ok', async () => {
      globalThis.fetch = async () => ({ ok: false, status: 404 })
      const ok = await configureHAXCMSSiteApiRegistry({ siteApiBasePath: '/x/api' })
      expect(ok).to.equal(false)
      expect(getState().bootstrapped).to.equal(false)
      expect(getState().bootstrapping).to.equal(false)
    })

    it('fails when the spec registers no @site operations', async () => {
      mockFetchWithSpec({ openapi: '3.0.0', paths: { '/other/api': { get: { operationId: 'x' } } } })
      const ok = await configureHAXCMSSiteApiRegistry({ siteApiBasePath: '/x/api' })
      expect(ok).to.equal(false)
      expect(getState().bootstrapped).to.equal(false)
    })

    it('fails when the spec has no paths at all', async () => {
      mockFetchWithSpec({ openapi: '3.0.0' })
      const ok = await configureHAXCMSSiteApiRegistry({ siteApiBasePath: '/x/api' })
      expect(ok).to.equal(false)
    })

    it('bootstraps from an explicit siteOpenApiPath only', async () => {
      mockFetchWithSpec(openApiSpec)
      const ok = await configureHAXCMSSiteApiRegistry({
        siteOpenApiPath: '/x/api/openapi.json',
      })
      expect(ok).to.equal(true)
      expect(MicroFrontendRegistry.has('@site/getSiteManifest')).to.equal(true)
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
          bearerAuth: { type: 'http', scheme: 'bearer' },
          legacySite: { type: 'oauth2' },
          emptyHeaderKey: { type: 'apiKey', in: 'header', name: '' },
        },
      },
      paths: {
        '/x/api/v1/manifest': {
          get: { operationId: 'getSiteManifest' },
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
    })
    afterEach(() => {
      globalThis.fetch = originalFetch
    })

    async function bootstrappedProvider() {
      await configureHAXCMSSiteApiRegistry({
        siteApiBasePath: '/x/api',
        jwt: 'jwt-token',
        siteToken: 'site-token',
        userToken: 'user-token',
      })
      return MicroFrontendRegistry.authProvider
    }

    it('passes non-site operations through untouched', async () => {
      const provider = await bootstrappedProvider()
      const headers = await provider([{ bearerJwt: [] }], {
        name: '@system/someOtherOperation',
      })
      expect(headers).to.deep.equal({})
    })

    it('resolves an http bearer scheme to an Authorization header', async () => {
      const provider = await bootstrappedProvider()
      const headers = await provider([{ bearerJwt: [] }], {
        name: '@site/getSiteManifest',
      })
      expect(headers.Authorization).to.equal('Bearer jwt-token')
    })

    it('resolves an apiKey header scheme to its named header', async () => {
      const provider = await bootstrappedProvider()
      const headers = await provider([{ siteApiKey: [] }], {
        name: '@site/getSiteManifest',
      })
      expect(headers.site_token).to.equal('site-token')
    })

    it('resolves an apiKey query scheme via fallback to the scheme-name header', async () => {
      const provider = await bootstrappedProvider()
      const headers = await provider([{ userApiKey: [] }], {
        name: '@site/getSiteManifest',
      })
      expect(headers.userApiKey).to.equal('user-token')
    })

    it('resolves a scheme named bearerAuth to an Authorization header', async () => {
      const provider = await bootstrappedProvider()
      const headers = await provider([{ bearerAuth: [] }], {
        name: '@site/getSiteManifest',
      })
      expect(headers.Authorization).to.equal('Bearer jwt-token')
    })

    it('falls back to scheme-name header for unknown scheme types', async () => {
      const provider = await bootstrappedProvider()
      const headers = await provider([{ legacySite: [] }], {
        name: '@site/getSiteManifest',
      })
      expect(headers.legacySite).to.equal('site-token')
    })

    it('returns an empty object when requirements are empty', async () => {
      const provider = await bootstrappedProvider()
      const headers = await provider([], { name: '@site/getSiteManifest' })
      expect(headers).to.deep.equal({})
    })

    it('returns an empty object when no requirement can be satisfied', async () => {
      const provider = await bootstrappedProvider()
      // unknown scheme name resolves to no token at all
      const unknown = await provider([{ mysteryScheme: [] }], {
        name: '@site/getSiteManifest',
      })
      expect(unknown).to.deep.equal({})
      // apiKey header scheme with an empty header name cannot resolve
      const emptyName = await provider([{ emptyHeaderKey: [] }], {
        name: '@site/getSiteManifest',
      })
      expect(emptyName).to.deep.equal({})
    })

    it('skips null requirement entries and resolves the next one', async () => {
      const provider = await bootstrappedProvider()
      const headers = await provider([null, { bearerJwt: [] }], {
        name: '@site/getSiteManifest',
      })
      expect(headers.Authorization).to.equal('Bearer jwt-token')
    })

    it('returns an empty object when the matching token is empty', async () => {
      const provider = await bootstrappedProvider()
      const state = getState()
      const savedJwt = state.auth.jwt
      state.auth.jwt = ''
      try {
        const headers = await provider([{ bearerJwt: [] }], {
          name: '@site/getSiteManifest',
        })
        expect(headers).to.deep.equal({})
      } finally {
        state.auth.jwt = savedJwt
      }
    })

    it('merges headers from a previously installed auth provider', async () => {
      // install a previous provider first; configure must capture and chain it
      MicroFrontendRegistry.setAuthProvider(async () => ({ 'X-Previous': 'yes' }))
      resetState()
      const ok = await configureHAXCMSSiteApiRegistry({
        siteApiBasePath: '/x/api',
        jwt: 'jwt-token',
      })
      expect(ok).to.equal(true)
      const provider = MicroFrontendRegistry.authProvider
      const headers = await provider([{ bearerJwt: [] }], {
        name: '@site/getSiteManifest',
      })
      expect(headers['X-Previous']).to.equal('yes')
      expect(headers.Authorization).to.equal('Bearer jwt-token')
    })

    it('ignores a previous provider that returns a non-object', async () => {
      MicroFrontendRegistry.setAuthProvider(async () => 'nope')
      resetState()
      const ok = await configureHAXCMSSiteApiRegistry({
        siteApiBasePath: '/x/api',
        jwt: 'jwt-token',
      })
      expect(ok).to.equal(true)
      const headers = await MicroFrontendRegistry.authProvider([{ bearerJwt: [] }], {
        name: '@site/getSiteManifest',
      })
      expect(headers.Authorization).to.equal('Bearer jwt-token')
    })
  })
})
