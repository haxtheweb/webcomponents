// Tests for haxcms-toast — the HAXcms toast notification element.
// Direct import so istanbul instruments haxcms-toast.js.
import { fixture, expect, html } from '@open-wc/testing'
import '../lib/core/haxcms-toast.js'
import { store } from '../lib/core/haxcms-site-store.js'

describe('haxcms-toast', () => {
  let element
  let saved = {}

  beforeEach(async () => {
    saved = {
      darkMode: store.darkMode,
      userData: store.userData,
    }
    store.darkMode = false
    store.userData = { userName: 'testuser' }
    element = await fixture(html`<haxcms-toast></haxcms-toast>`)
  })

  afterEach(() => {
    store.darkMode = saved.darkMode
    store.userData = saved.userData
  })

  it('instantiates with the correct tag', () => {
    expect(element).to.exist
    expect(element.tagName.toLowerCase()).to.equal('haxcms-toast')
  })

  it('has the expected static tag property', () => {
    const ctor = customElements.get('haxcms-toast')
    expect(ctor.tag).to.equal('haxcms-toast')
  })

  it('has static styles that return an array', () => {
    const ctor = customElements.get('haxcms-toast')
    const styles = ctor.styles
    expect(Array.isArray(styles)).to.equal(true)
    expect(styles.length).to.be.greaterThan(0)
  })

  it('sets characterHeight and characterWidth in constructor', () => {
    expect(element.characterHeight).to.equal(48)
    expect(element.characterWidth).to.equal(48)
  })

  it('reflects store.userData.userName onto element after autorun settles', async () => {
    store.userData = { userName: 'newuser' }
    await new Promise((r) => setTimeout(r, 0))
    expect(element.userName).to.equal('newuser')
  })

  it('reflects store.darkMode onto element after autorun settles', async () => {
    store.darkMode = true
    await new Promise((r) => setTimeout(r, 0))
    expect(element.darkMode).to.equal(true)
  })

  describe('connectedCallback', () => {
    it('responds to haxcms-toast-hide event by hiding toast', () => {
      // The event listener is bound with .bind(this) in connectedCallback,
      // so we test behavior (awaitingMerlinInput cleared + hide called)
      // rather than method override.
      element.alwaysvisible = false
      element.awaitingMerlinInput = true
      globalThis.dispatchEvent(new CustomEvent('haxcms-toast-hide'))
      expect(element.awaitingMerlinInput).to.equal(false)
    })
  })

  describe('hideSimpleToast', () => {
    it('hides the toast when alwaysvisible is false', () => {
      element.alwaysvisible = false
      element.awaitingMerlinInput = true
      element.hideSimpleToast({})
      expect(element.awaitingMerlinInput).to.equal(false)
    })

    it('does not hide when alwaysvisible is true', () => {
      element.alwaysvisible = true
      element.awaitingMerlinInput = true
      element.hideSimpleToast({})
      expect(element.awaitingMerlinInput).to.equal(true)
    })
  })

  describe('disconnectedCallback', () => {
    it('aborts windowControllers without throwing', () => {
      expect(() => element.disconnectedCallback()).to.not.throw()
    })
  })

  describe('HAXCMSToast.requestAvailability', () => {
    it('returns the singleton instance', () => {
      const instance = globalThis.HAXCMSToast.requestAvailability()
      expect(instance).to.exist
      expect(instance.tagName.toLowerCase()).to.equal('haxcms-toast')
      // calling again should return the same instance
      const instance2 = globalThis.HAXCMSToast.requestAvailability()
      expect(instance2).to.equal(instance)
    })
  })
})
