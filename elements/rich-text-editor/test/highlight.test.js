import { fixture, expect, html } from '@open-wc/testing'
import '../lib/singletons/rich-text-editor-highlight.js'
import { sleep } from './helpers.js'

describe('rich-text-editor-highlight', () => {
  it('requestAvailability returns a singleton', async () => {
    const a = globalThis.RichTextEditorHighlight.requestAvailability()
    const b = globalThis.RichTextEditorHighlight.requestAvailability()
    expect(a === b).to.equal(true)
    expect(a.tagName.toLowerCase()).to.equal('rich-text-editor-highlight')
  })

  it('generates an rte- id in the constructor', async () => {
    const el = await fixture(
      html`<rich-text-editor-highlight></rich-text-editor-highlight>`,
    )
    expect(el.id.startsWith('rte-')).to.equal(true)
    // hidden is not set in the constructor, so it is undefined (falsy)
    expect(!el.hidden).to.equal(true)
  })

  it('renders a slot', async () => {
    const el = await fixture(
      html`<rich-text-editor-highlight></rich-text-editor-highlight>`,
    )
    expect(
      el.shadowRoot.querySelector('slot') === null,
    ).to.equal(false)
  })

  it('haxHooks registers preprocessing', async () => {
    const el = globalThis.RichTextEditorHighlight.requestAvailability()
    const hooks = el.haxHooks()
    expect(hooks.preProcessNodeToContent).to.equal(
      'haxpreProcessNodeToContent',
    )
  })

  it('haxpreProcessNodeToContent swaps itself for a span', async () => {
    const el = globalThis.RichTextEditorHighlight.requestAvailability()
    const host = globalThis.document.createElement('div')
    globalThis.document.body.appendChild(host)
    el.textContent = 'keep'
    host.appendChild(el)
    const span = el.haxpreProcessNodeToContent(el)
    expect(span.tagName.toLowerCase()).to.equal('span')
    expect(span.innerHTML).to.equal('keep')
    expect(host.contains(span)).to.equal(true)
    expect(host.querySelector('rich-text-editor-highlight')).to.equal(null)
    host.remove()
    // clear leftover contents so later wrap tests start empty
    el.innerHTML = ''
    el.emptyContents()
  })

  it('wrap ignores missing range', async () => {
    const el = globalThis.RichTextEditorHighlight.requestAvailability()
    el.wrap(undefined)
    expect(el.range === undefined).to.equal(true)
  })

  it('wrap takes over range contents and unwrap restores them', async () => {
    const el = globalThis.RichTextEditorHighlight.requestAvailability()
    const host = globalThis.document.createElement('div')
    host.innerHTML = '<p>before</p><p id="target">middle</p><p>after</p>'
    globalThis.document.body.appendChild(host)
    const target = host.querySelector('#target')
    const range = globalThis.document.createRange()
    range.selectNodeContents(target)
    el.wrap(range)
    expect(el.hidden).to.equal(false)
    expect(el.innerHTML).to.equal('middle')
    // the highlight has taken over the content inside the target
    expect(target.contains(el)).to.equal(true)
    expect(target.children.length).to.equal(1)
    // range now selects the highlight contents
    expect(range.startContainer === el).to.equal(true)

    el.unwrap(range)
    expect(el.hidden).to.equal(true)
    expect(el.parentNode === globalThis.document.body).to.equal(true)
    expect(target.innerHTML).to.equal('middle')
    host.remove()
  })

  it('wrap empties previous contents before wrapping a new range', async () => {
    const el = globalThis.RichTextEditorHighlight.requestAvailability()
    const host = globalThis.document.createElement('div')
    host.innerHTML = '<p>one</p><p>two</p>'
    globalThis.document.body.appendChild(host)
    const range1 = globalThis.document.createRange()
    range1.selectNodeContents(host.querySelector('p'))
    el.wrap(range1)
    // wrap again with a different range: emptyContents should run first
    const range2 = globalThis.document.createRange()
    range2.selectNodeContents(host.querySelectorAll('p')[1])
    el.wrap(range2)
    expect(el.innerHTML).to.equal('two')
    expect(host.querySelectorAll('p')[0].innerHTML).to.equal('one')
    el.emptyContents()
    host.remove()
  })

  it('emptyContents moves children out and hides', async () => {
    const el = globalThis.RichTextEditorHighlight.requestAvailability()
    const host = globalThis.document.createElement('div')
    host.innerHTML = '<span>x</span>'
    globalThis.document.body.appendChild(host)
    el.innerHTML = '<b>child</b>'
    host.appendChild(el)
    el.range = 'fake-range'
    el.emptyContents()
    expect(el.hidden).to.equal(true)
    expect(el.range === undefined).to.equal(true)
    expect(host.querySelector('b') === null).to.equal(false)
    expect(el.parentNode === globalThis.document.body).to.equal(true)
    host.remove()
  })
})
