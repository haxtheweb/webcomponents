// navigation, search/dark-mode toggles, keyboard handling, and store-driven
// content tests for spacebook-theme (complements spacebook-theme.test.js)
globalThis.process = globalThis.process || {
  env: {
    NODE_ENV: 'development',
  },
}
import { fixture, expect, html } from '@open-wc/testing'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'
import { SpacebookTheme } from '../spacebook-theme.js'

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

describe('spacebook-theme tag and defaults', () => {
  it('registers with the expected tag name', () => {
    expect(SpacebookTheme.tag).to.equal('spacebook-theme')
  })

  it('starts with closed navigation and search', async () => {
    const el = await fixture(html`<spacebook-theme></spacebook-theme>`)
    await el.updateComplete
    expect(el.mobileNavOpen).to.be.false
    expect(el.hasAttribute('mobile-nav-open')).to.be.false
    expect(el.searchOpen).to.be.false
    expect(el.hasAttribute('search-open')).to.be.false
  })
})

describe('spacebook-theme mobile navigation', () => {
  it('toggles the mobile nav from the menu button', async () => {
    const el = await fixture(html`<spacebook-theme></spacebook-theme>`)
    await el.updateComplete
    const btn = el.shadowRoot.querySelector('.mobile-menu-btn')
    expect(btn).to.exist
    expect(btn.getAttribute('aria-controls')).to.equal('sidebar-nav')
    btn.click()
    await el.updateComplete
    expect(el.mobileNavOpen).to.be.true
    expect(el.hasAttribute('mobile-nav-open')).to.be.true
    expect(btn.getAttribute('aria-expanded')).to.equal('true')
    btn.click()
    await el.updateComplete
    expect(el.mobileNavOpen).to.be.false
    expect(el.hasAttribute('mobile-nav-open')).to.be.false
    expect(btn.getAttribute('aria-expanded')).to.equal('false')
  })

  it('closes the mobile nav from the sidebar close button', async () => {
    const el = await fixture(html`<spacebook-theme></spacebook-theme>`)
    await el.updateComplete
    el.toggleMobileNav()
    await el.updateComplete
    expect(el.mobileNavOpen).to.be.true
    const close = el.shadowRoot.querySelector('.sidebar-close-btn')
    expect(close).to.exist
    expect(close.getAttribute('aria-label')).to.equal('Close navigation')
    close.click()
    await el.updateComplete
    expect(el.mobileNavOpen).to.be.false
  })

  it('closes the mobile nav from the overlay', async () => {
    const el = await fixture(html`<spacebook-theme></spacebook-theme>`)
    await el.updateComplete
    el.toggleMobileNav()
    await el.updateComplete
    const overlay = el.shadowRoot.querySelector('.mobile-nav-overlay')
    expect(overlay).to.exist
    expect(overlay.getAttribute('aria-label')).to.equal(
      'Close navigation menu',
    )
    overlay.click()
    await el.updateComplete
    expect(el.mobileNavOpen).to.be.false
  })

  it('closes the mobile nav when Escape is pressed (no keyboard trap)', async () => {
    const el = await fixture(html`<spacebook-theme></spacebook-theme>`)
    await el.updateComplete
    el.toggleMobileNav()
    await el.updateComplete
    expect(el.mobileNavOpen).to.be.true
    globalThis.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape' }),
    )
    await el.updateComplete
    expect(el.mobileNavOpen).to.be.false
  })

  it('ignores Escape when the navigation is already closed', async () => {
    const el = await fixture(html`<spacebook-theme></spacebook-theme>`)
    await el.updateComplete
    globalThis.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape' }),
    )
    await el.updateComplete
    expect(el.mobileNavOpen).to.be.false
    // non-Escape keys never close an open nav either
    el.toggleMobileNav()
    await el.updateComplete
    globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    await el.updateComplete
    expect(el.mobileNavOpen).to.be.true
  })
})

describe('spacebook-theme search and dark mode', () => {
  it('toggles search from the search button', async () => {
    const el = await fixture(html`<spacebook-theme></spacebook-theme>`)
    await el.updateComplete
    const searchBtn = el.shadowRoot.querySelector('site-modal.search-button')
    expect(searchBtn).to.exist
    searchBtn.click()
    await el.updateComplete
    expect(el.searchOpen).to.be.true
    expect(el.hasAttribute('search-open')).to.be.true
    searchBtn.click()
    await el.updateComplete
    expect(el.searchOpen).to.be.false
    expect(el.hasAttribute('search-open')).to.be.false
  })

  it('toggles the store dark mode state', async () => {
    const el = await fixture(html`<spacebook-theme></spacebook-theme>`)
    await el.updateComplete
    const originalDarkMode = store.darkMode
    try {
      el.toggleDarkMode()
      expect(store.darkMode).to.equal(!originalDarkMode)
      el.toggleDarkMode()
      expect(store.darkMode).to.equal(originalDarkMode)
    } finally {
      store.darkMode = originalDarkMode
    }
  })

  it('renders the dark mode toggle only when the system prefers light', async () => {
    const el = await fixture(html`<spacebook-theme></spacebook-theme>`)
    await el.updateComplete
    const toggle = el.shadowRoot.querySelector('.dark-mode-toggle')
    if (el.systemPrefersDark) {
      expect(el.showDarkModeToggle).to.be.false
      expect(toggle).to.be.null
    } else {
      expect(el.showDarkModeToggle).to.be.true
      expect(toggle).to.exist
      expect(toggle.getAttribute('aria-label')).to.equal('Toggle dark mode')
      expect(toggle.getAttribute('title')).to.equal('Toggle dark mode')
    }
  })
})

describe('spacebook-theme prev/next wiring', () => {
  it('captures prev/next labels from label-changed events', async () => {
    const el = await fixture(html`<spacebook-theme></spacebook-theme>`)
    await el.updateComplete
    const next = el.shadowRoot.querySelector('site-menu-button[type="next"]')
    const prev = el.shadowRoot.querySelector('site-menu-button[type="prev"]')
    expect(next).to.exist
    expect(prev).to.exist
    next.dispatchEvent(
      new CustomEvent('label-changed', { detail: { value: 'Chapter Two' } }),
    )
    prev.dispatchEvent(
      new CustomEvent('label-changed', {
        detail: { value: 'Introduction' },
      }),
    )
    expect(el.nextPage).to.equal('Chapter Two')
    expect(el.prevPage).to.equal('Introduction')
    await el.updateComplete
    // labels render into the nav titles once set
    expect(
      el.shadowRoot.querySelector('site-menu-button[type="next"] .nav-title')
        .textContent,
    ).to.equal('Chapter Two')
    expect(
      el.shadowRoot.querySelector('site-menu-button[type="prev"] .nav-title')
        .textContent,
    ).to.equal('Introduction')
  })
})

describe('spacebook-theme store-driven content', () => {
  it('renders the last-updated timestamp and site title from the store', async () => {
    const originalManifest = store.manifest
    const originalActiveId = store.activeId
    try {
      store.manifest = {
        title: 'Coverage',
        description: 'Coverage test site',
        metadata: { site: { name: 'Coverage Site' } },
        items: [
          {
            id: 'item-1',
            title: 'One',
            slug: 'one',
            metadata: { updated: 1717000000 },
          },
        ],
      }
      store.activeId = 'item-1'
      const el = await fixture(html`<spacebook-theme></spacebook-theme>`)
      const stamped = await waitFor(() => {
        return el.shadowRoot.querySelector('.page-meta-item time')
      })
      expect(stamped).to.be.true
      const time = el.shadowRoot.querySelector('.page-meta-item time')
      expect(time.getAttribute('datetime')).to.equal(
        new Date(1717000000 * 1000).toISOString(),
      )
      // site title and subtitle flow from the manifest metadata
      const settledTitle = await waitFor(() => {
        return el.shadowRoot.querySelector('.site-title').textContent ===
          'Coverage Site'
      })
      expect(settledTitle).to.be.true
      expect(
        el.shadowRoot.querySelector('.site-subtitle').textContent,
      ).to.equal('Coverage test site')
    } finally {
      store.manifest = originalManifest
      store.activeId = originalActiveId
    }
  })
})
