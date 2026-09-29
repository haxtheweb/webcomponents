import { fixture, expect, html } from '@open-wc/testing'

import '../lib/hax-export-dialog.js'
import { HaxExportDialog } from '../lib/hax-export-dialog.js'

describe('hax-export-dialog', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<hax-export-dialog></hax-export-dialog>`)
    await el.updateComplete
  })

  it('instantiates', () => {
    expect(el.tagName.toLowerCase()).to.equal('hax-export-dialog')
    expect(el.t.viewPageSource).to.equal('View Page Source')
  })

  it('has static tag', () => {
    expect(HaxExportDialog.tag).to.equal('hax-export-dialog')
  })

  it('has windowControllers in constructor', () => {
    expect(el.windowControllers).to.exist
  })

  describe('modalToggle', () => {
    it('calls openSource when id matches hax-export', () => {
      let openSourceCalled = false
      const fakeElements = {
        custom: {
          openSource: () => {
            openSourceCalled = true
          },
        },
      }
      el.modalToggle({ detail: { id: 'hax-export', elements: fakeElements } })
      expect(openSourceCalled).to.equal(true)
    })

    it('does not call openSource when id does not match', () => {
      let openSourceCalled = false
      const fakeElements = {
        custom: {
          openSource: () => {
            openSourceCalled = true
          },
        },
      }
      el.modalToggle({ detail: { id: 'other-id', elements: fakeElements } })
      expect(openSourceCalled).to.equal(false)
    })
  })
})
