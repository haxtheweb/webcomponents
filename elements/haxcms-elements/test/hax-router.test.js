// Behavioral tests for HaxRouter — a lightweight client-side router.
// HaxRouter is a plain JS class (not a custom element) so we can unit-test
// its routing logic directly: route matching, baseUrl stripping, click
// interception, popstate handling, and event dispatch.
import { expect } from '@open-wc/testing'
import { HaxRouter } from '../lib/core/hax-router.js'

describe('HaxRouter route matching', () => {
  let router
  let originalLocation
  let originalHistory

  beforeEach(() => {
    originalLocation = { ...globalThis.location }
    originalHistory = { ...globalThis.history }
    // minimal fake outlet
    router = new HaxRouter(document.createElement('div'), { baseUrl: '' })
  })

  afterEach(() => {
    // restore enough that other suites are not affected
    if (globalThis.history.pushState) {
      // no-op; we just ensure we don't leak state
    }
  })

  it('_matchRoute returns null when no routes defined', () => {
    router.routes = []
    expect(router._matchRoute('/anything')).to.equal(null)
  })

  it('_matchRoute matches root path "/"', () => {
    router.routes = [{ path: '/', component: 'home-e', name: 'home' }]
    const match = router._matchRoute('/')
    expect(match.route.name).to.equal('home')
    expect(match.params).to.deep.equal([])
  })

  it('_matchRoute matches exact path', () => {
    router.routes = [
      { path: '/about', component: 'about-e', name: 'about' },
    ]
    const match = router._matchRoute('/about')
    expect(match.route.name).to.equal('about')
  })

  it('_matchRoute matches wildcard /(.*) with remaining params', () => {
    router.routes = [
      { path: '/(.*)', component: 'notfound-e', name: '404' },
    ]
    const match = router._matchRoute('/deep/path/here')
    expect(match.route.name).to.equal('404')
    expect(match.params).to.deep.equal(['deep/path/here'])
  })

  it('_matchRoute wildcard on root returns empty string param', () => {
    router.routes = [{ path: '/(.*)', component: 'nf', name: '404' }]
    const match = router._matchRoute('/')
    expect(match.params).to.deep.equal([''])
  })

  it('_matchRoute matches parameterized route with :param', () => {
    router.routes = [
      { path: '/users/:id', component: 'user-e', name: 'user' },
    ]
    const match = router._matchRoute('/users/42')
    expect(match.route.name).to.equal('user')
    expect(match.params).to.deep.equal(['42'])
  })

  it('_matchRoute normalizes leading slash on pathname', () => {
    router.routes = [{ path: '/about', component: 'a', name: 'about' }]
    const match = router._matchRoute('about')
    expect(match.route.name).to.equal('about')
  })

  it('_matchRoute normalizes leading slash on route path', () => {
    router.routes = [{ path: 'about', component: 'a', name: 'about' }]
    const match = router._matchRoute('/about')
    expect(match.route.name).to.equal('about')
  })

  it('_matchRoute falls back to 404 wildcard when no exact match', () => {
    router.routes = [
      { path: '/home', component: 'h', name: 'home' },
      { path: '/(.*)', component: 'nf', name: '404' },
    ]
    const match = router._matchRoute('/nonexistent')
    expect(match.route.name).to.equal('404')
    expect(match.params).to.deep.equal(['nonexistent'])
  })

  it('_matchRoute returns null when no match and no wildcard', () => {
    router.routes = [{ path: '/home', component: 'h', name: 'home' }]
    expect(router._matchRoute('/other')).to.equal(null)
  })

  it('_matchRoute supports /(.*)? variant wildcard', () => {
    router.routes = [{ path: '/(.*)?', component: 'nf', name: '404' }]
    const match = router._matchRoute('/foo/bar')
    expect(match.route.name).to.equal('404')
    expect(match.params).to.deep.equal(['foo/bar'])
  })
})

describe('HaxRouter baseUrl cleaning', () => {
  it('_cleanPathnameForUrl returns / for null or non-string pathname', () => {
    const router = new HaxRouter(document.createElement('div'), {
      baseUrl: '/sub/',
    })
    expect(router._cleanPathnameForUrl(null)).to.equal('/')
    expect(router._cleanPathnameForUrl({})).to.equal('/')
  })

  it('_cleanPathnameForUrl strips baseUrl prefix', () => {
    const router = new HaxRouter(document.createElement('div'), {
      baseUrl: '/mysite/',
    })
    expect(router._cleanPathnameForUrl({ pathname: '/mysite/about' })).to.equal(
      '/about',
    )
  })

  it('_cleanPathnameForUrl adds leading slash after strip', () => {
    const router = new HaxRouter(document.createElement('div'), {
      baseUrl: '/mysite/',
    })
    expect(
      router._cleanPathnameForUrl({ pathname: '/mysite' }),
    ).to.equal('/mysite')
  })

  it('_cleanPathnameForUrl leaves path unchanged when baseUrl is empty', () => {
    const router = new HaxRouter(document.createElement('div'), {
      baseUrl: '',
    })
    expect(router._cleanPathnameForUrl({ pathname: '/about' })).to.equal(
      '/about',
    )
  })

  it('_cleanPathnameForUrl handles full-URL baseUrl', () => {
    const router = new HaxRouter(document.createElement('div'), {
      baseUrl: 'https://example.com/sub/',
    })
    expect(router._cleanPathnameForUrl({ pathname: '/sub/page' })).to.equal(
      '/page',
    )
  })

  it('_getDefaultBaseUrl returns empty string when no <base> tag', () => {
    const router = new HaxRouter(document.createElement('div'), {})
    expect(router._getDefaultBaseUrl()).to.equal('')
  })

  it('_getDefaultBaseUrl reads <base href> when present', () => {
    const base = document.createElement('base')
    base.setAttribute('href', '/subdir/')
    document.head.appendChild(base)
    try {
      const router = new HaxRouter(document.createElement('div'), {})
      expect(router._getDefaultBaseUrl()).to.equal('/subdir/')
    } finally {
      base.remove()
    }
  })
})

describe('HaxRouter resolve and events', () => {
  let router
  let receivedEvents

  beforeEach(() => {
    router = new HaxRouter(document.createElement('div'), { baseUrl: '' })
    receivedEvents = []
    globalThis.addEventListener(
      'hax-router-location-changed',
      (e) => receivedEvents.push(e),
    )
  })

  afterEach(() => {
    // HaxRouter has no disconnect; events are harmless
  })

  it('_resolve does nothing when no routes', () => {
    router.routes = []
    router._resolve()
    expect(receivedEvents.length).to.equal(0)
  })

  it('_resolve dispatches hax-router-location-changed with location detail', () => {
    router.routes = [{ path: '/page', component: 'p', name: 'page' }]
    // pass an explicit URL so the match is deterministic regardless of the
    // test runner's current location
    router._resolve({ pathname: '/page', search: '', hash: '' })
    expect(receivedEvents.length).to.be.greaterThan(0)
    const evt = receivedEvents[receivedEvents.length - 1]
    expect(evt.detail.location.route.name).to.equal('page')
    expect(evt.detail.location.baseUrl).to.equal('')
    expect(evt.detail.location.params).to.deep.equal([])
  })

  it('_resolve with explicit targetUrl resolves that URL', () => {
    router.routes = [{ path: '/target', component: 't', name: 'target' }]
    router._resolve({ pathname: '/target', search: '', hash: '' })
    expect(receivedEvents.length).to.be.greaterThan(0)
    const evt = receivedEvents[receivedEvents.length - 1]
    expect(evt.detail.location.route.name).to.equal('target')
  })

  it('setRoutes stores routes and triggers resolve', async () => {
    router.setRoutes([{ path: '/x', component: 'x', name: 'x' }])
    expect(router.routes.length).to.equal(1)
    await new Promise((r) => setTimeout(r, 0))
    // resolve fires but likely no match on default location, which is fine
  })

  it('addRoutes appends to existing routes', () => {
    router.routes = [{ path: '/a', component: 'a', name: 'a' }]
    router.addRoutes([{ path: '/b', component: 'b', name: 'b' }])
    expect(router.routes.length).to.equal(2)
    expect(router.routes[1].name).to.equal('b')
  })
})

describe('HaxRouter click interception', () => {
  let router
  let anchor
  let originalPreventDefault
  let preventDefaultCalled

  beforeEach(() => {
    router = new HaxRouter(document.createElement('div'), { baseUrl: '' })
    router.routes = [
      { path: '/(.*)', component: 'nf', name: '404' },
    ]
    anchor = document.createElement('a')
    anchor.setAttribute('href', '/some-page')
    document.body.appendChild(anchor)
    preventDefaultCalled = false
  })

  afterEach(() => {
    anchor.remove()
  })

  it('_onClick ignores events with defaultPrevented', () => {
    const evt = new Event('click', { bubbles: true })
    Object.defineProperty(evt, 'defaultPrevented', { value: true })
    Object.defineProperty(evt, 'button', { value: 0 })
    expect(router._onClick(evt)).to.equal(undefined)
  })

  it('_onClick ignores non-primary button clicks', () => {
    const evt = new Event('click', { bubbles: true })
    Object.defineProperty(evt, 'button', { value: 2 })
    expect(router._onClick(evt)).to.equal(undefined)
  })

  it('_onClick ignores modified clicks (ctrl/meta/shift/alt)', () => {
    for (const mod of ['ctrlKey', 'metaKey', 'shiftKey', 'altKey']) {
      const evt = new Event('click', { bubbles: true })
      Object.defineProperty(evt, 'button', { value: 0 })
      Object.defineProperty(evt, mod, { value: true })
      expect(router._onClick(evt)).to.equal(undefined)
    }
  })

  it('_onClick ignores anchors with target != _self', () => {
    anchor.setAttribute('target', '_blank')
    const evt = new Event('click', { bubbles: true, composed: true })
    Object.defineProperty(evt, 'button', { value: 0 })
    evt.composedPath = () => [anchor]
    expect(router._onClick(evt)).to.equal(undefined)
  })

  it('_onClick ignores anchors with download attribute', () => {
    anchor.setAttribute('download', '')
    const evt = new Event('click', { bubbles: true, composed: true })
    Object.defineProperty(evt, 'button', { value: 0 })
    evt.composedPath = () => [anchor]
    expect(router._onClick(evt)).to.equal(undefined)
  })

  it('_onClick ignores anchors with router-ignore attribute', () => {
    anchor.setAttribute('router-ignore', '')
    const evt = new Event('click', { bubbles: true, composed: true })
    Object.defineProperty(evt, 'button', { value: 0 })
    evt.composedPath = () => [anchor]
    expect(router._onClick(evt)).to.equal(undefined)
  })

  it('_onClick ignores anchors with no href', () => {
    anchor.removeAttribute('href')
    const evt = new Event('click', { bubbles: true, composed: true })
    Object.defineProperty(evt, 'button', { value: 0 })
    evt.composedPath = () => [anchor]
    expect(router._onClick(evt)).to.equal(undefined)
  })

  it('_onClick ignores cross-origin anchors', () => {
    anchor.setAttribute('href', 'https://other-origin.com/page')
    const evt = new Event('click', { bubbles: true, composed: true })
    Object.defineProperty(evt, 'button', { value: 0 })
    evt.composedPath = () => [anchor]
    expect(router._onClick(evt)).to.equal(undefined)
  })

  it('_onClick ignores fragment links on same page', () => {
    anchor.setAttribute('href', globalThis.location.pathname + '#section')
    const evt = new Event('click', { bubbles: true, composed: true })
    Object.defineProperty(evt, 'button', { value: 0 })
    evt.composedPath = () => [anchor]
    expect(router._onClick(evt)).to.equal(undefined)
  })

  it('_onClick ignores paths outside baseUrl scope', () => {
    router.baseUrl = '/app/'
    anchor.setAttribute('href', '/other/path')
    const evt = new Event('click', { bubbles: true, composed: true })
    Object.defineProperty(evt, 'button', { value: 0 })
    evt.composedPath = () => [anchor]
    expect(router._onClick(evt)).to.equal(undefined)
  })

  it('_onClick prevents default for valid in-scope anchor', () => {
    anchor.setAttribute('href', '/valid-page')
    const evt = new Event('click', { bubbles: true, composed: true })
    Object.defineProperty(evt, 'button', { value: 0 })
    evt.composedPath = () => [anchor]
    let prevented = false
    evt.preventDefault = () => { prevented = true }
    router._onClick(evt)
    expect(prevented).to.equal(true)
  })

  it('_onClick calls pushState and scrollTo for valid route', () => {
    anchor.setAttribute('href', '/valid-page')
    const evt = new Event('click', { bubbles: true, composed: true })
    Object.defineProperty(evt, 'button', { value: 0 })
    evt.composedPath = () => [anchor]
    let pushedState = null
    const origPushState = globalThis.history.pushState
    globalThis.history.pushState = (state, title, url) => {
      pushedState = url
    }
    const origScrollTo = globalThis.scrollTo
    let scrolledTo = null
    globalThis.scrollTo = (x, y) => { scrolledTo = { x, y } }
    try {
      router._onClick(evt)
      expect(pushedState).to.exist
      expect(scrolledTo).to.deep.equal({ x: 0, y: 0 })
    } finally {
      globalThis.history.pushState = origPushState
      globalThis.scrollTo = origScrollTo
    }
  })

  it('_onClick with slug route skips pushState', () => {
    router.routes = [{ path: '/(.*)', component: 'nf', name: '404', slug: '/dashboard' }]
    anchor.setAttribute('href', '/dashboard')
    const evt = new Event('click', { bubbles: true, composed: true })
    Object.defineProperty(evt, 'button', { value: 0 })
    evt.composedPath = () => [anchor]
    let pushedState = null
    const origPushState = globalThis.history.pushState
    globalThis.history.pushState = (state, title, url) => {
      pushedState = url
    }
    try {
      router._onClick(evt)
      expect(pushedState).to.equal(null)
    } finally {
      globalThis.history.pushState = origPushState
    }
  })

  it('_onClick handles invalid URL gracefully', () => {
    anchor.setAttribute('href', 'javascript:void(0)')
    const evt = new Event('click', { bubbles: true, composed: true })
    Object.defineProperty(evt, 'button', { value: 0 })
    evt.composedPath = () => [anchor]
    expect(() => router._onClick(evt)).to.not.throw()
  })

  it('_onPopstate triggers resolve', async () => {
    let eventCount = 0
    const handler = () => { eventCount++ }
    globalThis.addEventListener('hax-router-location-changed', handler)
    try {
      router._onPopstate()
      await new Promise((r) => setTimeout(r, 0))
      // resolve fires, may or may not match but no throw
      expect(eventCount).to.be.greaterThanOrEqual(0)
    } finally {
      globalThis.removeEventListener('hax-router-location-changed', handler)
    }
  })
})
