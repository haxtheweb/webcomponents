import { fixture, expect, html, aTimeout, oneEvent } from '@open-wc/testing'

import '../lib/simple-fields-form-lite.js'
import '../lib/simple-fields-form.js'

describe('simple-fields-form-lite', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<simple-fields-form-lite></simple-fields-form-lite>`)
    await el.updateComplete
  })

  it('passes a11y audit', async () => {
    await expect(el).shadowDom.to.be.accessible()
  })

  it('instantiates with default properties', () => {
    expect(el.disableAutofocus).to.equal(false)
    expect(el.language).to.equal('en')
    expect(el.resources).to.deep.equal({})
    expect(el.schema).to.deep.equal({})
    expect(el.value).to.deep.equal({})
    expect(el.method).to.equal('POST')
    expect(el.loading).to.equal(false)
    expect(el.autoload).to.equal(false)
    expect(el.headers.Accept).to.equal('application/json')
    expect(el.headers['Content-Type']).to.equal('application/json')
    expect(el.body).to.deep.equal({})
  })

  it('renders a form with simple-fields-lite inside', () => {
    const form = el.shadowRoot.querySelector('form')
    expect(form).to.exist
    const sf = el.shadowRoot.querySelector('#sf')
    expect(sf).to.exist
    expect(sf.tagName.toLowerCase()).to.equal('simple-fields-lite')
  })

  it('setValue sets the value property', () => {
    el.setValue({ foo: 'bar' })
    expect(el.value).to.deep.equal({ foo: 'bar' })
  })

  it('_valueChanged updates value from event detail', () => {
    el._valueChanged({ detail: { value: { test: 123 } } })
    expect(el.value).to.deep.equal({ test: 123 })
  })

  it('getFormElementById returns matching element from __formElementsArray', () => {
    el.__formElementsArray = [
      { id: 'a', name: 'alpha' },
      { id: 'b', name: 'beta' },
    ]
    const result = el.getFormElementById('b')
    expect(result).to.exist
    expect(result.name).to.equal('beta')
  })

  it('getFormElementById returns undefined for no match', () => {
    el.__formElementsArray = [{ id: 'a' }]
    expect(el.getFormElementById('zzz')).to.equal(undefined)
  })

  it('formFields getter returns the #sf element', () => {
    const sf = el.formFields
    expect(sf).to.exist
    expect(sf.id).to.equal('sf')
  })

  it('formElements getter returns empty object when no formFields', async () => {
    // formFields.formElements returns {} if formFields has no formElements
    expect(el.formElements).to.exist
  })

  it('formElementsArray getter returns empty array when no formFields', async () => {
    expect(el.formElementsArray).to.exist
    expect(Array.isArray(el.formElementsArray)).to.equal(true)
  })

  it('rebuildForm calls rebuidForm on #sf', async () => {
    let called = false
    const sf = el.shadowRoot.querySelector('#sf')
    sf.rebuidForm = () => { called = true }
    el.rebuildForm()
    expect(called).to.equal(true)
  })

  it('submit returns sf.value when no saveEndpoint', () => {
    const sf = el.shadowRoot.querySelector('#sf')
    sf.value = { submitted: true }
    const result = el.submit()
    expect(result).to.deep.equal({ submitted: true })
  })

  it('submit calls fetch when saveEndpoint is set', async () => {
    const originalFetch = globalThis.fetch
    let fetched = false
    globalThis.fetch = () => { fetched = true; return Promise.resolve({}) }
    el.saveEndpoint = 'https://example.com/save'
    const sf = el.shadowRoot.querySelector('#sf')
    sf.value = { data: 'test' }
    el.submit()
    globalThis.fetch = originalFetch
    expect(fetched).to.equal(true)
  })

  it('_applyLoadedData sets schema and value from loadResponse', () => {
    el.loadResponse = {
      data: {
        schema: { type: 'object' },
        value: { loaded: true },
      },
    }
    el._applyLoadedData()
    expect(el.schema).to.deep.equal({ type: 'object' })
    expect(el.value).to.deep.equal({ loaded: true })
  })

  it('_applyLoadedData sets value only when no schema', () => {
    el.loadResponse = {
      data: {
        value: { noSchema: true },
      },
    }
    el._applyLoadedData()
    expect(el.value).to.deep.equal({ noSchema: true })
  })

  it('loadData sets loading and dispatches event on fetch resolve', async () => {
    const originalFetch = globalThis.fetch
    globalThis.fetch = () =>
      Promise.resolve({
        json: () => Promise.resolve({ data: { schema: {} } }),
      })
    el.loadEndpoint = 'https://example.com/data'
    setTimeout(() => el.loadData())
    await oneEvent(el, 'simple-fields-form-data-loaded')
    globalThis.fetch = originalFetch
    expect(el.loading).to.equal(false)
    expect(el.loadResponse).to.exist
  })

  it('fetchData with GET appends body as query params', async () => {
    const originalFetch = globalThis.fetch
    let capturedUrl = ''
    globalThis.fetch = (url, opts) => {
      capturedUrl = url
      return Promise.resolve({
        json: () => Promise.resolve({ ok: true }),
      })
    }
    await el.fetchData('https://example.com/api', 'GET', {}, { q: 'test', p: 1 })
    globalThis.fetch = originalFetch
    expect(capturedUrl).to.contain('q=test')
    expect(capturedUrl).to.contain('p=1')
  })

  it('fetchData with POST sends JSON body', async () => {
    const originalFetch = globalThis.fetch
    let capturedOpts = null
    globalThis.fetch = (url, opts) => {
      capturedOpts = opts
      return Promise.resolve({
        json: () => Promise.resolve({ ok: true }),
      })
    }
    await el.fetchData('https://example.com/api', 'POST', {}, { data: 'x' })
    globalThis.fetch = originalFetch
    expect(capturedOpts.method).to.equal('POST')
    expect(capturedOpts.body).to.equal(JSON.stringify({ data: 'x' }))
  })

  it('fieldProperties static getter returns expected keys', () => {
    const props = el.constructor.fieldProperties
    expect(props).to.have.property('disableAutofocus')
    expect(props).to.have.property('language')
    expect(props).to.have.property('schema')
    expect(props).to.have.property('value')
  })

  it('formProperties static getter returns expected keys', () => {
    const props = el.constructor.formProperties
    expect(props).to.have.property('autoload')
    expect(props).to.have.property('loading')
    expect(props).to.have.property('loadEndpoint')
    expect(props).to.have.property('saveEndpoint')
    expect(props).to.have.property('method')
    expect(props).to.have.property('headers')
    expect(props).to.have.property('body')
    expect(props).to.have.property('loadResponse')
  })
})

describe('simple-fields-form', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<simple-fields-form></simple-fields-form>`)
    await el.updateComplete
  })

  it('passes a11y audit', async () => {
    await expect(el).shadowDom.to.be.accessible()
  })

  it('renders simple-fields (not lite) inside', () => {
    const sf = el.shadowRoot.querySelector('#sf')
    expect(sf).to.exist
    expect(sf.tagName.toLowerCase()).to.equal('simple-fields')
  })

  it('has fields and fieldsConversion properties', () => {
    const props = el.constructor.fieldProperties
    expect(props).to.have.property('fields')
    expect(props).to.have.property('fieldsConversion')
    expect(props).to.have.property('schematizer')
  })

  it('_applyLoadedData sets fields when no schema in response', () => {
    el.loadResponse = {
      data: {
        fields: [{ property: 'name' }],
        value: { name: 'test' },
      },
    }
    el._applyLoadedData()
    expect(el.fields).to.deep.equal([{ property: 'name' }])
    expect(el.value).to.deep.equal({ name: 'test' })
  })

  it('defaultSchemaConversion getter does not throw', () => {
    // SimpleFields.defaultSchemaConversion may be undefined;
    // the getter just passes it through without error
    expect(() => el.defaultSchemaConversion).to.not.throw()
  })

  it('rebuildForm calls rebuidForm on #sf', async () => {
    let called = false
    const sf = el.shadowRoot.querySelector('#sf')
    sf.rebuidForm = () => { called = true }
    el.rebuildForm()
    expect(called).to.equal(true)
  })
})
