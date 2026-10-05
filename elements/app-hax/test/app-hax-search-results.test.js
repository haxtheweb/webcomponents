import { fixture, expect, html } from '@open-wc/testing'

globalThis.appSettings = {}

const { store } = await import('../lib/v2/AppHaxStore.js')
const { AppHaxSearchResults } = await import('../lib/v2/app-hax-search-results.js')

function createSearchResults() {
  const el = new AppHaxSearchResults()
  el.searchItems = []
  el.displayItems = []
  el.sortOption = 'newest'
  return el
}

describe('AppHaxSearchResults pure logic', () => {
  describe('static tag', () => {
    it('has correct tag name', () => {
      expect(AppHaxSearchResults.tag).to.equal('app-hax-search-results')
    })
  })

  describe('constructor defaults', () => {
    it('initializes with default properties', () => {
      const el = createSearchResults()
      expect(el.searchItems).to.deep.equal([])
      expect(el.displayItems).to.deep.equal([])
      expect(el.searchTerm).to.equal('')
      expect(el.dark).to.be.false
      expect(el.currentIndex).to.equal(1)
      expect(el.totalItems).to.equal(0)
      expect(el.sortOption).to.equal('newest')
    })
  })

  describe('getSortedItems', () => {
    let el
    beforeEach(() => {
      el = createSearchResults()
    })
    it('returns empty array when displayItems is empty', () => {
      el.displayItems = []
      expect(el.getSortedItems().length).to.equal(0)
    })
    it('returns empty array when displayItems is not array', () => {
      el.displayItems = null
      expect(el.getSortedItems().length).to.equal(0)
    })
    it('sorts by az (title ascending)', () => {
      el.displayItems = [
        { title: 'Zebra' },
        { title: 'Apple' },
        { title: 'Banana' },
      ]
      el.sortOption = 'az'
      const result = el.getSortedItems()
      expect(result[0].title).to.equal('Apple')
      expect(result[1].title).to.equal('Banana')
      expect(result[2].title).to.equal('Zebra')
    })
    it('sorts by za (title descending)', () => {
      el.displayItems = [
        { title: 'Apple' },
        { title: 'Zebra' },
        { title: 'Banana' },
      ]
      el.sortOption = 'za'
      const result = el.getSortedItems()
      expect(result[0].title).to.equal('Zebra')
      expect(result[2].title).to.equal('Apple')
    })
    it('sorts by newest (updated descending)', () => {
      el.displayItems = [
        { title: 'Old', metadata: { site: { updated: 1000 } } },
        { title: 'New', metadata: { site: { updated: 3000 } } },
        { title: 'Mid', metadata: { site: { updated: 2000 } } },
      ]
      el.sortOption = 'newest'
      const result = el.getSortedItems()
      expect(result[0].title).to.equal('New')
      expect(result[1].title).to.equal('Mid')
      expect(result[2].title).to.equal('Old')
    })
    it('sorts by oldest (updated ascending)', () => {
      el.displayItems = [
        { title: 'New', metadata: { site: { updated: 3000 } } },
        { title: 'Old', metadata: { site: { updated: 1000 } } },
        { title: 'Mid', metadata: { site: { updated: 2000 } } },
      ]
      el.sortOption = 'oldest'
      const result = el.getSortedItems()
      expect(result[0].title).to.equal('Old')
      expect(result[1].title).to.equal('Mid')
      expect(result[2].title).to.equal('New')
    })
    it('sorts by theme name', () => {
      el.displayItems = [
        { title: 'A', metadata: { theme: { element: 'zeta-theme' } } },
        { title: 'B', metadata: { theme: { element: 'alpha-theme' } } },
      ]
      el.sortOption = 'theme'
      store.themesData = {}
      const result = el.getSortedItems()
      expect(result[0].title).to.equal('B')
      expect(result[1].title).to.equal('A')
    })
    it('defaults to az for unknown sort option', () => {
      el.displayItems = [
        { title: 'Zebra' },
        { title: 'Apple' },
      ]
      el.sortOption = 'unknown'
      const result = el.getSortedItems()
      expect(result[0].title).to.equal('Apple')
    })
    it('handles missing title in sort', () => {
      el.displayItems = [
        { title: 'Zebra' },
        {}, // no title
        { title: 'Apple' },
      ]
      el.sortOption = 'az'
      const result = el.getSortedItems()
      expect(result.length).to.equal(3)
    })
    it('handles missing metadata in date sort', () => {
      el.displayItems = [
        { title: 'A', metadata: { site: { updated: 3000 } } },
        { title: 'B' }, // no metadata
        { title: 'C', metadata: { site: { updated: 1000 } } },
      ]
      el.sortOption = 'newest'
      const result = el.getSortedItems()
      expect(result.length).to.equal(3)
    })
    it('uses theme name from themesData when available', () => {
      el.displayItems = [
        { title: 'A', metadata: { theme: { element: 'theme1' } } },
        { title: 'B', metadata: { theme: { element: 'theme2' } } },
      ]
      el.sortOption = 'theme'
      store.themesData = {
        theme1: { name: 'Zeta Theme' },
        theme2: { name: 'Alpha Theme' },
      }
      const result = el.getSortedItems()
      expect(result[0].title).to.equal('B')
      expect(result[1].title).to.equal('A')
    })
  })

  describe('getThemeImage', () => {
    let el
    beforeEach(() => {
      el = createSearchResults()
      store.themesData = {}
    })
    it('returns empty string when no theme element', () => {
      expect(el.getThemeImage({})).to.equal('')
    })
    it('returns empty string when theme not in themesData', () => {
      expect(el.getThemeImage({ metadata: { theme: { element: 'unknown' } } })).to.equal('')
    })
    it('returns thumbnail when theme found', () => {
      store.themesData = { 'my-theme': { thumbnail: 'thumb.png' } }
      const result = el.getThemeImage({ metadata: { theme: { element: 'my-theme' } } })
      expect(result).to.equal('thumb.png')
    })
    it('returns empty when thumbnail is empty', () => {
      store.themesData = { 'my-theme': { thumbnail: '' } }
      const result = el.getThemeImage({ metadata: { theme: { element: 'my-theme' } } })
      expect(result).to.equal('')
    })
  })

  describe('getItemDetails', () => {
    let el
    beforeEach(() => {
      el = createSearchResults()
    })
    it('returns details object with created, updated, pages, url', () => {
      const item = {
        slug: '/sites/my-site',
        metadata: {
          site: { created: 1000, updated: 2000 },
          pageCount: 5,
        },
      }
      const details = el.getItemDetails(item)
      expect(details.created).to.equal(1000)
      expect(details.updated).to.equal(2000)
      expect(details.pages).to.equal(5)
      expect(details.url).to.equal('/sites/my-site')
    })
    it('defaults created to current time when missing', () => {
      const item = { slug: '/test' }
      const details = el.getItemDetails(item)
      expect(details.created).to.be.a('number')
      expect(details.url).to.equal('/test')
    })
    it('defaults pages to 0 when missing', () => {
      const item = { slug: '/test', metadata: { site: {} } }
      const details = el.getItemDetails(item)
      expect(details.pages).to.equal(0)
    })
  })

  describe('isAtStart / isAtEnd', () => {
    let el
    beforeEach(() => {
      el = createSearchResults()
    })
    it('isAtStart returns true when shadowRoot is null', () => {
      expect(el.isAtStart).to.be.true
    })
    it('isAtEnd returns true when shadowRoot is null', () => {
      expect(el.isAtEnd).to.be.true
    })
  })

  describe('handleScroll', () => {
    let el
    beforeEach(() => {
      el = createSearchResults()
    })
    it('does nothing when totalItems <= 1', () => {
      el.totalItems = 1
      el.handleScroll({ target: { scrollLeft: 100, scrollWidth: 500, clientWidth: 200 } })
      expect(el.currentIndex).to.equal(1)
    })
    it('sets currentIndex to totalItems when near end', () => {
      el.totalItems = 5
      el.handleScroll({ target: { scrollLeft: 300, scrollWidth: 500, clientWidth: 200 } })
      expect(el.currentIndex).to.equal(5)
    })
    it('calculates currentIndex based on scroll position', () => {
      el.totalItems = 10
      el.handleScroll({ target: { scrollLeft: 204, scrollWidth: 2000, clientWidth: 200 } })
      // itemWidth = 180 + 24 = 204; rawIndex = 204/204 = 1; floor(1) + 1 = 2
      expect(el.currentIndex).to.equal(2)
    })
  })
})

describe('AppHaxUserAccessModal pure logic', () => {
  let AppHaxUserAccessModal
  let store

  before(async () => {
    const mod = await import('../lib/v2/app-hax-user-access-modal.js')
    // The class is not exported, but it's registered as a custom element
    AppHaxUserAccessModal = customElements.get('app-hax-user-access-modal')
    store = (await import('../lib/v2/AppHaxStore.js')).store
  })

  function createModal() {
    const el = new AppHaxUserAccessModal()
    el.username = ''
    el.error = ''
    el.loading = false
    return el
  }

  describe('static tag', () => {
    it('has correct tag name', () => {
      expect(AppHaxUserAccessModal.tag).to.equal('app-hax-user-access-modal')
    })
  })

  describe('constructor defaults', () => {
    it('initializes with default properties', () => {
      const el = createModal()
      expect(el.username).to.equal('')
      expect(el.loading).to.be.false
      expect(el.error).to.equal('')
      expect(el.siteTitle).to.equal('')
    })
    it('has translation object', () => {
      const el = createModal()
      expect(el.t).to.be.an('object')
      expect(el.t.userAccess).to.equal('User Access')
      expect(el.t.cancel).to.equal('Cancel')
    })
  })

  describe('_handleUsernameInput', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    it('sets username from event target value', () => {
      el._handleUsernameInput({ target: { value: 'newuser' } })
      expect(el.username).to.equal('newuser')
    })
    it('clears error when user types', () => {
      el.error = 'some error'
      el._handleUsernameInput({ target: { value: 'x' } })
      expect(el.error).to.equal('')
    })
  })

  describe('_handleKeydown', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    it('calls _handleAddUser on Enter when username has content and not loading', () => {
      let called = false
      el.username = 'testuser'
      el.loading = false
      el._handleAddUser = () => { called = true }
      el._handleKeydown({ key: 'Enter' })
      expect(called).to.be.true
    })
    it('does not call _handleAddUser on Enter when username is empty', () => {
      let called = false
      el.username = '  '
      el._handleAddUser = () => { called = true }
      el._handleKeydown({ key: 'Enter' })
      expect(called).to.be.false
    })
    it('does not call _handleAddUser on Enter when loading', () => {
      let called = false
      el.username = 'testuser'
      el.loading = true
      el._handleAddUser = () => { called = true }
      el._handleKeydown({ key: 'Enter' })
      expect(called).to.be.false
    })
    it('calls _handleCancel on Escape', () => {
      let called = false
      el._handleCancel = () => { called = true }
      el._handleKeydown({ key: 'Escape' })
      expect(called).to.be.true
    })
    it('does nothing on other keys', () => {
      let addUserCalled = false
      let cancelCalled = false
      el._handleAddUser = () => { addUserCalled = true }
      el._handleCancel = () => { cancelCalled = true }
      el._handleKeydown({ key: 'Tab' })
      expect(addUserCalled).to.be.false
      expect(cancelCalled).to.be.false
    })
  })

  describe('_handleCancel', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    it('dispatches simple-modal-hide event', () => {
      let fired = false
      globalThis.addEventListener('simple-modal-hide', () => { fired = true })
      el._handleCancel()
      globalThis.removeEventListener('simple-modal-hide', () => {})
      expect(fired).to.be.true
    })
    it('restores body overflow', () => {
      document.body.style.overflow = 'hidden'
      el._handleCancel()
      expect(document.body.style.overflow).to.equal('')
    })
  })

  describe('_closeModal', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    it('dispatches simple-modal-hide event', () => {
      let fired = false
      globalThis.addEventListener('simple-modal-hide', () => { fired = true })
      el._closeModal()
      globalThis.removeEventListener('simple-modal-hide', () => {})
      expect(fired).to.be.true
    })
  })

  describe('_showSuccessToast', () => {
    let el
    beforeEach(() => {
      el = createModal()
      el.username = 'newuser'
    })
    it('calls store.toast with success message', () => {
      let captured = null
      const origToast = store.toast
      store.toast = (msg, duration, extras) => { captured = { msg, duration, extras } }
      el._showSuccessToast()
      store.toast = origToast
      expect(captured).to.exist
      expect(captured.msg).to.equal('User access granted successfully!')
      expect(captured.duration).to.equal(4000)
      expect(captured.extras.userName).to.equal('newuser')
    })
  })

  describe('_handleAddUser', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    it('returns early when username is empty', async () => {
      el.username = ''
      await el._handleAddUser()
      expect(el.loading).to.be.false
    })
    it('returns early when username is whitespace', async () => {
      el.username = '   '
      await el._handleAddUser()
      expect(el.loading).to.be.false
    })
    it('sets error when _addUserAccess throws', async () => {
      el.username = 'testuser'
      el._addUserAccess = async () => { throw new Error('Network') }
      await el._handleAddUser()
      expect(el.error).to.include('Network error')
      expect(el.loading).to.be.false
    })
    it('sets error when response status is not success', async () => {
      el.username = 'testuser'
      el._addUserAccess = async () => ({ status: 'error' })
      el._handleCancel = () => {} // prevent modal close side effects
      await el._handleAddUser()
      expect(el.error).to.equal('User not found or unauthorized')
    })
    it('shows toast and resets username on success', async () => {
      el.username = 'testuser'
      el._addUserAccess = async () => ({ status: 'success' })
      el._handleCancel = () => {}
      let toastCalled = false
      const origToast = store.toast
      store.toast = () => { toastCalled = true }
      await el._handleAddUser()
      store.toast = origToast
      expect(toastCalled).to.be.true
      expect(el.username).to.equal('')
      expect(el.loading).to.be.false
    })
    it('plays success sound on success', async () => {
      el.username = 'testuser'
      el._addUserAccess = async () => ({ status: 'success' })
      el._handleCancel = () => {}
      let soundPlayed = null
      store.appEl = { playSound: (s) => { soundPlayed = s } }
      await el._handleAddUser()
      store.appEl = null
      expect(soundPlayed).to.equal('success')
    })
  })

  describe('_addUserAccess', () => {
    let el
    beforeEach(() => {
      el = createModal()
    })
    it('throws when no active site', async () => {
      store.activeSiteId = null
      store.manifest = { items: [] }
      try {
        await el._addUserAccess('testuser')
        expect.fail('should have thrown')
      } catch (e) {
        expect(e.message).to.include('site name')
      }
    })
    it('throws when active site has no name', async () => {
      store.activeSiteId = 'test'
      store.manifest = { items: [{ id: 'test' }] }
      try {
        await el._addUserAccess('testuser')
        expect.fail('should have thrown')
      } catch (e) {
        expect(e.message).to.include('site name')
      }
    })
    it('uses activeSite.name when available', async () => {
      store.activeSiteId = 'test'
      store.manifest = { items: [{ id: 'test', name: 'my-site' }] }
      store.AppHaxAPI = {
        makeCall: async (call, data) => ({ status: 'success', call, data }),
      }
      const result = await el._addUserAccess('testuser')
      expect(result.status).to.equal('success')
      expect(result.data.siteName).to.equal('my-site')
    })
    it('uses activeSite.metadata.site.name as fallback', async () => {
      store.activeSiteId = 'test'
      store.manifest = {
        items: [{ id: 'test', metadata: { site: { name: 'fallback-name' } } }],
      }
      store.AppHaxAPI = {
        makeCall: async (call, data) => ({ status: 'success', call, data }),
      }
      const result = await el._addUserAccess('testuser')
      expect(result.data.siteName).to.equal('fallback-name')
    })
  })
})

describe('AppHaxSearchResults render', () => {
  const displayItems = [
    {
      id: 'site-1',
      title: 'Site One',
      slug: '/sites/site-one',
      author: 'Author One',
      description: 'First site',
      metadata: {
        site: { created: 1600000000, updated: 1700000000 },
        pageCount: 4,
        theme: {
          element: 'my-theme',
          variables: { cssVariable: '--simple-colors-default-theme-blue-7' },
        },
      },
    },
    {
      id: 'site-2',
      title: 'Site Two',
      slug: '/sites/site-two',
      author: 'Author Two',
      description: 'Second site',
      metadata: {
        site: { created: 1500000000, updated: 1650000000 },
        pageCount: 2,
      },
    },
  ]

  afterEach(() => {
    store.themesData = {}
    store.appEl = null
  })

  it('renders site cards for display items with theme thumbnails', async () => {
    store.themesData = {
      'my-theme': {
        thumbnail: '@haxtheweb/my-theme/lib/thumb.png',
        name: 'My Theme',
      },
    }
    const el = await fixture(html`<app-hax-search-results></app-hax-search-results>`)
    el.displayItems = displayItems
    el.sortOption = 'az'
    await el.updateComplete
    expect(el.shadowRoot.querySelectorAll('app-hax-site-bar').length).to.equal(2)
    // @haxtheweb/ package thumbnails resolve to a URL for the package path
    const resolved = el.getThemeImage(displayItems[0])
    expect(resolved).to.include('my-theme/lib/thumb.png')
    // cards present means no-results block is absent
    expect(el.shadowRoot.querySelector('#noResult')).to.not.exist
  })

  it('renders no-results messaging with the search term', async () => {
    const el = await fixture(html`<app-hax-search-results></app-hax-search-results>`)
    el.displayItems = []
    el.searchTerm = 'kittens'
    await el.updateComplete
    const noResult = el.shadowRoot.querySelector('#noResult')
    expect(noResult).to.exist
    expect(noResult.textContent).to.include('kittens')
  })

  it('renders no-results prompting a new site without a search term', async () => {
    const el = await fixture(html`<app-hax-search-results></app-hax-search-results>`)
    el.displayItems = []
    el.searchTerm = ''
    await el.updateComplete
    const noResult = el.shadowRoot.querySelector('#noResult')
    expect(noResult).to.exist
    expect(noResult.textContent).to.include('Create a new site')
  })

  it('evaluates isAtStart / isAtEnd against the rendered results element', async () => {
    const el = await fixture(html`<app-hax-search-results></app-hax-search-results>`)
    el.displayItems = displayItems
    await el.updateComplete
    expect(el.isAtStart).to.be.true
    expect(el.isAtEnd).to.be.a('boolean')
  })

  it('scrolls the results list on demand', async () => {
    const el = await fixture(html`<app-hax-search-results></app-hax-search-results>`)
    el.displayItems = displayItems
    await el.updateComplete
    const results = el.shadowRoot.querySelector('#results')
    expect(results).to.exist
    // at the start, snapping fully back to 0
    el.scrollLeft()
    // shadow a scroll position so the far branch runs too
    Object.defineProperty(results, 'scrollLeft', {
      value: 500,
      configurable: true,
    })
    el.scrollLeft()
    el.scrollRight()
    el.goToPage(2)
    expect(el.currentIndex).to.equal(2)
    delete results.scrollLeft
  })

  it('toggles tabindex on site details through openedChanged', async () => {
    const el = await fixture(html`<app-hax-search-results></app-hax-search-results>`)
    el.displayItems = displayItems
    await el.updateComplete
    store.appEl = { playSound: () => {} }
    const details = el.shadowRoot.querySelector('app-hax-site-details')
    expect(details).to.exist
    el.openedChanged({ detail: { value: false } })
    expect(details.getAttribute('tabindex')).to.equal('-1')
    el.openedChanged({ detail: { value: true } })
    expect(details.hasAttribute('tabindex')).to.be.false
  })
})

describe('AppHaxUserAccessModal render', () => {
  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('renders all modal states and focuses the input after connecting', async () => {
    const el = await fixture(html`<app-hax-user-access-modal></app-hax-user-access-modal>`)
    await el.updateComplete
    expect(el.shadowRoot.querySelector('input')).to.exist
    expect(document.body.style.overflow).to.equal('hidden')
    // empty username shows the placeholder character block
    expect(el.shadowRoot.querySelector('.empty-character')).to.exist
    // populated states render their branches
    el.username = 'btopol'
    el.siteTitle = 'My Site'
    el.error = 'User not found or unauthorized'
    el.loading = true
    await el.updateComplete
    expect(el.shadowRoot.querySelector('rpg-character')).to.exist
    expect(el.shadowRoot.querySelector('.site-title').textContent).to.equal('My Site')
    expect(el.shadowRoot.querySelector('.error')).to.exist
    expect(el.shadowRoot.querySelector('.loading')).to.exist
    // firstUpdated focus timeout fires without issue
    await new Promise((r) => setTimeout(r, 150))
  })

  it('sets siteTitle from the active site on first render', async () => {
    const savedActiveSiteId = store.activeSiteId
    const savedManifest = store.manifest
    store.activeSiteId = 'site-9'
    store.manifest = { items: [{ id: 'site-9', title: 'Active Site Title' }] }
    const el = await fixture(html`<app-hax-user-access-modal></app-hax-user-access-modal>`)
    await el.updateComplete
    expect(el.siteTitle).to.equal('Active Site Title')
    store.activeSiteId = savedActiveSiteId
    store.manifest = savedManifest
  })
})
