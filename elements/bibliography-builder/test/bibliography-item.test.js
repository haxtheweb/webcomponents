import { html, fixture, expect, oneEvent } from '@open-wc/testing'
import { render } from 'lit'
import sinon from 'sinon'
import '../lib/bibliography-item.js'
import { BibliographyItem } from '../lib/bibliography-item.js'

// render a TemplateResult into a detached div so we can read its text
const renderText = (template) => {
  const div = document.createElement('div')
  render(template, div)
  return div.textContent
}

describe('BibliographyItem test', () => {
  let element
  let sandbox
  let refreshSpy
  let haxStoreExisted
  let haxStoreBackup

  beforeEach(async () => {
    sandbox = sinon.createSandbox()
    // citationType changes call globalThis.HaxStore.instance... so we
    // provide a stub store before any fixture that flips citationType
    refreshSpy = sinon.spy()
    haxStoreExisted = 'HaxStore' in globalThis
    haxStoreBackup = globalThis.HaxStore
    globalThis.HaxStore = { instance: { refreshActiveNodeForm: refreshSpy } }
    element = await fixture(html`<bibliography-item></bibliography-item>`)
  })

  afterEach(() => {
    sandbox.restore()
    if (haxStoreExisted) {
      globalThis.HaxStore = haxStoreBackup
    } else {
      delete globalThis.HaxStore
    }
  })

  describe('defaults and structure', () => {
    it('has the correct tag name', () => {
      expect(element.tagName.toLowerCase()).to.equal('bibliography-item')
      expect(BibliographyItem.tag).to.equal('bibliography-item')
    })

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible()
    })

    it('has sensible default property values', () => {
      expect(element.title).to.equal('HAX The Web')
      expect(element.publisher).to.equal('HAX PSU')
      expect(element.citationType).to.equal('web')
      expect(element.publicationDate).to.equal('')
      expect(element.accessDate).to.equal('')
      expect(element.url).to.equal('')
      expect(element.startPage).to.equal('')
      expect(element.endPage).to.equal('')
      expect(Array.isArray(element.authors)).to.be.true
      expect(element.authors.length).to.equal(1)
      expect(element.authors[0].given).to.equal('John')
      expect(element.authors[0].surname).to.equal('Doe')
    })

    it('renders the APA citation in the shadow DOM', () => {
      const citation = element.shadowRoot.querySelector('.citation')
      expect(citation).to.exist
      expect(citation.textContent).to.include('Doe, J.')
      expect(citation.textContent).to.include('HAX The Web')
      expect(citation.textContent).to.include('HAX PSU')
    })

    it('renders OER schema markup for the referenced material', () => {
      const wrapper = element.shadowRoot.querySelector('.wrapper')
      expect(wrapper.getAttribute('typeof')).to.equal(
        'oer:ReferencedMaterial',
      )
      const uriMeta = element.shadowRoot.querySelector(
        'meta[property="oer:uri"]',
      )
      expect(uriMeta).to.exist
      expect(uriMeta.getAttribute('content')).to.equal('')
    })

    it('reflects the url into the oer:uri meta content', async () => {
      element.url = 'https://example.com/paper'
      await element.updateComplete
      const uriMeta = element.shadowRoot.querySelector(
        'meta[property="oer:uri"]',
      )
      expect(uriMeta.getAttribute('content')).to.equal(
        'https://example.com/paper',
      )
    })

    it('reflects citationType to an attribute', async () => {
      element.citationType = 'journal'
      await element.updateComplete
      expect(element.getAttribute('citation-type')).to.equal('journal')
    })
  })

  describe('_formatAuthors', () => {
    it('formats a single author as surname plus initial', () => {
      element.authors = [{ given: 'John', surname: 'Doe' }]
      expect(element._formatAuthors()).to.equal('Doe, J.')
    })

    it('formats multi-word given names into multiple initials', () => {
      element.authors = [{ given: 'John Ronald Reuel', surname: 'Tolkien' }]
      expect(element._formatAuthors()).to.equal('Tolkien, J. R. R.')
    })

    it('joins two authors with an ampersand', () => {
      element.authors = [
        { given: 'John', surname: 'Doe' },
        { given: 'Adam', surname: 'Smith' },
      ]
      expect(element._formatAuthors()).to.equal('Doe, J., & Smith, A.')
    })

    it('joins three authors with commas and an ampersand', () => {
      element.authors = [
        { given: 'John', surname: 'Doe' },
        { given: 'Adam', surname: 'Smith' },
        { given: 'Bram', surname: 'Lee' },
      ]
      expect(element._formatAuthors()).to.equal('Doe, J., Smith, A., & Lee, B.')
    })

    it('returns only the surname when the given name is missing', () => {
      element.authors = [{ surname: 'Doe' }]
      expect(element._formatAuthors()).to.equal('Doe')
    })

    it('returns only initials when the surname is missing', () => {
      element.authors = [{ given: 'John' }]
      expect(element._formatAuthors()).to.equal('J.')
    })

    it('returns an empty string for an empty author array', () => {
      element.authors = []
      expect(element._formatAuthors()).to.equal('')
    })

    it('returns an empty string when authors is not an array', () => {
      element.authors = 'John Doe'
      expect(element._formatAuthors()).to.equal('')
    })

    it('skips authors that format to nothing', () => {
      element.authors = [{}, { given: 'John', surname: 'Doe' }]
      expect(element._formatAuthors()).to.equal('Doe, J.')
    })

    it('handles non-string author fields safely', () => {
      element.authors = [{ given: 42, surname: null }]
      expect(element._formatAuthors()).to.equal('')
    })
  })

  describe('_formatDate', () => {
    // dates are supplied in the documented mm/dd/yyyy format so that
    // Date parsing happens in local time (see BUG note below)
    it('returns the publication year for a valid date', () => {
      element.publicationDate = '03/07/2020'
      expect(element._formatDate().getPubYear()).to.equal(2020)
    })

    it('returns (n.d.) for an invalid publication date', () => {
      element.publicationDate = ''
      expect(element._formatDate().getPubYear()).to.equal('(n.d.)')
    })

    it('returns the full publication date for a valid date', () => {
      element.publicationDate = '03/07/2020'
      expect(element._formatDate().getFullPubDate()).to.equal('(2020, March 7)')
    })

    // fixed (lib/bibliography-item.js): publicationDate and accessDate are
    // parsed via _parseDate, so ISO date-only strings like '2020-03-07'
    // no longer parse as UTC midnight and shift back a day in timezones
    // behind UTC; see the ISO parsing tests below.

    it('returns (n.d.) for an invalid full publication date', () => {
      element.publicationDate = 'not-a-date'
      expect(element._formatDate().getFullPubDate()).to.equal('(n.d.)')
    })

    it('parses ISO date-only publication dates as local calendar dates', () => {
      // fixed (lib/bibliography-item.js): ISO date-only strings are parsed
      // as local calendar dates instead of UTC midnight, so they no longer
      // shift back a day in timezones behind UTC
      element.publicationDate = '2020-03-07'
      expect(element._formatDate().getFullPubDate()).to.equal('(2020, March 7)')
      expect(element._formatDate().getPubYear()).to.equal(2020)
    })

    it('parses ISO date-only access dates as local calendar dates', () => {
      element.accessDate = '2020-03-07'
      expect(element._formatDate().getFullAccessDate('APA')).to.equal(
        'Retrieved March 7, 2020, from',
      )
      expect(element._formatDate().getFullAccessDate('BibTeX')).to.equal(
        '2020-03-07',
      )
    })

    it('formats an APA access date', () => {
      element.accessDate = '03/07/2020'
      expect(element._formatDate().getFullAccessDate('APA')).to.equal(
        'Retrieved March 7, 2020, from',
      )
    })

    it('formats a BibTeX access date', () => {
      element.accessDate = '03/07/2020'
      expect(element._formatDate().getFullAccessDate('BibTeX')).to.equal(
        '2020-03-07',
      )
    })

    it('returns (n.d.) for an invalid access date', () => {
      element.accessDate = ''
      expect(element._formatDate().getFullAccessDate('APA')).to.equal('(n.d.)')
    })
  })

  describe('_formatSource', () => {
    it('formats journal volume, issue and pages for APA', async () => {
      element.parentVer = 5
      element.childVer = 2
      element.startPage = 10
      element.endPage = 20
      await element.updateComplete
      expect(
        renderText(element._formatSource().getJournalSource('APA')),
      ).to.equal('5(2), 10 - 20')
    })

    it('formats only pages when no volume is present', async () => {
      element.startPage = 10
      element.endPage = 20
      await element.updateComplete
      expect(
        renderText(element._formatSource().getJournalSource('APA')),
      ).to.equal('10 - 20')
    })

    it('formats only the volume when no pages are present', async () => {
      element.parentVer = 5
      element.childVer = 2
      await element.updateComplete
      expect(
        renderText(element._formatSource().getJournalSource('APA')),
      ).to.equal('5(2)')
    })

    it('returns an empty journal source when nothing is set', () => {
      const source = element._formatSource().getJournalSource('APA')
      expect(source).to.equal('')
    })

    it('returns undefined for non-APA journal formats', () => {
      expect(element._formatSource().getJournalSource('BibTeX')).to.equal(
        undefined,
      )
    })

    it('formats book edition, volume and pages for APA', async () => {
      element.parentVer = 3
      element.childVer = 2
      element.startPage = 10
      element.endPage = 20
      await element.updateComplete
      expect(
        renderText(element._formatSource().getBookSource('APA')),
      ).to.equal('(3 ed., Vol. 2, pp. 10 - 20)')
    })

    it('returns undefined for non-APA book formats', () => {
      expect(element._formatSource().getBookSource('BibTeX')).to.equal(
        undefined,
      )
    })
  })

  describe('exportAPA', () => {
    it('renders a web citation by default', async () => {
      element.title = 'Test Title'
      element.url = 'https://example.com'
      element.publicationDate = '03/07/2020'
      await element.updateComplete
      const citation = element.shadowRoot.querySelector('.citation')
      expect(citation.textContent).to.include('Doe, J. (2020, March 7).')
      expect(citation.textContent).to.include('Test Title')
      expect(citation.textContent).to.include('HAX PSU.')
      expect(citation.textContent).to.include('https://example.com')
      // OER schema: web citations carry oer:name on the title element
      const nameEl = citation.querySelector('[property="oer:name"]')
      expect(nameEl).to.exist
      expect(nameEl.textContent).to.equal('Test Title')
    })

    it('renders a journal citation with volume and pages', async () => {
      element.citationType = 'journal'
      element.title = 'Journal Title'
      element.publicationDate = '03/07/2020'
      element.parentVer = 5
      element.childVer = 2
      element.startPage = 10
      element.endPage = 20
      element.url = 'https://journal.example.com'
      await element.updateComplete
      const text = renderText(element.exportAPA())
      expect(text).to.include('Doe, J. 2020.')
      expect(text).to.include('Journal Title')
      expect(text).to.include('5(2), 10 - 20')
      expect(text).to.include('https://journal.example.com')
      // OER schema: journal citations carry oer:name on a span
      const span = element.shadowRoot.querySelector(
        'span[property="oer:name"]',
      )
      expect(span).to.exist
      expect(span.textContent).to.equal('Journal Title')
    })

    it('renders a book citation with edition details', async () => {
      element.citationType = 'book'
      element.title = 'Book Title'
      element.publicationDate = '03/07/2020'
      element.parentVer = 3
      element.childVer = 2
      element.startPage = 10
      element.endPage = 20
      element.url = 'https://book.example.com'
      await element.updateComplete
      const text = renderText(element.exportAPA())
      expect(text).to.include('(3 ed., Vol. 2, pp. 10 - 20)')
      expect(text).to.include('Book Title')
      expect(text).to.include('HAX PSU')
      // OER schema: book citations carry oer:name on the italic title
      const it = element.shadowRoot.querySelector('i[property="oer:name"]')
      expect(it).to.exist
      expect(it.textContent).to.equal('Book Title')
    })

    it('falls back to the web format for unknown types', async () => {
      element.citationType = 'periodical'
      element.title = 'Whatever'
      await element.updateComplete
      const text = renderText(element.exportAPA())
      expect(text).to.include('Whatever')
      expect(text).to.include('HAX PSU')
    })
  })

  describe('exportBibtex', () => {
    it('renders a misc entry for web citations', async () => {
      element.title = 'Web Source'
      element.url = 'https://example.com'
      element.publicationDate = '03/07/2020'
      element.accessDate = '03/07/2020'
      await element.updateComplete
      const text = renderText(element.exportBibtex())
      expect(text).to.include('@misc{WebSource,')
      expect(text).to.include('title = {Web Source}')
      expect(text).to.include('author = {Doe, J.}')
      expect(text).to.include('year = {2020}')
      expect(text).to.include('howpublished = {\\url{https://example.com}}')
      expect(text).to.include('note = {Accessed: 03/07/2020}')
      expect(text).to.include('}')
    })

    it('omits url and note when not provided', async () => {
      element.title = 'No URL'
      element.url = ''
      element.accessDate = ''
      await element.updateComplete
      const text = renderText(element.exportBibtex())
      expect(text).to.include('@misc{NoURL,')
      expect(text).to.not.include('howpublished')
      expect(text).to.not.include('note =')
    })

    it('renders an article entry for journal citations', async () => {
      element.citationType = 'journal'
      element.title = 'Journal Source'
      element.publicationDate = '03/07/2020'
      element.url = 'https://journal.example.com'
      element.volume = '5'
      element.issue = '2'
      element.startPage = '10'
      element.endPage = '20'
      await element.updateComplete
      const text = renderText(element.exportBibtex())
      expect(text).to.include('@article{JournalSource,')
      expect(text).to.include('title = {Journal Source}')
      expect(text).to.include('year = {2020}')
      expect(text).to.include('volume = {5}')
      expect(text).to.include('number = {2}')
      expect(text).to.include('pages = {10--20}')
      expect(text).to.include('doi = {https://journal.example.com}')
    })

    it('omits journal bibtex fields when not provided', async () => {
      element.citationType = 'journal'
      element.title = 'Bare Journal'
      element.url = ''
      element.startPage = '10'
      element.endPage = ''
      await element.updateComplete
      const text = renderText(element.exportBibtex())
      expect(text).to.include('@article{BareJournal,')
      expect(text).to.include('pages = {10}')
      expect(text).to.not.include('pages = {10--')
      expect(text).to.not.include('volume =')
      expect(text).to.not.include('number =')
      expect(text).to.not.include('doi =')
    })
  })

  describe('citation type changes', () => {
    it('asks HaxStore to refresh the active node form', async () => {
      element.citationType = 'journal'
      await element.updateComplete
      expect(refreshSpy.calledOnce).to.be.true
      element.citationType = 'book'
      await element.updateComplete
      expect(refreshSpy.calledTwice).to.be.true
    })
  })

  describe('add item events', () => {
    it('dispatches add-citation with direction above', async () => {
      const listener = oneEvent(globalThis, 'add-citation')
      element._addItemAbove()
      const event = await listener
      expect(event.detail.direction).to.equal('above')
      expect(event.detail.node === element).to.be.true
    })

    it('dispatches add-citation with direction below', async () => {
      const listener = oneEvent(globalThis, 'add-citation')
      element._addItemBelow()
      const event = await listener
      expect(event.detail.direction).to.equal('below')
      expect(event.detail.node === element).to.be.true
    })
  })

  describe('HAX integration', () => {
    it('registers its hax hooks', () => {
      const hooks = element.haxHooks()
      expect(hooks.setupActiveElementForm).to.equal(
        'haxsetupActiveElementForm',
      )
      expect(hooks.inlineContextMenu).to.equal('haxinlineContextMenu')
    })

    it('supplies inline context menu buttons', () => {
      const ceMenu = { ceButtons: [] }
      element.haxinlineContextMenu(ceMenu)
      expect(ceMenu.ceButtons.length).to.equal(2)
      expect(ceMenu.ceButtons[0].icon).to.equal('communication:call-made')
      expect(ceMenu.ceButtons[0].label).to.equal('Add citation above')
      expect(ceMenu.ceButtons[1].icon).to.equal('communication:call-received')
      expect(ceMenu.ceButtons[1].label).to.equal('Add citation below')
      // fixed (lib/bibliography-item.js): the callbacks now reference the
      // real _addItemAbove / _addItemBelow methods, so the HAX inline
      // context menu buttons actually fire them
      expect(ceMenu.ceButtons[0].callback).to.equal('_addItemAbove')
      expect(ceMenu.ceButtons[1].callback).to.equal('_addItemBelow')
      expect(typeof element['_addItemAbove']).to.equal('function')
      expect(typeof element['_addItemBelow']).to.equal('function')
    })

    it('declares volume and issue as reactive properties', () => {
      // fixed (lib/bibliography-item.js): volume and issue were used by the
      // journal BibTeX export and the journal hax form config but were
      // never declared as reactive properties, so the journal form fields
      // never bound reactively
      const props = BibliographyItem.properties
      expect(props.volume.type).to.equal(String)
      expect(props.issue.type).to.equal(String)
    })

    it('extends the active element form for book citations', async () => {
      element.citationType = 'book'
      await element.updateComplete
      const props = { settings: { configure: [] } }
      element.haxsetupActiveElementForm(props)
      const properties = props.settings.configure.map((c) => c.property)
      expect(properties).to.include('url')
      expect(properties).to.include('publicationDate')
      expect(properties).to.include('parentVer')
      expect(properties).to.include('childVer')
      expect(properties).to.include('startPage')
      expect(properties).to.include('endPage')
    })

    it('extends the active element form for journal citations', async () => {
      element.citationType = 'journal'
      await element.updateComplete
      const props = { settings: { configure: [] } }
      element.haxsetupActiveElementForm(props)
      const properties = props.settings.configure.map((c) => c.property)
      expect(properties).to.include('volume')
      expect(properties).to.include('issue')
      expect(properties).to.include('startPage')
      expect(properties).to.include('endPage')
      expect(properties).to.include('citationType')
    })

    it('extends the active element form for web citations', async () => {
      const props = { settings: { configure: [] } }
      element.haxsetupActiveElementForm(props)
      const properties = props.settings.configure.map((c) => c.property)
      expect(properties).to.include('url')
      expect(properties).to.include('publicationDate')
      expect(properties).to.not.include('parentVer')
      expect(properties).to.not.include('volume')
    })

    it('exposes a static haxProperties schema', () => {
      const props = BibliographyItem.haxProperties
      expect(props.api).to.equal('1')
      expect(props.designSystem).to.be.false
      expect(props.gizmo.title).to.equal('Bibliography item')
      const first = props.settings.configure[0]
      expect(first.property).to.equal('citationType')
      expect(first.options.web).to.equal('Web')
      expect(first.options.journal).to.equal('Journal')
      expect(first.options.book).to.equal('Book')
      expect(props.demoSchema[0].tag).to.equal('bibliography-item')
    })
  })

  describe('copy to clipboard', () => {
    it('writes the citation markup to the clipboard', async () => {
      const writeStub = sandbox
        .stub(navigator.clipboard, 'write')
        .resolves(undefined)
      element._copyToClipboard()
      expect(writeStub.calledOnce).to.be.true
      const data = writeStub.firstCall.args[0]
      expect(Array.isArray(data)).to.be.true
      expect(data[0] instanceof globalThis.ClipboardItem).to.be.true
    })
  })
})
