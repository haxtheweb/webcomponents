import { fixture, expect, html } from '@open-wc/testing'

// NOTE: unlike code-editor.test.js, this file registers NO mocks, so the
// real monaco-element claims its tag and code-editor renders the genuine
// wrapper. The monaco loader script points at the local test server (a 404),
// so no monaco assets are ever fetched.
import '../code-editor.js'

const aTimeout = (ms) => new Promise((r) => setTimeout(r, ms))

// FIXED (issue #3102 bug 20): code-pen-button's template now ships an
// inline data-URI SVG instead of the former hardcoded remote S3 image,
// so this file needs no setAttribute interception to stay hermetic.
describe('code-editor with real dependencies', () => {
  it('renders the real monaco-element wrapper', async () => {
    const el = await fixture(html`<code-editor title="Direct"></code-editor>`)
    await el.updateComplete
    const monaco = el.shadowRoot.querySelector('#codeeditor')
    expect(monaco.tagName.toLowerCase()).to.equal('monaco-element')
    expect(monaco.getAttribute('lib-path')).to.contain('monaco-editor/min/vs')
    expect(monaco.getAttribute('language')).to.equal('javascript')
  })

  it('dynamically imports code-pen-button when showCodePen turns on', async () => {
    const el = await fixture(html`<code-editor title="Pen"></code-editor>`)
    await el.updateComplete
    await aTimeout(50)
    let notified = null
    el.addEventListener('show-code-pen-changed', (e) => {
      notified = e
    })
    el.showCodePen = true
    await el.updateComplete
    expect(notified).to.exist
    expect(notified.detail.value).to.equal(true)
    // give the dynamic import and any element upgrade a moment
    await aTimeout(300)
    const container = el.shadowRoot.querySelector('.code-pen-container')
    expect(container).to.exist
    expect(container.querySelector('span').textContent).to.contain(
      'Check it out on code pen',
    )
    // the button image is the inline data URI, never a remote URL
    const img = container.querySelector('code-pen-button')
    expect(img).to.exist
  })

  it('supports the legacy mode api through _modeChanged', async () => {
    const el = await fixture(html`<code-editor mode="html"></code-editor>`)
    await el.updateComplete
    expect(el.language).to.equal('html')
    el.mode = 'css'
    el._modeChanged('css')
    expect(el.language).to.equal('css')
  })

  it('pushes editorValue into the editor on monaco-element-ready', async () => {
    const el = await fixture(
      html`<code-editor editor-value="let direct = true"></code-editor>`,
    )
    await el.updateComplete
    // FIXED (issue #3102 bug 19): the monaco-element-ready listener is
    // registered synchronously in the constructor, so an event dispatched
    // immediately after fixture resolution (previously inside the ~10-15ms
    // setTimeout(0) registration window) is no longer dropped
    const monaco = el.shadowRoot.querySelector('#codeeditor')
    monaco.dispatchEvent(
      new CustomEvent('monaco-element-ready', { bubbles: true, composed: true }),
    )
    await aTimeout(50)
    expect(monaco.value).to.equal('let direct = true')
    expect(el.ready).to.equal(true)
  })

  it('resyncs the editor when slotted content mutates after ready', async () => {
    const el = await fixture(html`<code-editor title="Mutation"></code-editor>`)
    await el.updateComplete
    // listener registration is synchronous in the constructor now
    const monaco = el.shadowRoot.querySelector('#codeeditor')
    monaco.dispatchEvent(
      new CustomEvent('monaco-element-ready', { bubbles: true, composed: true }),
    )
    await aTimeout(30)
    el.innerHTML = '<p>mutated content</p>'
    await aTimeout(50)
    expect(monaco.value).to.contain('mutated content')
  })
})
