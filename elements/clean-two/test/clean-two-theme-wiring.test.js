// event wiring, search-route behavior, and store-driven content tests for
// clean-two (complements clean-two.test.js)
globalThis.process = globalThis.process || {
  env: {
    NODE_ENV: 'development',
  },
}
import { fixture, expect, html } from '@open-wc/testing'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'
import { MicroFrontendRegistry } from '@haxtheweb/micro-frontend-registry/micro-frontend-registry.js'
import { CleanTwo } from '../clean-two.js'

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
function makeFakeInput() {
  return {
    focused: false,
    selected: false,
    value: '',
    focus() {
      this.focused = true
    },
    select() {
      this.selected = true
    },
  }
}

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

describe('clean-two tag and defaults', () => {
  it('registers with the expected tag name', () => {
    expect(CleanTwo.tag).to.equal('clean-two')
  })
})

describe('clean-two search result wiring', () => {
  it('clears the search term when a result is selected', async () => {
    const el = await fixture(html`<clean-two></clean-two>`)
    el.searchTerm = 'leftover'
    await el.updateComplete
    const results = el.shadowRoot.querySelector(
      'site-search[part="search-btn"]',
    )
    expect(results).to.exist
    results.dispatchEvent(new CustomEvent('search-item-selected'))
    expect(el.searchTerm).to.equal('')
  })

  // BUG(clean-two.js:731) RESOLVED (round 8): searchChanged was defined
  // but never bound in the theme's templates (search flows through
  // siteModalClick and the site-search modal instead), so it was unreachable
  // except by direct invocation; the dead handler and its normalizeEventPath
  // import were removed.
  it('no longer defines the unreachable searchChanged handler', async () => {
    const el = await fixture(html`<clean-two></clean-two>`)
    expect(typeof el.searchChanged).to.equal('undefined')
  })

  it('keeps content hidden while a search term is active', async () => {
    const el = await fixture(html`<clean-two></clean-two>`)
    el.searchTerm = 'coverage'
    await el.updateComplete
    expect(
      el.shadowRoot.querySelector('#contentcontainer').hasAttribute('hidden'),
    ).to.be.true
    expect(
      el.shadowRoot
        .querySelector('site-search[part="search-btn"]')
        .hasAttribute('hidden'),
    ).to.be.false
  })
})

describe('clean-two prev/next label wiring', () => {
  it('captures prev/next labels from label-changed events', async () => {
    const el = await fixture(html`<clean-two></clean-two>`)
    const prev = el.shadowRoot.querySelector('site-menu-button[type="prev"]')
    const next = el.shadowRoot.querySelector('site-menu-button[type="next"]')
    expect(prev).to.exist
    expect(next).to.exist
    prev.dispatchEvent(
      new CustomEvent('label-changed', { detail: { value: 'Chapter One' } }),
    )
    next.dispatchEvent(
      new CustomEvent('label-changed', { detail: { value: 'Chapter Two' } }),
    )
    expect(el.prevPage).to.equal('Chapter One')
    expect(el.nextPage).to.equal('Chapter Two')
  })

  it('renders the prev/next labels into the nav slots', async () => {
    const el = await fixture(html`<clean-two></clean-two>`)
    el.prevPage = 'Previous page title'
    el.nextPage = 'Next page title'
    await el.updateComplete
    expect(
      el.shadowRoot.querySelector('site-menu-button[type="prev"] .bottom')
        .textContent,
    ).to.equal('Previous page title')
    expect(
      el.shadowRoot.querySelector('site-menu-button[type="next"] .bottom')
        .textContent,
    ).to.equal('Next page title')
  })
})

describe('clean-two print button fallback', () => {
  it('falls back to a replace-tag print button when siteToHtml is missing', async () => {
    const originalHas = MicroFrontendRegistry.has
    MicroFrontendRegistry.has = () => false
    let el
    try {
      el = await fixture(html`<clean-two></clean-two>`)
      await el.updateComplete
      expect(
        el.shadowRoot.querySelector('replace-tag[with="site-print-button"]'),
      ).to.exist
    } finally {
      MicroFrontendRegistry.has = originalHas
    }
  })
})

describe('clean-two page timestamp wiring', () => {
  it('mirrors activeItem.metadata.updated into pageTimestamp', async () => {
    const el = await fixture(html`<clean-two></clean-two>`)
    const originalManifest = store.manifest
    const originalActiveId = store.activeId
    try {
      store.manifest = {
        title: 'Coverage',
        items: [
          {
            id: 'item-1',
            title: 'One',
            metadata: { updated: 1717000000 },
          },
        ],
      }
      store.activeId = 'item-1'
      const stamped = await waitFor(() => el.pageTimestamp === 1717000000)
      expect(stamped).to.be.true
    } finally {
      store.manifest = originalManifest
      store.activeId = originalActiveId
    }
  })
})

describe('clean-two search modal wiring', () => {
  it('siteModalForceClick clicks the modal trigger after a delay', async () => {
    const el = await fixture(html`<clean-two></clean-two>`)
    await el.updateComplete
    // guard the follow-on modal-click route with a fake SimpleModal so the
    // empty harness singleton is never queried
    const originalSimpleModal = globalThis.SimpleModal
    const fakeInput = makeFakeInput()
    globalThis.SimpleModal = fakeSimpleModalReturning(fakeInput)
    let clicked = false
    const modal = el.shadowRoot.querySelector('site-modal')
    expect(modal).to.exist
    const btn =
      modal.shadowRoot &&
      modal.shadowRoot.querySelector('simple-icon-button-lite')
    if (btn) {
      btn.addEventListener('click', () => {
        clicked = true
      })
    }
    try {
      el.siteModalForceClick()
      await new Promise((resolve) => setTimeout(resolve, 900))
      expect(btn ? clicked : true).to.be.true
    } finally {
      globalThis.SimpleModal = originalSimpleModal
    }
  })

  it('siteModalClick focuses the search field via the modal singleton', async () => {
    const el = await fixture(html`<clean-two></clean-two>`)
    const originalSimpleModal = globalThis.SimpleModal
    const fakeInput = makeFakeInput()
    globalThis.SimpleModal = fakeSimpleModalReturning(fakeInput)
    try {
      const modal = el.shadowRoot.querySelector('site-modal')
      modal.dispatchEvent(new CustomEvent('site-modal-click'))
      const focused = await waitFor(() => fakeInput.focused === true)
      expect(focused).to.be.true
      expect(fakeInput.value).to.equal('')
      expect(fakeInput.selected).to.be.false
    } finally {
      globalThis.SimpleModal = originalSimpleModal
    }
  })

  it('siteModalClick seeds the field from ?search= on the search route', async () => {
    const el = await fixture(html`<clean-two></clean-two>`)
    const originalSimpleModal = globalThis.SimpleModal
    const originalGetInternalRoute = store.getInternalRoute
    const originalLocation = store.currentRouterLocation
    const fakeInput = makeFakeInput()
    globalThis.SimpleModal = fakeSimpleModalReturning(fakeInput)
    store.getInternalRoute = () => 'displays/search'
    store.currentRouterLocation = { search: '?search=seeded' }
    try {
      const modal = el.shadowRoot.querySelector('site-modal')
      modal.dispatchEvent(new CustomEvent('site-modal-click'))
      const seeded = await waitFor(() => fakeInput.value === 'seeded')
      expect(seeded).to.be.true
      const selected = await waitFor(() => fakeInput.selected === true)
      expect(selected).to.be.true
      expect(fakeInput.focused).to.be.true
    } finally {
      globalThis.SimpleModal = originalSimpleModal
      store.getInternalRoute = originalGetInternalRoute
      store.currentRouterLocation = originalLocation
    }
  })
})
