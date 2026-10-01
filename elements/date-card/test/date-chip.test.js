import { fixture, expect, html } from '@open-wc/testing'
// side-effect import: date-chip registers itself on the global registry
import '../lib/date-chip.js'

describe('date-chip', () => {
  it('derives month and day from a millisecond timestamp', async () => {
    // 2020-02-15T12:00:00Z so the derivation is timezone safe
    const stamp = Date.UTC(2020, 1, 15, 12)
    const el = await fixture(html`
      <date-chip .timestamp=${stamp}></date-chip>
    `)
    await el.updateComplete
    expect(el.month).to.equal('Feb')
    expect(el.day).to.equal(15)
    expect(el.unix).to.equal(null)
    expect(el.shadowRoot.querySelector('.date-month').textContent).to.equal(
      'Feb',
    )
    expect(el.shadowRoot.querySelector('.date-day').textContent).to.equal('15')
  })

  it('converts unix seconds timestamps before deriving', async () => {
    // attribute converts through the Number type property: 2000-01-01T12:00Z
    const el = await fixture(html`
      <date-chip timestamp="946728000" unix></date-chip>
    `)
    await el.updateComplete
    expect(el.timestamp).to.equal(946728000)
    expect(el.unix).to.equal(true)
    expect(el.month).to.equal('Jan')
    expect(el.day).to.equal(1)
  })

  it('recomputes when the timestamp property changes', async () => {
    const el = await fixture(
      html`<date-chip timestamp="946728000" unix></date-chip>`,
    )
    await el.updateComplete
    el.unix = false
    el.timestamp = Date.UTC(2021, 2, 20, 12)
    await el.updateComplete
    expect(el.month).to.equal('Mar')
    expect(el.day).to.equal(20)
  })

  it('renders empty month and day before any timestamp is set', async () => {
    const el = await fixture(html`<date-chip></date-chip>`)
    await el.updateComplete
    expect(el.month).to.equal(null)
    expect(el.day).to.equal(null)
    expect(el.shadowRoot.querySelector('.date-month').textContent).to.equal('')
    expect(el.shadowRoot.querySelector('.date-day').textContent).to.equal('')
  })

  it('defines the element on the custom element registry', () => {
    expect(globalThis.customElements.get('date-chip')).to.exist
  })
})
