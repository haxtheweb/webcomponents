import { fixture, expect, html } from '@open-wc/testing'
import { BeakerBroker } from '../beaker-broker.js'

// Beaker's DatArchive API is stubbed with a fake class so no real beaker
// environment (or network) is ever touched; the broker logic under test is
// the archive wiring, event dispatch, and file read/write delegation.

class FakeDatArchive {
  constructor(url) {
    this.url = url
    this.written = []
    this.readCalls = []
    this.files = {}
  }
  async writeFile(path, data) {
    this.written.push({ path: path, data: data })
  }
  async readFile(path, type) {
    this.readCalls.push({ path: path, type: type })
    if (this.files[path] !== undefined) {
      return this.files[path]
    }
    return 'fake-content'
  }
}

async function makeBrokerWithArchive(url) {
  globalThis.DatArchive = FakeDatArchive
  const el = await fixture(html`<beaker-broker></beaker-broker>`)
  await el.updateComplete
  el.datUrl = url
  await el.updateComplete
  return el
}

describe('beaker-broker', () => {
  const originalCreateObjectURL = globalThis.URL.createObjectURL
  let capturedBlobs = []

  beforeEach(() => {
    capturedBlobs = []
    globalThis.URL.createObjectURL = (blob) => {
      capturedBlobs.push(blob)
      return originalCreateObjectURL.call(globalThis.URL, blob)
    }
  })

  afterEach(() => {
    globalThis.URL.createObjectURL = originalCreateObjectURL
    delete globalThis.DatArchive
  })

  it('registers the beaker-broker custom element', () => {
    expect(customElements.get('beaker-broker')).to.exist
    expect(BeakerBroker.tag).to.equal('beaker-broker')
  })

  it('returns an empty haxProperties object', () => {
    expect(Object.keys(BeakerBroker.haxProperties).length).to.equal(0)
  })

  it('declares archive (Object) and dat-url (String) properties', () => {
    const props = BeakerBroker.properties
    expect(props.archive).to.exist
    expect(props.archive.type).to.equal(Object)
    expect(props.datUrl).to.exist
    expect(props.datUrl.type).to.equal(String)
    expect(props.datUrl.attribute).to.equal('dat-url')
  })

  it('defaults datUrl to the current location host', async () => {
    const el = await fixture(html`<beaker-broker></beaker-broker>`)
    expect(el.datUrl).to.equal(globalThis.location.host)
  })

  it('renders a slot and applies host styles via constructable stylesheets', async () => {
    const el = await fixture(html`<beaker-broker></beaker-broker>`)
    await el.updateComplete
    expect(el.shadowRoot.querySelector('slot')).to.exist
    // FIXED (issue #3102 DDD note): the inline <style> moved out of the
    // template into static constructable styles
    expect(el.shadowRoot.querySelector('style')).to.equal(null)
    expect(el.shadowRoot.adoptedStyleSheets.length).to.be.greaterThan(0)
    const cssText = el.constructor.styles[0].cssText
    expect(cssText).to.include(':host')
    expect(cssText).to.include('display: block')
  })

  it('warns in firstUpdated when DatArchive is unavailable', async () => {
    const warnings = []
    const originalWarn = console.warn
    console.warn = (...args) => {
      warnings.push(args.join(' '))
    }
    try {
      const el = await fixture(html`<beaker-broker></beaker-broker>`)
      await el.updateComplete
      expect(warnings.length).to.be.greaterThan(0)
      expect(warnings[0]).to.include('Beaker is not available')
    } finally {
      console.warn = originalWarn
    }
  })

  it('does not warn when DatArchive is available', async () => {
    globalThis.DatArchive = FakeDatArchive
    const warnings = []
    const originalWarn = console.warn
    console.warn = (...args) => {
      warnings.push(args.join(' '))
    }
    try {
      const el = await fixture(html`<beaker-broker></beaker-broker>`)
      await el.updateComplete
      const beakerWarnings = warnings.filter((w) =>
        w.includes('Beaker is not available'),
      )
      expect(
        beakerWarnings.length,
        `unexpected Beaker warnings: ${beakerWarnings.join(' | ')}`,
      ).to.equal(0)
    } finally {
      console.warn = originalWarn
    }
  })

  // FIXED (issue #3102 bug 39): the archive is now built in willUpdate,
  // which is synchronous before render, so the reactive assignment batches
  // into the SAME update pass as the datUrl change. The former redundant
  // second update (and its Lit change-in-update warning) is gone.
  it('builds the archive within a single update pass when datUrl changes', async () => {
    globalThis.DatArchive = FakeDatArchive
    const el = await fixture(html`<beaker-broker></beaker-broker>`)
    await el.updateComplete
    const updateKeys = []
    const originalUpdated = el.updated
    el.updated = (changed) => {
      updateKeys.push([...changed.keys()])
      return originalUpdated.call(el, changed)
    }
    el.datUrl = 'dat://double-update'
    await el.updateComplete
    await el.updateComplete
    // one pass only, carrying BOTH the datUrl change and the archive that
    // willUpdate assigned during that same cycle
    expect(updateKeys.length).to.equal(1)
    expect(updateKeys[0]).to.include('datUrl')
    expect(updateKeys[0]).to.include('archive')
    expect(el.archive.url).to.equal('dat://double-update')
  })

  it('builds a DatArchive instance when datUrl changes and DatArchive exists', async () => {
    const el = await makeBrokerWithArchive('dat://abc123')
    expect(el.archive).to.be.instanceOf(FakeDatArchive)
    expect(el.archive.url).to.equal('dat://abc123')
  })

  it('dispatches dat-url-changed with the new value', async () => {
    globalThis.DatArchive = FakeDatArchive
    const el = await fixture(html`<beaker-broker></beaker-broker>`)
    await el.updateComplete
    let evt = null
    el.addEventListener('dat-url-changed', (e) => {
      evt = e
    })
    el.datUrl = 'dat://evented'
    await el.updateComplete
    expect(evt).to.exist
    expect(evt.detail.value).to.equal('dat://evented')
  })

  it('dispatches archive-changed when the archive is replaced', async () => {
    const el = await makeBrokerWithArchive('dat://first')
    let evt = null
    el.addEventListener('archive-changed', (e) => {
      evt = e
    })
    const replacement = new FakeDatArchive('dat://second')
    el.archive = replacement
    await el.updateComplete
    expect(evt).to.exist
    expect(evt.detail.value).to.equal(replacement)
  })

  it('skips archive creation when DatArchive is missing', async () => {
    const el = await fixture(html`<beaker-broker></beaker-broker>`)
    await el.updateComplete
    el.datUrl = 'dat://nowhere'
    await el.updateComplete
    expect(el.archive).to.not.exist
  })

  it('write delegates to archive.writeFile with path and data', async () => {
    const el = await makeBrokerWithArchive('dat://write-site')
    await el.write('hello.txt', 'things and stuff')
    expect(el.archive.written.length).to.equal(1)
    expect(el.archive.written[0].path).to.equal('hello.txt')
    expect(el.archive.written[0].data).to.equal('things and stuff')
  })

  describe('read', () => {
    it('returns raw content for utf8 by default', async () => {
      const el = await makeBrokerWithArchive('dat://read-site')
      el.archive.files['index.html'] = '<html>hi</html>'
      const response = await el.read('index.html')
      expect(response).to.equal('<html>hi</html>')
      expect(el.archive.readCalls[0].type).to.equal(undefined)
    })

    it('maps jpg to a binary read wrapped in a jpeg blob URL', async () => {
      const el = await makeBrokerWithArchive('dat://read-site')
      el.archive.files['pic.jpg'] = [1, 2, 3]
      const response = await el.read('pic.jpg', 'jpg')
      expect(el.archive.readCalls[0].type).to.equal('binary')
      expect(capturedBlobs.length).to.equal(1)
      expect(capturedBlobs[0].type).to.equal('image/jpeg')
      expect(response).to.include('blob:')
    })

    it('maps jpeg the same as jpg', async () => {
      const el = await makeBrokerWithArchive('dat://read-site')
      el.archive.files['pic.jpeg'] = [4, 5, 6]
      const response = await el.read('pic.jpeg', 'jpeg')
      expect(el.archive.readCalls[0].type).to.equal('binary')
      expect(capturedBlobs.length).to.equal(1)
      expect(capturedBlobs[0].type).to.equal('image/jpeg')
      expect(response).to.include('blob:')
    })

    it('maps png to a binary read wrapped in a png blob URL', async () => {
      const el = await makeBrokerWithArchive('dat://read-site')
      el.archive.files['pic.png'] = [7, 8, 9]
      const response = await el.read('pic.png', 'png')
      expect(el.archive.readCalls[0].type).to.equal('binary')
      expect(capturedBlobs.length).to.equal(1)
      expect(capturedBlobs[0].type).to.equal('image/png')
      expect(response).to.include('blob:')
    })

    it('wraps base64 reads in a data URI', async () => {
      const el = await makeBrokerWithArchive('dat://read-site')
      el.archive.files['pic.b64'] = 'aGVsbG8='
      const response = await el.read('pic.b64', 'base64')
      expect(el.archive.readCalls[0].type).to.equal('base64')
      expect(response).to.equal('data:image/png;base64,aGVsbG8=')
    })
  })
})
