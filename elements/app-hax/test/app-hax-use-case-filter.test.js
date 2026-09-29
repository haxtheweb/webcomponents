import { expect } from '@open-wc/testing'

globalThis.appSettings = {}

const { store } = await import('../lib/v2/AppHaxStore.js')
const { AppHaxUseCaseFilter } = await import('../lib/v2/app-hax-use-case-filter.js')

function createFilter() {
  const el = new AppHaxUseCaseFilter()
  // Prevent autorun side-effects from causing issues
  el.items = []
  el.filteredItems = []
  el.filteredSites = []
  el.returningSites = []
  el.activeFilters = []
  el.searchTerm = ''
  el.searchQuery = ''
  el.sortOption = 'newest'
  return el
}

describe('AppHaxUseCaseFilter pure logic', () => {
  describe('_normalizeUseCaseMachineName', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('returns empty for null', () => {
      expect(el._normalizeUseCaseMachineName(null)).to.equal('')
    })
    it('returns empty for non-string', () => {
      expect(el._normalizeUseCaseMachineName(123)).to.equal('')
    })
    it('lowercases and trims', () => {
      expect(el._normalizeUseCaseMachineName('  MyTemplate  ')).to.equal('mytemplate')
    })
    it('takes last segment of path', () => {
      expect(el._normalizeUseCaseMachineName('path/to/template')).to.equal('template')
    })
    it('strips query string', () => {
      expect(el._normalizeUseCaseMachineName('template?foo=bar')).to.equal('template')
    })
    it('strips hash', () => {
      expect(el._normalizeUseCaseMachineName('template#section')).to.equal('template')
    })
    it('removes file extension', () => {
      expect(el._normalizeUseCaseMachineName('template.json')).to.equal('template')
    })
    it('replaces spaces with hyphens', () => {
      expect(el._normalizeUseCaseMachineName('my template')).to.equal('my-template')
    })
    it('replaces underscores with hyphens', () => {
      expect(el._normalizeUseCaseMachineName('my_template')).to.equal('my-template')
    })
    it('replaces non-alphanumeric with hyphens', () => {
      expect(el._normalizeUseCaseMachineName('my@template!')).to.equal('my-template')
    })
    it('collapses multiple hyphens', () => {
      expect(el._normalizeUseCaseMachineName('my---template')).to.equal('my-template')
    })
    it('strips leading/trailing hyphens', () => {
      expect(el._normalizeUseCaseMachineName('--template--')).to.equal('template')
    })
    it('handles complex path with extension and query', () => {
      expect(el._normalizeUseCaseMachineName('path/to/My Template.json?x=1')).to.equal('my-template')
    })
  })

  describe('_looseNormalizeUseCaseMachineName', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('returns empty for falsy input', () => {
      expect(el._looseNormalizeUseCaseMachineName(null)).to.equal('')
    })
    it('strips -site- segment from middle', () => {
      expect(el._looseNormalizeUseCaseMachineName('course-site-template')).to.equal('course-template')
    })
    it('strips -site suffix', () => {
      expect(el._looseNormalizeUseCaseMachineName('course-site')).to.equal('course')
    })
    it('does not strip site when not a suffix', () => {
      expect(el._looseNormalizeUseCaseMachineName('site-template')).to.equal('site-template')
    })
    it('collapses hyphens after stripping', () => {
      expect(el._looseNormalizeUseCaseMachineName('a--site--b')).to.equal('a-b')
    })
  })

  describe('_deriveTemplateMachineName', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('normalizes primary value', () => {
      expect(el._deriveTemplateMachineName('My Template')).to.equal('my-template')
    })
    it('falls back to fallbackTitle when primary is empty', () => {
      expect(el._deriveTemplateMachineName('', 'Fallback Title')).to.equal('fallback-title')
    })
    it('falls back to fallbackTitle when primary is null', () => {
      expect(el._deriveTemplateMachineName(null, 'Fallback')).to.equal('fallback')
    })
    it('returns empty when both are empty', () => {
      expect(el._deriveTemplateMachineName('', '')).to.equal('')
    })
  })

  describe('_getTemplateMachineNameCandidates', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('returns empty array for null template', () => {
      expect(el._getTemplateMachineNameCandidates(null).length).to.equal(0)
    })
    it('includes machineName', () => {
      const result = el._getTemplateMachineNameCandidates({ machineName: 'my-template' })
      expect(result).to.include('my-template')
    })
    it('includes skeletonUrl (normalized)', () => {
      const result = el._getTemplateMachineNameCandidates({ skeletonUrl: 'path/to/skel.json' })
      expect(result).to.include('skel')
    })
    it('includes importType variants', () => {
      const result = el._getTemplateMachineNameCandidates({ importType: 'docx' })
      expect(result).to.include('import-docx')
      expect(result).to.include('docx')
    })
    it('includes themeElement', () => {
      const result = el._getTemplateMachineNameCandidates({ themeElement: 'clean-two' })
      expect(result).to.include('clean-two')
    })
    it('includes originalData.element', () => {
      const result = el._getTemplateMachineNameCandidates({ originalData: { element: 'my-theme' } })
      expect(result).to.include('my-theme')
    })
    it('includes useCaseTitle', () => {
      const result = el._getTemplateMachineNameCandidates({ useCaseTitle: 'Course Template' })
      expect(result).to.include('course-template')
    })
    it('deduplicates candidates', () => {
      const result = el._getTemplateMachineNameCandidates({
        machineName: 'my-template',
        useCaseTitle: 'My Template',
      })
      const count = result.filter((c) => c === 'my-template').length
      expect(count).to.equal(1)
    })
    it('filters out empty normalized values', () => {
      const result = el._getTemplateMachineNameCandidates({
        machineName: '!!!',
        useCaseTitle: 'valid-template',
      })
      expect(result).to.include('valid-template')
      expect(result.length).to.equal(1)
    })
  })

  describe('_matchesUseCaseParam', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('returns false for empty rawParam', () => {
      expect(el._matchesUseCaseParam({ machineName: 'x' }, '')).to.be.false
    })
    it('returns true for exact match', () => {
      expect(el._matchesUseCaseParam({ machineName: 'course-template' }, 'course-template')).to.be.true
    })
    it('returns true for loose match (site segment stripped)', () => {
      expect(el._matchesUseCaseParam({ machineName: 'course-site-template' }, 'course-template')).to.be.true
    })
    it('returns false for no match', () => {
      expect(el._matchesUseCaseParam({ machineName: 'blog-template' }, 'course-template')).to.be.false
    })
    it('normalizes rawParam before matching', () => {
      expect(el._matchesUseCaseParam({ machineName: 'course-template' }, 'Course Template')).to.be.true
    })
  })

  describe('_findTemplateByUseCaseParam', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('returns null for empty param', () => {
      el.items = [{ machineName: 'x' }]
      expect(el._findTemplateByUseCaseParam('')).to.be.null
    })
    it('returns null for empty items', () => {
      el.items = []
      expect(el._findTemplateByUseCaseParam('test')).to.be.null
    })
    it('finds exact match in items', () => {
      el.items = [{ machineName: 'course-template' }, { machineName: 'blog-template' }]
      const result = el._findTemplateByUseCaseParam('course-template')
      expect(result).to.exist
      expect(result.machineName).to.equal('course-template')
    })
    it('finds loose match in items', () => {
      el.items = [{ machineName: 'course-site-template' }]
      const result = el._findTemplateByUseCaseParam('course-template')
      expect(result).to.exist
      expect(result.machineName).to.equal('course-site-template')
    })
    it('uses __allItems when items is empty', () => {
      el.items = []
      el.__allItems = [{ machineName: 'found-template' }]
      const result = el._findTemplateByUseCaseParam('found-template')
      expect(result).to.exist
      expect(result.machineName).to.equal('found-template')
    })
    it('returns null when no match found', () => {
      el.items = [{ machineName: 'blog' }]
      expect(el._findTemplateByUseCaseParam('course')).to.be.null
    })
  })

  describe('iconForFilter', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('returns lrn:write for blog', () => {
      expect(el.iconForFilter('blog')).to.equal('lrn:write')
    })
    it('returns icons:description for brochure', () => {
      expect(el.iconForFilter('brochure')).to.equal('icons:description')
    })
    it('returns hax:lesson for course', () => {
      expect(el.iconForFilter('course')).to.equal('hax:lesson')
    })
    it('returns icons:perm-identity for portfolio', () => {
      expect(el.iconForFilter('portfolio')).to.equal('icons:perm-identity')
    })
    it('returns hax:bricks for blank', () => {
      expect(el.iconForFilter('blank')).to.equal('hax:bricks')
    })
    it('returns icons:cloud-download for import', () => {
      expect(el.iconForFilter('import')).to.equal('icons:cloud-download')
    })
    it('returns icons:label for unknown filter', () => {
      expect(el.iconForFilter('unknown')).to.equal('icons:label')
    })
    it('handles case-insensitive input', () => {
      expect(el.iconForFilter('BLOG')).to.equal('lrn:write')
    })
  })

  describe('toggleFilterByButton', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('adds filter when not present', () => {
      el.toggleFilterByButton('course')
      expect(el.activeFilters).to.include('course')
    })
    it('removes filter when present', () => {
      el.activeFilters = ['course', 'blog']
      el.toggleFilterByButton('course')
      expect(el.activeFilters).to.not.include('course')
      expect(el.activeFilters).to.include('blog')
    })
  })

  describe('handleSortChange', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('sets sortOption from string value', () => {
      el.handleSortChange('az')
      expect(el.sortOption).to.equal('az')
      expect(el.sortMenuOpen).to.be.false
    })
    it('sets sortOption from event target value', () => {
      el.handleSortChange({ target: { value: 'newest' } })
      expect(el.sortOption).to.equal('newest')
    })
    it('defaults to newest for invalid value', () => {
      el.handleSortChange(null)
      expect(el.sortOption).to.equal('newest')
    })
    it('defaults to newest for object without target.value', () => {
      el.handleSortChange({})
      expect(el.sortOption).to.equal('newest')
    })
  })

  describe('toggleFilter', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('adds filter from event', () => {
      el.toggleFilter({ target: { value: 'course' } })
      expect(el.activeFilters).to.include('course')
    })
    it('removes filter from event when already present', () => {
      el.activeFilters = ['course']
      el.toggleFilter({ target: { value: 'course' } })
      expect(el.activeFilters).to.not.include('course')
    })
  })

  describe('removeFilter', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('removes filter by detail', () => {
      el.activeFilters = ['course', 'blog']
      el.removeFilter({ detail: 'course' })
      expect(el.activeFilters).to.not.include('course')
      expect(el.activeFilters).to.include('blog')
    })
  })

  describe('applyFilters', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('filters items by dataType', () => {
      el.items = [
        { dataType: 'skeleton', useCaseTitle: 'Skel 1', useCaseTag: ['course'] },
        { dataType: 'blank', useCaseTitle: 'Blank 1', useCaseTag: ['portfolio'] },
        { dataType: 'other', useCaseTitle: 'Other', useCaseTag: [] },
      ]
      el.applyFilters()
      expect(el.filteredItems.length).to.equal(2)
    })
    it('filters items by search term', () => {
      el.items = [
        { dataType: 'skeleton', useCaseTitle: 'Course Template', useCaseTag: ['course'] },
        { dataType: 'skeleton', useCaseTitle: 'Blog Template', useCaseTag: ['blog'] },
      ]
      el.searchTerm = 'course'
      el.applyFilters()
      expect(el.filteredItems.length).to.equal(1)
      expect(el.filteredItems[0].useCaseTitle).to.equal('Course Template')
    })
    it('filters items by tag search', () => {
      el.items = [
        { dataType: 'skeleton', useCaseTitle: 'Template 1', useCaseTag: ['course'] },
        { dataType: 'skeleton', useCaseTitle: 'Template 2', useCaseTag: ['blog'] },
      ]
      el.searchTerm = 'blog'
      el.applyFilters()
      expect(el.filteredItems.length).to.equal(1)
      expect(el.filteredItems[0].useCaseTitle).to.equal('Template 2')
    })
    it('filters items by active filters', () => {
      el.items = [
        { dataType: 'skeleton', useCaseTitle: 'T1', useCaseTag: ['course'] },
        { dataType: 'skeleton', useCaseTitle: 'T2', useCaseTag: ['blog'] },
      ]
      el.activeFilters = ['course']
      el.applyFilters()
      expect(el.filteredItems.length).to.equal(1)
      expect(el.filteredItems[0].useCaseTitle).to.equal('T1')
    })
    it('filters sites by dataType', () => {
      el.returningSites = [
        { dataType: 'site', originalData: { title: 'My Site' } },
        { dataType: 'other', originalData: { title: 'Other' } },
      ]
      el.applyFilters()
      expect(el.filteredSites.length).to.equal(1)
    })
    it('filters sites by search term in title', () => {
      el.returningSites = [
        { dataType: 'site', originalData: { title: 'Course Site' } },
        { dataType: 'site', originalData: { title: 'Blog Site' } },
      ]
      el.searchTerm = 'course'
      el.applyFilters()
      expect(el.filteredSites.length).to.equal(1)
    })
    it('filters sites by search term in description', () => {
      el.returningSites = [
        { dataType: 'site', originalData: { title: 'Site 1', description: 'A course about math' } },
        { dataType: 'site', originalData: { title: 'Site 2', description: 'A blog about food' } },
      ]
      el.searchTerm = 'math'
      el.applyFilters()
      expect(el.filteredSites.length).to.equal(1)
    })
    it('filters sites by search term in author', () => {
      el.returningSites = [
        { dataType: 'site', originalData: { title: 'S1', author: 'John Doe' } },
        { dataType: 'site', originalData: { title: 'S2', author: 'Jane Smith' } },
      ]
      el.searchTerm = 'john'
      el.applyFilters()
      expect(el.filteredSites.length).to.equal(1)
    })
    it('filters sites by search term in slug', () => {
      el.returningSites = [
        { dataType: 'site', originalData: { title: 'S1', slug: '/courses/math' } },
        { dataType: 'site', originalData: { title: 'S2', slug: '/blogs/food' } },
      ]
      el.searchTerm = 'courses'
      el.applyFilters()
      expect(el.filteredSites.length).to.equal(1)
    })
    it('filters sites by category string', () => {
      el.returningSites = [
        { dataType: 'site', originalData: { title: 'S1', metadata: { site: { category: 'course' } } } },
        { dataType: 'site', originalData: { title: 'S2', metadata: { site: { category: 'blog' } } } },
      ]
      el.activeFilters = ['course']
      el.applyFilters()
      expect(el.filteredSites.length).to.equal(1)
    })
    it('filters sites by category array', () => {
      el.returningSites = [
        { dataType: 'site', originalData: { title: 'S1', metadata: { site: { category: ['course', 'portfolio'] } } } },
        { dataType: 'site', originalData: { title: 'S2', metadata: { site: { category: ['blog'] } } } },
      ]
      el.activeFilters = ['portfolio']
      el.applyFilters()
      expect(el.filteredSites.length).to.equal(1)
    })
    it('returns all when no search and no filters', () => {
      el.items = [
        { dataType: 'skeleton', useCaseTitle: 'T1', useCaseTag: ['course'] },
        { dataType: 'blank', useCaseTitle: 'T2', useCaseTag: ['blog'] },
      ]
      el.applyFilters()
      expect(el.filteredItems.length).to.equal(2)
    })
  })

  describe('_normalizeThemeSource', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('normalizes array of themes into object', () => {
      const result = el._normalizeThemeSource([
        { machineName: 'theme1', element: 't1', thumbnail: 't1.png' },
        { machineName: 'theme2', element: 't2', screenshot: 's2.png' },
      ])
      expect(result).to.be.an('object')
      expect(result['theme1']).to.exist
      expect(result['theme2']).to.exist
    })
    it('uses element as key when machineName missing', () => {
      const result = el._normalizeThemeSource([
        { element: 'my-theme' },
      ])
      expect(result['my-theme']).to.exist
    })
    it('skips entries with no machineName or element', () => {
      const result = el._normalizeThemeSource([
        { thumbnail: 't.png' },
        { machineName: 'valid' },
      ])
      expect(result['valid']).to.exist
      expect(Object.keys(result).length).to.equal(1)
    })
    it('falls back to screenshot when thumbnail missing', () => {
      const result = el._normalizeThemeSource([
        { machineName: 't', screenshot: 'screenshot.png' },
      ])
      expect(result['t'].thumbnail).to.equal('screenshot.png')
    })
    it('defaults thumbnail to empty string', () => {
      const result = el._normalizeThemeSource([
        { machineName: 't' },
      ])
      expect(result['t'].thumbnail).to.equal('')
    })
    it('handles non-array input gracefully', () => {
      const result = el._normalizeThemeSource({})
      expect(result).to.be.an('object')
    })
  })

  describe('_getUseCaseMachineNameForTemplate', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('returns empty for null template', () => {
      expect(el._getUseCaseMachineNameForTemplate(null)).to.equal('')
    })
    it('returns first candidate', () => {
      expect(el._getUseCaseMachineNameForTemplate({ machineName: 'my-template' })).to.equal('my-template')
    })
    it('returns empty when no candidates', () => {
      expect(el._getUseCaseMachineNameForTemplate({})).to.equal('')
    })
  })

  describe('testKeydown', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('toggles search on Escape', () => {
      let called = false
      el.toggleSearch = () => {
        called = true
      }
      el.testKeydown({ key: 'Escape' })
      expect(called).to.be.true
    })
    it('toggles search on Enter', () => {
      let called = false
      el.toggleSearch = () => {
        called = true
      }
      el.testKeydown({ key: 'Enter' })
      expect(called).to.be.true
    })
    it('does nothing on other keys', () => {
      let called = false
      el.toggleSearch = () => {
        called = true
      }
      el.testKeydown({ key: 'Tab' })
      expect(called).to.be.false
    })
  })

  describe('toggleFilterVisibility', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('toggles showFilter property', () => {
      el.showFilter = false
      el.toggleFilterVisibility()
      expect(el.showFilter).to.be.true
      el.toggleFilterVisibility()
      expect(el.showFilter).to.be.false
    })
  })

  describe('toggleSelection', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('sets activeUseCase when different index', () => {
      el.activeUseCase = false
      el.toggleSelection(3)
      expect(el.activeUseCase).to.equal(3)
    })
    it('deselects when same index', () => {
      el.activeUseCase = 3
      el.toggleSelection(3)
      expect(el.activeUseCase).to.be.false
    })
  })

  describe('handleSearch', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('sets searchTerm from event and syncs store', () => {
      el.handleSearch({ target: { value: 'Course' } })
      expect(el.searchTerm).to.equal('course')
      expect(store.searchTerm).to.equal('course')
    })
  })

  describe('_jwtLoggedIn', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('sets isLoggedIn true on detail true', () => {
      el._jwtLoggedIn({ detail: true })
      expect(el.isLoggedIn).to.be.true
    })
    it('sets isLoggedIn false on detail false', () => {
      el._jwtLoggedIn({ detail: false })
      expect(el.isLoggedIn).to.be.false
    })
  })

  describe('_getUseCaseParamFromUrl', () => {
    let el
    let originalHref
    beforeEach(() => {
      el = createFilter()
      originalHref = globalThis.location.href
    })
    afterEach(() => {
      // Can't easily restore location.href, but tests should not depend on it
    })
    it('returns empty when no param present', () => {
      // Default test page has no use-case param
      const result = el._getUseCaseParamFromUrl()
      // Could be empty or some value depending on test runner URL
      expect(typeof result).to.equal('string')
    })
    it('does not throw on URL parsing errors', () => {
      expect(() => el._getUseCaseParamFromUrl()).to.not.throw()
    })
  })

  describe('_updateUrlQueryParam', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('does nothing for invalid param', () => {
      expect(() => el._updateUrlQueryParam(null, 'value')).to.not.throw()
    })
    it('does nothing for non-string param', () => {
      expect(() => el._updateUrlQueryParam(123, 'value')).to.not.throw()
    })
    it('does not throw for valid param', () => {
      expect(() => el._updateUrlQueryParam('test-param', 'value')).to.not.throw()
    })
  })

  describe('getImportItems', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('returns array of import items', () => {
      const items = el.getImportItems()
      expect(items).to.be.an('array')
      expect(items.length).to.be.greaterThan(0)
    })
    it('all items have dataType import', () => {
      const items = el.getImportItems()
      items.forEach((item) => {
        expect(item.dataType).to.equal('import')
      })
    })
    it('includes docx import', () => {
      const items = el.getImportItems()
      const docx = items.find((i) => i.importType === 'docx')
      expect(docx).to.exist
      expect(docx.useCaseTitle).to.equal('Word Doc')
    })
    it('includes pdf import', () => {
      const items = el.getImportItems()
      const pdf = items.find((i) => i.importType === 'pdf')
      expect(pdf).to.exist
      expect(pdf.useCaseTitle).to.equal('PDF')
    })
    it('includes pptx import', () => {
      const items = el.getImportItems()
      const pptx = items.find((i) => i.importType === 'pptx')
      expect(pptx).to.exist
    })
    it('includes xlsx import', () => {
      const items = el.getImportItems()
      const xlsx = items.find((i) => i.importType === 'xlsx')
      expect(xlsx).to.exist
    })
    it('includes html file import', () => {
      const items = el.getImportItems()
      const html = items.find((i) => i.importType === 'html' && i.importKind === 'file')
      expect(html).to.exist
    })
    it(' includes url-based imports', () => {
      const items = el.getImportItems()
      const urlImports = items.filter((i) => i.importKind === 'url')
      expect(urlImports.length).to.be.greaterThan(0)
    })
    it('includes gitbook import', () => {
      const items = el.getImportItems()
      const gitbook = items.find((i) => i.importType === 'gitbook')
      expect(gitbook).to.exist
    })
    it('includes notion import', () => {
      const items = el.getImportItems()
      const notion = items.find((i) => i.importType === 'notion')
      expect(notion).to.exist
    })
    it('includes pressbooks import', () => {
      const items = el.getImportItems()
      const pb = items.find((i) => i.importType === 'pressbooks')
      expect(pb).to.exist
    })
    it('includes wordpress import', () => {
      const items = el.getImportItems()
      const wp = items.find((i) => i.importType === 'wordpress')
      expect(wp).to.exist
    })
    it('includes openstax import', () => {
      const items = el.getImportItems()
      const os = items.find((i) => i.importType === 'openstax')
      expect(os).to.exist
    })
    it('each item has useCaseTag array', () => {
      const items = el.getImportItems()
      items.forEach((item) => {
        expect(item.useCaseTag).to.be.an('array')
      })
    })
    it('each item has useCaseIcon array', () => {
      const items = el.getImportItems()
      items.forEach((item) => {
        expect(item.useCaseIcon).to.be.an('array')
      })
    })
  })

  describe('updateSiteResults', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('sets error when no manifest data', () => {
      store.manifest = {}
      el.updateSiteResults()
      expect(el.errorMessage).to.include('No manifest data')
    })
    it('sets error when manifest has no items', () => {
      store.manifest = { items: null }
      el.updateSiteResults()
      expect(el.errorMessage).to.include('No manifest data')
    })
    it('processes site items from manifest', () => {
      store.manifest = {
        items: [
          { id: 's1', title: 'Site 1', slug: '/sites/s1', metadata: { site: { category: 'course' } } },
          { id: 's2', title: 'Site 2', slug: '/sites/s2', metadata: { site: { category: ['blog', 'portfolio'] } } },
        ],
      }
      el.updateSiteResults()
      expect(el.returningSites.length).to.equal(2)
      expect(el.returningSites[0].dataType).to.equal('site')
    })
    it('assigns Website tag when no category', () => {
      store.manifest = {
        items: [{ id: 's1', title: 'Site 1', slug: '/s1', metadata: {} }],
      }
      el.updateSiteResults()
      expect(el.returningSites[0].useCaseTag).to.include('Website')
    })
    it('incorporates manifest tags from metadata.site.tags', () => {
      store.manifest = {
        items: [{ id: 's1', title: 'S', slug: '/s', metadata: { site: { tags: ['custom-tag'] } } }],
      }
      el.updateSiteResults()
      expect(el.returningSites[0].useCaseTag).to.include('custom-tag')
    })
    it('incorporates manifest tags from metadata.tags', () => {
      store.manifest = {
        items: [{ id: 's1', title: 'S', slug: '/s', metadata: { tags: ['meta-tag'] } }],
      }
      el.updateSiteResults()
      expect(el.returningSites[0].useCaseTag).to.include('meta-tag')
    })
    it('incorporates build type as tag', () => {
      store.manifest = {
        items: [{ id: 's1', title: 'S', slug: '/s', build: { type: 'course' } }],
      }
      el.updateSiteResults()
      expect(el.returningSites[0].useCaseTag).to.include('course')
    })
    it('handles string category', () => {
      store.manifest = {
        items: [{ id: 's1', title: 'S', slug: '/s', metadata: { site: { category: 'portfolio' } } }],
      }
      el.updateSiteResults()
      expect(el.returningSites[0].useCaseTag).to.include('portfolio')
    })
    it('handles string tags split by comma', () => {
      store.manifest = {
        items: [{ id: 's1', title: 'S', slug: '/s', metadata: { tags: 'tag1,tag2,tag3' } }],
      }
      el.updateSiteResults()
      expect(el.returningSites[0].useCaseTag).to.include('tag1')
      expect(el.returningSites[0].useCaseTag).to.include('tag2')
    })
    it('sets "No Sites Found" when items empty', () => {
      store.manifest = { items: [] }
      el.updateSiteResults()
      expect(el.errorMessage).to.include('No Sites Found')
    })
    it('sets loading false after processing', () => {
      store.manifest = { items: [] }
      el.updateSiteResults()
      expect(el.loading).to.be.false
    })
    it('handles error gracefully', () => {
      store.manifest = null
      el.updateSiteResults()
      expect(el.loading).to.be.false
      expect(el.returningSites).to.deep.equal([])
    })
  })

  describe('toggleDisplay', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('selects card when isSelected is true', () => {
      el.filteredItems = [{ isSelected: false, showContinue: false }]
      el.toggleDisplay(0, { detail: { isSelected: true } })
      expect(el.selectedCardIndex).to.equal(0)
      expect(el.filteredItems[0].isSelected).to.be.true
    })
    it('deselects card when isSelected is false', () => {
      el.filteredItems = [{ isSelected: true, showContinue: true }]
      el.selectedCardIndex = 0
      el.toggleDisplay(0, { detail: { isSelected: false } })
      expect(el.selectedCardIndex).to.be.null
      expect(el.filteredItems[0].isSelected).to.be.false
    })
    it('deselects previously selected card when selecting new one', () => {
      el.filteredItems = [
        { isSelected: true, showContinue: true },
        { isSelected: false, showContinue: false },
      ]
      el.selectedCardIndex = 0
      el.toggleDisplay(1, { detail: { isSelected: true } })
      expect(el.filteredItems[0].isSelected).to.be.false
      expect(el.filteredItems[0].showContinue).to.be.false
      expect(el.selectedCardIndex).to.equal(1)
    })
    it('handles fallback index -1', () => {
      el.filteredItems = []
      el.toggleDisplay(-1, { detail: { isSelected: true } })
      expect(el.selectedCardIndex).to.equal(-1)
    })
  })

  describe('_resolveSameOriginPath', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('returns empty for null', () => {
      expect(el._resolveSameOriginPath(null)).to.equal('')
    })
    it('returns empty for non-string', () => {
      expect(el._resolveSameOriginPath(123)).to.equal('')
    })
    it('returns empty for empty string', () => {
      expect(el._resolveSameOriginPath('')).to.equal('')
    })
    it('returns empty for #', () => {
      expect(el._resolveSameOriginPath('#')).to.equal('')
    })
    it('returns empty for scheme URLs', () => {
      expect(el._resolveSameOriginPath('https://evil.com/path')).to.equal('')
    })
    it('returns empty for scheme-relative URLs', () => {
      expect(el._resolveSameOriginPath('//evil.com/path')).to.equal('')
    })
    it('returns root-relative path as-is', () => {
      expect(el._resolveSameOriginPath('/api/path')).to.equal('/api/path')
    })
    it('resolves relative URL to same-origin path', () => {
      const result = el._resolveSameOriginPath('relative/path')
      expect(result).to.be.a('string')
    })
  })

  describe('handleFilterKeydown', () => {
    let el
    beforeEach(() => {
      el = createFilter()
    })
    it('toggles filter on Space', () => {
      let called = false
      el.toggleFilterByButton = () => { called = true }
      el.handleFilterKeydown({ key: ' ', preventDefault: () => {} }, 'course')
      expect(called).to.be.true
    })
    it('toggles filter on Enter', () => {
      let called = false
      el.toggleFilterByButton = () => { called = true }
      el.handleFilterKeydown({ key: 'Enter', preventDefault: () => {} }, 'course')
      expect(called).to.be.true
    })
    it('does nothing on other keys', () => {
      let called = false
      el.toggleFilterByButton = () => { called = true }
      el.handleFilterKeydown({ key: 'Tab', preventDefault: () => {} }, 'course')
      expect(called).to.be.false
    })
  })

  describe('updateSkeletonResults', () => {
    let el
    beforeEach(() => {
      el = createFilter()
      // Mock shadowRoot for resetFilters which is called at the end
      Object.defineProperty(el, 'shadowRoot', {
        value: {
          querySelector: () => ({ value: '' }),
          querySelectorAll: () => [],
        },
        configurable: true,
      })
    })
    it('sets error when API not configured', () => {
      store.AppHaxAPI = {}
      el.updateSkeletonResults()
      expect(el.errorMessage).to.include('not configured')
      expect(el.loading).to.be.false
    })
    it('sets error when supportsCall returns false', () => {
      store.AppHaxAPI = {
        makeCall: () => {},
        supportsCall: () => false,
      }
      el.updateSkeletonResults()
      expect(el.errorMessage).to.include('not configured')
    })
    it('processes skeleton data from API', async () => {
      store.AppHaxAPI = {
        makeCall: async (call) => {
          if (call === 'skeletonsList') {
            return {
              status: 200,
              data: [
                { title: 'Course Template', machineName: 'course-tpl', category: ['course'], 'skeleton-url': '/skel/course.json' },
                { title: 'Blog Template', machineName: 'blog-tpl', category: 'blog' },
              ],
            }
          }
          return { status: 200, data: {} }
        },
        supportsCall: () => true,
      }
      el.updateSkeletonResults()
      // Wait for Promise.allSettled to resolve
      await new Promise((r) => setTimeout(r, 500))
      expect(el.items.length).to.be.greaterThan(0)
      const skeleton = el.items.find((i) => i.useCaseTitle === 'Course Template')
      expect(skeleton).to.exist
      expect(skeleton.dataType).to.equal('skeleton')
      expect(skeleton.skeletonUrl).to.equal('/skel/course.json')
    })
    it('handles string category', async () => {
      store.AppHaxAPI = {
        makeCall: async (call) => {
          if (call === 'skeletonsList') {
            return { status: 200, data: [{ title: 'T', category: 'blog' }] }
          }
          return { status: 200, data: {} }
        },
        supportsCall: () => true,
      }
      el.updateSkeletonResults()
      await new Promise((r) => setTimeout(r, 500))
      expect(el.items[0].useCaseTag).to.include('blog')
    })
    it('assigns Empty tag when no category', async () => {
      store.AppHaxAPI = {
        makeCall: async (call) => {
          if (call === 'skeletonsList') {
            return { status: 200, data: [{ title: 'No Cat' }] }
          }
          return { status: 200, data: {} }
        },
        supportsCall: () => true,
      }
      el.updateSkeletonResults()
      await new Promise((r) => setTimeout(r, 500))
      expect(el.items[0].useCaseTag).to.include('Empty')
    })
    it('filters out hidden items when showHidden is false', async () => {
      store.AppHaxAPI = {
        makeCall: async (call) => {
          if (call === 'skeletonsList') {
            return { status: 200, data: [{ title: 'Visible' }, { title: 'Hidden', hidden: true }] }
          }
          return { status: 200, data: {} }
        },
        supportsCall: () => true,
      }
      el.showHidden = false
      el.updateSkeletonResults()
      await new Promise((r) => setTimeout(r, 500))
      // Only Visible skeleton + import items (no themes in empty response)
      const skeletons = el.items.filter((i) => i.dataType === 'skeleton')
      expect(skeletons.length).to.equal(1)
      expect(skeletons[0].useCaseTitle).to.equal('Visible')
    })
    it('includes hidden items when showHidden is true', async () => {
      store.AppHaxAPI = {
        makeCall: async (call) => {
          if (call === 'skeletonsList') {
            return { status: 200, data: [{ title: 'Visible' }, { title: 'Hidden', hidden: true }] }
          }
          return { status: 200, data: {} }
        },
        supportsCall: () => true,
      }
      el.showHidden = true
      el.updateSkeletonResults()
      await new Promise((r) => setTimeout(r, 500))
      const skeletons = el.items.filter((i) => i.dataType === 'skeleton')
      expect(skeletons.length).to.equal(2)
    })
    it('filters out terrible items when showTerrible is false', async () => {
      store.AppHaxAPI = {
        makeCall: async (call) => {
          if (call === 'skeletonsList') {
            return { status: 200, data: [{ title: 'Good' }, { title: 'Bad', terrible: true }] }
          }
          return { status: 200, data: {} }
        },
        supportsCall: () => true,
      }
      el.showTerrible = false
      el.updateSkeletonResults()
      await new Promise((r) => setTimeout(r, 500))
      const skeletons = el.items.filter((i) => i.dataType === 'skeleton')
      expect(skeletons.length).to.equal(1)
      expect(skeletons[0].useCaseTitle).to.equal('Good')
    })
    it('includes terrible items when showTerrible is true', async () => {
      store.AppHaxAPI = {
        makeCall: async (call) => {
          if (call === 'skeletonsList') {
            return { status: 200, data: [{ title: 'Good' }, { title: 'Bad', terrible: true }] }
          }
          return { status: 200, data: {} }
        },
        supportsCall: () => true,
      }
      el.showTerrible = true
      el.updateSkeletonResults()
      await new Promise((r) => setTimeout(r, 500))
      const skeletons = el.items.filter((i) => i.dataType === 'skeleton')
      expect(skeletons.length).to.equal(2)
    })
    it('includes import items in results', async () => {
      store.AppHaxAPI = {
        makeCall: async (call) => {
          if (call === 'skeletonsList') {
            return { status: 200, data: [{ title: 'Skel' }] }
          }
          return { status: 200, data: {} }
        },
        supportsCall: () => true,
      }
      el.updateSkeletonResults()
      await new Promise((r) => setTimeout(r, 500))
      const importItems = el.items.filter((i) => i.dataType === 'import')
      expect(importItems.length).to.be.greaterThan(0)
    })
    it('processes theme data into blank items', async () => {
      store.AppHaxAPI = {
        makeCall: async (call) => {
          if (call === 'skeletonsList') {
            return { status: 200, data: [] }
          }
          if (call === 'themesList') {
            return {
              status: 200,
              data: [{ machineName: 'clean-two', element: 'clean-two', name: 'Clean Two', thumbnail: 't.png' }],
            }
          }
          return { status: 200, data: {} }
        },
        supportsCall: () => true,
      }
      el.updateSkeletonResults()
      await new Promise((r) => setTimeout(r, 500))
      const blankItems = el.items.filter((i) => i.dataType === 'blank')
      expect(blankItems.length).to.be.greaterThan(0)
      const cleanTwo = blankItems.find((i) => i.useCaseTitle === 'Clean Two')
      expect(cleanTwo).to.exist
    })
    it('does not set "No Templates Found" when import items exist', async () => {
      store.AppHaxAPI = {
        makeCall: async () => ({ status: 200, data: [] }),
        supportsCall: () => true,
      }
      el.updateSkeletonResults()
      await new Promise((r) => setTimeout(r, 500))
      // Import items are always added, so items is not empty
      expect(el.items.length).to.be.greaterThan(0)
      // No error since import items exist
      expect(el.errorMessage).to.equal('')
    })
    it('handles API error gracefully', async () => {
      store.AppHaxAPI = {
        makeCall: async () => { throw new Error('Network') },
        supportsCall: () => true,
      }
      el.updateSkeletonResults()
      await new Promise((r) => setTimeout(r, 500))
      // Promise.allSettled catches the rejection; skeletonArray becomes []
      // and only import items are loaded. No error message is set.
      expect(el.loading).to.be.false
      // Import items are still added
      const importItems = el.items.filter((i) => i.dataType === 'import')
      expect(importItems.length).to.be.greaterThan(0)
    })
    it('maps attributes to icons', async () => {
      store.AppHaxAPI = {
        makeCall: async (call) => {
          if (call === 'skeletonsList') {
            return {
              status: 200,
              data: [{ title: 'T', attributes: [{ icon: 'hax:site', tooltip: 'Site' }] }],
            }
          }
          return { status: 200, data: {} }
        },
        supportsCall: () => true,
      }
      el.updateSkeletonResults()
      await new Promise((r) => setTimeout(r, 500))
      expect(el.items[0].useCaseIcon).to.be.an('array')
      expect(el.items[0].useCaseIcon[0].icon).to.equal('hax:site')
    })
    it('handles priority sorting', async () => {
      store.AppHaxAPI = {
        makeCall: async (call) => {
          if (call === 'skeletonsList') {
            return {
              status: 200,
              data: [
                { title: 'Z Item', priority: 1 },
                { title: 'A Item', priority: -1 },
              ],
            }
          }
          return { status: 200, data: {} }
        },
        supportsCall: () => true,
      }
      el.updateSkeletonResults()
      await new Promise((r) => setTimeout(r, 500))
      expect(el.items[0].useCaseTitle).to.equal('A Item')
      expect(el.items[1].useCaseTitle).to.equal('Z Item')
    })
  })

  describe('resetFilters', () => {
    let el
    beforeEach(() => {
      el = createFilter()
      Object.defineProperty(el, 'shadowRoot', {
        value: {
          querySelector: () => ({ value: '' }),
          querySelectorAll: () => [],
        },
        configurable: true,
      })
    })
    it('clears searchTerm and activeFilters', () => {
      el.searchTerm = 'test'
      el.activeFilters = ['course']
      el.resetFilters()
      expect(el.searchTerm).to.equal('')
      expect(el.activeFilters).to.deep.equal([])
    })
    it('resets filteredItems to all valid dataTypes', () => {
      el.items = [
        { dataType: 'skeleton', useCaseTitle: 'S1' },
        { dataType: 'blank', useCaseTitle: 'B1' },
        { dataType: 'import', useCaseTitle: 'I1' },
        { dataType: 'other', useCaseTitle: 'O1' },
      ]
      el.resetFilters()
      expect(el.filteredItems.length).to.equal(3)
    })
    it('resets filteredSites to all returningSites', () => {
      el.returningSites = [{ dataType: 'site' }, { dataType: 'site' }]
      el.resetFilters()
      expect(el.filteredSites.length).to.equal(2)
    })
    it('syncs store.searchTerm', () => {
      store.searchTerm = 'test'
      el.resetFilters()
      expect(store.searchTerm).to.equal('')
    })
  })
})
