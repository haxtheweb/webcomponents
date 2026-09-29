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

describe('RichTextEditorRangeBehaviors (via rich-text-editor-toolbar)', () => {
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

  it('exposes its valid command list', () => {
    expect(toolbar.validCommands.includes('bold')).to.equal(true)
    expect(toolbar.validCommands.includes('wrapRange')).to.equal(true)
    expect(toolbar.validCommands.includes('createLink')).to.equal(true)
  })

  it('hasBreadcrumbs is false on the base toolbar', () => {
    expect(toolbar.hasBreadcrumbs).to.equal(false)
  })

  it('commandIsToggled reports bold state', async () => {
    toolbar.setTarget(editor)
    const range = selectContents(editor)
    toolbar.range = range
    toolbar.command = 'bold'
    expect(toolbar.commandIsToggled).to.equal(false)
    globalThis.document.execCommand('bold')
    expect(toolbar.commandIsToggled).to.equal(true)
  })

  it('commandIsToggled uses ancestors for underline and wrapRange', async () => {
    editor.innerHTML = '<p><u id="u1">underlined</u></p>'
    toolbar.setTarget(editor)
    const range = selectContents(editor, '#u1')
    toolbar.range = range
    toolbar.command = 'underline'
    expect(toolbar.commandIsToggled).to.equal(true)
    toolbar.command = 'wrapRange'
    toolbar.commandVal = 'u'
    expect(toolbar.commandIsToggled).to.equal(true)
    toolbar.commandVal = 'mark'
    expect(toolbar.commandIsToggled).to.equal(false)
  })

  it('BUG: toggledCommandsForRange always returns an empty array', async () => {
    // BUG (rich-text-editor-range-behaviors.js:320-324): the filter callback
    // calls commandToggledForRange but never returns it, so every command is
    // filtered out and the toggled command list is always empty
    toolbar.setTarget(editor)
    const range = selectContents(editor)
    toolbar.range = range
    globalThis.document.execCommand('bold')
    expect(toolbar.toggledCommandsForRange(range)).to.deep.equal([])
  })

  it('range utilities inspect range boundaries', async () => {
    // single child: rangeIsNode/rangeIsElement true
    const single = globalThis.document.createElement('p')
    single.appendChild(globalThis.document.createTextNode('one'))
    editor.appendChild(single)
    const range = globalThis.document.createRange()
    range.selectNodeContents(single)
    toolbar.range = range
    expect(toolbar.rangeIsNode(range)).to.equal(true)
    expect(toolbar.rangeIsElement(range)).to.equal(true)
    expect(toolbar.rangeElementOrParentElement(range) === single).to.equal(true)
    expect(toolbar.rangeNodeOrParentNode(range) === single).to.equal(true)
    expect(toolbar.rangeParentElement(range) === single).to.equal(true)
    // rangeParentNode returns the common ancestor's PARENT node, which for a
    // contents-range on single is the editor
    expect(toolbar.rangeParentNode(range) === editor).to.equal(true)

    // multiple children: not a single node, parent element returned
    editor.innerHTML =
      '<p id="multi"><em>a</em><em>b</em><em>c</em></p>'
    const multi = globalThis.document.createRange()
    multi.selectNodeContents(editor.querySelector('#multi'))
    toolbar.range = multi
    expect(toolbar.rangeIsNode(multi)).to.equal(false)
    expect(
      toolbar.rangeElementOrParentElement(multi) ===
        editor.querySelector('#multi'),
    ).to.equal(true)
    expect(toolbar.rangeParentNode(multi) === editor).to.equal(true)

    // single text child: rangeIsNode stays true (offset diff of 1)
    const textRange = globalThis.document.createRange()
    textRange.selectNodeContents(editor.querySelector('#multi em'))
    toolbar.range = textRange
    expect(toolbar.rangeIsNode(textRange)).to.equal(true)
    expect(
      toolbar.rangeElementOrParentElement(textRange) ===
        editor.querySelector('#multi em'),
    ).to.equal(true)
    // multiple text children: rangeIsNode false
    const wide = globalThis.document.createRange()
    wide.setStart(editor.querySelector('#multi').firstChild, 0)
    wide.setEnd(editor.querySelector('#multi').lastChild, 1)
    toolbar.range = wide
    expect(toolbar.rangeIsNode(wide)).to.equal(false)
    expect(
      toolbar.rangeElementOrParentElement(wide) ===
        editor.querySelector('#multi'),
    ).to.equal(true)
  })

  it('rangeFirstNode, rangeLastNode and rangeNodes walk siblings', async () => {
    editor.innerHTML =
      '<p id="a">one</p><p id="b">two</p><p id="c">three</p>'
    const range = globalThis.document.createRange()
    range.selectNode(editor.querySelector('#b'))
    toolbar.range = range
    expect(toolbar.rangeFirstNode(range).id).to.equal('a')
    expect(toolbar.rangeLastNode(range).id).to.equal('b')
    const nodes = toolbar.rangeNodes(range)
    expect(nodes.length).to.equal(3)
    expect(nodes[1].id).to.equal('b')
    expect(nodes[2].id).to.equal('c')
    // an undefined argument falls back to the current range
    expect(
      toolbar.rangeFirstNode(undefined) === nodes[0],
    ).to.equal(true)
    expect(toolbar.rangeLastNode(undefined) === nodes[1]).to.equal(true)
  })

  it('rangeOrMatchingAncestor finds matching and closest ancestors', async () => {
    editor.innerHTML = '<p><u id="u2">deep <em id="em1">text</em></u></p>'
    toolbar.setTarget(editor)
    const range = selectContents(editor, '#em1')
    toolbar.range = range
    expect(
      toolbar.rangeOrMatchingAncestor('em') === editor.querySelector('#em1'),
    ).to.equal(true)
    expect(
      toolbar.rangeOrMatchingAncestor('u') === editor.querySelector('#u2'),
    ).to.equal(true)
    expect(
      toolbar.rangeOrMatchingAncestor('blockquote') === null,
    ).to.equal(true)
    // empty query or unmatched query returns undefined/null
    expect(
      toolbar.rangeOrMatchingAncestor('') === undefined,
    ).to.equal(true)
    expect(toolbar.rangeOrMatchingAncestor('h1') === null).to.equal(true)
  })

  it('BUG: rangeBreadcrumbs never returns actual ancestors', async () => {
    // BUG (rich-text-editor-range-behaviors.js:373-384): getParentNode is
    // defined but never invoked, so only the { nodeName: false } sentinel is
    // returned and breadcrumbs from this helper are always empty
    toolbar.setTarget(editor)
    const range = selectContents(editor)
    toolbar.range = range
    const crumbs = toolbar.rangeBreadcrumbs(range)
    expect(crumbs.length).to.equal(1)
    expect(crumbs[0].nodeName).to.equal(false)
  })

  it('selectNode and selectNodeContents set the selection and fire range-changed', async () => {
    // the toolbar overrides _rangeChanged which fires range-changed (the
    // un-dashed rangechange event only comes from buttons and breadcrumbs)
    const events = []
    toolbar.addEventListener('range-changed', (e) => events.push(true))
    const p = editor.querySelector('p')
    toolbar.selectNode(p)
    expect(events.length > 0).to.equal(true)
    const sel = globalThis.getSelection()
    expect(sel.rangeCount > 0).to.equal(true)
    toolbar.selectNodeContents(p)
    expect(sel.rangeCount > 0).to.equal(true)
    // no node parentNode: ignored
    toolbar.selectNode({ nodeName: 'FAKE' })
    expect(true).to.equal(true)
  })

  it('selectRange adds or collapses a range', async () => {
    const range = selectContents(editor)
    toolbar.selectRange(range, true)
    const sel = globalThis.getSelection()
    expect(sel.rangeCount > 0).to.equal(true)
    toolbar.selectRange(range, false)
    expect(range.collapsed).to.equal(true)
    expect(toolbar.selectRange(undefined) === undefined).to.equal(true)
  })

  it('surroundRange wraps the range contents', async () => {
    const p = editor.querySelector('p')
    const range = globalThis.document.createRange()
    range.selectNodeContents(p)
    const mark = globalThis.document.createElement('mark')
    toolbar.surroundRange(mark, range)
    expect(p.querySelector('mark') === null).to.equal(false)
    expect(p.textContent).to.equal('hello world')
  })

  it('debugRange describes the range', async () => {
    const range = selectContents(editor)
    const info = toolbar.debugRange(range)
    expect(info.range === range).to.equal(true)
    expect(info.text).to.equal('hello world')
    const collapsedInfo = toolbar.debugRange(undefined)
    expect(collapsedInfo.contents).to.equal(false)
  })

  it('highlightNode selects and wraps a node', async () => {
    const target = await makeTarget()
    toolbar.setTarget(target)
    const p = target.querySelector('p')
    // highlightNode wraps its default range (this.range), so set it first
    toolbar.range = selectContents(target)
    toolbar.highlightNode(p)
    const highlight = globalThis.RichTextEditorHighlight.instance
    expect(highlight.hidden).to.equal(false)
    expect(highlight.contains(p)).to.equal(true)
    highlight.emptyContents()
    toolbar.unsetTarget(target)
    target.remove()
  })

  it('getRoot climbs to the document across shadow roots', () => {
    expect(toolbar.getRoot(null) === globalThis.document).to.equal(true)
    expect(toolbar.getRoot(globalThis.document) === globalThis.document).to
      .be.true
    expect(toolbar.getRoot(editor) === globalThis.document).to.equal(true)
    const host = globalThis.document.createElement('div')
    const shadow = host.attachShadow({ mode: 'open' })
    globalThis.document.body.appendChild(host)
    expect(toolbar.getRoot(shadow) === globalThis.document).to.equal(true)
    host.remove()
    const detached = globalThis.document.createElement('span')
    expect(toolbar.getRoot(detached) === detached).to.equal(true)
  })

  it('trimHTML and trimString strip comments and whitespace', () => {
    expect(toolbar.trimString('a <!-- c --> b\n\t')).to.equal('ab')
    expect(toolbar.trimHTML(null)).to.equal('')
    const div = globalThis.document.createElement('div')
    div.innerHTML = '<p>x</p><!-- note -->'
    expect(toolbar.trimHTML(div)).to.equal('<p>x</p>')
  })

  it('outdentHTML strips body wrappers and shared indents', () => {
    // no body wrapper: passthrough with whitespace cleanup
    expect(toolbar.outdentHTML('\n\n  <p>plain</p>\n\n')).to.equal('<p>plain</p>')
    // body wrapper gets matched (but BUG: the tags are not stripped, see below)
    const wrapped = toolbar.outdentHTML('<body><p>wrapped</p></body>')
    // BUG (rich-text-editor-toolbar.js:1584): the replace regex is
    // /<\?body(.*\n)*\>/i which matches a literal "<?body" so the <body>
    // tags are never removed from sanitized html
    expect(wrapped.includes('<body>')).to.equal(true)
    // shared leading indent is removed from following lines
    const indented = toolbar.outdentHTML('    <p>a</p>\n    <p>b</p>')
    expect(indented.includes('    ')).to.equal(false)
  })

  it('sanitizeHTML keeps non-wrapped html as-is', () => {
    expect(toolbar.sanitizeHTML('<p>keep</p>')).to.equal('<p>keep</p>')
  })

  it('_handleCommand runs a plain execCommand', async () => {
    toolbar.setTarget(editor)
    const range = selectContents(editor)
    toolbar.range = range
    toolbar._handleCommand('bold', null, range)
    expect(editor.innerHTML.toLowerCase().includes('<b>')).to.equal(true)
    toolbar.unsetTarget(editor)
  })

  it('_handleCommand wraps and unwraps a range with wrapRange', async () => {
    toolbar.setTarget(editor)
    const range = selectContents(editor)
    toolbar.range = range
    toolbar._handleCommand('wrapRange', 'MARK', range)
    expect(editor.innerHTML.toLowerCase().includes('<mark>')).to.equal(true)
    // now that the range is inside a mark, wrapRange toggles it off
    const inner = selectContents(editor, 'mark')
    toolbar.range = inner
    toolbar._handleCommand('wrapRange', 'MARK', inner)
    expect(editor.innerHTML.toLowerCase().includes('<mark>')).to.equal(false)
    expect(editor.textContent).to.equal('hello world')
    toolbar.unsetTarget(editor)
  })

  it('_handleCommand ignores invalid commands', async () => {
    toolbar.setTarget(editor)
    const range = selectContents(editor)
    toolbar.range = range
    let threw = null
    try {
      toolbar._handleCommand('not-a-command', null, range)
    } catch (e) {
      threw = e
    }
    expect(threw === null).to.equal(true)
    toolbar.unsetTarget(editor)
  })

  it('BUG: _handleCommand cancel crashes because target has no revert', async () => {
    // BUG (rich-text-editor-range-behaviors.js:679-681): the cancel command
    // calls target.revert() but rich-text-editor has no revert method, so
    // clicking a cancel/close button with a target wired throws a TypeError
    toolbar.setTarget(editor)
    const range = selectContents(editor)
    toolbar.range = range
    let threw = null
    try {
      toolbar._handleCommand('cancel', null, range)
    } catch (e) {
      threw = e
    }
    expect(threw instanceof TypeError).to.equal(true)
    toolbar.unsetTarget(editor)
  })

  it('_handleCommand close closes the toolbar', async () => {
    toolbar.setTarget(editor)
    const closed = []
    toolbar.addEventListener('close', (e) => closed.push(true))
    toolbar._handleCommand('close', null, toolbar.range)
    expect(closed.length).to.equal(1)
    expect(toolbar.target === undefined).to.equal(true)
  })

  it('paste inserts sanitized content at the range', async () => {
    toolbar.setTarget(editor)
    const range = selectContents(editor)
    toolbar.range = range
    const events = []
    toolbar.addEventListener('paste', (e) => events.push(e))
    toolbar.paste('<b>pasted</b>', range, true)
    expect(events.length).to.equal(1)
    expect(editor.innerHTML.toLowerCase().includes('<b>pasted</b>')).to.equal(
      true,
    )
    toolbar.unsetTarget(editor)
  })

  it('paste does nothing without a toolbar target', async () => {
    const range = selectContents(editor)
    toolbar.range = range
    toolbar.paste('<b>nope</b>', range, true)
    expect(editor.innerHTML.includes('nope')).to.equal(false)
  })

  it('pasteFromClipboard pastes clipboard text after a delay', async () => {
    const restore = stubProperty(globalThis.navigator, 'clipboard', {
      readText: async () => 'clipboard-text',
    })
    // a plain contenteditable target keeps toolbar.range alive across the
    // selectionchange events that fire while the paste is in flight
    const target = await makeTarget()
    toolbar.setTarget(target)
    const range = selectContents(target)
    toolbar.range = range
    toolbar.pasteFromClipboard(range)
    await sleep(250)
    expect(target.innerHTML.includes('clipboard-text')).to.equal(true)
    restore()
    toolbar.unsetTarget(target)
    target.remove()
  })

  it('closeToolbar disables editing and parks the toolbar', async () => {
    toolbar.setTarget(editor)
    expect(editor.getAttribute('contenteditable')).to.equal('true')
    toolbar.closeToolbar(toolbar, editor)
    expect(editor.hasAttribute('contenteditable')).to.equal(false)
    expect(toolbar.target === undefined).to.equal(true)
    expect(toolbar.parentNode === globalThis.document.body).to.equal(true)
    // default args: no editor means no disableEditing call
    toolbar.target = editor
    toolbar.closeToolbar()
    expect(toolbar.parentNode === globalThis.document.body).to.equal(true)
  })

  it('initViewSource stores the source singleton once', () => {
    toolbar.initViewSource()
    const first = toolbar.__source
    expect(first === globalThis.RichTextEditorSource.instance).to.equal(true)
    toolbar.initViewSource()
    expect(toolbar.__source === first).to.equal(true)
  })

  it('highlighted reflects the highlight singleton visibility', () => {
    expect(toolbar.highlighted).to.equal(false)
    const highlight = globalThis.RichTextEditorHighlight.instance
    const wasHidden = highlight.hidden
    highlight.hidden = false
    expect(toolbar.highlighted).to.equal(true)
    highlight.hidden = wasHidden
  })
})
