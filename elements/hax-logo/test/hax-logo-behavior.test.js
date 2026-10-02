// FIXED (issue #3102 on-prem flag): the constructor no longer injects the
// remote fonts.googleapis.com stylesheet, so this session needs no
// __haxLogoFontLoaded guard to stay hermetic
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
  // FIXED (issue #3102 bug 51): the stray </bt> closing tag typo is gone
  // from the template source (the parser used to drop it, so the DOM was
  // never affected; this asserts the source directly). Authored assertion:
  // no round-10 evidence existed for this bug.
  it('renders the inner span without the stray </bt> typo in the source', async () => {
    const el = await fixture(html`<hax-logo></hax-logo>`)
    expect(el.html).to.not.contain('</bt>')
    const inner = el.shadowRoot.querySelector('.inner')
    expect(inner).to.exist
    expect(inner.querySelectorAll('br').length).to.equal(2)
    expect(inner.querySelector('.the')).to.exist
    expect(inner.querySelector('.web')).to.exist
  })
  // a11y follow-up: the decorative angle-bracket spans are hidden from AT
  it('hides the decorative angle-bracket spans from assistive tech', async () => {
    const el = await fixture(html`<hax-logo></hax-logo>`)
    expect(el.shadowRoot.querySelector('.left').getAttribute('aria-hidden')).to.equal('true')
    expect(el.shadowRoot.querySelector('.right').getAttribute('aria-hidden')).to.equal('true')
  })
  // FIXED (issue #3102 on-prem flag): first instantiation never hits the
  // network for fonts; the brand font resolves from a local/self-hosted
  // copy or the system monospace stack declared on .wrap
  it('never injects a remote font stylesheet and declares a local font fallback', async () => {
    const before = globalThis.document.head.querySelectorAll(
      'link[href*="fonts.googleapis.com"]',
    ).length
    await fixture(html`<hax-logo></hax-logo>`)
    const after = globalThis.document.head.querySelectorAll(
      'link[href*="fonts.googleapis.com"]',
    ).length
    expect(after).to.equal(before)
    const el = globalThis.document.createElement('hax-logo')
    expect(el.html).to.not.contain('fonts.googleapis.com')
    expect(el.html).to.contain('--hax-logo-font-family')
    expect(el.html).to.contain('Press Start 2P')
    expect(el.html).to.contain('monospace')
  })
})
