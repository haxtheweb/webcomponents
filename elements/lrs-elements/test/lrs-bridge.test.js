import { fixture, expect, html } from '@open-wc/testing'
import sinon from 'sinon'
import { localStorageSet } from '@haxtheweb/utils/utils.js'
import '../lib/lrs-bridge.js'
import { LrsBridge } from '../lib/lrs-bridge.js'
// the end-to-end case below nests a real lrs-emitter inside the bridge
import '../lib/lrs-emitter.js'

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

    it('returns the freshly generated GUID actor on the very first call', async () => {
      // fixed (lib/lrs-bridge.js getUserName): when no name is stored, the
      // generated GUID is both saved AND returned, so the very first
      // statement records a real actor instead of an empty one
      const firstActor = element.getUserName()
      expect(firstActor).to.match(/^[0-9a-f-]{36}$/)
      // the utils setter JSON-wraps the value, so the raw storage entry is
      // the quoted 36 char GUID
      const stored = globalThis.localStorage.getItem('lrs-name')
      expect(stored).to.equal(JSON.stringify(firstActor))
      // every later call returns the same stored GUID
      expect(element.getUserName()).to.equal(firstActor)
    })
  })

  describe('getUserName', () => {
    it('returns the stored name when one exists', () => {
      localStorageSet('lrs-name', 'Alice')
      expect(element.getUserName()).to.equal('Alice')
    })

    it('generates and stores a GUID when no name exists', () => {
      const name = element.getUserName()
      // fixed: the fresh GUID is returned immediately (and persisted)
      expect(name).to.match(/^[0-9a-f-]{36}$/)
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
    it('records statements from lrs-emitter events once configured', async () => {
      const recordSpy = sandbox.spy(element, 'recordStatement')
      element.dispatchEvent(
        new CustomEvent('lrs-emitter', {
          bubbles: true,
          detail: { verb: { id: 'viewed' } },
        }),
      )
      await wait(50)
      // fixed (lib/lrs-bridge.js): the bridge enables recording once it is
      // actually configured with an endpoint, so lrs-emitter events are
      // forwarded to the learning record store instead of always ignored
      expect(recordSpy.called).to.be.true
      expect(fetchStub.calledOnce).to.be.true
    })

    it('ignores lrs-emitter events while no endpoint is configured', async () => {
      const el = await fixture(html`<lrs-bridge></lrs-bridge>`)
      const recordSpy = sandbox.spy(el, 'recordStatement')
      el.dispatchEvent(
        new CustomEvent('lrs-emitter', {
          bubbles: true,
          detail: { verb: { id: 'viewed' } },
        }),
      )
      await wait(50)
      expect(recordSpy.called).to.be.false
      expect(fetchStub.called).to.be.false
    })

    it('records the verb and object detail from the event', async () => {
      element.dispatchEvent(
        new CustomEvent('lrs-emitter', {
          bubbles: true,
          detail: { verb: { id: 'experienced' }, object: { id: '/course' } },
        }),
      )
      await wait(50)
      expect(fetchStub.calledOnce).to.be.true
      // fixed (lib/lrs-bridge.js): the handler passes the event DETAIL into
      // recordStatement instead of the raw CustomEvent, so verb and object
      // survive into the recorded statement data (the raw event's detail
      // getter was invisible to Object.assign and the verb was lost)
      const body = JSON.parse(fetchStub.firstCall.args[1].body)
      const keys = Object.keys(body.variables.data.data)
      expect(keys).to.include('actor')
      expect(keys).to.include('verb')
      expect(keys).to.include('object')
      expect(body.variables.data.data.verb.id).to.equal('experienced')
      expect(body.variables.data.data.object.id).to.equal('/course')
    })

    it('records statements end to end from a nested lrs-emitter click', async () => {
      const el = await fixture(html`
        <lrs-bridge endpoint="https://lrs.example.com/graphql">
          <lrs-emitter verb="clicked" object="demo-button"></lrs-emitter>
        </lrs-bridge>
      `)
      await el.updateComplete
      const emitter = el.querySelector('lrs-emitter')
      await emitter.updateComplete
      emitter.click()
      await wait(50)
      expect(fetchStub.calledOnce).to.be.true
      const body = JSON.parse(fetchStub.firstCall.args[1].body)
      expect(body.variables.data.data.verb).to.equal('clicked')
      expect(body.variables.data.data.object).to.equal('demo-button')
      // the very first statement already carries the generated GUID actor
      expect(body.variables.data.data.actor.name).to.match(/^[0-9a-f-]{36}$/)
    })
  })
})
