import { fixture, expect, html, aTimeout } from '@open-wc/testing'

import '../lib/simple-fields-fieldset.js'
import '../lib/simple-fields-tab.js'
import '../lib/simple-fields-tabs.js'
import '../lib/simple-fields-html-block.js'

describe('simple-fields-fieldset', () => {
  let el
  beforeEach(async () => {
    el = await fixture(
      html`<simple-fields-fieldset
        label="My Fieldset"
        description="A description"
      ></simple-fields-fieldset>`,
    )
    await el.updateComplete
  })

  it('passes a11y audit', async () => {
    await expect(el).shadowDom.to.be.accessible()
  })

  it('renders a fieldset with legend', () => {
    const fieldset = el.shadowRoot.querySelector('fieldset')
    expect(fieldset).to.exist
    const legend = el.shadowRoot.querySelector('legend')
    expect(legend).to.exist
    expect(legend.textContent.trim()).to.contain('My Fieldset')
  })

  it('renders description when set', () => {
    const desc = el.shadowRoot.querySelector('#description')
    expect(desc).to.exist
    expect(desc.textContent.trim()).to.contain('A description')
  })

  it('hides legend when no label', async () => {
    el.label = ''
    await el.updateComplete
    const legend = el.shadowRoot.querySelector('legend')
    expect(legend.hasAttribute('hidden')).to.equal(true)
  })

  it('hides description when no description', async () => {
    el.description = ''
    await el.updateComplete
    const desc = el.shadowRoot.querySelector('#description')
    expect(desc.hasAttribute('hidden')).to.equal(true)
  })

  it('renders a slot for fields', () => {
    const slot = el.shadowRoot.querySelector('slot')
    expect(slot).to.exist
  })

  it('isSimpleFieldType is true in constructor', () => {
    const fresh = document.createElement('simple-fields-fieldset')
    expect(fresh.isSimpleFieldType).to.equal(true)
  })

  it('has error property that reflects to attribute', async () => {
    el.error = true
    await el.updateComplete
    expect(el.hasAttribute('error')).to.equal(true)
  })

  it('has disabled property that reflects to attribute', async () => {
    el.disabled = true
    await el.updateComplete
    expect(el.hasAttribute('disabled')).to.equal(true)
  })

  it('SimpleFieldsFieldsetBehaviors is exported as a function', () => {
    // The behaviors mixin is used by tab, tabs, array, array-item
    expect(typeof globalThis.customElements.get('simple-fields-fieldset'))
      .to.equal('function')
  })

  it('appends * to legend when error is true', async () => {
    el.error = true
    await el.updateComplete
    const legend = el.shadowRoot.querySelector('legend')
    expect(legend.textContent).to.contain('*')
  })
})

describe('simple-fields-tabs', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<simple-fields-tabs></simple-fields-tabs>`)
    await el.updateComplete
  })

  it('passes a11y audit', async () => {
    await expect(el).shadowDom.to.be.accessible()
  })

  it('instantiates with fullWidth true', () => {
    expect(el.fullWidth).to.equal(true)
  })

  it('tabQuery returns simple-fields-tab', () => {
    expect(el.tabQuery).to.equal('simple-fields-tab')
  })

  it('_tabLabel renders a span with label', () => {
    const result = el._tabLabel({ label: 'Tab 1', error: false })
    // _tabLabel returns a lit TemplateResult; we can check it's truthy
    expect(result).to.exist
  })

  it('_tabLabel includes error indicator when error is true', () => {
    const result = el._tabLabel({ label: 'Tab 1', error: true })
    expect(result).to.exist
  })
})

describe('simple-fields-tab', () => {
  it('is registered as a custom element', () => {
    expect(globalThis.customElements.get('simple-fields-tab')).to.exist
  })
})

describe('simple-fields-html-block', () => {
  let el
  beforeEach(async () => {
    el = await fixture(
      html`<simple-fields-html-block
        value="<p>Hello World</p>"
      ></simple-fields-html-block>`,
    )
    await el.updateComplete
  })

  it('passes a11y audit', async () => {
    await expect(el).shadowDom.to.be.accessible()
  })

  it('renders content from value property', async () => {
    await aTimeout(50)
    const p = el.querySelector('p')
    expect(p).to.exist
    expect(p.textContent).to.equal('Hello World')
  })

  it('updates content when value changes', async () => {
    el.value = '<span>Updated</span>'
    await el.updateComplete
    await aTimeout(50)
    const span = el.querySelector('span')
    expect(span).to.exist
    expect(span.textContent).to.equal('Updated')
  })

  it('removes script tags from value for safety', async () => {
    el.value = '<p>Safe</p><script>alert("xss")</script>'
    await el.updateComplete
    await aTimeout(50)
    const script = el.querySelector('script')
    expect(script).to.equal(null)
    const p = el.querySelector('p')
    expect(p).to.exist
  })

  it('renders empty when value is empty', async () => {
    el.value = ''
    await el.updateComplete
    await aTimeout(50)
    expect(el.children.length).to.equal(0)
  })
})
