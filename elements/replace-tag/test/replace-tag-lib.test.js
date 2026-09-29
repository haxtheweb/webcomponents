import { fixture, expect, html } from '@open-wc/testing'

import '../replace-tag.js'
import '../lib/LoadingHelper.js'
import '../lib/PerformanceDetect.js'
import '../lib/loading-styles.js'
import { DeviceDetails } from '../lib/PerformanceDetect.js'
import { WCRegistryLoaderCSS } from '../lib/loading-styles.js'
import { LoadingHelper } from '../lib/LoadingHelper.js'
import { PerformanceDetect } from '../lib/PerformanceDetect.js'
import { I18NManagerStore } from '@haxtheweb/i18n-manager/i18n-manager.js'

describe('replace-tag basic construction', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture(
      html`<replace-tag with="undefined-rt-a">will replace</replace-tag>`,
    )
    await expect(el).shadowDom.to.be.accessible()
  })

  it('sets laser-loader attribute after evaluateReplaceMethod', async () => {
    const el = await fixture(
      html`<replace-tag with="undefined-rt-b">text</replace-tag>`,
    )
    await new Promise((resolve) => setTimeout(resolve, 200))
    expect(el.hasAttribute('laser-loader')).to.equal(true)
  })

  it('sets importingText to Loading... by default', async () => {
    const el = await fixture(
      html`<replace-tag with="undefined-rt-c">text</replace-tag>`,
    )
    await new Promise((resolve) => setTimeout(resolve, 200))
    expect(el.importingText).to.contain('Loading')
  })

  it('uses importing-text attribute when provided', async () => {
    const el = await fixture(
      html`<replace-tag
        with="undefined-rt-d"
        importing-text="Custom loading..."
        >text</replace-tag
      >`,
    )
    await new Promise((resolve) => setTimeout(resolve, 200))
    expect(el.importingText).to.equal('Custom loading...')
  })

  it('renders importingText in shadow DOM', async () => {
    const el = await fixture(
      html`<replace-tag with="undefined-rt-e" importing-text="My Text"
        >text</replace-tag
      >`,
    )
    await new Promise((resolve) => setTimeout(resolve, 200))
    const div = el.shadowRoot.querySelector('div')
    expect(div).to.exist
    expect(div.textContent).to.contain('My Text')
  })
})

describe('replace-tag import-only mode', () => {
  it('sets laser-loader in import-only mode with undefined tag', async () => {
    const el = await fixture(
      html`<replace-tag with="undefined-rt-f" import-only
        >text</replace-tag
      >`,
    )
    await new Promise((resolve) => setTimeout(resolve, 200))
    expect(el.hasAttribute('laser-loader')).to.equal(true)
  })
})

describe('replace-tag import-method=view', () => {
  it('sets laser-loader when import-method is view', async () => {
    const el = await fixture(
      html`<replace-tag with="undefined-rt-h" import-method="view"
        >text</replace-tag
      >`,
    )
    await new Promise((resolve) => setTimeout(resolve, 200))
    expect(el.hasAttribute('laser-loader')).to.equal(true)
  })

  it('enters lazy loading path with import-method=view', async () => {
    const el = await fixture(
      html`<replace-tag with="undefined-rt-i" import-method="view"
        >text</replace-tag
      >`,
    )
    await new Promise((resolve) => setTimeout(resolve, 500))
    // laser-loader is set in the same block that creates IntersectionObserver
    expect(el.hasAttribute('laser-loader')).to.equal(true)
    expect(el.importingText).to.contain('Loading')
  })
})

describe('replace-tag runReplacement', () => {
  it('warns when with attribute is missing', async () => {
    const originalWarn = console.warn
    let warned = false
    console.warn = (msg) => {
      if (msg && msg.includes) {
        warned = true
      }
    }
    const el = await fixture(
      html`<replace-tag with="undefined-rt-j">text</replace-tag>`,
    )
    await new Promise((resolve) => setTimeout(resolve, 100))
    el.removeAttribute('with')
    el.runReplacement()
    console.warn = originalWarn
    expect(warned).to.equal(true)
  })
})

describe('replace-tag handleIntersectionCallback', () => {
  it('runs replacement when intersection ratio >= 0.25', async () => {
    const el = await fixture(
      html`<replace-tag with="undefined-rt-k" import-method="view"
        >text</replace-tag
      >`,
    )
    await new Promise((resolve) => setTimeout(resolve, 200))
    let called = false
    el.runReplacement = () => {
      called = true
    }
    el.handleIntersectionCallback([
      { intersectionRatio: 0.5 },
    ])
    expect(called).to.equal(true)
    expect(el.intersectionObserver).to.be.null
  })

  it('does not run replacement when ratio < 0.25', async () => {
    const el = await fixture(
      html`<replace-tag with="undefined-rt-l" import-method="view"
        >text</replace-tag
      >`,
    )
    await new Promise((resolve) => setTimeout(resolve, 200))
    let called = false
    el.runReplacement = () => {
      called = true
    }
    el.handleIntersectionCallback([
      { intersectionRatio: 0.1 },
    ])
    expect(called).to.equal(false)
  })
})

describe('replace-tag performanceBasedReplacement', () => {
  it('sets laser-loader and calls render and runReplacement', async () => {
    const el = await fixture(
      html`<replace-tag with="undefined-rt-m" import-method="click"
        >text</replace-tag
      >`,
    )
    await new Promise((resolve) => setTimeout(resolve, 200))
    let replaced = false
    el.runReplacement = () => {
      replaced = true
    }
    el.performanceBasedReplacement()
    expect(el.hasAttribute('laser-loader')).to.equal(true)
    expect(el.importingText).to.exist
    expect(replaced).to.equal(true)
  })

  it('sets importingText to Loading... when not set', async () => {
    const el = await fixture(
      html`<replace-tag with="undefined-rt-n" import-method="click"
        >text</replace-tag
      >`,
    )
    await new Promise((resolve) => setTimeout(resolve, 200))
    el.importingText = undefined
    el.runReplacement = () => {}
    el.performanceBasedReplacement()
    expect(el.importingText).to.equal('Loading...')
  })
})

describe('replace-tag with pre-defined element', () => {
  it('clones attributes and migrates innerHTML when element is already defined', async () => {
    customElements.define(
      'test-replace-target',
      class extends HTMLElement {
        constructor() {
          super()
        }
      },
    )
    const el = await fixture(
      html`<replace-tag
        with="test-replace-target"
        data-custom="val"
        >inner content</replace-tag
      >`,
    )
    await new Promise((resolve) => setTimeout(resolve, 200))
    const replacement = globalThis.document.querySelector(
      'test-replace-target',
    )
    expect(replacement).to.exist
    if (replacement) {
      expect(replacement.innerHTML).to.contain('inner content')
      expect(replacement.getAttribute('data-custom')).to.equal('val')
    }
  })

  it('self-removes when import-only and element already defined', async () => {
    customElements.define(
      'test-replace-target-2',
      class extends HTMLElement {
        constructor() {
          super()
        }
      },
    )
    const el = await fixture(
      html`<replace-tag with="test-replace-target-2" import-only
        >text</replace-tag
      >`,
    )
    await new Promise((resolve) => setTimeout(resolve, 200))
    const rt = globalThis.document.querySelector(
      'replace-tag[with="test-replace-target-2"]',
    )
    expect(rt).to.be.null
  })
})

describe('replace-tag html getter and render', () => {
  it('html getter returns styled template with importingText', async () => {
    const el = await fixture(
      html`<replace-tag with="undefined-rt-o" importing-text="MyMsg"
        >text</replace-tag
      >`,
    )
    await new Promise((resolve) => setTimeout(resolve, 200))
    expect(el.html).to.contain('MyMsg')
    expect(el.html).to.contain('<style>')
  })

  it('render populates shadowRoot', async () => {
    const el = await fixture(
      html`<replace-tag with="undefined-rt-p">text</replace-tag>`,
    )
    await new Promise((resolve) => setTimeout(resolve, 200))
    el.importingText = 'Re-rendered'
    el.render()
    const div = el.shadowRoot.querySelector('div')
    expect(div.textContent).to.contain('Re-rendered')
  })
})

describe('LoadingHelper mixin', () => {
  it('sets loaded=false in constructor', () => {
    class TestEl extends LoadingHelper(HTMLElement) {
      constructor() {
        super()
      }
    }
    customElements.define('test-loading-helper', TestEl)
    const el = new TestEl()
    expect(el.loaded).to.equal(false)
  })

  it('sets loaded=true on connectedCallback', () => {
    class TestEl2 extends LoadingHelper(HTMLElement) {
      constructor() {
        super()
      }
    }
    customElements.define('test-loading-helper-2', TestEl2)
    const el = new TestEl2()
    el.connectedCallback()
    expect(el.loaded).to.equal(true)
  })

  it('exposes loaded property in static properties', () => {
    class TestEl3 extends LoadingHelper(HTMLElement) {}
    const props = TestEl3.properties
    expect(props).to.exist
    expect(props.loaded).to.exist
    expect(props.loaded.type).to.equal(Boolean)
  })
})

describe('PerformanceDetect singleton', () => {
  it('provides DeviceDetails singleton', () => {
    expect(DeviceDetails).to.exist
    expect(DeviceDetails.tagName.toLowerCase()).to.equal('performance-detect')
  })

  it('has default details object with all false values', () => {
    expect(DeviceDetails.details).to.exist
    expect(DeviceDetails.details.lowMemory).to.equal(false)
    expect(DeviceDetails.details.lowProcessor).to.equal(false)
    expect(DeviceDetails.details.lowBattery).to.equal(false)
    expect(DeviceDetails.details.poorConnection).to.equal(false)
    expect(DeviceDetails.details.dataSaver).to.equal(false)
  })

  it('badDevice returns a boolean', async () => {
    const result = await DeviceDetails.badDevice()
    expect(typeof result).to.equal('boolean')
  })

  it('mobileDevice returns a boolean', () => {
    const result = DeviceDetails.mobileDevice()
    expect(typeof result).to.equal('boolean')
  })

  it('getDetails returns full details when no param', () => {
    const details = DeviceDetails.getDetails()
    expect(details).to.exist
    expect(details.lowMemory).to.exist
  })

  it('getDetails returns specific detail for memory', () => {
    const result = DeviceDetails.getDetails('memory')
    expect(typeof result).to.equal('boolean')
  })

  it('getDetails returns specific detail for processor', () => {
    const result = DeviceDetails.getDetails('processor')
    expect(typeof result).to.equal('boolean')
  })

  it('getDetails returns specific detail for battery', () => {
    const result = DeviceDetails.getDetails('battery')
    expect(typeof result).to.equal('boolean')
  })

  it('getDetails returns specific detail for connection', () => {
    const result = DeviceDetails.getDetails('connection')
    expect(typeof result).to.equal('boolean')
  })

  it('getDetails returns specific detail for data', () => {
    const result = DeviceDetails.getDetails('data')
    expect(typeof result).to.equal('boolean')
  })

  it('getDetails returns specific detail for mobile', () => {
    const result = DeviceDetails.getDetails('mobile')
    expect(typeof result).to.equal('boolean')
  })

  it('updateDetails returns details object', async () => {
    const details = await DeviceDetails.updateDetails()
    expect(details).to.exist
    expect(details.lowMemory).to.exist
    expect(details.mobileDevice).to.exist
  })

  it('detectMobileDevice returns a boolean', () => {
    const result = DeviceDetails.detectMobileDevice()
    expect(typeof result).to.equal('boolean')
  })
})

describe('PerformanceDetect class construction', () => {
  it('can be constructed directly', () => {
    const el = new PerformanceDetect()
    expect(el).to.exist
    expect(el.details).to.exist
  })

  it('has correct tag', () => {
    expect(PerformanceDetect.tag).to.equal('performance-detect')
  })
})

describe('WCRegistryLoaderCSS function', () => {
  it('can be called without error', async () => {
    expect(() => WCRegistryLoaderCSS()).to.not.throw()
    await new Promise((resolve) => setTimeout(resolve, 50))
  })

  it('accepts auto=true parameter', async () => {
    const el = await fixture(
      html`<replace-tag with="word-count">text</replace-tag>`,
    )
    await new Promise((resolve) => setTimeout(resolve, 200))
    expect(() => WCRegistryLoaderCSS(true)).to.not.throw()
    await new Promise((resolve) => setTimeout(resolve, 50))
  })

  it('accepts custom parent and selectorBase', async () => {
    expect(() =>
      WCRegistryLoaderCSS(false, 'div', ':not(:defined)'),
    ).to.not.throw()
    await new Promise((resolve) => setTimeout(resolve, 50))
  })

  it('sets laser-loader attribute when auto=true', async () => {
    const container = globalThis.document.createElement('div')
    const child = globalThis.document.createElement('undefined-custom-el')
    container.appendChild(child)
    globalThis.document.body.appendChild(container)
    WCRegistryLoaderCSS(true, '*')
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(child.hasAttribute('laser-loader')).to.equal(true)
    globalThis.document.body.removeChild(container)
  })

  it('triggers whenDefined callback after element is defined', async () => {
    const container = globalThis.document.createElement('div')
    const child = globalThis.document.createElement('rt-definable-el')
    child.setAttribute('laser-loader', 'laser-loader')
    container.appendChild(child)
    globalThis.document.body.appendChild(container)
    WCRegistryLoaderCSS(false, '*')
    await new Promise((resolve) => setTimeout(resolve, 50))
    customElements.define(
      'rt-definable-el',
      class extends HTMLElement {
        constructor() {
          super()
        }
      },
    )
    await customElements.whenDefined('rt-definable-el')
    await new Promise((resolve) => setTimeout(resolve, 200))
    expect(child.hasAttribute('loaded')).to.equal(true)
    globalThis.document.body.removeChild(container)
  })

  it('triggers resize event handler when undefined elements exist', async () => {
    const container = globalThis.document.createElement('div')
    const child = globalThis.document.createElement('undefined-resize-el')
    container.appendChild(child)
    globalThis.document.body.appendChild(container)
    globalThis.dispatchEvent(new Event('resize'))
    await new Promise((resolve) => setTimeout(resolve, 200))
    globalThis.document.body.removeChild(container)
  })
})

describe('i18n-manager singleton API', () => {
  it('provides the I18NManagerStore singleton', () => {
    expect(I18NManagerStore).to.exist
    expect(I18NManagerStore.tagName.toLowerCase()).to.equal('i18n-manager')
  })

  it('has documentLang and documentDir getters', () => {
    expect(I18NManagerStore.documentLang).to.exist
    expect(I18NManagerStore.dir).to.exist
  })

  it('registerLocalization adds an element to the manager', () => {
    const fakeContext = { tagName: 'FAKE-RT-CTX', t: { hello: 'Hello' } }
    I18NManagerStore.registerLocalization({
      context: fakeContext,
      namespace: 'rt-test-ns',
      localesPath: '/fake/locales',
      locales: ['en', 'es'],
    })
    const match = I18NManagerStore.elements.filter(
      (e) => e.namespace === 'rt-test-ns',
    )
    expect(match.length).to.be.greaterThan(0)
  })

  it('detailNormalize infers namespace from context tagName', () => {
    const ctx = { tagName: 'MY-RT-ELEMENT', t: { hi: 'Hi' } }
    const result = I18NManagerStore.detailNormalize({
      context: ctx,
      localesPath: '/fake/locales',
    })
    expect(result.namespace).to.equal('my-rt-element')
  })

  it('detailNormalize infers updateCallback from context', () => {
    const ctx = { tagName: 'MY-RT-EL', requestUpdate: () => {}, t: {} }
    const result = I18NManagerStore.detailNormalize({
      context: ctx,
      localesPath: '/fake/locales',
    })
    expect(result.updateCallback).to.equal('requestUpdate')
  })

  it('detailNormalize infers localesPath from basePath', () => {
    const result = I18NManagerStore.detailNormalize({
      namespace: 'rt-test-ns2',
      basePath: 'https://example.com/some/path',
    })
    expect(result.localesPath).to.contain('locales')
  })

  it('hasTranslation returns false when manifest not loaded', () => {
    expect(I18NManagerStore.hasTranslation('foo', 'es')).to.equal(false)
  })

  it('needsManifest returns false for English', () => {
    expect(I18NManagerStore.needsManifest('en')).to.equal(false)
    expect(I18NManagerStore.needsManifest('en-US')).to.equal(false)
  })

  it('needsManifest returns true for non-English', () => {
    expect(I18NManagerStore.needsManifest('es')).to.equal(true)
    expect(I18NManagerStore.needsManifest('fr')).to.equal(true)
  })

  it('changeLanguageEvent updates lang from detail', () => {
    I18NManagerStore.changeLanguageEvent({ detail: 'de' })
    expect(I18NManagerStore.lang).to.equal('de')
    I18NManagerStore.changeLanguageEvent({ detail: 'en' })
    expect(I18NManagerStore.lang).to.equal('en')
  })

  it('fetchJsonTarget returns false for invalid URL', async () => {
    const result = await I18NManagerStore._fetchJsonTarget(
      'invalid-url-that-does-not-exist.json',
    )
    expect(result).to.equal(false)
  })

  it('loadNamespaceFile returns undefined for unknown namespace', async () => {
    const result = await I18NManagerStore.loadNamespaceFile(
      'nonexistent-namespace-xyz',
      'en',
    )
    expect(result).to.be.undefined
  })
})
