// render modes, drawer toggling, and search-modal wiring tests for
// learn-two-theme (the original learn-two-theme.test.js body is commented
// out upstream; this suite adds active behavioral coverage)
globalThis.process = globalThis.process || {
  env: {
    NODE_ENV: 'development',
  },
}
import { fixture, expect, html } from '@open-wc/testing'
import { LearnTwoTheme } from '../learn-two-theme.js'
// statically define the breadcrumb so the :not(:defined) display:none rule
// never interferes with the responsive assertions
import '@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js'
// statically load site-modal (and simple-modal) up front: the simple-modal
// module reassigns globalThis.SimpleModal.requestAvailability on load, which
// would otherwise clobber a fake installed mid-test
import '@haxtheweb/haxcms-elements/lib/ui-components/layout/site-modal.js'

// poll until fn() is truthy or the timeout elapses; resolves to a boolean so
// assertions never receive a DOM node
async function waitFor(fn, timeout = 6000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    if (fn()) {
      return true
    }
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  return !!fn()
}

// minimal stand-in for the simple-fields-field inside the global SimpleModal
// singleton's site-search so the modal-click route never depends on the
// (empty) harness singleton
function fakeSimpleModalReturning(fakeInput) {
  return {
    requestAvailability() {
      return {
        querySelector(selector) {
          if (selector === 'site-search') {
            return { shadowRoot: { querySelector: () => fakeInput } }
          }
          return null
        },
      }
    },
  }
}

describe('learn-two-theme basic rendering', () => {
  it('registers with the expected tag name', () => {
    expect(LearnTwoTheme.tag).to.equal('learn-two-theme')
  })

  it('renders with correct default properties', async () => {
    const el = await fixture(html`<learn-two-theme></learn-two-theme>`)
    await el.updateComplete
    // opened is never initialized in the constructor, so it starts
    // undefined rather than false (see the aria-expanded BUG below)
    expect(el.opened).to.not.be.true
    expect(el.hasAttribute('opened')).to.be.false
    expect(el.HAXCMSThemeSettings.autoScroll).to.be.true
  })

  it('renders the full theme structure', async () => {
    const el = await fixture(html`<learn-two-theme></learn-two-theme>`)
    await el.updateComplete
    const sr = el.shadowRoot
    expect(sr.querySelector('a.skip-link')).to.exist
    expect(sr.querySelector('#menubutton')).to.exist
    expect(sr.querySelector('#menubutton2')).to.exist
    expect(sr.querySelector('.drawer')).to.exist
    expect(sr.querySelector('#drawer site-title')).to.exist
    expect(sr.querySelector('#drawer site-modal')).to.exist
    expect(sr.querySelector('#drawer site-print-button')).to.exist
    expect(
      sr.querySelectorAll('#drawer site-rss-button[type="atom"]').length,
    ).to.equal(1)
    expect(
      sr.querySelectorAll('#drawer site-rss-button[type="rss"]').length,
    ).to.equal(1)
    expect(sr.querySelector('nav[aria-label="Site navigation"] site-menu')).to
      .exist
    expect(sr.querySelector('.scrim')).to.exist
    expect(sr.querySelector('main site-menu-button[type="prev"]')).to.exist
    expect(sr.querySelector('main site-menu-button[type="next"]')).to.exist
    expect(sr.querySelector('#contentcontainer site-git-corner')).to.exist
    expect(sr.querySelector('#contentcontainer site-breadcrumb')).to.exist
    expect(sr.querySelector('#contentcontainer site-active-title')).to.exist
    expect(sr.querySelector('#slot slot')).to.exist
  })

  // BUG(learn-two-theme.js:509,518): aria-expanded="${this.opened}" renders
  // aria-expanded="" (an invalid ARIA state value) on the initial render
  // because `opened` is never initialized to false in the constructor; the
  // attribute only becomes valid ("true"/"false") after the first toggle.
  it('exposes the menu toggles with aria wiring (initial value BUG)', async () => {
    const el = await fixture(html`<learn-two-theme></learn-two-theme>`)
    await el.updateComplete
    const sr = el.shadowRoot
    for (const id of ['menubutton', 'menubutton2']) {
      const btn = sr.querySelector('#' + id)
      expect(btn.getAttribute('title')).to.equal('Toggle site menu')
      // documents the current broken initial value; see BUG comment above
      expect(btn.getAttribute('aria-expanded')).to.equal('')
      expect(btn.getAttribute('aria-controls')).to.equal('drawer')
    }
    // after one full toggle cycle the attribute becomes valid
    el.toggleDrawer()
    await el.updateComplete
    expect(
      sr.querySelector('#menubutton').getAttribute('aria-expanded'),
    ).to.equal('true')
    el.toggleDrawer()
    await el.updateComplete
    expect(
      sr.querySelector('#menubutton').getAttribute('aria-expanded'),
    ).to.equal('false')
  })
})

describe('learn-two-theme drawer toggling', () => {
  it('opens the drawer from the menu button', async () => {
    const el = await fixture(html`<learn-two-theme></learn-two-theme>`)
    await el.updateComplete
    el.shadowRoot.querySelector('#menubutton').click()
    await el.updateComplete
    expect(el.opened).to.be.true
    expect(el.hasAttribute('opened')).to.be.true
    expect(el.shadowRoot.querySelector('#drawer').classList.contains('opened'))
      .to.be.true
    expect(
      el.shadowRoot.querySelector('.scrim').classList.contains('opened'),
    ).to.be.true
    expect(
      el.shadowRoot.querySelector('#menubutton').getAttribute('aria-expanded'),
    ).to.equal('true')
  })

  it('toggles the drawer closed from the second button', async () => {
    const el = await fixture(html`<learn-two-theme></learn-two-theme>`)
    await el.updateComplete
    el.shadowRoot.querySelector('#menubutton').click()
    await el.updateComplete
    el.shadowRoot.querySelector('#menubutton2').click()
    await el.updateComplete
    expect(el.opened).to.be.false
    expect(el.hasAttribute('opened')).to.be.false
    expect(
      el.shadowRoot.querySelector('#drawer').classList.contains('opened'),
    ).to.be.false
    expect(
      el.shadowRoot.querySelector('#menubutton').getAttribute('aria-expanded'),
    ).to.equal('false')
  })

  it('closes the drawer from the scrim', async () => {
    const el = await fixture(html`<learn-two-theme></learn-two-theme>`)
    await el.updateComplete
    el.toggleDrawer()
    await el.updateComplete
    expect(el.opened).to.be.true
    el.shadowRoot.querySelector('.scrim').click()
    await el.updateComplete
    expect(el.opened).to.be.false
    expect(
      el.shadowRoot.querySelector('.scrim').classList.contains('opened'),
    ).to.be.false
  })
})

describe('learn-two-theme edit mode', () => {
  it('disables interactive controls in edit mode', async () => {
    const el = await fixture(html`<learn-two-theme></learn-two-theme>`)
    await el.updateComplete
    expect(
      el.shadowRoot.querySelector('#drawer site-title').hasAttribute(
        'disabled',
      ),
    ).to.be.false
    el.editMode = true
    await el.updateComplete
    expect(
      el.shadowRoot.querySelector('#drawer site-title').hasAttribute(
        'disabled',
      ),
    ).to.be.true
    expect(
      el.shadowRoot.querySelector('#drawer site-modal').hasAttribute(
        'disabled',
      ),
    ).to.be.true
    expect(
      el.shadowRoot.querySelector('#drawer site-print-button').hasAttribute(
        'disabled',
      ),
    ).to.be.true
    expect(
      el.shadowRoot.querySelector('#drawer site-rss-button').hasAttribute(
        'disabled',
      ),
    ).to.be.true
    // slot content is hidden while editing
    expect(
      getComputedStyle(el.shadowRoot.querySelector('#slot')).display,
    ).to.equal('none')
    el.editMode = false
    await el.updateComplete
    expect(
      el.shadowRoot.querySelector('#drawer site-title').hasAttribute(
        'disabled',
      ),
    ).to.be.false
  })
})

describe('learn-two-theme responsive sizes', () => {
  it('hides the breadcrumb on xs/sm and shows it on larger sizes', async () => {
    const el = await fixture(html`<learn-two-theme></learn-two-theme>`)
    await el.updateComplete
    // responsiveSize is not a declared Lit property in this theme's mixin
    // chain (no HAXCMSMobileMenuMixin here), so the responsive CSS is driven
    // through the reflected attribute directly
    el.setAttribute('responsive-size', 'xs')
    await el.updateComplete
    expect(
      getComputedStyle(el.shadowRoot.querySelector('site-breadcrumb')).display,
    ).to.equal('none')
    el.setAttribute('responsive-size', 'lg')
    await el.updateComplete
    expect(
      getComputedStyle(el.shadowRoot.querySelector('site-breadcrumb')).display,
    ).to.not.equal('none')
  })
})

describe('learn-two-theme search modal wiring', () => {
  it('siteModalClick focuses the search field via the modal singleton', async function () {
    // the dynamic import inside siteModalClick pulls a large module graph on
    // first load, which can exceed mocha's default per-test timeout
    this.timeout(10000)
    // pre-warm the dynamic import target so the modal-click handler resolves
    // from cache while the fake singleton is installed
    await import(
      '@haxtheweb/haxcms-elements/lib/ui-components/site/site-search.js',
    )
    const el = await fixture(html`<learn-two-theme></learn-two-theme>`)
    await el.updateComplete
    const originalSimpleModal = globalThis.SimpleModal
    const fakeInput = {
      focused: false,
      focus() {
        this.focused = true
      },
    }
    globalThis.SimpleModal = fakeSimpleModalReturning(fakeInput)
    try {
      const modal = el.shadowRoot.querySelector('site-modal')
      expect(modal).to.exist
      modal.dispatchEvent(new CustomEvent('site-modal-click'))
      const focused = await waitFor(() => fakeInput.focused === true)
      expect(focused).to.be.true
    } finally {
      globalThis.SimpleModal = originalSimpleModal
    }
  })
})
