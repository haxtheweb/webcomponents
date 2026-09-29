import { expect } from '@open-wc/testing'
import { HAXWiring } from '../lib/HAXWiring.js'

// direct lib import so istanbul sees lib/HAXWiring.js statements
describe('HAXWiring class', () => {
  let wiring
  let originalHaxStore
  let originalFetch
  let originalWarn
  let originalWCGlobalBasePath

  beforeEach(() => {
    wiring = new HAXWiring()
    originalHaxStore = globalThis.HaxStore
    originalFetch = globalThis.fetch
    originalWarn = console.warn
    originalWCGlobalBasePath = globalThis.WCGlobalBasePath
  })

  afterEach(() => {
    if (originalHaxStore === undefined) {
      delete globalThis.HaxStore
    } else {
      globalThis.HaxStore = originalHaxStore
    }
    globalThis.fetch = originalFetch
    console.warn = originalWarn
    globalThis.WCGlobalBasePath = originalWCGlobalBasePath
  })

  it('seeds a valid default haxProperties object', () => {
    expect(wiring.haxProperties.type).to.equal('element')
    expect(wiring.haxProperties.editingElement).to.equal('core')
    expect(wiring.haxProperties.hideDefaultSettings).to.equal(false)
    expect(wiring.haxProperties.canScale).to.equal(false)
    expect(wiring.haxProperties.canEditSource).to.equal(true)
    expect(JSON.stringify(wiring.haxProperties.settings.configure)).to.equal(
      '[]',
    )
    expect(JSON.stringify(wiring.haxProperties.settings.advanced)).to.equal(
      '[]',
    )
    expect(JSON.stringify(wiring.haxProperties.settings.developer)).to.equal(
      '[]',
    )
  })

  it('exposes the full wiring api as instance methods', () => {
    expect(typeof wiring.setup).to.equal('function')
    expect(typeof wiring._haxStoreReady).to.equal('function')
    expect(typeof wiring.setHaxProperties).to.equal('function')
    expect(typeof wiring.readyToFireHAXSchema).to.equal('function')
    expect(typeof wiring.standardAdvancedProps).to.equal('function')
    expect(typeof wiring.validateSetting).to.equal('function')
    expect(typeof wiring.getHaxProperties).to.equal('function')
    expect(typeof wiring.getHaxJSONSchema).to.equal('function')
    expect(typeof wiring.postProcessgetHaxJSONSchema).to.equal('function')
    expect(typeof wiring._getHaxJSONSchemaProperty).to.equal('function')
    expect(typeof wiring.getHaxJSONSchemaType).to.equal('function')
    expect(typeof wiring.validHAXPropertyInputMethod).to.equal('function')
    expect(typeof wiring.prototypeHaxProperties).to.equal('function')
  })

  it('setup delegates to setHaxProperties and derives tag from tagName', async () => {
    const seen = []
    wiring.setHaxProperties = (props, tag, context, isReady) => {
      seen.push({ props, tag, context, isReady })
      return 'delegated'
    }
    const props = { settings: { configure: [] } }
    const result = wiring.setup(props, 'given-tag')
    expect(result).to.equal('delegated')
    expect(seen.length).to.equal(1)
    expect(seen[0].tag).to.equal('given-tag')
    expect(seen[0].isReady).to.equal(false)
    // when tagName exists it wins over the supplied tag
    wiring.tagName = 'Wire-Tag'
    wiring.setup(props, 'given-tag')
    expect(seen[1].tag).to.equal('wire-tag')
  })

  it('setHaxProperties fills every core default when settings exist', async () => {
    const props = {
      settings: {
        configure: [{ property: 'title', inputMethod: 'textfield' }],
        advanced: [],
        developer: [],
      },
    }
    await wiring.setHaxProperties(props, 'some-tag', globalThis.document, false)
    expect(props.api).to.equal('1')
    expect(props.type).to.equal('element')
    expect(props.editingElement).to.equal('core')
    expect(props.hideDefaultSettings).to.equal(false)
    expect(props.canScale).to.equal(true)
    expect(props.canEditSource).to.equal(false)
    expect(props.contentEditable).to.equal(false)
    expect(props.gizmo).to.equal(false)
    expect(
      JSON.stringify(props.designSystem),
    ).to.equal(
      JSON.stringify({
        primary: false,
        accent: false,
        text: false,
        card: false,
        designTreatment: false,
      }),
    )
    expect(props.saveOptions.wipeSlot).to.equal(false)
    expect(props.documentation.howTo).to.equal(null)
    expect(props.documentation.purpose).to.equal(null)
    expect(JSON.stringify(props.demoSchema)).to.equal('[]')
    // valid entries were normalized
    expect(props.settings.configure[0].title).to.equal('title')
    // standard advanced props were appended
    expect(
      props.settings.advanced.map((s) => s.attribute).join(','),
    ).to.equal('data-hax-lock')
    expect(
      props.settings.developer.map((s) => s.attribute).join(','),
    ).to.equal('class,style,prefix,typeof,property,resource,id,slot')
  })

  it('setHaxProperties drops invalid settings entries from every group', async () => {
    const props = {
      settings: {
        configure: [{ nothing: true }],
        advanced: [{ alsoNothing: true }],
        developer: [{}],
      },
    }
    await wiring.setHaxProperties(props, 'some-tag', globalThis.document, false)
    expect(props.settings.configure.length).to.equal(0)
    expect(props.settings.advanced.length).to.equal(1)
    expect(props.settings.developer.length).to.equal(8)
  })

  it('setHaxProperties leaves settings untouched when absent', async () => {
    const props = {}
    await wiring.setHaxProperties(props, 'some-tag', globalThis.document, false)
    expect(props.settings).to.equal(undefined)
    expect(props.api).to.equal('1')
    expect(props.saveOptions.wipeSlot).to.equal(false)
  })

  it('setHaxProperties honors hideDefaultSettings', async () => {
    const props = {
      hideDefaultSettings: true,
      settings: { configure: [], advanced: [], developer: [] },
    }
    await wiring.setHaxProperties(props, 'some-tag', globalThis.document, false)
    expect(props.settings.advanced.length).to.equal(0)
    expect(props.settings.developer.length).to.equal(0)
  })

  it('setHaxProperties supports loading props from a url string', async () => {
    const propsObj = {
      settings: { configure: [{ property: 'title', inputMethod: 'textfield' }] },
    }
    globalThis.fetch = async () => ({ json: async () => propsObj })
    await wiring.setHaxProperties(
      'https://example.com/props.json',
      'some-tag',
      globalThis.document,
      false,
    )
    expect(propsObj.api).to.equal('1')
    expect(propsObj.settings.configure[0].title).to.equal('title')
  })

  // BUG: lib/HAXWiring.js:343-346 — when fetch resolves without a usable
  // response, props becomes `false` and the very next `props.api` write
  // throws (Cannot create property on boolean) in strict mode modules.
  // Documents the crash for the fix swarm; flip once guarded.
  it('setHaxProperties throws when the fetched response has no json', async () => {
    globalThis.fetch = async () => false
    let error = null
    try {
      await wiring.setHaxProperties(
        'https://example.com/broken.json',
        'some-tag',
        globalThis.document,
        false,
      )
    } catch (e) {
      error = e
    }
    expect(error instanceof TypeError).to.equal(true)
  })

  it('setHaxProperties warns when the api version is unknown', async () => {
    const warnings = []
    console.warn = (...args) => warnings.push(args.join(' '))
    const props = { api: '2' }
    await wiring.setHaxProperties(props, 'some-tag', globalThis.document, false)
    expect(warnings.length).to.equal(1)
    expect(warnings[0].includes('valid usage of hax API')).to.equal(true)
    expect(props.type).to.equal(undefined)
  })

  it('setHaxProperties dynamically imports a gizmo iconLib via WCGlobalBasePath', async () => {
    globalThis.WCGlobalBasePath = '/'
    const props = {
      settings: { configure: [] },
      gizmo: { iconLib: 'elements/utils/lib/events.js' },
    }
    await wiring.setHaxProperties(props, 'some-tag', globalThis.document, false)
    expect(props.gizmo.iconLib).to.equal('elements/utils/lib/events.js')
  })

  it('setHaxProperties falls back to an import.meta.url base path for iconLib', async () => {
    delete globalThis.WCGlobalBasePath
    const props = {
      settings: { configure: [] },
      gizmo: { iconLib: 'elements/utils/lib/events.js' },
    }
    await wiring.setHaxProperties(props, 'some-tag', globalThis.document, false)
    expect(props.gizmo.iconLib).to.equal('elements/utils/lib/events.js')
  })

  it('setHaxProperties stores props on the wiring when no tag is given', async () => {
    const props = { settings: { configure: [] } }
    await wiring.setHaxProperties(props, '', wiring, false)
    expect(wiring.haxProperties === props).to.equal(true)
  })

  it('setHaxProperties prefers a _setHaxProperties override when no tag is given', async () => {
    let received = null
    wiring._setHaxProperties = (p) => {
      received = p
    }
    const props = { settings: { configure: [] } }
    await wiring.setHaxProperties(props, '', wiring, false)
    expect(received === props).to.equal(true)
  })

  it('readyToFireHAXSchema dispatches hax-register-properties when no store exists', async () => {
    const captured = []
    const listener = (e) => captured.push(e.detail)
    globalThis.document.addEventListener('hax-register-properties', listener)
    const props = { api: '1' }
    await wiring.setHaxProperties(props, 'Some-Tag', globalThis.document, true)
    globalThis.document.removeEventListener('hax-register-properties', listener)
    expect(captured.length).to.equal(1)
    expect(captured[0].tag).to.equal('some-tag')
    expect(captured[0].properties === props).to.equal(true)
  })

  it('readyToFireHAXSchema dispatches for a tag when the store exists', async () => {
    globalThis.HaxStore = {
      instance: { ready: false, elementList: {} },
      requestAvailability() {
        return { designSystemHAXProperties(props) { return props } }
      },
    }
    const captured = []
    const listener = (e) => captured.push(e.detail)
    globalThis.document.addEventListener('hax-register-properties', listener)
    const props = { settings: { configure: [] } }
    await wiring.setHaxProperties(props, 'Some-Tag', globalThis.document, true)
    globalThis.document.removeEventListener('hax-register-properties', listener)
    expect(captured.length).to.equal(1)
    expect(captured[0].tag).to.equal('some-tag')
  })

  it('readyToFireHAXSchema falls back to the context tagName when no tag given', () => {
    const context = globalThis.document.createElement('div')
    const captured = []
    context.addEventListener('hax-register-properties', (e) =>
      captured.push(e.detail),
    )
    wiring.readyToFireHAXSchema('', { api: '1' }, context)
    expect(captured.length).to.equal(1)
    expect(captured[0].tag).to.equal('div')
  })

  it('readyToFireHAXSchema warns when nothing can be derived', () => {
    const warnings = []
    console.warn = (...args) => warnings.push(args.join(' '))
    wiring.readyToFireHAXSchema('', { api: '1' }, { notAnElement: true })
    expect(warnings.length).to.equal(2)
    expect(warnings[1].includes('missed our checks')).to.equal(true)
  })

  it('_haxStoreReady ignores events without detail', () => {
    wiring.tagName = 'Wire-Tag'
    let threw = false
    try {
      wiring._haxStoreReady({})
    } catch (e) {
      threw = true
    }
    expect(threw).to.equal(false)
  })

  it('_haxStoreReady fires registration when the store is absent', () => {
    wiring.tagName = 'Wire-Tag'
    const captured = []
    wiring.dispatchEvent = (evt) => {
      captured.push(evt.detail)
      return true
    }
    wiring._haxStoreReady({ detail: true })
    expect(captured.length).to.equal(1)
    expect(captured[0].tag).to.equal('wire-tag')
    expect(captured[0].properties === wiring.haxProperties).to.equal(true)
  })

  it('_haxStoreReady fires registration when the store lacks the element', () => {
    globalThis.HaxStore = { instance: { elementList: {} } }
    wiring.tagName = 'Wire-Tag'
    const captured = []
    wiring.dispatchEvent = (evt) => {
      captured.push(evt.detail)
      return true
    }
    wiring._haxStoreReady({ detail: true })
    expect(captured.length).to.equal(1)
    expect(captured[0].tag).to.equal('wire-tag')
  })

  it('_haxStoreReady can use the tagName itself when tag is empty', () => {
    globalThis.HaxStore = { instance: { elementList: {} } }
    wiring.tagName = ''
    const captured = []
    wiring.dispatchEvent = (evt) => {
      captured.push(evt.detail)
      return true
    }
    wiring._haxStoreReady({ detail: true })
    expect(captured.length).to.equal(1)
    expect(captured[0].tag).to.equal('')
  })

  it('_haxStoreReady stays quiet when the element is already registered', () => {
    globalThis.HaxStore = { instance: { elementList: { 'wire-tag': {} } } }
    wiring.tagName = 'Wire-Tag'
    const captured = []
    wiring.dispatchEvent = (evt) => {
      captured.push(evt.detail)
      return true
    }
    wiring._haxStoreReady({ detail: true })
    expect(captured.length).to.equal(0)
  })

  it('standardAdvancedProps injects the standard advanced and developer settings', () => {
    const props = { settings: { configure: [], advanced: [], developer: [] } }
    wiring.standardAdvancedProps(props, 'tag')
    expect(props.settings.advanced.length).to.equal(1)
    expect(props.settings.advanced[0].attribute).to.equal('data-hax-lock')
    expect(props.settings.advanced[0].inputMethod).to.equal('boolean')
    expect(props.settings.advanced[0].title).to.equal('Lock editing')
    expect(
      props.settings.developer.map((s) => s.attribute).join(','),
    ).to.equal('class,style,prefix,typeof,property,resource,id,slot')
  })

  describe('validateSetting', () => {
    it('rejects settings with no property, slot or attribute', () => {
      expect(wiring.validateSetting({})).to.equal(false)
      expect(wiring.validateSetting({ title: 'no target' })).to.equal(false)
    })

    it('fills defaults for a property setting', () => {
      const setting = wiring.validateSetting({ property: 'source' })
      expect(setting).to.not.equal(false)
      expect(setting.title).to.equal('source')
      expect(setting.description).to.equal('')
      expect(setting.inputMethod).to.equal('textfield')
      expect(setting.type).to.equal('settings')
      expect(setting.icon).to.equal('android')
      expect(JSON.stringify(setting.options)).to.equal('{}')
      expect(setting.required).to.equal(false)
      expect(setting.disabled).to.equal(false)
      expect(setting.validation).to.equal('.*')
      expect(setting.validationType).to.equal('')
    })

    it('fills title from attribute when present', () => {
      const setting = wiring.validateSetting({ attribute: 'data-color' })
      expect(setting.title).to.equal('data-color')
    })

    it('preserves provided values', () => {
      const setting = wiring.validateSetting({
        property: 'p',
        title: 'T',
        description: 'D',
        inputMethod: 'boolean',
        type: 'group',
        icon: 'icons:android',
        options: { a: 1 },
        required: true,
        disabled: true,
        validation: '[0-9]',
        validationType: 'text',
      })
      expect(setting.title).to.equal('T')
      expect(setting.description).to.equal('D')
      expect(setting.inputMethod).to.equal('boolean')
      expect(setting.type).to.equal('group')
      expect(setting.icon).to.equal('icons:android')
      expect(setting.options.a).to.equal(1)
      expect(setting.required).to.equal(true)
      expect(setting.disabled).to.equal(true)
      expect(setting.validation).to.equal('[0-9]')
      expect(setting.validationType).to.equal('text')
    })

    it('adds slot wrapper defaults for slot settings', () => {
      const setting = wiring.validateSetting({ slot: 'content' })
      expect(setting.slotWrapper).to.equal('span')
      expect(JSON.stringify(setting.slotAttributes)).to.equal('{}')
    })

    // BUG: lib/HAXWiring.js:627-633 — slot-only settings never receive a
    // title: the fallback reads setting.property which is undefined when
    // only a slot was supplied. Documents current behavior for the fix
    // swarm; flip this once title falls back to slot.
    it('slot-only settings do not receive a title', () => {
      const setting = wiring.validateSetting({ slot: 'content' })
      expect(setting.title).to.equal(undefined)
    })
  })

  it('getHaxProperties returns the current haxProperties', () => {
    const custom = { api: '1' }
    wiring.haxProperties = custom
    expect(wiring.getHaxProperties() === custom).to.equal(true)
  })

  describe('getHaxJSONSchema', () => {
    it('builds a json schema for a settings group', () => {
      const haxProperties = {
        settings: { configure: [{ property: 'title', inputMethod: 'textfield' }] },
      }
      const schema = wiring.getHaxJSONSchema('configure', haxProperties)
      expect(schema.$schema).to.equal('http://json-schema.org/schema#')
      expect(schema.title).to.equal('HAX configure form schema')
      expect(schema.type).to.equal('object')
      expect(schema.properties.title.type).to.equal('string')
    })

    it('defaults to configure and the target haxProperties', () => {
      wiring.haxProperties = {
        settings: { configure: [{ property: 'title', inputMethod: 'textfield' }] },
      }
      const schema = wiring.getHaxJSONSchema()
      expect(schema.title).to.equal('HAX configure form schema')
      expect(schema.properties.title.type).to.equal('string')
    })

    it('post processes through a registered gizmo element when possible', () => {
      class TestPostProcEl extends globalThis.HTMLElement {
        postProcessgetHaxJSONSchema(schema) {
          schema.processedBy = 'gizmo'
          return schema
        }
      }
      globalThis.customElements.define('test-post-proc-el', TestPostProcEl)
      const haxProperties = {
        settings: { configure: [] },
        gizmo: { tag: 'test-post-proc-el' },
      }
      const schema = wiring.getHaxJSONSchema('configure', haxProperties)
      expect(schema.processedBy).to.equal('gizmo')
    })

    it('falls back to the target post processor when the gizmo lacks one', () => {
      globalThis.customElements.define(
        'test-no-post-proc-el',
        class extends globalThis.HTMLElement {},
      )
      wiring.postProcessgetHaxJSONSchema = (schema) => {
        schema.processedBy = 'target'
        return schema
      }
      const haxProperties = {
        settings: { configure: [] },
        gizmo: { tag: 'test-no-post-proc-el' },
      }
      const schema = wiring.getHaxJSONSchema('configure', haxProperties)
      expect(schema.processedBy).to.equal('target')
    })

    it('uses the target post processor when there is no gizmo', () => {
      wiring.postProcessgetHaxJSONSchema = (schema) => {
        schema.processedBy = 'target'
        return schema
      }
      const schema = wiring.getHaxJSONSchema('configure', {
        settings: { configure: [] },
      })
      expect(schema.processedBy).to.equal('target')
    })

    it('postProcessgetHaxJSONSchema is an identity by default', () => {
      const schema = { keep: 'me' }
      expect(wiring.postProcessgetHaxJSONSchema(schema) === schema).to.equal(
        true,
      )
    })
  })

  it('getHaxJSONSchemaType maps known input methods', () => {
    expect(wiring.getHaxJSONSchemaType('boolean')).to.equal('boolean')
    expect(wiring.getHaxJSONSchemaType('number')).to.equal('number')
    expect(wiring.getHaxJSONSchemaType('textarea')).to.equal('string')
  })

  it('getHaxJSONSchemaType falls back to string for unknown methods', () => {
    expect(wiring.getHaxJSONSchemaType('textfield')).to.equal('string')
    expect(wiring.getHaxJSONSchemaType('bogus')).to.equal('string')
  })

  it('validHAXPropertyInputMethod lists supported methods', () => {
    const methods = wiring.validHAXPropertyInputMethod()
    expect(Array.isArray(methods)).to.equal(true)
    expect(methods.includes('boolean')).to.equal(true)
    expect(methods.includes('textarea')).to.equal(true)
    expect(methods.includes('alt')).to.equal(true)
  })

  it('_getHaxJSONSchemaProperty converts settings to schema properties', () => {
    const props = wiring._getHaxJSONSchemaProperty([
      { property: 'a', inputMethod: 'boolean' },
      { attribute: 'b', inputMethod: 'textfield' },
    ])
    expect(Object.keys(props).join(',')).to.equal('a,b')
    expect(props.a.type).to.equal('boolean')
  })

  it('prototypeHaxProperties returns a fully valid example schema', async () => {
    const props = wiring.prototypeHaxProperties()
    expect(props.api).to.equal('1')
    expect(props.gizmo.title).to.equal('Tag name')
    expect(props.gizmo.handles[0].type).to.equal('data')
    expect(
      props.saveOptions.unsetAttributes.join(','),
    ).to.equal('end-point,secondary-color')
    expect(props.demoSchema.length).to.equal(1)
    expect(props.documentation.howTo).to.equal('https://haxtheweb.org/welcome')
    // the prototype must survive a full validation pass
    await wiring.setHaxProperties(props, 'proto-tag', globalThis.document, false)
    expect(props.settings.configure.length).to.equal(4)
    expect(props.settings.advanced[0].property).to.equal('secondaryColor')
  })

  it('setup uses the ready store path when HaxStore is ready', async () => {
    globalThis.HaxStore = {
      instance: { ready: true, elementList: {} },
      requestAvailability() {
        return { designSystemHAXProperties(props) { return props } }
      },
    }
    const seen = []
    wiring.readyToFireHAXSchema = (tag, props, context) => {
      seen.push({ tag, props, context })
    }
    await wiring.setup({ settings: { configure: [] } }, 'ready-tag')
    expect(seen.length).to.equal(1)
    expect(seen[0].tag).to.equal('ready-tag')
  })
})
