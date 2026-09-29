import { fixture, expect, html } from '@open-wc/testing'

import '../lib/simple-modal-template.js'
import '../simple-modal.js'

describe('simple-modal-template associateEvents', () => {
  it('opens the modal through the associated click event', async () => {
    const tpl = await fixture(html`
      <simple-modal-template title="TPL" mode="m">
        <div slot="header">Header</div>
        <div slot="content">Content</div>
      </simple-modal-template>
    `)
    const btn = globalThis.document.createElement('button')
    let seen = null
    const handler = (e) => {
      seen = e.detail
    }
    globalThis.addEventListener('simple-modal-show', handler)
    // associateEvents returns the modal singleton it drives
    const returned = tpl.associateEvents(btn, 'click')
    expect(returned === globalThis.SimpleModal.instance).to.be.true
    btn.click()
    globalThis.removeEventListener('simple-modal-show', handler)
    expect(seen !== null).to.be.true
    expect(seen.title).to.equal('TPL')
    expect(seen.mode).to.equal('m')
    expect(seen.invokedBy === btn).to.be.true
    // the singleton opened from the global event; close it again
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(globalThis.SimpleModal.instance.opened).to.be.true
    globalThis.SimpleModal.instance.close()
    expect(globalThis.SimpleModal.instance.opened).to.be.false
  })
})
