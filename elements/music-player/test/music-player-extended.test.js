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

  it('still wires the visualizer after the element is disconnected', async () => {
    // BUG: music-player.js:107-114 - the setTimeout dynamic import is never
    // cancelled on disconnect, so a detached element still loads the
    // vendored bundle and wires its player to the visualizer.
    const el = await fixture(html`<music-player></music-player>`)
    await el.updateComplete
    el.remove()
    expect(await waitForWiring(el)).to.be.true
  })
})
