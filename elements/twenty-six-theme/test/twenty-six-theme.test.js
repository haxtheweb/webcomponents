import { html, fixture, expect } from '@open-wc/testing'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'
import '../twenty-six-theme.js'

describe('TwentySixTheme test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html` <twenty-six-theme></twenty-six-theme> `)
  })

  it('basic will it blend', async () => {
    expect(element).to.exist
  })
})

// Round 8 coverage (#3079): behavioral tests for render modes,
// store-driven content, menu/tag wiring, and the internal contrast
// color helpers. Store state is stubbed via the singleton
// save/restore pattern (see hax-body/test/hax-store.test.js).
describe('TwentySixTheme behavior', () => {
  let element
  let savedManifest
  let savedActiveId
  let savedEditMode
  const tick = (ms) => new Promise((r) => setTimeout(r, ms || 60))

  before(() => {
    savedManifest = store.manifest
    savedActiveId = store.activeId
    savedEditMode = store.editMode
  })

  after(() => {
    store.manifest = savedManifest
    store.activeId = savedActiveId
    store.editMode = savedEditMode
  })

  beforeEach(async () => {
    element = await fixture(html` <twenty-six-theme></twenty-six-theme> `)
    await element.updateComplete
    // allow the rAF-based contrast sync to run at least once
    await new Promise((r) => requestAnimationFrame(r))
    await new Promise((r) => requestAnimationFrame(r))
  })

  afterEach(() => {
    store.manifest = savedManifest
    store.activeId = savedActiveId
    store.editMode = savedEditMode
  })

  it('seeds constructor defaults', () => {
    expect(element.siteDescription).to.equal('')
    expect(element.activeId).to.equal(null)
    expect(Array.isArray(element.topMenuItems)).to.equal(true)
    expect(element.topMenuItems.length).to.equal(0)
    expect(element.pageCreated).to.equal(null)
    // store.activeTags is a computed that returns null without an active
    // item; the autorun overwrites the constructor seed ('') with null
    expect(element.activeTags).to.equal(null)
    expect(element.prevPage).to.equal('')
    expect(element.nextPage).to.equal('')
    expect(element.editMode).to.equal(false)
    expect(element.hasAttribute('edit-mode')).to.equal(false)
    expect(element.HAXCMSThemeSettings.autoScroll).to.equal(true)
    expect(element.topMenuConditions.parent).to.equal(null)
    expect(element.topMenuSort.order).to.equal('ASC')
  })

  it('renders the theme structure', () => {
    const root = element.shadowRoot
    expect(root.querySelector('.skip-link').getAttribute('href')).to.equal(
      '#contentcontainer',
    )
    expect(root.querySelector('site-query') === null).to.equal(false)
    expect(root.querySelector('aside.sidebar') === null).to.equal(false)
    expect(root.querySelector('aside.sidebar').getAttribute('aria-label')).to.equal(
      'Site information',
    )
    expect(root.querySelector('site-title') === null).to.equal(false)
    expect(
      root.querySelector('nav.top-menu').getAttribute('aria-label'),
    ).to.equal('Top menu links')
    expect(root.querySelector('main.content-shell') === null).to.equal(false)
    expect(
      root.querySelector('article.post#contentcontainer') === null,
    ).to.equal(false)
    expect(root.querySelector('site-active-title') === null).to.equal(false)
    expect(root.querySelector('#slot slot') === null).to.equal(false)
    expect(
      root.querySelector('site-menu-button[type="prev"]') === null,
    ).to.equal(false)
    expect(
      root.querySelector('site-menu-button[type="next"]') === null,
    ).to.equal(false)
    // no date/tags by default so no post meta footer
    expect(root.querySelector('.post-meta')).to.equal(null)
    expect(root.querySelector('.site-description')).to.equal(null)
  })

  it('renders the site description when present', async () => {
    element.siteDescription = 'A blog about web components'
    await element.updateComplete
    expect(
      element.shadowRoot.querySelector('.site-description').textContent,
    ).to.equal('A blog about web components')
    element.siteDescription = ''
    await element.updateComplete
    expect(element.shadowRoot.querySelector('.site-description')).to.equal(null)
  })

  it('renders visible top menu items with active state', async () => {
    element.__topMenuResultChanged({
      detail: {
        value: [
          { id: 'home', title: 'Home', slug: '/', metadata: { published: true } },
          {
            id: 'hidden',
            title: 'Hidden',
            slug: '/hidden',
            metadata: { hideInMenu: true },
          },
          {
            id: 'unpub',
            title: 'Unpublished',
            slug: '/unpub',
            metadata: { published: false },
          },
          { id: 'nometa', title: 'No metadata', slug: '/nometa' },
        ],
      },
    })
    element.activeId = 'home'
    await element.updateComplete
    const links = [...element.shadowRoot.querySelectorAll('.top-menu a')]
    expect(links.length).to.equal(2)
    expect(links[0].getAttribute('href')).to.equal('/')
    expect(links[0].textContent.trim()).to.equal('Home')
    expect(links[0].className.includes('active')).to.equal(true)
    expect(links[1].getAttribute('href')).to.equal('/nometa')
    expect(links[1].className.includes('active')).to.equal(false)
  })

  it('clears top menu items when the query result is empty', async () => {
    element.__topMenuResultChanged({
      detail: { value: [{ id: 'x', title: 'X', slug: '/x' }] },
    })
    await element.updateComplete
    expect(element.topMenuItems.length).to.equal(1)
    element.__topMenuResultChanged({ detail: {} })
    await element.updateComplete
    expect(element.topMenuItems.length).to.equal(0)
    expect(
      element.shadowRoot.querySelectorAll('.top-menu li').length,
    ).to.equal(0)
  })

  it('renders the date and tag meta footer', async () => {
    element.activeTags = 'one, two'
    element.pageCreated = 1700000000
    await element.updateComplete
    await tick(150)
    const footer = element.shadowRoot.querySelector('footer.post-meta')
    expect(footer === null).to.equal(false)
    const catLinks = [...footer.querySelectorAll('.category-list a')]
    expect(catLinks.length).to.equal(2)
    expect(catLinks[0].getAttribute('href')).to.equal('x/displays/tags?tag=one')
    expect(catLinks[1].getAttribute('href')).to.equal('x/displays/tags?tag=two')
    expect(footer.querySelectorAll('.separator').length).to.equal(1)
    const dt = footer.querySelector('simple-datetime')
    expect(dt === null).to.equal(false)
    expect(dt.getAttribute('format')).to.equal('F j, Y')
    expect(dt.hasAttribute('unix')).to.equal(true)
    expect(
      footer.querySelector('simple-icon-lite[icon="icons:date-range"]') ===
        null,
    ).to.equal(false)
    expect(
      footer.querySelector('simple-icon-lite[icon="icons:folder-open"]') ===
        null,
    ).to.equal(false)
  })

  it('renders only the date when there are no tags', async () => {
    element.activeTags = ''
    element.pageCreated = 1600000000
    await element.updateComplete
    await tick(150)
    const footer = element.shadowRoot.querySelector('footer.post-meta')
    expect(footer === null).to.equal(false)
    expect(footer.querySelector('simple-datetime') === null).to.equal(false)
    expect(footer.querySelector('.category-list')).to.equal(null)
  })

  it('renders only tags when there is no created date', async () => {
    element.activeTags = 'solo'
    await element.updateComplete
    const footer = element.shadowRoot.querySelector('footer.post-meta')
    expect(footer === null).to.equal(false)
    expect(footer.querySelector('simple-datetime')).to.equal(null)
    expect(footer.querySelectorAll('.category-list a').length).to.equal(1)
    expect(footer.querySelectorAll('.separator').length).to.equal(0)
  })

  it('splits tags on commas and trims', () => {
    expect(element._tagsArray(null)).to.deep.equal([])
    expect(element._tagsArray(undefined)).to.deep.equal([])
    expect(element._tagsArray(123)).to.deep.equal([])
    expect(element._tagsArray('')).to.deep.equal([])
    expect(element._tagsArray(' one , two , ,three ')).to.deep.equal([
      'one',
      'two',
      'three',
    ])
  })

  it('encodes tag links to the internal tags route', () => {
    expect(element._tagLink('science & space')).to.equal(
      'x/displays/tags?tag=science%20%26%20space',
    )
  })

  it('detects hidden menu items', () => {
    expect(element._isHiddenMenuItem(null)).to.equal(false)
    expect(element._isHiddenMenuItem({})).to.equal(false)
    expect(element._isHiddenMenuItem({ metadata: {} })).to.equal(false)
    expect(element._isHiddenMenuItem({ metadata: { hideInMenu: true } })).to.equal(
      true,
    )
    expect(
      element._isHiddenMenuItem({ metadata: { published: false } }),
    ).to.equal(true)
    expect(
      element._isHiddenMenuItem({
        metadata: { hideInMenu: false, published: true },
      }),
    ).to.equal(false)
  })

  it('prevents link navigation only in edit mode', () => {
    const makeEvent = () => ({
      defaultPrevented: false,
      stopped: false,
      immediateStopped: false,
      preventDefault() {
        this.defaultPrevented = true
      },
      stopPropagation() {
        this.stopped = true
      },
      stopImmediatePropagation() {
        this.immediateStopped = true
      },
    })
    const normal = makeEvent()
    element.editMode = false
    element._preventInEditMode(normal)
    expect(normal.defaultPrevented).to.equal(false)
    expect(normal.stopped).to.equal(false)
    const editing = makeEvent()
    element.editMode = true
    element._preventInEditMode(editing)
    expect(editing.defaultPrevented).to.equal(true)
    expect(editing.stopped).to.equal(true)
    expect(editing.immediateStopped).to.equal(true)
  })

  it('tracks prev/next page labels into the post navigation', async () => {
    element.__prevPageLabelChanged({ detail: { value: 'Previous post' } })
    element.__nextPageLabelChanged({ detail: { value: 'Next post' } })
    await element.updateComplete
    expect(element.prevPage).to.equal('Previous post')
    expect(element.nextPage).to.equal('Next post')
    const prevBottom = element.shadowRoot.querySelector(
      'site-menu-button[type="prev"] .bottom',
    )
    expect(prevBottom.textContent).to.equal('Previous post')
    const nextBottom = element.shadowRoot.querySelector(
      'site-menu-button[type="next"] .bottom',
    )
    expect(nextBottom.textContent).to.equal('Next post')
    // empty details fall back to the empty string
    element.__prevPageLabelChanged({ detail: {} })
    element.__nextPageLabelChanged({ detail: {} })
    expect(element.prevPage).to.equal('')
    expect(element.nextPage).to.equal('')
  })

  it('reflects store state: description, activeId, tags, dates, edit mode', async () => {
    store.manifest = {
      title: 'Twenty Six Blog',
      description: 'A blog about web components',
      items: [
        {
          id: 'home',
          title: 'Home',
          slug: '/',
          metadata: { published: true, created: 1700000000, tags: 'one, two' },
        },
        {
          id: 'updated',
          title: 'Updated',
          slug: '/updated',
          metadata: { published: true, updated: 1600000000 },
        },
        { id: 'plain', title: 'Plain', slug: '/plain', metadata: { published: true } },
      ],
    }
    store.activeId = 'home'
    await tick()
    expect(element.activeId).to.equal('home')
    expect(element.siteDescription).to.equal('A blog about web components')
    expect(
      element.shadowRoot.querySelector('.site-description').textContent,
    ).to.equal('A blog about web components')
    expect(element.activeTags).to.equal('one, two')
    expect(element.pageCreated).to.equal(1700000000)
    // falls back to the updated date when created is missing
    store.activeId = 'updated'
    await tick()
    expect(element.pageCreated).to.equal(1600000000)
    // no date info at all resets to null
    store.activeId = 'plain'
    await tick()
    expect(element.pageCreated).to.equal(null)
    // unknown id means no active item at all
    store.activeId = 'does-not-exist'
    await tick()
    expect(element.pageCreated).to.equal(null)
    store.activeId = null
    await tick()
    // edit mode flows from the store and reflects on the host
    store.editMode = true
    await tick()
    expect(element.editMode).to.equal(true)
    expect(element.hasAttribute('edit-mode')).to.equal(true)
    store.editMode = false
    await tick()
    expect(element.editMode).to.equal(false)
    expect(element.hasAttribute('edit-mode')).to.equal(false)
  })

  it('parses rgb, rgba, hex and srgb colors', () => {
    expect(element.__parseColorToRgb('')).to.equal(null)
    expect(element.__parseColorToRgb(null)).to.equal(null)
    expect(element.__parseColorToRgb(' RGB(10, 20, 30) ')).to.deep.equal({
      r: 10,
      g: 20,
      b: 30,
    })
    expect(element.__parseColorToRgb('rgb(10 20 30)')).to.deep.equal({
      r: 10,
      g: 20,
      b: 30,
    })
    expect(element.__parseColorToRgb('rgba(1, 2, 3, 0.5)')).to.deep.equal({
      r: 1,
      g: 2,
      b: 3,
    })
    expect(element.__parseColorToRgb('#abc')).to.deep.equal({
      r: 170,
      g: 187,
      b: 204,
    })
    expect(element.__parseColorToRgb('#aabbcc')).to.deep.equal({
      r: 170,
      g: 187,
      b: 204,
    })
    expect(element.__parseColorToRgb('color(srgb 1 0 0)')).to.deep.equal({
      r: 255,
      g: 0,
      b: 0,
    })
    expect(element.__parseColorToRgb('color(srgb 0.5 0.5 0.5 / 0.5)')).to.deep.equal({
      r: 128,
      g: 128,
      b: 128,
    })
    expect(element.__parseColorToRgb('rgb(a, b, c)')).to.equal(null)
    expect(element.__parseColorToRgb('not-a-color')).to.equal(null)
  })

  it('picks black or white text by maximum contrast', () => {
    expect(element.__pickBlackOrWhite('rgb(255, 255, 255)')).to.equal(
      'var(--ddd-theme-default-black)',
    )
    expect(element.__pickBlackOrWhite('rgb(0, 0, 0)')).to.equal(
      'var(--ddd-theme-default-white)',
    )
    // unparseable color falls back to the black token
    expect(element.__pickBlackOrWhite('blue')).to.equal(
      'var(--ddd-theme-default-black)',
    )
  })

  it('builds hover backgrounds by mixing toward the contrast target', () => {
    expect(
      element.__buildHoverBackgroundColor('rgb(0, 0, 0)', 'var(--ddd-theme-default-black)'),
    ).to.equal('rgb(41 41 41)')
    expect(
      element.__buildHoverBackgroundColor(
        'rgb(255, 255, 255)',
        'var(--ddd-theme-default-white)',
      ),
    ).to.equal('rgb(214 214 214)')
    // unparseable background is returned unchanged
    expect(
      element.__buildHoverBackgroundColor('blue', 'var(--ddd-theme-default-black)'),
    ).to.equal('blue')
  })

  it('mixes rgb channels with clamped amounts', () => {
    expect(
      element.__mixRgb({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }, 5),
    ).to.deep.equal({ r: 255, g: 255, b: 255 })
    expect(
      element.__mixRgb({ r: 255, g: 255, b: 255 }, { r: 0, g: 0, b: 0 }, -5),
    ).to.deep.equal({ r: 255, g: 255, b: 255 })
    expect(
      element.__mixRgb({ r: 255, g: 255, b: 255 }, { r: 0, g: 0, b: 0 }, 0.5),
    ).to.deep.equal({ r: 128, g: 128, b: 128 })
  })

  it('computes luminance and contrast ratios', () => {
    expect(element.__relativeLuminance({ r: 255, g: 255, b: 255 })).to.equal(1)
    expect(element.__relativeLuminance({ r: 0, g: 0, b: 0 })).to.equal(0)
    expect(element.__channelToLinear(0)).to.equal(0)
    expect(element.__channelToLinear(255)).to.equal(1)
    expect(element.__contrastRatio(1, 0)).to.equal(21)
    expect(element.__contrastRatio(0.5, 0.5)).to.equal(1)
  })

  it('resolves background colors with fallbacks', () => {
    expect(element.__resolveBackgroundColor(null, 'rgb(1, 2, 3)')).to.equal(
      'rgb(1, 2, 3)',
    )
    const div = globalThis.document.createElement('div')
    div.style.backgroundColor = 'rgb(10, 20, 30)'
    globalThis.document.body.appendChild(div)
    expect(element.__resolveBackgroundColor(div, 'rgb(255, 255, 255)')).to.equal(
      'rgb(10, 20, 30)',
    )
    div.remove()
    const transparent = globalThis.document.createElement('div')
    globalThis.document.body.appendChild(transparent)
    expect(
      element.__resolveBackgroundColor(transparent, 'rgb(9, 9, 9)'),
    ).to.equal('rgb(9, 9, 9)')
    transparent.remove()
  })

  it('runs disposers on disconnect', async () => {
    const el = await fixture(html` <twenty-six-theme></twenty-six-theme> `)
    // 3 HAXCMSLitElementTheme + 2 HAXCMSThemeParts + 5 own constructor
    // autoruns, plus the connect-time autoruns from the mixin; the manual
    // dispose loop this override used to carry was removed because the
    // shared HAXCMSTheme mixin already disposes everything
    expect(el.__disposer.length).to.be.at.least(10)
    el.remove()
    expect(Array.isArray(el.__disposer)).to.equal(true)
    expect(el.__disposer.length).to.equal(0)
    // issue 3106: the wiring instance's watchdog autorun is disposed too
    expect(el.HAXCMSThemeWiring.__disposer.length).to.equal(0)
    // no zombie reaction: flipping the store no longer reaches the
    // removed element
    const savedEditMode = store.editMode
    const before = el.editMode
    store.editMode = !before
    await tick(80)
    expect(el.editMode).to.equal(before)
    store.editMode = savedEditMode
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible({
      // skip-link targets live inside the shadow root (axe cannot resolve
      // them across the boundary); color-contrast is racy in headless
      // light/dark resolution; empty headings come from the site-* pieces
      // having no manifest in this harness (see spacebook-theme tests)
      ignoredRules: ['skip-link', 'color-contrast', 'empty-heading'],
    })
  })
})
