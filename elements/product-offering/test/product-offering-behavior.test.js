import { fixture, expect, html } from '@open-wc/testing'
import '../product-offering.js'

// tiny inline image so no network request is ever issued
const DATA_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

describe('product-offering title splitting', () => {
  it('splits a multi word title into two rendered spans', async () => {
    const el = await fixture(html`
      <product-offering
        title="Product Launch"
        element-visible
      ></product-offering>
    `)
    await el.updateComplete
    expect(el._titleOne).to.equal('Product')
    expect(el._titleTwo).to.equal('Launch')
    const underline = el.shadowRoot.querySelector('span.underline')
    expect(underline.textContent).to.equal('Product')
    const second = el.shadowRoot.querySelectorAll('h4 span')[1]
    expect(second.textContent).to.equal('Launch')
  })

  it('keeps a single word title in the first span only', async () => {
    const el = await fixture(html`
      <product-offering title="Offering" element-visible></product-offering>
    `)
    await el.updateComplete
    expect(el._titleOne).to.equal('Offering')
    expect(el._titleTwo).to.equal(undefined)
    const underline = el.shadowRoot.querySelector('span.underline')
    expect(underline.textContent).to.equal('Offering')
  })

  it('re-splits the title when it changes after initial render', async () => {
    const el = await fixture(html`
      <product-offering title="First" element-visible></product-offering>
    `)
    await el.updateComplete
    el.title = 'New Words Here'
    await el.updateComplete
    expect(el._titleOne).to.equal('New')
    expect(el._titleTwo).to.equal('Words Here')
  })
})

describe('product-offering render', () => {
  it('renders image, icon and description when visible', async () => {
    const el = await fixture(html`
      <product-offering
        title="Offering"
        element-visible
        source=${DATA_IMAGE}
        alt="Product photo"
        icon="icons:store"
        accent-color="green"
        description="A fine product"
      ></product-offering>
    `)
    await el.updateComplete
    const img = el.shadowRoot.querySelector('img.image')
    expect(img.getAttribute('alt')).to.equal('Product photo')
    expect(img.getAttribute('src')).to.equal(DATA_IMAGE)
    expect(img.getAttribute('loading')).to.equal('lazy')
    const icon = el.shadowRoot.querySelector('simple-icon')
    expect(icon.getAttribute('accent-color')).to.equal('green')
    expect(icon.getAttribute('icon')).to.equal('icons:store')
    const description = el.shadowRoot.querySelector(
      '.sqaureDescription slot',
    )
    expect(description.textContent.trim()).to.equal('A fine product')
  })

  it('renders nothing before the element is visible', async () => {
    const el = await fixture(
      html`<product-offering title="Hidden"></product-offering>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('.container')).to.equal(null)
    el.elementVisible = true
    await el.updateComplete
    expect(el.shadowRoot.querySelector('.container')).to.not.equal(null)
  })

  it('defaults alt to empty and accent color to blue', async () => {
    const el = await fixture(html`
      <product-offering element-visible></product-offering>
    `)
    expect(el.alt).to.equal('')
    expect(el.accentColor).to.equal('blue')
  })

  it('defines the element on the custom element registry', () => {
    expect(globalThis.customElements.get('product-offering')).to.exist
  })
})
