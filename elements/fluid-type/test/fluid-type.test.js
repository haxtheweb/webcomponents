import { fixture, expect, html } from '@open-wc/testing'
import { FluidType } from '../fluid-type.js'

describe('fluid-type', () => {
  afterEach(() => {
    if ('ShadyCSS' in globalThis) {
      delete globalThis.ShadyCSS
    }
  })
  it('registers as a custom element with the expected tag', async () => {
    const el = await fixture(html`<fluid-type></fluid-type>`)
    expect(el.tagName).to.equal('FLUID-TYPE')
    expect(el.tag).to.equal('fluid-type')
    expect(FluidType.tag).to.equal('fluid-type')
    expect(el.constructor).to.equal(FluidType)
  })
  it('renders a style block and slot in shadow DOM', async () => {
    const el = await fixture(html`<fluid-type>hello</fluid-type>`)
    const style = el.shadowRoot.querySelector('style')
    const slot = el.shadowRoot.querySelector('slot')
    expect(style).to.exist
    expect(slot).to.exist
    expect(style.textContent).to.include('--fluid-type-min-size')
    expect(style.textContent).to.include('--fluid-type-max-screen')
    expect(el.textContent).to.equal('hello')
  })
  it('supports delayed render via constructor flag', () => {
    const el = new FluidType(true)
    expect(el.shadowRoot.querySelectorAll('*').length).to.equal(0)
    el.render()
    expect(el.shadowRoot.querySelector('slot')).to.exist
    expect(el.shadowRoot.querySelector('style')).to.exist
    expect(el.template).to.exist
  })
  it('re-renders without duplicating slot or style', async () => {
    const el = await fixture(html`<fluid-type></fluid-type>`)
    el.render()
    el.render()
    expect(el.shadowRoot.querySelectorAll('slot').length).to.equal(1)
    expect(el.shadowRoot.querySelectorAll('style').length).to.equal(1)
  })
  it('does not leak a stray null text node on render', async () => {
    // render() assigns shadowRoot.innerHTML = null which could stringify to a
    // "null" text node; assert it stays clean after initial render
    const el = await fixture(html`<fluid-type></fluid-type>`)
    expect(el.shadowRoot.textContent).to.not.include('null')
    expect(el.shadowRoot.querySelectorAll('*').length).to.equal(2)
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
    const el = await fixture(html`<fluid-type></fluid-type>`)
    expect(styleElementCalls).to.be.greaterThan(0)
    el.render()
    expect(prepareTemplateCalls).to.be.greaterThan(0)
    expect(el.shadowRoot.querySelector('slot')).to.exist
  })
  it('meets a11y standards', async () => {
    const el = await fixture(html`<fluid-type>fluid text</fluid-type>`)
    await expect(el).to.be.accessible()
  })
})
