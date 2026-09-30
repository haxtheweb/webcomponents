import { fixture, expect, html } from '@open-wc/testing'
import '../img-view-modal.js'
import '../lib/img-view-viewer.js'

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
  const osdPath = new URL(
    '../../img-pan-zoom/lib/openseadragon/openseadragon.min.js',
    import.meta.url,
  ).href
  globalThis.ESGlobalBridge.requestAvailability()
    .load('openseadragon', osdPath)
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

async function poll(predicate, attempts = 150, delayMs = 20) {
  for (let i = 0; i < attempts; i++) {
    if (predicate()) return true
    await sleep(delayMs)
  }
  return predicate()
}

before(async () => {
  await pinFakeOpenSeadragon()
})

describe('img-view-viewer rendering', () => {
  it('BUG: toolbarsHeight throws when no toolbars are configured', () => {
    // detached element so no render is involved; exercise the getter directly
    const el = globalThis.document.createElement('img-view-viewer')
    // BUG: get toolbarsHeight reads toolbars.top without guarding for
    // toolbars being unset, so the viewer throws
    // "TypeError: Cannot read properties of undefined (reading 'top')"
    // and cannot render at all unless a toolbars object is provided
    expect(() => el.toolbarsHeight).to.throw('top')
    // remove the global es-bridge listener the constructor registered so the
    // detached element cannot receive the delayed loaded event and blow up
    // in _initOpenSeadragon without a shadow root
    el.windowControllers.abort()
  })

  it('renders container, viewer, loader and img-loader for regular images', async () => {
    const el = await fixture(
      html`<img-view-viewer
        .toolbars=${{}}
        .figures=${[{ src: DATA_URL, info: 'figure info' }]}
      ></img-view-viewer>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#container')).to.exist
    const viewer = el.shadowRoot.querySelector('#viewer')
    expect(viewer).to.exist
    expect(viewer.getAttribute('style')).to.include('500px')
    expect(el.shadowRoot.querySelector('#loader')).to.exist
    const spinner = el.shadowRoot.querySelector('hexagon-loader')
    expect(spinner.hasAttribute('loading')).to.be.true
    const loader = el.shadowRoot.querySelector('img-loader')
    expect(loader).to.exist
    expect(loader.getAttribute('src')).to.equal(DATA_URL)
    expect(loader.getAttribute('described-by')).to.equal('')
    // no info toggled: the info block stays hidden
    expect(el.shadowRoot.querySelector('#info').hasAttribute('hidden')).to
      .be.true
  })

  it('passes described-by through to the img-loader', async () => {
    const el = await fixture(
      html`<img-view-viewer
        .toolbars=${{}}
        described-by="desc-1"
        .figures=${[{ src: DATA_URL }]}
      ></img-view-viewer>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('img-loader').getAttribute('src')).to
      .equal(DATA_URL)
    expect(
      el.shadowRoot.querySelector('img-loader').getAttribute('described-by'),
    ).to.equal('desc-1')
  })

  it('omits the spinner when hideSpinner is set', async () => {
    const el = await fixture(
      html`<img-view-viewer
        .toolbars=${{}}
        hide-spinner
        .figures=${[{ src: DATA_URL }]}
      ></img-view-viewer>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#loader')).to.not.exist
    // hideSpinner skips the whole preloader block, img-loader included
    expect(el.shadowRoot.querySelector('img-loader')).to.not.exist
  })

  it('hides the loader once loaded', async () => {
    const el = await fixture(
      html`<img-view-viewer
        .toolbars=${{}}
        .figures=${[{ src: DATA_URL }]}
      ></img-view-viewer>`,
    )
    await el.updateComplete
    el.loaded = true
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#loader').hasAttribute('hidden')).to
      .be.true
    expect(el.shadowRoot.querySelector('hexagon-loader').hasAttribute('loading'))
      .to.be.false
  })

  it('skips the preloader entirely for deep zoom images', async () => {
    const el = await fixture(
      html`<img-view-viewer
        .toolbars=${{}}
        dzi
        .figures=${[{ src: 'tiles.dzi' }]}
      ></img-view-viewer>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('img-loader')).to.not.exist
    expect(el.shadowRoot.querySelector('#loader')).to.not.exist
    expect(el.shadowRoot.querySelector('#viewer')).to.exist
  })
})

describe('img-view-viewer toolbars', () => {
  it('renders the default bottom toolbar with all of its groups and buttons', async () => {
    const el = await fixture(
      html`<img-view-viewer
        .toolbars=${{}}
        .figures=${[{ src: DATA_URL }, { src: DATA_URL }]}
      ></img-view-viewer>`,
    )
    el.toolbars = el.defaultToolbars
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#bottom')).to.exist
    for (const id of [
      'prevbutton',
      'homebutton',
      'rotateccwbutton',
      'rotatecwbutton',
      'zoominbutton',
      'zoomoutbutton',
      'panleftbutton',
      'panupbutton',
      'pandownbutton',
      'panrightbutton',
      'fullscreenbutton',
      'nextbutton',
    ]) {
      expect(el.shadowRoot.querySelector('#' + id), id).to.exist
    }
    // nested groups carry their group ids too
    expect(el.shadowRoot.querySelector('#rotategroup')).to.exist
    expect(el.shadowRoot.querySelector('#zoomgroup')).to.exist
    expect(el.shadowRoot.querySelector('#pangroup')).to.exist
    // prev is disabled on the first page, next is not
    expect(el.shadowRoot.querySelector('#prevbutton').hasAttribute('disabled'))
      .to.be.true
    expect(el.shadowRoot.querySelector('#nextbutton').hasAttribute('disabled'))
      .to.be.false
    // next has the icon-right + flex-grow classes
    expect(el.shadowRoot.querySelector('#nextbutton').className).to.equal(
      'icon-right flex-grow',
    )
    expect(el.shadowRoot.querySelector('#prevbutton').className).to.equal(
      ' flex-grow',
    )
    // icon-only buttons keep their text for screen readers only
    const homeText = el.shadowRoot.querySelector('#homebutton span')
    expect(homeText.className).to.equal('sr-only')
    expect(homeText.textContent).to.equal('return image to home position')
    // showText buttons render visible text
    const prevText = el.shadowRoot.querySelector('#prevbutton span')
    expect(prevText.className).to.equal('')
    expect(prevText.textContent).to.equal('prev')
    // the x-of-y text renders as a misc item
    const misc = el.shadowRoot.querySelectorAll('.misc-item')
    let foundXofY = false
    misc.forEach((item) => {
      if (item.textContent.trim() === '1 of 2') foundXofY = true
    })
    expect(foundXofY).to.be.true
    // tooltips render above the image for bottom toolbar buttons
    expect(
      el.shadowRoot
        .querySelector('simple-tooltip[for="homebutton"]')
        .getAttribute('position'),
    ).to.equal('top')
  })

  it('renders a top toolbar with bottom-positioned tooltips', async () => {
    const el = await fixture(
      html`<img-view-viewer
        .toolbars=${{}}
        .figures=${[{ src: DATA_URL }]}
      ></img-view-viewer>`,
    )
    el.toolbars = {
      top: { id: 'top', type: 'toolbar-group', contents: ['homebutton'] },
      bottom: { id: 'bottom', type: 'toolbar-group', contents: ['zoominbutton'] },
    }
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#top')).to.exist
    expect(el.shadowRoot.querySelector('#bottom')).to.exist
    expect(
      el.shadowRoot
        .querySelector('simple-tooltip[for="homebutton"]')
        .getAttribute('position'),
    ).to.equal('bottom')
    expect(
      el.shadowRoot
        .querySelector('simple-tooltip[for="zoominbutton"]')
        .getAttribute('position'),
    ).to.equal('top')
    // both toolbars offset the viewer height (52px each)
    expect(el.shadowRoot.querySelector('#viewer').getAttribute('style')).to
      .include('104px')
  })

  it('renders aria-pressed toggles for toggle buttons', async () => {
    const el = await fixture(
      html`<img-view-viewer
        .toolbars=${{
          top: {
            id: 'top',
            type: 'toolbar-group',
            contents: [
              'navigatorbutton',
              'infobutton',
              'kbdbutton',
              'flipbutton',
              'navXofY',
            ],
          },
        }}
        .figures=${[{ src: DATA_URL }]}
      ></img-view-viewer>`,
    )
    await el.updateComplete
    el.navigatorToggled = true
    el.infoToggled = true
    el.kbdToggled = true
    el.flipToggled = true
    await el.updateComplete
    for (const id of [
      'navigatorbutton',
      'infobutton',
      'kbdbutton',
      'flipbutton',
    ]) {
      expect(
        el.shadowRoot.querySelector('#' + id).getAttribute('aria-pressed'),
        id,
      ).to.equal('true')
    }
    // the navXofY misc item renders the x-of-y input
    const input = el.shadowRoot.querySelector('#pageX')
    expect(input).to.exist
    expect(input.value).to.equal('1')
    expect(input.hasAttribute('disabled')).to.be.false
    // toggles reflect their mode attributes
    expect(el.hasAttribute('info-mode')).to.be.true
    expect(el.hasAttribute('keyboard-help-mode')).to.be.true
  })

  it('hides the navigator button unless showNavigator is on', async () => {
    const el = await fixture(
      html`<img-view-viewer
        .toolbars=${{
          top: {
            id: 'top',
            type: 'toolbar-group',
            contents: ['navigatorbutton'],
          },
        }}
        .figures=${[{ src: DATA_URL }]}
      ></img-view-viewer>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#navigatorbutton').hasAttribute('hidden'))
      .to.be.true
    el.showNavigator = true
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#navigatorbutton').hasAttribute('hidden'))
      .to.be.false
  })

  it('BUG: the infobutton never hides even with no figures', async () => {
    const el = await fixture(
      html`<img-view-viewer
        .toolbars=${{
          bottom: {
            id: 'bottom',
            type: 'toolbar-group',
            contents: ['infobutton'],
          },
        }}
      ></img-view-viewer>`,
    )
    await el.updateComplete
    // BUG: the noSources getter computes pages.length === 0 but forgets to
    // return it, so it always yields undefined and the infobutton's
    // hiddenProp can never hide the button, even with zero figures
    expect(el.pages.length).to.equal(0)
    expect(el.shadowRoot.querySelector('#infobutton').hasAttribute('hidden')).to
      .be.false
  })

  it('prefers customToolbars over toolbars when rendering', async () => {
    const el = await fixture(
      html`<img-view-viewer
        .toolbars=${{}}
        .figures=${[{ src: DATA_URL }]}
      ></img-view-viewer>`,
    )
    el.toolbars = el.defaultToolbars
    el.customToolbars = {
      bottom: {
        id: 'customtoolbar',
        type: 'toolbar-group',
        contents: ['homebutton'],
      },
    }
    // customToolbars is not a reactive property, so nudge a reactive one
    el.disabled = true
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#customtoolbar')).to.exist
    expect(el.shadowRoot.querySelector('#bottom')).to.not.exist
    expect(el.shadowRoot.querySelector('#prevbutton')).to.not.exist
    expect(el.shadowRoot.querySelector('#homebutton')).to.exist
    expect(el.shadowRoot.querySelector('#homebutton').hasAttribute('disabled'))
      .to.be.true
    // toolbarsHeight follows customToolbars too
    expect(el.toolbarsHeight).to.equal(52)
    el.disabled = false
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#homebutton').hasAttribute('disabled'))
      .to.be.false
  })

  it('renders plain text contents as a misc item', async () => {
    const el = await fixture(
      html`<img-view-viewer
        .toolbars=${{
          bottom: {
            id: 'bottom',
            type: 'toolbar-group',
            contents: ['some text that is not a config'],
          },
        }}
        .figures=${[{ src: DATA_URL }]}
      ></img-view-viewer>`,
    )
    await el.updateComplete
    const misc = el.shadowRoot.querySelector('.misc-item')
    expect(misc).to.exist
    expect(misc.textContent.trim()).to.equal('some text that is not a config')
  })

  it('shows keyboard shortcut help via the kbd toggle', async () => {
    const el = await fixture(
      html`<img-view-viewer
        .toolbars=${{}}
        .figures=${[{ src: DATA_URL }]}
      ></img-view-viewer>`,
    )
    await el.updateComplete
    el.kbdToggled = true
    await el.updateComplete
    const info = el.shadowRoot.querySelector('#info')
    expect(info.hasAttribute('hidden')).to.be.false
    expect(info.textContent).to.include('Keyboard Shortcuts')
    expect(info.querySelector('caption').textContent).to.include(
      'when image has focus',
    )
  })

  it('shows the current figure info via the info toggle', async () => {
    const el = await fixture(
      html`<img-view-viewer
        .toolbars=${{}}
        .figures=${[{ src: DATA_URL, info: 'first figure info' }]}
      ></img-view-viewer>`,
    )
    await el.updateComplete
    el.infoToggled = true
    await el.updateComplete
    const info = el.shadowRoot.querySelector('#info')
    expect(info.hasAttribute('hidden')).to.be.false
    expect(info.textContent).to.include('first figure info')
    // kbd help wins over figure info
    el.kbdToggled = true
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#info').textContent).to.include(
      'Keyboard Shortcuts',
    )
  })
})

describe('img-view-viewer getters and helpers', () => {
  let el
  beforeEach(async () => {
    el = await fixture(
      html`<img-view-viewer .toolbars=${{}}></img-view-viewer>`,
    )
    await el.updateComplete
  })

  it('derives src, loadSrc and sources from figures', async () => {
    expect(el.src).to.be.undefined
    expect(el.loadSrc).to.be.undefined
    expect(el.sources).to.be.undefined
    el.figures = [{ src: 'a.png' }, { src: 'b.png' }, { src: 'c.png' }]
    await el.updateComplete
    expect(el.src).to.equal('a.png')
    expect(el.loadSrc).to.equal('a.png')
    expect(el.sources).to.deep.equal(['b.png', 'c.png'])
    el.page = 2
    await el.updateComplete
    expect(el.loadSrc).to.equal('c.png')
  })

  it('tracks pages, paging state and x-of-y text', () => {
    expect(el.pages).to.deep.equal([])
    expect(el.pageXofY).to.equal('1 of 0')
    expect(el.prevDisabled).to.be.true
    expect(el.nextDisabled).to.be.true
    el.figures = [{ src: 'a.png' }, { src: 'b.png' }]
    expect(el.pageXofY).to.equal('1 of 2')
    expect(el.prevDisabled).to.be.true
    expect(el.nextDisabled).to.be.false
    el.page = 1
    expect(el.prevDisabled).to.be.false
    expect(el.nextDisabled).to.be.true
  })

  it('computes toolbarsHeight from custom or default toolbars', async () => {
    expect(el.toolbarsHeight).to.equal(0)
    el.toolbars = {
      bottom: { id: 'bottom', type: 'toolbar-group', contents: [] },
    }
    await el.updateComplete
    expect(el.toolbarsHeight).to.equal(52)
    el.toolbars = {
      top: { id: 'top', type: 'toolbar-group', contents: [] },
      bottom: { id: 'bottom', type: 'toolbar-group', contents: [] },
    }
    await el.updateComplete
    expect(el.toolbarsHeight).to.equal(104)
    // customToolbars wins over toolbars
    el.customToolbars = { top: { id: 't', type: 'toolbar-group', contents: [] } }
    expect(el.toolbarsHeight).to.equal(52)
  })

  it('getToolbars returns an empty template when the toolbar is unset', () => {
    el.toolbars = { bottom: { id: 'bottom', type: 'toolbar-group', contents: [] } }
    expect(el.getToolbars('top')).to.equal('')
    // defaults to the bottom toolbar
    expect(typeof el.getToolbars()).to.equal('object')
  })

  it('exposes the documented default button and group configs', () => {
    const dt = el.defaultToolbars
    expect(dt.bottom.id).to.equal('bottom')
    expect(dt.bottom.contents).to.deep.equal([
      'prevbutton',
      'homebutton',
      'rotategroup',
      'zoomgroup',
      'pageXofY',
      'pangroup',
      'fullscreenbutton',
      'nextbutton',
    ])
    expect(el.homebutton.icon).to.equal('home')
    expect(el.homebutton.text).to.equal('return image to home position')
    expect(el.fullscreenbutton.icon).to.equal('fullscreen')
    expect(el.fullscreenbutton.toggleProp).to.equal('__fullscreen')
    expect(el.fullscreenbutton.enabledProp).to.equal('fullscreenEnabled')
    expect(el.navigatorbutton.toggleProp).to.equal('navigatorToggled')
    expect(el.navigatorbutton.shownProp).to.equal('showNavigator')
    expect(el.navigatorbutton.enabledProp).to.equal('showNavigator')
    expect(el.infobutton.icon).to.equal('info-outline')
    expect(el.infobutton.toggleProp).to.equal('infoToggled')
    expect(el.infobutton.hiddenProp).to.equal('noSources')
    expect(el.kbdbutton.icon).to.equal('help-outline')
    expect(el.kbdbutton.toggleProp).to.equal('kbdToggled')
    expect(el.kbdbutton.details).to.exist
    expect(el.flipbutton.toggleProp).to.equal('flipToggled')
    expect(el.rotategroup.contents).to.deep.equal([
      el.rotateccwbutton,
      el.rotatecwbutton,
    ])
    expect(el.pangroup.contents).to.deep.equal([
      el.panleftbutton,
      el.panupbutton,
      el.pandownbutton,
      el.panrightbutton,
    ])
    expect(el.zoomgroup.contents).to.deep.equal([
      el.zoominbutton,
      el.zoomoutbutton,
    ])
    expect(el.prevbutton.disabledProp).to.equal('prevDisabled')
    expect(el.prevbutton.flexGrow).to.be.true
    expect(el.prevbutton.showText).to.be.true
    expect(el.nextbutton.disabledProp).to.equal('nextDisabled')
    expect(el.nextbutton.iconRight).to.be.true
    expect(el.zoominbutton.icon).to.equal('zoom-in')
    expect(el.zoomoutbutton.icon).to.equal('zoom-out')
    expect(el.panupbutton.icon).to.equal('arrow-upward')
    expect(el.navXofY.id).to.equal('navXofY')
    expect(el.navXofY.type).to.equal('misc-item')
  })

  it('noSources never reports true (missing return statement)', () => {
    el.figures = []
    // BUG: the getter computes the boolean but never returns it
    expect(el.noSources).to.be.undefined
    el.figures = [{ src: 'a.png' }]
    expect(el.noSources).to.be.undefined
  })

  it('button helpers compute disabled, hidden and class', () => {
    el.figures = [{ src: 'a.png' }]
    el.disabled = true
    expect(el._buttonDisabled({})).to.be.true
    el.disabled = false
    expect(el._buttonDisabled({})).to.be.false
    expect(el._buttonDisabled({ disabledProp: 'prevDisabled' })).to.be.true
    expect(el._buttonDisabled({ enabledProp: 'showNavigator' })).to.be.true
    el.showNavigator = true
    expect(el._buttonDisabled({ enabledProp: 'showNavigator' })).to.be.false
    // hidden: hiddenProp and shownProp
    el.disabled = true
    expect(el._buttonHidden({ hiddenProp: 'disabled' })).to.be.true
    el.disabled = false
    expect(el._buttonHidden({ hiddenProp: 'disabled' })).to.not.be.true
    expect(el._buttonHidden({})).to.not.be.true
    el.showNavigator = false
    expect(el._buttonHidden({ shownProp: 'showNavigator' })).to.be.true
    // class
    expect(el._buttonClass({})).to.equal('')
    expect(el._buttonClass({ iconRight: true })).to.equal('icon-right')
    expect(el._buttonClass({ flexGrow: true })).to.equal(' flex-grow')
    expect(el._buttonClass({ iconRight: true, flexGrow: true })).to.equal(
      'icon-right flex-grow',
    )
  })

  it('_item, _group and _button resolve strings and degrade gracefully', () => {
    // unresolvable strings and non-objects render as plain misc text
    expect(el._item('not-a-real-config')).to.exist
    expect(el._item(5)).to.exist
    // falsy group and button configs render nothing
    expect(el._group(null)).to.equal('')
    expect(el._button(null)).to.equal('')
    expect(el._buttonInner(null)).to.equal('')
    expect(el._buttonTooltip({ text: 'x' })).to.equal('')
    // resolvable strings resolve to the default configs
    expect(el._button('homebutton')).to.exist
    expect(el._group('rotategroup')).to.exist
    // groups render non-array contents directly
    expect(el._group({ id: 'g1', contents: 'just text' })).to.exist
    // defaults still render
    expect(el._item()).to.exist
    expect(el._group()).to.exist
    expect(el._button()).to.exist
    expect(el._buttonTooltip({ id: 'x', text: 'tip' }, true)).to.exist
  })
})

describe('img-view-viewer interactions', () => {
  let el
  beforeEach(async () => {
    el = await fixture(
      html`<img-view-viewer
        .toolbars=${{}}
        .figures=${[
          { src: DATA_URL, info: 'first info' },
          { src: DATA_URL, info: 'second info' },
        ]}
      ></img-view-viewer>`,
    )
    const ready = await poll(() => el.init === true)
    expect(ready).to.be.true
  })

  it('initializes through the loaded chain and skips setFullScreen', () => {
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
    // the viewer overrides both zoom ratios
    expect(viewer.options.minZoomImageRatio).to.equal(1)
    expect(viewer.options.maxZoomPixelRatio).to.equal(3)
    // initial page requested, but _setFullscreen is a no-op override here
    expect(viewer.calls).to.deep.equal([['goToPage', 0]])
    expect(viewer.calls.filter((c) => c[0] === 'setFullScreen').length).to.equal(
      0,
    )
    // all six openseadragon handlers are registered
    expect(Object.keys(viewer.handlers).length).to.equal(6)
  })

  it('initializes deep zoom images through the connectedCallback path', async () => {
    const dziEl = await fixture(
      html`<img-view-viewer
        .toolbars=${{}}
        dzi
        .figures=${[{ src: 'image.dzi' }]}
      ></img-view-viewer>`,
    )
    const ready = await poll(() => dziEl.init === true)
    expect(ready).to.be.true
    // dzi sources pass through raw instead of being wrapped
    expect(dziEl.viewer.options.tileSources).to.deep.equal(['image.dzi'])
  })

  it('home, pan, zoom and rotate buttons drive the viewer', () => {
    const viewer = el.viewer
    const events = []
    el.addEventListener('toolbar-button-click', (e) =>
      events.push([e.detail.buttonId, e.detail.viewer === el]),
    )
    el._toolbarButtonClick('homebutton', { marker: 'home' })
    expect(viewer.viewport.homed).to.be.true
    el._toolbarButtonClick('panupbutton', {})
    expect(viewer.viewport.panned.y).to.equal(0.2)
    el._toolbarButtonClick('pandownbutton', {})
    expect(viewer.viewport.panned.y).to.equal(-0.2)
    el._toolbarButtonClick('panleftbutton', {})
    expect(viewer.viewport.panned.x).to.equal(0.2)
    el._toolbarButtonClick('panrightbutton', {})
    expect(viewer.viewport.panned.x).to.equal(-0.2)
    el._toolbarButtonClick('zoominbutton', {})
    expect(viewer.viewport.zoomed).to.equal(1.2)
    el._toolbarButtonClick('zoomoutbutton', {})
    expect(viewer.viewport.zoomed).to.equal(0.8)
    el._toolbarButtonClick('rotateccwbutton', {})
    expect(viewer.viewport.rotation).to.equal(-90)
    el._toolbarButtonClick('rotatecwbutton', {})
    expect(viewer.viewport.rotation).to.equal(0)
    // every enabled click dispatched a bubbling toolbar-button-click
    expect(events).to.deep.equal([
      ['homebutton', true],
      ['panupbutton', true],
      ['pandownbutton', true],
      ['panleftbutton', true],
      ['panrightbutton', true],
      ['zoominbutton', true],
      ['zoomoutbutton', true],
      ['rotateccwbutton', true],
      ['rotatecwbutton', true],
    ])
  })

  it('navigator, fullscreen and flip buttons toggle their flags', async () => {
    const viewer = el.viewer
    // stub the fullscreen request on the container the behaviors target
    let fsRequested = 0
    el.shadowRoot.querySelector('#container').requestFullscreen = () => {
      fsRequested = fsRequested + 1
      return Promise.resolve()
    }
    expect(el.fullscreenTarget === el.shadowRoot.querySelector('#container'))
      .to.be.true
    el._toolbarButtonClick('navigatorbutton', {})
    await el.updateComplete
    expect(el.navigatorToggled).to.be.true
    expect(viewer.navigator.element.style.display).to.equal('inline-block')
    el._toolbarButtonClick('fullscreenbutton', {})
    await el.updateComplete
    expect(fsRequested).to.equal(1)
    el._toolbarButtonClick('flipbutton', {})
    await el.updateComplete
    expect(el.flipToggled).to.be.true
    expect(viewer.viewport.flipped).to.be.true
  })

  it('info and kbd buttons toggle their exclusive modes', async () => {
    el._toolbarButtonClick('kbdbutton', {})
    await el.updateComplete
    expect(el.kbdToggled).to.be.true
    expect(el.infoToggled).to.be.false
    el._toolbarButtonClick('infobutton', {})
    await el.updateComplete
    expect(el.infoToggled).to.be.true
    expect(el.kbdToggled).to.be.false
    expect(el.shadowRoot.querySelector('#info').textContent).to.include(
      'first info',
    )
  })

  it('next and prev buttons page through figures with clamping', async () => {
    const viewer = el.viewer
    expect(el.page).to.equal(0)
    el._toolbarButtonClick('nextbutton', {})
    await el.updateComplete
    expect(el.page).to.equal(1)
    expect(el.loadSrc).to.equal(DATA_URL)
    // clamped to the last page
    el._toolbarButtonClick('nextbutton', {})
    await el.updateComplete
    expect(el.page).to.equal(1)
    el._toolbarButtonClick('prevbutton', {})
    await el.updateComplete
    expect(el.page).to.equal(0)
    // clamped to the first page
    el._toolbarButtonClick('prevbutton', {})
    await el.updateComplete
    expect(el.page).to.equal(0)
    // init + next + prev relayed clamped goToPage calls to the viewer
    expect(viewer.calls.filter((c) => c[0] === 'goToPage').length).to.equal(3)
  })

  it('disabled blocks toolbar button actions', async () => {
    el.toolbars = el.defaultToolbars
    el.disabled = true
    await el.updateComplete
    const events = []
    el.addEventListener('toolbar-button-click', (e) =>
      events.push(e.detail.buttonId),
    )
    // real clicks on a disabled button never dispatch
    el.shadowRoot.querySelector('#homebutton').click()
    expect(events).to.deep.equal([])
    expect(el.viewer.viewport.homed).to.be.undefined
    // the disabled branch of the direct handler is a no-op too
    el._toolbarButtonClick('homebutton', {}, true)
    expect(events).to.deep.equal([])
    expect(el.viewer.viewport.homed).to.be.undefined
    // re-enabling restores the behavior
    el.disabled = false
    await el.updateComplete
    el.shadowRoot.querySelector('#homebutton').click()
    expect(events).to.deep.equal(['homebutton'])
    expect(el.viewer.viewport.homed).to.be.true
  })

  it('pages via the x-of-y input change event', async () => {
    el.toolbars = {
      bottom: {
        id: 'bottom',
        type: 'toolbar-group',
        contents: ['navXofY'],
      },
    }
    await el.updateComplete
    const input = el.shadowRoot.querySelector('#pageX')
    expect(input.value).to.equal('1')
    input.value = '2'
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    await el.updateComplete
    expect(el.page).to.equal(1)
    // goToPageXofY falls back to e.target when there is no composedPath
    el.goToPageXofY({ target: { value: 2 } })
    await el.updateComplete
    expect(el.page).to.equal(1)
    // disabled blocks paging from the input
    el.disabled = true
    await el.updateComplete
    input.value = '1'
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
    await el.updateComplete
    expect(el.page).to.equal(1)
  })

  it('relays loaded and loading state and re-adds the image', async () => {
    const viewer = el.viewer
    el.loadingChangedEvent({ detail: { value: true } })
    expect(el.loading).to.be.true
    el.loadedChangedEvent({ detail: { value: true } })
    expect(el.loaded).to.be.true
    expect(el.loading).to.be.false
    // flipping loaded after init re-adds the current page via _addImage
    el.loaded = false
    await el.updateComplete
    el.loaded = true
    await el.updateComplete
    const addCalls = viewer.calls.filter((c) => c[0] === 'addSimpleImage')
    expect(addCalls.length).to.equal(1)
    expect(addCalls[0][1]).to.deep.equal({
      url: DATA_URL,
      index: 0,
      clone: true,
    })
  })

  it('_srcChanged adds tiled images only in dzi mode after init', () => {
    const viewer = el.viewer
    el.dzi = true
    el._srcChanged()
    const tiled = viewer.calls.filter((c) => c[0] === 'addTiledImage')
    expect(tiled.length).to.equal(1)
    expect(tiled[0][1]).to.deep.equal({
      tileSource: DATA_URL,
      index: 0,
      clone: true,
    })
    // before init the call is a no-op
    el.init = false
    el._srcChanged()
    expect(viewer.calls.filter((c) => c[0] === 'addTiledImage').length).to
      .equal(1)
  })

  it('_setFullscreen is a deliberate no-op', async () => {
    expect(el._setFullscreen(true)).to.be.undefined
    el.fullscreenToggled = true
    await el.updateComplete
    // the no-op override keeps OpenSeadragon out of fullscreen handling
    expect(
      el.viewer.calls.filter((c) => c[0] === 'setFullScreen').length,
    ).to.equal(0)
  })
})
