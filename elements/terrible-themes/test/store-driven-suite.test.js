import { fixture, expect, html } from '@open-wc/testing'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'
import '../terrible-themes.js'
// direct lib imports so istanbul sees every lib theme (invisible-lib rule);
// none of these modules are imported anywhere else
import '../lib/terrible-best-themes.js'
import '../lib/terrible-outlet-themes.js'
import '../lib/terrible-productionz-themes.js'
import '../lib/terrible-resume-themes.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// file level store fixture + restore (stub/restore singleton pattern)
const savedManifest = store.manifest
const savedActiveId = store.activeId

store.manifest = {
  title: 'Terrible Site',
  author: 'Fallback Author',
  metadata: {
    author: { name: 'Terrible Author' },
    site: {
      name: 'Terrible',
      logo: 'assets/logo.png',
      created: 1600000000,
      updated: 1717000000,
    },
  },
  items: [
    {
      id: 'home',
      title: 'Home',
      slug: 'home',
      order: 0,
      parent: null,
      location: 'index.html',
      metadata: { created: 1600000000 },
    },
    {
      id: 'news',
      title: 'News',
      slug: 'news',
      order: 1,
      parent: null,
      location: 'news.html',
      metadata: {},
    },
    {
      id: 'kid',
      title: 'Kid',
      slug: 'kid',
      order: 0,
      parent: 'home',
      location: 'kid.html',
      metadata: {},
    },
  ],
}

after(() => {
  store.manifest = savedManifest
  store.activeId = savedActiveId
})

describe('terrible-themes main theme', () => {
  let element
  beforeEach(async () => {
    store.activeId = 'home'
    element = await fixture(html`<terrible-themes></terrible-themes>`)
    await element.updateComplete
    await wait(80)
  })

  it('renders the legacy table layout with landmarks', () => {
    expect(
      element.shadowRoot.querySelector('a.skip-link').getAttribute('href'),
    ).to.equal('#contentcontainer')
    expect(
      element.shadowRoot.querySelector('section#slot[role="main"]') === null,
    ).to.equal(false)
    expect(
      element.shadowRoot.querySelector('section#slot').getAttribute(
        'aria-label',
      ),
    ).to.equal('Page content')
    expect(
      element.shadowRoot.querySelector('td#contentcontainer[tabindex="-1"]') ===
        null,
    ).to.equal(false)
    expect(
      element.shadowRoot.querySelector('site-top-menu[indicator="arrow"]') ===
        null,
    ).to.equal(false)
    expect(element.shadowRoot.querySelector('site-footer') === null).to.equal(
      false,
    )
    expect(element.shadowRoot.querySelector('site-active-title') === null).to.equal(
      false,
    )
    // the fake login link is disabled for keyboard and AT
    const login = element.shadowRoot.querySelector('a.loginState')
    expect(login.getAttribute('aria-disabled')).to.equal('true')
    expect(login.getAttribute('tabindex')).to.equal('-1')
  })

  it('tracks the active manifest index from the store', async () => {
    expect(element.activeManifestIndex).to.equal(0)
    store.activeId = 'news'
    await wait(80)
    expect(element.activeManifestIndex).to.equal(1)
  })

  it('updates prev and next page labels from menu buttons', async () => {
    // a middle page has neighbors on both sides
    store.activeId = 'news'
    await wait(80)
    await element.updateComplete
    expect(element.prevPage).to.equal('Home')
    expect(element.nextPage).to.equal('Kid')
    element.requestUpdate()
    await element.updateComplete
    const prevBottom = element.shadowRoot.querySelector(
      'aside site-menu-button[type="prev"] .bottom',
    )
    expect(prevBottom.textContent.trim()).to.equal('Home')
    const nextBottom = element.shadowRoot.querySelector(
      'aside site-menu-button[type="next"] .bottom',
    )
    expect(nextBottom.textContent.trim()).to.equal('Kid')
    expect(
      element.shadowRoot.querySelector('aside[aria-label="Page navigation"]') ===
        null,
    ).to.equal(false)
    // the handlers can also be driven directly
    element.__prevPageLabelChanged({ detail: { value: 'Previous page' } })
    expect(element.prevPage).to.equal('Previous page')
    element.__nextPageLabelChanged({ detail: { value: 'Next page' } })
    expect(element.nextPage).to.equal('Next page')
  })
})

describe('terrible-best-themes', () => {
  it('renders the skater table layout', async () => {
    store.activeId = 'home'
    const element = await fixture(
      html`<terrible-best-themes></terrible-best-themes>`,
    )
    await element.updateComplete
    await wait(80)
    expect(
      element.shadowRoot.querySelector('a.skip-link').getAttribute('href'),
    ).to.equal('#contentcontainer')
    const img = element.shadowRoot.querySelector('img')
    expect(img.getAttribute('src').includes('SKATER.gif')).to.equal(true)
    expect(img.getAttribute('alt')).to.equal('')
    expect(
      element.shadowRoot.querySelector('main#contentcontainer') === null,
    ).to.equal(false)
    expect(element.shadowRoot.querySelector('site-menu') === null).to.equal(
      false,
    )
    expect(
      element.shadowRoot.querySelectorAll('site-menu-button.navigation').length,
    ).to.equal(2)
    expect(element.shadowRoot.querySelector('scroll-button') === null).to.equal(
      false,
    )
    // store wiring for the active index
    store.activeId = 'news'
    await wait(80)
    expect(element.activeManifestIndex).to.equal(1)
  })
})

describe('terrible-outlet-themes', () => {
  it('renders the classic sidebar layout', async () => {
    store.activeId = 'home'
    const element = await fixture(
      html`<terrible-outlet-themes></terrible-outlet-themes>`,
    )
    await element.updateComplete
    await wait(80)
    expect(
      element.shadowRoot.querySelector('a.skip-link').getAttribute('href'),
    ).to.equal('#contentcontainer')
    expect(element.shadowRoot.querySelector('site-title') === null).to.equal(
      false,
    )
    expect(element.shadowRoot.querySelector('site-menu') === null).to.equal(
      false,
    )
    expect(element.shadowRoot.querySelector('site-footer') === null).to.equal(
      false,
    )
    expect(
      element.shadowRoot.querySelector('main#contentcontainer') === null,
    ).to.equal(false)
    expect(
      element.shadowRoot.querySelector('section#slot slot') === null,
    ).to.equal(false)
    const scroll = element.shadowRoot.querySelector('scroll-button')
    expect(scroll.getAttribute('label')).to.equal('Back to top')
  })
})

describe('terrible-productionz-themes', () => {
  let restoreAppend
  beforeEach(() => {
    // the theme's firstUpdated injects a googleapis Caveat font stylesheet;
    // drop just that link so no remote font is ever fetched in the session
    const saved = globalThis.document.head.appendChild
    globalThis.document.head.appendChild = (el) => {
      if (
        el &&
        el.tagName === 'LINK' &&
        typeof el.href === 'string' &&
        el.href.includes('fonts.googleapis.com')
      ) {
        return el
      }
      return saved.call(globalThis.document.head, el)
    }
    restoreAppend = () => {
      globalThis.document.head.appendChild = saved
    }
  })
  afterEach(() => {
    restoreAppend()
  })

  it('renders the productionz layout with author and posted metadata', async () => {
    store.activeId = 'home'
    const element = await fixture(
      html`<terrible-productionz-themes></terrible-productionz-themes>`,
    )
    await element.updateComplete
    await wait(80)
    await element.updateComplete
    expect(element.author).to.equal('Terrible Author')
    expect(
      element.shadowRoot.querySelector('a.skip-link').getAttribute('href'),
    ).to.equal('#contentcontainer')
    expect(
      element.shadowRoot.querySelector('main#contentcontainer[role="main"]') ===
        null,
    ).to.equal(false)
    // posted date comes from the active item metadata
    expect(
      element.shadowRoot.querySelector('p.posted simple-datetime') === null,
    ).to.equal(false)
    expect(element.shadowRoot.querySelector('site-menu') === null).to.equal(
      false,
    )
    const acidLink = element.shadowRoot.querySelector(
      'a[href="http://www.acidscorpio.com/"]',
    )
    expect(acidLink.getAttribute('rel')).to.equal('noopener')
    expect(acidLink.getAttribute('target')).to.equal('_blank')
    // the page body gets the tiled background image
    expect(
      globalThis.document.body.style.backgroundImage.includes(
        'productionzbg.jpg',
      ),
    ).to.equal(true)
    // the remote Caveat font link never lands in the document head
    const fontHrefs = []
    globalThis.document.head.querySelectorAll('link').forEach((l) => {
      if ((l.getAttribute('href') || '').includes('fonts.googleapis.com')) {
        fontHrefs.push(l.getAttribute('href'))
      }
    })
    expect(fontHrefs.join('|')).to.equal('')
  })

  it('falls back through manifest author sources', async () => {
    store.activeId = 'home'
    const element = await fixture(
      html`<terrible-productionz-themes></terrible-productionz-themes>`,
    )
    await element.updateComplete
    await wait(80)
    expect(element.author).to.equal('Terrible Author')
    // without a metadata author the flat manifest author is used
    delete store.manifest.metadata.author
    await wait(80)
    expect(element.author).to.equal('Fallback Author')
    // without any author at all the legacy handle is used
    delete store.manifest.author
    await wait(80)
    expect(element.author).to.equal('Ac|d-$CoRpI()')
    store.manifest.metadata.author = { name: 'Terrible Author' }
    store.manifest.author = 'Fallback Author'
    await wait(80)
  })

  it('hides the posted date without item metadata', async () => {
    store.activeId = 'news'
    const element = await fixture(
      html`<terrible-productionz-themes></terrible-productionz-themes>`,
    )
    await element.updateComplete
    await wait(80)
    await element.updateComplete
    expect(element.activeItem.title).to.equal('News')
    expect(
      element.shadowRoot.querySelector('p.posted simple-datetime') === null,
    ).to.equal(true)
  })
})

describe('terrible-resume-themes', () => {
  it('renders the resume layout with ancestor wiring', async () => {
    store.activeId = 'home'
    const element = await fixture(
      html`<terrible-resume-themes></terrible-resume-themes>`,
    )
    await element.updateComplete
    await wait(80)
    expect(
      element.shadowRoot.querySelector('a.skip-link').getAttribute('href'),
    ).to.equal('#contentcontainer')
    const topMenu = element.shadowRoot.querySelector('site-top-menu')
    expect(topMenu.getAttribute('indicator')).to.equal('arrow')
    expect(
      topMenu.querySelector('site-title[slot="prefix"]') === null,
    ).to.equal(false)
    expect(
      element.shadowRoot
        .querySelector('site-active-title')
        .getAttribute('dynamic-methodology'),
    ).to.equal('ancestor')
    expect(
      element.shadowRoot.querySelector('aside[aria-label="Sub-pages"]') ===
        null,
    ).to.equal(false)
    expect(
      element.shadowRoot
        .querySelector('site-children-block')
        .getAttribute('dynamic-methodology'),
    ).to.equal('ancestor')
    expect(
      element.shadowRoot.querySelector('main#contentcontainer[role="main"]') ===
        null,
    ).to.equal(false)
  })
})
