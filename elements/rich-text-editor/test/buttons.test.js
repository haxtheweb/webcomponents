import { fixture, expect, html } from '@open-wc/testing'
import '../rich-text-editor.js'
import '../lib/buttons/rich-text-editor-emoji-picker.js'
import '../lib/buttons/rich-text-editor-symbol-picker.js'
import { sleep, makeEditor, makeToolbar, selectContents } from './helpers.js'

const fakeEvent = () => ({
  preventDefault: () => {},
  stopPropagation: () => {},
})

describe('rich-text-editor-button', () => {
  let editor
  let toolbar
  let button

  beforeEach(async () => {
    editor = await makeEditor('<p id="first">hello world</p>')
    toolbar = await makeToolbar()
    button = await fixture(
      html`<rich-text-editor-button
        command="bold"
        icon="editor:format-bold"
        label="Bold"
        toggles
      ></rich-text-editor-button>`,
    )
    button.__toolbar = toolbar
    toolbar.setTarget(editor)
  })

  afterEach(async () => {
    if (toolbar && toolbar.target) {
      toolbar.unsetTarget(toolbar.target)
    }
    if (editor) {
      editor.remove()
    }
    globalThis.getSelection().removeAllRanges()
    globalThis.RichTextEditorHighlight.requestAvailability().emptyContents()
    await sleep(0)
  })

  it('reflects command and label attributes', () => {
    expect(button.command).to.equal('bold')
    expect(button.getAttribute('command')).to.equal('bold')
    expect(button.label).to.equal('Bold')
  })

  it('tagsArray parses the tags list', () => {
    button.tagsList = 'a, B ,c'
    expect(button.tagsArray).to.deep.equal(['a', 'b', 'c'])
    button.tagsList = ''
    expect(button.tagsArray).to.deep.equal([''])
  })

  it('isToggled reflects the command state of the range', async () => {
    const range = selectContents(editor)
    button.range = range
    expect(button.isToggled).to.equal(false)
    globalThis.document.execCommand('bold')
    expect(button.isToggled).to.equal(true)
  })

  it('operationCommand and operationCommandVal follow the toggled state', async () => {
    button.command = 'bold'
    button.commandVal = 'off-val'
    button.toggledCommand = 'toggled'
    button.toggledCommandVal = 'on-val'
    const range = selectContents(editor)
    button.range = range
    expect(button.operationCommand).to.equal('bold')
    expect(button.operationCommandVal).to.equal('off-val')
    globalThis.document.execCommand('bold')
    // with a bolded range and a toggledCommand set, the toggled command applies
    expect(button.commandIsToggled).to.equal(true)
    expect(button.operationCommand).to.equal('toggled')
    expect(button.operationCommandVal).to.equal('on-val')
    button.toggledCommandVal = undefined
    expect(button.operationCommandVal).to.equal('')
  })

  it('sendCommand dispatches a command event and runs the callback', async () => {
    const events = []
    button.addEventListener('command', (e) => events.push(e.detail))
    const range = selectContents(editor)
    button.range = range
    button.sendCommand(fakeEvent())
    expect(events.length).to.equal(1)
    expect(events[0].command).to.equal('bold')
    expect(events[0].button === button).to.equal(true)
    // bold was applied through the execCommand pipeline
    expect(editor.innerHTML.toLowerCase().includes('<b>')).to.equal(true)
  })

  it('wrapSelection dispatches a wrapselection event', () => {
    const events = []
    button.addEventListener('wrapselection', (e) => events.push(e.detail))
    button.wrapSelection('b')
    expect(events.length).to.equal(1)
    expect(events[0]).to.equal('b')
  })

  it('setRange expands the selection to the matched block', async () => {
    button.tagsList = ''
    button.setRange()
    expect(true).to.equal(true)
    button.tagsList = 'p'
    const range = selectContents(editor)
    button.range = range
    // the block is matched from the current range before setRange re-points
    // the selection at the block node
    expect(
      button.rangeOrMatchingAncestor() === editor.querySelector('p'),
    ).to.equal(true)
    button.setRange()
    const sel = globalThis.getSelection()
    expect(sel.rangeCount > 0).to.equal(true)
    // selectNode(block) selects the block from its parent
    expect(sel.getRangeAt(0).startContainer === editor).to.equal(true)
  })

  it('_handleClick sends the command', async () => {
    const events = []
    button.addEventListener('command', (e) => events.push(true))
    const range = selectContents(editor)
    button.range = range
    button._handleClick(fakeEvent())
    expect(events.length).to.equal(1)
  })

  it('commandCallback runs after the command', async () => {
    let callbackArgs = null
    button.commandCallback = (target, toolbarArg, selection) => {
      callbackArgs = [target, toolbarArg, selection]
    }
    button.target = editor
    const range = selectContents(editor)
    button.range = range
    button.sendCommand(fakeEvent())
    expect(callbackArgs === null).to.equal(false)
    expect(callbackArgs[0] === editor).to.equal(true)
    expect(callbackArgs[1] === toolbar).to.equal(true)
  })

  it('_getSelection and helpers read the range', async () => {
    const range = selectContents(editor)
    button.range = range
    button.tagsList = 'p'
    expect(button._getSelectedHtml()).to.equal('hello world')
    expect(button._getSelectedTag()).to.equal('p')
    button.command = 'formatBlock'
    expect(button._getSelection() === editor.querySelector('p')).to.equal(
      true,
    )
    expect(button._getSelectionType()).to.equal('p')
    button.command = 'insertHTML'
    expect(button._getSelectionType()).to.equal('hello world')
    button.range = undefined
    expect(button._getSelectedHtml() === undefined).to.equal(true)
    expect(button._getSelectionType() === undefined).to.equal(true)
    expect(button._getSelectedTag()).to.equal(false)
  })

  it('_editorChanged and _rangeChanged are safe no-ops', () => {
    button._editorChanged('a', 'b')
    button._rangeChanged('a', 'b')
    expect(true).to.equal(true)
  })

  it('updated refreshes the registry on shortcut or tag changes', async () => {
    const events = []
    button.addEventListener('update-button-registry', (e) =>
      events.push(true),
    )
    button.shortcutKeys = 'ctrl+b'
    button.tagsList = 'p'
    await sleep(0)
    expect(events.length > 0).to.equal(true)
  })
})

describe('rich-text-editor-unlink', () => {
  it('defaults to the unlink command', async () => {
    const el = await fixture(
      html`<rich-text-editor-unlink></rich-text-editor-unlink>`,
    )
    expect(el.command).to.equal('unlink')
    expect(el.icon).to.equal('mdextra:unlink')
    expect(el.label).to.equal('Remove Link')
    expect(el.tagsList).to.equal('a')
  })

  it('BUG: updated writes a misspelled disabeld attribute', async () => {
    // BUG (rich-text-editor-unlink.js:47-57): updated() sets and removes the
    // attribute "disabeld" (a misspelling of disabled) when the range
    // changes, so the button state is never conveyed through the real
    // disabled attribute
    const el = await fixture(
      html`<rich-text-editor-unlink></rich-text-editor-unlink>`,
    )
    // untoggled state: the misspelled attribute is removed
    el.updated(new Map([['range', undefined]]))
    expect(el.hasAttribute('disabeld')).to.equal(false)
    expect(el.hasAttribute('disabled')).to.equal(false)
    // toggled state: the misspelled attribute is written instead of disabled
    Object.defineProperty(el, 'commandIsToggled', {
      get() {
        return true
      },
      configurable: true,
    })
    el.updated(new Map([['range', undefined]]))
    expect(el.hasAttribute('disabeld')).to.equal(true)
    expect(el.hasAttribute('disabled')).to.equal(false)
    delete el.commandIsToggled
    el.updated(new Map([['range', undefined]]))
    expect(el.hasAttribute('disabeld')).to.equal(false)
  })
})

describe('rich-text-editor-emoji-picker and symbol picker', () => {
  let editor
  let toolbar

  const makePicker = async (tag) => {
    const el = globalThis.document.createElement(tag)
    globalThis.document.body.appendChild(el)
    await sleep(0)
    return el
  }

  beforeEach(async () => {
    editor = await makeEditor('<p id="first">hello world</p>')
    toolbar = await makeToolbar()
    toolbar.setTarget(editor)
  })

  afterEach(async () => {
    if (toolbar && toolbar.target) {
      toolbar.unsetTarget(toolbar.target)
    }
    if (editor) {
      editor.remove()
    }
    globalThis.getSelection().removeAllRanges()
    globalThis.RichTextEditorHighlight.requestAvailability().emptyContents()
    await sleep(0)
  })

  const inlineProgramCases = [
    ['rich-text-editor-emoji-picker', 'insert-emoji', 'Insert emoji'],
    ['rich-text-editor-symbol-picker', 'insert-symbol', 'Insert symbol'],
  ]

  inlineProgramCases.forEach(([tag, machine, name]) => {
    it(`${tag} opens the ${machine} inline program`, async () => {
      const el = await makePicker(tag)
      el.__toolbar = toolbar
      el.target = editor
      const events = []
      el.addEventListener('rich-text-editor-open-inline-program', (e) =>
        events.push(e.detail),
      )
      const range = selectContents(editor)
      el.range = range
      el._handleClick(fakeEvent())
      expect(events.length).to.equal(1)
      expect(events[0].machineName).to.equal(machine)
      expect(events[0].name).to.equal(name)
      expect(events[0].range === range).to.equal(true)
      expect(events[0].target === editor).to.equal(true)
      expect(typeof events[0].selection.addRange).to.equal('function')
    })

    it(`${tag} ignores clicks without a range`, async () => {
      const el = await makePicker(tag)
      el.__toolbar = toolbar
      const events = []
      el.addEventListener('rich-text-editor-open-inline-program', (e) =>
        events.push(e.detail),
      )
      el._handleClick(fakeEvent())
      expect(events.length).to.equal(0)
    })

    it(`${tag} ignores clicks while disabled`, async () => {
      const el = await makePicker(tag)
      el.__toolbar = toolbar
      el.disabled = true
      const range = selectContents(editor)
      el.range = range
      const events = []
      el.addEventListener('rich-text-editor-open-inline-program', (e) =>
        events.push(e.detail),
      )
      el._handleClick(fakeEvent())
      expect(events.length).to.equal(0)
    })

    it(`${tag} defaults`, async () => {
      const el = await makePicker(tag)
      expect(el.command).to.equal('insertHTML')
      expect(el.tagsList).to.equal('')
      expect(typeof el._openInlineProgram).to.equal('function')
    })
  })
})
