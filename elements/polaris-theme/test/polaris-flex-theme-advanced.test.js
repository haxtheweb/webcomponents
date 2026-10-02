import { fixture, expect, html } from '@open-wc/testing'
import { PolarisFlexTheme } from '../lib/polaris-flex-theme.js'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'

// store-driven coverage for lib/polaris-flex-theme.js: constructor autoruns
// (themeData.variables, pageTimestamp), the haxTrayAlignment localStorage
// read, appStoreReady autoloading, the mirror hamburger size gate, the
// edit-mode menu clamp and the siteModalClick lazy search route.
function makeManifest() {
  return {
    id: 'flex-advanced-site',
    title: 'Flex Advanced Site',
    description: 'flex advanced theme test',
    metadata: {
      site: { name: 'flex-advanced-site' },
      platform: {},
      theme: {
        element: 'polaris-flex-theme',
        variables: {
          image: 'assets/flex.jpg',
          imageAlt: 'Flex alt text',
          imageLink: '/flex-link',
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
        id: 'f1',
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
          updated: 1680000000,
        },
      },
    ],
  }
}

describe('polaris-flex-theme store wiring', () => {
  let element
  let savedManifest
  let savedActiveId
  let savedHaxStore
  let savedSimpleModal
  let savedLS
  let SiteActiveTags
  let origSiteActiveTagsUpdated

  const LS_KEY = 'hax-mobile-menu-menuOpen'
  const TRAY_KEY = 'hax-tray-elementAlign'

  before(() => {
    savedManifest = store.manifest
    savedActiveId = store.activeId
    savedHaxStore = globalThis.HaxStore
    savedSimpleModal = globalThis.SimpleModal
    store.manifest = makeManifest()
    SiteActiveTags = customElements.get('site-active-tags')
    origSiteActiveTagsUpdated = SiteActiveTags.prototype.updated
    SiteActiveTags.prototype.updated = function () {}
  })

  after(() => {
    store.manifest = savedManifest
    store.activeId = savedActiveId
    globalThis.HaxStore = savedHaxStore
    globalThis.SimpleModal = savedSimpleModal
    SiteActiveTags.prototype.updated = origSiteActiveTagsUpdated
  })

  const flushAsync = async () => {
    await new Promise((resolve) => setTimeout(resolve, 50))
    await new Promise((resolve) => requestAnimationFrame(resolve))
  }

  beforeEach(async () => {
    savedLS = globalThis.localStorage.getItem(LS_KEY)
    // guarantee the constructor default (menu open) regardless of leftovers
    globalThis.localStorage.removeItem(LS_KEY)
    store.activeId = null
    element = await fixture(html`<polaris-flex-theme></polaris-flex-theme>`)
    element.themeReady = true
    await element.updateComplete
    await flushAsync()
  })

  afterEach(() => {
    if (savedLS === null) {
      globalThis.localStorage.removeItem(LS_KEY)
    } else {
      globalThis.localStorage.setItem(LS_KEY, savedLS)
    }
  })

  it('pulls the header image variables out of themeData', () => {
    expect(element.image).to.equal('assets/flex.jpg')
    expect(element.imageAlt).to.equal('Flex alt text')
    expect(element.imageLink).to.equal('/flex-link')
  })

  it('tracks the site description from the manifest', () => {
    expect(element.siteDescription).to.equal('flex advanced theme test')
  })

  it('tracks the active item updated timestamp', async () => {
    store.activeId = 'f1'
    await flushAsync()
    expect(element.pageTimestamp).to.equal(1680000000)
    store.activeId = null
  })

  it('renders empty footer extension points by default', () => {
    // the base flex theme leaves these as hooks for subclasses
    expect(element.renderFooterContactInformation()).to.exist
    expect(element.renderFooterSecondarySlot()).to.exist
    expect(element.renderSideBar()).to.exist
    expect(element.renderFooterPrimarySlot()).to.exist
  })

  it('only renders the mirror hamburger on small sizes', async () => {
    // wait for ResponsiveUtility's ResizeObserver to settle the host size
    // before driving explicit breakpoints (its callback is async)
    await new Promise((resolve) => setTimeout(resolve, 150))
    await new Promise((resolve) => requestAnimationFrame(resolve))
    // detach the utility's observer for this element so explicit breakpoint
    // driving does not fight its ResizeObserver notification loop
    const details = globalThis.ResponsiveUtility.instance.details
    const detail = details.find((d) => d && d.element === element)
    if (detail && detail.observer) {
      detail.observer.disconnect()
    }
    // large layouts have no mirror hamburger
    element.responsiveSize = 'xl'
    await element.updateComplete
    expect(
      element.shadowRoot.querySelector('#haxcmsmobilemenubutton-mirror') === null,
    ).to.equal(true)
    // small layouts get the mirror hamburger plus the tooltip
    element.responsiveSize = 'xs'
    await element.updateComplete
    expect(
      element.shadowRoot.querySelector('#haxcmsmobilemenubutton-mirror') ===
        null,
    ).to.equal(false)
    expect(
      element.shadowRoot.querySelector(
        'simple-tooltip[for="haxcmsmobilemenubutton-mirror"]',
      ) === null,
    ).to.equal(false)
  })

  it('autoloads the flex blocks into the hax autoloader on app store ready', () => {
    const appended = []
    globalThis.HaxStore = {
      requestAvailability: () => ({
        haxAutoloader: {
          appendChild: (el) => appended.push(el.tagName.toLowerCase()),
        },
      }),
    }
    element.windowControllersLoaded = new AbortController()
    element.appStoreReady({})
    expect(appended).to.deep.equal([
      'polaris-cta',
      'polaris-mark',
      'polaris-story-card',
      'polaris-tile',
      'simple-cta',
      'ddd-card',
      'media-quote',
    ])
    expect(element.windowControllersLoaded.signal.aborted).to.equal(true)
  })

  it('force-closes the mobile menu when entering edit mode', async () => {
    // the menu auto-closes on small layouts, so pin it open explicitly
    element.menuOpen = true
    await element.updateComplete
    expect(element.menuOpen).to.equal(true)
    element.editMode = true
    await element.updateComplete
    expect(element.menuOpen).to.equal(false)
    element.editMode = false
    await element.updateComplete
    expect(element.menuOpen).to.equal(false)
  })

  it('restores the tray alignment from localStorage when set', async () => {
    globalThis.localStorage.setItem(TRAY_KEY, '"right"')
    const aligned = await fixture(
      html`<polaris-flex-theme></polaris-flex-theme>`,
    )
    await aligned.updateComplete
    expect(aligned.haxTrayAlignment).to.equal('right')
    expect(aligned.getAttribute('hax-tray-alignment')).to.equal('right')
    globalThis.localStorage.removeItem(TRAY_KEY)
  })

  it('falls back to a false alignment on unparsable localStorage', async () => {
    globalThis.localStorage.setItem(TRAY_KEY, '{not-json')
    const aligned = await fixture(
      html`<polaris-flex-theme></polaris-flex-theme>`,
    )
    await aligned.updateComplete
    expect(aligned.haxTrayAlignment).to.equal(false)
    globalThis.localStorage.removeItem(TRAY_KEY)
  })

  it('defaults the tray alignment when localStorage is empty', () => {
    globalThis.localStorage.removeItem(TRAY_KEY)
    expect(element.haxTrayAlignment).to.equal('')
  })

  describe('siteModalClick lazy search', () => {
    let input
    let fakeModal
    let replaceStateCalls
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
      savedRouterLocation = store.currentRouterLocation
      replaceStateCalls = []
      globalThis.history.replaceState = (...args) => {
        replaceStateCalls.push(args)
      }
    })

    afterEach(() => {
      delete store.getInternalRoute
      store.currentRouterLocation = savedRouterLocation
      globalThis.SimpleModal = savedSimpleModal
      delete globalThis.history.replaceState
    })

    // siteModalClick defers all of its work to a dynamic import, so the
    // handler lands on the module load schedule rather than ours; poll for
    // the focus side effect instead of racing a fixed flush window, which
    // flakes when the full suite loads the machine down
    const waitForLazySearch = async () => {
      const deadline = Date.now() + 5000
      while (input.focused < 1 && Date.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, 25))
      }
      // drain the trailing setTimeout(0) select once the handler has run
      await flushAsync()
    }

    it('routes to the internal search route and focuses the field', async () => {
      store.getInternalRoute = () => 'displays/other'
      store.currentRouterLocation = { search: '' }
      element.siteModalClick({})
      await waitForLazySearch()
      expect(replaceStateCalls.length).to.equal(1)
      expect(replaceStateCalls[0][2]).to.equal('x/displays/search')
      expect(input.focused).to.equal(1)
      expect(input.value).to.equal('')
      expect(input.selected).to.equal(0)
    })

    it('seeds the field from an existing search param', async () => {
      store.getInternalRoute = () => 'displays/search'
      store.currentRouterLocation = { search: '?search=flex' }
      element.siteModalClick({})
      await waitForLazySearch()
      expect(replaceStateCalls.length).to.equal(0)
      expect(input.focused).to.equal(1)
      expect(input.value).to.equal('flex')
      expect(input.selected).to.equal(1)
    })
  })

  it('exposes the theme tag on the class', () => {
    expect(PolarisFlexTheme.tag).to.equal('polaris-flex-theme')
  })
})
