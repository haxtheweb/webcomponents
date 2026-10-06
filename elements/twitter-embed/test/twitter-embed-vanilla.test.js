import { fixture, expect, html } from '@open-wc/testing'
import { TwitterEmbedVanilla } from '../lib/twitter-embed-vanilla.js'

// network stub: the vanilla element stamps its markup through innerHTML so
// attribute-driven re-renders are captured and redirected away from
// platform.twitter.com instead of ever loading a real tweet iframe
const vanillaHtml = []
const innerHTMLDescriptor = Object.getOwnPropertyDescriptor(
  Element.prototype,
  'innerHTML',
)
Object.defineProperty(Element.prototype, 'innerHTML', {
  ...innerHTMLDescriptor,
  set(value) {
    if (this instanceof TwitterEmbedVanilla) {
      const markup = String(value)
      vanillaHtml.push(markup)
      innerHTMLDescriptor.set.call(
        this,
        markup.replace('https://platform.twitter.com', './twitter-blocked'),
      )
      return
    }
    innerHTMLDescriptor.set.call(this, value)
  },
})
after(() => {
  Object.defineProperty(Element.prototype, 'innerHTML', innerHTMLDescriptor)
})

describe('twitter-embed-vanilla', () => {
  it('is defined with its tag name', () => {
    expect(TwitterEmbedVanilla.tag).to.equal('twitter-embed-vanilla')
    expect(globalThis.customElements.get('twitter-embed-vanilla')).to.exist
  })

  it('observes the attributes it rerenders from', () => {
    expect(TwitterEmbedVanilla.observedAttributes).to.deep.equal([
      'lang',
      'tweet',
      'data-width',
      'data-theme',
      'tweet-id',
      'no-popups',
    ])
  })

  it('defaults its presentation values', async () => {
    const el = await fixture(
      html`<twitter-embed-vanilla></twitter-embed-vanilla>`,
    )
    expect(el.dataWidth).to.equal('550px')
    expect(el.dataTheme).to.equal('light')
    expect(el.allowPopups).to.equal('allow-popups')
    expect(el.tweet).to.equal(null)
    expect(el.tweetId).to.equal(null)
  })

  it('resolves the language from the document', async () => {
    const el = await fixture(
      html`<twitter-embed-vanilla></twitter-embed-vanilla>`,
    )
    expect(el.lang).to.equal('en')
  })

  it('derives a tweet id from tweet urls', async () => {
    const el = await fixture(
      html`<twitter-embed-vanilla></twitter-embed-vanilla>`,
    )
    el.tweet = 'https://twitter.com/btopro/status/12345'
    expect(el.tweetId).to.equal('12345')
    el.tweet = 'https://x.com/btopro/status/6789'
    expect(el.tweetId).to.equal('6789')
    el.tweet = 'https://example.com/nope'
    expect(el.tweetId).to.equal('6789')
  })

  it('builds iframe markup for the current state', async () => {
    const el = await fixture(
      html`<twitter-embed-vanilla
        tweet-id="42"
        data-width="300px"
        data-theme="dark"
        no-popups
        lang="es"
      ></twitter-embed-vanilla>`,
    )
    const markup = el.html
    expect(markup).to.include('<iframe')
    expect(markup).to.include('data-tweet-id="42"')
    expect(markup).to.include('id=42')
    // a lang attribute authored on the element wins over the document chain
    expect(markup).to.include('lang=es')
    expect(markup).to.include('width=300px')
    expect(markup).to.include('theme=dark')
    expect(markup).to.include('sandbox="allow-same-origin allow-scripts "')
    // embed policy: the referrer is always sent, credentialless only on
    // cross-origin isolated pages (this test env is not isolated)
    expect(markup).to.include(
      'referrerpolicy="strict-origin-when-cross-origin"',
    )
    expect(markup).to.not.include('credentialless')
  })

  it('toggles popups through the no-popups attribute states', async () => {
    const el = await fixture(
      html`<twitter-embed-vanilla></twitter-embed-vanilla>`,
    )
    el.setAttribute('no-popups', 'no-popups')
    expect(el.allowPopups).to.equal('')
    el.setAttribute('no-popups', 'off')
    expect(el.allowPopups).to.equal('allow-popups')
    el.setAttribute('no-popups', '')
    expect(el.allowPopups).to.equal('')
    el.setAttribute('no-popups', 'null')
    expect(el.allowPopups).to.equal('')
    el.removeAttribute('no-popups')
    expect(el.allowPopups).to.equal('')
  })

  it('rerenders when presentation attributes change', async () => {
    const el = await fixture(
      html`<twitter-embed-vanilla></twitter-embed-vanilla>`,
    )
    const count = vanillaHtml.length
    el.lang = 'es'
    expect(vanillaHtml.length).to.be.greaterThan(count)
    expect(vanillaHtml[vanillaHtml.length - 1]).to.include('lang=es')
    el.dataTheme = 'dark'
    expect(vanillaHtml[vanillaHtml.length - 1]).to.include('theme=dark')
    el.dataWidth = '300px'
    expect(vanillaHtml[vanillaHtml.length - 1]).to.include('width=300px')
    el.tweetId = '84'
    expect(vanillaHtml[vanillaHtml.length - 1]).to.include('id=84')
  })

  it('resets invalid themes to light', async () => {
    const el = await fixture(
      html`<twitter-embed-vanilla></twitter-embed-vanilla>`,
    )
    el.dataTheme = 'purple'
    expect(el.dataTheme).to.equal('light')
  })

  it('removes attributes when null is assigned', async () => {
    const el = await fixture(
      html`<twitter-embed-vanilla
        data-width="300px"
        lang="es"
        tweet-id="9"
      ></twitter-embed-vanilla>`,
    )
    el.dataWidth = null
    expect(el.getAttribute('data-width')).to.equal(null)
    el.tweetId = null
    expect(el.getAttribute('tweet-id')).to.equal(null)
    el.tweet = null
    expect(el.getAttribute('tweet')).to.equal(null)
    el.lang = ''
    expect(el.getAttribute('lang')).to.equal(null)
  })

  it('passes the a11y audit', async () => {
    const el = await fixture(
      html`<twitter-embed-vanilla tweet-id="42"></twitter-embed-vanilla>`,
    )
    await expect(el).to.be.accessible()
  })
})
