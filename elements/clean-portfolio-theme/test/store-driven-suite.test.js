import { fixture, expect, html } from '@open-wc/testing'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'
import { DesignSystemManager } from '@haxtheweb/d-d-d/lib/DesignSystemManager.js'
import { UserScaffoldInstance } from '@haxtheweb/user-scaffold/user-scaffold.js'
import '../clean-portfolio-theme.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// file level store fixture + restore (stub/restore singleton pattern)
const savedManifest = store.manifest
const savedActiveId = store.activeId
const savedEditMode = store.editMode
const savedVT = globalThis.document.startViewTransition

// make every view transition run its callback synchronously so the layout
// autoruns are deterministic in the test session
globalThis.document.startViewTransition = (cb) => {
  cb()
  return { ready: Promise.resolve() }
}

// register a fonts-less "clean-portfolio-theme" system and activate it
// BEFORE the first theme fixture so the googleapis font stylesheet from
// firstUpdated is never injected in this test session
DesignSystemManager.addDesignSystem({
  name: 'clean-portfolio-theme',
  styles: [],
  fonts: [],
  hax: true,
})
DesignSystemManager.active = 'clean-portfolio-theme'

store.manifest = {
  title: 'Portfolio Site',
  author: 'Portfolio Author',
  metadata: {
    site: {
      name: 'Portfolio',
      logo: 'assets/logo.png',
      created: 1600000000,
      updated: 1717000000,
    },
    theme: { variables: { image: 'assets/hero.jpg' } },
  },
  items: [
    {
      id: 'home',
      title: 'Home',
      slug: 'home',
      order: 0,
      parent: null,
      location: 'index.html',
      metadata: {},
    },
    {
      id: 'work',
      title: 'Work',
      slug: 'work',
      order: 1,
      parent: null,
      location: 'work.html',
      metadata: {},
    },
    {
      id: 'web-a',
      title: 'Web A',
      slug: 'web-a',
      order: 0,
      parent: 'work',
      location: 'web-a.html',
      metadata: { image: 'assets/web-a.png', tags: 'web, design' },
    },
    {
      id: 'web-b',
      title: 'Web B',
      slug: 'web-b',
      order: 1,
      parent: 'work',
      location: 'web-b.html',
      metadata: { image: 'assets/web-b.png', tags: ['web', null, 42] },
    },
    {
      id: 'print-a',
      title: 'Print A',
      slug: 'print-a',
      order: 2,
      parent: 'work',
      location: 'print-a.html',
      metadata: { image: 'assets/print-a.png', tags: 'print, art' },
    },
    {
      id: 'untagged',
      title: 'Untagged',
      slug: 'untagged',
      order: 3,
      parent: 'work',
      location: 'untagged.html',
      metadata: {},
    },
    {
      id: 'numeric',
      title: 'Numeric',
      slug: 'numeric',
      order: 4,
      parent: 'work',
      location: 'numeric.html',
      metadata: { tags: 123 },
    },
    {
      id: 'about',
      title: 'About',
      slug: 'about',
      order: 2,
      parent: null,
      location: 'about.html',
      metadata: { tags: 'info, extra' },
    },
    {
      id: 'profile',
      title: 'Profile',
      slug: 'profile',
      order: 3,
      parent: null,
      location: 'profile.html',
      metadata: { tags: 'info' },
    },
    {
      id: 'bio',
      title: 'Bio',
      slug: 'bio',
      order: 0,
      parent: 'profile',
      location: 'bio.html',
      metadata: { tags: 'info' },
    },
    {
      id: 'contact',
      title: 'Contact',
      slug: 'contact',
      order: 1,
      parent: 'profile',
      location: 'contact.html',
      metadata: { tags: 'info, extra' },
    },
  ],
}

after(() => {
  store.manifest = savedManifest
  store.activeId = savedActiveId
  store.editMode = savedEditMode
  globalThis.document.startViewTransition = savedVT
  UserScaffoldInstance.deleteMemory('HAXCMSSitePalette', 'long')
})

describe('clean-portfolio-theme store-driven rendering', () => {
  it('maps a manifest license onto the footer', async () => {
    const element = await fixture(
      html`<clean-portfolio-theme></clean-portfolio-theme>`,
    )
    await element.updateComplete
    await wait(80)
    store.manifest.license = 'by-sa'
    // the autorun resolves in one microtask; swap the remote creativecommons
    // badge for a local image BEFORE the scheduled render so no remote image
    // is ever fetched
    await Promise.resolve()
    element.licenseImage = 'assets/license.png'
    await element.updateComplete
    expect(element.licenseName).to.equal('Attribution Share a like')
    expect(element.licenseLink).to.equal(
      'https://creativecommons.org/licenses/by-sa/4.0/',
    )
    const block = element.shadowRoot.querySelector('a.big-license-link')
    expect(block === null).to.equal(false)
    expect(block.querySelector('img').getAttribute('src')).to.equal(
      'assets/license.png',
    )
    store.manifest.license = undefined
    await wait(30)
  })

  it('renders the text layout for a plain root page', async () => {
    store.activeId = 'home'
    const element = await fixture(
      html`<clean-portfolio-theme></clean-portfolio-theme>`,
    )
    await element.updateComplete
    await wait(80)
    await element.updateComplete
    expect(element.activeLayout).to.equal('text')
    expect(element.siteTitle).to.equal('Portfolio Site')
    expect(element.homeLink).to.equal('home')
    const title = element.shadowRoot.querySelector('#site-title')
    expect(title.getAttribute('aria-label')).to.equal('Portfolio Site')
    expect(title.getAttribute('href')).to.equal('home')
    // top level items appear in the main nav
    const menuItems = element.shadowRoot.querySelectorAll('nav a.menu-item')
    expect(menuItems.length).to.equal(4)
    // no breadcrumb parent, no media banner, no listing content
    expect(
      element.shadowRoot.querySelector('.breadcrumb-parent') === null,
    ).to.equal(true)
    expect(
      element.shadowRoot.querySelector('site-active-media-banner') === null,
    ).to.equal(true)
    expect(
      element.shadowRoot.querySelector('#listing-filter') === null,
    ).to.equal(true)
    expect(
      element.shadowRoot.querySelector('a.listing-card') === null,
    ).to.equal(true)
    // the theme picker shows while nothing overflows
    expect(
      element.shadowRoot.querySelector('.mobile-menu-wrapper') === null,
    ).to.equal(true)
    expect(
      element.shadowRoot.querySelector('header simple-icon-button-lite.theme-picker') ===
        null,
    ).to.equal(false)
    // footer carries the page counter, dates and author
    const footer = element.shadowRoot.querySelector('footer')
    expect(footer.textContent.includes('Page number: 1 of 11')).to.equal(true)
    expect(footer.textContent.includes('Portfolio Author')).to.equal(true)
    expect(
      footer.querySelector('a.footer-link').getAttribute('href'),
    ).to.equal('x/displays/tags')
    expect(element.lastUpdated).to.equal(
      new Date(1717000000 * 1000).toDateString(),
    )
    expect(element.copyrightYear).to.equal(
      new Date(1600000000 * 1000).getFullYear(),
    )
  })

  it('renders the tag list for a tagged text page', async () => {
    store.activeId = 'about'
    const element = await fixture(
      html`<clean-portfolio-theme></clean-portfolio-theme>`,
    )
    await element.updateComplete
    await wait(80)
    await element.updateComplete
    expect(element.activeLayout).to.equal('text')
    expect(element.activeTags.join(',')).to.equal('info,extra')
    // text layout drops the leading tag from the list
    const tags = element.shadowRoot.querySelectorAll('ul.tag-list li a')
    expect(tags.length).to.equal(1)
    expect(tags[0].getAttribute('href')).to.equal('x/displays/tags?tag=extra')
    expect(tags[0].textContent).to.equal('extra')
  })

  it('renders the listing layout with category groups and tag filter', async () => {
    store.activeId = 'work'
    const element = await fixture(
      html`<clean-portfolio-theme></clean-portfolio-theme>`,
    )
    await element.updateComplete
    await wait(80)
    await element.updateComplete
    expect(element.activeLayout).to.equal('listing')
    expect(element.items.length).to.equal(5)
    expect(element.categoryTags.join(',')).to.equal('web,print,123')
    expect(element.allTags.join(',')).to.equal('web,design,42,print,art,123')
    // filter select appears with every category
    const select = element.shadowRoot.querySelector('#listing-filter')
    expect(select === null).to.equal(false)
    const options = select.querySelectorAll('option')
    expect(options.length).to.equal(4)
    expect(options[0].value).to.equal('')
    expect(options[0].textContent).to.equal('All')
    // category groups with cards
    const groups = element.shadowRoot.querySelectorAll('h2.listing-category a')
    expect(groups.length).to.equal(3)
    expect(groups[0].textContent).to.equal('web')
    expect(groups[1].textContent).to.equal('print')
    expect(groups[2].textContent).to.equal('123')
    const cards = element.shadowRoot.querySelectorAll('a.listing-card')
    // web-a, web-b, print-a, numeric plus the untagged card
    expect(cards.length).to.equal(5)
    expect(
      cards[0].querySelector('img').getAttribute('src'),
    ).to.equal('assets/web-a.png')
    expect(cards[0].querySelector('.listing-cardtitle').textContent).to.equal(
      'Web A',
    )
    // second tag is shown next to the card title
    expect(cards[0].querySelector('.listing-cardtag').textContent).to.equal(
      'design',
    )
    // the untagged card falls back to the theme image
    const untaggedCard = element.shadowRoot.querySelector(
      'a.listing-card[href="untagged"]',
    )
    expect(untaggedCard.querySelector('img').getAttribute('src')).to.equal(
      'assets/hero.jpg',
    )
    // when the theme image is missing the site logo is used instead
    delete store.manifest.metadata.theme.variables.image
    element.requestUpdate()
    await element.updateComplete
    expect(untaggedCard.querySelector('img').getAttribute('src')).to.equal(
      'assets/logo.png',
    )
    store.manifest.metadata.theme.variables.image = 'assets/hero.jpg'
    element.requestUpdate()
    await element.updateComplete
    // choosing a tag filters the grid down to matching groups
    select.value = 'print'
    select.dispatchEvent(new Event('change', { bubbles: true }))
    await element.updateComplete
    expect(element.selectedTag).to.equal('print')
    const filteredGroups = element.shadowRoot.querySelectorAll(
      'h2.listing-category a',
    )
    expect(filteredGroups.length).to.equal(1)
    expect(filteredGroups[0].textContent).to.equal('print')
    expect(
      element.shadowRoot.querySelectorAll('a.listing-card').length,
    ).to.equal(1)
    // no untagged grid while a tag is selected
    expect(
      element.shadowRoot.querySelector('a.listing-card[href="untagged"]') ===
        null,
    ).to.equal(true)
    // restoring All brings everything back
    select.value = ''
    select.dispatchEvent(new Event('change', { bubbles: true }))
    await element.updateComplete
    expect(element.selectedTag).to.equal('')
    expect(
      element.shadowRoot.querySelectorAll('a.listing-card').length,
    ).to.equal(5)
  })

  it('renders the listing without a filter when there is one category', async () => {
    store.activeId = 'profile'
    const element = await fixture(
      html`<clean-portfolio-theme></clean-portfolio-theme>`,
    )
    await element.updateComplete
    await wait(80)
    await element.updateComplete
    expect(element.activeLayout).to.equal('listing')
    expect(element.categoryTags.join(',')).to.equal('info')
    expect(
      element.shadowRoot.querySelector('#listing-filter') === null,
    ).to.equal(true)
    expect(
      element.shadowRoot.querySelectorAll('a.listing-card').length,
    ).to.equal(2)
  })

  it('renders the media layout with breadcrumb parent and pagination', async () => {
    store.activeId = 'bio'
    const element = await fixture(
      html`<clean-portfolio-theme></clean-portfolio-theme>`,
    )
    await element.updateComplete
    await wait(80)
    await element.updateComplete
    expect(element.activeLayout).to.equal('media')
    expect(element.activeParent.slug).to.equal('profile')
    expect(element.nextSibling.title).to.equal('Contact')
    expect(element.prevSibling === null).to.equal(true)
    expect(
      element.shadowRoot.querySelector('site-active-media-banner') === null,
    ).to.equal(false)
    const parentLink = element.shadowRoot.querySelector(
      'nav.breadcrumb a',
    )
    expect(parentLink.getAttribute('href')).to.equal('profile')
    expect(
      element.shadowRoot.querySelector('.breadcrumb-parent').textContent,
    ).to.equal('Profile')
    expect(
      element.shadowRoot.querySelector('.breadcrumb-title').textContent,
    ).to.equal('Bio')
    // pagination shows the next sibling only
    expect(
      element.shadowRoot.querySelector('a.prev') === null,
    ).to.equal(true)
    const next = element.shadowRoot.querySelector('a.next')
    expect(next.getAttribute('href')).to.equal('contact')
    expect(
      next.querySelector('.pagination-text').textContent,
    ).to.equal('Contact')
    // the sibling page flips the direction
    store.activeId = 'contact'
    await wait(80)
    await element.updateComplete
    expect(element.prevSibling.title).to.equal('Bio')
    expect(element.nextSibling === null).to.equal(true)
    expect(
      element.shadowRoot.querySelector('a.prev').getAttribute('href'),
    ).to.equal('bio')
    expect(element.shadowRoot.querySelector('a.next') === null).to.equal(true)
  })

  it('highlights the active and ancestor sections in the menu', async () => {
    store.activeId = 'bio'
    const element = await fixture(
      html`<clean-portfolio-theme></clean-portfolio-theme>`,
    )
    await element.updateComplete
    await wait(80)
    await element.updateComplete
    const profileLink = element.shadowRoot.querySelector(
      'nav a.menu-item[href="profile"]',
    )
    expect(profileLink.className.includes('active')).to.equal(true)
    const homeLink = element.shadowRoot.querySelector(
      'nav a.menu-item[href="home"]',
    )
    expect(homeLink.className.includes('active')).to.equal(false)
  })

  it('falls back to direct layout updates without view transitions', async () => {
    globalThis.document.startViewTransition = undefined
    store.activeId = 'work'
    const element = await fixture(
      html`<clean-portfolio-theme></clean-portfolio-theme>`,
    )
    await element.updateComplete
    await wait(80)
    await element.updateComplete
    expect(element.activeLayout).to.equal('listing')
    expect(element.items.length).to.equal(5)
    globalThis.document.startViewTransition = (cb) => {
      cb()
      return { ready: Promise.resolve() }
    }
  })

  it('switches to the mobile menu when the nav overflows', async () => {
    store.activeId = 'home'
    const element = await fixture(
      html`<clean-portfolio-theme></clean-portfolio-theme>`,
    )
    await element.updateComplete
    await wait(80)
    await element.updateComplete
    const nav = element.shadowRoot.querySelector('nav[aria-label="Main navigation"]')
    Object.defineProperty(nav, 'clientWidth', {
      value: 10,
      configurable: true,
    })
    element._checkOverflow()
    await element.updateComplete
    expect(element.menuOverflow.length).to.equal(4)
    expect(
      element.shadowRoot.querySelector('.mobile-menu-wrapper') === null,
    ).to.equal(false)
    // the desktop theme picker is replaced by the mobile toggle
    expect(
      element.shadowRoot.querySelector('header simple-icon-button-lite.theme-picker') ===
        null,
    ).to.equal(true)
    const toggle = element.shadowRoot.querySelector(
      'button[aria-controls="overflow-menu"]',
    )
    expect(toggle.getAttribute('aria-expanded')).to.equal('false')
    toggle.click()
    await element.updateComplete
    expect(element.menuOpen).to.equal(true)
    expect(toggle.getAttribute('aria-expanded')).to.equal('true')
    const overflowLinks = element.shadowRoot.querySelectorAll(
      'ul#overflow-menu li a',
    )
    expect(overflowLinks.length).to.equal(4)
    expect(overflowLinks[0].getAttribute('href')).to.equal('home')
    // restoring width removes the mobile menu again
    delete nav.clientWidth
    element._checkOverflow()
    await element.updateComplete
    expect(element.menuOverflow.length).to.equal(0)
    expect(
      element.shadowRoot.querySelector('.mobile-menu-wrapper') === null,
    ).to.equal(true)
    expect(
      element.shadowRoot.querySelector('header simple-icon-button-lite.theme-picker') ===
        null,
    ).to.equal(false)
  })

  it('runs the viewport sync from resize events', async () => {
    store.activeId = 'home'
    const element = await fixture(
      html`<clean-portfolio-theme></clean-portfolio-theme>`,
    )
    await element.updateComplete
    await wait(80)
    globalThis.dispatchEvent(new Event('resize'))
    await new Promise((r) => requestAnimationFrame(r))
    expect(element.menuOverflow.length).to.equal(0)
    // clamping the scroll position is a safe no-op at the top of the page
    element._clampScrollPosition()
    expect(globalThis.scrollY).to.equal(0)
  })

  it('keeps edit mode from navigating and scrolls the slot into view', async () => {
    store.activeId = 'home'
    const element = await fixture(
      html`<clean-portfolio-theme></clean-portfolio-theme>`,
    )
    await element.updateComplete
    await wait(80)
    await element.updateComplete
    // edit mode blocks link navigation on tagged content
    let prevented = false
    element.editMode = true
    await element.updateComplete
    element.testEditMode({
      preventDefault: () => (prevented = true),
      stopPropagation: () => {},
      stopImmediatePropagation: () => {},
      currentTarget: { blur: () => {} },
    })
    expect(prevented).to.equal(true)
    element.editMode = false
    await element.updateComplete
    let blurred = false
    element.testEditMode({
      preventDefault: () => {},
      stopPropagation: () => {},
      stopImmediatePropagation: () => {},
      currentTarget: { blur: () => (blurred = true) },
    })
    expect(blurred).to.equal(true)
    // the store flipping edit mode scrolls the content slot into view
    const slot = element.shadowRoot.querySelector('#slot')
    let scrolled = null
    slot.scrollIntoView = (opts) => {
      scrolled = opts
    }
    store.editMode = true
    await wait(80)
    expect(scrolled === null).to.equal(false)
    expect(scrolled.behavior).to.equal('smooth')
    store.editMode = false
    await wait(80)
  })

  it('cycles the palette and renders the tag route items', async () => {
    store.activeId = 'home'
    const element = await fixture(
      html`<clean-portfolio-theme></clean-portfolio-theme>`,
    )
    await element.updateComplete
    element.dataPalette = 9
    await element.updateComplete
    element.togglePalette()
    await element.updateComplete
    expect(element.dataPalette).to.equal(10)
    element.togglePalette()
    await element.updateComplete
    expect(element.dataPalette).to.equal(0)
    expect(element.getAttribute('data-palette')).to.equal('0')
    // custom tag route rendering with parts
    const box = await fixture(
      element.HAXSiteRenderXTagsItems([
        {
          slug: 'tagged',
          title: 'Tagged',
          metadata: { image: 'assets/tagged.png' },
        },
        { slug: 'blank', title: '', metadata: { image: 'assets/blank.png' } },
      ]),
    )
    const cards = box.querySelectorAll('a[part="listing-card"]')
    expect(cards.length).to.equal(2)
    expect(cards[0].getAttribute('href')).to.equal('tagged')
    expect(
      cards[0].querySelector('img').getAttribute('alt'),
    ).to.equal('Tagged')
    expect(cards[1].querySelector('img').getAttribute('alt')).to.equal('')
    expect(box.getAttribute('part')).to.equal('listing-grid')
  })
})
