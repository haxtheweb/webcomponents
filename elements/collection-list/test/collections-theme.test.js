import { fixture, expect, html } from '@open-wc/testing'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'
import '../lib/collections-theme.js'

// direct lib import so istanbul sees lib/collections-theme.js statements
describe('collections-theme', () => {
  let element
  let savedColorScheme
  let savedDarkMode
  let savedManifest
  let savedActiveId
  let savedBadDevice
  const googleFontLinks = () => [
    ...globalThis.document.head.querySelectorAll(
      'link[href*="fonts.googleapis.com/css2?family=Roboto"]',
    ),
  ]

  before(() => {
    // lock the page + store to light mode (see spacebook-theme tests)
    savedColorScheme = document.documentElement.style.colorScheme
    document.documentElement.style.colorScheme = 'light'
    savedDarkMode = store.darkMode
    savedManifest = store.manifest
    savedActiveId = store.activeId
    savedBadDevice = store.badDevice
    store.darkMode = false
    // block font injection until the dedicated test opts in
    store.badDevice = true
    // keep a truthy manifest so regionData is never undefined for
    // site-region elements rendered inside the theme
    store.manifest = {}
  })

  after(() => {
    if (savedColorScheme === '') {
      document.documentElement.style.removeProperty('color-scheme')
    } else {
      document.documentElement.style.colorScheme = savedColorScheme
    }
    store.darkMode = savedDarkMode
    store.manifest = savedManifest
    store.activeId = savedActiveId
    store.badDevice = savedBadDevice
  })

  beforeEach(async () => {
    element = await fixture(html`<collections-theme></collections-theme>`)
    await element.updateComplete
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await new Promise((resolve) => requestAnimationFrame(resolve))
  })

  it('basic will it blend', () => {
    expect(element).to.exist
  })

  it('renders the theme structure', async () => {
    const root = element.shadowRoot
    expect(root.querySelector('header site-region') === null).to.equal(false)
    const nav = root.querySelector('nav#nav')
    expect(nav === null).to.equal(false)
    expect(nav.getAttribute('aria-label')).to.equal('Site')
    expect(root.querySelector('nav#nav site-top-menu') === null).to.equal(
      false,
    )
    const banner = root.querySelector('collections-theme-banner')
    expect(banner === null).to.equal(false)
    expect(root.querySelector('#haxcms-theme-top') === null).to.equal(false)
    expect(root.querySelector('main article#contentcontainer slot') === null).to
      .equal(false)
    const footer = root.querySelector('footer')
    expect(footer === null).to.equal(false)
    expect(
      footer.querySelector('.footer-secondary slot[name="footer-secondary"]') ===
        null,
    ).to.equal(false)
    expect(
      footer.querySelector('.footer-primary slot[name="footer-primary"]') ===
        null,
    ).to.equal(false)
    expect(footer.querySelector('scroll-button') === null).to.equal(false)
  })

  it('wires the scroll target and scroll button on first update', () => {
    const container = element.shadowRoot.querySelector('#contentcontainer')
    expect(
      element.HAXCMSThemeSettings.scrollTarget === container,
    ).to.equal(true)
    const button = element.shadowRoot.querySelector('scroll-button')
    const top = element.shadowRoot.querySelector('#haxcms-theme-top')
    expect(button.target === top).to.equal(true)
  })

  it('reads color, title, image and logo from the manifest', async () => {
    store.manifest = {
      title: 'Collections Site',
      metadata: {
        theme: {
          variables: {
            cssVariable: '--simple-colors-default-theme-blue-7',
            image: 'assets/hero.jpg',
          },
        },
        site: {
          logo: 'assets/logo.png',
        },
      },
    }
    await new Promise((r) => setTimeout(r, 50))
    expect(element.color).to.equal('blue')
    expect(element.title).to.equal('Collections Site')
    expect(element.image).to.equal('assets/hero.jpg')
    expect(element.logo).to.equal('assets/logo.png')
    const banner = element.shadowRoot.querySelector('collections-theme-banner')
    expect(banner.getAttribute('image')).to.equal('assets/hero.jpg')
    expect(banner.getAttribute('sitename')).to.equal('Collections Site')
    expect(banner.getAttribute('logo')).to.equal('assets/logo.png')
  })

  it('falls back to the default banner image without manifest values', async () => {
    store.manifest = { items: [] }
    await new Promise((r) => setTimeout(r, 50))
    expect(element.image).to.equal('assets/banner.jpg')
    expect(element.title).to.equal('')
    expect(element.color).to.equal(undefined)
  })

  it('uses the active item image when one exists', async () => {
    store.manifest = {
      items: [
        {
          id: 'image-item',
          title: 'With Image',
          slug: '/with-image',
          metadata: { image: 'active-item.jpg' },
        },
        { id: 'plain-item', title: 'Plain', slug: '/plain', metadata: {} },
      ],
      metadata: {
        theme: {
          variables: { image: 'assets/hero.jpg' },
        },
      },
    }
    await new Promise((r) => setTimeout(r, 50))
    store.activeId = 'image-item'
    await new Promise((r) => setTimeout(r, 50))
    expect(element.image).to.equal('active-item.jpg')
    // without an active item image it falls back to the manifest image
    store.activeId = 'plain-item'
    await new Promise((r) => setTimeout(r, 50))
    expect(element.image).to.equal('assets/hero.jpg')
    store.activeId = savedActiveId
  })

  it('tracks the active title', async () => {
    store.manifest = {
      items: [
        {
          id: 'page',
          title: 'Active Page Title',
          slug: '/page',
          metadata: { published: true },
        },
      ],
    }
    await new Promise((r) => setTimeout(r, 50))
    store.activeId = 'page'
    await new Promise((r) => setTimeout(r, 50))
    expect(element.activeTitle).to.equal('Active Page Title')
    const banner = element.shadowRoot.querySelector('collections-theme-banner')
    expect(banner.getAttribute('pagetitle')).to.equal('Active Page Title')
    store.activeId = savedActiveId
  })

  it('marks edit mode on the navigational parts', async () => {
    element.editMode = true
    await element.updateComplete
    expect(
      element.shadowRoot
        .querySelector('site-top-menu')
        .getAttribute('part')
        .includes('edit-mode-active'),
    ).to.equal(true)
    expect(
      element.shadowRoot
        .querySelector('footer')
        .getAttribute('part')
        .includes('edit-mode-active'),
    ).to.equal(true)
    element.editMode = false
    await element.updateComplete
    expect(
      element.shadowRoot
        .querySelector('site-top-menu')
        .getAttribute('part')
        .includes('edit-mode-active'),
    ).to.equal(false)
  })

  it('_getColor maps the css variable to the theme color', () => {
    expect(
      element._getColor({
        metadata: {
          theme: {
            variables: {
              cssVariable: '--simple-colors-default-theme-orange-7',
            },
          },
        },
      }),
    ).to.equal('orange')
    expect(element._getColor({})).to.equal(undefined)
    expect(element._getColor(null)).to.equal(undefined)
  })

  it('injects the Roboto font link on good devices', async () => {
    const before = googleFontLinks().length
    store.badDevice = false
    await new Promise((r) => setTimeout(r, 50))
    const after = googleFontLinks()
    expect(after.length > before).to.equal(true)
    // clean up the injected font links
    after.forEach((link) => link.remove())
    store.badDevice = true
  })

  it('passes the a11y audit', async () => {
    // give the banner real titles so its headings are not empty
    store.manifest = {
      title: 'Collections Site',
      items: [
        {
          id: 'home',
          title: 'Home Page',
          slug: '/',
          metadata: { published: true },
        },
      ],
    }
    store.activeId = 'home'
    await new Promise((r) => setTimeout(r, 50))
    await expect(element).shadowDom.to.be.accessible({
      // skip-link targets live inside the shadow root (axe cannot resolve
      // them across the boundary); color-contrast is racy in headless
      // light/dark resolution (see spacebook-theme tests)
      ignoredRules: ['skip-link', 'color-contrast', 'empty-heading'],
    })
    store.activeId = savedActiveId
  })
})
