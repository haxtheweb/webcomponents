import { fixture, expect, html } from '@open-wc/testing'

import '../lib/model-info.js'
import { ModelInfo } from '../lib/model-info.js'

describe('model-info', () => {
  it('registers the custom element', () => {
    expect(globalThis.customElements.get('model-info')).to.exist
  })

  it('has the expected static tag', () => {
    expect(ModelInfo.tag).to.equal('model-info')
  })

  it('has an empty default title', async () => {
    const el = await fixture(html`<model-info></model-info>`)
    expect(el.title).to.equal('')
  })

  it('renders the accent bar, title, and column slots', async () => {
    const el = await fixture(html`
      <model-info title="Model Information">
        <p>Describe the model here.</p>
        <img slot="images" src="view.png" alt="Model view" />
      </model-info>
    `)
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#accent-color')).to.exist
    expect(
      el.shadowRoot.querySelector('#title h2').textContent,
    ).to.equal('Model Information')
    expect(el.shadowRoot.querySelector('.text slot')).to.exist
    expect(el.shadowRoot.querySelector('.images slot')).to.exist
    expect(el.textContent).to.include('Describe the model here.')
    await expect(el).shadowDom.to.be.accessible()
  })
})
