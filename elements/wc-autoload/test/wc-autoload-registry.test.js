import { fixture, expect, html } from '@open-wc/testing'

// wc-autoload depends on dynamic-import-registry and the package's
// coverage aggregate includes it, so its public behaviors are exercised
// here from wc-autoload's own test directory
import '../wc-autoload.js'

describe('dynamic-import-registry behaviors', () => {
  let registry
  let originalBasePath
  let originalWarn
  const warnings = []

  async function wait(ms) {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  /** the module-level autoloader fetches the harness registry file first */
  async function waitForBootstrap() {
    const start = Date.now()
    while (
      !globalThis.WCAutoloadRegistryFileProcessed &&
      Date.now() - start < 5000
    ) {
      await wait(25)
    }
  }

  before(async () => {
    await waitForBootstrap()
    registry = globalThis.DynamicImportRegistry.requestAvailability()
  })

  beforeEach(() => {
    originalBasePath = registry.basePath
    originalWarn = console.warn
    warnings.length = 0
    console.warn = (msg) => warnings.push(String(msg))
  })

  afterEach(() => {
    registry.basePath = originalBasePath
    console.warn = originalWarn
  })

  /** save/restore a registry list entry so tests never leak into bootstrap state */
  function stashListEntry(tag) {
    const entry = { tag, had: Object.prototype.hasOwnProperty.call(registry.list, tag), value: registry.list[tag] }
    return () => {
      if (entry.had) registry.list[entry.tag] = entry.value
      else delete registry.list[entry.tag]
      delete registry.__loaded[entry.tag]
    }
  }

  it('returns a singleton appended to the body', () => {
    expect(globalThis.DynamicImportRegistry.requestAvailability()).to.equal(
      registry,
    )
    expect(registry.tagName).to.equal('DYNAMIC-IMPORT-REGISTRY')
    expect(registry.parentNode).to.equal(document.body)
  })

  it('register stores tag and path pairs, ignoring duplicates and invalid entries', () => {
    registry.basePath = ''
    const restore = stashListEntry('reg-test-a')
    const newRegistrations = []
    const onNew = (e) => newRegistrations.push(e.detail)
    globalThis.addEventListener(
      'dynamic-import-registry--new-registration',
      onNew,
    )
    try {
      registry.register({ tag: 'reg-test-a', path: 'https://example.com/a.js' })
      expect(registry.list['reg-test-a']).to.equal('https://example.com/a.js')
      expect(newRegistrations.length).to.equal(1)
      // a duplicate registration is a no-op and does not re-notify
      registry.register({
        tag: 'reg-test-a',
        path: 'https://example.com/other.js',
      })
      expect(registry.list['reg-test-a']).to.equal('https://example.com/a.js')
      expect(newRegistrations.length).to.equal(1)
      // registrations missing tag or path warn instead of throwing
      registry.register({ tag: 'reg-test-bad' })
      registry.register({ path: 'x.js' })
      expect(warnings.length).to.be.at.least(2)
      expect(registry.list['reg-test-bad']).to.equal(undefined)
    } finally {
      globalThis.removeEventListener(
        'dynamic-import-registry--new-registration',
        onNew,
      )
      restore()
    }
  })

  it('registerDefinitionEvent registers definitions from a custom event', () => {
    const restore = stashListEntry('reg-event-tag')
    try {
      globalThis.dispatchEvent(
        new CustomEvent('dynamic-import-registry--register', {
          detail: { tag: 'reg-event-tag', path: 'event/path.js' },
        }),
      )
      expect(registry.list['reg-event-tag']).to.equal('event/path.js')
      // incomplete event details are ignored
      globalThis.dispatchEvent(
        new CustomEvent('dynamic-import-registry--register', {
          detail: { tag: 'reg-event-bad' },
        }),
      )
      expect(registry.list['reg-event-bad']).to.equal(undefined)
    } finally {
      restore()
    }
  })

  it('getPathToTag returns the importable URL or false', () => {
    registry.basePath = '/base-path/'
    const restore = stashListEntry('path-tag')
    try {
      registry.list['path-tag'] = 'path/to.js'
      expect(registry.getPathToTag('path-tag')).to.equal(
        '/base-path/path/to.js',
      )
      expect(registry.getPathToTag('not-registered-tag')).to.equal(false)
    } finally {
      restore()
    }
  })

  it('loadDefinition imports the module, notifies and dedupes', async () => {
    registry.basePath = ''
    // a URL that definitely resolves: this very element's module
    const modUrl = new URL('../wc-autoload.js', import.meta.url).href
    const restore = stashListEntry('load-def-ok')
    const loaded = []
    const onLoaded = (e) => loaded.push(e.detail)
    registry.addEventListener('dynamic-import-registry-loaded', onLoaded)
    try {
      registry.list['load-def-ok'] = modUrl
      await registry.loadDefinition('load-def-ok')
      expect(loaded.length).to.equal(1)
      expect(loaded[0].tag).to.equal('load-def-ok')
      expect(loaded[0].path).to.equal(modUrl)
      expect(loaded[0].module).to.exist
      // a second call for the same tag short-circuits on __loaded
      await registry.loadDefinition('load-def-ok')
      expect(loaded.length).to.equal(1)
    } finally {
      registry.removeEventListener('dynamic-import-registry-loaded', onLoaded)
      restore()
    }
  })

  it('loadDefinition skips tags that are already defined', async () => {
    registry.basePath = ''
    const modUrl = new URL('../wc-autoload.js', import.meta.url).href
    const restore = stashListEntry('wc-registry')
    const loaded = []
    const onLoaded = (e) => loaded.push(e.detail)
    registry.addEventListener('dynamic-import-registry-loaded', onLoaded)
    try {
      registry.list['wc-registry'] = modUrl
      await registry.loadDefinition('wc-registry')
      expect(loaded.length).to.equal(0)
    } finally {
      registry.removeEventListener('dynamic-import-registry-loaded', onLoaded)
      restore()
    }
  })

  it('loadDefinition reports import failures', async () => {
    registry.basePath = ''
    const modUrl = new URL('../wc-autoload.js', import.meta.url).href
    const restore = stashListEntry('load-def-bad')
    const failures = []
    const onFail = (e) => failures.push(e.detail)
    registry.addEventListener('dynamic-import-registry-failure', onFail)
    try {
      // the query string forces a fresh module evaluation which fails on
      // the duplicate custom element definition, exercising the catch path
      registry.list['load-def-bad'] = `${modUrl}?force-failure=1`
      const result = await registry.loadDefinition('load-def-bad')
      expect(result).to.equal(false)
      expect(failures.length).to.equal(1)
      expect(failures[0].tag).to.equal('load-def-bad')
      expect(failures[0].module).to.equal(null)
      expect(warnings.length).to.be.at.least(1)
    } finally {
      registry.removeEventListener('dynamic-import-registry-failure', onFail)
      restore()
    }
  })

  it('falls back to WCGlobalBasePath when WCAutoloadBasePath is unset', () => {
    const origAutoloadBasePath = globalThis.WCAutoloadBasePath
    const origGlobalBasePath = globalThis.WCGlobalBasePath
    try {
      globalThis.WCAutoloadBasePath = undefined
      globalThis.WCGlobalBasePath = '/wc-global-path/'
      const el = document.createElement('dynamic-import-registry')
      document.body.appendChild(el)
      expect(el.basePath).to.equal('/wc-global-path/')
      // disconnecting aborts its window listener
      el.remove()
    } finally {
      globalThis.WCAutoloadBasePath = origAutoloadBasePath
      globalThis.WCGlobalBasePath = origGlobalBasePath
    }
  })

  it('derives the default basePath from the module URL when no globals are set', () => {
    const origAutoloadBasePath = globalThis.WCAutoloadBasePath
    const origGlobalBasePath = globalThis.WCGlobalBasePath
    try {
      globalThis.WCAutoloadBasePath = undefined
      globalThis.WCGlobalBasePath = undefined
      const el = document.createElement('dynamic-import-registry')
      document.body.appendChild(el)
      expect(el.basePath).to.include('dynamic-import-registry.js/../../../')
      el.remove()
    } finally {
      globalThis.WCAutoloadBasePath = origAutoloadBasePath
      globalThis.WCGlobalBasePath = origGlobalBasePath
    }
  })
})
