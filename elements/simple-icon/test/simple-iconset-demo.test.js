import { fixture, expect, html } from '@open-wc/testing'

// Explicit imports so istanbul instruments each lib file
import '../lib/simple-iconset-demo.js'
import '../lib/simple-icons.js'
import { SimpleIconIconsetsManifest } from '../lib/simple-iconset-manifest.js'
import { SimpleIconsetStore } from '../lib/simple-iconset.js'
import { SimpleIconsetDemo } from '../lib/simple-iconset-demo.js'

describe('SimpleIconIconsetsManifest', () => {
  it('exports an array of iconsets', () => {
    expect(Array.isArray(SimpleIconIconsetsManifest)).to.be.true
    expect(SimpleIconIconsetsManifest.length).to.be.greaterThan(0)
  })

  it('has a name and icons array for every iconset', () => {
    for (const iconset of SimpleIconIconsetsManifest) {
      expect(typeof iconset.name).to.equal('string')
      expect(Array.isArray(iconset.icons)).to.be.true
    }
  })

  // DATA NOTE: the elmsln-custom manifest entry lists zero icons even
  // though simple-icons.js registers the elmsln-custom iconset folder, so
  // the iconset renders an empty list in the demo.
  it('has an empty icons list for elmsln-custom', () => {
    const entry = SimpleIconIconsetsManifest.find(
      (iconset) => iconset.name === 'elmsln-custom',
    )
    expect(!!entry).to.be.true
    expect(entry.icons.length).to.equal(0)
  })

  it('includes the expected iconset names', () => {
    const names = SimpleIconIconsetsManifest.map((iconset) => iconset.name)
    expect(names.includes('av')).to.be.true
    expect(names.includes('icons')).to.be.true
    expect(names.includes('loading')).to.be.true
    expect(names.length).to.equal(13)
  })
})

describe('simple-icons registration', () => {
  it('registers the iconsets in the SimpleIconsetStore', () => {
    const names = [
      'av',
      'communication',
      'device',
      'editor',
      'elmsln-custom',
      'hardware',
      'icons',
      'image',
      'maps',
      'notification',
      'places',
      'social',
      'loading',
    ]
    names.forEach((name) => {
      expect(SimpleIconsetStore.iconsets[name] !== undefined).to.be.true
    })
  })

  it('registers string base paths that end with the iconset folder', () => {
    expect(SimpleIconsetStore.iconsets.av.endsWith('svgs/av/')).to.be.true
    expect(SimpleIconsetStore.iconsets.icons.endsWith('svgs/icons/')).to.be
      .true
  })

  it('registers the flags iconsets from flag-icons', () => {
    expect(SimpleIconsetStore.iconsets.flags.includes('flag-icons')).to.be.true
    expect(SimpleIconsetStore.iconsets.flags1x1.includes('flag-icons')).to.be
      .true
  })

  it('resolves icons through the store after registration', () => {
    const src = SimpleIconsetStore.getIcon('av:album')
    expect(src !== null).to.be.true
    expect(src.endsWith('svgs/av/album.svg')).to.be.true
    const iconsSrc = SimpleIconsetStore.getIcon('icons:mood')
    expect(iconsSrc.endsWith('mood.svg')).to.be.true
  })
})

describe('simple-iconset-demo', () => {
  it('has the correct tag name', () => {
    expect(SimpleIconsetDemo.tag).to.equal('simple-iconset-demo')
  })

  it('instantiates as a SimpleIconsetDemo', async () => {
    const el = await fixture(
      html`<simple-iconset-demo></simple-iconset-demo>`,
    )
    expect(el instanceof SimpleIconsetDemo).to.be.true
  })

  it('loads all manifest iconsets by default', async () => {
    const el = await fixture(
      html`<simple-iconset-demo></simple-iconset-demo>`,
    )
    expect(el.iconsets.length).to.equal(13)
    const names = el.iconsets.map((iconset) => iconset.name)
    expect(names.includes('av')).to.be.true
    expect(names.includes('icons')).to.be.true
  })

  it('renders every iconset with its icons', async () => {
    const el = await fixture(
      html`<simple-iconset-demo></simple-iconset-demo>`,
    )
    const sets = el.shadowRoot.querySelectorAll('div.iconset')
    expect(sets.length).to.equal(13)
    const first = sets[0]
    const strong = first.querySelector('p strong')
    expect(strong.textContent).to.equal('av')
    const firstIcon = first.querySelector('li simple-icon-lite')
    expect(firstIcon.getAttribute('icon')).to.equal('av:add-to-queue')
    const firstText = first.querySelector('li #icon-text')
    expect(firstText.textContent.trim()).to.equal('av:add-to-queue')
    // every rendered iconset renders exactly as many list items as icons
    const lis = el.shadowRoot.querySelectorAll('li simple-icon-lite')
    let expected = 0
    el.iconsets.forEach((iconset) => {
      expected += iconset.icons.length
    })
    expect(lis.length).to.equal(expected)
  })

  it('renders each icon as a list item inside a ul', async () => {
    const el = await fixture(
      html`<simple-iconset-demo></simple-iconset-demo>`,
    )
    const set = el.shadowRoot.querySelector('div.iconset')
    const ul = set.querySelector('ul')
    expect(!!ul).to.be.true
    const lis = ul.querySelectorAll('li')
    expect(lis.length).to.equal(el.iconsets[0].icons.length)
  })

  it('falls back to the manifest when imports is emptied', async () => {
    const el = await fixture(
      html`<simple-iconset-demo></simple-iconset-demo>`,
    )
    el.imports = []
    await el.updateComplete
    // imports=[] is treated as no imports so the manifest is used again
    expect(el.iconsets.length).to.equal(13)
  })

  it('shows Looking for iconsets when the filtered list is empty', async () => {
    const el = await fixture(
      html`<simple-iconset-demo></simple-iconset-demo>`,
    )
    el.iconsets = []
    await el.updateComplete
    expect(el.shadowRoot.textContent.includes('Looking for iconsets...')).to.be
      .true
  })

  it('renders custom imports when provided', async () => {
    const el = await fixture(
      html`<simple-iconset-demo></simple-iconset-demo>`,
    )
    el.imports = [{ name: 'custom', icons: ['a', 'b'] }]
    await el.updateComplete
    await el.updateComplete
    expect(el.iconsets.length).to.equal(1)
    expect(el.iconsets[0].name).to.equal('custom')
    const strong = el.shadowRoot.querySelector('p strong')
    expect(strong.textContent).to.equal('custom')
    const icons = el.shadowRoot.querySelectorAll('li simple-icon-lite')
    expect(icons.length).to.equal(2)
    expect(icons[0].getAttribute('icon')).to.equal('custom:a')
    expect(icons[1].getAttribute('icon')).to.equal('custom:b')
    // custom sets show the prefix in the icon text
    const firstText = el.shadowRoot.querySelector('li #icon-text')
    expect(firstText.textContent.trim()).to.equal('custom:a')
  })

  it('flattens nested imports arrays', async () => {
    const el = await fixture(
      html`<simple-iconset-demo></simple-iconset-demo>`,
    )
    el.imports = [
      [{ name: 'one', icons: ['x'] }],
      { name: 'two', icons: ['y'] },
    ]
    await el.updateComplete
    expect(el.iconsets.length).to.equal(2)
    const names = el.iconsets.map((iconset) => iconset.name)
    expect(names.includes('one')).to.be.true
    expect(names.includes('two')).to.be.true
  })

  it('passes the a11y audit with a small custom set', async () => {
    const el = await fixture(
      html`<simple-iconset-demo></simple-iconset-demo>`,
    )
    el.imports = [{ name: 'custom', icons: ['a', 'b'] }]
    await el.updateComplete
    await expect(el).shadowDom.to.be.accessible()
  })

  // BUG: _getIconsets filters iconset OBJECTS against name STRINGS, so the
  // exclude attribute never filters anything. The assertion below documents
  // the broken behavior; flip it when the filter compares iconset.name.
  // See lib/simple-iconset-demo.js around line 146-152.
  it('BUG: exclude attribute does not filter iconsets', async () => {
    const el = await fixture(
      html`<simple-iconset-demo exclude="av"></simple-iconset-demo>`,
    )
    const names = el.iconsets.map((iconset) => iconset.name)
    expect(names.includes('av')).to.be.true
    expect(el.iconsets.length).to.equal(13)
  })

  // BUG: includeSets.includes(iconset) is always false for objects, so any
  // include attribute filters out EVERY iconset and the demo renders the
  // placeholder forever. Flip when the filter compares iconset.name.
  it('BUG: include attribute filters out all iconsets', async () => {
    const el = await fixture(
      html`<simple-iconset-demo include="av"></simple-iconset-demo>`,
    )
    await el.updateComplete
    await el.updateComplete
    expect(el.iconsets.length).to.equal(0)
    expect(el.shadowRoot.textContent.includes('Looking for iconsets...')).to.be
      .true
  })
})
