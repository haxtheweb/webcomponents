// store-driven search wiring, route seeding, print fallback, and palette
// declaration tests for clean-one (complements clean-one.test.js)
globalThis.process = globalThis.process || {
  env: {
    NODE_ENV: 'development',
  },
}
import { fixture, expect, html } from '@open-wc/testing'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'
import { MicroFrontendRegistry } from '@haxtheweb/micro-frontend-registry/micro-frontend-registry.js'
import { CleanOne } from '../clean-one.js'
import '../lib/clean-one-search-box.js'
import { CleanOneSearchBox } from '../lib/clean-one-search-box.js'

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

describe('clean-one theme metadata', () => {
  it('declares supported palettes 4 and 5', () => {
    expect(CleanOne.supportedPalettes).to.deep.equal(['4', '5'])
  })

  it('defaults dataPalette to 5 (Monotone)', async () => {
    const el = await fixture(html`<clean-one></clean-one>`)
    expect(el.dataPalette).to.equal(5)
    expect(el.getAttribute('data-palette')).to.equal('5')
  })
})

// direct lib-file coverage (invisible-lib rule): the search box is exercised
// on its own, not only as a child of the theme
describe('clean-one-search-box', () => {
  it('registers as a custom element', async () => {
    const box = await fixture(
      html`<clean-one-search-box></clean-one-search-box>`,
    )
    expect(box.tagName).to.equal('CLEAN-ONE-SEARCH-BOX')
    expect(box instanceof CleanOneSearchBox).to.be.true
    expect(box.value).to.equal('')
  })

  it('renders a labelled text input with i18n strings', async () => {
    const box = await fixture(
      html`<clean-one-search-box></clean-one-search-box>`,
    )
    const input = box.shadowRoot.querySelector('input')
    expect(input.type).to.equal('text')
    expect(input.getAttribute('aria-label')).to.equal('Search site content')
    expect(input.getAttribute('placeholder')).to.equal('Type to search')
    expect(input.value).to.equal('')
  })

  it('delegates focus() and select() to the inner input', async () => {
    const box = await fixture(
      html`<clean-one-search-box></clean-one-search-box>`,
    )
    const input = box.shadowRoot.querySelector('input')
    let focused = false
    let selected = false
    input.focus = () => {
      focused = true
    }
    input.select = () => {
      selected = true
    }
    box.focus()
    box.select()
    expect(focused).to.be.true
    expect(selected).to.be.true
  })

  it('dispatches a non-bubbling input-changed with the live value', async () => {
    const box = await fixture(
      html`<clean-one-search-box></clean-one-search-box>`,
    )
    let captured = 'unset'
    let bubbles = 'unset'
    box.addEventListener('input-changed', (e) => {
      captured = e.detail.value
      bubbles = String(e.bubbles)
    })
    const input = box.shadowRoot.querySelector('input')
    input.value = 'web components'
    box.searchChanged(new Event('input'))
    expect(captured).to.equal('web components')
    expect(bubbles).to.equal('false')
  })

  it('reflects a value binding onto the input', async () => {
    const box = await fixture(
      html`<clean-one-search-box value="hax"></clean-one-search-box>`,
    )
    expect(box.shadowRoot.querySelector('input').value).to.equal('hax')
  })
})

describe('clean-one search wiring', () => {
  it('sets searchTerm from search box input (site-search module loads)', async () => {
    const el = await fixture(html`<clean-one></clean-one>`)
    const box = el.shadowRoot.querySelector('clean-one-search-box')
    const input = box.shadowRoot.querySelector('input')
    input.value = 'coverage'
    input.dispatchEvent(new Event('input'))
    // truthy branch dynamic-imports site-search then sets searchTerm
    const settled = await waitFor(() => el.searchTerm === 'coverage')
    expect(settled).to.be.true
  })

  it('clears searchTerm when the search box reports an empty value', async () => {
    const el = await fixture(html`<clean-one></clean-one>`)
    el.searchTerm = 'leftover'
    const box = el.shadowRoot.querySelector('clean-one-search-box')
    box.dispatchEvent(
      new CustomEvent('input-changed', { detail: { value: '' } }),
    )
    expect(el.searchTerm).to.equal('')
  })

  it('hides page title / tags / breadcrumb while a search term is active', async () => {
    const el = await fixture(html`<clean-one></clean-one>`)
    el.searchTerm = 'coverage'
    await el.updateComplete
    expect(
      el.shadowRoot.querySelector('#contentcontainer').hasAttribute('hidden'),
    ).to.be.true
    expect(
      el.shadowRoot.querySelector('site-search').hasAttribute('hidden'),
    ).to.be.false
    el.searchTerm = ''
    await el.updateComplete
    expect(
      el.shadowRoot.querySelector('#contentcontainer').hasAttribute('hidden'),
    ).to.be.false
  })
})

describe('clean-one search route seeding', () => {
  it('seeds searchTerm from a displays/search route with ?search=', async () => {
    const originalGetInternalRoute = store.getInternalRoute
    const originalLocation = store.currentRouterLocation
    store.getInternalRoute = () => 'displays/search'
    store.currentRouterLocation = {
      pathname: '/x/displays/search',
      search: '?search=seeded',
      params: [],
    }
    let el
    try {
      el = await fixture(html`<clean-one></clean-one>`)
      // firstUpdated imports site-search then seeds the term and focuses
      // the search box
      const seeded = await waitFor(() => el.searchTerm === 'seeded')
      expect(seeded).to.be.true
      expect(
        typeof el.shadowRoot.querySelector('clean-one-search-box').focus,
      ).to.equal('function')
    } finally {
      store.getInternalRoute = originalGetInternalRoute
      store.currentRouterLocation = originalLocation
    }
  })

  it('does not seed a term off the search route', async () => {
    const el = await fixture(html`<clean-one></clean-one>`)
    expect(el.searchTerm).to.equal('')
  })
})

describe('clean-one manifest index reaction', () => {
  it('clears searchTerm when the active manifest index changes', async () => {
    const el = await fixture(html`<clean-one></clean-one>`)
    el.searchTerm = 'leftover'
    const originalManifest = store.manifest
    const originalActiveId = store.activeId
    try {
      store.manifest = {
        title: 'Coverage',
        items: [
          { id: 'item-1', title: 'One' },
          { id: 'item-2', title: 'Two' },
        ],
      }
      store.activeId = 'item-1'
      // the constructor autorun skips its very first pass and clears the
      // search term on subsequent activeManifestIndex changes
      let cleared = await waitFor(() => el.searchTerm === '')
      if (!cleared) {
        store.activeId = 'item-2'
        cleared = await waitFor(() => el.searchTerm === '')
      }
      expect(cleared).to.be.true
    } finally {
      store.manifest = originalManifest
      store.activeId = originalActiveId
    }
  })
})

describe('clean-one print button fallback', () => {
  it('renders site-print-button when siteToHtml is not registered', async () => {
    const originalHas = MicroFrontendRegistry.has
    MicroFrontendRegistry.has = () => false
    let el
    try {
      el = await fixture(html`<clean-one></clean-one>`)
      await el.updateComplete
      expect(
        el.shadowRoot.querySelector('.pull-left site-print-button'),
      ).to.exist
    } finally {
      MicroFrontendRegistry.has = originalHas
    }
  })
})

// BUG(clean-one.js:1052-1060) RESOLVED (round 8): prevPage()/nextPage()
// called super.prevPage(e) / super.nextPage(e), but no class in the CleanOne
// mixin chain defines either method, so every invocation threw a TypeError.
// The vestigial hooks were removed (clean-two models prevPage/nextPage as
// label strings instead).
describe('clean-one prev/next hooks (vestigial super calls removed)', () => {
  it('no longer defines prevPage/nextPage methods on the theme', async () => {
    const el = await fixture(html`<clean-one></clean-one>`)
    expect(typeof el.prevPage).to.equal('undefined')
    expect(typeof el.nextPage).to.equal('undefined')
  })
})

// BUG(clean-one.js:730) RESOLVED (round 8): updated() scheduled
// requestAnimationFrame(() => this._syncViewportLayout()) when
// topItems/items/activeLayout changed, but _syncViewportLayout is defined
// nowhere in the CleanOne mixin chain (it is a clean-portfolio-theme method,
// which also declares those three properties). None of
// topItems/items/activeLayout are declared as properties on clean-one, so the
// branch was unreachable via normal bindings and a forced firing would throw
// inside the animation frame. The unreachable scheduling was removed.
describe('clean-one viewport sync branch (unreachable scheduling removed)', () => {
  it('does not define _syncViewportLayout anywhere in the chain', async () => {
    const el = await fixture(html`<clean-one></clean-one>`)
    expect(typeof el._syncViewportLayout).to.equal('undefined')
  })

  it('does not schedule a sync callback when updated sees an items change', async () => {
    const el = await fixture(html`<clean-one></clean-one>`)
    let synced = false
    el._syncViewportLayout = () => {
      synced = true
    }
    el.updated(new Map([['items', [{ id: 'item-1' }]]]))
    await new Promise((resolve) => requestAnimationFrame(() => resolve()))
    expect(synced).to.be.false
  })
})
