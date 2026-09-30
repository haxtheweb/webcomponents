import { fixture, expect, html } from '@open-wc/testing'
import { SimpleSearch } from '../simple-search.js'
import '../simple-search.js'
// direct imports of every lib file so they are exercised first-party
import { SimpleSearchContent } from '../lib/simple-search-content.js'
import { SimpleSearchMatch } from '../lib/simple-search-match.js'
import '../lib/simple-search-content.js'
import '../lib/simple-search-match.js'

const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

async function waitFor(fn, timeout = 2000) {
  const start = Date.now()
  while (!fn() && Date.now() - start < timeout) {
    await tick()
  }
}

describe('simple-search defaults and rendering', () => {
  let element

  beforeEach(async () => {
    element = await fixture(html`<simple-search></simple-search>`)
  })

  it('has sensible constructor defaults', () => {
    expect(SimpleSearch.tag).to.equal('simple-search')
    expect(element.alwaysFloatLabel).to.be.false
    expect(element.caseSensitive).to.equal(null)
    expect(element.controls).to.equal(null)
    expect(element.nextButtonIcon).to.equal('arrow-forward')
    expect(element.nextButtonLabel).to.equal('next result')
    expect(element.prevButtonIcon).to.equal('arrow-back')
    expect(element.prevButtonLabel).to.equal('previous result')
    expect(element.resultCount).to.equal(0)
    expect(element.resultPointer).to.equal(0)
    expect(element.searchInputIcon).to.equal('search')
    expect(element.searchInputLabel).to.equal('search')
    expect(element.searchTerms.length).to.equal(0)
    expect(element.__hideNext).to.be.true
    expect(element.__hidePrev).to.be.true
  })

  it('renders the input, x-of-y region and nav buttons', () => {
    const input = element.shadowRoot.querySelector('#input')
    const xofy = element.shadowRoot.querySelector('#xofy')
    const nav = element.shadowRoot.querySelector('#searchnav')
    const prev = element.shadowRoot.querySelector('#prev')
    const next = element.shadowRoot.querySelector('#next')
    expect(input).to.exist
    expect(xofy.getAttribute('aria-live')).to.equal('polite')
    expect(xofy.getAttribute('aria-atomic')).to.equal('true')
    expect(xofy.textContent.trim()).to.equal('0')
    expect(nav).to.exist
    expect(prev.getAttribute('aria-label')).to.equal('previous result')
    expect(next.getAttribute('aria-label')).to.equal('next result')
    // NOTE (bug): the controls-fallback commits an empty aria-controls
    // attribute, so the button:not([aria-controls]) hide rule never matches
    // and the nav buttons are displayed even without a controls target
    expect(prev.getAttribute('aria-controls')).to.equal('')
    expect(next.getAttribute('aria-controls')).to.equal('')
    expect(prev.disabled).to.be.true
    expect(next.disabled).to.be.true
  })

  it('wires aria-controls onto the nav buttons when controls is set', async () => {
    const el = await fixture(
      html`<simple-search controls="content-x"></simple-search>`,
    )
    expect(
      el.shadowRoot.querySelector('#prev').getAttribute('aria-controls'),
    ).to.equal('content-x')
    expect(
      el.shadowRoot.querySelector('#next').getAttribute('aria-controls'),
    ).to.equal('content-x')
  })

  it('renders x-of-y text from the result pointer and count', async () => {
    element.resultPointer = 2
    element.resultCount = 5
    await element.updateComplete
    expect(
      element.shadowRoot.querySelector('#xofy').textContent.trim(),
    ).to.equal('2/5')
    element.resultPointer = 0
    await element.updateComplete
    expect(
      element.shadowRoot.querySelector('#xofy').textContent.trim(),
    ).to.equal('5')
  })
})

describe('simple-search helpers', () => {
  let element

  beforeEach(async () => {
    element = await fixture(html`<simple-search></simple-search>`)
  })

  it('_hasNoSearch checks for terms', () => {
    expect(element._hasNoSearch([])).to.be.true
    expect(element._hasNoSearch(['the'])).to.be.false
  })

  it('_getResultsSpan formats the results indicator', () => {
    expect(element._getResultsSpan(0, 0)).to.equal('0')
    expect(element._getResultsSpan(0, 5)).to.equal(5)
    expect(element._getResultsSpan(2, 5)).to.equal('2/5')
  })

  it('_isNavButtonDisabled disables buttons at the boundaries', () => {
    expect(element._isNavButtonDisabled(0, 0)).to.be.true
    expect(element._isNavButtonDisabled(1, 5)).to.be.false
    expect(element._isNavButtonDisabled(1, 5, -1)).to.be.true
    expect(element._isNavButtonDisabled(5, 5)).to.be.true
    expect(element._isNavButtonDisabled(4, 5)).to.be.false
  })

  it('_getNavDisabled updates the hide flags', () => {
    element._getNavDisabled(2, 5)
    expect(element.__hidePrev).to.be.false
    expect(element.__hideNext).to.be.false
    element._getNavDisabled(1, 5)
    expect(element.__hidePrev).to.be.true
    expect(element.__hideNext).to.be.false
    element._getNavDisabled(5, 5)
    expect(element.__hidePrev).to.be.false
    expect(element.__hideNext).to.be.true
  })

  it('updated recalculates nav disabled state for pointer and count', async () => {
    element.resultCount = 2
    element.resultPointer = 1
    // the disabled bindings render one cycle after updated() flips the flags
    await waitFor(() => {
      return element.shadowRoot.querySelector('#next').disabled === false
    })
    expect(element.__hidePrev).to.be.true
    expect(element.__hideNext).to.be.false
    expect(element.shadowRoot.querySelector('#prev').disabled).to.be.true
    expect(element.shadowRoot.querySelector('#next').disabled).to.be.false
    element.resultPointer = 2
    await waitFor(() => {
      return element.shadowRoot.querySelector('#next').disabled === true
    })
    expect(element.shadowRoot.querySelector('#next').disabled).to.be.true
  })
})

describe('simple-search findMatches', () => {
  let element

  beforeEach(async () => {
    element = await fixture(html`<simple-search></simple-search>`)
  })

  it('wraps case-insensitive matches and counts them', () => {
    element.searchTerms = ['the']
    const results = element.findMatches('The cat and the hat')
    expect(element.resultCount).to.equal(2)
    expect(element.resultPointer).to.equal(0)
    expect(results).to.include('match-number="1"')
    expect(results).to.include('match-number="2"')
    expect(results).to.include('<simple-search-match')
    expect(results).to.include('>The</simple-search-match>')
    expect(results).to.include('>the</simple-search-match>')
  })

  it('resets the result pointer on each search', () => {
    element.resultPointer = 3
    element.searchTerms = ['cat']
    element.findMatches('The cat and the hat')
    expect(element.resultPointer).to.equal(0)
  })

  it('honors caseSensitive searching', () => {
    element.searchTerms = ['the']
    element.caseSensitive = true
    const results = element.findMatches('The cat and the hat')
    expect(element.resultCount).to.equal(1)
    expect(results).to.not.include('>The</simple-search-match>')
    expect(results).to.include('>the</simple-search-match>')
  })

  it('strips pre-existing match tags before rewrapping', () => {
    element.searchTerms = ['the']
    const dirty =
      'the cat <simple-search-match tabindex="0" match-number="1">the</simple-search-match>'
    const results = element.findMatches(dirty)
    expect(element.resultCount).to.equal(2)
    expect(results).to.not.include(
      '<simple-search-match tabindex="0" match-number="1"><simple-search-match',
    )
  })

  it('searches for every term in the list', () => {
    element.searchTerms = ['cat', 'hat']
    const results = element.findMatches('The cat and the hat')
    expect(element.resultCount).to.equal(2)
    expect(results).to.include('>cat</simple-search-match>')
    expect(results).to.include('>hat</simple-search-match>')
  })
})

describe('simple-search _getSearchText', () => {
  let element
  let target

  beforeEach(async () => {
    target = globalThis.document.createElement('div')
    target.id = 'get-search-text-target'
    globalThis.document.body.appendChild(target)
    // a controls target is required because setting the input value fires
    // value-changed -> _handleChange automatically
    element = await fixture(
      html`<simple-search
        controls="get-search-text-target"
      ></simple-search>`,
    )
  })

  afterEach(() => {
    if (target && target.parentNode) {
      target.parentNode.removeChild(target)
    }
  })

  it('splits, trims and drops empty terms between quotes', async () => {
    element.shadowRoot.querySelector('#input').value = 'the "quick" fox'
    await tick()
    expect(element.searchTerms).to.deep.equal(['the', 'quick', 'fox'])
  })

  it('treats an empty input as no terms', async () => {
    element.shadowRoot.querySelector('#input').value = ''
    await tick()
    expect(element.searchTerms).to.deep.equal([])
  })

  it('leaks an empty term for consecutive quote pairs (BUG)', async () => {
    // BUG: simple-search.js:429-432 removes empty terms with splice inside
    // a forward for loop, so the element after each removal is skipped and
    // consecutive quote pairs leak an empty search term
    element.shadowRoot.querySelector('#input').value = 'a""""b'
    await tick()
    expect(element.searchTerms).to.deep.equal(['a', '', 'b'])
  })
})

describe('simple-search _handleChange integration', () => {
  let element
  let content
  let cleanup

  beforeEach(async () => {
    cleanup = []
    content = globalThis.document.createElement('div')
    content.id = 'search-content-target'
    content.innerHTML = 'The cat and the hat'
    globalThis.document.body.appendChild(content)
    cleanup.push(content)
    element = await fixture(
      html`<simple-search controls="search-content-target"></simple-search>`,
    )
  })

  afterEach(() => {
    cleanup.forEach((node) => {
      if (node && node.parentNode) {
        node.parentNode.removeChild(node)
      }
    })
  })

  it('searches the controlled content and dispatches simple-search', async () => {
    const events = []
    const onSearch = (e) => {
      events.push(e.detail)
    }
    element.addEventListener('simple-search', onSearch)
    try {
      element.shadowRoot.querySelector('#input').value = 'the'
      // the value change fires _handleChange once automatically
      await tick()
      expect(element.searchTerms).to.deep.equal(['the'])
      expect(element.resultCount).to.equal(2)
      expect(element.resultPointer).to.equal(0)
      expect(content.innerHTML).to.include('simple-search-match')
      expect(content.innerHTML).to.include('match-number="2"')
      expect(events.length).to.equal(1)
      expect(events[0].search === element).to.be.true
    } finally {
      element.removeEventListener('simple-search', onSearch)
    }
  })

  it('limits the search to elements matching the selector', async () => {
    const scoped = globalThis.document.createElement('div')
    scoped.id = 'search-selector-target'
    scoped.innerHTML = '<p>the hat</p><span>the cat</span>'
    globalThis.document.body.appendChild(scoped)
    cleanup.push(scoped)
    const el = await fixture(
      html`<simple-search
        controls="search-selector-target"
        selector="p"
      ></simple-search>`,
    )
    el.shadowRoot.querySelector('#input').value = 'the'
    await tick()
    expect(el.resultCount).to.equal(1)
    expect(scoped.querySelector('p').innerHTML).to.include(
      'simple-search-match',
    )
    expect(scoped.querySelector('span').innerHTML).to.not.include(
      'simple-search-match',
    )
  })

  it('crashes when no controls target is set (BUG)', async () => {
    const el = await fixture(html`<simple-search></simple-search>`)
    const events = []
    const onSearch = () => {
      events.push('fired')
    }
    el.addEventListener('simple-search', onSearch)
    try {
      // BUG: simple-search.js:340-346 — selections is null when controls is
      // unset, so selections.forEach throws a TypeError and the
      // simple-search event never dispatches. This also crashes the real
      // value-changed event path (verified: setting #input.value on a
      // controls-less element throws from SimpleFieldsField._fireValueChanged)
      expect(() => el._handleChange({})).to.throw()
      expect(events.length).to.equal(0)
    } finally {
      el.removeEventListener('simple-search', onSearch)
    }
  })
})

describe('simple-search _navigateResults', () => {
  let element

  beforeEach(async () => {
    element = await fixture(html`<simple-search></simple-search>`)
    element.resultCount = 2
    element.resultPointer = 1
    // the disabled bindings lag one render cycle behind updated()
    await waitFor(() => {
      return element.shadowRoot.querySelector('#next').disabled === false
    })
  })

  it('moves forward and back through results via the buttons', async () => {
    const events = []
    const onGoto = (e) => {
      events.push(e.detail)
    }
    element.addEventListener('goto-result', onGoto)
    try {
      element.shadowRoot.querySelector('#next').click()
      await waitFor(() => {
        return element.resultPointer === 2
      })
      expect(events[events.length - 1]).to.equal(2)
      await waitFor(() => {
        return element.shadowRoot.querySelector('#next').disabled === true
      })
      await waitFor(() => {
        return element.shadowRoot.querySelector('#prev').disabled === false
      })
      element.shadowRoot.querySelector('#prev').click()
      await waitFor(() => {
        return element.resultPointer === 1
      })
      expect(events[events.length - 1]).to.equal(1)
    } finally {
      element.removeEventListener('goto-result', onGoto)
    }
  })

  it('does not navigate past the boundaries', () => {
    const events = []
    const onGoto = () => {
      events.push('fired')
    }
    element.addEventListener('goto-result', onGoto)
    try {
      // next is a no-op once we are on the last result
      element.resultPointer = 2
      element._navigateResults({ currentTarget: { id: 'next' } })
      expect(element.resultPointer).to.equal(2)
      // prev is a no-op when already at the first result
      element.resultPointer = 1
      element._navigateResults({ currentTarget: { id: 'prev' } })
      expect(element.resultPointer).to.equal(1)
      expect(events.length).to.equal(0)
    } finally {
      element.removeEventListener('goto-result', onGoto)
    }
  })
})

describe('simple-search-match element', () => {
  it('renders slotted content and reflects the match number', async () => {
    expect(SimpleSearchMatch.tag).to.equal('simple-search-match')
    const el = await fixture(
      html`<simple-search-match match-number="3">term</simple-search-match>`,
    )
    expect(el.matchNumber).to.equal(3)
    expect(el.textContent.trim()).to.equal('term')
    el.matchNumber = 7
    await el.updateComplete
    expect(el.getAttribute('match-number')).to.equal('7')
    await expect(el).shadowDom.to.be.accessible()
  })
})

describe('simple-search-content element', () => {
  it('renders slotted content and exposes its tag', async () => {
    expect(SimpleSearchContent.tag).to.equal('simple-search-content')
    const el = await fixture(
      html`<simple-search-content>The cat</simple-search-content>`,
    )
    expect(el.textContent.trim()).to.equal('The cat')
  })

  it('enableSearch rewires searching and result focus', async () => {
    const content = await fixture(
      html`<simple-search-content>The cat</simple-search-content>`,
    )
    const fakeSearch = new EventTarget()
    fakeSearch.findMatches = (src) => {
      return src.replace(
        /The/gm,
        '<simple-search-match tabindex="0" match-number="1">The</simple-search-match>',
      )
    }
    content.enableSearch(fakeSearch)
    fakeSearch.dispatchEvent(new CustomEvent('simple-search', {}))
    expect(content.innerHTML).to.include('simple-search-match')
    // goto-result focuses the requested match
    fakeSearch.dispatchEvent(new CustomEvent('goto-result', { detail: 1 }))
    const match = content.querySelector('[match-number="1"]')
    expect(globalThis.document.activeElement === match).to.be.true
    // a missing match number is ignored without crashing
    fakeSearch.dispatchEvent(new CustomEvent('goto-result', { detail: 99 }))
    expect(globalThis.document.activeElement === match).to.be.true
  })
})
