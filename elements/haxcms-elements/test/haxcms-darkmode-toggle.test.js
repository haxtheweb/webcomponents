// Tests for haxcms-darkmode-toggle — the HAXcms dark mode switch.
// Direct import so istanbul instruments haxcms-darkmode-toggle.js.
import { fixture, expect, html } from '@open-wc/testing'
import '../lib/core/haxcms-darkmode-toggle.js'
import { store } from '../lib/core/haxcms-site-store.js'

describe('haxcms-darkmode-toggle', () => {
  let element
  let saved = {}

  beforeEach(async () => {
    saved = {
      darkMode: store.darkMode,
      soundStatus: store.soundStatus,
      appReady: store.appReady,
    }
    store.darkMode = false
    store.appReady = true
    store.soundStatus = false
    element = await fixture(html`<haxcms-darkmode-toggle></haxcms-darkmode-toggle>`)
  })

  afterEach(() => {
    store.darkMode = saved.darkMode
    store.soundStatus = saved.soundStatus
    store.appReady = saved.appReady
  })

  it('instantiates with the correct tag', () => {
    expect(element).to.exist
    expect(element.tagName.toLowerCase()).to.equal('haxcms-darkmode-toggle')
  })

  it('has the expected static tag property', () => {
    const ctor = customElements.get('haxcms-darkmode-toggle')
    expect(ctor.tag).to.equal('haxcms-darkmode-toggle')
  })

  it('reflects store.darkMode onto checked after autorun settles', async () => {
    store.darkMode = true
    await new Promise((r) => setTimeout(r, 0))
    expect(element.checked).to.equal(true)

    store.darkMode = false
    await new Promise((r) => setTimeout(r, 0))
    expect(element.checked).to.equal(false)
  })

  describe('toggle', () => {
    it('flips checked to the opposite value', () => {
      element.checked = false
      element.toggle()
      expect(element.checked).to.equal(true)

      element.toggle()
      expect(element.checked).to.equal(false)
    })
  })

  describe('updated', () => {
    it('sets store.darkMode when checked changes (via rAF)', async () => {
      element.checked = false
      // trigger updated by setting checked to true (oldValue is false, not undefined)
      element.checked = true
      // wait for the requestAnimationFrame callback
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))
      await new Promise((r) => setTimeout(r, 0))
      expect(store.darkMode).to.equal(true)
    })

    it('does not react when checked is set for the first time (oldValue undefined)', async () => {
      store.darkMode = false
      // Create a fresh element so oldValue is undefined
      const fresh = document.createElement('haxcms-darkmode-toggle')
      document.body.appendChild(fresh)
      try {
        await new Promise((r) => setTimeout(r, 0))
        // checked was set in constructor via autorun; setting it again
        // should have oldValue !== undefined by now
        fresh.checked = true
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))
        await new Promise((r) => setTimeout(r, 0))
        // store.darkMode should reflect the new checked value
        expect(store.darkMode).to.equal(true)
      } finally {
        fresh.remove()
      }
    })
  })
})
