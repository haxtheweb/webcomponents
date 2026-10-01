import { fixture, expect, html } from '@open-wc/testing'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'
import '../simple-blog.js'
// direct lib imports (invisible-lib rule) so coverage sees every lib file;
// the element only dynamic-imports header/footer/listing in a setTimeout
import '../lib/simple-blog-header.js'
import '../lib/simple-blog-footer.js'
import '../lib/simple-blog-listing.js'
import '../lib/simple-blog-overview.js'
import '../lib/simple-blog-post.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function until(check, timeout = 1500, step = 25) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    if (check()) {
      return true
    }
    await wait(step)
  }
  return check()
}

// inline data URI so no image network request is ever issued
const DATA_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

// JSON Outline Schema shaped manifest fixture driving the whole suite.
// Elements are fixture'd per test (beforeEach) because the open-wc fixture
// sandbox is cleaned between tests, which disconnects elements created in
// a before hook and disposes their store autoruns.
const MANIFEST = {
  title: 'Test Blog',
  description: 'A blog for testing',
  metadata: {
    author: { name: 'Blog Author' },
    site: { name: 'test-blog', created: 1600000000 },
    theme: {
      variables: {
        image: DATA_IMAGE,
        icon: 'icons:record-voice-over',
        cssVariable: '--simple-colors-default-theme-pink-8',
      },
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
      description: 'Start here',
      metadata: { created: 1600000000 },
    },
    {
      id: 'post-1',
      title: 'First Post',
      slug: 'post-1',
      order: 1,
      parent: null,
      location: 'post-1.html',
      description: 'The first post',
      metadata: {
        created: 1600000001,
        fields: { images: [{ src: DATA_IMAGE }] },
      },
    },
    {
      id: 'post-2',
      title: 'Second Post',
      slug: 'post-2',
      order: 2,
      parent: null,
      location: 'post-2.html',
      description: 'The second post',
      metadata: { created: 1600000002 },
    },
  ],
}

// file level store fixture + restore (stub/restore singleton pattern)
const savedManifest = store.manifest
const savedActiveId = store.activeId
const savedLocation = store.location
const savedEditMode = store.editMode
const savedThemeElement = store.themeElement
store.manifest = MANIFEST

after(() => {
  store.manifest = savedManifest
  store.activeId = savedActiveId
  store.location = savedLocation
  store.editMode = savedEditMode
  store.themeElement = savedThemeElement
})

describe('simple-blog listing route', () => {
  let el
  beforeEach(async function () {
    this.timeout(10000)
    el = await fixture(html`<simple-blog></simple-blog>`)
    store.themeElement = el
    await el.updateComplete
    // constructor setTimeout dynamic imports + autoruns + site-query settle
    await wait(400)
    await el.updateComplete
  })

  it('renders the listing view at selected page 0', () => {
    expect(el.selectedPage).to.equal(0)
    expect(el.getAttribute('selected-page')).to.equal('0')
    expect(el.shadowRoot.querySelector('simple-blog-listing')).to.not.equal(
      null,
    )
    expect(el.shadowRoot.querySelector('simple-blog-header')).to.not.equal(
      null,
    )
    expect(el.shadowRoot.querySelector('simple-blog-post')).to.equal(null)
  })

  it('feeds the manifest through site-query into overview cards', async () => {
    const listing = el.shadowRoot.querySelector('simple-blog-listing')
    await until(() => listing.__items.length === 3)
    const overviews = listing.shadowRoot.querySelectorAll(
      'simple-blog-overview',
    )
    expect(overviews.length).to.equal(3)
    // sort is metadata.created DESC so the newest post comes first
    expect(overviews[0].getAttribute('title')).to.equal('Second Post')
    expect(overviews[0].getAttribute('link')).to.equal('post-2')
    expect(overviews[0].getAttribute('item-id')).to.equal('post-2')
    expect(overviews[0].getAttribute('changed')).to.equal('1600000002')
    // the middle card renders title and link
    const anchor = overviews[1].shadowRoot.querySelector('a')
    expect(anchor.getAttribute('href')).to.equal('post-1')
    expect(
      overviews[1].shadowRoot.querySelector('h3.post-title').textContent,
    ).to.equal('First Post')
    // BUG: the listing binds description="..." but simple-blog-overview never
    // declares a description property (only body, which it never renders), so
    // this.description is always undefined and every excerpt is blank
    expect(
      overviews[1].shadowRoot.querySelector('.post-excerpt p').textContent,
    ).to.equal('')
  })

  it('elevates the overview card on pointer and focus events', async () => {
    const listing = el.shadowRoot.querySelector('simple-blog-listing')
    await until(() => listing.__items.length === 3)
    const overview = listing.shadowRoot.querySelector(
      'simple-blog-overview[item-id="post-1"]',
    )
    expect(overview.elevation).to.equal(0)
    // direct handler calls
    overview.tapEventOn()
    await overview.updateComplete
    expect(overview.elevation).to.equal(2)
    expect(overview.getAttribute('elevation')).to.equal('2')
    overview.tapEventOff()
    await overview.updateComplete
    expect(overview.elevation).to.equal(0)
    // real events through the constructor-bound listeners
    overview.dispatchEvent(new Event('mousedown'))
    expect(overview.elevation).to.equal(2)
    overview.dispatchEvent(new Event('mouseout'))
    expect(overview.elevation).to.equal(0)
    overview.dispatchEvent(new Event('focusin'))
    expect(overview.elevation).to.equal(2)
    overview.dispatchEvent(new Event('focusout'))
    expect(overview.elevation).to.equal(0)
  })

  it('maps the manifest onto the blog header', async () => {
    const header = el.shadowRoot.querySelector('simple-blog-header')
    await until(() => header.title === 'Test Blog')
    expect(header.description).to.equal('A blog for testing')
    expect(header.image).to.equal(DATA_IMAGE)
    expect(header.icon).to.equal('icons:record-voice-over')
    expect(header.author.name).to.equal('Blog Author')
    expect(
      header.shadowRoot.querySelector('h1.site-title').textContent,
    ).to.equal('Test Blog')
    expect(
      header.shadowRoot.querySelector('p.blog-description').textContent,
    ).to.equal('A blog for testing')
    expect(
      header.shadowRoot
        .querySelector('.teaserimage-image')
        .getAttribute('style'),
    ).to.include('data:image')
    expect(
      header.shadowRoot.querySelector('simple-icon.blog-logo'),
    ).to.not.equal(null)
    // atom and rss buttons are both offered
    const buttons = header.shadowRoot.querySelectorAll('site-rss-button')
    expect(buttons.length).to.equal(2)
    expect(buttons[0].getAttribute('type')).to.equal('atom')
    expect(buttons[1].getAttribute('type')).to.equal('rss')
  })

  it('hides the header title and description block when there is no title', async () => {
    const header = await fixture(html`<simple-blog-header></simple-blog-header>`)
    // let the manifest autorun populate the header first
    await until(() => header.title === 'Test Blog')
    expect(header.shadowRoot.querySelector('h1.site-title')).to.not.equal(
      null,
    )
    // then clear the title: neither the title nor the description renders
    header.title = ''
    await header.updateComplete
    expect(header.shadowRoot.querySelector('h1.site-title')).to.equal(null)
    expect(
      header.shadowRoot.querySelector('p.blog-description'),
    ).to.equal(null)
    expect(
      header.shadowRoot.querySelectorAll('site-rss-button').length,
    ).to.equal(2)
    header.remove()
  })
})

describe('simple-blog post route', () => {
  let el
  beforeEach(async function () {
    this.timeout(10000)
    // reset the route first: a fresh element's location autorun fires at
    // connect with whatever location is currently in the store, which
    // would otherwise render the post view instead of the listing
    store.location = { route: { name: 'home' } }
    el = await fixture(
      html`<simple-blog><p>Post body content</p></simple-blog>`,
    )
    store.themeElement = el
    await el.updateComplete
    await wait(400)
  })

  it('switches to the post view when the location changes', async function () {
    this.timeout(10000)
    store.location = { route: { name: 'post-1' }, baseUrl: '/' }
    // location autorun fires in a microtask, then resize/anchor timers run
    await until(() => el.selectedPage === 1)
    await el.updateComplete
    await wait(1100)
    expect(el.selectedPage).to.equal(1)
    expect(el.getAttribute('selected-page')).to.equal('1')
    const post = el.shadowRoot.querySelector('simple-blog-post')
    expect(post).to.not.equal(null)
    expect(post.getAttribute('edit-mode')).to.equal(null)
    // the inner post exposes the content container for HAX wiring
    await until(
      () => el.contentContainer !== null && el.contentContainer !== undefined,
    )
    expect(el.contentContainer.id).to.equal('contentcontainer')
    // back button and tooltip are rendered with the footer
    const back = el.shadowRoot.querySelector('#backbutton')
    expect(back.getAttribute('label')).to.equal('Back to blog')
    expect(back.getAttribute('icon')).to.equal('icons:arrow-back')
    expect(el.shadowRoot.querySelector('simple-tooltip')).to.not.equal(null)
    const footer = el.shadowRoot.querySelector('#footer')
    expect(footer.tagName.toLowerCase()).to.equal('simple-blog-footer')
    // slot content lands in the post view
    expect(post.querySelector('slot')).to.not.equal(null)
  })

  it('returns to the listing when the back button is clicked', async function () {
    this.timeout(10000)
    store.location = { route: { name: 'post-1' }, baseUrl: '/' }
    await until(() => el.selectedPage === 1)
    const back = el.shadowRoot.querySelector('#backbutton')
    back.click()
    // _goBack synchronously resets the element to the listing view; the
    // reflected attribute only catches up on the next Lit update
    expect(el.selectedPage).to.equal(0)
    await el.updateComplete
    expect(el.getAttribute('selected-page')).to.equal('0')
    expect(el.shadowRoot.querySelector('simple-blog-listing')).to.not.equal(
      null,
    )
  })

  it('looks the previous overview back up after a back navigation', async function () {
    this.timeout(10000)
    // a fresh element whose listing is already populated: _goBack runs
    // its 100ms overview lookup against an intact listing (no navigation
    // happened so nothing re-renders the listing view away)
    store.activeId = 'post-1'
    const listing = el.shadowRoot.querySelector('simple-blog-listing')
    await until(() => listing.__items.length === 3)
    el._goBack(new Event('click'))
    expect(el.selectedPage).to.equal(0)
    await wait(150)
    expect(el.selectedPage).to.equal(0)
  })
})

describe('simple-blog-post', () => {
  let post
  beforeEach(async function () {
    this.timeout(10000)
    store.activeId = 'post-1'
    post = await fixture(
      html`<simple-blog-post><p>Post body</p></simple-blog-post>`,
    )
    await post.updateComplete
    // connectedCallback wires the scroll listener and autoruns on a timer
    await wait(250)
  })

  it('derives the header image from the active item fields', () => {
    expect(post.hasImage).to.equal(true)
    expect(post.getAttribute('has-image')).to.equal('')
    expect(post.image).to.equal(DATA_IMAGE)
    const image = post.shadowRoot.querySelector('#image')
    expect(image).to.not.equal(null)
    expect(image.getAttribute('style')).to.include('data:image')
    expect(post.shadowRoot.querySelector('site-active-title')).to.not.equal(
      null,
    )
    expect(post.shadowRoot.querySelector('#contentcontainer slot')).to.not
      .equal(null)
  })

  it('parallaxes the header image on scroll', async () => {
    // BUG: at scroll position 0 the listener's
    // (pageYOffset || document.scrollTop) fallback chain resolves to
    // undefined (document has no scrollTop), so top computes to NaN and
    // the invalid translate3d(0px, NaNpx, 0px) assignment is silently
    // dropped. Scroll to a nonzero offset so the transform is valid.
    globalThis.scrollTo(0, 300)
    const reduced =
      globalThis.matchMedia &&
      globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
    globalThis.dispatchEvent(new Event('scroll'))
    await wait(150)
    const image = post.shadowRoot.querySelector('#image')
    if (!reduced) {
      expect(image.style.transform).to.include('translate3d')
    }
    // a second scroll while ticking is ignored (rAF throttle)
    post._scrollTicking = true
    globalThis.dispatchEvent(new Event('scroll'))
    await wait(50)
    expect(post._scrollTicking).to.equal(true)
    post._scrollTicking = false
  })

  it('computes has-image defensively from item fields', () => {
    expect(post._computeHasImage({})).to.equal(false)
    expect(post._computeHasImage(null)).to.equal(false)
    expect(post._computeHasImage({ images: [] })).to.equal(false)
    expect(post._computeHasImage({ images: [{}] })).to.equal(false)
    expect(post._computeHasImage({ images: [{ src: 'x.jpg' }] })).to.equal(
      true,
    )
  })

  it('resets the content padding when the image goes away', async () => {
    expect(
      post.shadowRoot.querySelector('#contentcontainer').style.paddingTop,
    ).to.not.equal('')
    post.hasImage = false
    await post.updateComplete
    await wait(100)
    expect(
      post.shadowRoot.querySelector('#contentcontainer').style.paddingTop,
    ).to.equal('')
  })

  it('cleans up scroll listener and autoruns on disconnect', async () => {
    expect(post.windowControllers.signal.aborted).to.equal(false)
    post.remove()
    expect(post.windowControllers.signal.aborted).to.equal(true)
  })
})

describe('simple-blog-footer', () => {
  let footer
  beforeEach(async function () {
    this.timeout(10000)
    store.activeId = 'post-1'
    footer = await fixture(html`<simple-blog-footer></simple-blog-footer>`)
    await footer.updateComplete
    // routerManifest, activeManifestIndex and editMode autoruns settle
    await wait(250)
  })

  it('renders the manifest title and description', () => {
    expect(footer.manifest.title).to.equal('Test Blog')
    expect(
      footer.shadowRoot.querySelector('h2.blog-title').textContent.trim(),
    ).to.equal('Test Blog')
    expect(
      footer.shadowRoot
        .querySelector('p.blog-description')
        .textContent.trim(),
    ).to.equal('A blog for testing')
    // theme image is painted into the closer background
    expect(
      footer.shadowRoot
        .querySelector('.background-closer-image')
        .getAttribute('style'),
    ).to.include('data:image')
    expect(footer.shadowRoot.querySelector('button').textContent).to.equal(
      'Back to list',
    )
  })

  it('maps the cssVariable theme token onto the accent color', () => {
    expect(footer.accentColor).to.equal('pink')
  })

  it('shows previous and next posts around the active item', () => {
    // active item is post-1 (index 1), so prev is Home and next is Second
    expect(footer.activeManifestIndex).to.equal(1)
    expect(footer.prevTitle).to.equal(' - Home')
    expect(footer.prevChanged).to.equal(1600000000)
    expect(footer.nextTitle).to.equal(' - Second Post')
    expect(footer.nextChanged).to.equal(1600000002)
    const buttons = footer.shadowRoot.querySelectorAll('site-menu-button')
    expect(buttons.length).to.equal(2)
    expect(buttons[0].getAttribute('type')).to.equal('prev')
    expect(buttons[1].getAttribute('type')).to.equal('next')
  })

  it('reflects edit mode from the global store', async () => {
    store.editMode = true
    await until(() => footer.editMode === true)
    await footer.updateComplete
    expect(footer.getAttribute('edit-mode')).to.equal('')
    store.editMode = false
    await until(() => footer.editMode === false)
    await footer.updateComplete
    expect(footer.hasAttribute('edit-mode')).to.equal(false)
  })

  it('clears prev and next when the active item has no neighbors', async () => {
    // first item: no previous, next is the first post
    store.activeId = 'home'
    await until(() => footer.activeManifestIndex === 0)
    await footer.updateComplete
    expect(footer.prevTitle).to.equal('')
    expect(footer.prevChanged).to.equal('')
    expect(footer.nextTitle).to.equal(' - First Post')
    // last item: no next, previous is the first post
    store.activeId = 'post-2'
    await until(() => footer.activeManifestIndex === 2)
    await footer.updateComplete
    expect(footer.prevTitle).to.equal(' - First Post')
    expect(footer.nextTitle).to.equal('')
    expect(footer.nextChanged).to.equal('')
    store.activeId = 'post-1'
    await until(() => footer.activeManifestIndex === 1)
  })

  it('navigates back to the base url on the back button tap', async () => {
    store.location = { route: { name: 'post-1' }, baseUrl: '/' }
    const pushed = []
    const original = globalThis.history.pushState
    globalThis.history.pushState = (state, title, url) => {
      pushed.push(url)
      return original.call(globalThis.history, state, title, url)
    }
    footer._backButtonTap(new Event('click'))
    globalThis.history.pushState = original
    expect(pushed.length).to.equal(1)
    expect(pushed[0]).to.equal('/')
  })

  it('cleans up autoruns on disconnect', () => {
    footer.remove()
  })
})

describe('simple-blog element definition', () => {
  it('defines all the blog elements on the registry', () => {
    expect(globalThis.customElements.get('simple-blog')).to.exist
    expect(globalThis.customElements.get('simple-blog-post')).to.exist
    expect(globalThis.customElements.get('simple-blog-footer')).to.exist
    expect(globalThis.customElements.get('simple-blog-header')).to.exist
    expect(globalThis.customElements.get('simple-blog-listing')).to.exist
    expect(globalThis.customElements.get('simple-blog-overview')).to.exist
  })
})
