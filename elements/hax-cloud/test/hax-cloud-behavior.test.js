import { fixture, expect, html } from '@open-wc/testing'
import { HaxCloud } from '../hax-cloud.js'
import { FileSystemBrokerSingleton } from '@haxtheweb/file-system-broker/file-system-broker.js'

// NOTE: the constructor appends a Google Fonts <link> to document.head the
// first time a hax-cloud is built. Tests below stub head.appendChild for the
// link so no real network request is ever issued from this suite.

describe('hax-cloud behavior', () => {
  let element
  let originalAppSettings
  let appendedEls

  const patchHeadAppend = () => {
    const head = globalThis.document.head
    const orig = head.appendChild.bind(head)
    appendedEls = []
    head.appendChild = function (node) {
      if (node && node.tagName === 'LINK') {
        appendedEls.push(node)
        return node
      }
      return orig(node)
    }
    return () => {
      head.appendChild = orig
    }
  }

  beforeEach(() => {
    originalAppSettings = globalThis.appSettings
  })

  afterEach(() => {
    globalThis.appSettings = originalAppSettings
  })

  it('loads the HAX logo font from Google Fonts exactly once', async () => {
    // first construction: link requested against head, but stubbed so the
    // stylesheet is never fetched over the network
    const restore = patchHeadAppend()
    globalThis.__haxLogoFontLoaded = false
    element = await fixture(html`<hax-cloud></hax-cloud>`)
    restore()
    // only count the Press Start 2P link; the DDD design system separately
    // injects its own Roboto font links into head on first construction
    const FONT_URL =
      'https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap'
    const fontLinks = appendedEls.filter(
      (l) => l.getAttribute('href') === FONT_URL,
    )
    expect(fontLinks.length).to.equal(1)
    const link = fontLinks[0]
    expect(link.getAttribute('href')).to.equal(
      'https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap',
    )
    expect(link.getAttribute('rel')).to.equal('stylesheet')
    expect(globalThis.__haxLogoFontLoaded).to.equal(true)
    // second construction: flag prevents a duplicate request
    const restore2 = patchHeadAppend()
    const second = await fixture(html`<hax-cloud></hax-cloud>`)
    restore2()
    const fontLinks2 = appendedEls.filter(
      (l) => l.getAttribute('href') === FONT_URL,
    )
    expect(fontLinks2.length).to.equal(0, 'font link should only load once')
    expect(second).to.exist
  })

  it('defaults and tag name', async () => {
    element = await fixture(html`<hax-cloud></hax-cloud>`)
    expect(HaxCloud.tag).to.equal('hax-cloud')
    expect(element.tagName.toLowerCase()).to.equal('hax-cloud')
    expect(element.fileRoot).to.equal('')
    expect(Array.isArray(element.fileObjects)).to.equal(true)
    expect(element.fileObjects.length).to.equal(0)
  })

  it('renders into light DOM (no shadow root) with the full onboarding layout', async () => {
    element = await fixture(html`<hax-cloud></hax-cloud>`)
    // createRenderRoot returns this, so content lands in light DOM
    expect(element.shadowRoot === null).to.equal(true)
    expect(element.querySelector('main')).to.exist

    const h1 = element.querySelector('h1.name-wrapper')
    expect(h1).to.exist
    expect(h1.getAttribute('title')).to.equal('Welcome to HAX.cloud')
    // the heading content is an aria-hidden [dot] plus icons, so the
    // accessible name comes from aria-label mirroring the title attribute
    // (round 8 a11y fix)
    expect(h1.getAttribute('aria-label')).to.equal('Welcome to HAX.cloud')

    const icons = element.querySelectorAll('.name-wrapper simple-icon')
    expect(icons.length).to.equal(2)
    expect(icons[0].getAttribute('icon')).to.equal('hax:hax2022')
    expect(icons[0].getAttribute('accent-color')).to.equal('deep-purple')
    expect(icons[1].getAttribute('icon')).to.equal('cloud')
    expect(icons[1].getAttribute('accent-color')).to.equal('green')

    const dot = element.querySelector('.dot')
    expect(dot).to.exist
    expect(dot.getAttribute('aria-hidden')).to.equal('true')

    // details.step (instructions) + two div.step (Step 1 / Step 3)
    const steps = element.querySelectorAll('.step')
    expect(steps.length).to.equal(3)
    const details = element.querySelector('details.step')
    expect(details.hasAttribute('open')).to.equal(true)
    expect(details.querySelector('summary').textContent.trim()).to.equal(
      'Load HAX locally',
    )
    expect(details.querySelectorAll('li').length).to.equal(5)

    const buttons = element.querySelectorAll('.step simple-icon-button-lite')
    expect(buttons.length).to.equal(2)
    expect(buttons[0].getAttribute('icon')).to.equal('file-download')
    expect(buttons[1].getAttribute('icon')).to.equal('folder-open')
    expect(buttons[0].textContent.trim()).to.equal('Download HAX site')
    expect(buttons[1].textContent.trim()).to.equal('Select HAX site')
  })

  it('downloadHAXLatest clicks an anchor pointing at the hax-single-site zip', async () => {
    element = await fixture(html`<hax-cloud></hax-cloud>`)
    const clicked = []
    const origClick = globalThis.HTMLAnchorElement.prototype.click
    globalThis.HTMLAnchorElement.prototype.click = function () {
      clicked.push(this)
    }
    try {
      await element.downloadHAXLatest()
    } finally {
      globalThis.HTMLAnchorElement.prototype.click = origClick
    }
    expect(clicked.length).to.equal(1)
    expect(clicked[0].getAttribute('href')).to.equal(
      'https://github.com/elmsln/hax-single-site/archive/refs/heads/main.zip',
    )
    expect(clicked[0].getAttribute('download')).to.equal('hax-single-site.zip')
  })

  it('findLocalHaxCopy scans the opened directory for site.json and loads it', async () => {
    element = await fixture(html`<hax-cloud></hax-cloud>`)
    const manifestJson = JSON.stringify({
      title: 'My local site',
      items: [{ id: 'item-1', title: 'Page one' }],
    })
    const records = [
      { kind: 'directory', name: 'assets', folder: '/site-root' },
      { kind: 'file', name: 'readme.md', folder: '/site-root' },
      {
        kind: 'file',
        name: 'site.json',
        folder: '/site-root',
        handle: {
          getFile: async () => ({ text: async () => manifestJson }),
        },
      },
    ]
    const origOpenDir = FileSystemBrokerSingleton.openDir
    FileSystemBrokerSingleton.openDir = async () => records
    const siteBuilder = globalThis.document.createElement(
      'haxcms-site-builder',
    )
    // assigning the manifest on the real site-builder dispatches
    // manifest-changed, which runs loadLocalHax and needs the userfs
    // backend element in the DOM to wire the local file objects into
    const backend = globalThis.document.createElement(
      'haxcms-backend-userfs',
    )
    siteBuilder.style.display = 'none'
    globalThis.document.body.appendChild(siteBuilder)
    globalThis.document.body.appendChild(backend)
    try {
      // the for..of loop awaits every record, so findLocalHaxCopy resolving
      // now guarantees the scan and the manifest assignment completed
      // (round 8 fix for the previously unawaited forEach(async ...) race,
      // BUG hax-cloud.js:186; assertions run with no settling sleep)
      await element.findLocalHaxCopy()
      expect(element.fileRoot).to.equal('/site-root')
      expect(element.fileObjects).to.equal(records)
      expect(siteBuilder.manifest.title).to.equal('My local site')
      expect(siteBuilder.manifest.items.length).to.equal(1)
      // the manifest-changed cascade wired the backend and revealed the site
      expect(backend.fileObjects).to.equal(records)
      expect(backend.fileRoot).to.equal('/site-root')
      expect(siteBuilder.style.display).to.equal('')
    } finally {
      FileSystemBrokerSingleton.openDir = origOpenDir
      siteBuilder.remove()
      backend.remove()
    }
  })

  it('findLocalHaxCopy ignores a site.json whose manifest has no items', async () => {
    element = await fixture(html`<hax-cloud></hax-cloud>`)
    const emptyManifest = JSON.stringify({ title: 'Empty', items: [] })
    const records = [
      {
        kind: 'file',
        name: 'site.json',
        folder: '/empty-root',
        handle: {
          getFile: async () => ({ text: async () => emptyManifest }),
        },
      },
    ]
    const origOpenDir = FileSystemBrokerSingleton.openDir
    FileSystemBrokerSingleton.openDir = async () => records
    const siteBuilder = globalThis.document.createElement(
      'haxcms-site-builder',
    )
    globalThis.document.body.appendChild(siteBuilder)
    try {
      await element.findLocalHaxCopy()
      await new Promise((r) => setTimeout(r, 50))
      // fileRoot is still recorded but the manifest is not applied
      expect(element.fileRoot).to.equal('/empty-root')
      expect(siteBuilder.manifest === undefined).to.equal(
        true,
        'empty-items manifest must not be assigned to the builder',
      )
    } finally {
      FileSystemBrokerSingleton.openDir = origOpenDir
      siteBuilder.remove()
    }
  })

  it('manifest-changed installs local app settings, wires the userfs backend, reveals the site and self-removes', async () => {
    element = await fixture(html`<hax-cloud></hax-cloud>`)
    const siteBuilder = globalThis.document.createElement(
      'haxcms-site-builder',
    )
    const backend = globalThis.document.createElement('haxcms-backend-userfs')
    siteBuilder.style.display = 'none'
    globalThis.document.body.appendChild(siteBuilder)
    globalThis.document.body.appendChild(backend)
    try {
      globalThis.dispatchEvent(new CustomEvent('manifest-changed'))
      // loadLocalHax runs synchronously inside the event listener
      expect(globalThis.appSettings.login).to.equal('dist/dev/login.json')
      expect(globalThis.appSettings.logout).to.equal('dist/dev/logout.json')
      expect(globalThis.appSettings.getFormToken).to.equal(
        'adskjadshjudfu823u823u8fu8fij',
      )
      expect(
        globalThis.appSettings.appStore.url.indexOf('appstore.json') !== -1,
      ).to.equal(true)
      expect(backend.fileObjects).to.equal(element.fileObjects)
      expect(backend.fileRoot).to.equal(element.fileRoot)
      expect(siteBuilder.style.display).to.equal('')
      // then the element removes itself on the next tick
      await new Promise((r) => setTimeout(r, 10))
      expect(element.isConnected).to.equal(false)
    } finally {
      siteBuilder.remove()
      backend.remove()
    }
  })

  it('manifest-changed without builder/userfs elements in the DOM does not throw', async () => {
    element = await fixture(html`<hax-cloud></hax-cloud>`)
    // round 8 null guards (BUG hax-cloud.js:228-233): previously the
    // unguarded querySelector results threw a TypeError inside the event
    // listener on a page without the haxcms-backend-userfs /
    // haxcms-site-builder elements
    globalThis.dispatchEvent(new CustomEvent('manifest-changed'))
    expect(globalThis.appSettings.login).to.equal('dist/dev/login.json')
    // the element still rests after the tick
    await new Promise((r) => setTimeout(r, 10))
    expect(element.isConnected).to.equal(false)
  })

  it('disconnectedCallback aborts the manifest-changed listener', async () => {
    element = await fixture(html`<hax-cloud></hax-cloud>`)
    element.disconnectedCallback()
    globalThis.dispatchEvent(new CustomEvent('manifest-changed'))
    expect(globalThis.appSettings.login === 'dist/dev/login.json').to.equal(
      false,
      'loadLocalHax must not run after disconnect',
    )
  })
})
