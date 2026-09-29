import { fixture, expect, html, elementUpdated, aTimeout } from '@open-wc/testing'
import { IframeLoader } from '../iframe-loader.js'
import {
  sanitizeURLValue,
  sanitizeEmbeddableURL,
  hasUnsafeURLProtocol,
} from '@haxtheweb/utils/lib/url.js'

describe('iframe-loader behaviors', () => {
  describe('defaults and initial render', () => {
    it('has sensible defaults', () => {
      const el = globalThis.document.createElement('iframe-loader')
      expect(el.source).to.equal(null)
      expect(el.loading).to.equal(true)
      expect(el.height).to.equal(500)
      expect(el.width).to.equal('100%')
      expect(el.isPDF).to.equal(false)
      expect(el.disabled).to.equal(false)
    })
    it('creates a sandboxed iframe when no source is set', async () => {
      const el = await fixture(html`<iframe-loader></iframe-loader>`)
      await elementUpdated(el)
      const frame = el.querySelector('iframe')
      expect(frame).to.exist
      expect(frame.hasAttribute('src')).to.equal(false)
      expect(frame.getAttribute('sandbox')).to.equal(
        'allow-scripts allow-same-origin',
      )
      expect(frame.getAttribute('width')).to.equal('100%')
      expect(frame.getAttribute('height')).to.equal('500')
      expect(el.__iframe).to.equal(frame)
    })
    it('renders the loading screen while loading', async () => {
      const el = await fixture(html`<iframe-loader></iframe-loader>`)
      await elementUpdated(el)
      const container = el.shadowRoot.querySelector('#container')
      expect(container.className).to.equal('loading')
      const loadingScreen = el.shadowRoot.querySelector('#loading-screen')
      expect(loadingScreen.getAttribute('style')).to.include('500px')
      const slot = el.shadowRoot.querySelector('#slot')
      expect(slot.getAttribute('style')).to.include('none')
      const indicator = el.shadowRoot.querySelector('loading-indicator')
      expect(indicator).to.exist
      expect(indicator.loading).to.equal(true)
    })
  })

  describe('source sanitization and pdf detection', () => {
    it('loads a valid https source with the sandbox intact', async () => {
      const el = await fixture(
        html`<iframe-loader source="https://btopro.com"></iframe-loader>`,
      )
      expect(el.source).to.equal('https://btopro.com')
      expect(el.isPDF).to.equal(false)
      await elementUpdated(el)
      const frame = el.querySelector('iframe')
      expect(frame.getAttribute('src')).to.equal('https://btopro.com')
      expect(frame.getAttribute('sandbox')).to.equal(
        'allow-scripts allow-same-origin',
      )
    })
    it('detects pdf sources and drops the sandbox', async () => {
      const el = await fixture(
        html`<iframe-loader
          source="https://btopro.com/manual.pdf"
        ></iframe-loader>`,
      )
      expect(el.isPDF).to.equal(true)
      expect(el.hasAttribute('is-pdf')).to.equal(true)
      await elementUpdated(el)
      const frame = el.querySelector('iframe')
      expect(frame.getAttribute('src')).to.equal('https://btopro.com/manual.pdf')
      expect(frame.hasAttribute('sandbox')).to.equal(false)
    })
    it('allows relative paths', async () => {
      const el = await fixture(
        html`<iframe-loader source="/files/index.html"></iframe-loader>`,
      )
      expect(el.source).to.equal('/files/index.html')
      await elementUpdated(el)
      expect(el.querySelector('iframe').getAttribute('src')).to.equal(
        '/files/index.html',
      )
    })
    it('rejects javascript: urls', async () => {
      const el = await fixture(
        html`<iframe-loader source="javascript:alert(1)"></iframe-loader>`,
      )
      expect(el.source).to.equal(null)
      expect(el.isPDF).to.equal(false)
      await elementUpdated(el)
      expect(el.querySelector('iframe').hasAttribute('src')).to.equal(false)
    })
    it('rejects non-http protocols', async () => {
      const el = await fixture(
        html`<iframe-loader
          source="ftp://files.example.com/doc.pdf"
        ></iframe-loader>`,
      )
      expect(el.source).to.equal(null)
      expect(el.isPDF).to.equal(false)
    })
    it('rejects blank sources', async () => {
      const el = await fixture(
        html`<iframe-loader source="   "></iframe-loader>`,
      )
      expect(el.source).to.equal(null)
    })
    it('rejects sources that cannot parse as a URL', async () => {
      const el = await fixture(html`<iframe-loader source="http://"></iframe-loader>`)
      expect(el.source).to.equal(null)
    })
  })

  describe('dimension syncing', () => {
    it('applies height and width changes to the iframe', async () => {
      const el = await fixture(
        html`<iframe-loader source="https://btopro.com"></iframe-loader>`,
      )
      await elementUpdated(el)
      el.height = 700
      el.width = '50%'
      await elementUpdated(el)
      const frame = el.querySelector('iframe')
      expect(frame.getAttribute('height')).to.equal('700')
      expect(frame.getAttribute('width')).to.equal('50%')
    })
  })

  describe('source changes after render', () => {
    it('moves the iframe to a pdf source without a sandbox', async () => {
      const el = await fixture(
        html`<iframe-loader source="https://btopro.com"></iframe-loader>`,
      )
      await elementUpdated(el)
      const frame = el.querySelector('iframe')
      el.source = 'https://btopro.com/report.pdf'
      await elementUpdated(el)
      expect(el.isPDF).to.equal(true)
      expect(frame.getAttribute('src')).to.equal('https://btopro.com/report.pdf')
      expect(frame.hasAttribute('sandbox')).to.equal(false)
    })
    it('re-applies the sandbox when switching back from a pdf', async () => {
      const el = await fixture(
        html`<iframe-loader
          source="https://btopro.com/report.pdf"
        ></iframe-loader>`,
      )
      await elementUpdated(el)
      const frame = el.querySelector('iframe')
      expect(frame.hasAttribute('sandbox')).to.equal(false)
      el.source = 'https://btopro.com/page'
      await elementUpdated(el)
      expect(frame.getAttribute('src')).to.equal('https://btopro.com/page')
      expect(frame.getAttribute('sandbox')).to.equal(
        'allow-scripts allow-same-origin',
      )
    })
    it('removes the src attribute when the source is cleared', async () => {
      const el = await fixture(
        html`<iframe-loader source="https://btopro.com"></iframe-loader>`,
      )
      await elementUpdated(el)
      const frame = el.querySelector('iframe')
      el.source = null
      await elementUpdated(el)
      expect(frame.hasAttribute('src')).to.equal(false)
    })
  })

  describe('isPDF toggling', () => {
    it('removes and restores the sandbox as isPDF flips', async () => {
      const el = await fixture(
        html`<iframe-loader source="https://btopro.com"></iframe-loader>`,
      )
      await elementUpdated(el)
      const frame = el.querySelector('iframe')
      expect(frame.getAttribute('sandbox')).to.equal(
        'allow-scripts allow-same-origin',
      )
      el.isPDF = true
      await elementUpdated(el)
      expect(frame.hasAttribute('sandbox')).to.equal(false)
      el.isPDF = false
      await elementUpdated(el)
      expect(frame.getAttribute('sandbox')).to.equal(
        'allow-scripts allow-same-origin',
      )
    })
  })

  describe('loading state', () => {
    it('clears loading after the iframe load event fires', async () => {
      const el = await fixture(
        html`<iframe-loader>
          <iframe height="400" width="100%"></iframe>
        </iframe-loader>`,
      )
      const frame = el.querySelector('iframe')
      expect(el.loading).to.equal(true)
      frame.dispatchEvent(new Event('load'))
      await aTimeout(600)
      await elementUpdated(el)
      expect(el.loading).to.equal(false)
      expect(el.shadowRoot.querySelector('#container').className).to.equal(
        'loaded',
      )
      expect(
        el.shadowRoot.querySelector('#slot').getAttribute('style'),
      ).to.include('block')
      const indicator = el.shadowRoot.querySelector('loading-indicator')
      expect(indicator.loading).to.equal(false)
    })
    it('adopts the iframe height through the composed event path', async () => {
      // no src on the iframe so no network load can race our debounce
      const el = await fixture(html`<iframe-loader></iframe-loader>`)
      el.iframeLoadingCallback({ composedPath: () => [{ height: 600 }] })
      await aTimeout(600)
      await elementUpdated(el)
      expect(el.loading).to.equal(false)
      expect(el.height).to.equal(600)
    })
  })

  describe('observers', () => {
    it('adopts a replacement iframe and re-derives source and size', async () => {
      const el = await fixture(
        html`<iframe-loader>
          <iframe src="https://btopro.com" height="400" width="100%"></iframe>
        </iframe-loader>`,
      )
      el.querySelector('iframe').remove()
      const frame = globalThis.document.createElement('iframe')
      frame.setAttribute('src', 'https://example.com/report.pdf')
      frame.setAttribute('height', '600')
      frame.setAttribute('width', '80%')
      el.appendChild(frame)
      await aTimeout(100)
      await elementUpdated(el)
      expect(el.source).to.equal('https://example.com/report.pdf')
      expect(el.isPDF).to.equal(true)
      expect(el.height).to.equal('600')
      expect(el.width).to.equal('80%')
      expect(el.__iframe).to.equal(frame)
      expect(frame.hasAttribute('sandbox')).to.equal(false)
    })
    it('ignores iframe attribute mutations while it loads hidden', async () => {
      // while loading the slotted iframe is not rendered (#slot is
      // display:none) so its offsetHeight is 0 and nothing is adopted
      const el = await fixture(html`<iframe-loader></iframe-loader>`)
      el.height = 400
      await elementUpdated(el)
      const frame = el.querySelector('iframe')
      frame.setAttribute('height', '600')
      await aTimeout(100)
      await elementUpdated(el)
      expect(el.height).to.equal(400)
      expect(el.loading).to.equal(true)
    })
  })

  describe('disconnection', () => {
    it('stops observing child mutations after disconnect', async () => {
      const el = await fixture(
        html`<iframe-loader source="https://btopro.com"></iframe-loader>`,
      )
      await elementUpdated(el)
      el.remove()
      const frame = globalThis.document.createElement('iframe')
      frame.setAttribute('src', 'https://example.com/late.pdf')
      el.appendChild(frame)
      await aTimeout(100)
      expect(el.source).to.equal('https://btopro.com')
    })
  })

  describe('nested loaders', () => {
    it('removes a nested iframe-loader child', async () => {
      const host = globalThis.document.createElement('div')
      host.innerHTML =
        '<iframe-loader><iframe-loader></iframe-loader></iframe-loader>'
      globalThis.document.body.appendChild(host)
      const el = host.querySelector('iframe-loader')
      expect(el.querySelector('iframe-loader')).to.equal(null)
      expect(el.source).to.equal(null)
      await elementUpdated(el)
      host.remove()
    })
  })

  describe('HAX integration', () => {
    it('declares the HAX hooks it implements', () => {
      const el = globalThis.document.createElement('iframe-loader')
      expect(el.haxHooks()).to.deep.equal({
        preProcessNodeToContent: 'haxpreProcessNodeToContent',
        editModeChanged: 'haxeditModeChanged',
        activeElementChanged: 'haxactiveElementChanged',
      })
    })
    it('re-enables a node before converting it to content', async () => {
      const el = globalThis.document.createElement('iframe-loader')
      const node = { disabled: true }
      const result = await el.haxpreProcessNodeToContent(node)
      expect(result).to.equal(node)
      expect(node.disabled).to.equal(false)
    })
    it('syncs source from the active element while no iframe is managed', () => {
      const el = globalThis.document.createElement('iframe-loader')
      const activeEl = { src: 'https://btopro.com/course', disabled: false }
      const result = el.haxactiveElementChanged(activeEl, true)
      expect(result).to.equal(activeEl)
      expect(el.source).to.equal('https://btopro.com/course')
      expect(el.disabled).to.equal(true)
      expect(activeEl.disabled).to.equal(true)
    })
    it('syncs source from the managed iframe while active', async () => {
      const el = await fixture(
        html`<iframe-loader>
          <iframe
            src="https://btopro.com/page.pdf"
            height="400"
            width="100%"
          ></iframe>
        </iframe-loader>`,
      )
      el.source = 'https://btopro.com/elsewhere'
      const activeEl = { disabled: false }
      el.haxactiveElementChanged(activeEl, true)
      expect(el.source).to.equal('https://btopro.com/page.pdf')
      await elementUpdated(el)
      expect(el.disabled).to.equal(true)
      expect(el.hasAttribute('disabled')).to.equal(true)
    })
    it('toggles disabled asynchronously on edit mode change', async () => {
      const el = await fixture(
        html`<iframe-loader source="https://btopro.com"></iframe-loader>`,
      )
      el.haxeditModeChanged(true)
      await aTimeout(10)
      await elementUpdated(el)
      expect(el.disabled).to.equal(true)
      expect(el.hasAttribute('disabled')).to.equal(true)
      el.haxeditModeChanged(false)
      await aTimeout(10)
      await elementUpdated(el)
      expect(el.disabled).to.equal(false)
      expect(el.hasAttribute('disabled')).to.equal(false)
    })
    it('exposes haxProperties via a file reference', () => {
      expect(IframeLoader.haxProperties).to.include(
        'iframe-loader/lib/iframe-loader.haxProperties.json',
      )
    })
  })

  describe('HAX edit mode at first render', () => {
    let originalHaxStore
    beforeEach(() => {
      originalHaxStore = globalThis.HaxStore
    })
    afterEach(() => {
      if (originalHaxStore === undefined) {
        delete globalThis.HaxStore
      } else {
        globalThis.HaxStore = originalHaxStore
      }
    })
    it('starts disabled while HAX is in edit mode', async () => {
      globalThis.HaxStore = { instance: { editMode: true } }
      const el = await fixture(
        html`<iframe-loader source="https://btopro.com"></iframe-loader>`,
      )
      await elementUpdated(el)
      expect(el.disabled).to.equal(true)
    })
    it('starts enabled when HAX is not in edit mode', async () => {
      globalThis.HaxStore = { instance: { editMode: false } }
      const el = await fixture(
        html`<iframe-loader source="https://btopro.com"></iframe-loader>`,
      )
      await elementUpdated(el)
      expect(el.disabled).to.equal(false)
    })
  })

  describe('iframe creation', () => {
    // updated() mirrors the source into an iframe whenever the source changes,
    // so these exercise both the updated() and firstUpdated() creation paths.
    let el
    afterEach(() => {
      if (el) {
        el.remove()
        el = null
      }
    })
    it('creates the iframe with src and sandbox', async () => {
      el = globalThis.document.createElement('iframe-loader')
      el.source = 'https://btopro.com'
      globalThis.document.body.appendChild(el)
      await elementUpdated(el)
      const frame = el.querySelector('iframe')
      expect(frame).to.exist
      expect(frame.getAttribute('src')).to.equal('https://btopro.com')
      expect(frame.getAttribute('sandbox')).to.equal(
        'allow-scripts allow-same-origin',
      )
      expect(frame.getAttribute('width')).to.equal('100%')
      expect(frame.getAttribute('height')).to.equal('500')
      expect(el.__iframe).to.equal(frame)
    })
    it('leaves the sandbox off for pdf sources', async () => {
      el = globalThis.document.createElement('iframe-loader')
      el.source = 'https://btopro.com/manual.pdf'
      globalThis.document.body.appendChild(el)
      await elementUpdated(el)
      const frame = el.querySelector('iframe')
      expect(frame.getAttribute('src')).to.equal('https://btopro.com/manual.pdf')
      expect(frame.hasAttribute('sandbox')).to.equal(false)
      expect(el.isPDF).to.equal(true)
    })
    it('creates an iframe without a src when no source is set', async () => {
      el = globalThis.document.createElement('iframe-loader')
      globalThis.document.body.appendChild(el)
      await elementUpdated(el)
      const frame = el.querySelector('iframe')
      expect(frame).to.exist
      expect(frame.hasAttribute('src')).to.equal(false)
      expect(frame.getAttribute('sandbox')).to.equal(
        'allow-scripts allow-same-origin',
      )
    })
  })
})

describe('url sanitization helpers used by iframe-loader', () => {
  it('flags unsafe protocols', () => {
    expect(hasUnsafeURLProtocol('javascript:alert(1)')).to.equal(true)
    expect(hasUnsafeURLProtocol('vbscript:msgbox(1)')).to.equal(true)
    expect(hasUnsafeURLProtocol('data:text/html,hi')).to.equal(true)
    expect(hasUnsafeURLProtocol('https://example.com')).to.equal(false)
    expect(hasUnsafeURLProtocol('example.com/no-protocol')).to.equal(false)
    expect(hasUnsafeURLProtocol('')).to.equal(false)
    expect(hasUnsafeURLProtocol(12345)).to.equal(false)
  })
  it('falls back for blank, non-string and unsafe values', () => {
    expect(sanitizeURLValue(null)).to.equal('')
    expect(sanitizeURLValue(undefined)).to.equal('')
    expect(sanitizeURLValue(12345)).to.equal('')
    expect(sanitizeURLValue('   ')).to.equal('')
    expect(sanitizeURLValue('javascript:alert(1)')).to.equal('')
    expect(sanitizeURLValue('  https://example.com  ')).to.equal(
      'https://example.com',
    )
  })
  it('only embeds http and https sources', () => {
    const fallback = 'https://fallback.example.com'
    expect(sanitizeEmbeddableURL('')).to.equal('')
    expect(sanitizeEmbeddableURL('ftp://files.example.com/x.pdf', fallback)).to.equal(
      fallback,
    )
    expect(sanitizeEmbeddableURL('javascript:alert(1)', fallback)).to.equal(
      fallback,
    )
    expect(sanitizeEmbeddableURL('https://example.com', fallback)).to.equal(
      'https://example.com',
    )
    expect(sanitizeEmbeddableURL('//example.com/path', fallback)).to.equal(
      '//example.com/path',
    )
    expect(sanitizeEmbeddableURL('http://', fallback)).to.equal(fallback)
  })
})
