import { fixture, expect, html, elementUpdated } from '@open-wc/testing'
import '../lib/loading-indicator.js'

// lib/ files only register on istanbul coverage when imported directly,
// so exercise the loading indicator on its own.
describe('loading-indicator', () => {
  it('is registered under its tag name', () => {
    expect(globalThis.customElements.get('loading-indicator')).to.exist
  })
  it('renders nothing by default', async () => {
    const el = await fixture(html`<loading-indicator></loading-indicator>`)
    expect(el.full).to.equal(false)
    expect(el.loading).to.equal(false)
    expect(el.hasAttribute('full')).to.equal(false)
    expect(el.hasAttribute('loading')).to.equal(false)
    expect(el.shadowRoot.querySelector('.progress-line')).to.equal(null)
  })
  it('reflects the loading and full attributes', async () => {
    const el = await fixture(
      html`<loading-indicator loading full></loading-indicator>`,
    )
    expect(el.loading).to.equal(true)
    expect(el.full).to.equal(true)
    expect(el.hasAttribute('loading')).to.equal(true)
    expect(el.hasAttribute('full')).to.equal(true)
    expect(el.shadowRoot.querySelector('.progress-line')).to.not.equal(null)
  })
  it('removes the progress line when loading stops', async () => {
    const el = await fixture(
      html`<loading-indicator loading full></loading-indicator>`,
    )
    el.loading = false
    await elementUpdated(el)
    expect(el.shadowRoot.querySelector('.progress-line')).to.equal(null)
  })
  it('shows the progress line when loading starts', async () => {
    const el = await fixture(html`<loading-indicator></loading-indicator>`)
    el.loading = true
    await elementUpdated(el)
    expect(el.shadowRoot.querySelector('.progress-line')).to.not.equal(null)
  })
})
