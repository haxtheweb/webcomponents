// Tests for HAXCMSThemeWiring — the mixin and wiring class that connect
// HAXcms themes to the store. We register a thin test subclass that extends
// HAXCMSTheme(LitElement) and exercise the mixin's helper methods directly,
// plus the HAXCMSThemeWiring class's connect/disconnect/event-handler API.
import { fixture, expect, html } from '@open-wc/testing'
import { LitElement } from 'lit'
// Direct import so istanbul instruments HAXCMSThemeWiring.js
import { HAXCMSTheme, HAXCMSThemeWiring } from '../lib/core/HAXCMSThemeWiring.js'
import { store } from '../lib/core/haxcms-site-store.js'

class TestThemeWiring extends HAXCMSTheme(LitElement) {
  static get tag() { return 'test-theme-wiring' }
  render() {
    return html`<div id="contentcontainer"><div id="slot"><slot></slot></div></div>`
  }
}
customElements.define(TestThemeWiring.tag, TestThemeWiring)

const flush = async (el) => {
  await new Promise((r) => setTimeout(r, 0))
  await el.updateComplete
}

function makeManifest() {
  return {
    id: 'tw-site',
    title: 'TW Site',
    metadata: {
      site: { name: 'tw-site', lang: 'en' },
      platform: {},
      theme: {
        element: 'test-theme',
        variables: {
          image: 'banner.jpg',
          icon: 'icons:page',
          cssVariable: 'blue',
          hexCode: '#ff0074',
        },
        regions: {
          header: null,
          sidebarFirst: null,
          sidebarSecond: null,
          contentTop: null,
          contentBottom: null,
          footerPrimary: null,
          footerSecondary: null,
        },
      },
    },
    items: [
      {
        id: 'page-1',
        title: 'Page One',
        slug: 'page-1',
        location: 'pages/page-1/index.html',
        order: 1,
        parent: null,
        indent: 0,
        metadata: { published: true, locked: false, status: '', created: 1, updated: 2 },
      },
      {
        id: 'page-2',
        title: 'Page Two',
        slug: 'page-2',
        location: 'pages/page-2/index.html',
        order: 2,
        parent: null,
        indent: 0,
        metadata: { published: true, locked: false, status: '', created: 1, updated: 3 },
      },
    ],
  }
}

describe('HAXCMSTheme mixin helper methods', () => {
  let element
  let saved = {}

  beforeEach(async () => {
    saved = {
      manifest: store.manifest,
      editMode: store.editMode,
      location: store.location,
    }
    store.manifest = makeManifest()
    store.editMode = false
    store.location = null
    element = await fixture(html`<test-theme-wiring></test-theme-wiring>`)
  })

  afterEach(() => {
    store.manifest = saved.manifest
    store.editMode = saved.editMode
    store.location = saved.location
  })

  describe('_getHexColor', () => {
    it('returns the shade-6 hex for a known SimpleColors color name', () => {
      // SimpleColorsSharedStyles is imported by HAXCMSThemeWiring, so
      // globalThis.SimpleColorsSharedStyles.colors should be available
      const hex = element._getHexColor('red')
      expect(typeof hex).to.equal('string')
      expect(hex.startsWith('#')).to.equal(true)
    })

    it('strips -text suffix from legacy materializeCSS names', () => {
      const hex1 = element._getHexColor('red')
      const hex2 = element._getHexColor('red-text')
      expect(hex1).to.equal(hex2)
    })

    it('returns #000000 for unknown color names', () => {
      expect(element._getHexColor('nonexistent-color')).to.equal('#000000')
    })
  })

  describe('_colorChanged', () => {
    it('sets hexColor from the color name when value is truthy', () => {
      element._colorChanged('red')
      expect(element.hexColor).to.exist
      expect(typeof element.hexColor).to.equal('string')
    })

    it('does not set hexColor when value is falsy', () => {
      element.hexColor = 'unchanged'
      element._colorChanged(null)
      expect(element.hexColor).to.equal('unchanged')
    })
  })

  describe('_editModeChanged', () => {
    it('syncs store.editMode and triggers style reapply when oldValue is defined', () => {
      let resizeFired = false
      const handler = () => { resizeFired = true }
      globalThis.addEventListener('resize', handler)
      try {
        element._editModeChanged(true, false)
        expect(store.editMode).to.equal(true)
        expect(resizeFired).to.equal(true)
      } finally {
        globalThis.removeEventListener('resize', handler)
      }
    })

    it('is a no-op when oldValue is undefined (first set)', () => {
      store.editMode = false
      element._editModeChanged(true, undefined)
      expect(store.editMode).to.equal(false)
    })
  })

  describe('_contentContainerChanged', () => {
    it('connects wiring when container is first set', () => {
      const container = element.shadowRoot.querySelector('#contentcontainer')
      expect(() => {
        element._contentContainerChanged(container, undefined)
      }).to.not.throw()
    })

    it('disconnects and reconnects when container changes', () => {
      const container1 = element.shadowRoot.querySelector('#contentcontainer')
      element._contentContainerChanged(container1, undefined)
      const container2 = document.createElement('div')
      expect(() => {
        element._contentContainerChanged(container2, container1)
      }).to.not.throw()
    })

    it('disconnects when container becomes null', () => {
      const container = element.shadowRoot.querySelector('#contentcontainer')
      element._contentContainerChanged(container, undefined)
      expect(() => {
        element._contentContainerChanged(null, container)
      }).to.not.throw()
    })
  })

  describe('_locationChanged', () => {
    it('is a no-op when newValue is falsy', () => {
      expect(() => element._locationChanged(null, undefined)).to.not.throw()
    })

    it('is a no-op when newValue has no route property', () => {
      expect(() => element._locationChanged({}, undefined)).to.not.throw()
    })

    it('sets activeId to first item when route name is home', async () => {
      store.activeId = null
      element._locationChanged({ route: { name: 'home' } }, undefined)
      await flush(element)
      // home route falls back to first item in routerManifest
      expect(store.activeId).to.equal('page-1')
    })

    it('sets activeId to configured homePageId when set', async () => {
      store.manifest.metadata.site.homePageId = 'page-2'
      store.activeId = null
      element._locationChanged({ route: { name: 'home' } }, undefined)
      await flush(element)
      expect(store.activeId).to.equal('page-2')
      delete store.manifest.metadata.site.homePageId
    })

    it('falls back to first item when configured homePageId does not exist', async () => {
      store.manifest.metadata.site.homePageId = 'nonexistent'
      store.activeId = null
      element._locationChanged({ route: { name: 'home' } }, undefined)
      await flush(element)
      expect(store.activeId).to.equal('page-1')
      delete store.manifest.metadata.site.homePageId
    })

    it('falls back to first item when configured homePageId is unpublished and not logged in', async () => {
      store.manifest.metadata.site.homePageId = 'page-2'
      store.manifest.items[1].metadata.published = false
      store.activeId = null
      // isLoggedIn defaults to false when no jwt
      store.jwt = null
      element._locationChanged({ route: { name: 'home' } }, undefined)
      await flush(element)
      expect(store.activeId).to.equal('page-1')
      delete store.manifest.metadata.site.homePageId
      store.manifest.items[1].metadata.published = true
    })

    it('does not change activeId for non-home routes', () => {
      store.activeId = null
      element._locationChanged({ route: { name: 'page-1' } }, undefined)
      expect(store.activeId).to.equal(null)
    })
  })

  describe('__styleReapply', () => {
    it('dispatches a resize event on globalThis', () => {
      let resizeFired = false
      const handler = () => { resizeFired = true }
      globalThis.addEventListener('resize', handler)
      try {
        element.__styleReapply()
        expect(resizeFired).to.equal(true)
      } finally {
        globalThis.removeEventListener('resize', handler)
      }
    })
  })

  describe('disposeDisposers', () => {
    it('clears the __disposer array', () => {
      element.__disposer = [() => {}, () => {}]
      element.disposeDisposers()
      expect(element.__disposer.length).to.equal(0)
    })

    it('is a no-op when __disposer is undefined', () => {
      element.__disposer = undefined
      expect(() => element.disposeDisposers()).to.not.throw()
    })
  })

  describe('resetActive', () => {
    it('pushes state and dispatches popstate and active-item-changed', () => {
      store.location = { baseUrl: '/' }
      let popstateFired = false
      let activeItemChanged = false
      const popstateHandler = () => { popstateFired = true }
      const activeItemHandler = () => { activeItemChanged = true }
      globalThis.addEventListener('popstate', popstateHandler)
      element.addEventListener('haxcms-active-item-changed', activeItemHandler)
      try {
        element.resetActive()
        expect(popstateFired).to.equal(true)
        expect(activeItemChanged).to.equal(true)
      } finally {
        globalThis.removeEventListener('popstate', popstateHandler)
        element.removeEventListener('haxcms-active-item-changed', activeItemHandler)
      }
    })
  })
})

describe('HAXCMSThemeWiring class methods', () => {
  let saved = {}

  beforeEach(() => {
    saved = {
      manifest: store.manifest,
      editMode: store.editMode,
      jwt: store.jwt,
      activeId: store.activeId,
    }
    store.manifest = makeManifest()
    store.editMode = false
    store.jwt = null
    store.activeId = null
  })

  afterEach(() => {
    store.manifest = saved.manifest
    store.editMode = saved.editMode
    store.jwt = saved.jwt
    store.activeId = saved.activeId
  })

  describe('connect / disconnect', () => {
    it('connect adds event listeners and disconnect aborts them', () => {
      const wiring = new HAXCMSThemeWiring(document.createElement('div'), false)
      const fakeEl = document.createElement('div')
      const injector = document.createElement('div')
      expect(() => wiring.connect(fakeEl, injector)).to.not.throw()
      // disconnect should abort the windowControllers
      expect(() => wiring.disconnect(fakeEl)).to.not.throw()
    })

    it('connect aborts previous windowControllers before creating new ones', () => {
      const wiring = new HAXCMSThemeWiring(document.createElement('div'), false)
      const fakeEl = document.createElement('div')
      const injector = document.createElement('div')
      wiring.connect(fakeEl, injector)
      // connecting again should abort the first set
      expect(() => wiring.connect(fakeEl, injector)).to.not.throw()
      wiring.disconnect(fakeEl)
    })
  })

  describe('_globalEditChanged', () => {
    it('sets editMode on the bound element from event detail', () => {
      const wiring = new HAXCMSThemeWiring(document.createElement('div'), false)
      const fakeEl = document.createElement('div')
      wiring._globalEditChanged.call(fakeEl, { detail: true })
      expect(fakeEl.editMode).to.equal(true)
    })
  })

  describe('_activeItemUpdate', () => {
    it('sets store.activeId from event detail id', () => {
      const wiring = new HAXCMSThemeWiring(document.createElement('div'), false)
      const fakeEl = document.createElement('div')
      wiring._activeItemUpdate.call(fakeEl, { detail: { id: 'page-1', title: 'Page One' } })
      expect(store.activeId).to.equal('page-1')
    })

    it('sets document title from event detail title', () => {
      const wiring = new HAXCMSThemeWiring(document.createElement('div'), false)
      const fakeEl = document.createElement('div')
      const originalTitle = globalThis.document.title
      wiring._activeItemUpdate.call(fakeEl, { detail: { id: 'page-1', title: 'Page One' } })
      expect(globalThis.document.title).to.include('Page One')
      globalThis.document.title = originalTitle
    })

    it('sets document title to routerManifest title when no detail id', () => {
      const wiring = new HAXCMSThemeWiring(document.createElement('div'), false)
      const fakeEl = document.createElement('div')
      const originalTitle = globalThis.document.title
      wiring._activeItemUpdate.call(fakeEl, { detail: {} })
      expect(globalThis.document.title).to.equal(store.routerManifest.title)
      globalThis.document.title = originalTitle
    })

    it('sets document title to routerManifest title when detail is falsy', () => {
      const wiring = new HAXCMSThemeWiring(document.createElement('div'), false)
      const fakeEl = document.createElement('div')
      const originalTitle = globalThis.document.title
      wiring._activeItemUpdate.call(fakeEl, { detail: null })
      expect(globalThis.document.title).to.equal(store.routerManifest.title)
      globalThis.document.title = originalTitle
    })
  })

  describe('_triggerUpdate', () => {
    it('dispatches haxcms-active-item-changed on the bound element', () => {
      const wiring = new HAXCMSThemeWiring(document.createElement('div'), false)
      const fakeEl = document.createElement('div')
      let received = false
      fakeEl.addEventListener('haxcms-active-item-changed', () => { received = true })
      wiring._triggerUpdate.call(fakeEl, {})
      expect(received).to.equal(true)
    })
  })
})
