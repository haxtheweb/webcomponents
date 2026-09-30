import { fixture, expect, html, oneEvent, waitUntil } from '@open-wc/testing'
import sinon from 'sinon'
import '../wikipedia-query.js'
import { WikipediaQuery } from '../wikipedia-query.js'

// Wikipedia API responses used to stub fetch; no real network is ever hit
const articleResponse = (extract) => ({
  ok: true,
  json: () =>
    Promise.resolve({
      query: {
        pages: {
          12345: {
            pageid: 12345,
            title: 'Penn State',
            extract: extract,
          },
        },
      },
    }),
})

describe('wikipedia-query test', () => {
  let element
  let sandbox
  let fetchStub
  let savedBodyXmlLang
  let savedBodyLang
  let savedDocXmlLang
  let savedDocLang

  const clearLangAttributes = () => {
    document.body.removeAttribute('xml:lang')
    document.body.removeAttribute('lang')
    document.documentElement.removeAttribute('xml:lang')
    document.documentElement.removeAttribute('lang')
  }

  beforeEach(async () => {
    sandbox = sinon.createSandbox()
    // stub ALL network access before any element exists
    fetchStub = sandbox
      .stub(globalThis, 'fetch')
      .resolves({ ok: false, json: () => Promise.resolve({}) })
    savedBodyXmlLang = document.body.getAttribute('xml:lang')
    savedBodyLang = document.body.getAttribute('lang')
    savedDocXmlLang = document.documentElement.getAttribute('xml:lang')
    savedDocLang = document.documentElement.getAttribute('lang')
    clearLangAttributes()
    element = await fixture(html`
      <wikipedia-query title="test-title"></wikipedia-query>
    `)
  })

  afterEach(() => {
    sandbox.restore()
    const restoreAttr = (el, name, value) => {
      if (value === null) {
        el.removeAttribute(name)
      } else {
        el.setAttribute(name, value)
      }
    }
    restoreAttr(document.body, 'xml:lang', savedBodyXmlLang)
    restoreAttr(document.body, 'lang', savedBodyLang)
    restoreAttr(document.documentElement, 'xml:lang', savedDocXmlLang)
    restoreAttr(document.documentElement, 'lang', savedDocLang)
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })

  it('has the correct tag name', () => {
    expect(element.tagName.toLowerCase()).to.equal('wikipedia-query')
    expect(WikipediaQuery.tag).to.equal('wikipedia-query')
  })

  describe('defaults', () => {
    it('has sensible default values', () => {
      expect(element.hideTitle).to.be.false
      // search is not initialized in the constructor
      expect(element.search).to.equal(undefined)
      expect(typeof element.language).to.equal('string')
      expect(element.language.length).to.equal(2)
      expect(element.headers.cache).to.equal('force-cache')
    })

    it('derives today as a d/m/yyyy access date', () => {
      const date = new Date(Date.now())
      const expected =
        date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
      expect(element.__now).to.equal(expected)
    })

    it('reflects elementVisible to an attribute', async () => {
      element.elementVisible = true
      await element.updateComplete
      expect(element.hasAttribute('element-visible')).to.be.true
    })
  })

  describe('language derivation', () => {
    it('prefers body xml:lang', async () => {
      document.body.setAttribute('xml:lang', 'es-MX')
      const el = await fixture(html`<wikipedia-query></wikipedia-query>`)
      expect(el.language).to.equal('es')
    })

    it('falls back to body lang', async () => {
      document.body.setAttribute('lang', 'fr')
      const el = await fixture(html`<wikipedia-query></wikipedia-query>`)
      expect(el.language).to.equal('fr')
    })

    it('falls back to the documentElement lang', async () => {
      document.documentElement.setAttribute('lang', 'de')
      const el = await fixture(html`<wikipedia-query></wikipedia-query>`)
      expect(el.language).to.equal('de')
    })

    it('falls back to navigator.language', async () => {
      sandbox.stub(Navigator.prototype, 'language').get(() => 'pt-BR')
      const el = await fixture(html`<wikipedia-query></wikipedia-query>`)
      expect(el.language).to.equal('pt')
    })

    it('falls back to en when nothing is set', async () => {
      sandbox.stub(Navigator.prototype, 'language').get(() => '')
      const el = await fixture(html`<wikipedia-query></wikipedia-query>`)
      expect(el.language).to.equal('en')
    })
  })

  describe('rendering', () => {
    it('renders nothing until the element is visible', async () => {
      if (element.intersectionObserver) {
        element.intersectionObserver.disconnect()
      }
      element.elementVisible = false
      await element.updateComplete
      expect(element.shadowRoot.querySelector('h3')).to.not.exist
      expect(element.shadowRoot.querySelector('#result')).to.not.exist
      expect(element.shadowRoot.querySelector('citation-element')).to.not
        .exist
    })

    it('renders the heading, result and citation once visible', async () => {
      if (element.intersectionObserver) {
        element.intersectionObserver.disconnect()
      }
      element.elementVisible = true
      await element.updateComplete
      expect(element.shadowRoot.querySelector('h3')).to.exist
      expect(element.shadowRoot.querySelector('#result')).to.exist
      expect(element.shadowRoot.querySelector('citation-element')).to.exist
    })

    it('shows the derived title in the heading', async () => {
      // no title set so _title derives from search
      const el = await fixture(html`<wikipedia-query></wikipedia-query>`)
      if (el.intersectionObserver) {
        el.intersectionObserver.disconnect()
      }
      el.search = 'Penn_State'
      await el.updateComplete
      el.elementVisible = true
      await el.updateComplete
      const h3 = el.shadowRoot.querySelector('h3')
      expect(h3.textContent.trim()).to.equal('Penn State Wikipedia article')
      expect(h3.getAttribute('part')).to.equal('heading-3')
      expect(h3.hasAttribute('hidden')).to.be.false
      // cancel the armed visibility debounce so it cannot fire later
      clearTimeout(el._debounce)
    })

    it('derives the title from the title property when present', async () => {
      element.search = 'Penn_State'
      await element.updateComplete
      expect(element._title).to.equal('test-title')
    })

    it('prefers the title property over search when both change', async () => {
      element.search = 'Erie_Pennsylvania'
      await element.updateComplete
      expect(element._title).to.equal('test-title')
      element.title = 'Custom Heading'
      await element.updateComplete
      expect(element._title).to.equal('Custom Heading')
    })

    it('only replaces the first underscore in the search title', async () => {
      element.title = ''
      await element.updateComplete
      element.search = 'A_B_C'
      await element.updateComplete
      expect(element._title).to.equal('A B_C Wikipedia article')
    })

    it('hides the heading when hideTitle is set', async () => {
      if (element.intersectionObserver) {
        element.intersectionObserver.disconnect()
      }
      element.elementVisible = true
      element.hideTitle = true
      await element.updateComplete
      const h3 = element.shadowRoot.querySelector('h3')
      expect(h3.hasAttribute('hidden')).to.be.true
    })

    it('passes citation metadata to the citation-element', async () => {
      if (element.intersectionObserver) {
        element.intersectionObserver.disconnect()
      }
      element.search = 'Penn_State'
      await element.updateComplete
      element.elementVisible = true
      await element.updateComplete
      const citation = element.shadowRoot.querySelector('citation-element')
      expect(citation).to.exist
      expect(citation.creator).to.equal('{Wikipedia contributors}')
      expect(citation.scope).to.equal('sibling')
      expect(citation.license).to.equal('by-sa')
      expect(citation.title).to.equal(
        'Penn_State --- {Wikipedia}{,} The Free Encyclopedia',
      )
      expect(citation.source).to.equal(
        'https://en.wikipedia.org/w/index.php?title=Penn_State',
      )
      expect(citation.date).to.equal(element.__now)
      // cancel the armed visibility debounce so it cannot fire later
      clearTimeout(element._debounce)
    })
  })

  describe('updateArticle', () => {
    const makeVisible = async () => {
      if (element.intersectionObserver) {
        element.intersectionObserver.disconnect()
      }
      element.elementVisible = true
      await element.updateComplete
    }

    it('fetches the wikipedia API for the search term', async () => {
      await makeVisible()
      fetchStub.resolves(
        articleResponse('<p>Penn State is a university.</p>'),
      )
      element.updateArticle('Penn_State', element.headers, 'en')
      await waitUntil(
        () => element.shadowRoot.querySelector('#result').innerHTML !== '',
      )
      // the i18n manager may also load locale files through fetch, so
      // isolate the wikipedia API call by URL
      const wikiCalls = fetchStub.getCalls().filter((call) =>
        String(call.args[0]).includes('wikipedia.org/w/api.php'),
      )
      expect(wikiCalls.length).to.equal(1)
      const url = wikiCalls[0].args[0]
      expect(url).to.include('https://en.wikipedia.org/w/api.php')
      expect(url).to.include('titles=Penn_State')
      expect(url).to.include('format=json')
      expect(wikiCalls[0].args[1]).to.equal(element.headers)
    })

    it('writes the sanitized extract into the result div', async () => {
      await makeVisible()
      fetchStub.resolves(articleResponse('<p>Penn State is a university.</p>'))
      element.updateArticle('Penn_State', element.headers, 'en')
      await waitUntil(
        () => element.shadowRoot.querySelector('#result').innerHTML !== '',
      )
      const result = element.shadowRoot.querySelector('#result')
      expect(result.textContent).to.include('Penn State is a university.')
    })

    it('ignores a non-ok response', async () => {
      await makeVisible()
      fetchStub.resolves({ ok: false, json: () => Promise.resolve({}) })
      element.updateArticle('Penn_State', element.headers, 'en')
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(element.shadowRoot.querySelector('#result').innerHTML).to.equal(
        '',
      )
    })
  })

  describe('handleResponse', () => {
    const makeVisible = async () => {
      if (element.intersectionObserver) {
        element.intersectionObserver.disconnect()
      }
      element.elementVisible = true
      await element.updateComplete
    }

    it('renders a valid article extract', async () => {
      await makeVisible()
      element.handleResponse({
        query: {
          pages: {
            12345: {
              pageid: 12345,
              extract: '<p>Penn State is a university.</p>',
            },
          },
        },
      })
      const result = element.shadowRoot.querySelector('#result')
      expect(result.textContent).to.include('Penn State is a university.')
    })

    it('sanitizes network HTML before inserting it', async () => {
      await makeVisible()
      element.handleResponse({
        query: {
          pages: {
            12345: {
              extract:
                '<p>Penn State</p><img src="data:image/gif;base64,R0lGODlhAQABAAAAADs=" onerror="alert(1)"><script>alert(2)</script>',
            },
          },
        },
      })
      const result = element.shadowRoot.querySelector('#result')
      expect(result.innerHTML).to.include('Penn State')
      expect(result.innerHTML).to.not.include('onerror')
      expect(result.innerHTML).to.not.include('alert(1)')
    })

    it('ignores responses without a query object', async () => {
      await makeVisible()
      element.handleResponse({})
      element.handleResponse(undefined)
      expect(element.shadowRoot.querySelector('#result').innerHTML).to.equal(
        '',
      )
    })

    it('ignores pages without an extract', async () => {
      await makeVisible()
      element.handleResponse({
        query: {
          pages: {
            12345: { pageid: 12345 },
          },
        },
      })
      expect(element.shadowRoot.querySelector('#result').innerHTML).to.equal(
        '',
      )
    })

    it('sets the extract from any page that has one', async () => {
      await makeVisible()
      element.handleResponse({
        query: {
          pages: {
            1: { pageid: 1 },
            2: { pageid: 2, extract: '<p>Second page extract</p>' },
          },
        },
      })
      const result = element.shadowRoot.querySelector('#result')
      expect(result.textContent).to.include('Second page extract')
    })
  })

  describe('visibility driven fetching', () => {
    const makeVisible = async (el) => {
      if (el.intersectionObserver) {
        el.intersectionObserver.disconnect()
      }
      el.elementVisible = true
      await el.updateComplete
    }

    it('fetches automatically once visible with a search', async () => {
      const el = await fixture(
        html`<wikipedia-query search="Erie_Pennsylvania"></wikipedia-query>`,
      )
      fetchStub.resolves(articleResponse('<p>Erie extract</p>'))
      await makeVisible(el)
      await waitUntil(() =>
        fetchStub
          .getCalls()
          .some((call) =>
            String(call.args[0]).includes('titles=Erie_Pennsylvania'),
          ),
      )
      const url = fetchStub
        .getCalls()
        .find((call) =>
          String(call.args[0]).includes('titles=Erie_Pennsylvania'),
        ).args[0]
      expect(url).to.include('titles=Erie_Pennsylvania')
    })

    it('debounces rapid property changes into one request', async () => {
      const el = await fixture(
        html`<wikipedia-query search="Alpha"></wikipedia-query>`,
      )
      const updateSpy = sandbox.spy(el, 'updateArticle')
      el.elementVisible = true
      el.search = 'Beta'
      el.search = 'Gamma'
      await el.updateComplete
      await new Promise((resolve) => setTimeout(resolve, 100))
      expect(updateSpy.callCount).to.equal(1)
      expect(updateSpy.firstCall.args[0]).to.equal('Gamma')
    })

    it('does not fetch without a search term', async () => {
      await makeVisible(element)
      await new Promise((resolve) => setTimeout(resolve, 100))
      expect(fetchStub.called).to.be.false
    })
  })

  describe('HAX integration', () => {
    it('registers the gizmoRegistration hook', () => {
      expect(element.haxHooks().gizmoRegistration).to.equal(
        'haxgizmoRegistration',
      )
    })

    it('registers itself as an app provider on first registration', async () => {
      const i18nListener = oneEvent(globalThis, 'i18n-manager-register-element')
      const appListener = oneEvent(globalThis, 'hax-register-app')
      const store = { validGizmoTypes: [], appList: [] }
      element.haxgizmoRegistration(store)
      const i18nEvent = await i18nListener
      const appEvent = await appListener
      expect(i18nEvent.detail.namespace).to.equal(
        'wikipedia-query.haxProperties',
      )
      expect(i18nEvent.detail.localesPath.endsWith('/locales')).to.be.true
      expect(store.validGizmoTypes).to.include('wikipedia')
      expect(appEvent.detail.details.title).to.equal('Wikipedia')
      expect(appEvent.detail.connection.url).to.equal(
        element.language + '.wikipedia.org',
      )
    })

    it('skips registration when the endpoint already exists', () => {
      let count = 0
      const counter = () => {
        count = count + 1
      }
      globalThis.addEventListener('hax-register-app', counter)
      const store = {
        validGizmoTypes: [],
        appList: [{ connection: { url: element.language + '.wikipedia.org' } }],
      }
      element.haxgizmoRegistration(store)
      globalThis.removeEventListener('hax-register-app', counter)
      expect(count).to.equal(0)
    })

    it('registers when existing endpoints are for other languages', async () => {
      const appListener = oneEvent(globalThis, 'hax-register-app')
      const store = {
        validGizmoTypes: [],
        appList: [{ connection: { url: 'de.wikipedia.org' } }],
      }
      element.haxgizmoRegistration(store)
      const appEvent = await appListener
      expect(appEvent.detail.connection.url).to.equal(
        element.language + '.wikipedia.org',
      )
    })

    it('exposes the wikipedia app connection details', () => {
      const details = element.haxAppDetails
      expect(details.details.title).to.equal('Wikipedia')
      expect(details.details.icon).to.equal('account-balance')
      expect(details.details.author).to.equal('Wikimedia')
      expect(details.connection.protocol).to.equal('https')
      expect(details.connection.url).to.equal(
        element.language + '.wikipedia.org',
      )
      expect(details.connection.data.action).to.equal('query')
      const browse = details.connection.operations.browse
      expect(browse.method).to.equal('GET')
      expect(browse.endPoint).to.equal('w/api.php')
      expect(browse.pagination.props.offset).to.equal('sroffset')
      expect(browse.resultMap.defaultGizmoType).to.equal('wikipedia')
      expect(browse.resultMap.items).to.equal('query.search')
      expect(browse.resultMap.image).to.include(
        element.language + '.wikipedia.org',
      )
    })

    it('exposes haxProperties as a lib file URL', () => {
      const url = WikipediaQuery.haxProperties
      expect(typeof url).to.equal('string')
      expect(url.endsWith('lib/wikipedia-query.haxProperties.json')).to.be.true
    })
  })
})
