import { fixture, expect, html } from '@open-wc/testing'

import '../rpg-character.js'

// allow Lit to flush nested updates (seed handler mutates traits mid-update)
const settled = async (el) => {
  await el.updateComplete
  await el.updateComplete
}

describe('rpg-character demo listener removal', () => {
  // fixed: updated() adds and removes the SAME stored handler reference,
  // so flipping demo to false actually removes the click-to-randomize
  // listener (the old removal passed a fresh anonymous arrow that never
  // matched, leaving the listener active forever)
  it('stops randomizing on click after demo is disabled', async () => {
    const el = await fixture(
      html`<rpg-character seed="btopro" demo></rpg-character>`,
    )
    await settled(el)
    const before = el.seed
    el.shadowRoot.querySelector('.wrapper').click()
    await settled(el)
    expect(el.seed === before).to.be.false

    el.demo = false
    await settled(el)
    const second = el.seed
    el.shadowRoot.querySelector('.wrapper').click()
    await settled(el)
    // listener was removed: the seed no longer changes
    expect(el.seed).to.equal(second)
  })
})
