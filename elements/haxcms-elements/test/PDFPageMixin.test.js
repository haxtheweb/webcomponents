import { expect } from '@open-wc/testing'
import { LitElement } from 'lit'
import { store } from '../lib/core/haxcms-site-store.js'
import { PDFPageMixin } from '../lib/core/utils/PDFPageMixin.js'

// Covers the super-daemon option registration in the constructor, the
// PDFPageButton template states, and the downloadPDFviaMicro fetch/blob
// pipeline including error paths.

class PDFHost extends PDFPageMixin(LitElement) {}
if (!globalThis.customElements.get('pdf-page-test-host')) {
  globalThis.customElements.define('pdf-page-test-host', PDFHost)
}

function makeManifestWithActive() {
  return {
    id: 'pdf-site',
    title: 'PDF Site',
    metadata: {
      site: { name: 'pdf-site', lang: 'en' },
      platform: {},
      theme: { element: 'test-theme', variables: {}, regions: {} },
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
        metadata: { published: true },
      },
    ],
  }
}

describe('PDFPageMixin', () => {
  let savedManifest
  let savedActiveId
  let originalFetch
  let originalCreateObjectURL
  let originalRevokeObjectURL
  let originalClick

  beforeEach(() => {
    savedManifest = store.manifest
    savedActiveId = store.activeId
    originalFetch = globalThis.fetch
    originalCreateObjectURL = globalThis.URL.createObjectURL
    originalRevokeObjectURL = globalThis.URL.revokeObjectURL
    originalClick = HTMLElement.prototype.click
    store.manifest = makeManifestWithActive()
    store.activeId = null
  })

  afterEach(() => {
    store.manifest = savedManifest
    store.activeId = savedActiveId
    globalThis.fetch = originalFetch
    globalThis.URL.createObjectURL = originalCreateObjectURL
    globalThis.URL.revokeObjectURL = originalRevokeObjectURL
    HTMLElement.prototype.click = originalClick
  })

  it('registers a super-daemon PDF option on construction', () => {
    // the constructor dispatches the event before the element can ever be
    // attached, so no ancestor listener can observe it; intercept
    // dispatchEvent for this one event type instead
    const originalDispatch = EventTarget.prototype.dispatchEvent
    let received = null
    EventTarget.prototype.dispatchEvent = function (event) {
      if (event && event.type === 'super-daemon-define-option') {
        received = event.detail
      }
      return originalDispatch.call(this, event)
    }
    try {
      globalThis.document.createElement('pdf-page-test-host')
    } finally {
      EventTarget.prototype.dispatchEvent = originalDispatch
    }
    expect(received).to.exist
    expect(received.title).to.equal('Download PDF')
    expect(received.icon).to.equal('lrn:pdf')
    expect(received.value.method).to.equal('downloadPDFviaMicro')
    expect(received.context).to.equal('CMS')
    expect(received.eventName).to.equal('super-daemon-element-method')
    expect(received.path).to.equal('CMS/page/pdf')
  })

  it('sets i18n defaults and loading flag on construction', () => {
    const el = globalThis.document.createElement('pdf-page-test-host')
    expect(el.t.downloadPdf).to.equal('Download PDF')
    expect(el.t.downloadingPdfPleaseWait).to.equal('Downloading PDF, please wait')
    expect(el.__pdfLoading).to.equal(false)
  })

  it('exposes __pdfLoading as a reactive property', () => {
    expect(PDFHost.properties.__pdfLoading.type).to.equal(Boolean)
  })

  it('PDFPageButton renders the download button and tooltip', () => {
    const el = globalThis.document.createElement('pdf-page-test-host')
    const tpl = el.PDFPageButton('bottom')
    expect(tpl).to.exist
    expect(tpl.strings.join('')).to.include('simple-icon-button-lite')
    expect(tpl.strings.join('')).to.include('simple-tooltip')
    expect(tpl.values).to.include('lrn:pdf')
    expect(tpl.values).to.include('Download PDF')
  })

  it('PDFPageButton shows the loading icon and label while loading', () => {
    const el = globalThis.document.createElement('pdf-page-test-host')
    el.__pdfLoading = true
    const tpl = el.PDFPageButton()
    expect(tpl.values).to.include('hax:loading')
    expect(tpl.values).to.include('Downloading PDF, please wait')
  })

  it('downloadPDFviaMicro fetches the export endpoint and clicks a download link', async () => {
    store.activeId = 'page-1'
    let fetchedUrl = null
    globalThis.fetch = async (url) => {
      fetchedUrl = url
      return {
        ok: true,
        blob: async () => new Blob(['pdf-bytes'], { type: 'application/pdf' }),
      }
    }
    const objectUrls = []
    globalThis.URL.createObjectURL = (blob) => {
      const url = `blob:fake-${objectUrls.length}`
      objectUrls.push(url)
      return url
    }
    let revoked = null
    globalThis.URL.revokeObjectURL = (url) => {
      revoked = url
    }
    let clicked = null
    HTMLElement.prototype.click = function () {
      clicked = this
    }

    const el = globalThis.document.createElement('pdf-page-test-host')
    globalThis.document.body.appendChild(el)
    try {
      await el.downloadPDFviaMicro({})
      expect(el.__pdfLoading).to.equal(false)
      expect(fetchedUrl).to.include('x/api/v1/items/page-1/export/pdf')
      expect(clicked).to.exist
      expect(clicked.download).to.equal('Page One.pdf')
      expect(clicked.target).to.equal('_blank')
      // link is appended then removed; object URL revoked
      expect(clicked.parentNode).to.equal(null)
      expect(revoked).to.equal(objectUrls[0])
    } finally {
      el.remove()
    }
  })

  it('downloadPDFviaMicro resets the loading flag on a failed response', async () => {
    store.activeId = 'page-1'
    globalThis.fetch = async () => ({ ok: false, status: 500 })
    const el = globalThis.document.createElement('pdf-page-test-host')
    await el.downloadPDFviaMicro({})
    expect(el.__pdfLoading).to.equal(false)
  })

  it('downloadPDFviaMicro resets the loading flag when there is no active item', async () => {
    store.activeId = null
    let fetchCalled = false
    globalThis.fetch = async () => {
      fetchCalled = true
      return { ok: true }
    }
    const el = globalThis.document.createElement('pdf-page-test-host')
    await el.downloadPDFviaMicro({})
    expect(el.__pdfLoading).to.equal(false)
    expect(fetchCalled).to.equal(false)
  })

  it('downloadPDFviaMicro resets the loading flag when fetch rejects', async () => {
    store.activeId = 'page-1'
    globalThis.fetch = async () => {
      throw new Error('network down')
    }
    const el = globalThis.document.createElement('pdf-page-test-host')
    await el.downloadPDFviaMicro({})
    expect(el.__pdfLoading).to.equal(false)
  })
})
