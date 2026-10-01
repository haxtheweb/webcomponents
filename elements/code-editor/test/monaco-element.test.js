import { fixture, expect, html, waitUntil } from '@open-wc/testing'
import { MonacoElement } from '../lib/monaco-element/monaco-element.js'

const aTimeout = (ms) => new Promise((r) => setTimeout(r, ms))

// a lib-path that stays a valid data: URL once /loader.js is appended; its
// payload evaluates as a no-op script so the loader script loads (firing
// onload) without any network request. The monaco assets themselves are
// never fetched in this suite.
const DATA_LIB_PATH = 'data:application/javascript,0//'

// a lib-path that is guaranteed to 404 on the local test server, so the
// loader script never loads and no bootstrap script or style is inserted
// (the default node_modules lib-path actually boots the real local monaco)
const BOGUS_LIB_PATH = 'missing-monaco-lib'

// initIFrame is a no-op at connect time (the iframe has not rendered yet),
// so the real setup happens from the firstUpdated timeout; wait for it
const iframeReady = async (el) => {
  await waitUntil(
    () => el.iframe && el.iframe.contentWindow,
    'iframe was never initialized',
    3000,
  )
}
const bootstrapReady = async (el) => {
  await iframeReady(el)
  await waitUntil(
    () => el.document.querySelectorAll('script').length === 2,
    'bootstrap script was never inserted',
    3000,
  )
}

describe('monaco-element', () => {
  it('registers the monaco-element custom element', () => {
    expect(globalThis.customElements.get('monaco-element')).to.exist
  })

  it('exports the MonacoElement class', () => {
    expect(typeof MonacoElement).to.equal('function')
  })

  describe('construction and defaults', () => {
    it('constructs with expected default values', async () => {
      const el = await fixture(html`<monaco-element></monaco-element>`)
      expect(el.value).to.equal('')
      expect(el.fontSize).to.equal(16)
      expect(el.wordWrap).to.equal(false)
      expect(el.tabSize).to.equal(2)
      expect(el.readOnly).to.equal(false)
      expect(el.language).to.equal('javascript')
      expect(el.theme).to.equal('vs-dark')
      expect(el.libPath).to.equal('node_modules/monaco-editor/min/vs')
      expect(el.autofocus).to.equal(false)
      expect(el.hideLineNumbers).to.equal(false)
      expect(el.editorReference).to.be.a('string')
      expect(el.eventTypes.ready).to.equal('ready')
      expect(el.eventTypes.focus).to.equal('focus')
      expect(el.eventTypes.blur).to.equal('blur')
      expect(el.eventTypes.valueChanged).to.equal('valueChanged')
      expect(el.eventTypes.languageChanged).to.equal('languageChanged')
      expect(el.eventTypes.themeChanged).to.equal('themeChanged')
    })

    it('generateUUID returns a unique dashed hex identifier', () => {
      const el = globalThis.document.createElement('monaco-element')
      const uuid = el.generateUUID()
      expect(uuid.length).to.equal(36)
      expect(uuid).to.match(/^[0-9a-f-]+$/)
      expect(uuid.split('-').length).to.equal(5)
      expect(el.generateUUID()).to.not.equal(uuid)
    })

    it('document getter is undefined before the iframe exists', () => {
      const el = globalThis.document.createElement('monaco-element')
      expect(el.document).to.equal(undefined)
    })
  })

  describe('rendering and iframe bootstrap', () => {
    it('renders an iframe and initializes it on connect', async () => {
      const el = await fixture(
        html`<monaco-element lib-path=${BOGUS_LIB_PATH}></monaco-element>`,
      )
      await iframeReady(el)
      expect(el.iframe.id).to.equal('iframe')
      expect(el.document.body.tagName).to.equal('BODY')
      // container + loader script were injected into the iframe document
      expect(el.document.querySelectorAll('#container').length).to.equal(1)
      const loader = el.document.querySelector('script')
      expect(loader.getAttribute('src')).to.equal(
        'missing-monaco-lib/loader.js',
      )
      // the loader script 404s on the local test server so onload never
      // fires; no bootstrap script or style is inserted yet
      expect(el.document.querySelectorAll('script').length).to.equal(1)
      expect(el.document.querySelectorAll('style').length).to.equal(0)
    })

    it('inserts the bootstrap script and style once the loader loads', async () => {
      const el = await fixture(
        html`<monaco-element lib-path=${DATA_LIB_PATH}></monaco-element>`,
      )
      await bootstrapReady(el)
      const scripts = el.document.querySelectorAll('script')
      expect(scripts.length).to.equal(2)
      // second script is the inline bootstrap wiring the MonacoEditor
      expect(scripts[1].text).to.contain('class MonacoEditor')
      expect(scripts[1].text).to.contain(el.editorReference)
      const styles = el.document.querySelectorAll('style')
      expect(styles.length).to.equal(1)
      expect(styles[0].type).to.equal('text/css')
      expect(styles[0].textContent).to.contain('#container')
    })

    it('writes editor options from properties into the bootstrap script', async () => {
      const el = await fixture(
        html`<monaco-element
          lib-path=${DATA_LIB_PATH}
          language="html"
          font-size="24"
          word-wrap
          read-only
          hide-line-numbers
          tab-size="8"
        ></monaco-element>`,
      )
      await bootstrapReady(el)
      const bootstrap = el.document.querySelectorAll('script')[1].text
      expect(bootstrap).to.contain("language: 'html'")
      expect(bootstrap).to.contain("lineNumbers: 'false',")
      expect(bootstrap).to.contain('fontSize: 24')
      expect(bootstrap).to.contain('wordWrap: true')
      expect(bootstrap).to.contain('readOnly: true')
      expect(bootstrap).to.contain('tabSize: 8')
      // opposite branch: no lineNumbers option when they are not hidden
      const el2 = await fixture(
        html`<monaco-element lib-path=${DATA_LIB_PATH}></monaco-element>`,
      )
      await bootstrapReady(el2)
      const bootstrap2 = el2.document.querySelectorAll('script')[1].text
      expect(bootstrap2).to.not.contain("lineNumbers: 'false',")
    })

    it('re-runs initIFrame after firstUpdated without duplicating setup', async () => {
      const el = await fixture(html`<monaco-element></monaco-element>`)
      await aTimeout(650)
      expect(el.__init).to.equal(true)
      expect(el.document.querySelectorAll('#container').length).to.equal(1)
    })

    it('focuses the iframe when autofocus is on', async () => {
      const el = await fixture(
        html`<monaco-element autofocus></monaco-element>`,
      )
      await iframeReady(el)
      expect(el.hasAttribute('autofocus')).to.equal(true)
      // document.activeElement only exposes the shadow host, the focused
      // iframe itself is visible via the shadow root's activeElement
      expect(el.shadowRoot.activeElement.tagName).to.equal('IFRAME')
    })
  })

  describe('message handling', () => {
    it('ignores messages from other editor references', () => {
      const el = globalThis.document.createElement('monaco-element')
      let fired = false
      el.addEventListener('value-changed', () => {
        fired = true
      })
      el.handleMessage({
        data: {
          event: 'valueChanged',
          payload: 'x',
          editorReference: 'not-mine',
        },
      })
      expect(fired).to.equal(false)
    })

    it('parses string payloads and dispatches value-changed', () => {
      const el = globalThis.document.createElement('monaco-element')
      let detail = null
      el.addEventListener('value-changed', (e) => {
        detail = e.detail
      })
      el.handleMessage({
        data: JSON.stringify({
          event: 'valueChanged',
          payload: 'abc',
          editorReference: el.editorReference,
        }),
      })
      expect(detail).to.equal('abc')
    })

    it('warns and bails on messages that are invalid JSON strings', () => {
      const el = globalThis.document.createElement('monaco-element')
      const origWarn = console.warn
      let warned = false
      console.warn = () => {
        warned = true
      }
      try {
        el.handleMessage({ data: 'not json at all' })
        expect(warned).to.equal(true)
      } finally {
        console.warn = origWarn
      }
    })

    it('dispatches code-editor-focus and code-editor-blur events', async () => {
      const el = await fixture(html`<monaco-element></monaco-element>`)
      await aTimeout(20)
      let focused = false
      let blurred = false
      el.addEventListener('code-editor-focus', () => {
        focused = true
      })
      el.addEventListener('code-editor-blur', () => {
        blurred = true
      })
      el.handleMessage({
        data: { event: 'focus', editorReference: el.editorReference },
      })
      expect(focused).to.equal(true)
      el.handleMessage({
        data: { event: 'blur', editorReference: el.editorReference },
      })
      expect(blurred).to.equal(true)
    })

    it('syncs value, language and theme into the iframe when ready', async () => {
      const el = await fixture(
        html`<monaco-element
          value="a"
          language="html"
          theme="vs"
        ></monaco-element>`,
      )
      await iframeReady(el)
      // intercept posts into the iframe window to observe the sync
      const iframeWindow = el.iframe.contentWindow
      const sent = []
      const origPostMessage = iframeWindow.postMessage.bind(iframeWindow)
      iframeWindow.postMessage = (msg, target) => {
        sent.push(msg)
        origPostMessage(msg, target)
      }
      let got = null
      el.addEventListener('monaco-element-ready', (e) => {
        got = e
      })
      el.handleMessage({
        data: { event: 'ready', editorReference: el.editorReference },
      })
      await aTimeout(30)
      expect(got).to.exist
      expect(got.detail).to.equal(true)
      const posted = sent.map((m) => JSON.parse(m))
      expect(
        posted.some((m) => m.event === 'valueChanged' && m.payload === 'a'),
      ).to.equal(true)
      expect(
        posted.some((m) => m.event === 'languageChanged' && m.payload === 'html'),
      ).to.equal(true)
      expect(
        posted.some((m) => m.event === 'themeChanged' && m.payload === 'vs'),
      ).to.equal(true)
    })
  })

  describe('property updates', () => {
    it('forwards value, language and theme changes to the iframe', async () => {
      const el = await fixture(html`<monaco-element></monaco-element>`)
      await iframeReady(el)
      const iframeWindow = el.iframe.contentWindow
      const sent = []
      const origPostMessage = iframeWindow.postMessage.bind(iframeWindow)
      iframeWindow.postMessage = (msg, target) => {
        sent.push(JSON.parse(msg))
        origPostMessage(msg, target)
      }
      el.value = 'console.log(1)'
      await el.updateComplete
      el.language = 'html'
      await el.updateComplete
      el.theme = 'vs'
      await el.updateComplete
      expect(
        sent.some(
          (m) => m.event === 'valueChanged' && m.payload === 'console.log(1)',
        ),
      ).to.equal(true)
      expect(
        sent.some((m) => m.event === 'languageChanged' && m.payload === 'html'),
      ).to.equal(true)
      expect(
        sent.some((m) => m.event === 'themeChanged' && m.payload === 'vs'),
      ).to.equal(true)
    })

    it('skips posting when there is no iframe yet', () => {
      const el = globalThis.document.createElement('monaco-element')
      el.monacoValueChanged('x')
      el.monacoLanguageChanged('y')
      el.monacoThemeChanged('z')
      expect(el.value).to.equal('')
    })
  })

  describe('script and style injection helpers', () => {
    it('inserts script elements by src and with an onload hook', async () => {
      const el = await fixture(
        html`<monaco-element lib-path=${BOGUS_LIB_PATH}></monaco-element>`,
      )
      await iframeReady(el)
      const before = el.document.querySelectorAll('script').length
      el.insertScriptElement({ src: 'data:,void 0' })
      el.insertScriptElement({
        src: 'data:,void 0',
        onload: () => {},
      })
      expect(el.document.querySelectorAll('script').length).to.equal(before + 2)
    })

    it('stamps the CSP nonce from the parent page on inline scripts', async () => {
      const el = await fixture(
        html`<monaco-element lib-path=${BOGUS_LIB_PATH}></monaco-element>`,
      )
      await iframeReady(el)
      const meta = globalThis.document.createElement('meta')
      meta.setAttribute('name', 'csp-nonce')
      meta.setAttribute('content', 'test-nonce-123')
      globalThis.document.head.appendChild(meta)
      try {
        el.insertScriptElement({ text: 'globalThis.__probe = 1' })
        const inline = Array.from(el.document.querySelectorAll('script')).pop()
        expect(inline.nonce).to.equal('test-nonce-123')
      } finally {
        globalThis.document.head.removeChild(meta)
      }
      // without the meta present the nonce stays empty
      el.insertScriptElement({ text: 'globalThis.__probe2 = 1' })
      const inline2 = Array.from(el.document.querySelectorAll('script')).pop()
      expect(inline2.nonce).to.equal('')
    })

    it('inserts a style element into the iframe document', async () => {
      const el = await fixture(
        html`<monaco-element lib-path=${BOGUS_LIB_PATH}></monaco-element>`,
      )
      await iframeReady(el)
      el.insertStyle()
      const styles = el.document.querySelectorAll('style')
      expect(styles.length).to.equal(1)
      expect(styles[0].type).to.equal('text/css')
      expect(styles[0].textContent).to.contain('#container')
    })
  })

  describe('lifecycle', () => {
    it('aborts message listeners and resets init state on disconnect', async () => {
      const el = await fixture(html`<monaco-element></monaco-element>`)
      await aTimeout(20)
      expect(el.windowControllers.signal.aborted).to.equal(false)
      el.parentNode.removeChild(el)
      expect(el.windowControllers.signal.aborted).to.equal(true)
      expect(el.__init).to.equal(false)
    })
  })
})
