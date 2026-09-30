import { fixture, expect, html } from '@open-wc/testing'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'
import { DesignSystemManager } from '@haxtheweb/d-d-d/lib/DesignSystemManager.js'
import { GlossyPortfolioTheme } from '../glossy-portfolio-theme.js'
// direct lib imports so istanbul sees every lib file (invisible-lib rule)
import { GlossyPortfolioAbout } from '../lib/glossy-portfolio-about.js'
import { GlossyPortfolioBreadcrumb } from '../lib/glossy-portfolio-breadcrumb.js'
import { GlossyPortfolioCard } from '../lib/glossy-portfolio-card.js'
import { GlossyPortfolioFooter } from '../lib/glossy-portfolio-footer.js'
import { GlossyPortfolioGrid } from '../lib/glossy-portfolio-grid.js'
import { GlossyPortfolioHeader } from '../lib/glossy-portfolio-header.js'
import { GlossyPortfolioHome } from '../lib/glossy-portfolio-home.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// file level store fixture + restore (stub/restore singleton pattern)
const savedManifest = store.manifest
const savedActiveId = store.activeId
const savedEditMode = store.editMode

// register a fonts-less "glossy-portfolio-theme" system and activate it
// BEFORE the first theme fixture: firstUpdated then re-registers the real
// system (with googleapis fonts) but the active assignment is a no-op, so no
// remote font stylesheet is ever injected in this test session
DesignSystemManager.addDesignSystem({
  name: 'glossy-portfolio-theme',
  styles: [],
  fonts: [],
  hax: true,
})
DesignSystemManager.active = 'glossy-portfolio-theme'

store.manifest = {
  title: 'Portfolio Site',
  description: 'A portfolio of design work',
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
      id: 'projects',
      title: 'Projects',
      slug: 'projects',
      order: 1,
      parent: null,
      location: 'projects.html',
      metadata: {},
    },
    {
      id: 'project-a',
      title: 'Project A',
      slug: 'project-a',
      order: 0,
      parent: 'projects',
      location: 'a.html',
      metadata: { image: 'assets/a.png', tags: 'web, design' },
    },
    {
      id: 'project-b',
      title: 'Project B',
      slug: 'project-b',
      order: 1,
      parent: 'projects',
      location: 'b.html',
      metadata: { image: 'assets/b.png', tags: 'print' },
    },
    {
      id: 'related-friend',
      title: 'Friend Page',
      slug: 'friend',
      order: 2,
      parent: null,
      location: 'f.html',
      metadata: { image: 'assets/f.png' },
    },
    {
      id: 'solo',
      title: 'Solo',
      slug: 'solo',
      order: 4,
      parent: null,
      location: 'solo.html',
      metadata: { relatedItems: 'related-friend' },
    },
    {
      id: 'plain',
      title: 'Plain',
      slug: 'plain',
      order: 3,
      parent: null,
      location: 'plain.html',
      metadata: {},
    },
    {
      id: 'plain-child',
      title: 'Plain Child',
      slug: 'plain-child',
      order: 0,
      parent: 'plain',
      location: 'pc.html',
      metadata: { image: 'assets/pc.png' },
    },
  ],
}

after(() => {
  store.manifest = savedManifest
  store.activeId = savedActiveId
  store.editMode = savedEditMode
})

describe('glossy-portfolio-breadcrumb store-driven trail', () => {
  const makeBreadcrumb = async () => {
    const bc = await fixture(
      html`<glossy-portfolio-breadcrumb></glossy-portfolio-breadcrumb>`,
    )
    await bc.updateComplete
    return bc
  }

  it('builds the trail from the active item up to the root', async () => {
    store.activeId = 'project-a'
    const bc = await makeBreadcrumb()
    await wait(80)
    expect(bc.items.length).to.equal(2)
    bc.requestUpdate()
    await bc.updateComplete
    const lis = bc.shadowRoot.querySelectorAll('ol.breadcrumb li')
    expect(lis.length).to.equal(2)
    expect(
      lis[0].querySelector('span[itemprop="name"]').textContent,
    ).to.equal('Projects')
    expect(lis[0].querySelector('a').getAttribute('href')).to.equal('projects')
    expect(lis[1].getAttribute('aria-current')).to.equal('page')
    expect(
      lis[1].querySelector('span[itemprop="name"]').textContent,
    ).to.equal('Project A')
    // schema.org microdata is present on the list
    const ol = bc.shadowRoot.querySelector('ol.breadcrumb')
    expect(ol.getAttribute('itemtype')).to.equal(
      'https://schema.org/BreadcrumbList',
    )
  })

  it('hides the trail when the active page is the only crumb', async () => {
    store.activeId = 'solo'
    const bc = await makeBreadcrumb()
    await wait(80)
    expect(bc.items.length).to.equal(0)
    expect(bc.shadowRoot.querySelector('ol.breadcrumb') === null).to.equal(
      true,
    )
  })

  it('prepends a home crumb and suppresses a duplicate of it', async () => {
    store.activeId = 'home'
    const bc = await makeBreadcrumb()
    await wait(80)
    bc.includeHome = true
    // moving to another page builds home + page
    store.activeId = 'solo'
    await wait(80)
    bc.requestUpdate()
    await bc.updateComplete
    let lis = bc.shadowRoot.querySelectorAll('ol.breadcrumb li')
    expect(lis.length).to.equal(2)
    expect(
      lis[0].querySelector('span[itemprop="name"]').textContent,
    ).to.equal('Home')
    expect(lis[0].querySelector('a').getAttribute('href')).to.equal('home')
    // landing back on home collapses the duplicated home crumb
    store.activeId = 'home'
    await wait(80)
    expect(bc.items.length).to.equal(0)
    expect(bc.shadowRoot.querySelector('ol.breadcrumb') === null).to.equal(
      true,
    )
  })

  it('keeps edit mode in sync with the store', async () => {
    store.activeId = 'project-a'
    const bc = await makeBreadcrumb()
    await wait(80)
    store.editMode = true
    await wait(80)
    expect(bc.editMode).to.equal(true)
    expect(bc.hasAttribute('edit-mode')).to.equal(true)
    store.editMode = false
    await wait(80)
    expect(bc.editMode).to.equal(false)
    expect(bc.hasAttribute('edit-mode')).to.equal(false)
  })
})

describe('glossy-portfolio-home hero', () => {
  it('derives the hero copy and image from the store', async () => {
    store.activeId = 'home'
    const home = await fixture(
      html`<glossy-portfolio-home></glossy-portfolio-home>`,
    )
    await home.updateComplete
    await wait(80)
    expect(home.siteDescription).to.equal('A portfolio of design work')
    expect(home.backgroundImage).to.equal('assets/hero.jpg')
    home.requestUpdate()
    await home.updateComplete
    expect(home.shadowRoot.querySelector('.title').textContent.trim()).to.equal(
      'A portfolio of design work',
    )
    const bg = home.shadowRoot.querySelector('.background')
    expect(bg.getAttribute('style').includes('url(assets/hero.jpg)')).to.equal(
      true,
    )
  })

  it('falls back to the default hero copy without a description', async () => {
    const saved = store.manifest
    store.manifest = { items: saved.items }
    const home = await fixture(
      html`<glossy-portfolio-home></glossy-portfolio-home>`,
    )
    await home.updateComplete
    await wait(80)
    expect(home.siteDescription).to.equal(
      'A portfolio showcasing my work and projects.',
    )
    store.manifest = saved
    await wait(80)
  })
})

describe('glossy-portfolio-about', () => {
  it('renders the about hero with safe external links', async () => {
    const about = await fixture(
      html`<glossy-portfolio-about></glossy-portfolio-about>`,
    )
    await about.updateComplete
    expect(
      about.shadowRoot.querySelector('.hero h1').textContent.includes('Mortiz'),
    ).to.equal(true)
    const links = about.shadowRoot.querySelectorAll('a.social-link')
    expect(links.length).to.equal(5)
    expect(links[0].getAttribute('target')).to.equal('_blank')
    expect(links[0].getAttribute('rel')).to.equal('noopener noreferrer')
    expect(about.shadowRoot.querySelector('img').getAttribute('alt')).to.equal(
      'Portrait of Mortiz',
    )
  })
})

describe('glossy-portfolio-card', () => {
  it('renders a linked card from its attributes', async () => {
    const card = await fixture(
      html`<glossy-portfolio-card
        title="Project X"
        thumbnail="assets/x.png"
        slug="project-x"
      ></glossy-portfolio-card>`,
    )
    await card.updateComplete
    const link = card.shadowRoot.querySelector('a.link')
    expect(link.getAttribute('aria-label')).to.equal('Project X')
    expect(link.getAttribute('href')).to.equal('project-x')
    expect(
      card.shadowRoot.querySelector('img.thumbnail').getAttribute('src'),
    ).to.equal('assets/x.png')
    expect(card.shadowRoot.querySelector('.title').textContent).to.equal(
      'Project X',
    )
    expect(
      card.shadowRoot.querySelector('svg.arrow-shape') === null,
    ).to.equal(false)
  })

  it('hides a broken thumbnail image', async () => {
    const card = await fixture(
      html`<glossy-portfolio-card
        title="Broken"
        thumbnail="assets/missing.png"
        slug="broken"
      ></glossy-portfolio-card>`,
    )
    await card.updateComplete
    const img = card.shadowRoot.querySelector('img.thumbnail')
    img.dispatchEvent(new Event('error'))
    expect(img.style.visibility).to.equal('hidden')
  })

  it('constructor defaults are set without rendering', () => {
    const card = new GlossyPortfolioCard()
    expect(card.title).to.equal('Title')
    // NOTE: the default thumbnail is a REMOTE freepik URL and the default slug
    // is google.com; construct without rendering so no remote fetch happens
    expect(card.thumbnail.includes('img.freepik.com')).to.equal(true)
    expect(card.slug).to.equal('https://google.com')
  })
})

describe('glossy-portfolio-theme store-driven rendering', () => {
  it('marks the first root page as home and renders the hero', async () => {
    store.activeId = 'home'
    const element = await fixture(
      html`<glossy-portfolio-theme></glossy-portfolio-theme>`,
    )
    await element.updateComplete
    await wait(80)
    expect(element.isHome).to.equal(true)
    expect(
      element.shadowRoot.querySelector('glossy-portfolio-home') === null,
    ).to.equal(false)
    expect(
      element.shadowRoot.querySelector('a.skip-link').getAttribute('href'),
    ).to.equal('#contentcontainer')
    expect(
      element.shadowRoot.querySelector('main[role="main"]') === null,
    ).to.equal(false)
    expect(
      element.shadowRoot.querySelector('article#contentcontainer') === null,
    ).to.equal(false)
    expect(
      element.shadowRoot.querySelector('glossy-portfolio-footer') === null,
    ).to.equal(false)
  })

  it('inner pages hide the hero', async () => {
    store.activeId = 'project-a'
    const element = await fixture(
      html`<glossy-portfolio-theme></glossy-portfolio-theme>`,
    )
    await element.updateComplete
    await wait(80)
    expect(element.isHome).to.equal(false)
    expect(
      element.shadowRoot.querySelector('glossy-portfolio-home') === null,
    ).to.equal(true)
  })
})

describe('glossy-portfolio-header store-driven navigation', () => {
  let header
  beforeEach(async () => {
    store.activeId = 'project-a'
    header = await fixture(
      html`<glossy-portfolio-header></glossy-portfolio-header>`,
    )
    await header.updateComplete
    await wait(80)
  })

  it('renders top level items as desktop and mobile nav links', () => {
    expect(header.topItems.length).to.equal(5)
    const desktopLinks = header.shadowRoot.querySelectorAll(
      'ul.nav-links.desktop a.right-side-item',
    )
    expect(desktopLinks.length).to.equal(5)
    expect(desktopLinks[0].getAttribute('href')).to.equal('home')
    const mobileLinks = header.shadowRoot.querySelectorAll(
      'ul.nav-links.mobile a.right-side-item',
    )
    expect(mobileLinks.length).to.equal(5)
    expect(
      header.shadowRoot.querySelector('nav[aria-label="Site"]') === null,
    ).to.equal(false)
    // the toggle button exposes its state to assistive tech
    const button = header.shadowRoot.querySelector('button[aria-controls]')
    expect(button.getAttribute('aria-label')).to.equal('Toggle navigation menu')
    expect(button.getAttribute('aria-expanded')).to.equal('false')
  })

  it('labels the logo link from the site metadata', () => {
    const logoLink = header.shadowRoot.querySelector('a.logo-link.desktop')
    expect(logoLink.getAttribute('aria-label')).to.equal('Portfolio home')
    expect(logoLink.getAttribute('href')).to.equal('home')
    const img = header.shadowRoot.querySelector('img.logo.desktop')
    expect(img.getAttribute('src')).to.equal('assets/logo.png')
  })

  it('hides a broken logo image', () => {
    const img = header.shadowRoot.querySelector('img.logo.desktop')
    img.dispatchEvent(new Event('error'))
    expect(img.style.visibility).to.equal('hidden')
  })

  it('toggles the mobile menu open and closed', () => {
    const savedVT = globalThis.document.startViewTransition
    globalThis.document.startViewTransition = (cb) => {
      cb()
      return { ready: Promise.resolve() }
    }
    header.toggleHamburger()
    expect(header.isOpen).to.equal(true)
    expect(header.shadowRoot.querySelector('.nav-menu').style.display).to.equal(
      'flex',
    )
    expect(globalThis.document.body.classList.contains('no-scroll')).to.equal(
      true,
    )
    header.toggleHamburger()
    expect(header.isOpen).to.equal(false)
    expect(header.shadowRoot.querySelector('.nav-menu').style.display).to.equal(
      'none',
    )
    expect(globalThis.document.body.classList.contains('no-scroll')).to.equal(
      false,
    )
    // without view transition support it toggles directly
    globalThis.document.startViewTransition = undefined
    header.toggleHamburger()
    expect(header.isOpen).to.equal(true)
    globalThis.document.startViewTransition = savedVT
    // Escape closes the open menu (WCAG 2.1.2 no keyboard trap)
    header._handleKeydown({ key: 'Escape' })
    expect(header.isOpen).to.equal(false)
    // Escape on a closed menu is a no-op
    header._handleKeydown({ key: 'Escape' })
    expect(header.isOpen).to.equal(false)
  })

  it('fades the desktop header on scroll and restores it', async () => {
    const container = header.shadowRoot.querySelector('.container.desktop')
    globalThis.dispatchEvent(new Event('scroll'))
    await new Promise((r) => requestAnimationFrame(r))
    await new Promise((r) => requestAnimationFrame(r))
    expect(header.scrollPosition).to.equal(0)
    expect(container.style.opacity).to.equal('1')
    header.scrollPosition = 60
    header.halfOpacity()
    expect(container.style.opacity).to.equal('0.4')
    header.fullOpacity()
    expect(container.style.opacity).to.equal('1')
    // half opacity is a no-op at the top of the page
    header.scrollPosition = 0
    header.halfOpacity()
    expect(container.style.opacity).to.equal('1')
    // a second scroll inside the same frame is throttled
    header.__scrollTicking = true
    header.scrollFunction()
    expect(header.scrollPosition).to.equal(0)
  })

  it('switches to the mobile header when the desktop header overflows', () => {
    const desktop = header.shadowRoot.querySelector('.container.desktop')
    const mobile = header.shadowRoot.querySelector('.container.mobile')
    Object.defineProperty(desktop, 'clientWidth', {
      value: 10,
      configurable: true,
    })
    header._checkOverflow()
    expect(header.isOverflow).to.equal(true)
    expect(desktop.style.visibility).to.equal('hidden')
    expect(mobile.style.display).to.equal('flex')
    delete desktop.clientWidth
    header._checkOverflow()
    expect(header.isOverflow).to.equal(false)
    expect(desktop.style.visibility).to.equal('visible')
    expect(mobile.style.display).to.equal('none')
  })
})

describe('glossy-portfolio-grid store-driven data', () => {
  const makeGrid = async () => {
    const grid = await fixture(
      html`<glossy-portfolio-grid></glossy-portfolio-grid>`,
    )
    await grid.updateComplete
    return grid
  }

  it('shows children of the active page as cards with tag filters', async () => {
    store.activeId = 'projects'
    const grid = await makeGrid()
    await wait(80)
    await grid.updateComplete
    expect(grid.data.length).to.equal(2)
    expect(grid.title).to.equal('Projects')
    expect(grid.filtersList.join(',')).to.equal('web,print')
    expect(grid.filteredData.length).to.equal(2)
    expect(grid.shadowRoot.querySelector('.grid-title').textContent).to.equal(
      'PROJECTS',
    )
    const filters = grid.shadowRoot.querySelectorAll('.filters button')
    expect(filters.length).to.equal(3)
    expect(filters[0].getAttribute('name')).to.equal('all')
    expect(filters[0].textContent.trim()).to.equal('All')
    expect(filters[1].textContent.trim()).to.equal('Web')
    expect(filters[2].textContent.trim()).to.equal('Print')
    const cards = grid.shadowRoot.querySelectorAll('glossy-portfolio-card')
    expect(cards.length).to.equal(2)
    expect(cards[0].getAttribute('title')).to.equal('Project A')
    expect(cards[0].getAttribute('thumbnail')).to.equal('assets/a.png')
    expect(cards[0].getAttribute('slug')).to.equal('project-a')
    // items without tags contribute no filters
    store.activeId = 'plain'
    await wait(80)
    await grid.updateComplete
    expect(grid.shadowRoot.querySelectorAll('.filters button').length).to.equal(
      0,
    )
  })

  it('filters the cards by tag', async () => {
    store.activeId = 'projects'
    const grid = await makeGrid()
    await wait(80)
    await grid.updateComplete
    const savedVT = globalThis.document.startViewTransition
    globalThis.document.startViewTransition = (cb) => {
      cb()
      return { ready: Promise.resolve() }
    }
    const printBtn = grid.shadowRoot.querySelector(
      '.filters button[name="print"]',
    )
    grid.updateFilter({ currentTarget: printBtn })
    await grid.updateComplete
    expect(grid.activeFilter).to.equal('print')
    expect(grid.filteredData.length).to.equal(1)
    expect(
      grid.shadowRoot.querySelectorAll('glossy-portfolio-card').length,
    ).to.equal(1)
    expect(printBtn.classList.contains('active')).to.equal(true)
    // going back to All restores every card
    const allBtn = grid.shadowRoot.querySelector('.filters button[name="all"]')
    grid.updateFilter({ currentTarget: allBtn })
    await grid.updateComplete
    expect(grid.activeFilter).to.equal('all')
    expect(grid.filteredData.length).to.equal(2)
    // without view transition support it filters directly
    globalThis.document.startViewTransition = undefined
    grid.updateFilter({ currentTarget: printBtn })
    await grid.updateComplete
    expect(grid.activeFilter).to.equal('print')
    globalThis.document.startViewTransition = savedVT
  })

  it('resets the active filter when the data changes between pages', async () => {
    store.activeId = 'projects'
    const grid = await makeGrid()
    await wait(80)
    const printBtn = grid.shadowRoot.querySelector(
      '.filters button[name="print"]',
    )
    grid._updateFilter(printBtn)
    await grid.updateComplete
    expect(grid.activeFilter).to.equal('print')
    // changing pages resets to all and rebuilds the filters
    store.activeId = 'plain'
    await wait(80)
    await grid.updateComplete
    expect(grid.activeFilter).to.equal('all')
    expect(grid.data.length).to.equal(1)
    expect(grid.data[0].id).to.equal('plain-child')
    expect(grid.shadowRoot.querySelectorAll('.filters button').length).to.equal(
      0,
    )
  })

  it('falls back to related items when a page has no children', async () => {
    store.activeId = 'solo'
    const grid = await makeGrid()
    await wait(80)
    expect(grid.title).to.equal('Related Content')
    expect(grid.data.length).to.equal(1)
    expect(grid.data[0].id).to.equal('related-friend')
    await grid.updateComplete
    expect(grid.shadowRoot.querySelector('.grid-title').textContent).to.equal(
      'RELATED CONTENT',
    )
  })

  it('falls back to sibling pages when a page has no children', async () => {
    store.activeId = 'project-b'
    const grid = await makeGrid()
    await wait(80)
    expect(grid.title).to.equal('Related Content')
    expect(grid.data.length).to.equal(1)
    expect(grid.data[0].id).to.equal('project-a')
  })
})

describe('glossy-portfolio-footer', () => {
  it('renders last updated and copyright year from site metadata', async () => {
    const footer = await fixture(
      html`<glossy-portfolio-footer></glossy-portfolio-footer>`,
    )
    await footer.updateComplete
    await wait(80)
    const expected = new Date(1717000000 * 1000).toDateString()
    expect(footer.lastUpdated).to.equal(expected)
    expect(footer.copyrightYear).to.equal(
      new Date(1600000000 * 1000).getFullYear(),
    )
    footer.requestUpdate()
    await footer.updateComplete
    expect(
      footer.shadowRoot.querySelector('p.item').textContent.includes(expected),
    ).to.equal(true)
    expect(
      footer.shadowRoot
        .querySelector('p.center')
        .textContent.includes(String(footer.copyrightYear)),
    ).to.equal(true)
    // no license on the manifest means no license block
    expect(footer.shadowRoot.querySelector('.license') === null).to.equal(true)
  })

  it('maps a manifest license onto the footer', async () => {
    const footer = await fixture(
      html`<glossy-portfolio-footer></glossy-portfolio-footer>`,
    )
    await footer.updateComplete
    await wait(80)
    store.manifest.license = 'by-sa'
    await wait(80)
    expect(footer.licenseName).to.equal('Attribution Share a like')
    expect(footer.licenseLink).to.equal(
      'https://creativecommons.org/licenses/by-sa/4.0/',
    )
    // keep the license image local so no remote fetch happens in the browser
    footer.licenseImage = 'assets/license.png'
    footer.requestUpdate()
    await footer.updateComplete
    const block = footer.shadowRoot.querySelector('.license')
    expect(block === null).to.equal(false)
    expect(block.querySelector('a').getAttribute('href')).to.equal(
      'https://creativecommons.org/licenses/by-sa/4.0/',
    )
    expect(block.querySelector('img').getAttribute('src')).to.equal(
      'assets/license.png',
    )
    expect(block.querySelector('img').getAttribute('alt')).to.equal(
      'Attribution Share a like',
    )
    // an unknown license leaves the previously resolved license in place
    store.manifest.license = 'not-a-license'
    await wait(80)
    expect(footer.licenseName).to.equal('Attribution Share a like')
    // reset so later fixtures never render a remote license image
    store.manifest.license = undefined
    await wait(80)
  })
})

describe('glossy-portfolio haxProperties wiring', () => {
  const classes = [
    GlossyPortfolioTheme,
    GlossyPortfolioAbout,
    GlossyPortfolioBreadcrumb,
    GlossyPortfolioCard,
    GlossyPortfolioFooter,
    GlossyPortfolioGrid,
    GlossyPortfolioHeader,
    GlossyPortfolioHome,
  ]

  it('every element points its haxProperties at lib/<tag>.haxProperties.json', () => {
    for (const cls of classes) {
      expect(cls.haxProperties.includes(`${cls.tag}.haxProperties.json`)).to.equal(
        true,
      )
    }
  })

  // BUG(glossy-portfolio-theme + all lib elements): the haxProperties getters
  // resolve lib/<tag>.haxProperties.json but the only schema on disk is
  // lib/graphic-portfolio.haxProperties.json, so every URL 404s and no
  // element in this package can load its HAX property schema.
  it('haxProperties schema files are missing for every element', async () => {
    for (const cls of classes) {
      const res = await fetch(cls.haxProperties)
      expect(`${cls.tag}: ${res.ok}`).to.equal(`${cls.tag}: false`)
    }
  })
})
