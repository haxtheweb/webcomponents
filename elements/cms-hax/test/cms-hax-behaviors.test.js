import { fixture, expect, html } from '@open-wc/testing'
import { CmsHax } from '../cms-hax.js'
import { HAXStore } from '@haxtheweb/hax-body/lib/hax-store.js'

// a cms-hax subclass with a neutral render so tests exercise the cms-hax
// logic without booting the full h-a-x appstore UI (the real render + h-a-x
// wiring is covered by the cms-hax.test.js fixture with a live connection)
class TestCmsHax extends CmsHax {
  static get tag() {
    return 'test-cms-hax'
  }
  render() {
    return html`<div>test</div>`
  }
}
customElements.define(TestCmsHax.tag, TestCmsHax)

// stub/restore pattern for the HAXStore singleton (per hax-body tests)
describe('cms-hax deep behavior', () => {
  let el
  let originalEditMode
  let originalSkipExitTrap
  let originalReady
  let originalValidTagList
  let originalElementAlign
  let originalHaxTray
  let originalActiveHaxBody
  let originalFetch
  let importCalls

  beforeEach(async () => {
    originalEditMode = HAXStore.editMode
    originalSkipExitTrap = HAXStore.skipExitTrap
    originalReady = HAXStore.ready
    originalValidTagList = HAXStore.validTagList
    originalElementAlign = HAXStore.elementAlign
    originalHaxTray = HAXStore.haxTray
    originalActiveHaxBody = HAXStore.activeHaxBody
    originalFetch = globalThis.fetch
    importCalls = []
    HAXStore.editMode = false
    HAXStore.skipExitTrap = false
    HAXStore.ready = false
    HAXStore.validTagList = ['p', 'div']
    HAXStore.elementAlign = null
    HAXStore.haxTray = { hidePanelOps: null, offsetMargin: null }
    HAXStore.activeHaxBody = {
      importContent(content) {
        importCalls.push(content)
      },
      haxToContent: async () => '<p>converted</p>',
    }
    el = await fixture(html`<test-cms-hax></test-cms-hax>`)
    await el.updateComplete
  })

  afterEach(() => {
    HAXStore.editMode = originalEditMode
    HAXStore.skipExitTrap = originalSkipExitTrap
    HAXStore.ready = originalReady
    HAXStore.validTagList = originalValidTagList
    HAXStore.elementAlign = originalElementAlign
    HAXStore.haxTray = originalHaxTray
    HAXStore.activeHaxBody = originalActiveHaxBody
    globalThis.fetch = originalFetch
  })

  it('_computeRedirectOnSave only redirects with a location', () => {
    expect(el._computeRedirectOnSave(undefined)).to.equal(false)
    expect(el._computeRedirectOnSave('/somewhere')).to.equal(true)
  })

  it('updated derives redirectOnSave from redirectLocation', async () => {
    expect(el.redirectOnSave).to.equal(undefined)
    el.redirectLocation = '/after-save'
    await el.updateComplete
    expect(el.redirectOnSave).to.equal(true)
  })

  it('_makeAppStore decodes entities in the connection value', async () => {
    el.appStoreConnection = '{&quot;url&quot;:&quot;https://a.b/c.json&quot;}'
    await el.updateComplete
    expect(el.__appStore).to.equal('{"url":"https://a.b/c.json"}')
  })

  it('appstore loaded flips ready and imports template content once', async () => {
    const withTemplate = await fixture(
      html`<test-cms-hax><template>PAGE-CONTENT</template></test-cms-hax>`,
    )
    globalThis.dispatchEvent(
      new CustomEvent('hax-store-app-store-loaded', { detail: {} }),
    )
    await new Promise((r) => setTimeout(r, 20))
    expect(withTemplate.ready).to.equal(true)
    expect(importCalls.length).to.equal(1)
    expect(importCalls[0]).to.equal('PAGE-CONTENT')
    // the import only ever happens once per element
    withTemplate._activeHaxBodyUpdated(true)
    expect(importCalls.length).to.equal(1)
  })

  it('openDefault waits for the import then flips editMode', async function () {
    this.timeout(6000)
    const el2 = await fixture(
      html`<test-cms-hax open-default><template>X</template></test-cms-hax>`,
    )
    el2._activeHaxBodyUpdated(true)
    expect(HAXStore.editMode).to.equal(false)
    await new Promise((r) => setTimeout(r, 2200))
    expect(HAXStore.editMode).to.equal(true)
  })

  it('_noticeTagChanges does nothing until the store is ready', async () => {
    HAXStore.ready = false
    el._noticeTagChanges(['media-image'], true, '10px', 'right')
    await new Promise((r) => setTimeout(r, 20))
    expect(HAXStore.haxTray.hidePanelOps).to.equal(null)
    expect(HAXStore.elementAlign).to.equal(null)
  })

  it('_noticeTagChanges merges allowed tags and applies tray settings', async () => {
    HAXStore.ready = true
    el._noticeTagChanges(['media-image', 'place-holder'], true, '10px', 'right')
    await new Promise((r) => setTimeout(r, 20))
    expect(HAXStore.validTagList.includes('media-image')).to.equal(true)
    expect(HAXStore.validTagList.includes('place-holder')).to.equal(true)
    expect(HAXStore.haxTray.hidePanelOps).to.equal(true)
    expect(HAXStore.haxTray.offsetMargin).to.equal('10px')
    expect(HAXStore.elementAlign).to.equal('right')
  })

  it('hax-store-ready wires the tray settings and aborts the ready listener', async () => {
    HAXStore.ready = true
    const el2 = await fixture(
      html`<test-cms-hax
        .allowedTags=${['video-player']}
        .hidePanelOps=${true}
        .offsetMargin=${'20px'}
        .elementAlign=${'center'}
      ></test-cms-hax>`,
    )
    globalThis.dispatchEvent(new CustomEvent('hax-store-ready', { detail: {} }))
    await new Promise((r) => setTimeout(r, 30))
    expect(HAXStore.haxTray.hidePanelOps).to.equal(true)
    expect(HAXStore.haxTray.offsetMargin).to.equal('20px')
    expect(HAXStore.elementAlign).to.equal('center')
    expect(HAXStore.validTagList.includes('video-player')).to.equal(true)
    expect(el2.windowControllersReady.signal.aborted).to.equal(true)
  })

  it('__applyMO observes the active body when syncBody is set', async () => {
    const fakeBody = globalThis.document.createElement('div')
    globalThis.document.body.appendChild(fakeBody)
    HAXStore.activeHaxBody = fakeBody
    HAXStore.activeHaxBody.haxToContent = async () => '<p>converted</p>'
    const synced = await fixture(html`<test-cms-hax sync-body></test-cms-hax>`)
    synced.__applyMO()
    expect(synced._observer === null).to.equal(false)
    const captured = []
    synced.addEventListener('hax-body-content-changed', (e) =>
      captured.push(e.detail),
    )
    fakeBody.appendChild(globalThis.document.createElement('p'))
    await new Promise((r) => setTimeout(r, 60))
    expect(captured.length).to.equal(1)
    expect(captured[0]).to.equal('<p>converted</p>')
    // mutations inside the lock window are suppressed
    fakeBody.appendChild(globalThis.document.createElement('p'))
    await new Promise((r) => setTimeout(r, 30))
    expect(captured.length).to.equal(1)
    // after the lock releases, mutations flow again
    await new Promise((r) => setTimeout(r, 150))
    fakeBody.appendChild(globalThis.document.createElement('p'))
    await new Promise((r) => setTimeout(r, 60))
    expect(captured.length).to.equal(2)
    // disconnect tears the observer down
    synced.remove()
    expect(synced._observer).to.equal(null)
    fakeBody.remove()
  })

  it('__applyMO is a no-op without syncBody or an active body', async () => {
    el.__applyMO()
    expect(el._observer).to.equal(undefined)
    const synced = await fixture(html`<test-cms-hax sync-body></test-cms-hax>`)
    HAXStore.activeHaxBody = null
    synced.__applyMO()
    expect(synced._observer).to.equal(undefined)
    synced.remove()
  })

  it('_saveFired posts the value and fires saved events', async () => {
    const calls = []
    globalThis.fetch = async (url, options) => {
      calls.push({ url: String(url), options })
      return { ok: true }
    }
    const el2 = await fixture(
      html`<test-cms-hax end-point="https://api.example/save"></test-cms-hax>`,
    )
    const saved = []
    el2.addEventListener('cms-hax-saved', (e) => saved.push(e.detail))
    const toasts = []
    const toastListener = (e) => toasts.push(e.detail)
    globalThis.addEventListener('simple-toast-show', toastListener)
    globalThis.dispatchEvent(
      new CustomEvent('hax-save-body-value', {
        detail: { value: 'PAGE-CONTENT' },
      }),
    )
    await new Promise((r) => setTimeout(r, 30))
    globalThis.removeEventListener('simple-toast-show', toastListener)
    el2.remove()
    expect(calls.length).to.equal(1)
    expect(calls[0].url).to.equal('https://api.example/save')
    expect(calls[0].options.method).to.equal('PUT')
    expect(calls[0].options.body).to.equal('PAGE-CONTENT')
    expect(saved.length).to.equal(1)
    expect(saved[0]).to.equal(true)
    expect(toasts.length).to.equal(1)
    expect(toasts[0].text).to.equal('Saved!')
    expect(HAXStore.skipExitTrap).to.equal(true)
  })

  it('_saveFired respects keepEditMode and hideMessage', async () => {
    const calls = []
    globalThis.fetch = async () => {
      calls.push(1)
      return { ok: true }
    }
    const el2 = await fixture(
      html`<test-cms-hax
        end-point="https://api.example/save"
        method="POST"
        hide-message
      ></test-cms-hax>`,
    )
    HAXStore.editMode = true
    const toasts = []
    const toastListener = (e) => toasts.push(e.detail)
    globalThis.addEventListener('simple-toast-show', toastListener)
    globalThis.dispatchEvent(
      new CustomEvent('hax-save-body-value', {
        detail: { value: 'X', keepEditMode: true },
      }),
    )
    await new Promise((r) => setTimeout(r, 30))
    globalThis.removeEventListener('simple-toast-show', toastListener)
    el2.remove()
    // edit mode kept because keepEditMode was requested
    expect(HAXStore.editMode).to.equal(true)
    // hideMessage suppresses the toast
    expect(toasts.length).to.equal(0)
    expect(calls.length).to.equal(1)
  })

  it('_saveFired is a no-op without an endPoint and survives fetch errors', async () => {
    const calls = []
    globalThis.fetch = async () => {
      calls.push(1)
      throw new Error('offline')
    }
    globalThis.dispatchEvent(
      new CustomEvent('hax-save-body-value', { detail: { value: 'X' } }),
    )
    await new Promise((r) => setTimeout(r, 30))
    // no live element has an endPoint: nothing fetched
    expect(calls.length).to.equal(0)
    const el2 = await fixture(
      html`<test-cms-hax end-point="https://api.example/broken"></test-cms-hax>`,
    )
    globalThis.dispatchEvent(
      new CustomEvent('hax-save-body-value', { detail: { value: 'X' } }),
    )
    await new Promise((r) => setTimeout(r, 30))
    el2.remove()
    // failing fetch fails silently without crashing
    expect(calls.length).to.equal(1)
    expect(el2.ready).to.equal(false)
  })

  it('_cancelFired exits edit mode without redirecting by default', async () => {
    HAXStore.editMode = true
    globalThis.dispatchEvent(new CustomEvent('hax-cancel', { detail: {} }))
    await new Promise((r) => setTimeout(r, 20))
    expect(HAXStore.skipExitTrap).to.equal(true)
    expect(HAXStore.editMode).to.equal(false)
  })

  it('listeners are torn down on disconnect', async () => {
    // remove every live test-cms-hax in this session so none respond
    const live = [
      ...globalThis.document.body.querySelectorAll('test-cms-hax'),
    ]
    live.forEach((node) => node.remove())
    HAXStore.editMode = true
    globalThis.dispatchEvent(new CustomEvent('hax-cancel', { detail: {} }))
    await new Promise((r) => setTimeout(r, 20))
    // no connected element reacted to cancel
    expect(HAXStore.editMode).to.equal(true)
  })

  it('passes the a11y audit on its shadow dom', async () => {
    await expect(el).shadowDom.to.be.accessible()
  })
})
