import { fixture, expect, html } from '@open-wc/testing'
import '../rich-text-editor.js'
import { sleep, makeEditor, makeToolbar, selectContents } from './helpers.js'

describe('rich-text-editor-toolbar-mini', () => {
  it('renders the mini config in a floating container', async () => {
    const mini = await makeToolbar('rich-text-editor-toolbar-mini')
    expect(mini.tagName.toLowerCase()).to.equal('rich-text-editor-toolbar-mini')
    expect(mini.buttons.length > 5).to.equal(true)
    expect(mini.shadowRoot.querySelector('#container') === null).to.equal(false)
    // the mini config uses bold, italic, removeFormat, links, scripts, lists
    const commands = mini.buttons.map((b) => b.command)
    expect(commands.includes('bold')).to.equal(true)
    expect(commands.includes('insertOrderedList')).to.equal(true)
  })

  it('forces sticky to false', async () => {
    const mini = await makeToolbar('rich-text-editor-toolbar-mini')
    expect(mini.sticky).to.equal(false)
    mini.sticky = true
    await sleep(0)
    expect(mini.sticky).to.equal(false)
    expect(mini.hasAttribute('sticky')).to.equal(false)
  })
})

describe('rich-text-editor-toolbar-full', () => {
  let editor
  let full

  beforeEach(async () => {
    editor = await makeEditor('<p id="first">hello world</p>')
    full = await makeToolbar('rich-text-editor-toolbar-full')
  })

  afterEach(async () => {
    if (full && full.target) {
      full.unsetTarget(full.target)
    }
    if (editor) {
      editor.remove()
    }
    globalThis.getSelection().removeAllRanges()
    globalThis.RichTextEditorHighlight.requestAvailability().emptyContents()
    await sleep(0)
  })

  it('enables breadcrumbs', async () => {
    expect(full.hasBreadcrumbs).to.equal(true)
    expect(full.buttons.length > 10).to.equal(true)
  })

  it('setTarget creates and positions breadcrumbs', async () => {
    full.setTarget(editor)
    expect(full.breadcrumbs === undefined).to.equal(false)
    // positionByTarget inserts the breadcrumbs next to the target
    expect(
      full.breadcrumbs.parentNode === editor.parentNode,
    ).to.equal(true)
    expect(full.breadcrumbs.controls).to.equal(editor.getAttribute('id'))
    const range = selectContents(editor)
    full.range = range
    await sleep(0)
    expect(full.breadcrumbs.selectionAncestors.length).to.equal(2)
    expect(full.breadcrumbs.hidden).to.equal(false)
    expect(full.breadcrumbs.shadowRoot === null).to.equal(false)
  })

  it('syncs sticky state to the breadcrumbs', async () => {
    full.setTarget(editor)
    expect(full.breadcrumbs.sticky).to.equal(false)
    full.sticky = true
    await sleep(0)
    expect(full.breadcrumbs.sticky).to.equal(true)
    expect(full.breadcrumbs.hasAttribute('sticky')).to.equal(true)
  })
})

describe('rich-text-editor-breadcrumbs', () => {
  let editor
  let crumbs

  beforeEach(async () => {
    editor = await makeEditor('<p id="first">hello world</p>')
    crumbs = await fixture(
      html`<rich-text-editor-breadcrumbs></rich-text-editor-breadcrumbs>`,
    )
  })

  afterEach(async () => {
    if (editor) {
      editor.remove()
    }
    globalThis.getSelection().removeAllRanges()
    await sleep(0)
  })

  it('defaults to hidden and not sticky', () => {
    expect(crumbs.hidden).to.equal(true)
    expect(crumbs.sticky).to.equal(false)
    expect(crumbs.label).to.equal('Select')
  })

  it('renders a button per selection ancestor', async () => {
    crumbs.controls = 'editor-id'
    crumbs.selectionAncestors = [
      editor.querySelector('p'),
      { nodeName: 'All', selectAll: editor },
    ]
    await sleep(0)
    const buttons = crumbs.shadowRoot.querySelectorAll('button')
    expect(buttons.length).to.equal(2)
    // ancestors render in array order
    expect(buttons[0].textContent.trim()).to.equal('p')
    expect(buttons[1].textContent.trim()).to.equal('all')
    expect(crumbs.shadowRoot.querySelector('.divider') === null).to.equal(
      false,
    )
  })

  it('renders the label and nothing without ancestors', async () => {
    crumbs.selectionAncestors = undefined
    await sleep(0)
    expect(crumbs.shadowRoot.querySelector('button') === null).to.equal(true)
    crumbs.selectionAncestors = []
    await sleep(0)
    expect(crumbs.shadowRoot.querySelector('button') === null).to.equal(true)
  })

  it('clicking a breadcrumb selects that node', async () => {
    crumbs.selectionAncestors = [
      editor.querySelector('p'),
      { nodeName: 'All', selectAll: editor },
    ]
    await sleep(0)
    const buttons = crumbs.shadowRoot.querySelectorAll('button')
    buttons[0].dispatchEvent(
      new MouseEvent('click', { bubbles: true, composed: true }),
    )
    const sel = globalThis.getSelection()
    expect(sel.rangeCount > 0).to.equal(true)
    // the selectAll breadcrumb selects the editor contents
    buttons[1].dispatchEvent(
      new MouseEvent('click', { bubbles: true, composed: true }),
    )
    expect(sel.rangeCount > 0).to.equal(true)
  })

  it('clicking a plain-object breadcrumb without a parent is safe', async () => {
    crumbs.selectionAncestors = [{ nodeName: 'Fake' }]
    await sleep(0)
    crumbs._handleClick({ nodeName: 'Fake' })
    expect(true).to.equal(true)
  })
})
