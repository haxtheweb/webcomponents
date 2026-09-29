import { fixture, expect, html, elementUpdated, aTimeout } from '@open-wc/testing'
import { DynamicImportRegistry } from '@haxtheweb/dynamic-import-registry/dynamic-import-registry.js'
import '../lib/jos-render.js'

function outlineDataURL() {
  const schema = {
    id: 'rendered-id',
    title: 'Rendered site',
    author: 'Render Author',
    description: 'A site being rendered',
    license: 'by-sa',
    metadata: { site: { name: 'rendered' } },
    items: [
      {
        id: 'r1',
        title: 'Page 1',
        slug: 'page-1',
        order: 0,
        indent: 0,
        parent: null,
        location: 'pages/page-1/index.html',
        description: 'first',
        metadata: {},
      },
      {
        id: 'r2',
        title: 'Page 2',
        slug: 'page-2',
        order: 1,
        indent: 0,
        parent: null,
        location: 'pages/page-2/index.html',
        description: 'second',
        metadata: {},
      },
    ],
  }
  return 'data:application/json,' + encodeURIComponent(JSON.stringify(schema))
}

describe('jos-render', () => {
  it('registers under its tag name', () => {
    expect(globalThis.customElements.get('jos-render')).to.exist
  })
  it('creates the dynamic import registry singleton', async () => {
    const el = await fixture(html`<jos-render></jos-render>`)
    expect(el.registry).to.exist
    expect(el.registry.tagName.toLowerCase()).to.equal(
      'dynamic-import-registry',
    )
    expect(el.registry.parentElement).to.equal(globalThis.document.body)
    expect(el.items).to.deep.equal([])
    expect(el.shadowRoot.querySelector('.children')).to.exist
  })
  it('loads items from the source outline', async () => {
    const el = await fixture(html`<jos-render></jos-render>`)
    el.source = outlineDataURL()
    await aTimeout(100)
    await elementUpdated(el)
    expect(el.items.length).to.equal(2)
    expect(el.items[0].title).to.equal('Page 1')
    expect(el.items[1].location).to.equal('pages/page-2/index.html')
  })
  it('renders mapped items into slotted children', async () => {
    const el = await fixture(html`<jos-render></jos-render>`)
    el.source = outlineDataURL()
    await aTimeout(100)
    await elementUpdated(el)
    el.map = {
      tag: 'span',
      path: '@haxtheweb/utils/lib/object-path.js',
      properties: {
        title: 'title',
        slug: 'slug',
        parent: 'parent',
        derived: (item) => item.title.toUpperCase(),
        fixed: 'constant',
        flag: true,
        none: null,
      },
    }
    await elementUpdated(el)
    await aTimeout(100)
    const spans = el.querySelectorAll('span')
    expect(spans.length).to.equal(2)
    expect(spans[0].getAttribute('title')).to.equal('Page 1')
    expect(spans[0].getAttribute('slug')).to.equal(null)
    expect(spans[0].flag).to.equal(true)
    expect(spans[0].derived).to.equal('PAGE 1')
    expect(spans[0].fixed).to.equal('constant')
    expect(spans[1].getAttribute('title')).to.equal('Page 2')
  })
})

describe('dynamic-import-registry (via jos-render)', () => {
  it('rejects registrations without tag or path', () => {
    const registry = globalThis.DynamicImportRegistry.instance
    registry.register({ tag: 'no-path-tag' })
    registry.register({ path: 'no-tag/path.js' })
    expect(registry.list['no-path-tag']).to.equal(undefined)
  })
  it('answers path lookups for registered tags only', () => {
    const registry = globalThis.DynamicImportRegistry.instance
    registry.register({ tag: 'lookup-tag', path: 'some/path.js' })
    expect(registry.getPathToTag('lookup-tag')).to.equal(
      '/node_modules/some/path.js',
    )
    expect(registry.getPathToTag('never-registered')).to.equal(false)
  })
  it('notifies the autoloader about late registrations', () => {
    const registry = globalThis.DynamicImportRegistry.instance
    const original = globalThis.WCAutoloadRegistryRegistered
    globalThis.WCAutoloadRegistryRegistered = true
    let notified = null
    const onNew = (e) => {
      notified = e.detail
    }
    globalThis.addEventListener(
      'dynamic-import-registry--new-registration',
      onNew,
    )
    try {
      registry.register({ tag: 'late-tag', path: 'late/path.js' })
    } finally {
      globalThis.removeEventListener(
        'dynamic-import-registry--new-registration',
        onNew,
      )
      if (original === undefined) {
        delete globalThis.WCAutoloadRegistryRegistered
      } else {
        globalThis.WCAutoloadRegistryRegistered = original
      }
    }
    expect(notified).to.deep.equal({ tag: 'late-tag', path: 'late/path.js' })
  })
  it('registers definitions via the global event', () => {
    const registry = globalThis.DynamicImportRegistry.instance
    globalThis.dispatchEvent(
      new CustomEvent('dynamic-import-registry--register', {
        detail: { tag: 'event-tag', path: 'event/path.js' },
      }),
    )
    expect(registry.list['event-tag']).to.equal('event/path.js')
    globalThis.dispatchEvent(
      new CustomEvent('dynamic-import-registry--register', {
        detail: { tag: 'event-tag-incomplete' },
      }),
    )
    expect(registry.list['event-tag-incomplete']).to.equal(undefined)
  })
  it('skips loading definitions for tags already defined', async () => {
    const registry = globalThis.DynamicImportRegistry.instance
    registry.register({
      tag: 'jos-render',
      path: '@haxtheweb/json-outline-schema/lib/jos-render.js',
    })
    expect(await registry.loadDefinition('jos-render')).to.equal(undefined)
  })
  it('loads definitions for registered tags', async () => {
    const registry = globalThis.DynamicImportRegistry.instance
    registry.register({
      tag: 'load-me-tag',
      path: '@haxtheweb/utils/lib/object-path.js',
    })
    let loaded = null
    registry.addEventListener('dynamic-import-registry-loaded', (e) => {
      loaded = e.detail.tag
    })
    // the import succeeds, fires the loaded event and resolves to the module
    const module = await registry.loadDefinition('load-me-tag')
    expect(typeof module.varExists).to.equal('function')
    await aTimeout(50)
    expect(loaded).to.equal('load-me-tag')
  })
  it('reports failures for definitions that cannot be imported', async () => {
    const registry = globalThis.DynamicImportRegistry.instance
    registry.register({
      tag: 'missing-tag',
      path: '@haxtheweb/utils/lib/definitely-not-here.js',
    })
    let failed = false
    registry.addEventListener('dynamic-import-registry-failure', () => {
      failed = true
    })
    expect(await registry.loadDefinition('missing-tag')).to.equal(false)
    expect(failed).to.equal(true)
  })
  it('connects and disconnects its own instances', () => {
    const registry = new DynamicImportRegistry()
    globalThis.document.body.appendChild(registry)
    expect(registry.isConnected).to.equal(true)
    registry.remove()
    expect(registry.isConnected).to.equal(false)
  })
  it('falls back through the base path globals', () => {
    const originalAuto = globalThis.WCAutoloadBasePath
    const originalGlobal = globalThis.WCGlobalBasePath
    delete globalThis.WCAutoloadBasePath
    try {
      // WCGlobalBasePath still set: the registry adopts it
      const withGlobal = new DynamicImportRegistry()
      expect(withGlobal.basePath).to.equal('/node_modules/')
      delete globalThis.WCGlobalBasePath
      // nothing set: the registry derives a base path from its module url
      const withModule = new DynamicImportRegistry()
      expect(withModule.basePath).to.include('dynamic-import-registry.js')
    } finally {
      if (originalAuto !== undefined) {
        globalThis.WCAutoloadBasePath = originalAuto
      }
      if (originalGlobal !== undefined) {
        globalThis.WCGlobalBasePath = originalGlobal
      }
    }
  })
})
