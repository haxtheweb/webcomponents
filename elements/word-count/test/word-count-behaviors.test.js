import { fixture, expect, html } from '@open-wc/testing'

import '../word-count.js'

// Behavioral coverage for word-count: slotted-text counting via
// MutationObserver, words-text attribute reflection, wordsPrefix / t
// synchronization, and observer teardown on disconnect.
describe('word-count behaviors', () => {
  it('registers the custom element', () => {
    expect(globalThis.customElements.get('word-count')).to.exist
  })

  it('counts words from slotted text content and reflects words-text attribute', async () => {
    const el = await fixture(html`<word-count>Hello world</word-count>`)
    await new Promise((resolve) => setTimeout(resolve, 50))
    // two slotted words report 2 (haxtheweb/issues#3102)
    expect(el.words).to.equal(2)
    expect(el.getAttribute('words-text')).to.equal('Word count: 2')
  })

  it('reports one for a single word', async () => {
    const el = await fixture(html`<word-count>one</word-count>`)
    await new Promise((resolve) => setTimeout(resolve, 50))
    // a single word now reports 1 (haxtheweb/issues#3102)
    expect(el.words).to.equal(1)
    expect(el.getAttribute('words-text')).to.equal('Word count: 1')
  })

  it('ignores leading and trailing whitespace when counting', async () => {
    const el = await fixture(html`<word-count>
      one two three
    </word-count>`)
    await new Promise((resolve) => setTimeout(resolve, 50))
    // whitespace from pretty-printed markup no longer inflates the
    // count (haxtheweb/issues#3102)
    expect(el.words).to.equal(3)
    expect(el.getAttribute('words-text')).to.equal('Word count: 3')
  })

  it('sets words to 0 when there is no text content', async () => {
    const el = await fixture(html`<word-count></word-count>`)
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(el.words).to.equal(0)
    expect(el.getAttribute('words-text')).to.equal('Word count: 0')
  })

  it('re-counts when slotted text mutates (MutationObserver childList)', async () => {
    const el = await fixture(html`<word-count>one</word-count>`)
    await new Promise((resolve) => setTimeout(resolve, 50))
    el.textContent = 'a b c'
    await new Promise((resolve) => setTimeout(resolve, 50))
    // 3 plain words report 3 (haxtheweb/issues#3102)
    expect(el.words).to.equal(3)
    expect(el.getAttribute('words-text')).to.equal('Word count: 3')
  })

  it('re-counts on characterData mutation inside a child node', async () => {
    const el = await fixture(
      html`<word-count><span>one two</span></word-count>`,
    )
    await new Promise((resolve) => setTimeout(resolve, 50))
    el.querySelector('span').textContent = 'a b c d'
    await new Promise((resolve) => setTimeout(resolve, 50))
    // 4 plain words report 4 (haxtheweb/issues#3102)
    expect(el.words).to.equal(4)
  })

  it('preserves a parse-time words-prefix attribute through the first update', async () => {
    const el = await fixture(
      html`<word-count words-prefix="Words">one two</word-count>`,
    )
    await new Promise((resolve) => setTimeout(resolve, 100))
    // the constructor-default first pass (oldValue undefined) no longer
    // clobbers the attribute-mapped wordsPrefix (haxtheweb/issues#3102)
    expect(el.wordsPrefix).to.equal('Words')
    expect(el.getAttribute('words-text')).to.equal('Words: 2')
    // setting the property after connection still applies
    el.wordsPrefix = 'Total'
    await el.updateComplete
    await el.updateComplete
    expect(el.t.wordsPrefix).to.equal('Total')
    expect(el.getAttribute('words-text')).to.equal('Total: 2')
  })

  it('syncs wordsPrefix from the t object when t changes', async () => {
    const el = await fixture(html`<word-count>one two</word-count>`)
    await new Promise((resolve) => setTimeout(resolve, 50))
    el.t = { wordsPrefix: 'Contador de palabras' }
    // t-branch sets wordsPrefix inside update(), which schedules a second
    // update pass; await both cycles before asserting the attribute
    await el.updateComplete
    await el.updateComplete
    expect(el.wordsPrefix).to.equal('Contador de palabras')
    expect(el.getAttribute('words-text')).to.equal(
      'Contador de palabras: 2',
    )
  })

  it('re-sets t from wordsPrefix when the property is set directly', async () => {
    const el = await fixture(html`<word-count>one two</word-count>`)
    await new Promise((resolve) => setTimeout(resolve, 50))
    el.wordsPrefix = 'Total'
    await el.updateComplete
    expect(el.t.wordsPrefix).to.equal('Total')
    expect(el.getAttribute('words-text')).to.equal('Total: 2')
  })

  it('stops counting once disconnected (observer teardown)', async () => {
    const container = globalThis.document.createElement('div')
    container.innerHTML = '<word-count>one</word-count>'
    globalThis.document.body.appendChild(container)
    const el = container.querySelector('word-count')
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(el.words).to.equal(1)
    container.removeChild(el)
    el.textContent = 'a b c d e f'
    await new Promise((resolve) => setTimeout(resolve, 50))
    // observer was disconnected, so the count does not move
    expect(el.words).to.equal(1)
  })

  it('is accessible with slotted content', async () => {
    const el = await fixture(html`<word-count>Hello world</word-count>`)
    await new Promise((resolve) => setTimeout(resolve, 50))
    await expect(el).shadowDom.to.be.accessible()
    // screen-reader mirror of the count is rendered in shadow DOM
    const sr = el.shadowRoot.querySelector('.screen-reader-text')
    expect(sr).to.exist
    expect(sr.textContent.trim()).to.equal('Word count: 2')
  })
})
