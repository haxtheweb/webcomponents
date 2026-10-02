import { fixture, expect, html } from '@open-wc/testing'
import { BR } from '../b-r.js'

// b-r renders a stack of <br> elements for vertical spacing. amount drives
// the count; amount of 0 falls back to a viewport-height heuristic
// (innerHeight / 21).

describe('b-r', () => {
  it('registers the b-r custom element', () => {
    expect(customElements.get('b-r')).to.exist
    expect(BR.tag).to.equal('b-r')
  })

  it('declares amount as a Number property', () => {
    expect(BR.properties).to.exist
    expect(BR.properties.amount).to.exist
    expect(BR.properties.amount.type).to.equal(Number)
  })

  it('defaults amount to 0 on construction', async () => {
    const el = await fixture(html`<b-r></b-r>`)
    expect(el.amount).to.equal(0)
  })

  it('renders one <br> per unit of the amount attribute', async () => {
    const el = await fixture(html`<b-r amount="3"></b-r>`)
    await el.updateComplete
    expect(el.shadowRoot.querySelectorAll('br').length).to.equal(3)
  })

  it('falls back to the viewport heuristic when amount is 0', async () => {
    const el = await fixture(html`<b-r></b-r>`)
    await el.updateComplete
    const expected = Math.ceil(globalThis.innerHeight / 21)
    expect(el.shadowRoot.querySelectorAll('br').length).to.equal(expected)
  })

  it('re-renders when the amount property changes', async () => {
    const el = await fixture(html`<b-r amount="2"></b-r>`)
    await el.updateComplete
    expect(el.shadowRoot.querySelectorAll('br').length).to.equal(2)
    el.amount = 5
    await el.updateComplete
    expect(el.shadowRoot.querySelectorAll('br').length).to.equal(5)
  })

  it('renderBR builds the break array without needing a connection', () => {
    const el = document.createElement('b-r')
    const content = el.renderBR(4)
    expect(content.length).to.equal(4)
  })

  it('renderBR treats 0 as the viewport heuristic as well', () => {
    const el = document.createElement('b-r')
    const content = el.renderBR(0)
    expect(content.length).to.equal(Math.ceil(globalThis.innerHeight / 21))
  })

  // FIXED (issue #3102 bug 50): the stray `</div>` closing tag was removed
  // from the render template; the shadow root still holds no div and only
  // the intended breaks.
  it('renders only the break stack with no stray div in the template', async () => {
    const el = await fixture(html`<b-r amount="1"></b-r>`)
    await el.updateComplete
    expect(el.shadowRoot.querySelectorAll('div').length).to.equal(0)
    expect(el.shadowRoot.querySelectorAll('br').length).to.equal(1)
    // the raw template no longer contains the malformed closing tag
    const rendered = el.render()
    expect(rendered.strings.join('')).to.not.contain('</div>')
  })

  it('marks itself aria-hidden as a purely decorative spacer', async () => {
    const el = await fixture(html`<b-r amount="2"></b-r>`)
    await el.updateComplete
    // a11y follow-up: the br-stack is decorative spacing, so the host is
    // hidden from assistive tech to avoid blank-line announcements
    expect(el.getAttribute('aria-hidden')).to.equal('true')
  })
})
