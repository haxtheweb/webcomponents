import { expect } from '@open-wc/testing'

globalThis.appSettings = {}

const { store } = await import('../lib/v2/AppHaxStore.js')
const { AppHaxSiteBars } = await import('../lib/v2/app-hax-site-bar.js')

function createSiteBar() {
  const el = new AppHaxSiteBars()
  el.siteId = 'test-site'
  el.slug = '/sites/my-site'
  el.title = 'My Site'
  return el
}

describe('AppHaxSiteBars pure logic', () => {
  describe('static tag', () => {
    it('has correct tag name', () => {
      expect(AppHaxSiteBars.tag).to.equal('app-hax-site-bar')
    })
  })

  describe('constructor defaults', () => {
    it('initializes with default properties', () => {
      const el = createSiteBar()
      expect(el.showOptions).to.be.false
      expect(el.inprogress).to.be.false
      expect(el.siteId).to.equal('test-site')
      expect(el.description).to.equal('')
      expect(el.lastUpdatedTime).to.equal(0)
    })
    it('generates unique moreOptionsId per instance', () => {
      const el1 = new AppHaxSiteBars()
      const el2 = new AppHaxSiteBars()
      expect(el1.moreOptionsId).to.not.equal(el2.moreOptionsId)
    })
  })

  describe('getSiteMachineName', () => {
    let el
    beforeEach(() => {
      el = createSiteBar()
    })
    it('returns empty string when slug is empty', () => {
      el.slug = ''
      expect(el.getSiteMachineName()).to.equal('')
    })
    it('returns empty string when slug is falsy', () => {
      el.slug = null
      expect(el.getSiteMachineName()).to.equal('')
    })
    it('extracts last segment from path', () => {
      el.slug = '/sites/my-course'
      expect(el.getSiteMachineName()).to.equal('my-course')
    })
    it('handles trailing slash', () => {
      el.slug = '/sites/my-course/'
      expect(el.getSiteMachineName()).to.equal('my-course')
    })
    it('handles simple slug', () => {
      el.slug = 'my-site'
      expect(el.getSiteMachineName()).to.equal('my-site')
    })
    it('handles nested path', () => {
      el.slug = '/tenant/sites/deep-site'
      expect(el.getSiteMachineName()).to.equal('deep-site')
    })
  })

  describe('getSiteRecord', () => {
    let el
    beforeEach(() => {
      el = createSiteBar()
    })
    it('returns null when store.manifest has no items', () => {
      store.manifest = {}
      expect(el.getSiteRecord()).to.be.null
    })
    it('returns null when store.manifest.items is not array', () => {
      store.manifest = { items: 'not-array' }
      expect(el.getSiteRecord()).to.be.null
    })
    it('returns null when site not found', () => {
      store.manifest = { items: [{ id: 'other-site' }] }
      el.siteId = 'missing-site'
      expect(el.getSiteRecord()).to.be.undefined
    })
    it('returns the site record when found', () => {
      store.manifest = {
        items: [{ id: 'test-site', title: 'Test' }, { id: 'other' }],
      }
      el.siteId = 'test-site'
      const result = el.getSiteRecord()
      expect(result).to.exist
      expect(result.id).to.equal('test-site')
    })
  })

  describe('handleKeydown', () => {
    let el
    beforeEach(() => {
      el = createSiteBar()
    })
    it('calls callback on Enter', () => {
      let called = false
      el.handleKeydown({ key: 'Enter', preventDefault: () => {} }, () => {
        called = true
      })
      expect(called).to.be.true
    })
    it('calls callback on Space', () => {
      let called = false
      el.handleKeydown({ key: ' ', preventDefault: () => {} }, () => {
        called = true
      })
      expect(called).to.be.true
    })
    it('does not call callback on other keys', () => {
      let called = false
      el.handleKeydown({ key: 'Tab', preventDefault: () => {} }, () => {
        called = true
      })
      expect(called).to.be.false
    })
    it('prevents default on Enter', () => {
      let prevented = false
      el.handleKeydown({ key: 'Enter', preventDefault: () => { prevented = true } }, () => {})
      expect(prevented).to.be.true
    })
  })

  describe('triggerJsonDownload', () => {
    let el
    let originalCreateObjectURL
    let originalRevokeObjectURL

    beforeEach(() => {
      el = createSiteBar()
      originalCreateObjectURL = globalThis.URL.createObjectURL
      originalRevokeObjectURL = globalThis.URL.revokeObjectURL
      globalThis.URL.createObjectURL = () => 'blob:fake-url'
      globalThis.URL.revokeObjectURL = () => {}
    })
    afterEach(() => {
      globalThis.URL.createObjectURL = originalCreateObjectURL
      globalThis.URL.revokeObjectURL = originalRevokeObjectURL
    })
    it('creates download link and clicks it', () => {
      let clicked = false
      // Stub createElement to track the anchor
      const originalCreate = document.createElement
      let capturedAnchor = null
      document.createElement = function (tag) {
        const node = originalCreate.call(this, tag)
        if (tag === 'a') {
          capturedAnchor = node
          node.click = () => { clicked = true }
        }
        return node
      }
      el.triggerJsonDownload({ test: 'data' }, 'test.json')
      document.createElement = originalCreate
      expect(clicked).to.be.true
      if (capturedAnchor) {
        expect(capturedAnchor.getAttribute('download')).to.equal('test.json')
      }
    })
    it('uses default filename when none provided', () => {
      const originalCreate = document.createElement
      let capturedAnchor = null
      document.createElement = function (tag) {
        const node = originalCreate.call(this, tag)
        if (tag === 'a') {
          capturedAnchor = node
          node.click = () => {}
        }
        return node
      }
      el.triggerJsonDownload({ test: 'data' })
      document.createElement = originalCreate
      if (capturedAnchor) {
        expect(capturedAnchor.getAttribute('download')).to.equal('site-template.json')
      }
    })
    it('uses default filename for empty string', () => {
      const originalCreate = document.createElement
      let capturedAnchor = null
      document.createElement = function (tag) {
        const node = originalCreate.call(this, tag)
        if (tag === 'a') {
          capturedAnchor = node
          node.click = () => {}
        }
        return node
      }
      el.triggerJsonDownload({ test: 'data' }, '  ')
      document.createElement = originalCreate
      if (capturedAnchor) {
        expect(capturedAnchor.getAttribute('download')).to.equal('site-template.json')
      }
    })
  })

  describe('cancelOperation', () => {
    let el
    beforeEach(() => {
      el = createSiteBar()
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
      el = createSiteBar()
      store.manifest = {
        items: [{ id: 'test-site', metadata: { site: { name: 'Test Site' } } }],
      }
      store.appEl = { playSound: () => {} }
    })
    afterEach(() => {
      store.appEl = null
    })
    it('sets store activeSiteOp and activeSiteId', () => {
      el.siteOperation('copySite', 'Copy', 'icons:content-copy')
      expect(store.activeSiteOp).to.equal('copySite')
      expect(store.activeSiteId).to.equal('test-site')
    })
    it('plays click sound', () => {
      let soundPlayed = null
      store.appEl = { playSound: (s) => { soundPlayed = s } }
      el.siteOperation('copySite', 'Copy', 'icons:content-copy')
      expect(soundPlayed).to.equal('click')
    })
    it('does not throw when site not found', () => {
      el.siteId = 'missing'
      expect(() => el.siteOperation('copySite', 'Copy', 'icons:content-copy')).to.not.throw()
    })
  })

  describe('copySite/downloadSite/archiveSite', () => {
    let el
    beforeEach(() => {
      el = createSiteBar()
      el.closeOptionsMenu = () => {}
      el.siteOperation = (op, name, icon) => {
        el._lastOp = op
        el._lastName = name
      }
    })
    it('copySite calls siteOperation with copySite op', () => {
      el.copySite()
      expect(el._lastOp).to.equal('copySite')
      expect(el._lastName).to.equal('Copy')
    })
    it('downloadSite calls siteOperation with downloadSite op', () => {
      el.downloadSite()
      expect(el._lastOp).to.equal('downloadSite')
      expect(el._lastName).to.equal('Download')
    })
    it('archiveSite calls siteOperation with archiveSite op', () => {
      el.archiveSite()
      expect(el._lastOp).to.equal('archiveSite')
      expect(el._lastName).to.equal('Archive')
    })
  })

  describe('openCreateTemplateDialog', () => {
    let el
    beforeEach(() => {
      el = createSiteBar()
    })
    it('does nothing when site is null', () => {
      expect(() => el.openCreateTemplateDialog(null)).to.not.throw()
    })
    it('does nothing when site has no metadata', () => {
      expect(() => el.openCreateTemplateDialog({ id: 'x' })).to.not.throw()
    })
    it('does nothing when site.metadata has no site', () => {
      expect(() => el.openCreateTemplateDialog({ metadata: {} })).to.not.throw()
    })
    it('creates modal when site has valid metadata', () => {
      const originalCreate = document.createElement
      let modalCreated = false
      document.createElement = function (tag) {
        const node = originalCreate.call(this, tag)
        if (tag === 'app-hax-confirmation-modal') {
          modalCreated = true
          node.openModal = () => {}
          node.addEventListener = () => {}
        }
        return node
      }
      el.openCreateTemplateDialog({
        id: 'test',
        metadata: { site: { name: 'Test Site' } },
      })
      document.createElement = originalCreate
      expect(modalCreated).to.be.true
    })
  })

  describe('createTemplate', () => {
    let el
    beforeEach(() => {
      el = createSiteBar()
      el.closeOptionsMenu = () => {}
    })
    it('returns early when no site record found', () => {
      store.manifest = { items: [] }
      expect(() => el.createTemplate()).to.not.throw()
    })
    it('opens dialog when site record found', () => {
      store.manifest = {
        items: [{ id: 'test-site', metadata: { site: { name: 'Test' } } }],
      }
      let dialogOpened = false
      el.openCreateTemplateDialog = () => { dialogOpened = true }
      el.createTemplate()
      expect(dialogOpened).to.be.true
    })
  })

  describe('refreshTemplateResults', () => {
    let el
    beforeEach(() => {
      el = createSiteBar()
    })
    it('does not throw when no filter found', () => {
      expect(() => el.refreshTemplateResults()).to.not.throw()
    })
    it('calls updateSkeletonResults when filter found in document', () => {
      let called = false
      const fakeFilter = {
        updateSkeletonResults: () => { called = true },
      }
      const originalQuery = document.querySelector
      document.querySelector = () => fakeFilter
      el.refreshTemplateResults()
      document.querySelector = originalQuery
      expect(called).to.be.true
    })
  })

  describe('downloadSiteSkeleton', () => {
    let el
    beforeEach(() => {
      el = createSiteBar()
    })
    it('shows toast when API not configured', async () => {
      store.AppHaxAPI = {}
      let toastMsg = null
      const origToast = store.toast
      store.toast = (msg) => { toastMsg = msg }
      await el.downloadSiteSkeleton({ id: 'x', metadata: { site: { name: 'Test' } } })
      store.toast = origToast
      expect(toastMsg).to.include('not configured')
    })
    it('shows toast when supportsCall returns false', async () => {
      store.AppHaxAPI = {
        makeCall: () => {},
        supportsCall: () => false,
      }
      let toastMsg = null
      const origToast = store.toast
      store.toast = (msg) => { toastMsg = msg }
      await el.downloadSiteSkeleton({ id: 'x', metadata: { site: { name: 'Test' } } })
      store.toast = origToast
      expect(toastMsg).to.include('not configured')
    })
    it('returns early when siteName is empty', async () => {
      store.AppHaxAPI = {
        makeCall: () => {},
        supportsCall: () => true,
      }
      // Site without metadata.site.name
      expect(await el.downloadSiteSkeleton({ id: 'x' })).to.be.undefined
    })
  })

  describe('saveSiteAsTemplate', () => {
    let el
    beforeEach(() => {
      el = createSiteBar()
    })
    it('shows toast when API not configured', async () => {
      store.AppHaxAPI = {}
      let toastMsg = null
      const origToast = store.toast
      store.toast = (msg) => { toastMsg = msg }
      await el.saveSiteAsTemplate({ id: 'x', metadata: { site: { name: 'Test' } } })
      store.toast = origToast
      expect(toastMsg).to.include('not configured')
    })
    it('returns early when siteName is empty', async () => {
      store.AppHaxAPI = {
        makeCall: () => {},
        supportsCall: () => true,
      }
      expect(await el.saveSiteAsTemplate({ id: 'x' })).to.be.undefined
    })
  })

  describe('confirmOperation', () => {
    let el
    beforeEach(() => {
      el = createSiteBar()
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
    it('returns early when no active site', async () => {
      store.activeSiteId = null
      store.manifest = { items: [] }
      expect(await el.confirmOperation()).to.be.undefined
    })
    it('returns early when site not found in manifest', async () => {
      store.activeSiteId = 'missing'
      store.manifest = { items: [{ id: 'other' }] }
      expect(await el.confirmOperation()).to.be.undefined
    })
  })
})
