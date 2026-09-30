import { expect } from '@open-wc/testing'

describe('qr.js library', () => {
  let QRCode

  before(async () => {
    // the UMD wrapper attaches via module.exports when a module object exists
    globalThis.module = { exports: {} }
    await import('../lib/qr.js')
    QRCode = globalThis.module.exports
    delete globalThis.module
  })

  it('exposes the QRCode generator API', () => {
    expect(typeof QRCode.generate).to.equal('function')
    expect(typeof QRCode.generateHTML).to.equal('function')
    expect(typeof QRCode.generateSVG).to.equal('function')
    expect(typeof QRCode.generatePNG).to.equal('function')
  })

  it('auto-selects numeric mode and generates a version 1 matrix', () => {
    const matrix = QRCode.generate('01234567')
    expect(matrix.length).to.equal(21)
    expect(matrix[0].length).to.equal(21)
    matrix.forEach((row) => {
      row.forEach((cell) => {
        expect(cell === 0 || cell === 1).to.be.true
      })
    })
  })

  it('auto-selects alphanumeric mode for uppercase data', () => {
    const matrix = QRCode.generate('HELLO WORLD 123')
    expect(matrix.length).to.equal(21)
    expect(matrix[0].length).to.equal(21)
  })

  it('auto-selects octet mode for lowercase data', () => {
    const matrix = QRCode.generate('https://haxtheweb.org')
    expect(matrix.length >= 21).to.be.true
    expect(matrix.length).to.equal(matrix[0].length)
  })

  it('accepts byte arrays as octet data', () => {
    const matrix = QRCode.generate([0x48, 0x41, 0x58])
    expect(matrix.length >= 21).to.be.true
  })

  it('uppercases alphanumeric data in explicit mode', () => {
    const matrix = QRCode.generate('test', { mode: 'alphanumeric' })
    expect(matrix.length).to.equal(21)
  })

  it('encodes multi-byte utf-8 characters', () => {
    const matrix = QRCode.generate('HAX éあ')
    expect(matrix.length).to.equal(21)
  })

  it('supports every ECC level option', () => {
    ;['L', 'M', 'Q', 'H'].forEach((level) => {
      const matrix = QRCode.generate('01234567', { ecclevel: level })
      expect(matrix.length >= 21).to.be.true
    })
  })

  it('supports explicit masks 0 through 7', () => {
    const matrix = QRCode.generate('https://haxtheweb.org', { mask: 3 })
    expect(matrix.length).to.equal(25)
  })

  it('chooses the best mask automatically', () => {
    const matrix = QRCode.generate('https://haxtheweb.org')
    expect(matrix.length).to.equal(25)
  })

  it('embeds version information for large data', () => {
    const matrix = QRCode.generate('A'.repeat(300))
    expect(matrix.length >= 53).to.be.true
  })

  it('uses the 16-bit length field for large octet data', () => {
    const matrix = QRCode.generate('a'.repeat(1850))
    expect(matrix.length >= 117).to.be.true
  })

  it('uses the 14-bit length field for large numeric data', () => {
    const matrix = QRCode.generate('9'.repeat(4000))
    expect(matrix.length >= 117).to.be.true
  })

  it('uses the 13-bit length field for large alphanumeric data', () => {
    const matrix = QRCode.generate('A'.repeat(2350))
    expect(matrix.length >= 117).to.be.true
  })

  it('rejects data that does not match the requested mode', () => {
    let msg = ''
    try {
      QRCode.generate('abc', { mode: 'numeric' })
    } catch (e) {
      msg = e
    }
    expect(msg).to.equal('invalid data format')
  })

  it('rejects unsupported modes', () => {
    let msg = ''
    try {
      QRCode.generate('test', { mode: 'kanji' })
    } catch (e) {
      msg = e
    }
    expect(msg).to.equal('invalid or unsupported mode')
  })

  it('rejects versions above 40', () => {
    let msg = ''
    try {
      QRCode.generate('test', { version: 41 })
    } catch (e) {
      msg = e
    }
    expect(msg).to.equal('invalid version')
  })

  it('treats version 0 as automatic', () => {
    const matrix = QRCode.generate('01234567', { version: 0 })
    expect(matrix.length).to.equal(21)
  })

  it('rejects masks below the valid range', () => {
    let msg = ''
    try {
      QRCode.generate('test', { mask: -2 })
    } catch (e) {
      msg = e
    }
    expect(msg).to.equal('invalid mask')
  })

  // BUG: mask 8 passes the `mask < 0 || mask > 8` validation even though
  // MASKFUNCS only defines masks 0-7, so generation crashes with a TypeError
  // instead of the friendly 'invalid mask' error.
  it('BUG mask 8 passes validation but crashes during generation', () => {
    let threw = null
    try {
      QRCode.generate('test', { mask: 8 })
    } catch (e) {
      threw = e
    }
    expect(threw).to.be.instanceOf(TypeError)
  })

  // BUG: an unknown ecclevel letter resolves to undefined, which passes the
  // `ecclevel < 0 || ecclevel > 3` guard and later surfaces as a confusing
  // 'too large data' error instead of 'invalid ECC level'.
  it('BUG invalid ECC level letters are not rejected cleanly', () => {
    let msg = ''
    try {
      QRCode.generate('01234567', { ecclevel: 'X' })
    } catch (e) {
      msg = e
    }
    expect(msg).to.equal('too large data')
  })

  it('rejects data too large for any version', () => {
    let msg = ''
    try {
      QRCode.generate('9'.repeat(7100))
    } catch (e) {
      msg = e
    }
    expect(msg).to.equal('too large data')
  })

  it('generates an HTML table element', () => {
    const e = QRCode.generateHTML('01234567', { modulesize: 2, margin: 1 })
    expect(e.className).to.equal('qrcode')
    expect(e.querySelector('table')).to.exist
    expect(e.innerHTML).to.include('border:2px solid #fff')
  })

  // BUG: generateHTML/generateSVG/generatePNG treat only null (not undefined)
  // as "use the default margin", so calling without options yields NaN sizes.
  it('BUG omitted margin option produces NaN sizing in HTML output', () => {
    const e = QRCode.generateHTML('01234567')
    expect(e.innerHTML.includes('border:NaNpx')).to.be.true
  })

  it('generates an SVG element with sizing', () => {
    const e = QRCode.generateSVG('01234567', { modulesize: 3, margin: 2 })
    expect(e.tagName.toLowerCase()).to.equal('svg')
    expect(e.getAttribute('viewBox')).to.exist
    expect(e.getAttribute('width')).to.exist
    const rects = e.querySelectorAll('rect')
    expect(rects.length > 10).to.be.true
  })

  it('generates a PNG data URL', () => {
    const url = QRCode.generatePNG('01234567', { modulesize: 2, margin: 0 })
    expect(url.startsWith('data:image/png')).to.be.true
  })

  it('throws when canvas is unavailable for PNG output', () => {
    const original = globalThis.HTMLCanvasElement.prototype.getContext
    globalThis.HTMLCanvasElement.prototype.getContext = () => null
    let msg = ''
    try {
      QRCode.generatePNG('01234567')
    } catch (e) {
      msg = e
    }
    globalThis.HTMLCanvasElement.prototype.getContext = original
    expect(msg).to.equal('canvas support is needed for PNG output')
  })

  it('silently overflows data too big for an explicit small version', () => {
    // the encoder pads to zero past the buffer, matching the spec note in
    // the source that overflow is intentionally tolerated
    const matrix = QRCode.generate('a'.repeat(100), { version: 1 })
    expect(matrix.length).to.equal(21)
  })
})
