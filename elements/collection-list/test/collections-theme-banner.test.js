import { fixture, expect, html } from '@open-wc/testing'
import '../lib/collections-theme-banner.js'

// direct lib import so istanbul sees lib/collections-theme-banner.js statements
describe('collections-theme-banner', () => {
  it('seeds defaults', async () => {
    const el = await fixture(
      html`<collections-theme-banner></collections-theme-banner>`,
    )
    expect(el.image).to.equal(null)
    expect(el.sitename).to.equal('')
    expect(el.pagetitle).to.equal('')
    expect(el.logo).to.equal(null)
  })

  it('renders the page title over the image', async () => {
    const el = await fixture(
      html`<collections-theme-banner
        image="banner.jpg"
        pagetitle="Page Title"
      ></collections-theme-banner>`,
    )
    await el.updateComplete
    const wrap = el.shadowRoot.querySelector('.wrap')
    expect(wrap === null).to.equal(false)
    expect(wrap.getAttribute('style').includes('banner.jpg')).to.equal(true)
    expect(el.shadowRoot.querySelector('.image-text h1').textContent).to
      .equal('Page Title')
  })

  it('renders the logo and site name in the branding bar', async () => {
    const el = await fixture(
      html`<collections-theme-banner
        logo="logo.png"
        sitename="Collections Site"
      ></collections-theme-banner>`,
    )
    await el.updateComplete
    const logo = el.shadowRoot.querySelector('.logo img')
    expect(logo === null).to.equal(false)
    expect(logo.getAttribute('src')).to.equal('logo.png')
    expect(logo.getAttribute('alt')).to.equal('Collections Site')
    expect(el.shadowRoot.querySelector('.company h2').textContent).to.equal(
      'Collections Site',
    )
    expect(el.shadowRoot.querySelector('.branding') === null).to.equal(false)
  })

  it('passes the a11y audit', async () => {
    const el = await fixture(
      html`<collections-theme-banner
        image="banner.jpg"
        logo="logo.png"
        sitename="Site"
        pagetitle="Title"
      ></collections-theme-banner>`,
    )
    await el.updateComplete
    await expect(el).shadowDom.to.be.accessible()
  })
})
