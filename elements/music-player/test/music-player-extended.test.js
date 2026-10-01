import { fixture, expect, html } from '@open-wc/testing'
import { MusicPlayer } from '../music-player.js'

// Every fixture here intentionally omits source: with no src the vendored
// midi-player/midi-visualizer (imported at music-player.js:107-114) never
// fetches a midi url or a sound font, so no network is touched and playback
// is never driven.
// Load the vendored html-midi-player bundle once up front: firstUpdated
// always schedules the deferred import (music-player.js:107-114), and the
// auto-cleanup between tests can remove a fixture before the module defines
// midi-player/midi-visualizer, which would make the wiring callback throw on
// an unupgraded element. Warming up first guarantees every later fixture
// renders already-upgraded vendored elements.
before(async () => {
  const warmup = await fixture(html`<music-player></music-player>`)
  for (
    let i = 0;
    i < 80 && !globalThis.customElements.get('midi-player');
    i++
  ) {
    await new Promise((resolve) => setTimeout(resolve, 25))
  }
  expect(globalThis.customElements.get('midi-player')).to.exist
  expect(globalThis.customElements.get('midi-visualizer')).to.exist
  warmup.remove()
})

describe('music-player behavioral coverage', () => {
  it('exposes the expected tag and property declarations', () => {
    expect(MusicPlayer.tag).to.equal('music-player')
    const properties = MusicPlayer.properties
    expect(Object.keys(properties)).to.deep.equal([
      'source',
      'visualizer',
      'noWaterfall',
      'noVisual',
    ])
    expect(properties.source.type).to.equal(String)
    expect(properties.visualizer.type).to.equal(String)
    expect(properties.noWaterfall.attribute).to.equal('no-waterfall')
    expect(properties.noWaterfall.reflect).to.be.true
    expect(properties.noWaterfall.type).to.equal(Boolean)
    expect(properties.noVisual.attribute).to.equal('no-visual')
    expect(properties.noVisual.reflect).to.be.true
    expect(properties.noVisual.type).to.equal(Boolean)
  })

  it('references an external haxProperties file for the tag', () => {
    const url = MusicPlayer.haxProperties
    expect(url.endsWith('/lib/music-player.haxProperties.json')).to.be.true
    expect(url.includes('music-player')).to.be.true
  })

  it('starts with default property values', async () => {
    const el = await fixture(html`<music-player></music-player>`)
    expect(el.noWaterfall).to.be.false
    expect(el.noVisual).to.be.false
    expect(el.visualizer).to.equal('staff')
    expect(el.source).to.be.undefined
  })

  it('reflects no-visual and no-waterfall attributes', async () => {
    const el = await fixture(html`<music-player></music-player>`)
    el.noVisual = true
    await el.updateComplete
    expect(el.hasAttribute('no-visual')).to.be.true
    el.noWaterfall = true
    await el.updateComplete
    expect(el.hasAttribute('no-waterfall')).to.be.true
    el.noVisual = false
    el.noWaterfall = false
    await el.updateComplete
    expect(el.hasAttribute('no-visual')).to.be.false
    expect(el.hasAttribute('no-waterfall')).to.be.false
  })

  it('renders the vendored visualizer and player elements', async () => {
    const el = await fixture(
      html`<music-player visualizer="piano-roll"></music-player>`,
    )
    await el.updateComplete
    const visualizer = el.shadowRoot.querySelector('midi-visualizer')
    const player = el.shadowRoot.querySelector('midi-player')
    expect(visualizer).to.exist
    expect(player).to.exist
    expect(visualizer.getAttribute('type')).to.equal('piano-roll')
    expect(player.hasAttribute('sound-font')).to.be.true
  })

  it('styles the host as a block', async () => {
    const el = await fixture(html`<music-player></music-player>`)
    expect(globalThis.getComputedStyle(el).display).to.equal('block')
  })

  const waitForWiring = async (el) => {
    const player = el.shadowRoot.querySelector('midi-player')
    for (let i = 0; i < 60; i++) {
      if (
        player &&
        player.visualizerListeners &&
        player.visualizerListeners.has(el.visualizerElement)
      ) {
        return true
      }
      await new Promise((resolve) => setTimeout(resolve, 25))
    }
    return false
  }

  it('associates the visualizer with the player after the module import', async () => {
    const el = await fixture(html`<music-player></music-player>`)
    await el.updateComplete
    expect(el.visualizerElement).to.exist
    expect(el.visualizerElement.tagName.toLowerCase()).to.equal(
      'midi-visualizer',
    )
    expect(await waitForWiring(el)).to.be.true
  })

  it('does not wire the visualizer once disconnected', async () => {
    // FIXED: music-player.js firstUpdated stores the deferred import timer
    // and disconnectedCallback cancels it, and the wiring callback refuses
    // to run on a detached element, so a removed element never wires its
    // player to the visualizer.
    const el = await fixture(html`<music-player></music-player>`)
    await el.updateComplete
    el.remove()
    expect(await waitForWiring(el)).to.be.false
  })

  it('announces playback state through a visually hidden live region', async () => {
    const el = await fixture(html`<music-player></music-player>`)
    await el.updateComplete
    const player = el.shadowRoot.querySelector('midi-player')
    const liveStatus = el.shadowRoot.querySelector('.screen-reader-text')
    expect(liveStatus).to.exist
    expect(liveStatus.getAttribute('aria-live')).to.equal('polite')
    // the vendored time labels stay aria-hidden; playback state announces
    // here instead
    expect(
      player.shadowRoot.querySelector('.current-time').getAttribute(
        'aria-hidden',
      ),
    ).to.equal('true')
    player.dispatchEvent(new CustomEvent('start'))
    expect(liveStatus.textContent).to.equal('Playback started')
    player.dispatchEvent(
      new CustomEvent('stop', { detail: { finished: true } }),
    )
    expect(liveStatus.textContent).to.equal('Playback finished')
    player.dispatchEvent(new CustomEvent('stop'))
    expect(liveStatus.textContent).to.equal('Playback stopped')
    // the region is visually hidden from sighted users
    expect(globalThis.getComputedStyle(liveStatus).position).to.equal(
      'absolute',
    )
    expect(globalThis.getComputedStyle(liveStatus).width).to.equal('1px')
    expect(globalThis.getComputedStyle(liveStatus).height).to.equal('1px')
  })

  it('derives the midi-player margin from the DDD spacing token', async () => {
    const el = await fixture(html`<music-player></music-player>`)
    await el.updateComplete
    const player = el.shadowRoot.querySelector('midi-player')
    // token fallback when no DDD spacing variables are defined
    expect(globalThis.getComputedStyle(player).margin).to.equal('4px')
    // the DDD spacing token feeds the margin when it is defined
    el.style.setProperty('--ddd-spacing-1', '9px')
    expect(globalThis.getComputedStyle(player).margin).to.equal('9px')
    // the component override still wins over the DDD token
    el.style.setProperty('--music-player-midi-player-margin', '12px')
    expect(globalThis.getComputedStyle(player).margin).to.equal('12px')
  })

  it('follows DDD dark mode on the vendored control panel', async () => {
    const el = await fixture(html`<music-player></music-player>`)
    await el.updateComplete
    const player = el.shadowRoot.querySelector('midi-player')
    const panel = player.shadowRoot.querySelector('.controls')
    const currentTime = player.shadowRoot.querySelector('.current-time')
    const originalScheme =
      globalThis.document.documentElement.style.colorScheme
    try {
      // light mode resolves the DDD light surface and text tokens
      expect(globalThis.getComputedStyle(panel).backgroundColor).to.equal(
        'rgb(242, 242, 244)',
      )
      expect(globalThis.getComputedStyle(currentTime).color).to.equal(
        'rgb(38, 38, 38)',
      )
      // DDD dark mode is driven through the color-scheme mechanism
      globalThis.document.documentElement.style.colorScheme = 'dark'
      expect(globalThis.getComputedStyle(panel).backgroundColor).to.equal(
        'rgb(38, 38, 38)',
      )
      expect(globalThis.getComputedStyle(currentTime).color).to.equal(
        'rgb(242, 242, 244)',
      )
    } finally {
      globalThis.document.documentElement.style.colorScheme = originalScheme
    }
  })
})
