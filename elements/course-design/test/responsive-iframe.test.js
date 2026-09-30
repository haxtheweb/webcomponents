import { fixture, expect, html } from '@open-wc/testing'

import '../lib/responsive-iframe.js'

describe('responsive-iframe', () => {
  it('registers the custom element', () => {
    expect(globalThis.customElements.get('responsive-iframe')).to.exist
  })

  it('wraps slotted content in a ratio container', async () => {
    const el = await fixture(html`
      <responsive-iframe
        ><iframe title="Embedded content"></iframe
      ></responsive-iframe>
    `)
    await el.updateComplete
    const container = el.shadowRoot.querySelector('#container')
    expect(container).to.exist
    expect(el.shadowRoot.querySelector('slot')).to.exist
    const styles = globalThis.getComputedStyle(container)
    expect(parseFloat(styles.paddingTop)).to.be.greaterThan(0)
    expect(styles.height).to.equal('0px')
    const iframe = el.querySelector('iframe')
    expect(iframe).to.exist
    // the ::slotted rule pins the iframe into the container
    expect(globalThis.getComputedStyle(iframe).position).to.equal('absolute')
    await expect(el).shadowDom.to.be.accessible()
  })
})
