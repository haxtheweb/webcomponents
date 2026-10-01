// avoid the constructor's real Google Fonts link injection in this session;
// the font-link branch is exercised by the existing hax-logo.test.js session
globalThis.__haxLogoFontLoaded = true

import { fixture, expect, html } from '@open-wc/testing'
import { HaxLogo } from '../hax-logo.js'

describe('hax-logo behavior', () => {
  afterEach(() => {
    if ('ShadyCSS' in globalThis) {
      delete globalThis.ShadyCSS
    }
  })
  it('exposes tag and haxProperties file url', () => {
    expect(HaxLogo.tag).to.equal('hax-logo')
    expect(HaxLogo.haxProperties).to.include('lib/hax-logo.haxProperties.json')
  })
  it('renders the logo markup with slots', async () => {
    const el = await fixture(
      html`<hax-logo><span slot="pre">a</span>mazing<span slot="post">!</span></hax-logo>`,
    )
    const wrap = el.shadowRoot.querySelector('.wrap')
    expect(wrap).to.exist
    expect(el.shadowRoot.querySelector('.left').textContent).to.equal('<')
    expect(el.shadowRoot.querySelector('.right').textContent).to.equal('>')
    expect(el.shadowRoot.querySelector('.inner').textContent).to.include('h-a-x')
    expect(el.shadowRoot.querySelector('.the').textContent).to.equal('the')
    expect(el.shadowRoot.querySelector('.web').textContent).to.equal('web')
    expect(el.shadowRoot.querySelector('slot:not([name])')).to.exist
    expect(el.shadowRoot.querySelector('slot[name="pre"]')).to.exist
    expect(el.shadowRoot.querySelector('slot[name="post"]')).to.exist
    expect(el.textContent).to.include('mazing')
  })
  it('size getter and setter manage the size attribute', async () => {
    const el = await fixture(html`<hax-logo></hax-logo>`)
    expect(el.size).to.be.null
    el.size = 'large'
    expect(el.getAttribute('size')).to.equal('large')
    expect(el.size).to.equal('large')
    el.size = 'mini'
    expect(el.getAttribute('size')).to.equal('mini')
    expect(el.size).to.equal('mini')
  })
  it('toupper getter and setter manage the toupper attribute', async () => {
    const el = await fixture(html`<hax-logo></hax-logo>`)
    expect(el.toupper).to.be.null
    el.toupper = true
    expect(el.getAttribute('toupper')).to.equal('toupper')
    expect(el.toupper).to.equal('toupper')
    el.toupper = false
    expect(el.getAttribute('toupper')).to.equal('toupper')
  })
  it('re-renders without duplicating structure', async () => {
    const el = await fixture(html`<hax-logo></hax-logo>`)
    el.render()
    el.render()
    expect(el.shadowRoot.querySelectorAll('.wrap').length).to.equal(1)
    expect(el.shadowRoot.querySelectorAll('style').length).to.equal(1)
    expect(el.shadowRoot.textContent).to.not.include('null')
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
    const el = await fixture(html`<hax-logo></hax-logo>`)
    expect(styleElementCalls).to.be.greaterThan(0)
    expect(prepareTemplateCalls).to.be.greaterThan(0)
    expect(el.shadowRoot.querySelector('.wrap')).to.exist
  })
  it('meets a11y standards', async () => {
    const el = await fixture(html`<hax-logo size="mini" toupper></hax-logo>`)
    await expect(el).to.be.accessible()
  })
})
