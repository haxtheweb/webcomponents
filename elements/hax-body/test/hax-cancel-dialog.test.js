import { fixture, expect, html } from '@open-wc/testing'

import '../lib/hax-cancel-dialog.js'

describe('hax-cancel-dialog', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<hax-cancel-dialog></hax-cancel-dialog>`)
    await el.updateComplete
  })

  it('instantiates', () => {
    expect(el.tagName.toLowerCase()).to.equal('hax-cancel-dialog')
    expect(el.t.cancelTitle).to.equal('Confirm Cancel')
    expect(el.t.cancelYes).to.equal('Yes')
    expect(el.t.cancelNo).to.equal('No')
  })

  it('has cancelWithoutSaving text', () => {
    expect(el.t.cancelWithoutSaving).to.contain('changes')
  })

  describe('focusInitial', () => {
    it('does not throw when shadowRoot exists', () => {
      expect(() => el.focusInitial()).to.not.throw()
    })

    it('finds the no button in shadow DOM', () => {
      const noBtn = el.shadowRoot.querySelector('#hax-cancel-no')
      expect(noBtn).to.exist
    })

    it('returns early when no shadowRoot', () => {
      const originalSR = el.shadowRoot
      Object.defineProperty(el, 'shadowRoot', {
        get() {
          return null
        },
        configurable: true,
      })
      expect(() => el.focusInitial()).to.not.throw()
      Object.defineProperty(el, 'shadowRoot', {
        get() {
          return originalSR
        },
        configurable: true,
      })
    })
  })
})
