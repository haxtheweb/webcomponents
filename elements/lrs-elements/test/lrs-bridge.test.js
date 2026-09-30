import { fixture, expect, html } from '@open-wc/testing'
import sinon from 'sinon'
import { localStorageSet } from '@haxtheweb/utils/utils.js'
import '../lib/lrs-bridge.js'
import { LrsBridge } from '../lib/lrs-bridge.js'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

describe('lrs-bridge test', () => {
  let element
  let sandbox
  let fetchStub

  beforeEach(async () => {
    sandbox = sinon.createSandbox()
    // stub ALL network access; the LRS endpoint is always fake
    fetchStub = sandbox
      .stub(globalThis, 'fetch')
      .resolves({ json: () => Promise.resolve({ data: { createStatement: { id: '1' } } }) })
    globalThis.localStorage.clear()
    element = await fixture(html`
      <lrs-bridge endpoint="https://lrs.example.com/graphql"></lrs-bridge>
    `)
  })

  afterEach(() => {
    sandbox.restore()
    globalThis.localStorage.clear()
  })

  it('has the correct tag name', () => {
    expect(element.tagName.toLowerCase()).to.equal('lrs-bridge')
    expect(LrsBridge.tag).to.equal('lrs-bridge')
  })

  it('defaults the endpoint to an empty string', async () => {
    const el = await fixture(html`<lrs-bridge></lrs-bridge>`)
    expect(el.endpoint).to.equal('')
  })

  describe('recordStatement', () => {
    it('posts a GraphQL createStatement mutation to the endpoint', async () => {
      element.recordStatement({
        verb: { id: 'viewed' },
        object: { id: 'https://example.com/page' },
      })
      await wait(50)
      expect(fetchStub.calledOnce).to.be.true
      expect(fetchStub.firstCall.args[0]).to.equal(
        'https://lrs.example.com/graphql',
      )
      const options = fetchStub.firstCall.args[1]
      expect(options.method).to.equal('POST')
      expect(options.headers['Content-Type']).to.equal('application/json')
      const body = JSON.parse(options.body)
      expect(body.query).to.include('createStatement')
      expect(body.variables.data.data.verb.id).to.equal('viewed')
      expect(body.variables.data.data.object.id).to.equal(
        'https://example.com/page',
      )
    })

    it('returns the stored user name as the actor on later calls', async () => {
      // seed a stored name via the JSON-wrapping utils setter so
      // localStorageGet can parse it back out
      localStorageSet('lrs-name', 'Bob Learner')
      element.recordStatement({ verb: { id: 'viewed' } })
      await wait(50)
      const body = JSON.parse(fetchStub.firstCall.args[1].body)
      expect(body.variables.data.data.actor.name).to.equal('Bob Learner')
    })

    it('swallows synchronous fetch errors', async () => {
      fetchStub.throws(new Error('network down'))
      expect(() => element.recordStatement({ verb: { id: 'viewed' } })).to.not
        .throw
    })

    it('first-run actor name is empty even though a GUID was stored', async () => {
      // BUG (lib/lrs-bridge.js:84-91): when no name is stored, getUserName
      // generates and SAVES a new GUID but returns the stale empty
      // currentName instead of newName, so the first statement is recorded
      // with an empty actor name.
      const firstActor = element.getUserName()
      expect(firstActor).to.equal('')
      // the utils setter JSON-wraps the value, so read it back via the
      // storage to confirm a 36 char GUID was actually persisted
      const stored = globalThis.localStorage.getItem('lrs-name')
      expect(typeof stored).to.equal('string')
      expect(stored.length).to.equal(38)
      expect(stored.charAt(0)).to.equal('"')
      // the next call does return the now-stored GUID
      expect(element.getUserName()).to.equal(JSON.parse(stored))
      expect(element.getUserName().length).to.equal(36)
    })
  })

  describe('getUserName', () => {
    it('returns the stored name when one exists', () => {
      localStorageSet('lrs-name', 'Alice')
      expect(element.getUserName()).to.equal('Alice')
    })

    it('stores a GUID when no name exists', () => {
      const name = element.getUserName()
      // documented BUG: the fresh GUID is stored but not returned (see above)
      expect(name).to.equal('')
      expect(globalThis.localStorage.getItem('lrs-name')).to.not.equal(null)
    })
  })

  describe('makeGUID', () => {
    it('creates 36 character dashed identifiers', () => {
      const guid = element.makeGUID()
      expect(guid.length).to.equal(36)
      expect(guid.split('-').length).to.equal(5)
      expect(guid).to.match(/^[0-9a-f-]{36}$/)
    })

    it('creates unique identifiers', () => {
      expect(element.makeGUID() === element.makeGUID()).to.be.false
    })
  })

  describe('lrs-emitter event handling', () => {
    it('does not record statements while _enableProperties is unset', async () => {
      const recordSpy = sandbox.spy(element, 'recordStatement')
      element.dispatchEvent(
        new CustomEvent('lrs-emitter', {
          bubbles: true,
          detail: { verb: { id: 'viewed' } },
        }),
      )
      await wait(50)
      // BUG (lib/lrs-bridge.js:37): the handler only records when
      // this._enableProperties is truthy, but nothing in this class (or
      // the subclass) ever sets that flag, so lrs-emitter events are
      // always ignored by the bridge.
      expect(recordSpy.called).to.be.false
      expect(fetchStub.called).to.be.false
    })

    it('records statements when _enableProperties is set', async () => {
      element._enableProperties = true
      element.dispatchEvent(
        new CustomEvent('lrs-emitter', {
          bubbles: true,
          detail: { verb: { id: 'experienced' } },
        }),
      )
      await wait(50)
      expect(fetchStub.calledOnce).to.be.true
      // the handler passes the raw event object into recordStatement (not
      // e.detail). CustomEvent fields like detail/type live on the prototype
      // as getters, so Object.assign drops them entirely and the recorded
      // statement data only carries the actor (the verb is lost).
      const body = JSON.parse(fetchStub.firstCall.args[1].body)
      const keys = Object.keys(body.variables.data.data)
      // the meaningful part: actor is present, the verb detail is lost
      expect(keys).to.include('actor')
      expect(keys).to.not.include('verb')
      expect(keys).to.not.include('detail')
    })
  })
})
