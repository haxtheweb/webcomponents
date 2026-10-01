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
    // BUG (word-count.js:112): split(/\s+/g).length - 1 is off by one.
    // Two slotted words report 1. Assertion documents current behavior.
    expect(el.words).to.equal(1)
    expect(el.getAttribute('words-text')).to.equal('Word count: 1')
  })

  it('reports zero for a single word (BUG: off-by-one arithmetic)', async () => {
    const el = await fixture(html`<word-count>one</word-count>`)
    await new Promise((resolve) => setTimeout(resolve, 50))
    // BUG (word-count.js:112): a single word has split length 1,
    // so 1 - 1 reports 0 words.
    expect(el.words).to.equal(0)
    expect(el.getAttribute('words-text')).to.equal('Word count: 0')
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
    // 3 words -> split length 3 -> 3 - 1 = 2 (BUG off-by-one documented above)
    expect(el.words).to.equal(2)
    expect(el.getAttribute('words-text')).to.equal('Word count: 2')
  })

  it('re-counts on characterData mutation inside a child node', async () => {
    const el = await fixture(
      html`<word-count><span>one two</span></word-count>`,
    )
    await new Promise((resolve) => setTimeout(resolve, 50))
    el.querySelector('span').textContent = 'a b c d'
    await new Promise((resolve) => setTimeout(resolve, 50))
    // 4 words -> split length 4 -> 3
    expect(el.words).to.equal(3)
  })

  it('BUG: words-prefix attribute is clobbered back to the default on first update', async () => {
    const el = await fixture(
      html`<word-count words-prefix="Words">one two</word-count>`,
    )
    await new Promise((resolve) => setTimeout(resolve, 100))
    // BUG (word-count.js:84-95): update() processes the constructor-set t
    // (wordsPrefix 'Word count') on the first pass, overwriting the value
    // mapped from the words-prefix attribute before it ever renders.
    // The demo's words-prefix="Do not translate me" suffers the same clobber.
    // Assertions document current behavior.
    expect(el.wordsPrefix).to.equal('Word count')
    expect(el.getAttribute('words-text')).to.equal('Word count: 1')
    // setting the property after connection does apply
    el.wordsPrefix = 'Words'
    await el.updateComplete
    await el.updateComplete
    expect(el.t.wordsPrefix).to.equal('Words')
    expect(el.getAttribute('words-text')).to.equal('Words: 1')
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
      'Contador de palabras: 1',
    )
  })

  it('re-sets t from wordsPrefix when the property is set directly', async () => {
    const el = await fixture(html`<word-count>one two</word-count>`)
    await new Promise((resolve) => setTimeout(resolve, 50))
    el.wordsPrefix = 'Total'
    await el.updateComplete
    expect(el.t.wordsPrefix).to.equal('Total')
    expect(el.getAttribute('words-text')).to.equal('Total: 1')
  })

  it('stops counting once disconnected (observer teardown)', async () => {
    const container = globalThis.document.createElement('div')
    container.innerHTML = '<word-count>one</word-count>'
    globalThis.document.body.appendChild(container)
    const el = container.querySelector('word-count')
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(el.words).to.equal(0)
    container.removeChild(el)
    el.textContent = 'a b c d e f'
    await new Promise((resolve) => setTimeout(resolve, 50))
    // observer was disconnected, so the count does not move
    expect(el.words).to.equal(0)
  })

  it('is accessible with slotted content', async () => {
    const el = await fixture(html`<word-count>Hello world</word-count>`)
    await new Promise((resolve) => setTimeout(resolve, 50))
    await expect(el).shadowDom.to.be.accessible()
    // screen-reader mirror of the count is rendered in shadow DOM
    const sr = el.shadowRoot.querySelector('.screen-reader-text')
    expect(sr).to.exist
    expect(sr.textContent.trim()).to.equal('Word count: 1')
  })
})
