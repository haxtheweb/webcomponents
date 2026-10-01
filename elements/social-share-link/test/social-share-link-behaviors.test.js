import { fixture, expect, html } from '@open-wc/testing'

import '../social-share-link.js'

// Behavioral coverage for social-share-link: per-type share hrefs
// (Facebook / LinkedIn / Pinterest / Twitter), link text / icon
// derivation, display modes, and property-change recomputation.
describe('social-share-link behaviors', () => {
  it('registers the custom element', () => {
    expect(globalThis.customElements.get('social-share-link')).to.exist
  })

  it('renders a default Twitter link with icon and link text', async () => {
    const el = await fixture(html`<social-share-link></social-share-link>`)
    await el.updateComplete
    expect(el.type).to.equal('Twitter')
    expect(el.__linkText).to.equal('Share via Twitter')
    expect(el.__icon).to.equal('mdi-social:twitter')
    const a = el.shadowRoot.querySelector('a')
    expect(a).to.exist
    expect(a.getAttribute('target')).to.equal('_blank')
    expect(a.getAttribute('rel')).to.equal('noopener noreferrer')
    // BUG (social-share-link.js:278): with no message/url the literal
    // string 'null' is concatenated into the tweet text query param.
    // encodeURI of "text= null" -> "text=%20null".
    expect(el.__href).to.equal('http://twitter.com/intent/tweet?text=%20null')
  })

  it('builds a Facebook share href from the url', async () => {
    const el = await fixture(
      html`<social-share-link
        type="Facebook"
        url="http://zombo.com"
      ></social-share-link>`,
    )
    await el.updateComplete
    expect(el.__href).to.equal(
      'https://www.facebook.com/sharer/sharer.php?u=http://zombo.com',
    )
    expect(el.shadowRoot.querySelector('a').getAttribute('href')).to.equal(
      'https://www.facebook.com/sharer/sharer.php?u=http://zombo.com',
    )
    expect(el.__linkText).to.equal('Share via Facebook')
    expect(el.__icon).to.equal('mdi-social:facebook')
  })

  it('BUG: Facebook without a url yields href "false" and never disables', async () => {
    const el = await fixture(
      html`<social-share-link type="Facebook"></social-share-link>`,
    )
    await el.updateComplete
    // BUG (social-share-link.js:254-258 + 283): url null makes _getHref
    // return false, but encodeURI(false) coerces to the string "false",
    // so __href is truthy and the ?disabled binding in render() is
    // never true. The disabled link styling can never apply.
    expect(el.__href).to.equal('false')
    const a = el.shadowRoot.querySelector('a')
    expect(a.hasAttribute('disabled')).to.equal(false)
  })

  it('builds a LinkedIn share href from the url', async () => {
    const el = await fixture(
      html`<social-share-link
        type="LinkedIn"
        url="https://btopro.com/"
      ></social-share-link>`,
    )
    await el.updateComplete
    expect(el.__href).to.equal(
      'https://www.linkedin.com/shareArticle?mini=true&url=https://btopro.com/',
    )
  })

  it('builds a LinkedIn base href when url is missing', async () => {
    const el = await fixture(
      html`<social-share-link type="LinkedIn"></social-share-link>`,
    )
    await el.updateComplete
    // NOTE (social-share-link.js:261-265): the "link !== null" ternary is
    // always true (link is a string), so the ": false" fallback is dead.
    // Missing url degrades to the bare share endpoint instead.
    expect(el.__href).to.equal(
      'https://www.linkedin.com/shareArticle?mini=true',
    )
  })

  it('builds a Pinterest share href from url, message and image', async () => {
    const el = await fixture(
      html`<social-share-link
        type="Pinterest"
        url="http://zombo.com"
        message="Pin It!"
        image="http://lorempixel.com/400/200/cats"
      ></social-share-link>`,
    )
    await el.updateComplete
    expect(el.__href).to.equal(
      'http://pinterest.com/pin/create/button/?url=http://zombo.com&description=Pin%20It!&media=http://lorempixel.com/400/200/cats',
    )
  })

  it('builds a Pinterest href with only supplied params', async () => {
    const el = await fixture(
      html`<social-share-link
        type="Pinterest"
        message="Pin It!"
      ></social-share-link>`,
    )
    await el.updateComplete
    // NOTE (social-share-link.js:267-275): same dead ": false" ternary
    // pattern as LinkedIn. Also image defaults to "" (not null), so the
    // !== null check always appends an empty "&media=" param.
    expect(el.__href).to.equal(
      'http://pinterest.com/pin/create/button/?description=Pin%20It!&media=',
    )
  })

  it('builds a Twitter intent href from message and url', async () => {
    const el = await fixture(
      html`<social-share-link
        type="Twitter"
        message="hello"
        url="https://x.com"
      ></social-share-link>`,
    )
    await el.updateComplete
    expect(el.__href).to.equal(
      'http://twitter.com/intent/tweet?text=hello%20https://x.com',
    )
  })

  it('BUG: an unknown type yields the string "undefined" as href', async () => {
    // direct method call (no connect) so the icon resolver never
    // requests an iconset svg for the unknown type
    const el = globalThis.document.createElement('social-share-link')
    // BUG (social-share-link.js:251-283): _getHref has no default case;
    // an unrecognized type leaves link undefined and encodeURI(undefined)
    // produces the string "undefined" as a navigable href.
    expect(el._getHref('', '', 'Myspace', 'https://x.com')).to.equal(
      'undefined',
    )
    expect(el._getLinkText(null, 'Myspace')).to.equal('Share via Myspace')
    expect(el._getIcon('Myspace')).to.equal('mdi-social:myspace')
  })

  it('honors custom link text over the default', async () => {
    const el = await fixture(
      html`<social-share-link
        type="Twitter"
        text="Tweet this!"
      ></social-share-link>`,
    )
    await el.updateComplete
    expect(el.__linkText).to.equal('Tweet this!')
    const span = el.shadowRoot.querySelector('span.linktext')
    expect(span).to.exist
    expect(span.textContent.trim()).to.equal('Tweet this!')
  })

  it('reflects button-style attribute on the host', async () => {
    const el = await fixture(
      html`<social-share-link button-style type="Twitter"></social-share-link>`,
    )
    await el.updateComplete
    expect(el.buttonStyle).to.equal(true)
    expect(el.hasAttribute('button-style')).to.equal(true)
  })

  it('icon-only mode shows the icon and keeps text for screen readers', async () => {
    const el = await fixture(
      html`<social-share-link
        type="Pinterest"
        mode="icon-only"
        url="http://zombo.com"
      ></social-share-link>`,
    )
    await el.updateComplete
    expect(el.__showIcon).to.equal(true)
    const a = el.shadowRoot.querySelector('a')
    expect(a.getAttribute('class')).to.equal('icon-only')
    const icon = el.shadowRoot.querySelector('simple-icon-lite')
    expect(icon.hasAttribute('hidden')).to.equal(false)
    const span = el.shadowRoot.querySelector('span.linktext')
    expect(span).to.exist
    // linktext is visually offscreen but still present in the a11y tree
    expect(span.textContent.trim()).to.equal('Share via Pinterest')
  })

  it('text-only mode hides the icon', async () => {
    const el = await fixture(
      html`<social-share-link
        type="Facebook"
        mode="text-only"
        url="http://zombo.com"
      ></social-share-link>`,
    )
    await el.updateComplete
    expect(el.__showIcon).to.equal(false)
    const a = el.shadowRoot.querySelector('a')
    expect(a.getAttribute('class')).to.equal('text-only')
    const icon = el.shadowRoot.querySelector('simple-icon-lite')
    expect(icon.hasAttribute('hidden')).to.equal(true)
  })

  it('BUG: default (no mode) hides the icon though docs say icon+text', async () => {
    const el = await fixture(
      html`<social-share-link
        type="Twitter"
        text="Tweet this!"
        message="hi"
        url="https://x.com"
      ></social-share-link>`,
    )
    await el.updateComplete
    // BUG (social-share-link.js:237-239): __showIcon is only true when
    // mode == "icon-only"; the documented default (mode unset -> icon and
    // text both displayed) renders with the icon hidden instead. The demo
    // relies on the default showing both.
    expect(el.__showIcon).to.equal(false)
    const icon = el.shadowRoot.querySelector('simple-icon-lite')
    expect(icon.hasAttribute('hidden')).to.equal(true)
  })

  it('recomputes the href when url changes after connection', async () => {
    const el = await fixture(
      html`<social-share-link type="Facebook"></social-share-link>`,
    )
    await el.updateComplete
    expect(el.__href).to.equal('false')
    el.url = 'http://zombo.com'
    await el.updateComplete
    expect(el.__href).to.equal(
      'https://www.facebook.com/sharer/sharer.php?u=http://zombo.com',
    )
  })

  it('recomputes icon and link text when type changes after connection', async () => {
    const el = await fixture(html`<social-share-link></social-share-link>`)
    await el.updateComplete
    el.type = 'LinkedIn'
    await el.updateComplete
    expect(el.__icon).to.equal('mdi-social:linkedin')
    expect(el.__linkText).to.equal('Share via LinkedIn')
    expect(el.__href).to.equal(
      'https://www.linkedin.com/shareArticle?mini=true',
    )
  })

  it('passes the a11y audit in button mode', async () => {
    const el = await fixture(
      html`<social-share-link
        button-style
        type="Twitter"
        text="Tweet this!"
        message="hello"
        url="https://x.com"
      ></social-share-link>`,
    )
    await el.updateComplete
    await expect(el).shadowDom.to.be.accessible()
  })
})
