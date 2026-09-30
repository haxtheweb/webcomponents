import { fixture, expect, html } from '@open-wc/testing'
import { PolarisTheme } from '../polaris-theme.js'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'

// store-driven coverage for polaris-theme.js: appStoreReady wiring, the
// constructor autoruns (themeData.variables, pageTimestamp, badDevice font
// injection) and the siteModalClick lazy search route.
function makeManifest() {
  return {
    id: 'polaris-advanced-site',
    title: 'Polaris Advanced Site',
    description: 'polaris advanced theme test',
    metadata: {
      site: { name: 'polaris-advanced-site' },
      platform: {},
      theme: {
        element: 'polaris-theme',
        variables: {
          image: 'assets/hero.jpg',
          imageAlt: 'Hero alt text',
          imageLink: '/hero-link',
        },
        regions: {
          header: null,
          sidebarFirst: null,
          sidebarSecond: null,
          contentTop: null,
          contentBottom: null,
          footerPrimary: null,
          footerSecondary: null,
        },
      },
    },
    items: [
      {
        id: 'p1',
        title: 'Page One',
        slug: 'page-one',
        location: 'pages/page-one/index.html',
        order: 1,
        parent: null,
        indent: 0,
        metadata: {
          published: true,
          locked: false,
          status: '',
          updated: 1700000000,
        },
      },
      {
        id: 'p2',
        title: 'Page Two',
        slug: 'page-two',
        location: 'pages/page-two/index.html',
        order: 2,
        parent: null,
        indent: 0,
        metadata: { published: true, locked: false, status: '' },
      },
    ],
  }
}

describe('polaris-theme store wiring', () => {
  let element
  let savedManifest
  let savedActiveId
  let savedBadDevice
  let savedHaxStore
  let savedSimpleModal
  let SiteActiveTitle
  let SiteActiveTags
  let origSiteActiveTitleUpdated
  let origSiteActiveTagsUpdated

  before(() => {
    savedManifest = store.manifest
    savedActiveId = store.activeId
    savedBadDevice = store.badDevice
    savedHaxStore = globalThis.HaxStore
    savedSimpleModal = globalThis.SimpleModal
    store.manifest = makeManifest()
    // block font injection until the dedicated test opts in
    store.badDevice = true
    SiteActiveTitle = customElements.get('site-active-title')
    SiteActiveTags = customElements.get('site-active-tags')
    origSiteActiveTitleUpdated = SiteActiveTitle.prototype.updated
    origSiteActiveTagsUpdated = SiteActiveTags.prototype.updated
    SiteActiveTitle.prototype.updated = function () {}
    SiteActiveTags.prototype.updated = function () {}
  })

  after(() => {
    store.manifest = savedManifest
    store.activeId = savedActiveId
    store.badDevice = savedBadDevice
    globalThis.HaxStore = savedHaxStore
    globalThis.SimpleModal = savedSimpleModal
    SiteActiveTitle.prototype.updated = origSiteActiveTitleUpdated
    SiteActiveTags.prototype.updated = origSiteActiveTagsUpdated
  })

  const flushAsync = async () => {
    await new Promise((resolve) => setTimeout(resolve, 50))
    await new Promise((resolve) => requestAnimationFrame(resolve))
  }

  beforeEach(async () => {
    store.activeId = null
    element = await fixture(html`<polaris-theme></polaris-theme>`)
    await element.updateComplete
    await flushAsync()
  })

  it('pulls the header image variables out of themeData', () => {
    expect(element.image).to.equal('assets/hero.jpg')
    expect(element.imageAlt).to.equal('Hero alt text')
    expect(element.imageLink).to.equal('/hero-link')
  })

  it('tracks the site description from the manifest', () => {
    expect(element.siteDescription).to.equal('polaris advanced theme test')
  })

  it('tracks the active item updated timestamp', async () => {
    store.activeId = 'p1'
    await flushAsync()
    expect(element.pageTimestamp).to.equal(1700000000)
    // an active item without metadata.updated leaves the timestamp alone
    store.activeId = 'p2'
    await flushAsync()
    expect(element.pageTimestamp).to.equal(1700000000)
    store.activeId = null
  })

  it('autoloads the polaris blocks into the hax autoloader on app store ready', () => {
    const appended = []
    globalThis.HaxStore = {
      requestAvailability: () => ({
        haxAutoloader: {
          appendChild: (el) => appended.push(el.tagName.toLowerCase()),
        },
      }),
    }
    // fresh controller so the abort assertion is meaningful
    element.windowControllersLoaded = new AbortController()
    element.appStoreReady({})
    expect(appended).to.deep.equal([
      'polaris-cta',
      'polaris-mark',
      'polaris-story-card',
      'polaris-tile',
    ])
    expect(element.windowControllersLoaded.signal.aborted).to.equal(true)
  })

  it('does nothing on app store ready without a HaxStore', () => {
    delete globalThis.HaxStore
    const controller = new AbortController()
    element.windowControllersLoaded = controller
    element.appStoreReady({})
    expect(controller.signal.aborted).to.equal(false)
    globalThis.HaxStore = savedHaxStore
  })

  describe('siteModalClick lazy search', () => {
    let input
    let fakeModal
    let replaceStateCalls
    let savedGetInternalRoute
    let savedRouterLocation

    beforeEach(() => {
      input = {
        focused: 0,
        selected: 0,
        value: '',
        focus() {
          this.focused += 1
        },
        select() {
          this.selected += 1
        },
      }
      fakeModal = {
        querySelector: (selector) =>
          selector === 'site-search'
            ? {
                shadowRoot: {
                  querySelector: (inner) =>
                    inner === 'simple-fields-field' ? input : null,
                },
              }
            : null,
      }
      globalThis.SimpleModal = { requestAvailability: () => fakeModal }
      savedGetInternalRoute = store.getInternalRoute
      savedRouterLocation = store.currentRouterLocation
      replaceStateCalls = []
      globalThis.history.replaceState = (...args) => {
        replaceStateCalls.push(args)
      }
    })

    afterEach(() => {
      // getInternalRoute is a prototype method; deleting the own property
      // (the test stub) restores the real one without shadowing it
      delete store.getInternalRoute
      store.currentRouterLocation = savedRouterLocation
      globalThis.SimpleModal = savedSimpleModal
      delete globalThis.history.replaceState
    })

    it('routes to the internal search route and focuses the field', async () => {
      store.getInternalRoute = () => 'displays/other'
      store.currentRouterLocation = { search: '' }
      element.siteModalClick({})
      await flushAsync()
      expect(replaceStateCalls.length).to.equal(1)
      expect(replaceStateCalls[0][2]).to.equal('x/displays/search')
      expect(input.focused).to.equal(1)
      // no search param means no value / select side effects
      expect(input.value).to.equal('')
      expect(input.selected).to.equal(0)
    })

    it('skips routing when already on the search route', async () => {
      store.getInternalRoute = () => 'displays/search'
      store.currentRouterLocation = { search: '' }
      element.siteModalClick({})
      await flushAsync()
      expect(replaceStateCalls.length).to.equal(0)
      expect(input.focused).to.equal(1)
    })

    it('seeds the field from an existing search param', async () => {
      store.getInternalRoute = () => 'displays/search'
      store.currentRouterLocation = { search: '?search=polaris' }
      element.siteModalClick({})
      await flushAsync()
      expect(input.value).to.equal('polaris')
      expect(input.selected).to.equal(1)
    })
  })

  it('injects the Open Sans font link on good devices', async () => {
    const fontLinks = () =>
      globalThis.document.head.querySelectorAll(
        'link[href*="fonts.googleapis.com/css2?family=Open+Sans"]',
      )
    const before = fontLinks().length
    store.badDevice = false
    await flushAsync()
    const after = [...fontLinks()]
    expect(after.length > before).to.equal(true)
    after.forEach((link) => link.remove())
    store.badDevice = true
  })

  it('exposes the theme tag on the class', () => {
    expect(PolarisTheme.tag).to.equal('polaris-theme')
  })
})
