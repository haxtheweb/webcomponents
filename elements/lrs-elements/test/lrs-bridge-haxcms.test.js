import { expect } from '@open-wc/testing'
import sinon from 'sinon'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'
import '../lib/lrs-bridge-haxcms.js'
import { LrsBridgeHaxcms } from '../lib/lrs-bridge-haxcms.js'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// a valid location kept on the store for the whole session: the mobx autorun
// inside each created element reads store.location and a null value would
// throw inside its microtask (unhandled rejection)
const BASE_LOCATION = { baseUrl: 'https://example.com', pathname: '/base' }

describe('lrs-bridge-haxcms test', () => {
  let sandbox
  let fetchStub

  beforeEach(async () => {
    sandbox = sinon.createSandbox()
    // stub ALL network access; recordStatement posts to an endpoint
    fetchStub = sandbox
      .stub(globalThis, 'fetch')
      .resolves({ json: () => Promise.resolve({}) })
    if (store.location === null) {
      store.location = BASE_LOCATION
    }
    // let any autorun microtasks from earlier elements settle while the
    // fetch stub is in place
    await wait(10)
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('has the correct tag name', () => {
    expect(LrsBridgeHaxcms.tag).to.equal('lrs-bridge-haxcms')
    const defined = globalThis.customElements.get('lrs-bridge-haxcms')
    expect(typeof defined).to.equal('function')
  })

  it('is registered alongside lrs-bridge', () => {
    const defined = globalThis.customElements.get('lrs-bridge')
    expect(typeof defined).to.equal('function')
  })

  describe('_locationChanged', () => {
    const makeElement = () => {
      const el = globalThis.document.createElement('lrs-bridge-haxcms')
      const recordSpy = sandbox.stub(el, 'recordStatement')
      return { el, recordSpy }
    }

    it('records a viewed statement for the location', async () => {
      const { el, recordSpy } = makeElement()
      // NOTE: trimSlash uses (^\/|\/$) WITHOUT the global flag, so it only
      // strips a single leading OR trailing slash, never both ends
      el._locationChanged({
        baseUrl: 'https://example.com',
        pathname: '/course/page/',
      })
      expect(recordSpy.called).to.be.true
      const detail = recordSpy.firstCall.args[0]
      expect(detail.verb.id).to.equal('viewed')
      // the trailing slash on the pathname survives the trim
      expect(detail.object.id).to.equal('https://example.com/course/page/')
      // let the constructor autorun microtask fire against the stub
      await wait(10)
    })

    it('trims redundant slashes from bare locations', async () => {
      const { el, recordSpy } = makeElement()
      el._locationChanged({ baseUrl: '/', pathname: '/' })
      expect(recordSpy.called).to.be.true
      expect(recordSpy.firstCall.args[0].object.id).to.equal('/')
      await wait(10)
    })

    it('handles rootless locations', async () => {
      const { el, recordSpy } = makeElement()
      el._locationChanged({ baseUrl: '', pathname: 'page' })
      expect(recordSpy.firstCall.args[0].object.id).to.equal('/page')
      await wait(10)
    })
  })

  describe('constructor autorun', () => {
    it('records the current store location as a viewed statement', async () => {
      // point the mobx store at a location BEFORE the element exists so the
      // autorun has a valid value to react to
      store.location = {
        baseUrl: 'https://example.com',
        pathname: '/welcome',
      }
      const el = globalThis.document.createElement('lrs-bridge-haxcms')
      const recordSpy = sandbox.stub(el, 'recordStatement')
      // the autorun schedules _locationChanged on a microtask
      await wait(50)
      expect(recordSpy.called).to.be.true
      const detail = recordSpy.lastCall.args[0]
      expect(detail.verb.id).to.equal('viewed')
      expect(detail.object.id).to.equal('https://example.com/welcome')
    })
  })
})
