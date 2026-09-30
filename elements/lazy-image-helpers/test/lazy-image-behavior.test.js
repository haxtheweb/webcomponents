import { fixture, expect, html, aTimeout } from '@open-wc/testing'

import { lazyImage } from '../lazy-image-helpers.js'

// a tiny inline gif so no network is ever involved in image loading
const pixelSrc =
  'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='

describe('lazy-image', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`
      <lazy-image src="${pixelSrc}" alt="A pixel" described-by="desc-id">
      </lazy-image>
    `)
  })

  it('is an instance of lazyImage with defaults', async () => {
    expect(element).to.be.instanceOf(lazyImage)
    expect(lazyImage.tag).to.equal('lazy-image')
    expect(element.imageLoaded).to.equal(false)
    expect(element.loadingImg).to.equal('loading:bars')
    expect(element.replacementDelay).to.equal(1000)
    expect(element.IOVisibleLimit).to.equal(0.1)
    expect(element.IOThresholds).to.deep.equal([
      0.0, 0.1, 0.25, 0.5, 0.75, 1.0,
    ])
  })

  it('renders the image with its accessibility wiring', async () => {
    const img = element.shadowRoot.querySelector('img[loading="lazy"]')
    expect(img).to.exist
    expect(img.getAttribute('src')).to.equal(pixelSrc)
    expect(img.getAttribute('alt')).to.equal('A pixel')
    expect(img.getAttribute('aria-describedby')).to.equal('desc-id')
    expect(element.shadowRoot.querySelector('div.image-wrap')).to.exist
  })

  it('renders the svg loader while the image is not loaded', async () => {
    element.imageLoaded = false
    await element.updateComplete
    const svg = element.shadowRoot.querySelector('svg')
    expect(svg).to.exist
    expect(svg.querySelector('image').getAttribute('focusable')).to.equal(
      'false',
    )
    // flipping to loaded removes the loader entirely
    element.imageLoaded = true
    await element.updateComplete
    expect(element.shadowRoot.querySelector('svg')).to.not.exist
    expect(element.hasAttribute('image-loaded')).to.equal(true)
  })

  it('re-applies the loading icon when imageLoaded drops back to false', async () => {
    element.imageLoaded = true
    await element.updateComplete
    element.imageLoaded = false
    await element.updateComplete
    // the updated() hook points the svg loader image back at the loading icon
    const loaderImage = element.shadowRoot.querySelector('svg image')
    expect(loaderImage.hasAttribute('xlink:href')).to.equal(true)
  })

  it('marks itself loaded once visible after the replacement delay', async () => {
    element.replacementDelay = 10
    // the debounce captures the delay at scheduling time, so re-trigger the
    // visibility change to schedule a fresh 10ms debounce regardless of
    // when the intersection observer first flipped elementVisible
    element.elementVisible = false
    await element.updateComplete
    element.elementVisible = true
    await element.updateComplete
    await aTimeout(100)
    expect(element.imageLoaded).to.equal(true)
    expect(element.hasAttribute('image-loaded')).to.equal(true)
    expect(element.hasAttribute('loaded')).to.equal(true)
    expect(element.shadowRoot.querySelector('svg')).to.not.exist
  })

  it('completes loading from the img load event', async () => {
    element.imageLoaded = false
    await element.updateComplete
    const img = element.shadowRoot.querySelector('img[loading="lazy"]')
    img.dispatchEvent(new Event('load'))
    await aTimeout(50)
    expect(element.imageLoaded).to.equal(true)
  })

  it('exposes a manual completion hook', async () => {
    element.imageLoaded = false
    await element.updateComplete
    element._lazyImageLoadComplete()
    await element.updateComplete
    expect(element.imageLoaded).to.equal(true)
  })

  it('completes loading from the img error event', async () => {
    element.imageLoaded = false
    await element.updateComplete
    const img = element.shadowRoot.querySelector('img[loading="lazy"]')
    // the error listener calls the completion hook so a failed image
    // clears the loader instead of spinning it forever
    img.dispatchEvent(new Event('error'))
    await aTimeout(50)
    expect(element.imageLoaded).to.equal(true)
    expect(element.shadowRoot.querySelector('svg')).to.not.exist
  })

  it('reflects src and alt bindings', async () => {
    element.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACw'
    element.alt = 'Another pixel'
    await element.updateComplete
    const img = element.shadowRoot.querySelector('img[loading="lazy"]')
    expect(img.getAttribute('src')).to.equal(
      'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACw',
    )
    expect(img.getAttribute('alt')).to.equal('Another pixel')
  })

  it('defaults the aria-describedby to an empty string', async () => {
    const bare = await fixture(html`<lazy-image></lazy-image>`)
    const img = bare.shadowRoot.querySelector('img[loading="lazy"]')
    expect(img.getAttribute('aria-describedby')).to.equal('')
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })
})
