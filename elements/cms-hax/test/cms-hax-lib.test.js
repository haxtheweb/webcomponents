import { fixture, expect, html } from '@open-wc/testing'
import { CMSBase } from '../lib/cms-base.js'
import { CMSBlock } from '../lib/cms-block.js'
import { CMSEntity } from '../lib/cms-entity.js'
import { CMSToken } from '../lib/cms-token.js'
import { CMSViews } from '../lib/cms-views.js'

// direct lib imports so istanbul sees each lib file's statements
class TestCmsBase extends CMSBase {
  static get tag() {
    return 'test-cms-base'
  }
}
customElements.define(TestCmsBase.tag, TestCmsBase)

// shared stub/restore helpers for the fetch + autoload + edit link globals
function makeStubEnvironment() {
  const env = {
    originalFetch: globalThis.fetch,
    originalWCAutoload: globalThis.WCAutoload,
    fetches: [],
    wcCalls: 0,
    link: globalThis.document.createElement('a'),
    manual: [],
    restore() {
      globalThis.fetch = env.originalFetch
      if (env.originalWCAutoload === undefined) {
        delete globalThis.WCAutoload
      } else {
        globalThis.WCAutoload = env.originalWCAutoload
      }
      env.link.remove()
      env.manual.forEach((el) => el.remove())
    },
  }
  env.link.setAttribute('id', 'cmstokenidtolockonto')
  env.link.setAttribute('href', '#before')
  globalThis.document.body.appendChild(env.link)
  return env
}

describe('CMSBase', () => {
  let env
  beforeEach(() => {
    env = makeStubEnvironment()
    globalThis.fetch = async (url) => {
      env.fetches.push(String(url))
      return {
        ok: true,
        json: async () => ({ content: '<p>base-injected</p>' }),
      }
    }
    globalThis.WCAutoload = { process() { env.wcCalls += 1 } }
  })
  afterEach(() => {
    env.restore()
  })

  it('renders a replacement content wrapper with a slot', async () => {
    const el = await fixture(html`<test-cms-base></test-cms-base>`)
    const span = el.shadowRoot.querySelector('span#replacementcontent')
    expect(span === null).to.equal(false)
    expect(span.querySelector('slot') === null).to.equal(false)
  })

  it('seeds defaults and reflects loading state', async () => {
    const el = await fixture(html`<test-cms-base></test-cms-base>`)
    expect(el.loading).to.equal(false)
    expect(el.haxEditMode).to.equal(false)
    el.loading = true
    await el.updateComplete
    expect(el.hasAttribute('loading')).to.equal(true)
    el.haxEditMode = true
    await el.updateComplete
    expect(el.hasAttribute('hax-edit-mode')).to.equal(true)
  })

  it('exposes hax hooks and edit mode observers', async () => {
    const el = await fixture(html`<test-cms-base></test-cms-base>`)
    const hooks = el.haxHooks()
    expect(hooks.editModeChanged).to.equal('haxeditModeChanged')
    expect(hooks.activeElementChanged).to.equal('haxactiveElementChanged')
    // active element only flips edit mode on, never off
    el.haxactiveElementChanged(el, true)
    expect(el.haxEditMode).to.equal(true)
    el.haxactiveElementChanged(el, false)
    expect(el.haxEditMode).to.equal(true)
    el.haxeditModeChanged(false)
    expect(el.haxEditMode).to.equal(false)
    el.haxeditModeChanged(true)
    expect(el.haxEditMode).to.equal(true)
  })

  it('_buildBodyData is null by default', async () => {
    const el = await fixture(html`<test-cms-base></test-cms-base>`)
    expect(el._buildBodyData()).to.equal(null)
  })

  it('_resolveEndPoint prefers the property then the global fallback', async () => {
    const el = await fixture(html`<test-cms-base></test-cms-base>`)
    expect(el._resolveEndPoint()).to.equal(null)
    el._endPoint = 'https://direct.example/api'
    expect(el._resolveEndPoint()).to.equal('https://direct.example/api')
    el._endPoint = null
    globalThis.testBaseEndPoint = 'https://global.example/api'
    el._globalEndPointVar = 'testBaseEndPoint'
    expect(el._resolveEndPoint()).to.equal('https://global.example/api')
    delete globalThis.testBaseEndPoint
  })

  it('connectedCallback only auto-requests when it has no children', () => {
    let calls = 0
    const empty = new TestCmsBase()
    empty._doRequest = () => { calls += 1 }
    env.manual.push(empty)
    globalThis.document.body.appendChild(empty)
    expect(calls).to.equal(1)
    const hasChild = new TestCmsBase()
    hasChild.appendChild(globalThis.document.createElement('p'))
    hasChild._doRequest = () => { calls += 1 }
    env.manual.push(hasChild)
    globalThis.document.body.appendChild(hasChild)
    expect(calls).to.equal(1)
  })

  it('_doRequest skips while loading or without body data or endpoint', async () => {
    // while loading
    const el = await fixture(html`<test-cms-base></test-cms-base>`)
    el.loading = true
    el._buildBodyData = () => ({ q: 'v' })
    el._endPoint = 'https://x.example/api'
    await el._doRequest()
    expect(env.fetches.length).to.equal(0)
    // no body data (default _buildBodyData returns null)
    const el2 = await fixture(html`<test-cms-base></test-cms-base>`)
    el2._endPoint = 'https://x.example/api'
    await el2._doRequest()
    expect(env.fetches.length).to.equal(0)
    // body data but no endpoint
    const el3 = await fixture(html`<test-cms-base></test-cms-base>`)
    el3._buildBodyData = () => ({ q: 'v' })
    await el3._doRequest()
    expect(env.fetches.length).to.equal(0)
    expect(el3.loading).to.equal(false)
  })

  it('_doRequest injects fetched content and releases the loading state', async () => {
    const el = await fixture(html`<test-cms-base></test-cms-base>`)
    el._buildBodyData = () => ({ q: 'v' })
    el._endPoint = 'https://x.example/api'
    await el._doRequest()
    expect(el.loading).to.equal(true)
    expect(el.querySelector('p').textContent).to.equal('base-injected')
    await new Promise((r) => setTimeout(r, 650))
    expect(el.loading).to.equal(false)
    expect(env.wcCalls).to.equal(1)
    expect(env.fetches[0].includes('https://x.example/api?q=v')).to.equal(true)
  })

  it('_doRequest resolves relative endpoints against the page url', async () => {
    const el = await fixture(html`<test-cms-base></test-cms-base>`)
    el._buildBodyData = () => ({ q: 'v' })
    el._endPoint = 'api/thing'
    await el._doRequest()
    expect(env.fetches[0].includes('api/thing?q=v')).to.equal(true)
  })

  // fixed (issue #3077, bug 38): a non-ok response (and a thrown fetch
  // in the catch below) now release this.loading instead of leaving the
  // element stuck in loading state forever
  it('_doRequest releases loading on a failed response', async () => {
    globalThis.fetch = async () => ({ ok: false })
    const el = await fixture(html`<test-cms-base></test-cms-base>`)
    el._buildBodyData = () => ({ q: 'v' })
    el._endPoint = 'https://x.example/api'
    await el._doRequest()
    await new Promise((r) => setTimeout(r, 650))
    expect(el.loading).to.equal(false)
    expect(el.querySelector('p')).to.equal(null)
  })

  it('_doRequest fails silently when fetch rejects', async () => {
    globalThis.fetch = async () => {
      throw new Error('offline')
    }
    const el = await fixture(html`<test-cms-base></test-cms-base>`)
    el._buildBodyData = () => ({ q: 'v' })
    el._endPoint = 'https://x.example/api'
    let threw = false
    try {
      await el._doRequest()
    } catch (e) {
      threw = true
    }
    expect(threw).to.equal(false)
    // the catch also releases the loading state (fixed, issue #3077,
    // bug 38)
    expect(el.loading).to.equal(false)
  })

  it('_handleResponse replaces light dom content with the response', async () => {
    const el = await fixture(
      html`<test-cms-base><p>old</p></test-cms-base>`,
    )
    el._handleResponse({ content: '<p>new</p>' })
    expect(el.querySelector('p').textContent).to.equal('new')
    // data without content is ignored
    const el2 = await fixture(html`<test-cms-base><p>keep</p></test-cms-base>`)
    el2._handleResponse({})
    expect(el2.querySelector('p').textContent).to.equal('keep')
  })

  it('_updateEditLink rewrites the edit link when the backend supplies one', async () => {
    const el = await fixture(html`<test-cms-base></test-cms-base>`)
    el._updateEditLink({ editEndpoint: 'https://edit.example', editText: 'Edit me' })
    expect(env.link.getAttribute('href')).to.equal('https://edit.example')
    expect(env.link.innerHTML).to.equal('Edit me')
    // without an endpoint the link is untouched
    env.link.setAttribute('href', '#untouched')
    el._updateEditLink({ editText: 'nope' })
    expect(env.link.getAttribute('href')).to.equal('#untouched')
    // and a missing link never crashes
    env.link.remove()
    let threw = false
    try {
      el._updateEditLink({ editEndpoint: 'https://edit.example' })
    } catch (e) {
      threw = true
    }
    expect(threw).to.equal(false)
  })
})

describe('cms-block', () => {
  let env
  beforeEach(() => {
    env = makeStubEnvironment()
    globalThis.fetch = async (url) => {
      env.fetches.push(String(url))
      return {
        ok: true,
        json: async () => ({ content: '<p>block-injected</p>' }),
      }
    }
    globalThis.WCAutoload = { process() {} }
  })
  afterEach(() => {
    env.restore()
    delete globalThis.cmsblockEndPoint
  })

  it('seeds defaults', async () => {
    const el = await fixture(html`<cms-block></cms-block>`)
    expect(el.blockModule).to.equal('')
    expect(el.blockDelta).to.equal('')
    expect(el.blockEndPoint).to.equal(null)
    expect(el.blockPrefix).to.equal('')
    expect(el.blockSuffix).to.equal('')
  })

  it('_buildBodyData requires module and delta', async () => {
    const el = await fixture(html`<cms-block></cms-block>`)
    expect(el._buildBodyData()).to.equal(null)
    el.blockModule = 'book'
    expect(el._buildBodyData()).to.equal(null)
    el.blockDelta = 'delta1'
    expect(el._buildBodyData()).to.deep.equal({
      module: 'book',
      delta: 'delta1',
    })
  })

  it('_resolveEndPoint prefers the property then the global fallback', async () => {
    const el = await fixture(html`<cms-block></cms-block>`)
    expect(el._resolveEndPoint()).to.equal(null)
    el.blockEndPoint = 'https://block.example'
    expect(el._resolveEndPoint()).to.equal('https://block.example')
    el.blockEndPoint = null
    globalThis.cmsblockEndPoint = 'https://block-global.example'
    expect(el._resolveEndPoint()).to.equal('https://block-global.example')
  })

  it('updated requests when module or delta change', async () => {
    const el = await fixture(html`<cms-block></cms-block>`)
    let calls = 0
    el._doRequest = () => { calls += 1 }
    el.blockModule = 'book'
    await el.updateComplete
    el.blockDelta = 'delta1'
    await el.updateComplete
    expect(calls).to.equal(2)
  })

  it('fetches and injects block content end to end', async () => {
    const el = await fixture(
      html`<cms-block
        .blockModule=${'book'}
        .blockDelta=${'delta1'}
        .blockEndPoint=${'https://cms.example/block'}
      ></cms-block>`,
    )
    await new Promise((r) => setTimeout(r, 650))
    expect(el.querySelector('p').textContent).to.equal('block-injected')
    expect(el.loading).to.equal(false)
    const url = new URL(env.fetches[0])
    expect(url.searchParams.get('module')).to.equal('book')
    expect(url.searchParams.get('delta')).to.equal('delta1')
  })

  it('has hax wiring for blocks', async () => {
    expect(CMSBlock.haxProperties.gizmo.title).to.equal('CMS Block')
    expect(CMSBlock.haxProperties.settings.configure[0].property).to.equal(
      'blockModule',
    )
    expect(CMSBlock.haxProperties.saveOptions.wipeSlot).to.equal(true)
    expect(
      CMSBlock.haxProperties.saveOptions.unsetAttributes.includes('loading'),
    ).to.equal(true)
    const el = await fixture(html`<cms-block></cms-block>`)
    const schema = el.postProcessgetHaxJSONSchema({ properties: {} })
    expect(schema.properties.__editThis.component.slot).to.equal(
      'Edit this block',
    )
  })
})

describe('cms-entity', () => {
  let env
  beforeEach(() => {
    env = makeStubEnvironment()
    globalThis.fetch = async (url) => {
      env.fetches.push(String(url))
      return {
        ok: true,
        json: async () => ({ content: '<p>entity-injected</p>' }),
      }
    }
    globalThis.WCAutoload = { process() {} }
  })
  afterEach(() => {
    env.restore()
    delete globalThis.cmsentityEndPoint
  })

  it('_buildBodyData requires type and id', async () => {
    const el = await fixture(html`<cms-entity></cms-entity>`)
    expect(el._buildBodyData()).to.equal(null)
    el.entityType = 'node'
    expect(el._buildBodyData()).to.equal(null)
    el.entityId = '42'
    expect(el._buildBodyData()).to.deep.equal({
      type: 'node',
      id: '42',
      display_mode: '',
    })
    el.entityDisplayMode = 'full'
    expect(el._buildBodyData().display_mode).to.equal('full')
  })

  it('_resolveEndPoint prefers the property then the global fallback', async () => {
    const el = await fixture(html`<cms-entity></cms-entity>`)
    expect(el._resolveEndPoint()).to.equal(null)
    el.entityEndPoint = 'https://entity.example'
    expect(el._resolveEndPoint()).to.equal('https://entity.example')
    el.entityEndPoint = null
    globalThis.cmsentityEndPoint = 'https://entity-global.example'
    expect(el._resolveEndPoint()).to.equal('https://entity-global.example')
  })

  it('updated requests when type, id or display mode change', async () => {
    const el = await fixture(html`<cms-entity></cms-entity>`)
    let calls = 0
    el._doRequest = () => { calls += 1 }
    el.entityType = 'node'
    await el.updateComplete
    el.entityId = '42'
    await el.updateComplete
    el.entityDisplayMode = 'teaser'
    await el.updateComplete
    expect(calls).to.equal(3)
  })

  it('fetches and injects entity content end to end', async () => {
    const el = await fixture(
      html`<cms-entity
        .entityType=${'node'}
        .entityId=${'42'}
        .entityEndPoint=${'https://cms.example/entity'}
      ></cms-entity>`,
    )
    await new Promise((r) => setTimeout(r, 650))
    expect(el.querySelector('p').textContent).to.equal('entity-injected')
    const url = new URL(env.fetches[0])
    expect(url.searchParams.get('type')).to.equal('node')
    expect(url.searchParams.get('id')).to.equal('42')
  })

  // fixed (issue #3077, bug 39): the haxProperties configure entry
  // targets entityId, the property the class actually declares, so the
  // HAX settings form edits a real property
  it('hax wiring references the declared entityId property', () => {
    expect(CMSEntity.haxProperties.settings.configure[1].property).to.equal(
      'entityId',
    )
    expect('entityId' in CMSEntity.properties).to.equal(true)
    expect('entityID' in CMSEntity.properties).to.equal(false)
  })

  it('has hax wiring for entities', async () => {
    expect(CMSEntity.haxProperties.gizmo.title).to.equal('CMS Entity')
    const el = await fixture(html`<cms-entity></cms-entity>`)
    const schema = el.postProcessgetHaxJSONSchema({ properties: {} })
    expect(schema.properties.__editThis.component.slot).to.equal(
      'Edit this content',
    )
  })
})

describe('cms-token', () => {
  let env
  beforeEach(() => {
    env = makeStubEnvironment()
    globalThis.fetch = async (url) => {
      env.fetches.push(String(url))
      return {
        ok: true,
        json: async () => ({
          content: '<p>token-injected</p>',
          editEndpoint: 'https://edit.example',
          editText: 'Edit token',
        }),
      }
    }
    globalThis.WCAutoload = { process() { env.wcCalls += 1 } }
  })
  afterEach(() => {
    env.restore()
    delete globalThis.cmstokenEndPoint
  })

  it('seeds defaults and inherits base styles', async () => {
    const el = await fixture(html`<cms-token></cms-token>`)
    expect(el.token).to.equal('')
    expect(el.tokenEndPoint).to.equal(null)
    expect(el.tokenPrefix).to.equal('')
    expect(el.tokenSuffix).to.equal('')
    expect(el._clickInvoked).to.equal(false)
    // cms-token inherits the base styles verbatim (a single css result)
    expect(typeof CMSToken.styles.cssText).to.equal('string')
  })

  it('_buildBodyData wraps the token with prefix/suffix and click state', async () => {
    const el = await fixture(html`<cms-token></cms-token>`)
    expect(el._buildBodyData()).to.equal(null)
    el.token = 'site:name'
    expect(el._buildBodyData()).to.deep.equal({
      token: 'site:name',
      cachedResponse: false,
    })
    el.tokenPrefix = '[['
    el.tokenSuffix = ']]'
    expect(el._buildBodyData().token).to.equal('[[site:name]]')
    el._clickInvoked = true
    expect(el._buildBodyData().cachedResponse).to.equal(true)
  })

  it('_resolveEndPoint prefers the property then the global fallback', async () => {
    const el = await fixture(html`<cms-token></cms-token>`)
    expect(el._resolveEndPoint()).to.equal(null)
    el.tokenEndPoint = 'https://token.example'
    expect(el._resolveEndPoint()).to.equal('https://token.example')
    el.tokenEndPoint = null
    globalThis.cmstokenEndPoint = 'https://token-global.example'
    expect(el._resolveEndPoint()).to.equal('https://token-global.example')
  })

  // fixed (issue #3077, bug 11): wipeSlot is imported, so token responses
  // inject their content instead of the ReferenceError being silently
  // swallowed by _doRequest's catch
  it('token responses inject their content', async () => {
    const el = await fixture(
      html`<cms-token
        token="site:name"
        .tokenEndPoint=${'https://cms.example/token'}
      ></cms-token>`,
    )
    await new Promise((r) => setTimeout(r, 30))
    expect(el.querySelector('p').textContent).to.equal('token-injected')
    expect(el.loading).to.equal(false)
    el.remove()
  })

  it('injects token content, wires the edit link click and refreshes on visibility', async () => {
    // the imported wipeSlot (issue #3077, bug 11) runs the full handler;
    // no global stub is needed anymore (the module binding wins)
    const el = await fixture(
      html`<cms-token
        token="site:name"
        .tokenEndPoint=${'https://cms.example/token'}
      ></cms-token>`,
    )
    await new Promise((r) => setTimeout(r, 30))
    expect(el.querySelector('p').textContent).to.equal('token-injected')
    expect(el.loading).to.equal(false)
    expect(env.link.getAttribute('href')).to.equal('https://edit.example')
    expect(env.link.innerHTML).to.equal('Edit token')
    expect(env.wcCalls).to.equal(1)
    // the response data is retained for the edit-link schema (issue
    // #3077, bug 40)
    expect(el.tokenData.editEndpoint).to.equal('https://edit.example')
    // clicking the edit link arms a refresh on next visibility change
    env.link.dispatchEvent(new Event('click'))
    expect(el._clickInvoked).to.equal(true)
    globalThis.document.dispatchEvent(new Event('visibilitychange'))
    await new Promise((r) => setTimeout(r, 30))
    expect(env.fetches.length).to.equal(2)
    expect(el._clickInvoked).to.equal(false)
    // a visibility change without a click does not refetch
    globalThis.document.dispatchEvent(new Event('visibilitychange'))
    await new Promise((r) => setTimeout(r, 30))
    expect(env.fetches.length).to.equal(2)
    el.remove()
  })

  it('updated requests when the token changes', async () => {
    const el = await fixture(html`<cms-token></cms-token>`)
    let calls = 0
    el._doRequest = () => { calls += 1 }
    el.token = 'site:name'
    await el.updateComplete
    expect(calls).to.equal(1)
  })

  // fixed (issue #3077, bug 40): tokenData is declared (never defaulted to
  // null) and assigned in _handleResponse, so the branch only opens with
  // real response data; an unfetched token still yields the empty default
  it('postProcess schema uses tokenData from the response when present', async () => {
    const el = await fixture(html`<cms-token></cms-token>`)
    // unfetched: tokenData stays undefined so the default empty edit
    // link applies (do NOT default it to null — that would throw)
    expect(el.tokenData).to.equal(undefined)
    const schema = el.postProcessgetHaxJSONSchema({ properties: {} })
    expect(schema.properties.__editThis.component.properties.href).to.equal('')
    expect(schema.properties.__editThis.component.slot).to.equal('Edit')
    // supplying tokenData by hand proves the branch wiring works
    el.tokenData = {
      editEndpoint: 'https://edit.example',
      editText: 'Edit!',
      schema: { customField: { type: 'string' } },
    }
    const schema2 = el.postProcessgetHaxJSONSchema({ properties: {} })
    expect(schema2.properties.__editThis.component.properties.href).to.equal(
      'https://edit.example',
    )
    expect(schema2.properties.__editThis.component.slot).to.equal('Edit!')
    expect(schema2.properties.customField.type).to.equal('string')
  })

  it('has hax wiring for tokens', () => {
    expect(CMSToken.haxProperties.gizmo.title).to.equal('CMS Token')
    expect(CMSToken.haxProperties.settings.configure[0].property).to.equal(
      'token',
    )
  })
})

describe('cms-views', () => {
  let env
  beforeEach(() => {
    env = makeStubEnvironment()
    globalThis.fetch = async (url) => {
      env.fetches.push(String(url))
      return {
        ok: true,
        json: async () => ({ content: '<p>view-injected</p>' }),
      }
    }
    globalThis.WCAutoload = { process() {} }
  })
  afterEach(() => {
    env.restore()
    delete globalThis.cmsviewsEndPoint
  })

  it('_buildBodyData requires a name', async () => {
    const el = await fixture(html`<cms-views></cms-views>`)
    expect(el._buildBodyData()).to.equal(null)
    el.viewsName = 'myview'
    expect(el._buildBodyData()).to.deep.equal({
      name: 'myview',
      display: '',
    })
    el.viewsDisplay = 'page'
    expect(el._buildBodyData().display).to.equal('page')
  })

  it('_resolveEndPoint prefers the property then the global fallback', async () => {
    const el = await fixture(html`<cms-views></cms-views>`)
    expect(el._resolveEndPoint()).to.equal(null)
    el.viewsEndPoint = 'https://views.example'
    expect(el._resolveEndPoint()).to.equal('https://views.example')
    el.viewsEndPoint = null
    globalThis.cmsviewsEndPoint = 'https://views-global.example'
    expect(el._resolveEndPoint()).to.equal('https://views-global.example')
  })

  it('updated requests when name or display change', async () => {
    const el = await fixture(html`<cms-views></cms-views>`)
    let calls = 0
    el._doRequest = () => { calls += 1 }
    el.viewsName = 'myview'
    await el.updateComplete
    el.viewsDisplay = 'page'
    await el.updateComplete
    expect(calls).to.equal(2)
  })

  it('fetches and injects view content end to end', async () => {
    const el = await fixture(
      html`<cms-views
        .viewsName=${'myview'}
        .viewsEndPoint=${'https://cms.example/views'}
      ></cms-views>`,
    )
    await new Promise((r) => setTimeout(r, 650))
    expect(el.querySelector('p').textContent).to.equal('view-injected')
    const url = new URL(env.fetches[0])
    expect(url.searchParams.get('name')).to.equal('myview')
    expect(url.searchParams.get('display')).to.equal('')
  })

  it('has hax wiring for views', async () => {
    expect(CMSViews.haxProperties.gizmo.title).to.equal('CMS View')
    const el = await fixture(html`<cms-views></cms-views>`)
    const schema = el.postProcessgetHaxJSONSchema({ properties: {} })
    expect(schema.properties.__editThis.component.slot).to.equal(
      'Edit this view',
    )
  })
})
