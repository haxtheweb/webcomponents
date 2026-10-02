import { html, fixture, expect } from '@open-wc/testing'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'
import { UserScaffoldInstance } from '@haxtheweb/user-scaffold/user-scaffold.js'
import '../link-card-theme.js'

describe('LinkCardTheme test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html` <link-card-theme></link-card-theme> `)
  })

  it('basic will it blend', async () => {
    expect(element).to.exist
  })
})

// Round 8 coverage (#3079): behavioral suite for the link-card-theme
// profile/link-hub theme. Store state is driven via the singleton
// save/restore pattern (see hax-body/test/hax-store.test.js); palette
// memory is reset through UserScaffoldInstance so tests stay hermetic.
describe('LinkCardTheme behavior', () => {
  let element
  let savedManifest
  let savedDarkMode
  let savedEditMode
  let savedColorScheme
  const tick = (ms) => new Promise((r) => setTimeout(r, ms || 60))

  before(() => {
    savedManifest = store.manifest
    savedDarkMode = store.darkMode
    savedEditMode = store.editMode
    // lock light scheme for the a11y audit (see spacebook-theme tests)
    savedColorScheme = document.documentElement.style.colorScheme
    document.documentElement.style.colorScheme = 'light'
    store.darkMode = false
    store.editMode = false
    // start from a clean palette memory slate
    UserScaffoldInstance.deleteMemory('HAXCMSSitePalette', 'long')
  })

  after(() => {
    store.manifest = savedManifest
    store.darkMode = savedDarkMode
    store.editMode = savedEditMode
    if (savedColorScheme === '') {
      document.documentElement.style.removeProperty('color-scheme')
    } else {
      document.documentElement.style.colorScheme = savedColorScheme
    }
    UserScaffoldInstance.deleteMemory('HAXCMSSitePalette', 'long')
  })

  afterEach(() => {
    store.manifest = savedManifest
    // keep palette memory from leaking between tests
    UserScaffoldInstance.deleteMemory('HAXCMSSitePalette', 'long')
  })

  beforeEach(async () => {
    element = await fixture(html` <link-card-theme></link-card-theme> `)
    await element.updateComplete
  })

  it('seeds constructor defaults', () => {
    expect(element.manifest).to.deep.equal({})
    expect(element.linkItems.length).to.equal(0)
    expect(element.socialItems.length).to.equal(0)
    expect(element.profileImage).to.equal('')
    expect(element.profileName).to.equal('My profile')
    expect(element.profileDescription).to.equal('')
    expect(element.paletteAnnouncement).to.equal('')
    expect(element.dataPalette).to.equal('0')
    expect(element.getAttribute('data-palette')).to.equal('0')
  })

  it('renders the empty card structure', () => {
    const root = element.shadowRoot
    expect(root.querySelector('a.skip-link').getAttribute('href')).to.equal(
      '#main-content',
    )
    expect(
      root.querySelector('span.contrast-color-resolver').getAttribute(
        'aria-hidden',
      ),
    ).to.equal('true')
    const live = root.querySelector('span.visually-hidden[aria-live="polite"]')
    expect(live === null).to.equal(false)
    expect(live.textContent).to.equal('')
    const picker = root.querySelector('simple-icon-button-lite.palette-picker')
    expect(picker.getAttribute('icon')).to.equal('image:style')
    expect(picker.getAttribute('label')).to.equal('Change palette')
    expect(picker.getAttribute('aria-pressed')).to.equal('false')
    const main = root.querySelector('main.card#main-content')
    expect(main.getAttribute('role')).to.equal('main')
    expect(main.getAttribute('aria-label')).to.equal('My profile')
    expect(main.getAttribute('tabindex')).to.equal('-1')
    // no profile image → decorative fallback avatar
    expect(root.querySelector('img.profile-image')).to.equal(null)
    const fallback = root.querySelector('div.profile-image-fallback')
    expect(fallback.getAttribute('aria-hidden')).to.equal('true')
    expect(fallback.querySelector('simple-icon-lite').getAttribute('icon')).to.equal(
      'account-circle',
    )
    expect(root.querySelector('h1').textContent).to.equal('My profile')
    expect(root.querySelector('p.description')).to.equal(null)
    expect(
      root.querySelector('nav.primary-links').getAttribute('aria-label'),
    ).to.equal('Primary links')
    expect(
      root.querySelector('nav.primary-links p.empty-state') === null,
    ).to.equal(false)
    expect(root.querySelector('ul.social-links')).to.equal(null)
    expect(root.querySelector('#contentcontainer #slot slot') === null).to.equal(
      false,
    )
  })

  it('syncs profile and link data from the manifest', async () => {
    store.manifest = {
      title: 'Jane Doe',
      description: 'Product designer and open web advocate',
      metadata: {
        author: { name: 'Jane Author', image: 'author.jpg' },
        site: { name: 'jane-site', logo: 'site-logo.png' },
        theme: { variables: { palette: '4', image: 'profile.jpg' } },
      },
      items: [
        { id: 'z', title: 'Zed link', parent: null, order: 2, slug: '/zed', metadata: {} },
        { id: 'a', title: 'Ay link', parent: null, order: 1, slug: '/ay', metadata: {} },
        {
          id: 'hidden',
          title: 'Hidden',
          parent: null,
          order: 3,
          slug: '/hidden',
          metadata: { hideInMenu: true },
        },
        {
          id: 'unpub',
          title: 'Unpublished',
          parent: null,
          order: 4,
          slug: '/unpub',
          metadata: { published: false },
        },
        { id: 'child', title: 'Child', parent: 'a', order: 1, slug: '/child', metadata: {} },
        {
          id: 'external',
          title: 'My site',
          parent: null,
          order: 5,
          metadata: { linkUrl: 'https://example.com/' },
        },
        {
          id: 'li',
          title: 'LinkedIn',
          parent: null,
          order: 6,
          metadata: { linkUrl: 'https://www.linkedin.com/in/jane' },
        },
        {
          id: 'x',
          title: 'X',
          parent: null,
          order: 7,
          metadata: { linkUrl: 'https://x.com/jane' },
        },
        { id: 'nohref', title: 'No href', parent: null, order: 8, metadata: {} },
      ],
    }
    await tick()
    await element.updateComplete
    expect(element.dataPalette).to.equal('4')
    expect(element.getAttribute('data-palette')).to.equal('4')
    expect(element.profileName).to.equal('Jane Doe')
    expect(element.profileDescription).to.equal(
      'Product designer and open web advocate',
    )
    expect(element.profileImage).to.equal('profile.jpg')
    // ordered visible top-level links; hidden, unpublished, child and
    // href-less items are filtered out
    expect(element.linkItems.length).to.equal(3)
    expect(element.linkItems[0].title).to.equal('Ay link')
    expect(element.linkItems[0].href).to.equal('/ay')
    expect(element.linkItems[0].target).to.equal('_self')
    expect(element.linkItems[1].title).to.equal('Zed link')
    expect(element.linkItems[2].title).to.equal('My site')
    expect(element.linkItems[2].href).to.equal('https://example.com/')
    expect(element.linkItems[2].target).to.equal('_blank')
    expect(element.linkItems[2].rel).to.equal('noopener noreferrer')
    // social links are detected from the hrefs
    expect(element.socialItems.length).to.equal(2)
    expect(element.socialItems[0].title).to.equal('LinkedIn')
    expect(element.socialItems[0].socialType).to.equal('linkedin')
    expect(element.socialItems[1].socialType).to.equal('x')
    // rendered output
    const root = element.shadowRoot
    const img = root.querySelector('img.profile-image')
    expect(img.getAttribute('src')).to.equal('profile.jpg')
    expect(img.getAttribute('alt')).to.equal('Jane Doe profile image')
    expect(root.querySelector('h1').textContent).to.equal('Jane Doe')
    expect(root.querySelector('p.description').textContent).to.equal(
      'Product designer and open web advocate',
    )
    const buttons = [...root.querySelectorAll('nav.primary-links a.link-button')]
    expect(buttons.length).to.equal(3)
    expect(buttons[0].getAttribute('href')).to.equal('/ay')
    expect(buttons[0].getAttribute('target')).to.equal('_self')
    expect(buttons[0].getAttribute('rel')).to.equal(null)
    expect(buttons[2].getAttribute('target')).to.equal('_blank')
    expect(buttons[2].getAttribute('rel')).to.equal('noopener noreferrer')
    expect(root.querySelector('nav.primary-links p.empty-state')).to.equal(null)
    const socialLinks = [...root.querySelectorAll('ul.social-links a.social-link')]
    expect(socialLinks.length).to.equal(2)
    expect(socialLinks[0].getAttribute('aria-label')).to.equal(
      'LinkedIn on LinkedIn',
    )
    expect(
      socialLinks[0].querySelector('simple-icon-lite').getAttribute('icon'),
    ).to.equal('mdi-social:linkedin')
    expect(socialLinks[1].getAttribute('aria-label')).to.equal('X on X')
    expect(
      socialLinks[1].querySelector('simple-icon-lite').getAttribute('icon'),
    ).to.equal('mdi-social:twitter')
    // non-zero palette reflects in the picker pressed state
    expect(
      root.querySelector('.palette-picker').getAttribute('aria-pressed'),
    ).to.equal('true')
  })

  it('falls back through author and site for name and image', () => {
    element.manifest = {
      metadata: { author: { name: 'Author Name', image: 'author.jpg' } },
    }
    element._syncManifestData()
    expect(element.profileName).to.equal('Author Name')
    expect(element.profileImage).to.equal('author.jpg')
    element.manifest = {
      metadata: { site: { name: 'Site Name', logo: 'site.png' } },
    }
    element._syncManifestData()
    expect(element.profileName).to.equal('Site Name')
    expect(element.profileImage).to.equal('site.png')
    element.manifest = {}
    element._syncManifestData()
    expect(element.profileName).to.equal('My profile')
    expect(element.profileImage).to.equal('')
  })

  it('orders, hides and resolves items', () => {
    expect(element._itemOrder(null)).to.equal(0)
    expect(element._itemOrder({})).to.equal(0)
    expect(element._itemOrder({ order: null })).to.equal(0)
    expect(element._itemOrder({ order: 'abc' })).to.equal(0)
    expect(element._itemOrder({ order: '5' })).to.equal(5)
    expect(element._itemOrder({ order: 5 })).to.equal(5)
    expect(element._itemHidden(null)).to.equal(false)
    expect(element._itemHidden({})).to.equal(false)
    expect(element._itemHidden({ metadata: {} })).to.equal(false)
    expect(element._itemHidden({ metadata: { hideInMenu: true } })).to.equal(true)
    expect(element._itemHidden({ metadata: { published: false } })).to.equal(true)
    expect(element._itemHidden({ metadata: { published: true } })).to.equal(false)
  })

  it('detects external hrefs and resolves targets', () => {
    expect(element._isExternalHref('')).to.equal(false)
    expect(element._isExternalHref(null)).to.equal(false)
    expect(element._isExternalHref('relative/path')).to.equal(false)
    expect(element._isExternalHref('https://example.com')).to.equal(true)
    expect(element._isExternalHref('HTTP://EXAMPLE.COM')).to.equal(true)
    expect(element._resolveItemHref(null)).to.equal('')
    expect(
      element._resolveItemHref({
        metadata: { linkUrl: '  https://trim.me  ' },
      }),
    ).to.equal('https://trim.me')
    expect(element._resolveItemHref({ slug: ' /slug ' })).to.equal('/slug')
    expect(element._resolveItemHref({ location: 'pages/index.html' })).to.equal(
      'pages/index.html',
    )
    expect(
      element._resolveTarget({ metadata: { linkTarget: '_blank' } }, '/x'),
    ).to.equal('_blank')
    expect(
      element._resolveTarget({ metadata: { linkTarget: 'bogus' } }, 'https://x.com'),
    ).to.equal('_blank')
    expect(
      element._resolveTarget({ metadata: { linkTarget: 'bogus' } }, '/x'),
    ).to.equal('_self')
    expect(element._resolveTarget(null, 'https://x.com')).to.equal('_blank')
    expect(element._resolveTarget(null, '/x')).to.equal('_self')
  })

  it('detects social platforms from hrefs', () => {
    expect(element._detectSocialType('')).to.equal('')
    expect(element._detectSocialType('/local')).to.equal('')
    expect(
      element._detectSocialType('https://www.linkedin.com/in/jane'),
    ).to.equal('linkedin')
    expect(element._detectSocialType('https://x.com/jane')).to.equal('x')
    expect(element._detectSocialType('https://twitter.com/jane')).to.equal('x')
    expect(element._detectSocialType('https://example.com')).to.equal('')
    expect(element._socialIcon('linkedin')).to.equal('mdi-social:linkedin')
    expect(element._socialIcon('x')).to.equal('mdi-social:twitter')
    expect(element._socialLabel('linkedin')).to.equal('LinkedIn')
    expect(element._socialLabel('x')).to.equal('X')
    expect(
      element._socialAriaLabel({ socialType: 'linkedin', title: 'Jane' }),
    ).to.equal('Jane on LinkedIn')
    expect(element._socialAriaLabel({ socialType: 'x' })).to.equal('Open X')
  })

  it('cycles the palette and announces the change', async () => {
    element.togglePalette()
    await element.updateComplete
    expect(element.dataPalette).to.equal('1')
    expect(element.getAttribute('data-palette')).to.equal('1')
    expect(element.paletteAnnouncement).to.equal(
      'Color palette updated to option 2.',
    )
    expect(
      element.shadowRoot.querySelector('.palette-picker').getAttribute('aria-pressed'),
    ).to.equal('true')
    // non-numeric palette values reset to 0 before incrementing
    element.dataPalette = 'not-a-number'
    await element.updateComplete
    element.togglePalette()
    expect(element.dataPalette).to.equal('1')
    // wraps back to 0 after 11
    element.dataPalette = '11'
    await element.updateComplete
    element.togglePalette()
    expect(element.dataPalette).to.equal('0')
    expect(element.paletteAnnouncement).to.equal(
      'Color palette updated to option 1.',
    )
    // reflect the wrapped palette back into the rendered pressed state
    await element.updateComplete
    expect(
      element.shadowRoot.querySelector('.palette-picker').getAttribute('aria-pressed'),
    ).to.equal('false')
  })

  it('persists the palette to long-term memory', async () => {
    element.togglePalette()
    await element.updateComplete
    expect(UserScaffoldInstance.readMemory('HAXCMSSitePalette')).to.equal('1')
  })

  it('prevents link navigation in edit mode and blurs otherwise', () => {
    const makeEvent = () => {
      const ev = {
        defaultPrevented: false,
        stopped: false,
        immediateStopped: false,
        currentTarget: null,
        preventDefault() {
          this.defaultPrevented = true
        },
        stopPropagation() {
          this.stopped = true
        },
        stopImmediatePropagation() {
          this.immediateStopped = true
        },
      }
      ev.currentTarget = {
        blurred: false,
        blur() {
          this.blurred = true
        },
      }
      return ev
    }
    element.editMode = false
    const normal = makeEvent()
    element.testEditMode(normal)
    expect(normal.defaultPrevented).to.equal(false)
    expect(normal.currentTarget.blurred).to.equal(true)
    element.editMode = true
    const editing = makeEvent()
    element.testEditMode(editing)
    expect(editing.defaultPrevented).to.equal(true)
    expect(editing.stopped).to.equal(true)
    expect(editing.immediateStopped).to.equal(true)
    expect(editing.currentTarget.blurred).to.equal(false)
  })

  it('runs disposers on disconnect', async () => {
    const el = await fixture(html` <link-card-theme></link-card-theme> `)
    el.remove()
    expect(Array.isArray(el.__disposer)).to.equal(true)
    expect(el.__disposer.length).to.equal(0)
    // issue 3106: the wiring instance's watchdog autorun is disposed too
    // (previously it was never disposed for any theme)
    expect(el.HAXCMSThemeWiring.__disposer.length).to.equal(0)
    // the dead dark-mode watcher cleanup branch was removed (nothing in
    // this class ever set __darkModeMediaQuery / __onColorSchemeChange);
    // disconnect stays a no-op beyond running the disposers
    expect(el.__darkModeMediaQuery === undefined).to.equal(true)
    expect(el.__onColorSchemeChange === undefined).to.equal(true)
  })

  it('passes the a11y audit', async () => {
    store.manifest = {
      title: 'Jane Doe',
      description: 'Product designer and open web advocate',
      metadata: {
        author: { name: 'Jane Author' },
        theme: { variables: { image: 'profile.jpg' } },
      },
      items: [
        { id: 'a', title: 'Ay link', parent: null, order: 1, slug: '/ay', metadata: {} },
        {
          id: 'li',
          title: 'LinkedIn',
          parent: null,
          order: 2,
          metadata: { linkUrl: 'https://www.linkedin.com/in/jane' },
        },
      ],
    }
    await tick()
    await element.updateComplete
    await expect(element).shadowDom.to.be.accessible({
      // skip-link target #main-content lives inside the shadow root (axe
      // resolves skip-link hrefs via document.getElementById which cannot
      // pierce the boundary); color-contrast is racy in headless light/dark
      // resolution (see spacebook-theme tests)
      ignoredRules: ['skip-link', 'color-contrast'],
    })
  })
})
