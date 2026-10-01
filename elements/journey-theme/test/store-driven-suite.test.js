import { fixture, expect, html } from '@open-wc/testing'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'
import { UserScaffoldInstance } from '@haxtheweb/user-scaffold/user-scaffold.js'
import '../journey-theme.js'
// direct lib imports so istanbul sees every lib file (invisible-lib rule);
// journey-topbar-theme and its styles are otherwise never loaded
import '../lib/journey-topbar-theme.js'
import '../lib/journey-menu.js'
import '../lib/journey-sidebar-theme.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// file level store fixture + restore (stub/restore singleton pattern)
const savedManifest = store.manifest
const savedActiveId = store.activeId
const savedLocation = store.location

store.manifest = {
  title: 'Journey Site',
  description: 'A journey through pages',
  metadata: {
    author: { name: 'Journey Author', image: 'assets/author.png' },
    site: { name: 'Journey', created: 1600000000, updated: 1717000000 },
    icon: 'icons:explore',
  },
  items: [
    {
      id: 'home',
      title: 'Home',
      slug: 'home',
      order: 0,
      parent: null,
      location: 'index.html',
      description: 'Start here',
      metadata: {},
    },
    {
      id: 'about',
      title: 'About',
      slug: 'about',
      order: 1,
      parent: null,
      location: 'about.html',
      description: 'About us',
      metadata: { icon: 'icons:info' },
    },
    {
      id: 'guide',
      title: 'Guide',
      slug: 'guide',
      order: 2,
      parent: null,
      location: 'guide.html',
      description: 'The guide',
      metadata: {},
    },
    {
      id: 'about-team',
      title: 'Team',
      slug: 'team',
      order: 0,
      parent: 'about',
      location: 'team.html',
      description: 'The team',
      metadata: { image: 'assets/team.png' },
    },
    {
      id: 'guide-step',
      title: 'Step',
      slug: 'step',
      order: 0,
      parent: 'guide',
      location: 'step.html',
      description: 'A step',
      metadata: {},
    },
  ],
}

after(() => {
  store.manifest = savedManifest
  store.activeId = savedActiveId
  store.location = savedLocation
  UserScaffoldInstance.deleteMemory('HAXCMSSitePalette', 'long')
})

describe('journey-theme store-driven rendering', () => {
  it('maps a manifest license onto the footer', async () => {
    const element = await fixture(html`<journey-theme></journey-theme>`)
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
    expect(block.querySelector('img').getAttribute('alt')).to.equal(
      'Attribution Share a like graphic',
    )
    store.manifest.license = undefined
    await wait(30)
  })

  it('renders the footer with dates, author and page counter', async () => {
    store.activeId = 'about'
    const element = await fixture(html`<journey-theme></journey-theme>`)
    await element.updateComplete
    await wait(80)
    await element.updateComplete
    expect(element.lastUpdated).to.equal(
      new Date(1717000000 * 1000).toDateString(),
    )
    expect(element.copyrightYear).to.equal(
      new Date(1600000000 * 1000).getFullYear(),
    )
    expect(element.pageCurrent).to.equal(2)
    expect(element.pageTotal).to.equal(5)
    const footer = element.shadowRoot.querySelector('footer')
    expect(footer.textContent.includes('Page 2 of 5')).to.equal(true)
    expect(footer.textContent.includes(element.lastUpdated)).to.equal(true)
    expect(footer.textContent.includes('© ' + element.copyrightYear)).to.equal(
      true,
    )
    expect(
      footer.querySelector('img.author-image').getAttribute('src'),
    ).to.equal('assets/author.png')
    expect(footer.textContent.includes('Journey Site')).to.equal(true)
  })

  it('renders the header with author image and title', async () => {
    const element = await fixture(html`<journey-theme></journey-theme>`)
    await element.updateComplete
    await wait(80)
    const header = element.shadowRoot.querySelector('header')
    expect(
      header.querySelector('img.author-image').getAttribute('src'),
    ).to.equal('assets/author.png')
    expect(header.querySelector('img.author-image').getAttribute('alt')).to.equal(
      'Journey Author',
    )
    // location null renders the non-home heading variant
    expect(header.querySelector('.site-title-heading').textContent).to.equal(
      'Journey Site',
    )
    expect(header.querySelector('.site-description').textContent).to.equal(
      'A journey through pages',
    )
    // the theme picker button is available in the header
    const picker = header.querySelector('simple-icon-button-lite.theme-picker')
    expect(picker.getAttribute('label')).to.equal('Change theme')
  })

  it('renders the home route with section cards and child page images', async () => {
    store.location = { route: { name: 'home' } }
    const element = await fixture(html`<journey-theme></journey-theme>`)
    await element.updateComplete
    await wait(80)
    await element.updateComplete
    const header = element.shadowRoot.querySelector('header')
    expect(header.querySelector('h1').textContent).to.equal('Journey Site')
    expect(header.querySelector('h2').textContent).to.equal(
      'A journey through pages',
    )
    const nav = element.shadowRoot.querySelector('nav.lower-header-box')
    expect(nav.className.includes('home')).to.equal(true)
    // home route shows only the home shortcut, no section links
    const topLinks = nav.querySelectorAll('a.article-link-icon.top')
    expect(topLinks.length).to.equal(1)
    expect(topLinks[0].querySelector('simple-icon-button-lite').getAttribute('icon')).to.equal(
      'icons:explore',
    )
    const main = element.shadowRoot.querySelector('main.main')
    expect(main.className.includes('home')).to.equal(true)
    const articles = main.querySelectorAll('article.post')
    expect(articles.length).to.equal(3)
    expect(articles[0].className.includes('even')).to.equal(true)
    expect(articles[1].className.includes('odd')).to.equal(true)
    expect(articles[1].querySelector('h3').textContent).to.equal('About')
    expect(articles[1].querySelector('p').textContent).to.equal('About us')
    expect(
      articles[1].querySelector('simple-icon-button-lite').getAttribute('icon'),
    ).to.equal('icons:info')
    // items with children get a child-pages container with the child image
    const childLinks = articles[1].querySelectorAll('a.child-page-link')
    expect(childLinks.length).to.equal(1)
    expect(childLinks[0].querySelector('img').getAttribute('src')).to.equal(
      'assets/team.png',
    )
    expect(childLinks[0].querySelector('img').getAttribute('alt')).to.equal(
      'Team',
    )
    // sections without children render no container
    expect(
      articles[0].querySelector('div.child-pages-container') === null,
    ).to.equal(true)
    // read more CTA links to the section
    const cta = articles[1].querySelector('simple-cta')
    expect(cta.getAttribute('link')).to.equal('about')
    expect(cta.getAttribute('label')).to.equal('Read more')
    // no breadcrumb or slot on the home route
    expect(main.querySelector('site-breadcrumb') === null).to.equal(true)
    expect(main.querySelector('#slot slot') === null).to.equal(true)
  })

  it('renders inner pages with section nav, breadcrumb and content slot', async () => {
    store.location = { route: { name: 'article' } }
    store.activeId = 'guide-step'
    const element = await fixture(html`<journey-theme></journey-theme>`)
    await element.updateComplete
    await wait(80)
    await element.updateComplete
    const nav = element.shadowRoot.querySelector('nav.lower-header-box')
    expect(nav.className.includes('not-home')).to.equal(true)
    const topLinks = nav.querySelectorAll('a.article-link-icon.top')
    // home shortcut plus one link per top level item
    expect(topLinks.length).to.equal(4)
    // the active item's ancestor section is highlighted
    const guideLink = nav.querySelector('a.article-link-icon.top[href="guide"]')
    expect(guideLink.className.includes('active')).to.equal(true)
    const main = element.shadowRoot.querySelector('main.main')
    expect(main.className.includes('not-home')).to.equal(true)
    expect(main.querySelector('site-breadcrumb') === null).to.equal(false)
    expect(main.querySelector('site-active-title') === null).to.equal(false)
    expect(main.querySelector('#slot slot') === null).to.equal(false)
    const list = main.querySelector('site-collection-list')
    expect(list === null).to.equal(false)
    expect(list.getAttribute('parent')).to.equal('guide-step')
    expect(list.getAttribute('published')).to.equal('true')
    expect(list.getAttribute('sort')).to.equal('order')
    expect(main.querySelector('article.post') === null).to.equal(true)
  })

  it('cycles the palette and persists the choice', async () => {
    const element = await fixture(html`<journey-theme></journey-theme>`)
    await element.updateComplete
    element.dataPalette = 10
    await element.updateComplete
    element.togglePalette()
    await element.updateComplete
    expect(element.dataPalette).to.equal(11)
    element.togglePalette()
    await element.updateComplete
    expect(element.dataPalette).to.equal(0)
    expect(element.getAttribute('data-palette')).to.equal('0')
    // user-scaffold readMemory keeps palette value 0 (it used to read back
    // as null on a falsy check, so the theme constructor fell back to 11 and
    // palette 0 could never be restored on the next page load)
    expect(UserScaffoldInstance.readMemory('HAXCMSSitePalette')).to.equal(0)
    // a fresh theme restores the persisted palette 0 end to end
    const restored = await fixture(html`<journey-theme></journey-theme>`)
    await restored.updateComplete
    expect(restored.dataPalette).to.equal(0)
  })

  it('renders custom tag route items with images', async () => {
    const element = await fixture(html`<journey-theme></journey-theme>`)
    await element.updateComplete
    const box = await fixture(
      element.HAXSiteRenderXTagsItems([
        { slug: 'tagged', title: 'Tagged', metadata: { image: 'assets/tagged.png' } },
        { slug: 'other', title: 'Other', metadata: {} },
      ]),
    )
    const links = box.querySelectorAll('a.child-page-link')
    expect(links.length).to.equal(2)
    expect(links[0].getAttribute('href')).to.equal('tagged')
    expect(links[0].querySelector('img').getAttribute('src')).to.equal(
      'assets/tagged.png',
    )
    expect(links[0].querySelector('img').getAttribute('alt')).to.equal('Tagged')
    // without an item image the author image is used
    expect(links[1].querySelector('img').getAttribute('src')).to.equal(
      'assets/author.png',
    )
    expect(links[1].querySelector('img').getAttribute('alt')).to.equal(
      'Journey Author',
    )
  })
})

describe('journey-menu', () => {
  let menu
  beforeEach(async () => {
    menu = await fixture(html`
      <journey-menu
        .items=${[
          { id: 'a', title: 'A', slug: 'a' },
          { id: 'b', title: 'B', slug: 'b' },
        ]}
        activeId="b"
      ></journey-menu>
    `)
    await menu.updateComplete
  })

  it('renders the item list with the active link marked', () => {
    const links = menu.shadowRoot.querySelectorAll('ul li a')
    expect(links.length).to.equal(2)
    expect(links[0].getAttribute('href')).to.equal('a')
    expect(links[0].className.includes('active')).to.equal(false)
    expect(links[1].className.includes('active')).to.equal(true)
    const toggle = menu.shadowRoot.querySelector('button.menu-toggle')
    expect(toggle.getAttribute('aria-label')).to.equal(
      'Toggle navigation menu',
    )
    expect(toggle.getAttribute('aria-expanded')).to.equal('false')
    expect(toggle.getAttribute('aria-controls')).to.equal('journeymenu-nav')
    expect(
      menu.shadowRoot.querySelector('button.menu-close').getAttribute(
        'aria-label',
      ),
    ).to.equal('Close navigation menu')
    expect(
      menu.shadowRoot.querySelector('nav#journeymenu-nav').getAttribute(
        'aria-label',
      ),
    ).to.equal('Page navigation')
  })

  it('toggleOpen and closeNav drive the open state', async () => {
    menu.toggleOpen()
    await menu.updateComplete
    expect(menu.open).to.equal(true)
    expect(menu.hasAttribute('open')).to.equal(true)
    expect(
      menu.shadowRoot.querySelector('button.menu-toggle').getAttribute(
        'aria-expanded',
      ),
    ).to.equal('true')
    expect(
      menu.shadowRoot.querySelector('nav#journeymenu-nav').className.includes(
        'open',
      ),
    ).to.equal(true)
    menu.closeNav()
    await menu.updateComplete
    expect(menu.open).to.equal(false)
    expect(menu.hasAttribute('open')).to.equal(false)
  })

  it('Escape closes the open nav and refocuses a visible element', async () => {
    menu.toggleOpen()
    await menu.updateComplete
    const nav = menu.shadowRoot.querySelector('nav#journeymenu-nav')
    // focus starts inside the nav so the Escape refocus is observable
    const firstLink = nav.querySelector('ul li a')
    firstLink.focus()
    nav.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        composed: true,
      }),
    )
    await menu.updateComplete
    expect(menu.open).to.equal(false)
    // on desktop the toggle is display none (focus() on it is a no-op), so
    // Escape returns focus to the first navigation link instead
    expect(menu.shadowRoot.activeElement === firstLink).to.equal(true)
    // Escape on a closed nav is a no-op
    nav.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        composed: true,
      }),
    )
    await menu.updateComplete
    expect(menu.open).to.equal(false)
  })
})

describe('journey-sidebar-theme store-driven menu', () => {
  it('feeds the menu from the manifest and active id', async () => {
    store.activeId = 'about'
    const element = await fixture(
      html`<journey-sidebar-theme></journey-sidebar-theme>`,
    )
    await element.updateComplete
    await wait(80)
    await element.updateComplete
    expect(element.activeId).to.equal('about')
    expect(element._items.length).to.equal(5)
    const menu = element.shadowRoot.querySelector('journey-menu')
    expect(menu.items.length).to.equal(5)
    expect(menu.activeId).to.equal('about')
    const links = menu.shadowRoot.querySelectorAll('ul li a')
    expect(links.length).to.equal(5)
    const active = menu.shadowRoot.querySelector('ul li a.active')
    expect(active.textContent.trim()).to.equal('About')
    expect(element.shadowRoot.querySelector('a.skip-link') === null).to.equal(
      false,
    )
    expect(element.shadowRoot.querySelector('main') === null).to.equal(false)
    expect(
      element.shadowRoot.querySelector('#contentcontainer slot') === null,
    ).to.equal(false)
  })
})

describe('journey-topbar-theme store-driven nav', () => {
  it('renders the top bar with the active section', async () => {
    store.activeId = 'about'
    const element = await fixture(
      html`<journey-topbar-theme></journey-topbar-theme>`,
    )
    await element.updateComplete
    await wait(80)
    await element.updateComplete
    expect(element.activeId).to.equal('about')
    const links = element.shadowRoot.querySelectorAll('nav.topbar-scroll ul li')
    expect(links.length).to.equal(5)
    expect(links[1].className.includes('active')).to.equal(true)
    expect(links[1].querySelector('a').getAttribute('href')).to.equal('about')
    expect(links[0].className.includes('active')).to.equal(false)
    expect(links[0].querySelector('a').getAttribute('href')).to.equal('home')
    expect(
      element.shadowRoot.querySelector('nav.topbar-scroll').getAttribute(
        'aria-label',
      ),
    ).to.equal('Page navigation')
    expect(element.shadowRoot.querySelector('a.skip-link') === null).to.equal(
      false,
    )
    expect(element.shadowRoot.querySelector('main') === null).to.equal(false)
    expect(
      element.shadowRoot.querySelector('#contentcontainer slot') === null,
    ).to.equal(false)
  })
})
