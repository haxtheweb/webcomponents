import { fixture, expect, html } from '@open-wc/testing'
import '../rich-text-editor.js'
import { sleep, makeEditor, makeToolbar, selectContents } from './helpers.js'

describe('rich-text-editor-prompt-button', () => {
  let editor
  let toolbar
  let button

  beforeEach(async () => {
    editor = await makeEditor('<p id="first">hello world</p>')
    toolbar = await makeToolbar()
    button = await fixture(
      html`<rich-text-editor-prompt-button></rich-text-editor-prompt-button>`,
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
    const prompt = globalThis.RichTextEditorPrompt.instance
    if (prompt) {
      prompt.close()
    }
    await sleep(0)
  })

  it('defaults to a text field prompt for spans', () => {
    expect(button.tagsList).to.equal('span')
    expect(button.fields.length).to.equal(1)
    expect(button.fields[0].property).to.equal('innerHTML')
    expect(button.value.innerHTML === undefined).to.equal(true)
    expect(button.editableSelection).to.equal(false)
  })

  it('promptCommand falls back to command without toggledCommand', () => {
    button.command = 'customCommand'
    expect(button.promptCommand).to.equal('customCommand')
    button.toggledCommand = 'toggledCommand'
    expect(button.promptCommand).to.equal('toggledCommand')
  })

  it('promptCommandVal returns the commandVal', () => {
    button.commandVal = 'val'
    expect(button.promptCommandVal).to.equal('val')
  })

  it('setsInnerHTML updates the targeted node only when fields allow it', async () => {
    // default fields include innerHTML so setInnerHTML applies
    const span = globalThis.document.createElement('span')
    span.textContent = 'old'
    editor.querySelector('p').appendChild(span)
    // select the span itself so wrapping moves the span into the highlight
    const range = globalThis.document.createRange()
    range.selectNode(span)
    button.range = range
    globalThis.RichTextEditorHighlight.instance.wrap(range)
    expect(button.targetedNode === span).to.equal(true)
    button.setInnerHTML('new content')
    expect(span.innerHTML).to.equal('new content')
    globalThis.RichTextEditorHighlight.instance.emptyContents()
  })

  it('getValue reads the targeted node innerHTML', async () => {
    expect(button.getValue().innerHTML).to.equal('')
    const span = globalThis.document.createElement('span')
    span.textContent = 'wrapped'
    globalThis.RichTextEditorHighlight.instance.appendChild(span)
    expect(button.getValue().innerHTML).to.equal('wrapped')
    globalThis.RichTextEditorHighlight.instance.emptyContents()
  })

  it('getPropValue trims strings and rejects empty values', () => {
    button.value = { innerHTML: '  padded  ' }
    expect(button.getPropValue('innerHTML')).to.equal('padded')
    button.value = { innerHTML: '' }
    expect(button.getPropValue('innerHTML')).to.equal(false)
    button.value = {}
    expect(button.getPropValue('innerHTML')).to.equal(false)
    button.value = { count: 4 }
    expect(button.getPropValue('count')).to.equal(4)
    button.value = undefined
    expect(button.getPropValue('innerHTML')).to.equal(false)
  })

  it('targetedNode returns the highlight when no unique match exists', () => {
    const highlight = globalThis.RichTextEditorHighlight.instance
    expect(button.targetedNode === highlight).to.equal(true)
    // a single matching node becomes the targeted node
    highlight.appendChild(globalThis.document.createElement('span'))
    expect(button.targetedNode === highlight).to.equal(false)
    // two matching nodes have no unique match
    highlight.appendChild(globalThis.document.createElement('span'))
    expect(button.targetedNode === highlight).to.equal(true)
    highlight.emptyContents()
  })

  it('tagClickCallback opens the prompt for the clicked node', async () => {
    const events = []
    globalThis.document.addEventListener(
      'rich-text-editor-prompt-open',
      (e) => events.push(e.detail),
      { once: true },
    )
    const span = globalThis.document.createElement('span')
    span.textContent = 'clicked'
    editor.querySelector('p').appendChild(span)
    // highlightNode wraps this.range, so give the button a range first
    const range = globalThis.document.createRange()
    range.selectNode(span)
    button.range = range
    button.tagClickCallback({ detail: span })
    expect(events.length).to.equal(1)
    expect(events[0] === button).to.equal(true)
    expect(button.value.innerHTML).to.equal('clicked')
    await sleep(0)
  })

  it('close unwraps the highlight and fires a close event', async () => {
    const events = []
    button.addEventListener('rich-text-editor-prompt-close', (e) =>
      events.push(true),
    )
    const range = selectContents(editor)
    button.range = range
    button.close()
    expect(events.length).to.equal(1)
    expect(globalThis.RichTextEditorHighlight.instance.hidden).to.equal(true)
  })

  it('cancel delegates to close', async () => {
    const events = []
    button.addEventListener('rich-text-editor-prompt-close', (e) =>
      events.push(true),
    )
    button.cancel()
    expect(events.length).to.equal(1)
  })

  it('confirm without innerHTML leaves the target content intact', async () => {
    // fixed (issue #3077, bug 30): getPropValue returns literal false when
    // the value lacks innerHTML, and setInnerHTML no longer assigns that
    // false into the targeted node (which wiped the selection content with
    // the string "false")
    const span = globalThis.document.createElement('span')
    span.textContent = 'content'
    editor.querySelector('p').appendChild(span)
    const range = globalThis.document.createRange()
    range.selectNodeContents(span)
    button.range = range
    const events = []
    button.addEventListener('rich-text-editor-prompt-confirm', (e) =>
      events.push(true),
    )
    // value without innerHTML previously triggered the false assignment
    button.value = {}
    button.confirm({})
    expect(events.length).to.equal(1)
    // setToggled: toggled tracks value presence ({} exists)
    expect(button.toggled).to.equal(true)
    // the literal false value is never written anywhere
    let falseSeen = false
    ;[...globalThis.document.body.childNodes].forEach((node) => {
      if (node.nodeType === 3 && node.textContent === 'false') {
        falseSeen = true
      }
    })
    expect(falseSeen).to.equal(false)
    // the selection content survives untouched
    expect(span.textContent).to.equal('content')
    // clean up
    editor.querySelector('p').remove()
    globalThis.RichTextEditorHighlight.instance.emptyContents()
  })

  it('confirm with a real value updates the targeted node', async () => {
    const span = globalThis.document.createElement('span')
    span.textContent = 'content'
    editor.querySelector('p').appendChild(span)
    // select the span itself so wrapping moves it into the highlight
    const range = globalThis.document.createRange()
    range.selectNode(span)
    button.range = range
    globalThis.RichTextEditorHighlight.instance.wrap(range)
    expect(button.targetedNode === span).to.equal(true)
    button.confirm({ innerHTML: 'replaced' })
    expect(span.innerHTML).to.equal('replaced')
    globalThis.RichTextEditorHighlight.instance.emptyContents()
  })

  it('setToggled tracks value presence', () => {
    // fixed (issue #3077, bug 30): toggled follows value presence like the
    // image button sibling instead of inverting it
    button.value = { innerHTML: 'x' }
    button.setToggled()
    expect(button.toggled).to.equal(true)
    button.value = false
    button.setToggled()
    expect(button.toggled).to.equal(false)
  })

  it('_rangeChanged refreshes value and toggled state', () => {
    button._rangeChanged()
    expect(typeof button.value).to.equal('object')
    expect(typeof button.value.innerHTML).to.equal('string')
    // a value object is present, so toggled is true (fixed, issue #3077
    // bug 30: setToggled no longer inverts value presence)
    expect(button.toggled).to.equal(true)
  })

  it('_handleClick opens the prompt for the current range', async () => {
    const events = []
    globalThis.document.addEventListener(
      'rich-text-editor-prompt-open',
      (e) => events.push(e.detail),
      { once: true },
    )
    const range = selectContents(editor)
    button.range = range
    button._handleClick({ preventDefault: () => {} })
    expect(events.length).to.equal(1)
    // highlightNode wrapped the selected range so getValue reads its contents
    expect(button.value.innerHTML).to.equal('hello world')
    await sleep(0)
  })

  it('open selects a given node and dispatches the prompt-open event', async () => {
    const events = []
    button.addEventListener('rich-text-editor-prompt-open', (e) =>
      events.push(e.detail),
    )
    const span = globalThis.document.createElement('span')
    span.textContent = 'opened'
    editor.querySelector('p').appendChild(span)
    // highlightNode wraps this.range, so give the button a range first
    const range = globalThis.document.createRange()
    range.selectNode(span)
    button.range = range
    button.open(span)
    expect(events.length).to.equal(1)
    expect(events[0] === button).to.equal(true)
    expect(button.value.innerHTML).to.equal('opened')
    const highlight = globalThis.RichTextEditorHighlight.instance
    expect(highlight.hidden).to.equal(false)
    highlight.emptyContents()
  })
})

describe('rich-text-editor-underline', () => {
  it('defaults and overrides', async () => {
    const el = await fixture(
      html`<rich-text-editor-underline></rich-text-editor-underline>`,
    )
    expect(el.command).to.equal('underline')
    expect(el.tagsList).to.equal('u')
    expect(el.toggles).to.equal(true)
    expect(el.value.confirm).to.equal(false)
    expect(el.getValue().confirm).to.equal(false)
    el.toggled = true
    expect(el.getValue().confirm).to.equal(true)
    // promptCommandVal clears the commandVal as a side effect
    expect(el.promptCommandVal === undefined).to.equal(true)
    expect(el.commandVal === undefined).to.equal(true)
    el.value = { confirm: true }
    el.setToggled()
    expect(el.toggled).to.equal(true)
    el.value = { confirm: false }
    el.setToggled()
    expect(el.toggled).to.equal(false)
  })
})

describe('rich-text-editor-link', () => {
  let editor
  let toolbar
  let link

  beforeEach(async () => {
    editor = await makeEditor('<p id="first">hello <a href="#top" target="_self">world</a></p>')
    toolbar = await makeToolbar()
    link = await fixture(
      html`<rich-text-editor-link></rich-text-editor-link>`,
    )
    link.__toolbar = toolbar
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

  it('defaults to createLink with an href field', () => {
    expect(link.command).to.equal('createLink')
    expect(link.toggledCommand).to.equal('unlink')
    expect(link.icon).to.equal('link')
    expect(link.label).to.equal('Link')
    expect(link.tagsList).to.equal('a')
    expect(link.shortcutKeys).to.equal('ctrl+k')
    const fieldProps = link.fields.map((f) => f.property)
    expect(fieldProps.includes('href')).to.equal(true)
    expect(fieldProps.includes('innerHTML')).to.equal(true)
    expect(link.value.target).to.equal('_blank')
    expect(link.value.href === null).to.equal(true)
    // fixed (issue #3077, bug 32): toggles is the boolean true, not the
    // string "true"
    expect(link.toggles).to.equal(true)
  })

  it('allowTarget adds and removes the target field', async () => {
    expect(link.fields.length).to.equal(2)
    link.allowTarget = true
    await sleep(0)
    expect(link.fields.length).to.equal(3)
    expect(link.fields[2].property).to.equal('target')
    link.allowTarget = false
    await sleep(0)
    expect(link.fields.length).to.equal(2)
  })

  it('promptCommandVal reads the href value', () => {
    link.value = { href: 'https://psu.edu' }
    expect(link.promptCommandVal).to.equal('https://psu.edu')
    link.value = {}
    expect(link.promptCommandVal === undefined).to.equal(true)
  })

  it('isToggled follows the toggled property', () => {
    link.toggled = true
    expect(link.isToggled).to.equal(true)
    link.toggled = false
    expect(link.isToggled).to.equal(false)
  })

  it('getValue reads href and target from the targeted node', () => {
    const anchor = editor.querySelector('a')
    const highlight = globalThis.RichTextEditorHighlight.instance
    // one anchor inside the highlight makes it the targeted node
    highlight.appendChild(anchor)
    expect(link.getValue().href).to.equal('#top')
    // target is only read from the node when allowTarget is on
    link.allowTarget = true
    expect(link.getValue().target).to.equal('_self')
    link.allowTarget = false
    expect(link.getValue().target).to.equal('_blank')
    highlight.emptyContents()
    editor.querySelector('p').appendChild(anchor)
  })

  it('getValue falls back when there is no targeted node', () => {
    // with an empty highlight the highlight itself is the targeted node and
    // getAttribute returns null rather than undefined
    expect(link.getValue().href === null).to.equal(true)
    expect(link.getValue().target).to.equal('_blank')
  })

  it('setToggled tracks the href value', () => {
    link.value = { href: 'https://psu.edu' }
    link.setToggled()
    expect(link.toggled).to.equal(true)
    link.value = {}
    link.setToggled()
    expect(link.toggled).to.equal(false)
  })

  it('updateSelection sets the target attribute on the new link', async () => {
    const range = selectContents(editor, 'a')
    link.range = range
    // promptCommand picks this.command (createLink) only when toggled is
    // true; with toggled falsy it would run the unlink command instead
    link.toggled = true
    // wrap the range so the highlight is inside the editor, then confirm a
    // value whose innerHTML is the new link anchor
    globalThis.RichTextEditorHighlight.instance.wrap(range)
    link.value = {
      href: 'https://psu.edu',
      target: '_blank',
      innerHTML: '<a href="https://psu.edu">linked</a>',
    }
    link.updateSelection()
    // the anchor written through setInnerHTML lands in the editor and the
    // updateSelection fallback sets its target attribute
    const anchors = editor.querySelectorAll('a')
    let blankSeen = false
    anchors.forEach((a) => {
      if (a.getAttribute('target') === '_blank') {
        blankSeen = true
      }
    })
    expect(blankSeen).to.equal(true)
    globalThis.RichTextEditorHighlight.instance.emptyContents()
  })

  it('updateSelection without a target value exits early', async () => {
    const range = selectContents(editor, 'a')
    link.range = range
    link.value = { href: 'https://psu.edu' }
    link.updateSelection()
    expect(true).to.equal(true)
    globalThis.RichTextEditorHighlight.instance.emptyContents()
  })
})

describe('rich-text-editor-image', () => {
  let image

  beforeEach(async () => {
    image = await fixture(
      html`<rich-text-editor-image></rich-text-editor-image>`,
    )
  })

  it('defaults to insertHTML with image fields', () => {
    expect(image.command).to.equal('insertHTML')
    expect(image.tagsList).to.equal('img')
    expect(image.fields.length).to.equal(4)
    expect(image.fields.map((f) => f.property)).to.deep.equal([
      'src',
      'alt',
      'width',
      'height',
    ])
    expect(image.isToggled).to.equal(false)
  })

  it('promptCommandVal emits a real height attribute', () => {
    // fixed (issue #3077, bug 31): the height interpolation previously
    // emitted width="${height}" so the generated tag had two width
    // attributes and no height attribute
    image.value = {
      src: 'test.jpg',
      alt: 'alt text',
      width: '100',
      height: '50',
    }
    const htmlOut = image.promptCommandVal
    expect(htmlOut.startsWith('<img src="test.jpg"')).to.equal(true)
    expect(htmlOut.includes(' alt="alt text"')).to.equal(true)
    expect(htmlOut.includes(' width="100"')).to.equal(true)
    expect(htmlOut.includes(' height="50"')).to.equal(true)
    expect((htmlOut.match(/width=/g) || []).length).to.equal(1)
    // missing src renders an empty insert
    expect(image.promptCommandVal === '').to.equal(false)
    image.value = { alt: 'no src' }
    expect(image.promptCommandVal).to.equal('')
  })

  it('getValue reads the targeted image attributes', () => {
    const img = globalThis.document.createElement('img')
    img.setAttribute('src', 'a.jpg')
    img.setAttribute('alt', 'pic')
    img.setAttribute('width', '10')
    const highlight = globalThis.RichTextEditorHighlight.instance
    highlight.appendChild(img)
    const value = image.getValue()
    expect(value.src).to.equal('a.jpg')
    expect(value.alt).to.equal('pic')
    expect(value.width).to.equal('10')
    expect(value.height === null).to.equal(true)
    highlight.emptyContents()
    // with an empty highlight the highlight itself is the targeted node
    const after = image.getValue()
    expect(after === undefined).to.equal(false)
    expect(after.src === null).to.equal(true)
  })

  it('setToggled tracks value presence', () => {
    image.value = {}
    image.setToggled()
    expect(image.toggled).to.equal(true)
    image.value = false
    image.setToggled()
    expect(image.toggled).to.equal(false)
  })
})
