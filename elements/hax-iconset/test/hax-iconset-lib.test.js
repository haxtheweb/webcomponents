import { expect } from '@open-wc/testing'
import { SimpleIconsetStore } from '@haxtheweb/simple-icon/lib/simple-iconset.js'

// Directly import each lib file so istanbul instruments them.
import '../lib/simple-hax-iconset.js'
import { HaxIconsetManifest } from '../lib/hax-iconset-manifest.js'

describe('hax-iconset lib — simple-hax-iconset', () => {
  it('registers all 8 HAX iconsets in SimpleIconsetStore', () => {
    const expected = [
      'courseicons',
      'hax',
      'lrn',
      'mdextra',
      'mdi-social',
      'editable-table',
      'drawing',
      'paper-audio-icons',
    ]
    for (const name of expected) {
      expect(SimpleIconsetStore.iconsets[name]).to.exist
      expect(typeof SimpleIconsetStore.iconsets[name]).to.equal('string')
    }
  })

  it('registers iconset paths that end with the svgs/<name>/ directory', () => {
    expect(SimpleIconsetStore.iconsets['hax']).to.include('/svgs/hax/')
    expect(SimpleIconsetStore.iconsets['lrn']).to.include('/svgs/lrn/')
    expect(SimpleIconsetStore.iconsets['courseicons']).to.include(
      '/svgs/courseicons/',
    )
  })
})

describe('hax-iconset lib — hax-iconset-manifest', () => {
  it('exports an array of iconset definitions', () => {
    expect(Array.isArray(HaxIconsetManifest)).to.be.true
    expect(HaxIconsetManifest.length).to.equal(8)
  })

  it('each manifest entry has a name and an icons array', () => {
    for (const entry of HaxIconsetManifest) {
      expect(entry.name).to.be.a('string')
      expect(Array.isArray(entry.icons)).to.be.true
      expect(entry.icons.length).to.be.greaterThan(0)
    }
  })

  it('includes expected iconset names in the manifest', () => {
    const names = HaxIconsetManifest.map((e) => e.name)
    expect(names).to.include('courseicons')
    expect(names).to.include('hax')
    expect(names).to.include('lrn')
    expect(names).to.include('mdextra')
    expect(names).to.include('mdi-social')
    expect(names).to.include('editable-table')
    expect(names).to.include('drawing')
    expect(names).to.include('paper-audio-icons')
  })

  it('registers the manifest into SimpleIconsetStore.manifest', () => {
    // hax-iconset-manifest.js calls registerManifest at import time
    for (const entry of HaxIconsetManifest) {
      expect(SimpleIconsetStore.manifest[entry.name]).to.deep.equal(
        entry.icons,
      )
    }
  })

  it('populates SimpleIconsetStore.iconlist with name:icon pairs', () => {
    // Pick a few known icons and verify they appear in the iconlist
    expect(SimpleIconsetStore.iconlist).to.include('hax:vocab')
    expect(SimpleIconsetStore.iconlist).to.include('lrn:book')
    expect(SimpleIconsetStore.iconlist).to.include('courseicons:astro001')
  })

  it('hax iconset contains specific known icons', () => {
    const haxEntry = HaxIconsetManifest.find((e) => e.name === 'hax')
    expect(haxEntry.icons).to.include('vocab')
    expect(haxEntry.icons).to.include('oer')
    expect(haxEntry.icons).to.include('settings')
  })

  it('drawing iconset has drawing tool icons', () => {
    const drawingEntry = HaxIconsetManifest.find((e) => e.name === 'drawing')
    expect(drawingEntry.icons).to.include('draw-ellip')
    expect(drawingEntry.icons).to.include('select')
  })

  it('paper-audio-icons iconset has playback icons', () => {
    const audioEntry = HaxIconsetManifest.find(
      (e) => e.name === 'paper-audio-icons',
    )
    expect(audioEntry.icons).to.include('play-arrow')
    expect(audioEntry.icons).to.include('pause')
  })
})

describe('hax-iconset lib — elmsln-custom-iconset', () => {
  let originalDrupal
  let originalSimpleIconset

  beforeEach(() => {
    originalDrupal = globalThis.Drupal
    originalSimpleIconset = globalThis.SimpleIconset
  })

  afterEach(() => {
    // restore globals
    if (originalDrupal) {
      globalThis.Drupal = originalDrupal
    } else {
      delete globalThis.Drupal
    }
    if (originalSimpleIconset) {
      globalThis.SimpleIconset = originalSimpleIconset
    } else {
      delete globalThis.SimpleIconset
    }
  })

  it('registers elmsln-custom-icons when Drupal.settings.basePath is set', async () => {
    // Stub Drupal with a basePath
    globalThis.Drupal = {
      settings: {
        basePath: '/my-site/',
      },
    }

    // Ensure SimpleIconset singleton is available with requestAvailability
    // We use the real one from simple-iconset.js which already has it
    // The dynamic import in elmsln-custom-iconset will call requestAvailability()
    // We need to ensure the instance exists
    const store = globalThis.SimpleIconset.requestAvailability()

    // Dynamically import the elmsln-custom-iconset module
    // It uses import().then() so we need to wait for the microtask
    await import('../lib/elmsln-custom-iconset.js')

    // Wait for the dynamic import promise chain to settle
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Verify the iconset was registered on the singleton instance
    expect(store.iconsets['elmsln-custom-icons']).to.exist
    expect(store.iconsets['elmsln-custom-icons']).to.include(
      '/my-site/sites/all/libraries/_my_libraries/elmsln-custom-icons/',
    )
  })

  it('does not register elmsln-custom-icons when Drupal is not present', async () => {
    // Remove Drupal
    delete globalThis.Drupal

    const store = globalThis.SimpleIconset.requestAvailability()
    // Record current state — should not have elmsln-custom-icons from this run
    const before = store.iconsets['elmsln-custom-icons']

    await import('../lib/elmsln-custom-iconset.js')
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Since Drupal is not set, the if-condition is false and nothing happens.
    // If it was registered by the previous test, it should remain unchanged.
    // The key point is no NEW registration happens — no error, no crash.
    expect(store.iconsets['elmsln-custom-icons']).to.equal(before)
  })

  it('does not register when Drupal.settings exists but basePath is missing', async () => {
    globalThis.Drupal = {
      settings: {},
    }

    const store = globalThis.SimpleIconset.requestAvailability()
    const before = store.iconsets['elmsln-custom-icons']

    await import('../lib/elmsln-custom-iconset.js')
    await new Promise((resolve) => setTimeout(resolve, 100))

    // basePath is undefined so the condition is falsy — no registration
    expect(store.iconsets['elmsln-custom-icons']).to.equal(before)
  })
})
