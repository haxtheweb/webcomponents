import { fixture, expect, html } from '@open-wc/testing'
import '../lib/singletons/rich-text-editor-prompt.js'
import { sleep } from './helpers.js'

const openEvent = (detail) =>
  new CustomEvent('rich-text-editor-prompt-open', { detail: detail })

describe('rich-text-editor-prompt', () => {
  afterEach(async () => {
    const prompt = globalThis.RichTextEditorPrompt.instance
    if (prompt) {
      prompt.__opened = false
      prompt.__focused = false
      prompt.__hovered = false
      prompt.button = undefined
      prompt.fields = []
      prompt.value = {}
    }
    await sleep(0)
  })

  it('requestAvailability returns a singleton', async () => {
    const a = globalThis.RichTextEditorPrompt.requestAvailability()
    const b = globalThis.RichTextEditorPrompt.requestAvailability()
    expect(a === b).to.equal(true)
    expect(a.tagName.toLowerCase()).to.equal('rich-text-editor-prompt')
  })

  it('is hidden until opened', async () => {
    const prompt = globalThis.RichTextEditorPrompt.requestAvailability()
    expect(prompt.hidden).to.equal(true)
    prompt.__opened = true
    expect(prompt.hidden).to.equal(false)
    prompt.__opened = false
  })

  it('renders popover, form, fields, cancel and confirm', async () => {
    const el = await fixture(
      html`<rich-text-editor-prompt></rich-text-editor-prompt>`,
    )
    expect(el.shadowRoot.querySelector('#prompt') === null).to.equal(false)
    expect(el.shadowRoot.querySelector('#form') === null).to.equal(false)
    expect(el.shadowRoot.querySelector('#formfields') === null).to.equal(false)
    expect(el.shadowRoot.querySelector('#cancel') === null).to.equal(false)
    expect(el.shadowRoot.querySelector('#confirm') === null).to.equal(false)
  })

  it('open sets state and aligns single attribute field values', async () => {
    const prompt = globalThis.RichTextEditorPrompt.requestAvailability()
    prompt.open(
      openEvent({
        fields: [{ attribute: 'title', property: 'other' }],
        value: { href: 'https://psu.edu' },
      }),
    )
    expect(prompt.__opened).to.equal(true)
    expect(prompt.__focused).to.equal(true)
    expect(prompt.value.title).to.equal('https://psu.edu')
    prompt.close()
  })

  it('open aligns single property field values', async () => {
    const prompt = globalThis.RichTextEditorPrompt.requestAvailability()
    prompt.open(
      openEvent({
        fields: [{ property: 'innerHTML' }],
        value: { text: 'aligned' },
      }),
    )
    expect(prompt.value.innerHTML).to.equal('aligned')
    prompt.close()
  })

  it('open with multiple fields does not align values', async () => {
    const prompt = globalThis.RichTextEditorPrompt.requestAvailability()
    prompt.open(
      openEvent({
        fields: [{ property: 'href' }, { property: 'innerHTML' }],
        value: { href: 'https://psu.edu' },
      }),
    )
    expect(prompt.value.innerHTML === undefined).to.equal(true)
    prompt.close()
  })

  it('open with no fields auto-confirms', async () => {
    const prompt = globalThis.RichTextEditorPrompt.requestAvailability()
    let confirmCalled = false
    const fakeButton = {
      fields: [],
      value: {},
      confirm: () => {
        confirmCalled = true
      },
    }
    prompt.open(openEvent(fakeButton))
    expect(confirmCalled).to.equal(true)
    await sleep(30)
    expect(prompt.__opened).to.equal(false)
    expect(prompt.fields.length).to.equal(0)
  })

  it('close resets state', async () => {
    const prompt = globalThis.RichTextEditorPrompt.requestAvailability()
    prompt.open(
      openEvent({ fields: [{ property: 'href' }], value: { href: 'x' } }),
    )
    prompt.close()
    expect(prompt.__opened).to.equal(false)
    expect(prompt.__focused).to.equal(false)
    expect(prompt.button === undefined).to.equal(true)
    expect(prompt.fields.length).to.equal(0)
    expect(Object.keys(prompt.value).length).to.equal(0)
  })

  it('_cancel calls button cancel and closes', async () => {
    const prompt = globalThis.RichTextEditorPrompt.requestAvailability()
    let canceled = false
    prompt.button = {
      cancel: () => {
        canceled = true
      },
    }
    prompt.__opened = true
    let prevented = false
    prompt._cancel({ preventDefault: () => (prevented = true) })
    expect(prevented).to.equal(true)
    expect(canceled).to.equal(true)
    expect(prompt.__opened).to.equal(false)
  })

  it('_confirm notifies the button and closes', async () => {
    const prompt = globalThis.RichTextEditorPrompt.requestAvailability()
    let confirmCalled = false
    prompt.button = {
      confirm: () => {
        confirmCalled = true
      },
    }
    prompt.__opened = true
    let prevented = false
    prompt._confirm({ preventDefault: () => (prevented = true) })
    expect(prevented).to.equal(true)
    await sleep(30)
    expect(confirmCalled).to.equal(true)
    expect(prompt.__opened).to.equal(false)
  })

  it('_handleFocus and _handleBlur track focus', async () => {
    const prompt = globalThis.RichTextEditorPrompt.requestAvailability()
    prompt._handleFocus()
    expect(prompt.__focused).to.equal(true)
    prompt._handleBlur()
    expect(prompt.__focused).to.equal(false)
    prompt.__retainFocus = true
    prompt._handleFocus()
    prompt._handleBlur()
    expect(prompt.__focused).to.equal(true)
    prompt.__retainFocus = false
    prompt.__retainFocusIn = true
    prompt._handleBlur()
    expect(prompt.__focused).to.equal(true)
    prompt.__retainFocusIn = false
    prompt._handleBlur()
    expect(prompt.__focused).to.equal(false)
  })

  it('_handleChange cancels an unfocused, unhovered, opened prompt', async () => {
    const prompt = globalThis.RichTextEditorPrompt.requestAvailability()
    let canceled = false
    prompt.button = {
      cancel: () => {
        canceled = true
      },
    }
    prompt.__opened = true
    prompt.__focused = false
    prompt.__hovered = false
    prompt._handleChange()
    await sleep(600)
    expect(canceled).to.equal(true)
    expect(prompt.__opened).to.equal(false)
  })

  it('firstUpdated wires mouse and focus handlers on the prompt', async () => {
    const prompt = globalThis.RichTextEditorPrompt.requestAvailability()
    expect(prompt.__highlight === undefined).to.equal(false)
    prompt.dispatchEvent(new Event('mousedown'))
    expect(prompt.__retainFocus).to.equal(true)
    prompt.dispatchEvent(new Event('mouseup'))
    expect(prompt.__retainFocus).to.equal(false)
    prompt.dispatchEvent(new Event('focusin'))
    expect(prompt.__retainFocusIn).to.equal(true)
    prompt.dispatchEvent(new Event('focusout'))
    expect(prompt.__retainFocusIn).to.equal(false)
    // fixed (issue #3077, bug 29): the change listener defers
    // _handleChange through an arrow function instead of invoking it
    // immediately, so the cancel check runs at 300ms + 500ms
    // first drain any cancel-check timers still pending from earlier
    // tests (they no-op while the prompt is closed)
    await sleep(900)
    prompt.__opened = true
    prompt.__focused = false
    prompt.__hovered = false
    prompt.__highlight.dispatchEvent(new Event('change'))
    // at 600ms the deferred cancel has not fired yet (the old code invoked
    // _handleChange(e) immediately and canceled at 500ms)
    await sleep(600)
    expect(prompt.__opened).to.equal(true)
    await sleep(400)
    expect(prompt.__opened).to.equal(false)
  })

  it('updated schedules a cancel when opened and unfocused', async () => {
    const prompt = globalThis.RichTextEditorPrompt.requestAvailability()
    prompt.__opened = true
    prompt.__focused = true
    await sleep(500)
    expect(prompt.__opened).to.equal(true)
    prompt.__focused = false
    await sleep(1000)
    expect(prompt.__opened).to.equal(false)
  })

  it('cancel and confirm buttons in the shadow DOM work', async () => {
    const prompt = globalThis.RichTextEditorPrompt.requestAvailability()
    let canceled = false
    let confirmCalled = false
    prompt.button = {
      cancel: () => {
        canceled = true
      },
      confirm: () => {
        confirmCalled = true
      },
      fields: [],
      value: {},
    }
    prompt.fields = []
    prompt.value = {}
    prompt.__opened = true
    prompt.__focused = true
    prompt.shadowRoot
      .querySelector('#cancel')
      .dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }))
    expect(canceled).to.equal(true)
    expect(prompt.__opened).to.equal(false)
    // close() cleared the button, so set it again before confirming
    prompt.__opened = true
    prompt.__focused = true
    prompt.button = {
      cancel: () => {},
      confirm: () => {
        confirmCalled = true
      },
    }
    prompt.shadowRoot
      .querySelector('#confirm')
      .dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }))
    await sleep(30)
    expect(confirmCalled).to.equal(true)
    expect(prompt.__opened).to.equal(false)
  })
})
