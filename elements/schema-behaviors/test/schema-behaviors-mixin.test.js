import { expect } from '@open-wc/testing'
import { LitElement } from 'lit'
import { fixture, html } from '@open-wc/testing'

// Directly import the mixin file so istanbul instruments it.
import { SchemaBehaviors } from '../schema-behaviors.js'

// Build a concrete element that uses the SchemaBehaviors mixin
class TestSchemaElement extends SchemaBehaviors(LitElement) {
  static get tag() {
    return 'test-schema-element'
  }
}
// Avoid double-registration across test reloads
if (!globalThis.customElements.get('test-schema-element')) {
  globalThis.customElements.define('test-schema-element', TestSchemaElement)
}

describe('SchemaBehaviors mixin — constructor', () => {
  it('initializes schemaResourceID to empty string', () => {
    const el = new TestSchemaElement()
    expect(el.schemaResourceID).to.equal('')
  })

  it('initializes schemaMap with default prefixes', () => {
    const el = new TestSchemaElement()
    expect(el.schemaMap).to.exist
    expect(el.schemaMap.prefix).to.exist
    expect(el.schemaMap.prefix.oer).to.equal('http://oerschema.org/')
    expect(el.schemaMap.prefix.schema).to.equal('http://schema.org/')
    expect(el.schemaMap.prefix.dc).to.equal('http://purl.org/dc/terms/')
    expect(el.schemaMap.prefix.foaf).to.equal('http://xmlns.com/foaf/0.1/')
    expect(el.schemaMap.prefix.cc).to.equal('http://creativecommons.org/ns#')
    expect(el.schemaMap.prefix.bib).to.equal('http://bib.schema.org')
  })

  it('static properties includes schemaMap as Object type', () => {
    const props = TestSchemaElement.properties
    expect(props).to.exist
    expect(props.schemaMap).to.exist
    expect(props.schemaMap.type).to.equal(Object)
  })
})

describe('SchemaBehaviors mixin — _schemaMapChanged', () => {
  let el

  beforeEach(async () => {
    el = await fixture(
      html`<test-schema-element></test-schema-element>`,
    )
  })

  it('generates a resourceID when no resource attribute is set', async () => {
    // Trigger _schemaMapChanged by assigning schemaMap
    el.schemaMap = {
      prefix: {
        oer: 'http://oerschema.org/',
        schema: 'http://schema.org/',
      },
    }
    // Wait for LitElement updated() to fire
    await el.updateComplete

    expect(el.schemaResourceID).to.not.equal('')
    expect(el.schemaResourceID).to.match(/^#/)
    expect(el.getAttribute('resource')).to.equal(el.schemaResourceID)
  })

  it('uses existing resource attribute when present', async () => {
    el.setAttribute('resource', '#existing-id')
    el.schemaMap = {
      prefix: {
        oer: 'http://oerschema.org/',
      },
    }
    await el.updateComplete

    expect(el.schemaResourceID).to.equal('#existing-id')
    // Should NOT have overwritten the existing resource attribute
    expect(el.getAttribute('resource')).to.equal('#existing-id')
  })

  it('builds and sets the prefix attribute from schemaMap.prefix', async () => {
    el.schemaMap = {
      prefix: {
        oer: 'http://oerschema.org/',
        schema: 'http://schema.org/',
        dc: 'http://purl.org/dc/terms/',
      },
    }
    await el.updateComplete

    const prefixAttr = el.getAttribute('prefix')
    expect(prefixAttr).to.exist
    expect(prefixAttr).to.include('oer:http://oerschema.org/')
    expect(prefixAttr).to.include('schema:http://schema.org/')
    expect(prefixAttr).to.include('dc:http://purl.org/dc/terms/')
  })

  it('does not set prefix attribute when prefix map is empty', async () => {
    // The constructor sets default schemaMap which triggers _schemaMapChanged
    // on first update and sets the prefix attribute. Remove it so we can
    // verify that an empty prefix map does NOT set it.
    el.removeAttribute('prefix')
    el.schemaMap = {
      prefix: {},
    }
    await el.updateComplete

    // prefix string is empty so setAttribute('prefix', ...) is not called
    expect(el.getAttribute('prefix')).to.equal(null)
  })

  it('generates a new resourceID when resource attribute is "null" string', async () => {
    el.setAttribute('resource', 'null')
    el.schemaMap = {
      prefix: {
        oer: 'http://oerschema.org/',
      },
    }
    await el.updateComplete

    // "null" string should trigger regeneration
    expect(el.schemaResourceID).to.not.equal('null')
    expect(el.schemaResourceID).to.match(/^#/)
    expect(el.getAttribute('resource')).to.equal(el.schemaResourceID)
  })

  it('generates a new resourceID when resource attribute is empty string', async () => {
    el.setAttribute('resource', '')
    el.schemaMap = {
      prefix: {
        oer: 'http://oerschema.org/',
      },
    }
    await el.updateComplete

    expect(el.schemaResourceID).to.not.equal('')
    expect(el.schemaResourceID).to.match(/^#/)
    expect(el.getAttribute('resource')).to.equal(el.schemaResourceID)
  })

  it('generates unique resourceIDs across multiple elements', async () => {
    const el2 = await fixture(
      html`<test-schema-element></test-schema-element>`,
    )

    el.schemaMap = { prefix: { oer: 'http://oerschema.org/' } }
    el2.schemaMap = { prefix: { oer: 'http://oerschema.org/' } }
    await el.updateComplete
    await el2.updateComplete

    expect(el.schemaResourceID).to.not.equal(el2.schemaResourceID)
  })

  it('calls super.updated when available (mixin chains correctly)', async () => {
    // Create a class that has its own updated to verify chaining
    class ChainedElement extends SchemaBehaviors(LitElement) {
      static get tag() {
        return 'chained-schema-element'
      }
      constructor() {
        super()
        this.updatedCalled = false
      }
      updated(changed) {
        this.updatedCalled = true
        super.updated(changed)
      }
    }
    if (!globalThis.customElements.get('chained-schema-element')) {
      globalThis.customElements.define('chained-schema-element', ChainedElement)
    }

    const chained = await fixture(
      html`<chained-schema-element></chained-schema-element>`,
    )
    chained.schemaMap = { prefix: { oer: 'http://oerschema.org/' } }
    await chained.updateComplete

    expect(chained.updatedCalled).to.be.true
    expect(chained.schemaResourceID).to.match(/^#/)
  })
})

describe('SchemaBehaviors mixin — updated lifecycle', () => {
  it('triggers _schemaMapChanged only when schemaMap property changes', async () => {
    const el = await fixture(
      html`<test-schema-element></test-schema-element>`,
    )

    // The constructor sets default schemaMap, so _schemaMapChanged fires
    // on the first update and sets the resource attribute.
    expect(el.getAttribute('resource')).to.not.equal(null)

    // Spy on _schemaMapChanged to verify it is NOT called for non-schemaMap changes
    let schemaMapChangedCount = 0
    const originalSchemaMapChanged = el._schemaMapChanged.bind(el)
    el._schemaMapChanged = function (newValue, oldValue) {
      schemaMapChangedCount++
      return originalSchemaMapChanged(newValue, oldValue)
    }

    // Changing a different property should not re-trigger _schemaMapChanged
    el.schemaResourceID = 'manual-value'
    await el.updateComplete

    // _schemaMapChanged should not have been called because schemaMap did not change
    expect(schemaMapChangedCount).to.equal(0)

    // Now change schemaMap — should trigger _schemaMapChanged
    el.schemaMap = { prefix: { oer: 'http://oerschema.org/' } }
    await el.updateComplete

    expect(schemaMapChangedCount).to.equal(1)
    // _schemaMapChanged reads getAttribute('resource') which was set on
    // first update to the generated ID. Setting schemaResourceID property
    // does NOT update the attribute, so the mixin re-reads the attribute.
    // Verify it used the attribute value (not the property 'manual-value')
    const attrResource = el.getAttribute('resource')
    expect(el.schemaResourceID).to.equal(attrResource)
  })

  it('uses resource attribute value when set before schemaMap change', async () => {
    const el = await fixture(
      html`<test-schema-element></test-schema-element>`,
    )

    // Override the resource attribute with a custom value
    el.setAttribute('resource', '#custom-attr-id')
    el.schemaMap = { prefix: { oer: 'http://oerschema.org/' } }
    await el.updateComplete

    // _schemaMapChanged reads the attribute, so it should use our custom value
    expect(el.schemaResourceID).to.equal('#custom-attr-id')
    expect(el.getAttribute('resource')).to.equal('#custom-attr-id')
  })
})

describe('SchemaBehaviors mixin — fixture a11y preserved', () => {
  it('passes a11y audit with schema behaviors applied', async () => {
    const el = await fixture(
      html`<test-schema-element></test-schema-element>`,
    )
    el.schemaMap = { prefix: { oer: 'http://oerschema.org/' } }
    await el.updateComplete
    await expect(el).shadowDom.to.be.accessible()
  })
})
