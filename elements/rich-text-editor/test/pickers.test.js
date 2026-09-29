import { fixture, expect, html } from '@open-wc/testing'
import '../rich-text-editor.js'
import '../lib/buttons/rich-text-editor-icon-picker.js'
import { sleep, makeEditor, makeToolbar, selectContents } from './helpers.js'

describe('rich-text-editor-picker', () => {
  let editor
  let toolbar
  let picker

  beforeEach(async () => {
    editor = await makeEditor('<p id="first">hello world</p>')
    toolbar = await makeToolbar()
    picker = await fixture(
      html`<rich-text-editor-picker></rich-text-editor-picker>`,
    )
    picker.__toolbar = toolbar
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

  it('defaults to insertHTML', () => {
    expect(picker.command).to.equal('insertHTML')
    expect(picker.label).to.equal('Insert link')
    expect(picker.allowNull).to.equal(false)
    expect(picker.titleAsHtml).to.equal(false)
    expect(picker.value === null).to.equal(true)
    expect(picker.isToggled).to.equal(false)
  })

  it('renders a simple-picker button', () => {
    expect(picker.picker === null).to.equal(false)
    expect(picker.picker.tagName.toLowerCase()).to.equal('simple-picker')
    expect(
      ['undefined', 'boolean'].includes(typeof picker.expanded),
    ).to.equal(true)
  })

  it('labelVisibleClass hides the label when an icon is set', () => {
    expect(picker.labelVisibleClass).to.equal('show')
    picker.icon = 'link'
    expect(picker.labelVisibleClass).to.equal('hide')
  })

  it('_pickerFocus prevents the default event', () => {
    let prevented = false
    picker._pickerFocus({ preventDefault: () => (prevented = true) })
    expect(prevented).to.equal(true)
  })

  it('_setPickerOptions grids options into rows', () => {
    const options = []
    for (let i = 0; i < 5; i++) {
      options.push({ alt: 'o' + i, value: i })
    }
    const grid = picker._setPickerOptions(options)
    expect(grid.length).to.equal(2)
    expect(grid[0].length).to.equal(3)
    expect(grid[0][0].value).to.equal(0)
    expect(grid[1].length).to.equal(2)
    // large lists cap the column count at 10
    const many = []
    for (let i = 0; i < 200; i++) {
      many.push({ alt: 'o' + i, value: i })
    }
    const capped = picker._setPickerOptions(many)
    expect(capped.length).to.equal(20)
    expect(capped[0].length).to.equal(10)
  })

  it('_setOptions sets the options property', () => {
    picker.options = [{ alt: 'one', value: 1 }]
    picker._setOptions()
    expect(picker.options.length).to.equal(1)
    expect(picker.options[0][0].value).to.equal(1)
  })

  it('_setRangeValue syncs the picker value from the range', async () => {
    // the selected html must match a tag name in the tags array for the
    // value branch to fire, so select content that is literally a tag name
    editor.innerHTML = '<p>p</p>'
    picker.tagsList = 'p,div'
    const range = selectContents(editor)
    picker.range = range
    await sleep(0)
    expect(picker.picker.value).to.equal('p')
    // a collapsed or missing range clears the value
    const collapsed = globalThis.document.createRange()
    collapsed.selectNodeContents(editor.querySelector('p'))
    collapsed.collapse()
    picker.range = collapsed
    await sleep(0)
    expect(picker.picker.value === undefined).to.equal(true)
    // content that is not in the tags array leaves the value alone
    editor.innerHTML = '<p>zzz</p>'
    const other = globalThis.document.createRange()
    other.selectNodeContents(editor.querySelector('p'))
    picker.range = other
    await sleep(0)
    expect(picker.picker.value === undefined).to.equal(true)
  })

  it('_rangeChanged delegates to _setRangeValue', async () => {
    editor.innerHTML = '<p>p</p>'
    picker.tagsList = 'p'
    const range = selectContents(editor)
    // the picker override reads this.range, so set the property (which
    // triggers updated and the _rangeChanged override)
    picker.range = range
    await sleep(0)
    expect(picker.picker.value).to.equal('p')
  })

  it('_pickerChange runs the command when the value differs', async () => {
    const range = selectContents(editor)
    picker.range = range
    picker.commandVal = '<b>inserted</b>'
    picker.command = 'insertHTML'
    const events = []
    picker.addEventListener('command', (e) => events.push(e.detail))
    picker._pickerChange({ detail: { value: '<b>inserted</b>' } })
    expect(events.length).to.equal(1)
    expect(editor.innerHTML.toLowerCase().includes('<b>inserted</b>')).to.equal(
      true,
    )
  })

  it('_pickerChange without a range only records the command value', async () => {
    const events = []
    picker.addEventListener('command', (e) => events.push(e.detail))
    picker._pickerChange({ detail: { value: 'x' } })
    expect(events.length).to.equal(0)
    expect(picker.commandVal).to.equal('x')
    picker._pickerChange({ detail: {} })
    expect(picker.commandVal).to.equal('')
  })
})

describe('rich-text-editor-heading-picker', () => {
  let editor
  let toolbar
  let picker

  beforeEach(async () => {
    editor = await makeEditor('<h2 id="first">hello world</h2>')
    toolbar = await makeToolbar()
    picker = await fixture(
      html`<rich-text-editor-heading-picker></rich-text-editor-heading-picker>`,
    )
    picker.__toolbar = toolbar
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

  it('defaults to formatBlock with block options', async () => {
    expect(picker.command).to.equal('formatBlock')
    expect(picker.label).to.equal('Block format')
    expect(picker.allowNull).to.equal(true)
    expect(picker.hideNullOption).to.equal(true)
    expect(picker.labelVisibleClass).to.equal('hide')
    expect(picker.blocks.length).to.equal(9)
    expect(picker.tagsList).to.equal('p,h1,h2,h3,h4,h5,h6,blockquote,pre')
    // options are built from blocks: a null row plus one row per block
    expect(picker.options.length).to.equal(10)
    expect(picker.options[0][0].value === null).to.equal(true)
  })

  it('rebuilds options when blocks change', async () => {
    picker.blocks = [
      { label: 'Paragraph', tag: 'p' },
      { label: 'Heading 1', tag: 'h1' },
    ]
    await sleep(0)
    expect(picker.tagsList).to.equal('p,h1')
    expect(picker.options.length).to.equal(3)
  })

  it('_setRangeValue reads the ancestor tag', async () => {
    const range = selectContents(editor, 'h2')
    picker.range = range
    await sleep(0)
    expect(picker.picker.value).to.equal('h2')
    // a collapsed range inside a block that is not in the tags array clears
    // the value (a collapsed range inside h2 would keep matching the ancestor)
    editor.innerHTML = '<div id="plain">div text</div>'
    const collapsed = globalThis.document.createRange()
    collapsed.selectNodeContents(editor.querySelector('#plain'))
    collapsed.collapse()
    picker.range = collapsed
    await sleep(0)
    expect(picker.picker.value === 'h2').to.equal(false)
  })
})

describe('rich-text-editor-icon-picker', () => {
  let editor
  let toolbar
  let picker

  beforeEach(async () => {
    editor = await makeEditor('<p id="first">hello world</p>')
    toolbar = await makeToolbar()
    picker = await fixture(
      html`<rich-text-editor-icon-picker></rich-text-editor-icon-picker>`,
    )
    picker.__toolbar = toolbar
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

  it('defaults to insertHTML for simple-icon-lite', async () => {
    expect(picker.command).to.equal('insertHTML')
    expect(picker.label).to.equal('Insert icon')
    expect(picker.tagsList).to.equal('simple-icon-lite')
    expect(Array.isArray(picker.icons)).to.equal(true)
    expect(Array.isArray(picker.excludes)).to.equal(true)
    expect(picker._setOptions()).to.equal(undefined)
    expect(
      picker.shadowRoot.querySelector('simple-icon-picker') === null,
    ).to.equal(false)
  })

  it('_pickerChange builds the simple-icon-lite insert html', async () => {
    const range = selectContents(editor)
    picker.range = range
    const events = []
    picker.addEventListener('command', (e) => events.push(e.detail))
    picker._pickerChange({ detail: { value: 'icons:android' } })
    expect(picker.commandVal).to.equal(
      '<simple-icon-lite icon="icons:android"></simple-icon-lite>',
    )
    expect(events.length).to.equal(1)
    expect(
      editor.innerHTML.toLowerCase().includes('simple-icon-lite'),
    ).to.equal(true)
    // empty value resets the command value without sending
    picker._pickerChange({ detail: {} })
    expect(picker.commandVal).to.equal('')
  })
})
