import { fixture, expect, html, aTimeout } from '@open-wc/testing'

import { GithubPreview } from '../github-preview.js'
// lib files imported directly so their own files count in coverage
import { WCMarkdown } from '../lib/wc-markdown.js'
import { GithubRpgContributors } from '../lib/github-rpg-contributors.js'

// NEVER hit real networks: every fetch this element family makes
// (github api repo info, raw readme text, contributors list) is stubbed.
const originalFetch = globalThis.fetch
let fetchedUrls = []
let fetchHandler = null

const stubFetch = (handler) => {
  fetchedUrls = []
  fetchHandler = handler
  globalThis.fetch = (url, options) => {
    const key = String(url)
    fetchedUrls.push(key)
    return Promise.resolve(fetchHandler(key, options))
  }
}

const jsonResponse = (data) => ({
  ok: true,
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(JSON.stringify(data)),
})

const textResponse = (text) => ({
  ok: true,
  json: () => Promise.resolve({}),
  text: () => Promise.resolve(text),
})

const repoData = {
  description: 'A repo about web components',
  language: 'JavaScript',
  stargazers_count: 42,
  forks: 7,
}

const repoResponse = () => jsonResponse(repoData)

const repoApiUrl = 'https://api.github.com/repos/haxtheweb/webcomponents'
const readmeRawUrl =
  'https://raw.githubusercontent.com/haxtheweb/webcomponents/master/README.md'
const contributorsApiUrl =
  'https://api.github.com/repos/haxtheweb/webcomponents/contributors'

const notFoundResponse = () => ({
  ok: false,
  json: () => Promise.resolve({}),
  text: () => Promise.resolve(''),
})

const defaultHandler = (url) => {
  if (url === repoApiUrl) return repoResponse()
  if (url === readmeRawUrl) return textResponse('# Readme heading')
  if (url === contributorsApiUrl)
    return jsonResponse([
      { login: 'alice', contributions: 10 },
      { login: 'bob', contributions: 5 },
    ])
  // unknown urls behave like a 404 so unconfigured elements settle quietly
  return notFoundResponse()
}

describe('github-preview', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch
    fetchHandler = null
  })

  it('is an instance of GithubPreview with defaults', async () => {
    stubFetch(defaultHandler)
    const element = await fixture(html`<github-preview></github-preview>`)
    expect(element).to.be.instanceOf(GithubPreview)
    expect(GithubPreview.tag).to.equal('github-preview')
    expect(element.url).to.equal('https://github.com')
    expect(element.apiUrl).to.equal('https://api.github.com')
    expect(element.rawUrl).to.equal('https://raw.githubusercontent.com')
    expect(element.extended).to.equal(false)
    expect(element.readMe).to.equal('README.md')
    expect(element.branch).to.equal('master')
    expect(element.viewMoreText).to.equal('View More')
    expect(element.notFoundText).to.equal('Asset not found')
    expect(element.headers).to.deep.equal({ cache: 'force-cache' })
  })

  it('exposes hax wiring hooks and schema', async () => {
    const hooks = GithubPreview.tag && new GithubPreview().haxHooks()
    expect(hooks.editModeChanged).to.equal('haxeditModeChanged')
    expect(hooks.activeElementChanged).to.equal('haxactiveElementChanged')
    expect(hooks.gizmoRegistration).to.equal('haxgizmoRegistration')
    const hax = GithubPreview.haxProperties
    expect(hax.canScale).to.equal(false)
    expect(hax.canEditSource).to.equal(true)
    expect(hax.gizmo.title).to.equal('Github Preview')
    expect(hax.gizmo.tags).to.include('github')
    expect(hax.demoSchema[0].tag).to.equal('github-preview')
    expect(hax.demoSchema[0].properties.org).to.equal('haxtheweb')
    const appDetails = new GithubPreview().haxAppDetails
    expect(appDetails.connection.url).to.equal('api.github.com')
    expect(appDetails.connection.operations.browse.endPoint).to.equal(
      'search/repositories',
    )
    expect(appDetails.details.title).to.equal('Github')
  })

  it('renders the not-found state without repo and org', async () => {
    stubFetch(defaultHandler)
    const element = await fixture(html`<github-preview></github-preview>`)
    await element.updateComplete
    await aTimeout(50)
    // BUG: github-preview.js:645-674 includes constructor-initialized
    // properties (headers, branch, rawUrl, apiUrl, readMe) in the list that
    // triggers the debounced fetch, so even a completely unconfigured
    // element fires a request to .../repos/undefined/undefined on every
    // mount; it only stays in the not-found state when that response is
    // not ok. Exposed by 'renders the not-found state without repo and org'.
    expect(fetchedUrls).to.include(
      'https://api.github.com/repos/undefined/undefined',
    )
    expect(element.__assetAvailable).to.equal(false)
    expect(element.shadowRoot.querySelector('h1').textContent).to.equal(
      'Asset not found',
    )
  })

  it('fetches repo data and renders the basic card', async () => {
    stubFetch(defaultHandler)
    const element = await fixture(html`
      <github-preview org="haxtheweb" repo="webcomponents"></github-preview>
    `)
    await element.updateComplete
    element.elementVisible = true
    await element.updateComplete
    await aTimeout(100)
    expect(fetchedUrls).to.include(repoApiUrl)
    expect(element.__assetAvailable).to.equal(true)
    expect(element.__description).to.equal('A repo about web components')
    expect(element.repoLang).to.equal('JavaScript')
    expect(element.getAttribute('repo-lang')).to.equal('JavaScript')
    expect(element.__stars).to.equal(42)
    expect(element.__forks).to.equal(7)
    const link = element.shadowRoot.querySelector('a')
    expect(link.getAttribute('href')).to.equal(
      'https://github.com/haxtheweb/webcomponents',
    )
    expect(link.getAttribute('rel')).to.equal('noopener noreferrer')
    expect(
      element.shadowRoot.querySelector('div.header-container div')
        .textContent,
    ).to.equal('webcomponents')
    expect(
      element.shadowRoot.querySelector('div.description').textContent,
    ).to.equal('A repo about web components')
    expect(
      element.shadowRoot.querySelectorAll('div.stats-text')[0].textContent,
    ).to.equal('JavaScript')
    expect(
      element.shadowRoot.querySelectorAll('div.stats-text')[1].textContent,
    ).to.equal('42')
    expect(
      element.shadowRoot.querySelectorAll('div.stats-text')[2].textContent,
    ).to.equal('7')
    expect(element.shadowRoot.querySelector('.lang-circle')).to.exist
  })

  it('fetches the readme and renders the extended card', async () => {
    stubFetch(defaultHandler)
    const element = await fixture(html`
      <github-preview
        org="haxtheweb"
        repo="webcomponents"
        extended
      ></github-preview>
    `)
    await element.updateComplete
    element.elementVisible = true
    await element.updateComplete
    await aTimeout(100)
    expect(fetchedUrls).to.include(readmeRawUrl)
    expect(element.__readmeText).to.equal('# Readme heading')
    // BUG: github-preview.js:680-688 only looks up the wc-markdown instance
    // when elementVisible itself changes, and the intersection observer
    // typically flips elementVisible before the debounced fetch resolves,
    // so the lookup runs against the not-found branch and wcmarkdown stays
    // null (observed in an earlier run of this suite). Toggling
    // elementVisible after the data settles is the only reliable way the
    // lookup ever fires. Exposed by 'fetches the readme and renders the
    // extended card'.
    element.elementVisible = false
    await element.updateComplete
    element.elementVisible = true
    await element.updateComplete
    await aTimeout(50)
    expect(element.wcmarkdown).to.exist
    const container = element.shadowRoot.querySelector('div.container')
    expect(container).to.exist
    const links = element.shadowRoot.querySelectorAll(
      'div.header-container a',
    )
    expect(links[0].getAttribute('href')).to.equal(
      'https://github.com/haxtheweb',
    )
    expect(links[1].getAttribute('href')).to.equal(
      'https://github.com/haxtheweb/webcomponents',
    )
    expect(element.shadowRoot.querySelector('wc-markdown')).to.exist
    expect(
      element.shadowRoot.querySelector('button.readme-btn').textContent.trim(),
    ).to.equal('View More')
  })

  it('expands the readme from the view more button', async () => {
    stubFetch(defaultHandler)
    const element = await fixture(html`
      <github-preview
        org="haxtheweb"
        repo="webcomponents"
        extended
      ></github-preview>
    `)
    await element.updateComplete
    element.elementVisible = true
    await element.updateComplete
    await aTimeout(100)
    const button = element.shadowRoot.querySelector('button.readme-btn')
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await element.updateComplete
    expect(element.readmeExtended).to.equal(true)
    expect(element.hasAttribute('readme-extended')).to.equal(true)
    expect(element.shadowRoot.querySelector('button.readme-btn')).to.not.exist
  })

  it('marks itself unavailable when the api call rejects', async () => {
    stubFetch(() => Promise.reject(new Error('offline')))
    const element = await fixture(html`
      <github-preview org="haxtheweb" repo="webcomponents"></github-preview>
    `)
    await element.updateComplete
    await aTimeout(100)
    expect(element.__assetAvailable).to.equal(false)
  })

  it('tolerates a failed readme fetch in extended mode', async () => {
    stubFetch((url) => {
      if (url === repoApiUrl) return repoResponse()
      return { ok: false, json: () => Promise.resolve({}), text: () => Promise.resolve('') }
    })
    const element = await fixture(html`
      <github-preview
        org="haxtheweb"
        repo="webcomponents"
        extended
      ></github-preview>
    `)
    await element.updateComplete
    element.elementVisible = true
    await element.updateComplete
    await aTimeout(100)
    expect(element.__assetAvailable).to.equal(true)
  })

  it('ignores an empty api response', async () => {
    stubFetch(() => jsonResponse(null))
    const element = await fixture(html`
      <github-preview org="haxtheweb" repo="webcomponents"></github-preview>
    `)
    await element.updateComplete
    await aTimeout(100)
    // handleResponse(null) is a no-op
    expect(element.__description).to.equal(undefined)
  })

  it('re-renders the wc-markdown instance when readme changes', async () => {
    stubFetch(defaultHandler)
    const element = await fixture(html`
      <github-preview
        org="haxtheweb"
        repo="webcomponents"
        extended
      ></github-preview>
    `)
    await element.updateComplete
    element.elementVisible = true
    await element.updateComplete
    await aTimeout(100)
    // see the wcmarkdown lookup race bug note above: flip elementVisible
    // after the data settles so the lookup fires
    element.elementVisible = false
    await element.updateComplete
    element.elementVisible = true
    await element.updateComplete
    await aTimeout(50)
    const before = element.wcmarkdown.value
    stubFetch((url) => {
      if (url === repoApiUrl) return repoResponse()
      return textResponse('# Different readme')
    })
    element.repo = 'other-repo'
    await element.updateComplete
    await aTimeout(100)
    expect(element.__readmeText).to.equal('# Different readme')
    expect(element.wcmarkdown.value).to.not.equal(before)
  })

  it('registers its app connection once', async () => {
    const element = new GithubPreview()
    const events = []
    const handler = (e) => events.push(e.detail)
    globalThis.addEventListener('hax-register-app', handler)
    try {
      const store = { validGizmoTypes: [], appList: [] }
      element.haxgizmoRegistration(store)
      expect(store.validGizmoTypes).to.include('github')
      expect(events.length).to.equal(1)
      expect(events[0].connection.url).to.equal('api.github.com')
      // a second registration with the endpoint already present dispatches nothing
      const storeWithApp = {
        validGizmoTypes: [],
        appList: [{ connection: { url: 'api.github.com' } }],
      }
      element.haxgizmoRegistration(storeWithApp)
      expect(events.length).to.equal(1)
    } finally {
      globalThis.removeEventListener('hax-register-app', handler)
    }
  })

  it('tracks hax edit state and blocks link navigation inside hax', async () => {
    const element = new GithubPreview()
    expect(element._haxstate).to.equal(undefined)
    element.haxactiveElementChanged(element, true)
    expect(element._haxstate).to.equal(true)
    let prevented = false
    let propagationStopped = false
    let immediateStopped = false
    const fakeEvent = {
      preventDefault: () => {
        prevented = true
      },
      stopPropagation: () => {
        propagationStopped = true
      },
      stopImmediatePropagation: () => {
        immediateStopped = true
      },
    }
    element._clickLink(fakeEvent)
    expect(prevented).to.equal(true)
    expect(propagationStopped).to.equal(true)
    expect(immediateStopped).to.equal(true)
    element.haxeditModeChanged(false)
    expect(element._haxstate).to.equal(false)
    let blocked = false
    element._clickLink({
      preventDefault: () => {
        blocked = true
      },
      stopPropagation: () => {},
      stopImmediatePropagation: () => {},
    })
    expect(blocked).to.equal(false)
  })

  it('passes the a11y audit on the basic card', async () => {
    stubFetch(defaultHandler)
    const element = await fixture(html`
      <github-preview org="haxtheweb" repo="webcomponents"></github-preview>
    `)
    await element.updateComplete
    element.elementVisible = true
    await element.updateComplete
    await aTimeout(100)
    await expect(element).shadowDom.to.be.accessible()
  })
})

describe('wc-markdown', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch
    fetchHandler = null
  })

  it('is an instance of WCMarkdown', async () => {
    const element = await fixture(html`<wc-markdown></wc-markdown>`)
    expect(element).to.be.instanceOf(WCMarkdown)
    expect(element.value).to.equal('')
  })

  it('renders wc-content script markdown to html', async () => {
    const element = await fixture(html`
      <wc-markdown>
        <script type="wc-content">
          # Scripted heading
        </script>
      </wc-markdown>
    `)
    await aTimeout(100)
    expect(element.value).to.include('Scripted heading')
    expect(element.innerHTML).to.include('Scripted heading')
    // markdown is converted, not dumped as plain text
    expect(element.innerHTML).to.include('<h1')
  })

  it('renders slotted text content when no script is present', async () => {
    const element = await fixture(html`
      <wc-markdown>Plain text content</wc-markdown>
    `)
    await aTimeout(100)
    expect(element.value).to.equal('Plain text content')
    expect(element.innerHTML).to.include('Plain text content')
  })

  it('loads and renders markdown from a src url', async () => {
    stubFetch(() => textResponse('# Fetched heading'))
    const element = await fixture(
      html`<wc-markdown src="https://example.com/readme.md"></wc-markdown>`,
    )
    await aTimeout(100)
    expect(fetchedUrls).to.include('https://example.com/readme.md')
    expect(element.value).to.equal('# Fetched heading')
    expect(element.innerHTML).to.include('Fetched heading')
    expect(element.getAttribute('src')).to.equal('https://example.com/readme.md')
  })

  it('only reacts to src attribute changes', async () => {
    const calls = []
    stubFetch(() => {
      calls.push('x')
      return textResponse('x')
    })
    const element = await fixture(html`<wc-markdown></wc-markdown>`)
    element.setAttribute('src', 'https://example.com/a.md')
    await aTimeout(50)
    expect(element.src).to.equal('https://example.com/a.md')
    expect(calls.length).to.equal(1)
    // same value twice does not refetch
    element.attributeChangedCallback(
      'src',
      'https://example.com/a.md',
      'https://example.com/a.md',
    )
    await aTimeout(50)
    expect(calls.length).to.equal(1)
  })

  it('sanitizes rendered markdown', async () => {
    const element = await fixture(html`<wc-markdown></wc-markdown>`)
    element.value = 'Hello <script>alert(1)</script> world'
    await aTimeout(100)
    expect(element.innerHTML).to.include('Hello')
    expect(element.innerHTML.toLowerCase()).to.not.include('<script')
  })

  it('prepares markdown without un-escaping entities', async () => {
    expect(WCMarkdown.prepare('&lt;script&gt;')).to.equal('&lt;script&gt;')
    const htmlOut = await WCMarkdown.toHtml('# Hi')
    expect(htmlOut).to.include('Hi')
  })

  it('dedents space-indented script content', async () => {
    expect(WCMarkdown.dedentText('\n  alpha\n  beta')).to.equal('alpha\nbeta')
  })

  it('dedents tab-indented script content', async () => {
    expect(WCMarkdown.dedentText('\n\talpha\n\tbeta')).to.equal('alpha\nbeta')
  })

  it('keeps lines shorter than the indent intact', async () => {
    expect(WCMarkdown.dedentText('\n  alpha\nbeta')).to.equal('alpha\nbeta')
  })

  it('drops leading blank lines and trailing blank lines', async () => {
    expect(WCMarkdown.dedentText('alpha\n')).to.equal('alpha')
    expect(WCMarkdown.dedentText('alpha\nbeta')).to.equal('alpha\nbeta')
  })
})

describe('github-rpg-contributors', () => {
  // every fixture in here triggers a contributors fetch (even unconfigured
  // ones), so the stub must be in place before any element is created
  beforeEach(() => {
    stubFetch(defaultHandler)
  })
  afterEach(() => {
    globalThis.fetch = originalFetch
    fetchHandler = null
  })

  it('is an instance of GithubRpgContributors with defaults', async () => {
    const element = await fixture(
      html`<github-rpg-contributors></github-rpg-contributors>`,
    )
    expect(element).to.be.instanceOf(GithubRpgContributors)
    expect(GithubRpgContributors.tag).to.equal('github-rpg-contributors')
    expect(element.org).to.equal('')
    expect(element.repo).to.equal('')
    expect(element.limit).to.equal(50)
    expect(element.contributors).to.deep.equal([])
    expect(GithubRpgContributors.haxProperties).to.include(
      'github-rpg-contributors.haxProperties.json',
    )
  })

  it('fetches and lists contributors from the api', async () => {
    stubFetch(defaultHandler)
    const element = await fixture(html`
      <github-rpg-contributors
        org="haxtheweb"
        repo="webcomponents"
      ></github-rpg-contributors>
    `)
    await aTimeout(100)
    expect(fetchedUrls).to.include(contributorsApiUrl)
    expect(element.contributors).to.deep.equal([
      { login: 'alice', contributions: 10 },
      { login: 'bob', contributions: 5 },
    ])
    const wrapper = element.shadowRoot.querySelector('.wrapper')
    expect(wrapper).to.exist
    expect(element.shadowRoot.querySelector('h3 a').getAttribute('href')).to.equal(
      'https://github.com/haxtheweb/webcomponents',
    )
    const cards = element.shadowRoot.querySelectorAll('.contributor')
    expect(cards.length).to.equal(2)
    expect(cards[0].querySelector('.content div').textContent).to.equal('alice')
    expect(
      cards[0].querySelectorAll('.content div')[1].textContent,
    ).to.include('10')
    expect(cards[0].querySelector('a').getAttribute('href')).to.equal(
      'https://github.com/alice',
    )
  })

  it('limits the rendered contributor list', async () => {
    stubFetch(defaultHandler)
    const element = await fixture(html`
      <github-rpg-contributors
        org="haxtheweb"
        repo="webcomponents"
      ></github-rpg-contributors>
    `)
    await aTimeout(100)
    element.limit = 1
    await element.updateComplete
    expect(
      element.shadowRoot.querySelectorAll('.contributor').length,
    ).to.equal(1)
    // limit of 0 shows everyone
    element.limit = 0
    await element.updateComplete
    expect(
      element.shadowRoot.querySelectorAll('.contributor').length,
    ).to.equal(2)
  })

  it('tolerates an empty contributors payload', async () => {
    // a non-array payload (GitHub error/rate-limit objects) keeps the list
    // empty from the outside, but see the BUG note below
    stubFetch(() => jsonResponse({ message: 'API rate limit exceeded' }))
    const element = await fixture(html`
      <github-rpg-contributors
        org="haxtheweb"
        repo="webcomponents"
      ></github-rpg-contributors>
    `)
    await aTimeout(100)
    // BUG: github-rpg-contributors.js:108 spreads the json payload
    // ([...data]) without checking it is an array, so any non-array
    // response (e.g. a rate-limit error object) throws an unhandled
    // TypeError ('data is not iterable') in the fetch chain; the rendered
    // list just stays empty. Exposed by 'tolerates an empty contributors
    // payload' (the TypeError appears in the browser logs of this run).
    expect(element.shadowRoot.querySelectorAll('.contributor').length).to.equal(
      0,
    )
  })

  it('renders an empty state before data arrives', async () => {
    stubFetch(defaultHandler)
    const element = await fixture(
      html`<github-rpg-contributors></github-rpg-contributors>`,
    )
    await element.updateComplete
    expect(element.shadowRoot.querySelector('.wrapper')).to.exist
    expect(element.shadowRoot.querySelectorAll('.contributor').length).to.equal(0)
  })

  it('passes the a11y audit on the rendered list', async () => {
    stubFetch(defaultHandler)
    const element = await fixture(html`
      <github-rpg-contributors
        org="haxtheweb"
        repo="webcomponents"
      ></github-rpg-contributors>
    `)
    await aTimeout(100)
    await expect(element).shadowDom.to.be.accessible()
  })
})
