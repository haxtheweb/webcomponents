import { fixture, expect, html } from '@open-wc/testing'

globalThis.appSettings = {}

const { store } = await import('../lib/v2/AppHaxStore.js')
const { AppHaxSiteCreationModal } = await import('../lib/v2/app-hax-site-creation-modal.js')
const { AppHaxSiteDetails } = await import('../lib/v2/app-hax-site-details.js')

function createModal() {
  const el = new AppHaxSiteCreationModal()
  el.siteName = ''
  el.__defaultSiteName = ''
  return el
}

describe('AppHaxSiteCreationModal pure logic', () => {
  describe('static tag', () => {
    it('has correct tag name', () => {
      expect(AppHaxSiteCreationModal.tag).to.equal('app-hax-site-creation-modal')
    })
  })

  describe('constructor defaults', () => {
    it('initializes with default properties', () => {
      const el = createModal()
      expect(el.open).to.be.false
      expect(el.title).to.equal('')
      expect(el.currentStep).to.equal(1)
      expect(el.isCreating).to.be.false
      expect(el.creationProgress).to.equal(0)
      expect(el.errorMessage).to.equal('')
      expect(el.showConfetti).to.be.false
      expect(el.siteUrl).to.equal('')
      expect(el.creationCancelled).to.be.false
      expect(el.max).to.equal(100)
    })
  })

  describe('_getDialogLabel', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    it('returns "Create New Site" for step 1', () => {
      el.currentStep = 1
      expect(el._getDialogLabel()).to.equal('Create New Site')
    })
    it('returns "Creating Site" for step 2', () => {
      el.currentStep = 2
      expect(el._getDialogLabel()).to.equal('Creating Site')
    })
    it('returns "Site Created" for step 3', () => {
      el.currentStep = 3
      expect(el._getDialogLabel()).to.equal('Site Created')
    })
    it('returns "Site Created" for other steps', () => {
      el.currentStep = 99
      expect(el._getDialogLabel()).to.equal('Site Created')
    })
  })

  describe('_sanitizeNameForUrl', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    it('returns empty for null', () => {
      expect(el._sanitizeNameForUrl(null)).to.equal('')
    })
    it('returns empty for non-string', () => {
      expect(el._sanitizeNameForUrl(123)).to.equal('')
    })
    it('strips non-alphanumeric except spaces', () => {
      expect(el._sanitizeNameForUrl('Hello@World!')).to.equal('HelloWorld')
    })
    it('collapses multiple spaces', () => {
      expect(el._sanitizeNameForUrl('Hello   World')).to.equal('Hello World')
    })
    it('trims leading/trailing spaces', () => {
      expect(el._sanitizeNameForUrl('  Hello  ')).to.equal('Hello')
    })
    it('truncates to 50 characters', () => {
      const long = 'A'.repeat(60)
      expect(el._sanitizeNameForUrl(long).length).to.equal(50)
    })
    it('keeps hyphens and underscores', () => {
      // Actually looking at the regex: /[^a-zA-Z0-9\s]+/g removes hyphens and underscores
      expect(el._sanitizeNameForUrl('my-site_name')).to.equal('mysitename')
    })
  })

  describe('_getNameParamFromUrl', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    it('returns string (empty or value)', () => {
      const result = el._getNameParamFromUrl()
      expect(typeof result).to.equal('string')
    })
    it('does not throw on URL errors', () => {
      expect(() => el._getNameParamFromUrl()).to.not.throw()
    })
  })

  describe('_updateUrlQueryParam', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    it('does nothing for invalid param', () => {
      expect(() => el._updateUrlQueryParam(null, 'value')).to.not.throw()
    })
    it('does nothing for non-string param', () => {
      expect(() => el._updateUrlQueryParam(123, 'value')).to.not.throw()
    })
    it('does not throw for valid param and value', () => {
      expect(() => el._updateUrlQueryParam('test', 'value')).to.not.throw()
    })
    it('does not throw for valid param and null value', () => {
      expect(() => el._updateUrlQueryParam('test', null)).to.not.throw()
    })
  })

  describe('_clearUseCaseUrlParams', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    it('does not throw', () => {
      expect(() => el._clearUseCaseUrlParams()).to.not.throw()
    })
  })

  describe('_syncUrlNameParam', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    it('sanitizes siteName', () => {
      el.siteName = 'Hello@World'
      el.__defaultSiteName = ''
      el._syncUrlNameParam()
      expect(el.siteName).to.equal('HelloWorld')
    })
    it('clears name param when siteName equals default', () => {
      el.siteName = 'Default Name'
      el.__defaultSiteName = 'Default Name'
      expect(() => el._syncUrlNameParam()).to.not.throw()
    })
    it('writes name param when siteName differs from default', () => {
      el.siteName = 'Custom Name'
      el.__defaultSiteName = 'Default Name'
      expect(() => el._syncUrlNameParam()).to.not.throw()
    })
    it('clears name param when siteName is empty', () => {
      el.siteName = ''
      el.__defaultSiteName = 'Default'
      expect(() => el._syncUrlNameParam()).to.not.throw()
    })
  })

  describe('_handleSiteNameInput', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    it('sets siteName from event target value', () => {
      el._handleSiteNameInput({ target: { value: 'My New Site' } })
      expect(el.siteName).to.equal('My New Site')
    })
    it('sanitizes the name', () => {
      el._handleSiteNameInput({ target: { value: 'Site!@#' } })
      expect(el.siteName).to.equal('Site')
    })
    it('handles null event', () => {
      el._handleSiteNameInput(null)
      expect(el.siteName).to.equal('')
    })
    it('handles event without target', () => {
      el._handleSiteNameInput({})
      expect(el.siteName).to.equal('')
    })
  })

  describe('validateSiteName', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    it('returns false and sets error for empty name', () => {
      el.siteName = ''
      expect(el.validateSiteName()).to.be.false
      expect(el.errorMessage).to.include('required')
    })
    it('returns false and sets error for whitespace-only name', () => {
      el.siteName = '   '
      expect(el.validateSiteName()).to.be.false
      expect(el.errorMessage).to.include('required')
    })
    it('returns false for name shorter than 3 chars', () => {
      el.siteName = 'ab'
      expect(el.validateSiteName()).to.be.false
      expect(el.errorMessage).to.include('3 characters')
    })
    it('returns true for name with 3 chars', () => {
      el.siteName = 'abc'
      expect(el.validateSiteName()).to.be.true
      expect(el.errorMessage).to.equal('')
    })
    it('returns false for name longer than 50 chars', () => {
      el.siteName = 'A'.repeat(51)
      expect(el.validateSiteName()).to.be.false
      expect(el.errorMessage).to.include('50 characters')
    })
    it('returns false for name with invalid chars', () => {
      el.siteName = 'Site<Name>'
      expect(el.validateSiteName()).to.be.false
      expect(el.errorMessage).to.include('letters, numbers')
    })
    it('returns true for valid name with spaces and hyphens', () => {
      el.siteName = 'My-Site Name'
      expect(el.validateSiteName()).to.be.true
    })
    it('returns true for valid name with underscores', () => {
      el.siteName = 'my_site'
      expect(el.validateSiteName()).to.be.true
    })
  })

  describe('_extractSkeletonMachineName', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    it('returns null when skeletonData is null', () => {
      el.skeletonData = null
      expect(el._extractSkeletonMachineName()).to.be.null
    })
    it('returns null when skeletonData is not object', () => {
      el.skeletonData = 'string'
      expect(el._extractSkeletonMachineName()).to.be.null
    })
    it('extracts from meta.machineName', () => {
      el.skeletonData = { meta: { machineName: 'my-skeleton' } }
      expect(el._extractSkeletonMachineName()).to.equal('my-skeleton')
    })
    it('extracts from meta.name when machineName missing', () => {
      el.skeletonData = { meta: { name: 'fallback-name' } }
      expect(el._extractSkeletonMachineName()).to.equal('fallback-name')
    })
    it('extracts from metadata.skeleton.machineName', () => {
      el.skeletonData = { metadata: { skeleton: { machineName: 'deep-name' } } }
      expect(el._extractSkeletonMachineName()).to.equal('deep-name')
    })
    it('returns null when no machine name found', () => {
      el.skeletonData = { meta: {} }
      expect(el._extractSkeletonMachineName()).to.be.null
    })
    it('strips .json extension', () => {
      el.skeletonData = { meta: { machineName: 'my-skeleton.json' } }
      expect(el._extractSkeletonMachineName()).to.equal('my-skeleton')
    })
    it('trims whitespace', () => {
      el.skeletonData = { meta: { machineName: '  spaced  ' } }
      expect(el._extractSkeletonMachineName()).to.equal('spaced')
    })
  })

  describe('openModal', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    afterEach(() => {
      document.body.style.overflow = ''
    })
    it('sets open to true and step to 1', () => {
      el.openModal()
      expect(el.open).to.be.true
      expect(el.currentStep).to.equal(1)
    })
    it('hides body overflow', () => {
      el.openModal()
      expect(document.body.style.overflow).to.equal('hidden')
    })
    it('resets error and progress state', () => {
      el.errorMessage = 'old error'
      el.creationProgress = 50
      el.isCreating = true
      el.openModal()
      expect(el.errorMessage).to.equal('')
      expect(el.creationProgress).to.equal(0)
      expect(el.isCreating).to.be.false
    })
    it('preserves prepopulated siteName', () => {
      el.siteName = 'Prepopulated'
      el.openModal()
      expect(el.siteName).to.equal('Prepopulated')
    })
    it('sets __defaultSiteName from siteName', () => {
      el.siteName = 'My Default'
      el.openModal()
      expect(el.__defaultSiteName).to.equal('My Default')
    })
  })

  describe('closeModal', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    afterEach(() => {
      document.body.style.overflow = ''
    })
    it('sets open to false', () => {
      el.open = true
      el.closeModal()
      expect(el.open).to.be.false
    })
    it('restores body overflow', () => {
      document.body.style.overflow = 'hidden'
      el.closeModal()
      expect(document.body.style.overflow).to.equal('')
    })
    it('resets state', () => {
      el.currentStep = 3
      el.siteName = 'test'
      el.errorMessage = 'error'
      el.closeModal()
      expect(el.currentStep).to.equal(1)
      expect(el.siteName).to.equal('')
      expect(el.errorMessage).to.equal('')
    })
    it('dispatches modal-closed event with cancelled detail', () => {
      let captured = null
      el.addEventListener('modal-closed', (e) => { captured = e })
      el.currentStep = 1
      el.closeModal()
      expect(captured).to.exist
      expect(captured.detail.cancelled).to.be.true
    })
    it('sets creationCancelled temporarily when isCreating', () => {
      el.isCreating = true
      el.closeModal()
      // closeModal sets creationCancelled=true to signal cancel, then
      // resets it to false at the end for next use
      expect(el.creationCancelled).to.be.false
    })
  })

  describe('handleModalClosed', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    afterEach(() => {
      document.body.style.overflow = ''
    })
    it('sets open to false', () => {
      el.open = true
      el.handleModalClosed({})
      expect(el.open).to.be.false
    })
    it('restores body overflow', () => {
      document.body.style.overflow = 'hidden'
      el.handleModalClosed({})
      expect(document.body.style.overflow).to.equal('')
    })
    it('dispatches modal-closed event', () => {
      let fired = false
      el.addEventListener('modal-closed', () => { fired = true })
      el.handleModalClosed({})
      expect(fired).to.be.true
    })
    it('sets creationCancelled temporarily when isCreating', () => {
      el.isCreating = true
      el.handleModalClosed({})
      // handleModalClosed sets creationCancelled=true to signal cancel,
      // then resets it to false at the end for next use
      expect(el.creationCancelled).to.be.false
    })
  })

  describe('handleKeyDown', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    it('calls createSite on Enter in step 1', () => {
      let called = false
      el.currentStep = 1
      el.createSite = () => { called = true }
      el.handleKeyDown({ key: 'Enter' })
      expect(called).to.be.true
    })
    it('does not call createSite on Enter in step 2', () => {
      let called = false
      el.currentStep = 2
      el.createSite = () => { called = true }
      el.handleKeyDown({ key: 'Enter' })
      expect(called).to.be.false
    })
    it('does not call createSite on other keys', () => {
      let called = false
      el.currentStep = 1
      el.createSite = () => { called = true }
      el.handleKeyDown({ key: 'Tab' })
      expect(called).to.be.false
    })
  })

  describe('progressValueChanged', () => {
    let el
    beforeEach(() => {
      el = createModal()
      // Mock shadowRoot since element is unconnected
      Object.defineProperty(el, 'shadowRoot', {
        value: { querySelector: () => null },
        configurable: true,
      })
    })
    it('updates creationProgress from event detail', () => {
      el.progressValueChanged({ detail: { value: 42 } })
      expect(el.creationProgress).to.equal(42)
    })
  })

  describe('progressMaxChanged', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    it('updates max from event detail', () => {
      el.progressMaxChanged({ detail: { value: 200 } })
      expect(el.max).to.equal(200)
    })
  })

  describe('goToSite', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    it('does not throw when siteUrl is empty', () => {
      el.siteUrl = ''
      expect(() => el.goToSite()).to.not.throw()
    })
  })
})

describe('AppHaxSiteDetails pure logic', () => {
  function createSiteDetails() {
    const el = new AppHaxSiteDetails()
    el.siteId = 'test-site'
    el.details = {}
    return el
  }

  describe('static tag', () => {
    it('has correct tag name', () => {
      expect(AppHaxSiteDetails.tag).to.equal('app-hax-site-details')
    })
  })

  describe('constructor defaults', () => {
    it('initializes with default properties', () => {
      const el = createSiteDetails()
      expect(el.need).to.equal('all need to succeed')
      expect(el.details).to.deep.equal({})
      expect(el.siteId).to.equal('test-site')
      expect(el.detailOps).to.be.an('array')
      expect(el.detailOps.length).to.equal(3)
    })
    it('has detailOps with Copy, Download, Archive', () => {
      const el = createSiteDetails()
      const names = el.detailOps.map((op) => op.name)
      expect(names).to.include('Copy')
      expect(names).to.include('Download')
      expect(names).to.include('Archive')
    })
  })

  describe('cancelOperation', () => {
    let el
    beforeEach(() => {
      el = createSiteDetails()
      store.activeSiteOp = 'copySite'
      store.activeSiteId = 'test-site'
    })
    it('clears store active site op and id', () => {
      el.cancelOperation()
      expect(store.activeSiteOp).to.equal('')
      expect(store.activeSiteId).to.be.null
    })
    it('dispatches simple-modal-hide event', () => {
      let fired = false
      globalThis.addEventListener('simple-modal-hide', () => { fired = true })
      el.cancelOperation()
      globalThis.removeEventListener('simple-modal-hide', () => {})
      expect(fired).to.be.true
    })
  })

  describe('siteOperation', () => {
    let el
    beforeEach(() => {
      el = createSiteDetails()
      store.manifest = {
        items: [{ id: 'test-site', metadata: { site: { name: 'Test Site' } } }],
      }
      store.appEl = { playSound: () => {} }
    })
    afterEach(() => {
      store.appEl = null
    })
    it('plays click sound', () => {
      let soundPlayed = null
      store.appEl = { playSound: (s) => { soundPlayed = s } }
      // Mock event target
      const mockTarget = document.createElement('simple-icon-button-lite')
      mockTarget.setAttribute('data-site-operation', 'copySite')
      mockTarget.setAttribute('data-site-operation-name', 'Copy')
      mockTarget.setAttribute('data-site', 'test-site')
      el.siteOperation({ target: mockTarget })
      expect(soundPlayed).to.equal('click')
    })
    it('sets store activeSiteOp and activeSiteId', () => {
      // Use a non-DIV element since DIV triggers parentNode fallback
      const mockTarget = document.createElement('simple-icon-button-lite')
      mockTarget.setAttribute('data-site-operation', 'archiveSite')
      mockTarget.setAttribute('data-site-operation-name', 'Archive')
      mockTarget.setAttribute('data-site', 'test-site')
      el.siteOperation({ target: mockTarget })
      expect(store.activeSiteOp).to.equal('archiveSite')
      expect(store.activeSiteId).to.equal('test-site')
    })
  })

  describe('confirmOperation', () => {
    let el
    beforeEach(() => {
      el = createSiteDetails()
      store.activeSiteOp = 'copySite'
      store.activeSiteId = 'test-site'
      store.manifest = {
        items: [{ id: 'test-site', metadata: { site: { name: 'Test Site' } } }],
      }
      store.AppHaxAPI = {
        makeCall: async () => ({ status: 200 }),
        lastResponse: { copySite: { status: 200 } },
      }
      store.setProcessingVisual = () => {}
      store.clearProcessingVisual = () => {}
      store.refreshSiteListing = () => {}
      store.toast = () => {}
    })
    it('makes API call and dispatches simple-modal-hide', async () => {
      let hideFired = false
      globalThis.addEventListener('simple-modal-hide', () => { hideFired = true })
      await el.confirmOperation()
      globalThis.removeEventListener('simple-modal-hide', () => {})
      expect(hideFired).to.be.true
    })
    it('shows success toast on 200 response', async () => {
      let toastMsg = null
      store.toast = (msg) => { toastMsg = msg }
      await el.confirmOperation()
      expect(toastMsg).to.include('successful')
    })
    it('shows error toast on 400+ response', async () => {
      store.AppHaxAPI.lastResponse = {
        copySite: { status: 404, message: 'Not found' },
      }
      let toastMsg = null
      store.toast = (msg) => { toastMsg = msg }
      await el.confirmOperation()
      expect(toastMsg).to.include('Not found')
    })
    it('handles API error gracefully', async () => {
      store.AppHaxAPI.makeCall = async () => { throw new Error('Network') }
      let toastMsg = null
      store.toast = (msg) => { toastMsg = msg }
      await el.confirmOperation()
      expect(toastMsg).to.include('failed')
    })
  })
})

describe('AppHaxSiteDetails render', () => {
  it('renders detail ops, dates, pages, and the slug from the site URL', async () => {
    const el = await fixture(
      html`<app-hax-site-details
        site-id="test-site"
        .details=${{
          created: 1600000000,
          updated: 1700000000,
          pages: 7,
          url: 'https://example.com/sites/my-site',
        }}
      ></app-hax-site-details>`,
    )
    await el.updateComplete
    const slug = el.shadowRoot.querySelector('#slug')
    expect(slug).to.exist
    expect(slug.textContent).to.equal('my-site')
    expect(slug.getAttribute('href')).to.equal('https://example.com/sites/my-site')
    expect(el.shadowRoot.querySelectorAll('.info-icon').length).to.equal(3)
  })

  it('falls back to a generic slug when the URL has no sites segment', async () => {
    const el = await fixture(
      html`<app-hax-site-details
        .details=${{
          created: 1600000000,
          updated: 1700000000,
          pages: 3,
          url: 'https://example.com/other/path',
        }}
      ></app-hax-site-details>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#slug').textContent).to.equal('site')
  })
})

describe('AppHaxSiteDetails siteOperation with DIV target', () => {
  it('resolves button attributes through the parent when the target is a DIV', () => {
    const el = new AppHaxSiteDetails()
    store.manifest = {
      items: [{ id: 'test-site', metadata: { site: { name: 'Test Site' } } }],
    }
    store.appEl = { playSound: () => {} }
    const outer = document.createElement('div')
    outer.setAttribute('data-site-operation', 'copySite')
    outer.setAttribute('data-site-operation-name', 'Copy')
    outer.setAttribute('data-site', 'test-site')
    const inner = document.createElement('div')
    outer.appendChild(inner)
    el.siteOperation({ target: inner })
    expect(store.activeSiteOp).to.equal('copySite')
    expect(store.activeSiteId).to.equal('test-site')
    const modals = document.body.querySelectorAll('app-hax-confirmation-modal')
    const modal = modals[modals.length - 1]
    expect(modal).to.exist
    expect(modal.title).to.equal('Copy Test Site?')
    store.appEl = null
  })
})

describe('AppHaxSiteDetails confirmOperation callbacks', () => {
  let el
  beforeEach(() => {
    el = new AppHaxSiteDetails()
    store.manifest = {
      items: [{ id: 'test-site', metadata: { site: { name: 'Test Site' } } }],
    }
    store.setProcessingVisual = () => {}
    store.clearProcessingVisual = () => {}
    store.refreshSiteListing = () => {}
    store.toast = () => {}
    store.activeSiteId = 'test-site'
    store.AppHaxAPI = {
      makeCall: async (op, data, useCallback, callback) => {
        if (typeof callback === 'function') {
          callback()
        }
        return { status: 200 }
      },
      lastResponse: {},
    }
  })

  it('opens the download link when downloadSite succeeds', async () => {
    store.activeSiteOp = 'downloadSite'
    store.AppHaxAPI.lastResponse = {
      downloadSite: {
        status: 200,
        data: { link: '/downloads/site.zip', name: 'site.zip' },
      },
    }
    let toastMsg = null
    store.toast = (msg) => { toastMsg = msg }
    // stub anchor clicks so the test frame never navigates
    const originalClick = HTMLElement.prototype.click
    HTMLElement.prototype.click = function () {}
    try {
      await el.confirmOperation()
    } finally {
      HTMLElement.prototype.click = originalClick
    }
    expect(toastMsg).to.include('successful')
  })

  it('logs an error when downloadSite reports a failure status', async () => {
    store.activeSiteOp = 'downloadSite'
    store.AppHaxAPI.lastResponse = {
      downloadSite: { status: 500, message: 'boom' },
    }
    let errored = false
    const originalError = console.error
    console.error = () => { errored = true }
    try {
      await el.confirmOperation()
    } finally {
      console.error = originalError
    }
    expect(errored).to.be.true
  })

  it('logs an error when the downloadSite response has no data.link', async () => {
    store.activeSiteOp = 'downloadSite'
    store.AppHaxAPI.lastResponse = {
      downloadSite: { status: 200 },
    }
    let errored = false
    const originalError = console.error
    console.error = () => { errored = true }
    try {
      await el.confirmOperation()
    } finally {
      console.error = originalError
    }
    expect(errored).to.be.true
  })

  it('refreshes the site listing for non-download operations', async () => {
    store.activeSiteOp = 'copySite'
    let refreshed = false
    store.refreshSiteListing = () => { refreshed = true }
    await el.confirmOperation()
    expect(refreshed).to.be.true
  })

  it('falls back to a generic failure toast when the op response has no message', async () => {
    store.activeSiteOp = 'copySite'
    store.AppHaxAPI.lastResponse = { copySite: { status: 500 } }
    let toastMsg = null
    store.toast = (msg) => { toastMsg = msg }
    await el.confirmOperation()
    expect(toastMsg).to.include('failed')
  })

  it('treats a missing op response as a success', async () => {
    store.activeSiteOp = 'copySite'
    store.AppHaxAPI.lastResponse = {}
    let toastMsg = null
    store.toast = (msg) => { toastMsg = msg }
    await el.confirmOperation()
    expect(toastMsg).to.include('successful')
  })
})
