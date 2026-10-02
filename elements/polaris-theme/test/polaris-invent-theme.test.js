import { fixture, expect, html } from '@open-wc/testing'
import { PolarisInventTheme } from '../lib/polaris-invent-theme.js'
import { HAXCMSToastInstance } from '@haxtheweb/haxcms-elements/lib/core/haxcms-toast.js'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'

// store-driven coverage for lib/polaris-invent-theme.js: default palette,
// firstUpdated scroll wiring, constructor autoruns (themeData.variables,
// pageTimestamp), the RPG toast overrides, appStoreReady autoloading and the
// siteModalClick lazy search route.
function makeManifest() {
  return {
    id: 'invent-test-site',
    title: 'Invent Test Site',
    description: 'invent theme test',
    metadata: {
      site: { name: 'invent-test-site' },
      platform: {},
      theme: {
        element: 'polaris-invent-theme',
        variables: {
          image: 'assets/invent.jpg',
          imageAlt: 'Invent alt text',
          imageLink: '/invent-link',
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
        id: 'i1',
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
          updated: 1690000000,
        },
      },
    ],
  }
}

describe('polaris-invent-theme', () => {
  let element
  let savedManifest
  let savedActiveId
  let savedHaxStore
  let savedSimpleModal
  let SiteActiveTitle
  let SiteActiveTags
  let origSiteActiveTitleUpdated
  let origSiteActiveTagsUpdated

  before(() => {
    savedManifest = store.manifest
    savedActiveId = store.activeId
    savedHaxStore = globalThis.HaxStore
    savedSimpleModal = globalThis.SimpleModal
    store.manifest = makeManifest()
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
    element = await fixture(html`<polaris-invent-theme></polaris-invent-theme>`)
    await element.updateComplete
    await flushAsync()
  })

  it('registers as a custom element with shadow DOM', () => {
    expect(customElements.get('polaris-invent-theme')).to.exist
    expect(PolarisInventTheme.tag).to.equal('polaris-invent-theme')
    expect(element.shadowRoot).to.exist
  })

  it('defaults the palette to the polaris (8) data attribute', async () => {
    expect(element.dataPalette).to.equal(8)
    expect(element.getAttribute('data-palette')).to.equal('8')
    // reflected on change too (Lit reflects attributes on the update cycle)
    element.dataPalette = 11
    await element.updateComplete
    expect(element.getAttribute('data-palette')).to.equal('11')
  })

  it('renders the full theme scaffold', () => {
    const sr = element.shadowRoot
    expect(sr.querySelector('.skip-link').getAttribute('href')).to.equal('#main')
    expect(sr.querySelector('header')).to.exist
    expect(sr.querySelector('.nav .left-col')).to.exist
    expect(sr.querySelector('main#main')).to.exist
    expect(sr.querySelector('article#contentcontainer')).to.exist
    expect(sr.querySelector('site-active-title')).to.exist
    expect(sr.querySelector('site-active-tags')).to.exist
    expect(sr.querySelector('.link-actions')).to.exist
    expect(sr.querySelector('footer')).to.exist
    expect(sr.querySelector('footer scroll-button')).to.exist
    // prev / next navigation buttons with their wrappers
    const prev = sr.querySelector('site-menu-button[type="prev"]')
    const next = sr.querySelector('site-menu-button[type="next"]')
    expect(prev === null).to.equal(false)
    expect(next === null).to.equal(false)
    expect(prev.querySelector('.top').textContent.trim()).to.equal('Go back')
    expect(next.querySelector('.top').textContent.trim()).to.equal('Continue')
  })

  it('wires the scroll target on first update', () => {
    const main = element.shadowRoot.querySelector('#main')
    expect(element.HAXCMSThemeSettings.scrollTarget === main).to.equal(true)
    expect(
      element.shadowRoot.querySelector('scroll-button').target === main,
    ).to.equal(true)
    expect(
      globalThis.AbsolutePositionStateManager.requestAvailability().scrollTarget ===
        main,
    ).to.equal(true)
  })

  it('pulls the header image variables out of themeData', () => {
    expect(element.image).to.equal('assets/invent.jpg')
    expect(element.imageAlt).to.equal('Invent alt text')
    expect(element.imageLink).to.equal('/invent-link')
  })

  it('tracks the site description from the manifest', () => {
    expect(element.siteDescription).to.equal('invent theme test')
  })

  it('tracks the active item updated timestamp', async () => {
    store.activeId = 'i1'
    await flushAsync()
    expect(element.pageTimestamp).to.equal(1690000000)
    store.activeId = null
  })

  it('overrides the RPG toast presentation in the constructor', () => {
    expect(
      HAXCMSToastInstance.style.getPropertyValue('--rpg-character-toast-display'),
    ).to.equal('none')
    expect(
      HAXCMSToastInstance.style.getPropertyValue(
        '--rpg-character-toast-mid-background-image',
      ),
    ).to.equal('none')
    expect(
      HAXCMSToastInstance.style.getPropertyValue('--rpg-character-toast-height'),
    ).to.equal('96px')
    expect(
      HAXCMSToastInstance.style.getPropertyValue(
        '--rpg-character-toast-mid-padding',
      ),
    ).to.equal('0')
  })

  it('marks the footer and search button parts in edit mode', async () => {
    element.editMode = true
    await element.updateComplete
    expect(
      element.shadowRoot
        .querySelector('footer')
        .getAttribute('part')
        .includes('edit-mode-active'),
    ).to.equal(true)
    expect(
      element.shadowRoot
        .querySelector('.search-modal-btn')
        .getAttribute('part')
        .includes('edit-mode-active'),
    ).to.equal(true)
    element.editMode = false
    await element.updateComplete
    expect(
      element.shadowRoot
        .querySelector('footer')
        .getAttribute('part')
        .includes('edit-mode-active'),
    ).to.equal(false)
  })

  it('autoloads the invent blocks into the hax autoloader on app store ready', () => {
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
      'media-quote',
    ])
    expect(element.windowControllersLoaded.signal.aborted).to.equal(true)
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
      store.currentRouterLocation = { search: '?search=invent' }
      element.siteModalClick({})
      await waitForLazySearch()
      expect(replaceStateCalls.length).to.equal(0)
      expect(input.focused).to.equal(1)
      expect(input.value).to.equal('invent')
      expect(input.selected).to.equal(1)
    })
  })
})
