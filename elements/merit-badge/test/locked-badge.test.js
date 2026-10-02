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

  it('renders a locked placeholder badge icon', async () => {
    const el = await fixture(html`<locked-badge></locked-badge>`)
    await el.updateComplete
    expect(el.shadowRoot.querySelector('.badge')).to.exist
    const icon = el.shadowRoot.querySelector('simple-icon-lite.badgepic')
    expect(icon).to.exist
    expect(icon.getAttribute('icon')).to.equal('icons:lock')
    // the placeholder carries a descriptive label, not a generic one
    expect(icon.getAttribute('aria-label')).to.equal('Locked badge')
    await expect(el).shadowDom.to.be.accessible()
  })
})
