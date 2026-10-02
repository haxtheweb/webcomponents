import { fixture, expect, html } from '@open-wc/testing'
import sinon from 'sinon'

import '../lunr-search.js'

const settle = (ms = 100) => new Promise((r) => setTimeout(r, ms))

const waitFor = async (fn, ms = 1500) => {
  const start = Date.now()
  while (Date.now() - start < ms) {
    if (fn()) return true
    await settle(50)
  }
  return fn()
}

const DATA = [
  { id: 0, Title: 'Alpha widget', description: 'first item about widgets' },
  { id: 1, Title: 'Beta gadget', description: 'the golden fleece adventure' },
  { id: 2, Title: 'Gamma thing', description: 'third item about things' },
]

// Behavioral coverage for lunr-search: lunr loading through
// es-global-bridge, index creation (explicit and auto-discovered
// fields), search with minScore/limit, stop-word fallback, demo
// rendering, and the dataSource fetch flow (fetch stubbed).
describe('lunr-search behaviors', () => {
  it('registers the custom element', () => {
    expect(globalThis.customElements.get('lunr-search')).to.exist
  })

  it('loads lunr through the es-global-bridge and reports readiness', async () => {
    const el = await fixture(html`<lunr-search></lunr-search>`)
    expect(el.basePath).to.equal('/node_modules/')
    const loaded = await waitFor(() => el.__lunrLoaded === true)
    expect(loaded).to.equal(true)
    expect(
      globalThis.ESGlobalBridge.requestAvailability().imports['lunr'],
    ).to.equal(true)
  })

  it('builds an index from data and explicit fields and searches it', async () => {
    const el = await fixture(html`<lunr-search></lunr-search>`)
    await waitFor(() => el.__lunrLoaded === true)
    el.data = DATA
    el.fields = ['Title', 'description']
    await waitFor(() => el.index !== undefined && el.index !== null)
    el.search = 'widget'
    await waitFor(() => (el.results || []).length > 0)
    expect(el.results.length).to.equal(1)
    expect(el.results[0].Title).to.equal('Alpha widget')
  })

  it('discovers fields automatically when none are supplied', async () => {
    const el = await fixture(html`<lunr-search></lunr-search>`)
    await waitFor(() => el.__lunrLoaded === true)
    el.data = DATA
    await waitFor(() => el.index !== undefined && el.index !== null)
    // auto-discovered fields are published back on the element
    expect(el.fields).to.include('Title')
    expect(el.fields).to.include('description')
    el.search = 'gadget'
    await waitFor(() => (el.results || []).length > 0)
    expect(el.results[0].Title).to.equal('Beta gadget')
  })

  it('the no-stop-word fallback index matches stop-word queries', async () => {
    const el = await fixture(html`<lunr-search></lunr-search>`)
    await waitFor(() => el.__lunrLoaded === true)
    el.data = DATA
    el.fields = ['Title', 'description']
    await waitFor(() => el.index !== undefined && el.index !== null)
    // 'the' is stripped from the primary index's DOCUMENTS by the stop
    // word filter, so the fallback index is created; pipeline.remove(
    // lunr.stopWordFilter) now runs BEFORE add() (haxtheweb/issues#3102)
    // so the fallback documents keep 'the' and the query matches
    el.search = 'the'
    await waitFor(() => (el.results || []).length > 0)
    expect(
      el.indexNoStopWords !== undefined && el.indexNoStopWords !== null,
    ).to.equal(true)
    expect(el.results.length).to.equal(1)
    expect(el.results[0].Title).to.equal('Beta gadget')
  })

  it('applies minScore to filter out low-scoring matches', async () => {
    const el = await fixture(html`<lunr-search></lunr-search>`)
    await waitFor(() => el.__lunrLoaded === true)
    el.data = DATA
    el.fields = ['Title', 'description']
    await waitFor(() => el.index !== undefined && el.index !== null)
    el.search = 'widget'
    await waitFor(() => (el.results || []).length > 0)
    // a minScore above any achievable score empties the results
    el.minScore = 100
    await waitFor(() => (el.results || []).length === 0)
    expect(el.results.length).to.equal(0)
    // and a tiny minScore keeps them
    el.minScore = 0.001
    await waitFor(() => (el.results || []).length > 0)
    expect(el.results.length).to.equal(1)
  })

  it('applies the limit to cap the number of results', async () => {
    const el = await fixture(html`<lunr-search></lunr-search>`)
    await waitFor(() => el.__lunrLoaded === true)
    // items sharing a common indexed word return multiple hits
    const data = [
      { id: 0, Title: 'alpha stone', description: 'one' },
      { id: 1, Title: 'beta stone', description: 'two' },
      { id: 2, Title: 'gamma stone', description: 'three' },
    ]
    el.data = data
    el.fields = ['Title', 'description']
    await waitFor(() => el.index !== undefined && el.index !== null)
    el.search = 'stone'
    await waitFor(() => (el.results || []).length === 3)
    expect(el.results.length).to.equal(3)
    el.limit = 1
    await waitFor(() => (el.results || []).length === 1)
    expect(el.results.length).to.equal(1)
  })

  it('returns an empty array for non-matching and empty-string searches', async () => {
    const el = await fixture(html`<lunr-search></lunr-search>`)
    await waitFor(() => el.__lunrLoaded === true)
    el.data = DATA
    el.fields = ['Title', 'description']
    await waitFor(() => el.index !== undefined && el.index !== null)
    // a real term with no matches runs both passes and returns []
    el.search = 'zzzqqq'
    await waitFor(() => Array.isArray(el.results))
    expect(el.results).to.deep.equal([])
    // an explicit empty-string search now reports [] rather than
    // undefined (haxtheweb/issues#3102); null/undefined search still
    // returns undefined (see the guard clause test below)
    el.search = ''
    await settle(150)
    expect(el.results).to.deep.equal([])
  })

  it('matches string ids when fields exclude id', async () => {
    const el = await fixture(html`<lunr-search></lunr-search>`)
    await waitFor(() => el.__lunrLoaded === true)
    // demo/lunrSearchIndex.json-style data with string ids
    const data = [
      { id: 'welcome', Title: 'Alpha widget', description: 'first item' },
    ]
    el.data = data
    el.fields = ['Title', 'description']
    await waitFor(() => el.index !== undefined && el.index !== null)
    el.search = 'alpha'
    await waitFor(() => (el.results || []).length === 1)
    // _createIndex now indexes items under the data's own id when
    // present (haxtheweb/issues#3102), so searched() ref matching
    // resolves the item instead of pushing undefined
    expect(el.results.length).to.equal(1)
    expect(el.results[0].id).to.equal('welcome')
    expect(el.results[0].Title).to.equal('Alpha widget')
  })

  it('searched() guard clauses return undefined without data or search', async () => {
    const el = await fixture(html`<lunr-search></lunr-search>`)
    await waitFor(() => el.__lunrLoaded === true)
    el.data = DATA
    el.fields = ['Title', 'description']
    await waitFor(() => el.index !== undefined && el.index !== null)
    expect(el.searched(null, 'widget', el.index, 0, 500)).to.equal(undefined)
    expect(el.searched(DATA, null, el.index, 0, 500)).to.equal(undefined)
    expect(el.searched(DATA, 'widget', null, 0, 500)).to.equal(undefined)
  })

  it('_createIndex returns undefined when lunr is not ready or data empty', async () => {
    const el = await fixture(html`<lunr-search></lunr-search>`)
    expect(el._createIndex(DATA, ['Title'], false, false)).to.equal(undefined)
    expect(el._createIndex([], ['Title'], false, true)).to.equal(undefined)
    expect(el._createIndex(null, ['Title'], false, true)).to.equal(undefined)
    await waitFor(() => el.__lunrLoaded === true)
    expect(typeof el._createIndex(DATA, ['Title'], false, true)).to.equal(
      'object',
    )
  })

  it('_createIndex skips long single-word field values', async () => {
    const el = await fixture(html`<lunr-search></lunr-search>`)
    await waitFor(() => el.__lunrLoaded === true)
    // values that are one word and longer than 30 chars are dropped
    const longData = [
      {
        id: 0,
        Title: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        description: 'x',
      },
    ]
    const explicitIndex = el._createIndex(
      longData,
      ['Title', 'description'],
      false,
      true,
    )
    expect(typeof explicitIndex).to.equal('object')
    const autoIndex = el._createIndex(longData, [], false, true)
    expect(typeof autoIndex).to.equal('object')
    // noStopWords pipeline removal also runs in the auto-discover branch
    const autoNoStop = el._createIndex(longData, [], true, true)
    expect(typeof autoNoStop).to.equal('object')
  })

  it('renders demo results as an aria-live list with titles and descriptions', async () => {
    const el = await fixture(html`<lunr-search demo></lunr-search>`)
    await waitFor(() => el.__lunrLoaded === true)
    // render() reads item.title / item.description directly, so the
    // data fields need those exact names
    const data = [
      { id: 0, title: 'Alpha widget', description: 'first item about widgets' },
      { id: 1, title: 'Beta gadget', description: 'second item about gadgets' },
    ]
    el.data = data
    el.fields = ['title', 'description']
    await waitFor(() => el.index !== undefined && el.index !== null)
    el.search = 'widget'
    await waitFor(() => (el.results || []).length > 0)
    await el.updateComplete
    // list semantics + aria-live for result updates, no more
    // h2-per-result breaking the heading hierarchy
    // (haxtheweb/issues#3102 a11y follow-up)
    const live = el.shadowRoot.querySelector('div.results')
    expect(live).to.exist
    expect(live.getAttribute('aria-live')).to.equal('polite')
    const list = el.shadowRoot.querySelector('ul')
    expect(list).to.exist
    expect(list.getAttribute('aria-label')).to.equal('Search results')
    const items = el.shadowRoot.querySelectorAll('li')
    expect(items.length).to.equal(1)
    const title = items[0].querySelector('.result-title')
    expect(title).to.exist
    expect(title.textContent.trim()).to.equal('Alpha widget')
    const p = items[0].querySelector('p')
    expect(p).to.exist
    expect(p.textContent.trim()).to.contain('first item about widgets')
    expect(el.shadowRoot.querySelector('h2')).to.equal(null)
    // demo reflects to an attribute
    expect(el.hasAttribute('demo')).to.equal(true)
  })

  it('does not render result markup when demo is off', async () => {
    const el = await fixture(html`<lunr-search></lunr-search>`)
    await waitFor(() => el.__lunrLoaded === true)
    el.data = DATA
    el.fields = ['Title', 'description']
    await waitFor(() => el.index !== undefined && el.index !== null)
    el.search = 'widget'
    await waitFor(() => (el.results || []).length > 0)
    await el.updateComplete
    expect(el.shadowRoot.querySelector('ul')).to.equal(null)
    expect(el.shadowRoot.querySelector('div.results')).to.equal(null)
  })

  it('fetches the dataSource and dispatches change notifications', async () => {
    const el = await fixture(html`<lunr-search></lunr-search>`)
    await waitFor(() => el.__lunrLoaded === true)
    const calls = []
    const realFetch = globalThis.fetch
    globalThis.fetch = async (url, options) => {
      calls.push({ url, options })
      return {
        ok: true,
        json: async () => [
          { id: 0, Title: 'Fetched thing', description: 'from the stub' },
        ],
      }
    }
    const events = []
    const dataHandler = (e) => events.push(['data', e.detail.value])
    const searchHandler = (e) => events.push(['search', e.detail.value])
    const resultsHandler = (e) => events.push(['results', e.detail.value])
    el.addEventListener('data-changed', dataHandler)
    el.addEventListener('search-changed', searchHandler)
    el.addEventListener('results-changed', resultsHandler)
    try {
      el.dataSource = 'stub://search-index.json'
      await waitFor(() => Array.isArray(el.data) && el.data.length > 0)
      expect(calls.length).to.equal(1)
      expect(calls[0].url).to.equal('stub://search-index.json')
      expect(calls[0].options.method).to.equal('GET')
      expect(el.__auto).to.equal(true)
      expect(el.data[0].Title).to.equal('Fetched thing')
      el.search = 'fetched'
      await waitFor(() => (el.results || []).length > 0)
      expect(el.results[0].Title).to.equal('Fetched thing')
      const kinds = events.map((x) => x[0])
      expect(kinds).to.include('data')
      expect(kinds).to.include('search')
      expect(kinds).to.include('results')
    } finally {
      globalThis.fetch = realFetch
      el.removeEventListener('data-changed', dataHandler)
      el.removeEventListener('search-changed', searchHandler)
      el.removeEventListener('results-changed', resultsHandler)
    }
  })

  it('ignores a failed dataSource response', async () => {
    const el = await fixture(html`<lunr-search></lunr-search>`)
    await waitFor(() => el.__lunrLoaded === true)
    const realFetch = globalThis.fetch
    globalThis.fetch = async () => ({ ok: false })
    try {
      el.dataSource = 'stub://missing.json'
      await settle(300)
      expect(el.data).to.equal(undefined)
    } finally {
      globalThis.fetch = realFetch
    }
  })

  it('warns when the dataSource json is not an array', async () => {
    const warnSpy = sinon.spy(console, 'warn')
    const el = await fixture(html`<lunr-search></lunr-search>`)
    await waitFor(() => el.__lunrLoaded === true)
    const realFetch = globalThis.fetch
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({ notAnArray: true }),
    })
    try {
      el.dataSource = 'stub://not-array.json'
      await settle(300)
      expect(el.data).to.equal(undefined)
      expect(warnSpy.called).to.equal(true)
    } finally {
      globalThis.fetch = realFetch
      warnSpy.restore()
    }
  })

  it('computes a module-relative basePath when WCGlobalBasePath is unset', async () => {
    const el = await fixture(html`<lunr-search></lunr-search>`)
    // ensure lunr finished loading so the extra constructor below cannot
    // re-register the bridge import with the fallback location
    await waitFor(() => el.__lunrLoaded === true)
    const saved = globalThis.WCGlobalBasePath
    delete globalThis.WCGlobalBasePath
    try {
      const el2 = globalThis.document.createElement('lunr-search')
      expect(el2.basePath.endsWith('/../../../')).to.equal(true)
      expect(el2.basePath).to.contain('lunr-search.js')
      // constructor short-circuits __lunrLoaded when the import is done
      const shortcut = await waitFor(() => el2.__lunrLoaded === true, 500)
      expect(shortcut).to.equal(true)
    } finally {
      globalThis.WCGlobalBasePath = saved
    }
  })

  it('notifies noStopWords changes', async () => {
    const el = await fixture(html`<lunr-search></lunr-search>`)
    const events = []
    const handler = (e) => events.push(e.detail.value)
    el.addEventListener('no-stop-words-changed', handler)
    el.noStopWords = true
    await settle(50)
    expect(events[0]).to.equal(true)
    el.removeEventListener('no-stop-words-changed', handler)
  })

  it('passes the a11y audit after results render, including a title-less item', async () => {
    const el = await fixture(html`<lunr-search demo></lunr-search>`)
    await waitFor(() => el.__lunrLoaded === true)
    const data = [
      { id: 0, title: 'Alpha widget', description: 'first item about widgets' },
      // item without a title: render() guards item.title so no empty
      // heading/title renders (haxtheweb/issues#3102 empty-heading fix)
      { id: 1, description: 'second item matches widgets but has no title' },
    ]
    el.data = data
    el.fields = ['title', 'description']
    await waitFor(() => el.index !== undefined && el.index !== null)
    el.search = 'widget'
    await waitFor(() => (el.results || []).length === 2)
    await el.updateComplete
    const items = el.shadowRoot.querySelectorAll('li')
    expect(items.length).to.equal(2)
    const titleless = [...items].find(
      (li) => li.querySelector('.result-title') === null,
    )
    expect(titleless !== undefined).to.equal(true)
    expect(titleless.textContent).to.contain('no title')
    await expect(el).shadowDom.to.be.accessible()
  })
})
