import { fixture, expect, html } from '@open-wc/testing'
import { AirHorn } from '../air-horn.js'

describe('air-horn', () => {
  afterEach(() => {
    if ('ShadyCSS' in globalThis) {
      delete globalThis.ShadyCSS
    }
  })
  it('registers as a custom element with the expected tag', async () => {
    const el = await fixture(html`<air-horn></air-horn>`)
    expect(el.tagName).to.equal('AIR-HORN')
    expect(el.tag).to.equal('air-horn')
    expect(AirHorn.tag).to.equal('air-horn')
    expect(el.constructor).to.equal(AirHorn)
  })
  it('renders a style block and slot in shadow DOM', async () => {
    const el = await fixture(html`<air-horn>honk</air-horn>`)
    const style = el.shadowRoot.querySelector('style')
    const slot = el.shadowRoot.querySelector('slot')
    expect(style).to.exist
    expect(slot).to.exist
    expect(style.textContent).to.include('display: inline-flex')
    expect(el.textContent).to.equal('honk')
  })
  it('supports delayed render via constructor flag', () => {
    const el = new AirHorn(true)
    expect(el.shadowRoot.querySelectorAll('*').length).to.equal(0)
    el.render()
    expect(el.shadowRoot.querySelector('slot')).to.exist
    expect(el.shadowRoot.querySelector('style')).to.exist
    expect(el.template).to.exist
  })
  it('re-renders without duplicating slot or style', async () => {
    const el = await fixture(html`<air-horn></air-horn>`)
    el.render()
    el.render()
    expect(el.shadowRoot.querySelectorAll('slot').length).to.equal(1)
    expect(el.shadowRoot.querySelectorAll('style').length).to.equal(1)
    expect(el.shadowRoot.textContent).to.not.include('null')
  })
  it('calls ShadyCSS prepareTemplate when present', async () => {
    let prepareTemplateCalls = 0
    globalThis.ShadyCSS = {
      prepareTemplate: () => {
        prepareTemplateCalls++
      },
    }
    const el = await fixture(html`<air-horn></air-horn>`)
    expect(prepareTemplateCalls).to.be.greaterThan(0)
    expect(el.shadowRoot.querySelector('slot')).to.exist
  })
  it('plays the air horn sound on click without real audio', async () => {
    const played = []
    const origAudio = globalThis.Audio
    class FakeAudio {
      constructor(url) {
        this.url = url
        this.playCalled = false
        played.push(this)
      }
      play() {
        this.playCalled = true
        return Promise.resolve()
      }
    }
    globalThis.Audio = FakeAudio
    try {
      const el = await fixture(html`<air-horn>honk</air-horn>`)
      // click listener is now attached synchronously in connectedCallback
      // via a cached bound handler (was a fresh .bind inside a setTimeout)
      el.click()
      expect(played.length).to.equal(1)
      expect(played[0].url).to.include('airhorn.mp3')
      expect(played[0].playCalled).to.be.true
    } finally {
      globalThis.Audio = origAudio
    }
  })
  it('exposes button semantics and keyboard activation', async () => {
    // a11y follow-up (haxtheweb/issues#3102): the clickable host had no
    // keyboard activation and no role/tabindex/aria-label
    const played = []
    const origAudio = globalThis.Audio
    class FakeAudio {
      constructor(url) {
        this.url = url
        this.playCalled = false
        played.push(this)
      }
      play() {
        this.playCalled = true
        return Promise.resolve()
      }
    }
    globalThis.Audio = FakeAudio
    try {
      const el = await fixture(html`<air-horn>honk</air-horn>`)
      expect(el.getAttribute('role')).to.equal('button')
      expect(el.getAttribute('tabindex')).to.equal('0')
      expect(el.getAttribute('aria-label')).to.equal('Play air horn')
      el.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }),
      )
      expect(played.length).to.equal(1)
      expect(played[0].playCalled).to.be.true
      el.dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true, composed: true }),
      )
      expect(played.length).to.equal(2)
      // other keys do not activate
      el.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'a', bubbles: true, composed: true }),
      )
      expect(played.length).to.equal(2)
    } finally {
      globalThis.Audio = origAudio
    }
  })
  it('removes its listeners on disconnect', async () => {
    // follow-up (haxtheweb/issues#3102): no disconnectedCallback existed,
    // so listeners outlived removal from the DOM
    const played = []
    const origAudio = globalThis.Audio
    class FakeAudio {
      constructor(url) {
        this.url = url
        this.playCalled = false
        played.push(this)
      }
      play() {
        this.playCalled = true
        return Promise.resolve()
      }
    }
    globalThis.Audio = FakeAudio
    try {
      const el = await fixture(html`<air-horn>honk</air-horn>`)
      el.click()
      expect(played.length).to.equal(1)
      el.remove()
      el.click()
      el.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }),
      )
      expect(played.length).to.equal(1)
    } finally {
      globalThis.Audio = origAudio
    }
  })
  it('meets a11y standards', async () => {
    const el = await fixture(html`<air-horn>toot</air-horn>`)
    await expect(el).to.be.accessible()
  })
})
