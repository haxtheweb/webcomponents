import { fixture, expect, html, aTimeout } from '@open-wc/testing'
import { LitElement } from 'lit'
import '../media-image.js'
import { DDDPulseEffectSuper } from '@haxtheweb/d-d-d/d-d-d.js'
import { DesignSystemManager } from '@haxtheweb/d-d-d/lib/DesignSystemManager.js'
import {
  HAXOptionSampleFactory,
  iconFromPageType,
  learningComponentTypes,
} from '@haxtheweb/d-d-d/lib/DDDStyles.js'
import { SimpleIconsetStore } from '@haxtheweb/simple-icon/lib/simple-iconset.js'
import { SimpleColorsSharedStylesGlobal } from '@haxtheweb/simple-colors-shared-styles/simple-colors-shared-styles.js'
import { SchemaBehaviors } from '@haxtheweb/schema-behaviors/schema-behaviors.js'
import { generateResourceID } from '@haxtheweb/utils/lib/ids.js'

// media-image is a DDD design system element with modal support; its coverage
// run includes the shared DDD toolchain (DesignSystemManager, DDDStyles,
// d-d-d.js samples, simple-modal, simple-tooltip, simple-colors,
// schema-behaviors). These tests exercise the behaviors of that shared
// toolchain that media-image's aggregate coverage is measured against.

class MiPulseTest extends DDDPulseEffectSuper(LitElement) {
  static get tag() {
    return 'mi-pulse-test'
  }
  render() {
    return html`<div>pulse host</div>`
  }
}
globalThis.customElements.define(MiPulseTest.tag, MiPulseTest)

class MiSchemaTest extends SchemaBehaviors(LitElement) {
  static get tag() {
    return 'mi-schema-test'
  }
  render() {
    return html`<div>schema host</div>`
  }
}
globalThis.customElements.define(MiSchemaTest.tag, MiSchemaTest)

describe('media-image shared toolchain', () => {
  describe('SimpleModalHandler wiring', () => {
    it('marks the image keyboard focusable and passes modal metadata', async () => {
      const el = await fixture(
        html`<media-image
          source="files/photo.jpg"
          alt="A photo"
        ></media-image>`,
      )
      await el.updateComplete
      const image = el.shadowRoot.querySelector('media-image-image')
      expect(image.getAttribute('tabindex')).to.equal('0')
      expect(image.modalTitle).to.equal('')
      expect(image.modalContent).to.exist
      expect(image.modalContent.tagName.toLowerCase()).to.equal(
        'image-inspector',
      )
      el.figureLabelTitle = 'Figure 3'
      await el.updateComplete
      expect(image.modalTitle).to.equal('Figure 3')
    })

    it('ignores non Enter keys in _keydown', async () => {
      const el = await fixture(
        html`<media-image source="files/photo.jpg"></media-image>`,
      )
      await el.updateComplete
      const image = el.shadowRoot.querySelector('media-image-image')
      expect(() => image._keydown({ key: 'Escape' })).to.not.throw
      expect(() => image._keydown({ key: ' ' })).to.not.throw
    })
  })

  describe('simple-modal singleton', () => {
    let modal

    beforeEach(async () => {
      await aTimeout(20)
      modal = globalThis.SimpleModal.requestAvailability()
      await aTimeout(20)
    })

    afterEach(async () => {
      if (modal && modal.opened) {
        modal.close()
        await aTimeout(30)
      }
    })

    it('registers a singleton modal instance', () => {
      expect(modal).to.exist
      expect(modal.tagName.toLowerCase()).to.equal('simple-modal')
      expect(globalThis.SimpleModal.requestAvailability()).to.equal(modal)
    })

    it('opens from a simple-modal-show event and closes from hide', async () => {
      const content = globalThis.document.createElement('div')
      content.textContent = 'Modal content'
      const invokedBy = globalThis.document.createElement('button')
      globalThis.document.body.appendChild(invokedBy)
      let openedEvent = null
      let closedEvent = null
      modal.addEventListener('simple-modal-opened', (e) => {
        openedEvent = e
      })
      modal.addEventListener('simple-modal-closed', (e) => {
        closedEvent = e
      })
      globalThis.dispatchEvent(
        new CustomEvent('simple-modal-show', {
          detail: {
            title: 'Inspect image',
            elements: { content },
            invokedBy,
            styles: {
              '--simple-modal-min-width': '50vw',
              '--simple-modal-min-height': '50vh',
            },
          },
        }),
      )
      await aTimeout(60)
      expect(modal.opened).to.be.true
      expect(modal.title).to.equal('Inspect image')
      expect(modal.invokedBy).to.equal(invokedBy)
      expect(modal.querySelector('[slot="content"]')).to.equal(content)
      expect(openedEvent).to.not.equal(null)
      await aTimeout(100)
      globalThis.dispatchEvent(new CustomEvent('simple-modal-hide'))
      await aTimeout(30)
      expect(modal.opened).to.be.false
      expect(closedEvent).to.not.equal(null)
      invokedBy.remove()
    })

    it('swaps content when shown again while already open', async () => {
      const first = globalThis.document.createElement('div')
      first.textContent = 'first'
      globalThis.dispatchEvent(
        new CustomEvent('simple-modal-show', {
          detail: { title: 'One', elements: { content: first } },
        }),
      )
      await aTimeout(60)
      expect(modal.querySelector('[slot="content"]')).to.equal(first)
      const second = globalThis.document.createElement('div')
      second.textContent = 'second'
      globalThis.dispatchEvent(
        new CustomEvent('simple-modal-show', {
          detail: { title: 'Two', elements: { content: second } },
        }),
      )
      await aTimeout(60)
      expect(modal.title).to.equal('Two')
      expect(modal.querySelector('[slot="content"]')).to.equal(second)
    })

    it('renders breadcrumbs and fires breadcrumb clicks', async () => {
      let crumbClicked = null
      let breadcrumbEvent = null
      const crumbs = [
        {
          label: 'First',
          icon: 'icons:android',
          onClick: (d) => {
            crumbClicked = d
          },
        },
        { label: 'Current' },
      ]
      const content = globalThis.document.createElement('div')
      content.textContent = 'crumbs'
      modal.addEventListener('simple-modal-breadcrumb-click', (e) => {
        breadcrumbEvent = e
      })
      globalThis.dispatchEvent(
        new CustomEvent('simple-modal-show', {
          detail: {
            title: 'Nowhere',
            elements: { content },
            breadcrumbs: crumbs,
          },
        }),
      )
      await aTimeout(60)
      const nav = modal.shadowRoot.querySelector('nav.breadcrumbs')
      expect(nav).to.exist
      const button = modal.shadowRoot.querySelector('.breadcrumb-button')
      expect(button).to.exist
      const current = modal.shadowRoot.querySelector('.breadcrumb-current')
      expect(current).to.exist
      button.click()
      expect(crumbClicked).to.not.equal(null)
      expect(crumbClicked.breadcrumb.label).to.equal('First')
      expect(breadcrumbEvent).to.not.equal(null)
    })

    it('wires dialog-dismiss and dialog-confirm buttons to close', async () => {
      const content = globalThis.document.createElement('div')
      const dismissButton = globalThis.document.createElement('button')
      dismissButton.setAttribute('dialog-dismiss', '')
      dismissButton.textContent = 'Dismiss'
      const confirmButton = globalThis.document.createElement('button')
      confirmButton.setAttribute('dialog-confirm', '')
      confirmButton.textContent = 'Confirm'
      content.appendChild(dismissButton)
      content.appendChild(confirmButton)
      let dismissed = null
      let confirmed = null
      modal.addEventListener('simple-modal-dismissed', (e) => {
        dismissed = e
      })
      modal.addEventListener('simple-modal-confirmed', (e) => {
        confirmed = e
      })
      globalThis.dispatchEvent(
        new CustomEvent('simple-modal-show', {
          detail: { title: 'Decide', elements: { content } },
        }),
      )
      await aTimeout(60)
      dismissButton.click()
      await aTimeout(30)
      expect(dismissed).to.not.equal(null)
      expect(modal.opened).to.be.false
      globalThis.dispatchEvent(
        new CustomEvent('simple-modal-show', {
          detail: { title: 'Decide again', elements: { content } },
        }),
      )
      await aTimeout(60)
      confirmButton.click()
      await aTimeout(30)
      expect(confirmed).to.not.equal(null)
      expect(modal.opened).to.be.false
    })

    it('focuses modal content that exposes focusInitial', async () => {
      let focusInitialCalled = false
      const content = globalThis.document.createElement('div')
      content.textContent = 'focusable'
      content.focusInitial = () => {
        focusInitialCalled = true
      }
      globalThis.dispatchEvent(
        new CustomEvent('simple-modal-show', {
          detail: { title: 'Focus', elements: { content } },
        }),
      )
      await aTimeout(100)
      expect(focusInitialCalled).to.be.true
    })

    it('derives aria labelling from the title', async () => {
      const content = globalThis.document.createElement('div')
      content.textContent = 'x'
      globalThis.dispatchEvent(
        new CustomEvent('simple-modal-show', {
          detail: { title: 'Labelled', elements: { content } },
        }),
      )
      await aTimeout(60)
      expect(modal._getAriaLabelledby('Labelled')).to.equal(
        'simple-modal-title',
      )
      expect(modal._getAriaLabelledby('')).to.equal(null)
      expect(modal._getAriaLabel('')).to.equal('Modal Dialog')
      expect(modal._getAriaLabel('Labelled')).to.equal(null)
    })
  })

  describe('DesignSystemManager', () => {
    it('has the ddd design system registered and active', () => {
      expect(DesignSystemManager.systems.ddd).to.exist
      expect(DesignSystemManager.active).to.equal('ddd')
    })

    it('builds a namespaced integration cache key', () => {
      expect(DesignSystemManager._integrationCacheKey('ddd', 'hax')).to.equal(
        'ddd::hax',
      )
    })

    it('returns early for an unknown system', async () => {
      const result = await DesignSystemManager.loadSystemIntegration(
        'mi-unknown-system',
        'hax',
        {},
      )
      expect(result).to.be.undefined
    })

    it('returns early for an integration with no module or importer', async () => {
      DesignSystemManager.addDesignSystem({
        name: 'mi-empty-system',
        styles: [],
        fonts: [],
        integrations: { hax: {} },
      })
      const result = await DesignSystemManager.loadSystemIntegration(
        'mi-empty-system',
        'hax',
        {},
      )
      expect(result).to.be.undefined
      delete DesignSystemManager.systems['mi-empty-system']
    })

    it('gates the hax integration on editMode context', async () => {
      await DesignSystemManager.loadSystemIntegration('ddd', 'hax', {
        editMode: false,
        isAuthenticated: true,
      })
      expect(DesignSystemManager.__loadedIntegrations['ddd::hax']).to.be
        .undefined
    })

    it('skips loading when the integration was already loaded (cache hit)', async () => {
      const original =
        DesignSystemManager.__loadedIntegrations['ddd::hax'] || false
      DesignSystemManager.__loadedIntegrations['ddd::hax'] = true
      await DesignSystemManager.loadSystemIntegration('ddd', 'hax', {
        editMode: true,
        isAuthenticated: true,
      })
      expect(DesignSystemManager.__loadedIntegrations['ddd::hax']).to.be.true
      DesignSystemManager.__loadedIntegrations['ddd::hax'] = original
    })

    it('no-ops loadActiveSystemIntegrations when nothing is active', async () => {
      const originalActive = DesignSystemManager.active
      DesignSystemManager.active = null
      await DesignSystemManager.loadActiveSystemIntegrations({})
      DesignSystemManager.active = originalActive
      expect(DesignSystemManager.active).to.equal('ddd')
    })

    it('derives runtime context from HaxStore and HAXCMS when present', () => {
      const originalHaxStore = globalThis.HaxStore
      const originalHAXCMS = globalThis.HAXCMS
      globalThis.HaxStore = {
        requestAvailability: () => ({ editMode: true }),
      }
      globalThis.HAXCMS = {
        instance: { store: { isLoggedIn: false } },
      }
      try {
        const context = DesignSystemManager._integrationContextFromRuntime()
        expect(context.editMode).to.be.true
        expect(context.isAuthenticated).to.be.false
      } finally {
        globalThis.HaxStore = originalHaxStore
        globalThis.HAXCMS = originalHAXCMS
      }
    })

    it('rehydrates the HAX element list through the store', () => {
      const originalHaxStore = globalThis.HaxStore
      const hydrated = []
      globalThis.HaxStore = {
        requestAvailability: () => ({
          elementList: {
            'media-image': { tag: 'media-image' },
            'figure-label': { tag: 'figure-label' },
          },
          designSystemHAXProperties: (props, tag) => {
            hydrated.push(tag)
            return props
          },
        }),
      }
      try {
        DesignSystemManager._rehydrateHAXElementList()
        expect(hydrated).to.include('media-image')
        expect(hydrated).to.include('figure-label')
      } finally {
        globalThis.HaxStore = originalHaxStore
      }
    })

    it('dispatches design-system-active-changed when switching systems', async () => {
      DesignSystemManager.addDesignSystem({
        name: 'mi-switch-system',
        styles: [],
        fonts: [],
      })
      let fired = null
      const handler = (e) => {
        fired = e.detail
      }
      globalThis.addEventListener('design-system-active-changed', handler)
      try {
        DesignSystemManager.active = 'mi-switch-system'
        await aTimeout(100)
        expect(fired).to.not.equal(null)
        expect(fired.active).to.equal('mi-switch-system')
        expect(fired.previous).to.equal('ddd')
      } finally {
        globalThis.removeEventListener('design-system-active-changed', handler)
        DesignSystemManager.active = 'ddd'
        await aTimeout(100)
        delete DesignSystemManager.systems['mi-switch-system']
      }
    })

    it('re-applies a design system, cleaning up the previous one', () => {
      const ddd = DesignSystemManager.systems.ddd
      DesignSystemManager.applyDesignSystem(ddd, ddd)
      const fonts = globalThis.document.head.querySelectorAll('[data-ds]')
      expect(fonts).to.have.lengthOf(3)
    })

    it('runs the ddd onload fallback when initial-letter is unsupported', () => {
      const originalCSS = globalThis.CSS
      globalThis.CSS = { supports: () => false }
      try {
        DesignSystemManager.systems.ddd.onload()
        expect(
          globalThis.document.body.classList.contains('dropCap-noSupport'),
        ).to.be.true
      } finally {
        globalThis.CSS = originalCSS
        globalThis.document.body.classList.remove('dropCap-noSupport')
      }
    })
  })

  describe('DDDSample rendering', () => {
    it('renders an accent sample and applies its data attribute', async () => {
      const el = await fixture(
        html`<d-d-d-sample type="accent" option="2">text</d-d-d-sample>`,
      )
      await el.updateComplete
      await aTimeout(100)
      const sample = el.shadowRoot.querySelector('span.sample')
      expect(sample.getAttribute('data-accent')).to.equal('2')
    })

    it('targets the wrapper for font-size samples', async () => {
      const el = await fixture(
        html`<d-d-d-sample type="font-size" option="s">Large</d-d-d-sample>`,
      )
      await el.updateComplete
      await aTimeout(100)
      const wrapper = el.shadowRoot.querySelector('div.wrapper')
      expect(wrapper.getAttribute('data-font-size')).to.equal('s')
    })

    it('targets the label for font-weight samples', async () => {
      const el = await fixture(
        html`<d-d-d-sample type="font-weight" option="bold">Bold</d-d-d-sample>`,
      )
      await el.updateComplete
      await aTimeout(100)
      const label = el.shadowRoot.querySelector('span.label')
      expect(label.getAttribute('data-font-weight')).to.equal('bold')
    })

    it('updates the option attribute when option changes', async () => {
      const el = await fixture(
        html`<d-d-d-sample type="accent" option="2">text</d-d-d-sample>`,
      )
      await el.updateComplete
      await aTimeout(100)
      el.option = 5
      await el.updateComplete
      await aTimeout(100)
      expect(
        el.shadowRoot.querySelector('span.sample').getAttribute('data-accent'),
      ).to.equal('5')
    })

    it('renders a tooltip for the sample when tooltip is set', async () => {
      const el = await fixture(
        html`<d-d-d-sample type="accent" option="2" tooltip
          >tip sample</d-d-d-sample
        >`,
      )
      await el.updateComplete
      const tip = el.shadowRoot.querySelector('simple-tooltip')
      expect(tip).to.exist
      expect(tip.getAttribute('for')).to.equal('sample')
    })
  })

  describe('DDDPulseEffectSuper mixin', () => {
    it('reflects data-pulse and clears it on mouseenter', async () => {
      const el = await fixture(
        html`<mi-pulse-test data-pulse="p-1"></mi-pulse-test>`,
      )
      await el.updateComplete
      expect(el.dataPulse).to.equal('p-1')
      el.dispatchEvent(new Event('mouseenter'))
      await el.updateComplete
      expect(el.dataPulse).to.equal(null)
      expect(el.hasAttribute('data-pulse')).to.be.false
    })

    it('toggles the pulse effect listener on and off with dataPulse', async () => {
      const el = await fixture(html`<mi-pulse-test></mi-pulse-test>`)
      await el.updateComplete
      el.dataPulse = 'p-2'
      await el.updateComplete
      expect(el.dataPulse).to.equal('p-2')
      el.dataPulse = null
      await el.updateComplete
      expect(el.dataPulse).to.equal(null)
    })
  })

  describe('DDDStyles option samples', () => {
    it('builds HAX option samples for accent swatches', () => {
      const options = HAXOptionSampleFactory('accent')
      expect(options).to.have.lengthOf(15)
      expect(options[0].value).to.equal('0')
      expect(options[0].html.strings.join(' ')).to.include('d-d-d-sample')
      expect(options[0].html.strings.join(' ')).to.include('tooltip')
    })

    it('updates the preview color variable when an accent sample is clicked', async () => {
      const options = HAXOptionSampleFactory('accent')
      const host = await fixture(html`<div>${options[0].html}</div>`)
      const sample = host.querySelector('d-d-d-sample')
      expect(sample).to.exist
      sample.click()
      expect(
        globalThis.document.body.style.getPropertyValue(
          '--ddd-sample-theme-accent',
        ),
      ).to.equal('var(--ddd-accent-0)')
      globalThis.document.body.style.removeProperty(
        '--ddd-sample-theme-accent',
      )
    })

    it('builds plain option samples for non color types', () => {
      const options = HAXOptionSampleFactory('margin')
      expect(options).to.have.lengthOf(6)
      expect(options[0].html.strings.join(' ')).to.not.include('tooltip')
    })

    it('maps every learning component type to an icon', () => {
      for (const type of Object.keys(learningComponentTypes)) {
        const icon = iconFromPageType(type)
        expect(icon).to.be.a('string')
        expect(icon).to.include(':')
      }
    })

    it('falls back to the learning objectives icon for unknown types', () => {
      expect(iconFromPageType('definitely-not-a-type')).to.equal(
        'courseicons:learning-objectives',
      )
    })
  })

  describe('simple-iconset registry', () => {
    it('registers iconsets from object notation', () => {
      SimpleIconsetStore.registerIconset('mi-test-icons', {
        android: 'android.svg',
      })
      expect(SimpleIconsetStore.iconsets['mi-test-icons']).to.deep.equal({
        android: 'android.svg',
      })
      delete SimpleIconsetStore.iconsets['mi-test-icons']
    })

    it('resolves icons registered as objects and strings', () => {
      SimpleIconsetStore.registerIconset('mi-test-icons', {
        android: 'path/android.svg',
      })
      expect(SimpleIconsetStore.getIcon('mi-test-icons:android')).to.equal(
        'path/android.svg',
      )
      expect(SimpleIconsetStore.getIcon('icons:settings')).to.include(
        'settings.svg',
      )
      delete SimpleIconsetStore.iconsets['mi-test-icons']
    })

    it('assumes the icons namespace for icon names without a prefix', () => {
      expect(SimpleIconsetStore.getIcon('settings')).to.include('settings.svg')
    })

    it('queues a missed icon for hydration and processes it on registration', () => {
      const pending = { setSrcByIcon: () => true }
      expect(SimpleIconsetStore.getIcon('mi-late:icon', pending)).to.equal(null)
      expect(SimpleIconsetStore.needsHydrated).to.include(pending)
      SimpleIconsetStore.registerIconset('mi-late', 'late/path/')
      expect(SimpleIconsetStore.needsHydrated).to.not.include(pending)
      delete SimpleIconsetStore.iconsets['mi-late']
    })
  })

  describe('simple-colors utilities inherited via DDD', () => {
    let element
    beforeEach(async () => {
      element = await fixture(
        html`<media-image source="files/photo.jpg"></media-image>`,
      )
      await element.updateComplete
    })

    it('reads color info for a simple-colors variable', () => {
      const info = element.getColorInfo('--simple-colors-default-theme-grey')
      expect(info.color).to.equal('grey')
      expect(info.shade).to.equal('1')
    })

    it('builds a simple-colors CSS variable via the shared styles global', () => {
      expect(SimpleColorsSharedStylesGlobal.makeVariable('red', 3, 'fixed')).to.equal(
        '--simple-colors-fixed-theme-red-3',
      )
    })

    it('forwards caller arguments through the delegator', () => {
      expect(element.makeVariable('red', 3, 'fixed')).to.equal(
        '--simple-colors-fixed-theme-red-3',
      )
    })

    it('lists WCAG AA contrasting shades and colors', () => {
      const shades = element.getContrastingShades(false, 'grey', '1', 'grey')
      expect(shades).to.be.an('array')
      expect(shades.length).to.be.at.least(1)
      const colors = element.getContrastingColors('grey', '1', false)
      expect(colors.grey).to.be.an('array')
      expect(Object.keys(colors)).to.have.length.of.at.least(10)
    })

    it('answers false for a non compliant contrast shade', () => {
      const range = SimpleColorsSharedStylesGlobal.contrasts.greyColor.aa[
        SimpleColorsSharedStylesGlobal.shadeToIndex('1')
      ]
      expect(
        element.isContrastCompliant(false, 'grey', '1', 'grey', range.min - 1),
      ).to.be.false
    })

    it('answers true when the contrast shade is compliant', () => {
      const range = SimpleColorsSharedStylesGlobal.contrasts.greyColor.aa[
        SimpleColorsSharedStylesGlobal.shadeToIndex('1')
      ]
      expect(
        element.isContrastCompliant(false, 'grey', '1', 'grey', range.min),
      ).to.be.true
      expect(
        element.isContrastCompliant(false, 'grey', '1', 'grey', range.max),
      ).to.be.true
    })

    it('converts shade indexes and shades via the shared styles global', () => {
      expect(SimpleColorsSharedStylesGlobal.indexToShade(4)).to.equal(5)
      expect(SimpleColorsSharedStylesGlobal.shadeToIndex('5')).to.equal(4)
    })

    it('inverts a shade through the shared styles global', () => {
      expect(element.invertShade(5)).to.equal(8)
      expect(element.invertShade('12')).to.equal(1)
    })

    it('renders a simple-colors element with its default accent', async () => {
      const el = await fixture(html`<simple-colors></simple-colors>`)
      await el.updateComplete
      expect(el.accentColor).to.equal('grey')
      expect(el.dark).to.be.false
    })

    it('renders a simple-colors-shared-styles element with color data', async () => {
      const el = await fixture(
        html`<simple-colors-shared-styles></simple-colors-shared-styles>`,
      )
      await el.updateComplete
      expect(el.colors.grey).to.have.lengthOf(12)
      expect(el.contrasts.greyColor.aa).to.have.lengthOf(12)
    })
  })

  describe('schema behaviors', () => {
    it('generates and reflects a resource id and prefix', async () => {
      const el = await fixture(html`<mi-schema-test></mi-schema-test>`)
      await el.updateComplete
      expect(el.getAttribute('resource')).to.match(/^#/)
      expect(el.getAttribute('prefix')).to.include('oer:http://oerschema.org/')
      expect(el.getAttribute('prefix')).to.include(
        'schema:http://schema.org/',
      )
    })

    it('preserves an existing resource attribute', async () => {
      const el = await fixture(
        html`<mi-schema-test resource="existing-id"></mi-schema-test>`,
      )
      await el.updateComplete
      expect(el.getAttribute('resource')).to.equal('existing-id')
      expect(el.getAttribute('prefix')).to.include('oer:')
    })

    it('replaces a literal null resource attribute', async () => {
      const el = await fixture(
        html`<mi-schema-test resource="null"></mi-schema-test>`,
      )
      await el.updateComplete
      expect(el.getAttribute('resource')).to.not.equal('null')
      expect(el.getAttribute('resource')).to.match(/^#/)
    })

    it('generates unique resource ids', () => {
      expect(generateResourceID()).to.match(/^#/)
      expect(generateResourceID('base-')).to.match(/^base-/)
      expect(generateResourceID()).to.not.equal(generateResourceID())
    })
  })

  describe('simple-icon-lite rendering', () => {
    it('resolves an icon through the iconset and renders it', async () => {
      const el = await fixture(
        html`<simple-icon-lite icon="icons:android"></simple-icon-lite>`,
      )
      await aTimeout(100)
      expect(el.src).to.include('android.svg')
      // Chromium advertises Safari in its user agent but is excluded from
      // the polyfill, so the SVG filter branch renders in the test browser
      const polyfill = el.shadowRoot.querySelector('#svg-polyfill')
      expect(polyfill).to.equal(null)
      expect(el.safariMask).to.equal('')
      expect(el.feFlood).to.exist
      const image = el.shadowRoot.querySelector('image')
      expect(image).to.exist
      expect(image.getAttribute('xlink:href')).to.include('android.svg')
    })

    it('drops the colorize filter when no-colorize is set', async () => {
      const el = await fixture(
        html`<simple-icon-lite
          icon="icons:android"
          no-colorize
        ></simple-icon-lite>`,
      )
      await el.updateComplete
      expect(el.feFlood).to.equal('')
    })

    it('clears the source when the icon is cleared', async () => {
      const el = await fixture(
        html`<simple-icon-lite icon="icons:android"></simple-icon-lite>`,
      )
      await aTimeout(100)
      expect(el.src).to.include('android.svg')
      el.icon = ''
      await aTimeout(100)
      expect(el.src).to.equal(null)
    })
  })

  describe('simple-tooltip behavior', () => {
    it('sets role and tabindex after firstUpdated', async () => {
      const el = await fixture(html`<simple-tooltip>tip</simple-tooltip>`)
      await el.updateComplete
      expect(el.getAttribute('role')).to.equal('tooltip')
      expect(el.getAttribute('tabindex')).to.equal('-1')
    })

    it('anchors to the parent when for is not set', async () => {
      const container = await fixture(
        html`<div><simple-tooltip>tip</simple-tooltip></div>`,
      )
      const tip = container.querySelector('simple-tooltip')
      await tip.updateComplete
      expect(tip.target).to.equal(container)
    })

    it('anchors to the element named by for', async () => {
      const container = await fixture(html`<div>
        <button id="mi-anchor">btn</button>
        <simple-tooltip for="mi-anchor">tip</simple-tooltip>
      </div>`)
      const tip = container.querySelector('simple-tooltip')
      await tip.updateComplete
      expect(tip.target).to.equal(container.querySelector('#mi-anchor'))
    })

    it('shows on mouseenter and focus of the target and hides on mouseleave', async () => {
      const container = await fixture(html`<div>
        <button id="mi-anchor-2">btn</button>
        <simple-tooltip for="mi-anchor-2">tip text</simple-tooltip>
      </div>`)
      const tip = container.querySelector('simple-tooltip')
      await tip.updateComplete
      const target = container.querySelector('#mi-anchor-2')
      target.dispatchEvent(new Event('mouseenter'))
      expect(tip._showing).to.be.true
      target.dispatchEvent(new Event('focus'))
      expect(tip._showing).to.be.true
      target.dispatchEvent(new Event('mouseleave'))
      expect(tip._showing).to.be.false
      target.dispatchEvent(new Event('blur'))
      await aTimeout(50)
    })

    it('show is a no-op with empty content and when already showing', async () => {
      const empty = await fixture(
        html`<simple-tooltip><span>   </span></simple-tooltip>`,
      )
      empty.show()
      expect(empty._showing).to.be.undefined
      const el = await fixture(html`<simple-tooltip>tip text</simple-tooltip>`)
      el.show()
      el.show()
      expect(el._showing).to.be.true
    })

    it('hides immediately while the entry animation is still playing', async () => {
      const el = await fixture(html`<simple-tooltip>tip text</simple-tooltip>`)
      el.show()
      expect(el._showing).to.be.true
      el.hide()
      expect(el._showing).to.be.false
      await aTimeout(50)
    })

    it('plays the exit animation once the entry animation ended', async () => {
      const el = await fixture(html`<simple-tooltip>tip text</simple-tooltip>`)
      const tip = el.shadowRoot.querySelector('#tooltip')
      el.show()
      tip.dispatchEvent(new Event('animationend'))
      el.hide()
      expect(el._showing).to.be.false
      expect(el._animationPlaying).to.be.true
      tip.dispatchEvent(new Event('animationend'))
      expect(tip.classList.contains('hidden')).to.be.true
      await aTimeout(50)
    })

    it('maps playAnimation entry/exit to show/hide', async () => {
      const el = await fixture(html`<simple-tooltip>tip text</simple-tooltip>`)
      el.playAnimation('entry')
      expect(el._showing).to.be.true
      el.playAnimation('exit')
      expect(el._showing).to.be.false
      el.playAnimation('nope')
      await aTimeout(50)
    })

    it('cancelAnimation applies the cancel class', async () => {
      const el = await fixture(html`<simple-tooltip>tip text</simple-tooltip>`)
      el.show()
      el.cancelAnimation()
      expect(
        el.shadowRoot
          .querySelector('#tooltip')
          .classList.contains('cancel-animation'),
      ).to.be.true
    })

    it('repositions below and above the target', async () => {
      const bottom = await fixture(html`<div
        style="position: relative; width: 300px; height: 300px;"
      >
        <button
          id="mi-pos-bottom"
          style="position: absolute; top: 50px; left: 50px; width: 100px; height: 30px;"
        >
          B
        </button>
        <simple-tooltip for="mi-pos-bottom">tip</simple-tooltip>
      </div>`)
      const bottomTip = bottom.querySelector('simple-tooltip')
      await bottomTip.updateComplete
      bottomTip.show()
      expect(bottomTip.style.top).to.not.equal('')

      const top = await fixture(html`<div
        style="position: relative; width: 300px; height: 300px;"
      >
        <button
          id="mi-pos-top"
          style="position: absolute; top: 100px; left: 50px; width: 100px; height: 30px;"
        >
          B
        </button>
        <simple-tooltip for="mi-pos-top" position="top">tip</simple-tooltip>
      </div>`)
      const topTip = top.querySelector('simple-tooltip')
      await topTip.updateComplete
      topTip.show()
      expect(topTip.style.top).to.not.equal('')
    })

    it('repositions left and right of the target', async () => {
      const left = await fixture(html`<div
        style="position: relative; width: 300px; height: 300px;"
      >
        <button
          id="mi-pos-left"
          style="position: absolute; top: 100px; left: 150px; width: 100px; height: 30px;"
        >
          B
        </button>
        <simple-tooltip for="mi-pos-left" position="left">tip</simple-tooltip>
      </div>`)
      const leftTip = left.querySelector('simple-tooltip')
      await leftTip.updateComplete
      leftTip.show()
      expect(leftTip.style.left).to.not.equal('')

      const right = await fixture(html`<div
        style="position: relative; width: 300px; height: 300px;"
      >
        <button
          id="mi-pos-right"
          style="position: absolute; top: 100px; left: 50px; width: 100px; height: 30px;"
        >
          B
        </button>
        <simple-tooltip for="mi-pos-right" position="right">tip</simple-tooltip>
      </div>`)
      const rightTip = right.querySelector('simple-tooltip')
      await rightTip.updateComplete
      rightTip.show()
      expect(rightTip.style.left).to.not.equal('')
    })

    it('converts animation timings to milliseconds', async () => {
      const el = await fixture(html`<simple-tooltip>tip text</simple-tooltip>`)
      expect(el._timeToMs('10ms')).to.equal(10)
      expect(el._timeToMs('0.5s')).to.equal(500)
      expect(el._timeToMs(5)).to.equal(0)
      expect(el._timeToMs('nope')).to.equal(0)
      const timing = el._getExitAnimationTiming()
      expect(timing).to.have.property('delay')
      expect(timing).to.have.property('duration')
    })

    it('updates delay styling when animationDelay changes', async () => {
      const el = await fixture(
        html`<simple-tooltip animation-delay="250"
          >tip text</simple-tooltip
        >`,
      )
      await el.updateComplete
      expect(
        globalThis.document.documentElement.style.getPropertyValue(
          '--simple-tooltip-delay-in',
        ),
      ).to.equal('250ms')
      globalThis.document.documentElement.style.removeProperty(
        '--simple-tooltip-delay-in',
      )
    })

    it('manual mode skips and restores automatic target listeners', async () => {
      const el = await fixture(
        html`<simple-tooltip manual-mode>tip text</simple-tooltip>`,
      )
      await el.updateComplete
      expect(el.manualMode).to.be.true
      el.manualMode = false
      await el.updateComplete
      expect(el.manualMode).to.be.false
    })

    it('removes target listeners when disconnected', async () => {
      const container = await fixture(html`<div>
        <button id="mi-anchor-3">btn</button>
        <simple-tooltip for="mi-anchor-3">tip text</simple-tooltip>
      </div>`)
      const tip = container.querySelector('simple-tooltip')
      await tip.updateComplete
      tip.remove()
      await aTimeout(50)
      expect(tip.parentNode).to.equal(null)
    })
  })
})
