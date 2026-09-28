import { fixture, expect, html } from '@open-wc/testing'

// Explicit import so istanbul instruments the lib file
import '../lib/simple-iconset.js'
import { SimpleIconset, SimpleIconsetStore } from '../lib/simple-iconset.js'

describe('simple-iconset', () => {
  let origIconsets
  let origManifest
  let origIconlist
  let origNeedsHydrated

  beforeEach(() => {
    origIconsets = SimpleIconsetStore.iconsets
    origManifest = SimpleIconsetStore.manifest
    origIconlist = SimpleIconsetStore.iconlist
    origNeedsHydrated = SimpleIconsetStore.needsHydrated
    SimpleIconsetStore.iconsets = {}
    SimpleIconsetStore.manifest = {}
    SimpleIconsetStore.iconlist = []
    SimpleIconsetStore.needsHydrated = []
  })

  afterEach(() => {
    SimpleIconsetStore.iconsets = origIconsets
    SimpleIconsetStore.manifest = origManifest
    SimpleIconsetStore.iconlist = origIconlist
    SimpleIconsetStore.needsHydrated = origNeedsHydrated
  })

  describe('tag', () => {
    it('returns the correct tag name', () => {
      expect(SimpleIconset.tag).to.equal('simple-iconset')
    })
  })

  describe('constructor', () => {
    it('initializes all state to empty', () => {
      const inst = new SimpleIconset()
      expect(inst.iconsets).to.deep.equal({})
      expect(inst.iconlist).to.deep.equal([])
      expect(inst.manifest).to.deep.equal({})
      expect(inst.needsHydrated).to.deep.equal([])
    })
  })

  describe('registerManifest', () => {
    it('registers icons from a manifest entry', () => {
      SimpleIconsetStore.registerManifest([
        { name: 'test', icons: ['foo', 'bar'] },
      ])
      expect(SimpleIconsetStore.manifest['test']).to.deep.equal(['foo', 'bar'])
      expect(SimpleIconsetStore.iconlist).to.include('test:foo')
      expect(SimpleIconsetStore.iconlist).to.include('test:bar')
    })

    it('handles null manifest without throwing', () => {
      expect(() => SimpleIconsetStore.registerManifest(null)).to.not.throw()
      expect(SimpleIconsetStore.iconlist.length).to.equal(0)
    })

    it('handles undefined manifest without throwing', () => {
      expect(() =>
        SimpleIconsetStore.registerManifest(undefined),
      ).to.not.throw()
      expect(SimpleIconsetStore.iconlist.length).to.equal(0)
    })

    it('handles empty array manifest', () => {
      SimpleIconsetStore.registerManifest([])
      expect(SimpleIconsetStore.iconlist.length).to.equal(0)
    })

    it('does not re-register an existing iconset name', () => {
      SimpleIconsetStore.registerManifest([{ name: 'test', icons: ['foo'] }])
      const len = SimpleIconsetStore.iconlist.length
      SimpleIconsetStore.registerManifest([{ name: 'test', icons: ['bar'] }])
      expect(SimpleIconsetStore.manifest['test']).to.deep.equal(['foo'])
      expect(SimpleIconsetStore.iconlist.length).to.equal(len)
      expect(SimpleIconsetStore.iconlist).to.not.include('test:bar')
    })

    it('handles iconset entry with missing icons array', () => {
      SimpleIconsetStore.registerManifest([{ name: 'empty' }])
      expect(SimpleIconsetStore.manifest['empty']).to.deep.equal([])
    })

    it('registers multiple iconsets in one call', () => {
      SimpleIconsetStore.registerManifest([
        { name: 'a', icons: ['x'] },
        { name: 'b', icons: ['y', 'z'] },
      ])
      expect(SimpleIconsetStore.manifest['a']).to.deep.equal(['x'])
      expect(SimpleIconsetStore.manifest['b']).to.deep.equal(['y', 'z'])
      expect(SimpleIconsetStore.iconlist).to.include('a:x')
      expect(SimpleIconsetStore.iconlist).to.include('b:y')
      expect(SimpleIconsetStore.iconlist).to.include('b:z')
    })

    it('skips re-registered names but still processes new ones in same call', () => {
      SimpleIconsetStore.registerManifest([{ name: 'a', icons: ['x'] }])
      SimpleIconsetStore.registerManifest([
        { name: 'a', icons: ['q'] },
        { name: 'b', icons: ['y'] },
      ])
      expect(SimpleIconsetStore.manifest['a']).to.deep.equal(['x'])
      expect(SimpleIconsetStore.manifest['b']).to.deep.equal(['y'])
      expect(SimpleIconsetStore.iconlist).to.not.include('a:q')
      expect(SimpleIconsetStore.iconlist).to.include('b:y')
    })
  })

  describe('registerIconset', () => {
    it('registers an object iconset (key → path map)', () => {
      SimpleIconsetStore.registerIconset('myset', {
        foo: '/path/foo.svg',
      })
      expect(SimpleIconsetStore.iconsets['myset']).to.deep.equal({
        foo: '/path/foo.svg',
      })
    })

    it('clones the object so mutations do not leak', () => {
      const icons = { foo: '/path/foo.svg' }
      SimpleIconsetStore.registerIconset('myset', icons)
      icons.foo = '/changed.svg'
      expect(SimpleIconsetStore.iconsets['myset'].foo).to.equal(
        '/path/foo.svg',
      )
    })

    it('registers a string iconset (base path)', () => {
      SimpleIconsetStore.registerIconset('myset', '/base/path/')
      expect(SimpleIconsetStore.iconsets['myset']).to.equal('/base/path/')
    })

    it('defaults to empty object when no icons argument provided', () => {
      SimpleIconsetStore.registerIconset('myset')
      expect(SimpleIconsetStore.iconsets['myset']).to.deep.equal({})
    })

    it('handles null icons argument as empty object spread', () => {
      SimpleIconsetStore.registerIconset('myset', null)
      expect(SimpleIconsetStore.iconsets['myset']).to.deep.equal({})
    })

    it('processes needsHydrated queue after registration', () => {
      const fakeEl = {
        icon: 'myset:foo',
        src: null,
        setSrcByIcon(store) {
          this.src = store.getIcon(this.icon, this)
          return this.src
        },
      }
      // Request icon before iconset exists → pushed to needsHydrated
      SimpleIconsetStore.getIcon('myset:foo', fakeEl)
      expect(SimpleIconsetStore.needsHydrated.length).to.equal(1)

      // Register the iconset → should hydrate the waiting element
      SimpleIconsetStore.registerIconset('myset', {
        foo: '/path/foo.svg',
      })
      expect(SimpleIconsetStore.needsHydrated.length).to.equal(0)
      expect(fakeEl.src).to.equal('/path/foo.svg')
    })

    it('skips needsHydrated items without setSrcByIcon method', () => {
      SimpleIconsetStore.needsHydrated.push({ icon: 'myset:foo' })
      SimpleIconsetStore.registerIconset('myset', {
        foo: '/path/foo.svg',
      })
      // Item without setSrcByIcon stays in queue
      expect(SimpleIconsetStore.needsHydrated.length).to.equal(1)
    })

    it('keeps items in needsHydrated when setSrcByIcon returns falsy', () => {
      const fakeEl = {
        icon: 'wrong:foo',
        src: null,
        setSrcByIcon(store) {
          this.src = store.getIcon(this.icon, this)
          return this.src
        },
      }
      SimpleIconsetStore.needsHydrated.push(fakeEl)
      // Register a different iconset than what fakeEl needs
      SimpleIconsetStore.registerIconset('myset', {
        foo: '/path/foo.svg',
      })
      // fakeEl still unresolved because 'wrong' namespace not registered
      expect(fakeEl.src).to.be.null
    })

    it('processes multiple needsHydrated items and removes resolved ones', () => {
      const el1 = {
        icon: 'set:a',
        src: null,
        setSrcByIcon(store) {
          this.src = store.getIcon(this.icon, this)
          return this.src
        },
      }
      const el2 = {
        icon: 'set:b',
        src: null,
        setSrcByIcon(store) {
          this.src = store.getIcon(this.icon, this)
          return this.src
        },
      }
      // el3 uses a namespace that is NOT registered, so getIcon returns null
      // and setSrcByIcon returns falsy, keeping el3 in the queue.
      const el3 = {
        icon: 'unregistered-ns:missing',
        src: null,
        setSrcByIcon(store) {
          this.src = store.getIcon(this.icon, this)
          return this.src
        },
      }
      SimpleIconsetStore.needsHydrated = [el1, el2, el3]
      SimpleIconsetStore.registerIconset('set', {
        a: '/a.svg',
        b: '/b.svg',
      })
      expect(el1.src).to.equal('/a.svg')
      expect(el2.src).to.equal('/b.svg')
      expect(el3.src).to.be.null
      // el1 and el2 removed, el3 stays
      expect(SimpleIconsetStore.needsHydrated).to.include(el3)
      expect(SimpleIconsetStore.needsHydrated).to.not.include(el1)
      expect(SimpleIconsetStore.needsHydrated).to.not.include(el2)
    })

    it('does not process needsHydrated when queue is empty', () => {
      // Just verify it does not throw with empty queue
      expect(() =>
        SimpleIconsetStore.registerIconset('myset', { foo: '/f.svg' }),
      ).to.not.throw()
    })
  })

  describe('getIcon', () => {
    beforeEach(() => {
      SimpleIconsetStore.registerIconset('objset', {
        foo: '/path/foo.svg',
        bar: '/path/bar.svg',
      })
      SimpleIconsetStore.registerIconset('strset', '/base/path/')
      SimpleIconsetStore.registerIconset('icons', {
        home: '/icons/home.svg',
      })
    })

    it('returns icon path from object iconset', () => {
      expect(SimpleIconsetStore.getIcon('objset:foo')).to.equal(
        '/path/foo.svg',
      )
    })

    it('returns constructed path from string iconset', () => {
      expect(SimpleIconsetStore.getIcon('strset:baz')).to.equal(
        '/base/path/baz.svg',
      )
    })

    it('defaults to "icons" namespace for single-name (legacy API)', () => {
      expect(SimpleIconsetStore.getIcon('home')).to.equal('/icons/home.svg')
    })

    it('replaces forward slashes with dashes in icon names', () => {
      SimpleIconsetStore.registerIconset('objset', {
        'foo-bar': '/path/foo-bar.svg',
      })
      expect(SimpleIconsetStore.getIcon('objset:foo/bar')).to.equal(
        '/path/foo-bar.svg',
      )
    })

    it('returns null for unknown namespace', () => {
      expect(SimpleIconsetStore.getIcon('unknown:foo')).to.be.null
    })

    // BUG: getIcon returns '[object Object]nonexistent.svg' instead of null
    // when the namespace exists (as an object) but the icon key is missing.
    // The else-if branch assumes iconsets[ns] is a string base path, but it
    // can be an object with a missing key, producing a garbage path.
    // See lib/simple-iconset.js:94-95
    it('returns garbage path for unknown icon in known object namespace (bug)', () => {
      expect(SimpleIconsetStore.getIcon('objset:nonexistent')).to.equal(
        '[object Object]nonexistent.svg',
      )
    })

    it('returns null only for truly unregistered namespace', () => {
      expect(SimpleIconsetStore.getIcon('totally-unknown:foo')).to.be.null
    })

    it('pushes to needsHydrated when context is provided and icon not found', () => {
      const ctx = { icon: 'unknown:foo' }
      SimpleIconsetStore.getIcon('unknown:foo', ctx)
      expect(SimpleIconsetStore.needsHydrated).to.include(ctx)
    })

    it('does not push to needsHydrated when context is the store itself', () => {
      SimpleIconsetStore.getIcon('unknown:foo', SimpleIconsetStore)
      expect(SimpleIconsetStore.needsHydrated.length).to.equal(0)
    })

    it('does not push to needsHydrated when no context provided', () => {
      SimpleIconsetStore.getIcon('unknown:foo')
      expect(SimpleIconsetStore.needsHydrated.length).to.equal(0)
    })

    it('does not push to needsHydrated when context is null', () => {
      SimpleIconsetStore.getIcon('unknown:foo', null)
      expect(SimpleIconsetStore.needsHydrated.length).to.equal(0)
    })

    it('does not push to needsHydrated when context is undefined', () => {
      SimpleIconsetStore.getIcon('unknown:foo', undefined)
      expect(SimpleIconsetStore.needsHydrated.length).to.equal(0)
    })

    it('handles empty string icon name', () => {
      expect(SimpleIconsetStore.getIcon('')).to.be.null
    })

    it('handles three-part name (namespace:icon:extra) as not found', () => {
      expect(SimpleIconsetStore.getIcon('objset:foo:bar')).to.be.null
    })

    it('handles name with empty icon part (namespace:)', () => {
      expect(SimpleIconsetStore.getIcon('objset:')).to.be.null
    })

    it('handles name with empty namespace (:icon)', () => {
      expect(SimpleIconsetStore.getIcon(':foo')).to.be.null
    })

    it('skips function values in object iconsets and falls through to string path', () => {
      const fnSet = { dynamic: () => '/dynamic.svg' }
      SimpleIconsetStore.registerIconset('fnset', fnSet)
      // Function is skipped by the !== "function" guard.
      // Falls to else if (ary[1]) which returns `${object}dynamic.svg`
      const result = SimpleIconsetStore.getIcon('fnset:dynamic')
      expect(result).to.equal('[object Object]dynamic.svg')
    })

    it('throws TypeError for null input', () => {
      expect(() => SimpleIconsetStore.getIcon(null)).to.throw(TypeError)
    })

    it('throws TypeError for undefined input', () => {
      expect(() => SimpleIconsetStore.getIcon(undefined)).to.throw(TypeError)
    })
  })

  describe('requestAvailability', () => {
    it('returns the singleton instance', () => {
      const inst = globalThis.SimpleIconset.requestAvailability()
      expect(inst).to.exist
      expect(inst).to.equal(globalThis.SimpleIconset.instance)
    })

    it('returns the same instance on subsequent calls', () => {
      const first = globalThis.SimpleIconset.requestAvailability()
      const second = globalThis.SimpleIconset.requestAvailability()
      expect(first).to.equal(second)
    })
  })
})
