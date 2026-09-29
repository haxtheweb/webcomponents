import { expect } from '@open-wc/testing'
import '../rich-text-editor.js'
import {
  sleep,
  makeEditor,
  makeTarget,
  makeToolbar,
  selectContents,
  stubProperty,
} from './helpers.js'

describe('rich-text-editor-toolbar', () => {
  let editor
  let toolbar

  beforeEach(async () => {
    editor = await makeEditor('<p id="first">hello world</p>')
    toolbar = await makeToolbar()
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

  it('renders the default config and generates an id', () => {
    expect(toolbar.id.startsWith('rte-')).to.equal(true)
    expect(toolbar.buttons.length > 10).to.equal(true)
    const types = toolbar.buttons.map((b) => b.tagName.toLowerCase())
    expect(types.includes('rich-text-editor-button')).to.equal(true)
    expect(types.includes('rich-text-editor-link')).to.equal(true)
    expect(types.includes('rich-text-editor-heading-picker')).to.equal(true)
    expect(toolbar.getAttribute('role')).to.equal('toolbar')
  })

  it('exposes every default button and group config', () => {
    const getterNames = [
      'undoButton',
      'redoButton',
      'historyButtonGroup',
      'formatButton',
      'boldButton',
      'italicButton',
      'underlineButton',
      'strikethroughButton',
      'removeFormatButton',
      'h1Button',
      'h2Button',
      'codeButton',
      'markButton',
      'abbrButton',
      'basicInlineButtonGroup',
      'linkButton',
      'unlinkButton',
      'linkButtonGroup',
      'cutButton',
      'copyButton',
      'pasteButton',
      'clipboardButtonGroup',
      'subscriptButton',
      'superscriptButton',
      'scriptButtonGroup',
      'symbolButton',
      'iconButton',
      'emojiButton',
      'imageButton',
      'insertButtonGroup',
      'advancedInsertButtonGroup',
      'justifyLeftButton',
      'justifyCenterButton',
      'justifyRightButton',
      'justifyFullButton',
      'justifyButtonGroup',
      'orderedListButton',
      'unorderedListButton',
      'blockquoteButton',
      'indentButton',
      'outdentButton',
      'listButtonGroup',
      'listIndentButtonGroup',
      'saveButton',
      'closeButton',
      'saveCloseButtonGroup',
      'sourceButton',
      'sourceButtonGroup',
      'defaultConfig',
      'miniConfig',
    ]
    getterNames.forEach((name) => {
      const value = toolbar[name]
      expect(value === undefined).to.equal(false)
    })
    expect(toolbar.undoButton.command).to.equal('undo')
    expect(toolbar.boldButton.command).to.equal('bold')
    expect(toolbar.h1Button.commandVal).to.equal('h1')
    expect(toolbar.historyButtonGroup.buttons.length).to.equal(2)
    expect(toolbar.defaultConfig.length).to.equal(7)
    expect(toolbar.miniConfig.length).to.equal(4)
    expect(toolbar.sourceButton.type).to.equal('rich-text-editor-source-code')
    // miniStyles/baseStyles/styles are static getters, so read them off the
    // constructor rather than the instance
    const Ctor = Object.getPrototypeOf(toolbar).constructor
    expect(Ctor.miniStyles.length).to.equal(1)
    expect(Array.isArray(Ctor.baseStyles)).to.equal(true)
    expect(Array.isArray(Ctor.styles)).to.equal(true)
  })

  it('miniTemplate and toolbarTemplate render a buttons container', async () => {
    expect(
      toolbar.miniTemplate.strings[0].includes('id="container"'),
    ).to.equal(true)
    expect(
      toolbar.toolbarTemplate.strings[0].includes('id="buttons"'),
    ).to.equal(true)
    expect(
      toolbar.shadowRoot.querySelector('#buttons') === null,
    ).to.equal(false)
  })

  it('__toolbar property config uses the string name', () => {
    // fixed (issue #3077 bug 8): `name: "toolbar"` is quoted so it no longer
    // resolves to the browser global window.toolbar (a BarProp object)
    const props = Object.getPrototypeOf(toolbar).constructor.properties
    expect(props.__toolbar.name).to.equal('toolbar')
    expect(props.__toolbar.type).to.equal(Object)
  })

  it('setTarget enables editing and updates the target', async () => {
    const enabled = []
    toolbar.addEventListener('enabled', (e) => enabled.push(e.detail))
    editor.setAttribute('id', 'settarget-editor')
    toolbar.setTarget(editor)
    expect(enabled[0]).to.equal('<p id="first">hello world</p>')
    expect(toolbar.target === editor).to.equal(true)
    expect(editor.getAttribute('role')).to.equal('textbox')
    expect(editor.getAttribute('contenteditable')).to.equal('true')
    expect(editor.classList.contains('heightmax')).to.equal(true)
    expect(editor.previousSibling === toolbar).to.equal(true)
    // controls getter reflects the target id onto the toolbar attribute
    expect(toolbar.controls).to.equal('settarget-editor')
    expect(toolbar.getAttribute('controls')).to.equal('settarget-editor')
    const button = toolbar.buttons[0]
    expect(button.disabled).to.equal(false)
    expect(button.__toolbar === toolbar).to.equal(true)

    // range change after target switch
    const range = selectContents(editor)
    toolbar.range = range
    await sleep(0)
    expect(toolbar.selectedNode === editor.querySelector('p')).to.equal(true)
    expect(toolbar.selectionAncestors.length).to.equal(2)
    expect(toolbar.buttons[0].range === range).to.equal(true)
    expect(toolbar.buttons[0].selectedNode === toolbar.selectedNode).to.equal(
      true,
    )
  })

  it('setTarget moves between targets and cleans the old role', async () => {
    const editor2 = await makeEditor('<p>second editor</p>')
    toolbar.setTarget(editor)
    expect(editor.getAttribute('role')).to.equal('textbox')
    toolbar.setTarget(editor2)
    expect(editor.hasAttribute('role')).to.equal(false)
    expect(editor2.getAttribute('role')).to.equal('textbox')
    expect(toolbar.target === editor2).to.equal(true)
    toolbar.unsetTarget(editor2)
    editor2.remove()
  })

  it('setTarget with the same target does not rewire', async () => {
    toolbar.setTarget(editor)
    const range = selectContents(editor)
    toolbar.range = range
    toolbar.setTarget(editor)
    expect(toolbar.target === editor).to.equal(true)
    // same target: range stays set
    expect(toolbar.range === range).to.equal(true)
  })

  it('unsetTarget disables editing', async () => {
    const disabled = []
    toolbar.addEventListener('disabled', (e) => disabled.push(e.detail))
    toolbar.setTarget(editor)
    editor.innerHTML = '<p>changed content</p>'
    toolbar.unsetTarget(editor)
    expect(disabled[0]).to.equal('<p>changed content</p>')
    expect(toolbar.target === undefined).to.equal(true)
    expect(editor.hasAttribute('contenteditable')).to.equal(false)
  })

  it('revertTarget restores canceled edits', async () => {
    toolbar.setTarget(editor)
    editor.innerHTML = '<p>edited</p>'
    toolbar.revertTarget()
    expect(editor.innerHTML).to.equal('<p id="first">hello world</p>')
    // without a target nothing happens
    toolbar.unsetTarget(editor)
    toolbar.revertTarget()
    expect(true).to.equal(true)
  })

  it('setCanceledEdits stores html, target html, or empty', async () => {
    toolbar.setCanceledEdits('<p>explicit</p>')
    expect(toolbar.__canceledEdits).to.equal('<p>explicit</p>')
    toolbar.target = editor
    toolbar.setCanceledEdits()
    expect(toolbar.__canceledEdits).to.equal('<p id="first">hello world</p>')
    toolbar.target = undefined
    toolbar.setCanceledEdits()
    expect(toolbar.__canceledEdits).to.equal('')
  })

  it('cancelEdits reverts the target and unwires it', async () => {
    // fixed (issue #3077 bug 3): cancelEdits no longer references an
    // undefined `editor` identifier; it reverts and unwires the target
    toolbar.setTarget(editor)
    toolbar.setCanceledEdits('<p id="first">hello world</p>')
    editor.innerHTML = '<p>edited</p>'
    let threw = null
    try {
      toolbar.cancelEdits()
    } catch (e) {
      threw = e
    }
    expect(threw === null).to.equal(true)
    expect(editor.innerHTML).to.equal('<p id="first">hello world</p>')
    expect(toolbar.target === undefined).to.equal(true)
  })

  it('cancel and close dispatch events', async () => {
    const canceled = []
    const closed = []
    toolbar.addEventListener('cancel', (e) => canceled.push(true))
    toolbar.addEventListener('close', (e) => closed.push(true))
    toolbar.cancel()
    expect(canceled.length).to.equal(1)
    toolbar.target = editor
    toolbar.close()
    expect(closed.length).to.equal(1)
    expect(toolbar.target === undefined).to.equal(true)
    expect(toolbar.parentNode === globalThis.document.body).to.equal(true)
  })

  it('_editorChanged dispatches an editor-change event', async () => {
    const events = []
    toolbar.addEventListener('editor-change', (e) => events.push(true))
    toolbar._editorChanged()
    expect(events.length).to.equal(1)
  })

  it('controls returns the target id', async () => {
    expect(toolbar.controls === undefined).to.equal(true)
    editor.setAttribute('id', 'target-editor')
    toolbar.target = editor
    expect(toolbar.controls).to.equal('target-editor')
    expect(toolbar.getAttribute('controls')).to.equal('target-editor')
    toolbar.target = undefined
  })

  it('disconnected, noSelection and show states drive hidden', async () => {
    // no target: disconnected is true and isRangeInScope is falsy
    expect(!toolbar.isRangeInScope).to.equal(true)
    expect(toolbar.disconnected).to.equal(true)
    toolbar.show = 'always'
    expect(toolbar.disconnected).to.equal(false)
    toolbar.show = 'selection'
    expect(toolbar.noSelection).to.equal(true)
    expect(toolbar.disconnected).to.equal(true)
    const range = selectContents(editor)
    toolbar.target = editor
    toolbar.range = range
    expect(toolbar.noSelection).to.equal(false)
    expect(toolbar.disconnected).to.equal(false)
    toolbar.show = ''
    toolbar.target = undefined
    expect(toolbar.disconnected).to.equal(true)
  })

  it('observer builds a MutationObserver', () => {
    expect(typeof toolbar.observer.observe).to.equal('function')
    toolbar.target = editor
    toolbar.observeChanges(true)
    toolbar.observeChanges(false)
    toolbar.target = undefined
    expect(true).to.equal(true)
  })

  it('isRangeInScope checks the target contains the range', async () => {
    expect(!toolbar.isRangeInScope).to.equal(true)
    toolbar.target = editor
    const range = selectContents(editor)
    toolbar.range = range
    expect(toolbar.isRangeInScope).to.equal(true)
    toolbar.range = undefined
    expect(!toolbar.isRangeInScope).to.equal(true)
    toolbar.target = undefined
  })

  it('getRange reads the selection of a plain target', async () => {
    const target = await makeTarget()
    expect(toolbar.getRange() === undefined).to.equal(true)
    toolbar.target = target
    const range = selectContents(target)
    expect(toolbar.getRange() === range).to.equal(true)
    // getSelection uses the global document selection (no comma operator)
    const sel = toolbar.getSelection()
    expect(typeof sel.removeAllRanges).to.equal('function')
    expect(sel.rangeCount > 0).to.equal(true)
    toolbar.target = undefined
    target.remove()
  })

  it('getRange reads selections from a shadow-rooted target', async () => {
    // fixed (issue #3077 bug 2): document selection with a composed-path
    // scope check replaces target.shadowRoot (which has no getSelection), so
    // selection tracking works for LitElement targets like the editor itself
    toolbar.setTarget(editor)
    const range = selectContents(editor)
    const found = toolbar.getRange()
    expect(found === undefined).to.equal(false)
    expect(found.toString()).to.equal(range.toString())
    expect(found.startContainer === range.startContainer).to.equal(true)
    // a selection outside the target does not count as the toolbar range
    const outside = await makeTarget('<p>outside</p>')
    const outsideRange = globalThis.document.createRange()
    outsideRange.selectNodeContents(outside.querySelector('p'))
    const sel = globalThis.getSelection()
    sel.removeAllRanges()
    sel.addRange(outsideRange)
    expect(toolbar.getRange() === undefined).to.equal(true)
    sel.removeAllRanges()
    outside.remove()
    toolbar.unsetTarget(editor)
  })

  it('updateRange seeds the target range', async () => {
    toolbar.updateRange(undefined)
    expect(true).to.equal(true)
    toolbar.target = editor
    toolbar.updateRange(editor)
    expect(editor.range === undefined).to.equal(true)
    const range = selectContents(editor)
    toolbar.range = range
    toolbar.updateRange(editor)
    expect(editor.range === range).to.equal(true)
    toolbar.target = undefined
  })

  it('_rangeChanged updates buttons and fires range-changed', async () => {
    const events = []
    toolbar.addEventListener('range-changed', (e) => events.push(true))
    toolbar.target = editor
    const range = selectContents(editor)
    toolbar.range = range
    await sleep(0)
    expect(events.length > 0).to.equal(true)
    // buttons received the selected node and ancestors
    const button = toolbar.buttons[0]
    expect(button.selectionAncestors === toolbar.selectionAncestors).to.equal(
      true,
    )
    toolbar.target = undefined
  })

  it('clearToolbar resets clickable elements', async () => {
    toolbar.clickableElements['a'] = { tagClickCallback: () => {} }
    toolbar.clearToolbar()
    expect(Object.keys(toolbar.clickableElements).length).to.equal(0)
  })

  const fakeEventListener = () => ({
    addEventListener: () => {},
    removeEventListener: () => {},
    shortcutKeys: '',
  })

  it('registerButton removes paste buttons without clipboard support', async () => {
    let removed = false
    const restore = stubProperty(globalThis.navigator, 'clipboard', undefined)
    toolbar.registerButton({
      command: 'paste',
      tagsArray: [],
      remove: () => {
        removed = true
      },
      ...fakeEventListener(),
    })
    expect(removed).to.equal(true)
    restore()
  })

  it('registerButton and deregisterButton track clickable tags', async () => {
    const button = {
      command: 'custom',
      tagsArray: ['a', 'img'],
      tagClickCallback: () => {},
      disabled: true,
      ...fakeEventListener(),
    }
    toolbar.registerButton(button)
    expect(toolbar.clickableElements['a'] === button).to.equal(true)
    expect(toolbar.clickableElements['img'] === button).to.equal(true)
    expect(button.__toolbar === toolbar).to.equal(true)
    expect(button.disabled).to.equal(true)
    toolbar.deregisterButton(button)
    expect(toolbar.clickableElements['a'] === undefined).to.equal(true)
    expect(toolbar.clickableElements['img'] === undefined).to.equal(true)
  })

  it('_handleTargetKeypress writes the first key into the target', async () => {
    // fixed (issue #3077 bug 5): the first keypress on an empty target
    // writes into the target (never the toolbar) and guards the range
    const emptyEditor = await makeEditor('')
    toolbar.setTarget(emptyEditor)
    globalThis.getSelection().removeAllRanges()
    let threw = null
    try {
      toolbar._handleTargetKeypress({ key: 'z' })
    } catch (e) {
      threw = e
    }
    expect(threw === null).to.equal(true)
    // the key was written into the target, not the toolbar
    expect(emptyEditor.innerHTML).to.equal('z')
    // the toolbar keeps rendering its own buttons (the old test compared
    // raw innerHTML, but the rendered toolbar is never an empty string)
    expect(toolbar.shadowRoot.querySelector('#buttons') === null).to.equal(
      false,
    )
    toolbar.unsetTarget(emptyEditor)
    emptyEditor.remove()
    // non-empty target: guard exits without writing
    toolbar.setTarget(editor)
    toolbar._handleTargetKeypress({ key: 'z' })
    expect(editor.innerHTML).to.equal('<p id="first">hello world</p>')
  })

  it('_handleTargetMutation handles attribute mutations safely', async () => {
    // fixed (issue #3077 bug 6): the attribute-mutation branch reads the
    // mutation record target and the correctly spelled contenteditable, so
    // it no longer throws a ReferenceError
    toolbar.setTarget(editor)
    let threw = null
    try {
      toolbar._handleTargetMutation([
        { type: 'attributes', target: editor },
      ])
    } catch (e) {
      threw = e
    }
    expect(threw === null).to.equal(true)
    // a hidden contenteditable target steps out of editing mode
    let hid = null
    try {
      editor.setAttribute('hidden', '')
      toolbar._handleTargetMutation([
        { type: 'attributes', target: editor },
      ])
    } catch (e) {
      hid = e
    }
    expect(hid === null).to.equal(true)
    expect(editor.hasAttribute('contenteditable')).to.equal(false)
    editor.removeAttribute('hidden')
    // childList mutations only refresh the selection
    toolbar._handleTargetMutation([{ type: 'childList' }])
    toolbar._handleTargetMutation([])
    expect(true).to.equal(true)
    toolbar.unsetTarget(editor)
  })

  it('_handleTargetSelection stores the current range', async () => {
    const target = await makeTarget()
    toolbar.target = target
    toolbar.__promptOpen = true
    toolbar._handleTargetSelection()
    expect(toolbar.range === undefined).to.equal(true)
    toolbar.__promptOpen = false
    const range = selectContents(target)
    toolbar._handleTargetSelection()
    expect(toolbar.range === range).to.equal(true)
    toolbar.target = undefined
    target.remove()
  })

  it('_handleTargetFocus retargets unless a prompt is open', async () => {
    const editor2 = await makeEditor('<p>focus target</p>')
    toolbar.setTarget(editor)
    toolbar.__promptOpen = true
    toolbar._handleTargetFocus(editor2)
    expect(toolbar.target === editor).to.equal(true)
    toolbar.__promptOpen = false
    toolbar._handleTargetFocus(editor2)
    expect(toolbar.target === editor2).to.equal(true)
    toolbar.unsetTarget(editor2)
    editor2.remove()
  })

  it('_handleTargetClick retargets when another target is clicked', async () => {
    const editor2 = await makeEditor('<p>dbl target</p>')
    toolbar.setTarget(editor)
    // the dblclick handlers are bound to the wired target, so a retarget
    // happens when the handler is invoked with a different target
    toolbar._handleTargetClick(editor2, {
      preventDefault: () => {},
      composedPath: () => [editor2],
    })
    expect(toolbar.target === editor2).to.equal(true)
    toolbar.unsetTarget(editor2)
    editor2.remove()
  })

  it('_handleTargetClick fires tagClickCallback for clickable elements', async () => {
    toolbar.setTarget(editor)
    let callbackDetail = null
    toolbar.clickableElements = {
      a: {
        tagClickCallback: (e) => {
          callbackDetail = e.detail
        },
      },
    }
    const anchor = globalThis.document.createElement('a')
    anchor.textContent = 'link text'
    editor.querySelector('p').appendChild(anchor)
    anchor.dispatchEvent(
      new MouseEvent('dblclick', { bubbles: true, composed: true }),
    )
    expect(callbackDetail === anchor).to.equal(true)
    // clicking plain text does not fire the callback
    let firedAgain = false
    toolbar.clickableElements = {
      a: {
        tagClickCallback: () => {
          firedAgain = true
        },
      },
    }
    editor
      .querySelector('p')
      .dispatchEvent(
        new MouseEvent('dblclick', { bubbles: true, composed: true }),
      )
    expect(firedAgain).to.equal(false)
    // disabled targets are ignored
    toolbar._handleTargetClick({ disabled: true, preventDefault: () => {} }, {
      composedPath: () => [],
    })
    expect(true).to.equal(true)
  })

  it('_handlePaste delegates to the clipboard', async () => {
    const restore = stubProperty(globalThis.navigator, 'clipboard', {
      readText: async () => 'pasted-here',
    })
    // a plain contenteditable target keeps toolbar.range alive across the
    // async clipboard read
    const target = await makeTarget()
    toolbar.setTarget(target)
    const range = selectContents(target)
    toolbar.range = range
    target.dispatchEvent(
      new CustomEvent('paste', {
        bubbles: true,
        composed: true,
      }),
    )
    await sleep(200)
    expect(target.innerHTML.includes('pasted-here')).to.equal(true)
    restore()
    toolbar.unsetTarget(target)
    target.remove()
  })

  it('_addHighlight wraps the range while editing', async () => {
    // a plain target so getRange resolves the selection simply
    const target = await makeTarget()
    toolbar.setTarget(target)
    const range = selectContents(target)
    toolbar.range = range
    const highlight = globalThis.RichTextEditorHighlight.instance
    toolbar._addHighlight()
    expect(highlight.hidden).to.equal(false)
    expect(highlight.innerHTML).to.equal('hello world')
    toolbar._removeHighlight()
    expect(highlight.hidden).to.equal(true)
    toolbar.unsetTarget(target)
    target.remove()
  })

  it('_addHighlight returns early when the target is not editable', async () => {
    // fixed (issue #3077 bug 28): the precedence bug
    // !this.target.getAttribute('contenteditable') == 'true' never fired the
    // early return, so the highlight wrapped ranges in non-editable targets
    const target = await makeTarget()
    toolbar.target = target
    target.removeAttribute('contenteditable')
    const range = selectContents(target)
    toolbar.range = range
    const highlight = globalThis.RichTextEditorHighlight.instance
    toolbar._addHighlight()
    expect(highlight.hidden).to.equal(true)
    expect(highlight.innerHTML).to.equal('')
    toolbar.target = undefined
    target.remove()
  })

  it('_addBreadcrumbs creates one shared breadcrumbs element', async () => {
    const first = toolbar._addBreadcrumbs()
    expect(first.tagName.toLowerCase()).to.equal('rich-text-editor-breadcrumbs')
    expect(first.label).to.equal(toolbar.breadcrumbsLabel)
    const second = toolbar._addBreadcrumbs()
    expect(second === first).to.equal(true)
    expect(
      first.parentNode === globalThis.document.body,
    ).to.equal(true)
    toolbar.breadcrumbs = undefined
  })

  it('positionByTarget places the toolbar and breadcrumbs around the target', async () => {
    toolbar.positionByTarget(editor)
    expect(editor.previousSibling === toolbar).to.equal(true)
    expect(toolbar.slot).to.equal(editor.slot)
    toolbar.positionByTarget(false)
    expect(toolbar.parentNode === globalThis.document.body).to.equal(true)
  })

  it('insertNew wraps a target in a new rich-text-editor', async () => {
    // fixed (issue #3077 bug 1): tabindex moved from the constructor into
    // connectedCallback, so document.createElement no longer reports a
    // NotSupportedError and insertNew can wrap a target
    const host = globalThis.document.createElement('div')
    host.appendChild(editor)
    globalThis.document.body.appendChild(host)
    toolbar.insertNew(editor)
    expect(
      editor.parentNode.tagName === 'RICH-TEXT-EDITOR',
    ).to.equal(true)
    expect(
      editor.parentNode.getAttribute('tabindex'),
    ).to.equal('0')
    expect(editor.querySelector('p') === null).to.equal(false)
    editor.parentNode.remove()
    host.remove()
  })

  it('targetEmpty and targetHTML reflect the target', async () => {
    expect(toolbar.targetEmpty()).to.equal(true)
    toolbar.target = editor
    expect(toolbar.targetEmpty()).to.equal(false)
    expect(toolbar.targetHTML).to.equal('<p id="first">hello world</p>')
    editor.innerHTML = '   '
    expect(toolbar.targetEmpty()).to.equal(true)
    toolbar.target = undefined
  })

  it('htmlMatchesTarget compares whitespace-free html', async () => {
    // fixed (issue #3077 bug 26): returns a boolean instead of a
    // localeCompare number (where 0 meant a match)
    toolbar.target = editor
    expect(
      toolbar.htmlMatchesTarget('<p id="first">hello world</p>'),
    ).to.equal(true)
    expect(
      toolbar.htmlMatchesTarget('<p id="first">other</p>'),
    ).to.equal(false)
    toolbar.target = undefined
  })

  it('targetHandlers lists the target listeners', () => {
    const handlers = toolbar.targetHandlers(editor)
    expect(Object.keys(handlers).sort()).to.deep.equal(
      ['dblclick', 'focus', 'keydown', 'paste'].sort(),
    )
  })

  it('enabledTargetHandlers lists the editing listeners', () => {
    const handlers = toolbar.enabledTargetHandlers
    expect(Object.keys(handlers).sort()).to.deep.equal(
      ['keydown', 'keypress', 'mousedown', 'mouseup'].sort(),
    )
    expect(typeof handlers.keydown).to.equal('function')
  })

  it('sanitizeHTML strips body wrappers', () => {
    // fixed (issue #3077 bug 27): the regex matches <body> tags (not the
    // literal "<?body") and the replace call passes an empty replacement
    const result = toolbar.sanitizeHTML('<body><p>inside</p></body>')
    expect(result).to.equal('<p>inside</p>')
    expect(result.includes('<body>')).to.equal(false)
    expect(toolbar.sanitizeHTML('<p>outside</p>')).to.equal('<p>outside</p>')
  })

  it('updateToolbar rerenders a custom config with subtypes', async () => {
    toolbar.config = [
      {
        type: 'button-group',
        subtype: 'custom-subtype',
        buttons: [
          {
            command: 'bold',
            icon: 'editor:format-bold',
            label: 'Bold',
            type: 'rich-text-editor-button',
          },
        ],
      },
    ]
    await sleep(0)
    expect(toolbar.querySelector('.custom-subtype') === null).to.equal(false)
    expect(toolbar.buttons.length).to.equal(1)
    expect(toolbar.buttons[0].command).to.equal('bold')
    // empty config short-circuits
    toolbar.config = []
    await sleep(0)
    expect(true).to.equal(true)
  })

  it('_generateUUID returns rte- prefixed ids', () => {
    const uuid = toolbar._generateUUID()
    expect(uuid.startsWith('rte-')).to.equal(true)
    // rte- plus nine four-char hex groups
    expect(uuid.length).to.equal(40)
  })

  it('_handleButtonUpdate delegates to the parent toolbar', () => {
    let stopped = false
    toolbar._handleButtonUpdate({
      stopPropagation: () => {
        stopped = true
      },
      detail: undefined,
    })
    expect(stopped).to.equal(true)
  })

  it('prompt open and close events toggle __promptOpen', async () => {
    const prompt = globalThis.RichTextEditorPrompt.requestAvailability()
    // __promptOpen is not initialized, so it starts undefined (falsy)
    expect(!toolbar.__promptOpen).to.equal(true)
    prompt.dispatchEvent(new CustomEvent('open'))
    expect(toolbar.__promptOpen).to.equal(true)
    prompt.dispatchEvent(new CustomEvent('close'))
    expect(toolbar.__promptOpen).to.equal(false)
  })

  it('updated calls the correctly named _editorChanged method', async () => {
    // fixed (issue #3077 bug 4): updated() calls _editorChanged(), the actual
    // method name, instead of the nonexistent _editorChange()
    const events = []
    toolbar.addEventListener('editor-change', (e) => events.push(true))
    toolbar.updated(new Map([['editor', undefined]]))
    expect(events.length).to.equal(1)
  })

  it('registers and unregisters itself in the global toolbar list', async () => {
    expect(
      globalThis.RichTextEditorToolbars.includes(toolbar),
    ).to.equal(true)
    const clone = await makeToolbar()
    expect(
      globalThis.RichTextEditorToolbars.includes(clone),
    ).to.equal(true)
    clone.remove()
    expect(
      globalThis.RichTextEditorToolbars.includes(clone),
    ).to.equal(false)
  })
})
