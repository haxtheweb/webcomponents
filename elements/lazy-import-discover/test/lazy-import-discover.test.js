import { fixture, expect, html } from '@open-wc/testing'
import { LazyImportDiscover } from '../lazy-import-discover.js'

// lazy-import-discover scans the document for :not(:defined) elements on
// connect and generates a module script full of dynamic import() calls.
// The generated imports MUST resolve to real modules in these tests, so the
// base attributes and data-wc-def values below are absolute URLs derived
// from import.meta.url (no real network beyond the local WTR dev server,
// and no 404/unhandled rejections).

const elModuleUrl = new URL('../lazy-import-discover.js', import.meta.url)
const elDirBase = elModuleUrl.href.substring(
  0,
  elModuleUrl.href.lastIndexOf('/'),
)
const nodeModulesBase = new URL('../../../node_modules', import.meta.url).href

function generatedScripts() {
  return [...globalThis.document.head.querySelectorAll('script')].filter(
    (s) => !s.hasAttribute('src') && s.type === 'module',
  )
}

function lastGeneratedScript() {
  const scripts = generatedScripts()
  return scripts[scripts.length - 1]
}

function cleanupGeneratedScripts() {
  for (const s of generatedScripts()) {
    s.remove()
  }
}

async function waitForModuleLoad() {
  await new Promise((resolve) => setTimeout(resolve, 50))
}

describe('lazy-import-discover', () => {
  afterEach(() => {
    cleanupGeneratedScripts()
    delete globalThis.LazyImportBase
  })

  it('registers the lazy-import-discover custom element', () => {
    expect(globalThis.customElements.get('lazy-import-discover')).to.exist
    expect(LazyImportDiscover.tag).to.equal('lazy-import-discover')
  })

  it('observes the base attribute only', () => {
    expect(LazyImportDiscover.observedAttributes).to.deep.equal(['base'])
  })

  it('base setter is a no-op before the element is connected', () => {
    const el = globalThis.document.createElement('lazy-import-discover')
    expect(el.base).to.equal(null)
    el.base = 'not-applied'
    expect(el.getAttribute('base')).to.equal(null)
    expect(el.tag).to.equal('lazy-import-discover')
  })

  it('base setter applies the attribute once connected', async () => {
    const el = await fixture(
      html`<lazy-import-discover base="preset-base"></lazy-import-discover>`,
    )
    expect(el.base).to.equal('preset-base')
    el.base = 'applied-base'
    expect(el.getAttribute('base')).to.equal('applied-base')
    expect(el.base).to.equal('applied-base')
  })

  it('warns when the base attribute changes after connection', async () => {
    const el = await fixture(html`<lazy-import-discover></lazy-import-discover>`)
    const warnings = []
    const originalWarn = console.warn
    console.warn = (...args) => {
      warnings.push(args.join(' '))
    }
    try {
      el.setAttribute('base', 'changed-late')
      expect(warnings).to.include('base changed')
    } finally {
      console.warn = originalWarn
    }
  })

  it('generates an import for data-wc-def targets against the base', async () => {
    // undefined target element pointing at a module that is already loaded
    // (the element's own module), so the generated import resolves cleanly
    const host = globalThis.document.createElement('div')
    host.innerHTML = `<l-i-d-target-el data-wc-def="lazy-import-discover.js"></l-i-d-target-el>`
    globalThis.document.body.appendChild(host)
    try {
      const el = await fixture(
        html`<lazy-import-discover base="${elDirBase}"></lazy-import-discover>`,
      )
      const script = lastGeneratedScript()
      expect(script).to.exist
      expect(script.type).to.equal('module')
      expect(script.innerText).to.include(
        `import('${elDirBase}/lazy-import-discover.js');`,
      )
      await waitForModuleLoad()
      expect(globalThis.customElements.get('l-i-d-target-el')).to.not.exist
    } finally {
      host.remove()
    }
  })

  it('generates @haxtheweb/<tag>/<tag>.js imports for undefined tags', async () => {
    // b-r is a real workspace package but not defined on this page yet,
    // and the base points at the monorepo node_modules so the generated
    // specifier resolves to the real module
    const host = globalThis.document.createElement('div')
    host.innerHTML = `<b-r></b-r>`
    globalThis.document.body.appendChild(host)
    try {
      expect(globalThis.customElements.get('b-r')).to.not.exist
      const el = await fixture(
        html`<lazy-import-discover
          base="${nodeModulesBase}"
        ></lazy-import-discover>`,
      )
      const script = lastGeneratedScript()
      expect(script).to.exist
      expect(script.innerText).to.include(
        `import('${nodeModulesBase}/@haxtheweb/b-r/b-r.js');`,
      )
      await waitForModuleLoad()
      // the generated module script actually defined b-r for the document
      expect(globalThis.customElements.get('b-r')).to.exist
    } finally {
      host.remove()
    }
  })

  it('falls back to a ../node_modules base when none is set', async () => {
    // no undefined elements are left in the document at this point, so the
    // generated script is empty and nothing is imported
    const el = await fixture(html`<lazy-import-discover></lazy-import-discover>`)
    expect(el.getAttribute('base')).to.equal('../node_modules')
    const script = lastGeneratedScript()
    expect(script).to.exist
    expect(script.innerText).to.equal('')
  })

  it('self-appends via the DOMContentLoaded listener without LazyImportBase', async () => {
    const before = globalThis.document.body.querySelectorAll(
      'lazy-import-discover',
    ).length
    // the module registers its self-append listener on the global scope;
    // dispatch there (a plain document event does not bubble up to it)
    globalThis.dispatchEvent(new Event('DOMContentLoaded'))
    await new Promise((resolve) => setTimeout(resolve, 0))
    const after = globalThis.document.body.querySelectorAll(
      'lazy-import-discover',
    ).length
    expect(after).to.be.greaterThan(before)
    const appended = [
      ...globalThis.document.body.querySelectorAll('lazy-import-discover'),
    ].pop()
    expect(appended).to.exist
    // without LazyImportBase the connected callback applies the default base
    expect(appended.getAttribute('base')).to.equal('../node_modules')
  })

  it('self-appends with the LazyImportBase base when provided', async () => {
    globalThis.LazyImportBase = 'custom-import-base'
    globalThis.dispatchEvent(new Event('DOMContentLoaded'))
    await new Promise((resolve) => setTimeout(resolve, 0))
    const appended = [...globalThis.document.body.querySelectorAll('lazy-import-discover')].find(
      (el) => el.getAttribute('base') === 'custom-import-base',
    )
    expect(appended).to.exist
  })
})
