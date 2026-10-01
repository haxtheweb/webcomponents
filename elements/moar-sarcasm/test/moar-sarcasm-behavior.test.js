import { fixture, expect, html } from '@open-wc/testing'
import { MoarSarcasm } from '../moar-sarcasm.js'

describe('moar-sarcasm behavior', () => {
  afterEach(() => {
    if ('ShadyCSS' in globalThis) {
      delete globalThis.ShadyCSS
    }
  })
  it('exposes tag and haxProperties file url', () => {
    expect(MoarSarcasm.tag).to.equal('moar-sarcasm')
    expect(MoarSarcasm.haxProperties).to.include('lib/moar-sarcasm.haxProperties.json')
  })
  it('defaults a11y label and renders sarcastic text', async () => {
    const el = await fixture(html`<moar-sarcasm>wow so amazing</moar-sarcasm>`)
    expect(el.a11y).to.equal('the following is sarcastic:')
    expect(el.getAttribute('a11y')).to.equal('the following is sarcastic:')
    const sarcastic = el.shadowRoot.querySelector('.sarcastic')
    expect(sarcastic).to.exist
    expect(sarcastic.textContent).to.equal('wow so amazing')
    expect(sarcastic.querySelectorAll('.letter').length).to.equal(12)
    expect(el.say).to.equal('wow so amazing')
  })
  it('say setter updates text, attribute, and rendering via observer', async () => {
    const el = await fixture(html`<moar-sarcasm>initial words</moar-sarcasm>`)
    el.say = 'totally great news'
    // MutationObserver flush is asynchronous
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(el.innerText).to.equal('totally great news')
    expect(el.getAttribute('say')).to.equal('totally great news')
    expect(el.say).to.equal('totally great news')
    const sarcastic = el.shadowRoot.querySelector('.sarcastic')
    expect(sarcastic.textContent).to.equal('totally great news')
    expect(sarcastic.querySelectorAll('.letter').length).to.equal(16)
  })
  it('processes non-letter characters as plain text nodes', async () => {
    const el = await fixture(html`<moar-sarcasm>HA! 123 ok</moar-sarcasm>`)
    const sarcastic = el.shadowRoot.querySelector('.sarcastic')
    expect(sarcastic.querySelectorAll('.letter').length).to.equal(4)
    expect(sarcastic.textContent).to.equal('HA! 123 ok')
    // space and digit characters render as raw text nodes, not spans
    const textNodes = Array.from(sarcastic.childNodes).filter(
      (node) => node.nodeType === 3,
    )
    expect(textNodes.map((node) => node.textContent).join('')).to.include('! 123 ')
  })
  it('re-renders sarcasm when say attribute changes directly', async () => {
    const el = await fixture(html`<moar-sarcasm>old text</moar-sarcasm>`)
    el.setAttribute('say', 'new text here')
    const sarcastic = el.shadowRoot.querySelector('.sarcastic')
    expect(sarcastic.textContent).to.equal('new text here')
    expect(sarcastic.querySelectorAll('.letter').length).to.equal(11)
  })
  it('keeps screen reader text visually hidden but present', async () => {
    const el = await fixture(html`<moar-sarcasm>hidden but readable</moar-sarcasm>`)
    const slot = el.shadowRoot.querySelector('.slot')
    expect(slot).to.exist
    expect(slot.textContent).to.include('the following is sarcastic:')
    expect(slot.querySelector('slot')).to.exist
    const visuallyHidden = el.shadowRoot.querySelector('.sarcastic')
    expect(visuallyHidden.getAttribute('aria-hidden')).to.equal('true')
  })
  it('calls ShadyCSS hooks when present', async () => {
    let styleElementCalls = 0
    let prepareTemplateCalls = 0
    globalThis.ShadyCSS = {
      styleElement: () => {
        styleElementCalls++
      },
      prepareTemplate: () => {
        prepareTemplateCalls++
      },
    }
    const el = await fixture(html`<moar-sarcasm>shady times</moar-sarcasm>`)
    expect(styleElementCalls).to.be.greaterThan(0)
    expect(prepareTemplateCalls).to.be.greaterThan(0)
    expect(el.shadowRoot.querySelector('.sarcastic').textContent).to.equal(
      'shady times',
    )
  })
  it('meets a11y standards', async () => {
    const el = await fixture(html`<moar-sarcasm>accessibility rules</moar-sarcasm>`)
    await expect(el).to.be.accessible()
  })
})
