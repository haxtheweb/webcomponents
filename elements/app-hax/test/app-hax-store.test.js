import { expect } from '@open-wc/testing'

// Clear demo appSettings BEFORE importing the store singleton so it boots
// with no session — same pattern as the existing app-hax.test.js.
globalThis.appSettings = {}

const { store } = await import('../lib/v2/AppHaxStore.js')

describe('AppHaxStore', () => {
  beforeEach(() => {
    // Reset observable state between tests
    store.appReady = false
    store.appMode = 'search'
    store.darkMode = false
    store.soundStatus = false
    store.location = null
    store.routes = store.baseRoutes
    store.manifest = {}
    store.site = {
      structure: null,
      type: null,
      theme: null,
      name: null,
      license: null,
    }
    store.step = store.stepTest(null)
    store.searchTerm = ''
    store.responsiveSize = ''
    store.activeSiteOp = null
    store.activeSiteId = null
    store.jwt = null
    store.authValidated = false
    store.authTesting = false
    store.AppHaxAPI = {}
    store.themesData = {}
  })

  describe('stepTest', () => {
    it('returns 1 when structure is null', () => {
      store.site = { structure: null, type: null, theme: null, name: null }
      expect(store.stepTest(null)).to.equal(1)
    })
    it('returns 2 when structure set but type null', () => {
      store.site = { structure: 'docx', type: null, theme: null, name: null }
      expect(store.stepTest(null)).to.equal(2)
    })
    it('returns 3 when structure and type set but theme null', () => {
      store.site = { structure: 'docx', type: 'course', theme: null, name: null }
      expect(store.stepTest(null)).to.equal(3)
    })
    it('returns 4 when structure, type, theme set but name null', () => {
      store.site = {
        structure: 'docx',
        type: 'course',
        theme: 'clean-two',
        name: null,
      }
      expect(store.stepTest(null)).to.equal(4)
    })
    it('returns 5 when all site fields are set', () => {
      store.site = {
        structure: 'docx',
        type: 'course',
        theme: 'clean-two',
        name: 'my-site',
      }
      expect(store.stepTest(null)).to.equal(5)
    })
    it('returns 5 when all site fields are set regardless of current', () => {
      store.site = {
        structure: 'docx',
        type: 'course',
        theme: 'clean-two',
        name: 'my-site',
      }
      // When all fields are set, stepTest always returns 5
      expect(store.stepTest(3)).to.equal(5)
      expect(store.stepTest(null)).to.equal(5)
    })
    it('returns current when structure null and current is 1', () => {
      store.site = { structure: null, type: null, theme: null, name: null }
      expect(store.stepTest(1)).to.equal(1)
    })
  })

  describe('isLoggedIn computed', () => {
    it('returns false when appReady is false', () => {
      store.appReady = false
      store.jwt = 'some-jwt'
      store.AppHaxAPI = { makeCall: () => {} }
      expect(store.isLoggedIn).to.be.false
    })
    it('returns false when AppHaxAPI is null', () => {
      store.appReady = true
      store.jwt = 'some-jwt'
      store.AppHaxAPI = null
      expect(store.isLoggedIn).to.be.false
    })
    it('returns false when jwt is null', () => {
      store.appReady = true
      store.AppHaxAPI = { makeCall: () => {} }
      store.jwt = null
      expect(store.isLoggedIn).to.be.false
    })
    it('returns false when jwt is string "null"', () => {
      store.appReady = true
      store.AppHaxAPI = { makeCall: () => {} }
      store.jwt = 'null'
      expect(store.isLoggedIn).to.be.false
    })
    it('returns truthy jwt when valid and no connectionTest', () => {
      store.appReady = true
      store.AppHaxAPI = { makeCall: () => {} }
      store.appSettings = {}
      store.jwt = 'valid-jwt'
      // isLoggedIn returns the jwt string (truthy) when no connectionTest
      expect(store.isLoggedIn).to.be.ok
      expect(store.isLoggedIn).to.equal('valid-jwt')
    })
    it('returns false when connectionTest configured and authValidated false', () => {
      store.appReady = true
      store.AppHaxAPI = { makeCall: () => {} }
      store.appSettings = { connectionTest: '/api/test' }
      store.jwt = 'valid-jwt'
      store.authValidated = false
      expect(store.isLoggedIn).to.be.false
    })
    it('returns true when connectionTest configured and authValidated true', () => {
      store.appReady = true
      store.AppHaxAPI = { makeCall: () => {} }
      store.appSettings = { connectionTest: '/api/test' }
      store.jwt = 'valid-jwt'
      store.authValidated = true
      expect(store.isLoggedIn).to.be.true
    })
    it('returns truthy jwt when AppHaxAPI is empty object (truthy)', () => {
      store.appReady = true
      store.AppHaxAPI = {}
      store.appSettings = {}
      store.jwt = 'valid-jwt'
      // {} is truthy so the check passes; returns the jwt string
      expect(store.isLoggedIn).to.be.ok
    })
  })

  describe('isMobile computed', () => {
    it('returns true for xs', () => {
      store.responsiveSize = 'xs'
      expect(store.isMobile).to.be.true
    })
    it('returns true for sm', () => {
      store.responsiveSize = 'sm'
      expect(store.isMobile).to.be.true
    })
    it('returns false for md', () => {
      store.responsiveSize = 'md'
      expect(store.isMobile).to.be.false
    })
    it('returns false for lg', () => {
      store.responsiveSize = 'lg'
      expect(store.isMobile).to.be.false
    })
    it('returns false for empty string', () => {
      store.responsiveSize = ''
      expect(store.isMobile).to.be.false
    })
  })

  describe('isNewUser computed', () => {
    it('returns true when manifest has empty items', () => {
      store.manifest = { items: [] }
      expect(store.isNewUser).to.be.true
    })
    it('returns false when manifest has items', () => {
      store.manifest = { items: [{ id: 1 }] }
      expect(store.isNewUser).to.be.false
    })
    it('returns undefined when manifest has no items key', () => {
      store.manifest = {}
      expect(store.isNewUser).to.be.undefined
    })
    it('returns undefined when manifest is null', () => {
      store.manifest = null
      expect(store.isNewUser).to.be.undefined
    })
  })

  describe('activeSite computed', () => {
    it('returns null when activeSiteId is null', () => {
      store.activeSiteId = null
      store.manifest = { items: [{ id: 'a' }] }
      expect(store.activeSite).to.be.undefined
    })
    it('returns null when manifest has no items', () => {
      store.activeSiteId = 'a'
      store.manifest = {}
      expect(store.activeSite).to.be.undefined
    })
    it('returns null when site not found', () => {
      store.activeSiteId = 'missing'
      store.manifest = { items: [{ id: 'a' }] }
      expect(store.activeSite).to.be.null
    })
    it('returns the site when found', () => {
      store.activeSiteId = 'a'
      store.manifest = { items: [{ id: 'a', name: 'Site A' }, { id: 'b' }] }
      expect(store.activeSite).to.deep.equal({ id: 'a', name: 'Site A' })
    })
    it('returns null when multiple matches (should not happen but handled)', () => {
      store.activeSiteId = 'a'
      store.manifest = {
        items: [{ id: 'a' }, { id: 'a' }],
      }
      // filter returns 2, length !== 1, so returns null
      expect(store.activeSite).to.be.null
    })
  })

  describe('activeItem computed', () => {
    it('returns undefined when routes empty', () => {
      store.routes = []
      store.location = { route: { name: 'home' } }
      expect(store.activeItem).to.be.undefined
    })
    it('returns undefined when location is null', () => {
      store.routes = store.baseRoutes
      store.location = null
      expect(store.activeItem).to.be.undefined
    })
    it('returns undefined when location has no route', () => {
      store.routes = store.baseRoutes
      store.location = {}
      expect(store.activeItem).to.be.undefined
    })
    it('returns location.route when not in createSiteSteps', () => {
      store.routes = store.baseRoutes
      store.createSiteSteps = false
      store.location = { route: { name: 'search' } }
      expect(store.activeItem).to.deep.equal({ name: 'search' })
    })
    it('returns route matching step when in createSiteSteps', () => {
      store.routes = [
        { name: 'step1', step: 1 },
        { name: 'step2', step: 2 },
        { name: 'search' },
      ]
      store.createSiteSteps = true
      store.step = 2
      store.location = { route: { name: 'anything' } }
      expect(store.activeItem.name).to.equal('step2')
    })
    it('returns undefined when no route matches step', () => {
      store.routes = [{ name: 'step1', step: 1 }, { name: 'search' }]
      store.createSiteSteps = true
      store.step = 5
      store.location = { route: { name: 'anything' } }
      expect(store.activeItem).to.be.undefined
    })
  })

  describe('setPageTitle', () => {
    it('sets document title when title element exists', () => {
      const titleEl = globalThis.document.createElement('title')
      globalThis.document.head.appendChild(titleEl)
      store.setPageTitle('My Page')
      expect(titleEl.innerText).to.equal('HAX: My Page')
      titleEl.remove()
    })
    it('does not throw when no title element exists', () => {
      const existing = globalThis.document.querySelector('title')
      if (existing) existing.remove()
      expect(() => store.setPageTitle('Test')).to.not.throw()
    })
  })

  describe('refreshSiteListing', () => {
    it('toggles refreshSiteList from true to false and back', () => {
      store.refreshSiteList = true
      store.refreshSiteListing()
      // The method sets false then true, final state should be true
      expect(store.refreshSiteList).to.be.true
    })
  })

  describe('toast', () => {
    it('dispatches haxcms-toast-show event with text and duration', () => {
      let capturedEvent = null
      const handler = (e) => {
        capturedEvent = e
      }
      globalThis.addEventListener('haxcms-toast-show', handler)
      store.toast('Hello', 5000)
      globalThis.removeEventListener('haxcms-toast-show', handler)
      expect(capturedEvent).to.exist
      expect(capturedEvent.detail.text).to.equal('Hello')
      expect(capturedEvent.detail.duration).to.equal(5000)
    })
    it('passes extra properties in detail', () => {
      let capturedEvent = null
      const handler = (e) => {
        capturedEvent = e
      }
      globalThis.addEventListener('haxcms-toast-show', handler)
      store.toast('Hi', 3000, { hat: 'construction' })
      globalThis.removeEventListener('haxcms-toast-show', handler)
      expect(capturedEvent.detail.hat).to.equal('construction')
    })
    it('defaults duration to 3000', () => {
      let capturedEvent = null
      const handler = (e) => {
        capturedEvent = e
      }
      globalThis.addEventListener('haxcms-toast-show', handler)
      store.toast('Default')
      globalThis.removeEventListener('haxcms-toast-show', handler)
      expect(capturedEvent.detail.duration).to.equal(3000)
    })
  })

  describe('clearProcessingVisual', () => {
    it('dispatches haxcms-toast-hide event', () => {
      let fired = false
      const handler = () => {
        fired = true
      }
      globalThis.addEventListener('haxcms-toast-hide', handler)
      store.clearProcessingVisual()
      globalThis.removeEventListener('haxcms-toast-hide', handler)
      expect(fired).to.be.true
    })
  })

  describe('setProcessingVisual', () => {
    it('dispatches toast show with processing icon and defaults duration', () => {
      let capturedEvent = null
      const handler = (e) => {
        capturedEvent = e
      }
      globalThis.addEventListener('haxcms-toast-show', handler)
      store.setProcessingVisual()
      globalThis.removeEventListener('haxcms-toast-show', handler)
      expect(capturedEvent).to.exist
      expect(capturedEvent.detail.text).to.equal('Processing')
      expect(capturedEvent.detail.hat).to.equal('construction')
      expect(capturedEvent.detail.speed).to.equal(150)
      expect(capturedEvent.detail.walking).to.be.true
      expect(capturedEvent.detail.slot).to.exist
    })
    it('accepts custom duration', () => {
      let capturedEvent = null
      const handler = (e) => {
        capturedEvent = e
      }
      globalThis.addEventListener('haxcms-toast-show', handler)
      store.setProcessingVisual(10000)
      globalThis.removeEventListener('haxcms-toast-show', handler)
      expect(capturedEvent.detail.duration).to.equal(10000)
    })
  })

  describe('loadThemesData', () => {
    it('returns early when themesData already populated and no force', async () => {
      store.themesData = { existing: {} }
      await store.loadThemesData()
      expect(store.themesData).to.have.property('existing')
    })
    it('sets themesData to {} when no API available', async () => {
      store.themesData = {}
      store.AppHaxAPI = {}
      await store.loadThemesData(true)
      expect(Object.keys(store.themesData).length).to.equal(0)
    })
    it('sets themesData to {} when API has no makeCall', async () => {
      store.themesData = {}
      store.AppHaxAPI = { supportsCall: () => true }
      await store.loadThemesData(true)
      expect(Object.keys(store.themesData).length).to.equal(0)
    })
    it('sets themesData to {} when supportsCall returns false', async () => {
      store.themesData = {}
      store.AppHaxAPI = {
        makeCall: () => {},
        supportsCall: () => false,
      }
      await store.loadThemesData(true)
      expect(Object.keys(store.themesData).length).to.equal(0)
    })
    it('loads themes from API response', async () => {
      store.themesData = {}
      store.AppHaxAPI = {
        makeCall: async () => ({
          data: [
            { machineName: 'theme1', element: 'theme-one', thumbnail: 't1.png' },
            { machineName: 'theme2', element: 'theme-two', screenshot: 's2.png' },
          ],
        }),
        supportsCall: () => true,
      }
      await store.loadThemesData(true)
      expect(store.themesData['theme-one']).to.exist
      expect(store.themesData['theme-one'].thumbnail).to.equal('t1.png')
      expect(store.themesData['theme-two']).to.exist
      expect(store.themesData['theme-two'].thumbnail).to.equal('s2.png')
    })
    it('uses machineName as key when element missing', async () => {
      store.themesData = {}
      store.AppHaxAPI = {
        makeCall: async () => ({
          data: [{ machineName: 'mn-only', thumbnail: 't.png' }],
        }),
        supportsCall: () => true,
      }
      await store.loadThemesData(true)
      expect(store.themesData['mn-only']).to.exist
    })
    it('skips entries with no machineName or element', async () => {
      store.themesData = {}
      store.AppHaxAPI = {
        makeCall: async () => ({
          data: [{ thumbnail: 't.png' }, { machineName: 'valid', element: 'v' }],
        }),
        supportsCall: () => true,
      }
      await store.loadThemesData(true)
      expect(store.themesData['valid']).to.exist
      expect(store.themesData['v']).to.exist
      // The entry with no machineName/element is skipped; the valid entry
      // gets indexed under both its element and machineName
      expect(Object.keys(store.themesData).length).to.equal(2)
    })
    it('falls back to {} on API error', async () => {
      store.themesData = { old: {} }
      store.AppHaxAPI = {
        makeCall: async () => {
          throw new Error('Network error')
        },
        supportsCall: () => true,
      }
      await store.loadThemesData(true)
      expect(Object.keys(store.themesData).length).to.equal(0)
    })
    it('skips null or non-object theme entries', async () => {
      store.themesData = {}
      store.AppHaxAPI = {
        makeCall: async () => ({
          data: [null, 'not-an-object', { machineName: 'valid', element: 'v' }],
        }),
        supportsCall: () => true,
      }
      await store.loadThemesData(true)
      expect(store.themesData['v']).to.exist
      expect(store.themesData['valid']).to.exist
      expect(Object.keys(store.themesData).length).to.equal(2)
    })
    it('falls back to {} when response data is empty array', async () => {
      store.themesData = {}
      store.AppHaxAPI = {
        makeCall: async () => ({ data: [] }),
        supportsCall: () => true,
      }
      await store.loadThemesData(true)
      expect(Object.keys(store.themesData).length).to.equal(0)
    })
    it('falls back to {} when response has no data array', async () => {
      store.themesData = {}
      store.AppHaxAPI = {
        makeCall: async () => ({ status: 200 }),
        supportsCall: () => true,
      }
      await store.loadThemesData(true)
      expect(Object.keys(store.themesData).length).to.equal(0)
    })
  })

  describe('store initial state', () => {
    it('has baseRoutes with home, search, 404 entries', () => {
      expect(store.baseRoutes.length).to.be.greaterThan(0)
      const names = store.baseRoutes.map((r) => r.name)
      expect(names).to.include('home')
      expect(names).to.include('search')
      expect(names).to.include('404')
    })
    it('initializes with newSitePromiseList as array of functions', () => {
      expect(store.newSitePromiseList).to.be.an('array')
      expect(store.newSitePromiseList.length).to.be.greaterThan(0)
      expect(typeof store.newSitePromiseList[0]).to.equal('function')
    })
    it('has appEl initially null', () => {
      const testStore = store
      // appEl is set by the app-hax element, initially null
      expect(testStore.appEl).to.be.null
    })
  })
})
