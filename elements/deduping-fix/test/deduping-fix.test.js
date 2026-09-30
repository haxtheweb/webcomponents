import { expect } from '@open-wc/testing'
import '../deduping-fix.js'

// importing the module replaces globalThis.customElements.define with a
// de-duplicating wrapper; capture the patched reference once at import time
const patchedDefine = globalThis.customElements.define

describe('deduping-fix', () => {
  it('replaces globalThis.customElements.define with a wrapper', () => {
    expect(patchedDefine).to.be.a('function')
    // the wrapper is an arrow function assigned in the module, not the
    // platform-provided native implementation
    expect(String(patchedDefine)).to.not.include('[native code]')
  })

  it('defines a new element the first time it is registered', () => {
    class FirstElement extends globalThis.HTMLElement {}
    globalThis.customElements.define('dedup-first-el', FirstElement)
    expect(globalThis.customElements.get('dedup-first-el')).to.equal(
      FirstElement,
    )
  })

  it('warns and does not re-register when the same tag is defined twice', () => {
    const warnings = []
    const originalWarn = console.warn
    console.warn = (msg) => warnings.push(String(msg))
    try {
      class DupeElementA extends globalThis.HTMLElement {}
      class DupeElementB extends globalThis.HTMLElement {}
      globalThis.customElements.define('dedup-dupe-el', DupeElementA)
      globalThis.customElements.define('dedup-dupe-el', DupeElementB)
      // first registration must win; the duplicate attempt is dropped
      expect(globalThis.customElements.get('dedup-dupe-el')).to.equal(
        DupeElementA,
      )
      expect(globalThis.customElements.get('dedup-dupe-el')).to.not.equal(
        DupeElementB,
      )
      expect(warnings.length).to.equal(1)
      expect(warnings[0]).to.equal('dedup-dupe-el has been defined twice')
    } finally {
      console.warn = originalWarn
    }
  })

  it('still lets other tags register after a duplicate was blocked', () => {
    class LaterElement extends globalThis.HTMLElement {}
    globalThis.customElements.define('dedup-later-el', LaterElement)
    expect(globalThis.customElements.get('dedup-later-el')).to.equal(
      LaterElement,
    )
  })
})
