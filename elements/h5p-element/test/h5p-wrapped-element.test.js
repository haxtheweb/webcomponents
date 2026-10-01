import { fixture, expect, html, aTimeout } from '@open-wc/testing'
import { H5pWrappedElement } from '../lib/h5p-wrapped-element.js'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'

describe('h5p-wrapped-element', () => {
  it('is defined with its tag name', () => {
    expect(globalThis.customElements.get('h5p-wrapped-element')).to.exist
  })

  it('renders the view mode iframe-loader slot by default', async () => {
    const el = await fixture(html`<h5p-wrapped-element></h5p-wrapped-element>`)
    await el.updateComplete
    expect(el.shadowRoot.querySelector('iframe-loader')).to.exist
    expect(el.shadowRoot.querySelector('[part="edit-screen"]')).to.not.exist
    // the editing class (and its min-height) only applies in edit mode
    expect(el.shadowRoot.querySelector('[part="container"]').className).to.equal('')
  })

  it('passes the a11y audit', async () => {
    const el = await fixture(html`<h5p-wrapped-element></h5p-wrapped-element>`)
    await el.updateComplete
    await expect(el).to.be.accessible()
  })

  it('exposes an edit link for slotted entity iframes', async () => {
    const el = await fixture(html`<h5p-wrapped-element></h5p-wrapped-element>`)
    await el.updateComplete
    const iframe = globalThis.document.createElement('iframe')
    iframe.setAttribute('src', '/entity_iframe/123')
    el.appendChild(iframe)
    await aTimeout(150)
    expect(el.__editLink).to.include('/123/edit')
    iframe.remove()
  })

  it('renders the edit screen when the store enters edit mode', async () => {
    const el = await fixture(html`<h5p-wrapped-element></h5p-wrapped-element>`)
    await el.updateComplete
    const iframe = globalThis.document.createElement('iframe')
    iframe.setAttribute('src', '/entity_iframe/456')
    el.appendChild(iframe)
    await aTimeout(150)
    const previous = store.editMode
    store.editMode = true
    await aTimeout(150)
    await el.updateComplete
    expect(el.__editMode).to.be.true
    expect(el.shadowRoot.querySelector('[part="edit-screen"]')).to.exist
    expect(el.__editLink).to.include('/456/edit')
    expect(el.shadowRoot.querySelector('[part="container"]').className).to.equal('editing')
    const link = el.shadowRoot.querySelector('[part="source-link"] a')
    expect(link).to.exist
    expect(link.getAttribute('href')).to.include('/456/edit')
    expect(link.getAttribute('target')).to.equal('_blank')
    expect(link.getAttribute('rel')).to.equal('noopener')
    iframe.remove()
    store.editMode = previous
    await aTimeout(150)
  })

  it('cleans up observers on disconnect', async () => {
    const el = await fixture(html`<h5p-wrapped-element></h5p-wrapped-element>`)
    await el.updateComplete
    el.remove()
  })
})
