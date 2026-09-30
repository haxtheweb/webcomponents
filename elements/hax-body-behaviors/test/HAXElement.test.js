import { expect, fixture, html } from '@open-wc/testing'
import { LitElement } from 'lit'
import { HAXElement, HAXWiring } from '../lib/HAXWiring.js'

class TestHaxElement extends HAXElement(LitElement) {
  static get tag() {
    return 'test-hax-element'
  }
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
    }
  }
  render() {
    return html`<div>test</div>`
  }
}
customElements.define(TestHaxElement.tag, TestHaxElement)

describe('HAXElement mixin', () => {
  let originalHaxStore

  beforeEach(() => {
    originalHaxStore = globalThis.HaxStore
  })

  afterEach(() => {
    if (originalHaxStore === undefined) {
      delete globalThis.HaxStore
    } else {
      globalThis.HaxStore = originalHaxStore
    }
  })

  it('constructs with window controllers and a private wiring', async () => {
    const el = await fixture(html`<test-hax-element></test-hax-element>`)
    expect(el.windowControllers instanceof AbortController).to.equal(true)
    expect(el.HAXWiring instanceof HAXWiring).to.equal(true)
    expect(el.windowControllers.signal.aborted).to.equal(false)
  })

  it('designSystemHAXProperties passes props through untouched', async () => {
    const el = await fixture(html`<test-hax-element></test-hax-element>`)
    const props = { settings: { configure: [] } }
    expect(el.designSystemHAXProperties(props) === props).to.equal(true)
  })

  it('setHaxProperties slow path defers registration without a ready store', async () => {
    const el = await fixture(html`<test-hax-element></test-hax-element>`)
    const captured = []
    el.addEventListener('hax-register-properties', (e) => captured.push(e.detail))
    const props = {
      settings: { configure: [{ property: 'title', inputMethod: 'textfield' }] },
    }
    await el.setHaxProperties(props)
    // nothing is fired yet and the wiring keeps its own defaults because
    // the tag is derived from the element tagName (non-empty)
    expect(captured.length).to.equal(0)
    expect(
      el.HAXWiring.haxProperties.settings.configure.length,
    ).to.equal(0)
  })

  // fixed (issue #3077, bug 36): the slow-path hax-store-ready handler
  // dispatches registration from the ELEMENT (the wiring instance has no
  // tagName of its own), so mixin-based elements re-fire their
  // registration once the store becomes ready
  it('re-registers on hax-store-ready after the slow path', async () => {
    const el = await fixture(html`<test-hax-element></test-hax-element>`)
    const captured = []
    el.addEventListener('hax-register-properties', (e) => captured.push(e.detail))
    await el.setHaxProperties({ settings: { configure: [] } })
    expect(captured.length).to.equal(0)
    globalThis.dispatchEvent(
      new CustomEvent('hax-store-ready', { detail: { ready: true } }),
    )
    await new Promise((r) => setTimeout(r, 50))
    expect(captured.length).to.equal(1)
    expect(captured[0].tag).to.equal('test-hax-element')
    expect(captured[0].properties.settings).to.not.equal(undefined)
  })

  it('setHaxProperties fast path registers when the store is ready', async () => {
    const el = await fixture(html`<test-hax-element></test-hax-element>`)
    const captured = []
    el.addEventListener('hax-register-properties', (e) => captured.push(e.detail))
    globalThis.HaxStore = {
      instance: { ready: true, elementList: {} },
      requestAvailability() {
        return { designSystemHAXProperties(props) { return props } }
      },
    }
    const props = {
      settings: { configure: [{ property: 'title', inputMethod: 'textfield' }] },
    }
    await el.setHaxProperties(props)
    expect(captured.length).to.equal(1)
    expect(captured[0].tag).to.equal('test-hax-element')
    expect(captured[0].properties.settings.configure[0].property).to.equal(
      'title',
    )
  })

  it('aborts window listeners on disconnect', async () => {
    const el = await fixture(html`<test-hax-element></test-hax-element>`)
    expect(el.windowControllers.signal.aborted).to.equal(false)
    el.remove()
    expect(el.windowControllers.signal.aborted).to.equal(true)
  })

  // fixed (issue #3077, bug 35): HAXElement.setup passes the
  // caller-supplied tag and context through to the wiring instead of
  // discarding them
  it('setup passes caller supplied tag and context through', async () => {
    const el = await fixture(html`<test-hax-element></test-hax-element>`)
    const seen = []
    el.HAXWiring.setup = (props, tag, context) => {
      seen.push({ props, tag, context })
      return 'delegated'
    }
    const callerContext = { label: 'context' }
    const result = el.setup({ p: 1 }, 'forced-tag', callerContext)
    expect(result).to.equal('delegated')
    expect(seen.length).to.equal(1)
    expect(seen[0].tag).to.equal('forced-tag')
    expect(seen[0].context === callerContext).to.equal(true)
    expect(seen[0].props.p).to.equal(1)
  })

  it('delegates the wiring helpers on the element', async () => {
    const el = await fixture(html`<test-hax-element></test-hax-element>`)
    const validated = el.validateSetting({ property: 'x' })
    expect(validated.title).to.equal('x')
    const custom = { api: '1' }
    el.haxProperties = custom
    expect(el.getHaxProperties() === custom).to.equal(true)
    const schema = el.getHaxJSONSchema('configure', {
      settings: { configure: [{ property: 'title', inputMethod: 'textfield' }] },
    })
    expect(schema.title).to.equal('HAX configure form schema')
    expect(schema.properties.title.type).to.equal('string')
    expect(el.postProcessgetHaxJSONSchema({ b: 2 }).b).to.equal(2)
    const keys = el._getHaxJSONSchemaProperty([{ property: 'q' }])
    expect(Object.keys(keys).join(',')).to.equal('q')
    expect(el.getHaxJSONSchemaType('boolean')).to.equal('boolean')
    expect(el.getHaxJSONSchemaType('nope')).to.equal('string')
    expect(el.validHAXPropertyInputMethod().includes('boolean')).to.equal(true)
    expect(el.prototypeHaxProperties().api).to.equal('1')
    expect(el._haxStoreReady({ detail: {} })).to.equal(undefined)
  })
})

describe('legacy HAXBehaviors.PropertiesBehaviors', () => {
  const behaviors = globalThis.HAXBehaviors.PropertiesBehaviors

  it('exposes the full legacy behavior api', () => {
    expect(typeof behaviors.setHaxProperties).to.equal('function')
    expect(typeof behaviors._haxStoreReady).to.equal('function')
    expect(typeof behaviors.validateSetting).to.equal('function')
    expect(typeof behaviors.getHaxProperties).to.equal('function')
    expect(typeof behaviors.getHaxJSONSchema).to.equal('function')
    expect(typeof behaviors.postProcessgetHaxJSONSchema).to.equal('function')
    expect(typeof behaviors._getHaxJSONSchemaProperty).to.equal('function')
    expect(typeof behaviors.getHaxJSONSchemaType).to.equal('function')
    expect(typeof behaviors.validHAXPropertyInputMethod).to.equal('function')
    expect(typeof behaviors.prototypeHaxProperties).to.equal('function')
    expect(behaviors.properties.haxProperties).to.not.equal(undefined)
  })

  it('applies to a plain element and delegates to the global wiring', async () => {
    const originalProps = globalThis.HAXWiring.haxProperties
    const captured = []
    const listener = (e) => captured.push(e.detail)
    globalThis.document.addEventListener('hax-register-properties', listener)
    const host = globalThis.document.createElement('div')
    Object.assign(host, behaviors)
    host.haxProperties = behaviors.properties.haxProperties
    await host.setHaxProperties({
      settings: { configure: [{ property: 'a', inputMethod: 'textfield' }] },
    })
    globalThis.document.removeEventListener('hax-register-properties', listener)
    // tag is derived from the host tagName so nothing fires without a store
    expect(captured.length).to.equal(0)
    expect(host.getHaxJSONSchemaType('boolean')).to.equal('boolean')
    expect(host.validateSetting({ property: 'z' }).title).to.equal('z')
    expect(host.prototypeHaxProperties().api).to.equal('1')
    expect(host.postProcessgetHaxJSONSchema({ c: 3 }).c).to.equal(3)
    expect(
      Object.keys(host._getHaxJSONSchemaProperty([{ property: 'w' }])).join(','),
    ).to.equal('w')
    expect(host.validHAXPropertyInputMethod().includes('boolean')).to.equal(true)
    const hostProps = { api: '1' }
    host.haxProperties = hostProps
    expect(host.getHaxProperties() === hostProps).to.equal(true)
    expect(host._haxStoreReady({ detail: {} })).to.equal(undefined)
    globalThis.HAXWiring.haxProperties = originalProps
  })
})
