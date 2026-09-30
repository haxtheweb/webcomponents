import { fixture, expect, html } from '@open-wc/testing'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'

import '../lib/lrn-h5p.js'
import { LrnH5p } from '../lib/lrn-h5p.js'

const settle = () => new Promise((resolve) => setTimeout(resolve, 60))

describe('lrn-h5p', () => {
  let savedEditMode

  before(() => {
    savedEditMode = store.editMode
  })

  after(() => {
    store.editMode = savedEditMode
  })

  it('registers the custom element', () => {
    expect(globalThis.customElements.get('lrn-h5p')).to.exist
  })

  it('has the expected static tag and haxProperties', () => {
    expect(LrnH5p.tag).to.equal('lrn-h5p')
    const props = LrnH5p.haxProperties
    expect(props.gizmo.title).to.equal('H5P Element')
    expect(props.settings.configure.length).to.equal(1)
    expect(props.settings.configure[0].inputMethod).to.equal('code-editor')
  })

  it('renders a container with slotted content when no iframe is present', async () => {
    const el = await fixture(
      html`<lrn-h5p><p>Interactive content</p></lrn-h5p>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#container')).to.exist
    expect(el.shadowRoot.querySelector('#edit')).to.not.exist
    expect(el.textContent).to.include('Interactive content')
  })

  it('removes text nodes containing script tags at construction', async () => {
    const el = await fixture(
      html`<lrn-h5p
        ><span>before&lt;script&gt;alert(1)&lt;/script&gt;after</span></lrn-h5p
      >`,
    )
    const span = el.querySelector('span')
    expect(span).to.exist
    expect(span.textContent).to.equal('')
  })

  it('exposes an edit link for h5p embeds while in edit mode', async () => {
    store.editMode = true
    const el = await fixture(html`
      <lrn-h5p>
        <iframe
          src="https://h5p.org/embed/123"
          srcdoc="<p>local embed</p>"
          title="h5p embed"
        ></iframe>
      </lrn-h5p>
    `)
    await settle()
    await el.updateComplete
    expect(el._editing).to.equal(true)
    const edit = el.shadowRoot.querySelector('#edit')
    expect(edit).to.exist
    expect(edit.getAttribute('href')).to.equal('https://h5p.org/node/123/edit')
    expect(edit.getAttribute('target')).to.equal('_blank')
    store.editMode = false
  })

  it('hides the edit link outside edit mode', async () => {
    const el = await fixture(html`
      <lrn-h5p>
        <iframe
          src="https://h5p.org/embed/456"
          srcdoc="<p>local embed</p>"
          title="h5p embed"
        ></iframe>
      </lrn-h5p>
    `)
    await settle()
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#container')).to.exist
    expect(el.shadowRoot.querySelector('#edit')).to.not.exist
  })

  it('adds a token edit link through postProcessgetHaxJSONSchema', () => {
    const el = globalThis.document.createElement('lrn-h5p')
    const schema = el.postProcessgetHaxJSONSchema({ properties: {} })
    expect(schema.properties.__editThis.component.slot).to.equal('Edit')
    expect(schema.properties.__editThis.component.properties.href).to.equal('')
    el.tokenData = {
      editEndpoint: 'https://example.com/edit/1',
      editText: 'Edit this H5P',
      schema: { customField: { type: 'string' } },
    }
    const schema2 = el.postProcessgetHaxJSONSchema({ properties: {} })
    expect(schema2.properties.customField.type).to.equal('string')
    expect(schema2.properties.__editThis.component.properties.href).to.equal(
      'https://example.com/edit/1',
    )
    expect(schema2.properties.__editThis.component.slot).to.equal(
      'Edit this H5P',
    )
  })
})
