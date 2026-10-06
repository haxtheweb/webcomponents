import { fixture, expect, html } from '@open-wc/testing'
import { MicroFrontendRegistry } from '@haxtheweb/micro-frontend-registry/micro-frontend-registry.js'
import '../a11y-gif-player.js'

const DATA_URL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
const STATIC_URL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7?t=static'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
async function poll(predicate, attempts = 100, delayMs = 20) {
  for (let i = 0; i < attempts; i++) {
    if (predicate()) return true
    await sleep(delayMs)
  }
  return predicate()
}

// the element is intersection gated, so most fixtures flip elementVisible on
// directly instead of waiting for the observer
async function playerFixture(template) {
  const el = await fixture(template)
  el.elementVisible = true
  await el.updateComplete
  return el
}

describe('a11y-gif-player rendering', () => {
  it('renders nothing until visible', async () => {
    const el = await fixture(
      html`<a11y-gif-player
        src="${DATA_URL}"
        src-without-animation="${STATIC_URL}"
        alt="A gif"
      ></a11y-gif-player>`,
    )
    expect(el.shadowRoot.querySelector('#container')).to.equal(null)
    el.elementVisible = true
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#container')).to.exist
  })

  it('renders the player with a static image and labeled button', async () => {
    const el = await playerFixture(
      html`<a11y-gif-player
        src="${DATA_URL}"
        src-without-animation="${STATIC_URL}"
        alt="An animated gif"
        longdesc="Longer description of the gif"
      ></a11y-gif-player>`,
    )
    const gif = el.shadowRoot.querySelector('#gif')
    expect(gif.getAttribute('src')).to.equal(STATIC_URL)
    expect(gif.getAttribute('alt')).to.equal('An animated gif')
    expect(gif.getAttribute('aria-describedby').trim()).to.equal('longdesc')
    const button = el.shadowRoot.querySelector('#button')
    // the en locale ships the label lowercased; match it case-insensitively.
    // "GIF" is appended since it's rendered as visible text inside the button's
    // svg icon, and the accessible name must include all visible text.
    expect(button.getAttribute('aria-label').toLowerCase()).to.equal(
      'toggle animation gif',
    )
    expect(button.getAttribute('aria-pressed')).to.equal('false')
    expect(button.hasAttribute('disabled')).to.be.false
    expect(button.getAttribute('aria-controls')).to.equal('gif')
    expect(button.style.backgroundImage).to.include(STATIC_URL)
    const longdesc = el.shadowRoot.querySelector('#longdesc')
    expect(longdesc).to.exist
    expect(longdesc.hasAttribute('hidden')).to.be.false
    expect(el.shadowRoot.querySelector('#svg').getAttribute('aria-hidden')).to
      .equal('true')
  })

  it('appends extra describedBy ids and hides the longdesc without one', async () => {
    const el = await playerFixture(
      html`<a11y-gif-player
        src="${DATA_URL}"
        src-without-animation="${STATIC_URL}"
        described-by="extra-id"
      ></a11y-gif-player>`,
    )
    const gif = el.shadowRoot.querySelector('#gif')
    expect(gif.getAttribute('aria-describedby').trim()).to.equal('extra-id')
    // no longdesc means the details block stays hidden
    expect(el.shadowRoot.querySelector('#longdesc').hasAttribute('hidden')).to
      .be.true
  })

  it('disables the button without a src', async () => {
    const el = await playerFixture(
      html`<a11y-gif-player
        src-without-animation="${STATIC_URL}"
        alt="No source"
      ></a11y-gif-player>`,
    )
    expect(el.shadowRoot.querySelector('#button').hasAttribute('disabled')).to
      .be.true
    expect(el.shadowRoot.querySelector('#longdesc').hasAttribute('hidden')).to
      .be.true
  })

  it('passes the a11y audit', async () => {
    const el = await playerFixture(
      html`<a11y-gif-player
        src="${DATA_URL}"
        src-without-animation="${STATIC_URL}"
        alt="An animated gif"
      ></a11y-gif-player>`,
    )
    await expect(el).shadowDom.to.be.accessible()
  })
})

describe('a11y-gif-player playback', () => {
  it('play, stop, toggle and toggleAnimation drive the animation state', async () => {
    const el = await playerFixture(
      html`<a11y-gif-player
        src="${DATA_URL}"
        src-without-animation="${STATIC_URL}"
        alt="A gif"
      ></a11y-gif-player>`,
    )
    const gif = el.shadowRoot.querySelector('#gif')
    const button = el.shadowRoot.querySelector('#button')
    expect(el.__playing).to.be.false
    el.play()
    await el.updateComplete
    expect(el.__playing).to.be.true
    // the visible image stays on the static source until the gif has loaded
    expect(gif.getAttribute('src')).to.equal(STATIC_URL)
    expect(button.getAttribute('aria-pressed')).to.equal('true')
    // the long description fades out while playing
    expect(el.shadowRoot.querySelector('#longdesc').style.opacity).to.equal('0')
    const loaded = await poll(() => el.__gifLoaded === true)
    expect(loaded).to.be.true
    await el.updateComplete
    expect(gif.getAttribute('src')).to.equal(DATA_URL)
    el.stop()
    await el.updateComplete
    expect(el.__playing).to.be.false
    expect(gif.getAttribute('src')).to.equal(STATIC_URL)
    expect(button.getAttribute('aria-pressed')).to.equal('false')
    el.toggle()
    await el.updateComplete
    expect(el.__playing).to.be.true
    el.toggleAnimation()
    await el.updateComplete
    expect(el.__playing).to.be.false
  })

  it('swaps to the animated source only once it has loaded', async () => {
    const el = await playerFixture(
      html`<a11y-gif-player
        src="${DATA_URL}"
        src-without-animation="${STATIC_URL}"
        alt="A gif"
      ></a11y-gif-player>`,
    )
    el.play()
    // while playing the loader img loads and flips __gifLoaded, which makes
    // the visible image switch to the animated source
    const loaded = await poll(() => el.__gifLoaded === true)
    expect(loaded).to.be.true
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#gif').getAttribute('src')).to.equal(
      DATA_URL,
    )
  })

  it('clicking the button toggles playback', async () => {
    const el = await playerFixture(
      html`<a11y-gif-player
        src="${DATA_URL}"
        src-without-animation="${STATIC_URL}"
        alt="A gif"
      ></a11y-gif-player>`,
    )
    const button = el.shadowRoot.querySelector('#button')
    button.click()
    await el.updateComplete
    expect(el.__playing).to.be.true
    expect(button.getAttribute('aria-pressed')).to.equal('true')
    button.click()
    await el.updateComplete
    expect(el.__playing).to.be.false
  })

  it('a disabled button never toggles playback', async () => {
    const el = await playerFixture(
      html`<a11y-gif-player
        src="${DATA_URL}"
        src-without-animation="${STATIC_URL}"
        alt="A gif"
        disabled
      ></a11y-gif-player>`,
    )
    const button = el.shadowRoot.querySelector('#button')
    expect(button.hasAttribute('disabled')).to.be.true
    button.click()
    await el.updateComplete
    expect(el.__playing).to.be.false
  })
})

describe('a11y-gif-player slot adoption', () => {
  it('picks up a light DOM img through the mutation observer', async () => {
    const el = await playerFixture(
      html`<a11y-gif-player alt="Before"></a11y-gif-player>`,
    )
    const img = globalThis.document.createElement('img')
    img.setAttribute('src', STATIC_URL)
    img.setAttribute('alt', 'Adopted alt')
    el.appendChild(img)
    const adopted = await poll(() => el.srcWithoutAnimation === STATIC_URL)
    expect(adopted).to.be.true
    expect(el.alt).to.equal('Adopted alt')
  })

  it('picks up a simple-img with a converted source', async () => {
    const el = await playerFixture(
      html`<a11y-gif-player alt="Before"></a11y-gif-player>`,
    )
    // an undefined simple-img is enough: only its properties are read
    const simple = globalThis.document.createElement('simple-img')
    simple.srcconverted = STATIC_URL
    simple.alt = 'Converted alt'
    el.appendChild(simple)
    const adopted = await poll(() => el.srcWithoutAnimation === STATIC_URL)
    expect(adopted).to.be.true
    expect(el.alt).to.equal('Converted alt')
  })
})

describe('a11y-gif-player print and lifecycle', () => {
  it('opens the long description on print events', async () => {
    const el = await playerFixture(
      html`<a11y-gif-player
        src="${DATA_URL}"
        src-without-animation="${STATIC_URL}"
        longdesc="Print me"
      ></a11y-gif-player>`,
    )
    const longdesc = el.shadowRoot.querySelector('#longdesc')
    // wait for the dynamically imported a11y-details to define toggleOpen
    const ready = await poll(() => typeof longdesc.toggleOpen === 'function')
    expect(ready).to.be.true
    let opened = 0
    longdesc.toggleOpen = () => {
      opened = opened + 1
    }
    globalThis.dispatchEvent(new Event('beforeprint'))
    expect(opened).to.equal(1)
    globalThis.dispatchEvent(new Event('afterprint'))
    expect(opened).to.equal(2)
    // disconnecting removes the print listeners
    el.remove()
    globalThis.dispatchEvent(new Event('beforeprint'))
    expect(opened).to.equal(2)
  })
})

describe('a11y-gif-player automatic still generation', () => {
  it('generates a still via the microservice when only src is set', async () => {
    // the module export is already the singleton registry instance
    const registry = MicroFrontendRegistry
    const originalUrl = registry.url
    registry.url = () => '/fake-generated-still.png'
    try {
      const el = await fixture(
        html`<a11y-gif-player src="${DATA_URL}"></a11y-gif-player>`,
      )
      el.elementVisible = true
      await el.updateComplete
      const generated = await poll(
        () => el.srcWithoutAnimation === '/fake-generated-still.png',
      )
      expect(generated).to.be.true
      expect(el._automaticStill).to.be.true
      // a later src change regenerates the still as well
      registry.url = () => '/fake-second-still.png'
      el.src = DATA_URL + '?next'
      const regenerated = await poll(
        () => el.srcWithoutAnimation === '/fake-second-still.png',
      )
      expect(regenerated).to.be.true
    } finally {
      if (originalUrl) {
        registry.url = originalUrl
      } else {
        delete registry.url
      }
    }
  })
})

describe('a11y-gif-player hax integration', () => {
  it('haxHooks maps mediaSourceUpdated', async () => {
    const el = await playerFixture(html`<a11y-gif-player></a11y-gif-player>`)
    expect(el.haxHooks()).to.deep.equal({
      mediaSourceUpdated: 'haxmediaSourceUpdated',
    })
  })

  it('haxmediaSourceUpdated ignores bad input', async () => {
    const el = await playerFixture(html`<a11y-gif-player></a11y-gif-player>`)
    expect(el.haxmediaSourceUpdated(null, null)).to.equal(undefined)
    expect(el.haxmediaSourceUpdated('x.png', null)).to.equal(undefined)
    expect(el.haxmediaSourceUpdated('x.png', {})).to.equal(undefined)
  })

  it('haxmediaSourceUpdated pokes matching imgs on the store', async () => {
    const el = await playerFixture(
      html`<a11y-gif-player
        src-without-animation="${STATIC_URL}"
      ></a11y-gif-player>`,
    )
    const pokes = []
    const store = {
      _mediaSrcMatches: (src, path) => src === path,
      _pokeMatchingImgs: (root, path) =>
        pokes.push([path, root === el.shadowRoot]),
    }
    el.haxmediaSourceUpdated(STATIC_URL, store)
    expect(pokes).to.deep.equal([[STATIC_URL, true]])
    // non-matching paths leave the store untouched
    el.haxmediaSourceUpdated('other.png', store)
    expect(pokes.length).to.equal(1)
  })

  it('haxProperties points at the external schema file', () => {
    const Ctor = globalThis.customElements.get('a11y-gif-player')
    expect(Ctor.haxProperties).to.be.a('string')
    expect(Ctor.haxProperties.endsWith('lib/a11y-gif-player.haxProperties.json'))
      .to.be.true
  })
})
