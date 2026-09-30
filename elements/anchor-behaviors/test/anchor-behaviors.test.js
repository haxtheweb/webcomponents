import { expect } from '@open-wc/testing'
import '../anchor-behaviors.js'

describe('AnchorBehaviors.getTarget', () => {
  let cleanup

  beforeEach(() => {
    cleanup = []
    // reset singleton registry state between tests
    globalThis.AnchorBehaviors.target = undefined
    globalThis.AnchorBehaviors.params = undefined
    globalThis.location.hash = ''
  })

  afterEach(() => {
    cleanup.forEach((el) => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el)
      }
    })
    globalThis.AnchorBehaviors.target = undefined
    globalThis.AnchorBehaviors.params = undefined
    globalThis.location.hash = ''
  })

  const makeElement = (attrs, append = true) => {
    const el = globalThis.document.createElement('div')
    if (attrs && attrs.id) {
      el.id = attrs.id
    }
    if (attrs && attrs.resource) {
      el.resource = attrs.resource
    }
    el.scrollIntoView = () => {
      el.scrolledIntoView = true
    }
    if (append) {
      globalThis.document.body.appendChild(el)
      cleanup.push(el)
    }
    return el
  }

  it('registers a global AnchorBehaviors object with getTarget', () => {
    expect(globalThis.AnchorBehaviors).to.exist
    expect(typeof globalThis.AnchorBehaviors.getTarget).to.equal('function')
  })

  it('finds an element by id from the location hash', () => {
    const el = makeElement({ id: 'hash-target-el' })
    globalThis.location.hash = '#hash-target-el'
    const target = globalThis.AnchorBehaviors.getTarget(null)
    expect(target === el).to.be.true
    expect(globalThis.AnchorBehaviors.params.id).to.equal('hash-target-el')
    expect(el.scrolledIntoView).to.be.true
  })

  it('returns a cached target on subsequent calls', () => {
    const el = makeElement({ id: 'cached-target-el' }, false)
    globalThis.AnchorBehaviors.target = el
    const t1 = globalThis.AnchorBehaviors.getTarget(null)
    const t2 = globalThis.AnchorBehaviors.getTarget(null)
    expect(t1 === el).to.be.true
    expect(t2 === el).to.be.true
    // params never parsed because target already existed
    expect(globalThis.AnchorBehaviors.params).to.equal(undefined)
  })

  it('returns null when nothing matches', () => {
    const target = globalThis.AnchorBehaviors.getTarget(null)
    expect(target).to.be.null
  })

  it('parses multiple hash params with quirky id= rewrite', () => {
    globalThis.location.hash = '#a&resource=y'
    globalThis.AnchorBehaviors.getTarget(null)
    // the parser prefixes id= onto the raw hash so the first bare
    // segment becomes the id value; segments containing = become pairs
    expect(globalThis.AnchorBehaviors.params.id).to.equal('a')
    expect(globalThis.AnchorBehaviors.params.resource).to.equal('y')
  })

  it('treats a hash with an extra = in the first segment as empty params', () => {
    // id=x makes the prefixed string id=id=x which double-replaces
    // to invalid JSON
    globalThis.location.hash = '#id=x&resource=y'
    globalThis.AnchorBehaviors.getTarget(null)
    expect(globalThis.AnchorBehaviors.params.id).to.equal(undefined)
    expect(globalThis.AnchorBehaviors.params.resource).to.equal(undefined)
  })

  it('treats an unparseable hash as empty params', () => {
    globalThis.location.hash = '#a=b=c'
    const target = globalThis.AnchorBehaviors.getTarget(null)
    expect(globalThis.AnchorBehaviors.params.id).to.equal(undefined)
    expect(target).to.be.null
  })

  it('matches a supplied element by id when dom search misses', () => {
    const el = makeElement({ id: 'direct-el' }, false)
    globalThis.AnchorBehaviors.params = { id: 'direct-el' }
    const target = globalThis.AnchorBehaviors.getTarget(el)
    expect(target === el).to.be.true
    expect(el.scrolledIntoView).to.be.true
  })

  it('strips # from ids when matching a supplied element', () => {
    const el = makeElement({ id: '#hash-el' }, false)
    globalThis.AnchorBehaviors.params = { id: '#hash-el' }
    const target = globalThis.AnchorBehaviors.getTarget(el)
    expect(target === el).to.be.true
  })

  it('matches a supplied element id against params resource', () => {
    const el = makeElement({ id: 'cross-a' }, false)
    globalThis.AnchorBehaviors.params = { resource: 'cross-a' }
    const target = globalThis.AnchorBehaviors.getTarget(el)
    expect(target === el).to.be.true
  })

  it('matches a supplied element resource against params id', () => {
    const el = makeElement({}, false)
    el.resource = 'cross-b'
    globalThis.AnchorBehaviors.params = { id: 'cross-b' }
    const target = globalThis.AnchorBehaviors.getTarget(el)
    expect(target === el).to.be.true
  })

  it('matches a supplied element resource against params resource', () => {
    const el = makeElement({}, false)
    el.resource = 'cross-c'
    globalThis.AnchorBehaviors.params = { resource: 'cross-c' }
    const target = globalThis.AnchorBehaviors.getTarget(el)
    expect(target === el).to.be.true
  })

  it('returns undefined-ish null when supplied element does not match', () => {
    const el = makeElement({ id: 'no-match-el' }, false)
    globalThis.AnchorBehaviors.params = { id: 'other-el' }
    const target = globalThis.AnchorBehaviors.getTarget(el)
    expect(target).to.be.null
  })

  it('finds an element with # resource attribute via querySelector', () => {
    const el = makeElement()
    el.setAttribute('resource', '#res-1')
    globalThis.AnchorBehaviors.params = { id: 'res-1' }
    const target = globalThis.AnchorBehaviors.getTarget(null)
    expect(target === el).to.be.true
    expect(el.scrolledIntoView).to.be.true
  })

  it('finds an element with plain resource attribute via querySelector', () => {
    const el = makeElement()
    el.setAttribute('resource', 'res-2')
    globalThis.AnchorBehaviors.params = { id: 'res-2' }
    const target = globalThis.AnchorBehaviors.getTarget(null)
    expect(target === el).to.be.true
  })

  it('falls back to params resource in the resource querySelector', () => {
    const el = makeElement()
    el.setAttribute('resource', 'res-3')
    globalThis.AnchorBehaviors.params = { resource: 'res-3' }
    const target = globalThis.AnchorBehaviors.getTarget(null)
    expect(target === el).to.be.true
  })

  it('clobbers globalThis.onload with the getParams return value (BUG)', () => {
    const el = makeElement({ id: 'onload-el' })
    globalThis.location.hash = '#onload-el'
    globalThis.onload = () => {}
    const target = globalThis.AnchorBehaviors.getTarget(null)
    expect(target === el).to.be.true
    // BUG: anchor-behaviors.js:57 assigns `globalThis.onload = getParams()`
    // which stores the function's undefined return value instead of the
    // function reference itself, clobbering any pre-existing onload handler
    // (undefined coerces to null for the nullable EventHandler IDL attribute)
    expect(globalThis.onload).to.equal(null)
  })
})
