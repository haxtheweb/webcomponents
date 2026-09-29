import { expect } from '@open-wc/testing'

// simple-icon-picker resolves icons through the shared iconset store,
// so its behaviors are covered from this package
import '@haxtheweb/simple-icon/lib/simple-icons.js'
import { SimpleIconsetStore } from '@haxtheweb/simple-icon/lib/simple-iconset.js'

describe('simple-iconset store (simple-icon-picker dependency)', () => {
  let originalIconsets
  let originalManifest
  let originalIconlist
  let originalNeedsHydrated

  beforeEach(() => {
    originalIconsets = SimpleIconsetStore.iconsets
    originalManifest = SimpleIconsetStore.manifest
    originalIconlist = SimpleIconsetStore.iconlist
    originalNeedsHydrated = SimpleIconsetStore.needsHydrated
  })

  afterEach(() => {
    SimpleIconsetStore.iconsets = originalIconsets
    SimpleIconsetStore.manifest = originalManifest
    SimpleIconsetStore.iconlist = originalIconlist
    SimpleIconsetStore.needsHydrated = originalNeedsHydrated
  })

  it('registerManifest appends namespaced icons exactly once', () => {
    const before = SimpleIconsetStore.iconlist.length
    SimpleIconsetStore.registerManifest([
      { name: 'test-manifest', icons: ['first', 'second'] },
    ])
    expect(SimpleIconsetStore.iconlist.length).to.equal(before + 2)
    expect(SimpleIconsetStore.iconlist).to.include('test-manifest:first')
    expect(SimpleIconsetStore.iconlist).to.include('test-manifest:second')
    expect(SimpleIconsetStore.manifest['test-manifest']).to.deep.equal([
      'first',
      'second',
    ])
    // a duplicate manifest for the same set is ignored
    SimpleIconsetStore.registerManifest([
      { name: 'test-manifest', icons: ['first', 'second'] },
    ])
    expect(SimpleIconsetStore.iconlist.length).to.equal(before + 2)
  })

  it('registerIconset accepts object maps and string base paths', () => {
    SimpleIconsetStore.registerIconset('obj-set', { known: 'obj/known.svg' })
    expect(SimpleIconsetStore.iconsets['obj-set']).to.deep.equal({
      known: 'obj/known.svg',
    })
    SimpleIconsetStore.registerIconset('str-set', './str-base/')
    expect(SimpleIconsetStore.iconsets['str-set']).to.equal('./str-base/')
  })

  it('getIcon resolves object entries, string paths and legacy names', () => {
    SimpleIconsetStore.registerIconset('obj-set', { known: 'obj/known.svg' })
    SimpleIconsetStore.registerIconset('str-set', './str-base/')
    expect(SimpleIconsetStore.getIcon('obj-set:known')).to.equal(
      'obj/known.svg',
    )
    expect(SimpleIconsetStore.getIcon('str-set:anything')).to.equal(
      './str-base/anything.svg',
    )
    // legacy single name form falls back to the icons iconset
    const legacy = SimpleIconsetStore.getIcon('add')
    expect(legacy).to.include('add')
    expect(legacy).to.include('.svg')
  })

  it('getIcon returns null for unregistered sets and queues the context', () => {
    SimpleIconsetStore.needsHydrated = []
    expect(SimpleIconsetStore.getIcon('no-such-set:x')).to.equal(null)
    expect(SimpleIconsetStore.needsHydrated.length).to.equal(0)
    const context = { setSrcByIcon: () => true }
    expect(SimpleIconsetStore.getIcon('no-such-set:x', context)).to.equal(null)
    expect(SimpleIconsetStore.needsHydrated).to.include(context)
  })

  it('rehydrates queued contexts when a late iconset registers', () => {
    SimpleIconsetStore.needsHydrated = []
    const resolved = { setSrcByIcon: () => true }
    const stuck = { setSrcByIcon: () => false }
    SimpleIconsetStore.getIcon('late-set:one', resolved)
    SimpleIconsetStore.getIcon('late-set:two', stuck)
    expect(SimpleIconsetStore.needsHydrated).to.deep.equal([resolved, stuck])
    // registering the missing set processes the queue and drops the
    // context that reported success
    SimpleIconsetStore.registerIconset('late-set', { one: 'late/one.svg' })
    expect(SimpleIconsetStore.needsHydrated).to.deep.equal([stuck])
    // a later registration retries the remaining context
    SimpleIconsetStore.registerIconset('other-set', {})
    expect(SimpleIconsetStore.needsHydrated).to.deep.equal([stuck])
  })
})
