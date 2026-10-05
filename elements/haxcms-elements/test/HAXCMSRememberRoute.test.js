import { expect } from '@open-wc/testing'
import { store } from '../lib/core/haxcms-site-store.js'
import { HAXCMSRememberRoute } from '../lib/core/utils/HAXCMSRememberRoute.js'

// Covers the route-memory autorun, the resume toast in firstUpdated, the
// disposer cleanup in disconnectedCallback, and the toast-hide dispatch on
// resume. store.location is observable.ref so assignments trigger the
// autorun synchronously.

class RememberRouteHost extends HAXCMSRememberRoute(HTMLElement) {}
if (!globalThis.customElements.get('remember-route-test-host')) {
  globalThis.customElements.define('remember-route-test-host', RememberRouteHost)
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function makeManifest(siteName) {
  return {
    id: siteName,
    title: 'RR Site',
    metadata: {
      site: { name: siteName, lang: 'en' },
      platform: {},
      theme: { element: 'test-theme', variables: {}, regions: {} },
    },
    items: [],
  }
}

describe('HAXCMSRememberRoute', () => {
  let savedManifest
  let savedLocation
  let savedToast
  let toasts

  beforeEach(() => {
    savedManifest = store.manifest
    savedLocation = store.location
    savedToast = store.toast
    toasts = []
    store.manifest = makeManifest('rr-site')
    store.location = null
    store.toast = function (text, duration, extras, classStyle, closeText, eventCallback, slot) {
      toasts.push({ text, duration, slot })
    }
    globalThis.localStorage.removeItem('HAXCMSlastRoute-rr-site')
  })

  afterEach(() => {
    store.manifest = savedManifest
    store.location = savedLocation
    store.toast = savedToast
    globalThis.localStorage.removeItem('HAXCMSlastRoute-rr-site')
  })

  it('sets resume i18n defaults on construction', () => {
    const el = globalThis.document.createElement('remember-route-test-host')
    expect(el.t.resumeMessage).to.equal('Resume where you left off last session?')
    expect(el.t.resume).to.equal('Resume')
    expect(el.__evaluateRoute).to.equal(false)
    expect(Array.isArray(el.__disposer)).to.equal(true)
  })

  it('writes the current route to localStorage once evaluation is enabled', async () => {
    const el = globalThis.document.createElement('remember-route-test-host')
    globalThis.document.body.appendChild(el)
    try {
      el.__evaluateRoute = true
      store.location = { pathname: '/rr-site/page-1' }
      await wait(20)
      expect(globalThis.localStorage.getItem('HAXCMSlastRoute-rr-site')).to.equal(
        '"/rr-site/page-1"',
      )
    } finally {
      el.remove()
    }
  })

  it('does not write the route before evaluation is enabled', async () => {
    const el = globalThis.document.createElement('remember-route-test-host')
    globalThis.document.body.appendChild(el)
    try {
      store.location = { pathname: '/rr-site/ignored' }
      await wait(20)
      expect(globalThis.localStorage.getItem('HAXCMSlastRoute-rr-site')).to.equal(null)
    } finally {
      el.remove()
    }
  })

  it('firstUpdated shows a resume toast when a different stored route exists', async () => {
    globalThis.localStorage.setItem('HAXCMSlastRoute-rr-site', '"/rr-site/page-2"')
    store.location = { pathname: '/rr-site/page-1' }
    const el = globalThis.document.createElement('remember-route-test-host')
    globalThis.document.body.appendChild(el)
    // the host extends HTMLElement, which has no firstUpdated lifecycle of its
    // own, so invoke it directly the way a Lit theme would
    el.firstUpdated(new Map())
    try {
      await wait(600)
      expect(toasts.length).to.equal(1)
      expect(toasts[0].text).to.equal('Resume where you left off last session?')
      expect(toasts[0].slot).to.exist
      expect(toasts[0].slot.getAttribute('href')).to.equal('/rr-site/page-2')
      expect(el.__evaluateRoute).to.equal(true)
    } finally {
      el.remove()
    }
  })

  it('firstUpdated does not toast when the stored route matches the current one', async () => {
    globalThis.localStorage.setItem('HAXCMSlastRoute-rr-site', '"/rr-site/page-1"')
    store.location = { pathname: '/rr-site/page-1' }
    const el = globalThis.document.createElement('remember-route-test-host')
    globalThis.document.body.appendChild(el)
    el.firstUpdated(new Map())
    try {
      await wait(600)
      expect(toasts.length).to.equal(0)
    } finally {
      el.remove()
    }
  })

  it('firstUpdated does not toast when no route was stored', async () => {
    store.location = { pathname: '/rr-site/page-1' }
    const el = globalThis.document.createElement('remember-route-test-host')
    globalThis.document.body.appendChild(el)
    el.firstUpdated(new Map())
    try {
      await wait(600)
      expect(toasts.length).to.equal(0)
    } finally {
      el.remove()
    }
  })

  it('resumeLastRoute dispatches haxcms-toast-hide', () => {
    const el = globalThis.document.createElement('remember-route-test-host')
    let received = null
    const handler = (e) => {
      received = e.type
    }
    globalThis.addEventListener('haxcms-toast-hide', handler)
    try {
      el.resumeLastRoute({})
      expect(received).to.equal('haxcms-toast-hide')
    } finally {
      globalThis.removeEventListener('haxcms-toast-hide', handler)
    }
  })

  it('disconnectedCallback disposes autoruns and clears the disposer list', () => {
    const el = globalThis.document.createElement('remember-route-test-host')
    globalThis.document.body.appendChild(el)
    let disposed = false
    el.__disposer.push(() => {
      disposed = true
    })
    el.__disposer.push({ dispose: () => {} })
    el.remove()
    expect(disposed).to.equal(true)
    expect(el.__disposer.length).to.equal(0)
    // route writes must stop after disconnect even when evaluation is on
    el.__evaluateRoute = true
    store.location = { pathname: '/rr-site/after-disconnect' }
    expect(globalThis.localStorage.getItem('HAXCMSlastRoute-rr-site')).to.equal(null)
  })
})
