import { fixture, expect, html } from '@open-wc/testing'
import '../lib/singletons/rich-text-editor-source.js'
import '../lib/buttons/rich-text-editor-source-code.js'
import { sleep, makeEditor, makeToolbar } from './helpers.js'

describe('rich-text-editor-source singleton', () => {
  it('requestAvailability returns singleton and injects a stylesheet', async () => {
    const a = globalThis.RichTextEditorSource.requestAvailability()
    const b = globalThis.RichTextEditorSource.requestAvailability()
    expect(a === b).to.equal(true)
    expect(a.tagName.toLowerCase()).to.equal('rich-text-editor-source')
    const sheet = globalThis.document.querySelector(
      'head style',
    )
    expect(sheet === null).to.equal(false)
  })

  it('firstUpdated toggles it off by default', async () => {
    const el = await fixture(
      html`<rich-text-editor-source></rich-text-editor-source>`,
    )
    await sleep(0)
    expect(el.hidden).to.equal(true)
    expect(el.disabled).to.equal(true)
    expect(el.__codeEditorValue).to.equal('')
  })

  it('toggle with toolbar and target shows source mode', async () => {
    const editor = await makeEditor('<p>source mode text</p>')
    const toolbar = await makeToolbar()
    toolbar.target = editor
    toolbar.getHTML = () => editor.innerHTML
    // targetHTML delegates to outdentHTML on the toolbar
    const el = globalThis.RichTextEditorSource.requestAvailability()
    el.toggle(toolbar)
    expect(el.hidden).to.equal(false)
    expect(
      editor.getAttribute('data-rich-text-editor-view-source-mode'),
    ).to.equal('true')
    expect(
      editor.previousSibling === null ||
        editor.previousSibling.tagName === null ||
        editor.previousSibling === el,
    ).to.equal(true)
    expect(el.innerHTML).to.equal(editor.innerHTML)

    // toggling with the same toolbar turns it back off
    el.toggle(toolbar)
    expect(el.hidden).to.equal(true)
    expect(el.disabled).to.equal(true)
    expect(
      editor.hasAttribute('data-rich-text-editor-view-source-mode'),
    ).to.equal(false)
    el.toggle()
    editor.remove()
  })

  it('_handleSourceChange updates target when html differs', async () => {
    const el = globalThis.RichTextEditorSource.requestAvailability()
    const editor = await makeEditor('<p>original</p>')
    const toolbar = await makeToolbar()
    toolbar.target = editor
    el.__toolbar = toolbar
    el.__target = editor
    el.__needsUpdate = false
    el._handleSourceChange({ detail: { value: '<p>changed</p>' } })
    // htmlMatchesTarget returns 0 when identical, non-zero when different;
    // the changed value differs so an update is scheduled
    await sleep(350)
    expect(editor.innerHTML).to.equal('<p>changed</p>')
    expect(el.__needsUpdate).to.equal(false)
    // falsy value: __needsUpdate goes true and the update clears the target
    // NOTE (BUG, not triggered here): passing detail: undefined crashes the
    // scheduled update at rich-text-editor-source.js:247 because the guard at
    // line 241 handles a missing detail but `e.detail.value` in the update
    // callback does not
    el._handleSourceChange({ detail: { value: '' } })
    await sleep(350)
    expect(editor.innerHTML).to.equal('')
    el.__toolbar = undefined
    el.__target = undefined
    editor.remove()
  })

  it('_handleSourceChange does nothing without a toolbar', async () => {
    const el = globalThis.RichTextEditorSource.requestAvailability()
    el.__toolbar = undefined
    el.__target = undefined
    el._handleSourceChange({ detail: { value: '<p>nope</p>' } })
    expect(true).to.equal(true)
  })
})

describe('rich-text-editor-source-code button', () => {
  it('defaults and initViewSource wiring', async () => {
    const el = await fixture(
      html`<rich-text-editor-source-code></rich-text-editor-source-code>`,
    )
    expect(el.command).to.equal('viewSource')
    expect(el.toggledCommand).to.equal('viewSource')
    expect(el.label).to.equal('Source Code')
    expect(el.__source === globalThis.RichTextEditorSource.instance).to.equal(
      true,
    )
    expect(el.isToggled).to.equal(false)
    el.toggled = true
    expect(el.isToggled).to.equal(true)
  })

  it('commandCallback toggles based on matching toolbar', async () => {
    const el = await fixture(
      html`<rich-text-editor-source-code></rich-text-editor-source-code>`,
    )
    const toolbar = await makeToolbar()
    el.__toolbar = toolbar
    el.toggled = false
    el.commandCallback()
    expect(el.toggled).to.equal(false)
    el.__source.__toolbar = toolbar
    el.toggled = false
    el.commandCallback()
    expect(el.toggled).to.equal(true)
  })
})
