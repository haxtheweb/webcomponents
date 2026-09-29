import { fixture, expect, html } from '@open-wc/testing'
import '../img-pan-zoom.js'
import '../lib/img-loader.js'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const DATA_URL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const viewerInstances = []
let fakePinned = false

// Pre-warm the same ESGlobalBridge script load the element's constructor
// performs, wait for the real script to have executed, then pin a
// deterministic fake so every viewer-dependent path is fully controllable.
// Later element constructors dedupe in the bridge, so the real library never
// re-runs and can no longer overwrite the fake.
async function pinFakeOpenSeadragon() {
  if (fakePinned) return
  const basePath = new URL('../img-pan-zoom.js', import.meta.url).href.replace(
    '/img-pan-zoom.js',
    '/',
  )
  globalThis.ESGlobalBridge
    .requestAvailability()
    .load('openseadragon', `${basePath}lib/openseadragon/openseadragon.min.js`)
    .catch(() => {})
  for (let i = 0; i < 150 && !globalThis.OpenSeadragon; i++) {
    await sleep(20)
  }
  class FakePoint {
    constructor(x, y) {
      this.x = x
      this.y = y
    }
  }
  class FakeOpenSeadragon {
    constructor(options) {
      this.options = options
      this.tileSources = options.tileSources
      this.handlers = {}
      this.calls = []
      this.navigator = { element: { style: {} } }
      this.viewport = {
        setFlip(f) {
          this.flipped = f
        },
        setRotation(r) {
          this.rotation = r
        },
        getRotation() {
          return this.rotation || 0
        },
        getBounds() {
          return { x: 0, y: 0, width: 1, height: 1 }
        },
        panBy(p) {
          this.panned = p
        },
        getZoom() {
          return 1
        },
        getMaxZoom() {
          return 2
        },
        getMinZoom() {
          return 0.5
        },
        zoomTo(z) {
          this.zoomed = z
        },
        goHome() {
          this.homed = true
        },
      }
      viewerInstances.push(this)
    }
    goToPage(p) {
      this.calls.push(['goToPage', p])
    }
    setFullScreen(m) {
      this.calls.push(['setFullScreen', m])
    }
    addHandler(name, fn) {
      this.handlers[name] = fn
    }
    addSimpleImage(o) {
      this.calls.push(['addSimpleImage', o])
    }
    addTiledImage(o) {
      this.calls.push(['addTiledImage', o])
    }
    destroy() {
      this.calls.push(['destroy'])
    }
  }
  globalThis.OpenSeadragon = FakeOpenSeadragon
  globalThis.OpenSeadragon.Point = FakePoint
  fakePinned = true
}

async function poll(predicate, attempts = 100, delayMs = 20) {
  for (let i = 0; i < attempts; i++) {
    if (predicate()) return true
    await sleep(delayMs)
  }
  return predicate()
}

before(async () => {
  await pinFakeOpenSeadragon()
})

describe('img-pan-zoom defaults and rendering', () => {
  it('has the documented default property values', async () => {
    const el = await fixture(html`<img-pan-zoom></img-pan-zoom>`)
    expect(el.page).to.equal(0)
    expect(el.loading).to.be.false
    expect(el.dzi).to.be.false
    expect(el.fadeIn).to.be.true
    expect(el.hideSpinner).to.be.false
    expect(el.fullscreenToggled).to.be.false
    expect(el.flipToggled).to.be.false
    expect(el.showNavigationControl).to.be.false
    expect(el.showNavigator).to.be.false
    expect(el.navigatorAutoFade).to.be.false
    expect(el.navigatorToggled).to.be.false
    expect(el.zoomPerClick).to.equal(2.0)
    expect(el.zoomPerScroll).to.equal(1.2)
    expect(el.animationTime).to.equal(1.2)
    expect(el.navPrevNextWrap).to.be.false
    expect(el.showRotationControl).to.be.false
    expect(el.minZoomImageRatio).to.equal(1)
    expect(el.maxZoomPixelRatio).to.equal(1.1)
    expect(el.constrainDuringPan).to.be.false
    expect(el.visibilityRatio).to.equal(1)
    expect(el.sequenceMode).to.be.false
    expect(el.preserveViewport).to.be.false
    expect(el.showReferenceStrip).to.be.false
    expect(el.referenceStripScroll).to.equal('horizontal')
  })

  it('renders loader, spinner and img-loader for regular images', async () => {
    const el = await fixture(
      html`<img-pan-zoom
        src="one.png"
        described-by="desc-id"
      ></img-pan-zoom>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#viewer')).to.exist
    expect(el.shadowRoot.querySelector('#loader')).to.exist
    const spinner = el.shadowRoot.querySelector('hexagon-loader')
    expect(spinner).to.exist
    expect(spinner.hasAttribute('loading')).to.be.true
    const loader = el.shadowRoot.querySelector('img-loader')
    expect(loader).to.exist
    expect(loader.getAttribute('src')).to.equal('one.png')
    expect(loader.getAttribute('described-by')).to.equal('desc-id')
  })

  it('omits the spinner when hideSpinner is set', async () => {
    const el = await fixture(
      html`<img-pan-zoom src="one.png" hide-spinner></img-pan-zoom>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#loader')).to.not.exist
    expect(el.shadowRoot.querySelector('img-loader')).to.exist
  })

  it('omits the spinner once loaded', async () => {
    const el = await fixture(
      html`<img-pan-zoom src="one.png"></img-pan-zoom>`,
    )
    await el.updateComplete
    el.loaded = true
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#loader')).to.not.exist
  })

  it('skips img-loader entirely for deep zoom images', async () => {
    const el = await fixture(
      html`<img-pan-zoom src="tiles.dzi" dzi></img-pan-zoom>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('img-loader')).to.not.exist
    expect(el.shadowRoot.querySelector('#loader')).to.not.exist
    expect(el.shadowRoot.querySelector('#viewer')).to.exist
  })

  it('falls back to the first entry of sources', async () => {
    const el = await fixture(
      html`<img-pan-zoom .sources=${['first.png', 'second.png']}></img-pan-zoom>`,
    )
    await el.updateComplete
    const loader = el.shadowRoot.querySelector('img-loader')
    expect(loader).to.exist
    expect(loader.getAttribute('src')).to.equal('first.png')
  })

  it('notifies loading-changed and loaded-changed from updated', async () => {
    // no src: the img-loader stays quiet so the notify events are the only
    // ones in flight
    const el = await fixture(html`<img-pan-zoom></img-pan-zoom>`)
    await el.updateComplete
    const events = []
    el.addEventListener('loading-changed', (e) =>
      events.push(['loading-changed', e.detail.value]),
    )
    el.addEventListener('loaded-changed', (e) =>
      events.push(['loaded-changed', e.detail.value]),
    )
    el.loading = true
    await el.updateComplete
    el.loaded = true
    await el.updateComplete
    expect(events).to.deep.equal([
      ['loading-changed', true],
      ['loaded-changed', true],
    ])
  })
})

describe('img-loader', () => {
  it('loads data URLs and flips loading to loaded', async () => {
    // start without src so the whole event sequence happens after our
    // listeners are attached
    const loader = await fixture(html`<img-loader></img-loader>`)
    const events = []
    loader.addEventListener('loading-changed', (e) =>
      events.push(['loading-changed', e.detail.value]),
    )
    loader.addEventListener('loaded-changed', (e) =>
      events.push(['loaded-changed', e.detail.value]),
    )
    loader.src = DATA_URL
    const loaded = await poll(() => loader.loaded === true)
    expect(loaded).to.be.true
    expect(loader.loading).to.be.false
    expect(loader.error).to.be.false
    expect(events).to.deep.equal([
      ['loading-changed', true],
      ['loading-changed', false],
      ['loaded-changed', true],
    ])
  })

  it('reports failure for unloadable sources', async () => {
    const loader = await fixture(
      html`<img-loader src="/definitely-missing.png"></img-loader>`,
    )
    const failed = await poll(() => loader.loading === false)
    expect(failed).to.be.true
    expect(loader.loaded).to.be.false
    // the error flag is wired on failure (it used to never be set)
    expect(loader.error).to.be.true
  })

  it('replaces the pending image when src changes', async () => {
    const loader = await fixture(
      html`<img-loader src="/definitely-missing.png"></img-loader>`,
    )
    await poll(() => loader.loading === false)
    expect(loader.error).to.be.true
    loader.src = DATA_URL
    const reloaded = await poll(() => loader.loaded === true)
    expect(reloaded).to.be.true
    expect(loader.loading).to.be.false
    // a successful retry clears the error flag
    expect(loader.error).to.be.false
  })

  it('clears loading state when src is removed', async () => {
    const loader = await fixture(
      html`<img-loader src="${DATA_URL}"></img-loader>`,
    )
    await poll(() => loader.loaded === true)
    loader.src = ''
    await loader.updateComplete
    expect(loader.loading).to.be.false
    expect(loader.loaded).to.be.false
  })
})

describe('img-pan-zoom viewer lifecycle', () => {
  it('initializes the viewer through the loaded chain with a data URL', async () => {
    const el = await fixture(
      html`<img-pan-zoom src="${DATA_URL}"></img-pan-zoom>`,
    )
    const ready = await poll(() => el.init === true, 150)
    expect(ready).to.be.true
    const viewer = el.viewer
    expect(viewer).to.exist
    expect(viewer === viewerInstances[viewerInstances.length - 1]).to.be.true
    // constructor options wired from element properties
    expect(
      viewer.options.element === el.shadowRoot.querySelector('#viewer'),
    ).to.be.true
    expect(viewer.options.tileSources).to.deep.equal([
      { type: 'image', url: DATA_URL, buildPyramid: false },
    ])
    expect(viewer.options.visibilityRatio).to.equal(1)
    expect(viewer.options.zoomPerClick).to.equal(2.0)
    expect(viewer.options.animationTime).to.equal(1.2)
    expect(viewer.options.prefixUrl.includes('lib/openseadragon/images/')).to
      .be.true
    // initial page, fullscreen state and navigator visibility applied
    expect(viewer.calls).to.deep.equal([
      ['goToPage', 0],
      ['setFullScreen', false],
    ])
    expect(viewer.navigator.element.style.display).to.equal('none')
    // all six openseadragon handlers are registered
    expect(Object.keys(viewer.handlers).length).to.equal(6)
    expect(typeof viewer.handlers.zoom === 'function').to.be.true
    expect(typeof viewer.handlers['viewport-changed'] === 'function').to.be
      .true
  })

  it('initializes deep zoom images through the connectedCallback path', async () => {
    const el = await fixture(
      html`<img-pan-zoom src="image.dzi" dzi></img-pan-zoom>`,
    )
    const ready = await poll(() => el.init === true, 150)
    expect(ready).to.be.true
    // dzi sources are passed through raw instead of being wrapped
    expect(el.viewer.options.tileSources).to.deep.equal(['image.dzi'])
  })

  it('relays openseadragon events as custom events', async () => {
    const el = await fixture(
      html`<img-pan-zoom src="${DATA_URL}"></img-pan-zoom>`,
    )
    await poll(() => el.init === true, 150)
    const viewer = el.viewer
    const seen = []
    for (const name of [
      'zoom',
      'page',
      'pan',
      'update-viewport',
      'viewport-changed',
    ]) {
      el.addEventListener(name, (e) => seen.push([name, e.detail.value.marker]))
    }
    for (const name of [
      'zoom',
      'page',
      'pan',
      'update-viewport',
      'viewport-changed',
    ]) {
      viewer.handlers[name]({ marker: name + '-evt' })
    }
    expect(seen).to.deep.equal([
      ['zoom', 'zoom-evt'],
      ['page', 'page-evt'],
      ['pan', 'pan-evt'],
      ['update-viewport', 'update-viewport-evt'],
      ['viewport-changed', 'viewport-changed-evt'],
    ])
  })

  it('the rotate handler dispatches a rotate event', async () => {
    const el = await fixture(
      html`<img-pan-zoom src="${DATA_URL}"></img-pan-zoom>`,
    )
    await poll(() => el.init === true, 150)
    let rotateMarker = null
    const panValues = []
    el.addEventListener('rotate', (e) => {
      rotateMarker = e.detail.value.marker
    })
    el.addEventListener('pan', (e) => panValues.push(e.detail.value.marker))
    el.viewer.handlers.rotate({ marker: 'rotate-evt' })
    // rotation events reach rotate listeners (they used to be dispatched
    // as a copy-pasted pan event so they were unreachable)
    expect(rotateMarker).to.equal('rotate-evt')
    expect(panValues).to.deep.equal([])
  })

  it('re-adds the image when loaded flips again after init', async () => {
    const el = await fixture(
      html`<img-pan-zoom src="${DATA_URL}"></img-pan-zoom>`,
    )
    await poll(() => el.init === true, 150)
    const viewer = el.viewer
    el.loaded = false
    await el.updateComplete
    el.loaded = true
    await el.updateComplete
    const addCalls = viewer.calls.filter((c) => c[0] === 'addSimpleImage')
    expect(addCalls.length).to.equal(1)
    expect(addCalls[0][1]).to.deep.equal({
      url: DATA_URL,
      index: 0,
      replace: true,
    })
  })

  it('loadedChangedEvent and loadingChangedEvent update state', async () => {
    const el = await fixture(
      html`<img-pan-zoom src="${DATA_URL}"></img-pan-zoom>`,
    )
    await poll(() => el.init === true, 150)
    el.loading = true
    await el.updateComplete
    el.loadedChangedEvent({ detail: { value: true } })
    expect(el.loaded).to.be.true
    expect(el.loading).to.be.false
    el.loadingChangedEvent({ detail: { value: true } })
    expect(el.loading).to.be.true
  })

  it('_srcChanged adds tiled images only when initialized with dzi', async () => {
    const el = await fixture(
      html`<img-pan-zoom src="${DATA_URL}"></img-pan-zoom>`,
    )
    await poll(() => el.init === true, 150)
    const viewer = el.viewer
    el.dzi = true
    el.src = 'new.dzi'
    el._srcChanged()
    expect(viewer.calls.filter((c) => c[0] === 'addTiledImage').length).to
      .equal(1)
    const tiled = viewer.calls.filter((c) => c[0] === 'addTiledImage')[0][1]
    expect(tiled).to.deep.equal({
      tileSource: 'new.dzi',
      index: 0,
      replace: true,
    })
    // before init the call is a no-op
    el.init = false
    el._srcChanged()
    expect(viewer.calls.filter((c) => c[0] === 'addTiledImage').length).to
      .equal(1)
  })

  it('drives navigator, fullscreen, flip and page through updated', async () => {
    const el = await fixture(
      html`<img-pan-zoom src="${DATA_URL}"></img-pan-zoom>`,
    )
    await poll(() => el.init === true, 150)
    const viewer = el.viewer
    viewer.tileSources.push({ type: 'image', url: 'second' })
    el.navigatorToggled = true
    await el.updateComplete
    expect(viewer.navigator.element.style.display).to.equal('inline-block')
    el.navigatorToggled = false
    await el.updateComplete
    expect(viewer.navigator.element.style.display).to.equal('none')
    el.fullscreenToggled = true
    await el.updateComplete
    expect(
      viewer.calls.filter(
        (c) => c[0] === 'setFullScreen' && c[1] === true,
      ).length,
    ).to.equal(1)
    el.flipToggled = true
    await el.updateComplete
    expect(viewer.viewport.flipped).to.be.true
    el.page = 1
    await el.updateComplete
    expect(
      viewer.calls.filter((c) => c[0] === 'goToPage' && c[1] === 1).length,
    ).to.equal(1)
    // pages beyond the tile source count clamp to the last page
    el.page = 99
    await el.updateComplete
    expect(
      viewer.calls.filter((c) => c[0] === 'goToPage' && c[1] === 1).length,
    ).to.equal(2)
    // negative pages clamp to zero (the init call also targeted page 0)
    el.page = -5
    await el.updateComplete
    expect(
      viewer.calls.filter((c) => c[0] === 'goToPage' && c[1] === 0).length,
    ).to.equal(2)
  })

  it('toggleFullscreen and toggleFlip flip their flags', async () => {
    const el = await fixture(
      html`<img-pan-zoom src="${DATA_URL}"></img-pan-zoom>`,
    )
    await poll(() => el.init === true, 150)
    const viewer = el.viewer
    el.toggleFullscreen()
    await el.updateComplete
    expect(el.fullscreenToggled).to.be.true
    expect(
      viewer.calls.filter(
        (c) => c[0] === 'setFullScreen' && c[1] === true,
      ).length,
    ).to.equal(1)
    el.toggleFlip()
    await el.updateComplete
    expect(el.flipToggled).to.be.true
    expect(viewer.viewport.flipped).to.be.true
  })

  it('rotateTo, rotate, pan, zoomIn, zoomOut, resetZoom and destroy', async () => {
    const el = await fixture(
      html`<img-pan-zoom src="${DATA_URL}"></img-pan-zoom>`,
    )
    await poll(() => el.init === true, 150)
    const viewer = el.viewer
    el.rotateTo(45)
    expect(viewer.viewport.rotation).to.equal(45)
    el.rotate(45)
    expect(viewer.viewport.rotation).to.equal(90)
    el.pan(0.1, 0.2)
    expect(viewer.viewport.panned.x).to.equal(0.1)
    expect(viewer.viewport.panned.y).to.equal(0.2)
    // default zoomIn: 1 + 0.7 below maxZoom 2
    el.zoomIn()
    expect(viewer.viewport.zoomed).to.equal(1.7)
    // oversized zoomIn stays under the max and does not zoom
    el.zoomIn(5)
    expect(viewer.viewport.zoomed).to.equal(1.7)
    // small zoomOut stays above the min and zooms
    el.zoomOut(0.2)
    expect(viewer.viewport.zoomed).to.equal(0.8)
    // default zoomOut drops below the min and resets home instead
    el.zoomOut()
    expect(viewer.viewport.homed).to.be.true
    el.resetZoom()
    expect(viewer.viewport.homed).to.be.true
    el.destroy()
    expect(viewer.calls.filter((c) => c[0] === 'destroy').length).to.equal(1)
  })

  it('polls until OpenSeadragon appears when not yet present', async () => {
    const el = await fixture(
      html`<img-pan-zoom src="one.png" dzi></img-pan-zoom>`,
    )
    const realOpenSeadragon = globalThis.OpenSeadragon
    globalThis.OpenSeadragon = undefined
    try {
      el._openseadragonLoaded()
    } finally {
      globalThis.OpenSeadragon = realOpenSeadragon
    }
    const ready = await poll(() => el.init === true, 150)
    expect(ready).to.be.true
    expect(el.viewer).to.exist
  })

  it('warns when init throws', async () => {
    const el = await fixture(
      html`<img-pan-zoom src="one.png" dzi></img-pan-zoom>`,
    )
    el._initOpenSeadragon = () => {
      throw new Error('init boom')
    }
    const warnings = []
    const origWarn = globalThis.console.warn
    globalThis.console.warn = (...args) => warnings.push(args.join(' '))
    try {
      el._openseadragonLoaded()
    } finally {
      globalThis.console.warn = origWarn
      delete el._initOpenSeadragon
    }
    expect(warnings.length).to.equal(1)
    expect(warnings[0].includes('init boom')).to.be.true
  })

  it('navigatorToggled is a safe no-op when the viewer has no navigator', async () => {
    const el = await fixture(
      html`<img-pan-zoom src="one.png"></img-pan-zoom>`,
    )
    el.viewer = {
      navigator: undefined,
      viewport: {},
      setFullScreen() {},
      goToPage() {},
    }
    let threw = false
    try {
      el.navigatorToggled = true
      await el.updateComplete
      el.navigatorToggled = false
      await el.updateComplete
    } catch (e) {
      threw = true
    }
    // real OpenSeadragon only builds the navigator with showNavigator on,
    // so toggling without one must not dereference it (it used to throw)
    expect(threw).to.be.false
  })

  it('disconnecting aborts listeners without throwing', async () => {
    const el = await fixture(
      html`<img-pan-zoom src="one.png"></img-pan-zoom>`,
    )
    const parent = el.parentNode
    parent.removeChild(el)
    expect(parent.querySelector('img-pan-zoom')).to.not.exist
  })
})
