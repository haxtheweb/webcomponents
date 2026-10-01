import { fixture, expect, html } from '@open-wc/testing'

import '../lib/lrnsys-button.js'
import { LrnsysButton } from '../lib/lrnsys-button.js'
import { SimpleCta } from '../simple-cta.js'

describe('lrnsys-button legacy wrapper', () => {
  it('defines the legacy tag extending simple-cta', () => {
    expect(LrnsysButton.tag).to.equal('lrnsys-button')
    expect(new LrnsysButton()).to.be.instanceOf(SimpleCta)
    expect(globalThis.customElements.get('lrnsys-button')).to.exist
  })

  it('maps the legacy href attribute onto link', async () => {
    const el = await fixture(
      html`<lrnsys-button href="https://example.com/legacy"></lrnsys-button>`,
    )
    expect(el.link).to.equal('https://example.com/legacy')
    await el.updateComplete
    const a = el.shadowRoot.querySelector('a[part="simple-cta-link"]')
    expect(a.getAttribute('href')).to.equal('https://example.com/legacy')
  })

  it('maps a legacy href set after upgrade', async () => {
    const el = await fixture(html`<lrnsys-button></lrnsys-button>`)
    el.href = 'https://example.com/late'
    // mapping happens inside updated() so it schedules a second update
    await el.updateComplete
    await el.updateComplete
    expect(el.link).to.equal('https://example.com/late')
    expect(
      el.shadowRoot
        .querySelector('a[part="simple-cta-link"]')
        .getAttribute('href'),
    ).to.equal('https://example.com/late')
  })

  it('keeps an explicit link when both link and href are supplied', async () => {
    const el = await fixture(
      html`<lrnsys-button
        href="https://example.com/legacy"
        link="https://example.com/current"
      ></lrnsys-button>`,
    )
    expect(el.link).to.equal('https://example.com/current')
    expect(
      el.shadowRoot
        .querySelector('a[part="simple-cta-link"]')
        .getAttribute('href'),
    ).to.equal('https://example.com/current')
  })

  it('does not map an empty href', async () => {
    const el = await fixture(
      html`<lrnsys-button href="" link="#section"></lrnsys-button>`,
    )
    expect(el.link).to.equal('#section')
  })

  it('passes the a11y audit', async () => {
    const el = await fixture(
      html`<lrnsys-button
        href="https://example.com/legacy"
        label="Legacy button"
      ></lrnsys-button>`,
    )
    await expect(el).shadowDom.to.be.accessible()
  })
})
