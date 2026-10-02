import { fixture, expect, html } from '@open-wc/testing'
import '../lib/hax-element-list-selector.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function until(check, timeout = 1500, step = 25) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    if (check()) {
      return true
    }
    await wait(step)
  }
  return check()
}

// registry of modules reachable through the default /node_modules/ base
// path. a11y-details carries an inline static haxProperties object and is
// not statically imported anywhere in this session, so its dynamic import
// registers exactly once; utils is a plain library module without a
// haxProperties object, exercising the noSchema classification branch
const REGISTRY = {
  'a11y-details': '@haxtheweb/a11y-details/a11y-details.js',
  utils: '@haxtheweb/utils/utils.js',
}

describe('hax-element-list-selector', () => {
  let el
  let realFetch
  let fetchedUrls = []

  before(async function () {
    this.timeout(10000)
    // stub fetch up front so the form autoload keeps working (fields.json
    // passes through to the real local test server) while every registry
    // request is answered from the fixture above; no remote network is hit
    realFetch = globalThis.fetch
    globalThis.fetch = (url) => {
      fetchedUrls.push(String(url))
      if (String(url).includes('fields.json')) {
        return realFetch(url)
      }
      return Promise.resolve({ json: () => Promise.resolve(REGISTRY) })
    }
    el = await fixture(
      html`<hax-element-list-selector></hax-element-list-selector>`,
    )
    // the form autoloads fields.json, fires value-changed, and the natural
    // flow swaps in ./wc-registry.json (stubbed) then imports the registry
    await until(() => el.form && el.form.formElements)
    await until(() => el.cardList)
    await until(() => el.haxData.length === 1 && el.noSchema['product-card'])
  })

  after(async () => {
    globalThis.fetch = realFetch
    await wait(100)
  })

  it('builds the form and realizes the cardlist field as an element', async () => {
    expect(el.form.tagName.toLowerCase()).to.equal('simple-fields-form')
    expect(el.cardList.tagName.toLowerCase()).to.equal(
      'hax-element-card-list',
    )
  })

  it('loads fields.json values into the form', async () => {
    const value = el.form.value
    expect(value.haxcore.providers['haxcore-providers-cdn']).to.equal(
      'other',
    )
    expect(value.haxcore.search['haxcore-search-columns']).to.equal('')
  })

  it('_activeTabChanged toggles showCardList on the search tab', async () => {
    el._activeTabChanged({ detail: { activeTab: 'haxcore.search' } })
    await el.updateComplete
    expect(el.showCardList).to.equal(true)
    expect(el.cardList.showCardList).to.equal(true)
    el._activeTabChanged({ detail: { activeTab: 'haxcore.providerdetails' } })
    await el.updateComplete
    expect(el.showCardList).to.equal(false)
  })

  it('classifies registry imports into haxData and noSchema', async () => {
    // the natural value-changed flow requested the registry and the
    // default wc-registry.json endpoint through the stubbed fetch
    expect(
      fetchedUrls.some((url) => url.includes('wc-registry.json')),
    ).to.equal(true)
    // module with an inline haxProperties object is cataloged as hax data
    expect(el.haxData.length).to.equal(1)
    expect(el.haxData[0].tag).to.equal('a11y-details')
    expect(el.haxData[0].file).to.equal('@haxtheweb/a11y-details/a11y-details.js')
    expect(el.haxData[0].schema.gizmo.title).to.equal(
      'Accessible Details Button',
    )
    // module without a haxProperties object lands in noSchema
    expect(el.noSchema.utils).to.equal('@haxtheweb/utils/utils.js')
    expect(el.loading).to.equal(false)
    // haxData is mirrored into filteredHaxData and pushed to the card list
    expect(el.filteredHaxData.length).to.equal(1)
    expect(el.cardList.list.length).to.equal(1)
    expect(el.cardList.list[0].tag).to.equal('a11y-details')
  })

  it('reloads the registry when the endpoint changes', async function () {
    this.timeout(8000)
    fetchedUrls = []
    el.wcRegistryEndpoint = 'http://localhost:8000/test-registry.json'
    await el.updateComplete
    await until(
      () => fetchedUrls.includes('http://localhost:8000/test-registry.json'),
    )
    // endpoint change resets data and reimports the same stubbed registry
    await until(() => el.haxData.length === 1)
    expect(el.imports['a11y-details']).to.equal(
      '@haxtheweb/a11y-details/a11y-details.js',
    )
  })

  it('applyFilters filters by title, tag and demo presence', async () => {
    el.haxData = [
      {
        tag: 'demo-element',
        file: 'elements/demo/demo.js',
        schema: {
          gizmo: {
            title: 'Demo Element',
            description: 'Has a demo',
            icon: 'icons:code',
            color: 'blue',
            tags: ['Test'],
          },
          demoSchema: [{ tag: 'p', properties: {}, content: 'demo' }],
        },
      },
      {
        tag: 'plain-element',
        file: 'elements/plain/plain.js',
        schema: {
          gizmo: {
            title: 'Plain Element',
            description: 'No demo here',
            icon: 'icons:help',
            color: 'red',
            tags: ['Other'],
          },
        },
      },
    ]
    await until(() => el.cardList.list.length === 2)
    // title search keeps only the matching element
    el.applyFilters({ 'haxcore-search-search': 'demo' })
    expect(el.cardList.filteredTags).to.deep.equal(['demo-element'])
    // tag filter
    el.applyFilters({ 'haxcore-search-tags': 'Other' })
    expect(el.cardList.filteredTags).to.deep.equal(['plain-element'])
    // demo presence filter keeps only elements with a demoSchema
    el.applyFilters({ 'haxcore-search-hasdemo': true })
    expect(el.cardList.filteredTags).to.deep.equal(['demo-element'])
    // empty values pass everything through
    el.applyFilters({
      'haxcore-search-search': '',
      'haxcore-search-tags': '',
      'haxcore-search-hasdemo': false,
    })
    expect(el.cardList.filteredTags).to.deep.equal([
      'demo-element',
      'plain-element',
    ])
  })

  it('_valueChanged debounces, swaps endpoints, filters and emits appstore values', async function () {
    this.timeout(8000)
    const appstoreEvents = []
    const handler = (e) => appstoreEvents.push(e)
    el.addEventListener('appstore-changed', handler)
    el._valueChanged()
    // the value changed handler debounces at 50ms
    await until(() => appstoreEvents.length > 0, 1000, 20)
    expect(appstoreEvents.length).to.equal(1)
    // providers were set to other so the endpoint joins the other-provider
    // value with the registry file name
    expect(el.wcRegistryEndpoint).to.equal('./wc-registry.json')
    const appstore = appstoreEvents[0].detail.value
    expect(appstore.providers.cdn).to.equal('other')
    expect(appstore.providers.other).to.equal('./')
    expect(appstore.autoloader['a11y-collapse']).to.equal(
      '@haxtheweb/a11y-collapse/a11y-collapse.js',
    )
    expect(appstore.stax).to.not.equal(undefined)
    expect(appstore.apps).to.not.equal(undefined)
    el.removeEventListener('appstore-changed', handler)
    await until(() => el.haxData.length === 1)
  })

  it('getAppstoreValues builds the appstore payload from the form', () => {
    const values = el.getAppstoreValues()
    expect(values.providers.cdn).to.equal('other')
    expect(values.providers.other).to.equal('./')
    expect(values.providers.pk).to.equal('')
    expect(values.stax).to.not.equal(undefined)
    expect(values.autoloader['a11y-collapse']).to.equal(
      '@haxtheweb/a11y-collapse/a11y-collapse.js',
    )
  })

  // fix (#11): the getAppstoreValues fallback object used to carry only
  // templates/providers keys, so a form submitting without a haxcore value
  // crashed at value.haxcore.search['haxcore-search-autoloader'] instead of
  // degrading; the fallback now carries search and integrations too
  it('getAppstoreValues degrades gracefully when the form has no haxcore value', () => {
    const form = el.shadowRoot.querySelector('#form')
    const realSubmit = form.submit
    form.submit = () => ({})
    let values = null
    let caught = null
    try {
      values = el.getAppstoreValues()
    } catch (e) {
      caught = e
    }
    form.submit = realSubmit
    expect(caught).to.equal(null)
    expect(values.apps).to.deep.equal({})
    expect(values.autoloader).to.equal(undefined)
    expect(values.stax).to.equal(undefined)
    expect(values.providers.cdn).to.equal(undefined)
    expect(values.providers.other).to.equal(undefined)
    expect(values.providers.pk).to.equal(undefined)
  })

  it('warns and skips registry entries whose module fails to import', async function () {
    this.timeout(8000)
    // point the endpoint at a registry with a broken entry; the failing
    // dynamic import is caught and warned while valid entries still load
    const broken = {
      'a11y-details': '@haxtheweb/a11y-details/a11y-details.js',
      'broken-element': '@haxtheweb/nonexistent-package-xyz/broken.js',
    }
    const stub = globalThis.fetch
    globalThis.fetch = (url) =>
      Promise.resolve({ json: () => Promise.resolve(broken) })
    const warnings = []
    const warn = globalThis.console.warn
    globalThis.console.warn = (e) => warnings.push(e)
    el.wcRegistryEndpoint = 'http://localhost:8000/broken-registry.json'
    await el.updateComplete
    await until(() => el.haxData.length === 1)
    expect(warnings.length).to.equal(1)
    expect(warnings[0] instanceof TypeError || warnings[0]).to.exist
    globalThis.fetch = stub
    globalThis.console.warn = warn
  })

  it('joins the CDN provider with the registry file when not set to other', async function () {
    this.timeout(8000)
    el.form.value.haxcore.providers['haxcore-providers-cdn'] =
      'https://cdn.webcomponents.psu.edu/cdn/'
    el._valueChanged()
    await until(
      () =>
        el.wcRegistryEndpoint ===
        'https://cdn.webcomponents.psu.edu/cdn/wc-registry.json',
      1000,
      20,
    )
    expect(el.wcRegistryEndpoint).to.equal(
      'https://cdn.webcomponents.psu.edu/cdn/wc-registry.json',
    )
    await until(() => el.haxData.length === 1)
    // restore the form provider for later suites
    el.form.value.haxcore.providers['haxcore-providers-cdn'] = 'other'
  })

  it('getAutoloader maps enabled elements into key pairs', () => {
    const autoloader = el.getAutoloader([
      { status: true, tag: 'first-tag', file: 'first.js' },
      { status: false, tag: 'second-tag', file: 'second.js' },
    ])
    expect(autoloader).to.deep.equal({ 'first-tag': 'first.js' })
  })

  it('renders the form with fields endpoint and method', async () => {
    const form = el.shadowRoot.querySelector('#form')
    expect(form.getAttribute('load-endpoint')).to.equal(el.fieldsEndpoint)
    expect(el.fieldsEndpoint.endsWith('fields.json')).to.equal(true)
    expect(form.getAttribute('method')).to.equal('GET')
    expect(el.method).to.equal('GET')
    expect(el.autoload).to.equal(true)
  })

  it('defines the element on the custom element registry', () => {
    expect(
      globalThis.customElements.get('hax-element-list-selector'),
    ).to.exist
  })
})
