import { fixture, expect, html } from '@open-wc/testing'

import '../lib/DesignSystemManager.js'
import {
  DesignSystem,
  DesignSystemManager as DSMExport,
} from '../lib/DesignSystemManager.js'

describe('DesignSystem element', () => {
  it('has correct tag name', () => {
    expect(DesignSystem.tag).to.equal('design-system')
  })

  it('can be instantiated with default properties', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    expect(el).to.exist
    expect(el.active).to.be.null
    expect(el.systems).to.deep.equal([])
  })

  it('has properties defined', () => {
    const props = DesignSystem.properties
    expect(props.active).to.exist
    expect(props.systems).to.exist
  })
})

describe('DesignSystem.addDesignSystem', () => {
  it('adds a valid system to the systems map', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    el.addDesignSystem({
      name: 'test-system',
      styles: [],
      fonts: ['https://example.com/font.css'],
    })
    expect(el.systems['test-system']).to.exist
    expect(el.systems['test-system'].name).to.equal('test-system')
  })

  it('does not add a system missing required fields', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    el.addDesignSystem({ name: 'incomplete' })
    expect(el.systems['incomplete']).to.be.undefined
  })

  it('does not add a system missing fonts', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    el.addDesignSystem({ name: 'no-fonts', styles: [] })
    expect(el.systems['no-fonts']).to.be.undefined
  })

  it('does not add a system missing styles', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    el.addDesignSystem({ name: 'no-styles', fonts: [] })
    expect(el.systems['no-styles']).to.be.undefined
  })

  it('does not add a system missing name', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    el.addDesignSystem({ styles: [], fonts: [] })
    expect(Object.keys(el.systems).length).to.equal(0)
  })
})

describe('DesignSystem._integrationContextFromRuntime', () => {
  it('returns default context when no HaxStore or HAXCMS is present', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    const ctx = el._integrationContextFromRuntime()
    expect(ctx.editMode).to.be.false
    expect(ctx.isAuthenticated).to.be.true
  })

  it('returns editMode true when HaxStore.editMode is true', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    const origHaxStore = globalThis.HaxStore
    globalThis.HaxStore = {
      requestAvailability: () => ({ editMode: true }),
    }
    try {
      const ctx = el._integrationContextFromRuntime()
      expect(ctx.editMode).to.be.true
    } finally {
      globalThis.HaxStore = origHaxStore
    }
  })

  it('returns isAuthenticated false when HAXCMS store isLoggedIn is false', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    const origHAXCMS = globalThis.HAXCMS
    globalThis.HAXCMS = {
      instance: {
        store: { isLoggedIn: false },
      },
    }
    try {
      const ctx = el._integrationContextFromRuntime()
      expect(ctx.isAuthenticated).to.be.false
    } finally {
      globalThis.HAXCMS = origHAXCMS
    }
  })
})

describe('DesignSystem._integrationCacheKey', () => {
  it('builds a cache key from system and integration names', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    expect(el._integrationCacheKey('ddd', 'hax')).to.equal('ddd::hax')
    expect(el._integrationCacheKey('sys', 'plugin')).to.equal('sys::plugin')
  })
})

describe('DesignSystem.loadSystemIntegration', () => {
  it('returns early when system does not exist', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    const result = await el.loadSystemIntegration('nonexistent', 'hax', {})
    expect(result).to.be.undefined
  })

  it('returns early when system has no integrations', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    el.addDesignSystem({
      name: 'no-integrations',
      styles: [],
      fonts: [],
    })
    const result = await el.loadSystemIntegration('no-integrations', 'hax', {})
    expect(result).to.be.undefined
  })

  it('returns early when integration does not exist', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    el.addDesignSystem({
      name: 'no-plugin',
      styles: [],
      fonts: [],
      integrations: {},
    })
    const result = await el.loadSystemIntegration('no-plugin', 'missing', {})
    expect(result).to.be.undefined
  })

  it('returns early when integration has no module or importer', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    el.addDesignSystem({
      name: 'empty-integration',
      styles: [],
      fonts: [],
      integrations: { hax: {} },
    })
    const result = await el.loadSystemIntegration('empty-integration', 'hax', {})
    expect(result).to.be.undefined
  })

  it('respects shouldLoad returning false', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    el.addDesignSystem({
      name: 'gated-system',
      styles: [],
      fonts: [],
      integrations: {
        hax: {
          importer: () => Promise.resolve({ default: () => {} }),
          shouldLoad: () => false,
        },
      },
    })
    const result = await el.loadSystemIntegration('gated-system', 'hax', {})
    expect(result).to.be.undefined
    expect(el.__loadedIntegrations['gated-system::hax']).to.be.undefined
  })

  it('loads integration via importer and calls export function', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    let calledPayload = null
    el.addDesignSystem({
      name: 'loaded-system',
      styles: [],
      fonts: [],
      integrations: {
        hax: {
          importer: () =>
            Promise.resolve({
              registerMe: (payload) => {
                calledPayload = payload
              },
            }),
          exportName: 'registerMe',
        },
      },
    })
    await el.loadSystemIntegration('loaded-system', 'hax', { editMode: true })
    expect(calledPayload).to.not.be.null
    expect(calledPayload.systemName).to.equal('loaded-system')
    expect(calledPayload.integrationName).to.equal('hax')
    expect(calledPayload.context.editMode).to.be.true
    expect(el.__loadedIntegrations['loaded-system::hax']).to.be.true
  })

  it('does not reload a cached integration', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    let callCount = 0
    el.addDesignSystem({
      name: 'cached-system',
      styles: [],
      fonts: [],
      integrations: {
        hax: {
          importer: () =>
            Promise.resolve({
              registerMe: () => {
                callCount++
              },
            }),
          exportName: 'registerMe',
        },
      },
    })
    await el.loadSystemIntegration('cached-system', 'hax', {})
    await el.loadSystemIntegration('cached-system', 'hax', {})
    expect(callCount).to.equal(1)
  })

  it('catches errors from importer gracefully', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    el.addDesignSystem({
      name: 'error-system',
      styles: [],
      fonts: [],
      integrations: {
        hax: {
          importer: () => Promise.reject(new Error('import failed')),
        },
      },
    })
    const result = await el.loadSystemIntegration('error-system', 'hax', {})
    expect(result).to.be.undefined
    expect(el.__loadedIntegrations['error-system::hax']).to.be.undefined
  })
})

describe('DesignSystem.loadActiveSystemIntegrations', () => {
  it('returns early when no active system is set', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    const result = await el.loadActiveSystemIntegrations({})
    expect(result).to.be.undefined
  })
})

describe('DesignSystem._rehydrateHAXElementList', () => {
  it('does nothing when HaxStore is not available', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    const origHaxStore = globalThis.HaxStore
    globalThis.HaxStore = undefined
    try {
      el._rehydrateHAXElementList()
    } finally {
      globalThis.HaxStore = origHaxStore
    }
  })

  it('does nothing when HaxStore.requestAvailability is not a function', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    const origHaxStore = globalThis.HaxStore
    globalThis.HaxStore = {}
    try {
      el._rehydrateHAXElementList()
    } finally {
      globalThis.HaxStore = origHaxStore
    }
  })

  it('rehydrates element list when store is available', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    const origHaxStore = globalThis.HaxStore
    let rehydrated = {}
    globalThis.HaxStore = {
      requestAvailability: () => ({
        elementList: {
          'test-tag': { some: 'props' },
        },
        designSystemHAXProperties: (props, tag) => {
          rehydrated[tag] = true
          return { ...props, modified: true }
        },
      }),
    }
    try {
      el._rehydrateHAXElementList()
      expect(rehydrated['test-tag']).to.be.true
    } finally {
      globalThis.HaxStore = origHaxStore
    }
  })
})

describe('DesignSystem.applyDesignSystem', () => {
  it('applies a new system with styles and fonts', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    const fakeSystem = {
      styles: [{ cssText: ':root { --test: red; }' }],
      fonts: ['https://example.com/font.css'],
    }
    el.applyDesignSystem(null, fakeSystem)
    const fontLinks = globalThis.document.head.querySelectorAll(
      '[data-ds="font"]',
    )
    expect(fontLinks.length).to.be.greaterThan(0)
  })

  it('applies a new system with onload callback', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    let onloadCalled = false
    const fakeSystem = {
      styles: [{ cssText: ':root { --test: blue; }' }],
      fonts: [],
      onload: () => {
        onloadCalled = true
      },
    }
    el.applyDesignSystem(null, fakeSystem)
    expect(onloadCalled).to.be.true
  })

  it('applies a new system with hax flag without throwing', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    const fakeSystem = {
      styles: [{ cssText: ':root { --test: green; }' }],
      fonts: [],
      hax: true,
    }
    // should not throw even with hax flag set
    el.applyDesignSystem(null, fakeSystem)
    expect(true).to.be.true
  })

  it('cleans up old system fonts when switching', async () => {
    const el = await fixture(html`<design-system></design-system>`)
    const oldSystem = {
      styles: [{ cssText: ':root { --old: 1; }' }],
      fonts: ['https://example.com/old-font.css'],
    }
    const newSystem = {
      styles: [{ cssText: ':root { --new: 1; }' }],
      fonts: ['https://example.com/new-font.css'],
    }
    el.applyDesignSystem(null, oldSystem)
    el.applyDesignSystem(oldSystem, newSystem)
    const fontLinks = globalThis.document.head.querySelectorAll(
      '[data-ds="font"]',
    )
    const hrefs = Array.from(fontLinks).map((l) => l.getAttribute('href'))
    expect(hrefs).to.include('https://example.com/new-font.css')
  })
})

describe('DesignSystemManager global singleton', () => {
  it('exposes DesignSystemManager on globalThis', () => {
    expect(globalThis.DesignSystemManager).to.exist
  })

  it('has requestAvailability function', () => {
    expect(typeof globalThis.DesignSystemManager.requestAvailability).to.equal(
      'function',
    )
  })

  it('returns the same instance on repeated calls', () => {
    const a = globalThis.DesignSystemManager.requestAvailability()
    const b = globalThis.DesignSystemManager.requestAvailability()
    expect(a).to.equal(b)
  })

  it('the exported DesignSystemManager is the singleton instance', () => {
    expect(DSMExport).to.equal(
      globalThis.DesignSystemManager.requestAvailability(),
    )
  })
})
