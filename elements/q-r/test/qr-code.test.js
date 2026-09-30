import { fixture, expect, html } from '@open-wc/testing'

import '../lib/qr-code.js'
import { QRCodeElement } from '../lib/qr-code.js'

const bridge = () => globalThis.ESGlobalBridge.requestAvailability()

const waitForQrLibrary = async () => {
  for (let i = 0; i < 200; i++) {
    if (bridge().imports['qr'] === true) {
      // the loaded event fires 100ms after the script loads
      await new Promise((resolve) => setTimeout(resolve, 150))
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 25))
  }
  throw new Error('qr library never loaded through es-global-bridge')
}

const settled = () => new Promise((resolve) => setTimeout(resolve, 25))

describe('qr-code element', () => {
  it('registers the custom element', () => {
    expect(globalThis.customElements.get('qr-code')).to.exist
  })

  it('has the expected static tag, defaults, and observed attributes', () => {
    expect(QRCodeElement.tag).to.equal('qr-code')
    expect(QRCodeElement.defaultAttributes).to.deep.equal({
      data: null,
      format: 'png',
      modulesize: 5,
      margin: 4,
    })
    expect(QRCodeElement.observedAttributes).to.deep.equal([
      'data',
      'format',
      'modulesize',
      'margin',
    ])
  })

  it('defines attribute getters and setters with defaults', async () => {
    const el = await fixture(html`<qr-code></qr-code>`)
    expect(el.data).to.equal(null)
    expect(el.format).to.equal('png')
    expect(el.modulesize).to.equal(5)
    expect(el.margin).to.equal(4)
    el.data = 'https://haxtheweb.org'
    expect(el.getAttribute('data')).to.equal('https://haxtheweb.org')
    el.format = 'svg'
    expect(el.getAttribute('format')).to.equal('svg')
    el.modulesize = 9
    expect(el.getAttribute('modulesize')).to.equal('9')
    el.margin = 1
    expect(el.getAttribute('margin')).to.equal('1')
  })

  it('generates once the bridge library has loaded', async () => {
    const el = await fixture(
      html`<qr-code data="01234567" format="html"></qr-code>`,
    )
    await waitForQrLibrary()
    let table = el.shadowRoot.querySelector('table')
    for (let i = 0; i < 40 && table === null; i++) {
      await settled()
      table = el.shadowRoot.querySelector('table')
    }
    expect(table).to.exist
  })

  it('converts numeric string options through getOptions', async () => {
    const el = await fixture(
      html`<qr-code modulesize="8" margin="1"></qr-code>`,
    )
    await waitForQrLibrary()
    const options = el.getOptions()
    expect(options.modulesize).to.equal(8)
    expect(options.margin).to.equal(1)
  })

  it('reports no data when the data attribute is missing', async () => {
    const el = await fixture(html`<qr-code></qr-code>`)
    await waitForQrLibrary()
    el.generate()
    expect(el.shadowRoot.textContent).to.include('no data!')
  })

  it('generates a PNG image for the png format', async () => {
    const el = await fixture(
      html`<qr-code data="https://haxtheweb.org"></qr-code>`,
    )
    await waitForQrLibrary()
    el.generate()
    const img = el.shadowRoot.querySelector('img')
    expect(img).to.exist
    expect(img.getAttribute('src').startsWith('data:image/png')).to.be.true
  })

  it('generates an HTML table for the html format', async () => {
    const el = await fixture(
      html`<qr-code data="HELLO WORLD 123" format="html"></qr-code>`,
    )
    await waitForQrLibrary()
    el.generate()
    const div = el.shadowRoot.querySelector('div.qrcode')
    expect(div).to.exist
    expect(div.querySelector('table')).to.exist
  })

  it('generates an SVG for the svg format', async () => {
    const el = await fixture(
      html`<qr-code data="01234567" format="svg"></qr-code>`,
    )
    await waitForQrLibrary()
    el.generate()
    const svg = el.shadowRoot.querySelector('svg')
    expect(svg).to.exist
    expect(svg.getAttribute('viewBox')).to.exist
  })

  it('reports unsupported formats', async () => {
    const el = await fixture(
      html`<qr-code data="01234567" format="bmp"></qr-code>`,
    )
    await waitForQrLibrary()
    el.generate()
    expect(el.shadowRoot.textContent).to.include('not supported!')
  })

  it('regenerates when attributes change after the library loads', async () => {
    const el = await fixture(html`<qr-code format="html"></qr-code>`)
    await waitForQrLibrary()
    el.setAttribute('data', '01234567')
    await settled()
    expect(el.shadowRoot.querySelector('table')).to.exist
    el.setAttribute('format', 'svg')
    await settled()
    expect(el.shadowRoot.querySelector('svg')).to.exist
    expect(el.shadowRoot.querySelector('table')).to.not.exist
  })

  it('supports the attribute changed method hook', async () => {
    const el = await fixture(html`<qr-code format="png"></qr-code>`)
    await waitForQrLibrary()
    let calls = []
    el.formatChanged = function (oldValue, newValue) {
      calls.push(oldValue + ':' + newValue)
    }
    el.setAttribute('format', 'svg')
    await settled()
    expect(calls.length).to.equal(1)
    expect(calls[0]).to.equal('png:svg')
  })

  it('clears prior output before appending new content', async () => {
    const el = await fixture(
      html`<qr-code data="01234567" format="html"></qr-code>`,
    )
    await waitForQrLibrary()
    el.generate()
    el.setAttribute('data', '76543210')
    await settled()
    const tables = el.shadowRoot.querySelectorAll('table')
    expect(tables.length).to.equal(1)
  })

  it('aborts its listeners when disconnected', async () => {
    const el = await fixture(html`<qr-code data="0123"></qr-code>`)
    await waitForQrLibrary()
    expect(el.windowControllers.signal.aborted).to.be.false
    el.remove()
    expect(el.windowControllers.signal.aborted).to.be.true
  })

  it('falls back to a message when PNG generation throws', async () => {
    const el = await fixture(html`<qr-code data="01234567"></qr-code>`)
    await waitForQrLibrary()
    const original = globalThis.QRCode.generatePNG
    globalThis.QRCode.generatePNG = () => {
      throw new Error('no canvas support')
    }
    el.generate()
    globalThis.QRCode.generatePNG = original
    expect(el.shadowRoot.textContent).to.include('no canvas support!')
  })
})
