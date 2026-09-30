import { fixture, expect, html } from '@open-wc/testing'
import { OutlinePlayer } from '../outline-player.js'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'

// helpers for driving matchMedia / scrollTo / SimpleModal without real
// platform dependencies; originals are always saved and restored

describe('outline-player', () => {
  let element
  let originalMatchMedia
  let originalScrollTo
  let originalStoreActiveId
  let originalStoreEditMode
  let matchMediaCalls
  let narrowMatches

  const fakeMQ = (matches) => ({
    matches: matches,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  })

  const stubMatchMedia = () => {
    matchMediaCalls = []
    globalThis.matchMedia = (query) => {
      matchMediaCalls.push(query)
      if (query === '(max-width: 640px)') {
        return fakeMQ(narrowMatches)
      }
      return fakeMQ(false)
    }
  }

  const stubScrollTo = () => {
    const calls = []
    const orig = globalThis.scrollTo
    globalThis.scrollTo = (opts) => calls.push(opts)
    return { calls, restore: () => (globalThis.scrollTo = orig) }
  }

  beforeEach(() => {
    originalMatchMedia = globalThis.matchMedia
    originalScrollTo = globalThis.scrollTo
    originalStoreActiveId = store.activeId
    originalStoreEditMode = store.editMode
    narrowMatches = false
  })

  afterEach(() => {
    globalThis.matchMedia = originalMatchMedia
    globalThis.scrollTo = originalScrollTo
    store.activeId = originalStoreActiveId
    store.editMode = originalStoreEditMode
  })

  it('defines the tag from the class', async () => {
    expect(OutlinePlayer.tag).to.equal('outline-player')
    expect(globalThis.customElements.get('outline-player')).to.exist
  })

  it('passes the shadow DOM a11y audit', async () => {
    element = await fixture(
      html`<outline-player title="test-title"></outline-player>`,
    )
    await expect(element).shadowDom.to.be.accessible()
  })

  it('renders the skip link, navigation drawer, scrim and content areas', async () => {
    element = await fixture(
      html`<outline-player title="test-title"></outline-player>`,
    )
    const skip = element.shadowRoot.querySelector('a.skip-link')
    expect(skip).to.exist
    expect(skip.getAttribute('href')).to.equal('#contentcontainer')

    const nav = element.shadowRoot.querySelector('nav')
    expect(nav).to.exist
    expect(nav.getAttribute('aria-label')).to.equal('Site navigation')
    expect(nav.getAttribute('typeof')).to.equal('oer:TableOfContents')

    expect(element.shadowRoot.querySelector('#drawer')).to.exist
    expect(element.shadowRoot.querySelector('#drawer site-menu')).to.exist
    expect(element.shadowRoot.querySelector('div.scrim')).to.exist
    expect(element.shadowRoot.querySelector('.nav-btns')).to.exist
    expect(element.shadowRoot.querySelector('site-breadcrumb')).to.exist
    expect(element.shadowRoot.querySelector('site-active-title')).to.exist
    expect(element.shadowRoot.querySelector('#contentcontainer')).to.exist
    expect(element.shadowRoot.querySelector('#slot slot')).to.exist
    expect(element.shadowRoot.querySelector('slot[name="title"]')).to.exist
  })

  it('defaults opened true / closed false and reflects both attributes', async () => {
    element = await fixture(html`<outline-player></outline-player>`)
    expect(element.opened).to.equal(true)
    expect(element.closed).to.equal(false)
    // Boolean reflection yields a present-but-empty attribute
    expect(element.hasAttribute('opened')).to.equal(true)
    expect(element.hasAttribute('closed')).to.equal(false)
    element.closed = true
    await element.updateComplete
    expect(element.hasAttribute('closed')).to.equal(true)
  })

  it('renders drawer/scrim opened classes from state', async () => {
    element = await fixture(html`<outline-player></outline-player>`)
    expect(
      element.shadowRoot.querySelector('#drawer').classList.contains('opened'),
    ).to.equal(true)
    expect(
      element.shadowRoot.querySelector('.scrim').classList.contains('opened'),
    ).to.equal(true)
    element.opened = false
    await element.updateComplete
    expect(
      element.shadowRoot.querySelector('#drawer').classList.contains('opened'),
    ).to.equal(false)
    expect(
      element.shadowRoot.querySelector('.scrim').classList.contains('opened'),
    ).to.equal(false)
  })

  it('renders the menu toggle button with wiring attributes', async () => {
    element = await fixture(html`<outline-player></outline-player>`)
    const toggle = element.shadowRoot.querySelector('.menu-toggle')
    expect(toggle).to.exist
    expect(toggle.getAttribute('icon')).to.equal('menu')
    expect(toggle.getAttribute('label')).to.equal('Toggle navigation')
    expect(toggle.getAttribute('aria-expanded')).to.equal('true')
    expect(toggle.getAttribute('aria-controls')).to.equal('drawer')
    expect(
      element.shadowRoot.querySelector('site-modal#searchmodalbtn'),
    ).to.exist
    // BUG (outline-player.js:431 + site-print-button.js:81-83): the theme
    // declares part="print-btn" on site-print-button, but once the button
    // upgrades, HAXCMSThemeParts syncs store.editMode (false) into the
    // editMode property and updated() runs removeAttribute("part"), so the
    // print-btn part is never actually exposed on a published (non-edit)
    // page. Verified in live DOM: the attribute is absent after upgrade.
    const printBtn = element.shadowRoot.querySelector('site-print-button')
    expect(printBtn).to.exist
    await new Promise((r) => setTimeout(r, 100))
    expect(printBtn.hasAttribute('part')).to.equal(
      false,
      'part=print-btn is stripped by site-print-button when editMode is false',
    )
  })

  it('_toggleMenu flips opened/closed and dispatches a resize event', async () => {
    element = await fixture(html`<outline-player></outline-player>`)
    const resizes = []
    const onResize = () => resizes.push(1)
    globalThis.addEventListener('resize', onResize)
    try {
      element._toggleMenu()
      expect(element.opened).to.equal(false)
      expect(element.closed).to.equal(true)
      element._toggleMenu()
      expect(element.opened).to.equal(true)
      expect(element.closed).to.equal(false)
      expect(resizes.length).to.equal(2)
    } finally {
      globalThis.removeEventListener('resize', onResize)
    }
  })

  it('_closeDrawer closes the drawer', async () => {
    element = await fixture(html`<outline-player></outline-player>`)
    element._closeDrawer()
    expect(element.opened).to.equal(false)
    expect(element.closed).to.equal(true)
  })

  it('clicking the menu toggle host handler toggles state', async () => {
    element = await fixture(html`<outline-player></outline-player>`)
    await element.updateComplete
    await new Promise((r) => setTimeout(r, 50))
    const toggle = element.shadowRoot.querySelector('.menu-toggle')
    toggle.click()
    await element.updateComplete
    expect(element.opened).to.equal(false)
    expect(element.closed).to.equal(true)
  })

  it('mirrors aria-expanded onto the inner menu toggle button', async () => {
    element = await fixture(html`<outline-player></outline-player>`)
    await element.updateComplete
    await new Promise((r) => setTimeout(r, 50))
    const toggle = element.shadowRoot.querySelector('.menu-toggle')
    const inner = toggle.shadowRoot.querySelector('button')
    expect(inner).to.exist
    // BUG (outline-player.js:555-559): firstUpdated calls
    // _syncMenuToggleA11y(), but at that point simple-icon-button-lite has
    // not rendered its shadow <button> yet (its own update cycle runs after
    // the host's), so the initial sync is a silent no-op and the inner
    // button never receives aria-expanded/aria-controls on first render.
    // Verified in live DOM well after settle.
    expect(inner.hasAttribute('aria-expanded')).to.equal(
      false,
      'initial _syncMenuToggleA11y fires too early to label the button',
    )
    // an opened change re-runs the sync and finally labels the button
    element.opened = false
    await element.updateComplete
    expect(inner.getAttribute('aria-expanded')).to.equal('false')
    expect(inner.getAttribute('aria-controls')).to.equal('drawer')
    element.opened = true
    await element.updateComplete
    expect(inner.getAttribute('aria-expanded')).to.equal('true')
  })

  it('dispatches closed-changed when closed flips', async () => {
    element = await fixture(html`<outline-player></outline-player>`)
    const events = []
    const onClosed = (e) => events.push(e.detail.value)
    element.addEventListener('closed-changed', onClosed)
    try {
      element.closed = true
      await element.updateComplete
      expect(events.length).to.equal(1)
      expect(events[0]).to.equal(true)
    } finally {
      element.removeEventListener('closed-changed', onClosed)
    }
  })

  it('Escape key closes the drawer only when narrow and opened', async () => {
    element = await fixture(html`<outline-player></outline-player>`)
    element.narrow = true
    element.opened = true
    globalThis.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape' }),
    )
    expect(element.opened).to.equal(false)
    expect(element.closed).to.equal(true)
    // a non-Escape key must not close it again
    element.opened = true
    element.closed = false
    globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(element.opened).to.equal(true)
  })

  it('_narrowChanged reads e.matches, falling back to e.detail.value', async () => {
    element = await fixture(html`<outline-player></outline-player>`)
    element._narrowChanged({ matches: true })
    expect(element.narrow).to.equal(true)
    element._narrowChanged({ matches: false })
    expect(element.narrow).to.equal(false)
    // legacy detail.value events (e.g. iron-media-query)
    element._narrowChanged({ detail: { value: true } })
    expect(element.narrow).to.equal(true)
    // narrow reflects as a Boolean attribute once the update flushes
    await element.updateComplete
    expect(element.hasAttribute('narrow')).to.equal(true)
  })

  it('connectedCallback wires the narrow media query listener', async () => {
    stubMatchMedia()
    narrowMatches = true
    element = await fixture(html`<outline-player></outline-player>`)
    expect(matchMediaCalls.includes('(max-width: 640px)')).to.equal(true)
    // initial sync from the matched query
    expect(element.narrow).to.equal(true)
  })

  it('_openedChanged sets opened', async () => {
    element = await fixture(html`<outline-player></outline-player>`)
    element._openedChanged(false)
    expect(element.opened).to.equal(false)
  })

  it('_activeIdChanged closes an open narrow drawer and scrolls to top', async () => {
    element = await fixture(html`<outline-player></outline-player>`)
    element.narrow = true
    element.opened = true
    stubMatchMedia()
    const scroll = stubScrollTo()
    try {
      element._activeIdChanged('item-2', 'item-1')
      expect(element.opened).to.equal(false)
      expect(element.closed).to.equal(true)
      expect(scroll.calls.length).to.equal(1)
      expect(scroll.calls[0].top).to.equal(0)
      expect(scroll.calls[0].left).to.equal(0)
      expect(scroll.calls[0].behavior).to.equal('smooth')
      expect(matchMediaCalls.includes('(prefers-reduced-motion: reduce)')).to
        .equal(true)
    } finally {
      scroll.restore()
    }
  })

  it('_activeIdChanged uses auto scroll behavior under reduced motion', async () => {
    element = await fixture(html`<outline-player></outline-player>`)
    globalThis.matchMedia = (query) => fakeMQ(query.includes('reduce'))
    const scroll = stubScrollTo()
    try {
      element._activeIdChanged('item-3', 'item-2')
      expect(scroll.calls.length).to.equal(1)
      expect(scroll.calls[0].behavior).to.equal('auto')
    } finally {
      scroll.restore()
    }
  })

  it('store activeId drives the element activeId through autorun', async () => {
    element = await fixture(html`<outline-player></outline-player>`)
    await new Promise((r) => setTimeout(r, 50))
    store.activeId = 'store-driven-item'
    await new Promise((r) => setTimeout(r, 50))
    expect(element.activeId).to.equal('store-driven-item')
  })

  it('store editMode drives the edit-mode attribute and hides the slot', async () => {
    element = await fixture(html`<outline-player></outline-player>`)
    const siteBuilder = globalThis.document.createElement(
      'haxcms-site-builder',
    )
    globalThis.document.body.appendChild(siteBuilder)
    try {
      store.editMode = true
      await new Promise((r) => setTimeout(r, 150))
      expect(element.hasAttribute('edit-mode')).to.equal(true)
      // edit mode hides the default slot and re-pads the content container
      const slotEl = element.shadowRoot.querySelector('#slot')
      const container = element.shadowRoot.querySelector('#contentcontainer')
      expect(globalThis.getComputedStyle(slotEl).display).to.equal('none')
      expect(globalThis.getComputedStyle(container).paddingTop).to.equal(
        '32px',
      )
    } finally {
      store.editMode = false
      siteBuilder.remove()
    }
  })

  it('siteModalClick focuses the search field via SimpleModal', async () => {
    element = await fixture(html`<outline-player></outline-player>`)
    const focused = []
    const fakeField = { focus: () => focused.push(1) }
    const fakeSearch = {
      shadowRoot: { querySelector: () => fakeField },
    }
    const fakeModal = { querySelector: () => fakeSearch }
    const originalSimpleModal = globalThis.SimpleModal
    globalThis.SimpleModal = {
      requestAvailability: () => fakeModal,
    }
    try {
      element.siteModalClick()
      // site-search is dynamically imported, then the focus chain runs
      await new Promise((r) => setTimeout(r, 300))
      expect(focused.length).to.equal(1)
    } finally {
      globalThis.SimpleModal = originalSimpleModal
    }
  })

  it('HAXCMSGlobalStyleSheetContent layers dark mode rules', async () => {
    element = await fixture(html`<outline-player></outline-player>`)
    const sheets = element.HAXCMSGlobalStyleSheetContent()
    expect(Array.isArray(sheets)).to.equal(true)
    const last = sheets[sheets.length - 1].cssText
    expect(last.includes('body.dark-mode outline-player')).to.equal(true)
    expect(last.includes('--outline-player-dark')).to.equal(true)
    expect(last.includes('--ddd-primary-4')).to.equal(true)
  })

  it('disconnectedCallback unwires match media and keyboard handlers', async () => {
    stubMatchMedia()
    element = await fixture(html`<outline-player></outline-player>`)
    element.disconnectedCallback()
    element.opened = true
    element.closed = false
    element.narrow = true
    // Escape handler was removed with the element
    globalThis.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape' }),
    )
    expect(element.opened).to.equal(true)
    element.connectedCallback()
  })
})
