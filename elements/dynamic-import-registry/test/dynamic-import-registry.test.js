import { expect } from '@open-wc/testing'
import { DynamicImportRegistry } from '../dynamic-import-registry.js'

describe('DynamicImportRegistry basics', () => {
  it('defines the custom element and exposes the class', () => {
    expect(globalThis.customElements.get('dynamic-import-registry')).to.exist
    expect(DynamicImportRegistry.tag).to.equal('dynamic-import-registry')
  })

  it('constructor accepts a delayRender argument harmlessly', () => {
    const el = new DynamicImportRegistry(true)
    expect(el instanceof DynamicImportRegistry).to.be.true
    expect(typeof el.list).to.equal('object')
    expect(typeof el.__loaded).to.equal('object')
  })

  it('derives the default basePath from the module URL when no globals are set', () => {
    const origAutoload = globalThis.WCAutoloadBasePath
    const origGlobal = globalThis.WCGlobalBasePath
    try {
      globalThis.WCAutoloadBasePath = undefined
      globalThis.WCGlobalBasePath = undefined
      const el = globalThis.document.createElement('dynamic-import-registry')
      expect(el.basePath).to.include('dynamic-import-registry.js/../../../')
    } finally {
      globalThis.WCAutoloadBasePath = origAutoload
      globalThis.WCGlobalBasePath = origGlobal
    }
  })

  it('prefers WCAutoloadBasePath when both base path globals are set', () => {
    const origAutoload = globalThis.WCAutoloadBasePath
    const origGlobal = globalThis.WCGlobalBasePath
    try {
      globalThis.WCAutoloadBasePath = '/autoload-path/'
      globalThis.WCGlobalBasePath = '/global-path/'
      const el = globalThis.document.createElement('dynamic-import-registry')
      expect(el.basePath).to.equal('/autoload-path/')
    } finally {
      globalThis.WCAutoloadBasePath = origAutoload
      globalThis.WCGlobalBasePath = origGlobal
    }
  })

  it('falls back to WCGlobalBasePath when WCAutoloadBasePath is unset', () => {
    const origAutoload = globalThis.WCAutoloadBasePath
    const origGlobal = globalThis.WCGlobalBasePath
    try {
      globalThis.WCAutoloadBasePath = undefined
      globalThis.WCGlobalBasePath = '/global-path/'
      const el = globalThis.document.createElement('dynamic-import-registry')
      expect(el.basePath).to.equal('/global-path/')
    } finally {
      globalThis.WCAutoloadBasePath = origAutoload
      globalThis.WCGlobalBasePath = origGlobal
    }
  })
})

describe('DynamicImportRegistry singleton', () => {
  it('requestAvailability returns one instance appended to the body', () => {
    const inst1 = globalThis.DynamicImportRegistry.requestAvailability()
    const inst2 = globalThis.DynamicImportRegistry.requestAvailability()
    expect(inst1 === inst2).to.be.true
    expect(inst1 === globalThis.DynamicImportRegistry.instance).to.be.true
    expect(inst1.tagName).to.equal('DYNAMIC-IMPORT-REGISTRY')
    expect(inst1.parentNode === globalThis.document.body).to.be.true
  })
})

describe('DynamicImportRegistry register', () => {
  let el
  let originalWarn
  const warnings = []

  beforeEach(() => {
    el = globalThis.document.createElement('dynamic-import-registry')
    globalThis.document.body.appendChild(el)
    originalWarn = console.warn
    warnings.length = 0
    console.warn = (msg) => {
      warnings.push(String(msg))
    }
  })

  afterEach(() => {
    console.warn = originalWarn
    el.remove()
  })

  it('stores tag and path pairs', () => {
    el.register({ tag: 'some-tag', path: 'path/to/some-tag.js' })
    expect(el.list['some-tag']).to.equal('path/to/some-tag.js')
  })

  it('ignores duplicate registrations keeping the first path', () => {
    el.register({ tag: 'dup-tag', path: 'first.js' })
    el.register({ tag: 'dup-tag', path: 'second.js' })
    expect(el.list['dup-tag']).to.equal('first.js')
  })

  it('warns for registrations missing tag or path', () => {
    el.register({ tag: 'no-path-tag' })
    el.register({ path: 'no-tag.js' })
    expect(
      warnings.some((w) => {
        return w.includes('requires tag and path')
      }),
    ).to.be.true
    expect(el.list['no-path-tag']).to.equal(undefined)
  })

  it('does not fire new-registration when WCAutoloadRegistryRegistered is unset', () => {
    const origFlag = globalThis.WCAutoloadRegistryRegistered
    const registrations = []
    const onNew = (e) => {
      registrations.push(e.detail)
    }
    globalThis.WCAutoloadRegistryRegistered = undefined
    globalThis.addEventListener(
      'dynamic-import-registry--new-registration',
      onNew,
    )
    try {
      el.register({ tag: 'quiet-tag', path: 'quiet.js' })
      expect(registrations.length).to.equal(0)
    } finally {
      globalThis.removeEventListener(
        'dynamic-import-registry--new-registration',
        onNew,
      )
      globalThis.WCAutoloadRegistryRegistered = origFlag
    }
  })

  it('fires new-registration once per new tag when the flag is set', () => {
    const origFlag = globalThis.WCAutoloadRegistryRegistered
    const registrations = []
    const onNew = (e) => {
      registrations.push(e.detail)
    }
    globalThis.WCAutoloadRegistryRegistered = true
    globalThis.addEventListener(
      'dynamic-import-registry--new-registration',
      onNew,
    )
    try {
      el.register({ tag: 'notify-tag', path: 'notify.js' })
      // a duplicate registration does not re-notify
      el.register({ tag: 'notify-tag', path: 'notify-2.js' })
      expect(registrations.length).to.equal(1)
      expect(registrations[0].tag).to.equal('notify-tag')
      expect(registrations[0].path).to.equal('notify.js')
    } finally {
      globalThis.removeEventListener(
        'dynamic-import-registry--new-registration',
        onNew,
      )
      globalThis.WCAutoloadRegistryRegistered = origFlag
    }
  })
})

describe('DynamicImportRegistry registerDefinitionEvent wiring', () => {
  let el

  beforeEach(() => {
    el = globalThis.document.createElement('dynamic-import-registry')
    globalThis.document.body.appendChild(el)
  })

  afterEach(() => {
    el.remove()
  })

  it('registers definitions dispatched as window events', () => {
    globalThis.dispatchEvent(
      new CustomEvent('dynamic-import-registry--register', {
        detail: { tag: 'event-tag', path: 'event/path.js' },
      }),
    )
    expect(el.list['event-tag']).to.equal('event/path.js')
  })

  it('ignores event details missing tag or path', () => {
    globalThis.dispatchEvent(
      new CustomEvent('dynamic-import-registry--register', {
        detail: { tag: 'bad-event-tag' },
      }),
    )
    expect(el.list['bad-event-tag']).to.equal(undefined)
  })

  it('stops responding to register events after disconnecting', () => {
    globalThis.dispatchEvent(
      new CustomEvent('dynamic-import-registry--register', {
        detail: { tag: 'before-disconnect', path: 'a.js' },
      }),
    )
    expect(el.list['before-disconnect']).to.equal('a.js')
    el.remove()
    globalThis.dispatchEvent(
      new CustomEvent('dynamic-import-registry--register', {
        detail: { tag: 'after-disconnect', path: 'b.js' },
      }),
    )
    expect(el.list['after-disconnect']).to.equal(undefined)
  })
})

describe('DynamicImportRegistry getPathToTag', () => {
  let el

  beforeEach(() => {
    el = globalThis.document.createElement('dynamic-import-registry')
  })

  it('returns basePath plus path for registered tags', () => {
    el.basePath = '/base-path/'
    el.register({ tag: 'path-tag', path: 'path/to.js' })
    expect(el.getPathToTag('path-tag')).to.equal('/base-path/path/to.js')
  })

  it('returns false for unknown, empty, or missing tags', () => {
    el.register({ tag: 'path-tag', path: 'path/to.js' })
    expect(el.getPathToTag('not-registered-tag')).to.equal(false)
    expect(el.getPathToTag('')).to.equal(false)
    expect(el.getPathToTag(null)).to.equal(false)
  })
})

describe('DynamicImportRegistry loadDefinition', () => {
  let el
  let originalWarn
  const warnings = []

  beforeEach(() => {
    el = globalThis.document.createElement('dynamic-import-registry')
    globalThis.document.body.appendChild(el)
    el.basePath = ''
    originalWarn = console.warn
    warnings.length = 0
    console.warn = (msg) => {
      warnings.push(String(msg))
    }
  })

  afterEach(() => {
    console.warn = originalWarn
    el.remove()
  })

  it('imports the module, notifies, and returns the module', async () => {
    // a URL that definitely resolves: this very element's module
    const modUrl = new URL('../dynamic-import-registry.js', import.meta.url).href
    const loaded = []
    const onLoaded = (e) => {
      loaded.push(e.detail)
    }
    el.addEventListener('dynamic-import-registry-loaded', onLoaded)
    try {
      el.register({ tag: 'load-def-ok', path: modUrl })
      const mod = await el.loadDefinition('load-def-ok')
      expect(typeof mod.DynamicImportRegistry).to.equal('function')
      expect(loaded.length).to.equal(1)
      expect(loaded[0].tag).to.equal('load-def-ok')
      expect(loaded[0].path).to.equal(modUrl)
      expect(loaded[0].module).to.exist
    } finally {
      el.removeEventListener('dynamic-import-registry-loaded', onLoaded)
    }
  })

  it('dedupes on __loaded so a second call is a no-op', async () => {
    const modUrl = new URL('../dynamic-import-registry.js', import.meta.url).href
    const loaded = []
    const onLoaded = (e) => {
      loaded.push(e.detail)
    }
    el.addEventListener('dynamic-import-registry-loaded', onLoaded)
    try {
      el.register({ tag: 'load-def-dedupe', path: modUrl })
      await el.loadDefinition('load-def-dedupe')
      const second = await el.loadDefinition('load-def-dedupe')
      expect(second).to.equal(undefined)
      expect(loaded.length).to.equal(1)
    } finally {
      el.removeEventListener('dynamic-import-registry-loaded', onLoaded)
    }
  })

  it('lowercases the tag before lookup', async () => {
    const modUrl = new URL('../dynamic-import-registry.js', import.meta.url).href
    const loaded = []
    const onLoaded = (e) => {
      loaded.push(e.detail)
    }
    el.addEventListener('dynamic-import-registry-loaded', onLoaded)
    try {
      el.register({ tag: 'mixed-case-tag', path: modUrl })
      const mod = await el.loadDefinition('MIXED-CASE-TAG')
      expect(typeof mod.DynamicImportRegistry).to.equal('function')
      expect(loaded.length).to.equal(1)
      expect(loaded[0].tag).to.equal('mixed-case-tag')
    } finally {
      el.removeEventListener('dynamic-import-registry-loaded', onLoaded)
    }
  })

  it('skips tags whose custom element is already defined', async () => {
    const modUrl = new URL('../dynamic-import-registry.js', import.meta.url).href
    const loaded = []
    const onLoaded = (e) => {
      loaded.push(e.detail)
    }
    el.addEventListener('dynamic-import-registry-loaded', onLoaded)
    try {
      el.register({ tag: 'dynamic-import-registry', path: modUrl })
      const result = await el.loadDefinition('dynamic-import-registry')
      expect(result).to.equal(undefined)
      expect(loaded.length).to.equal(0)
    } finally {
      el.removeEventListener('dynamic-import-registry-loaded', onLoaded)
    }
  })

  it('returns undefined for tags that were never registered', async () => {
    const result = await el.loadDefinition('never-registered-tag')
    expect(result).to.equal(undefined)
  })

  it('reports import failures with a failure event and false', async () => {
    // a module URL that does not resolve: the dev server 404s, the
    // dynamic import rejects, and the catch path fires the failure event
    const badUrl = new URL('./does-not-exist.js', import.meta.url).href
    const failures = []
    const onFail = (e) => {
      failures.push(e.detail)
    }
    el.addEventListener('dynamic-import-registry-failure', onFail)
    try {
      el.register({ tag: 'load-def-bad', path: badUrl })
      const result = await el.loadDefinition('load-def-bad')
      expect(result).to.equal(false)
      expect(failures.length).to.equal(1)
      expect(failures[0].tag).to.equal('load-def-bad')
      expect(failures[0].module).to.equal(null)
      expect(warnings.length).to.be.at.least(1)
    } finally {
      el.removeEventListener('dynamic-import-registry-failure', onFail)
    }
  })
})
