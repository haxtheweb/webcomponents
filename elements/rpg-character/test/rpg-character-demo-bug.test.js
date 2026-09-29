import { fixture, expect, html } from '@open-wc/testing'

import '../rpg-character.js'

// allow Lit to flush nested updates (seed handler mutates traits mid-update)
const settled = async (el) => {
  await el.updateComplete
  await el.updateComplete
}

describe('rpg-character demo listener removal', () => {
  // BUG: when demo flips to false, updated() calls removeEventListener with
  // a NEW anonymous arrow function (rpg-character.js lines 322-327), which
  // never matches the listener that was registered while demo was true.
  // The click-to-randomize listener therefore stays active forever, and the
  // arrow body at line 326 is unreachable dead code. Store the handler
  // reference to fix; flip the last assertion once removal works.
  it('BUG: clicking still randomizes the seed after demo is disabled', async () => {
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
    // listener was NOT removed: seed still changes
    expect(el.seed === second).to.be.false
  })
})
