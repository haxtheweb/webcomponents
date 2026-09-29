import { expect } from '@open-wc/testing'
import { I18NManager, I18NManagerStore } from '../i18n-manager.js'

// stub/restore pattern for the global I18NManagerStore singleton
// (mirrors test/i18n-manager.test.js)
function snapshotStore(store) {
  return {
    elements: store.elements.slice(),
    locales: new Set(store.locales),
    fetchTargets: Object.assign({}, store.fetchTargets),
    lang: store.lang,
    dir: store.dir,
    translationManifest: store.translationManifest,
    manifestLoaded: store.manifestLoaded,
    manifestLoading: store.manifestLoading,
    __ready: store.__ready,
  }
}

function restoreStore(store, snap) {
  store.elements = snap.elements
  store.locales = snap.locales
  store.fetchTargets = snap.fetchTargets
  store.lang = snap.lang
  store.dir = snap.dir
  store.translationManifest = snap.translationManifest
  store.manifestLoaded = snap.manifestLoaded
  store.manifestLoading = snap.manifestLoading
  store.__ready = snap.__ready
  if (store._debounce) {
    clearTimeout(store._debounce)
    store._debounce = null
  }
}

function makeFetchMock(manifestData) {
  const calls = []
  const fn = async (url) => {
    calls.push(url)
    if (url.indexOf('translation-manifest.json') !== -1) {
      return { ok: true, json: async () => ({ manifest: manifestData }) }
    }
    return { ok: true, json: async () => ({ hello: 'translated' }) }
  }
  fn.calls = calls
  return fn
}

async function nextTick() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

describe('i18n-manager edge cases', () => {
  let storeSnap
  let originalFetch
  let fetchMock

  beforeEach(() => {
    storeSnap = snapshotStore(I18NManagerStore)
    I18NManagerStore.elements = []
    I18NManagerStore.locales = new Set([])
    I18NManagerStore.fetchTargets = {}
    I18NManagerStore.translationManifest = null
    I18NManagerStore.manifestLoaded = false
    I18NManagerStore.manifestLoading = false
    originalFetch = globalThis.fetch
    fetchMock = makeFetchMock({
      'mb-el2': ['es'],
      'mb-base': ['es'],
      'mb-cached': ['es'],
    })
    globalThis.fetch = fetchMock
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
    restoreStore(I18NManagerStore, storeSnap)
  })

  it('documentLang falls back to en when nothing is set', () => {
    const html = globalThis.document.documentElement
    const body = globalThis.document.body
    const saved = {}
    ;['lang', 'xml:lang'].forEach((a) => {
      saved['html' + a] = html.getAttribute(a)
      saved['body' + a] = body.getAttribute(a)
      html.removeAttribute(a)
      body.removeAttribute(a)
    })
    // remove the own-property language override if a previous test left one
    delete globalThis.navigator.language
    Object.defineProperty(globalThis.navigator, 'language', {
      value: undefined,
      configurable: true,
    })
    expect(I18NManagerStore.documentLang).to.equal('en')
    delete globalThis.navigator.language
    ;['lang', 'xml:lang'].forEach((a) => {
      if (saved['html' + a] !== null) {
        html.setAttribute(a, saved['html' + a])
      }
      if (saved['body' + a] !== null) {
        body.setAttribute(a, saved['body' + a])
      }
    })
  })

  it('survives a failing MutationObserver during connect', () => {
    const origMO = globalThis.MutationObserver
    const origWarn = console.warn
    let warned = false
    console.warn = () => {
      warned = true
    }
    globalThis.MutationObserver = class {
      constructor() {
        throw new Error('observer unavailable')
      }
    }
    // BUG: document.createElement('i18n-manager') throws NotSupportedError
    // ("The result must not have attributes") because the constructor writes
    // the lang/dir attributes through their setters. Construct directly and
    // flip this note once the constructor stops setting attributes.
    const el = new I18NManager()
    document.body.appendChild(el)
    globalThis.MutationObserver = origMO
    console.warn = origWarn
    expect(el.__ready).to.be.true
    expect(el._docObserver).to.equal(undefined)
    expect(warned).to.be.true
    el.remove()
  })

  it('loadNamespaceFile attempts the exact manifest-based file while the manifest is still loading', async () => {
    I18NManagerStore.registerLocalization({
      namespace: 'mb2',
      localesPath: '/loc',
    })
    // manifest load in flight short-circuits, leaving manifestLoaded false
    I18NManagerStore.manifestLoading = true
    const data = await I18NManagerStore.loadNamespaceFile('mb2', 'es')
    expect(data.hello).to.equal('translated')
    expect(
      fetchMock.calls.some((u) => u.includes('/loc/mb2.es.json')),
    ).to.be.true
    // second call is served from the fetch cache without a new request
    const callsBefore = fetchMock.calls.length
    const data2 = await I18NManagerStore.loadNamespaceFile('mb2', 'es')
    expect(data2.hello).to.equal('translated')
    expect(fetchMock.calls.length).to.equal(callsBefore)
  })

  it('updateLanguage logs and skips a broken manifest entry, then falls the element back', async () => {
    const origError = console.error
    let errored = false
    console.error = () => {
      errored = true
    }
    let renderCalled = false
    const ctx = {
      t: { a: 'one' },
      render() {
        renderCalled = true
      },
    }
    I18NManagerStore.registerLocalization({
      namespace: 'bad-ns',
      localesPath: '/loc',
      locales: ['en'],
      context: ctx,
    })
    // a manifest entry without includes() throws inside the
    // updateLanguage filters; both filters must catch and fall it back
    I18NManagerStore.translationManifest = { 'bad-ns': {} }
    I18NManagerStore.manifestLoaded = true
    await I18NManagerStore.updateLanguage('es')
    await nextTick()
    console.error = origError
    expect(errored).to.be.true
    // the broken element fell back: t was reset from the _t snapshot
    expect(ctx.t.a).to.equal('one')
    expect(renderCalled).to.be.true
    expect(ctx.t.hello).to.equal(undefined)
  })

  it('updateLanguage loads the exact file for a manifest-supported namespace', async () => {
    const ctx = { t: {} }
    I18NManagerStore.registerLocalization({
      namespace: 'mb-el2',
      localesPath: '/loc',
      context: ctx,
    })
    await I18NManagerStore.updateLanguage('es')
    expect(ctx.t.hello).to.equal('translated')
    expect(
      fetchMock.calls.some((u) => u.includes('/loc/mb-el2.es.json')),
    ).to.be.true
  })

  it('updateLanguage falls back to the base language file for es-XX', async () => {
    const ctx = { t: {} }
    I18NManagerStore.registerLocalization({
      namespace: 'mb-base',
      localesPath: '/loc',
      context: ctx,
    })
    await I18NManagerStore.updateLanguage('es-AR')
    expect(ctx.t.hello).to.equal('translated')
    expect(
      fetchMock.calls.some((u) => u.includes('/loc/mb-base.es.json')),
    ).to.be.true
    expect(
      fetchMock.calls.some((u) => u.includes('/loc/mb-base.es-AR.json')),
    ).to.be.false
  })

  it('updateLanguage attempts the exact file while the manifest is still loading', async () => {
    const ctx = { t: {} }
    I18NManagerStore.registerLocalization({
      namespace: 'mb-flight',
      localesPath: '/loc',
      context: ctx,
    })
    I18NManagerStore.manifestLoading = true
    await I18NManagerStore.updateLanguage('es')
    expect(ctx.t.hello).to.equal('translated')
    expect(
      fetchMock.calls.some((u) => u.includes('/loc/mb-flight.es.json')),
    ).to.be.true
  })

  it('updateLanguage serves cached fetch targets without a new request', async () => {
    const ctx = { t: {} }
    I18NManagerStore.registerLocalization({
      namespace: 'mb-cached',
      localesPath: '/loc',
      context: ctx,
    })
    I18NManagerStore.fetchTargets['/loc/mb-cached.es.json'] = {
      hello: 'cached',
    }
    await I18NManagerStore.updateLanguage('es')
    expect(ctx.t.hello).to.equal('cached')
    expect(
      fetchMock.calls.some((u) => u.includes('/loc/mb-cached.es.json')),
    ).to.be.false
  })

  it('updateLanguage resets t from the _t snapshot for unsupported languages', async () => {
    let renderCalled = false
    const ctx = {
      t: { a: 'one' },
      render() {
        renderCalled = true
      },
    }
    I18NManagerStore.registerLocalization({
      namespace: 'unsupported-el',
      localesPath: '/loc',
      locales: ['en'],
      context: ctx,
    })
    ctx.t.a = 'mutated'
    await I18NManagerStore.updateLanguage('es')
    expect(ctx.t.a).to.equal('one')
    expect(renderCalled).to.be.true
    expect(ctx.t.hello).to.equal(undefined)
  })

  it('attributeChangedCallback fires lang-changed events', async () => {
    const events = []
    const handler = (e) => events.push(e.detail.value)
    I18NManagerStore.addEventListener('lang-changed', handler)
    I18NManagerStore.lang = 'de'
    await nextTick()
    I18NManagerStore.lang = 'en'
    I18NManagerStore.removeEventListener('lang-changed', handler)
    expect(events.includes('de')).to.be.true
    expect(events.includes('en')).to.be.true
  })
})
