import { fixture, expect, html } from '@open-wc/testing'

import '../lib/date-title.js'
import { DateTitle } from '../lib/date-title.js'

describe('date-title', () => {
  it('registers the custom element', () => {
    expect(globalThis.customElements.get('date-title')).to.exist
  })

  it('has the expected static tag', () => {
    expect(DateTitle.tag).to.equal('date-title')
  })

  it('has empty default values', async () => {
    const el = await fixture(html`<date-title></date-title>`)
    expect(el.title).to.equal('')
    expect(el.date).to.equal('')
  })

  it('renders circular text for the title and date', async () => {
    const el = await fixture(
      html`<date-title title="BADGE" date="2026-09-30"></date-title>`,
    )
    await el.updateComplete
    const container = el.shadowRoot.querySelector('.container')
    expect(container).to.exist
    const titleRing = container.querySelector('div.circTxt1')
    expect(titleRing).to.exist
    // one rotated paragraph per character of the title
    expect(titleRing.querySelectorAll('p').length).to.equal(5)
    expect(titleRing.textContent.replace(/\s/g, '')).to.equal('BADGE')
    const dateRing = container.querySelector('div.circTxt2')
    expect(dateRing).to.exist
    expect(dateRing.querySelectorAll('p').length).to.equal(10)
    expect(dateRing.textContent.replace(/\s/g, '')).to.equal('2026-09-30')
  })

  // BUG: updated() appends a fresh pair of rings on every property change
  // without clearing the container, so circular text stacks up on each update.
  it('BUG accumulates duplicate rings when properties change', async () => {
    const el = await fixture(
      html`<date-title title="BADGE" date="2026-09-30"></date-title>`,
    )
    await el.updateComplete
    const container = el.shadowRoot.querySelector('.container')
    expect(container.children.length).to.equal(2)
    el.title = 'SECOND'
    await el.updateComplete
    expect(container.children.length).to.equal(4)
    expect(container.querySelectorAll('div.circTxt1').length).to.equal(2)
  })
})
