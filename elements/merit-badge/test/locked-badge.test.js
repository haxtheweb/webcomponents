import { fixture, expect, html } from '@open-wc/testing'

import '../lib/locked-badge.js'
import { LockedBadge } from '../lib/locked-badge.js'

describe('locked-badge', () => {
  it('registers the custom element', () => {
    expect(globalThis.customElements.get('locked-badge')).to.exist
  })

  it('has the expected static tag', () => {
    expect(LockedBadge.tag).to.equal('locked-badge')
  })

  it('renders a locked placeholder badge image', async () => {
    const el = await fixture(html`<locked-badge></locked-badge>`)
    await el.updateComplete
    expect(el.shadowRoot.querySelector('.badge')).to.exist
    const img = el.shadowRoot.querySelector('img.badgepic')
    expect(img).to.exist
    // the placeholder carries a descriptive alt, not a generic one
    expect(img.getAttribute('alt')).to.equal('Locked badge')
    await expect(el).shadowDom.to.be.accessible()
  })
})
