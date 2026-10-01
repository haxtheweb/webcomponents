import { html, fixture, expect, waitUntil } from '@open-wc/testing'
import '../slide-deck.js'

const NO_PPTX_MANIFEST = '/elements/slide-deck/test/fixtures/no-pptx.json'
const WITH_PPTX_MANIFEST = '/elements/slide-deck/test/fixtures/with-pptx.json'

const tick = (ms = 20) => new Promise((resolve) => setTimeout(resolve, ms))

function jsonResponse(manifest, status = 200) {
  return new Response(JSON.stringify(manifest), {
    status: status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function stubFullscreenElement(value) {
  Object.defineProperty(globalThis.document, 'fullscreenElement', {
    get: () => value,
    configurable: true,
  })
}

async function deckFixture(manifest = NO_PPTX_MANIFEST, deckId = 'test') {
  const element = await fixture(
    html`<slide-deck source="${manifest}" deck-id="${deckId}"></slide-deck>`,
  )
  await waitUntil(() => element.status === 'ready', 'deck never loaded', 5000)
  await element.updateComplete
  return element
}

describe('slide-deck behavior', () => {
  afterEach(() => {
    // leave the location hash clean for the next test
    globalThis.history.replaceState(
      null,
      '',
      globalThis.location.pathname + globalThis.location.search,
    )
  })

  it('ships default english strings for every control', async () => {
    const element = await fixture(html`<slide-deck></slide-deck>`)
    expect(element.t.previousSlide).to.equal('Previous slide')
    expect(element.t.nextSlide).to.equal('Next slide')
    expect(element.t.viewAllSlides).to.equal('View all slides')
    expect(element.t.viewOneSlide).to.equal('View one slide at a time')
    expect(element.t.presentFullScreen).to.equal('Present full screen')
    expect(element.t.exitFullScreen).to.equal('Exit full screen')
    expect(element.t.copyLinkToSlide).to.equal('Copy link to this slide')
    expect(element.t.linkCopied).to.equal('Link copied')
    expect(element.t.speakerNotes).to.equal('Speaker notes')
    expect(element.t.loadingPresentation).to.equal('Loading presentation')
    expect(element.t.presentationUnavailable).to.equal(
      'Presentation unavailable',
    )
    expect(element.t.slide).to.equal('Slide')
    expect(element.t.downloadPresentation).to.equal('Download presentation')
  })

  it('exposes empty slides and no current slide before any deck loads', async () => {
    const element = await fixture(html`<slide-deck></slide-deck>`)
    expect(element.slides.length).to.equal(0)
    expect(element.currentSlide === null).to.be.true
    expect(element.hashPrefix).to.equal('slide')
  })

  it('walks idle to loading to ready while fetching the manifest', async () => {
    const originalFetch = globalThis.fetch
    let resolveManifest = null
    globalThis.fetch = (input) => {
      if (String(input).includes('no-pptx.json')) {
        return new Promise((resolve) => {
          resolveManifest = resolve
        })
      }
      return originalFetch(input)
    }
    try {
      const element = await fixture(
        html`<slide-deck
          source="${NO_PPTX_MANIFEST}"
          deck-id="status"
        ></slide-deck>`,
      )
      expect(element.status).to.equal('loading')
      expect(element.deck === null).to.be.true
      resolveManifest(
        jsonResponse({
          title: 'Deferred deck',
          source: null,
          pptx: null,
          slides: [
            {
              number: 1,
              title: 'Deferred',
              html: '<h1>Deferred</h1>',
              image: null,
              notes: 'later',
            },
          ],
        }),
      )
      await waitUntil(() => element.status === 'ready', 'deck never loaded', 5000)
      expect(element.deck.title).to.equal('Deferred deck')
      expect(element.slides.length).to.equal(1)
      expect(element.currentSlide.title).to.equal('Deferred')
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('renders a loading message while the manifest is in flight', async () => {
    const originalFetch = globalThis.fetch
    let resolveManifest = null
    globalThis.fetch = (input) => {
      if (String(input).includes('no-pptx.json')) {
        return new Promise((resolve) => {
          resolveManifest = resolve
        })
      }
      return originalFetch(input)
    }
    try {
      const element = await fixture(
        html`<slide-deck
          source="${NO_PPTX_MANIFEST}"
          deck-id="loading"
        ></slide-deck>`,
      )
      await waitUntil(
        () => element.shadowRoot.querySelector('p.message') !== null,
        'loading message never rendered',
        5000,
      )
      const message = element.shadowRoot.querySelector('p.message')
      expect(message.textContent).to.equal('Loading presentation')
      resolveManifest(
        jsonResponse({ title: 'Late', source: null, pptx: null, slides: [] }),
      )
      await waitUntil(() => element.status === 'ready', 'deck never loaded', 5000)
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('ignores a stale manifest response when a newer source was requested', async () => {
    const originalFetch = globalThis.fetch
    const resolvers = {}
    const seen = []
    globalThis.fetch = (input) => {
      const key = String(input)
      seen.push(key)
      return new Promise((resolve) => {
        resolvers[key] = resolve
      })
    }
    try {
      const element = await fixture(
        html`<slide-deck deck-id="race"></slide-deck>`,
      )
      element.source = '/slow/one.json'
      await element.updateComplete
      element.source = '/slow/two.json'
      await element.updateComplete
      expect(element.status).to.equal('loading')
      expect(element.deck === null).to.be.true
      const oneKey = seen.find((key) => key.endsWith('/slow/one.json'))
      const twoKey = seen.find((key) => key.endsWith('/slow/two.json'))
      // the stale response resolves first and must be ignored
      resolvers[oneKey](
        jsonResponse({
          title: 'Stale',
          source: null,
          pptx: null,
          slides: [],
        }),
      )
      await tick()
      expect(element.status).to.equal('loading')
      expect(element.deck === null).to.be.true
      // the newest response wins
      resolvers[twoKey](
        jsonResponse({
          title: 'Fresh',
          source: null,
          pptx: null,
          slides: [],
        }),
      )
      await waitUntil(() => element.status === 'ready', 'deck never loaded', 5000)
      expect(element.deck.title).to.equal('Fresh')
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('keeps a stale failure from poisoning the newest load', async () => {
    const originalFetch = globalThis.fetch
    const resolvers = {}
    const seen = []
    globalThis.fetch = (input) => {
      const key = String(input)
      seen.push(key)
      return new Promise((resolve) => {
        resolvers[key] = resolve
      })
    }
    try {
      const element = await fixture(
        html`<slide-deck deck-id="race2"></slide-deck>`,
      )
      element.source = '/slow/bad.json'
      await element.updateComplete
      element.source = '/slow/good.json'
      await element.updateComplete
      const badKey = seen.find((key) => key.endsWith('/slow/bad.json'))
      const goodKey = seen.find((key) => key.endsWith('/slow/good.json'))
      resolvers[badKey](new Response('', { status: 500 }))
      await tick()
      expect(element.status).to.equal('loading')
      resolvers[goodKey](
        jsonResponse({ title: 'Good', source: null, pptx: null, slides: [] }),
      )
      await waitUntil(() => element.status === 'ready', 'deck never loaded', 5000)
      expect(element.deck.title).to.equal('Good')
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('reports an unreadable manifest body as an error', async () => {
    const originalFetch = globalThis.fetch
    const seen = []
    const resolvers = {}
    globalThis.fetch = (input) => {
      const key = String(input)
      seen.push(key)
      return new Promise((resolve) => {
        resolvers[key] = resolve
      })
    }
    try {
      const element = await fixture(
        html`<slide-deck source="/broken.json" deck-id="broken"></slide-deck>`,
      )
      resolvers[seen[0]](
        new Response('not json at all', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      await waitUntil(() => element.status === 'error', 'error never reported', 5000)
      expect(element.shadowRoot.textContent).to.contain(
        'Presentation unavailable',
      )
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('clamps a stale slide number against the newly loaded deck', async () => {
    const element = await fixture(
      html`<slide-deck deck-id="clamp"></slide-deck>`,
    )
    element.slide = 99
    await element.updateComplete
    expect(element.slide).to.equal(99)
    element.source = NO_PPTX_MANIFEST
    await waitUntil(() => element.status === 'ready', 'deck never loaded', 5000)
    await element.updateComplete
    expect(element.deck.title).to.equal('No pptx deck')
    expect(element.status).to.equal('ready')
    expect(element.slide).to.equal(3)
    expect(element.getAttribute('slide')).to.equal('3')
  })

  it('clearing the source does not reload the deck', async () => {
    const element = await deckFixture()
    const deck = element.deck
    element.source = null
    await element.updateComplete
    await tick()
    expect(element.deck === deck).to.be.true
    expect(element.status).to.equal('ready')
  })

  it('only paints after the deck scrolls into view, then stops observing', async () => {
    const RealIO = globalThis.IntersectionObserver
    let callback = null
    const instances = []
    class FakeIntersectionObserver {
      constructor(cb) {
        callback = cb
        this.disconnected = false
        instances.push(this)
      }
      observe() {}
      disconnect() {
        this.disconnected = true
      }
    }
    globalThis.IntersectionObserver = FakeIntersectionObserver
    try {
      const element = await deckFixture(NO_PPTX_MANIFEST, 'vp')
      expect(instances.length).to.equal(1)
      expect(element._observer instanceof FakeIntersectionObserver).to.be.true
      // already observing: a second watch call is a no-op
      element._watchForViewport()
      expect(instances.length).to.equal(1)
      // off-screen: nothing happens
      callback([{ isIntersecting: false }])
      expect(instances[0].disconnected).to.be.false
      expect(element._observer === null).to.be.false
      // on-screen: the observer releases itself and a paint is attempted
      callback([{ isIntersecting: true }])
      expect(instances[0].disconnected).to.be.true
      expect(element._observer === null).to.be.true
      // no IntersectionObserver support at all: no observer is created
      globalThis.IntersectionObserver = undefined
      element._observer = null
      element._watchForViewport()
      expect(element._observer === null).to.be.true
      expect(instances.length).to.equal(1)
    } finally {
      globalThis.IntersectionObserver = RealIO
    }
  })

  it('skips painting when there is no deck, no stage, no pptx or grid mode', async () => {
    const element = await fixture(
      html`<slide-deck deck-id="guards"></slide-deck>`,
    )
    // no deck yet
    await element.paintCurrentSlide()
    // deck with no slides: the unavailable message has no #stage
    element.deck = { title: 'Empty', source: null, pptx: '/gone.pptx', slides: [] }
    await element.updateComplete
    await element.paintCurrentSlide()
    // grid mode: the stage is not painted
    element.deck = {
      title: 'Full',
      source: null,
      pptx: '/gone.pptx',
      slides: [
        { number: 1, title: 'A', html: '<h1>A</h1>', image: null, notes: null },
      ],
    }
    element.mode = 'grid'
    await element.updateComplete
    await element.paintCurrentSlide()
    // back in slide mode the stage exists; a pending observer defers painting
    element.mode = 'slide'
    await element.updateComplete
    element._observer = { disconnect() {} }
    await element.paintCurrentSlide()
    element._observer = null
    expect(element.rendered).to.be.false
  })

  it('recovers when navigation overtakes a pending renderer load', async () => {
    const originalFetch = globalThis.fetch
    const realPptx = await originalFetch(
      '/elements/slide-deck/demo/demo-deck.pptx',
    )
    const bytes = await realPptx.arrayBuffer()
    let resolvePptx = null
    globalThis.fetch = (input) => {
      if (String(input).includes('demo-deck.pptx')) {
        return new Promise((resolve) => {
          resolvePptx = resolve
        })
      }
      return originalFetch(input)
    }
    try {
      const element = await fixture(
        html`<slide-deck deck-id="pending"></slide-deck>`,
      )
      element.deck = {
        title: 'Deferred render',
        source: null,
        pptx: '/elements/slide-deck/demo/demo-deck.pptx',
        slides: [
          { number: 1, title: 'A', html: '<h1>A</h1>', image: null, notes: null },
          { number: 2, title: 'B', html: '<h1>B</h1>', image: null, notes: null },
        ],
      }
      await element.updateComplete
      // kick off a paint, then navigate before the renderer settles
      element.paintCurrentSlide()
      element.goTo(2)
      await element.updateComplete
      await waitUntil(
        () => resolvePptx !== null,
        'renderer never fetched the deck',
        5000,
      )
      resolvePptx(new Response(bytes, { status: 200 }))
      await waitUntil(
        () => element.rendered === true,
        'slide never painted',
        20000,
      )
      expect(element.hasAttribute('rendered')).to.be.true
      expect(
        /^\d+(\.\d+)?$/.test(
          element.style.getPropertyValue('--slide-deck-aspect-ratio'),
        ),
      ).to.be.true
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('paints the real presentation once it scrolls into view', async () => {
    const element = await fixture(
      html`<slide-deck
        source="${WITH_PPTX_MANIFEST}"
        deck-id="paint"
      ></slide-deck>`,
    )
    await waitUntil(() => element.status === 'ready', 'deck never loaded', 5000)
    await waitUntil(
      () => element.rendered === true,
      'deck never painted',
      20000,
    )
    expect(element.hasAttribute('rendered')).to.be.true
    const stage = element.shadowRoot.querySelector('#stage')
    expect(stage === null).to.be.false
    expect(stage.childElementCount > 0).to.be.true
    expect(
      /^\d+(\.\d+)?$/.test(
        element.style.getPropertyValue('--slide-deck-aspect-ratio'),
      ),
    ).to.be.true
  })

  it('toggles between grid and slide mode and shows a chosen slide', async () => {
    const element = await deckFixture()
    expect(element.mode).to.equal('slide')
    element.toggleMode()
    await element.updateComplete
    expect(element.mode).to.equal('grid')
    expect(element.getAttribute('mode')).to.equal('grid')
    element.showSlide(2)
    await element.updateComplete
    expect(element.mode).to.equal('slide')
    expect(element.slide).to.equal(2)
    expect(element.getAttribute('slide')).to.equal('2')
    element.toggleMode()
    await element.updateComplete
    expect(element.mode).to.equal('grid')
  })

  it('keeps the slide number when there is no deck to navigate', async () => {
    const element = await fixture(
      html`<slide-deck deck-id="nodeck"></slide-deck>`,
    )
    element.goTo(5)
    expect(element.slide).to.equal(1)
  })

  it('exits full screen when it is the full screen element', async () => {
    const element = await fixture(
      html`<slide-deck deck-id="fs"></slide-deck>`,
    )
    let exits = 0
    globalThis.document.exitFullscreen = () => {
      exits += 1
      return Promise.resolve()
    }
    try {
      stubFullscreenElement(element)
      try {
        await element.togglePresenting()
        expect(exits).to.equal(1)
      } finally {
        delete globalThis.document.fullscreenElement
      }
    } finally {
      delete globalThis.document.exitFullscreen
    }
  })

  it('enters full screen and forces single-slide mode', async () => {
    const element = await deckFixture()
    element.mode = 'grid'
    await element.updateComplete
    let requests = 0
    element.requestFullscreen = () => {
      requests += 1
      return Promise.resolve()
    }
    try {
      stubFullscreenElement(null)
      try {
        await element.togglePresenting()
        expect(requests).to.equal(1)
        expect(element.mode).to.equal('slide')
      } finally {
        delete globalThis.document.fullscreenElement
      }
    } finally {
      delete element.requestFullscreen
    }
  })

  it('does nothing when full screen is unavailable', async () => {
    const element = await fixture(
      html`<slide-deck deck-id="nofs"></slide-deck>`,
    )
    element.requestFullscreen = undefined
    stubFullscreenElement(null)
    try {
      await element.togglePresenting()
      expect(element.mode).to.equal('slide')
    } finally {
      delete globalThis.document.fullscreenElement
      delete element.requestFullscreen
    }
  })

  it('tracks full screen state and reflects it as an attribute', async () => {
    const element = await deckFixture()
    expect(element.presenting).to.be.false
    stubFullscreenElement(element)
    try {
      element.dispatchEvent(new Event('fullscreenchange'))
      await element.updateComplete
      expect(element.presenting).to.be.true
      expect(element.hasAttribute('presenting')).to.be.true
      stubFullscreenElement(null)
      element.dispatchEvent(new Event('fullscreenchange'))
      await element.updateComplete
      expect(element.presenting).to.be.false
      expect(element.hasAttribute('presenting')).to.be.false
    } finally {
      delete globalThis.document.fullscreenElement
    }
  })

  it('copies a deep link to the current slide and announces it', async () => {
    const element = await deckFixture(NO_PPTX_MANIFEST, 'link')
    const written = []
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: {
        writeText: (text) => {
          written.push(text)
          return Promise.resolve()
        },
      },
      configurable: true,
    })
    try {
      await element.copyLink()
      expect(written.length).to.equal(1)
      expect(written[0].endsWith('#link-slide-1')).to.be.true
      expect(element._message).to.equal('Link copied')
      await element.updateComplete
      expect(
        element.shadowRoot.textContent.includes('Link copied'),
      ).to.be.true
    } finally {
      delete globalThis.navigator.clipboard
    }
  })

  it('survives a denied clipboard without announcing anything', async () => {
    const element = await deckFixture(NO_PPTX_MANIFEST, 'denied')
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: {
        writeText: () => Promise.reject(new Error('denied')),
      },
      configurable: true,
    })
    try {
      await element.copyLink()
      // nothing is announced; the live region falls back to the slide title
      expect(!element._message).to.be.true
    } finally {
      delete globalThis.navigator.clipboard
    }
  })

  it('derives the hash prefix from deck id, deck title, then a default', async () => {
    const element = await deckFixture(NO_PPTX_MANIFEST, 'alpha')
    expect(element.hashPrefix).to.equal('alpha')
    element.deckId = null
    await element.updateComplete
    expect(element.hashPrefix).to.equal('No%20pptx%20deck')
    element.deck = null
    await element.updateComplete
    expect(element.hashPrefix).to.equal('slide')
  })

  it('reads the slide number from the location hash', async () => {
    const element = await deckFixture(NO_PPTX_MANIFEST, 'deep')
    globalThis.location.hash = '#deep-slide-2'
    globalThis.dispatchEvent(new Event('hashchange'))
    await element.updateComplete
    expect(element.slide).to.equal(2)
    expect(globalThis.location.hash).to.equal('#deep-slide-2')
    // non-numeric suffixes and foreign prefixes are ignored
    globalThis.location.hash = '#deep-slide-abc'
    globalThis.dispatchEvent(new Event('hashchange'))
    await element.updateComplete
    expect(element.slide).to.equal(2)
    globalThis.location.hash = '#other-deck-slide-3'
    globalThis.dispatchEvent(new Event('hashchange'))
    await element.updateComplete
    expect(element.slide).to.equal(2)
    // navigating to the slide already in the hash changes nothing
    element.goTo(2)
    await element.updateComplete
    expect(globalThis.location.hash).to.equal('#other-deck-slide-3')
  })

  it('honours a deep link present before the deck loads', async () => {
    globalThis.location.hash = '#deep2-slide-2'
    const element = await fixture(
      html`<slide-deck
        source="${NO_PPTX_MANIFEST}"
        deck-id="deep2"
      ></slide-deck>`,
    )
    await waitUntil(() => element.status === 'ready', 'deck never loaded', 5000)
    await element.updateComplete
    expect(element.slide).to.equal(2)
    expect(globalThis.location.hash).to.equal('#deep2-slide-2')
    expect(element.currentSlide.title).to.equal('Two')
  })

  it('moves with the keyboard from the focused region', async () => {
    const element = await deckFixture(NO_PPTX_MANIFEST, 'keys')
    const region = element.shadowRoot.querySelector('div[role="region"]')
    expect(region === null).to.be.false
    const key = (name) =>
      new KeyboardEvent('keydown', {
        key: name,
        bubbles: true,
        cancelable: true,
      })
    // handled keys are prevented and navigate
    expect(region.dispatchEvent(key('ArrowRight'))).to.be.false
    await element.updateComplete
    expect(element.slide).to.equal(2)
    region.dispatchEvent(key('ArrowLeft'))
    await element.updateComplete
    expect(element.slide).to.equal(1)
    // clamped at the ends
    region.dispatchEvent(key('ArrowLeft'))
    await element.updateComplete
    expect(element.slide).to.equal(1)
    region.dispatchEvent(key('End'))
    await element.updateComplete
    expect(element.slide).to.equal(3)
    region.dispatchEvent(key('Home'))
    await element.updateComplete
    expect(element.slide).to.equal(1)
    // unhandled keys are left alone
    expect(region.dispatchEvent(key('a'))).to.be.true
    await element.updateComplete
    expect(element.slide).to.equal(1)
  })

  it('derives a download filename from the deck source, title, or a default', async () => {
    const element = await fixture(
      html`<slide-deck deck-id="dl"></slide-deck>`,
    )
    const downloads = []
    const originalClick = HTMLAnchorElement.prototype.click
    HTMLAnchorElement.prototype.click = function onClick() {
      downloads.push({ href: this.href, filename: this.download })
    }
    try {
      // no deck, then no pptx: nothing is downloaded
      element.downloadPptx()
      element.deck = { title: 'T', source: null, pptx: null, slides: [] }
      element.downloadPptx()
      expect(downloads.length).to.equal(0)
      // the deck source stem wins
      element.deck = {
        title: 'T',
        source: 'files/decks/intro/intro.json',
        pptx: '/files/decks/intro/intro.pptx',
        slides: [],
      }
      element.downloadPptx()
      expect(downloads.length).to.equal(1)
      expect(downloads[0].filename).to.equal('intro.pptx')
      expect(downloads[0].href.endsWith('/files/decks/intro/intro.pptx')).to.be.true
      // without a source, the title is used
      element.deck = {
        title: 'My Deck',
        source: null,
        pptx: '/my-deck.pptx',
        slides: [],
      }
      element.downloadPptx()
      expect(downloads.length).to.equal(2)
      expect(downloads[1].filename).to.equal('My Deck.pptx')
      // without either, a generic name is used
      element.deck = {
        title: null,
        source: null,
        pptx: '/fallback.pptx',
        slides: [],
      }
      element.downloadPptx()
      expect(downloads.length).to.equal(3)
      expect(downloads[2].filename).to.equal('original.pptx')
      // a source with no stem falls back to the generic name
      element.deck = {
        title: 'T',
        source: 'folder/',
        pptx: '/tail.pptx',
        slides: [],
      }
      element.downloadPptx()
      expect(downloads.length).to.equal(4)
      expect(downloads[3].filename).to.equal('original.pptx')
      // an unparsable pptx URL is reported and nothing is downloaded
      element.deck = {
        title: 'T',
        source: null,
        pptx: 'http://',
        slides: [],
      }
      element.downloadPptx()
      expect(downloads.length).to.equal(4)
    } finally {
      HTMLAnchorElement.prototype.click = originalClick
    }
  })

  it('shows a download control only when the deck has a pptx and allows it', async () => {
    const element = await deckFixture(WITH_PPTX_MANIFEST, 'dlbtn')
    const icons = () =>
      Array.from(
        element.shadowRoot.querySelectorAll('.bar simple-icon-button-lite'),
      ).map((button) => button.icon)
    // prev, next, link, mode, present plus download
    expect(icons().length).to.equal(6)
    expect(icons().includes('icons:file-download')).to.be.true
    element.downloadable = false
    await element.updateComplete
    expect(icons().length).to.equal(5)
    expect(icons().includes('icons:file-download')).to.be.false
  })

  it('renders every slide as a card with plain-text notes in grid mode', async () => {
    const element = await deckFixture()
    element.toggleMode()
    await element.updateComplete
    const cards = element.shadowRoot.querySelectorAll('.card')
    expect(cards.length).to.equal(3)
    expect(cards[0].querySelector('.notes') === null).to.be.false
    expect(cards[0].textContent.includes('note one')).to.be.true
    expect(cards[0].querySelectorAll('.notes p').length).to.equal(1)
    expect(cards[1].querySelector('.notes') === null).to.be.true
  })

  it('shows the current slide text and notes in slide mode', async () => {
    const element = await deckFixture()
    const text = element.shadowRoot.querySelector('.text')
    expect(text === null).to.be.false
    expect(text.querySelector('h3').textContent).to.equal('One')
    expect(text.querySelector('.notes') === null).to.be.false
    const region = element.shadowRoot.querySelector('div[role="region"]')
    expect(region.getAttribute('aria-label')).to.equal('No pptx deck')
    const live = element.shadowRoot.querySelector('div[aria-live="polite"]')
    expect(live.textContent.trim()).to.equal('Slide 1: One')
  })

  it('releases the viewport observer and any pending renderer on disconnect', async () => {
    const RealIO = globalThis.IntersectionObserver
    let observerDisconnects = 0
    class FakeIntersectionObserver {
      observe() {}
      disconnect() {
        observerDisconnects += 1
      }
    }
    globalThis.IntersectionObserver = FakeIntersectionObserver
    try {
      const element = await deckFixture(NO_PPTX_MANIFEST, 'bye')
      let disposed = 0
      element._renderer = Promise.resolve({
        dispose() {
          disposed += 1
        },
      })
      element.remove()
      await tick()
      expect(observerDisconnects).to.equal(1)
      expect(disposed).to.equal(1)
      expect(element._observer === null).to.be.true
      expect(element._renderer === null).to.be.true
    } finally {
      globalThis.IntersectionObserver = RealIO
    }
  })

  it('wires the pptx upload transform hook', async () => {
    const element = await fixture(
      html`<slide-deck deck-id="hax"></slide-deck>`,
    )
    expect(element.haxHooks()).to.deep.equal({
      processFileUpload: 'haxprocessFileUpload',
    })
    // nothing to transform
    expect(element.haxprocessFileUpload(null, null)).to.equal(false)
    expect(element.haxprocessFileUpload({}, null)).to.equal(false)
    expect(element.haxprocessFileUpload({ source: 12 }, null)).to.equal(false)
    expect(
      element.haxprocessFileUpload({ source: 'lesson.mp4' }, null),
    ).to.equal(false)
    // no upload response to name the file
    expect(
      element.haxprocessFileUpload({ source: 'lesson.pptx' }, null),
    ).to.equal(false)
    expect(
      element.haxprocessFileUpload({ source: 'lesson.pptx' }, { data: {} }),
    ).to.equal(false)
    expect(
      element.haxprocessFileUpload(
        { source: 'lesson.pptx' },
        { data: { file: null } },
      ),
    ).to.equal(false)
    // a .pptx upload becomes a convert operation
    expect(
      element.haxprocessFileUpload(
        { source: 'lesson.PPTX' },
        { data: { file: { uuid: 'abc-123' } } },
      ),
    ).to.deep.equal({
      fileUuid: 'abc-123',
      operation: 'convert-pptx-deck',
      valueMapping: 'data.deckPath',
      fallbackType: 'link',
    })
  })

  it('references its haxProperties schema file', async () => {
    const element = await fixture(
      html`<slide-deck deck-id="schema"></slide-deck>`,
    )
    expect(
      element.constructor.haxProperties.endsWith(
        'lib/slide-deck.haxProperties.json',
      ),
    ).to.be.true
  })
})
