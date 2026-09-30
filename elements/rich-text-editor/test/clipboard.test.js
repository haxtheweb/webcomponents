import { fixture, expect, html } from '@open-wc/testing'
import '../lib/singletons/rich-text-editor-clipboard.js'
import { sleep, stubProperty } from './helpers.js'

describe('rich-text-editor-clipboard', () => {
  it('requestAvailability returns a singleton appended to the body', async () => {
    const a = globalThis.RichTextEditorClipboard.requestAvailability()
    const b = globalThis.RichTextEditorClipboard.requestAvailability()
    expect(a === b).to.equal(true)
    expect(a.tagName.toLowerCase()).to.equal('rich-text-editor-clipboard')
    expect(a.parentNode === globalThis.document.body).to.equal(true)
  })

  it('renders a hidden textarea', async () => {
    const el = await fixture(
      html`<rich-text-editor-clipboard></rich-text-editor-clipboard>`,
    )
    const textarea = el.shadowRoot.querySelector('textarea')
    expect(textarea === null).to.equal(false)
    expect(textarea.getAttribute('aria-hidden')).to.equal('true')
  })

  it('value getter reads the textarea value', async () => {
    const el = globalThis.RichTextEditorClipboard.requestAvailability()
    el.shadowRoot.querySelector('textarea').value = 'from-textarea'
    expect(el.value).to.equal('from-textarea')
  })

  it('setClipboard copies clipboard text into the textarea', async () => {
    const el = globalThis.RichTextEditorClipboard.requestAvailability()
    const restore = stubProperty(globalThis.navigator, 'clipboard', {
      readText: async () => 'copied-text',
    })
    el.setClipboard()
    await sleep(20)
    expect(el.value).to.equal('copied-text')
    restore()
  })
})
