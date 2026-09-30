import { fixture, expect, html, elementUpdated, aTimeout } from '@open-wc/testing'

import '../simple-filter.js'
import { LitElement } from 'lit'
import { SimpleFilter, SimpleFilterMixin } from '../simple-filter.js'

// simple-filter ships a mixin plus an unregistered concrete class, so
// behavior is exercised through a registered harness element that uses
// the mixin the same way consumers in the monorepo do.
class FilterHarness extends SimpleFilterMixin(LitElement) {
  static get tag() {
    return 'filter-harness'
  }
  render() {}
}
globalThis.customElements.define(FilterHarness.tag, FilterHarness)

// the concrete class carries the convention tag name; a registered subclass
// lets us exercise its constructor without the parser skipping over it
// (simple-filter itself is intentionally left unregistered upstream)
class SimpleFilterElement extends SimpleFilter {
  static get tag() {
    return 'simple-filter-element'
  }
  render() {}
}
globalThis.customElements.define(SimpleFilterElement.tag, SimpleFilterElement)

const harnessFixture = () => fixture(html`<filter-harness></filter-harness>`)

describe('simple-filter test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`
      <simple-filter title="test-title"></simple-filter>
    `)
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })
})

describe('simple-filter defaults', () => {
  it('constructor sets default state', async () => {
    const el = await harnessFixture()
    expect(el.caseSensitive).to.equal(false)
    expect(el.filtered).to.deep.equal([])
    expect(el.multiMatch).to.equal(false)
    expect(el.items).to.deep.equal([])
    expect(el.where).to.equal('title')
    expect(el.like).to.equal('')
  })

  it('has the conventional tag name on the concrete class and passes mixin defaults through it', async () => {
    expect(SimpleFilter.tag).to.equal('simple-filter')
    const el = await fixture(
      html`<simple-filter-element></simple-filter-element>`,
    )
    expect(el.where).to.equal('title')
    expect(el.items).to.deep.equal([])
    expect(el.caseSensitive).to.equal(false)
    expect(el.multiMatch).to.equal(false)
    expect(el.filtered).to.deep.equal([])
  })

  it('resetList adopts the provided list and resets filter inputs', async () => {
    const el = await harnessFixture()
    el.where = 'name'
    el.like = 'abc'
    el.resetList([{ title: 'one' }])
    expect(el.items).to.deep.equal([{ title: 'one' }])
    expect(el.where).to.equal('title')
    expect(el.like).to.equal('')
    // list should be a copy, not the same reference
    const list = [{ title: 'two' }]
    el.resetList(list)
    expect(el.items).to.not.equal(list)
    expect(el.items).to.deep.equal(list)
  })

  it('case-sensitive attribute reflects the caseSensitive property', async () => {
    const el = await harnessFixture()
    el.caseSensitive = true
    await elementUpdated(el)
    expect(el.hasAttribute('case-sensitive')).to.equal(true)
    el.caseSensitive = false
    await elementUpdated(el)
    expect(el.hasAttribute('case-sensitive')).to.equal(false)
  })

  it('escapeRegExp escapes special regex characters and whitespace', async () => {
    const el = await harnessFixture()
    expect(el.escapeRegExp('a.b?c')).to.equal('a\\.b\\?c')
    expect(el.escapeRegExp('a b')).to.equal('a\\ b')
    expect(el.escapeRegExp('(x)[y]{z}')).to.equal('\\(x\\)\\[y\\]\\{z\\}')
  })
})

describe('simple-filter _computeFiltered direct behavior', () => {
  let el
  beforeEach(async () => {
    el = await harnessFixture()
  })

  it('filters plain string items case-insensitively by default', () => {
    const result = el._computeFiltered(
      ['Apple', 'banana', 'apricot'],
      'title',
      'app',
      false,
      false,
    )
    expect(result).to.deep.equal(['Apple'])
  })

  it('respects caseSensitive flag', () => {
    const result = el._computeFiltered(
      ['apple', 'APPLE'],
      'title',
      'APP',
      true,
      false,
    )
    expect(result).to.deep.equal(['APPLE'])
  })

  it('matches numeric items by their string form', () => {
    const result = el._computeFiltered([12, 34, 21], 'title', '2', false, false)
    expect(result).to.deep.equal([12, 21])
  })

  it('matches a top-level object property via where', () => {
    const items = [{ title: 'hello world' }, { title: 'goodbye' }]
    const result = el._computeFiltered(items, 'title', 'hello', false, false)
    expect(result).to.deep.equal([items[0]])
  })

  it('decomposes dot-notation where into nested object properties', () => {
    const items = [{ meta: { author: 'bryan' } }, { meta: { author: 'nico' } }]
    const result = el._computeFiltered(
      items,
      'meta.author',
      'bryan',
      false,
      false,
    )
    expect(result).to.deep.equal([items[0]])
  })

  it('_decomposeWhere reduces dot notation against the item', () => {
    const item = { a: { b: { c: 42 } } }
    expect(el._decomposeWhere('a.b.c', item)).to.equal(42)
    expect(el._decomposeWhere('a.missing.deep', item)).to.equal(undefined)
  })

  it('returns items matching any space separated term when multiMatch is on', () => {
    const items = ['the quick brown fox', 'lazy dog day']
    const result = el._computeFiltered(items, 'title', 'quick dog', false, true)
    expect(result).to.deep.equal(items)
  })

  it('multiMatch does not match substrings inside other words', () => {
    const result = el._computeFiltered(
      ['rejoin party', 'join us'],
      'title',
      'join',
      false,
      true,
    )
    expect(result).to.deep.equal(['join us'])
  })

  it('survives regex-breaking user input and returns no items', () => {
    // backslash escaping is partially undone by the multiMatch branch;
    // an invalid leftover pattern must be swallowed by the try/catch
    const result = el._computeFiltered(['anything'], 'title', 'a\\', false, true)
    expect(result).to.deep.equal([])
  })

  it('warns when the where property is missing during active filtering', () => {
    const originalWarn = console.warn
    const warnings = []
    console.warn = (msg) => warnings.push(msg)
    try {
      const result = el._computeFiltered(
        [{ other: 'match me' }],
        'missing',
        'match',
        false,
        false,
      )
      expect(result).to.deep.equal([])
      expect(warnings.length).to.equal(1)
      expect(warnings[0]).to.contain('simple-filter was unable to find a property')
    } finally {
      console.warn = originalWarn
    }
  })

  it('does not warn when like is empty even if where is missing', () => {
    const originalWarn = console.warn
    const warnings = []
    console.warn = (msg) => warnings.push(msg)
    try {
      const result = el._computeFiltered(
        [{ other: 'x' }],
        'missing',
        '',
        false,
        false,
      )
      expect(result).to.deep.equal([{ other: 'x' }])
      expect(warnings.length).to.equal(0)
    } finally {
      console.warn = originalWarn
    }
  })
})

describe('simple-filter reactive filtering', () => {
  it('recomputes filtered after the debounce and dispatches filter events', async () => {
    const el = await harnessFixture()
    const filterEvents = []
    const changedEvents = []
    el.addEventListener('filter', (e) => filterEvents.push(e))
    el.addEventListener('filtered-changed', (e) => changedEvents.push(e))
    el.items = ['apple', 'banana', 'apricot']
    el.like = 'ap'
    await el.updateComplete
    await aTimeout(400)
    expect(el.filtered).to.deep.equal(['apple', 'apricot'])
    expect(filterEvents.length).to.be.greaterThan(0)
    expect(changedEvents.length).to.be.greaterThan(0)
    expect(changedEvents[0].detail.value).to.deep.equal(['apple', 'apricot'])
  })

  it('recalculates when caseSensitive toggles', async () => {
    const el = await harnessFixture()
    el.items = ['Apple', 'apple']
    el.like = 'APP'
    await el.updateComplete
    await aTimeout(400)
    expect(el.filtered).to.deep.equal(['Apple', 'apple'])
    el.caseSensitive = true
    await el.updateComplete
    await aTimeout(400)
    expect(el.filtered).to.deep.equal([])
  })

  it('debounces rapid changes into a single recompute', async () => {
    const el = await harnessFixture()
    let calls = 0
    const original = el._computeFiltered.bind(el)
    el._computeFiltered = (...args) => {
      calls++
      return original(...args)
    }
    el.items = ['aaa', 'bbb']
    el.like = 'a'
    el.like = 'aa'
    el.like = 'aaa'
    await el.updateComplete
    await aTimeout(400)
    expect(calls).to.equal(1)
    expect(el.filtered).to.deep.equal(['aaa'])
  })

  it('filter() clears where and like and triggers recomputation', async () => {
    const el = await harnessFixture()
    el.items = ['alpha', 'beta']
    el.where = 'title'
    el.like = 'alp'
    await el.updateComplete
    el.filter()
    expect(el.where).to.equal('')
    expect(el.like).to.equal('')
    await el.updateComplete
    await aTimeout(400)
    // clearing like fully resets the filtering so every item returns
    expect(el.filtered).to.deep.equal(['alpha', 'beta'])
  })

  it('recomputes filtered for object items driven by properties', async () => {
    const el = await harnessFixture()
    el.items = [{ title: 'cat' }, { title: 'dog' }]
    el.like = 'cat'
    await el.updateComplete
    await aTimeout(400)
    expect(el.filtered).to.deep.equal([{ title: 'cat' }])
  })

  it('multi-match attribute maps to the multiMatch property', async () => {
    const el = await fixture(
      html`<filter-harness multi-match></filter-harness>`,
    )
    expect(el.multiMatch).to.equal(true)
  })
})
