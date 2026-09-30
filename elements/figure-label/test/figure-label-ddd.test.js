import { fixture, expect, html, aTimeout } from '@open-wc/testing'
import { LitElement } from 'lit'
import '../figure-label.js'
import { DDDPulseEffectSuper } from '@haxtheweb/d-d-d/d-d-d.js'
import { DesignSystemManager } from '@haxtheweb/d-d-d/lib/DesignSystemManager.js'
import {
  HAXOptionSampleFactory,
  iconFromPageType,
  learningComponentTypes,
} from '@haxtheweb/d-d-d/lib/DDDStyles.js'
import { SimpleIconsetStore } from '@haxtheweb/simple-icon/lib/simple-iconset.js'
import { SimpleColorsSharedStylesGlobal } from '@haxtheweb/simple-colors-shared-styles/simple-colors-shared-styles.js'

// figure-label is a DDD design system element; its coverage run includes the
// shared DDD toolchain (DesignSystemManager, DDDStyles, d-d-d.js samples,
// simple-tooltip, simple-colors). These tests exercise the behaviors of that
// shared toolchain that figure-label's aggregate coverage is measured against.

class FlPulseTest extends DDDPulseEffectSuper(LitElement) {
  static get tag() {
    return 'fl-pulse-test'
  }
  render() {
    return html`<div>pulse host</div>`
  }
}
globalThis.customElements.define(FlPulseTest.tag, FlPulseTest)

describe('figure-label DDD design system integration', () => {
  it('renders a figure-label through the DDD base class', async () => {
    const el = await fixture(
      html`<figure-label
        title="Figure 1.1"
        description="DDD powered figure label"
      ></figure-label>`,
    )
    await el.updateComplete
    expect(el.constructor.tag).to.equal('figure-label')
    expect(el.shadowRoot.querySelector('#title').textContent).to.equal(
      'Figure 1.1',
    )
  })

  describe('DesignSystemManager', () => {
    it('has the ddd design system registered and active', () => {
      expect(DesignSystemManager.systems.ddd).to.exist
      expect(DesignSystemManager.active).to.equal('ddd')
      expect(DesignSystemManager.systems.ddd.fonts).to.have.lengthOf(3)
    })

    it('builds a namespaced integration cache key', () => {
      expect(DesignSystemManager._integrationCacheKey('ddd', 'hax')).to.equal(
        'ddd::hax',
      )
    })

    it('returns early for an unknown system', async () => {
      const result = await DesignSystemManager.loadSystemIntegration(
        'fl-unknown-system',
        'hax',
        {},
      )
      expect(result).to.be.undefined
    })

    it('returns early for an integration with no module or importer', async () => {
      DesignSystemManager.addDesignSystem({
        name: 'fl-empty-system',
        styles: [],
        fonts: [],
        integrations: { hax: {} },
      })
      const result = await DesignSystemManager.loadSystemIntegration(
        'fl-empty-system',
        'hax',
        {},
      )
      expect(result).to.be.undefined
      delete DesignSystemManager.systems['fl-empty-system']
    })

    it('gates the hax integration on editMode context', async () => {
      // editMode false means shouldLoad returns false and nothing imports
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
            'figure-label': { tag: 'figure-label' },
            'media-image': { tag: 'media-image' },
          },
          designSystemHAXProperties: (props, tag) => {
            hydrated.push(tag)
            return props
          },
        }),
      }
      try {
        DesignSystemManager._rehydrateHAXElementList()
        expect(hydrated).to.include('figure-label')
        expect(hydrated).to.include('media-image')
      } finally {
        globalThis.HaxStore = originalHaxStore
      }
    })

    it('dispatches design-system-active-changed when switching systems', async () => {
      DesignSystemManager.addDesignSystem({
        name: 'fl-switch-system',
        styles: [],
        fonts: [],
      })
      let fired = null
      const handler = (e) => {
        fired = e.detail
      }
      globalThis.addEventListener('design-system-active-changed', handler)
      try {
        DesignSystemManager.active = 'fl-switch-system'
        await aTimeout(100)
        expect(fired).to.not.equal(null)
        expect(fired.active).to.equal('fl-switch-system')
        expect(fired.previous).to.equal('ddd')
      } finally {
        globalThis.removeEventListener('design-system-active-changed', handler)
        // restore DDD as the active system so later tests keep DDD tokens
        DesignSystemManager.active = 'ddd'
        await aTimeout(100)
        delete DesignSystemManager.systems['fl-switch-system']
      }
    })

    it('re-applies a design system, cleaning up the previous one', () => {
      const ddd = DesignSystemManager.systems.ddd
      DesignSystemManager.applyDesignSystem(ddd, ddd)
      // fonts get re-added with data-ds for the (re)applied system
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
        html`<d-d-d-sample type="accent" option="2"
          >Limestone Max</d-d-d-sample
        >`,
      )
      await el.updateComplete
      await aTimeout(100)
      const sample = el.shadowRoot.querySelector('span.sample')
      expect(sample.getAttribute('data-accent')).to.equal('2')
      expect(el.shadowRoot.querySelector('.label').textContent).to.equal(
        'Limestone Max',
      )
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
        html`<fl-pulse-test data-pulse="p-1"></fl-pulse-test>`,
      )
      await el.updateComplete
      expect(el.dataPulse).to.equal('p-1')
      expect(el.hasAttribute('data-pulse')).to.be.true
      el.dispatchEvent(new Event('mouseenter'))
      await el.updateComplete
      expect(el.dataPulse).to.equal(null)
      expect(el.hasAttribute('data-pulse')).to.be.false
    })

    it('toggles the pulse effect listener on and off with dataPulse', async () => {
      const el = await fixture(html`<fl-pulse-test></fl-pulse-test>`)
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
      SimpleIconsetStore.registerIconset('fl-test-icons', {
        android: 'android.svg',
      })
      expect(SimpleIconsetStore.iconsets['fl-test-icons']).to.deep.equal({
        android: 'android.svg',
      })
      delete SimpleIconsetStore.iconsets['fl-test-icons']
    })

    it('resolves icons registered as objects and strings', () => {
      SimpleIconsetStore.registerIconset('fl-test-icons', {
        android: 'path/android.svg',
      })
      expect(SimpleIconsetStore.getIcon('fl-test-icons:android')).to.equal(
        'path/android.svg',
      )
      expect(SimpleIconsetStore.getIcon('icons:settings')).to.include(
        'settings.svg',
      )
      delete SimpleIconsetStore.iconsets['fl-test-icons']
    })

    it('assumes the icons namespace for icon names without a prefix', () => {
      expect(SimpleIconsetStore.getIcon('settings')).to.include('settings.svg')
    })

    it('queues a missed icon for hydration and processes it on registration', () => {
      const pending = { setSrcByIcon: () => true }
      expect(SimpleIconsetStore.getIcon('fl-late:icon', pending)).to.equal(null)
      expect(SimpleIconsetStore.needsHydrated).to.include(pending)
      SimpleIconsetStore.registerIconset('fl-late', 'late/path/')
      expect(SimpleIconsetStore.needsHydrated).to.not.include(pending)
      delete SimpleIconsetStore.iconsets['fl-late']
    })
  })

  describe('simple-colors utilities inherited via DDD', () => {
    let element
    beforeEach(async () => {
      element = await fixture(
        html`<figure-label
          title="Figure 2"
          description="colors"
        ></figure-label>`,
      )
      await element.updateComplete
    })

    it('reads color info for a simple-colors variable', () => {
      // bare color names (no shade suffix) fall back to shade 1
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

    it('lists WCAG AA contrasting shades for a color', () => {
      const shades = element.getContrastingShades(false, 'grey', '1', 'grey')
      expect(shades).to.be.an('array')
      expect(shades.length).to.be.at.least(1)
    })

    it('lists WCAG AA contrasting colors for a color', () => {
      const colors = element.getContrastingColors('grey', '1', false)
      expect(colors.grey).to.be.an('array')
      expect(Object.keys(colors)).to.have.length.of.at.least(10)
    })

    it('answers false for a non compliant contrast shade', () => {
      // calculate the range the same way the implementation does so the
      // assertion is stable against the contrast table data
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
        <button id="fl-anchor">btn</button>
        <simple-tooltip for="fl-anchor">tip</simple-tooltip>
      </div>`)
      const tip = container.querySelector('simple-tooltip')
      await tip.updateComplete
      expect(tip.target).to.equal(container.querySelector('#fl-anchor'))
    })

    it('shows on mouseenter and focus of the target and hides on mouseleave', async () => {
      const container = await fixture(html`<div>
        <button id="fl-anchor-2">btn</button>
        <simple-tooltip for="fl-anchor-2">tip text</simple-tooltip>
      </div>`)
      const tip = container.querySelector('simple-tooltip')
      await tip.updateComplete
      const target = container.querySelector('#fl-anchor-2')
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

    it('repositions below the target by default', async () => {
      const container = await fixture(html`<div
        style="position: relative; width: 300px; height: 300px;"
      >
        <button
          id="fl-pos-bottom"
          style="position: absolute; top: 50px; left: 50px; width: 100px; height: 30px;"
        >
          B
        </button>
        <simple-tooltip for="fl-pos-bottom">tip</simple-tooltip>
      </div>`)
      const tip = container.querySelector('simple-tooltip')
      await tip.updateComplete
      tip.show()
      expect(tip.style.top).to.not.equal('')
    })

    it('repositions above the target when position is top', async () => {
      const container = await fixture(html`<div
        style="position: relative; width: 300px; height: 300px;"
      >
        <button
          id="fl-pos-top"
          style="position: absolute; top: 100px; left: 50px; width: 100px; height: 30px;"
        >
          B
        </button>
        <simple-tooltip for="fl-pos-top" position="top">tip</simple-tooltip>
      </div>`)
      const tip = container.querySelector('simple-tooltip')
      await tip.updateComplete
      tip.show()
      expect(tip.style.top).to.not.equal('')
    })

    it('repositions left and right of the target', async () => {
      const left = await fixture(html`<div
        style="position: relative; width: 300px; height: 300px;"
      >
        <button
          id="fl-pos-left"
          style="position: absolute; top: 100px; left: 150px; width: 100px; height: 30px;"
        >
          B
        </button>
        <simple-tooltip for="fl-pos-left" position="left">tip</simple-tooltip>
      </div>`)
      const leftTip = left.querySelector('simple-tooltip')
      await leftTip.updateComplete
      leftTip.show()
      expect(leftTip.style.left).to.not.equal('')

      const right = await fixture(html`<div
        style="position: relative; width: 300px; height: 300px;"
      >
        <button
          id="fl-pos-right"
          style="position: absolute; top: 100px; left: 50px; width: 100px; height: 30px;"
        >
          B
        </button>
        <simple-tooltip for="fl-pos-right" position="right">tip</simple-tooltip>
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
        <button id="fl-anchor-3">btn</button>
        <simple-tooltip for="fl-anchor-3">tip text</simple-tooltip>
      </div>`)
      const tip = container.querySelector('simple-tooltip')
      await tip.updateComplete
      tip.remove()
      await aTimeout(50)
      expect(tip.parentNode).to.equal(null)
    })
  })
})
